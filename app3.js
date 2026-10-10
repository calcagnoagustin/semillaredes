/* Semilla IA · app "Atelier" (prueba en hernan-onirico-2).
   Se monta arriba del panel clásico: usa los mismos datos (window.__D) y mueve el panel clásico adentro de "Métricas > Ver todo". */
(function(){
  if(window.V3) return;
  const NAVY='#1A2456', VINO='#7A1F3A', OLIVA='#87863A';
  const css=document.createElement('style');
  css.textContent=`
  body.v3{background:#F2EDE4}
  body.v3 .wrap{padding:0;max-width:none}
  body.v3 .cabLogo, body.v3 .btnReporte{display:none!important}
  #v3{max-width:560px;margin:0 auto;padding:calc(env(safe-area-inset-top,0px) + 14px) 18px calc(96px + env(safe-area-inset-bottom,0px));font-family:Inter,system-ui,sans-serif;color:#24242C}
  #v3 .cab{display:flex;align-items:center;gap:12px;margin-bottom:18px}
  #v3 .cab img{height:34px;display:block}
  #v3 .cab .sep{width:1px;height:28px;background:#CFC6B4}
  #v3 .cab .ia{font:600 21px/1 Inter,system-ui,sans-serif;color:${NAVY};letter-spacing:-.3px}
  #v3 .cab .ia b{color:${OLIVA};font-weight:700}
  #v3 .cab .esp{flex:1}
  #v3 .cab .camp{position:relative;border:0;background:none;padding:6px;cursor:pointer;color:${VINO}}
  #v3 .cab .camp i{position:absolute;top:4px;right:4px;width:9px;height:9px;border-radius:50%;background:#E2767C;border:2px solid #F2EDE4;display:none}
  #v3 .cab .camp.nuevo i{display:block}
  #v3 .cab .av{width:40px;height:40px;border-radius:50%;background:${NAVY};color:#F2EDE4;display:grid;place-items:center;font:700 16px/1 Inter,sans-serif;overflow:hidden;position:relative}
  #v3 .cab .av img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;border-radius:50%}
  #v3 h1.v3t{font-family:'Playfair Display',serif;font-weight:600;font-size:34px;line-height:1.1;color:${NAVY};margin:0}
  #v3 .bj{font-size:16px;color:#55525F;margin:4px 0 0}
  #v3 .tit2{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:26px 0 10px}
  #v3 .tit2 h3{margin:0;font-size:12.5px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#24242C}
  #v3 .tit2 h2{margin:0;font-family:'Playfair Display',serif;font-size:23px;font-weight:600;color:${NAVY}}
  #v3 .tit2 a,#v3 .tit2 button{font-size:14px;color:${OLIVA};text-decoration:none;background:none;border:0;cursor:pointer;font-family:inherit;padding:0}
  #v3 .card{background:#FBF8F2;border:1px solid #E8E1D3;border-radius:18px}
  #v3 .hero{margin-top:18px;background:${NAVY};color:#F2EDE4;border-radius:20px;padding:20px 20px 18px;position:relative;overflow:hidden}
  #v3 .hero .e{font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;opacity:.9}
  #v3 .hero .p{font-family:'Playfair Display',serif;font-size:56px;line-height:1;margin:14px 0 10px;font-weight:600}
  #v3 .hero .desde{margin-top:14px;padding-top:12px;border-top:1px solid rgba(242,237,228,.18);font-size:13.5px;line-height:1.4;max-width:80%;opacity:.9}
  #v3 .hero .desde b{color:#E8D9A8;font-weight:600}
  #v3 .hero .x{font-size:15px;line-height:1.45;max-width:78%;opacity:.95}
  #v3 .hero .ir{position:absolute;right:16px;bottom:16px;width:40px;height:40px;border-radius:50%;background:${OLIVA};color:#fff;border:0;display:grid;place-items:center;cursor:pointer}
  #v3 .hero svg.cielo{position:absolute;right:-30px;top:-10px;opacity:.9;pointer-events:none}
  #v3 .met{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
  #v3 .met .card{padding:14px 10px 12px;text-align:center}
  #v3 .met .ic{height:28px;display:grid;place-items:center}
  #v3 .met .v{font-family:'Playfair Display',serif;font-size:27px;font-weight:600;color:${NAVY};line-height:1.1;margin-top:6px;font-variant-numeric:tabular-nums}
  #v3 .met .l{font-size:13px;color:#55525F}
  #v3 .met .d{font-size:13px;font-weight:600;margin-top:2px;min-height:1.4em}
  #v3 .si{color:#4E6B24}#v3 .no{color:#9B2C36}#v3 .ne{color:#8A8577}
  #v3 .hito{margin-top:14px;padding:16px 16px 14px;display:grid;grid-template-columns:38px 1fr 40px;column-gap:12px;align-items:center}
  #v3 .hito .tt{font-weight:700;color:${NAVY};font-size:16px}
  #v3 .hito .tx{font-size:14.5px;color:#55525F;line-height:1.35}
  #v3 .hito .ir{width:40px;height:40px;border-radius:50%;background:#3E4A2A;color:#fff;border:0;display:grid;place-items:center;cursor:pointer}
  #v3 .hito .bar{grid-column:1/-1;display:grid;grid-template-columns:1fr auto;gap:12px;align-items:center;margin-top:12px}
  #v3 .hito .bar .b{height:10px;border-radius:99px;background:#E6DFD0;overflow:hidden}
  #v3 .hito .bar .b i{display:block;height:100%;background:${OLIVA};border-radius:99px}
  #v3 .hito .bar span{font-size:13.5px;color:#55525F;font-variant-numeric:tabular-nums;white-space:nowrap}
  #v3 .acc{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
  #v3 .acc button{background:#FBF8F2;border:1px solid #E8E1D3;border-radius:16px;padding:14px 4px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;font:500 12.5px/1.25 Inter,sans-serif;color:#24242C;cursor:pointer;min-height:96px}
  #v3 .acc svg{color:${OLIVA}}
  #v3 .pills{display:flex;gap:8px;margin:16px 0 12px;flex-wrap:nowrap}
  #v3 .pills button{white-space:nowrap;flex:0 1 auto;border:1px solid #E1D9C9;background:#FBF8F2;border-radius:999px;padding:8px 13px;font:500 13.5px/1 Inter,sans-serif;color:#55525F;cursor:pointer}
  #v3 .pills button.on{background:${OLIVA};border-color:${OLIVA};color:#fff}
  #v3 .lista .fila{display:grid;grid-template-columns:28px 1fr 18px;column-gap:12px;align-items:center;padding:13px 14px;border-top:1px solid #EDE6D8}
  #v3 .lista .fila:first-child{border-top:0}
  #v3 .lista .ck{width:24px;height:24px;border-radius:50%;border:2px solid #CFC6B4;background:#fff;display:grid;place-items:center;cursor:pointer;padding:0}
  #v3 .lista .ck.hecha{background:#4E8B3A;border-color:#4E8B3A;color:#fff}
  #v3 .lista .ck.en_curso{border-color:${OLIVA};background:radial-gradient(${OLIVA} 0 4px,#fff 5px)}
  #v3 .lista .tx{font-size:15px;color:#24242C;line-height:1.35;cursor:pointer;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #v3 .lista .tx.ab{white-space:normal}
  #v3 .lista .fila.hecha .tx{color:#8A8577;text-decoration:line-through}
  #v3 .lista .ch{color:#A9A190}
  #v3 .lista .add{display:grid;grid-template-columns:28px 1fr auto;column-gap:12px;align-items:center;padding:10px 14px;border-top:1px solid #EDE6D8}
  #v3 .lista .add input{border:0;background:transparent;font:500 15px Inter,sans-serif;color:#24242C;padding:6px 0;min-width:0;outline:none}
  #v3 .lista .add input::placeholder{color:${OLIVA}}
  #v3 .lista .add .mas{color:${OLIVA};font-size:24px;line-height:1;text-align:center}
  #v3 .lista .add button{border:0;background:${OLIVA};color:#fff;border-radius:10px;padding:8px 12px;font:600 13.5px Inter,sans-serif;cursor:pointer}
  #v3 .fe{display:grid;grid-template-columns:52px 1fr 18px;column-gap:14px;align-items:center;padding:12px 14px;border-top:1px solid #EDE6D8}
  #v3 .fe:first-child{border-top:0}
  #v3 .fe .dd{background:#F6E3E3;border-radius:12px;text-align:center;padding:6px 0 5px;color:${VINO}}
  #v3 .fe .dd b{display:block;font-family:'Playfair Display',serif;font-size:22px;line-height:1}
  #v3 .fe .dd span{font-size:10.5px;font-weight:700;letter-spacing:1px}
  #v3 .fe .tt{font-size:15px;color:#24242C;font-weight:500}
  #v3 .fe .su{font-size:13px;color:#8A8577}
  #v3 .fe .cp{border:0;background:none;color:${OLIVA};font:600 13px Inter,sans-serif;padding:0;cursor:pointer}
  #v3 .fform{display:grid;grid-template-columns:140px 1fr;gap:8px;padding:12px 14px;border-top:1px solid #EDE6D8}
  #v3 .fform input{border:1px solid #DDD6C7;border-radius:10px;background:#fff;padding:10px 12px;font:15px Inter,sans-serif;min-width:0}
  #v3 .fform .u{grid-column:1/-1}
  #v3 .fform button{grid-column:1/-1;border:0;background:${OLIVA};color:#fff;border-radius:10px;padding:11px;font:600 14.5px Inter,sans-serif;cursor:pointer}
  #v3 .idea{margin-top:16px;padding:16px;display:grid;grid-template-columns:34px 1fr;column-gap:12px}
  #v3 .idea b{display:block;font-family:'Playfair Display',serif;font-size:19px;color:${NAVY};margin-bottom:4px}
  #v3 .idea p{margin:0;font-size:14.5px;color:#55525F;line-height:1.45}
  #v3 .rep{display:flex;align-items:center;gap:12px;margin-top:4px}
  #v3 .rep .ir{margin-left:auto;width:44px;height:44px;border-radius:50%;background:#3E4A2A;color:#fff;border:0;display:grid;place-items:center;cursor:pointer;flex:none}
  #v3 .imp{margin-top:16px;padding:16px;display:grid;grid-template-columns:40px 1fr;column-gap:12px}
  #v3 .imp h4{margin:0 0 4px;font-size:12.5px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase}
  #v3 .imp p{margin:0;font-size:15px;line-height:1.5}
  #v3 .imp p b{color:${NAVY}}
  #v3 .red{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:18px 0 12px}
  #v3 .red button{border:1px solid #E1D9C9;background:#FBF8F2;border-radius:999px;padding:9px 6px;font:500 14px/1 Inter,sans-serif;color:#55525F;cursor:pointer}
  #v3 .red button.on{background:${VINO};border-color:${VINO};color:#fff}
  #v3 .big{padding:16px;display:grid;grid-template-columns:auto 1fr;column-gap:14px;align-items:center}
  #v3 .big .n{font-family:'Playfair Display',serif;font-size:34px;font-weight:600;color:${NAVY};line-height:1;font-variant-numeric:tabular-nums}
  #v3 .big .l{font-size:14px;color:#55525F;margin-top:2px}
  #v3 .big .d{font-size:14px;font-weight:600;margin-top:10px}
  #v3 .big .d small{display:block;font-weight:400;color:#8A8577;font-size:13px}
  #v3 .big .sp svg{width:100%;height:90px;display:block}
  #v3 .big .n,#v3 .big .ic{flex:none}
  #v3 .dos{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
  #v3 .dos .card{padding:14px}
  #v3 .dos .n{font-family:'Playfair Display',serif;font-size:26px;font-weight:600;color:${NAVY};line-height:1.1;font-variant-numeric:tabular-nums;white-space:nowrap}
  #v3 .dos .l{font-size:13px;color:#55525F;margin:2px 0 10px;min-height:2.6em;line-height:1.3}
  #v3 .dos svg{width:100%;height:44px;display:block}
  #v3 .recos{margin-top:16px;padding:6px 0}
  #v3 .recos .h{display:flex;align-items:center;gap:10px;padding:10px 16px 8px;font-family:'Playfair Display',serif;font-size:19px;color:${NAVY};font-weight:600}
  #v3 .recos .r{display:grid;grid-template-columns:32px 1fr;column-gap:12px;align-items:start;padding:12px 16px;border-top:1px solid #EDE6D8}
  #v3 .recos .r .k{width:32px;height:32px;border-radius:50%;background:#3E4A2A;color:#fff;display:grid;place-items:center;font:700 14px/1 Inter,sans-serif}
  #v3 .recos .r p{margin:0;font-size:15px;line-height:1.45;padding-top:5px}
  #v3 details.todo{margin-top:22px}
  #v3 details.todo>summary{list-style:none;cursor:pointer;text-align:center;padding:13px;border:1px solid #E1D9C9;border-radius:14px;background:#FBF8F2;font:600 15px Inter,sans-serif;color:${NAVY}}
  #v3 details.todo>summary::-webkit-details-marker{display:none}
  #v3 details.todo #app{margin-top:10px}
  #v3 .vacio{padding:16px;font-size:14.5px;color:#8A8577}
  #v3 .scr{display:none}#v3 .scr.on{display:block}
  #v3nav{position:fixed;left:0;right:0;bottom:0;z-index:60;background:rgba(251,248,242,.97);border-top:1px solid #E1D9C9;padding:8px 6px calc(8px + env(safe-area-inset-bottom,0px));display:grid;grid-template-columns:repeat(5,1fr);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  #v3nav button{border:0;background:none;display:flex;flex-direction:column;align-items:center;gap:4px;font:500 12px/1 Inter,sans-serif;color:#6F6B7C;cursor:pointer;padding:4px 0}
  #v3nav button.on{color:${VINO};font-weight:700}
  #v3nav svg{width:24px;height:24px}
  #v3 .twBtns{display:flex;flex-wrap:wrap;gap:8px}
  #v3 .twBtns a,#v3 .twBtns button{display:inline-flex;align-items:center;gap:8px;background:${NAVY};color:#fff!important;text-decoration:none;border:0;border-radius:999px;padding:12px 20px;font:600 14.5px/1 Inter,sans-serif}
  @media(max-width:380px){#v3 h1.v3t{font-size:30px}#v3 .met .v{font-size:23px}#v3 .acc button{font-size:11.5px}#v3 .hero .p{font-size:48px}}
  `;
  document.head.appendChild(css);

  const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const nf=(v,dec=0)=>v==null||isNaN(v)?'—':Number(v).toLocaleString('es-AR',{minimumFractionDigits:dec,maximumFractionDigits:dec});
  const pct=(a,b)=>(a==null||b==null||!Number(b))?null:Math.round((Number(a)-Number(b))/Number(b)*100);
  const fd=s=>{const p=String(s).slice(0,10).split('-');return p[2]+'/'+p[1];};
  const MESL=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  const MES=['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const ico={
    ig:'<svg width="26" height="26" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#v3g)" stroke-width="2.2"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="url(#v3g)" stroke-width="2.2"/><circle cx="17.3" cy="6.7" r="1.3" fill="#E1306C"/></svg>',
    msj:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#25A35A" stroke-width="2" stroke-linejoin="round"><path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/><path d="M8 9.5h8M8 12.5h5" stroke-linecap="round"/></svg>',
    sp:'<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#1DB954"/><path d="M6.8 9.4c3.6-1.1 7.6-.8 10.6 1M7.4 12.4c3-.9 6.2-.6 8.7.9M8 15.2c2.4-.6 4.7-.4 6.7.7" stroke="#fff" stroke-width="1.7" fill="none" stroke-linecap="round"/></svg>',
    yt:'<svg width="28" height="26" viewBox="0 0 28 20"><rect x="1" y="1" width="26" height="18" rx="5" fill="#FF0000"/><path d="M11.5 6v8l7-4z" fill="#fff"/></svg>',
    flecha:'<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    ch:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M9 6l6 6-6 6"/></svg>',
    tilde:'<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    camp:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    sol:'<svg width="34" height="34" viewBox="0 0 40 40" fill="none" stroke="#E2767C" stroke-width="1.6" stroke-linecap="round"><circle cx="20" cy="20" r="5.5" fill="#F6E3E3"/><circle cx="20" cy="20" r="2" fill="#E2767C" stroke="none"/>'+[0,45,90,135,180,225,270,315].map(a=>{const r=a*Math.PI/180;return `<path d="M${(20+9*Math.cos(r)).toFixed(1)} ${(20+9*Math.sin(r)).toFixed(1)}L${(20+16*Math.cos(r)).toFixed(1)} ${(20+16*Math.sin(r)).toFixed(1)}"/>`;}).join('')+'</svg>',
    hoja:'<svg width="24" height="24" viewBox="0 0 24 24"><path d="M12 21V11" stroke="#3E4A2A" stroke-width="1.8" stroke-linecap="round"/><path d="M12 12C7 12 4.5 8.5 4.5 4.5 9 4.5 12 7.5 12 12z" fill="#3E4A2A"/><path d="M12 14.5c4.2 0 7-2.8 7-6.8-4.2 0-7 2.8-7 6.8z" fill="#87863A"/></svg>',
    luz:'<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#C9A227" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" fill="#FBEFC5"/></svg>'
  };
  const navIco={
    hoy:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 11.2 12 4l9 7.2V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
    proyecto:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 4v4h6V4M8 13h8M8 16.5h5"/></svg>',
    actividades:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M8.5 15.5 10.6 10.6 15.5 8.5 13.4 13.4z" stroke-linejoin="round"/></svg>',
    metricas:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="11" width="4" height="9" rx="1"/><rect x="10" y="5" width="4" height="15" rx="1"/><rect x="16" y="8" width="4" height="12" rx="1"/></svg>',
    ia:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5c2.6 1.5 2.6 7.5 0 9-2.6-1.5-2.6-7.5 0-9z"/><path d="M7.5 12h9"/></svg>'
  };
  const linea=(vals,color,w=200,h=80)=>{ const V=vals.map((v,i)=>[i,v]).filter(x=>x[1]!=null); if(V.length<2) return '';
    const mn=Math.min(...V.map(x=>x[1])), mx=Math.max(...V.map(x=>x[1])), rg=(mx-mn)||1, n=vals.length-1||1;
    const X=i=>8+i*(w-16)/n, Y=v=>h-10-(v-mn)/rg*(h-20);
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${V.map((p,k)=>(k?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>${V.map(p=>`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.6" fill="${color}"/>`).join('')}</svg>`; };
  const barras=(vals,color,w=140,h=44)=>{ const V=vals.filter(v=>v!=null); if(V.length<2) return ''; const mx=Math.max(...V)||1, n=V.length, bw=(w-(n-1)*5)/n;
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${V.map((v,i)=>{const bh=Math.max(3,v/mx*h);return `<rect x="${(i*(bw+5)).toFixed(1)}" y="${(h-bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${color}" opacity="${(0.45+0.55*(i+1)/n).toFixed(2)}"/>`;}).join('')}</svg>`; };

  let TAB='hoy', SUBRED='ig', FILTRO='pendiente', FFORM=false;

  window.V3=function(d){
    try{ armar(d); }catch(e){ console.log('V3',e); }
  };

  function armar(d){
    document.body.classList.add('v3');
    const R=(d.reportes||[]).filter(r=>(new Date(r.hasta)-new Date(r.desde))/864e5>=3).slice().sort((a,b)=>a.desde<b.desde?-1:a.desde>b.desde?1:(a.hasta<b.hasta?-1:1));
    const ult=k=>{ for(let i=R.length-1;i>=0;i--){ const v=R[i].metricas[k]; if(v!=null) return [v,i]; } return [null,-1]; };
    const ant=(k,desde)=>{ for(let i=desde-1;i>=0;i--){ const v=R[i].metricas[k]; if(v!=null) return v; } return null; };
    const MANUAL={msj_conversiones:1,msj_ingreso:1,msj_roas:1,msj_costo_conversion:1};
    const ultM=k=>{ if(!MANUAL[k]) return ult(k); const i=R.length-1; return i>=0&&R[i].metricas[k]!=null?[R[i].metricas[k],i]:[null,-1]; };
    const val=k=>ultM(k)[0];
    const previo=k=>{ const [v,i]=ultM(k); return i<0?null:ant(k,i); };
    // % solo si la base es confiable: con menos de 10 en la medición anterior se muestra la diferencia en números
    const dlt=k=>{ const v=val(k), a=previo(k); if(v==null||a==null||Number(a)<10) return null; return pct(v,a); };
    const dif=k=>{ const v=val(k), a=previo(k); return v==null||a==null?null:Number(v)-Number(a); };
    const serie=(k,n=8)=>R.filter(r=>r.metricas[k]!=null&&(new Date(r.hasta)-new Date(r.desde))/864e5>=3).slice(-n).map(r=>Number(r.metricas[k]));
    const repI=[...(d.reportes||[])].reverse().find(r=>r.metricas&&r.metricas.informe), I=repI?repI.metricas.informe:null;
    const nombre=(d.cliente.nombre||'').replace(/\s+\d+$/,'').split(' ')[0];
    const ini=(d.cliente.nombre||'?').trim()[0].toUpperCase();
    const u=R[R.length-1];
    const deltaTxt=(p,inv)=>p==null?'<span class="ne">&nbsp;</span>':`<span class="${(p>=0)!==!!inv?'si':'no'}">${p>=0?'↑':'↓'} ${Math.abs(p)}%</span>`;
    const dK=(k,inv)=>{ const p=dlt(k); if(p!=null) return deltaTxt(p,inv); const x=dif(k); if(x==null||!Number(previo(k))) return deltaTxt(null);
      return x===0?'<span class="ne">igual que antes</span>':`<span class="${(x>=0)!==!!inv?'si':'no'}">${x>0?'↑ +':'↓ '}${nf(x)} vs. anterior</span>`; };
    const SIM=(typeof MON!=='undefined'&&MON==='USD')?'USD ':'$ ', UNI=SIM==='USD '?'dólar':'peso';
    const verRep=()=>{ const b=document.querySelector('.btnReporte'); if(b) b.click(); };
    let visto=''; try{ visto=localStorage.getItem('sr_rep_'+slug)||''; }catch(e){}
    const nuevoRep=I&&visto!==I.fecha;

    // --- Hoy ---
    // Destacado: primero el resultado de negocio del período (ventas reales anotadas), después el crecimiento de la cuenta.
    // Abajo, siempre que haya, cuánto creció desde que trabaja con Semilla.
    const um=(R[R.length-1]||{}).metricas||{}, Nm=k=>Number(um[k]||0);
    let hero;
    if(Nm('msj_conversiones')>0&&Nm('msj_ingreso')>0)
      hero=`<div class="e">Ventas del período</div><div class="p">${SIM}${nf(um.msj_ingreso)}</div><div class="x">${nf(um.msj_conversiones)} ${Nm('msj_conversiones')===1?'venta':'ventas'}${Nm('msj_inversion')?` con ${SIM}${nf(um.msj_inversion)} de publicidad`:''}${Nm('msj_roas')?`: cada ${UNI} invertido volvió ${SIM}${nf(um.msj_roas,2)}.`:'.'}</div>`;
    else if(Nm('ig_followers_nuevos')>0)
      hero=`<div class="e">Tu progreso del período</div><div class="p">+${nf(um.ig_followers_nuevos)}</div><div class="x">seguidores nuevos en Instagram en el período.</div>`;
    else if(dif('sp_monthly')>0)
      hero=`<div class="e">Tu progreso del período</div><div class="p">+${nf(dif('sp_monthly'))}</div><div class="x">oyentes mensuales en Spotify: hoy son ${nf(val('sp_monthly'))}.</div>`;
    else if(Nm('msj_mensajes')>0)
      hero=`<div class="e">Tu progreso del período</div><div class="p">${nf(um.msj_mensajes)}</div><div class="x">consultas por mensaje en el período.</div>`;
    else hero=`<div class="e">Tu comunidad</div><div class="p">${nf(val('ig_followers_total'))}</div><div class="x">seguidores en Instagram.</div>`;
    const TODOS=(d.reportes||[]).filter(r=>r.metricas&&r.metricas.ig_followers_total!=null).sort((a,b)=>a.hasta<b.hasta?-1:1);
    if(TODOS.length>1){ const a0=Number(TODOS[0].metricas.ig_followers_total), a1=Number(TODOS[TODOS.length-1].metricas.ig_followers_total), dd=new Date(TODOS[0].desde||TODOS[0].hasta);
      if(a1>a0) hero+=`<div class="desde">Desde ${MESL[dd.getMonth()]}${dd.getFullYear()!==new Date().getFullYear()?' de '+dd.getFullYear():''} con Semilla: <b>+${nf(a1-a0)} seguidores</b> (de ${nf(a0)} a ${nf(a1)}).</div>`; }
    const H=(d.hitos||[]).map(h=>({h,v:val(h.metrica)})).filter(x=>x.v!=null&&Number(x.v)<Number(x.h.objetivo));
    const hito=H.sort((a,b)=>(b.v/b.h.objetivo)-(a.v/a.h.objetivo))[0];
    const tiene=k=>val(k)!=null;
    const MET=[['ig_followers_total','seguidores','ig'],['sp_monthly','oyentes','sp'],['yt_views','vistas','yt'],['msj_mensajes','mensajes','msj'],['msj_conversiones','ventas','msj'],['ig_visitas','visitas al perfil','ig']].filter(([k])=>tiene(k)).map(([k,l,ic])=>({k,l,ic}));
    const scrHoy=`
      <h1 class="v3t">Hola ${esc(nombre)}</h1><p class="bj">Seguimos haciendo crecer tu proyecto 🌱</p>
      <div class="hero"><svg class="cielo" width="170" height="170" viewBox="0 0 170 170"><defs><radialGradient id="v3l" cx=".35" cy=".35"><stop offset="0" stop-color="#E9E6DD"/><stop offset="1" stop-color="#8E8C86"/></radialGradient></defs><circle cx="118" cy="64" r="40" fill="url(#v3l)" opacity=".95"/><circle cx="104" cy="54" r="5" fill="#7E7C76" opacity=".5"/><circle cx="128" cy="76" r="7" fill="#7E7C76" opacity=".4"/><g stroke="#C9B98A" stroke-width="1" opacity=".8"><path d="M40 40v26M27 53h26M31 44l18 18M49 44 31 62"/></g><circle cx="40" cy="53" r="3.5" fill="#E8D9A8"/></svg>${hero}<button class="ir" data-ir="metricas" aria-label="Ver métricas">${ico.flecha}</button></div>
      <div class="tit2"><h3>Métricas principales</h3><button data-ir="metricas">Ver todas</button></div>
      <div class="met">${MET.slice(0,3).map(m=>`<div class="card"><div class="ic">${ico[m.ic]}</div><div class="v">${nf(val(m.k))}</div><div class="l">${m.l}</div><div class="d">${dK(m.k)}</div></div>`).join('')}</div>
      ${hito?`<div class="card hito"><div>${ico.sol}</div><div><div class="v3t">Tu próximo hito</div><div class="tx">${esc(hito.h.titulo||('Llegar a '+nf(hito.h.objetivo)))}</div></div><button class="ir" data-ir="proyecto" aria-label="Ver hitos">${ico.flecha}</button>
        <div class="bar"><div class="b"><i style="width:${Math.min(100,hito.v/hito.h.objetivo*100).toFixed(1)}%"></i></div><span>${nf(hito.v)} / ${nf(hito.h.objetivo)}</span></div></div>`:''}
      <div class="tit2"><h3>Accesos rápidos</h3></div>
      <div class="acc">
        <button data-acc="rep"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 19v-5M10 19V9M14 19v-7M18 19V6"/></svg>Ver reporte</button>
        <button data-acc="tarea"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>Agregar tarea</button>
        <button data-acc="fecha"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M9 14.5h2M13 14.5h2"/></svg>Próxima fecha</button>
        <button data-acc="ideas"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/></svg>Ideas</button>
      </div>`;

    // --- Actividades ---
    const T=d.tareas||[], F=d.fechas||[];
    const DS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'], hoy=new Date();
    const lab={pendiente:'Pendientes',en_curso:'En curso',hecha:'Hechas'};
    const TT=T.filter(t=>t.estado===FILTRO);
    const recs=(I&&I.recomendaciones)||((d.recomendaciones&&d.recomendaciones.recomendaciones)||[]).map(r=>r.texto||r.titulo);
    const idea=recs.length?recs[(hoy.getDate())%recs.length]:null;
    const scrAct=`
      <div class="tit2" style="margin-top:0"><h1 class="v3t">Tu plan</h1><span style="font-size:15px;color:#55525F">${DS[hoy.getDay()]} ${String(hoy.getDate()).padStart(2,'0')}/${String(hoy.getMonth()+1).padStart(2,'0')}</span></div>
      <p class="bj">Enfocate en lo importante.</p>
      <div class="pills">${Object.keys(lab).map(k=>`<button class="${k===FILTRO?'on':''}" data-filtro="${k}">${lab[k]} · ${T.filter(t=>t.estado===k).length}</button>`).join('')}</div>
      <div class="card lista">
        ${TT.length?TT.map(t=>`<div class="fila ${t.estado}"><button class="ck ${t.estado}" data-tck="${t.id}" data-est="${t.estado}" aria-label="Cambiar estado">${t.estado==='hecha'?ico.tilde:''}</button><span class="tx" data-tab="1">${esc(t.titulo)}</span><span class="ch">${ico.ch}</span></div>`).join('')
          :`<div class="vacio">${FILTRO==='hecha'?'Todavía no hay tareas hechas.':FILTRO==='en_curso'?'No hay tareas en curso.':'No hay tareas pendientes. ¡Buen trabajo!'}</div>`}
        <div class="add"><span class="mas">+</span><input id="v3tarea" placeholder="Agregar tarea"><button id="v3tadd">Sumar</button></div>
      </div>
      <p style="font-size:13px;color:#8A8577;margin:8px 2px 0">Tocá el círculo para cambiar el estado: pendiente, en curso o hecha.</p>
      <div class="tit2"><h2>Próximas fechas</h2><button id="v3fnueva">${FFORM?'Cerrar':'Agregar fecha'}</button></div>
      <div class="card">
        ${F.length?F.map(f=>{const p=String(f.fecha).slice(0,10).split('-');return `<div class="fe"><div class="dd"><b>${p[2]}</b><span>${MES[+p[1]-1]}</span></div><div><div class="v3t">${esc(f.titulo)}</div><div class="su">${f.url?`<button class="cp" data-copia="${esc(f.url)}">Copiar link de entradas</button>`:'Sin link de entradas'}</div></div><span class="ch" style="color:#A9A190">${ico.ch}</span></div>`;}).join('')
          :`<div class="vacio">Poné aquí las próximas fechas y los links a la ticketera, de ser necesario.</div>`}
        ${FFORM?`<div class="fform"><input id="v3ff" type="date"><input id="v3ft" placeholder="Título. Por ejemplo: ${d.cliente.tipo==='musica'?'Show en La Tangente':'Inicio de la próxima cohorte'}"><input class="u" id="v3fu" placeholder="Link a la ticketera (opcional)"><button id="v3fadd">Guardar fecha</button></div>`:''}
      </div>
      ${idea?`<div class="card idea"><div>${ico.luz}</div><div><b>Idea del día ✨</b><p>${esc(String(idea).replace(/<[^>]+>/g,''))}</p></div></div>`:''}`;

    // --- Métricas ---
    const redes={
      ig:{n:'Instagram',k:'ig_followers_total',l:'seguidores',ex:`${val('ig_followers_nuevos')!=null?'+'+nf(val('ig_followers_nuevos'))+' en el período':''}`,col:VINO,
          a:['ig_costo_follower','costo por seguidor',true,'#E2767C'],b:['ig_inversion','inversión en el período',true,OLIVA]},
      sp:{n:'Spotify',k:'sp_monthly',l:'oyentes mensuales',ex:`${val('sp_streams')!=null?nf(val('sp_streams'))+' reproducciones':''}`,col:'#1DB954',
          a:['sp_streams','reproducciones',false,'#1DB954'],b:['sp_followers','seguidores en Spotify',false,OLIVA]},
      yt:{n:'YouTube',k:'yt_views',l:'vistas',ex:`${val('yt_subs')!=null?nf(val('yt_subs'))+' suscriptores':''}`,col:'#FF0000',
          a:['yt_subs_nuevos','suscriptores nuevos',false,'#E2767C'],b:['yt_horas','horas vistas',false,OLIVA]},
      msj:{n:'Mensajes',k:'msj_mensajes',l:'mensajes recibidos',ex:`${val('msj_conversiones')!=null?nf(val('msj_conversiones'))+' ventas en el período':''}`,col:'#25A35A',
          a:['msj_costo_mensaje','costo por mensaje',true,'#E2767C',2],b:['msj_inversion','inversión en el período',true,OLIVA]}
    };
    Object.keys(redes).forEach(k=>{ if(!tiene(redes[k].k)) delete redes[k]; });
    if(!redes[SUBRED]) SUBRED=Object.keys(redes)[0]||'ig';
    if(!redes[SUBRED]) redes[SUBRED]={n:'Instagram',k:'ig_followers_total',l:'seguidores',ex:'',col:VINO,a:['ig_costo_follower','costo por seguidor',true,'#E2767C'],b:['ig_inversion','inversión en el período',true,OLIVA]};
    const RD=redes[SUBRED];
    const mini=(c)=>{ const v=val(c[0]); return `<div class="card"><div class="n">${c[2]?SIM:''}${nf(v, c[4]!=null?c[4]:c[0]==='yt_horas'?1:(c[2]&&v!=null&&Math.abs(v)<100?2:0))}</div><div class="l">${c[1]}</div>${barras(serie(c[0]),c[3])}</div>`; };
    const imp=I&&I.hallazgos&&I.hallazgos.length?(typeof I.hallazgos[0]==='object'?I.hallazgos[0].t:I.hallazgos[0]):null;
    const scrMet=`
      <div class="rep"><div><h1 class="v3t" style="font-size:31px">Tu reporte</h1><p class="bj">${I?`Del ${fd(I.desde)} al ${fd(I.hasta)}`:'Todavía no hay reporte'}</p></div>${I?`<button class="ir" id="v3rep" aria-label="Abrir reporte">${ico.flecha}</button>`:''}</div>
      ${imp?`<div class="card imp"><div>${ico.sol}</div><div><h4>Lo más importante</h4><p>${imp}</p></div></div>`:''}
      <div class="red">${Object.keys(redes).map(k=>`<button class="${k===SUBRED?'on':''}" data-red="${k}">${redes[k].n}</button>`).join('')}</div>
      <div class="card big"><div><div style="display:flex;align-items:center;gap:10px">${ico[SUBRED]}<div class="n">${nf(val(RD.k))}</div></div><div class="l">${RD.l}</div><div class="d">${dK(RD.k)}<small>${RD.ex}</small></div></div><div class="sp">${linea(serie(RD.k),RD.col)}</div></div>
      <div class="dos">${mini(RD.a)}${mini(RD.b)}</div>
      ${recs.length?`<div class="card recos"><div class="h">${ico.hoja}Recomendaciones SemillaIA</div>${recs.slice(0,3).map((r,i)=>`<div class="r"><span class="k">${i+1}</span><p>${esc(String(r).replace(/<[^>]+>/g,''))}</p></div>`).join('')}</div>`:''}
      <details class="todo" id="v3todo"><summary>Ver todas las métricas</summary></details>`;

    // --- Proyecto ---
    const HT=(d.hitos||[]).map(h=>({h,v:val(h.metrica)}));
    const A=d.activos||[];
    const scrPro=`
      <h1 class="v3t">Tu proyecto</h1><p class="bj">Tus metas, tus links y tu web.</p>
      <div class="tit2"><h2>Hitos</h2></div>
      <div class="card">${HT.length?HT.map(x=>`<div class="hito" style="margin:0;border-top:1px solid #EDE6D8;grid-template-columns:38px 1fr"><div>${ico.sol}</div><div><div class="v3t">${esc(x.h.titulo||nf(x.h.objetivo))}</div><div class="tx">${x.v!=null&&Number(x.v)>=Number(x.h.objetivo)?'¡Logrado!':'En camino'}</div></div><div class="bar"><div class="b"><i style="width:${x.v==null?0:Math.min(100,x.v/x.h.objetivo*100).toFixed(1)}%"></i></div><span>${nf(x.v)} / ${nf(x.h.objetivo)}</span></div></div>`).join(''):'<div class="vacio">Todavía no hay hitos.</div>'}</div>
      <div class="tit2"><h2>Tus activos</h2></div>
      <div class="card lista">${A.length?A.map(a=>`<div class="fila" style="grid-template-columns:1fr 18px">${a.url?`<a class="tx" style="color:${NAVY};text-decoration:none" href="${esc(a.url)}" target="_blank" rel="noopener"><b>${esc(a.titulo)}</b><br><span style="color:#8A8577;font-size:13.5px">${esc(a.descripcion||'')}</span></a>`:`<span class="tx"><b>${esc(a.titulo)}</b><br><span style="color:#8A8577;font-size:13.5px">En preparación</span></span>`}<span class="ch">${ico.ch}</span></div>`).join(''):'<div class="vacio">Todavía no hay enlaces.</div>'}</div>
      <div id="v3web"></div>`;

    // --- SemillaIA ---
    const scrIA=`
      <h1 class="v3t">SemillaIA</h1><p class="bj">Tu reporte, explicado y con próximos pasos.</p>
      ${I?`<div class="card recos" style="margin-top:18px"><div class="h">${ico.sol}Lo principal</div>${(I.hallazgos||[]).map((h,i)=>`<div class="r"><span class="k" style="background:${(h.tipo==='mal')?'#9B2C36':'#4E8B3A'}">${h.tipo==='mal'?'!':'✓'}</span><p>${typeof h==='object'?h.t:h}</p></div>`).join('')}</div>
        <div class="card recos"><div class="h">${ico.hoja}Qué hacer</div>${(I.recomendaciones||[]).map((r,i)=>`<div class="r"><span class="k">${i+1}</span><p>${esc(r)}</p></div>`).join('')}</div>
        ${I.reunion?`<div class="card imp"><div>${ico.luz}</div><div><h4>En la próxima reunión con Agus</h4><p>${esc(I.reunion)}</p></div></div>`:''}
        <div style="margin-top:16px;text-align:center"><button id="v3rep2" style="border:0;background:${NAVY};color:#F2EDE4;border-radius:14px;padding:13px 20px;font:600 15px Inter,sans-serif;cursor:pointer">Abrir el reporte para descargar</button></div>`
        :'<div class="card vacio" style="margin-top:18px">Cuando salga tu primer reporte lo vas a ver acá.</div>'}`;

    // --- montar ---
    let raiz=document.getElementById('v3');
    const app=document.getElementById('app');
    if(!raiz){ raiz=document.createElement('div'); raiz.id='v3'; document.querySelector('.wrap').prepend(raiz); }
    if(app&&app.parentNode!==document.body) document.body.appendChild(app);   // sacarlo antes de reescribir
    raiz.innerHTML=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="v3g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F9A43A"/><stop offset=".5" stop-color="#E1306C"/><stop offset="1" stop-color="#7B3FE4"/></linearGradient></defs></svg><div class="cab"><img src="https://raw.githubusercontent.com/calcagnoagustin/semillaredes/main/assets/semilla-logo-horizontal.png" alt="Semilla Redes"><span class="sep"></span><span class="ia">semilla<b>IA</b></span><span class="esp"></span><button class="camp ${nuevoRep?'nuevo':''}" id="v3camp" aria-label="Reporte nuevo">${ico.camp}<i></i></button><span class="av">${ini}<img src="/assets/avatars/${slug}.jpg?v=${new Date().toISOString().slice(0,10)}" alt="" onerror="this.remove()"></span></div>
      <div class="scr" data-scr="hoy">${scrHoy}</div><div class="scr" data-scr="proyecto">${scrPro}</div><div class="scr" data-scr="actividades">${scrAct}</div><div class="scr" data-scr="metricas">${scrMet}</div><div class="scr" data-scr="ia">${scrIA}</div>`;
    const todo=raiz.querySelector('#v3todo'); if(app&&todo){ todo.appendChild(app); app.classList.remove('oculto'); }
    const web=raiz.querySelector('#v3web'); let intentos=0;
    const ponerWeb=()=>{ const tw=app&&app.querySelector('.twBtns'); if(!tw||!web){ if(intentos++<20) setTimeout(ponerWeb,300); return; } web.innerHTML='<div class="tit2"><h2>Tu web</h2></div><p class="bj" style="margin:0 0 10px;font-size:14.5px">Abrí tu web en modo edición: tocá cualquier texto o foto para cambiarlo, o pedile cambios a SemillaIA. Nada se publica sin que lo apruebes.</p>'; web.appendChild(tw.cloneNode(true)); }; ponerWeb();
    let nav=document.getElementById('v3nav');
    if(!nav){ nav=document.createElement('nav'); nav.id='v3nav'; document.body.appendChild(nav); }
    const NV=[['hoy','Hoy'],['proyecto','Proyecto'],['actividades','Actividades'],['metricas','Métricas'],['ia','SemillaIA']];
    nav.innerHTML=NV.map(([k,t])=>`<button data-ir="${k}">${navIco[k]}<span>${t}</span></button>`).join('');
    ir(TAB,false);

    // --- eventos ---
    document.querySelectorAll('#v3 [data-ir], #v3nav [data-ir]').forEach(b=>b.onclick=()=>ir(b.dataset.ir,true));
    const abre=()=>{ verRep(); raiz.querySelector('#v3camp').classList.remove('nuevo'); };
    raiz.querySelector('#v3camp').onclick=abre;
    const r1=raiz.querySelector('#v3rep'); if(r1) r1.onclick=abre;
    const r2=raiz.querySelector('#v3rep2'); if(r2) r2.onclick=abre;
    raiz.querySelectorAll('[data-acc]').forEach(b=>b.onclick=()=>{ const a=b.dataset.acc;
      if(a==='rep') abre();
      else if(a==='tarea'){ FILTRO='pendiente'; ir('actividades',true); setTimeout(()=>{ const i=document.getElementById('v3tarea'); i&&i.focus(); },60); }
      else if(a==='fecha'){ FFORM=true; TAB='actividades'; armar(window.__D); setTimeout(()=>{ const f=document.getElementById('v3ft'); f&&f.scrollIntoView({block:'center'}); },60); }
      else if(a==='ideas') ir('ia',true); });
    raiz.querySelectorAll('[data-filtro]').forEach(b=>b.onclick=()=>{ FILTRO=b.dataset.filtro; armar(window.__D); });
    raiz.querySelectorAll('[data-red]').forEach(b=>b.onclick=()=>{ SUBRED=b.dataset.red; armar(window.__D); });
    raiz.querySelectorAll('[data-tab]').forEach(s=>s.onclick=()=>s.classList.toggle('ab'));
    const ciclo={pendiente:'en_curso',en_curso:'hecha',hecha:'pendiente'};
    raiz.querySelectorAll('[data-tck]').forEach(b=>b.onclick=async()=>{ b.disabled=true;
      const r=await rpc('sub_tarea_cliente',{p_slug:slug,p_k:tok,p_id:b.dataset.tck,p_estado:ciclo[b.dataset.est]||'pendiente'}); if(r&&r.ok) recargar(); else b.disabled=false; });
    const ta=raiz.querySelector('#v3tadd'), ti=raiz.querySelector('#v3tarea');
    const sumar=async()=>{ const t=ti.value.trim(); if(!t) return; ta.disabled=true; const r=await rpc('sub_tarea_cliente_alta',{p_slug:slug,p_k:tok,p_titulo:t}); if(r&&r.ok){ FILTRO='pendiente'; recargar(); } else ta.disabled=false; };
    if(ta){ ta.onclick=sumar; ti.onkeydown=e=>{ if(e.key==='Enter') sumar(); }; }
    const fn=raiz.querySelector('#v3fnueva'); if(fn) fn.onclick=()=>{ FFORM=!FFORM; armar(window.__D); };
    const fa=raiz.querySelector('#v3fadd'); if(fa) fa.onclick=async()=>{ const f=raiz.querySelector('#v3ff').value, t=raiz.querySelector('#v3ft').value.trim();
      if(!f||!t){ alert('Poné la fecha y el título'); return; } fa.disabled=true;
      const r=await rpc('sub_fecha_guardar',{p_slug:slug,p_k:tok,p_fecha:f,p_titulo:t,p_url:raiz.querySelector('#v3fu').value.trim()||null}); if(r&&r.ok){ FFORM=false; recargar(); } else fa.disabled=false; };
    raiz.querySelectorAll('[data-copia]').forEach(b=>b.onclick=async()=>{ let ok=false; try{ await navigator.clipboard.writeText(b.dataset.copia); ok=true; }catch(e){}
      b.textContent=ok?'Copiado':'No se pudo copiar'; setTimeout(()=>b.textContent='Copiar link de entradas',1600); });
  }

  function ir(t,scroll){ TAB=t;
    document.querySelectorAll('#v3 .scr').forEach(s=>s.classList.toggle('on',s.dataset.scr===t));
    document.querySelectorAll('#v3nav button').forEach(b=>b.classList.toggle('on',b.dataset.ir===t));
    if(scroll) window.scrollTo(0,0); }
})();
