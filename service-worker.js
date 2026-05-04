const CACHE_NAME = "tareas-cache";

const urlsToCache = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/manifest.json"
];

// INSTALAR
self.addEventListener("install", event => {
  self.skipWaiting(); // activa inmediatamente
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// ACTIVAR
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim()); // controla la app de una
});

// FETCH (NETWORK FIRST)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // actualizar cache automáticamente
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // si no hay internet, usa cache
        return caches.match(event.request);
      })
  );
});