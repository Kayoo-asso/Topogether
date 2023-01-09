import { Img, Topo, TopoData, UUID } from "types";
import { Semaphore } from "helpers/semaphore";
import {
	DEFAULT_EXTENT_BUFFER,
	getTopoExtent,
} from "helpers/map/getTopoExtent";
import { ProgressTracker, getProgressTracker } from "helpers/hooks";
import { get, set } from "idb-keyval";
import {
	CACHED_IMG_WIDTH,
	bunnyUrl,
	tileUrl,
	TOPO_CACHE_KEY,
} from "./sharedWithServiceWorker";
import { createXYZ } from "ol/tilegrid";
import { cacheDocument, onInit } from "./Initializers";
import { useEffect, useState } from "react";
import { encodeUUID } from "helpers/utils";

// TODO:
// - SharedWorker
// - proper sync of state with worker using TinyBase
// - also clear topo JSON + HTML when clearing cache

export interface TopoDownloadMessage {
	topo: TopoData;
}
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
	  }
	| {
			success: false;
	  };

let worker: SharedWorker | undefined;


// export function getWorker() {
// 	if (!worker) {
// 		worker = new SharedWorker(new URL("./download-worker.ts", import.meta.url));
// 	}
// 	return worker;
// }

// Hacks until we have a proper sync with TinyBase and a SharedWorker
export function useToposAvailableOffline(): Set<UUID> {
	const [availableOffline, setAvailableOffline] = useState(new Set(getToposAvailableOffline()))

	useEffect(() => {
		const update = () => setAvailableOffline(new Set(getToposAvailableOffline()));
		window.addEventListener("storage", update);
		return () => window.removeEventListener("storage", update);
	}, []);

	return availableOffline;
}
export function useIsAvailableOffline(topoId: UUID): boolean {
	const available = useToposAvailableOffline();
	return available.has(topoId);
}

