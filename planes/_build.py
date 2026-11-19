# Genera /planes/index.html y /planes/gracias-<codigo>.html
# Planes mensuales de Semilla (suscripción de Mercado Pago). Correr: python3 _build.py
import pathlib, html, urllib.parse
aqui = pathlib.Path(__file__).parent
MP = "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id="
CAL = "https://calendly.com/calcagnoagustin/1-hora-de-consultoria-con-agus"
WA = "https://wa.me/5492665242011?text="

PLANES = [
  dict(codigo="publicidad_viva", nombre="Publicidad Viva", precio="60.000", mp="085082641e884adb85630ddd660471fd",
       para="Para que tu pauta nunca quede quieta.", color="olive", reuniones=0,
       items=[("si", "<b>1 ajuste de tu pauta por semana</b>, hecho por el equipo de Semilla"),
              ("si", "Seguimiento de tus campañas en la app"),
              ("no", "Sin reuniones")]),
  dict(codigo="reunion_mensual", nombre="Reunión Mensual", precio="90.000", mp="4a8278db20594bb6835b022f54113027",
       para="Pauta al día y una charla por mes para decidir.", color="rose", reuniones=1, destacado=True,
       items=[("si", "<b>1 ajuste de tu pauta por semana</b>, hecho por el equipo de Semilla"),
              ("si", "<b>1 reunión 1:1 por mes</b> con Agus por Zoom"),
              ("si", "Seguimiento de tus campañas en la app")]),
  dict(codigo="mentoria", nombre="Mentoría", precio="200.000", mp="868d73391ef84f9b9a25ec06857e663e",
       para="Acompañamiento cercano, semana a semana.", color="olive", reuniones=4,
       items=[("si", "<b>4 reuniones 1:1 por mes</b> con Agus por Zoom"),
              ("si", "Foco, estrategia, comunicación y decisiones"),
              ("si", "Seguimiento de tu proyecto en la app")]),
  dict(codigo="setup_inicial", nombre="Setup", precio="350.000", mp="66d66ef24caf441a84ae403cd8b77fec",
       para="Armamos todo con vos: estrategia y contenido.", color="rose", reuniones=4,
       items=[("si", "<b>4 reuniones 1:1 por mes</b> con Agus por Zoom"),
              ("si", "<b>Contenido para tus redes</b>, hecho por el equipo"),
              ("si", "Seguimiento de tu proyecto en la app")]),
]

LOGO = '<svg viewBox="0 0 44 44" fill="none"><g stroke="#D8434F" stroke-width="1.6"><line x1="22" y1="22" x2="4" y2="22"/><line x1="22" y1="22" x2="40" y2="22"/><line x1="22" y1="22" x2="22" y2="4"/><line x1="22" y1="22" x2="22" y2="40"/><line x1="22" y1="22" x2="8" y2="8"/><line x1="22" y1="22" x2="36" y2="36"/><line x1="22" y1="22" x2="36" y2="8"/><line x1="22" y1="22" x2="8" y2="36"/></g><path d="M22,10 C26,14 28,18 28,22 C28,26 26,30 22,34 C18,30 16,26 16,22 C16,18 18,14 22,10Z" fill="#7B8A32"/><g fill="#D8434F"><circle cx="4" cy="22" r="2.6"/><circle cx="40" cy="22" r="2.6"/><circle cx="22" cy="4" r="2.6"/><circle cx="22" cy="40" r="2.6"/><circle cx="8" cy="8" r="2.6"/><circle cx="36" cy="36" r="2.6"/><circle cx="36" cy="8" r="2.6"/><circle cx="8" cy="36" r="2.6"/></g></svg>'
ICO_SI = '<svg viewBox="0 0 24 24"><path d="M6 12.5l4 4 8-9"/></svg>'
ICO_NO = '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7L7 17"/></svg>'
ICO_WEB = '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 9h18"/><circle cx="6.3" cy="6.8" r=".6"/><circle cx="8.6" cy="6.8" r=".6"/></svg>'
ICO_CAL = '<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>'
ICO_PAGO = '<svg viewBox="0 0 24 24"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5"/><path d="M2.5 10h19M6 15h4"/></svg>'

