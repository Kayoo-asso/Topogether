import { Quark, quark } from "helpers/quarky";
import { get, set } from "idb-keyval";
import { Img, Topo, TopoData, UUID } from "types";
import {
	CACHED_IMG_WIDTH,
	TOPO_CACHE_KEY,
	bunnyUrl,
	tileUrl,
} from "../sharedWithServiceWorker";
import { encodeUUID, withExponentialBackoff } from "helpers/utils";
import { cacheDocument, onInit } from "helpers/services/Initializers";
import { createXYZ } from "ol/tilegrid";
import { Semaphore } from "helpers/downloads/semaphore";
import { DEFAULT_EXTENT_BUFFER, getTopoExtent } from "helpers/map/getExtent";

export type DownloadState =
	| {
			status: "none";
	  }
	| {
			status: "downloading";
			// Percentage between 0 and 1
			progress: number;
	  }
	| {
			status: "downloaded";
	  };

export type DownloadTopoResult =
	| {
			status: "success";
	  }
	| {
			status: "failure";
	  }
	| { status: "quotaExceeded" };

export interface GlobalDownloadState {
	downloading: boolean;
	ongoing: number;
	completed: number;
	progress: number;
}

interface DownloadTracker {
	quark: Quark<DownloadState>;
	count: number;
	total: number;
	abort: AbortController | null;
}

interface GlobalTracker {
	count: number;
	total: number;
	quark: Quark<GlobalDownloadState>;
}

const emptyGlobalState: GlobalDownloadState = {
	downloading: false,
	ongoing: 0,
	completed: 0,
	progress: 0,
};

const OFFLINE_TOPOS_KEY = "topogether-offline-topos";
const INCOMPLETE_DOWNLOADS_KEY = "topogether-incomplete-downloads";

function cachedEntriesKey(id: UUID) {
	return id + "/cache-keys";
}

// This code is crappy and should be deleted ASAP

class DownloadManager {
	private global: GlobalTracker = {
		count: 0,
		total: 0,
		quark: quark(emptyGlobalState),
	};

	private downloads: Map<string, DownloadTracker> = new Map();
	constructor() {
		// Clear incomplete downloads after initialization
		// Don't do it in the 5 seconds, to avoid competing with map loading etc...
		onInit(() => {
			const offlineTopos = getOfflineTopos();
			for (const id of offlineTopos) {
				this.downloads.set(id, {
					count: 0,
					total: 0,
					abort: null,
					quark: quark<DownloadState>({
						status: "downloaded",
					}),
				});
			}

			setTimeout(clearIncompleteDownloads, 5000);
		});
	}

	getState(id: UUID): DownloadState {
		return this.getTracker(id).quark();
	}

	getGlobalState(): GlobalDownloadState {
		return this.global.quark();
	}

	async cacheTopo(topo: TopoData) {
		const tileUrls = getTileUrls(topo);
		const imgUrls = getImageUrls(topo);
		const urls = [...tileUrls, ...imgUrls];
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
			markIncomplete(topo.id);

			const abort = new AbortController();
			// We have two more tasks, but they likely will complete way before all the downloads do
			this.start(topo.id, urls.length, abort);

			const start = Date.now();
			const cache = await caches.open(TOPO_CACHE_KEY);
			const promises: Promise<void>[] = [
				set(topo.id, topo),
				// Cache the page's HTML
				// This is important if the person has never opened the topo, downloads it,
				// navigates to the page while offline & then refreshes. In that case,
				// the app will ask for the HTML of /topo/[id], which we cache here.
				cacheDocument("/topo/" + encodeUUID(topo.id)),
				...urls.map((url) =>
					withExponentialBackoff(() =>
						this.downloadUrl(url, topo.id, abort.signal, cache)
					)
				),
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
			let error: "failure" | "quotaExceeded" | undefined = undefined;
			// We skip the last 2 promises (= caching topo data + page HTML)
			for (let i = 0; i < results.length - 2; ++i) {
				const res = results[i];
				if (res.status === "fulfilled" && i < urls.length) {
					cachedUrls.push(urls[i]);
				} else if (res.status === "rejected") {
					if (isQuotaExceededError(res.reason)) {
						error = "quotaExceeded";
					} else {
						error = "failure";
					}
				}
			}

			// Update list of cached entries, so we don't have to clear everything if only
			// a few downloads succeeded
			await setCachedEntries(topo, cachedUrls);

			if (error) {
				return { status: error };
			} else {
				// All is good!
				this.finish(topo.id);
				markSuccessful(topo.id);
				return { status: "success" };
			}
		} catch (e: any) {
			this.delete(topo.id);
			return {
				status: isQuotaExceededError(e) ? "quotaExceeded" : "failure",
			};
		}
	}

