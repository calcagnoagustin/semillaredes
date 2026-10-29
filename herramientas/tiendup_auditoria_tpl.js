/* Semilla: landing de la Auditoría montada sobre la ficha de Tiendup (la carga Códigos personalizados de Tiendup). Se genera con herramientas/build_tiendup_auditoria.py desde auditoria-con-agus/fuente.html. */
(function(){
  if(location.pathname.indexOf('/s/auditoria-inicial-con-agus')!==0)return;
  var CSS=__CSS__, HTML=__HTML__;
  var FAVICON="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 44 44'%3E%3Cline x1='22' y1='22' x2='4' y2='22' stroke='%23C97080' stroke-width='1.5'/%3E%3Cline x1='22' y1='22' x2='40' y2='22' stroke='%23C97080' stroke-width='1.5'/%3E%3Cline x1='22' y1='22' x2='22' y2='4' stroke='%23C97080' stroke-width='1.5'/%3E%3Cline x1='22' y1='22' x2='22' y2='40' stroke='%23C97080' stroke-width='1.5'/%3E%3Cline x1='22' y1='22' x2='8' y2='8' stroke='%23C97080' stroke-width='1.5'/%3E%3Cline x1='22' y1='22' x2='36' y2='36' stroke='%23C97080' stroke-width='1.5'/%3E%3Cline x1='22' y1='22' x2='36' y2='8' stroke='%23C97080' stroke-width='1.5'/%3E%3Cline x1='22' y1='22' x2='8' y2='36' stroke='%23C97080' stroke-width='1.5'/%3E%3Cpath d='M22,10 C26,14 28,18 28,22 C28,26 26,30 22,34 C18,30 16,26 16,22 C16,18 18,14 22,10Z' fill='%237A8A42'/%3E%3Cline x1='22' y1='11' x2='22' y2='33' stroke='white' stroke-width='0.8' opacity='0.6'/%3E%3Cline x1='22' y1='16' x2='18' y2='19' stroke='white' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='22' y1='16' x2='26' y2='19' stroke='white' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='22' y1='22' x2='17' y2='23' stroke='white' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='22' y1='22' x2='27' y2='23' stroke='white' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='22' y1='27' x2='18' y2='29' stroke='white' stroke-width='0.5' opacity='0.5'/%3E%3Cline x1='22' y1='27' x2='26' y2='29' stroke='white' stroke-width='0.5' opacity='0.5'/%3E%3Ccircle cx='4' cy='22' r='2.5' fill='%23C97080'/%3E%3Ccircle cx='40' cy='22' r='2.5' fill='%23C97080'/%3E%3Ccircle cx='22' cy='4' r='2.5' fill='%23C97080'/%3E%3Ccircle cx='22' cy='40' r='2.5' fill='%23C97080'/%3E%3Ccircle cx='8' cy='8' r='2.5' fill='%23C97080'/%3E%3Ccircle cx='36' cy='36' r='2.5' fill='%23C97080'/%3E%3Ccircle cx='36' cy='8' r='2.5' fill='%23C97080'/%3E%3Ccircle cx='8' cy='36' r='2.5' fill='%23C97080'/%3E%3C/svg%3E";
  function favicon(){document.querySelectorAll('link[rel~="icon"],link[rel="shortcut icon"]').forEach(function(l){l.parentNode.removeChild(l);});var l=document.createElement('link');l.rel='icon';l.type='image/svg+xml';l.href=FAVICON;document.head.appendChild(l);}
  function ar(){try{var q=new URLSearchParams(location.search).get('moneda');if(q==='usd')return false;if(q==='ars')return true;return /Argentina|Buenos_Aires/i.test(Intl.DateTimeFormat().resolvedOptions().timeZone||'');}catch(e){return true}}
  function boton(cur){return document.querySelector('button[data-buy-product][data-currency="'+cur+'"]');}
  function comprar(cur){var b=boton(cur)||boton(cur==='ARS'?'USD':'ARS');
    try{if(window.fbq)fbq('trackCustom','AgendarAuditoria',{currency:cur});}catch(e){}
    if(b){b.click();}}
  function montar(){
    favicon();
    if(document.getElementById('aud-lp'))return;
    var pc=document.getElementById('page-content')||document.body;
    var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
    var w=document.createElement('div');w.innerHTML=HTML;var lp=w.firstElementChild;var hd=pc.firstElementChild;pc.insertBefore(lp,hd&&hd.classList.contains('uk-background-default')?hd.nextSibling:pc.firstChild);
    document.documentElement.classList.add('aud-lp');document.documentElement.classList.remove('aud-cargando');
    var local=ar()?'ARS':'USD', otra=local==='ARS'?'USD':'ARS';
    var o=lp.querySelector('[data-otra]');if(o)o.textContent=local==='ARS'?'¿Pagás desde otro país? Pagá en USD':'¿Estás en Argentina? Pagá en pesos';
    lp.addEventListener('click',function(e){var a=e.target.closest('[data-comprar]');if(!a)return;e.preventDefault();comprar(a.hasAttribute('data-otra')?otra:local);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',montar);else montar();
  setTimeout(function(){document.documentElement.classList.remove('aud-cargando');},3500);
})();