HEAD = """<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>{titulo}</title>
<meta name="description" content="{desc}"/>
<meta name="theme-color" content="#F8F0E2"/>
<meta property="og:title" content="{titulo}"/>
<meta property="og:description" content="{desc}"/>
<meta property="og:image" content="https://semillaredes.com/og-image.jpg"/>
<link rel="apple-touch-icon" href="/icon-180.png?v=4"/>
<link rel="icon" type="image/png" sizes="192x192" href="/icono-192.png?v=4"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>
<script async src="https://www.googletagmanager.com/gtag/js?id=G-JXRH3E28FF"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments);}}gtag('js',new Date());gtag('config','G-JXRH3E28FF');</script>
<script>
!function(f,b,e,v,n,t,s){{if(f.fbq)return;n=f.fbq=function(){{n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)}};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init','953367820005998');fbq('track','PageView');{pixel}
</script>
<style>
:root{{--bg:#F8F0E2;--paper:#FBF6EC;--navy:#16215A;--red:#D8434F;--red-dark:#BF3440;--rose-soft:#F6D5D2;--rose-bg:#F8E3DE;--olive:#7B7C2E;--olive-soft:#E4E0BE;--olive-bg:#EFEAD7;--text:#2B2B33;--muted:#5A5862;--line:#E6DCCB}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{font-family:'Inter',sans-serif;background:var(--bg);color:var(--text);line-height:1.4;-webkit-font-smoothing:antialiased}}
a{{color:inherit;text-decoration:none}}
.wrap{{max-width:1120px;margin:0 auto;padding:0 16px}}
h1,h2,h3{{font-family:'Playfair Display',serif;color:var(--navy);line-height:1.05;letter-spacing:-.01em}}
nav{{position:sticky;top:0;z-index:50;background:rgba(248,240,226,.95);backdrop-filter:blur(8px)}}
nav .wrap{{display:flex;align-items:center;justify-content:space-between;height:60px}}
.logo{{display:flex;align-items:center;gap:10px}}
.logo svg{{width:36px;height:36px}}
.logo-text{{font-weight:800;letter-spacing:.06em;color:var(--navy);font-size:16px}}
.logo-text small{{font-weight:500;letter-spacing:.14em;font-size:16px}}
.nav-wa{{font-size:13px;font-weight:700;color:var(--navy);border:1.5px solid var(--navy);border-radius:999px;padding:8px 14px}}
.btn{{display:flex;align-items:center;justify-content:center;gap:9px;font-weight:700;font-size:16px;border-radius:999px;padding:15px 20px;border:0;font-family:inherit;cursor:pointer;width:100%}}
.btn svg{{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;flex:none}}
.btn-red{{background:var(--red);color:#fff;box-shadow:0 4px 12px rgba(216,67,79,.22)}}
.btn-red:hover{{background:var(--red-dark)}}
.btn-line{{background:#fff;color:var(--navy);border:1.5px solid var(--navy)}}
footer{{padding:26px 0 34px}}
footer .wrap{{display:flex;justify-content:space-between;align-items:center;gap:14px;font-size:13px;color:var(--muted);flex-wrap:wrap}}
{css}
</style>
</head>
<body>
<nav><div class="wrap">
  <a href="/" class="logo">{logo}<span class="logo-text">SEMILLA <small>REDES</small></span></a>
  <a class="nav-wa" href="{wa}" target="_blank" rel="noopener">Consultas</a>
</div></nav>
"""
FOOT = """<footer><div class="wrap">
  <span class="logo-text">SEMILLA <small>REDES</small></span>
  <a href="mailto:agus@semillaredes.com">agus@semillaredes.com</a>
  <a href="https://instagram.com/semillaredes" target="_blank" rel="noopener">@semillaredes</a>
</div></footer>
</body>
</html>
"""

