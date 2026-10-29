/* Puente de navegación Agus Calcagno <-> Semilla Redes.
   Barra fina arriba (con los dos sitios) + botón flotante "Volver".
   Se usa en aguscalcagno.com (Tiendup) y en las páginas públicas de semillaredes.com. */
(function(){
  if(window.__puente||window.top!==window.self)return;window.__puente=1;
  var SITES=[
    {k:'agus',n:'Agus Calcagno',u:'https://aguscalcagno.com/',h:/(^|\.)aguscalcagno\.com$/},
    {k:'semilla',n:'Semilla Redes',u:'https://semillaredes.com/',h:/(^|\.)semillaredes\.com$/}
  ];
  var host=location.hostname,here=null;
  SITES.forEach(function(s){if(s.h.test(host))here=s.k;});
  if(!here)return;
  var home=SITES.filter(function(s){return s.k===here;})[0].u;
  var APP=!!document.querySelector('script[src*="puente.js"][data-app]');
  var path=location.pathname.replace(/\/index\.html$/,'/');
  var esHome=path==='/';

  var css='#pt-bar{background:#111C5A;color:#F4EFE5;font:600 12.5px/1 Inter,system-ui,-apple-system,Segoe UI,sans-serif;letter-spacing:.02em;position:relative;z-index:99998}'+
  '#pt-bar .pt-in{max-width:1180px;margin:0 auto;padding:0 20px;height:36px;display:flex;align-items:center;gap:6px}'+
  '#pt-bar a{color:inherit;text-decoration:none!important;display:inline-flex;align-items:center;height:36px;padding:0 12px;opacity:.72;border-bottom:2px solid transparent;transition:opacity .15s}'+
  '#pt-bar a:hover{opacity:1}'+
  '#pt-bar a.on{opacity:1;border-bottom-color:#F6D8D4}'+
  '#pt-bar .pt-sp{flex:1}'+
  '#pt-bar .pt-vol{padding-left:0;margin-right:6px}'+
  '#pt-bar .pt-ext{font-weight:500;opacity:.6}'+
  '#pt-fab{position:fixed;left:14px;bottom:16px;z-index:99999;display:none;align-items:center;gap:6px;background:#111C5A;color:#F4EFE5;border:0;border-radius:999px;padding:11px 16px 11px 12px;font:600 13.5px/1 Inter,system-ui,-apple-system,sans-serif;box-shadow:0 6px 20px rgba(17,28,90,.28);cursor:pointer}'+
  '#pt-fab svg{width:16px;height:16px}'+
  '#pt-fab:hover{background:#871C38}'+
  '@media(max-width:640px){#pt-bar .pt-in{padding:0 8px}#pt-bar a{padding:0 9px;font-size:12px}#pt-bar .pt-ext{display:none}#pt-fab{left:10px;bottom:12px}}';
  var st=document.createElement('style');st.id='pt-css';st.textContent=css;document.head.appendChild(st);

  var CH='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>';

  function volver(e){
    if(e)e.preventDefault();
    var ref='';try{ref=document.referrer?new URL(document.referrer).hostname:'';}catch(x){}
    var nuestro=/(aguscalcagno\.com|semillaredes\.com|tiendup\.com|mercadopago|mercadolibre|paypal|calendly)/i.test(ref);
    if(history.length>1&&nuestro){history.back();return;}
    location.href=home;
  }

  function montarApp(){
    if(document.getElementById('pt-app'))return;
    var c2='#pt-app{position:fixed;left:12px;bottom:14px;z-index:99999;display:flex;gap:6px;align-items:flex-end;font:600 13px/1 Inter,system-ui,-apple-system,sans-serif}'+
    '#pt-app button,#pt-app a{background:#111C5A;color:#F4EFE5;border:0;border-radius:999px;padding:10px 14px;display:inline-flex;align-items:center;gap:5px;cursor:pointer;text-decoration:none;box-shadow:0 4px 16px rgba(17,28,90,.3);font:inherit;opacity:.92}'+
    '#pt-app button:hover,#pt-app a:hover{background:#871C38;opacity:1}'+
    '#pt-app svg{width:15px;height:15px}'+
    '#pt-app .pt-m{position:relative}#pt-app .pt-pop{display:none;position:absolute;left:0;bottom:46px;flex-direction:column;gap:6px;min-width:170px}'+
    '#pt-app .pt-pop.on{display:flex}#pt-app .pt-pop a{justify-content:space-between;border-radius:14px}#pt-app .pt-pop a.on{background:#871C38}';
    var st2=document.createElement('style');st2.textContent=c2;document.head.appendChild(st2);
    var d=document.createElement('div');d.id='pt-app';
    var h='';
    if(!esHome)h+='<button type="button" data-pt="vol" aria-label="Volver">'+CH+'Volver</button>';
    h+='<div class="pt-m"><div class="pt-pop">'+SITES.map(function(x){return '<a href="'+x.u+'"'+(x.k===here?' class="on"':'')+'>'+x.n+'</a>';}).join('')+'</div><button type="button" data-pt="menu" aria-label="Ir a otro sitio">Agus · Semilla</button></div>';
    d.innerHTML=h;document.body.appendChild(d);
    var v=d.querySelector('[data-pt=vol]');if(v)v.addEventListener('click',volver);
    var m=d.querySelector('[data-pt=menu]'),pop=d.querySelector('.pt-pop');
    m.addEventListener('click',function(e){e.stopPropagation();pop.classList.toggle('on');});
    document.addEventListener('click',function(){pop.classList.remove('on');});
  }
  function montar(){
    if(APP)return montarApp();
    if(document.getElementById('pt-bar'))return;
    var bar=document.createElement('div');bar.id='pt-bar';
    var h='<div class="pt-in">';
    if(!esHome)h+='<a href="'+home+'" class="pt-vol" data-pt="vol" aria-label="Volver">'+CH.replace('<svg','<svg width="14" height="14"')+'<span style="margin-left:4px">Volver</span></a>';
    SITES.forEach(function(s){h+='<a href="'+s.u+'"'+(s.k===here?' class="on" aria-current="true"':'')+'>'+s.n+'</a>';});
    h+='<span class="pt-sp"></span>';
    h+=here==='agus'?'<a class="pt-ext" href="https://semillaredes.com/formacion.html">Formación Semilla →</a>':'<a class="pt-ext" href="https://aguscalcagno.com/s/auditoria-inicial-con-agus">Auditoría con Agus →</a>';
    h+='</div>';
    bar.innerHTML=h;
    document.body.insertBefore(bar,document.body.firstChild);
    var v=bar.querySelector('[data-pt=vol]');if(v)v.addEventListener('click',volver);
    if(!esHome){
      var f=document.createElement('button');f.id='pt-fab';f.type='button';f.setAttribute('aria-label','Volver');f.innerHTML=CH+'Volver';
      f.addEventListener('click',volver);document.body.appendChild(f);
      var chk=function(){f.style.display=(window.scrollY>240)?'inline-flex':'none';};
      window.addEventListener('scroll',chk,{passive:true});chk();
    }
  }
  if(document.body)montar();else document.addEventListener('DOMContentLoaded',montar);
})();
