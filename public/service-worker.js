
const CACHE_NAME = 'SchlenderCache';
const OFFLINE_NAME = 'offline.html';

const FILES_TO_CACHE = [
  '/favicon.png',
  '/offline.html',
  '/manifest.json',
];

// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // Precache static resources here.
  evt.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      }),
  );

  // eslint-disable-next-line no-restricted-globals
  self.skipWaiting();
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (evt) => {
  // Remove previous cached data from disk.
  evt.waitUntil(
    caches.keys().then((keyList) => Promise.all(keyList.map((key) => {
      if (key !== CACHE_NAME) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches.delete(key);
      }
    }))),
  );

  // eslint-disable-next-line no-restricted-globals
  self.clients.claim();
});

// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
// CODELAB: Add fetch event handler here.
  if (event.request.mode !== 'navigate') {
    // Not a page navigation, bail.
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => caches.open(CACHE_NAME)
        .then((cache) => cache.match(OFFLINE_NAME))),
  );
});
