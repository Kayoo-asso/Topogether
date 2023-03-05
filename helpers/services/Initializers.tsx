import { EffectCallback, useEffect } from "react";

const initializers: Array<() => void> = [];
let ran = false;

export function onBrowserLoad(effect: EffectCallback) {
	// `onBrowserLoad` may be called after initial useEffect, due to code splitting, lazy loading, etc...
	// If the first useEffect ran, we can just initialize immediately, we know we're in the browser
	if (ran) {
		effect()
	}
	initializers.push(effect);
}

export function Initializers() {
	useEffect(() => {
		ran = true;
		for(const fn of initializers) {
			fn()
		}

	}, []);
	return null;
}

// === PageCaching initalizer ===

onBrowserLoad(() => {
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
})

export async function cacheDocument(url: string | URL | null | undefined) {
	if (!url || !window.navigator.onLine) {
		return;
	}
	// Keep cache name in sync with sw.ts
	url = removeSearchParams(url);
	const cache = await caches.open("documents");
	const match = await cache.match(url, { ignoreSearch: true });
	if (!match) {
		return cache.add(url);
	}
}

function removeSearchParams(url: string | URL): string {
	return url.toString().split("?")[0];
}