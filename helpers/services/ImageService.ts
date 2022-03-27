import Compressor from "compressorjs";
import { UploadCountHeader, UploadInfo } from "pages/api/images/uploadUrl";
import { Result, UUID } from "types";

export type ImageUploadResult = {
  success: ImageUploadSuccess[],
  errors: ImageUploadError[],
}

export type BoulderImageUploadResult = {
  success: BoulderImageUploadSuccess[],
  errors: ImageUploadError[]
}

export interface ImageUploadSuccess {
  id: UUID,
}

type ImageDimensions = {
  width: number,
  height: number
}

export type BoulderImageUploadSuccess = ImageUploadSuccess & ImageDimensions;

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

export function isImage(file: File): boolean {
  const type = file.type;
  if (!type.startsWith("image/")) return false;

  let extension = type.substring(6);
  return extension === "png" || extension === "jpg" || extension === "png" || extension === "webp"
}

const CLOUDFLARE_MAX_SIZE = 10e6;

export class ImageService {

  async upload(file: File, getDimensions: false): Promise<Result<ImageUploadSuccess, ImageUploadError>>;
  async upload(file: File, getDimensions: true): Promise<Result<BoulderImageUploadSuccess, ImageUploadError>>;
  async upload(file: File, getDimensions: boolean): Promise<Result<ImageUploadSuccess | BoulderImageUploadSuccess, ImageUploadError>> {
    const { success, errors } = await this.uploadMany([file], getDimensions as any);
    if (success.length > 0) {
      return {
        type: "success",
        value: success[0],
      }
    } else {
      return {
        type: 'error',
        error: errors[0]
      };
    }
  }

  async uploadMany(files: Iterable<File>, getDimensions: false): Promise<ImageUploadResult>
  async uploadMany(files: Iterable<File>, getDimensions: true): Promise<BoulderImageUploadResult>
  async uploadMany(iter: Iterable<File>, getDimensions: boolean): Promise<ImageUploadResult | BoulderImageUploadResult> {
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
        success: []
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
        success: []
      }
    }

    const uploading: Promise<ImageUploadSuccess | BoulderImageUploadSuccess | ImageUploadError>[] = [];
    for (let i = 0; i < toUpload.length; i++) {
      // dunno why TypeScript trips on the getDimensions argument here
      uploading.push(upload(toUpload[i], uploads[i], getDimensions as any));
    }
    const afterUpload = await Promise.all(uploading);
    const success: (ImageUploadSuccess | BoulderImageUploadSuccess)[] = []; 
    for (const result of afterUpload) {
      if (isUploadError(result)) {
        errors.push(result);
      } else {
        success.push(result);
      }
    }

    return {
      success,
      errors
    };
  }
}

function isUploadError(result: ImageUploadSuccess | BoulderImageUploadSuccess | ImageUploadError): result is ImageUploadError {
  return (result as any).filename !== "undefined";
}

async function upload(file: File, info: UploadInfo, getDimensions: false): Promise<ImageUploadSuccess | ImageUploadError>;
async function upload(file: File, info: UploadInfo, getDimensions: true): Promise<BoulderImageUploadSuccess | ImageUploadError>;
async function upload(file: File, info: UploadInfo, getDimensions: boolean): Promise<ImageUploadSuccess | BoulderImageUploadSuccess | ImageUploadError> {
  const data = new FormData();
  data.append("file", file);
  const upload = await fetch(info.uploadURL, {
    method: "POST",
    body: data
  });
  if (!upload.ok) {
    return {
      filename: file.name,
      reason: ImageUploadErrorReason.UploadError
    };
  }

  if (getDimensions) {
    const dimensions = await imgDimensions(file);
    return {
      id: info.id,
      ...dimensions
    }
  } else {
    return {
      id: info.id
    }
  }
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