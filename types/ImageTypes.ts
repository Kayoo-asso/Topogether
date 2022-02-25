import { NumberBetween } from "./Utils";

export const imageTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
] as const;

export type ImageType = typeof imageTypes[number];

export function isImageType(type: string): type is ImageType {
  for (const imgType of imageTypes) {
    if (type === imgType) {
      return true;
    }
  }
  return false;
}

export type ImageBeforeServer = {
  name: string,
  type: ImageType,
  size: NumberBetween<0, 10000000>,
  content: string | ArrayBuffer,
};

export type ImageAfterServer = {
  id: number,
  url: string,
};

export type ImageDimension = {
  width: number,
  height: number,
};
