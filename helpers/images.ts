import { UUID } from "types";

export const VariantWidths = [16, 32, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840] as const;
export type VariantWidth = typeof VariantWidths[number]

type VW<W extends number> = `${W}vw`;
type PX<W extends number> = `${W}px`;
export type ViewportWidth = VW<number>;
export type PixelWidth = PX<number>;

export type SourceSize = ViewportWidth | PixelWidth;

export const cloudflareUrl = (imageId: UUID, width: VariantWidth): string =>
    `https://imagedelivery.net/9m8hQCHM9NXY8VKZ1mHt-A/${imageId}/${width}w`;