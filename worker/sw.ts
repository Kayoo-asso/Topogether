declare let self: ServiceWorkerGlobalScope;

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute, Route } from "workbox-routing";
import {
	NetworkFirst,
	CacheFirst,
	StaleWhileRevalidate,
	NetworkOnly,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { tileUrl } from "helpers/services/sharedWithServiceWorker";

// TODO:
// - Redirect to home page if page is not cached
// - Cache pages on navigation, to avoid problems with offline refreshes
//   https://github.com/shadowwalker/next-pwa/blob/master/examples/cache-on-front-end-nav/worker/index.js

(self as any).__WB_DISABLE_DEV_LOGS = true;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Only cache scripts from the same origin for now
const scripts = new Route(
	({ request, sameOrigin }) => {
		return request.destination === "script" && sameOrigin;
	},
	new CacheFirst({
		cacheName: "scripts",
		plugins: [
			// this should clear old entries over time
			new ExpirationPlugin({
				maxEntries: 50,
			}),
		],
	})
);

const extScripts = new Route(
	({ request, sameOrigin }) => {
		return request.destination === "script" && !sameOrigin;
	},
	new StaleWhileRevalidate({
		cacheName: "ext-scripts",
		plugins: [
			// this should clear old entries over time
			new ExpirationPlugin({
				maxEntries: 50,
			}),
		],
	})
);

const styles = new Route(
	({ request }) => {
		return request.destination === "style";
	},
	new CacheFirst({
		cacheName: "styles",
		plugins: [
			new ExpirationPlugin({
				maxEntries: 15,
			}),
		],
	})
);

const documents = new Route(
	({ request }) => {
		return request.destination === "document";
	},
	new NetworkFirst({
		cacheName: "documents",
		networkTimeoutSeconds: 7,
		plugins: [
			new ExpirationPlugin({
				maxEntries: 30,
				purgeOnQuotaError: true,
			}),
		],
	})
);

const nextDataRegex = /^\/_next\/data\/.*\.json/;
const nextData = new Route(
	({ url }) => {
		return nextDataRegex.test(url.pathname);
	},
	new NetworkFirst({
		cacheName: "next_data",
		networkTimeoutSeconds: 7,
		plugins: [
			new ExpirationPlugin({
				maxEntries: 30,
				purgeOnQuotaError: true,
			}),
		],
	})
);

registerRoute(nextData);
registerRoute(documents);
registerRoute(styles);
registerRoute(scripts);
registerRoute(extScripts);

const imageCache = new CacheFirst({
	cacheName: "images",
	plugins: [
		new ExpirationPlugin({
			maxEntries: 10,
			purgeOnQuotaError: true,
		}),
	],
});

"https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/tiles/512/16/33606/23392@2x?access_token=pk.eyJ1IjoiZXJ3aW5rbiIsImEiOiJjbDM2NzdpNXcxa3RwM2pwOXZpZDg2bnppIn0.vGoRAqjK6jqpEtwHTs5Erg"

registerRoute(
	({ request, url }) => {
		return (
			request.destination === "image" &&
			url.hostname === "topogether.b-cdn.net"
		);
	},
	async (options) => {
		const { url } = options;
		// Pathname is of shape "/08f005e1-d68d-439c-74c8-129393e10b00.jpg?width=640"
		// Splitting on '.' gives us "/08f005e1-d68d-439c-74c8-129393e10b00" as the first item
		// We remove the leading slash using .substring()
		const id = url.pathname.split(".")[0].substring(1)
		const imageUrl = `https://topogether.b-cdn.net/${id}.jpg?width=${2048}`;
		const cache = await caches.open("topo-download");
		const response = await cache.match(imageUrl);
		if(response) {
			return response;
		} else {
			// Use regular cache
			return imageCache.handle(options)
		}
	}
);

// Mapbox tiles
const tileRegex = /tiles\/\d*\/(\d*)\/(\d*)\/(\d*)/m;

const tileCache = new CacheFirst({
	cacheName: "tiles",
	plugins: [
		new ExpirationPlugin({
			maxEntries: 50,
			purgeOnQuotaError: true,
		}),
	],
});

registerRoute(
	({ url, request }) => {
		return (
			url.hostname === "api.mapbox.com" &&
			url.href.match(tileRegex)
		);
	},
	async (options) => {
		const match = options.url.href.match(tileRegex);
		if (match) {
			// First match is always the original string
			const [_, z, x, y] = match;
			const cache = await caches.open("topo-download");
			const cachedResponse = await cache.match(tileUrl(+x, +y, +z));
			if (cachedResponse) {
				return cachedResponse;
			}
			console.log(`Returning tile NOT from cache [${z}, ${x}, ${y}]`)
		}
		return tileCache.handle(options);
	}
);