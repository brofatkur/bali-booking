// BaliPass PWA Service Worker v3 - Network-First for HTML & Same-Origin Only
const CACHE_NAME = 'balipass-cache-v3';
const STATIC_ASSETS = ['/manifest.json', '/vite.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Never intercept cross-origin requests (InsForge API, GlobalTix API, Unsplash images)
  if (url.origin !== self.location.origin) {
    return;
  }

  // Always use Network-First for HTML navigation & JS/CSS bundles so deployments never break
  if (
    event.request.mode === 'navigate' ||
    url.pathname === '/' ||
    url.pathname.endsWith('.html') ||
    url.pathname.startsWith('/assets/')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request) || caches.match('/'))
    );
    return;
  }

  // For static manifest/icons: network first, fallback to cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
