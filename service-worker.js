const CACHE_NAME = "version-1";
const urlsToCache = [
    'index.html',
    'tata-logo.jpg',
    'tata-menu.jpg',
    '/',
    'https://airotiii.github.io/tata-cafe/',
    '/tata-cafe/'
];

// Install the service worker and open the cache and add files mentioned in array to cache
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Listens to request from application.
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {

                if (response) {
                    console.log(response);
                    // The requested file exists in cache so we return it from cache.
                    return response;
                }

                // The requested file is not present in cache so we send it forward to the internet
                return fetch(event.request);
            }
        )
    );
});


self.addEventListener('activate', function(event) {
    var cacheWhitelist = []; // add cache names which you do not want to delete
    cacheWhitelist.push(CACHE_NAME);
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Listens to request from application.
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {

                // You can remove this line if you don't want to load other files from cache anymore.
                if (response) return response;

                // If fetch fails, we return offline.html from cache.
                return fetch(event.request)
                    .catch(err => {
                        return caches.match('index.html');
                    })
            }
        )
    );
});