CSS_PLANES = """
.hero{padding:26px 0 8px;text-align:center}
.eyebrow{font-size:11.5px;font-weight:800;letter-spacing:.17em;text-transform:uppercase;color:var(--olive)}
.hero h1{font-size:clamp(38px,9vw,60px);font-weight:900;margin:10px 0 12px}
.hero h1 span{color:var(--red)}
.hero p{font-size:17px;color:var(--navy);max-width:560px;margin:0 auto}
.hosting{display:flex;align-items:center;gap:14px;background:var(--navy);color:#fff;border-radius:16px;padding:16px 18px;margin:22px auto 6px;max-width:640px;text-align:left}
.hosting .i{width:46px;height:46px;border-radius:50%;background:#fff;color:var(--navy);display:flex;align-items:center;justify-content:center;flex:none}
.hosting .i svg{width:24px;height:24px;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round}
.hosting b{display:block;font-size:17px;line-height:1.25}
.hosting span{display:block;font-size:13.5px;color:#D9DBEA;margin-top:2px;line-height:1.35}
.grilla{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;padding:22px 0 10px;align-items:stretch}
.plan{background:#fff;border-radius:18px;padding:22px 18px 18px;display:flex;flex-direction:column;box-shadow:0 10px 30px rgba(22,33,90,.07);position:relative;border:2px solid transparent;scroll-margin-top:76px}
.plan.dest{border-color:var(--red)}
.cinta{position:absolute;top:-12px;left:50%;transform:translateX(-50%);background:var(--red);color:#fff;font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;padding:5px 12px;border-radius:999px;white-space:nowrap}
.plan .tag{display:inline-block;align-self:flex-start;font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;padding:5px 10px;border-radius:999px}
.plan.c-olive .tag{background:var(--olive-soft);color:var(--olive)}
.plan.c-rose .tag{background:var(--rose-soft);color:var(--red-dark)}
.plan h2{font-size:28px;font-weight:900;margin:12px 0 4px}
.plan .para{font-size:14px;color:var(--muted);min-height:40px}
.precio{margin:14px 0 4px;color:var(--navy);font-weight:800;font-size:34px;line-height:1}
.precio small{font-size:15px;font-weight:700;color:var(--muted)}
.lista{list-style:none;border-top:1px solid var(--line);margin:14px 0 14px;padding-top:14px;display:grid;gap:11px}
.lista li{display:flex;gap:10px;align-items:flex-start;font-size:15px;line-height:21px;color:var(--text)}
.lista li .ck{width:20px;height:20px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;margin-top:.5px}
.lista li .ck svg{width:12px;height:12px;fill:none;stroke:#fff;stroke-width:3.2;stroke-linecap:round;stroke-linejoin:round}
.lista li.si .ck{background:var(--olive)}
.lista li.no .ck{background:#CFC8BA}
.lista li.no{color:#8A8690}
.lista b{color:var(--navy)}
.web{display:flex;gap:10px;align-items:flex-start;background:var(--rose-bg);border-radius:12px;padding:11px 12px;margin:auto 0 16px;font-size:15px;line-height:21px;color:var(--navy);font-weight:800}
.web svg{width:20px;height:20px;flex:none;margin-top:.5px;fill:none;stroke:var(--red);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.web span{font-weight:500;display:block;font-size:13px;line-height:18px;color:var(--muted);margin-top:1px}
.plan .acciones{display:grid;gap:8px}
.nota{font-size:12.5px;color:var(--muted);text-align:center;line-height:1.35}
.como{background:var(--paper);border-radius:18px;padding:22px 18px;margin:18px 0 6px}
.como h2{font-size:26px;font-weight:900;margin-bottom:14px}
.pasos{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.paso{display:flex;gap:12px;align-items:flex-start}
.paso .n{width:36px;height:36px;border-radius:50%;background:var(--rose-soft);color:var(--navy);font-weight:800;font-size:16px;display:flex;align-items:center;justify-content:center;flex:none}
.paso:nth-child(2) .n{background:var(--olive-soft)}
.paso b{display:block;color:var(--navy);font-size:15px;line-height:21px;margin-top:9.5px}
.paso span{display:block;font-size:14px;color:var(--muted);line-height:1.4;margin-top:2px}
.preg{padding:10px 0}
.preg h2{font-size:24px;font-weight:900;margin:12px 0 10px}
.preg details{background:#fff;border-radius:12px;padding:14px 16px;margin-bottom:8px}
.preg summary{font-weight:700;color:var(--navy);cursor:pointer;font-size:15px}
.preg details p{font-size:14px;color:var(--muted);margin-top:8px;line-height:1.45}
.ext{text-align:center;font-size:14px;color:var(--navy);margin:14px 0 4px}
.ext a{text-decoration:underline;font-weight:700}
@media (min-width:981px){.plan h2{font-size:25px}.precio small{display:block;margin-top:6px}}
.precio small{white-space:nowrap}
@media (max-width:980px){.grilla{grid-template-columns:repeat(2,1fr)}}
@media (max-width:640px){
  .grilla{grid-template-columns:1fr;gap:18px}
  .pasos{grid-template-columns:1fr}
  .plan .para{min-height:0}
  .hosting{margin-top:18px}
}
"""

