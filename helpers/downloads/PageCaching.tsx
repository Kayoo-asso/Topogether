import { useEffect } from "react";

function cacheDocument(url: string | URL | null | undefined) {
	if (!url || !window.navigator.onLine) {
		return;
	}
	// console.log("Caching url", url);
	// Keep in sync with sw.ts
	return caches
		.open("documents")
		.then((cache) => cache.add(url))
		.catch();
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
