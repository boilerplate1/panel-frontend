self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Skip API and external requests
  if (event.request.url.includes('/api/') || !event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    fetch(event.request).catch((error) => {
      // For navigation requests (like /login, /profile), return index.html to support SPA offline/reloads
      if (event.request.mode === 'navigate') {
        return caches.match('/') || fetch('/');
      }
      
      console.warn('[SW] Fetch failed:', event.request.url);
      return new Response('Network error occurred', { 
        status: 408, 
        statusText: 'Network error occurred' 
      });
    })
  );
});
