# Genera /auditoria-agus/index.html a partir del diseño de la auditoría (auditoria-con-agus/fuente.html)
# Flujo: 1) eligen horario en nuestro calendario (horarios libres de Calendly)  2) nombre+email  3) pagan en MP (15 min); con el pago se crea el turno en Calendly
# Backend: función auditoria-pago en Supabase. Correr: python3 _build.py
import re, pathlib
aqui = pathlib.Path(__file__).parent
src = (aqui.parent / "auditoria-con-agus" / "fuente.html").read_text(encoding="utf-8")
TU = "https://aguscalcagno.com/s/auditoria-inicial-con-agus"

s = src
s = s.replace('https://semillaredes.com/auditoria-con-agus/', 'https://semillaredes.com/auditoria-agus/')
s = s.replace('<meta name="theme-color" content="#F8F0E2"/>', '<meta name="theme-color" content="#F8F0E2"/>\n<meta name="robots" content="noindex"/>')
s = s.replace("fbq('track','ViewContent',{content_name:'Auditoría con Agus',content_type:'product',value:45,currency:'USD'});",
              "fbq('track','ViewContent',{content_name:'Auditoría con Agus',content_type:'product',value:60000,currency:'ARS'});")
s = s.replace('<div class="alt">USD 45</div>', '<div class="alt" id="pg-alt">Elegís tu horario y pagás con Mercado Pago</div>')
s = s.replace('<div class="monto">$60.000 <small>ARS</small></div>', '<div class="monto" id="pg-monto">$60.000 <small>ARS</small></div>')
s = s.replace(f'href="{TU}"', 'href="#pagar" data-pagar')
s = s.replace('WhatsApp</a>\n      </aside>',
  f'WhatsApp</a>\n        <a class="usd" id="pg-cambiar" href="{TU}">¿Estás fuera de Argentina? Pagá USD 45 con PayPal</a>\n      </aside>')
s = s.replace('<p>Podés abonar en pesos o dólares.</p>',
  '<p id="pg-faq">En pesos con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta. Desde el exterior, USD 45 con PayPal.</p>')
# cómo funciona: el turno se confirma con el pago
s = s.replace('<b>Reservás tu sesión</b><span>Elegí el día y horario que mejor te quede.</span>',
              '<b>Elegís horario y pagás</b><span>El turno queda confirmado cuando se acredita el pago.</span>')

