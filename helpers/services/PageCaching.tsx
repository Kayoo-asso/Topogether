import { useEffect } from "react";

async function cacheDocument(url: string | URL | null | undefined) {
	if (!url || !window.navigator.onLine) {
		return;
	}
	console.log("Caching url", url);
	url = removeSearchParams(url);
	// Keep cache name in sync with sw.ts
	const cache = await caches.open("documents")
	const match = await cache.match(url, {ignoreSearch: true})
	if(!match) {
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
	const obj = new URL(url);
	obj.search = "";
	return obj.href
}