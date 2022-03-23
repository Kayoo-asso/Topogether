import Compressor from "compressorjs";
import { UUID } from "types";

export type ImageUploadResult = ImageUploadSuccess | ImageUploadError;
export type BoulderImageUploadResult = BoulderImageUploadSuccess | ImageUploadError;

export interface ImageUploadSuccess {
  type: 'success',
  id: UUID,
  path: string
}
export interface BoulderImageUploadSuccess extends ImageUploadSuccess {
  width: number,
  height: number,
}

export enum ImageUploadErrorReason {
  NonImage,
  // also includes errors from images that are too large to be compressed below target size
  CompressionError,
  UploadError
}

export interface ImageUploadError {
  type: 'error',
  reason: ImageUploadErrorReason
}

export type ImageUploadApiResponse = {
  id: UUID,
  path: string
}

const supportedImageTypes = ["jpg", "png", "webp"] as const;
export type ImageExtension = (typeof supportedImageTypes)[number];

export function imageExtension(mimeType: string): ImageExtension | null {
  if (!mimeType.startsWith("image/")) return null;

  let extension = mimeType.substring(6);
  if (extension === "jpeg") extension = "jpg";
  if (!supportedImageTypes.some(x => x === extension)) return null;
  return extension as ImageExtension;
}

const error = (reason: ImageUploadErrorReason): ImageUploadResult => ({ type: 'error', reason });

export class ImageService {
  // Max image size = 5MB after compression
  static MAX_IMAGE_SIZE = 5e6;

  async upload(file: Blob | File): Promise<ImageUploadResult> {
    // Preemptively check MIME type
    if (imageExtension(file.type) === null) {
      return error(ImageUploadErrorReason.NonImage);
    }

    // Try to compress large images
    if (file.size > ImageService.MAX_IMAGE_SIZE) {
      // have to wrap Compressor.js into a Promise
      const promise = new Promise<File | Blob>((resolve, reject) =>
        new Compressor(file, {
          success: resolve,
          error: reject
        })
      );
      try {
        file = await promise;
        // could not compress enough
        if (file.size > ImageService.MAX_IMAGE_SIZE) {
          return error(ImageUploadErrorReason.CompressionError);
        }
      } catch {
        return error(ImageUploadErrorReason.CompressionError);
      }
    }

    // Upload image through API
    console.log("Uploading image of type " + file.type, file);
    const response = await fetch("/api/images/upload", {
      method: "PUT",
      headers: {
        "Content-Type": file.type
      },
      body: file
    });

    // Check response
    if (response.ok) {
      const data = await response.json() as ImageUploadApiResponse;
      return {
        type: 'success',
        id: data.id,
        path: data.path
      };
    } else {
      return error(ImageUploadErrorReason.UploadError);
    }
  }

  async uploadMany(files: Iterable<File>): Promise<ImageUploadResult[]> {
    const array = Array.from(files);
    const promises = array.map(f => this.upload(f));
    const result = await Promise.all(promises);
    return result;
  }
}