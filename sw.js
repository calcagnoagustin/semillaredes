// Service worker de Semilla — v4 (con avisos push)
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

// --- avisos push: cada aviso le llega solo al cliente que los activo ---
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { cuerpo: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.titulo || 'Semilla Redes', {
    body: d.cuerpo || '',
    icon: '/icono-192.png',
    badge: '/icono-192.png',
    tag: d.tag || 'semilla',
    renotify: true,
    data: { url: d.url || '/' }
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(cs => {
    for (const c of cs) { if (c.url.startsWith(url) && 'focus' in c) { c.postMessage('recargar'); return c.focus(); } }
    return self.clients.openWindow(url);
  }));
});
