declare let self: ServiceWorkerGlobalScope;

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, Route } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

(self as any).__WB_DISABLE_DEV_LOGS = true;

cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Only cache scripts from the same origin for now
const scripts = new Route(({ request, sameOrigin }) => {
    return request.destination === "script" && sameOrigin;
}, new CacheFirst({
    cacheName: 'scripts',
    plugins: [
        // this should clear old entries over time
        new ExpirationPlugin({
            maxEntries: 50
        })
    ]
}));

const extScripts = new Route(({ request, sameOrigin }) => {
    return request.destination === "script" && !sameOrigin;
}, new StaleWhileRevalidate({
    cacheName: 'scripts',
    plugins: [
        // this should clear old entries over time
        new ExpirationPlugin({
            maxEntries: 50
        })
    ]
}));

const styles = new Route(({ request }) => {
  return request.destination === 'style';
}, new CacheFirst({
    cacheName: 'styles',
    plugins: [
        new ExpirationPlugin({
            maxEntries: 15
        })
    ]
}));

const tiles = new Route(({ url }) => {
    return url.hostname === 'maps.googleapis.com' && url.pathname === '/maps/vt' && !!url.searchParams.get('pb')
}, new CacheFirst({
    cacheName: 'tiles',
    plugins: [
        new ExpirationPlugin({
            maxEntries: 50,
            purgeOnQuotaError: true
        })
    ]
}));

const documents = new Route(({ request }) => {
    return request.destination === "document";
}, new NetworkFirst({
    cacheName: 'documents',
    networkTimeoutSeconds: 7,
    plugins: [
        new ExpirationPlugin({
            maxEntries: 30,
            purgeOnQuotaError: true
        })
    ]
}));

const nextDataRegex = /^\/_next\/data\/.*\.json/;
const nextData = new Route(({ url }) => {
    return nextDataRegex.test(url.pathname); 
}, new NetworkFirst({
    cacheName: 'next_data',
    networkTimeoutSeconds: 7,
    plugins: [
        new ExpirationPlugin({
            maxEntries: 30,
            purgeOnQuotaError: true
        })
    ]
}));


registerRoute(tiles);
registerRoute(nextData);
registerRoute(documents);
registerRoute(styles);
registerRoute(scripts);
registerRoute(extScripts);


const imageCache = new CacheFirst({
    cacheName: 'images',
    plugins: [
        new ExpirationPlugin({
            maxEntries: 100,
            purgeOnQuotaError: true
        })
    ]
});
registerRoute(
    async ({ request, url, sameOrigin }) => {
    return request.destination === "image" &&
        (sameOrigin || url.hostname === "imagedelivery.net" || url.hostname === "maps.gstatic.com")
    },
    async (options) => {
        const { url } = options;
        if (url.hostname === "imagedelivery.net") {
            // Expected: ["", ACCOUNT_ID, IMAGE_ID, VARIANT]
            const parts = url.pathname.split('/');
            if (parts.length === 4) {
                const id = parts[2];
                const local = await caches.open('local_images');
                const key = new Request(id);
                const response = await local.match(key);
                if (response) return response;
            }
        }

        return imageCache.handle(options);
    }
)