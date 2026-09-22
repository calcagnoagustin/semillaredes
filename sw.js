// Service worker de Semilla — v3
// Regla: el HTML y los datos SIEMPRE se piden a la red.
// El cache solo sirve de respaldo cuando no hay internet.
const CACHE = 'semilla-v4';

self.addEventListener('install', e => { self.skipWaiting(); });

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.map(k => caches.delete(k))))   // borra todo lo viejo
      .then(() => self.clients.claim())
      .then(() => self.clients.matchAll({type:'window'}).then(cs => cs.forEach(c => c.postMessage('recargar'))))
  );
});

self.addEventListener('message', e => { if (e.data === 'saltar') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const esHTML = req.mode === 'navigate' || (req.headers.get('accept')||'').includes('text/html');

  // HTML: red sí o sí, sin cachear respuesta vieja
  if (esHTML) {
    e.respondWith(
      fetch(req, { cache: 'no-store' })
        .then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(()=>{}); return res; })
        .catch(() => caches.match(req).then(r => r || caches.match('/')))
    );
    return;
  }
  // resto (iconos, fuentes): red primero, cache de respaldo
  e.respondWith(
    fetch(req).then(res => { const c = res.clone(); caches.open(CACHE).then(k => k.put(req, c)).catch(()=>{}); return res; })
      .catch(() => caches.match(req))
  );
});
