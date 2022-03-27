import { Breakpoint, Image } from "types";
import { Variants } from "./variants";

export const cloudflareUrl = (image: Image, breakpoint: Breakpoint): string =>
    `https://imagedelivery.net/9m8hQCHM9NXY8VKZ1mHt-A/${image.id}/${Variants[image.ratio][breakpoint]}`;
