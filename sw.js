const CACHE_NAME = 'impostor-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './impostor.css',
  './impostor.js',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Guardar en cache una copia de la respuesta (clon)
        return caches.open(CACHE_NAME).then((cache) => {
          try { cache.put(event.request, response.clone()); } catch (e) { /* skip if opaque */ }
          return response;
        });
      }).catch(() => {
        // Si falla la red y no está en cache, podemos devolver index.html como fallback para rutas SPA
        return caches.match('./index.html');
      });
    })
  );
});
