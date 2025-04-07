const cacheName = 'latin-quotes-cache-v1';
const staticAssets = [
    './',
    './index.html',
    './style.css',
    './script.js'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});