css = """
.dias{display:flex;gap:8px;overflow-x:auto;padding:4px 2px 10px;position:relative;min-height:84px}
.dia{flex:none;border:1.5px solid var(--line);background:#fff;border-radius:12px;padding:8px 12px;text-align:center;cursor:pointer;font:inherit;color:var(--navy);min-width:74px}
.dia small{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}
.dia b{display:block;font-size:20px;line-height:1.1}
.dia.on{background:var(--navy);border-color:var(--navy);color:#fff}.dia.on small{color:#D9DBEA}
.horas{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px;margin-top:6px}
.hora{border:1.5px solid var(--red);color:var(--red);background:#fff;border-radius:10px;padding:11px 6px;font:inherit;font-weight:700;cursor:pointer}
.hora:hover{background:var(--red);color:#fff}
.elegido{font-weight:800;color:var(--navy);font-size:16px;margin:2px 0 8px;text-transform:capitalize}
.volver{background:none;border:0;color:var(--muted);font:inherit;font-size:13px;cursor:pointer;padding:0;margin-bottom:6px}

.usd{display:block;text-align:center;font-size:11.5px;color:var(--muted);text-decoration:underline;margin-top:4px}
.aviso{background:var(--rose-bg);color:var(--navy);border-radius:12px;padding:12px 16px;font-size:14px;margin:14px auto 0;max-width:1000px;display:none}
.modal{position:fixed;inset:0;z-index:-1;background:rgba(22,33,90,.5);display:flex;align-items:flex-start;justify-content:center;padding:14px;overflow-y:auto;opacity:0;pointer-events:none;transition:opacity .15s}
.modal.on{opacity:1;z-index:100;pointer-events:auto}
.modal:not(.on) *{pointer-events:none!important}
.caja{background:#fff;border-radius:18px;max-width:420px;width:100%;padding:24px 22px 20px;box-shadow:0 20px 60px rgba(0,0,0,.2);position:relative;margin:auto 0}
.caja.ancha{max-width:760px;padding:20px 16px 14px}
.caja h2{font-size:25px;font-weight:900;margin-bottom:4px}
.caja .p{font-size:14px;color:var(--muted);margin-bottom:12px}
.caja label{display:block;font-size:12px;font-weight:700;color:var(--navy);margin:10px 0 5px}
.caja input{width:100%;font:inherit;font-size:16px;padding:12px 14px;border:1.5px solid var(--line);border-radius:10px;background:var(--paper)}
.caja input:focus{outline:none;border-color:var(--navy)}
.caja .btn{width:100%;margin-top:16px}
.caja .btn[disabled]{opacity:.6;cursor:wait}
.caja .err{color:var(--red-dark);font-size:13px;margin-top:10px;min-height:1em}
.caja .x{position:absolute;right:12px;top:8px;background:none;border:0;font-size:28px;line-height:1;color:var(--muted);cursor:pointer}
.pasitos{display:flex;gap:6px;margin:0 0 14px;font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}
.pasitos span{flex:1;text-align:center;padding:7px 4px;border-radius:999px;background:var(--paper);color:#9A96A2}
.pasitos span.on{background:var(--navy);color:#fff}
.pasitos span.ok{background:var(--olive-soft);color:var(--navy)}
.regla{background:#FFF4D6;border:2px solid #E9B949;color:#4A3A0A;border-radius:12px;padding:12px 14px;font-size:14px;line-height:1.4;margin:6px 0 12px}
.regla b{color:#2B2000}
.cal{min-width:280px;height:640px;border-radius:12px;overflow:hidden;border:1px solid var(--line)}
.paso3{text-align:center}
.paso3 .big{font-family:'Playfair Display',serif;font-size:28px;font-weight:900;color:var(--navy);line-height:1.1;margin:6px 0 10px}
.paso3 .big span{color:var(--red)}
.paso3 .btn{font-size:17px;padding:16px 22px}\n.reloj{font-family:'Inter',sans-serif;font-variant-numeric:tabular-nums;font-size:44px;font-weight:800;color:var(--red);margin:4px 0 10px}\n.reloj.fin{font-size:18px}
.oculto{display:none!important}\n.cal{position:relative}\n.cargando-cal{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--muted);z-index:0}\n.cal .calendly-inline-widget,.cal iframe{position:relative;z-index:1;background:#fff}
@media (max-width:600px){.cal{height:600px}.caja.ancha{padding:16px 10px 10px}}
"""
s = s.replace("</style>", css + "</style>", 1)
s = s.replace('<link rel="preconnect" href="https://fonts.googleapis.com"/>', '<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link rel="preconnect" href="https://fdrxsjphlvvwwknnrjtx.supabase.co"/>', 1)

REGLA = '<div class="regla"><b>Importante: el turno se confirma recién cuando pagás.</b> Después de elegir el horario tenés <b>15 minutos</b> para pagar. Si no pagás, el horario se libera para otra persona.</div>'

