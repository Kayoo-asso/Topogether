import { EffectCallback, useEffect } from "react";

const initializers: Array<EffectCallback> = [];
let ran = false;

export function onInit(effect: EffectCallback) {
	if (ran) {
		throw new Error(
			"onInit called after the Initializers useEffect has run. This is a bug in our codebase."
		);
	}
	initializers.push(effect);
}

export function Initializers() {
	useEffect(() => {
		ran = true;
		const cleanups = initializers.map((x) => x());
		return () => {
			for (const cleanup of cleanups) {
				cleanup && cleanup();
			}
		};
	}, []);
	return null;
}

// === PageCaching initalizer ===

onInit(() => {
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