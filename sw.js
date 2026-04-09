const CACHE_NAME = 'guaymallen-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/game.js',
  '/manifest.json',
  '/images/a_negro_migajas.png',
  '/images/negro/A_negro_envuelto1.png',
  '/images/negro/A_negro_envuelto2.png',
  '/images/negro/A_negro_completo.png',
  '/images/negro/A_negro_mordisco1.png',
  '/images/negro/A_negro_mordisco2.png',
  '/images/negro/A_negro_mordisco3.png',
  '/images/negro/A_negro_mordisco4.png',
  '/images/negro/A_negro_mordisco5.png',
  '/images/blanco/envuelto1.png',
  '/images/blanco/completo.png',
  '/images/blanco/mordisco1.png',
  '/images/blanco/mordisco2.png',
  '/images/blanco/mordisco3.png',
  '/images/blanco/mordisco4.png',
  '/images/blanco/mordisco5.png',
  '/images/caviar/envuelto1.png',
  '/images/caviar/envuelto2.png',
  '/images/caviar/completo.png',
  '/images/caviar/mordisco1.png',
  '/images/caviar/mordisco2.png',
  '/images/caviar/mordisco3.png',
  '/images/caviar/mordisco4.png'
];

// Instalación
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Activación
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - Cache first, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
