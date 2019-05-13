// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const cacheName = 'selfieWithFame-v0.5';
const filesToCache = [
  '/',
  '/manifest.json',
  // '/static/js/0.chunk.js',
  // '/static/js/bundle.js',
  // '/static/js/main.chunk.js',
];

// Builds the full array of static urls to cache. the %FOO% is replaced with
// a JSON.stringify'd array of urls pulled from the generated asset-manifest.
// See: scripts/generate-sw.js.
// let STATIC_URLS = filesToCache;

// if (process.env.NODE_ENV !== 'development') { // production
const STATIC_URLS = filesToCache.concat(JSON.parse('%MANIFESTURLS%'));
// }

/**
 * installation event: it adds all the files to be cached
 */
self.addEventListener('install', function (e) {
  console.log('[ServiceWorker] Install');
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(STATIC_URLS);
    })
  );
});


/**
 * activation of service worker: it removes all cashed files if necessary
 */
self.addEventListener('activate', function (e) {
  console.log('[ServiceWorker] Activate');
  e.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (key !== cacheName) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  /*
   * Fixes a corner case in which the app wasn't returning the latest data.
   * You can reproduce the corner case by commenting out the line below and
   * then doing the following steps: 1) load app for first time so that the
   * initial New York City data is shown 2) press the refresh button on the
   * app 3) go offline 4) reload the app. You expect to see the newer NYC
   * data, but you actually see the initial data. This happens because the
   * service worker is not yet activated. The code below essentially lets
   * you activate the service worker faster.
   */
  return self.clients.claim();
});


self.addEventListener('fetch', function (event) {
  console.log('[Service Worker] Fetch', event.request.url);
  var dataUrl = '/api';
  //if the request is '/api', post to the server
  if (event.request.url.indexOf(dataUrl) > -1) {
    /*
     * When the request URL contains dataUrl, the app is asking for fresh
     * weather data. In this case, the service worker always goes to the
     * network and then caches the response. This is called the "Cache then
     * network" strategy:
     * https://jakearchibald.com/2014/offline-cookbook/#cache-then-network
     */
    console.log('[Service worker] Hitting the web')
    event.respondWith(fetch(event.request));
  } else {
    /*
     * The app is asking for app shell files. In this scenario the app uses the
     * "Cache, then if netowrk available, it will refresh the cache
     * see stale-while-revalidate at
     * https://jakearchibald.com/2014/offline-cookbook/#on-activate
     */
    console.log('[Service worker] Checking cache')
    event.respondWith(async function () {
      const cache = await caches.open('selfie-with-fame-store');
      const cachedResponse = await cache.match(event.request);
      const networkResponsePromise = fetch(event.request);

      event.waitUntil(async function () {
        const networkResponse = await networkResponsePromise;
        await cache.put(event.request, networkResponse.clone());
      }());

      // Returned the cached response if we have one, otherwise return the network response.
      return cachedResponse || networkResponsePromise;
    }());
  }
});