	async getOfflineToposList(): Promise<Array<TopoData>> {
		return Promise.all(
			getOfflineTopos().map(id => get(id) as Promise<TopoData>)
		);
	}


	delete(id: UUID) {
		// Immediately mark as incomplete
		// We'll clean up later with the auto schedule
		markIncomplete(id);

		// This means the download is currently ongoing
		const tracker = this.getTracker(id);
		if (tracker.abort) {
			tracker.abort.abort();
			tracker.abort = null;

			const global = this.global;
			const globalState = global.quark();
			// This was the last download
			if (globalState.completed + 1 === globalState.ongoing) {
				global.count = 0;
				global.total = 0;
				global.quark.set(emptyGlobalState);
			}
			// There are other ongoing downloads
			else {
				global.total -= tracker.total;
				global.count -= tracker.count;
				global.quark.set((prev) => ({
					downloading: true,
					completed: prev.completed,
					ongoing: prev.ongoing - 1,
					progress: computeProgress(global.count, global.total),
				}));
			}
		}
		tracker.count = 0;
		tracker.total = 0;
		tracker.quark.set({
			status: "none",
		});
	}

	private start(id: UUID, total: number, abort: AbortController) {
		const tracker = this.getTracker(id);
		tracker.count = 0;
		tracker.total = total;
		tracker.abort = abort;
		tracker.quark.set({
			status: "downloading",
			progress: 0,
		});
		const global = this.global;
		global.total += total;
		global.quark.set((prev) => ({
			downloading: true,
			completed: prev.completed,
			ongoing: prev.ongoing + 1,
			progress: computeProgress(global.count, global.total),
		}));
	}

	private increment(id: UUID) {
		const tracker = this.getTracker(id);
		tracker.count += 1;
		const progress = computeProgress(tracker.count, tracker.total);
		const currentState = tracker.quark();
		if (
			currentState.status !== "downloading" ||
			progress !== currentState.progress
		) {
			tracker.quark.set({
				status: "downloading",
				progress,
			});
		}
		const global = this.global;
		global.count += 1;
		const globalProgress = computeProgress(global.count, global.total);
		const currentGlobalState = global.quark();
		if (currentGlobalState.progress !== globalProgress) {
			global.quark.set((prev) => ({
				downloading: true,
				completed: prev.completed,
				ongoing: prev.ongoing,
				progress: globalProgress,
			}));
		}
	}

	private downloadUrl(
		url: string | URL,
		id: UUID,
		signal: AbortSignal,
		cache: Cache
	): Promise<void> {
		// Use callbacks instead of `await` syntax for a small performance boost
		return cache.match(url).then((exists) => {
			if (!exists && !signal.aborted) {
				return (
					LOCK.acquire()
						.then(() => cache.add(new Request(url, { signal })))
						.then(() => {
							!signal.aborted && this.increment(id);
						})
						// Always release the lock, even if the download fails or is aborted
						.finally(() => LOCK.release())
				);
			}
		});

		// const exists = await cache.match(url);
		// if (!exists) {
		// 	await LOCK.acquire();
		// 	await cache.add(url);
		// 	LOCK.release();
		// }
		// tracker.increment();
	}

