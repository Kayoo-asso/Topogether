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


// registerRoute(tiles);
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
    ({ request, url, sameOrigin }) => {
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
);

// Google Maps tiles
const tileRegex = /^.*1i(\d*)!2i(\d*)!3i(\d*)!.*$/m

const tileCache = new CacheFirst({
    cacheName: 'tiles',
    plugins: [
        new ExpirationPlugin({
            maxEntries: 50,
            purgeOnQuotaError: true
        })
    ]
});

registerRoute(
    ({ url, request }) => {
        return url.hostname === 'maps.googleapis.com'
            && url.pathname === '/maps/vt'
            && request.destination === "image"
    },
    async (options) => {
        const match = options.url.href.match(tileRegex);
        if (match) {
            // First match is always the original string
            const [_, z, x, y] = match
            const cache = await caches.open('tile-download');
            const cachedResponse = await cache.match(tileUrl(+x, +y, +z))
            if (cachedResponse) {
                return cachedResponse;
            }
        }
        return tileCache.handle(options);
    }

)

// Just copied for now
function tileUrl(x: number, y: number, z: number): string {
    // fun fact: the API key is not required to actually get back an image
    return `https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i${z}!2i${x}!3i${y}!4i256!2m3!1e0!2sm!3i606336644!3m17!2sen-GB!3sUS!5e18!12m4!1e68!2m2!1sset!2sRoadmap!12m3!1e37!2m1!1ssmartmaps!12m4!1e26!2m2!1sstyles!2zcy50OjZ8cy5lOmd8cC5jOiNmZmU5ZTllOXxwLmw6MTcscy50OjV8cy5lOmd8cC5jOiNmZmY1ZjVmNXxwLmw6MjAscy50OjQ5fHMuZTpnLmZ8cC5jOiNmZmZmZmZmZnxwLmw6MTcscy50OjQ5fHMuZTpnLnN8cC5jOiNmZmZmZmZmZnxwLmw6Mjl8cC53OjAuMixzLnQ6NTB8cy5lOmd8cC5jOiNmZmZmZmZmZnxwLmw6MTgscy50OjUxfHMuZTpnfHAuYzojZmZmZmZmZmZ8cC5sOjE2LHMudDoyfHMuZTpnfHAuYzojZmZmNWY1ZjV8cC5sOjIxLHMudDo0MHxzLmU6Z3xwLmM6I2ZmZGVkZWRlfHAubDoyMSxzLmU6bC50LnN8cC52Om9ufHAuYzojZmZmZmZmZmZ8cC5sOjE2LHMuZTpsLnQuZnxwLnM6MzZ8cC5jOiNmZjMzMzMzM3xwLmw6NDAscy5lOmwuaXxwLnY6b2ZmLHMudDo0fHMuZTpnfHAuYzojZmZmMmYyZjJ8cC5sOjE5LHMudDoxfHMuZTpnLmZ8cC5jOiNmZmZlZmVmZXxwLmw6MjAscy50OjF8cy5lOmcuc3xwLmM6I2ZmZmVmZWZlfHAubDoxN3xwLnc6MS4y!4e0!5m1!5f2!23i1379903`
}