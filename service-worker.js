// Nombre de la caché y lista de archivos a almacenar
const CACHE_NAME = "mi-pwa-cache-v1";
const URLS_TO_CACHE = [
  "index.html",
  "css/styles.css",
  "js/app.js",
  "images/user.png",
  "images/icon-192.png",
  "images/icon-512.png"
];

// Instalar Service Worker y cachear archivos
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Archivos cacheados ✅");
      return cache.addAll(URLS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activar Service Worker y limpiar cachés viejas
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("Eliminando caché vieja:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Interceptar peticiones y servir desde caché si no hay internet
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Devuelve desde caché o intenta descargar
      return response || fetch(event.request);
    })
  );
});
