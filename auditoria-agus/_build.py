# Genera /auditoria-agus/index.html a partir del diseño de la auditoría (auditoria-con-agus/fuente.html)
# Flujo: 1) eligen turno en Calendly (precargado, embebido; Calendly pide nombre y email)  2) pagan en Mercado Pago (15 min o se cancela)
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
s = s.replace('<div class="alt">USD 45</div>', '<div class="alt">Elegís tu horario y pagás con Mercado Pago</div>')
s = s.replace(f'href="{TU}"', 'href="#pagar" data-pagar')
s = s.replace('WhatsApp</a>\n      </aside>',
  f'WhatsApp</a>\n        <a class="usd" href="{TU}">¿Estás fuera de Argentina? Pagá USD 45 con PayPal</a>\n      </aside>')
s = s.replace('<p>Podés abonar en pesos o dólares.</p>',
  '<p>En pesos con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta. Desde el exterior, USD 45 con PayPal.</p>')
# cómo funciona: el turno se confirma con el pago
s = s.replace('<b>Reservás tu sesión</b><span>Elegí el día y horario que mejor te quede.</span>',
              '<b>Elegís horario y pagás</b><span>El turno queda confirmado cuando se acredita el pago.</span>')

css = """
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
s = s.replace('<link rel="preconnect" href="https://fonts.googleapis.com"/>', '<link rel="preconnect" href="https://fonts.googleapis.com"/>\n<link rel="preconnect" href="https://calendly.com"/>\n<link rel="preconnect" href="https://assets.calendly.com"/>\n<link rel="dns-prefetch" href="https://api.calendly.com"/>', 1)

REGLA = '<div class="regla"><b>Importante: el turno se confirma recién cuando pagás.</b> Después de elegir el horario tenés <b>15 minutos</b> para pagar. Si no pagás, la reserva se cancela sola y el horario se libera.</div>'

modal = f"""
<div class="modal" id="pagar" role="dialog" aria-modal="true" aria-labelledby="pg-t">
  <div class="caja ancha" id="pg-caja">
    <button type="button" class="x" aria-label="Cerrar" data-cerrar>&times;</button>
    <div class="pasitos"><span id="ps1" class="on">1 · Elegí tu horario</span><span id="ps2">2 · Pagá para confirmar</span></div>

    <div id="pg-1">
      <h2 id="pg-t">Elegí día y horario</h2>
      {REGLA}
      <div class="cal" id="pg-cal"><div class="cargando-cal">Cargando el calendario…</div></div>
    </div>

    <div id="pg-2" class="oculto paso3">
      <div class="big">Tu horario está reservado<br><span>por 15 minutos</span></div>
      <div class="reloj" id="pg-reloj">15:00</div>
      <div class="regla" style="text-align:left"><b>Todavía NO está confirmado.</b> Si no pagás en los próximos 15 minutos, el turno se cancela y el horario se libera. Aunque Calendly te mande un mail, la reserva vale solo con el pago.</div>
      <button class="btn btn-red" type="button" id="pg-b">Pagar $60.000 y confirmar mi turno <svg viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
      <div class="err" id="pg-err" aria-live="polite"></div>
      <p class="p" style="margin-top:10px">Pago seguro con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta.</p>
    </div>
  </div>
