import Compressor from "compressorjs";
import { Image, UUID, Result, Ratio } from "types";

// -- Exports for the API route --
export type ImageUploadResult = {
  images: Image[],
  errors: ImageUploadError[],
}

export const UploadCountHeader = "x-upload-count";

export type UploadInfo = {
    id: UUID,
    uploadURL: string
}

// export type BoulderImageUploadSuccess = ImageUploadSuccess & ImageDimensions;

export enum ImageUploadErrorReason {
  NonImage,
  // also includes errors from images that are too large to be compressed below target size
  CompressionError,
  UploadError
}

export interface ImageUploadError {
  filename: string,
  reason: ImageUploadErrorReason
}

type ImageDimensions = {
  width: number,
  height: number
}

export function isImage(file: File): boolean {
  const type = file.type;
  if (!type.startsWith("image/")) return false;

  let extension = type.substring(6);
  return extension === "png" || extension === "jpg" || extension === "png" || extension === "webp"
}

const CLOUDFLARE_MAX_SIZE = 10e6;

export class ImageService {

  async upload(file: File): Promise<Result<Image, ImageUploadErrorReason>> {
    const { images, errors } = await this.uploadMany([file]);
    if (images.length > 0) {
      return {
        type: "success",
        value: images[0],
      }
    } else {
      return {
        type: 'error',
        error: errors[0].reason
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
        errors.push({ filename: file.name, reason: ImageUploadErrorReason.NonImage }); 
      }

      else if (file.size > CLOUDFLARE_MAX_SIZE) {
        const promise = new Promise((resolve, _) => {
          new Compressor(file, {
            success(compressed: File) {
              if (compressed.size < CLOUDFLARE_MAX_SIZE) {
                toUpload.push(compressed);
              } else {
                errors.push({ filename: file.name, reason: ImageUploadErrorReason.CompressionError });
              }
              resolve(undefined);
            },
            error() {
              errors.push({ filename: file.name, reason: ImageUploadErrorReason.CompressionError });
              resolve(undefined);
            }
          })
        }); 
        compressing.push(promise);
      }

      else {
        toUpload.push(file);
      }
    }
    await Promise.all(compressing);

    if (toUpload.length === 0) {
      return {
        errors,
        images: []
      }
    }

    const getUploadUrls = await fetch("/api/images/uploadUrl", {
      method: "POST",
      headers: {
        [UploadCountHeader]: toUpload.length.toString()
      }
    });
    const { uploads } = await getUploadUrls.json() as { uploads?: UploadInfo[] };

    if (!getUploadUrls.ok || !uploads || uploads.length !== toUpload.length) {
      for (const notUploaded of toUpload) {
        errors.push({ filename: notUploaded.name, reason: ImageUploadErrorReason.UploadError });
      }
      return {
        errors,
        images: []
      }
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
        images.push(result);
      } else {
        errors.push(result);
      }
    }

    return {
      images,
      errors
    };
  }
}

const ratios: Ratio[] = ['16:9', '9:16', '4:3', '3:4', '1:1'];
const numericRatios = [16 / 9, 9 / 16, 4 / 3, 3 / 4, 1];

async function upload(file: File, info: UploadInfo): Promise<[Image, true] | [ImageUploadError, false]> {
  const data = new FormData();
  data.append("file", file);
  const uploadRequest = fetch(info.uploadURL, {
    method: "POST",
    body: data
  });
  const dimensionsRequest = imgDimensions(file);
  const [upload, { width, height }] = await Promise.all([uploadRequest, dimensionsRequest]);
  if (!upload.ok) {
    const error = {
      filename: file.name,
      reason: ImageUploadErrorReason.UploadError
    };
    return [error, false];
  }

  const r = width / height;
  let minDistance = Math.abs(numericRatios[0] - r);
  let ratioIndex = 0;
  for (let i = 1; i < numericRatios.length; i++) {
    const distance = Math.abs(numericRatios[i] - r);
    if (distance < minDistance) {
      minDistance = distance;
      ratioIndex = i;
    }
  }
  const ratio = ratios[ratioIndex];

  const img: Image = {
    id: info.id,
    ratio
  }
  return [img, true];
}

async function imgDimensions(file: File): Promise<ImageDimensions> {
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  const promise = new Promise<ImageDimensions>((resolve, _) => {
    img.onload = (event) => resolve({
      width: (event.target as HTMLImageElement).naturalWidth,
      height: (event.target as HTMLImageElement).naturalHeight
    })
  });
  img.src = objectUrl;
  return await promise;
}