import { UUID } from "./UUID";

export interface Image {
  id: UUID,
  url: string
  // TODO: width and height?
}

export const imageTypes = ["image/jpg", "image/jpeg", "image/png"] as const;
export type ImageType = typeof imageTypes[number];

export function isImageType(type: string): type is ImageType {
  for (const imageType of imageTypes) {
    if (type === imageType) {
      return true;
    }
  }
  return false;
}

export interface ImageDimensions {
  width: number,
  height: number
}