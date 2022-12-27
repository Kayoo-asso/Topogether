import Compressor from "compressorjs";
import { Img, UUID, Result, TopoData } from "types";
import { v4 as uuid } from "uuid";

// -- Exports for the API route --
export type ImageUploadResult = {
	images: Img[];
	errors: ImageUploadError[];
};

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

const UPLOAD_MAX_SIZE = 20e6;

export class ImageService {
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

	async upload(file: File): Promise<Result<Img, ImageUploadErrorReason>> {
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
		// Check for non-images / too large images before uploading
		for (const file of files) {
			// File type check
			if (!isImage(file)) {
				errors.push({
					filename: file.name,
					reason: ImageUploadErrorReason.NonImage,
				});
			} 
			// Size check
			else if (file.size > UPLOAD_MAX_SIZE) {
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

		const uploading: Promise<[Img, true] | [ImageUploadError, false]>[] = [];
		for (let i = 0; i < toUpload.length; i++) {
			uploading.push(uploadBunny(toUpload[i], uuid()));
		}
		const afterUpload = await Promise.all(uploading);
		const images: Img[] = [];
		for (const [result, success] of afterUpload) {
			if (success) {
				images.push(result as Img);
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

export async function uploadBunny(
	file: File,
	id: UUID
): Promise<[Img, true] | [ImageUploadError, false]> {
	const uploadRequest = fetch("https://fly-topogether.fly.dev/images/upload", {
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
		const img: Img = {
			id: id,
			ratio,
			placeholder,
		};
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
