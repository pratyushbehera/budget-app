/* eslint-disable no-restricted-globals */

// This is a basic service worker based on Create React App's default.
// It will precache assets and provide offline capabilities.

const CACHE_NAME = 'budget-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/static/js/bundle.js',
  '/static/css/main.chunk.css',
  // Add other critical assets to cache here
  // e.g., icon files, manifest.json
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/maskable_icon.png',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
          return null;
        })
      );
    })
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    console.log('Service Worker: Background sync detected for sync-transactions');
    event.waitUntil(
      self.clients.matchAll({ includeUncontrolled: true, type: 'window' }).then(clients => {
        if (clients.length === 0) return; // No open window clients to notify
        // Send message to all open clients to trigger syncOfflineActions
        clients.forEach(client => client.postMessage({ type: 'BACKGROUND_SYNC', tag: 'sync-transactions' }));
      })
    );
  }
});
