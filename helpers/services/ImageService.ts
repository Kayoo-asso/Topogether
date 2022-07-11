import Compressor from "compressorjs";
import { cloudflareUrl } from "helpers/utils";
import { Image, UUID, Result, TopoData } from "types";
import { v4 as uuid } from "uuid";

// -- Exports for the API route --
export type ImageUploadResult = {
	images: Image[];
	errors: ImageUploadError[];
};

export const UploadCountHeader = "x-upload-count";

export type UploadInfo = {
	id: UUID;
	uploadURL: string;
};

// export type BoulderImageUploadSuccess = ImageUploadSuccess & ImageDimensions;

export enum ImageUploadErrorReason {
	NonImage,
	// also includes errors from images that are too large to be compressed below target size
	CompressionError,
	UploadError,
}

export interface ImageUploadError {
	filename: string;
	reason: ImageUploadErrorReason;
}

type ImageDimensions = {
	width: number;
	height: number;
};

enum ImageHolder {
	Topo,
	Boulder,
	Waypoint,
	Parking,
	Manager,
	TopoAccess,
}

type ImageToUpload = {
	id: UUID;
	holder: ImageHolder;
	topoId: UUID;
};

export function isImage(file: File): boolean {
	const type = file.type;
	if (!type.startsWith("image/")) return false;

	let extension = type.substring(6);
	return (
		extension === "png" ||
		extension === "jpg" ||
		extension === "jpeg" ||
		extension === "webp"
	);
}

function imageKey(id: UUID): Request {
	return new Request("/" + id);
}

const UPLOAD_MAX_SIZE = 4.5e6;

export class ImageService {
	async downloadTopoImages(topo: TopoData): Promise<void> {
		const promises: Promise<void>[] = [];
		if (topo.image) promises.push(this.download(topo.image));
		for (const boulder of topo.boulders) {
			for (const img of boulder.images) {
				promises.push(this.download(img));
			}
		}
		for (const waypoint of topo.waypoints) {
			if (waypoint.image) promises.push(this.download(waypoint.image));
		}
		for (const parking of topo.parkings) {
			if (parking.image) promises.push(this.download(parking.image));
		}
		for (const manager of topo.managers) {
			if (manager.image) promises.push(this.download(manager.image));
		}
		for (const access of topo.accesses) {
			if (access.steps) {
				for (const step of access.steps) {
					if (step.image) promises.push(this.download(step.image));
				}
			}
		}
		await Promise.all(promises);
	}

	// Always make sure this code is in sync with ImageService.save() and the service worker
	async download(image: Image): Promise<void> {
		const cache = await caches.open("images-download");
		// Key uses a URL of `current_domain/id`, to ensure we always get the same key from the same ID
		// Without the "/" here, the path would be relative to the current URL
		const key = imageKey(image.id);
		if (await cache.match(key)) return;
		const url = cloudflareUrl(image.id, 2048);
		const value = await fetch(url);
		await cache.put(key, value);
	}

	async save(blob: Blob): Promise<UUID> {
		const id = uuid();
		const key = imageKey(id);
		const value = new Response(blob, {
			headers: {
				// TODO: check that all our blobs are JPEGs
				"Content-Type": "image/jpeg",
			},
		});
		const cache = await caches.open("images-download");
		await cache.put(key, value);
		return id;
	}

	async upload(file: File): Promise<Result<Image, ImageUploadErrorReason>> {
		const { images, errors } = await this.uploadMany([file]);
		if (images.length > 0) {
			return {
				type: "success",
				value: images[0],
			};
		} else {
			return {
				type: "error",
				error: errors[0].reason,
			};
		}
	}

