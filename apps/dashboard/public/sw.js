// PalliCare Patient PWA — Service Worker
const CACHE_NAME = 'pallicare-patient-v1';

// Pages to pre-cache for offline access
const PRECACHE_URLS = [
  '/patient',
  '/patient/log',
  '/patient/medications',
  '/patient/breathe',
  '/patient/learn',
  '/patient/journey',
  '/patient/messages',
  '/patient/settings',
];

// Install: pre-cache core patient pages
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback for patient pages
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache patient routes and static assets
  if (!url.pathname.startsWith('/patient') && !url.pathname.startsWith('/_next/static')) {
    return;
  }

  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;

          // Fallback to home page for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/patient');
          }

          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
