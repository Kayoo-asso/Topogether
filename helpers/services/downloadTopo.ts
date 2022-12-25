import { Img, TopoData } from "types";
import { Semaphore } from "helpers/semaphore";
import { bunnyUrl } from "components";
import { getTopoBounds } from "helpers/map/getTopoBounds";
import { ProgressTracker } from "helpers/hooks";
import { set } from "idb-keyval";

// TODO:
// - Add error handling / retries

const TILE_SIZE = 256;
// Note: maybe max zoom of 21 is fine, which significantly reduces the nb of downloaded tiles
const MAX_ZOOM = 21;
const IMG_WIDTH = 2048;
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

export async function downloadTopo(topo: TopoData, progress: ProgressTracker) {
	const urls = [...getTileUrls(topo), ...getImageUrls(topo)];
	progress.start(urls.length);

	const start = Date.now();
	const cache = await caches.open("topo-download");
	const lock = new Semaphore(200);
	const promises: Promise<void>[] = [
		...urls.map((url) => downloadUrl(url, cache, lock, progress)),
		set(topo.id, topo),
	];

	await Promise.all(promises);
	const end = Date.now();
	console.log(
		`--- Finished downloading ${topo.name} in ${end - start}ms (${
			urls.length
		} URLs)`
	);
}

async function downloadUrl(
	url: string,
	cache: Cache,
	lock: Semaphore,
	progress: ProgressTracker
) {
	const exists = await cache.match(url);
	if (!exists) {
		await lock.acquire();
		await cache.add(url);
		lock.release();
	}
	progress.increment();
}

function tileUrl(x: number, y: number, z: number): string {
	return `https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/${z}/${x}/${y}@2x?access_token=${MAPBOX_TOKEN}`;
}

// Based on https://developers.google.com/maps/documentation/javascript/examples/map-coordinates
function worldCoords(lng: number, lat: number): [number, number] {
	let siny = Math.sin((lat * Math.PI) / 180);

	// Truncating to 0.9999 effectively limits latitude to 89.189. This is
	// about a third of a tile past the edge of the world tile.
	siny = Math.min(Math.max(siny, -0.9999), 0.9999);

	return [
		TILE_SIZE * (0.5 + lng / 360),
		TILE_SIZE * (0.5 - Math.log((1 + siny) / (1 - siny)) / (4 * Math.PI)),
	];
}

function findTileXY(
	lng: number,
	lat: number,
	zoom: number
): [x: number, y: number] {
	const [worldx, worldy] = worldCoords(lng, lat);

	const scale = 1 << zoom;

	const tilex = ((worldx * scale) / TILE_SIZE) | 0;
	const tiley = ((worldy * scale) / TILE_SIZE) | 0;

	return [tilex, tiley];
}

export function getTileUrls(topo: TopoData, maxZoom: number = MAX_ZOOM) {
	const bounds = getTopoBounds(topo);
	const tileUrls: Array<string> = [];
	for (let z = 0; z <= maxZoom; z++) {
		// The y-axis is flipped, the origin for (x,y) tiles coordinates is top-left
		let [xmin, ymax] = findTileXY(bounds[0], bounds[1], z);
		let [xmax, ymin] = findTileXY(bounds[2], bounds[3], z);
		console.log(
			`Corner tiles zoom ${z}: [${xmin}, ${ymax}], [${xmax}, ${ymin}]`
		);

		for (let x = xmin; x <= xmax; x++) {
			for (let y = ymin; y <= ymax; y++) {
				tileUrls.push(tileUrl(x, y, z));
			}
		}
	}

	return tileUrls;
}

function getImageUrls(topo: TopoData): Array<string> {
	const images: Array<Img> = [];
	if (topo.image) {
		images.push(topo.image);
	}
	for (const b of topo.boulders) {
		images.push(...b.images);
	}
	for (const p of topo.parkings) {
		if (p.image) {
			images.push(p.image);
		}
	}
	for (const w of topo.waypoints) {
		if (w.image) {
			images.push(w.image);
		}
	}
	for (const access of topo.accesses) {
		for (const step of access.steps) {
			if (step.image) {
				images.push(step.image);
			}
		}
	}
	for (const m of topo.managers) {
		if (m.image) {
			images.push(m.image);
		}
	}
	return images.map((img) => bunnyUrl(img.id, IMG_WIDTH));
}
