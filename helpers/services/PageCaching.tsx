import { useEffect } from "react";

export async function cacheDocument(url: string | URL | null | undefined) {
	if (!url || !window.navigator.onLine) {
		return;
	}
	// Keep cache name in sync with sw.ts
	url = removeSearchParams(url);
	const cache = await caches.open("documents");
	const match = await cache.match(url, { ignoreSearch: true });
	if (!match) {
		console.log("Caching url", url);
		return cache.add(url);
	}
}

export function PageCaching() {
	// Adapted from next-pwa's cacheOnFrontEndNav
	// It's a terrible / brilliant hack
	useEffect(() => {
		const pushState = history.pushState;
		const replaceState = history.replaceState;
		history.pushState = (...args) => {
			pushState.apply(history, args);
			cacheDocument(args[2]);
		};
		history.replaceState = (...args) => {
			replaceState.apply(history, args);
			cacheDocument(args[2]);
		};
		const onOnline = () => {
			cacheDocument(window.location.pathname);
		};
		window.addEventListener("online", onOnline);

		return () => {
			history.pushState = pushState;
			history.replaceState = replaceState;
			window.removeEventListener("online", onOnline);
		};
	}, []);
	return null;
}

function removeSearchParams(url: string | URL): string {
	return url.toString().split("?")[0];
}