def card(p):
    lis = "".join(f'<li class="{k}"><span class="ck">{ICO_SI if k=="si" else ICO_NO}</span><span>{t}</span></li>' for k, t in p["items"])
    cinta = '<span class="cinta">El más elegido</span>' if p.get("destacado") else ""
    if p["reuniones"]:
        nota = f'Después de pagar agendás tu {"reunión" if p["reuniones"]==1 else "primera reunión"} en el calendario.'
    else:
        nota = "Después de pagar te escribimos para arrancar."
    return f"""
  <article class="plan c-{p['color']}{' dest' if p.get('destacado') else ''}" id="{p['codigo'].replace('_','-')}">
    {cinta}<span class="tag">{"Sin reuniones" if not p['reuniones'] else (str(p['reuniones'])+(" reunión" if p['reuniones']==1 else " reuniones")+" por mes")}</span>
    <h2>{p['nombre']}</h2>
    <p class="para">{p['para']}</p>
    <div class="precio">${p['precio']} <small>ARS / mes</small></div>
    <ul class="lista">{lis}</ul>
    <div class="web">{ICO_WEB}<div>Incluye el hosting de tu página<span>Tu web online y al día, sin pagar aparte.</span></div></div>
    <div class="acciones">
      <a class="btn btn-red" href="{MP}{p['mp']}" data-plan="{p['codigo']}" data-monto="{p['precio'].replace('.','')}">{ICO_PAGO}Suscribirme</a>
      <p class="nota">{nota}</p>
    </div>
  </article>"""

cards = "".join(card(p) for p in PLANES)
wa_gen = WA + "Hola%20Agus%2C%20quiero%20consultar%20por%20los%20planes%20de%20Semilla"
body = f"""
<header class="hero"><div class="wrap">
  <p class="eyebrow">Planes mensuales</p>
  <h1>Elegí tu <span>plan</span></h1>
  <p>Acompañamiento mensual para tu proyecto artístico. Te suscribís con Mercado Pago y podés darte de baja cuando quieras.</p>
  <div class="hosting"><span class="i">{ICO_WEB}</span><div><b>Todos los planes incluyen el hosting de tu página</b><span>Tu web queda online y la mantenemos nosotros. No pagás hosting aparte.</span></div></div>
</div></header>

<main class="wrap">
  <section class="grilla">{cards}
  </section>
  <p class="ext">¿Estás fuera de Argentina? <a href="{WA}Hola%20Agus%2C%20estoy%20fuera%20de%20Argentina%20y%20quiero%20un%20plan%20de%20Semilla" target="_blank" rel="noopener">Escribinos y lo pagás en dólares</a></p>

  <section class="como">
    <h2>Cómo funciona</h2>
    <div class="pasos">
      <div class="paso"><span class="n">1</span><div><b>Elegís tu plan</b><span>Te suscribís con Mercado Pago: tarjeta de crédito, débito o dinero en cuenta.</span></div></div>
      <div class="paso"><span class="n">2</span><div><b>Agendás tu reunión</b><span>Si tu plan tiene reuniones, al pagar se abre el calendario para elegir día y horario.</span></div></div>
      <div class="paso"><span class="n">3</span><div><b>Arrancamos</b><span>Tu web sigue online con nosotros y ves todo el avance en la app de Semilla.</span></div></div>
    </div>
  </section>

  <section class="preg">
    <h2>Preguntas frecuentes</h2>
    <details><summary>¿Qué es el hosting de la página?</summary><p>Es el lugar donde vive tu web para que esté online. En todos los planes está incluido: no pagás nada aparte y nosotros nos ocupamos de que funcione.</p></details>
    <details><summary>¿Qué es un ajuste de pauta?</summary><p>Una vez por semana el equipo revisa tus anuncios y hace un cambio para que rindan mejor: públicos, presupuesto, textos o piezas.</p></details>
    <details><summary>¿Cómo agendo las reuniones?</summary><p>Al pagar se abre el calendario de Agus para elegir día y horario. Las siguientes reuniones del mes las agendás desde el mismo calendario.</p></details>
    <details><summary>¿Puedo cambiar de plan o darme de baja?</summary><p>Sí. Nos escribís por WhatsApp y lo cambiamos. La baja se hace desde Mercado Pago o con un mensaje.</p></details>
  </section>
</main>
<script>
document.querySelectorAll('[data-plan]').forEach(function(a){{a.addEventListener('click',function(){{
  try{{fbq('track','InitiateCheckout',{{content_name:a.dataset.plan,value:+a.dataset.monto,currency:'ARS'}})}}catch(_){{}}
  try{{gtag('event','begin_checkout',{{items:[{{item_id:a.dataset.plan}}],value:+a.dataset.monto,currency:'ARS'}})}}catch(_){{}}
}})}});
</script>
"""
(aqui / "index.html").write_text(
    HEAD.format(titulo="Planes de Semilla", desc="Planes mensuales de Semilla Redes. Todos incluyen el hosting de tu página.",
                pixel="", css=CSS_PLANES, logo=LOGO, wa=wa_gen) + body + FOOT, encoding="utf-8")

