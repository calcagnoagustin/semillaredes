/* Semilla: landing de la Auditoría montada sobre la ficha de Tiendup (la carga Códigos personalizados de Tiendup). Se genera con herramientas/build_tiendup_auditoria.py desde auditoria-con-agus/fuente.html. */
(function(){
  if(location.pathname.indexOf('/s/auditoria-inicial-con-agus')!==0)return;
  var CSS=__CSS__, HTML=__HTML__;
  function ar(){try{var q=new URLSearchParams(location.search).get('moneda');if(q==='usd')return false;if(q==='ars')return true;return /Argentina|Buenos_Aires/i.test(Intl.DateTimeFormat().resolvedOptions().timeZone||'');}catch(e){return true}}
  function boton(cur){return document.querySelector('button[data-buy-product][data-currency="'+cur+'"]');}
  function comprar(cur){var b=boton(cur)||boton(cur==='ARS'?'USD':'ARS');
    try{if(window.fbq)fbq('trackCustom','AgendarAuditoria',{currency:cur});}catch(e){}
    if(b){b.click();}}
  function montar(){
    if(document.getElementById('aud-lp'))return;
    var pc=document.getElementById('page-content')||document.body;
    var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
    var w=document.createElement('div');w.innerHTML=HTML;var lp=w.firstElementChild;pc.insertBefore(lp,pc.firstChild);
    document.documentElement.classList.add('aud-lp');document.documentElement.classList.remove('aud-cargando');
    var local=ar()?'ARS':'USD', otra=local==='ARS'?'USD':'ARS';
    var o=lp.querySelector('[data-otra]');if(o)o.textContent=local==='ARS'?'¿Pagás desde otro país? Pagá en USD':'¿Estás en Argentina? Pagá en pesos';
    lp.addEventListener('click',function(e){var a=e.target.closest('[data-comprar]');if(!a)return;e.preventDefault();comprar(a.hasAttribute('data-otra')?otra:local);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();
  setTimeout(function(){document.documentElement.classList.remove('aud-cargando');},3500);
})();
