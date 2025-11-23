self.addEventListener('install', (event) => {
    console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
    // For now, just log fetch requests
    // You can later add caching logic here
    // event.respondWith(fetch(event.request));
});
