
const Settings = {
    cacheName: 'svelteStatic',
    filesToCache: []
};


function precache() {
    console.log('[PWA][ServiceWorker] Install');

    return caches.open(Settings.cacheName).then(function(cache) {
        console.log('[PWA][ServiceWorker] Caching app files:', Settings.filesToCache.length);
        return cache.addAll(Settings.filesToCache);
    });
}


function activate() {
    console.log('[PWA][ServiceWorker] Activate');

    return caches.keys().then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
            if (key !== Settings.cacheName) {
                console.log('[PWA][ServiceWorker] Removing old cache:', key);
                caches.delete(key);
            }
        }));
    });
}


self.addEventListener('install', function(evt) {
    evt.waitUntil(precache());
});


self.addEventListener('activate', function(evt) {
    evt.waitUntil(activate());
    return self.clients.claim();
});


self.addEventListener('fetch', function(evt) {
    function saveToCache(request, response) {
        return caches.open(Settings.cacheName).then(function(cache) {
            console.log('[PWA][ServiceWorker] Add page to cache:', request.url);
            return cache.put(request, response);
        });
    };

    function getFromCache(request) {
        return caches.open(Settings.cacheName).then(function(cache) {
            return cache.match(request).then(function(matching) {
                const report = !matching || matching.status == 404 ? Promise.reject('no-match') : matching;
                return report;
            });
        });
    };

    if (evt.request.destination === 'image') {
        evt.respondWith(fetch(evt.request).then((res) => {
            saveToCache(evt.request, res.clone());
            return res;
        }).catch((err) => {
            console.log('[PWA][ServiceWorker] fetch error:', evt, err);
            return getFromCache(evt.request);
        }));
    } else {
        evt.respondWith(fetch(evt.request));
    }
});
