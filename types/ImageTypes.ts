import { NumberBetween } from './NumberBetween';

export const imageTypes = [
  'image/png',
  'image/jpg',
  'image/jpeg',
] as const;

export type ImageTypeEnum = typeof imageTypes[number];

export function isImageType(type: string): type is ImageTypeEnum {
  return type in imageTypes;
}

export type ImageBeforeServerType = {
  name: string,
  type: ImageTypeEnum,
  size: NumberBetween<0, 10000000>,
  content: string | ArrayBuffer,
};

export type ImageAfterServerType = {
  id: number,
  url: string,
};

export type ImageDimensionType = {
  width: number,
  height: number,
};
