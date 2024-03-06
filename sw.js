"use strict";

const cacheName = "offline-v1";
const contentToCache = [
    "/index.html",
    "/video.svg",
    "/script.js",
    "/"
];
self.addEventListener("install", event => {
    console.log("[Service Worker] Install");
    event.waitUntil(
        (async () => {
            const cache = await caches.open(cacheName);
            console.log("[Service Worker] Caching all: app shell and content");
            await cache.addAll(contentToCache);
        })(),
    );
});

self.addEventListener("fetch", event => {
    console.log(`[Service Worker] Fetched resource ${event.request.url}`);
    event.respondWith(
        (async () => {
            const response = await caches.match(event.request);
            console.log(`[Service Worker] Fetching resource: ${event.request.url}`);
            return response || await fetch(event.request);
        })(),
    );
});