	async uploadMany(iter: Iterable<File>): Promise<ImageUploadResult> {
		const errors: ImageUploadError[] = [];
		const files = Array.from(iter);
		const compressing: Promise<unknown>[] = [];
		const toUpload: File[] = [];
		for (const file of files) {
			if (!isImage(file)) {
				errors.push({
					filename: file.name,
					reason: ImageUploadErrorReason.NonImage,
				});
			} else if (file.size > UPLOAD_MAX_SIZE) {
				const promise = new Promise((resolve, _) => {
					new Compressor(file, {
						success(compressed: File) {
							if (compressed.size < UPLOAD_MAX_SIZE) {
								toUpload.push(compressed);
							} else {
								errors.push({
									filename: file.name,
									reason: ImageUploadErrorReason.CompressionError,
								});
							}
							resolve(undefined);
						},
						error() {
							errors.push({
								filename: file.name,
								reason: ImageUploadErrorReason.CompressionError,
							});
							resolve(undefined);
						},
					});
				});
				compressing.push(promise);
			} else {
				toUpload.push(file);
			}
		}
		await Promise.all(compressing);

		if (toUpload.length === 0) {
			return {
				errors,
				images: [],
			};
		}

		const getUploadUrls = await fetch("/api/images/uploadUrl", {
			method: "POST",
			headers: {
				[UploadCountHeader]: toUpload.length.toString(),
			},
		});
		const { uploads } = (await getUploadUrls.json()) as {
			uploads?: UploadInfo[];
		};

		if (!getUploadUrls.ok || !uploads || uploads.length !== toUpload.length) {
			for (const notUploaded of toUpload) {
				errors.push({
					filename: notUploaded.name,
					reason: ImageUploadErrorReason.UploadError,
				});
			}
			return {
				errors,
				images: [],
			};
		}

		const uploading: Promise<[Image, true] | [ImageUploadError, false]>[] = [];
		for (let i = 0; i < toUpload.length; i++) {
			// dunno why TypeScript trips on the getDimensions argument here
			uploading.push(upload(toUpload[i], uploads[i]));
		}
		const afterUpload = await Promise.all(uploading);
		const images: Image[] = [];
		for (const [result, success] of afterUpload) {
			if (success) {
				images.push(result as Image);
			} else {
				errors.push(result as ImageUploadError);
			}
		}

		return {
			images,
			errors,
		};
	}
}

async function upload(
	file: File,
	info: UploadInfo
): Promise<[Image, true] | [ImageUploadError, false]> {
	const data = new FormData();
	const filename =
		process.env.NODE_ENV !== "production"
			? "dev_topogether_" + file.name
			: file.name;
	data.append("file", file, filename);
	const uploadRequest = fetch(info.uploadURL, {
		method: "POST",
		body: data,
	});
	const dimensionsRequest = imgDimensions(file);
	const [upload, { width, height }, [replicationResult, replicationSucceeded]] = await Promise.all([
		uploadRequest,
		dimensionsRequest,
		// NOTE: enable replication to Bunny CDN
		uploadBunny(file, info.id)
	]);
	if (!upload.ok || !replicationSucceeded) {
		const error = {
			filename: file.name,
			reason: ImageUploadErrorReason.UploadError,
		};
		return [error, false];
	}

	const ratio = width / height;

	const img: Image = {
		id: info.id,
		ratio,
		placeholder: (replicationResult as Image).placeholder
	};
	return [img, true];
}

async function uploadBunny(
	file: File,
	id: UUID
): Promise<[Image, true] | [ImageUploadError, false]> {
	const uploadRequest = fetch("/api/images/upload", {
		method: "PUT",
		headers: {
			"x-image-id": id,
		},
		body: file,
	}).then((x) => x.json());
	const dimensionsRequest = imgDimensions(file);
	try {
		const [{ placeholder }, { width, height }] = await Promise.all([
			uploadRequest,
			dimensionsRequest,
		]);
		const ratio = width / height;
		const img: Image = {
			id: id,
			ratio,
			placeholder,
		};
		console.log("Upload to Bunny CDN finished. Generated placeholder:", placeholder);
		return [img, true];
	} catch {
		const error = {
			filename: file.name,
			reason: ImageUploadErrorReason.UploadError,
		};
		return [error, false];
	}
}

async function imgDimensions(file: File): Promise<ImageDimensions> {
	const img = document.createElement("img");
	const objectUrl = URL.createObjectURL(file);
	const promise = new Promise<ImageDimensions>((resolve, _) => {
		img.onload = (event) =>
			resolve({
				width: (event.target as HTMLImageElement).naturalWidth,
				height: (event.target as HTMLImageElement).naturalHeight,
			});
	});
	img.src = objectUrl;
	return await promise;
}