modal = f"""
<div class="modal" id="pagar" role="dialog" aria-modal="true" aria-labelledby="pg-t">
  <div class="caja" id="pg-caja">
    <button type="button" class="x" aria-label="Cerrar" data-cerrar>&times;</button>
    <div class="pasitos"><span id="ps1" class="on">1 · Horario</span><span id="ps2">2 · Tus datos</span><span id="ps3">3 · Pago</span></div>

    <div id="pg-1">
      <h2 id="pg-t">Elegí día y horario</h2>
      <p class="p"><span id="pg-tzt">Horarios de Argentina.</span> Sesión de 1 hora por Zoom.</p>
      <div class="dias" id="pg-dias"><div class="cargando-cal">Cargando horarios…</div></div>
      <div class="horas" id="pg-horas"></div>
      <p class="p sin oculto" id="pg-sin">No hay horarios libres en estos días. Escribime por <a href="https://wa.me/5492665242011?text=Hola%20Agus%2C%20quiero%20una%20auditor%C3%ADa%20y%20no%20encuentro%20horario" target="_blank" rel="noopener" style="text-decoration:underline">WhatsApp</a> y lo coordinamos.</p>
    </div>

    <form id="pg-2" class="oculto" novalidate>
      <button type="button" class="volver" data-volver>← Cambiar horario</button>
      <h2>Tus datos</h2>
      <p class="elegido" id="pg-elegido"></p>
      {REGLA}
      <label for="pg-n">Nombre y apellido</label>
      <input id="pg-n" name="nombre" autocomplete="name" required maxlength="80"/>
      <label for="pg-e">Email (ahí te llega la invitación con el Zoom)</label>
      <input id="pg-e" name="email" type="email" autocomplete="email" inputmode="email" required maxlength="120"/>
      <label for="pg-w">WhatsApp (te mandamos la confirmación y un recordatorio)</label>
      <input id="pg-w" name="telefono" type="tel" autocomplete="tel" inputmode="tel" required maxlength="25" placeholder="Ej: 11 2345 6789 · desde otro país, con +código"/>
      <button class="btn btn-red" type="submit" id="pg-r">Reservar horario y pagar <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      <div class="err" id="pg-err2" aria-live="polite"></div>
    </form>

    <div id="pg-3" class="oculto paso3">
      <div class="big">Tu horario está guardado<br><span>por 15 minutos</span></div>
      <p class="elegido" id="pg-elegido3"></p>
      <div class="reloj" id="pg-reloj">15:00</div>
      <div class="regla" style="text-align:left"><b>Todavía NO está confirmado.</b> Si no pagás en los próximos 15 minutos, el horario se libera para otra persona. Apenas se acredita el pago, te llega la invitación con el Zoom.</div>
      <a class="btn btn-red" id="pg-b" href="#"><span id="pg-bt">Pagar $60.000 y confirmar mi turno</span> <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>
      <p class="p" style="margin-top:10px" id="pg-seg">Pago seguro con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta.</p>
    </div>
  </div>
</div>
"""
s = s.replace('<header class="hero">', '<div class="aviso" id="aviso"></div>\n\n<header class="hero">', 1)
s = s.replace("<footer>", modal + "\n<footer>", 1)

