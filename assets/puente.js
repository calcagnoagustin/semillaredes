/* Botón "Volver" flotante para aguscalcagno.com y semillaredes.com.
   Solo aparece fuera del inicio, para que nadie quede encerrado en una sección. */
(function(){
  if(window.__puente||window.top!==window.self)return;window.__puente=1;
  var host=location.hostname,home;
  if(/(^|\.)aguscalcagno\.com$/.test(host))home='https://aguscalcagno.com/';
  else if(/(^|\.)semillaredes\.com$/.test(host))home='https://semillaredes.com/';
  else return;
  var path=location.pathname.replace(/\/index\.html$/,'/');
  if(path==='/')return;

  var st=document.createElement('style');
  st.textContent='#pt-fab{position:fixed;left:14px;bottom:16px;z-index:99999;display:inline-flex;align-items:center;gap:6px;background:#111C5A;color:#F4EFE5;border:0;border-radius:999px;padding:11px 16px 11px 12px;font:600 13.5px/1 Inter,system-ui,-apple-system,sans-serif;box-shadow:0 6px 20px rgba(17,28,90,.28);cursor:pointer;opacity:.94}'+
  '#pt-fab svg{width:16px;height:16px}#pt-fab:hover{background:#871C38;opacity:1}@media(max-width:640px){#pt-fab{left:10px;bottom:12px}}';
  document.head.appendChild(st);

  function volver(){
    var ref='';try{ref=document.referrer?new URL(document.referrer).hostname:'';}catch(x){}
    var nuestro=/(aguscalcagno\.com|semillaredes\.com|tiendup\.com|mercadopago|mercadolibre|paypal|calendly)/i.test(ref);
    if(history.length>1&&nuestro){history.back();return;}
    location.href=home;
  }
  function montar(){
    if(document.getElementById('pt-fab'))return;
    var f=document.createElement('button');f.id='pt-fab';f.type='button';f.setAttribute('aria-label','Volver');
    f.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>Volver';
    f.addEventListener('click',volver);document.body.appendChild(f);
  }
  if(document.body)montar();else document.addEventListener('DOMContentLoaded',montar);
})();
