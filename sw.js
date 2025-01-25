const CACHE_NAME = "eight-queens";
const site = `https://mooreolith.github.io/eight-queens`;

const PRECACHE_ASSETS = [
  `${site}/`,
  `${site}/favicon.ico`,
  `${site}/index.html`,
  `${site}/styles.css`,
  `${site}/Board.png`,
  `${site}/Crown8.png`,
  `${site}/manifest.json`,
  `${site}/script.mjs`,
  `${site}/android-chrome-192x192.png`,
  `${site}/android-chrome-512x512.png`,
  `${site}/apple-touch-icon.png`,
  `${site}/favicon-16x16.png`,
  `${site}/favicon-32x32.png`,
  `${site}/sw.js`
]

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(PRECACHE_ASSETS);
  }))
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(event.request);

    if(cachedResponse !== undefined){
      return cachedResponse;
    }else{
      return fetch(event.request);
    }
  })
})