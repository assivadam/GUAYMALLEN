const CACHE_NAME = 'guaymallen-v2';
const urlsToCache = [
    '/GUAYMALLEN/',
    '/GUAYMALLEN/index.html',
    '/GUAYMALLEN/style.css',
    '/GUAYMALLEN/game.js',
    '/GUAYMALLEN/manifest.json',
    '/GUAYMALLEN/images/a_negro_migajas.png',
    '/GUAYMALLEN/images/negro/A_negro_envuelto1.png',
    '/GUAYMALLEN/images/negro/A_negro_envuelto2.png',
    '/GUAYMALLEN/images/negro/A_negro_completo.png',
    '/GUAYMALLEN/images/negro/A_negro_mordisco1.png',
    '/GUAYMALLEN/images/negro/A_negro_mordisco2.png',
    '/GUAYMALLEN/images/negro/A_negro_mordisco3.png',
    '/GUAYMALLEN/images/negro/A_negro_mordisco4.png',
    '/GUAYMALLEN/images/negro/A_negro_mordisco5.png',
    '/GUAYMALLEN/images/blanco/envuelto1.png',
    '/GUAYMALLEN/images/blanco/completo.png',
    '/GUAYMALLEN/images/blanco/mordisco1.png',
    '/GUAYMALLEN/images/blanco/mordisco2.png',
    '/GUAYMALLEN/images/blanco/mordisco3.png',
    '/GUAYMALLEN/images/blanco/mordisco4.png',
    '/GUAYMALLEN/images/blanco/mordisco5.png',
    '/GUAYMALLEN/images/caviar/envuelto1.png',
    '/GUAYMALLEN/images/caviar/envuelto2.png',
    '/GUAYMALLEN/images/caviar/completo.png',
    '/GUAYMALLEN/images/caviar/mordisco1.png',
    '/GUAYMALLEN/images/caviar/mordisco2.png',
    '/GUAYMALLEN/images/caviar/mordisco3.png',
    '/GUAYMALLEN/images/caviar/mordisco4.png'
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