</div>
"""
s = s.replace('<header class="hero">', '<div class="aviso" id="aviso"></div>\n\n<header class="hero">', 1)
s = s.replace("<footer>", modal + "\n<footer>", 1)

js = r"""
<script src="https://semillaredes.com/assets/resenas.js?v=3" defer></script>
<script src="https://assets.calendly.com/assets/external/widget.js" async></script>
<script>
(function(){
  var FN='https://fdrxsjphlvvwwknnrjtx.supabase.co/functions/v1/auditoria-pago';
  var CAL='https://calendly.com/calcagnoagustin/1-hora-de-consultoria-con-agus';
  var m=document.getElementById('pagar'),p1=document.getElementById('pg-1'),p2=document.getElementById('pg-2');
  var b=document.getElementById('pg-b'),turno=null,urlPago=null,refVenta=null;
  function paso(n){
    p1.classList.toggle('oculto',n!==1);p2.classList.toggle('oculto',n!==2);
    [1,2].forEach(function(i){var e=document.getElementById('ps'+i);e.className=i<n?'ok':(i===n?'on':'')});
    m.scrollTop=0;
  }
  function ck(n){var r=document.cookie.match('(?:^|; )'+n+'=([^;]*)');return r?decodeURIComponent(r[1]):''}
  var q=new URLSearchParams(location.search),utm={};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid'].forEach(function(k){if(q.get(k))utm[k]=q.get(k)});
  try{if(Object.keys(utm).length)sessionStorage.setItem('aud_utm',JSON.stringify(utm));else utm=JSON.parse(sessionStorage.getItem('aud_utm')||'{}')}catch(_){}

  // el calendario se carga escondido apenas abre la página: cuando tocan "Reservá" ya está listo
  var calCargado=false;
  function cargarCal(){
    if(calCargado)return;
    if(!window.Calendly){setTimeout(cargarCal,150);return}
    calCargado=true;
    var u=new URL(CAL);
    u.searchParams.set('hide_gdpr_banner','1');u.searchParams.set('primary_color','d8434f');
    Object.keys(utm).forEach(function(k){if(k.indexOf('utm_')===0)u.searchParams.set(k,utm[k])});
    Calendly.initInlineWidget({url:u.toString(),parentElement:document.getElementById('pg-cal')});
  }
  cargarCal();

  function abrir(e){if(e)e.preventDefault();cargarCal();m.classList.add('on');paso(turno?2:1);
    if(typeof fbq==='function')fbq('trackCustom','AbrirPago');}
  function cerrar(){
    m.classList.remove('on');
    if(turno&&!refPagado()){var av=document.getElementById('aviso');av.innerHTML='<b>Tu horario está reservado por 15 minutos y todavía no está confirmado.</b> <a href="#pagar" data-pagar style="text-decoration:underline">Pagá para confirmarlo</a> o se cancela.';av.style.display='block'}
  }
  function refPagado(){return false}
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('[data-pagar]');if(a){abrir(e);return}
    if(e.target===m||(e.target.closest&&e.target.closest('[data-cerrar]')))cerrar();
  });
  document.addEventListener('pointerdown',function(e){if(e.target.closest&&e.target.closest('[data-pagar]'))cargarCal()},true);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')cerrar()});
  if(location.hash==='#pagar')abrir();

  window.addEventListener('message',function(e){
    if(e.origin!=='https://calendly.com'||!e.data||e.data.event!=='calendly.event_scheduled')return;
    var p=e.data.payload||{};turno={event_uri:p.event&&p.event.uri,invitee_uri:p.invitee&&p.invitee.uri};
    if(typeof fbq==='function'){fbq('trackCustom','AgendarAuditoria');fbq('track','Schedule');}
    paso(2);arrancarReloj(Date.now()+15*60*1000);crearPago();
  });
  var relojT=null;
  function arrancarReloj(fin){
    var el=document.getElementById('pg-reloj');clearInterval(relojT);
    function tic(){var r=Math.max(0,fin-Date.now()),mm=Math.floor(r/60000),ss=Math.floor(r%60000/1000);
      el.textContent=(mm<10?'0':'')+mm+':'+(ss<10?'0':'')+ss;
      if(r<=0){clearInterval(relojT);el.classList.add('fin');el.textContent='Se terminó el tiempo: si no pagaste, la reserva se cancela.';}}
    tic();relojT=setInterval(tic,1000);
  }
  function crearPago(){
    var er=document.getElementById('pg-err');er.textContent='';b.disabled=true;b.firstChild.nodeValue='Preparando el pago… ';
    var fbc=ck('_fbc');if(!fbc&&utm.fbclid)fbc='fb.1.'+Date.now()+'.'+utm.fbclid;
    fetch(FN,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({accion:'crear',event_uri:turno.event_uri,invitee_uri:turno.invitee_uri,fbp:ck('_fbp'),fbc:fbc,utm:utm,origen:location.href})})
    .then(function(r){return r.json()}).then(function(d){
      if(!d||!d.url)throw new Error(d&&d.error||'error');
      urlPago=d.url;refVenta=d.ref;try{localStorage.setItem('aud_ref',d.ref)}catch(_){}
      b.disabled=false;b.firstChild.nodeValue='Pagar $60.000 y confirmar mi turno ';
    }).catch(function(x){b.disabled=false;b.firstChild.nodeValue='Reintentar ';er.textContent=(x&&x.message&&x.message!=='error')?x.message:'No pudimos preparar el pago. Tocá reintentar o escribime por WhatsApp.'});
  }
  b.addEventListener('click',function(){
    if(!urlPago){crearPago();return}
    if(typeof fbq==='function')fbq('track','InitiateCheckout',{value:60000,currency:'ARS',content_name:'Auditoría con Agus'},{eventID:'ic-'+refVenta});
    location.href=urlPago;
  });

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

assert TU in s and 'data-pagar' in s and 'Elegís horario y pagás' in s
(aqui / "index.html").write_text(s, encoding="utf-8")
print("ok", len(s), "botones de pago:", s.count('data-pagar'))
