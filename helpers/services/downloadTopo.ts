import { Img, Topo, TopoData, UUID } from "types";
import { Semaphore } from "helpers/semaphore";
import {
	DEFAULT_EXTENT_BUFFER,
	getTopoExtent,
} from "helpers/map/getTopoExtent";
import { ProgressTracker } from "helpers/hooks";
import { set } from "idb-keyval";
import { CACHED_IMG_WIDTH, bunnyUrl, tileUrl } from "./sharedWithServiceWorker";
import { createXYZ } from "ol/tilegrid";
import { useEffect } from "react";

// IMPORTANT: any changes to the tile or image URLS, as well as to the cached image width,
// MUST be reflected in the service worker (`sw.ts`)

// TODO:
// - Add error handling / retries

// Note: max zoom of 21 seems fine, which significantly reduces the nb of downloaded tiles
const MAX_ZOOM = 21;
// May need more teesting to ensure 1000 concurrent requests don't overload weaker devices
const MAX_CONCURRENT_REQUESTS = 1000;

export type DownloadTopoResult =
	| {
			success: true;
	  }
	| {
			success: false;
			globalError: boolean;
			imageErrors: number;
			tileErrors: number;
	  };

export async function downloadTopo(
	topo: TopoData | Topo,
	tracker: ProgressTracker
): Promise<DownloadTopoResult> {
	const tileUrls = getTileUrls(topo);
	const imgUrls = getImageUrls(topo);
	const urls = [...tileUrls, ...imgUrls];
	tracker.start(urls.length);
	console.log(
		`Downloading ${tileUrls.length} tiles and ${imgUrls.length} images`
	);

	const start = Date.now();
	const cache = await caches.open("topo-download");
	const lock = new Semaphore(MAX_CONCURRENT_REQUESTS);
	const promises: Promise<void>[] = [
		...urls.map((url) =>
			withExponentialBackoff(() => downloadUrl(url, cache, lock, tracker))
		),
		set(topo.id, topo),
	];

	const results = await Promise.allSettled(promises);
	const end = Date.now();
	console.log(
		`--- Finished downloading ${topo.name} in ${(end - start) / 1000}s (${
			tileUrls.length
		} tiles, ${imgUrls.length} images)`
	);
	let tileErrors = 0;
	let imageErrors = 0;
	let globalError = false;
	for(let i = 0 ; i < results.length - 1; ++i) {
		const res = results[i];
		if(res.status === "rejected") {
			if(i < tileUrls.length) {
				tileErrors++;
			} else {
				imageErrors++;
			}
		}
	}
	if(results[results.length - 1].status === "rejected") {
		globalError = true;
	}

	if(tileErrors === 0 && imageErrors === 0 && globalError === false) {
		return { success: true }
	} else {
		return {
			success: false,
			globalError,
			tileErrors,
			imageErrors
		}
	}
	// Check for a global error
}

async function downloadUrl(
	url: string | URL,
	cache: Cache,
	lock: Semaphore,
	tracker: ProgressTracker
) {
	const exists = await cache.match(url);
	if (!exists) {
		await lock.acquire();
		await cache.add(url);
		lock.release();
	}
	tracker.increment();
}

export function getTileUrls(topo: TopoData | Topo, maxZoom: number = MAX_ZOOM) {
	const extent = getTopoExtent(topo, DEFAULT_EXTENT_BUFFER);
	// Giving an extent to the TileGrid doesn't work with TileGrid.getFullTileRange()
	// (I don't know why)
	// So we're not giving an extent and computing tile coordinates manually
	const tileGrid = createXYZ({
		tileSize: 512,
	});
	console.log("tileGrid:", tileGrid);
	const tileUrls: Array<string> = [];
	for (let z = 0; z <= maxZoom; z++) {
		// NOTE: y-axis is reversed between map coordinates and tile coordinates
		// Input coords: minX and maxY
		// Output coords: minX and minY
		const [, minX, minY] = tileGrid.getTileCoordForCoordAndZ(
			[extent[0], extent[3]],
			z
		);
		// Input coords: maxX and minY
		// Output coords: maxX and maxY
		const [, maxX, maxY] = tileGrid.getTileCoordForCoordAndZ(
			[extent[2], extent[1]],
			z
		);

		for (let x = minX; x <= maxX; x++) {
			for (let y = minY; y <= maxY; y++) {
				tileUrls.push(tileUrl(x, y, z));
			}
		}
	}

	return tileUrls;
}

function getImageUrls(topo: TopoData | Topo): Array<string> {
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
	return images.map((img) => bunnyUrl(img.id, CACHED_IMG_WIDTH));
}

export function withExponentialBackoff<T>(
	fn: () => Promise<T>,
	maxRetries = 3,
	baseDelay = 500,
	factor = 2
): Promise<T> {
	return new Promise((resolve, reject) => {
		function attempt(retries: number) {
			fn()
				.then(resolve)
				.catch((error) => {
					if (retries === 0) {
						reject(error);
					} else {
						const delay = baseDelay * Math.pow(factor, maxRetries - retries);
						setTimeout(() => attempt(retries - 1), delay);
					}
				});
		}
		attempt(maxRetries);
	});
}
