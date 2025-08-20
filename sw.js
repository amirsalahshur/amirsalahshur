// Service Worker for Portfolio Website
// Enhanced caching and offline support

const CACHE_NAME = 'portfolio-v1.0.0';
const RUNTIME_CACHE = 'portfolio-runtime';

// Files to cache immediately
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/work.html',
  '/contact.html',
  '/styles/main.css',
  '/styles/variables.css',
  '/styles/base.css',
  '/styles/components/navigation.css',
  '/styles/components/buttons.css',
  '/styles/components/forms.css',
  '/styles/components/cards.css',
  '/styles/layout/grid.css',
  '/styles/utilities.css',
  '/styles/animations.css',
  '/js/main.js',
  '/js/i18n.js',
  '/js/language-selector.js',
  '/js/theme-manager.js',
  '/js/performance.js',
  '/js/translations/en.json',
  '/js/translations/ar.json',
  '/js/translations/de.json',
  '/js/translations/fa.json',
  '/js/translations/fr.json',
  '/js/translations/ru.json',
  '/js/translations/zh.json'
];

// Runtime caching patterns
const RUNTIME_CACHE_PATTERNS = [
  {
    urlPattern: /^https:\/\/fonts\.googleapis\.com/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-stylesheets',
      expiration: {
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      },
    },
  },
  {
    urlPattern: /^https:\/\/fonts\.gstatic\.com/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts-webfonts',
      expiration: {
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      },
    },
  },
  {
    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'images',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
      },
    },
  },
  {
    urlPattern: /\.(?:js|css)$/,
    handler: 'StaleWhileRevalidate',
    options: {
      cacheName: 'static-resources',
    },
  },
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker');
  
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[SW] Caching static resources');
        return cache.addAll(STATIC_CACHE_URLS.map(url => new Request(url, { cache: 'reload' })));
      }),
      self.skipWaiting()
    ])
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Fetch event - handle requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigate(request));
    return;
  }
  
  // Handle static resources
  event.respondWith(handleStaticResource(request));
});

// Handle navigation requests with network-first strategy
async function handleNavigate(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network failed for navigation, trying cache');
    
    // Fall back to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If not in cache, try to return index.html for SPA routing
    const indexResponse = await caches.match('/index.html');
    if (indexResponse) {
      return indexResponse;
    }
    
    // Last resort - return offline page
    return new Response(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Offline - Amir Salahshur</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 2rem;
            text-align: center;
            background: #f8f9fa;
            color: #333;
          }
          .container {
            max-width: 400px;
            margin: 2rem auto;
            padding: 2rem;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          h1 { color: #6366f1; margin-bottom: 1rem; }
          p { line-height: 1.6; margin-bottom: 1.5rem; }
          .btn {
            display: inline-block;
            padding: 0.75rem 1.5rem;
            background: #6366f1;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>You're Offline</h1>
          <p>It looks like you're not connected to the internet. Some content may not be available.</p>
          <a href="/" class="btn" onclick="location.reload()">Try Again</a>
          <a href="/index.html" class="btn">Go Home</a>
        </div>
      </body>
      </html>
    `, {
      status: 200,
      headers: { 'Content-Type': 'text/html' }
    });
  }
}

// Handle static resources with appropriate caching strategy
async function handleStaticResource(request) {
  const url = new URL(request.url);
  
  // Check if request matches any runtime cache pattern
  for (const pattern of RUNTIME_CACHE_PATTERNS) {
    if (pattern.urlPattern.test(request.url)) {
      return handleWithStrategy(request, pattern.handler, pattern.options);
    }
  }
  
  // Default strategy for uncategorized requests
  return handleWithStrategy(request, 'NetworkFirst');
}

// Handle requests with specified caching strategy
async function handleWithStrategy(request, strategy, options = {}) {
  const cacheName = options.cacheName || RUNTIME_CACHE;
  
  switch (strategy) {
    case 'CacheFirst':
      return cacheFirst(request, cacheName, options);
    case 'NetworkFirst':
      return networkFirst(request, cacheName, options);
    case 'StaleWhileRevalidate':
      return staleWhileRevalidate(request, cacheName, options);
    default:
      return fetch(request);
  }
}

// Cache First strategy
async function cacheFirst(request, cacheName, options) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache first failed:', error);
    throw error;
  }
}

// Network First strategy
async function networkFirst(request, cacheName, options) {
  const cache = await caches.open(cacheName);
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('[SW] Network first failed, trying cache');
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

// Stale While Revalidate strategy
async function staleWhileRevalidate(request, cacheName, options) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Start fetch in background
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.log('[SW] Background fetch failed:', error);
  });
  
  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }
  
  // Otherwise wait for network response
  return fetchPromise;
}

// Message handling for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urls = event.data.urls;
    event.waitUntil(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.addAll(urls);
      })
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Handle offline actions when connection is restored
      handleBackgroundSync()
    );
  }
});

async function handleBackgroundSync() {
  try {
    // Check if online
    const response = await fetch('/ping', { method: 'HEAD' });
    if (response.ok) {
      console.log('[SW] Connection restored, processing offline actions');
      // Process any queued offline actions here
    }
  } catch (error) {
    console.log('[SW] Still offline');
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/icon-192x192.png',
      badge: '/icon-72x72.png',
      tag: 'portfolio-notification',
      requireInteraction: false,
      actions: [
        {
          action: 'open',
          title: 'View Portfolio'
        },
        {
          action: 'close',
          title: 'Dismiss'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification('Amir Salahshur Portfolio', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Periodic background sync
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'portfolio-update') {
    event.waitUntil(
      // Check for updates periodically
      updateCache()
    );
  }
});

async function updateCache() {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    // Update critical resources
    const criticalUrls = ['/index.html', '/styles/main.css', '/js/main.js'];
    await Promise.all(
      criticalUrls.map(url => 
        fetch(url).then(response => {
          if (response.ok) {
            return cache.put(url, response);
          }
        }).catch(() => {
          // Ignore errors during background updates
        })
      )
    );
  } catch (error) {
    console.log('[SW] Background update failed:', error);
  }
}

// Error handling
self.addEventListener('error', (event) => {
  console.error('[SW] Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Unhandled promise rejection:', event.reason);
});

console.log('[SW] Service Worker script loaded');