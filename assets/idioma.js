/* Semilla Redes · idioma automático de las webs de artistas.
   Mira el país del visitante (por IP) y muestra la web en su idioma: español, inglés, portugués, francés, italiano o alemán.
   Las traducciones las genera la VM (status_clientes/idiomas.py) en <carpeta>/i18n/<pagina>.<idioma>.json.
   Nunca traduce en modo edición (así el editor siempre guarda el texto original). */
(function () {
  var q = location.search;
  try { if (/[?&]editar=/.test(q) || sessionStorage.getItem('sr_editar')) return; } catch (e) { if (/[?&]editar=/.test(q)) return; }
  var NOMBRES = { es: 'Español', en: 'English', pt: 'Português', fr: 'Français', it: 'Italiano', de: 'Deutsch' };
  var HISP = 'AR UY CL PY BO PE EC CO VE MX GT HN SV NI CR PA CU DO PR ES GQ'.split(' ');
  var MAPA = { BR: 'pt', PT: 'pt', AO: 'pt', MZ: 'pt', CV: 'pt', FR: 'fr', BE: 'fr', LU: 'fr', MC: 'fr', SN: 'fr', CI: 'fr', CM: 'fr', MA: 'fr', TN: 'fr', DZ: 'fr',
              IT: 'it', SM: 'it', VA: 'it', DE: 'de', AT: 'de', CH: 'de', LI: 'de' };
  function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
  var dir = location.pathname.replace(/[^\/]*$/, '');
  var key = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/, '') || 'index';
  var base = dir + 'i18n/' + key + '.';
  var LK = 'sr_lang:' + dir;   // la elección manual vale solo para esta web, no para todo el dominio
  var elegido = ls(LK);
  var nav = (navigator.language || 'es').slice(0, 2).toLowerCase();

  // si probablemente no es español, ocultamos un instante para que no "parpadee" el texto original
  var guess = elegido || ls('sr_lang_auto') || (NOMBRES[nav] ? nav : 'en');
  var oculto = false;
  if (guess !== 'es') { oculto = true; document.documentElement.style.opacity = '0'; setTimeout(mostrar, 1500); }
  function mostrar() { if (oculto) { oculto = false; document.documentElement.style.transition = 'opacity .25s'; document.documentElement.style.opacity = ''; } }

  function decidir(cb) {
    if (elegido && NOMBRES[elegido]) return cb(elegido);
    fetch('https://vm.semillaredes.com/web/pais').then(function (r) { return r.json(); }).then(function (j) {
      var p = (j && j.pais || '').toUpperCase();
      var l = !p ? (NOMBRES[nav] ? nav : 'es') : HISP.indexOf(p) >= 0 ? 'es' : (MAPA[p] || 'en');
      ls('sr_lang_auto', l); cb(l);
    }).catch(function () { cb(NOMBRES[nav] ? nav : 'es'); });
  }

  var norm = function (s) { return String(s || '').replace(/\s+/g, ' ').trim(); };
  var ORIG = null;   // guardamos el original para poder volver a español sin recargar

  function aplicar(lang, T) {
    document.documentElement.lang = lang;
    var hechos = [];
    document.querySelectorAll('[data-e]').forEach(function (el) {
      if (el.tagName === 'IMG') return;
      if (!el.hasAttribute('data-sr-orig')) { el.setAttribute('data-sr-orig', el.innerHTML); el.setAttribute('data-sr-txt', norm(el.textContent)); }
      var k = el.getAttribute('data-sr-txt');
      var t = T && T.el && T.el[k];
      el.innerHTML = t || el.getAttribute('data-sr-orig');
      hechos.push(el);
    });
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null), n, L = [];
    while ((n = w.nextNode())) L.push(n);
    L.forEach(function (n) {
      var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(p.nodeName)) return;
      if (p.closest && (p.closest('[data-e]') || p.closest('#sr-idioma'))) return;
      if (n.__srOrig === undefined) n.__srOrig = n.nodeValue;
      var k = norm(n.__srOrig); if (!k) return;
      var t = T && T.tx && T.tx[k];
      n.nodeValue = t ? n.__srOrig.replace(k, t) : n.__srOrig;
    });
    document.querySelectorAll('[alt],[placeholder],[aria-label],[title]').forEach(function (el) {
      ['alt', 'placeholder', 'aria-label', 'title'].forEach(function (a) {
        if (!el.hasAttribute(a)) return;
        var o = el.getAttribute('data-sr-' + a); if (o === null) { o = el.getAttribute(a); el.setAttribute('data-sr-' + a, o); }
        var t = T && T.at && T.at[norm(o)]; el.setAttribute(a, t || o);
      });
    });
    if (!ORIG) ORIG = { title: document.title };
    document.title = (T && T.at && T.at[norm(ORIG.title)]) || ORIG.title;
  }

  function selector(actual, disponibles) {
    var old = document.getElementById('sr-idioma'); if (old) old.remove();
    var d = document.createElement('div'); d.id = 'sr-idioma';
    d.setAttribute('style', 'position:fixed;left:12px;bottom:12px;z-index:40;font:500 12px/1 system-ui,sans-serif;letter-spacing:.04em');
    var s = document.createElement('select'); s.setAttribute('aria-label', 'Idioma / Language');
    s.setAttribute('style', 'appearance:none;-webkit-appearance:none;border:1px solid rgba(128,128,128,.35);border-radius:999px;padding:7px 12px;background:rgba(255,255,255,.82);color:#222;backdrop-filter:blur(6px);cursor:pointer');
    disponibles.forEach(function (l) { var o = document.createElement('option'); o.value = l; o.textContent = NOMBRES[l]; if (l === actual) o.selected = true; s.appendChild(o); });
    s.onchange = function () { ls(LK, s.value); cargar(s.value, disponibles); };
    d.appendChild(s); document.body.appendChild(d);
  }

  var CACHE = {};
  function cargar(lang, disp) {
    if (lang === 'es') { aplicar('es', null); selector('es', disp); mostrar(); return; }
    var go = function (T) { aplicar(T ? lang : 'es', T); selector(T ? lang : 'es', disp); mostrar(); };
    if (CACHE[lang]) return go(CACHE[lang]);
    fetch(base + lang + '.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; })
      .then(function (T) { CACHE[lang] = T; go(T); }).catch(function () { go(null); });
  }

  function iniciar() {
    decidir(function (lang) {
      // idiomas disponibles: los que tengan archivo (se listan en i18n/<pagina>.idiomas.json)
      fetch(base + 'idiomas.json', { cache: 'no-cache' }).then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
        var disp = ['es'].concat((j && j.idiomas) || []);
        if (disp.indexOf(lang) < 0) lang = 'es';
        cargar(lang, disp);
      }).catch(function () { mostrar(); });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
})();
