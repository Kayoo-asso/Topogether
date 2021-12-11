import { NumberBetween } from "./numberBetween"

export const imageTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg'
] as const;

export type ImageType = typeof imageTypes[number];

export function isImageType(type: string): type is ImageType {
    return type in imageTypes;
}

export type ImageBeforeServer = {
    name: string,
    type: ImageType,
    size: NumberBetween<0, 10000000>,
    content: string,
}

export type Image = {
    id: number,
    url: string,
}
