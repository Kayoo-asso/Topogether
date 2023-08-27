import type { UUID } from "~/types";

export const TOPO_CACHE_KEY = "topo-download";
export const CACHED_IMG_WIDTH = 2048;

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
export function tileUrl(x: number, y: number, z: number): string {
	return `https://api.mapbox.com/styles/v1/erwinkn/clbs8clin005514qrc9iueujg/tiles/512/${z}/${x}/${y}@2x?access_token=${MAPBOX_TOKEN}`;
}

export const VariantWidths = [
	16, 32, 64, 96, 128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048, 3840,
] as const;
type VariantWidth = (typeof VariantWidths)[number];

type VW<W extends number> = `${W}vw`;
type PX<W extends number> = `${W}px`;
type ViewportWidth = VW<number>;
type PixelWidth = PX<number>;

export type SourceSize = ViewportWidth | PixelWidth;

// All images have a `.jpg` suffix added to let Bunny CDN recognize they are images
// (even if they are originally a PNG)
// IMPORTANT: maintain in sync with service worker (see sw.ts)
export const bunnyUrl = (imageId: UUID, width: VariantWidth): string =>
	`https://topogether.b-cdn.net/${imageId}.jpg?width=${width}`;

export const bunnyLoader = ({
	src,
	width,
	quality,
}: {
	src: string;
	width: number;
	quality: number;
}) =>
	`https://topogether.b-cdn.net/${src}.jpg?width=${width}&quality=${quality}`;
