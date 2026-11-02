/* Semilla: reseñas de Google que van pasando solas.
   Uso: <div data-semilla-resenas></div>  (o data-semilla-resenas="mini" para la versión compacta)
        <script src="https://semillaredes.com/assets/resenas.js" defer></script>
   Colores opcionales por CSS: --rs-ink, --rs-accent, --rs-muted, --rs-card, --rs-serif */
(function(){
  var GOOGLE='https://www.google.com/maps/search/semillaredes+agencia+de+marketing';
  var NOTA='5,0', TOTAL=13;
  var R=[
    ['Mayra Dómine','Muy bueno lo que da Agus para artistas, me hizo ver mi proyecto desde otro lugar y al cambiar las perspectivas el proyecto artístico evoluciona y empecé a tener más claridad y obtener mejores resultados.'],
    ['Joaquín Bosisio','La formación ofrecida en Semilla Redes es una gran herramienta, una bajada a tierra para desarrollarnos como artistas en este nuevo mundo virtual. Me ayuda mucho aplicar el método Semilla para lograr un orden sistematizado y llevar adelante un negocio digital independiente.'],
    ['Verónica Bustos','Un espacio de alto valor para creadores y artistas. Agus comparte claridad y conocimiento con escucha y motivación.'],
    ['Betsy Grinblat','Muy profesionales. Agustín un capo y muy comprometido con cada proyecto.'],
    ['Carolina di Paola','Muy recomendable esta propuesta. Excelente la didáctica y generosidad de Agustín.'],
    ['María Laura Delgue','Si sos artista, Semillaredes es el mejor lugar: te soluciona las redes y sus cursos son amenos y divertidos.'],
    ['A N G E','Hace bastante que trabajo mi proyecto con Semillaredes y realmente es excelente. Lo recomiendo al 100%.'],
    ['Soledad Lazcano','Excelente. Mucha información específica para artistas y conocimiento del medio. Muy recomendable.'],
    ['Daniela Bermúdez','Excelente. Agustín sabe un montón y es muy generoso.'],
    ['Sandra Torres','Un espacio ideal para adquirir el conocimiento para artistas.']
  ];
  var CSS='[data-semilla-resenas]{--_ink:var(--rs-ink,#1A2456);--_acc:var(--rs-accent,#87863A);--_mut:var(--rs-muted,#5E5A52);--_card:var(--rs-card,#FBF8F2);--_serif:var(--rs-serif,"Playfair Display",Georgia,serif);display:block;color:var(--_ink)}'+
  '.rs-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin:18px 0;font-size:15px;color:var(--_mut)}'+
  '.rs-head b{font-family:var(--_serif);font-weight:900;font-size:34px;line-height:1;color:var(--_ink)}'+
  '.rs-st{color:#E2A93B;letter-spacing:3px;font-size:16px;line-height:1}'+
  '.rs-box{position:relative;background:var(--_card);border-radius:14px;padding:34px 38px 26px}'+
  '.rs-stage{display:grid}'+
  '.rs-sl{grid-area:1/1;opacity:0;visibility:hidden;transition:opacity .7s ease,visibility .7s}'+
  '.rs-sl.on{opacity:1;visibility:visible}'+
  '.rs-q{font-family:var(--_serif);font-style:italic;font-weight:600;font-size:clamp(20px,2.1vw,27px);line-height:1.42;color:var(--_ink);margin:0}'+
  '.rs-q:before{content:"\\201C"}.rs-q:after{content:"\\201D"}'+
  '.rs-who{display:flex;align-items:center;gap:12px;margin-top:20px}'+
  '.rs-av{width:44px;height:44px;border-radius:50%;background:var(--_ink);color:#fff;display:flex;align-items:center;justify-content:center;font-family:var(--_serif);font-weight:800;font-size:19px;flex:none}'+
  '.rs-who b{display:block;font-size:15px;line-height:20px;color:var(--_ink)}'+
  '.rs-who small{display:block;font-size:13px;line-height:18px;color:var(--_mut)}'+
  '.rs-foot{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:22px;flex-wrap:wrap}'+
  '.rs-dots{display:flex;gap:8px;align-items:center}'+
  '.rs-dots button{width:8px;height:8px;border-radius:50%;border:0;padding:0;background:currentColor;opacity:.22;cursor:pointer;color:var(--_ink)}'+
  '.rs-dots button.on{opacity:1;width:22px;border-radius:4px}'+
  '.rs-ver{font-size:14px;font-weight:600;color:var(--_ink);text-decoration:none;border-bottom:1.5px solid currentColor;padding-bottom:1px;white-space:nowrap}'+
  /* mini */
  '[data-semilla-resenas=mini] .rs-box{background:transparent;padding:0}'+
  '[data-semilla-resenas=mini] .rs-sl{display:grid;grid-template-columns:72px 1fr;column-gap:16px;align-items:center}'+
  '[data-semilla-resenas=mini] .rs-av{width:72px;height:72px;font-size:30px;background:#fff;color:var(--_ink);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,.06)}'+
  '[data-semilla-resenas=mini] .rs-q{font-family:inherit;font-style:normal;font-weight:400;font-size:12.5px;line-height:1.4}'+
  '[data-semilla-resenas=mini] .rs-mst{color:var(--_acc);letter-spacing:4px;margin:6px 0 4px;font-size:15px}'+
  '[data-semilla-resenas=mini] .rs-mwho{font-size:12.5px;color:var(--_mut)}[data-semilla-resenas=mini] .rs-mwho b{color:var(--_ink)}'+
  '[data-semilla-resenas=mini] .rs-foot{margin-top:10px}[data-semilla-resenas=mini] .rs-ver{font-size:12px}'+
  '@media (max-width:700px){.rs-box{padding:26px 22px 20px}}';
  function esc(t){return String(t).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function ini(n){return n.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ]/g,'').charAt(0).toUpperCase();}
  function montar(el){
    if(el.getAttribute('data-rs-ok'))return; el.setAttribute('data-rs-ok','1');
    var mini=el.getAttribute('data-semilla-resenas')==='mini', h='';
    if(!mini) h+='<div class="rs-head"><b>'+NOTA+'</b><span class="rs-st" aria-label="5 estrellas">★★★★★</span><span>'+TOTAL+' reseñas en Google</span></div>';
    h+='<div class="rs-box"><div class="rs-stage" aria-live="polite">';
    R.forEach(function(r,i){
      if(mini) h+='<div class="rs-sl'+(i?'':' on')+'"><div class="rs-av">'+ini(r[0])+'</div><div><p class="rs-q">'+esc(r[1])+'</p><div class="rs-mst">★★★★★</div><div class="rs-mwho"><b>'+esc(r[0])+'</b> &nbsp;Reseña en Google</div></div></div>';
      else h+='<div class="rs-sl'+(i?'':' on')+'"><p class="rs-q">'+esc(r[1])+'</p><div class="rs-who"><span class="rs-av">'+ini(r[0])+'</span><span><b>'+esc(r[0])+'</b><small>Reseña en Google · ★★★★★</small></span></div></div>';
    });
    h+='</div><div class="rs-foot"><div class="rs-dots">'+R.map(function(_,i){return '<button type="button" aria-label="Reseña '+(i+1)+'"'+(i?'':' class="on"')+'></button>';}).join('')+'</div><a class="rs-ver" href="'+GOOGLE+'" target="_blank" rel="noopener">Ver todas en Google →</a></div></div>';
    el.innerHTML=h;
    var sl=el.querySelectorAll('.rs-sl'), dt=el.querySelectorAll('.rs-dots button'), i=0, t=null, quieto=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    function ir(k){sl[i].classList.remove('on');dt[i].classList.remove('on');i=(k+sl.length)%sl.length;sl[i].classList.add('on');dt[i].classList.add('on');}
    function play(){if(quieto)return;clearInterval(t);t=setInterval(function(){ir(i+1);},6500);}
    function stop(){clearInterval(t);}
    Array.prototype.forEach.call(dt,function(b,k){b.addEventListener('click',function(){ir(k);play();});});
    el.addEventListener('mouseenter',stop);el.addEventListener('mouseleave',play);
    var x0=null; el.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;stop();},{passive:true});
    el.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)ir(i+(dx<0?1:-1));x0=null;play();});
    play();
  }
  function init(){
    if(!document.getElementById('rs-css')){var s=document.createElement('style');s.id='rs-css';s.textContent=CSS;document.head.appendChild(s);}
    Array.prototype.forEach.call(document.querySelectorAll('[data-semilla-resenas]'),montar);
  }
  window.SemillaResenas={montar:init};
  function vigilar(){init();if(!window.MutationObserver)return;var mo=new MutationObserver(function(){if(document.querySelector('[data-semilla-resenas]:not([data-rs-ok])'))init();});mo.observe(document.body,{childList:true,subtree:true});setTimeout(function(){mo.disconnect();},20000);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',vigilar);else vigilar();
})();
