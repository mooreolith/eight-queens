const CACHE_NAME = "eight-queens";
const PRECACHE_ASSETS = [
  `../`,
  `../favicon.ico`,
  `../index.html`,
  `./styles.css`,
  `../img/Board.png`,
  `../img/Crown8.png`,
  `../manifest.json`,
  `./script.mjs`,
  `../icons/android-chrome-192x192.png`,
  `../icons/android-chrome-512x512.png`,
  `../icons/apple-touch-icon.png`,
  `../icons/favicon-16x16.png`,
  `../icons/favicon-32x32.png`,
  // `sw.js`
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(PRECACHE_ASSETS)
      .then(cache => cache.addAll(PRECACHE_ASSETS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [PRECACHE_ASSETS, CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
      })
      .then(cachesToDelete => {
        return Promise.all(cachesToDelete.map(cacheToDelete => {
          return caches.delete(cacheToDelete);
        }));
      })
      .then(() => self.clients.claim())
  );
});

// Thanks: https://googlechrome.github.io/samples/service-worker/basic/
self.addEventListener('fetch', event => {
  if(event.request.url.startsWith(self.location.origin)){
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if(cachedResponse){
          return cachedResponse;
        }

        return caches.open(CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            })
          })
        })
      })
    );
  }
})