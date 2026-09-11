// Service worker de Semilla IA
const CACHE = 'semilla-ia-v1';
const BASE = 'https://landing.semillaredes.com';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(
    ks.filter(k => k !== CACHE).map(k => caches.delete(k))
  )).then(() => self.clients.claim()));
});

// red primero, con respaldo en cache (para que ande sin internet)
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  e.respondWith(
    fetch(req).then(res => {
      const copia = res.clone();
      caches.open(CACHE).then(c => c.put(req, copia)).catch(()=>{});
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('/')))
  );
});