export async function downloadTopo(
	topo: TopoData | Topo
): Promise<DownloadTopoResult> {
	const tracker = getProgressTracker(topo.id);
	const tileUrls = getTileUrls(topo);
	const imgUrls = getImageUrls(topo);
	const urls = [...tileUrls, ...imgUrls];
	tracker.start(urls.length);
	console.log(
		`Downloading ${tileUrls.length} tiles and ${imgUrls.length} images`
	);

	try {
		// Record cached entries as the first thing
		// That way, if anything after this fails, we can still clear the cache
		await setCachedEntries(topo, urls);
		// Also mark the topo as an incomplete download.
		// If everything is successful, this will be removed at the end.
		// In the meantime, this makes sure this topo will get registered for cleaning
		// if anything fails.
		markIncompleteDownload(topo.id);

		const start = Date.now();
		const cache = await caches.open(TOPO_CACHE_KEY);
		const lock = new Semaphore(MAX_CONCURRENT_REQUESTS);
		const promises: Promise<void>[] = [
			...urls.map((url) =>
				withExponentialBackoff(() => downloadUrl(url, cache, lock, tracker))
			),
			set(topo.id, topo),
			// Cache the page's HTML
			// This is important if the person has never opened the topo, downloads it,
			// navigates to the page while offline & then refreshes. In that case,
			// the app will ask for the HTML of /topo/[id], which we cache here.
			cacheDocument("/topo/" + encodeUUID(topo.id)),
		];

		const results = await Promise.allSettled(promises);
		const end = Date.now();
		console.log(
			`--- Finished downloading ${topo.name} in ${(end - start) / 1000}s (${
				tileUrls.length
			} tiles, ${imgUrls.length} images)`
		);
		// OK, the work is done, it's time to look for errors
		// We also need to keep track of which entries we actually managed to cache
		const cachedUrls: string[] = [];
		let error = false;
		// We skip the last 2 promises (= caching topo data + page HTML)
		for (let i = 0; i < results.length - 2; ++i) {
			const res = results[i];
			if(res.status === "fulfilled" && i < urls.length) {
				cachedUrls.push(urls[i]);
			} else {
				error = true;
			}
		}

		// Update list of cached entries, so we don't have to clear everything if only
		// a few downloads succeeded
		await setCachedEntries(topo, cachedUrls);

		if(error) {
			// 
			return { success: false }
		} else {
			// All is good!
			markSuccessfulDownload(topo.id);
			return { success: true, };
		}
	} catch {
		return {
			success: false,
		};
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
const INCOMPLETE_DOWNLOADS_KEY = "topogether-incomplete-downloads";

function cachedEntriesKey(id: UUID) {
	return id + "/cache-keys";
}

async function setCachedEntries(topo: TopoData | Topo, urls: string[]) {
	const key = cachedEntriesKey(topo.id);
	await set(key, urls);
}

async function clearCachedEntries(id: UUID) {
	const entriesKey = cachedEntriesKey(id);
	const entries = (await get(entriesKey)) as string[] | undefined;
	const cache = await caches.open(TOPO_CACHE_KEY);
	let hasErrors = false;
	if (entries && entries.length > 0) {
		const promises = entries.map((url) => cache.delete(url));
		const results = await Promise.allSettled(promises);
		const notDeleted: string[] = [];
		for (let i = 0; i < results.length; i++) {
			if (results[i].status === "rejected") {
				notDeleted.push(entries[i]);
			}
		}
		hasErrors = notDeleted.length > 0;
		const idbValue = hasErrors ? notDeleted : undefined;
		try {
			await set(entriesKey, idbValue);
		} catch {
			hasErrors = true;
		}
	}
	return hasErrors;
}

export function getToposAvailableOffline(): UUID[] {
	return JSON.parse(localStorage.getItem(OFFLINE_TOPOS_KEY) || "[]");
}

function markSuccessfulDownload(id: UUID) {
	const available = new Set(getToposAvailableOffline());
	const incompletes = new Set(getIncompleteDownloads());
	available.add(id);
	incompletes.delete(id);
	localStorage.setItem(
		OFFLINE_TOPOS_KEY,
		JSON.stringify(Array.from(available))
	);
	localStorage.setItem(
		INCOMPLETE_DOWNLOADS_KEY,
		JSON.stringify(Array.from(incompletes))
	);
}

export function isAvailableOffline(id: UUID): boolean {
	return new Set(getToposAvailableOffline()).has(id);
}


async function clearIncompleteDownloads() {
	const list = getIncompleteDownloads();
	const tasks = list.map((id) =>
		withExponentialBackoff(() => clearCachedEntries(id))
	);
	const results = await Promise.allSettled(tasks);
	const remaining = [];
	for (let i = 0; i < results.length; ++i) {
		if (results[i].status === "rejected") {
			remaining.push(list[i]);
		}
	}
	localStorage.setItem(INCOMPLETE_DOWNLOADS_KEY, JSON.stringify(remaining));
}

function getIncompleteDownloads(): Array<UUID> {
	return JSON.parse(localStorage.getItem(INCOMPLETE_DOWNLOADS_KEY) || "[]");
}

function markIncompleteDownload(id: UUID) {
	const incomplete = new Set(getIncompleteDownloads());
	const downloads = new Set(getToposAvailableOffline());
	incomplete.add(id);
	downloads.delete(id);
	localStorage.setItem(
		INCOMPLETE_DOWNLOADS_KEY,
		JSON.stringify(Array.from(incomplete))
	);
	localStorage.setItem(
		OFFLINE_TOPOS_KEY,
		JSON.stringify(Array.from(downloads))
	);
}


export function removeTopoFromCache(id: UUID) {
	// Worst case, we'll clean up later
	markIncompleteDownload(id);

	setTimeout(async () => {
		const cleared = await clearCachedEntries(id);
		if (cleared) {
			// The topo has already been removed from downloads
			// Now it has been fully cleared, so we can remove it from our lists altogether
			const incompletes = new Set(getIncompleteDownloads());
			incompletes.delete(id);
			localStorage.setItem(
				INCOMPLETE_DOWNLOADS_KEY,
				JSON.stringify(Array.from(incompletes))
			);
		}
	});
}

// Clear incomplete downloads after initialization
// Don't do it in the 5 seconds, to avoid competing with map loading etc...
onInit(() => {
	setTimeout(clearIncompleteDownloads, 5000);
});
