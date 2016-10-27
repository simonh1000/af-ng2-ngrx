console.log('[ServiceWorker] sw.js - 1')

var CACHE_NAME = 'af-cache-v2';
var urlsToCache = [
  '',
  '/assets/restos-af2015.json',
];

self.addEventListener('install', function(event) {
  console.log('[ServiceWorker] install event');
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('[ServiceWorker] Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('activate', function(e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  return self.clients.claim();
});

// self.addEventListener('fetch', function(e) {
//   console.log('[ServiceWorker] Fetch', e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(function(response) {
//       return response || fetch(e.request);
//     })
//   );
// });


self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then( response => {
      if (response) {
        console.log('[ServiceWorker] Fetch', e.request.url, response);
        return response;
      }
      return fetch(e.request);
    })
  );
});


