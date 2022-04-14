declare let self: ServiceWorkerGlobalScope;

import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute, Route } from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { CacheExpiration, ExpirationPlugin } from 'workbox-expiration';

(self as any).__WB_DISABLE_DEV_LOGS = true;

precacheAndRoute(self.__WB_MANIFEST);

// Should add some header information to requests
const images = new Route(({ request, sameOrigin, url }) => {
    return request.destination === "image";
    // return request.destination === "image" &&
    //     (sameOrigin || url.hostname === "imagedelivery.net")
}, new CacheFirst({
    cacheName: 'images',
    plugins: [
        new ExpirationPlugin({
            maxEntries: 100,
            purgeOnQuotaError: true
        })
    ]
}));

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

const tiles = new Route(({ request, url }) => {
    return url.hostname === 'map.googleapis.com' && url.pathname.startsWith('/maps') && !!url.searchParams.get('pb')
}, new StaleWhileRevalidate({
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


registerRoute(images);
registerRoute(scripts);
registerRoute(extScripts);
registerRoute(tiles);
registerRoute(documents);
registerRoute(styles);
registerRoute(nextData);