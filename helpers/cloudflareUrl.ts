import { Breakpoint, Image } from "types";
import { Variants, VariantWidth } from "./variants";

export const cloudflareUrl = (image: Image, width: VariantWidth): string =>
    `https://imagedelivery.net/9m8hQCHM9NXY8VKZ1mHt-A/${image.id}/${width}w}`;
