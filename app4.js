/* Semilla IA · app v4 «La app del artista» (16/11/2026). Por ahora SOLO en semillaredes.com/semillaredes (slug semilla-redes).
   Diseño de Agus: 4 pestañas (Inicio · Proyecto · Métricas · Formación) + Tu cuenta en el avatar.
   Usa los mismos datos que el panel clásico (window.__D) y los endpoints de la VM. Lo que todavía no está listo dice «Próximamente». */
(function(){
  if(window.V3) return;
  (function(){ const st=document.createElement('style'); st.id='v4pre'; st.textContent=`html,body{background:#F6F1EA!important}.wrap{display:none!important}
    #v4splash{position:fixed;inset:0;z-index:99;background:#F6F1EA;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;font-family:"DM Sans",system-ui,sans-serif;color:#1E2350}
    #v4splash img{width:76px;height:76px;object-fit:contain}
    #v4splash .wm{display:flex;align-items:center;gap:8px;font-weight:700;font-size:26px;letter-spacing:-.6px;line-height:1}
    #v4splash .wm b{color:#87863A}
    #v4splash .beta{font-size:9.5px;font-weight:700;letter-spacing:1px;color:#7A1F3A;border:1px solid #7A1F3A;border-radius:6px;padding:2px 5px 1px;line-height:1;text-transform:uppercase}
    #v4splash i{display:block;width:36px;height:3px;border-radius:2px;background:#E2DCCF;overflow:hidden;position:relative;margin-top:6px}
    #v4splash i::after{content:"";position:absolute;inset:0;width:40%;background:#87863A;border-radius:2px;animation:v4c 1s ease-in-out infinite alternate}
    @keyframes v4c{to{transform:translateX(150%)}}`; document.head.appendChild(st);
    const sp=()=>{ if(document.getElementById('v4')||document.getElementById('v4splash')) return; const d=document.createElement('div'); d.id='v4splash';
      d.innerHTML='<img src="/assets/marca-semilla-oliva.png" alt=""><span class="wm">semilla<b>IA</b><span class="beta">Beta</span></span><i></i><small style="font-size:12px;color:#8C8896;margin-top:4px">Versión 4.0</small>'; document.body.appendChild(d); };
    if(document.body) sp(); else document.addEventListener('DOMContentLoaded',sp);
    setTimeout(()=>{ const e=document.getElementById('error'); if(e&&!e.classList.contains('oculto')){ const w=document.querySelector('.wrap'); w&&w.style.setProperty('display','block','important'); const x=document.getElementById('v4splash'); x&&x.remove(); } },8000); })();
  const W='https://vm.semillaredes.com/web';
  const $=s=>document.querySelector(s);
  const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const escB=s=>esc(String(s==null?'':s).replace(/<(?!\/?(b|strong)>)[^>]*>/gi,'')).replace(/&lt;(\/?)(b|strong)&gt;/gi,'<$1b>');   // 17/11: los hallazgos traen <b>: se respeta solo la negrita
  const nf=(n,d=0)=>Number(n||0).toLocaleString('es-AR',{minimumFractionDigits:d,maximumFractionDigits:d});
  const MES=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'], DIA=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
  const fCorta=s=>{ const d=new Date(s+'T12:00:00'); return d.getDate()+' '+MES[d.getMonth()]; };
  const rango=(a,b)=>{ if(!a||!b) return ''; const x=new Date(a+'T12:00:00'), y=new Date(b+'T12:00:00'); return x.getMonth()===y.getMonth()?`${x.getDate()}–${y.getDate()} ${MES[y.getMonth()]}`:`${fCorta(a)} – ${fCorta(b)}`; };
  const LS=(k,v)=>{ try{ if(v===undefined) return localStorage.getItem('v4_'+slug+'_'+k); localStorage.setItem('v4_'+slug+'_'+k,v); }catch(e){ return null; } };

  // ---------- íconos (trazo 1.8, 24x24) ----------
  const P={casa:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    carpeta:'<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2h8.5A1.5 1.5 0 0 1 21 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/><path d="M3 10h18"/>',
    barras:'<path d="M6 20v-5M12 20V8M18 20V4"/>', gorro:'<path d="M2 9.5 12 5l10 4.5-10 4.5z"/><path d="M6 11.5V16c0 1.5 2.7 3 6 3s6-1.5 6-3v-4.5"/>',
    campana:'<path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
    cal:'<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>', flecha:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    chev:'<path d="M9 6l6 6-6 6"/>', atras:'<path d="M19 12H5M11 18l-6-6 6-6"/>', ext:'<path d="M7 17 17 7M9 7h8v8"/>', mas:'<path d="M12 5v14M5 12h14"/>',
    chat:'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>', trofeo:'<circle cx="12" cy="9" r="5.5"/><path d="M9 14l-1.5 7 4.5-2.5 4.5 2.5L15 14"/>',
    play:'<path d="M8 5.5v13l11-6.5z"/>', web:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.7 2.6 4 5.6 4 9s-1.3 6.4-4 9c-2.7-2.6-4-5.6-4-9s1.3-6.4 4-9z"/>',
    folder:'<path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5z"/>',
    imagen:'<rect x="3.5" y="4.5" width="17" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.8"/><path d="m20.5 16-5-5L6 19.5"/>',
    sube:'<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>', baja:'<path d="M3 7l6 6 4-4 8 8"/><path d="M15 17h6v-6"/>', cursor:'<path d="M5 3l14 7-6 2-2 6z"/>',
    foco:'<path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/>',
    lista:'<path d="M10 6h10M10 12h10M10 18h10"/><path d="M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/>', bolsa:'<path d="M5 8h14l-1 12H6z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    megafono:'<path d="M3 10v4a1 1 0 0 0 1 1h2l5 4V5L6 9H4a1 1 0 0 0-1 1z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>',
    bajar:'<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>', ubic:'<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    gente:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.2a6 6 0 0 1 3.5 5.8"/>',
    camara:'<rect x="3" y="6" width="18" height="14" rx="3"/><circle cx="12" cy="13" r="3.5"/><path d="M8.5 6l1.5-2.5h4L15.5 6"/>', link:'<path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4L11.5 6"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.5-1.4"/>',
    persona:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>', billetera:'<rect x="3" y="6" width="18" height="14" rx="2.5"/><path d="M3 10h18M16 15h2"/>',
    salir:'<path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H4"/>', doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
    grilla:'<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    check:'<path d="M5 12.5l4.5 4.5L19 7.5"/>', libro:'<path d="M12 6c-2-1.5-5-2-8-1.5V19c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5V4.5c-3-.5-6 0-8 1.5z"/><path d="M12 6v14.5"/>',
    auris:'<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4.5" height="6.5" rx="1.5"/><rect x="16.5" y="14" width="4.5" height="6.5" rx="1.5"/>',
    lupa:'<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.3-4.3"/>', candado:'<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>',
    maletin:'<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M3 12.5h18"/>',
    burbuja:'<path d="M4 5h16v11H10l-5 4v-4H4z"/>', musica:'<path d="M9 18V5l11-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="17" cy="16" r="3"/>',
    ticket:'<path d="M3 8a2 2 0 0 0 0 4v0a2 2 0 0 1 0 4v2h18v-2a2 2 0 0 1 0-4 2 2 0 0 0 0-4V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>',
    tienda:'<path d="M4 9.5 5.5 4h13L20 9.5M4 9.5h16v10.5H4zM4 9.5a2.7 2.7 0 0 0 5.3 0 2.7 2.7 0 0 0 5.4 0 2.7 2.7 0 0 0 5.3 0"/>',
    cohete:'<path d="M12 15l-3-3c1.5-5 5-8 10-9-1 5-4 8.5-9 10z"/><path d="M9 12l-4 1-2 3 4 1M12 15l-1 4 3 2 1-4"/>', clip:'<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M10 9.5v5l4.5-2.5z"/>',
    dominio:'<path d="M4 7h16v10H4z"/><path d="M8 11h3M8 14h6"/>', estrella:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'};
  const I=(k,cls)=>`<svg class="${cls||'i'}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${P[k]||''}</svg>`;
  const SEMI='<img class="semi" src="/assets/marca-semilla-oliva.png" alt="">';

  // ---------- estilos ----------
  const CSS=`
  :root{--crema:#F6F1EA;--card:#FDFBF8;--linea:#ECE5DA;--navy:#1E2350;--navy2:#252B5C;--vino:#7A1F3A;--oliva:#5E6230;--oliva2:#87863A;--salvia:#E9EADB;--rosa:#F5E3E8;--celeste:#E6EAF5;--tinta:#1E2350;--mute:#5F5D6B;--suave:#8C8896}
  body.v4{margin:0;background:var(--crema)!important}
  body.v4 .wrap,body.v4 .btnReporte,body.v4 .repFondo,body.v4 #v3chatb{display:none!important}
  #v4{font-family:"DM Sans",system-ui,sans-serif;color:var(--tinta);-webkit-font-smoothing:antialiased;max-width:520px;margin:0 auto;min-height:100vh;background:var(--crema);padding-bottom:calc(92px + env(safe-area-inset-bottom,0px))}
  #v4 *{box-sizing:border-box}
  #v4 button{font:inherit;color:inherit;cursor:pointer}
  #v4 .i{width:22px;height:22px;flex:none}
  #v4 .hd{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top,0px)) 18px 10px;background:var(--crema);border-bottom:1px solid var(--linea)}
  #v4 .hd .marca{display:flex;align-items:center;gap:10px;flex:1;min-width:0;background:none;border:0;padding:0}
  #v4 .hd .semi{width:34px;height:34px;object-fit:contain}
  #v4 .hd .wm{font-weight:700;font-size:23px;letter-spacing:-.6px;line-height:1}
  #v4 .hd .wm b{color:var(--oliva2);font-weight:700}
  #v4 .hd .beta{font-size:9.5px;font-weight:700;letter-spacing:1px;color:var(--vino);border:1px solid var(--vino);border-radius:6px;padding:2px 5px 1px;line-height:1;text-transform:uppercase;margin-left:-2px}
  #v4 .rd{width:44px;height:44px;border-radius:50%;border:1px solid var(--linea);background:var(--card);display:grid;place-items:center;position:relative;padding:0}
  #v4 .rd .pt{position:absolute;top:10px;right:11px;width:8px;height:8px;border-radius:50%;background:var(--vino);border:2px solid var(--card)}
  #v4 .av{background:var(--salvia);color:#4B4E25;font-weight:700;font-size:15px;border-color:transparent}
  #v4 .sc{display:none;padding:18px 18px 8px}
  #v4 .sc.on{display:block}
  #v4 h1{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:40px;line-height:1.05;letter-spacing:-1px;margin:6px 0 16px}
  #v4 h2{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:25px;line-height:1.15;letter-spacing:-.4px;margin:0}
  #v4 .tt{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:26px 0 12px}
  #v4 .lk{white-space:nowrap;display:inline-flex;align-items:center;gap:4px;color:var(--vino);font-weight:700;font-size:15px;background:none;border:0;padding:0;text-decoration:none}
  #v4 .lk .i{width:18px;height:18px}
  #v4 .vol{display:inline-flex;align-items:center;gap:8px;color:var(--vino);font-weight:700;font-size:15px;background:none;border:0;padding:4px 0;margin:2px 0 6px}
  #v4 .vol .i{width:19px;height:19px}
  #v4 .pill{display:inline-flex;align-items:center;gap:6px;background:#EEE8DE;color:#3E3D2C;border-radius:10px;padding:6px 11px;font-weight:700;font-size:13.5px;white-space:nowrap}
  #v4 .pill .i{width:16px;height:16px}
  #v4 .hola{display:flex;align-items:center;justify-content:space-between;gap:10px}
  #v4 .hola h1{margin:6px 0}
  #v4 .box{background:var(--card);border:1px solid var(--linea);border-radius:20px;overflow:hidden}
  #v4 .row{display:flex;align-items:center;gap:14px;padding:15px 16px;width:100%;background:none;border:0;text-align:left;text-decoration:none;color:inherit}
  #v4 .row+.row{border-top:1px solid var(--linea)}
  #v4 .row .tx{flex:1;min-width:0}
  #v4 .row b{display:block;font-size:16.5px;font-weight:700;line-height:22px}
  #v4 .row small{display:block;font-size:14.5px;color:var(--mute);line-height:20px;margin-top:2px}
  #v4 .row .go{color:#77727F}
  #v4 .row .go .i{width:19px;height:19px}
  #v4 .tile{width:44px;height:44px;border-radius:12px;display:grid;place-items:center;flex:none;background:var(--salvia);color:#4B4E25}
  #v4 .tile.r{background:var(--rosa);color:var(--vino)} #v4 .tile.c{background:var(--celeste);color:#2E3A7A}
  #v4 .tile .i{width:21px;height:21px}
  #v4 .dia{width:44px;height:48px;border-radius:12px;background:var(--rosa);color:var(--vino);display:flex;flex-direction:column;align-items:center;justify-content:center;flex:none;line-height:1}
  #v4 .dia span{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.4px}
  #v4 .dia b{font-family:"Playfair Display",Georgia,serif;font-size:22px;font-weight:700;margin-top:2px;line-height:1;color:var(--vino)}
  #v4 .prox{display:inline-block;background:#EEE8DE;color:#6B6553;border-radius:8px;padding:4px 8px;font-size:12px;font-weight:700;white-space:nowrap}
  #v4 .prox.vivo{background:#E4EBD3;color:#3F5A22;white-space:normal;line-height:1.3}
  #v4 .estado{display:inline-block;background:var(--salvia);color:#4B4E25;border-radius:8px;padding:5px 10px;font-size:13px;font-weight:700}
  #v4 .hero{background:linear-gradient(160deg,#252B5C,#1B2049);color:#fff;border-radius:22px;padding:22px 22px 18px;position:relative;overflow:hidden}
  #v4 .hero .k{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;letter-spacing:1.4px;color:#E9EFC0;text-transform:uppercase}
  #v4 .hero .k .i{width:17px;height:17px}
  #v4 .hero .big{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:62px;line-height:1;letter-spacing:-2px;margin:14px 0 6px}
  #v4 .hero .lab{font-size:16px;color:rgba(255,255,255,.88)}
  #v4 .hero .pie{display:flex;align-items:center;justify-content:space-between;border-top:1px solid rgba(255,255,255,.16);margin-top:18px;padding-top:14px;font-size:14px;color:rgba(255,255,255,.82)}
  #v4 .hero .pie button,#v4 .hero .pie a{display:inline-flex;align-items:center;gap:5px;background:none;border:0;padding:0;color:#E9EFC0;font-weight:700;font-size:15px;text-decoration:none}
  #v4 .hero .pie .i{width:17px;height:17px}
  #v4 .hero .orb{position:absolute;right:18px;top:26px;width:116px;height:116px;border-radius:50%;border:1px solid rgba(233,239,192,.35);display:grid;place-items:center}
  #v4 .hero .orb::after{content:"";position:absolute;inset:12px;border-radius:50%;border:1px dashed rgba(233,239,192,.22)}
  #v4 .hero .orb img{width:70px;height:70px;object-fit:contain;filter:brightness(1.35)}
  #v4 .barra{height:6px;border-radius:3px;background:rgba(255,255,255,.18);overflow:hidden;margin-top:14px}
  #v4 .barra i{display:block;height:100%;background:#E2E8A8;border-radius:3px}
  #v4 .drop{display:grid;grid-template-columns:1fr 40%;background:#EFE7DA;border-radius:20px;overflow:hidden;border:1px solid var(--linea);min-height:150px}
  #v4 .drop .tx{padding:18px 18px 16px}
  #v4 .drop .kk{font-size:12.5px;font-weight:700;letter-spacing:1.3px;color:#4B4E25;text-transform:uppercase}
  #v4 .drop h3{font-family:"Playfair Display",Georgia,serif;font-size:23px;line-height:1.12;margin:8px 0 12px;font-weight:700}
  #v4 .drop img{width:100%;height:100%;object-fit:cover}
  #v4 .dos{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:14px}
  #v4 .bt{white-space:nowrap;display:flex;align-items:center;justify-content:center;gap:9px;height:52px;border-radius:14px;border:1px solid var(--linea);background:var(--card);font-weight:700;font-size:16px;color:var(--tinta);text-decoration:none;padding:0 16px}
  #v4 .bt.n{background:var(--navy);color:#fff;border-color:var(--navy)}
  #v4 .bt.v{background:var(--vino);color:#fff;border-color:var(--vino)}
  #v4 .bt .i{width:20px;height:20px}
  #v4 .seg{display:grid;grid-template-columns:1fr 1fr;background:#EEE8DE;border-radius:16px;padding:5px;margin:4px 0 18px}
  #v4 .seg button{height:46px;border:0;border-radius:12px;background:none;font-weight:600;font-size:16px;color:#5C5868}
  #v4 .seg button.on{background:var(--card);color:var(--tinta);font-weight:700;box-shadow:0 1px 3px rgba(30,35,80,.08)}
  #v4 .semana{display:grid;grid-template-columns:repeat(7,1fr);gap:4px;padding:6px 10px 14px}
  #v4 .semana button{border:0;background:none;border-radius:12px;padding:8px 0;display:flex;flex-direction:column;align-items:center;gap:4px;position:relative}
  #v4 .semana span{font-size:13px;color:var(--mute)} #v4 .semana b{font-size:19px;font-weight:700}
  #v4 .semana button.on{background:var(--navy);color:#fff} #v4 .semana button.on span{color:#C9CCE6}
  #v4 .semana button.pt::after{content:"";position:absolute;bottom:4px;width:5px;height:5px;border-radius:50%;background:var(--oliva2)}
  #v4 .semana button.on.pt::after{background:#E2E8A8}
  #v4 .mesh{display:flex;align-items:center;justify-content:space-between;padding:14px 18px 4px;font-weight:700;font-size:16px}
  #v4 .mesh button{border:0;background:none;padding:4px;color:var(--mute)}
  #v4 .circ{width:26px;height:26px;border-radius:50%;border:2px solid #B7B1A6;flex:none;background:none;padding:0;display:grid;place-items:center}
  #v4 .circ.ok{background:var(--oliva);border-color:var(--oliva);color:#fff}
  #v4 .circ .i{width:16px;height:16px}
  #v4 .rec2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}
  #v4 .rec2 .box .row{padding:14px;gap:12px} #v4 .rec2 .go{display:none}
  #v4 .skills{display:grid;grid-template-columns:1fr 1fr;gap:12px}
  #v4 .sk{background:var(--card);border:1px solid var(--linea);border-radius:18px;padding:14px;text-align:left;display:flex;flex-direction:column;gap:10px;min-height:118px}
  #v4 .sk b{font-size:15.5px;line-height:20px}
  #v4 .sk small{font-size:13px;color:var(--mute);line-height:18px;margin-top:-6px}
  #v4 .sk .pie2{margin-top:auto}
  #v4 .rep{background:linear-gradient(160deg,#252B5C,#1B2049);color:#fff;border-radius:22px;padding:20px 20px 16px}
  #v4 .rep .top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
  #v4 .rep .big{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:58px;line-height:1;letter-spacing:-2px}
  #v4 .rep .lab{font-size:16px;color:rgba(255,255,255,.88);margin-top:6px}
  #v4 .chip{display:inline-flex;align-items:center;gap:5px;background:rgba(255,255,255,.13);border-radius:9px;padding:6px 10px;font-weight:700;font-size:14px;color:#E2E8A8;white-space:nowrap}
  #v4 .chip.mal{color:#F4B6C4} #v4 .chip .i{width:16px;height:16px}
  #v4 .cmp{display:grid;grid-template-columns:auto 76px;gap:6px 10px;align-items:center;margin-top:12px;font-size:12.5px;color:rgba(255,255,255,.75)}
  #v4 .cmp i{display:block;height:5px;border-radius:3px;background:#E2E8A8} #v4 .cmp i.p{background:#8F97C9}
  #v4 .rep .sub{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(255,255,255,.16);margin-top:16px;padding-top:14px}
  #v4 .rep .sub>div{min-width:0} #v4 .rep .sub>div+div{border-left:1px solid rgba(255,255,255,.16);padding-left:16px}
  #v4 .rep .n{color:#fff;flex-wrap:wrap;row-gap:4px;display:flex;align-items:center;gap:8px;font-size:30px;font-weight:700;letter-spacing:-1px;line-height:36px;white-space:nowrap}
  #v4 .rep .n small{font-size:14px;letter-spacing:0;opacity:.8}
  #v4 .rep .n .mini{font-size:12px;letter-spacing:0;background:rgba(255,255,255,.13);border-radius:7px;padding:3px 7px;color:#E2E8A8}
  #v4 .rep .n .mini.mal{color:#F4B6C4}
  #v4 .rep .sl{font-size:14.5px;color:rgba(255,255,255,.86);margin-top:2px}
  #v4 .rep .vs{border-top:1px solid rgba(255,255,255,.16);margin-top:14px;padding-top:12px;font-size:12.5px;color:rgba(255,255,255,.75)}
  #v4 .exp{display:flex;gap:14px;align-items:flex-start;padding:16px}
  #v4 .exp p{padding-top:10.5px;margin:0;font-size:15.5px;line-height:23px;color:#3A3848}
  #v4 .exp p b{color:var(--tinta)}
  #v4 .exp .tile{margin-top:-10px}
  #v4 .hacer{background:#EDEEDF;border:1px solid #DFE1C9;border-radius:20px;padding:18px}
  #v4 .hacer .kk{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;letter-spacing:1.3px;color:#4B4E25;text-transform:uppercase}
  #v4 .hacer .kk .i{width:17px;height:17px}
  #v4 .hacer h3{font-family:"Playfair Display",Georgia,serif;font-size:27px;line-height:1.12;margin:10px 0 14px;font-weight:700}
  #v4 .hacer .bt{display:inline-flex}
  #v4 .pieR{display:flex;align-items:center;justify-content:space-between;margin-top:18px}
  #v4 .ig{padding:18px}
  #v4 .ig .k{display:flex;align-items:center;gap:10px;font-weight:700;font-size:16px}
  #v4 .ig .k .tile{width:38px;height:38px;border-radius:10px}
  #v4 .ig .k .estado{margin-left:auto}
  #v4 .ig .big{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:56px;line-height:1;letter-spacing:-2px;margin:16px 0 0;display:flex;align-items:baseline;gap:10px}
  #v4 .ig .big small{font-family:"DM Sans",sans-serif;font-size:17px;letter-spacing:0;color:var(--mute);font-weight:500}
  #v4 .bar2{height:9px;border-radius:5px;background:#ECE6DB;overflow:hidden;margin-top:16px} #v4 .bar2 i{display:block;height:100%;background:var(--oliva2);border-radius:5px}
  #v4 .ig .falt{display:flex;align-items:center;justify-content:space-between;margin-top:10px;font-size:14.5px;color:var(--mute)}
  #v4 .dgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
  #v4 .dt{background:var(--card);border:1px solid var(--linea);border-radius:16px;padding:14px;display:flex;flex-direction:column;gap:3px;min-width:0}
  #v4 .dt b{font-size:22px;font-weight:700;letter-spacing:-.5px;line-height:28px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  #v4 .dt small{font-size:13.5px;color:var(--mute);line-height:18px;margin-bottom:8px}
  #v4 .dt b.ch{font-size:17px}
  #v4 .dd{align-self:flex-start;margin-top:auto;font-size:12px;font-weight:700;background:var(--salvia);color:#4B4E25;border-radius:7px;padding:3px 7px}
  #v4 .dd.mal{background:var(--rosa);color:var(--vino)}
  #v4 .evo{padding:16px 14px 12px} #v4 .bars{display:flex;align-items:flex-end;gap:6px;height:150px}
  #v4 .bars>div{flex:1;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:5px;min-width:0}
  #v4 .bars i{display:block;width:100%;max-width:30px;border-radius:7px 7px 3px 3px;background:var(--oliva2)} #v4 .bars>div:last-child i{background:var(--navy)}
  #v4 .bars span{font-size:11.5px;font-weight:700;color:#4B4958} #v4 .bars small{font-size:11px;color:var(--suave);white-space:nowrap}
  #v4 .sub2{font-size:13px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#4B4E25;margin:18px 2px 10px}
  #v4 .bars.mini{height:64px;gap:4px;margin-top:16px} #v4 .bars.mini i{border-radius:4px 4px 2px 2px;max-width:none}
  #v4 .pie3{margin:10px 2px 0;font-size:13px;color:var(--suave)}
  #v4 .pb{display:block;height:5px;border-radius:3px;background:#ECE6DB;margin-top:7px;overflow:hidden} #v4 .pb i{display:block;height:100%;background:var(--oliva2)}
  #v4 .falt b{color:var(--tinta)}
  #v4 .cta4 .c1{display:flex;align-items:center;gap:14px;padding:16px 16px 12px}
  #v4 .cta4 .c1 .tx{flex:1;min-width:0} #v4 .cta4 .c1 b{display:block;font-size:16.5px;line-height:22px} #v4 .cta4 .c1 small{display:block;font-size:14.5px;color:var(--mute);line-height:20px;margin-top:2px}
  #v4 .estado.mal{background:var(--rosa);color:var(--vino)}
  #v4 .led{display:inline-block;width:8px;height:8px;border-radius:50%;background:#5E8A3A;margin-right:6px;vertical-align:1px} #v4 .estado.mal .led{background:var(--vino)}
  #v4 .cta4 .cn{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 12px} #v4 .cta4 .cn span{background:#EEE8DE;border-radius:8px;padding:5px 9px;font-size:13px;font-weight:600;color:#4B4958}
  #v4 .cta4 .c2{padding:0 16px} #v4 .cta4 .dt{background:#F6F1EA} #v4 .cta4 .dt.hi{background:var(--navy);border-color:var(--navy)} #v4 .cta4 .dt.hi b{color:#fff} #v4 .cta4 .dt.hi small{color:#C9CCE6}
  #v4 .cta4 .dt small{margin-bottom:0}
  #v4 .cta4 .como{margin:12px 16px 10px;font-size:14px;line-height:21px;color:var(--mute)}
  #v4 .dest{background:linear-gradient(160deg,#252B5C,#1B2049);color:#fff;border-radius:22px;padding:18px 18px 16px;margin-top:4px}
  #v4 .dest .k,#v4 .mesp .k{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;letter-spacing:1.3px;text-transform:uppercase;color:#E2E8A8}
  #v4 .dest .k .i{width:17px;height:17px} #v4 .dest .k span{margin-left:auto;color:rgba(255,255,255,.7);letter-spacing:.5px}
  #v4 .dest .g,#v4 .mesp .g{display:grid;grid-template-columns:1fr 1fr;gap:16px 14px;margin-top:14px}
  #v4 .dest b,#v4 .mesp b{display:block;font-family:"Playfair Display",Georgia,serif;font-size:30px;line-height:34px;letter-spacing:-.5px}
  #v4 .dest small,#v4 .mesp small{display:block;font-size:14px;color:rgba(255,255,255,.85);line-height:19px;margin-top:2px}
  #v4 .dest em{display:inline-block;font-style:normal;font-size:12px;font-weight:700;background:rgba(255,255,255,.13);color:#E2E8A8;border-radius:7px;padding:3px 7px;margin-top:6px} #v4 .dest em.mal{color:#F4B6C4}
  #v4 .mesp{background:var(--navy);color:#fff;border-radius:22px;padding:18px;margin-top:14px} #v4 .mesp .k{color:#fff}
  #v4 .mesp p{margin:16px 0 0;padding-top:14px;border-top:1px solid rgba(255,255,255,.16);font-size:14px;line-height:21px;color:rgba(255,255,255,.82)}
  #v4 .perh{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:26px 0 10px} #v4 .perh span{font-size:12.5px;font-weight:700;letter-spacing:1.2px;color:#5C5868;text-transform:uppercase;white-space:nowrap}
  #v4 .redes{display:flex;gap:8px;margin-bottom:12px;overflow-x:auto} #v4 .redes button{flex:1;min-width:max-content;height:44px;border-radius:22px;border:1px solid var(--linea);background:var(--card);font-size:15.5px;color:#4B4958;padding:0 16px}
  #v4 .redes button.on{background:var(--vino);border-color:var(--vino);color:#fff;font-weight:700}
  #v4 .pbig{background:var(--card);border:1px solid var(--linea);border-radius:20px;padding:16px;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px;align-items:center}
  #v4 .pbig .n{font-family:"Playfair Display",Georgia,serif;font-weight:700;font-size:40px;line-height:44px;letter-spacing:-1px}
  #v4 .pbig small{display:block;font-size:15px;color:var(--mute)} #v4 .pbig em{display:inline-flex;align-items:center;gap:4px;font-style:normal;font-weight:700;font-size:15px;color:#4E7A2C;margin-top:12px} #v4 .pbig em.mal{color:var(--vino)} #v4 .pbig em .i{width:17px;height:17px}
  #v4 .pbig p{margin:2px 0 0;font-size:14px;color:var(--suave)} #v4 .pbig .sp svg{width:100%;height:96px;display:block}
  #v4 .pm{background:var(--card);border:1px solid var(--linea);border-radius:18px;padding:14px;display:flex;flex-direction:column}
  #v4 .pm b{font-family:"Playfair Display",Georgia,serif;font-size:26px;line-height:30px;letter-spacing:-.5px;white-space:nowrap} #v4 .pm small{font-size:13.5px;color:var(--mute);line-height:18px}
  #v4 .bb{display:flex;align-items:flex-end;gap:5px;height:56px;margin-top:14px} #v4 .bb i{flex:1;border-radius:4px 4px 2px 2px;display:block}
  #v4 .v4clasico .ventaBox{background:var(--card);border:1px solid var(--linea);border-radius:18px;padding:16px;margin-bottom:12px;font-family:inherit}
  #v4 .costo{text-align:right;flex:none} #v4 .costo b{font-size:17px} #v4 .costo small{font-size:12.5px}
  #v4 .hall{display:flex;gap:14px;align-items:flex-start;padding:16px}
  #v4 .hall .tile{margin-top:0} #v4 .hall>span:last-child{padding-top:8px} #v4 .hall b{display:block;font-size:16.5px;line-height:22px} #v4 .hall p{margin:3px 0 0;font-size:15px;line-height:22px;color:#4B4958}
  #v4 .hall+.hall{border-top:1px solid var(--linea)}
  #v4 .forHero{background:linear-gradient(150deg,#5B6234,#3F4526);color:#fff;border-radius:22px;padding:22px;position:relative;overflow:hidden}
  #v4 .forHero h3{font-family:"Playfair Display",Georgia,serif;font-size:30px;line-height:1.1;margin:0;font-weight:700}
  #v4 .forHero .n{font-size:30px;font-weight:700;margin-top:10px} #v4 .forHero .n small{font-size:15px;font-weight:500;opacity:.9;margin-left:6px}
  #v4 .forHero .barra{background:rgba(255,255,255,.2)}
  #v4 .forHero .decor{position:absolute;right:-18px;top:-10px;width:160px;opacity:.18}
  #v4 .seguir{display:grid;grid-template-columns:130px 1fr;background:var(--card);border:1px solid var(--linea);border-radius:20px;overflow:hidden;text-align:left;padding:0;width:100%}
  #v4 .seguir img{width:100%;height:100%;object-fit:cover;min-height:120px}
  #v4 .seguir .tx{padding:16px}
  #v4 .seguir .kk{font-size:11.5px;font-weight:700;letter-spacing:1.2px;color:#4B4E25;text-transform:uppercase}
  #v4 .seguir h3{font-family:"Playfair Display",Georgia,serif;font-size:21px;line-height:1.15;margin:6px 0 8px;font-weight:700}
  #v4 .acc{border-top:1px solid var(--linea)}
  #v4 .acc .cl{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:11px 16px 11px 74px;font-size:14.5px;color:#4B4958;width:100%;background:none;border:0;text-align:left}
  #v4 .acc .cl+.cl{border-top:1px solid #F1ECE3}
  #v4 .acc .cl .i{width:17px;height:17px;color:var(--vino)}
  #v4 .video{position:relative;border-radius:20px;overflow:hidden;background:#000;aspect-ratio:16/10}
  #v4 .video img,#v4 .video iframe{width:100%;height:100%;object-fit:cover;border:0;display:block}
  #v4 .video button{position:absolute;inset:0;margin:auto;width:70px;height:70px;border-radius:50%;background:var(--navy);border:3px solid rgba(255,255,255,.85);color:#fff;display:grid;place-items:center}
  #v4 .video button .i{width:28px;height:28px;margin-left:4px}
  #v4 .tres{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}
  #v4 .tres .bt{height:48px;font-size:15px;padding:0 8px;gap:7px}
  #v4 .apl{background:linear-gradient(160deg,#252B5C,#1B2049);color:#fff;border-radius:20px;padding:18px 20px;margin-top:14px}
  #v4 .apl .kk{display:flex;align-items:center;gap:8px;font-size:12.5px;font-weight:700;letter-spacing:1.3px;color:#E2E8A8}
  #v4 .apl .kk .i{width:17px;height:17px}
  #v4 .apl .row0{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-top:12px}
  #v4 .apl .v{font-family:"Playfair Display",Georgia,serif;font-size:46px;font-weight:700;line-height:1;letter-spacing:-1px} #v4 .apl .v small{font-family:"DM Sans",sans-serif;font-size:16px;font-weight:700;margin-right:6px;letter-spacing:0}
  #v4 .apl .l{font-size:15px;color:rgba(255,255,255,.88);margin-top:6px}
  #v4 .apl .pie{display:flex;justify-content:space-between;align-items:center;border-top:1px solid rgba(255,255,255,.16);margin-top:14px;padding-top:12px;font-size:13.5px;color:rgba(255,255,255,.75)}
  #v4 .apl .pie a{color:#E2E8A8;font-weight:700;font-size:15px;text-decoration:none;display:inline-flex;align-items:center;gap:4px}
  #v4 .buscar{display:flex;align-items:center;gap:10px;background:var(--card);border:1px solid var(--linea);border-radius:16px;padding:0 16px;height:54px;margin-bottom:14px}
  #v4 .buscar input{flex:1;border:0;background:none;font:inherit;font-size:16px;outline:none;color:var(--tinta)}
  #v4 .dcard{background:var(--card);border:1px solid var(--linea);border-radius:20px;overflow:hidden}
  #v4 .dcard img{width:100%;height:190px;object-fit:cover;display:block}
  #v4 .dcard .tx{padding:16px 20px 20px}
  #v4 .dcard .kk{font-size:12.5px;font-weight:700;letter-spacing:1.3px;color:#4B4E25;text-transform:uppercase}
  #v4 .dcard h3{font-family:"Playfair Display",Georgia,serif;font-size:32px;line-height:1.08;margin:8px 0 14px;font-weight:700}
  #v4 .dcard .bts{display:flex;gap:10px} #v4 .dcard .bt{height:48px}
  #v4 .chips{display:flex;flex-wrap:wrap;gap:8px} #v4 .chips a{background:#EEE8DE;border-radius:9px;padding:7px 11px;font-weight:700;font-size:13.5px;color:#3E3D2C;text-decoration:none}
  #v4 .perfil{display:flex;align-items:center;gap:16px;padding:18px}
  #v4 .perfil .avg{width:64px;height:64px;border-radius:50%;background:var(--salvia);color:#4B4E25;display:grid;place-items:center;font-weight:700;font-size:22px;flex:none}
  #v4 .perfil b{font-size:18px} #v4 .perfil small{display:block;color:var(--mute);font-size:15px;margin-top:2px}
  #v4 .salir{display:inline-flex;align-items:center;gap:8px;color:var(--vino);font-weight:700;font-size:15.5px;margin-top:20px;text-decoration:none}
  #v4 .salir .i{width:19px;height:19px}
  #v4 .vacio{padding:18px;color:var(--mute);font-size:15px;line-height:22px}
  #v4 nav.v4n{position:fixed;left:0;right:0;bottom:0;z-index:30;background:rgba(253,251,248,.97);backdrop-filter:blur(10px);border-top:1px solid var(--linea);display:grid;grid-template-columns:repeat(4,1fr);padding:8px 8px calc(8px + env(safe-area-inset-bottom,0px));max-width:520px;margin:0 auto}
  #v4 nav.v4n button{border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:5px;font-size:14px;color:#5C5868;font-weight:500;padding:0}
  #v4 nav.v4n button span.ic{width:62px;height:38px;border-radius:19px;display:grid;place-items:center}
  #v4 nav.v4n button.on{color:var(--vino);font-weight:700} #v4 nav.v4n button.on span.ic{background:var(--rosa)}
  #v4 .hoja{position:fixed;inset:0;z-index:60;background:rgba(20,22,40,.45);display:flex;align-items:flex-end;justify-content:center}
  #v4 .hoja .cj{background:var(--crema);width:100%;max-width:520px;max-height:88vh;overflow:auto;border-radius:24px 24px 0 0;padding:20px 18px calc(20px + env(safe-area-inset-bottom,0px))}
  #v4 .hoja h2{margin-bottom:12px}
  #v4 .hoja .cerrar{float:right;width:40px;height:40px;border-radius:50%;border:0;background:#EEE8DE;font-size:22px;line-height:40px;padding:0}
  #v4 .hoja input,#v4 .hoja textarea{width:100%;border:1px solid var(--linea);border-radius:14px;padding:14px;font:inherit;font-size:16px;background:var(--card);color:var(--tinta);margin-bottom:10px}
  #v4 .msgs{display:flex;flex-direction:column;gap:10px;min-height:200px;max-height:52vh;overflow:auto;margin:6px 0 12px}
  #v4 .msg{max-width:86%;padding:11px 14px;border-radius:16px;font-size:15px;line-height:22px;white-space:pre-wrap}
  #v4 .msg.ia{background:var(--card);border:1px solid var(--linea);align-self:flex-start} #v4 .msg.yo{background:var(--navy);color:#fff;align-self:flex-end}
  #v4 .chatf{display:flex;gap:8px} #v4 .chatf input{margin:0;flex:1} #v4 .chatf button{width:54px;border:0;border-radius:14px;background:var(--navy);color:#fff;display:grid;place-items:center}
  #v4 .nota{font-size:13px;color:var(--suave);margin-top:14px;text-align:right}
  `;

  // ---------- estado ----------
  let D=null, TAB=LS('tab')||'inicio', SUBM=LS('subm')||'reporte', SUBF=LS('subf2')||'drops', DROPS=[], TJ=null, CTA=null, FECHAS=[], WEBS=[], NOT=[], DIA_SEL=null, CHAT=[], USOW=null;
  const CLASES=[['Modelo de negocio','maletin',[['HE8pjQ0pbV8','Presentación de la Formación'],['1IWynYu2gRI','Tu arte como negocio digital'],['sgggTfqdWjk','Pensá un producto como artista'],['t711FU0w5yk','Ordená tus objetivos y próximos pasos']]],
    ['Comunicación','burbuja',[['84f7zYFQp3E','Excel de negocio: ingresos y gastos'],['8iI_anZtXpQ','Comunicá tu identidad'],['oo9d7a-02xw','Mostrá tu producto para que conecte'],['SN7WmmLunLY','Contenidos sostenibles']]],
    ['Publicidad','megafono',[['ozn7ch2Ui3k','Campaña de lanzamiento: Spotify, Meta y YouTube'],['tv8hQXAMwKc','Configurá Ads Manager y Business Manager'],['Ec_YHoGOq34','Conseguí más seguidores'],['8ANApErBj2M','Campañas de productos'],['OsvHvTZlTk0','Métricas y proyectiva']]]];
  const TODAS=[]; CLASES.forEach(([m,ic,L])=>L.forEach(([id,t])=>TODAS.push({id,t,m,n:TODAS.length+1})));
  const hechas=()=>{ try{ return JSON.parse(LS('hechas')||'[]'); }catch(e){ return []; } };

  // ---------- datos ----------
  function metricas(){
    const R=(D.reportes||[]).filter(r=>r.metricas).slice().sort((a,b)=>a.hasta<b.hasta?-1:1);
    const U=(R[R.length-1]||{}).metricas||{}, prev=R.slice(-5,-1).map(r=>r.metricas||{});
    const prom=k=>{ const v=prev.map(m=>Number(m[k])).filter(x=>!isNaN(x)&&x!==0); return v.length?v.reduce((a,b)=>a+b,0)/v.length:null; };
    const ult=k=>{ for(let i=R.length-1;i>=0;i--){ const v=(R[i].metricas||{})[k]; if(v!=null) return Number(v); } return null; };
    const inf=[...R].reverse().map(r=>r.metricas.informe).find(Boolean)||null;
    return {R,U,prom,ult,inf,desde:(R[R.length-1]||{}).desde,hasta:(R[R.length-1]||{}).hasta};
  }
  const pct=(v,p)=>(v==null||!p)?null:Math.round((v-p)*100/Math.abs(p));
  const chip=(p,menos)=>{ if(p==null) return ''; const bien=(p>=0)!==!!menos; return `<span class="chip ${bien?'':'mal'}">${I(p>=0?'sube':'baja')}${p>0?'+':''}${p}%</span>`; };
  const SIM=()=>((D.cliente||{}).moneda==='USD'?'USD':'$');
  const plata=v=>v==null?'—':(SIM()==='USD'?'USD '+nf(v,v<100?2:0):'$ '+nf(v,0));
  const META=()=>{ const H=(D.hitos||[]).filter(x=>x.metrica==='ig_followers_total').map(x=>Number(x.objetivo)).sort((a,b)=>a-b); if(!H.length) return null; const t=metricas().ult('ig_followers_total')||0; return H.find(o=>o>t)||H[H.length-1]; };
  const PA={AR:'Argentina',UY:'Uruguay',CL:'Chile',MX:'México',ES:'España',US:'Estados Unidos',CO:'Colombia',PE:'Perú',BR:'Brasil',PY:'Paraguay',BO:'Bolivia',EC:'Ecuador',VE:'Venezuela',IT:'Italia',FR:'Francia',DE:'Alemania',GB:'Reino Unido',CR:'Costa Rica',GT:'Guatemala',DO:'Rep. Dominicana',PA:'Panamá',CU:'Cuba',CA:'Canadá',PT:'Portugal',NL:'Países Bajos',CH:'Suiza',IL:'Israel',AU:'Australia',SV:'El Salvador',HN:'Honduras',NI:'Nicaragua',PR:'Puerto Rico'};

  // ---------- pantallas ----------
  function hd(){ const ini=INI();
    return `<div class="hd"><button class="marca" data-ir="inicio" aria-label="Inicio">${SEMI}<span class="wm">semilla<b>IA</b></span><span class="beta">Beta</span></button>
      <button class="rd" id="v4bell" aria-label="Avisos">${I('campana')}${NOT.some(n=>!n.leida)?'<span class="pt"></span>':''}</button>
      <button class="rd av" data-ir="cuenta" aria-label="Tu cuenta">${esc(ini)}</button></div>`; }

  function scInicio(){
    const M=metricas(), tot=M.ult('ig_followers_total'), meta=META(), nom=SALUDO();
    const hoy=new Date(); const fecha=`${DIA[hoy.getDay()]} ${hoy.getDate()} ${MES[hoy.getMonth()]}`;
    const sup=meta&&tot>=meta;
    const hero=tot!=null?`<div class="hero"><div class="k">${I(sup?'trofeo':'sube')}${sup?`Meta de ${nf(meta)} superada`:'Tu comunidad en Instagram'}</div>
        <div class="orb">${SEMI}</div>
        <div class="big">${nf(tot)}</div><div class="lab">seguidores en Instagram</div>
        ${meta&&!sup?`<div class="barra" style="max-width:62%"><i style="width:${Math.min(100,Math.round(tot*100/meta))}%"></i></div>`:''}
        <div class="pie"><span>${meta?(sup?'Meta alcanzada':`Próxima meta · ${nf(meta)}`):'Seguidores totales'}</span><button data-ir="metricas">Ver mi reporte ${I('ext')}</button></div></div>`:'';
    const prox=agenda().filter(x=>x.f>=hoyISO()).slice(0,2);
    const dr=DROPS[0];
    return `<div class="hola"><h1>Hola, ${esc(nom)}</h1><span class="pill">${I('cal')}${fecha}</span></div>
      ${hero}
      ${bloqueCuenta()}
      <div class="tt"><h2>Próximas fechas</h2><button class="lk" data-ir="proyecto">Ver agenda ${I('chev')}</button></div>
      <div class="box">${prox.length?prox.map(filaAgenda).join(''):`<div class="vacio">No tenés fechas próximas. Sumá una desde Proyecto.</div>`}</div>
      <div class="tt"><h2>Seguí aprendiendo</h2></div>
      <div class="box"><button class="row" data-ir="formacion"><span class="tile">${I('gorro')}</span><span class="tx"><b>Formación Semilla</b><small>13 clases del Método Semilla</small></span><span class="prox">Próximamente</span></button></div>
      ${dr?`<div class="tt" style="margin-top:22px"></div><a class="drop" href="${esc(dr.url)}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit">
        <div class="tx"><div class="kk">Drop del viernes</div><h3>${esc(dr.titulo)}</h3><span class="lk">${dr.audio?"Leé o escuchá":"Leer el drop"} ${I("ext")}</span></div>
        <img src="/drops/img/drop-foto-${(dr.n%3)+1}.jpg" alt=""></a>`:''}
      <div class="dos"><button class="bt" id="v4tarea">${I('mas')}Agregar tarea</button><button class="bt" id="v4chat">${I('chat')}SemillaIA</button></div>`;
  }
  const hoyISO=()=>{ const d=new Date(); return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0'); };
  function agenda(){   // fechas del proyecto + tareas con alarma, ordenadas
    const A=[]; (FECHAS||[]).forEach(f=>A.push({f:String(f.fecha).slice(0,10),t:f.titulo,s:f.lugar||'Fecha',url:f.url}));
    (D.tareas||[]).filter(t=>t.alarma&&t.estado!=='hecha').forEach(t=>A.push({f:String(t.alarma).slice(0,10),t:t.titulo,s:'Tarea'}));
    return A.sort((a,b)=>a.f<b.f?-1:1);
  }
  function filaAgenda(x){ const d=new Date(x.f+'T12:00:00'); const hoy=x.f===hoyISO();
    return `<div class="row"><span class="dia"><span>${DIA[d.getDay()]}</span><b>${d.getDate()}</b></span><span class="tx"><b>${esc(corta(x.t,48))}</b><small>${esc(x.s)}${hoy?' · Hoy':''}</small></span><span class="go">${I('chev')}</span></div>`; }
  function filaTarea(t){ const ok=t.estado==='hecha';
    return `<div class="row tarea"><button class="circ ${ok?'ok':''}" data-hecha="${t.id}" data-est="${ok?'pendiente':'hecha'}" aria-label="${ok?'Marcar como pendiente':'Marcar como hecha'}">${ok?I('check'):''}</button><button class="tx" data-tarea="${t.id}" style="background:none;border:0;padding:0;text-align:left"><b style="${ok?'text-decoration:line-through;color:var(--suave)':''}">${esc(corta(t.titulo,90))}</b><small>${t.creada_por==='semilla'?'Del reporte de Semilla':'Tuya'}${t.alarma?' · Aviso '+fCorta(String(t.alarma).slice(0,10)):''}</small></button><button class="go" data-tarea="${t.id}" aria-label="Editar" style="background:none;border:0;padding:4px">${I('chev')}</button></div>`; }
  const corta=(s,n)=>{ s=String(s||''); return s.length>n?s.slice(0,n).replace(/\s+\S*$/,'')+'…':s; };

  function scProyecto(){
    const base=DIA_SEL?new Date(DIA_SEL+'T12:00:00'):new Date(); const lun=new Date(base); lun.setDate(base.getDate()-((base.getDay()+6)%7));
    const A=agenda(), sel=DIA_SEL||hoyISO();
    const dias=[...Array(7)].map((_,i)=>{ const d=new Date(lun); d.setDate(lun.getDate()+i); const iso=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
      return `<button data-dia="${iso}" class="${iso===sel?'on':''} ${A.some(x=>x.f===iso)?'pt':''}"><span>${DIA[d.getDay()]}</span><b>${d.getDate()}</b></button>`; }).join('');
    const MESL=['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][base.getMonth()];
    const delDia=A.filter(x=>x.f>=sel).slice(0,3);
    const pend=(D.tareas||[]).filter(t=>t.estado!=='hecha'), hech=(D.tareas||[]).filter(t=>t.estado==='hecha'), verT=LS('vertodas')==='1';
    const SK=[['Lanzamientos','cohete','Landing y campaña de cada lanzamiento'],['Playlists','musica','Curadores para tu música'],['Shows y entradas','ticket','Tus fechas con venta de entradas'],
      ['Clips de tu videoclip','clip','4 recortes listos para redes'],['Reels','camara','Ideas y guiones de reels']];
    return `<h1>Tu proyecto</h1>
      <div class="tt" style="margin-top:6px"><h2>Agenda</h2><button class="bt" id="v4fecha" style="height:46px;background:var(--salvia);border-color:transparent">${I('mas')}Agregar</button></div>
      <div class="box"><div class="mesh"><span>${MESL}</span><span><button data-sem="-7" aria-label="Semana anterior">${I('atras')}</button><button data-sem="7" aria-label="Semana siguiente">${I('chev')}</button></span></div><div class="semana">${dias}</div></div>
      <div class="box" style="margin-top:12px">${delDia.length?delDia.map(filaAgenda).join(''):`<div class="vacio">Nada agendado desde este día.</div>`}</div>
      <div class="tt"><h2>Tareas</h2>${pend.length>3?`<button class="lk" id="v4vt">${verT?'Ver menos':'Ver todas'} ${I('chev')}</button>`:''}</div>
      <div class="box">${pend.length?(verT?pend:pend.slice(0,3)).map(filaTarea).join(''):`<div class="vacio">No tenés tareas pendientes.</div>`}
        <button class="row" id="v4nt" style="color:var(--vino)"><span class="circ" style="border-style:dashed;border-color:var(--vino);color:var(--vino)">${I('mas')}</span><span class="tx"><b style="color:var(--vino)">Nueva tarea</b></span></button></div>
      ${hech.length?`<button class="lk" id="v4vh" style="margin-top:12px">${LS('verhechas')==='1'?'Ocultar':'Ver'} hechas (${hech.length}) ${I('chev')}</button>${LS('verhechas')==='1'?`<div class="box" style="margin-top:10px">${hech.map(filaTarea).join('')}</div>`:''}`:''}
      <div class="tt"><h2>Tus webs</h2></div>
      <div class="box">${WEBS.length?WEBS.map(w=>`<a class="row" href="${esc(w.url)}${w.url.includes('?')?'&':'?'}editar=${encodeURIComponent(w.slug||slug)}&k=${encodeURIComponent(tok)}" target="_blank" rel="noopener"><span class="tile c">${I('web')}</span><span class="tx"><b>${esc(w.titulo||w.nombre||w.url.replace(/^https?:\/\//,'').replace(/\/$/,''))}</b><small>${esc(w.url.replace(/^https?:\/\//,'').replace(/\/$/,''))}${USOW?` · ${nf(((USOW.webs||[]).find(x=>x.id===w.id)||{}).n||0)} visitas en 30 días`:''}</small></span><span class="lk">Editá ${I('ext')}</span></a>`).join(''):`<div class="vacio">Todavía no tenés webs con Semilla.</div>`}</div>
      <div class="tt"><h2>Recursos</h2></div>
      ${(document.querySelector('#app .ventaBox')||(D.cliente||{}).ventas_log_on||(D.ventas_log||[]).length)?`<div class="box" style="margin-bottom:12px"><button class="row" id="v4vtas"><span class="tile">${I('bolsa')}</span><span class="tx"><b>Cargar ventas</b><small>Lo que vendiste en el período</small></span><span class="go">${I('chev')}</span></button></div>`:''}
      <div class="rec2"><div class="box"><button class="row" id="v4mat"><span class="tile">${I('folder')}</span><span class="tx"><b>Materiales</b></span><span class="go">${I('chev')}</span></button></div>
        <div class="box"><button class="row" data-prox="Flyers"><span class="tile r">${I('imagen')}</span><span class="tx"><b>Flyers</b></span><span class="go">${I('chev')}</span></button></div></div>
      <div class="tt"><h2>Herramientas</h2></div>
      <div class="skills">${SK.map(([t,ic,s])=>{ const vt=t==='Shows y entradas'?tkUlt():null;
        return vt?`<button class="sk" data-ir="shows"><span class="tile">${I(ic)}</span><b>${t}</b><small>${s}</small><span class="pie2"><span class="prox vivo">${vt.nuevas_semana!=null?nf(vt.nuevas_pauta)+' por la publicidad':nf(vt.total_locs||vt.ventas)+' entradas vendidas'}</span></span></button>`
          :`<button class="sk" data-prox="${esc(t)}"><span class="tile">${I(ic)}</span><b>${t}</b><small>${s}</small><span class="pie2"><span class="prox">Próximamente</span></span></button>`; }).join('')}</div>`;
  }

  function scMetricas(){
    const M=metricas(), tj=TJ&&TJ.hay?TJ:null;
    const per=tj?rango(tj.desde,tj.hasta):rango(M.desde,M.hasta);
    let rep='', CARD='';
    {
      const h0=tj&&tj.hero&&tj.hero[0], h1=tj&&tj.hero&&tj.hero[1], m0=tj&&tj.minis&&tj.minis[0];
      const pInt=s=>s?parseInt(String(s).replace('+',''),10):null;
      const p0=h0?pInt(h0.delta):null;
      const ancho=p0==null?60:Math.max(20,Math.min(100,Math.round(100/(1+Math.max(-0.9,p0/100))*(1+Math.max(-0.9,p0/100))>100?100:60*(1+p0/100))));
      const sub=(x,menos)=>{ if(!x) return ''; const v=String(x.valor||''); const pre=x.prefijo||(v.match(/^(USD|\$)\s/)||[])[1]||''; const num=v.replace(/^(USD|\$)\s/,'');
        const d=x.delta?`<span class="mini ${x.bien===false?'mal':''}">${esc(x.delta)}</span>`:(x.sub&&/promedio/.test(x.sub)?`<span class="mini">${(/menos/.test(x.sub)?'-':'+')+esc(x.sub.match(/\d+%/)[0])}</span>`:'');
        return `<div><div class="n">${pre?`<small>${esc(pre)}</small>`:''}${esc(num)}${d}</div><div class="sl">${esc(x.label||x.titulo||'')}</div></div>`; };
      const hall=M.inf&&(M.inf.hallazgos||[])[0], ht=hall?(typeof hall==='object'?hall.t:hall):'';
      const acc=tj&&tj.acciones&&tj.acciones[0];
      CARD=`<div class="tt" style="margin-top:4px"><h2>${SUBM==='reporte'?'Tu reporte':'Lo destacado'}</h2>${per?`<span class="pill">${I('cal')}${per}</span>`:''}</div>
        ${h0?`<div class="rep"><div class="top"><div><div class="big">${esc(h0.prefijo?h0.prefijo+' ':'')}${esc(h0.valor)}</div><div class="lab">${esc(cap(h0.label))}</div></div>
          <div style="text-align:right">${h0.delta?`<span class="chip ${h0.bien===false?'mal':''}">${I(String(h0.delta).startsWith('-')?'baja':'sube')}${esc(h0.delta)}</span>`:''}
          ${p0!=null?`<div class="cmp"><span>Este período</span><i style="width:${Math.max(18,Math.min(76,Math.round(76*Math.min(1,(100+p0)/Math.max(100,100+p0)))))}px"></i><span>Promedio</span><i class="p" style="width:${Math.max(18,Math.min(76,Math.round(76*Math.min(1,100/Math.max(100,100+p0)))))}px"></i></div>`:''}</div></div>
          <div class="sub">${sub(h1)}${sub(m0)}</div><div class="vs">Cambios vs. el promedio ${tj.cadencia&&tj.cadencia>8?'de los 4 reportes anteriores':'de las últimas 4 semanas'}</div></div>`:`<div class="box"><div class="vacio">Tu primer reporte se arma con la próxima medición.</div></div>`}`;
      if(SUBM==='reporte') rep=`${CARD}
        ${ht?`<div class="tt"><h2>Qué explica el cambio</h2></div><div class="box exp"><span class="tile" style="margin-top:0">${I('foco')}</span><p>${escB(ht)}</p></div>`:''}
        ${acc?`<div class="hacer" style="margin-top:16px"><div class="kk">${I('lista')}Qué hacer ${tj.cadencia&&tj.cadencia>8?'ahora':'esta semana'}</div><h3>${esc(acc.titulo)}</h3><button class="bt n" data-agendar="${esc(acc.titulo)}">${I('cal')}Agendar esta prueba</button></div>`:''}
        <button class="bt n" data-subm="datos" style="width:100%;margin-top:16px">${I('barras')}Métricas completas</button>
        <div class="pieR"><button class="lk" id="v4an">Ver análisis completo ${I('flecha')}</button><a class="bt" href="${W}/tarjeta?c=${encodeURIComponent(slug)}&k=${encodeURIComponent(tok)}" download="reporte.jpg" target="_blank" style="height:46px">${I('bajar')}Descargar</a></div>`;
    }
    if(SUBM!=='reporte'){
      const U=M.U, tot=M.ult('ig_followers_total'), nue=U.ig_followers_nuevos, meta=META();
      const LAB={ig_followers_nuevos:['Seguidores nuevos','n'],ig_alcance:['Alcance en Instagram','n'],ig_visitas:['Visitas al perfil','n'],ig_costo_follower:['Costo por seguidor','$2'],ig_inversion:['Invertido en seguidores','$'],
        frm_visitas:['Visitas a la web','n'],frm_clics:['Clics al link','n'],frm_alcance:['Alcance de la campaña web','n'],frm_mensajes:['Mensajes','n'],frm_costo_visita:['Costo por visita','$2'],frm_inversion:['Invertido en la web','$'],
        pres_gastado:['Invertido en el período','$'],ig_inversion_diaria:['Inversión diaria en seguidores','$'],tk_tickets:['Entradas vendidas por la pauta','n'],tk_costo_ticket:['Costo por entrada','$2'],tk_inversion:['Invertido en entradas','$'],tk_roas:['Retorno de lo invertido','x'],pres_diario:['Presupuesto diario','$'],sp_oyentes:['Oyentes en Spotify','n'],sp_oyentes_perfil:['Oyentes del perfil','n'],sp_seguidores:['Seguidores en Spotify','n'],sp_streams:['Reproducciones','n'],
        yt_subs:['Suscriptores en YouTube','n'],yt_subs_nuevos:['Suscriptores nuevos','n'],yt_vistas:['Vistas en YouTube','n'],vta_ventas:['Ventas','n'],vta_costo_venta:['Costo por venta','$2'],msj_mensajes:['Conversaciones','n'],msj_costo_mensaje:['Costo por conversación','$2']};
      const val=(k,t)=>{ const v=Number(U[k]); return t==='n'?nf(v):t==='x'?nf(v,2)+'x':SIM()==='USD'?'USD '+nf(v,t==='$2'?2:(v<100?2:0)):'$ '+nf(v,0); };
      const grupos=[['Entradas'+(U.tk_nombre?' · '+U.tk_nombre:''),'ticket','',k=>/^tk_[a-z]+$/.test(k)&&!/^tk_p\d/.test(k)],['Instagram','camara','r',k=>/^ig_/.test(k)],['Web y Formación','web','c',k=>/^frm_/.test(k)],['Spotify','musica','',k=>/^sp_/.test(k)],['YouTube','clip','r',k=>/^yt_/.test(k)],['Ventas y mensajes','bolsa','',k=>/^(vta|msj)_/.test(k)],['Inversión','billetera','c',k=>/^pres_/.test(k)]];
      const tiles=f=>Object.keys(LAB).filter(k=>f(k)&&U[k]!=null&&k!=='ig_followers_total').map(k=>{ const pp=pct(Number(U[k]),M.prom(k)), menos=/costo/.test(k);
        return `<div class="dt"><b>${val(k,LAB[k][1])}</b><small>${LAB[k][0]}</small>${pp!=null&&!/^pres_/.test(k)?`<span class="dd ${((pp>=0)!==menos)?'':'mal'}">${pp>0?'+':''}${pp}% vs. promedio</span>`:''}</div>`; }).join('');
      const H=M.R.filter(r=>r.metricas.ig_followers_total!=null).slice(-8), mx=Math.max(...H.map(r=>Number(r.metricas.ig_followers_total))), mn=Math.min(...H.map(r=>Number(r.metricas.ig_followers_total)));
      const evo=H.length>1?`<div class="tt"><h2>Cómo creció</h2></div><div class="box evo"><div class="bars">${H.map(r=>{ const v=Number(r.metricas.ig_followers_total); return `<div><span>${nf(v/1000,1)}k</span><i style="height:${Math.round(18+82*(v-mn)/Math.max(1,mx-mn))}%"></i><small>${fCorta(r.hasta)}</small></div>`; }).join('')}</div><p class="pie3">Seguidores en Instagram al cierre de cada reporte</p></div>`:'';
      const CJ=(CTA&&CTA.conjuntos)||[], P=CTA&&CTA.pago;
      const lista=(L,n)=>{ L=L.map(z=>({...z,nombre:PA[z.nombre]||z.nombre}));  const t=Number(U.ig_followers_total)||0, m=Math.max(...L.map(z=>Number(z.seguidores)||0))||1; return `<div class="box">${L.slice(0,10).map(z=>`<div class="row"><span class="tx"><b>${esc(z.nombre)}</b><span class="pb"><i style="width:${Math.max(3,Math.round((Number(z.seguidores)||0)*100/m))}%"></i></span></span><span class="costo"><b>${z.seguidores==null?'—':nf(z.seguidores)}</b>${t&&z.seguidores?`<small>${nf(z.seguidores*100/t,1)}%</small>`:''}</span></div>`).join('')}</div>`; };
      const paises=M.R.slice().reverse().map(r=>r.metricas.ig_paises).find(x=>x&&x.length), ciudades=M.R.slice().reverse().map(r=>r.metricas.ig_ciudades||r.metricas.ig_ciudades_camp).find(x=>x&&x.length);
      rep=`${CARD}${resumenMes()}${panelPeriodo()}
        ${bloqueWeb()}
        <div class="tt"><h2>Todos los números</h2></div>
        ${grupos.map(([t,ic,c,f])=>{ const x=tiles(f); return x?`<div class="sub2">${t}</div><div class="dgrid">${x}</div>`:''; }).join('')}
        ${metas()}
        ${paises?`<div class="tt"><h2>Dónde están tus seguidores</h2></div><div class="sub2" style="margin-top:0">Países</div>${lista(paises)}`:''}
        ${ciudades?`<div class="sub2">Ciudades</div>${lista(ciudades)}`:''}
        ${CJ.length?`<div class="tt"><h2>Públicos de anuncios</h2>${CTA.act?`<a class="lk" href="https://adsmanager.facebook.com/adsmanager/manage/adsets?act=${encodeURIComponent(CTA.act)}" target="_blank" rel="noopener">Ver en Meta ${I('ext')}</a>`:''}</div>
          <div class="box">${CJ.map(z=>`<div class="row"><span class="tile ${z.resultado==='ventas'?'':'c'}">${I(z.resultado==='ventas'?'bolsa':'gente')}</span><span class="tx"><b>${esc(z.nombre)}</b><small>${nf(z.resultados)} ${esc(z.resultado||'resultados')} · ${nf(z.alcance)} de alcance · ${plata(z.diaria)} por día</small></span><span class="costo"><b>${z.costo!=null?plata(z.costo):'—'}</b><small>${esc(z.por||'')}</small></span></div>`).join('')}</div>`:''}
        ${P?`<div class="tt"><h2>Cuenta publicitaria</h2></div><div class="dgrid">
          <div class="dt"><b>${plata(P.inversion_diaria)}</b><small>Inversión por día</small></div><div class="dt"><b>${plata(P.hoy)}</b><small>Gastado hoy</small></div>
          ${P.saldo!=null?`<div class="dt"><b>${plata(P.saldo)}</b><small>A pagar en el próximo cobro</small></div>`:''}<div class="dt"><b class="ch">${esc(P.metodo||'—')}</b><small>Medio de pago</small></div></div>`:''}`;
    }
    return `<h1>Métricas</h1><div class="seg"><button data-subm="reporte" class="${SUBM==='reporte'?'on':''}">Reporte</button><button data-subm="datos" class="${SUBM==='datos'?'on':''}">Métricas completas</button></div>${rep}`;
  }
  // 17/11: estado de la cuenta publicitaria en Inicio (clave para Agus): activa, campañas, inversión diaria, saldo y cuándo se cobra
  function bloqueCuenta(){ if(!CTA||!CTA.hay) return '';
    const DS=['dom','lun','mar','mié','jue','vie','sáb'], fch=f=>{ const x=new Date(String(f).slice(0,10)+'T12:00:00'); return DS[x.getDay()]+' '+x.getDate()+' '+MES[x.getMonth()]; };
    const una=(c,titulo)=>{ const P=c.pago||{}, us=P.moneda==='USD', pl=v=>v==null?'—':us?'USD '+nf(v,2):'$ '+nf(v,0), met=String(P.metodo||'').replace(/\s*\*+\s*/,' ••'), px=P.proximo, N=(c.nombres||[]).filter(Boolean);
      const est=c.activa?'Activa':cap(c.estado||'');
      const como=P.prepago?'Cuenta prepaga: se descuenta de los fondos cargados.':P.diario?`Se cobra todos los días${met?' a la '+esc(met):''}${P.umbral!=null?`, o antes si el saldo llega a ${pl(P.umbral)}`:''}.`
        :`Se cobra sola${met?' a la '+esc(met):''} cuando el saldo llega ${P.umbral!=null?'a '+pl(P.umbral):'al límite que fija Meta'}${P.fecha_ciclo?` o el ${fch(P.fecha_ciclo)}, lo que pase primero`:''}.`;
      return `<div class="box cta4"><div class="c1"><span class="tile ${c.activa?'':'r'}">${I('megafono')}</span><span class="tx"><b>${esc(titulo)}</b><small>${nf(c.campanas||0)} ${c.campanas===1?'campaña corriendo':'campañas corriendo'}</small></span><span class="estado ${c.activa?'':'mal'}"><i class="led"></i>${esc(est)}</span></div>
        ${N.length?`<div class="cn">${N.map(z=>`<span>${esc(z)}</span>`).join('')}</div>`:''}
        <div class="dgrid c2">${P.inversion_diaria!=null?`<div class="dt"><b>${pl(P.inversion_diaria)}</b><small>Inversión por día</small></div>`:''}
          ${px&&!P.prepago?`<div class="dt hi"><b>${fch(px.fecha)}</b><small>Próximo cobro · ${pl(px.monto)}${px.aprox?' aprox.':''}</small></div>`:P.saldo!=null?`<div class="dt"><b>${pl(P.saldo)}</b><small>Saldo a pagar</small></div>`:''}</div>
        ${P.saldo!=null||P.umbral!=null?`<p class="como">${P.saldo!=null&&px?`Hoy el saldo es de ${pl(P.saldo)}. `:''}${como}</p>`:''}
        ${c.act?`<a class="lk" style="margin:2px 16px 16px" href="https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${encodeURIComponent(c.act)}" target="_blank" rel="noopener">Abrir en Meta ${I('ext')}</a>`:''}</div>`; };
    const L=(CTA.cuentas||[]).length>1?CTA.cuentas:[CTA];
    return `<div class="tt"><h2>${L.length>1?'Tus cuentas publicitarias':'Cuenta publicitaria'}</h2></div>${L.map((c,i)=>una(c,L.length>1?(c.nombre||'Cuenta '+(i+1)):'Anuncios en Meta')).join('<div style="height:12px"></div>')}`; }
  /* 17/11: ticketera (Berco). La VM lee las entradas por función cada martes; María marca los invitados en una página aparte. */
  function tkUlt(){ return Object.values((D.cliente||{}).ventas||{}).filter(x=>x&&x.tipo==='ticketera'&&Array.isArray(x.funciones)).sort((a,b)=>String(a.captura||a.actualizado)<String(b.captura||b.actualizado)?-1:1).pop()||null; }
  function scShows(){ return `<button class="vol" data-ir="proyecto">${I('atras')}Volver a tu proyecto</button><h1>Shows y entradas</h1>${tkBloque()||'<div class="box"><div class="vacio">Todavía no hay entradas para mostrar.</div></div>'}`; }
  function tkBloque(){ const VT=tkUlt();
    if(!VT) return ''; const DS=['dom','lun','mar','mié','jue','vie','sáb'], dd=f=>{ const x=new Date(f+'T12:00:00'); return DS[x.getDay()]+' '+String(x.getDate()).padStart(2,'0')+'/'+String(x.getMonth()+1).padStart(2,'0'); };
    const ars=n=>'$ '+nf(Math.round(Number(n)||0)), hoy=new Date().toISOString().slice(0,10);
    const F=VT.funciones.filter(f=>f.fecha>=hoy), P=VT.funciones.filter(f=>f.fecha<hoy);
    const fila=f=>`<div class="row"><span class="tile">${I('ticket')}</span><span class="tx"><b>${dd(f.fecha)}${f.hora?' · '+esc(String(f.hora).replace(/:00$/,''))+' hs':''}</b><small>${ars(f.importe_ars)} vendidos</small></span><span class="costo"><b>${nf(f.locs)}</b><small>${Number(f.locs)===1?'entrada':'entradas'}</small></span></div>`;
    const inv=VT.invitadas!=null?VT.invitadas:(VT.nuevas_semana!=null?VT.nuevas_semana-VT.nuevas_pauta:null);
    return `<div class="tt"><h2>Ticketera</h2><span class="pill">${I('cal')}${dd(String(VT.captura).slice(0,10))}</span></div>
      ${VT.nuevas_semana!=null?`<div class="sub2" style="margin-top:0">${VT.obra?esc(VT.obra)+' · ':''}${VT.semana_desde?'del '+dd(VT.semana_desde).slice(4)+' al '+dd(VT.semana_hasta).slice(4):'esta semana'}</div><div class="dgrid"><div class="dt"><b>${nf(VT.nuevas_pauta)}</b><small>Por la publicidad</small></div><div class="dt"><b>${nf(inv)}</b><small>${inv===1?'Invitada':'Invitadas'}</small></div></div>`:''}
      ${slug==='berco-estudio'?`<a class="bt n" style="margin-top:12px;width:100%;justify-content:center" href="https://vm.semillaredes.com/web/invitados?c=${encodeURIComponent(slug)}&k=${encodeURIComponent(tok)}" target="_blank" rel="noopener">${I('lista')}Marcar invitados de la semana</a>`:''}
      ${F.length?`<div class="sub2">Próximas funciones</div><div class="box">${F.map(fila).join('')}</div>`:''}
      ${P.length?`<div class="sub2">Funciones que ya pasaron</div><div class="box">${P.map(fila).join('')}</div>`:''}`; }
  function metas(){ const M=metricas(), H=(D.hitos||[]).filter(h=>h.metrica!=='ig_followers_total'||h.objetivo===META());
    const NOM={ig_followers_total:'seguidores en Instagram',msj_mensajes:'consultas',tk_tickets:'entradas vendidas'};
    const VT=Object.values((D.cliente||{}).ventas||{}).filter(x=>x&&x.tipo==='ticketera').sort((a,b)=>String(a.captura||a.actualizado)<String(b.captura||b.actualizado)?-1:1).pop();
    const L=H.map(h=>{ let v=M.ult(h.metrica); if(h.metrica==='tk_tickets'&&/vendidas/i.test(h.titulo||'')&&VT) v=Number(VT.ventas); if(v==null) return ''; const o=Number(h.objetivo), pc=Math.min(100,Math.round(v*100/o));
      const t=h.titulo&&h.titulo!==h.metrica?h.titulo:`${nf(o)} ${NOM[h.metrica]||h.metrica}`;
      return `<div class="row"><span class="tx"><b>${esc(t)}</b><span class="pb"><i style="width:${Math.max(3,pc)}%"></i></span><small>${nf(v)} de ${nf(o)}${pc>=100?' · lograda':''}</small></span><span class="costo"><b>${pc}%</b></span></div>`; }).filter(Boolean);
    return L.length?`<div class="tt"><h2>Tus metas</h2></div><div class="box">${L.join('')}</div>`:''; }
  // 17/11: panel de métricas como en la app anterior: destacado de la semana, resumen del mes y resumen del período por red
  const VINO='#7A1F3A', OLI='#87863A', ROSA='#E2767C';
  function destacado(){ const tj=TJ&&TJ.hay?TJ:null; if(!tj) return ''; const H=[...(tj.hero||[]),...(tj.minis||[])].slice(0,4); if(!H.length) return '';
    return `<div class="dest"><div class="k">${I('estrella')}Lo destacado de ${tj.cadencia&&tj.cadencia>8?'este período':'la semana'}<span>${rango(tj.desde,tj.hasta)}</span></div>
      <div class="g">${H.map(x=>{ const d=x.delta||(x.sub&&/(\d+)%/.test(x.sub)?((/menos/.test(x.sub)?'-':'+')+x.sub.match(/(\d+)%/)[1]+'%'):''); const bien=x.bien!=null?x.bien:(/costo/i.test(x.titulo||x.label||'')?String(d).startsWith('-'):!String(d).startsWith('-'));
        return `<div><b>${esc(x.prefijo?x.prefijo+' ':'')}${esc(x.valor)}</b><small>${esc(cap(x.label||x.titulo||''))}</small>${d?`<em class="${bien?'':'mal'}">${esc(d)} vs. promedio</em>`:''}</div>`; }).join('')}</div></div>`; }
  function resumenMes(){ const M=metricas(), Rr=M.R, ult=Rr[Rr.length-1]; if(!ult) return ''; const DD=x=>new Date(String(x).slice(0,10)+'T00:00:00Z'), dia=864e5;
    const fu=DD(ult.hasta), ini=new Date(Date.UTC(fu.getUTCFullYear(),fu.getUTCMonth()-1,1)), fin=new Date(Date.UTC(fu.getUTCFullYear(),fu.getUTCMonth(),1));
    const sum=fn=>{ let t=0,hay=false; Rr.forEach(r=>{ const v=fn(r.metricas||{}); if(v==null||isNaN(Number(v))) return; const d0=DD(r.desde); let d1=DD(r.hasta); if(Math.round((d1-d0)/dia)===6) d1=new Date(+d1+dia);
      const tot=Math.max(1,(d1-d0)/dia), den=Math.max(0,(Math.min(d1,fin)-Math.max(d0,ini))/dia); if(den>0){ t+=Number(v)*den/tot; hay=true; } }); return hay?t:null; };
    const ML=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'][ini.getUTCMonth()], S=SIM()==='USD'?'USD ':'$ ', it=[];
    const vV=sum(m=>m.vta_ventas), vF=sum(m=>m.vta_ingreso!=null?m.vta_ingreso:m.vta_ingreso_pixel), vI=sum(m=>m.vta_inversion), tT=sum(m=>m.tk_tickets), sN=sum(m=>m.ig_followers_nuevos), mM=sum(m=>m.msj_mensajes), fV=sum(m=>m.frm_visitas);
    const inv=sum(m=>{ let t=0,h=false; Object.keys(m).forEach(k=>{ if(/^(ig|msj|vta|tk|frm|stm|ld|tr|spad|ytad|lan)_inversion$/.test(k)&&m[k]!=null){ t+=Number(m[k]); h=true; } }); return h?t:null; });
    if(vV!=null) it.push([nf(Math.round(vV)),'ventas']); if(vF!=null) it.push([S+nf(Math.round(vF)),'facturado']);
    if(tT!=null) it.push([nf(Math.round(tT)),'entradas vendidas']); if(sN!=null) it.push(['+'+nf(Math.round(sN)),'seguidores nuevos']);
    if(mM!=null) it.push([nf(Math.round(mM)),'consultas por mensaje']); if(fV!=null) it.push([nf(Math.round(fV)),'visitas a la web']);
    if(inv!=null) it.push([S+nf(Math.round(inv)),'invertido en publicidad']);
    if(vF!=null&&vI) it.push([nf(vF/vI,1)+'x','retorno por dólar']); else { const iI=sum(m=>m.ig_inversion); if(sN&&iI) it.push([S+nf(iI/sN,iI/sN<100?2:0),'costo por seguidor']); }
    if(it.length<2) return '';
    return `<div class="mesp"><div class="k">Resumen de ${ML}</div><div class="g">${it.slice(0,6).map(([v,l])=>`<div><b>${v}</b><small>${l}</small></div>`).join('')}</div><p>La suma de todos los reportes de ${ML}. Si un período cruza de un mes a otro, se reparte por días.</p></div>`; }
  function panelPeriodo(){ const M=metricas(), Rr=M.R, U=M.U; if(!Rr.length) return '';
    const tiene=k=>Rr.slice(-4).some(r=>r.metricas[k]!=null);
    const spk=['sp_oyentes_perfil','sp_monthly','sp_oyentes','sp_listeners'].find(tiene)||'sp_oyentes';
    const RED={ig:['Instagram','ig_followers_total','seguidores',VINO,['ig_costo_follower','costo por seguidor',1,ROSA],['ig_inversion','inversión en el período',1,OLI],()=>U.ig_followers_nuevos!=null?`${U.ig_followers_nuevos>0?'+':''}${nf(U.ig_followers_nuevos)} en el período`:''],
      tk:['Entradas','tk_tickets','entradas vendidas por la pauta','#2F7A4F',['tk_costo_ticket','costo por entrada',1,ROSA],['tk_inversion','inversión en el período',1,OLI],()=>U.tk_roas!=null?`Retorno: ${nf(U.tk_roas,2)}x lo invertido`:''],
      msj:['Mensajes','msj_mensajes','mensajes recibidos','#25A35A',['msj_costo_mensaje','costo por mensaje',1,ROSA],['msj_inversion','inversión en el período',1,OLI],()=>''],
      vta:['Ventas','vta_ventas','ventas en el período','#2F7A4F',['vta_costo_venta','costo por venta',1,ROSA],['vta_inversion','inversión en el período',1,OLI],()=>''],
      frm:['Web','frm_visitas','visitas a la página','#2E3A7A',['frm_costo_visita','costo por visita',1,ROSA],['frm_inversion','inversión en el período',1,OLI],()=>U.frm_mensajes!=null?`${nf(U.frm_mensajes)} consultas en el período`:''],
      sp:['Spotify',spk,'oyentes mensuales','#1DB954',['sp_streams','reproducciones',0,'#1DB954'],['sp_followers','seguidores en Spotify',0,OLI],()=>''],
      yt:['YouTube','yt_views','vistas','#FF0000',['yt_subs_nuevos','suscriptores nuevos',0,ROSA],['yt_horas','horas vistas',0,OLI],()=>U.yt_subs!=null?`${nf(U.yt_subs)} suscriptores`:'']};
    Object.keys(RED).forEach(k=>{ if(!tiene(RED[k][1])) delete RED[k]; }); const K=Object.keys(RED); if(!K.length) return '';
    let red=LS('red'); if(!RED[red]) red=K[0]; const [nom,key,lab,col,A,B,ex]=RED[red];
    const serie=k=>Rr.slice(-8).map(r=>r.metricas[k]).map(v=>v==null?null:Number(v));
    const money=(v,d)=>v==null?'—':(SIM()==='USD'?'USD ':'$ ')+nf(v,d!=null?d:(Math.abs(v)<100?2:0));
    const linea=S=>{ const V=S.map((v,i)=>[i,v]).filter(x=>x[1]!=null); if(V.length<2) return ''; const W=200,H=96,n=S.length-1||1,mn=Math.min(...V.map(x=>x[1])),mx=Math.max(...V.map(x=>x[1])),rg=(mx-mn)||1, X=i=>8+i*(W-16)/n, Y=v=>H-10-(v-mn)/rg*(H-22);
      return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${V.map((p,j)=>(j?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>${V.map(p=>`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.6" fill="${col}"/>`).join('')}</svg>`; };
    const barras=(S,c)=>{ const V=S.filter(v=>v!=null); if(V.length<2) return ''; const mx=Math.max(...V.map(Math.abs))||1; return `<div class="bb">${S.map((v,i)=>v==null?'<i style="height:0"></i>':`<i style="height:${Math.max(6,Math.round(Math.abs(v)*100/mx))}%;background:${c};opacity:${(0.45+0.55*i/(S.length-1)).toFixed(2)}"></i>`).join('')}</div>`; };
    const mini=c=>{ const v=U[c[0]]!=null?Number(U[c[0]]):null; return `<div class="pm"><b>${c[2]?money(v):v==null?'—':nf(v,c[0]==='yt_horas'?1:0)}</b><small>${c[1]}</small>${barras(serie(c[0]),c[3])}</div>`; };
    const v=M.ult(key), pr=M.prom(key)!=null&&key!=='ig_followers_total'?pct(Number(U[key]),M.prom(key)):(()=>{ const S=serie(key).filter(x=>x!=null); return S.length>1&&S[S.length-2]?Math.round((S[S.length-1]-S[S.length-2])*100/S[S.length-2]):null; })();
    const act=U.actualizado?String(U.actualizado):'';
    return `<div class="perh"><h2>Resumen del período</h2><span>Del ${fC(M.desde)} al ${fC(M.hasta)}</span></div>
      ${act?`<p class="pie3" style="margin:-4px 2px 12px">Números actualizados el ${fC(act.slice(0,10))}${/T\d\d:\d\d/.test(act)?' a las '+act.slice(11,16)+' hs':''}</p>`:''}
      ${K.length>1?`<div class="redes">${K.map(k=>`<button data-red="${k}" class="${k===red?'on':''}">${RED[k][0]}</button>`).join('')}</div>`:''}
      <div class="pbig"><div class="pt0"><div class="n">${nf(v,Number.isInteger(v)?0:1)}</div><small>${lab}</small>${pr!=null?`<em class="${pr<0?'mal':''}">${I(pr<0?'baja':'sube')}${pr>0?'+':''}${pr}%</em>`:''}<p>${ex()}</p></div><div class="sp">${linea(serie(key))}</div></div>
      <div class="dgrid" style="margin-top:12px">${mini(A)}${mini(B)}</div>`; }
  const fC=f=>{ if(!f) return ''; const p=String(f).slice(0,10).split('-'); return p[2]+'/'+p[1]; };
  function bloqueWeb(){ const V=USOW; if(!V||!WEBS.length) return '';
    const OR={anuncio:'Anuncios',ig:'Instagram',fb:'Facebook',meta:'Instagram / Facebook',busc:'Google y buscadores',wa:'WhatsApp',yt:'YouTube',x:'X',semilla:'Semilla',otro:'Otras páginas',directo:'Directo o link guardado'};
    const CL={wa:'WhatsApp',ig:'Instagram',mail:'Mail',tel:'Llamadas',spotify:'Spotify',youtube:'YouTube',steam:'Steam',otro:'Otros'};
    const dp=V.semana_ant?Math.round((V.semana-V.semana_ant)*100/V.semana_ant):null, mx=Math.max(1,...V.dias.map(x=>x.n));
    const fila=(t,n,tot)=>`<div class="row"><span class="tx"><b>${esc(t)}</b><span class="pb"><i style="width:${Math.max(3,Math.round(n*100/Math.max(1,tot)))}%"></i></span></span><span class="costo"><b>${nf(n)}</b>${tot?`<small>${nf(n*100/tot,0)}%</small>`:''}</span></div>`;
    const cons=Object.entries(V.clics||{}).sort((a,b)=>b[1]-a[1]);
    return `<div class="tt"><h2>Tus webs</h2><span class="pill">En vivo</span></div>
      <div class="box ig"><div class="k"><span class="tile c">${I('web')}</span>Visitas${dp!=null?`<span class="estado" style="${dp<0?'background:var(--rosa);color:var(--vino)':''}">${I(dp<0?'baja':'sube')} ${dp>0?'+':''}${dp}% vs. semana anterior</span>`:''}</div>
        <div class="big">${nf(V.semana)}<small>en los últimos 7 días</small></div>
        <div class="bars mini">${V.dias.map(x=>`<div><i style="height:${x.n?Math.max(8,Math.round(x.n*100/mx)):3}%;${x.n?'':'background:#ECE6DB'}"></i></div>`).join('')}</div>
        <div class="falt"><span>Últimos 14 días · ${nf(V.mes)} visitas en 30 días</span></div>
        ${V.mes<20?`<p class="pie3" style="margin-top:8px">Medimos las visitas desde el 16/11. Los números se completan solos a medida que entra gente.</p>`:''}</div>
      ${(V.webs||[]).length>1?`<div class="sub2">Por página</div><div class="box">${V.webs.map(x=>fila(x.titulo,x.n,V.mes)).join('')}</div>`:''}
      ${(V.origen||[]).length?`<div class="sub2">De dónde llegan</div><div class="box">${V.origen.map(x=>fila(OR[x.o]||x.o,x.n,V.mes)).join('')}</div>`:''}
      ${(V.paises||[]).length?`<div class="sub2">Desde qué país</div><div class="box">${V.paises.map(x=>fila(PA[x.p]||x.p,x.n,V.mes)).join('')}</div>`:''}
      <div class="sub2">Consultas desde tus webs · 30 días</div>
      ${cons.length?`<div class="dgrid">${cons.map(([t,n])=>`<div class="dt"><b>${nf(n)}</b><small>Toques a ${CL[t]||t}</small></div>`).join('')}</div>`:`<div class="box"><div class="vacio">Todavía nadie tocó WhatsApp, mail o Instagram desde tus webs este mes.</div></div>`}`; }
  const cap=s=>{ s=String(s||''); return s.charAt(0).toUpperCase()+s.slice(1); };

  function scAnalisis(){
    const M=metricas(), inf=M.inf||{}, H=inf.hallazgos||[];
    const icoH=(h,i)=>{ const t=(typeof h==='object'?(h.titulo+' '+h.t):h).toLowerCase(); if((h.tipo||'')==='mal'||/baj|menos|cay|no hubo/.test(t)) return ['baja','r']; if(/seguidor/.test(t)) return ['sube','']; if(/visita|página|clic/.test(t)) return ['cursor','c']; return ['sube','']; };
    const RC=((D.recomendaciones||{}).recomendaciones||[]).slice(0,3);
    const sinT=x=>String(x||'').replace(/<[^>]+>/g,''); const RT=(RC.length?RC.map(r=>({t:r.titulo,s:r.texto})):(inf.recomendaciones||[]).slice(0,3).map((r,i)=>({t:(inf.recos_titulos||[])[i]||corta(sinT(r),40),s:r}))).map(x=>({t:sinT(x.t),s:sinT(x.s)}));
    return `<button class="vol" data-ir="metricas">${I('atras')}Volver al reporte</button><h1 style="margin-bottom:10px">Análisis completo</h1>
      ${M.desde?`<span class="pill">${I('cal')}${rango(M.desde,M.hasta)}</span>`:''}
      <div class="tt"><h2>Lo principal</h2></div>
      <div class="box">${H.length?H.map((h,i)=>{ const [ic,c]=icoH(h,i); const o=typeof h==='object'?h:{t:h};
        return `<div class="hall"><span class="tile ${c}">${I(ic)}</span><span>${o.titulo?`<b>${esc(o.titulo.replace(/\.$/,''))}</b>`:''}<p>${escB(o.t)}</p></span></div>`; }).join(''):`<div class="vacio">Todavía no hay análisis para este período.</div>`}</div>
      <div class="tt"><h2>Qué podés hacer ahora</h2></div>
      <div class="box">${RT.map((r,i)=>`<button class="row" data-agendar="${esc(r.t)}"><span class="tile ${['','r','c'][i%3]}">${I(['bolsa','megafono','lista'][i%3])}</span><span class="tx"><b>${esc(corta(r.t,60))}</b><small>${esc(corta(r.s,90))}</small></span><span class="go">${I('flecha')}</span></button>`).join('')||`<div class="vacio">Sin recomendaciones por ahora.</div>`}</div>
      <a class="bt" style="display:inline-flex;margin-top:18px" href="${W}/tarjeta?c=${encodeURIComponent(slug)}&k=${encodeURIComponent(tok)}" target="_blank" download="reporte.jpg">${I('bajar')}Descargar reporte</a>`;
  }

  function scFormacion(){
    const H=hechas(), n=TODAS.filter(c=>H.includes(c.id)).length;
    let cont='';
    if(SUBF==='clases'){
      cont=`<div class="forHero"><img class="decor" src="/assets/marca-semilla.png" alt=""><h3>Formación Semilla</h3><p style="margin:10px 0 16px;font-size:16px;line-height:23px;opacity:.92">Un grupo reducido con Agus para ordenar tu proyecto con el Método Semilla: modelo de negocio, comunicación y publicidad, con seguimiento semanal.</p><a class="bt" href="https://aguscalcagno.com/p/formacion-semilla-grupo" target="_blank" rel="noopener" style="display:inline-flex;background:#fff;border-color:#fff;color:#3F4526">Conocé la Formación ${I('ext')}</a></div>
        <div class="tt"><h2>El programa</h2><span class="pill">13 clases</span></div>
        <div class="box">${CLASES.map(([m,ic,L],k)=>`<div class="row"><span class="tile ${['','r','c'][k]}">${I(ic)}</span><span class="tx"><b>${m}</b><small>${L.length} clases</small></span><span class="prox">Próximamente</span></div>`).join('')}</div>`;
    } else {
      const q=(LS('q')||'').toLowerCase(); const L=DROPS.filter(x=>!q||(x.titulo+' '+(x.categoria||'')+' '+(x.resumen||'')).toLowerCase().includes(q));
      const d0=L[0];
      cont=`<label class="buscar">${I('lupa')}<input id="v4q" placeholder="Buscá por tema" value="${esc(LS('q')||'')}"></label>
        ${d0?`<div class="dcard"><img src="/drops/img/drop-foto-${(d0.n%3)+1}.jpg" alt=""><div class="tx"><div class="kk">Drop #${d0.n} · ${esc(d0.categoria||'')}</div><h3>${esc(d0.titulo)}</h3>
          <div class="bts"><a class="bt n" href="${esc(d0.url)}" target="_blank" rel="noopener">${I('libro')}Leer</a>${d0.audio?`<a class="bt" href="${esc(d0.audio)}" target="_blank" rel="noopener">${I('auris')}Escuchar</a>`:''}</div></div></div>`:`<div class="box"><div class="vacio">No encontré drops con ese tema.</div></div>`}
        ${L.length>1?`<div class="box" style="margin-top:14px">${L.slice(1,6).map(x=>`<a class="row" href="${esc(x.url)}" target="_blank" rel="noopener"><span class="tile">${I('libro')}</span><span class="tx"><b>${esc(x.titulo)}</b><small>Drop #${x.n} · ${esc(x.categoria||'')}</small></span><span class="go">${I('chev')}</span></a>`).join('')}</div>`:''}
        <div class="tt"><h2>Explorá el archivo</h2><a class="lk" href="https://semillaredes.com/drops/" target="_blank" rel="noopener">Ver todos ${I('chev')}</a></div>
        <div class="chips"><a href="https://semillaredes.com/drops/" target="_blank" rel="noopener">Modelo de negocio</a><a href="https://semillaredes.com/drops/" target="_blank" rel="noopener">Comunicación</a><a href="https://semillaredes.com/drops/" target="_blank" rel="noopener">Publicidad</a><a href="https://semillaredes.com/drops/" target="_blank" rel="noopener">Estrategia</a></div>`;
    }
    return `<h1>Formación</h1><div class="seg"><button data-subf="drops" class="${SUBF==='drops'?'on':''}">Drops del viernes</button><button data-subf="clases" class="${SUBF==='clases'?'on':''}">Clases</button></div>${cont}`;
  }

  function scClase(id){
    const c=TODAS.find(x=>x.id===id)||TODAS[0], M=metricas(), U=M.U, H=hechas();
    const p=M.prom('ig_costo_follower'), v=U.ig_costo_follower, d=pct(v,p);
    return `<button class="vol" data-ir="formacion">${I('atras')}Volver a las clases</button>
      <div style="font-size:12.5px;font-weight:700;letter-spacing:1.3px;color:#4B4E25;text-transform:uppercase;margin-top:4px">${esc(c.m)} · Clase ${c.n} de ${TODAS.length}</div>
      <h1 style="margin-top:8px">${esc(c.t)}</h1>
      <div class="video" id="v4vid"><img src="https://img.youtube.com/vi/${c.id}/hqdefault.jpg" alt=""><button id="v4play" aria-label="Ver la clase">${I('play')}</button></div>
      <div class="tres"><button class="bt" data-prox="Resumen de la clase">${I('doc')}Resumen</button><button class="bt" data-prox="Ejercicio">${I('lista')}Ejercicio</button><button class="bt" data-prox="Plantilla">${I('grilla')}Plantilla</button></div>
      ${v!=null?`<div class="apl"><div class="kk">${I('barras')}APLICALO A TU PROYECTO</div><div class="row0"><div><div class="v"><small>${SIM()}</small>${nf(v,2)}</div><div class="l">Costo por seguidor</div></div>${d!=null?`<span class="chip ${d<=0?'':'mal'}">${I(d<=0?'baja':'sube')}${d>0?'+':''}${d}% vs. promedio</span>`:''}</div>
        <div class="pie"><span>Meta Ads · ${rango(M.desde,M.hasta)}</span>${CTA&&CTA.act?`<a href="https://adsmanager.facebook.com/adsmanager/manage/campaigns?act=${encodeURIComponent(CTA.act)}" target="_blank" rel="noopener">Ver mis campañas ${I('ext')}</a>`:''}</div></div>`:''}
      <button class="bt n" id="v4hecha" data-id="${c.id}" style="width:100%;margin-top:14px">${I('check')}${H.includes(c.id)?'Hecha · desmarcar':'Marcar como hecha'}</button>`;
  }

  function scCuenta(){
    const ini=INI();
    return `<button class="vol" data-ir="inicio">${I('atras')}Volver a Inicio</button><h1>Tu cuenta</h1>
      <div class="box perfil"><span class="avg">${esc(ini)}</span><span><b>${esc(SALUDO_LARGO())}</b><small>${esc((D.cliente||{}).nombre||'')}</small></span></div>
      <div class="tt"><h2>Plan y pagos</h2></div>
      <div class="box"><button class="row" data-prox="Tu plan"><span class="tile">${I('gorro')}</span><span class="tx"><b>Tu plan</b><small>Gestioná tu suscripción</small></span><span class="prox">Próximamente</span></button>
        <button class="row" data-prox="Historial de pagos"><span class="tile c">${I('billetera')}</span><span class="tx"><b>Historial de pagos</b><small>Mercado Pago</small></span><span class="go">${I('chev')}</span></button></div>
      <div class="tt"><h2>Conexiones y acceso</h2></div>
      <div class="box"><button class="row" id="v4cx"><span class="tile r">${I('link')}</span><span class="tx"><b>Redes conectadas</b><small>Instagram, Spotify, YouTube y Meta Ads</small></span><span class="go">${I('chev')}</span></button>
        <button class="row" data-prox="Datos de acceso"><span class="tile c">${I('persona')}</span><span class="tx"><b>Datos de acceso</b><small>Editá tus datos</small></span><span class="go">${I('chev')}</span></button>
        <button class="row" data-prox="Notificaciones"><span class="tile">${I('campana')}</span><span class="tx"><b>Notificaciones</b><small>Elegí qué avisos recibir</small></span><span class="go">${I('chev')}</span></button></div>
      <a class="salir" href="https://semillaredes.com/">Salir de la app ${I('salir')}</a>
      <p class="nota" style="text-align:left;margin-top:22px">SemillaIA · versión ${VER}</p>`;
  }
  const VER='4.0';
  const PERS={'semilla-redes':['Agus','AC','Agus Calcagno'],'berco-estudio':['María','MV','María Valiente'],'abel-maldonado':['Abel','AM','Abel Maldonado'],'alan-sutton':['Manu','ME','Manu Etchegaray'],
    'andrea-guedella':['Andrea','AG','Andrea Guedella'],'animales-del-rock':['Mariana','MT','Mariana Tavella'],'mavela':['Mariana','MT','Mariana Tavella'],'betsy-grinblat':['Betsy','BG','Betsy Grinblat'],
    'federico-andahazi':['Federico','FA','Federico Andahazi'],'felipe-gonzalez':['Felipe','FG','Felipe González'],'flor-del-valle':['Flor','FL','Flor Lanusse'],'flor-scott':['Flor','FS','Flor Scott'],
    'hernan-onirico':['Hernán','HO','Hernán Onírico'],'jimena-mercedes':['Jimena','JP','Jimena Pesado'],'koino':['Jeremías','KO','Koino'],'lara-fichera':['Lara','LF','Lara Fichera'],'lu-glass':['Lucila','LG','Lu Glass'],
    'maria-marta-crespo':['María Marta','MC','María Marta Crespo'],'silvina':['Silvina','SI','Silvina'],'sin-fronteras-duo':['Santiago','SE','Santiago Echeverria'],'spam-studio':['Ariel','SS','Spam Studio'],'yamila-beraja':['Yamila','YB','Yamila Beraja']};
  const NOMB=()=>String((D.cliente||{}).nombre||'').split('|')[0].trim();
  const INI=()=>{ if(PERS[slug]) return PERS[slug][1]; const w=NOMB().split(/\s+/).filter(x=>/^\p{L}/u.test(x)); return (w.length>1?w[0][0]+w[1][0]:(w[0]||'?').slice(0,2)).toUpperCase(); };
  const SALUDO=()=>{ if(PERS[slug]) return PERS[slug][0]; const n=NOMB(); return n===n.toUpperCase()?n.toLowerCase().replace(/(^|\s)\S/g,x=>x.toUpperCase()):n; };
  const SALUDO_LARGO=()=>PERS[slug]?PERS[slug][2]:NOMB();

  // ---------- armado ----------
  function pintar(){
    let r=$('#v4'); if(!r){ r=document.createElement('div'); r.id='v4'; document.body.appendChild(r); }
    const sc=TAB.startsWith('clase:')?scClase(TAB.slice(6)):TAB==='analisis'?scAnalisis():TAB==='cuenta'?scCuenta():TAB==='proyecto'?scProyecto():TAB==='metricas'?scMetricas():TAB==='formacion'?scFormacion():TAB==='shows'?scShows():scInicio();
    const nb=TAB.startsWith('clase:')?'formacion':TAB==='analisis'?'metricas':TAB;
    const N=[['inicio','casa','Inicio'],['proyecto','carpeta','Proyecto'],['metricas','barras','Métricas'],['formacion','gorro','Formación']];
    const spl=document.getElementById('v4splash'); if(spl) spl.remove();
    r.innerHTML=hd()+`<div class="sc on">${sc}</div>`+`<nav class="v4n" id="v3nav">${N.map(([k,ic,t])=>`<button data-ir="${k==='metricas'?'ia':k}" class="${nb===k?'on':''}"><span class="ic">${I(ic)}</span>${t}</button>`).join('')}</nav>`;
    eventos(r);
  }
  function ir(t){ if(t==='ia') t='metricas'; TAB=t; if(!t.startsWith('clase:')) LS('tab',t); pintar(); window.scrollTo(0,0); window.SRE&&window.SRE('v4_'+t.split(':')[0],{}); }
  function hoja(titulo,html,al){ const h=document.createElement('div'); h.className='hoja'; h.innerHTML=`<div class="cj"><button class="cerrar" aria-label="Cerrar">×</button><h2>${titulo}</h2>${html}</div>`;
    $('#v4').appendChild(h); const c=()=>h.remove(); h.querySelector('.cerrar').onclick=c; h.onclick=e=>{ if(e.target===h) c(); }; if(al) al(h,c); return h; }
  function prox(t){ hoja(esc(t),`<p style="font-size:16px;line-height:24px;color:#4B4958">Esto está en camino. Va a aparecer acá apenas esté listo.</p><span class="prox">Próximamente</span>`); }
  async function recargar(){ const d=await rpc('sub_get',{p_slug:slug,p_k:tok}).catch(()=>null); if(d&&d.cliente){ D=d; window.__D=d; pintar(); } }

  function eventos(r){
    r.querySelectorAll('[data-ir]').forEach(b=>b.onclick=()=>ir(b.dataset.ir));
    r.querySelectorAll('[data-prox]').forEach(b=>b.onclick=()=>prox(b.dataset.prox));
    r.querySelectorAll('[data-red]').forEach(b=>b.onclick=()=>{ LS('red',b.dataset.red); pintar(); });
    r.querySelectorAll('[data-subm]').forEach(b=>b.onclick=()=>{ SUBM=b.dataset.subm; LS('subm',SUBM); pintar(); window.scrollTo(0,0); });
    r.querySelectorAll('[data-subf]').forEach(b=>b.onclick=()=>{ SUBF=b.dataset.subf; LS('subf2',SUBF); TAB='formacion'; LS('tab','formacion'); pintar(); window.scrollTo(0,0); });
    r.querySelectorAll('[data-clase]').forEach(b=>b.onclick=()=>ir('clase:'+b.dataset.clase));
    r.querySelectorAll('[data-mod]').forEach(b=>b.onclick=()=>{ LS('mod',LS('mod')===b.dataset.mod?'':b.dataset.mod); pintar(); });
    r.querySelectorAll('[data-dia]').forEach(b=>b.onclick=()=>{ DIA_SEL=b.dataset.dia; pintar(); });
    r.querySelectorAll('[data-sem]').forEach(b=>b.onclick=()=>{ const d=new Date((DIA_SEL||hoyISO())+'T12:00:00'); d.setDate(d.getDate()+Number(b.dataset.sem)); DIA_SEL=d.toISOString().slice(0,10); pintar(); });
    r.querySelectorAll('[data-hecha]').forEach(b=>b.onclick=async()=>{ const e=b.dataset.est; b.classList.toggle('ok',e==='hecha'); b.innerHTML=e==='hecha'?I('check'):''; const t=(D.tareas||[]).find(x=>x.id===b.dataset.hecha); if(t) t.estado=e;
      const x=await rpc('sub_tarea_cliente',{p_slug:slug,p_k:tok,p_id:b.dataset.hecha,p_estado:e}).catch(()=>null); setTimeout(x&&x.ok?recargar:pintar,450); });
    r.querySelectorAll('[data-tarea]').forEach(b=>b.onclick=()=>editarTarea(b.dataset.tarea));
    r.querySelectorAll('[data-agendar]').forEach(b=>b.onclick=()=>nuevaTarea(b.dataset.agendar));
    const on=(id,f)=>{ const e=r.querySelector('#'+id); if(e) e.onclick=f; };
    on('v4an',()=>ir('analisis')); on('v4tarea',()=>nuevaTarea('')); on('v4chat',chat); on('v4fecha',nuevaFecha); on('v4bell',avisos); on('v4cx',conexiones); on('v4mat',materiales); on('v4vtas',ventas);
    on('v4nt',()=>nuevaTarea('')); on('v4vh',()=>{ LS('verhechas',LS('verhechas')==='1'?'0':'1'); pintar(); });
    on('v4vt',()=>{ LS('vertodas',LS('vertodas')==='1'?'0':'1'); pintar(); });
    on('v4play',()=>{ const v=r.querySelector('#v4vid'); const id=TAB.slice(6); v.innerHTML=`<iframe src="https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`; });
    on('v4hecha',()=>{ const id=r.querySelector('#v4hecha').dataset.id, H=hechas(); const i=H.indexOf(id); if(i<0) H.push(id); else H.splice(i,1); LS('hechas',JSON.stringify(H)); pintar(); });
    const q=r.querySelector('#v4q'); if(q){ q.oninput=()=>{ LS('q',q.value); clearTimeout(q._t); q._t=setTimeout(()=>{ pintar(); const n=$('#v4q'); n.focus(); n.setSelectionRange(n.value.length,n.value.length); },350); }; }
  }
  function nuevaTarea(t){ hoja('Nueva tarea',`<input id="v4tt" placeholder="¿Qué tenés que hacer?" value="${esc(t)}"><button class="bt n" id="v4ok" style="width:100%">${I('mas')}Agregar a mis tareas</button>`,(h,c)=>{
      const i=h.querySelector('#v4tt'); setTimeout(()=>i.focus(),60);
      h.querySelector('#v4ok').onclick=async()=>{ const v=i.value.trim(); if(!v) return; h.querySelector('#v4ok').disabled=true; const x=await rpc('sub_tarea_cliente_alta',{p_slug:slug,p_k:tok,p_titulo:v}).catch(()=>null); c(); if(x&&x.ok){ recargar(); } }; }); }
  function editarTarea(id){ const t=(D.tareas||[]).find(x=>x.id===id); if(!t) return; const ok=t.estado==='hecha';
    hoja('Tarea',`<textarea id="v4et" rows="4">${esc(t.titulo)}</textarea>
      <label style="display:block;font-size:14px;font-weight:700;color:#4B4958;margin:4px 0 6px">Aviso (opcional)</label><input id="v4ea" type="date" value="${t.alarma?String(t.alarma).slice(0,10):''}">
      <button class="bt n" id="v4eg" style="width:100%">${I('check')}Guardar cambios</button>
      <div class="dos" style="margin-top:10px"><button class="bt" id="v4ee">${ok?'Marcar pendiente':'Marcar hecha'}</button><button class="bt" id="v4eb" style="color:var(--vino)">Borrar</button></div>`,(h,c)=>{
      const q=s=>h.querySelector(s); const fin=async()=>{ c(); await recargar(); };
      q('#v4eg').onclick=async()=>{ const v=q('#v4et').value.trim(), a=q('#v4ea').value; if(!v) return; q('#v4eg').disabled=true;
        if(v!==t.titulo) await rpc('sub_tarea_editar',{p_slug:slug,p_k:tok,p_id:id,p_titulo:v}).catch(()=>null);
        const prev=t.alarma?String(t.alarma).slice(0,10):''; if(a!==prev) await rpc('sub_tarea_alarma',{p_slug:slug,p_k:tok,p_id:id,p_alarma:a?a+'T12:00:00-03:00':null}).catch(()=>null);
        fin(); };
      q('#v4ee').onclick=async()=>{ q('#v4ee').disabled=true; await rpc('sub_tarea_cliente',{p_slug:slug,p_k:tok,p_id:id,p_estado:ok?'pendiente':'hecha'}).catch(()=>null); fin(); };
      q('#v4eb').onclick=async()=>{ const b=q('#v4eb'); if(!b.dataset.seg){ b.dataset.seg='1'; b.textContent='¿Seguro? Tocá para borrar'; return; } b.disabled=true; await rpc('sub_tarea_borrar',{p_slug:slug,p_k:tok,p_id:id}).catch(()=>null); fin(); }; }); }
  function nuevaFecha(){ hoja('Nueva fecha',`<input id="v4ff" type="date" value="${DIA_SEL||hoyISO()}"><input id="v4ft" placeholder="Qué pasa ese día (show, lanzamiento, clase…)"><button class="bt n" id="v4ok" style="width:100%">${I('cal')}Guardar en la agenda</button>`,(h,c)=>{
      h.querySelector('#v4ok').onclick=async()=>{ const f=h.querySelector('#v4ff').value, t=h.querySelector('#v4ft').value.trim(); if(!f||!t) return; h.querySelector('#v4ok').disabled=true;
        const x=await rpc('sub_fecha_guardar',{p_slug:slug,p_k:tok,p_fecha:f,p_titulo:t,p_url:null}).catch(()=>null); c(); if(x&&x.ok){ await cargarFechas(); pintar(); } }; }); }
  // 17/11: la carga de ventas sigue siendo la del panel clásico: se muestra dentro de una hoja y vuelve a su lugar al cerrar
  function ventas(){ const B=[...document.querySelectorAll('#app .ventaBox')], LOG=(D.cliente||{}).ventas_log_on||(D.ventas_log||[]).length; if(!B.length&&!LOG) return;
    const lugar=B.map(b=>{ const m=document.createComment('v4v'); b.parentNode.insertBefore(m,b); return m; });
    const mon=v=>v==null||v===''?'':(((D.cliente||{}).moneda||'USD')==='ARS'?'$ ':'USD ')+Number(v).toLocaleString('es-AR',{maximumFractionDigits:2});
    const lista=()=>{ const VL=D.ventas_log||[], tot=VL.reduce((s,x)=>s+Number(x.monto||0),0);
      return VL.length?`<p class="pie3" style="margin:0 2px 10px"><b>${VL.length}</b> ${VL.length===1?'venta':'ventas'}${tot?` · <b>${mon(tot)}</b>`:''}</p><div class="box">${VL.map(x=>`<div class="row"><span class="dia" style="background:var(--salvia);color:#4B4E25"><b style="color:#4B4E25;font-size:16px">${fC(x.fecha)}</b></span><span class="tx"><b>${esc(x.detalle||'Venta')}</b><small>${mon(x.monto)}</small></span><button class="go" data-bv="${x.id}" style="background:none;border:0;padding:6px;color:var(--vino);font-size:13px;font-weight:700">Borrar</button></div>`).join('')}</div>`
        :`<div class="box"><div class="vacio">Todavía no hay ventas anotadas. Sumá la primera acá abajo.</div></div>`; };
    const h=hoja('Tus ventas',`${LOG?`<div id="v4vl">${lista()}</div><div class="sub2">Agregar venta</div><input id="v4vf" type="date" value="${hoyISO()}"><input id="v4vd" placeholder="Qué se vendió (y a quién, si querés)"><input id="v4vm" inputmode="decimal" placeholder="Monto"><button class="bt n" id="v4vok" style="width:100%">${I('mas')}Agregar venta</button><p class="pie3" id="v4ver"></p>`:''}<div id="v4vb" class="v4clasico" style="margin-top:14px"></div>`);
    const c=h.querySelector('#v4vb'); B.forEach(b=>c.appendChild(b)); const q=x=>h.querySelector(x);
    const enl=()=>h.querySelectorAll('[data-bv]').forEach(b=>b.onclick=async()=>{ if(!b.dataset.seg){ b.dataset.seg='1'; b.textContent='¿Seguro?'; return; } b.disabled=true;
      const r=await rpc('sub_vlog_borrar',{p_slug:slug,p_k:tok,p_id:b.dataset.bv}).catch(()=>null); if(r&&r.ok){ D.ventas_log=(D.ventas_log||[]).filter(x=>String(x.id)!==b.dataset.bv); q('#v4vl').innerHTML=lista(); enl(); } });
    if(LOG){ enl(); q('#v4vok').onclick=async()=>{ const det=q('#v4vd').value.trim(), mt=q('#v4vm').value.trim().replace(/\./g,'').replace(',','.'); if(!det&&!mt){ q('#v4ver').textContent='Contanos qué se vendió o el monto.'; return; }
      q('#v4vok').disabled=true; const r=await rpc('sub_vlog_alta',{p_slug:slug,p_k:tok,p_fecha:q('#v4vf').value||null,p_detalle:det,p_monto:mt===''?null:Number(mt)}).catch(()=>null); q('#v4vok').disabled=false;
      if(!r||!r.ok){ q('#v4ver').textContent='No se pudo guardar. Probá de nuevo.'; return; }
      const d=await rpc('sub_get',{p_slug:slug,p_k:tok}).catch(()=>null); if(d&&d.cliente){ D.ventas_log=d.ventas_log; }
      q('#v4vd').value=''; q('#v4vm').value=''; q('#v4ver').textContent='Venta agregada ✓'; q('#v4vl').innerHTML=lista(); enl(); }; }
    const volver=()=>{ B.forEach((b,i)=>{ if(lugar[i].parentNode) lugar[i].parentNode.replaceChild(b,lugar[i]); }); };
    const ob=new MutationObserver(()=>{ if(!document.body.contains(h)){ volver(); ob.disconnect(); } }); ob.observe(h.parentNode,{childList:true}); }
  function materiales(){ const href=u=>{ u=String(u||'').trim(); return !u?'#':/^https?:\/\//i.test(u)?u:'https://'+u; };
    const lista=()=>{ const A=D.activos||[]; return A.length?`<div class="box">${A.map(a=>`<div class="row"><span class="tile">${I(a.tipo==='link'||a.url?'link':'folder')}</span><a class="tx" href="${esc(href(a.url))}" target="_blank" rel="noopener" style="text-decoration:none;color:inherit"><b>${esc(a.titulo||'Material')}</b><small>${esc(a.descripcion||String(a.url||'').replace(/^https?:\/\//,''))}</small></a><button class="go" data-borra="${a.id}" aria-label="Borrar" style="background:none;border:0;padding:6px;color:var(--vino);font-size:13px;font-weight:700">Borrar</button></div>`).join('')}</div>`:`<div class="box"><div class="vacio">Todavía no hay materiales. Sumá links a tus fotos, logos, planillas o carpetas de Drive.</div></div>`; };
    hoja('Materiales',`<div id="v4ml">${lista()}</div>
      <div class="sub2">Agregar material</div>
      <input id="v4mt" placeholder="Nombre (ej.: Fotos de prensa)"><input id="v4mu" placeholder="Link (Drive, Dropbox, web…)" inputmode="url" autocapitalize="off"><input id="v4md" placeholder="Nota (opcional)">
      <button class="bt n" id="v4mok" style="width:100%">${I('mas')}Agregar material</button><p class="pie3" id="v4mer"></p>`,(h)=>{
      const q=x=>h.querySelector(x);
      const enlazar=()=>h.querySelectorAll('[data-borra]').forEach(b=>b.onclick=async()=>{ if(!b.dataset.seg){ b.dataset.seg='1'; b.textContent='¿Seguro?'; return; } b.disabled=true;
        await rpc('sub_activo_cliente_borrar',{p_slug:slug,p_k:tok,p_id:b.dataset.borra}).catch(()=>null); D.activos=(D.activos||[]).filter(a=>a.id!==b.dataset.borra); q('#v4ml').innerHTML=lista(); enlazar(); });
      enlazar();
      q('#v4mok').onclick=async()=>{ const t=q('#v4mt').value.trim(), u=q('#v4mu').value.trim(), de=q('#v4md').value.trim(); if(!t){ q('#v4mer').textContent='Ponele un nombre.'; return; }
        q('#v4mok').disabled=true; const r=await rpc('sub_activo_cliente_alta',{p_slug:slug,p_k:tok,p_titulo:t,p_url:u?href(u):null,p_descripcion:de||null}).catch(()=>null);
        q('#v4mok').disabled=false; if(!r||r.error){ q('#v4mer').textContent='No se pudo guardar. Probá de nuevo.'; return; }
        const d=await rpc('sub_get',{p_slug:slug,p_k:tok}).catch(()=>null); if(d&&d.cliente){ D=d; window.__D=d; }
        q('#v4mt').value=''; q('#v4mu').value=''; q('#v4md').value=''; q('#v4mer').textContent='Agregado ✓'; q('#v4ml').innerHTML=lista(); enlazar(); };
    }); }
  function avisos(){ hoja('Avisos',NOT.length?`<div class="box">${NOT.slice(0,12).map(n=>`<div class="row"><span class="tile">${I('campana')}</span><span class="tx"><b>${esc(n.titulo||'')}</b><small>${esc(n.texto||'')}</small></span></div>`).join('')}</div>`:`<div class="box"><div class="vacio">No tenés avisos nuevos.</div></div>`);
    if(NOT.some(n=>!n.leida)) rpc('sub_notifs_leer',{p_slug:slug,p_k:tok}).then(()=>{ NOT.forEach(n=>n.leida=true); }).catch(()=>{}); }
  function conexiones(){ hoja('Redes conectadas','<div id="v4cxm"></div>',h=>{ const ir=()=>window.SRConexiones.montar(h.querySelector('#v4cxm'),{slug,k:tok,plegado:false});
      if(window.SRConexiones) ir(); else { const s=document.createElement('script'); s.src='/conexiones.js?v='+(window.SR_VER||Date.now()); s.onload=ir; document.head.appendChild(s); } }); }
  function chat(){ if(!CHAT.length) CHAT.push({rol:'ia',texto:`Hola ${SALUDO()}, soy SemillaIA. ¿En qué te ayudo?`});
    hoja('SemillaIA',`<div class="msgs" id="v4ms"></div><form class="chatf" id="v4cf"><input id="v4ci" placeholder="Preguntame lo que quieras" autocomplete="off"><button aria-label="Enviar">${I('flecha')}</button></form>`,h=>{
      const ms=h.querySelector('#v4ms'); let esp=false;
      const p=()=>{ ms.innerHTML=CHAT.map(m=>`<div class="msg ${m.rol==='ia'?'ia':'yo'}">${esc(m.texto)}</div>`).join('')+(esp?'<div class="msg ia">…</div>':''); ms.scrollTop=ms.scrollHeight; }; p();
      h.querySelector('#v4cf').onsubmit=async e=>{ e.preventDefault(); const i=h.querySelector('#v4ci'), t=i.value.trim(); if(!t||esp) return; i.value=''; CHAT.push({rol:'yo',texto:t}); esp=true; p();
        let x=null; try{ x=await fetch(W+'/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c:slug,k:tok,mensajes:CHAT.slice(1)})}).then(r=>r.json()); }catch(er){}
        esp=false; CHAT.push({rol:'ia',texto:(x&&x.respuesta)||'Ahora no pude responder. Probá de nuevo en un ratito.'}); p(); }; }); }

  async function cargarFechas(){ const r=await rpc('sub_fechas_get',{p_slug:slug,p_k:tok}).catch(()=>null); FECHAS=(r&&r.fechas)||[]; }
  function cargarResto(){
    const k=encodeURIComponent(tok), c=encodeURIComponent(slug);
    Promise.all([
      fetch('/drops/ultimos.json?v='+new Date().toISOString().slice(0,13)).then(r=>r.ok?r.json():null).then(j=>{ DROPS=(j&&j.drops)||[]; }).catch(()=>{}),
      fetch(W+'/tarjeta.json?c='+c+'&k='+k).then(r=>r.ok?r.json():null).then(j=>{ TJ=j; }).catch(()=>{}),
      fetch(W+'/cuenta?c='+c+'&k='+k).then(r=>r.ok?r.json():null).then(j=>{ CTA=j; }).catch(()=>{}),
      fetch(W+'/estado?c='+c+'&k='+k).then(r=>r.ok?r.json():null).then(j=>{ WEBS=((j&&j.webs)||[]).filter(w=>!w.externa); }).catch(()=>{}),
      rpc('sub_notifs_get',{p_slug:slug,p_k:tok}).then(j=>{ NOT=(j&&j.notifs)||[]; }).catch(()=>{}),
      fetch(W+'/uso?c='+c+'&k='+k).then(r=>r.ok?r.json():null).then(j=>{ USOW=j&&j.web; }).catch(()=>{}),
      cargarFechas()
    ]).then(pintar);
  }

  window.V3=function(d){
    D=d;
    if(!document.getElementById('v4css')){ const st=document.createElement('style'); st.id='v4css'; st.textContent=CSS; document.head.appendChild(st);
      const f=document.createElement('link'); f.rel='stylesheet'; f.href='https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,700&family=Playfair+Display:wght@700&display=swap'; document.head.appendChild(f); }
    document.body.classList.add('v4');
    if(['inicio','proyecto','metricas','formacion','cuenta','analisis'].indexOf(TAB)<0) TAB='inicio';
    pintar(); cargarResto();
    if(location.hash==='#ventas'&&!window.__v4v){ window.__v4v=1; setTimeout(()=>{ TAB='proyecto'; pintar(); ventas(); },1200); }
  };
})();
