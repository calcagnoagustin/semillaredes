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
  .cabLogo,#cargando{display:none!important}
  html,body{background:#F2EDE4}
  body:not(.v3)::after{content:'';position:fixed;left:50%;top:50%;width:56px;height:56px;margin:-28px 0 0 -28px;background:url("data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cline x1='50' y1='50' x2='50.0' y2='17.0' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='50.0' cy='12.0' r='6.5' fill='%238C8040'/%3E%3Cline x1='50' y1='50' x2='73.3' y2='26.7' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='76.9' cy='23.1' r='6.5' fill='%238C8040'/%3E%3Cline x1='50' y1='50' x2='83.0' y2='50.0' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='88.0' cy='50.0' r='6.5' fill='%238C8040'/%3E%3Cline x1='50' y1='50' x2='73.3' y2='73.3' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='76.9' cy='76.9' r='6.5' fill='%238C8040'/%3E%3Cline x1='50' y1='50' x2='50.0' y2='83.0' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='50.0' cy='88.0' r='6.5' fill='%238C8040'/%3E%3Cline x1='50' y1='50' x2='26.7' y2='73.3' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='23.1' cy='76.9' r='6.5' fill='%238C8040'/%3E%3Cline x1='50' y1='50' x2='17.0' y2='50.0' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='12.0' cy='50.0' r='6.5' fill='%238C8040'/%3E%3Cline x1='50' y1='50' x2='26.7' y2='26.7' stroke='%238C8040' stroke-width='2.6'/%3E%3Ccircle cx='23.1' cy='23.1' r='6.5' fill='%238C8040'/%3E%3Cpath d='M50 21Q81 50 50 79Q19 50 50 21Z' fill='%238C8040'/%3E%3Cpath d='M50 23V77' stroke='%23F2EDE4' stroke-width='2'/%3E%3C/svg%3E") center/contain no-repeat;animation:v3spl 1.4s linear infinite}
  @keyframes v3spl{to{transform:rotate(360deg)}}
  #v3{max-width:560px;margin:0 auto;padding:calc(env(safe-area-inset-top,0px) + 14px) 18px calc(150px + env(safe-area-inset-bottom,0px));font-family:Inter,system-ui,sans-serif;color:#24242C}
  #v3 .cab{display:flex;align-items:center;gap:12px;margin-bottom:18px}
  #v3 .cab img{height:34px;display:block}
  #v3 .cab .sep{width:1px;height:28px;background:#CFC6B4}
  #v3 .cab .ia{font:800 21px/1 Inter,system-ui,sans-serif;color:${NAVY};letter-spacing:-.3px}
  #v3 .cab .ia b{color:${OLIVA};font-weight:700}
  #v3 .cab .esp{flex:1}
  #v3 .cab .camp{position:relative;border:0;background:none;padding:6px;cursor:pointer;color:${VINO}}
  #v3 .cab .camp i{position:absolute;top:4px;right:4px;width:9px;height:9px;border-radius:50%;background:#E2767C;border:2px solid #F2EDE4;display:none}
  #v3 .cab .camp.nuevo i{display:block}
  #v3 .cab .camp b{position:absolute;top:0;right:-2px;min-width:19px;height:19px;padding:0 5px;border-radius:999px;background:#D93A49;color:#fff;font:700 11.5px/19px Inter,sans-serif;text-align:center;border:2px solid #F2EDE4;box-sizing:border-box}
  #v3 .cab .camp b:empty{display:none}
  #v3 .cab .av{cursor:pointer;border:0;padding:0}
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
  #v3 .cta{display:grid;grid-template-columns:1fr auto;grid-template-areas:'l l' 'e n';row-gap:8px;align-items:center;margin-top:12px;padding:14px 16px;border:1px solid #E7DFCF;border-radius:16px;background:#FBF8F2}
  #v3 .cta .l{grid-area:l;font:700 11.5px/1 Inter,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#6F6B7C}
  #v3 .cta .e{grid-area:e;display:flex;align-items:center;gap:8px;font:600 15px/1 Inter,sans-serif;color:#8A8577}
  #v3 .cta .e i{width:9px;height:9px;border-radius:50%;background:#B9B19E}
  #v3 .cta .e.on{color:#2F6B2A}#v3 .cta .e.on i{background:#3E9B3A;box-shadow:0 0 0 4px rgba(62,155,58,.15)}
  #v3 .cta .n{grid-area:n;font:500 14.5px/1 Inter,sans-serif;color:${NAVY}}
  #v3 .cta .pg{grid-column:1/-1;margin-top:6px;padding-top:12px;border-top:1px solid #EAE3D5}
  #v3 .cta .pg .r1{display:flex;align-items:baseline;justify-content:space-between;gap:12px}
  #v3 .cta .pg .r1 span{font:500 14.5px/1.2 Inter,sans-serif;color:#55525F}
  #v3 .cta .pg .r1 b{font:600 16px/1.2 Inter,sans-serif;color:${NAVY};white-space:nowrap;font-variant-numeric:tabular-nums}
  #v3 .cta .pg p{margin:6px 0 0;font-size:13px;line-height:1.45;color:#6F6B7C}
  #v3 .cta .pg p b{color:#3A3846;font-weight:600}
  #v3 .acc2{display:flex;width:max-content;max-width:100%;margin-top:8px;border:1px solid ${NAVY};background:#fff;color:${NAVY};border-radius:999px;padding:7px 13px;font:600 13.5px/1 Inter,sans-serif;cursor:pointer}
  #v3 .hero .rg{font-size:14px;opacity:.85;margin-top:6px}
  #v3 .met .v.ch{font-size:20px;white-space:nowrap}
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
  #v3 #v3todo .hito{display:block;margin:0 0 10px;padding:16px 18px}   /* hitos del panel completo: su propio diseño, no la tarjeta de Hoy */
  #v3 .acc{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
  #v3 .acc button{background:#FBF8F2;border:1px solid #E8E1D3;border-radius:16px;padding:14px 4px 12px;display:flex;flex-direction:column;align-items:center;gap:8px;font:500 12.5px/1.25 Inter,sans-serif;color:#24242C;cursor:pointer;min-height:96px}
  #v3 .acc svg{color:${OLIVA}}
  #v3 .pills{display:flex;gap:8px;margin:16px 0 12px;flex-wrap:nowrap}
  #v3 .pills button{white-space:nowrap;flex:0 1 auto;border:1px solid #E1D9C9;background:#FBF8F2;border-radius:999px;padding:8px 13px;font:500 13.5px/1 Inter,sans-serif;color:#55525F;cursor:pointer}
  #v3 .pills button.on{background:${OLIVA};border-color:${OLIVA};color:#fff}
  #v3 .webs .edt{display:inline-block;border:0;background:#2F7A4F;color:#fff;border-radius:999px;padding:8px 13px;font:600 13px/1 Inter,sans-serif;text-decoration:none;white-space:nowrap}
  #v3 .lista .est{border:1px solid #E1D9C9;background:#FBF8F2;border-radius:999px;padding:6px 10px;font:500 12px/1 Inter,sans-serif;color:#6F6B7C;cursor:pointer;white-space:nowrap}
  #v3 .lista .est.on{background:#F1EEDB;border-color:${OLIVA};color:#5E5C22;font-weight:600}
  #v3 .lista .fila{display:grid;grid-template-columns:28px 1fr auto;column-gap:12px;align-items:center;padding:13px 14px;border-top:1px solid #EDE6D8}
  #v3 .lista .fila:first-child{border-top:0}
  #v3 .lista .ck{width:24px;height:24px;border-radius:50%;border:2px solid #CFC6B4;background:#fff;display:grid;place-items:center;cursor:pointer;padding:0}
  #v3 .lista .ck.hecha{background:#4E8B3A;border-color:#4E8B3A;color:#fff}
  #v3 .lista .ck.en_curso{border-color:${OLIVA};background:radial-gradient(${OLIVA} 0 4px,#fff 5px)}
  #v3 .lista .tx{font-size:15px;color:#24242C;line-height:1.35;cursor:pointer;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  #v3 .lista .tx.ab{white-space:normal}
  #v3 .lista .tw{min-width:0;display:flex;flex-direction:column;gap:3px}
  #v3 .lista .fila.tarea{grid-template-columns:28px 1fr;align-items:start}
  #v3 .lista .fila.tarea .ck{margin-top:calc((20.25px - 24px)/2)}
  #v3 .lista .fila.tarea .tx{white-space:normal}
  #v3 .lista .tacc{display:flex;align-items:center;gap:8px;margin-top:8px;flex-wrap:wrap}
  #v3 .lista .tacc .sp,#v3 .notas3 .cb .sp{flex:1}
  #v3 .lista .tacc .alt{font:500 12.5px/1.2 Inter,sans-serif}
  #v3 .ib2{display:inline-flex;align-items:center;gap:4px}
  #v3 .ib{width:32px;height:32px;border-radius:50%;border:0;background:none;color:#8A8577;display:grid;place-items:center;cursor:pointer;padding:0}
  #v3 .ib:hover{background:#F1ECE1;color:${NAVY}}
  #v3 .ib[data-del2]:hover{color:${VINO}}
  #v3 .hacc{position:absolute;top:10px;right:8px}
  #v3 .card > .hito{border:0;border-radius:0;background:none;box-shadow:none;border-top:1px solid #EDE6D8}
  #v3 .card > .hito:first-child{border-top:0}
  #v3 .edf{display:grid;gap:8px;width:100%}
  #v3 .edf input,#v3 .edf textarea{width:100%;box-sizing:border-box;border:1px solid #E1D9C9;border-radius:12px;padding:10px 12px;font:500 15px/1.4 Inter,sans-serif;color:#24242C;background:#fff}
  #v3 .edf .alacc{display:flex;gap:8px}
  #v3 .edf button{border:0;background:${OLIVA};color:#fff;border-radius:999px;padding:10px 16px;font:600 13.5px Inter,sans-serif;cursor:pointer}
  #v3 .edf button.sec{background:none;border:1px solid #CFC6B4;color:#55525F}

  #v3 .lista .alt{display:inline-flex;align-items:center;gap:5px;font:500 12.5px/1.2 Inter,sans-serif;color:#8A8577}
  #v3 .lista .alt.on{color:${VINO}}
  #v3 .lista .alt svg{width:13px;height:13px;flex:none}
  #v3 .lista .alb{width:32px;height:32px;border-radius:50%;border:1px solid #E1D9C9;background:#FBF8F2;color:#8A8577;display:grid;place-items:center;cursor:pointer;padding:0}
  #v3 .lista .alb.on{border-color:${VINO};color:${VINO};background:#F7EDEF}
  #v3 .lista .alform{padding:4px 14px 14px 54px;border-top:0}
  #v3 .lista .alform label{display:block;font:600 13px/1.3 Inter,sans-serif;color:#24242C;margin:0 0 8px}
  #v3 .lista .alform input{width:100%;box-sizing:border-box;border:1px solid #E1D9C9;border-radius:12px;padding:10px 12px;font:500 15px Inter,sans-serif;color:#24242C;background:#fff}
  #v3 .lista .alform .alacc{display:flex;gap:8px;margin-top:10px}
  #v3 .lista .alform button{border:0;background:${OLIVA};color:#fff;border-radius:999px;padding:10px 16px;font:600 13.5px Inter,sans-serif;cursor:pointer}
  #v3 .lista .alform button.sec{background:none;border:1px solid #CFC6B4;color:#55525F}
  #v3 .lista .alform p{margin:8px 0 0;font-size:12.5px;color:#8A8577}
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
  #v3 .hform select{grid-column:1/-1;border:1px solid #DDD6C7;border-radius:10px;background:#fff;padding:10px 12px;font:15px Inter,sans-serif;color:#24242C}
  #v3 .lista .hx{width:28px;height:28px;border:0;border-radius:50%;background:none;color:#A9A190;font:400 20px/1 Inter,sans-serif;cursor:pointer;padding:0}
  #v3 .dest{margin-top:26px;background:#FBF8F2;border:1.5px solid ${VINO};border-radius:18px;padding:18px 18px 16px}
  #v3 .dest .de{display:flex;align-items:center;justify-content:space-between;gap:10px;white-space:nowrap;font-size:11.5px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase;color:${VINO}}
  #v3 .dest .de span{display:inline-flex;align-items:center;gap:6px;font-size:11px;letter-spacing:1px;color:#55525F}
  #v3 .dest .de span i{width:8px;height:8px;border-radius:50%;background:#A9A190}
  #v3 .dest .de span.on i{background:#2F7A4F}
  #v3 .dest h3{margin:8px 0 2px;font-family:'Playfair Display',serif;font-size:24px;font-weight:600;color:${NAVY}}
  #v3 .dest .ds{font-size:13px;color:#6B6878}
  #v3 .dest .dg{display:grid;grid-template-columns:repeat(2,1fr);gap:14px 12px;margin-top:14px}
  #v3 .dest .dg b{display:block;font-size:22px;line-height:1.1;color:#24242C;font-weight:700}
  #v3 .dest .dg small{display:block;font-size:12.5px;color:#55525F;margin-top:3px}
  #v3 .aviso-act{margin:10px 0 0;display:inline-block;padding:7px 12px;border-radius:999px;background:#EFE9DC;font:500 13px/1.3 Inter,sans-serif;color:#55525F}
  #v3 .dest .dp{font-size:12px;color:#8A8698;margin-top:12px}
  #v3 .cjl{display:grid;gap:12px}
  #v3 .cjl .card{padding:16px}
  #v3 .cjl .ct{font-size:16px;font-weight:600;color:#24242C;line-height:1.25}
  #v3 .cjl .cs{font-size:13px;color:#6B6878;margin-top:3px}
  #v3 .cjl .cg{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}
  #v3 .cjl .cg b{display:block;font-size:20px;line-height:1.1;color:${NAVY};font-weight:700}
  #v3 .cjl .cg small{display:block;font-size:12px;color:#55525F;margin-top:3px;line-height:1.3}
  #v3 .gira{display:grid;gap:12px}
  #v3 .gira .card{display:grid;grid-template-columns:76px 1fr;gap:14px;align-items:center;padding:14px}
  #v3 .gira img{width:76px;height:76px;border-radius:12px;object-fit:cover;display:block}
  #v3 .gira .gt{font-size:16px;font-weight:600;color:#24242C;line-height:1.25}
  #v3 .gira .gs{font-size:13px;color:#6B6878;margin-top:2px}
  #v3 .gira .gn{display:flex;align-items:baseline;gap:6px;margin-top:8px}
  #v3 .gira .gn b{font-size:24px;line-height:1;color:#2F7A4F;font-weight:700}
  #v3 .gira .gn span{font-size:13px;color:#55525F}
  #v3 .gira .gl{display:inline-block;margin-top:8px;font-size:12px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${VINO};text-decoration:none}
  #v3 .gira .gp{font-size:12px;color:#8A8698;margin-top:4px}
  #v3 .gira .gc{font-size:13.5px;color:#55525F;margin-top:6px}
  #v3 .gira .gc b{color:#24242C;font-weight:700}
  #v3 .hito .hx{position:absolute;top:10px;right:10px;width:28px;height:28px;border:0;border-radius:50%;background:none;color:#A9A190;font:400 20px/1 Inter,sans-serif;cursor:pointer}
  #v3 .tkp .fila{grid-template-columns:1fr auto}
  #v3 .tkp .tx b{color:${NAVY};font-size:15.5px}#v3 .tkp .tx span{font-size:13.5px;color:#6F6B7C}
  #v3 .tkp .rt{text-align:right;line-height:1.1}#v3 .tkp .rt b{display:block;font:600 21px/1.1 'Playfair Display',serif;color:#2F6B2A}#v3 .tkp .rt small{font-size:11.5px;color:#8A8577}
  #v3 .notas3 .nn{display:grid;gap:8px;padding:12px 14px}
  #v3 .notas3 textarea{border:1px solid #DDD6C7;border-radius:12px;background:#fff;padding:11px 12px;font:15px/1.45 Inter,sans-serif;resize:vertical;min-height:72px}
  #v3 .notas3 .nn button{justify-self:end;border:0;background:${OLIVA};color:#fff;border-radius:10px;padding:10px 16px;font:600 14px Inter,sans-serif;cursor:pointer}
  #v3 .notas3 .nt{padding:12px 14px;border-top:1px solid #EDE6D8}
  #v3 .notas3 .cb{display:flex;align-items:center;gap:8px}
  #v3 .notas3 .cb b{font-size:13.5px;color:${NAVY}}#v3 .notas3 .cb b.sem{color:${VINO}}
  #v3 .notas3 .cb small{font-size:12.5px;color:#8A8577}
  #v3 .notas3 .nx{margin-left:auto;width:28px;height:28px;border:0;background:none;color:#A9A190;font:400 20px/1 Inter,sans-serif;cursor:pointer}
  #v3 .notas3 .nt p{margin:4px 0 0;font-size:14.5px;line-height:1.45;color:#3A3846}
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
  #v3 .big .kp{display:grid;gap:12px;padding-left:16px;border-left:1px solid #E4DED0;align-self:stretch;align-content:center}
  #v3 .big .kp .n{font-size:28px}
  #v3 .big .kp .l{font-size:13px}
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
  #v3 .cjs{margin-top:14px}
  #v3 .cjs h3{font:600 17px Inter,sans-serif;color:${NAVY};margin:0 0 4px}
  #v3 .cjs .bjc{font-size:13.5px;color:#8A8577;margin:0 0 12px}
  #v3 .cj{background:#FBF8F2;border:1px solid #E1D9C9;border-radius:16px;padding:16px 16px 10px;margin-bottom:12px}
  #v3 .cj .nm{font:600 15px Inter,sans-serif;color:${NAVY};margin:0 0 10px}
  #v3 .cj .ks{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:10px}
  #v3 .cj .ks div{background:#fff;border-radius:10px;padding:8px 10px}
  #v3 .cj .ks b{display:block;font:600 15.5px Inter,sans-serif;color:${NAVY};white-space:nowrap}
  #v3 .cj .ks span{font-size:12px;color:#8A8577}
  #v3 .cj .gl{font-size:12px;color:#8A8577;margin:6px 0 0}
  #v3 .cj svg{display:block;width:100%;height:auto}
  #v3 .vacio{padding:16px;font-size:14.5px;color:#8A8577}
  #v3 .scr{display:none}#v3 .scr.on{display:block}
  #v3 .perh{display:flex;align-items:baseline;justify-content:space-between;gap:12px;margin:26px 2px 0}
  #v3 .perh h3{margin:0;font-family:'Playfair Display',serif;font-size:23px;font-weight:600;color:${NAVY}}
  #v3 .perh span{font:600 12px/1 Inter,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#55525F;white-space:nowrap}
  #v3 .perh+.red{margin-top:12px}
  #v3 .mesp{margin-top:16px;background:${NAVY};color:#F2EDE4;border-radius:20px;padding:18px 18px 16px}
  #v3 .mesp .e{font:700 12px/1 Inter,sans-serif;letter-spacing:2px;text-transform:uppercase;opacity:.9}
  #v3 .mesp .g{display:grid;grid-template-columns:1fr 1fr;gap:14px 12px;margin-top:14px}
  #v3 .mesp .g b{display:block;font:600 26px/1.1 'Playfair Display',serif;font-variant-numeric:tabular-nums;white-space:nowrap}
  #v3 .mesp .g span{display:block;font-size:13px;opacity:.85;margin-top:3px}
  #v3 .mesp p{margin:14px 0 0;padding-top:10px;border-top:1px solid rgba(242,237,228,.18);font-size:12.5px;line-height:1.4;opacity:.75}
  #v3 .rph{position:relative;padding-top:6px;margin-bottom:6px}
  #v3 .rhoja{position:absolute;right:-8px;top:-6px;pointer-events:none;z-index:0}
  #v3 h1.rpt{position:relative;font-size:46px;letter-spacing:-.5px}
  #v3 .rpr{position:relative;display:flex;align-items:center;gap:14px;margin-top:10px;max-width:66%}
  #v3 .rpr span{font:600 12.5px/1 Inter,sans-serif;letter-spacing:3px;text-transform:uppercase;color:#3A3846;white-space:nowrap}
  #v3 .rpr i{flex:1;height:1px;background:#BDB49E}
  #v3 .rps{position:relative;margin:10px 0 0;font:400 16.5px/1.4 'Playfair Display',serif;color:#55525F;max-width:60%}
  #v3 .ci{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;flex:none;color:#fff}
  #v3 .ci.ok{background:#5A6530}#v3 .ci.ma{background:#A3283A}#v3 .ci.nu{background:#4A5426;font:600 17px/1 Inter,sans-serif}
  #v3 .rdz{position:relative;z-index:1;margin-top:20px;padding:16px;display:grid;grid-template-columns:46px 1fr auto;grid-template-areas:'e e e' 'ci hd gr' 'tx tx tx';column-gap:12px;row-gap:10px;align-items:center;box-shadow:0 6px 18px rgba(26,36,86,.06)}
  #v3 .rdz .ci{grid-area:ci}#v3 .rdz .e{grid-area:e}#v3 .rdz .hd{grid-area:hd;min-width:0}#v3 .rdz .gr{grid-area:gr}
  #v3 .rdz .e{font:600 10.5px/1 Inter,sans-serif;letter-spacing:1.6px;white-space:nowrap;text-transform:uppercase;color:#3A3846}
  #v3 .rdz .v{margin-top:0;font-family:'Playfair Display',serif;color:${NAVY};line-height:1.05}
  #v3 .rdz .v b{font-size:32px;font-weight:600;font-variant-numeric:tabular-nums}#v3 .rdz .v span{font-size:21px;font-weight:600}
  #v3 .rdz .gr{display:grid;justify-items:center;row-gap:5px;padding-left:12px;border-left:1px solid #E4DCCB}
  #v3 .rdz .gr svg{display:block}
  #v3 .rdz .pl{background:#F7D9D4;color:#8E2433;border-radius:999px;padding:6px 11px;font:600 15px/1 'Playfair Display',serif;white-space:nowrap}
  #v3 .rdz .pl.baja{background:#ECE7DC;color:#55525F}
  #v3 .rdz small{font:600 8.5px/1.25 Inter,sans-serif;letter-spacing:1.4px;text-transform:uppercase;color:#6F6B7C;text-align:center;max-width:84px}
  #v3 .rdz .tx{grid-area:tx;margin:2px 0 0;font-size:14.5px;line-height:1.5;color:#3A3846}
  #v3 .rdz .tx b{color:${NAVY}}
  #v3 .rsh{display:flex;align-items:center;gap:10px;margin:28px 0 12px}
  #v3 .rsh svg{flex:none}
  #v3 .rsh h2{margin:0;font-family:'Playfair Display',serif;font-size:27px;font-weight:600;color:${NAVY};white-space:nowrap}
  #v3 .rsh i{flex:1;height:1px;background:#C9C0AA;min-width:16px}
  #v3 .rsh span{font:600 10.5px/1 Inter,sans-serif;letter-spacing:2px;text-transform:uppercase;color:#55525F;white-space:nowrap}
  #v3 .rit{display:grid;grid-template-columns:42px 1fr;column-gap:14px;align-items:start;padding:18px 16px 16px;margin-top:10px}
  #v3 .rit .ci{width:42px;height:42px}
  #v3 .rit h3{margin:0 0 4px;font:600 18px/23px 'Playfair Display',serif;color:${NAVY}}
  #v3 .rit p{margin:0;font-size:14.5px;line-height:1.5;color:#55525F}
  #v3 .rit p b{color:#3A3846;font-weight:600}
  #v3 .rit .ci{margin-top:-9.5px}   /* centro del círculo = centro de la primera línea del título (23px) */
  #v3 .rit>div>p:first-child{margin-top:.6px}
  #v3 .rit.rq.con{grid-template-columns:42px 1fr 34px;cursor:pointer}
  #v3 .rit.rq .ch{width:34px;height:34px;border-radius:50%;background:#F1ECE1;color:#55525F;display:grid;place-items:center;align-self:center}
  #v3 .rit.rq.con:active{background:#F4EFE4}
  #v3 .rru{margin-top:16px;display:grid;grid-template-columns:34px 1px 1fr;column-gap:14px;align-items:center;padding:16px;border-radius:18px;background:#F9E6E2;border:1px solid #EDC7C0}
  #v3 .rru>svg{justify-self:center}
  #v3 .rru>i{align-self:stretch;background:#E3B9B1}
  #v3 .rru h4{margin:0 0 6px;font:600 10px/1.2 Inter,sans-serif;letter-spacing:1.1px;white-space:nowrap;text-transform:uppercase;color:#7A1F3A}
  #v3 .rru p{margin:0;font-size:15px;line-height:1.5;color:${NAVY}}
  #v3 .rbt{display:grid;gap:10px;margin-top:20px}
  #v3 .rbt button{display:flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;padding:15px 20px;cursor:pointer;font:600 17px/1 'Playfair Display',serif}
  #v3 .rbt .pri{border:0;background:${NAVY};color:#F2EDE4}
  #v3 .rbt .sec{border:1px solid #CFC6B4;background:#FBF8F2;color:${NAVY};font:600 15px/1 Inter,sans-serif}
  #v3 .rbt button:disabled{opacity:.7}
  #v3 .v3exp{position:fixed;left:-10000px;top:0;width:560px;padding:26px 24px 30px;background:#F2EDE4;box-sizing:border-box}
  #v3 .v3exp .cab .nm{font:600 14px/1.2 Inter,sans-serif;color:${NAVY};text-align:right;max-width:200px}
  #v3 .v3exp .tsec{margin:16px 2px 8px;font:700 12px/1 Inter,sans-serif;letter-spacing:1.6px;text-transform:uppercase;color:#6F6B7C}
  .v3exp .tlis{padding:0}
  .v3exp .tfi{display:grid;grid-template-columns:24px 1fr;column-gap:12px;align-items:start;padding:12px 14px;border-top:1px solid #EDE6D8}
  .v3exp .tfi:first-child{border-top:0}
  .v3exp .tck{width:20px;height:20px;border-radius:50%;border:2px solid #CFC6B4;box-sizing:border-box;display:grid;place-items:center;font:700 12px/1 Inter,sans-serif;color:#fff;margin-top:calc((20.25px - 20px)/2)}
  .v3exp .tfi.hecha .tck{background:#4E8B3A;border-color:#4E8B3A}
  .v3exp .tfi.en_curso .tck{border-color:${OLIVA}}
  .v3exp .ttx{font:400 15px/1.35 Inter,sans-serif;color:#24242C}
  .v3exp .tfi.hecha .ttx{color:#8A8577;text-decoration:line-through}
  .v3exp .tec{display:inline-block;margin-top:6px;margin-right:8px;border:1px solid ${OLIVA};background:#F1EEDB;border-radius:999px;padding:4px 9px;font:500 11.5px/1 Inter,sans-serif;color:#55525F}
  .v3exp .tal{display:inline-block;margin-top:6px;font:500 12px/1.2 Inter,sans-serif;color:${VINO}}
  .v3exp .pie{margin-top:22px;text-align:center;font:500 12px/1 Inter,sans-serif;letter-spacing:1.5px;color:#8A8577}
  .v3hoja{position:fixed;inset:0;z-index:80;background:#F2EDE4;overflow-y:auto;transform:translateX(100%);transition:transform .28s cubic-bezier(.2,.8,.2,1);font-family:Inter,system-ui,sans-serif;color:#24242C;-webkit-overflow-scrolling:touch}
  .v3hoja.on{transform:none}
  .v3hoja .hh{position:sticky;top:0;z-index:2;display:grid;grid-template-columns:44px 1fr 44px;align-items:center;padding:calc(env(safe-area-inset-top,0px) + 10px) 10px 10px;background:rgba(242,237,228,.96);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid #E1D9C9}
  .v3hoja .hh h2{margin:0;text-align:center;font:600 17px/1.2 Inter,sans-serif;color:${NAVY}}
  .v3hoja .vo{width:44px;height:44px;border:0;background:none;color:${NAVY};display:grid;place-items:center;cursor:pointer}
  .v3hoja .hc{max-width:560px;margin:0 auto;padding:16px 18px calc(40px + env(safe-area-inset-bottom,0px))}
  .v3hoja .card{background:#FBF8F2;border:1px solid #E7DFCF;border-radius:18px}
  .v3hoja .vacio{padding:22px 18px;color:#6F6B7C;font-size:15px;line-height:1.45;text-align:center}
  .v3hoja .lista>*{border-top:1px solid #EDE6D8}.v3hoja .lista>*:first-child{border-top:0}
  .v3hoja .ni{width:100%;display:grid;grid-template-columns:40px 1fr 10px;column-gap:12px;align-items:start;text-align:left;border:0;background:none;padding:14px;cursor:pointer;font:inherit;color:inherit}
  .v3hoja .ni .ic{width:40px;height:40px;border-radius:50%;background:#EFEAD9;color:${OLIVA};display:grid;place-items:center}
  .v3hoja .ni .tx{display:flex;flex-direction:column;gap:3px;min-width:0}
  .v3hoja .ni b{font-size:15px;color:${NAVY}}.v3hoja .ni .tx span{font-size:14px;line-height:1.4;color:#55525F}.v3hoja .ni small{font-size:12.5px;color:#8A8577}
  .v3hoja .ni i{width:10px;height:10px;border-radius:50%;background:#D93A49;margin-top:15px}
  .v3hoja .ni.nueva{background:#FFFDF8}
  .v3hoja .pf{text-align:center;padding:8px 0 4px}
  .v3hoja .pf .ft{width:104px;height:104px;margin:0 auto 14px;border-radius:50%;background:${NAVY};color:#F2EDE4;display:grid;place-items:center;font:700 40px/1 Inter,sans-serif;position:relative;overflow:hidden;box-shadow:0 6px 18px rgba(26,36,86,.18)}
  .v3hoja .pf .ft img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
  .v3hoja .v3t{font-family:'Playfair Display',serif;font-weight:600;font-size:30px;line-height:1.1;color:${NAVY};margin:0}
  .v3hoja .bj{color:#55525F;font-size:15.5px;margin:6px 0 0}
  .v3hoja .tit2{display:flex;align-items:center;justify-content:space-between;margin:26px 2px 10px}.v3hoja .tit2 h2{margin:0;font-family:'Playfair Display',serif;font-weight:600;font-size:21px;color:${NAVY}}
  .v3hoja .rd{display:grid;grid-template-columns:30px 1fr auto;column-gap:12px;align-items:center;padding:13px 14px}
  .v3hoja .rd .ic{display:grid;place-items:center}
  .v3hoja .rd .tx{min-width:0;overflow:hidden}.v3hoja .rd .tx span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .v3hoja .rd .tx b{font-size:15px;color:${NAVY}}.v3hoja .rd .tx span{font-size:13px;color:#8A8577}
  .v3hoja .st{font:600 12px/1 Inter,sans-serif;padding:7px 10px;border-radius:999px;background:#EEE9DF;color:#8A8577;white-space:nowrap}
  .v3hoja .st.ok{background:#E3F0E2;color:#2F6B2A}
  .v3hoja .cpL{border:0;background:${NAVY};color:#F2EDE4;border-radius:12px;padding:12px 18px;font:600 14.5px/1 Inter,sans-serif;cursor:pointer}
  #v3chatb{position:fixed;right:16px;bottom:calc(82px + env(safe-area-inset-bottom,0px));z-index:70;display:flex;align-items:center;gap:8px;border:0;border-radius:999px;background:${NAVY};color:#F2EDE4;padding:12px 16px 12px 14px;box-shadow:0 8px 24px rgba(26,36,86,.28);font:500 15px/1 Inter,sans-serif;cursor:pointer}
  #v3chatb b{color:#C9C27A;font-weight:700}
  #v3chatb.oc{display:none}
  #v3chat{position:fixed;left:10px;right:10px;bottom:calc(76px + env(safe-area-inset-bottom,0px));z-index:71;max-width:520px;margin:0 auto;height:min(68vh,560px);background:#FBF8F2;border:1px solid #E1D9C9;border-radius:22px;box-shadow:0 16px 40px rgba(26,36,86,.22);display:none;flex-direction:column;overflow:hidden}
  #v3chat.on{display:flex}
  #v3chat .hd{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 14px 12px 18px;background:${NAVY};color:#F2EDE4}
  #v3chat .hd b{font:700 17px/1.2 Inter,sans-serif}#v3chat .hd b i{font-style:normal;color:#C9C27A}
  #v3chat .hd small{display:block;font-size:12.5px;opacity:.85;margin-top:3px}
  #v3chat .mn{flex:none;width:36px;height:36px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font:600 22px/1 Inter,sans-serif;cursor:pointer;display:grid;place-items:center;padding:0 0 3px}
  #v3chat .ms{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:8px;-webkit-overflow-scrolling:touch}
  #v3chat .m{max-width:84%;padding:10px 13px;border-radius:16px;font:400 14.5px/1.45 Inter,sans-serif}
  #v3chat .m.ia{align-self:flex-start;background:#fff;border:1px solid #EDE6D8;color:#24242C;border-bottom-left-radius:6px}
  #v3chat .m.yo{align-self:flex-end;background:${OLIVA};color:#fff;border-bottom-right-radius:6px}
  #v3chat .m.esp{display:flex;gap:5px;padding:14px}#v3chat .m.esp i{width:7px;height:7px;border-radius:50%;background:#B9B19E;animation:v3p 1s infinite}#v3chat .m.esp i:nth-child(2){animation-delay:.15s}#v3chat .m.esp i:nth-child(3){animation-delay:.3s}
  @keyframes v3p{0%,100%{opacity:.3}50%{opacity:1}}
  #v3chat .sg{display:flex;flex-wrap:wrap;gap:8px;padding:0 14px 10px}#v3chat .sg:empty{display:none}
  #v3chat .sg button{border:1px solid #E1D9C9;background:#fff;border-radius:999px;padding:8px 12px;font:500 13px/1 Inter,sans-serif;color:${NAVY};cursor:pointer}
  #v3chat .in{display:grid;grid-template-columns:1fr 44px;gap:8px;padding:10px;border-top:1px solid #EDE6D8;background:#fff}
  #v3chat .in input{border:1px solid #E1D9C9;border-radius:999px;padding:11px 15px;font:400 16px Inter,sans-serif;outline:none;min-width:0;background:#FBF8F2}
  #v3chat .in button{border:0;border-radius:50%;background:${NAVY};color:#fff;display:grid;place-items:center;cursor:pointer}
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
    lapiz:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4"/></svg>',
    tacho:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M4.5 7h15M9.5 7V4.8h5V7M6.5 7l.9 12.2a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5L17.5 7M10 11v6M14 11v6"/></svg>',
    alarma:'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 0 1 12 0c0 6 2.5 7.5 2.5 7.5h-17S6 15 6 9z"/><path d="M10 19.5a2.2 2.2 0 0 0 4 0"/></svg>',
    ig:'<svg width="26" height="26" viewBox="0 0 24 24"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5" fill="none" stroke="url(#v3g)" stroke-width="2.2"/><circle cx="12" cy="12" r="4.3" fill="none" stroke="url(#v3g)" stroke-width="2.2"/><circle cx="17.3" cy="6.7" r="1.3" fill="#E1306C"/></svg>',
    vta:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F7A4F" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M5 8h14l-1.2 11.5a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
    frm:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F7A4F" stroke-width="2" stroke-linejoin="round"><path d="M2.5 9 12 4.5 21.5 9 12 13.5z"/><path d="M6.5 11v4.5c1.6 1.6 3.4 2.4 5.5 2.4s3.9-.8 5.5-2.4V11M21.5 9v5" stroke-linecap="round"/></svg>',
    stm:'<svg width="26" height="26" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="#1B2838"/><circle cx="15.6" cy="9.4" r="2.6" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="9" cy="15.2" r="1.9" fill="none" stroke="#fff" stroke-width="1.5"/><path d="M4.5 13.2l3.9 1.6M10.6 14.1l3.3-3" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/></svg>',
    vtv:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F7A4F" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M5 8h14l-1.2 11.5a1 1 0 0 1-1 .9H7.2a1 1 0 0 1-1-.9z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/></svg>',
    tk:'<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#2F7A4F" stroke-width="2" stroke-linejoin="round"><path d="M3.5 8.5V6.5h17v2a2.5 2.5 0 0 0 0 5v2h-17v-2a2.5 2.5 0 0 0 0-5z"/><path d="M14.5 7v1.5M14.5 11v1.5M14.5 15v1" stroke-linecap="round"/></svg>',
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
    ia:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3.5h7l4 4V20a.5.5 0 0 1-.5.5h-10A.5.5 0 0 1 7 20z" transform="translate(-.5 0)"/><path d="M13.5 3.5V8h4M9.5 12.5h5M9.5 16h5"/></svg>'
  };
  const linea=(vals,color,w=200,h=80)=>{ const V=vals.map((v,i)=>[i,v]).filter(x=>x[1]!=null); if(V.length<2) return '';
    const mn=Math.min(...V.map(x=>x[1])), mx=Math.max(...V.map(x=>x[1])), rg=(mx-mn)||1, n=vals.length-1||1;
    const X=i=>8+i*(w-16)/n, Y=v=>h-10-(v-mn)/rg*(h-20);
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><path d="${V.map((p,k)=>(k?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>${V.map(p=>`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.6" fill="${color}"/>`).join('')}</svg>`; };
  const barras=(vals,color,w=140,h=44)=>{ const V=vals.filter(v=>v!=null); if(V.length<2) return ''; const mx=Math.max(...V)||1, n=V.length, bw=(w-(n-1)*5)/n;
    return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${V.map((v,i)=>{const bh=Math.max(3,v/mx*h);return `<rect x="${(i*(bw+5)).toFixed(1)}" y="${(h-bh).toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="2" fill="${color}" opacity="${(0.45+0.55*(i+1)/n).toFixed(2)}"/>`;}).join('')}</svg>`; };

  const SS=(k,v)=>{ try{ if(v===undefined) return sessionStorage.getItem('v3_'+k); sessionStorage.setItem('v3_'+k,v); }catch(e){ return null; } };
  let ALFORM=null, ED=null; let TAB=SS('tab')||'hoy', SUBRED=SS('red')||'ig', FILTRO=SS('filtro')||'abiertas', FFORM=false, HFORM=false, AFORM=false;
  const Y0=+(SS('y')||0);   // al refrescar se vuelve a la misma sección y altura
  window.addEventListener('pagehide',()=>{ SS('y',String(Math.round(window.scrollY||0))); SS('red',SUBRED); SS('filtro',FILTRO); });
  window.addEventListener('beforeunload',()=>{ SS('y',String(Math.round(window.scrollY||0))); SS('red',SUBRED); SS('filtro',FILTRO); });
  const CHAT=[]; let CHAT_ON=false, CHAT_ESP=false;

  window.V3=function(d){
    try{ armar(d); }catch(e){ console.log('V3',e); }
  };

  function armar(d){
    document.body.classList.add('v3');
    const R=(d.reportes||[]).filter(r=>(new Date(r.hasta)-new Date(r.desde))/864e5>=3).slice().sort((a,b)=>a.desde<b.desde?-1:a.desde>b.desde?1:(a.hasta<b.hasta?-1:1));
    const ult=k=>{ for(let i=R.length-1;i>=0;i--){ const v=R[i].metricas[k]; if(v!=null) return [v,i]; } return [null,-1]; };
    const ant=(k,desde)=>{ for(let i=desde-1;i>=0;i--){ const v=R[i].metricas[k]; if(v!=null) return v; } return null; };
    // ganancia de la campaña de mensajes = lo facturado (cargado por el cliente) menos la publicidad
    // ventas de tienda: si no se cargaron a mano, se usan las que contó el píxel de Meta (marcadas como tales)
    R.forEach(r=>{ const m=r.metricas||{}; if(m.vta_ventas==null&&m.vta_atribuidas!=null){ m.vta_ventas=Number(m.vta_atribuidas); m.vta_ventas_fuente='pixel'; if(m.vta_costo_venta==null&&Number(m.vta_atribuidas)>0&&m.vta_inversion!=null) m.vta_costo_venta=Math.round(Number(m.vta_inversion)/Number(m.vta_atribuidas)*100)/100; } });
    // tasa de conversión de visitas al perfil a seguidores: métrica central (13/10)
    R.forEach(r=>{ const m=r.metricas||{}; if(m.ig_conv==null&&Number(m.ig_visitas)>0&&m.ig_followers_nuevos!=null) m.ig_conv=Math.round(Number(m.ig_followers_nuevos)*1000/Number(m.ig_visitas))/10; });
    R.forEach(r=>{ const m=r.metricas||{}; if(m.msj_ingreso!=null&&m.msj_inversion!=null&&m.msj_ganancia==null) m.msj_ganancia=Math.round((Number(m.msj_ingreso)-Number(m.msj_inversion))*100)/100; });
    const MANUAL={stm_wishlist:1,stm_costo_wishlist:1,stm_inversion:1,stm_clics:1,stm_visitas:1,vta_visitas:1,vta_clics:1,vta_costo_visita:1,ig_conv:1,msj_mensajes:1,msj_inversion:1,msj_costo_mensaje:1,tk_tickets:1,tk_roas:1,tk_inversion:1,tk_costo_ticket:1,vta_ventas:1,vta_inversion:1,vta_costo_venta:1,vta_ingreso_pixel:1,vta_roas_pixel:1,frm_visitas:1,spad_inversion:1,spad_visitas:1,spad_costo_visita:1,spad_alcance:1,spad_clics:1,ytad_inversion:1,ytad_visitas:1,ytad_costo_visita:1,ytad_alcance:1,ytad_clics:1,frm_mensajes:1,frm_inversion:1,frm_costo_visita:1,   // del período: solo si están en la última medición (si la campaña se apagó no se muestra un número viejo como actual)
      msj_ganancia:1,msj_conversiones:1,msj_ingreso:1,msj_roas:1,msj_costo_conversion:1,vta_ingreso:1,vta_ganancia:1,vta_roas:1,vta_roi:1};
    const ultM=k=>{ if(!MANUAL[k]) return ult(k); const i=R.length-1; return i>=0&&R[i].metricas[k]!=null?[R[i].metricas[k],i]:[null,-1]; };
    const val=k=>ultM(k)[0];
    const previo=k=>{ const [v,i]=ultM(k); return i<0?null:ant(k,i); };
    // % solo si la base es confiable: con menos de 10 en la medición anterior se muestra la diferencia en números
    const dlt=k=>{ const v=val(k), a=previo(k); if(v==null||a==null) return null; if(Number(a)<10&&Number.isInteger(+v)&&Number.isInteger(+a)) return null; return pct(v,a); };
    const dif=k=>{ const v=val(k), a=previo(k); return v==null||a==null?null:Number(v)-Number(a); };
    const serie=(k,n=8)=>R.filter(r=>r.metricas[k]!=null&&(new Date(r.hasta)-new Date(r.desde))/864e5>=3).slice(-n).map(r=>Number(r.metricas[k]));
    const repI=[...(d.reportes||[])].reverse().find(r=>r.metricas&&r.metricas.informe), I=repI?repI.metricas.informe:null;
    const SALU={'semilla-redes':'Agus','animales-del-rock':'Mariana','animales-del-rock-2':'Mariana','mavela':'Mariana','maria-marta-crespo':'María Marta','berco-estudio':'María','federico-andahazi':'Federico','felipe-gonzalez':'Felipe','spam-studio':'Spam Studios','sin-fronteras-duo':'Sin Fronteras','andrea-guedella':'Andrea','betsy-grinblat':'Betsy','cheche-beraja':'Cheche','jimena-mercedes':'Jimena','los-soplafortune':'Soplafortune','koino':'Koino','lara-fichera':'Lara','yamila-beraja':'Yamila'};
    const nombre=SALU[slug]?SALU[slug]:(d.cliente.nombre||'').replace(/\s+\d+$/,'').split(' ')[0];
    const ini=(d.cliente.nombre||'?').trim()[0].toUpperCase();
    const u=R[R.length-1];
    const deltaTxt=(p,inv)=>p==null?'<span class="ne">&nbsp;</span>':p===0?'<span class="ne">=</span>':`<span class="${(p>=0)!==!!inv?'si':'no'}">${p>=0?'↑':'↓'} ${Math.abs(p)}%</span>`;
    const dK=(k,inv)=>{ const p=dlt(k); if(p!=null) return deltaTxt(p,inv); const x=dif(k); if(x==null||!Number(previo(k))) return deltaTxt(null);
      return x===0?'<span class="ne">=</span>':`<span class="${(x>=0)!==!!inv?'si':'no'}">${x>0?'↑ +':'↓ −'}${nf(Math.abs(x))}</span>`; };
    const dPt=k=>{ const x=dif(k); if(x==null||previo(k)==null) return deltaTxt(null); const r=Math.round(x*10)/10; return r===0?'<span class="ne">=</span>':`<span class="${Math.abs(r)<1?'ne':r>0?'si':'no'}">${r>0?'↑ +':'↓ −'}${nf(Math.abs(r),1)} pts</span>`; };
    const SIM=(typeof MON!=='undefined'&&MON==='USD')?'USD ':'$ ', UNI=SIM==='USD '?'dólar':'peso';
    const verRep=()=>{ const b=document.querySelector('.btnReporte'); if(b) b.click(); };
    let visto=''; try{ visto=localStorage.getItem('sr_rep_'+slug)||''; }catch(e){}
    const accB=r=>{ const a=window.srAccion&&window.srAccion(r); return a?`<button class="acc2" data-v3acc="${a.k}">${a.t} →</button>`:''; };
    const nuevoRep=I&&visto!==I.fecha;

    // --- Hoy ---
    // Destacado: primero el resultado de negocio del período (ventas reales anotadas), después el crecimiento de la cuenta.
    // Abajo, siempre que haya, cuánto creció desde que trabaja con Semilla.
    const um=(R[R.length-1]||{}).metricas||{}, Nm=k=>Number(um[k]||0);
    // oyentes mensuales = el número público del perfil de Spotify (sp_oyentes_perfil); sp_monthly son los activos, mucho menos
    const SPK=val('sp_oyentes_perfil')!=null?'sp_oyentes_perfil':'sp_monthly';
    let hero, DZ=null;   // DZ: el destacado de la sección Reporte (misma prioridad que el hero)
    const ultR=R[R.length-1]||{}, fdm=x=>x?String(x).slice(8,10)+'/'+String(x).slice(5,7):'';
    const FACT=(()=>{ const v=(d.cliente&&d.cliente.ventas)||{}; const k=Object.keys(v).find(k=>/^Facturaci/i.test(k)&&k.includes(fdm(ultR.desde))&&k.includes(fdm(ultR.hasta))); return k?Number(v[k].ingreso)||0:0; })();
    const vIng=FACT||Nm('vta_ingreso')||Nm('vta_ingreso_pixel'), vRoas=(FACT&&Nm('vta_inversion'))?FACT/Nm('vta_inversion'):Nm('vta_ingreso')?Nm('vta_roas'):Nm('vta_roas_pixel');
    const vGan=FACT&&Nm('vta_inversion')?Math.round(FACT*0.75-Nm('vta_inversion')):Nm('vta_ganancia');
    if(Nm('vta_ventas')>0&&vIng>0)
      DZ={e:'Resultado destacado',v:SIM+nf(vIng),u:'en ventas',k:Nm('vta_ingreso')?'vta_ingreso':'vta_ingreso_pixel',ic:'vta'},
      hero=`<div class="e">Ventas del período</div><div class="p">${SIM}${nf(vIng)}</div><div class="x">${nf(um.vta_ventas)} ${Nm('vta_ventas')===1?'venta':'ventas'}${Nm('vta_inversion')?` con ${SIM}${nf(um.vta_inversion)} de publicidad`:''}${vRoas?`: cada ${UNI} invertido volvió ${SIM}${nf(vRoas,2)}.`:'.'}${vGan>0?` Ganancia neta: <b>${SIM}${nf(vGan)}</b>.`:''}${um.vta_ventas_fuente==='pixel'&&!FACT?' <span style="opacity:.8">(según el píxel de Meta)</span>':''}</div>`;
    else if(Nm('msj_conversiones')>0&&Nm('msj_ingreso')>0)
      DZ={e:'Resultado destacado',v:SIM+nf(um.msj_ingreso),u:'en ventas',k:'msj_ingreso',ic:'vta'},
      hero=`<div class="e">Ventas del período</div><div class="p">${SIM}${nf(um.msj_ingreso)}</div><div class="x">${nf(um.msj_conversiones)} ${Nm('msj_conversiones')===1?'venta':'ventas'}${Nm('msj_inversion')?` con ${SIM}${nf(um.msj_inversion)} de publicidad`:''}${Nm('msj_roas')?`: cada ${UNI} invertido volvió ${SIM}${nf(um.msj_roas,2)}.`:'.'}</div>`;
    else if(Nm('tk_tickets')>0)
      DZ={e:'Resultado destacado',v:nf(um.tk_tickets),u:Nm('tk_tickets')===1?'entrada':'entradas',k:'tk_tickets',ic:'vta'},
      hero=`<div class="e">Entradas del período</div><div class="p">${nf(um.tk_tickets)}</div><div class="x">${Nm('tk_tickets')===1?'entrada vendida':'entradas vendidas'}${um.tk_nombre?' para <b>'+esc(um.tk_nombre)+'</b>':''}${Nm('tk_inversion')?` con ${SIM}${nf(um.tk_inversion)} de publicidad`:''}${Nm('tk_roas')?`: cada ${UNI} invertido volvió ${SIM}${nf(um.tk_roas,2)}.`:'.'}</div>`;
    else if(Nm('ig_followers_nuevos')>0)
      DZ={e:'Crecimiento destacado',v:'+'+nf(um.ig_followers_nuevos),u:Nm('ig_followers_nuevos')===1?'seguidor':'seguidores',k:'ig_followers_nuevos',ic:'sube',
        t:`La cuenta sumó <b>${nf(um.ig_followers_nuevos)} ${Nm('ig_followers_nuevos')===1?'seguidor nuevo':'seguidores nuevos'}</b> en Instagram y ya llega a ${nf(val('ig_followers_total'))}.${Nm('ig_costo_follower')?` Cada uno costó <b>${SIM}${nf(um.ig_costo_follower,Number(um.ig_costo_follower)<100?2:0)}</b>.`:''}${um.ig_conv!=null?` El <b>${nf(um.ig_conv,1)}%</b> de las visitas al perfil se hizo seguidor${Number(um.ig_conv)>=15?': una tasa de conversión muy alta':''}.`:''}`},
      hero=`<div class="e">Tu progreso del período</div><div class="p">+${nf(um.ig_followers_nuevos)}</div><div class="x">seguidores nuevos en Instagram en el período.</div>`;
    else if(dif(SPK)>0)
      DZ={e:'Crecimiento destacado',v:'+'+nf(dif(SPK)),u:'oyentes',k:null,ic:'sube'},
      hero=`<div class="e">Tu progreso del período</div><div class="p">+${nf(dif(SPK))}</div><div class="x">oyentes mensuales en Spotify: hoy son ${nf(val(SPK))}.</div>`;
    else if(Nm('msj_mensajes')>0)
      DZ={e:'Resultado destacado',v:nf(um.msj_mensajes),u:Nm('msj_mensajes')===1?'consulta':'consultas',k:'msj_mensajes',ic:'msj'},
      hero=`<div class="e">Tu progreso del período</div><div class="p">${nf(um.msj_mensajes)}</div><div class="x">consultas por mensaje en el período.</div>`;
    else hero=`<div class="e">Tu comunidad</div><div class="p">${nf(val('ig_followers_total'))}</div><div class="x">seguidores en Instagram.</div>`;
    const TODOS=(d.reportes||[]).filter(r=>r.metricas&&r.metricas.ig_followers_total!=null).sort((a,b)=>a.hasta<b.hasta?-1:1);
    if(TODOS.length>1){ const a0=Number(TODOS[0].metricas.ig_followers_total), a1=Number(TODOS[TODOS.length-1].metricas.ig_followers_total), dd=new Date(TODOS[0].desde||TODOS[0].hasta);
      if(a1>a0) hero+=`<div class="desde">Desde ${MESL[dd.getUTCMonth()]}${dd.getUTCFullYear()!==new Date().getFullYear()?' de '+dd.getUTCFullYear():''} con Semilla: <b>+${nf(a1-a0)} seguidores</b> (de ${nf(a0)} a ${nf(a1)}).</div>`; }
    const RG=um&&R.length?`<div class="rg">Del ${fd(R[R.length-1].desde)} al ${fd(R[R.length-1].hasta)}</div>`:'';
    hero=hero.replace(/(<div class="e">[^<]*período<\/div>)/,'$1'+RG);
    if(!/class="desde"/.test(hero)){ const RV=(d.reportes||[]).filter(r=>r.metricas&&r.metricas.vta_ventas!=null&&(new Date(r.hasta)-new Date(r.desde))/864e5>=3).sort((a,b)=>a.desde<b.desde?-1:1);
      if(RV.length>1){ const tv=RV.reduce((a,r)=>a+Number(r.metricas.vta_ventas||0),0), ti=RV.reduce((a,r)=>a+Number(r.metricas.vta_ingreso||r.metricas.vta_ingreso_pixel||0),0), dd=new Date(RV[0].desde);
        hero+=`<div class="desde">Desde ${MESL[dd.getUTCMonth()]} con Semilla: <b>${nf(tv)} ventas</b>${ti?` y ${SIM}${nf(ti)} facturados`:''}.</div>`; } }
    // hitos: métricas que el cliente puede elegir (solo las que tiene medidas)
    const HMET={ig_followers_total:['Seguidores en Instagram','seguidores en Instagram'],ig_followers_nuevos:['Seguidores nuevos por período','seguidores nuevos en un período'],ig_visitas:['Visitas al perfil por período','visitas al perfil en un período'],
      sp_oyentes_perfil:['Oyentes mensuales en Spotify','oyentes mensuales en Spotify'],sp_monthly:['Oyentes mensuales activos en Spotify','oyentes mensuales activos en Spotify'],sp_followers:['Seguidores en Spotify','seguidores en Spotify'],sp_streams:['Reproducciones en Spotify por período','reproducciones en Spotify'],
      yt_subs:['Suscriptores en YouTube','suscriptores en YouTube'],yt_views:['Vistas en YouTube por período','vistas en YouTube en un período'],
      msj_mensajes:['Consultas por período','consultas por mensaje'],msj_conversiones:['Ventas por período','ventas en un período'],vta_ventas:['Ventas por período','ventas en un período'],tk_tickets:['Entradas vendidas por período','entradas vendidas en un período']};
    const HTIT=h=>{ if(h.titulo&&!/^[a-z]+_[a-z_]+$/.test(h.titulo)) return h.titulo; return nf(h.objetivo)+' '+((HMET[h.metrica]||[])[1]||''); };
    const HDISP=Object.keys(HMET).filter(k=>(d.reportes||[]).some(r=>r.metricas&&r.metricas[k]!=null)&&!(k==='vta_ventas'&&(d.reportes||[]).some(r=>r.metricas&&r.metricas.msj_conversiones!=null)));
    const H=(d.hitos||[]).map(h=>({h,v:val(h.metrica)})).filter(x=>x.v!=null&&Number(x.v)<Number(x.h.objetivo));
    const hito=H.sort((a,b)=>(b.v/b.h.objetivo)-(a.v/a.h.objetivo))[0];
    const tiene=k=>val(k)!=null;
    const MET=[['ig_followers_total','seguidores','ig'],[SPK,'oyentes mensuales','sp'],['yt_views','vistas','yt'],['msj_mensajes','mensajes','msj'],['msj_conversiones','ventas','msj'],['tk_tickets','entradas','tk'],['stm_wishlist','wishlists en Steam','stm'],['vta_visitas','visitas a la tienda','vtv'],['ig_conv','conversión de visitas','ig'],['vta_ventas','ventas','vta'],['vta_roas_pixel','retorno por dólar','vta'],['vta_costo_venta','costo por venta','vta'],['frm_visitas','visitas a la formación','frm'],['frm_mensajes','consultas','frm'],['ig_visitas','visitas al perfil','ig']].filter(([k])=>tiene(k)&&!(k==='vta_visitas'&&tiene('vta_ventas'))).map(([k,l,ic])=>({k,l,ic}));
    // --- Campaña destacada (sub_campanas con tipo 'destacada'): arriba de todo en Hoy, con sus números acumulados ---
    const DEST=(d.campanas||[]).filter(k=>(k.metricas||{}).tipo==='destacada').map(k=>{ const M=k.metricas||{}, on=M.estado==='activa';
      const fl=x=>x?String(x).slice(8,10)+'/'+String(x).slice(5,7):'';
      const it=[]; if(M.ventas!=null){ it.push([nf(M.ventas),M.ventas===1?'venta':'ventas']); it.push([M.ingreso?SIM+nf(M.ingreso,2):'—','facturados']); it.push([M.roas!=null?nf(M.roas,2)+'x':'—','retorno (ROAS)']); it.push([M.costo_venta!=null?SIM+nf(M.costo_venta,2):'—','por venta']); it.push([SIM+nf(M.inversion,2),'invertidos']); it.push([nf(M.carritos||0),'carritos']); }
      else { if(M.visitas!=null) it.push([nf(M.visitas),M.resultado||'resultados']); if(M.alcance!=null) it.push([nf(M.alcance),'personas alcanzadas']);
      if(M.inversion!=null) it.push([SIM+nf(M.inversion),'invertidos']); if(M.costo_visita!=null) it.push([SIM+nf(M.costo_visita,2),'por '+String(M.resultado||'resultado').replace(/s(\s|$)/,'$1').replace(/es al /,' al ')]); }
      return `<div class="dest"><div class="de">Campaña destacada<span class="${on?'on':''}"><i></i>${on?'Activa':M.estado==='sin_circular'?'Sin circular':'Terminada'}</span></div>
        <h3>${esc(k.nombre)}</h3><div class="ds">${M.show?'Show el '+fl(M.show)+' · ':''}${M.desde?'Desde el '+fl(M.desde):''}${M.hasta?' hasta el '+fl(M.hasta):''}${M.diaria?' · '+SIM+nf(M.diaria)+' por día':''}</div>
        ${it.length?`<div class="dg">${it.map(x=>`<div><b>${x[0]}</b><small>${esc(x[1])}</small></div>`).join('')}</div>`:'<div class="ds" style="margin-top:12px">Los números aparecen en la próxima actualización.</div>'}
        <div class="dp">${M.show?'Acumulado desde el '+fl(M.desde):'Acumulado de toda la campaña'}${M.ventas!=null?' · según el píxel de la tienda':''}${M.actualizado_txt?' · actualizado el '+esc(M.actualizado_txt)+' hs':''}</div></div>`; }).join('');
    // --- Shows de la gira en Hoy (Koino): entradas vendidas según el píxel de Meta, una tarjeta por fecha que todavía no pasó ---
    const GIRA=(()=>{ const hoyI=new Date().toISOString().slice(0,10); const L=(um.fechas||[]).filter(f=>f&&f.fecha&&String(f.fecha).slice(0,10)>=hoyI).sort((a,b)=>a.fecha<b.fecha?-1:1);
      if(!L.length) return '';
      const fl=x=>{ const z=String(x).slice(0,10).split('-'); return z[2]+'/'+z[1]; };
      return `<div class="tit2"><h3>Próximos shows</h3></div><div class="gira">${L.map(f=>{ const e=Number(f.entradas_acum||0), ep=Number(f.entradas_periodo||0), dd=Math.max(0,Math.round((new Date(String(f.fecha).slice(0,10)+'T12:00:00')-new Date())/864e5));
        return `<div class="card">${f.img?`<img src="${esc(f.img)}" alt="${esc(f.ciudad||'')}">`:'<div></div>'}<div>
          <div class="gt">${esc(f.lugar||'')}${f.ciudad?' · '+esc(f.ciudad):''}</div>
          <div class="gs">${fl(f.fecha)} · ${dd===0?'es hoy':dd===1?'falta 1 día':'faltan '+dd+' días'}</div>
          <div class="gn"><b>${nf(e)}</b><span>${e===1?'entrada vendida':'entradas vendidas'}${ep?` · +${nf(ep)} en el período`:''}</span></div>
          ${Number(f.inv_acum||0)>0?`${e>0?`<div class="gc">Costo por entrada: <b>${SIM}${nf(Number(f.inv_acum)/e,2)}</b></div>`:''}<div class="gp">Inversión: ${SIM}${nf(Number(f.inv_acum),2)}${e>0?'':' · todavía sin entradas'}</div>`:''}
          <div class="gp">Según el píxel de Meta${f.ticketera?' en '+esc(f.ticketera):''}${f.estado==='borrador'?' · la campaña todavía no está publicada':''}</div>
          ${f.tickets?`<a class="gl" href="${esc(f.tickets)}" target="_blank" rel="noopener">Ver entradas →</a>`:''}
        </div></div>`; }).join('')}</div>`; })();
    const scrHoy=`
      <h1 class="v3t">Hola ${esc(nombre)}</h1><p class="bj">Seguimos haciendo crecer tu proyecto 🌱</p>${({'alan-sutton':'Tu reporte se actualiza los jueves a las 7.'})[slug]?`<p class="aviso-act">${({'alan-sutton':'Tu reporte se actualiza los jueves a las 7.'})[slug]}</p>`:''}
      <div class="hero"><svg class="cielo" width="170" height="170" viewBox="0 0 170 170"><defs><radialGradient id="v3l" cx=".35" cy=".35"><stop offset="0" stop-color="#E9E6DD"/><stop offset="1" stop-color="#8E8C86"/></radialGradient></defs><circle cx="118" cy="64" r="40" fill="url(#v3l)" opacity=".95"/><circle cx="104" cy="54" r="5" fill="#7E7C76" opacity=".5"/><circle cx="128" cy="76" r="7" fill="#7E7C76" opacity=".4"/><g stroke="#C9B98A" stroke-width="1" opacity=".8"><path d="M40 40v26M27 53h26M31 44l18 18M49 44 31 62"/></g><circle cx="40" cy="53" r="3.5" fill="#E8D9A8"/></svg>${hero}<button class="ir" data-ir="metricas" aria-label="Ver métricas">${ico.flecha}</button></div>
      ${DEST}
      ${GIRA}
      <div class="tit2"><h3>Métricas principales</h3><button data-ir="metricas">Ver todas</button></div>
      <div class="met">${MET.slice(0,3).map(m=>`<div class="card"><div class="ic">${ico[m.ic]}</div><div class="v ${m.k==='vta_costo_venta'?'ch':''}">${m.k==='ig_conv'?nf(val(m.k),1)+'%':m.k==='vta_costo_venta'?SIM.trim()+' '+nf(val(m.k),2):m.k==='vta_roas_pixel'?nf(val(m.k),1)+'x':nf(val(m.k),Number.isInteger(Number(val(m.k)))?0:1)}</div><div class="l">${Number(val(m.k))===1?m.l.replace(/^consultas$/,'consulta').replace(/^mensajes$/,'mensaje').replace(/^ventas$/,'venta').replace(/^seguidores$/,'seguidor'):m.l}</div><div class="d">${m.k==='ig_conv'?dPt(m.k):dK(m.k,m.k==='vta_costo_venta')}</div></div>`).join('')}</div>
      <div id="v3cj"></div>
      <div id="v3cta"></div>
      ${hito?`<div class="card hito"><div>${ico.sol}</div><div><div class="v3t">Tu próximo hito</div><div class="tx">${esc(HTIT(hito.h))}</div></div><button class="ir" data-ir="proyecto" aria-label="Ver hitos">${ico.flecha}</button>
        <div class="bar"><div class="b"><i style="width:${Math.min(100,hito.v/hito.h.objetivo*100).toFixed(1)}%"></i></div><span>${nf(hito.v)} / ${nf(hito.h.objetivo)}</span></div></div>`:''}
      <div class="tit2"><h3>Accesos rápidos</h3></div>
      <div class="acc">
        <button data-acc="rep"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 19v-5M10 19V9M14 19v-7M18 19V6"/></svg>Ver reporte</button>
        <button data-acc="tarea"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 8v8M8 12h8"/></svg>Agregar tarea</button>
        <button data-acc="fecha"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="5.5" width="16" height="14" rx="2.5"/><path d="M4 10h16M8.5 3.5v4M15.5 3.5v4M9 14.5h2M13 14.5h2"/></svg>Próxima fecha</button>
        <button data-acc="chat"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linejoin="round"><path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/><path d="M8.5 9.5h7M8.5 12.5h4.5" stroke-linecap="round"/></svg>SemillaIA</button>
      </div>`;

    // --- Actividades ---
    const T=d.tareas||[], F=d.fechas||[];
    const DS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'], hoy=new Date();
    const lab={abiertas:'Pendientes',hecha:'Hechas'};
    const enG=(t,k)=>k==='hecha'?t.estado==='hecha':t.estado!=='hecha';
    const TT=T.filter(t=>enG(t,FILTRO)).sort((a,b)=>(b.estado==='en_curso')-(a.estado==='en_curso'));
    const recs=(I&&I.recomendaciones)||((d.recomendaciones&&d.recomendaciones.recomendaciones)||[]).map(r=>r.texto||r.titulo);
    const idea=recs.length?recs[(hoy.getDate())%recs.length]:null;
    const IB=(tipo,id)=>id?`<span class="ib2"><button class="ib" data-ed2="${tipo}" data-id="${id}" aria-label="Editar">${ico.lapiz}</button><button class="ib" data-del2="${tipo}" data-id="${id}" aria-label="Borrar">${ico.tacho}</button></span>`:'';
    const EDon=(tipo,id)=>ED&&ED.tipo===tipo&&String(ED.id)===String(id);
    const EDF=(campos)=>`<div class="edf">${campos.map((c,i)=>c.area?`<textarea id="v3e${i}" rows="3" placeholder="${esc(c.ph||'')}">${esc(c.v||'')}</textarea>`:`<input id="v3e${i}" type="${c.t||'text'}"${c.num?' inputmode="decimal"':''} placeholder="${esc(c.ph||'')}" value="${esc(c.v==null?'':c.v)}">`).join('')}<div class="alacc"><button id="v3eok">Guardar</button><button class="sec" id="v3eno">Cancelar</button></div></div>`;
    const scrAct=`
      <h1 class="v3t">Tarea para el hogar</h1>
      <p class="bj">${DS[hoy.getDay()]} ${String(hoy.getDate()).padStart(2,'0')}/${String(hoy.getMonth()+1).padStart(2,'0')} · Enfocate en lo importante.</p>
      <div class="pills">${Object.keys(lab).map(k=>`<button class="${k===FILTRO?'on':''}" data-filtro="${k}">${lab[k]} · ${T.filter(t=>enG(t,k)).length}</button>`).join('')}</div>
      <div class="card lista">
        ${TT.length?TT.map(t=>{ const hecha=t.estado==='hecha', al=t.alarma&&!hecha?new Date(t.alarma):null, alOn=al&&!t.alarma_enviada;
          const alTxt=al?`${DS[al.getDay()].toLowerCase()} ${String(al.getDate()).padStart(2,'0')}/${String(al.getMonth()+1).padStart(2,'0')} · ${String(al.getHours()).padStart(2,'0')}:${String(al.getMinutes()).padStart(2,'0')}`:'';
          const loc=x=>{ const z=new Date(x.getTime()-x.getTimezoneOffset()*6e4); return z.toISOString().slice(0,16); };
          return `<div class="fila tarea ${t.estado}"><button class="ck ${t.estado}" data-tck="${t.id}" data-est="${t.estado}" aria-label="Cambiar estado">${hecha?ico.tilde:''}</button><div class="tw">${EDon('tarea',t.id)?EDF([{v:t.titulo,ph:'Tarea',area:1}]):`<span class="tx" data-tab="1">${esc(t.titulo)}</span>
            <div class="tacc">${hecha?'':`<button class="est ${t.estado==='en_curso'?'on':''}" data-tcur="${t.id}" data-est="${t.estado}">En curso</button><button class="alb ${alOn?'on':''}" data-tal="${t.id}" aria-label="Poner alarma">${ico.alarma}</button>${al?`<small class="alt ${alOn?'on':''}">${alOn?alTxt:'Avisado · '+alTxt}</small>`:''}`}<span class="sp"></span>${IB('tarea',t.id)}</div>`}</div></div>
          ${ALFORM===t.id?`<div class="alform"><label>¿Cuándo te avisamos?</label><input type="datetime-local" id="v3alv" value="${al?loc(al):loc(new Date(Date.now()+864e5))}"><div class="alacc"><button id="v3alok" data-id="${t.id}">Guardar alarma</button>${al?`<button class="sec" id="v3alno" data-id="${t.id}">Quitar</button>`:''}</div><p>Te llega un aviso al celular a esa hora y queda en tus notificaciones.</p></div>`:''}`; }).join('')
          :`<div class="vacio">${FILTRO==='hecha'?'Todavía no hay tareas hechas.':'No hay tareas pendientes. ¡Buen trabajo!'}</div>`}
        <div class="add"><span class="mas">+</span><input id="v3tarea" placeholder="Agregar tarea"><button id="v3tadd">Sumar</button></div>
      </div>
      <p style="font-size:13px;color:#8A8577;margin:8px 2px 0">${FILTRO==='hecha'?'Tocá el círculo para devolver una tarea a pendientes.':'Tocá el círculo cuando esté hecha. Marcá «En curso» las que ya empezaste.'}</p>
      ${T.length?`<div class="rbt" style="margin-top:14px"><button id="v3tpdf" class="sec"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/></svg>Descargar tareas</button></div>`:''}
      <div class="tit2"><h2>Próximas fechas</h2><button id="v3fnueva">${FFORM?'Cerrar':'Agregar fecha'}</button></div>
      <div class="card">
        ${F.length?F.map(f=>{const p=String(f.fecha).slice(0,10).split('-');return EDon('fecha',f.id)?`<div class="fe" style="grid-template-columns:1fr">${EDF([{v:String(f.fecha).slice(0,10),t:'date'},{v:f.titulo,ph:'Título'},{v:f.url||'',ph:'Link a la ticketera (opcional)'}])}</div>`:`<div class="fe" style="grid-template-columns:52px 1fr auto"><div class="dd"><b>${p[2]}</b><span>${MES[+p[1]-1]}</span></div><div><div class="v3t">${esc(f.titulo)}</div><div class="su">${f.url?`<button class="cp" data-copia="${esc(f.url)}">Copiar link de entradas</button>`:'Sin link de entradas'}</div></div>${IB('fecha',f.id)}</div>`;}).join('')
          :`<div class="vacio">Poné aquí las próximas fechas y los links a la ticketera, de ser necesario.</div>`}
        ${FFORM?`<div class="fform"><input id="v3ff" type="date"><input id="v3ft" placeholder="Título. Por ejemplo: ${d.cliente.tipo==='musica'?'Show en La Tangente':'Inicio de la próxima cohorte'}"><input class="u" id="v3fu" placeholder="Link a la ticketera (opcional)"><button id="v3fadd">Guardar fecha</button></div>`:''}
      </div>
      ${idea?`<div class="card idea"><div>${ico.luz}</div><div><b>Idea del día ✨</b><p>${esc(String(idea).replace(/<[^>]+>/g,''))}</p></div></div>`:''}`;

    // --- Métricas ---
    const redes={
      ig:{n:'Instagram',k:'ig_followers_total',l:'seguidores',ex:`${val('ig_followers_nuevos')!=null?'+'+nf(val('ig_followers_nuevos'))+' en el período':''}${val('ig_conv')!=null?` · <b style="color:#3A3846">${nf(val('ig_conv'),1)}%</b> de las visitas al perfil se hizo seguidor`:''}`,col:VINO,
          a:['ig_costo_follower','costo por seguidor',true,'#E2767C'],b:['ig_inversion','inversión en el período',true,OLIVA]},
      sp:{n:'Spotify',k:SPK,l:'oyentes mensuales',ex:`${val('sp_monthly')!=null&&SPK!=='sp_monthly'?nf(val('sp_monthly'))+' activos · ':''}${val('sp_guardados')!=null?nf(val('sp_guardados'))+' guardados':val('sp_streams')!=null?nf(val('sp_streams'))+' reproducciones':''}`,col:'#1DB954',
          a:['sp_streams','reproducciones',false,'#1DB954'],b:['sp_followers','seguidores en Spotify',false,OLIVA],
          ...(val('spad_inversion')!=null?{ad:['spad','Publicidad hacia Spotify','visitas a Spotify desde los anuncios']}:{})},
      yt:{n:'YouTube',k:'yt_views',l:'vistas',ex:`${val('yt_subs')!=null?nf(val('yt_subs'))+' suscriptores':''}`,col:'#FF0000',
          a:['yt_subs_nuevos','suscriptores nuevos',false,'#E2767C'],b:['yt_horas','horas vistas',false,OLIVA],
          ...(val('ytad_inversion')!=null?{ad:['ytad','Publicidad hacia YouTube','visitas a YouTube desde los anuncios']}:{})},
      vta:{n:'Ventas',k:'vta_ventas',l:'ventas en el período',ex:`${(val('vta_ingreso')||val('vta_ingreso_pixel'))!=null?SIM+nf(val('vta_ingreso')||val('vta_ingreso_pixel'))+' facturados':''}`,col:'#2F7A4F',
          a:['vta_costo_venta','costo por venta',true,'#E2767C',2],b:['vta_inversion','inversión en el período',true,OLIVA]},
      frm:{n:'Formación',k:'frm_visitas',l:'visitas a la página',ex:`${val('frm_mensajes')!=null?nf(val('frm_mensajes'))+' consultas en el período':''}`,col:'#2F7A4F',
          a:['frm_costo_visita','costo por visita',true,'#E2767C',2],b:['frm_inversion','inversión en el período',true,OLIVA]},
      stm:{n:'Steam',k:'stm_wishlist',l:um.stm_periodo_desde?'wishlists':'wishlists en el período',ex:`${um.stm_periodo_desde?`<b style="color:#3A3846">Del ${fd(um.stm_periodo_desde)} al ${fd(um.stm_periodo_hasta)}</b> · `:''}${um.stm_impresiones!=null?nf(um.stm_impresiones)+' impresiones en Steam · ':''}${val('stm_clics')!=null?nf(val('stm_clics'))+' clics hacia Steam':''}${val('stm_wishlist_neto')!=null&&um.stm_wishlist_neto!=null?` · saldo ${Number(um.stm_wishlist_neto)>=0?'+':''}${nf(um.stm_wishlist_neto,Number.isInteger(Number(um.stm_wishlist_neto))?0:1)}`:''}`,col:'#1B2838',
          a:['stm_costo_wishlist','costo por wishlist',true,'#E2767C',0],b:['stm_inversion','inversión en el período',true,OLIVA]},
      vtv:{n:'Tienda',k:'vta_visitas',l:'visitas a la tienda',ex:`${val('vta_clics')!=null?nf(val('vta_clics'))+' clics en los anuncios':''}`,col:'#2F7A4F',
          a:['vta_costo_visita','costo por visita',true,'#E2767C',2],b:['vta_inversion','inversión en el período',true,OLIVA]},
      tk:{n:'Entradas',k:'tk_tickets',l:'entradas vendidas',ex:`${val('tk_roas')!=null?'Retorno: '+SIM+nf(val('tk_roas'),2)+' por cada '+UNI:''}`,col:'#2F7A4F',
          a:['tk_costo_ticket','costo por entrada',true,'#E2767C',2],b:['tk_inversion','inversión en el período',true,OLIVA]},
      msj:{n:'Mensajes',k:'msj_mensajes',l:'mensajes recibidos',ex:`${val('msj_conversiones')!=null?nf(val('msj_conversiones'))+' ventas en el período':''}`,col:'#25A35A',
          a:['msj_costo_mensaje','costo por mensaje',true,'#E2767C',2],b:['msj_inversion','inversión en el período',true,OLIVA],
          ...(Number(val('msj_conversiones'))>0&&val('msj_ganancia')!=null?{kpis:[['msj_costo_conversion','costo por venta'],['msj_ganancia','ganancia total']]}:{})}
    };
    Object.keys(redes).forEach(k=>{ if(!tiene(redes[k].k)) delete redes[k]; });
    if(redes.vta) delete redes.vtv;
    if(!redes[SUBRED]) SUBRED=Object.keys(redes)[0]||'ig';
    if(!redes[SUBRED]) redes[SUBRED]={n:'Instagram',k:'ig_followers_total',l:'seguidores',ex:'',col:VINO,a:['ig_costo_follower','costo por seguidor',true,'#E2767C'],b:['ig_inversion','inversión en el período',true,OLIVA]};
    const RD=redes[SUBRED];
    const TKP=[1,2,3,4].map(i=>({nombre:um['tk_p'+i+'_nombre'],tickets:Number(um['tk_p'+i+'_tickets']||0),inversion:Number(um['tk_p'+i+'_inversion']||0),costo:um['tk_p'+i+'_costo'],roas:um['tk_p'+i+'_roas'],alcance:um['tk_p'+i+'_alcance'],inicio:um['tk_p'+i+'_inicio']})).filter(p=>p.nombre);
    const mini=(c)=>{ const v=val(c[0]), S=serie(c[0]); return `<div class="card"><div class="n">${v!=null&&v<0?'−':''}${c[2]?SIM:''}${nf(v!=null?Math.abs(v):v, (c[2]&&v!=null&&Math.abs(v)>=100)?0:c[4]!=null?c[4]:c[0]==='yt_horas'?1:(c[2]&&v!=null&&Math.abs(v)<100?2:0))}</div><div class="l">${c[1]}</div>${S.some(x=>x<0)?'':barras(S,c[3])}</div>`; };
    const imp=I&&I.hallazgos&&I.hallazgos.length?(typeof I.hallazgos[0]==='object'?I.hallazgos[0].t:I.hallazgos[0]):null;
    // --- resumen del mes anterior cerrado: suma de los reportes, prorrateando por días los que cruzan de mes ---
    const MESP=(()=>{ const ult=R[R.length-1]; if(!ult) return ''; const DD=x=>new Date(String(x).slice(0,10)+'T00:00:00Z'), dia=864e5;
      const fu=DD(ult.hasta), ini=new Date(Date.UTC(fu.getUTCFullYear(),fu.getUTCMonth()-1,1)), fin=new Date(Date.UTC(fu.getUTCFullYear(),fu.getUTCMonth(),1));
      const sum=fn=>{ let t=0,hay=false; R.forEach(r=>{ const v=fn(r.metricas||{}); if(v==null||isNaN(Number(v))) return; const d0=DD(r.desde); let d1=DD(r.hasta); if(Math.round((d1-d0)/dia)===6) d1=new Date(+d1+dia);
        const tot=Math.max(1,(d1-d0)/dia), den=Math.max(0,(Math.min(d1,fin)-Math.max(d0,ini))/dia); if(den>0){ t+=Number(v)*den/tot; hay=true; } }); return hay?t:null; };
      const mes=MESL[ini.getUTCMonth()], it=[];
      const vV=sum(m=>m.vta_ventas), vF=sum(m=>m.vta_ingreso!=null?m.vta_ingreso:m.vta_ingreso_pixel), vG=sum(m=>m.vta_ganancia), vI=sum(m=>m.vta_inversion);
      const mV=sum(m=>m.msj_conversiones), mF=sum(m=>m.msj_ingreso), tT=sum(m=>m.tk_tickets), sN=sum(m=>m.ig_followers_nuevos), mM=sum(m=>m.msj_mensajes);
      const inv=sum(m=>{ let t=0,h=false; Object.keys(m).forEach(k=>{ if(/^(ig|msj|vta|tk|frm|stm|ld|tr|spad|ytad|lan)_inversion$/.test(k)&&m[k]!=null){ t+=Number(m[k]); h=true; } }); return h?t:null; });
      if(vV!=null) it.push([nf(Math.round(vV)),'ventas']);
      if(vF!=null) it.push([SIM+nf(Math.round(vF)),'facturado']);
      if(vG!=null) it.push([SIM+nf(Math.round(vG)),'ganancia neta']);
      if(mV!=null&&vV==null) it.push([nf(Math.round(mV)),'ventas por mensaje']);
      if(mF!=null&&vF==null) it.push([SIM+nf(Math.round(mF)),'facturado por mensaje']);
      if(tT!=null) it.push([nf(Math.round(tT)),'entradas vendidas']);
      if(sN!=null) it.push(['+'+nf(Math.round(sN)),'seguidores nuevos']);
      if(mM!=null&&mV==null) it.push([nf(Math.round(mM)),'consultas por mensaje']);
      if(inv!=null) it.push([SIM+nf(Math.round(inv)),'invertido en publicidad']);
      if(vF!=null&&vI) it.push([nf(vF/vI,1)+'x','retorno por '+UNI]);
      else { const iI=sum(m=>m.ig_inversion); if(sN&&iI) it.push([SIM+nf(iI/sN,iI/sN<100?2:0),'costo por seguidor']); }
      if(it.length<2) return '';
      return `<div class="mesp"><div class="e">Resumen de ${mes}</div><div class="g">${it.slice(0,6).map(([v,l])=>`<div><b>${v}</b><span>${l}</span></div>`).join('')}</div><p>La suma de todos los reportes de ${mes}. Si un período cruza de un mes a otro, se reparte por días.</p></div>`; })();

    // --- seguimiento por conjunto de anuncios de la campaña de seguidores (igcN_*), agrupando nombres que cambiaron ---
    const CJS=(()=>{ const nt=x=>String(x||'').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').split(/[^a-z0-9]+/).filter(Boolean);
      const RR=R.filter(r=>(new Date(r.hasta)-new Date(r.desde))/864e5>=3).slice(-10); if(!RR.length) return '';
      const ult=RR[RR.length-1].metricas||{}; const act=[]; for(let i=1;i<=6;i++) if(ult['igc'+i+'_nombre']) act.push({n:ult['igc'+i+'_nombre'],t:nt(ult['igc'+i+'_nombre']),inv:Number(ult['igc'+i+'_inversion']||0)});
      if(!act.length) return ''; act.sort((a,b)=>b.inv-a.inv);
      const grupo=name=>{ const t=nt(name), eq=act.filter(a=>a.t.length===t.length&&a.t.every(x=>t.includes(x))); if(eq.length===1) return eq[0];
        const sub=act.filter(a=>t.every(x=>a.t.includes(x))||a.t.every(x=>t.includes(x))); return sub.length===1?sub[0]:null; };
      act.forEach(a=>a.p=RR.map(r=>{ const m=r.metricas||{}; for(let i=1;i<=6;i++){ const nm=m['igc'+i+'_nombre']; if(nm&&grupo(nm)===a){ const v=m['igc'+i+'_visitas']!=null?Number(m['igc'+i+'_visitas']):null, iv=m['igc'+i+'_inversion']!=null?Number(m['igc'+i+'_inversion']):null, sg=m['igc'+i+'_seguidores']!=null?Number(m['igc'+i+'_seguidores']):null;
        return {f:r.hasta,v,iv,c:v&&iv?iv/v:null,sg}; } } return {f:r.hasta,v:null,iv:null,c:null,sg:null}; }));
      let i0=RR.findIndex((r,i)=>act.some(a=>a.p[i].v!=null||a.p[i].iv!=null)); if(i0<0) return ''; act.forEach(a=>a.p=a.p.slice(i0));
      const graf=(pts,k,col,fmt)=>{ const V=pts.map((p,i)=>[i,p[k]]).filter(x=>x[1]!=null); if(V.length<2) return ''; const W=320,H=128,n=pts.length-1||1,mn=Math.min(...V.map(x=>x[1])),mx=Math.max(...V.map(x=>x[1])),rg=(mx-mn)||1;
        const X=i=>38+i*(W-76)/n, Y=v=>H-30-(v-mn)/rg*(H-58);
        return `<svg viewBox="0 0 ${W} ${H}" role="img"><line x1="10" x2="${W-10}" y1="${H-22}" y2="${H-22}" stroke="#E1D9C9"/><path d="${V.map((p,j)=>(j?'L':'M')+X(p[0]).toFixed(1)+' '+Y(p[1]).toFixed(1)).join(' ')}" fill="none" stroke="${col}" stroke-width="2.4" stroke-linejoin="round"/>${V.map(p=>`<circle cx="${X(p[0]).toFixed(1)}" cy="${Y(p[1]).toFixed(1)}" r="3.4" fill="${col}"/><text x="${X(p[0]).toFixed(1)}" y="${(Y(p[1])-8).toFixed(1)}" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#3A3846">${fmt(p[1])}</text>`).join('')}${pts.map((p,i)=>`<text x="${X(i).toFixed(1)}" y="${H-6}" text-anchor="middle" font-size="10" font-family="Inter,sans-serif" fill="#8A8577">${fd(p.f)}</text>`).join('')}</svg>`; };
      const sim=SIM;
      return `<div class="cjs"><h3>Seguimiento por conjunto de anuncios</h3><p class="bjc">Campaña de seguidores, período por período. Meta da las visitas al perfil por conjunto; los seguidores nuevos solo los cuenta Instagram en total.</p>${act.map(a=>{ const u=a.p[a.p.length-1];
        return `<div class="cj"><p class="nm">${esc(a.n)}</p><div class="ks"><div><b>${nf(u.v)}</b><span>visitas al perfil</span></div><div><b>${u.c!=null?sim+nf(u.c,2):'—'}</b><span>costo por visita</span></div><div><b>${u.iv!=null?sim+nf(u.iv,u.iv<100?2:0):'—'}</b><span>inversión</span></div></div>
          <p class="gl">Visitas al perfil</p>${graf(a.p,'v',VINO,v=>nf(v))}<p class="gl">Costo por visita</p>${graf(a.p,'c','#E2767C',v=>sim+nf(v,2))}${a.p.filter(p=>p.sg!=null).length>1?`<p class="gl">Seguidores (cargados de Ads Manager)</p>${graf(a.p,'sg',OLIVA,v=>nf(v))}`:''}</div>`; }).join('')}</div>`; })();
    const scrMet=`
      <div class="rep"><div><h1 class="v3t" style="font-size:31px">Tus métricas</h1><p class="bj">${I?`Del ${fd(I.desde)} al ${fd(I.hasta)}`:'Tus números, red por red'}</p></div>${I?`<button class="ir" id="v3rep" aria-label="Abrir reporte">${ico.flecha}</button>`:''}</div>
      ${imp?`<div class="card imp"><div>${ico.sol}</div><div><h4>Lo más importante</h4><p>${imp}</p></div></div>`:''}
      ${MESP}
      ${u?`<div class="perh"><h3>Resumen del período</h3><span>Del ${fd(u.desde)} al ${fd(u.hasta)}</span></div>`:''}
      <div class="red">${Object.keys(redes).map(k=>`<button class="${k===SUBRED?'on':''}" data-red="${k}">${redes[k].n}</button>`).join('')}</div>
      <div class="card big"><div><div style="display:flex;align-items:center;gap:10px">${ico[SUBRED]}<div class="n">${nf(val(RD.k),Number.isInteger(Number(val(RD.k)))?0:1)}</div></div><div class="l">${RD.l}</div><div class="d">${dK(RD.k)}<small>${RD.ex}</small></div></div>${RD.kpis?`<div class="kp">${RD.kpis.map(([k,l])=>{const v=Number(val(k));return `<div><div class="n">${v<0?'−':''}${SIM}${nf(Math.abs(v),0)}</div><div class="l">${l}</div></div>`;}).join('')}</div>`:`<div class="sp">${linea(serie(RD.k),RD.col)}</div>`}</div>
      <div class="dos">${mini(RD.a)}${mini(RD.b)}</div>
      ${RD.ad?(()=>{const [p,t,l]=RD.ad, vis=val(p+'_visitas')!=null?p+'_visitas':p+'_clics';return `<div class="tit2"><h2>${t}</h2></div><div class="card big"><div><div class="n">${nf(val(vis))}</div><div class="l">${l}</div><div class="d"><small>${val(p+'_alcance')!=null?nf(val(p+'_alcance'))+' personas alcanzadas':''}</small></div></div><div class="sp">${linea(serie(vis),RD.col)}</div></div><div class="dos">${mini([p+'_costo_visita','costo por visita',true,'#E2767C',2])}${mini([p+'_inversion','inversión en el período',true,OLIVA])}</div>`;})():''}
      ${SUBRED==='tk'&&TKP.length?`<div class="tit2"><h2>Públicos de la campaña</h2></div><div class="card lista tkp">${TKP.map(p=>`<div class="fila"><span class="tx ab"><b>${esc(p.nombre)}</b>${p.inversion>0?`<br><span>${nf(p.tickets)} ${p.tickets===1?'entrada':'entradas'} · ${p.costo!=null?SIM+nf(p.costo,2)+' por entrada':'sin ventas'}${p.alcance?` · ${nf(p.alcance)} personas`:''}</span>`:`<br><span>Público nuevo${p.inicio?`: arrancó el ${fd(p.inicio)}`:''}. Todavía sin resultados.</span>`}</span>${p.roas!=null&&p.inversion>0?`<span class="rt"><b>${nf(p.roas,2)}x</b><small>retorno</small></span>`:'<span></span>'}</div>`).join('')}</div>`:''}
      ${recs.length?`<div class="card recos"><div class="h">${ico.hoja}Recomendaciones SemillaIA</div>${recs.slice(0,3).map((r,i)=>`<div class="r"><span class="k">${i+1}</span><p>${esc(String(r).replace(/<[^>]+>/g,''))}${accB(r)}</p></div>`).join('')}</div>`:''}
      <details class="todo" id="v3todo"><summary>Ver todas las métricas</summary></details>`;

    // --- Proyecto ---
    const HT=(d.hitos||[]).map(h=>({h,v:val(h.metrica)}));
    const A=d.activos||[];
    const NT=d.notas||[];
    const scrPro=`
      <h1 class="v3t">Tu proyecto</h1><p class="bj">Tus metas, tus links y tu web.</p>
      <div class="tit2"><h2>Hitos</h2>${HDISP.length?`<button id="v3hnuevo">${HFORM?'Cerrar':'Agregar hito'}</button>`:''}</div>
      <div class="card">${HT.length?HT.map(x=>`<div class="hito" style="margin:0;border-top:1px solid #EDE6D8;grid-template-columns:38px 1fr;position:relative"><div>${ico.sol}</div><div style="${x.h.id&&!x.h.virtual?'padding-right:70px':''}"><div class="v3t">${esc(HTIT(x.h))}</div><div class="tx">${x.v!=null&&Number(x.v)>=Number(x.h.objetivo)?'¡Logrado!':'En camino'}</div></div><div class="bar"><div class="b"><i style="width:${x.v==null?0:Math.min(100,x.v/x.h.objetivo*100).toFixed(1)}%"></i></div><span>${nf(x.v)} / ${nf(x.h.objetivo)}</span></div>${x.h.id&&!x.h.virtual?`<span class="hacc">${IB('hito',x.h.id)}</span>`:''}${EDon('hito',x.h.id)?`<div style="grid-column:1/-1">${EDF([{v:x.h.titulo||'',ph:'Nombre (opcional)'},{v:x.h.objetivo,ph:'Meta (número)',num:1}])}</div>`:''}</div>`).join(''):'<div class="vacio">Todavía no hay hitos. Sumá una meta: por ejemplo, a cuántos seguidores querés llegar.</div>'}
        ${HFORM?`<div class="fform hform"><select id="v3hm">${HDISP.map(k=>`<option value="${k}">${HMET[k][0]}</option>`).join('')}</select><input id="v3ho" inputmode="decimal" placeholder="Meta (número)"><input id="v3ht" placeholder="Nombre (opcional)"><button id="v3hadd">Guardar hito</button></div>`:''}</div>
      <div class="tit2"><h2>Tus activos</h2><button id="v3anuevo">${AFORM?'Cerrar':'Agregar activo'}</button></div>
      <div class="card lista">${A.length?A.map(a=>EDon('activo',a.id)?`<div class="fila" style="grid-template-columns:1fr">${EDF([{v:a.titulo,ph:'Nombre'},{v:a.url||'',ph:'Link (https://…)'},{v:a.descripcion||'',ph:'Descripción (opcional)'}])}</div>`:`<div class="fila" style="grid-template-columns:1fr${a.id?' auto':' 18px'}">${a.url?`<a class="tx" style="color:${NAVY};text-decoration:none" href="${esc(a.url)}" target="_blank" rel="noopener"><b>${esc(a.titulo)}</b><br><span style="color:#8A8577;font-size:13.5px">${esc(a.descripcion||'')}</span></a>`:`<span class="tx"><b>${esc(a.titulo)}</b><br><span style="color:#8A8577;font-size:13.5px">En preparación</span></span>`}${a.id?IB('activo',a.id):`<span class="ch">${ico.ch}</span>`}</div>`).join(''):'<div class="vacio">Todavía no hay enlaces. Sumá tus links: tu web, tu Spotify, tu tienda, tu canal.</div>'}
        ${AFORM?`<div class="fform"><input id="v3at" placeholder="Nombre. Por ejemplo: Mi Spotify"><input class="u" id="v3au" placeholder="Link (https://…)"><input id="v3ad" placeholder="Descripción (opcional)"><button id="v3aadd">Guardar activo</button></div>`:''}</div>
      <div class="tit2"><h2>Tus notas</h2></div>
      <p class="bj" style="margin:0 0 10px;font-size:14.5px">Dejanos lo que quieras que tengamos en cuenta: una idea, una duda, algo que pasó en estos días.</p>
      <div class="card notas3"><div class="nn"><textarea id="v3nt" rows="3" placeholder="Escribí acá…"></textarea><button id="v3nadd">Guardar nota</button></div>
        ${NT.map(n=>`<div class="nt"><div class="cb"><b class="${n.autor==='semilla'?'sem':''}">${n.autor==='semilla'?'Semilla Redes':'Vos'}</b><small>${new Date(n.fecha).toLocaleDateString('es-AR',{day:'numeric',month:'long'})}</small>${n.autor==='semilla'?'':`<span class="sp"></span>${IB('nota',n.id)}`}</div>${EDon('nota',n.id)?EDF([{v:String(n.texto||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,''),area:1}]):`<p>${esc(String(n.texto||'').replace(/<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'')).replace(/\n/g,'<br>')}</p>`}</div>`).join('')}</div>
      <div id="v3web"></div>`;

    // --- SemillaIA ---
    const hx=(hero.match(/<div class="x">([\s\S]*?)<\/div>/)||[])[1]||'';
    if(DZ&&!DZ.t) DZ.t=hx;
    const dzD=(()=>{ if(!DZ||!DZ.k) return null; const p=dlt(DZ.k); if(p!=null) return (p>=0?'+':'−')+Math.abs(p)+'%'; const x=dif(DZ.k); return x==null||!Number(previo(DZ.k))?null:x===0?'=':(x>0?'+':'−')+nf(Math.abs(x)); })();
    const dzBar=(()=>{ const V=DZ&&DZ.k?serie(DZ.k,5).filter(v=>v!=null&&v>=0):[]; if(V.length<2) return ''; const mx=Math.max(...V)||1, n=V.length, W=86, H=58, bw=12, gp=(W-n*bw)/(n-1||1);
      const C=['#E9E1CE','#DED3B8','#CFC39E','#BDB383','#9C9A5A'];
      return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-hidden="true">${V.map((v,i)=>{const h=Math.max(6,v/mx*(H-20));return `<rect x="${(i*(bw+gp)).toFixed(1)}" y="${(H-h).toFixed(1)}" width="${bw}" height="${h.toFixed(1)}" rx="2.5" fill="${C[C.length-n+i]}"/>`;}).join('')}${dzD&&dzD[0]==='+'?`<path d="M2 ${H-26} Q${W*.55} ${H-30} ${W-6} 6" fill="none" stroke="#E2767C" stroke-width="1.8" stroke-linecap="round"/><path d="M${W-14} 5.5 L${W-5} 5 L${W-7} 14" fill="none" stroke="#E2767C" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>`:''}</svg>`; })();
    const rIco={
      sube:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16.5l5.2-5.2 3.6 3.6L20 7.7"/><path d="M14.5 7.5H20V13"/></svg>',
      barras:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="5" y="12" width="3.4" height="7" rx="1"/><rect x="10.3" y="7" width="3.4" height="12" rx="1"/><rect x="15.6" y="9.5" width="3.4" height="9.5" rx="1"/></svg>',
      msj:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><path d="M12 4.5c4.7 0 8 2.9 8 6.6s-3.3 6.6-8 6.6c-.9 0-1.8-.1-2.6-.3L5 19.5l1.1-3.6C4.8 14.6 4 13 4 11.1 4 7.4 7.3 4.5 12 4.5z"/></svg>',
      vta:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><path d="M5.5 8.5h13l-1 11h-11z"/><path d="M9 10.5V7a3 3 0 0 1 6 0v3.5"/></svg>',
      play:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linejoin="round"><rect x="3.5" y="6" width="17" height="12" rx="3.5"/><path d="M10.5 9.5v5l4.3-2.5z" fill="#fff"/></svg>',
      mal:'<svg width="24" height="24" viewBox="0 0 24 24" fill="#fff"><rect x="10.6" y="5" width="2.8" height="9.5" rx="1.4"/><circle cx="12" cy="18" r="1.7"/></svg>'
    };
    const icoH=h=>{ if(h.tipo==='mal') return rIco.mal; const t=String(h.t||h).toLowerCase();
      return /venta|factur|vend/.test(t)?rIco.vta:/mensaje|consulta|conversaci/.test(t)?rIco.msj:/youtube|video|spotify|oyente|reproduc/.test(t)?rIco.play:rIco.sube; };
    const HZ=I?(I.hallazgos||[]).map(h=>typeof h==='object'?h:{t:h,tipo:'bien'}):[];
    const RC=I?(I.recomendaciones||[]):[], RT=(I&&I.recos_titulos)||[];
    const nPal=(n,s,p)=>n+' '+(n===1?s:p);
    const pegaM=t=>String(t||'').replace(/(\$|USD) (?=[\d−-])/g,'$1&nbsp;');
    const hoja2='<svg class="rhoja" width="150" height="190" viewBox="0 0 150 190" aria-hidden="true"><circle cx="104" cy="70" r="66" fill="#EAE2D0" opacity=".55"/><path d="M146 188C122 150 104 104 66 8" fill="none" stroke="#77763A" stroke-width="2" stroke-linecap="round"/>'
      +[[136,170,-158,'#8C8B45'],[124,140,-64,'#6F6E34'],[110,110,-166,'#8C8B45'],[98,82,-70,'#77763A'],[86,54,-172,'#8C8B45'],[76,30,-78,'#6F6E34']].map(([x,y,a,c])=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="M0 0C13-11 33-11 46 0 33 11 13 11 0 0z" fill="${c}" opacity=".82"/><path d="M3 0H43" stroke="#F2EDE4" stroke-width=".9" opacity=".45"/></g>`).join('')+'</svg>';
    const scrIA=`
      <div class="rph">${hoja2}<h1 class="v3t rpt">Reporte</h1>${I?`<div class="rpr"><span>Del ${fd(I.desde)} al ${fd(I.hasta)}</span><i></i></div>`:''}<p class="rps">Lo principal, explicado y con próximos pasos.</p></div>
      ${I?`${DZ?`<div class="card rdz"><span class="ci ok">${DZ.ic==='vta'?rIco.vta:DZ.ic==='msj'?rIco.msj:rIco.barras}</span><div class="e">${DZ.e}</div><div class="hd"><div class="v"><b>${DZ.v}</b> <span>${DZ.u}</span></div></div>${dzBar||dzD?`<div class="gr">${dzBar}${dzD?`<span class="pl ${dzD[0]==='+'?'':'baja'}">${dzD}</span><small>vs. período anterior</small>`:''}</div>`:''}<p class="tx">${pegaM(DZ.t)}</p></div>`:''}
        <div class="rsh">${ico.sol}<h2>Lo principal</h2><i></i><span>${nPal(HZ.length,'punto','puntos')}</span></div>
        ${HZ.map(h=>`<div class="card rit"><span class="ci ${h.tipo==='mal'?'ma':'ok'}">${icoH(h)}</span><div>${h.titulo?`<h3>${esc(h.titulo)}</h3>`:''}<p>${pegaM(h.t)}</p></div></div>`).join('')}
        <div class="rsh">${ico.hoja}<h2>Qué hacer</h2><i></i><span>${nPal(RC.length,'acción','acciones')}</span></div>
        ${RC.map((r,i)=>{ const a=window.srAccion&&window.srAccion(r); return `<div class="card rit rq${a?' con':''}"${a?` data-v3acc="${a.k}" role="button" tabindex="0" aria-label="${esc(a.t)}"`:''}><span class="ci nu">${i+1}</span><div>${RT[i]?`<h3>${esc(RT[i])}</h3>`:''}<p>${pegaM(esc(r))}</p></div>${a?`<span class="ch">${ico.ch}</span>`:''}</div>`; }).join('')}
        ${I.reunion?`<div class="rru">${ico.luz}<i></i><div><h4>En la próxima reunión con Agus</h4><p>${pegaM(esc(I.reunion.charAt(0).toUpperCase()+I.reunion.slice(1)))}</p></div></div>`:''}
        <div class="rbt"><button id="v3rep2" class="pri">Ver detalles ${ico.flecha}</button><button id="v3pdf" class="sec"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14"/></svg>Descargar reporte</button></div>`
        :'<div class="card vacio" style="margin-top:18px">Cuando salga tu primer reporte lo vas a ver acá.</div>'}`;

    // --- montar ---
    let raiz=document.getElementById('v3');
    const app=document.getElementById('app');
    if(!raiz){ raiz=document.createElement('div'); raiz.id='v3'; document.querySelector('.wrap').prepend(raiz); }
    if(app&&app.parentNode!==document.body) document.body.appendChild(app);   // sacarlo antes de reescribir
    raiz.innerHTML=`<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="v3g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#F9A43A"/><stop offset=".5" stop-color="#E1306C"/><stop offset="1" stop-color="#7B3FE4"/></linearGradient></defs></svg><div class="cab"><img src="/assets/semilla-redes-oliva.png" alt="Semilla Redes"><span class="sep"></span><span class="ia">semilla<b>IA</b></span><span class="esp"></span><button class="camp" id="v3camp" aria-label="Notificaciones">${ico.camp}<b id="v3nn"></b></button><button class="av" id="v3av" aria-label="Tu perfil">${ini}<img src="/assets/avatars/${slug}.jpg?v=${new Date().toISOString().slice(0,10)}" alt="" onerror="this.remove()"></button></div>
      <div class="scr" data-scr="hoy">${scrHoy}</div><div class="scr" data-scr="proyecto">${scrPro}</div><div class="scr" data-scr="actividades">${scrAct}</div><div class="scr" data-scr="metricas">${scrMet}</div><div class="scr" data-scr="ia">${scrIA}</div>`;
    const todo=raiz.querySelector('#v3todo'); if(app&&todo){ todo.appendChild(app); app.classList.remove('oculto'); }
    // conexiones para todos (20/10/2026): la misma pieza que usan los alumnos
    const cxEl=null;
    if(cxEl){ const cxIr=()=>window.SRConexiones.montar(cxEl,{slug,k:tok,plegado:true});
      if(window.SRConexiones) cxIr(); else { const sc=document.createElement('script'); sc.src='/conexiones.js?v='+(window.SR_VER||Date.now()); sc.onload=cxIr; document.head.appendChild(sc); } }
    const web=raiz.querySelector('#v3web'); let intentos=0;
    let WEBV=window.__V3WEBS||[];
    if(!window.__V3WEBS){ window.__V3WEBS=[]; fetch('https://vm.semillaredes.com/web/estado?c='+encodeURIComponent(slug)+'&k='+encodeURIComponent(tok)).then(r=>r.ok?r.json():null).then(j=>{ if(j&&j.webs&&j.webs.length){ window.__V3WEBS=j.webs; WEBV=j.webs; intentos=0; ponerWeb(); } }).catch(()=>{}); }
    const ponerWeb=()=>{ if(!web) return; const tw=app&&(app.querySelector('.twBtns')||app.querySelector('.twWebs')); if(!tw&&intentos++<20) setTimeout(ponerWeb,300);
      const eds=tw?[...tw.querySelectorAll('a')]:[];
      if(!WEBV.length&&!eds.length){ web.innerHTML=''; return; }
      const lista=WEBV.length?WEBV:[{titulo:'Tu web',url:''}];
      web.innerHTML='<div class="tit2"><h2>'+(lista.length>1?'Tus webs':'Tu web')+'</h2></div><p class="bj" style="margin:0 0 10px;font-size:14.5px">Tocá para verla. Con «Editá» la abrís en modo edición: cambiás textos y fotos, o le pedís cambios a SemillaIA. Nada se publica sin que lo apruebes.</p><div class="card lista webs">'+lista.map((w,n)=>'<div class="fila" style="grid-template-columns:1fr auto">'+(w.url?'<a class="tx" style="text-decoration:none" href="'+esc(w.url)+'" target="_blank" rel="noopener"><b style="color:'+NAVY+'">'+esc(w.titulo||'Tu web')+'</b><br><span style="color:#8A8577;font-size:13.5px">'+esc(String(w.url).replace(/^https?:\/\//,'').replace(/\/(index\.html)?$/,''))+'</span></a>':'<span class="tx"><b style="color:'+NAVY+'">Tu web</b></span>')+'<span class="ed" data-wed="'+n+'"></span></div>').join('')+'</div>';
      web.querySelectorAll('[data-wed]').forEach(x=>{ const i=+x.dataset.wed, a=eds[i], w=lista[i]; let c;
        if(w&&w.url){ c=document.createElement('a'); c.href=w.url+(w.url.includes('?')?'&':'?')+'editar='+encodeURIComponent(slug)+'&k='+encodeURIComponent(tok); c.target='_blank'; c.rel='noopener'; c.addEventListener('click',ev=>{ window.SRE&&window.SRE('web_editar',{}); if('ontouchstart' in window){ ev.preventDefault(); location.href=c.href+'&volver='+encodeURIComponent(location.href); } }); }
        else if(a){ c=a.cloneNode(true); }
        if(!c) return; c.className='edt'; c.innerHTML='✎ Editá'; x.appendChild(c); }); }; ponerWeb();
    let nav=document.getElementById('v3nav');
    if(!nav){ nav=document.createElement('nav'); nav.id='v3nav'; document.body.appendChild(nav); }
    const NV=[['hoy','Hoy'],['proyecto','Proyecto'],['actividades','Actividades'],['metricas','Métricas'],['ia','Reporte']];
    nav.innerHTML=NV.map(([k,t])=>`<button data-ir="${k}">${navIco[k]}<span>${t}</span></button>`).join('');
    ir(TAB,false);
    if(Y0&&!window.__V3Y){ window.__V3Y=1; requestAnimationFrame(()=>window.scrollTo(0,Y0)); }
    chatMontar(nombre);
    const pintaCta=c=>{ const el=document.getElementById('v3cta'); if(!el||!c||!c.hay) return;
      const P=c.pago||{}, usd=P.moneda==='USD', pl=v=>v==null?'—':usd?'USD '+nf(v,2):'$ '+nf(v,0), met=String(P.metodo||'').replace(/\s*\*+\s*/,' ••');
      const DS3=['dom','lun','mar','mié','jue','vie','sáb'], fch=f=>{ const x=new Date(f+'T12:00:00'); return DS3[x.getDay()]+' '+fd(f); };
      const px=P.proximo;
      const pg=P.saldo==null?'':`<div class="pg">${px?`<div class="r1"><span>Próximo cobro</span><b>${fch(px.fecha)} · ${pl(px.monto)}</b></div>`:`<div class="r1"><span>Saldo a pagar</span><b>${pl(P.saldo)}</b></div>`}
        <p>${px?`Se cobra solo${met?` a la <b>${esc(met)}</b>`:''} cuando el saldo llega a ${pl(P.umbral)}${P.fecha_ciclo?` o el ${fd(P.fecha_ciclo)}, lo que pase primero`:''}. Hoy el saldo es de ${pl(P.saldo)}${P.promedio_diario?` y se gastan unos ${pl(P.promedio_diario)} por día`:''}, por eso la fecha es aproximada.`
          :`${P.prepago?'Cuenta prepaga: se descuenta de los fondos cargados.':`Se cobra solo${met?` a la <b>${esc(met)}</b>`:''} cuando el saldo llega al umbral de Meta o a fin del ciclo de facturación.`}`}</p></div>`;
      const CJON=['yamila-beraja'].includes(slug), moneyC=v=>v==null?'—':usd?'USD '+nf(v,2):'$ '+nf(v,0);
      const dia=CJON&&P.inversion_diaria!=null?`<div class="pg"><div class="r1"><span>Inversión diaria</span><b>${moneyC(P.inversion_diaria)}</b></div><p>Lo que está programado por día entre todos los conjuntos activos.</p></div>`:'';
      const cjEl=document.getElementById('v3cj'), CJ=CJON?(c.conjuntos||[]):[];
      if(cjEl) cjEl.innerHTML=CJ.length?`<div class="tit2"><h3>Conjuntos de anuncios</h3></div><div class="cjl">${CJ.map(z=>`<div class="card"><div class="ct">${esc(z.nombre)}</div><div class="cs">Desde el ${fd(z.inicio)}${z.diaria!=null?' · '+moneyC(z.diaria)+' por día':''}</div>
        <div class="cg"><div><b>${nf(z.resultados)}</b><small>${esc(z.resultado)}</small></div><div><b>${nf(z.alcance)}</b><small>personas alcanzadas</small></div><div><b>${z.costo!=null?moneyC(z.costo).replace(/,00$/,',00'):'—'}</b><small>por visita</small></div></div></div>`).join('')}</div>`:'';
      el.innerHTML=`<div class="cta"><span class="l">Cuenta publicitaria</span><span class="e ${c.activa?'on':''}"><i></i>${c.activa?'Activa':esc(c.estado.charAt(0).toUpperCase()+c.estado.slice(1))}</span><span class="n">${c.campanas} ${c.campanas===1?'campaña corriendo':'campañas corriendo'}</span>${dia}${pg}</div>`; };
    if(window.__V3CTA) pintaCta(window.__V3CTA);
    else fetch('https://vm.semillaredes.com/web/cuenta?c='+encodeURIComponent(slug)+'&k='+encodeURIComponent(tok)).then(r=>r.ok?r.json():null).then(c=>{ window.__V3CTA=c; pintaCta(c); }).catch(()=>{});

    // --- eventos ---
    document.querySelectorAll('#v3 [data-ir], #v3nav [data-ir]').forEach(b=>b.onclick=()=>ir(b.dataset.ir,true));
    const abre=()=>{ verRep(); raiz.querySelector('#v3camp').classList.remove('nuevo'); };
    raiz.querySelector('#v3camp').onclick=()=>notifAbrir();
    raiz.querySelector('#v3av').onclick=()=>perfilAbrir();
    notifCargar();
    const r1=raiz.querySelector('#v3rep'); if(r1){ r1.onclick=()=>ir('ia',true); r1.setAttribute('aria-label','Ir al reporte'); }
    const r2=raiz.querySelector('#v3rep2'); if(r2) r2.onclick=()=>ir('metricas',true);
    const pd=raiz.querySelector('#v3pdf'); if(pd) pd.onclick=()=>descargarRep(pd, I);
    const tpd=raiz.querySelector('#v3tpdf'); if(tpd) tpd.onclick=()=>descargarTareas(tpd, d.tareas||[]);
    raiz.querySelectorAll('.rq.con').forEach(c=>c.onkeydown=e=>{ if(e.key==='Enter') c.click(); });
    raiz.querySelectorAll('[data-acc]').forEach(b=>b.onclick=()=>{ const a=b.dataset.acc;
      if(a==='rep') ir('ia',true);
      else if(a==='tarea'){ FILTRO='abiertas'; ir('actividades',true); setTimeout(()=>{ const i=document.getElementById('v3tarea'); i&&i.focus(); },60); }
      else if(a==='fecha'){ FFORM=true; TAB='actividades'; armar(window.__D); setTimeout(()=>{ const f=document.getElementById('v3ft'); f&&f.scrollIntoView({block:'center'}); },60); }
      else if(a==='chat'){ const cb=document.getElementById('v3chatb'); cb&&cb.click(); } });
    raiz.querySelectorAll('[data-filtro]').forEach(b=>b.onclick=()=>{ FILTRO=b.dataset.filtro; armar(window.__D); });
    raiz.querySelectorAll('[data-v3acc]').forEach(b=>b.onclick=()=>window.V3IR(b.dataset.v3acc));
    raiz.querySelectorAll('[data-red]').forEach(b=>b.onclick=()=>{ SUBRED=b.dataset.red; armar(window.__D); });
    raiz.querySelectorAll('[data-tab]').forEach(s=>s.onclick=()=>s.classList.toggle('ab'));
    const prevK=id=>'sr_tprev_'+id;
    const estado=async(b,id,nuevo)=>{ b.disabled=true; window.SRE&&window.SRE('tarea',{estado:nuevo}); const r=await rpc('sub_tarea_cliente',{p_slug:slug,p_k:tok,p_id:id,p_estado:nuevo}); if(r&&r.ok) recargar(); else b.disabled=false; };
    raiz.querySelectorAll('[data-tck]').forEach(b=>b.onclick=()=>{ const id=b.dataset.tck, e=b.dataset.est;
      if(e==='hecha'){ let pv='pendiente'; try{ pv=localStorage.getItem(prevK(id))||'pendiente'; }catch(x){} estado(b,id,pv); }
      else { try{ localStorage.setItem(prevK(id),e); }catch(x){} estado(b,id,'hecha'); } });
    raiz.querySelectorAll('[data-ed2]').forEach(b=>b.onclick=ev=>{ ev.preventDefault(); ev.stopPropagation(); ED=EDon(b.dataset.ed2,b.dataset.id)?null:{tipo:b.dataset.ed2,id:b.dataset.id}; ALFORM=null; armar(window.__D); setTimeout(()=>{ const i=document.getElementById('v3e0'); if(i){ i.scrollIntoView({block:'center'}); i.focus(); } },60); });
    const webFechas=()=>{ try{ fetch('https://vm.semillaredes.com/web/fechas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c:slug,k:tok})}).catch(()=>{}); }catch(e){} };   // la web se actualiza sola al tocar una fecha
    const BORRA={tarea:'sub_tarea_borrar',fecha:'sub_fecha_borrar',activo:'sub_activo_cliente_borrar',hito:'sub_hito_cliente_borrar',nota:'sub_nota_borrar'}, NOMB={tarea:'esta tarea',fecha:'esta fecha',activo:'este activo',hito:'este hito',nota:'esta nota'};
    raiz.querySelectorAll('[data-del2]').forEach(b=>b.onclick=async ev=>{ ev.preventDefault(); ev.stopPropagation(); const t=b.dataset.del2; if(!confirm('¿Borrar '+NOMB[t]+'?')) return; b.disabled=true;
      window.SRE&&window.SRE('borrar',{tipo:t}); const r=await rpc(BORRA[t],{p_slug:slug,p_k:tok,p_id:b.dataset.id}); if(r&&r.ok){ if(t==='fecha') webFechas(); ED=null; recargar(); } else { b.disabled=false; alert('No se pudo borrar. Probá de nuevo.'); } });
    const eno=raiz.querySelector('#v3eno'); if(eno) eno.onclick=()=>{ ED=null; armar(window.__D); };
    const eok=raiz.querySelector('#v3eok'); if(eok) eok.onclick=async()=>{ const v=i=>{ const e=raiz.querySelector('#v3e'+i); return e?e.value.trim():''; }; const t=ED.tipo; let r;
      if(t==='fecha'){ if(!v(0)||!v(1)){ alert('Poné la fecha y el título'); return; } eok.disabled=true; r=await rpc('sub_fecha_guardar',{p_slug:slug,p_k:tok,p_fecha:v(0),p_titulo:v(1),p_url:v(2)||null,p_id:ED.id}); }
      else { const D=t==='tarea'?{titulo:v(0)}:t==='nota'?{texto:v(0)}:t==='activo'?{titulo:v(0),url:v(1),descripcion:v(2)}:{titulo:v(0),objetivo:String(parseFloat(v(1).replace(/\./g,'').replace(',','.'))||'')};
        if((t==='tarea'||t==='nota'||t==='activo')&&!v(0)){ alert('No puede quedar vacío'); return; } eok.disabled=true; r=await rpc('sub_editar',{p_slug:slug,p_k:tok,p_tipo:t,p_id:ED.id,p_datos:D}); }
      window.SRE&&window.SRE('editar',{tipo:t}); if(r&&r.ok){ if(t==='fecha') webFechas(); ED=null; recargar(); } else { eok.disabled=false; alert('No se pudo guardar. Probá de nuevo.'); } };
    raiz.querySelectorAll('[data-tal]').forEach(b=>b.onclick=()=>{ ALFORM=ALFORM===b.dataset.tal?null:b.dataset.tal; armar(window.__D); setTimeout(()=>{ const i=document.getElementById('v3alv'); i&&i.scrollIntoView({block:'center'}); },60); });
    const alGuardar=async(b,valor)=>{ b.disabled=true; window.SRE&&window.SRE('tarea_alarma',{on:!!valor}); const r=await rpc('sub_tarea_alarma',{p_slug:slug,p_k:tok,p_id:b.dataset.id,p_alarma:valor});
      if(r&&r.ok){ ALFORM=null; recargar(); } else { b.disabled=false; alert('No se pudo guardar la alarma. Probá de nuevo.'); } };
    const alok=raiz.querySelector('#v3alok'); if(alok) alok.onclick=()=>{ const v=raiz.querySelector('#v3alv').value; if(!v){ alert('Elegí el día y la hora'); return; } const f=new Date(v); if(f<new Date()){ alert('Elegí un momento que todavía no pasó'); return; } alGuardar(alok,f.toISOString()); };
    const alno=raiz.querySelector('#v3alno'); if(alno) alno.onclick=()=>alGuardar(alno,null);
    raiz.querySelectorAll('[data-tcur]').forEach(b=>b.onclick=()=>estado(b,b.dataset.tcur,b.dataset.est==='en_curso'?'pendiente':'en_curso'));
    const ta=raiz.querySelector('#v3tadd'), ti=raiz.querySelector('#v3tarea');
    const sumar=async()=>{ const t=ti.value.trim(); if(!t) return; window.SRE&&window.SRE('tarea_nueva',{}); ta.disabled=true; const r=await rpc('sub_tarea_cliente_alta',{p_slug:slug,p_k:tok,p_titulo:t}); if(r&&r.ok){ FILTRO='abiertas'; recargar(); } else ta.disabled=false; };
    if(ta){ ta.onclick=sumar; ti.onkeydown=e=>{ if(e.key==='Enter') sumar(); }; }
    const nad=raiz.querySelector('#v3nadd'), ntx=raiz.querySelector('#v3nt');
    if(nad) nad.onclick=async()=>{ const t=ntx.value.trim(); if(!t){ ntx.focus(); return; } nad.disabled=true; nad.textContent='Guardando…'; const r=await rpc('sub_nota_alta',{p_slug:slug,p_k:tok,p_texto:t}); if(r&&r.ok) recargar(); else { nad.disabled=false; nad.textContent='Guardar nota'; alert('No se pudo guardar la nota. Probá de nuevo.'); } };
    raiz.querySelectorAll('[data-ndel]').forEach(b=>b.onclick=async()=>{ if(!confirm('¿Borrar esta nota?')) return; b.disabled=true; const r=await rpc('sub_nota_borrar',{p_slug:slug,p_k:tok,p_id:b.dataset.ndel}); if(r&&r.ok) recargar(); else b.disabled=false; });
    const hn=raiz.querySelector('#v3hnuevo'); if(hn) hn.onclick=()=>{ HFORM=!HFORM; armar(window.__D); if(HFORM) setTimeout(()=>{ const o=document.getElementById('v3ho'); o&&o.scrollIntoView({block:'center'}); },60); };
    const ha=raiz.querySelector('#v3hadd'); if(ha) ha.onclick=async()=>{ const m=raiz.querySelector('#v3hm').value, o=parseFloat((raiz.querySelector('#v3ho').value||'').replace(/\./g,'').replace(',','.'));
      if(!o||o<=0){ alert('Poné a qué número querés llegar'); return; } ha.disabled=true; ha.textContent='Guardando…';
      window.SRE&&window.SRE('hito_nuevo',{}); const r=await rpc('sub_hito_cliente_alta',{p_slug:slug,p_k:tok,p_metrica:m,p_objetivo:o,p_titulo:raiz.querySelector('#v3ht').value.trim()||null});
      if(r&&r.ok){ HFORM=false; recargar(); } else { ha.disabled=false; ha.textContent='Guardar hito'; alert(r&&r.error==='demasiados'?'Ya tenés 8 hitos: borrá alguno primero.':'No se pudo guardar el hito.'); } };
    const an=raiz.querySelector('#v3anuevo'); if(an) an.onclick=()=>{ AFORM=!AFORM; armar(window.__D); if(AFORM) setTimeout(()=>{ const o=document.getElementById('v3at'); o&&(o.scrollIntoView({block:'center'}),o.focus()); },60); };
    const aa=raiz.querySelector('#v3aadd'); if(aa) aa.onclick=async()=>{ const t=raiz.querySelector('#v3at').value.trim(); let u=raiz.querySelector('#v3au').value.trim();
      if(!t){ alert('Poné un nombre para el activo'); return; } if(u&&!/^https?:\/\//i.test(u)) u='https://'+u; aa.disabled=true; aa.textContent='Guardando…';
      const r=await rpc('sub_activo_cliente_alta',{p_slug:slug,p_k:tok,p_titulo:t,p_url:u||null,p_descripcion:raiz.querySelector('#v3ad').value.trim()||null});
      if(r&&r.ok){ AFORM=false; recargar(); } else { aa.disabled=false; aa.textContent='Guardar activo'; alert('No se pudo guardar el activo. Probá de nuevo.'); } };
    raiz.querySelectorAll('[data-adel]').forEach(b=>b.onclick=async(ev)=>{ ev.preventDefault(); ev.stopPropagation(); if(!confirm('¿Borrar este activo?')) return; b.disabled=true; const r=await rpc('sub_activo_cliente_borrar',{p_slug:slug,p_k:tok,p_id:b.dataset.adel}); if(r&&r.ok) recargar(); else b.disabled=false; });
    raiz.querySelectorAll('[data-hdel]').forEach(b=>b.onclick=async()=>{ if(!confirm('¿Borrar este hito?')) return; b.disabled=true; const r=await rpc('sub_hito_cliente_borrar',{p_slug:slug,p_k:tok,p_id:b.dataset.hdel}); if(r&&r.ok) recargar(); else b.disabled=false; });
    const fn=raiz.querySelector('#v3fnueva'); if(fn) fn.onclick=()=>{ FFORM=!FFORM; armar(window.__D); };
    const fa=raiz.querySelector('#v3fadd'); if(fa) fa.onclick=async()=>{ const f=raiz.querySelector('#v3ff').value, t=raiz.querySelector('#v3ft').value.trim();
      if(!f||!t){ alert('Poné la fecha y el título'); return; } fa.disabled=true;
      window.SRE&&window.SRE('fecha_nueva',{}); const r=await rpc('sub_fecha_guardar',{p_slug:slug,p_k:tok,p_fecha:f,p_titulo:t,p_url:raiz.querySelector('#v3fu').value.trim()||null}); if(r&&r.ok){ webFechas(); FFORM=false; recargar(); } else fa.disabled=false; };
    raiz.querySelectorAll('[data-copia]').forEach(b=>b.onclick=async()=>{ let ok=false; try{ await navigator.clipboard.writeText(b.dataset.copia); ok=true; }catch(e){}
      b.textContent=ok?'Copiado':'No se pudo copiar'; setTimeout(()=>b.textContent='Copiar link de entradas',1600); });
  }

  // ---- Descargar las tareas (imagen JPG, mismo formato que el reporte) ----
  async function descargarTareas(bt, T){ window.SRE&&window.SRE('tareas_descarga',{n:T.length});
    const t0=bt.innerHTML; bt.disabled=true; bt.lastChild.textContent='Generando…';
    const raiz=document.getElementById('v3'), nom=(window.__D&&window.__D.cliente&&window.__D.cliente.nombre)||'', hoy=new Date();
    const DS=['dom','lun','mar','mié','jue','vie','sáb'], f2=x=>String(x).padStart(2,'0');
    const alt=t=>{ if(!t.alarma||t.estado==='hecha') return ''; const a=new Date(t.alarma); return `<span class="tal">Recordatorio: ${DS[a.getDay()]} ${f2(a.getDate())}/${f2(a.getMonth()+1)} · ${f2(a.getHours())}:${f2(a.getMinutes())}</span>`; };
    const fila=t=>`<div class="tfi ${t.estado}"><span class="tck">${t.estado==='hecha'?'✓':''}</span><div><div class="ttx">${esc(t.titulo)}</div>${t.estado==='en_curso'?'<span class="tec">En curso</span>':''}${alt(t)}</div></div>`;
    const P=T.filter(t=>t.estado!=='hecha').sort((a,b)=>(b.estado==='en_curso')-(a.estado==='en_curso')), H=T.filter(t=>t.estado==='hecha');
    const w=document.createElement('div'); w.className='v3exp';
    w.innerHTML=`<div class="cab"><img src="/assets/semilla-redes-oliva.png" alt=""><span class="sep"></span><span class="ia">semilla<b>IA</b></span><span class="esp"></span><span class="nm">${esc(nom)}</span></div>
      <h1 class="v3t" style="margin:18px 0 4px">Tarea para el hogar</h1><p class="bj" style="margin:0 0 16px">${DS[hoy.getDay()]} ${f2(hoy.getDate())}/${f2(hoy.getMonth()+1)}/${hoy.getFullYear()}</p>
      <div class="tsec">Pendientes · ${P.length}</div><div class="card tlis">${P.length?P.map(fila).join(''):'<div class="tfi"><div class="ttx" style="color:#8A8577">No hay tareas pendientes.</div></div>'}</div>
      ${H.length?`<div class="tsec">Hechas · ${H.length}</div><div class="card tlis">${H.map(fila).join('')}</div>`:''}
      <div class="pie">semillaredes.com</div>`;
    raiz.appendChild(w);
    try{
      if(!window.html2canvas) await cargarJs('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await Promise.all([...w.querySelectorAll('img')].map(im=>im.complete?1:new Promise(r=>{ im.onload=im.onerror=r; })));
      const cv=await html2canvas(w,{scale:2,backgroundColor:'#F2EDE4',useCORS:true});
      const archivo=`tareas-${slug}-${hoy.getFullYear()}-${f2(hoy.getMonth()+1)}-${f2(hoy.getDate())}.jpg`;
      const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',0.92));
      const f=new File([blob],archivo,{type:'image/jpeg'});
      if(/iPhone|iPad|iPod|Android/.test(navigator.userAgent)&&navigator.canShare&&navigator.canShare({files:[f]})){
        try{ await navigator.share({files:[f],title:'Tarea para el hogar'}); }catch(e){ if(e&&e.name!=='AbortError') throw e; }
      } else {
        const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=archivo; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000);
      }
    }catch(e){ console.log('descargar tareas',e); alert('No se pudo generar la imagen. Probá de nuevo.'); }
    w.remove(); bt.innerHTML=t0; bt.disabled=false;
  }
  // ---- Descargar el reporte (imagen JPG) ----
  const cargarJs=src=>new Promise((ok,mal)=>{ const sc=document.createElement('script'); sc.src=src; sc.onload=ok; sc.onerror=mal; document.head.appendChild(sc); });
  async function descargarRep(bt, I){ window.SRE&&window.SRE('reporte_descarga',{hasta:I&&I.hasta});
    if(!I) return; const t0=bt.innerHTML; bt.disabled=true; bt.lastChild.textContent='Generando…';
    const raiz=document.getElementById('v3'), scr=raiz.querySelector('[data-scr="ia"]'), nom=(window.__D&&window.__D.cliente&&window.__D.cliente.nombre)||'';
    const w=document.createElement('div'); w.className='v3exp';
    w.innerHTML=`<div class="cab"><img src="/assets/semilla-redes-oliva.png" alt=""><span class="sep"></span><span class="ia">semilla<b>IA</b></span><span class="esp"></span><span class="nm">${esc(nom)}</span></div>`+scr.innerHTML+`<div class="pie">semillaredes.com</div>`;
    w.querySelectorAll('.rbt,.ch').forEach(x=>x.remove());
    raiz.appendChild(w);
    try{
      if(!window.html2canvas) await cargarJs('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
      await Promise.all([...w.querySelectorAll('img')].map(im=>im.complete?1:new Promise(r=>{ im.onload=im.onerror=r; })));
      const cv=await html2canvas(w,{scale:2,backgroundColor:'#F2EDE4',useCORS:true});
      const archivo=`reporte-${slug}-${I.desde}-al-${I.hasta}.jpg`;
      const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg',0.92));
      const f=new File([blob],archivo,{type:'image/jpeg'});
      // en el celu: compartir la imagen (deja guardarla en Fotos o mandarla por WhatsApp); en la compu: descarga directa
      if(/iPhone|iPad|iPod|Android/.test(navigator.userAgent)&&navigator.canShare&&navigator.canShare({files:[f]})){
        try{ await navigator.share({files:[f],title:'Tu reporte'}); }catch(e){ if(e&&e.name!=='AbortError') throw e; }
      } else {
        const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=archivo; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),4000);
      }
    }catch(e){ console.log('descargar',e); alert('No se pudo generar la imagen. Probá de nuevo.'); }
    w.remove(); bt.innerHTML=t0; bt.disabled=false;
  }

  // ---- Notificaciones ----
  let NOTIFS=null;
  const fechaN=f=>{ const d=new Date(f), h=new Date(); const dd=Math.round((new Date(h.toDateString())-new Date(d.toDateString()))/864e5);
    return dd===0?'Hoy':dd===1?'Ayer':dd<7?`Hace ${dd} días`:`${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}`; };
  function notifBadge(){ const n=(NOTIFS||[]).filter(x=>!x.leida).length; const b=document.getElementById('v3nn'); if(b) b.textContent=n?(n>9?'9+':n):''; }
  function notifCargar(){ if(NOTIFS){ notifBadge(); return; } rpc('sub_notifs_get',{p_slug:slug,p_k:tok}).then(r=>{ NOTIFS=(r&&r.notifs)||[]; notifBadge(); }).catch(()=>{}); }
  function hoja(id,titulo,html){ let h=document.getElementById(id); if(!h){ h=document.createElement('div'); h.id=id; h.className='v3hoja'; document.body.appendChild(h); }
    h.innerHTML=`<div class="hh"><button class="vo" aria-label="Volver"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg></button><h2>${titulo}</h2><span></span></div><div class="hc">${html}</div>`;
    h.querySelector('.vo').onclick=()=>h.classList.remove('on'); requestAnimationFrame(()=>h.classList.add('on')); return h; }
  function notifAbrir(){ window.SRE&&window.SRE('notificaciones',{});
    const L=NOTIFS||[];
    const ic={reporte:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 19v-5M10 19V9M14 19v-7M18 19V6"/></svg>',
              aviso:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5h4"/></svg>'};
    const h=hoja('v3notifs','Notificaciones', L.length?`<div class="card lista nl">${L.map(n=>`<button class="ni ${n.leida?'':'nueva'}" data-nt="${esc(n.tipo)}"><span class="ic">${ic[n.tipo]||ic.aviso}</span><span class="tx"><b>${esc(n.titulo)}</b>${n.texto?`<span>${esc(n.texto)}</span>`:''}<small>${fechaN(n.fecha)}</small></span>${n.leida?'':'<i></i>'}</button>`).join('')}</div>`
      :'<div class="card vacio">Todavía no tenés notificaciones. Acá vas a ver cada reporte nuevo y los avisos que te mandemos.</div>');
    h.querySelectorAll('[data-nt]').forEach(b=>b.onclick=()=>{ h.classList.remove('on'); if(b.dataset.nt==='reporte') ir('ia',true); });
    if(L.some(x=>!x.leida)){ rpc('sub_notifs_leer',{p_slug:slug,p_k:tok}).then(()=>{ L.forEach(x=>x.leida=true); notifBadge(); }).catch(()=>{}); }
  }
  // ---- Perfil ----
  function perfilAbrir(){
    const d=window.__D||{}, c=d.cliente||{}, R=(d.reportes||[]).map(r=>r.metricas||{});
    const hay=k=>R.some(m=>m[k]!=null), hayP=re=>R.some(m=>Object.keys(m).some(k=>re.test(k)&&m[k]!=null));
    const W=window.__V3WEBS||[];
    const tipos={musica:'Música',arte:'Arte visual',mixto:'Proyecto cultural',teatro:'Teatro',libros:'Libros'};
    const redes=[
      ['Instagram', c.instagram?'@'+String(c.instagram).replace(/^@/,''):'Seguidores, visitas y alcance', hay('ig_followers_total'), ico.ig],
      ['Publicidad en Meta', 'Campañas en Instagram', hayP(/_inversion$/), '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#1877F2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14V10l11-5v14L4 14z"/><path d="M15 9.5h2.5a2.5 2.5 0 0 1 0 5H15M7 14.5l1.5 4.5H11l-1-4"/></svg>'],
      ['Spotify', 'Oyentes, reproducciones y seguidores', hay('sp_monthly')||hay('sp_oyentes_perfil'), ico.sp],
      ['YouTube', 'Vistas y suscriptores', hay('yt_views'), ico.yt],
      [W.length>1?'Tus webs':'Tu web', W.length?W.map(w=>String(w.url).replace(/^https?:\/\//,'').replace(/\/$/,'')).join(' · '):'Editable desde la app', W.length>0, '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="'+NAVY+'" stroke-width="1.9"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 2.5 14.4 0 17M12 3.5c-2.5 2.6-2.5 14.4 0 17"/></svg>']
    ];
    const link=(()=>{ try{ return window.top.location.href.split('#')[0]; }catch(e){ return location.href; } })();
    const h=hoja('v3perfil','Tu perfil',`
      <div class="pf"><div class="ft">${esc((c.nombre||'?').trim()[0].toUpperCase())}<img src="/assets/avatars/${slug}.jpg?v=${new Date().toISOString().slice(0,10)}" alt="" onerror="this.remove()"></div>
        <h1 class="v3t">${esc(c.nombre||'')}</h1><p class="bj">${tipos[c.tipo]||'Proyecto'}${c.instagram?' · @'+esc(String(c.instagram).replace(/^@/,'')):''}</p></div>
      <div class="tit2"><h2>Tus conexiones</h2></div>
      <div id="v3pcx"></div>
      <div class="tit2"><h2>Tu acceso</h2></div>
      <div class="card" style="padding:16px" id="v3acc">${(()=>{ let g=null; try{ g=JSON.parse(localStorage.getItem('sb-fdrxsjphlvvwwknnrjtx-auth-token')||'null'); }catch(e){}
        const mail=g&&g.user&&g.user.email;
        return mail
          ? `<p style="margin:0 0 12px;font-size:14.5px;line-height:1.45;color:#3A3846">Entrás con tu cuenta de Google <b>${esc(mail)}</b>.</p><a class="cpL" href="/app.html?elegir=1" style="display:inline-block;text-decoration:none;margin-right:8px">Cambiar de proyecto</a><a class="cpL" href="/app.html?salir=1" style="display:inline-block;text-decoration:none;background:transparent;color:#7A1F3A">Cerrar sesión</a><button class="cpL oculto" id="v3cpl"></button>`
          : `<p style="margin:0 0 12px;font-size:14.5px;line-height:1.45;color:#3A3846">Entrás con un link privado. Vinculalo a tu cuenta (Google o mail) para entrar desde cualquier dispositivo.</p><a class="cpL" href="/app.html?c=${encodeURIComponent(slug)}&k=${encodeURIComponent(tok)}" style="display:inline-block;text-decoration:none;margin-right:8px">Crear mi cuenta</a><button class="cpL" id="v3cpl" style="background:transparent;color:#1A2456">Copiar mi link</button>`; })()}</div>`);
    const pcx=h.querySelector('#v3pcx'); if(pcx){ const ir=()=>window.SRConexiones.montar(pcx,{slug,k:tok,plegado:false}); if(window.SRConexiones) ir(); else { const sc=document.createElement('script'); sc.src='/conexiones.js?v='+(window.SR_VER||Date.now()); sc.onload=ir; document.head.appendChild(sc); } }
    const b=h.querySelector('#v3cpl'); if(b) b.onclick=async()=>{ let ok=false; try{ await navigator.clipboard.writeText(link); ok=true; }catch(e){} b.textContent=ok?'Copiado':'No se pudo copiar'; setTimeout(()=>b.textContent='Copiar mi link',1600); };
  }

  // ---- SemillaIA: burbuja de chat siempre visible ----
  function chatMontar(nombre){
    if(document.getElementById('v3chatb')){ return; }
    const b=document.createElement('button'); b.id='v3chatb'; b.setAttribute('aria-label','Chatear con SemillaIA');
    b.innerHTML='<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"><path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/><path d="M8.5 9.5h7M8.5 12.5h4.5" stroke-linecap="round"/></svg><span>semilla<b>IA</b></span>';
    const p=document.createElement('div'); p.id='v3chat';
    p.innerHTML=`<div class="hd"><div><b>semilla<i>IA</i></b><small>Preguntame por tus números, tus tareas o qué hacer ahora.</small></div><button class="mn" aria-label="Minimizar">–</button></div><div class="ms" id="v3ms"></div><div class="sg" id="v3sg"></div><form class="in" id="v3cf"><input id="v3ci" placeholder="Escribile a SemillaIA" autocomplete="off"><button aria-label="Enviar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>`;
    document.body.appendChild(p); document.body.appendChild(b);
    if(!CHAT.length) CHAT.push({rol:'ia',texto:`Hola${nombre?' '+nombre:''}, soy SemillaIA. ¿En qué te ayudo?`});
    const sg=['¿Cómo vengo?','¿Qué hago ahora?','Explicame el último reporte'];
    const pintar=()=>{ const ms=document.getElementById('v3ms');
      ms.innerHTML=CHAT.map(m=>`<div class="m ${m.rol==='ia'?'ia':'yo'}">${esc(m.texto).replace(/\n/g,'<br>')}</div>`).join('')+(CHAT_ESP?'<div class="m ia esp"><i></i><i></i><i></i></div>':'');
      document.getElementById('v3sg').innerHTML=CHAT.length<=1?sg.map(t=>`<button>${t}</button>`).join(''):'';
      document.querySelectorAll('#v3sg button').forEach(x=>x.onclick=()=>enviar(x.textContent));
      ms.scrollTop=ms.scrollHeight; };
    const enviar=async(t)=>{ t=(t||'').trim(); if(!t||CHAT_ESP) return; CHAT.push({rol:'yo',texto:t}); CHAT_ESP=true; window.SRE&&window.SRE('chat',{n:CHAT.length}); pintar();
      let r=null; try{ r=await fetch('https://vm.semillaredes.com/web/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c:slug,k:tok,mensajes:CHAT.slice(1)})}).then(x=>x.json()); }catch(e){}
      CHAT_ESP=false; CHAT.push({rol:'ia',texto:(r&&r.respuesta)||'Ahora no pude responder. Probá de nuevo en un ratito.'}); pintar(); };
    const abrir=on=>{ CHAT_ON=on; p.classList.toggle('on',on); b.classList.toggle('oc',on); if(on){ pintar(); setTimeout(()=>{ const i=document.getElementById('v3ci'); if(i&&!('ontouchstart' in window)) i.focus(); },80); } };
    b.onclick=()=>abrir(true); p.querySelector('.mn').onclick=()=>abrir(false);
    document.getElementById('v3cf').onsubmit=e=>{ e.preventDefault(); const i=document.getElementById('v3ci'); const t=i.value; i.value=''; enviar(t); };
    pintar();
  }

  window.V3IR=k=>{
    const ve=(sel,fn)=>{ setTimeout(()=>{ const el=typeof sel==='function'?sel():document.querySelector(sel); if(el){ if(fn) fn(el); el.scrollIntoView({behavior:'smooth',block:'start'}); el.classList.add('srFlash'); setTimeout(()=>el.classList.remove('srFlash'),1800); } },120); };
    if(k==='hitos'){ HFORM=true; TAB='proyecto'; SS('tab','proyecto'); armar(window.__D); ve('#v3ho'); }
    else if(k==='notas'){ ir('proyecto',true); ve('#v3nt',el=>el.focus()); }
    else if(['ventas','activos'].includes(k)&&window.srBuscar){ ir('metricas',true); const t=document.getElementById('v3todo'); if(t) t.open=true; setTimeout(()=>{ window.srIrA(window.srBuscar(k)||t); },150); }
    else if(k==='fechas'){ FFORM=true; TAB='actividades'; SS('tab','actividades'); armar(window.__D); ve('#v3ff'); }
    else if(k==='tareas'){ ir('actividades',true); ve('#v3tarea'); }
    else if(k==='web'){ ir('proyecto',true); ve('#v3web'); }
  };
  function ir(t,scroll){ TAB=t; SS('tab',t); window.SRE&&window.SRE('pantalla',{p:t}); if(scroll) SS('y','0');
    document.querySelectorAll('#v3 .scr').forEach(s=>s.classList.toggle('on',s.dataset.scr===t));
    document.querySelectorAll('#v3nav button').forEach(b=>b.classList.toggle('on',b.dataset.ir===t));
    if(scroll) window.scrollTo(0,0); }
})();
