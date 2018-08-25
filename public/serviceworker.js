const CACHE_NAME = 'hello-world-cache-v1';
const urlsToCache = [
  '/',
  '/script/jquery.js',
  '/script/script.js',
  '/script/registering.serviceworker.js'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(e => console.log('Serviceworker install failed'))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || addFetchRequestToCaches(event);
      })
      .catch(e => console.log('Serviceworker fetch failed'))
  );
});

function addFetchRequestToCaches(event) {
  var fetchRequest = event.request.clone();

  return fetch(fetchRequest)
    .then((response) => {
      // Only caching valid response, if not valid then..
      if(!response ||
        response.status !== 200 ||
        response.type !== 'basic') return response;

      var responseToCache = response.clone();

      caches
        .open(CACHE_NAME)
        .then(function(cache) {
          cache.put(event.request, responseToCache);
        })
        .catch(e => console.log('Serviceworker responseToCache failed'));

      return response;
    })
    .catch(e => console.log('Serviceworker addFetchRequestToCaches failed'))
}