CSS_G = """
.ok{padding:26px 0 10px;text-align:center}
.ok .tilde{width:62px;height:62px;border-radius:50%;background:var(--olive);margin:0 auto 12px;display:flex;align-items:center;justify-content:center}
.ok .tilde svg{width:30px;height:30px;fill:none;stroke:#fff;stroke-width:3;stroke-linecap:round;stroke-linejoin:round}
.ok h1{font-size:clamp(32px,8vw,48px);font-weight:900;margin-bottom:8px}
.ok h1 span{color:var(--red)}
.ok p{font-size:16px;color:var(--navy);max-width:520px;margin:0 auto}
.hosting{display:flex;align-items:center;gap:12px;background:var(--rose-bg);border-radius:14px;padding:12px 14px;margin:16px auto 0;max-width:520px;text-align:left;font-size:14.5px;color:var(--navy);font-weight:700}
.hosting svg{width:22px;height:22px;flex:none;fill:none;stroke:var(--red);stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
.agenda{background:#fff;border-radius:18px;padding:18px 12px 10px;margin:18px auto 10px;max-width:900px;box-shadow:0 10px 30px rgba(22,33,90,.07)}
.agenda h2{font-size:24px;font-weight:900;text-align:center;margin-bottom:4px}
.agenda .s{text-align:center;font-size:14px;color:var(--muted);margin-bottom:10px}
.cal{position:relative;height:700px;border-radius:12px;overflow:hidden}
.cal .calendly-inline-widget{position:relative;z-index:1;height:100%}
.cargando{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:14px;color:var(--muted)}
.sig{max-width:520px;margin:10px auto 0;display:grid;gap:10px}
@media (max-width:640px){.cal{height:620px}.agenda{padding:16px 6px 8px}}
"""
for p in PLANES:
    r = p["reuniones"]
    wa = WA + urllib.parse.quote(f"Hola Agus, me suscribí al plan {p['nombre']}")
    if r:
        agenda = f"""
  <section class="agenda">
    <h2>{"Agendá tu reunión" if r == 1 else "Agendá tu primera reunión"}</h2>
    <p class="s">{"Tenés 1 reunión por mes con Agus por Zoom." if r == 1 else "Tenés 4 reuniones por mes con Agus por Zoom. Las siguientes las agendás desde este mismo calendario."}</p>
    <div class="cal"><div class="cargando">Cargando calendario…</div>
      <div class="calendly-inline-widget" data-url="{CAL}?hide_gdpr_banner=1&primary_color=d8434f"></div></div>
  </section>
  <script src="https://assets.calendly.com/assets/external/widget.js" async></script>"""
        sub = "Tu suscripción quedó activa. Ahora elegí día y horario para tu reunión."
    else:
        agenda = ""
        sub = "Tu suscripción quedó activa. Te escribimos por WhatsApp para arrancar con tu pauta."
    body = f"""
<main class="wrap">
  <section class="ok">
    <div class="tilde">{ICO_SI}</div>
    <h1>¡Bienvenido a <span>{p['nombre']}</span>!</h1>
    <p>{sub}</p>
    <div class="hosting">{ICO_WEB}<span>Tu plan incluye el hosting de tu página.</span></div>
  </section>{agenda}
  <div class="sig"><a class="btn btn-line" href="{wa}" target="_blank" rel="noopener">Avisale a Agus por WhatsApp</a></div>
</main>
"""
    pix = f"fbq('track','Subscribe',{{content_name:'{p['codigo']}',value:{p['precio'].replace('.','')},currency:'ARS'}});"
    (aqui / f"gracias-{p['codigo'].replace('_','-')}.html").write_text(
        HEAD.format(titulo=f"{p['nombre']} — Semilla", desc="Tu suscripción a Semilla quedó activa.", pixel=pix,
                    css=CSS_G, logo=LOGO, wa=wa).replace('<meta name="description"', '<meta name="robots" content="noindex"/>\n<meta name="description"') + body + FOOT,
        encoding="utf-8")
print("ok")