js = r"""
<script src="https://semillaredes.com/assets/resenas.js?v=3" defer></script>
<script>
(function(){
  var FN='https://fdrxsjphlvvwwknnrjtx.supabase.co/functions/v1/auditoria-pago';
  var TZ='America/Argentina/Buenos_Aires',TU='https://aguscalcagno.com/s/auditoria-inicial-con-agus';
  // país: por la zona horaria del navegador; se puede cambiar a mano (link debajo del precio) o con ?pais=ar|ext
  var TZU='';try{TZU=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(_){}
  var esAR=!TZU||/^America\/(Argentina\/|Buenos_Aires$|Cordoba$|Catamarca$|Jujuy$|Mendoza$|Rosario$)/.test(TZU);
  var forz='';try{forz=new URLSearchParams(location.search).get('pais')||localStorage.getItem('aud_pais')||''}catch(_){}
  var quiereExt=forz==='ext'?true:forz==='ar'?false:!esAR,extOK=false,ext=false,VTZ=TZ;
  function txt(id,t,html){var e=document.getElementById(id);if(e){if(html)e.innerHTML=t;else e.textContent=t}}
  function modo(){
    ext=quiereExt&&extOK;VTZ=ext&&TZU?TZU:TZ;
    var c=document.getElementById('pg-cambiar');
    txt('pg-monto',ext?'USD 45 <small>dólares</small>':'$60.000 <small>ARS</small>',1);
    txt('pg-alt',ext?'Elegís tu horario y pagás con tarjeta':'Elegís tu horario y pagás con Mercado Pago');
    txt('pg-bt',ext?'Pagar USD 45 y confirmar mi turno':'Pagar $60.000 y confirmar mi turno');
    txt('pg-seg',ext?'Pago seguro con tarjeta de crédito o débito (procesado por dLocal).':'Pago seguro con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta.');
    var w=document.getElementById('pg-w');if(w)w.placeholder=ext?'Con + y código de país. Ej: +34 612 345 678':'Ej: 11 2345 6789 · desde otro país, con +código';
    txt('pg-tzt',ext?'Horarios en tu hora local.':'Horarios de Argentina.');
    txt('pg-faq',extOK?'Desde Argentina, en pesos con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta. Desde el exterior, USD 45 con tarjeta de crédito o débito.':'En pesos con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta. Desde el exterior, USD 45 con PayPal.');
    if(c){
      if(!extOK){c.href=TU;c.textContent='¿Estás fuera de Argentina? Pagá USD 45 con PayPal'}
      else{c.href='#';c.textContent=ext?'¿Estás en Argentina? Pagá $60.000 con Mercado Pago':'¿Estás fuera de Argentina? Pagá USD 45 con tarjeta';c.classList.toggle('oculto',!!reserva)}
    }
    if(horarios)pintar();
  }
  var m=document.getElementById('pagar'),P=[null,document.getElementById('pg-1'),document.getElementById('pg-2'),document.getElementById('pg-3')];
  var f2=P[2],btnR=document.getElementById('pg-r'),btnP=document.getElementById('pg-b');
  var horarios=null,elegido=null,reserva=null,relojT=null;
  function paso(n){for(var i=1;i<=3;i++){P[i].classList.toggle('oculto',i!==n);var e=document.getElementById('ps'+i);e.className=i<n?'ok':(i===n?'on':'')}m.scrollTop=0}
  function ck(n){var r=document.cookie.match('(?:^|; )'+n+'=([^;]*)');return r?decodeURIComponent(r[1]):''}
  var q=new URLSearchParams(location.search),utm={};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(function(k){if(q.get(k))utm[k]=q.get(k)});
  try{if(Object.keys(utm).length)sessionStorage.setItem('aud_utm',JSON.stringify(utm));else utm=JSON.parse(sessionStorage.getItem('aud_utm')||'{}')}catch(_){}
  function fmt(iso,o){return new Date(iso).toLocaleString('es-AR',Object.assign({timeZone:VTZ},o))}
  function diaKey(iso){return fmt(iso,{year:'numeric',month:'2-digit',day:'2-digit'})}
  function largo(iso){return fmt(iso,{weekday:'long',day:'numeric',month:'long'})+' · '+fmt(iso,{hour:'2-digit',minute:'2-digit'})+' hs'}

  // los horarios se traen apenas abre la página: cuando tocan "Reservá" ya están
  function traer(){
    return fetch(FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accion:'horarios'})})
      .then(function(r){return r.json()}).then(function(d){horarios=(d&&d.horarios)||[];extOK=!!(d&&d.exterior);modo()})
      .catch(function(){horarios=[];pintar()});
  }
  function pintar(){
    var cd=document.getElementById('pg-dias'),ch=document.getElementById('pg-horas');cd.innerHTML='';ch.innerHTML='';
    document.getElementById('pg-sin').classList.toggle('oculto',horarios.length>0);
    if(!horarios.length)return;
    var dias={},orden=[];horarios.forEach(function(h){var k=diaKey(h);if(!dias[k]){dias[k]=[];orden.push(k)}dias[k].push(h)});
    function verDia(k){
      [].forEach.call(cd.children,function(b){b.classList.toggle('on',b.dataset.k===k)});
      ch.innerHTML='';dias[k].forEach(function(h){var b=document.createElement('button');b.type='button';b.className='hora';b.textContent=fmt(h,{hour:'2-digit',minute:'2-digit'})+' hs';
        b.onclick=function(){elegido=h;document.getElementById('pg-elegido').textContent=largo(h);paso(2);setTimeout(function(){document.getElementById('pg-n').focus()},50);if(typeof fbq==='function')fbq('trackCustom','EligioHorario')};ch.appendChild(b)});
    }
    orden.forEach(function(k){var h=dias[k][0],b=document.createElement('button');b.type='button';b.className='dia';b.dataset.k=k;
      b.innerHTML='<small>'+fmt(h,{weekday:'short'}).replace('.','')+'</small><b>'+fmt(h,{day:'numeric'})+'</b><small>'+fmt(h,{month:'short'}).replace('.','')+'</small>';
      b.onclick=function(){verDia(k)};cd.appendChild(b)});
    verDia(orden[0]);
  }
  traer();

  function abrir(e){if(e)e.preventDefault();m.classList.add('on');paso(reserva?3:(elegido?2:1));if(typeof fbq==='function')fbq('trackCustom','AbrirPago')}
  function cerrar(){m.classList.remove('on');
    if(reserva){var av=document.getElementById('aviso');av.innerHTML='<b>Tu horario está guardado por 15 minutos y todavía no está confirmado.</b> <a href="#pagar" data-pagar style="text-decoration:underline">Pagá para confirmarlo</a> o se libera.';av.style.display='block'}}
  document.addEventListener('click',function(e){
    var cb=e.target.closest&&e.target.closest('#pg-cambiar');if(cb&&extOK){e.preventDefault();if(reserva)return;quiereExt=!quiereExt;try{localStorage.setItem('aud_pais',quiereExt?'ext':'ar')}catch(_){}modo();if(typeof fbq==='function')fbq('trackCustom',quiereExt?'CambioAExterior':'CambioAArgentina');return}
    var a=e.target.closest&&e.target.closest('[data-pagar]');if(a){abrir(e);return}
    if(e.target.closest&&e.target.closest('[data-volver]')){paso(1);return}
    if(e.target===m||(e.target.closest&&e.target.closest('[data-cerrar]')))cerrar();
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')cerrar()});
  if(location.hash==='#pagar')abrir();

  f2.addEventListener('submit',function(e){
    e.preventDefault();var er=document.getElementById('pg-err2');er.textContent='';
    var n=f2.nombre.value.trim(),em=f2.email.value.trim(),tw=f2.telefono.value.trim();
    if(!n){er.textContent='Falta tu nombre.';return}
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){er.textContent='Revisá tu email.';return}
    if(tw.replace(/\D/g,'').length<(ext?8:10)){er.textContent=ext?'Revisá tu WhatsApp (con + y código de país).':'Revisá tu WhatsApp (con código de área, sin 0 ni 15).';return}
    btnR.disabled=true;btnR.firstChild.nodeValue='Guardando tu horario… ';
    var fbc=ck('_fbc');if(!fbc&&utm.fbclid)fbc='fb.1.'+Date.now()+'.'+utm.fbclid;
    fetch(FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accion:'crear',exterior:ext,pais:TZU,inicio:elegido,nombre:n,email:em,telefono:tw,fbp:ck('_fbp'),fbc:fbc,utm:utm,origen:location.href})})
    .then(function(r){return r.json().then(function(d){return{s:r.status,d:d}})}).then(function(x){
      var d=x.d;
      if(x.s===409){traer();paso(1);btnR.disabled=false;btnR.firstChild.nodeValue='Reservar horario y pagar ';alert(d.error);return}
      if(!d||!d.url)throw new Error(d&&d.error||'error');
      reserva=d;try{localStorage.setItem('aud_ref',d.ref)}catch(_){}
      document.getElementById('pg-elegido3').textContent=largo(elegido);
      btnP.href=d.url;modo();paso(3);arrancarReloj(Date.parse(d.vence));
      if(typeof fbq==='function'){fbq('trackCustom','AgendarAuditoria');fbq('track','Schedule')}
    }).catch(function(x){btnR.disabled=false;btnR.firstChild.nodeValue='Reservar horario y pagar ';er.textContent=(x&&x.message&&x.message!=='error')?x.message:'No pudimos guardar el horario. Probá de nuevo o escribime por WhatsApp.'});
  });
  function arrancarReloj(fin){
    var el=document.getElementById('pg-reloj');clearInterval(relojT);
    function tic(){var r=Math.max(0,fin-Date.now()),mm=Math.floor(r/60000),ss=Math.floor(r%60000/1000);
      el.textContent=(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;
      if(r<=0){clearInterval(relojT);el.classList.add('fin');el.textContent='Se terminó el tiempo: si no pagaste, el horario se liberó.';}}
    tic();relojT=setInterval(tic,1000);
  }
  btnP.addEventListener('click',function(){if(reserva&&typeof fbq==='function')fbq('track','InitiateCheckout',{value:Number(reserva.monto)||60000,currency:reserva.moneda||'ARS',content_name:'Auditoría con Agus'},{eventID:'ic-'+reserva.ref})});

  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a||typeof fbq!=='function')return;
    if(/auditoria-inicial-con-agus/.test(a.href)){fbq('trackCustom','PagoUSDTiendup');fbq('track','InitiateCheckout',{value:45,currency:'USD'});}
    else if(/wa\.me/.test(a.href)){fbq('track','Contact');}
  });
})();
</script>
"""
s = re.sub(r"<script>\s*document\.addEventListener\('click',function\(e\)\{\s*var a=e\.target\.closest.*?</script>", "", s, flags=re.S)
s = s.replace("</body>", js + "</body>", 1)

assert TU in s and 'pg-cambiar' in s and 'data-pagar' in s and 'Elegís horario y pagás' in s
(aqui / "index.html").write_text(s, encoding="utf-8")
print("ok", len(s), "botones de pago:", s.count('data-pagar'))