	private finish(id: UUID) {
		const tracker = this.getTracker(id);
		// The download is currently ongoing (expected scenario)
		if (tracker.abort) {
			// No need to send an abort signal
			const global = this.global;
			const globalState = global.quark();
			// This was the last download
			if (globalState.completed + 1 === globalState.ongoing) {
				global.count = 0;
				global.total = 0;
				global.quark.set(emptyGlobalState);
			}
			// other downloads remain
			else {
				global.quark.set({
					...globalState,
					completed: globalState.completed + 1,
				});
			}
		}
		tracker.count = 0;
		tracker.total = 0;
		tracker.abort = null;
		tracker.quark.set({
			status: "downloaded",
		});
	}

	private getTracker(id: UUID): DownloadTracker {
		let tracker = this.downloads.get(id);
		if (!tracker) {
			tracker = {
				count: 0,
				total: 0,
				abort: null,
				quark: quark<DownloadState>({
					status: "none",
				}),
			};
			this.downloads.set(id, tracker);
		}
		return tracker;
	}
}

const computeProgress = (count: number, total: number) =>
	Math.floor((100 * count) / total) / 100;

function getOfflineTopos() {
	return JSON.parse(localStorage.getItem(OFFLINE_TOPOS_KEY) || "[]") as UUID[];
}

function setOfflineTopos(ids: Iterable<UUID>) {
	localStorage.setItem(OFFLINE_TOPOS_KEY, JSON.stringify(Array.from(ids)));
}

function markSuccessful(id: UUID) {
	const offlineTopos = new Set(getOfflineTopos());
	const incompleteDownloads = new Set(getIncompleteDownloads());
	offlineTopos.add(id);
	incompleteDownloads.delete(id);
	setOfflineTopos(offlineTopos);
	setIncompleteDownloads(incompleteDownloads);
}

function getIncompleteDownloads() {
	return JSON.parse(
		localStorage.getItem(INCOMPLETE_DOWNLOADS_KEY) || "[]"
	) as UUID[];
}

function setIncompleteDownloads(ids: Iterable<UUID>) {
	localStorage.setItem(
		INCOMPLETE_DOWNLOADS_KEY,
		JSON.stringify(Array.from(ids))
	);
}
function markIncomplete(id: UUID) {
	const offlineTopos = new Set(getOfflineTopos());
	const incompleteDownloads = new Set(getIncompleteDownloads());
	offlineTopos.delete(id);
	incompleteDownloads.add(id);
	setOfflineTopos(offlineTopos);
	setIncompleteDownloads(incompleteDownloads);
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
	setIncompleteDownloads(remaining);
}

export const downloads = new DownloadManager();

// === Download code below ===

// Note: max zoom of 21 seems fine, which significantly reduces the nb of downloaded tiles
const MAX_ZOOM = 21;
// 1000 max concurrent requests seems to work fine (1500 is too much)
// Needs more teesting to ensure 1000 concurrent requests don't overload weaker devices
const MAX_CONCURRENT_REQUESTS = 1000;
const LOCK = new Semaphore(MAX_CONCURRENT_REQUESTS);

function getTileUrls(topo: TopoData | Topo, maxZoom: number = MAX_ZOOM) {
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

// Source: https://mmazzarolo.com/blog/2022-06-25-local-storage-status/
function isQuotaExceededError(err: unknown): boolean {
	return (
		err instanceof DOMException &&
		// everything except Firefox
		(err.code === 22 ||
			// Firefox
			err.code === 1014 ||
			// test name field too, because code might not be present
			// everything except Firefox
			err.name === "QuotaExceededError" ||
			// Firefox
			err.name === "NS_ERROR_DOM_QUOTA_REACHED")
	);
}
