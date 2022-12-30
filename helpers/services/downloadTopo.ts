import { Img, Topo, TopoData, UUID } from "types";
import { Semaphore } from "helpers/semaphore";
import {
	DEFAULT_EXTENT_BUFFER,
	getTopoExtent,
} from "helpers/map/getTopoExtent";
import { ProgressTracker } from "helpers/hooks";
import { get, set } from "idb-keyval";
import { CACHED_IMG_WIDTH, bunnyUrl, tileUrl, TOPO_CACHE_KEY } from "./sharedWithServiceWorker";
import { createXYZ } from "ol/tilegrid";

// IMPORTANT: any changes to the tile or image URLS, as well as to the cached image width,
// MUST be reflected in the service worker (`sw.ts`)

// Note: max zoom of 21 seems fine, which significantly reduces the nb of downloaded tiles
const MAX_ZOOM = 21;
// 1000 max concurrent requests seems to work fine (1500 is too much)
// Needs more teesting to ensure 1000 concurrent requests don't overload weaker devices
const MAX_CONCURRENT_REQUESTS = 1000;

export type DownloadTopoResult =
	| {
			success: true;
			cachedUrls: string[]
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
	const cache = await caches.open(TOPO_CACHE_KEY);
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
	// OK, the work is done, it's time to look for errors
	// Three types of errors possible:
	// - a tile failed to download
	// - an image failed to download
	// - saving the topo to IndexedDB failed (= global error)
	// The first 2 categories may be OK if there are only a few errors,
	// but we can't do anything without the topo data.
	let tileErrors = 0;
	let imageErrors = 0;
	let globalError = false;
	// Oh, we also need to keep track of which entries we actually managed to cache
	const cachedUrls: string[] = [];
	// We skip the last promise, since it corresponds to the write to IndexedDB for the topo data
	for(let i = 0 ; i < results.length - 1; ++i) {
		const res = results[i];
		if(res.status === "rejected") {
			if(i < tileUrls.length) {
				tileErrors++;
			} else {
				imageErrors++;
			}
		} else {
			cachedUrls.push(urls[i])
		}
	}
	if(results[results.length - 1].status === "rejected") {
		globalError = true;
		// Do not delete just yet, in case the user attempts again
	} 

	// Keep track of cached entries, in case user wants to clear data
	await addCachedEntries(topo, cachedUrls);

	// Record the cached entries, in case the user asks to delete the data for this topo
	if(tileErrors === 0 && imageErrors === 0 && globalError === false) {
		await markAsAvailableOffline(topo);
		return { success: true, cachedUrls }
	} else {
		return {
			success: false,
			globalError,
			tileErrors,
			imageErrors
		}
	}
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

const OFFLINE_TOPOS_KEY = "topogether-offline-topos";

function cachedEntriesKey(id: UUID) {
	return id + "/cache-keys";
}

async function addCachedEntries(topo: TopoData | Topo, urls: string[]) {
	const key = cachedEntriesKey(topo.id);
	let current = new Set(await get(key) as string[] | undefined);

	for(let i = 0; i < urls.length; i++) {
		current.add(urls[i]);
	}
	await set(key, Array.from(current));
}

export function getToposAvailableOffline(): UUID[] {
	return JSON.parse(localStorage.getItem(OFFLINE_TOPOS_KEY) || "[]");
}

export function markAsAvailableOffline(topo: TopoData | Topo) {
	const available = new Set(getToposAvailableOffline());
	available.add(topo.id);
	localStorage.setItem(OFFLINE_TOPOS_KEY, JSON.stringify(Array.from(available)));
}

export function isAvailableOffline(id: UUID): boolean {
	return new Set(getToposAvailableOffline()).has(id);
}

export async function removeTopoFromCache(id: UUID): Promise<boolean> {
	const entriesKey = cachedEntriesKey(id);
	const entries = await get(entriesKey) as string[] | undefined;
	const cache = await caches.open(TOPO_CACHE_KEY)
	if(entries && entries.length > 0) {
		const promises = entries.map(url => cache.delete(url))
		const results = await Promise.allSettled(promises);
		const notDeleted: string[] = [];
		for(let i = 0; i < results.length; i++) {
			if(results[i].status === "rejected") {
				notDeleted.push(entries[i])
			}
		}
		const hasErrors = notDeleted.length > 0;
		const idbValue = hasErrors ? notDeleted : undefined;
		await set(entriesKey, idbValue);
		return hasErrors;
	}
	// no entries found
	return true;
}