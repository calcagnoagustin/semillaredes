/* SemillaIA · CONEXIONES PARA TODOS (20/10/2026)
   La misma pieza en la app de clientes (app3.js) y en la de alumnos (alumno.html).
   Uso: SRConexiones.montar(elemento, {slug, k, plegado:true|false})
   - Instagram: @usuario de una cuenta profesional (lo valida la VM con Meta, solo lectura)
   - Spotify:   link del perfil de artista (oyentes mensuales públicos)
   - YouTube:   botón de Google (oauth-youtube.html), solo lectura
   - Meta Ads:  por ahora la conecta Semilla; Facebook Login cuando Meta apruebe la app */
(function(){
  if(window.SRConexiones) return;
  var API='https://fdrxsjphlvvwwknnrjtx.supabase.co', KEY='sb_publishable_kT7McM9Dt7xP44IlFotsLA_8-b8q_17', VM='https://vm.semillaredes.com/web/conexion';
  var rpc=function(fn,a){ return fetch(API+'/rest/v1/rpc/'+fn,{method:'POST',headers:{apikey:KEY,'Content-Type':'application/json'},body:JSON.stringify(a)}).then(function(r){return r.json();}); };
  var esc=function(s){ return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); };
  var nf=function(v){ return v==null?'—':Number(v).toLocaleString('es-AR'); };
  var ev=function(e,d){ try{ window.SRE&&window.SRE(e,d||{}); }catch(x){} };

  var css=document.createElement('style');
  css.textContent=
  '.srcx{background:#FBF8F2;border:1px solid #E1D9C9;border-radius:16px;padding:4px 16px;margin:14px 0;font-family:Inter,system-ui,sans-serif;color:#24242C}'+
  '.srcx>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:14px 0;font-weight:700;color:#1A2456;font-size:16px}'+
  '.srcx>summary::-webkit-details-marker{display:none}'+
  '.srcx>summary .cnt{margin-left:auto;font:600 12.5px/1 Inter,sans-serif;color:#87863A;background:#EEEBDD;border-radius:999px;padding:6px 10px}'+
  '.srcx>summary .fl{transition:transform .2s;color:#87863A}.srcx[open]>summary .fl{transform:rotate(90deg)}'+
  '.srcx .bj{font-size:14px;color:#6B6878;margin:-4px 0 6px}'+
  '.srcx .fila{display:grid;grid-template-columns:34px 1fr;gap:12px;padding:14px 0;border-top:1px solid #E8E1D2}'+
  '.srcx .ic{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;color:#fff;font:700 13px/1 Inter,sans-serif}'+
  '.srcx .nm{font-weight:700;color:#1A2456;font-size:15px;line-height:34px}'+
  '.srcx .st{font-size:14px;color:#24242C;margin-top:-4px}.srcx .st b{color:#1A2456}'+
  '.srcx .ok{color:#5E7A1E;font-weight:700}.srcx .mute{color:#6B6878}'+
  '.srcx .err{color:#7A1F3A;font-size:13.5px;margin-top:8px;line-height:1.45}'+
  '.srcx .frm{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}'+
  '.srcx .frm input{flex:1;min-width:170px;border:1px solid #D9D1C0;background:#fff;border-radius:10px;padding:10px 12px;font:inherit;font-size:15px;color:#24242C}'+
  '.srcx button.pri{border:0;background:#1A2456;color:#fff;font:600 14px/1 Inter,sans-serif;border-radius:10px;padding:11px 15px;cursor:pointer}'+
  '.srcx button.pri[disabled]{opacity:.55;cursor:default}'+
  '.srcx button.lnk{border:0;background:none;color:#7A1F3A;font:600 13px/1 Inter,sans-serif;padding:6px 0;cursor:pointer;margin-right:14px}'+
  '.srcx details.ay{margin-top:6px}.srcx details.ay summary{font-size:13px;color:#87863A;cursor:pointer}'+
  '.srcx details.ay ol{margin:6px 0 0 18px;padding:0;font-size:13.5px;color:#4A4756;line-height:1.55}';
  document.head.appendChild(css);

  var FUENTES=[
    {id:'meta', nombre:'Meta · Instagram y publicidad', ic:'f', color:'#1877F2'},
    {id:'instagram', nombre:'Instagram', ic:'IG', color:'linear-gradient(45deg,#F9A43A,#E1306C,#7B3FE4)'},
    {id:'spotify', nombre:'Spotify', ic:'SP', color:'#1DB954'},
    {id:'youtube', nombre:'YouTube', ic:'YT', color:'#E62117'},
    {id:'meta_ads', nombre:'Publicidad en Meta', ic:'AD', color:'#1A2456'}
  ];
  var AYUDA={
    instagram:'<ol><li>Tu cuenta tiene que ser profesional: en Instagram, Configuración → Tipo de cuenta y herramientas → Cambiar a cuenta profesional → Creador. Es gratis.</li><li>Escribí tu usuario (por ejemplo @tuartista) y tocá Conectar.</li><li>Listo: SemillaIA trae tus seguidores y tus publicaciones todos los días. No publica nada ni ve tus mensajes.</li></ol>',
    spotify:'<ol><li>En Spotify, entrá a tu perfil de artista.</li><li>Tocá ··· → Compartir → Copiar enlace al artista.</li><li>Pegalo acá y tocá Conectar. SemillaIA trae tus oyentes mensuales todos los días.</li></ol>',
    meta:'<ol><li>Tocá Continuar con Facebook y entrá con la cuenta que administra tu página.</li><li>Elegí tu página (la vinculada a tu Instagram profesional) y tu cuenta publicitaria, y aceptá. Es solo lectura.</li><li>Volvés solo a tu app con tus números conectados.</li></ol>',
    youtube:'<ol><li>Tocá Conectar con Google.</li><li>Elegí la cuenta de Google dueña del canal y aceptá el permiso de solo lectura.</li><li>Volvés solo a tu app. Desde ahí SemillaIA trae visualizaciones, horas y suscriptores.</li></ol>'
  };

  function estadoTxt(f,c){
    var u=c.ultimo||{};
    if(f==='instagram') return '<span class="ok">✓</span> <b>@'+esc(c.valor)+'</b>'+(u.seguidores!=null?' · '+nf(u.seguidores)+' seguidores':'');
    if(f==='spotify') return '<span class="ok">✓</span> <b>'+esc(u.artista||'Tu perfil')+'</b>'+(u.oyentes_mensuales!=null?' · '+nf(u.oyentes_mensuales)+' oyentes mensuales':'');
    if(f==='youtube') return '<span class="ok">✓</span> <b>'+esc(u.canal||'Tu canal')+'</b>'+(u.suscriptores!=null?' · '+nf(u.suscriptores)+' suscriptores':'');
    if(f==='meta_ads') return '<span class="ok">✓</span> <b>'+esc(u.nombre||'Cuenta publicitaria')+'</b>'+(c.via==='semilla'||!u.via?' · conectada por Semilla':'');
    if(f==='meta') return '<span class="ok">✓</span> Conectado'+(u.nombre?' como <b>'+esc(u.nombre)+'</b>':'');
    return '';
  }

  function montar(el,o){
    if(!el||!o||!o.slug||!o.k) return;
    var st={tipo:null,L:{},err:{},ocupado:null,abierto:!o.plegado};
    function pintar(){
      var n=FUENTES.filter(function(F){ return F.id!=='meta'&&st.L[F.id]&&st.L[F.id].estado==='conectado'; }).length;
      var h='<details class="srcx"'+(st.abierto?' open':'')+'><summary><span class="fl">▸</span>Tus conexiones<span class="cnt">'+n+' de '+(FUENTES.length-1)+'</span></summary>'+
        '<p class="bj">Conectá tus redes una sola vez y SemillaIA trae tus números sola. Todo es de solo lectura: nunca publicamos ni tocamos nada.</p>';
      FUENTES.forEach(function(F){
        var c=st.L[F.id], f=F.id, conectado=c&&c.estado==='conectado', semilla=c&&c.via==='semilla';
        h+='<div class="fila"><div class="ic" style="background:'+F.color+'">'+F.ic+'</div><div><div class="nm">'+F.nombre+'</div>';
        if(conectado){
          h+='<div class="st">'+estadoTxt(f,c)+'</div>';
          if(f==='meta') h+='<div><button class="lnk" data-meta="1">Volver a conectar</button></div>';
          else if(!semilla&&f!=='meta_ads') h+='<div><button class="lnk" data-cambiar="'+f+'">Cambiar</button><button class="lnk" data-desc="'+f+'">Desconectar</button></div>';
        } else if(c&&c.estado==='error'){
          h+='<div class="st mute">Se cortó la conexión.</div><div class="err">'+esc(c.error||'Volvé a conectarla.')+'</div>';
        }
        var mostrarForm=!conectado||st.cambiando===f;
        if(mostrarForm&&(f==='instagram'||f==='spotify')){
          h+='<div class="frm"><input data-in="'+f+'" placeholder="'+(f==='instagram'?'@tuusuario':'Link de tu perfil de artista')+'" autocomplete="off" autocapitalize="off" spellcheck="false"><button class="pri" data-con="'+f+'"'+(st.ocupado===f?' disabled':'')+'>'+(st.ocupado===f?'Conectando…':'Conectar')+'</button></div>';
          if(st.err[f]) h+='<div class="err">'+esc(st.err[f])+'</div>';
          h+='<details class="ay"><summary>Cómo se hace</summary>'+AYUDA[f]+'</details>';
        } else if(mostrarForm&&f==='youtube'){
          h+='<div class="frm"><button class="pri" data-yt="1">Conectar con Google</button></div><details class="ay"><summary>Cómo se hace</summary>'+AYUDA.youtube+'</details>';
        } else if(mostrarForm&&f==='meta'){
          h+='<div class="st mute">Trae visitas al perfil, alcance, seguidores nuevos y lo invertido en publicidad.</div><div class="frm"><button class="pri" data-meta="1" style="background:#1877F2">Continuar con Facebook</button></div><details class="ay"><summary>Cómo se hace</summary>'+AYUDA.meta+'</details>';
        } else if(!conectado&&f==='meta_ads'){
          h+='<div class="st mute">Se conecta con el botón de Meta de arriba.</div>';
        }
        h+='</div></div>';
      });
      el.innerHTML=h+'</details>';
      var d=el.querySelector('details.srcx'); d.addEventListener('toggle',function(){ st.abierto=d.open; });
      el.querySelectorAll('[data-con]').forEach(function(b){ b.onclick=function(){ conectar(b.dataset.con); }; });
      el.querySelectorAll('[data-in]').forEach(function(i){ i.onkeydown=function(e){ if(e.key==='Enter') conectar(i.dataset.in); }; });
      el.querySelectorAll('[data-cambiar]').forEach(function(b){ b.onclick=function(){ st.cambiando=b.dataset.cambiar; pintar(); }; });
      el.querySelectorAll('[data-desc]').forEach(function(b){ b.onclick=function(){ desconectar(b.dataset.desc); }; });
      var y=el.querySelector('[data-yt]'); if(y) y.onclick=youtube;
      el.querySelectorAll('[data-meta]').forEach(function(b){ b.onclick=meta; });
    }
    function cargar(){
      return rpc('con_get',{p_slug:o.slug,p_k:o.k}).then(function(r){ if(r&&!r.error){ st.tipo=r.tipo; st.L=r.conexiones||{}; } pintar(); }).catch(pintar);
    }
    function conectar(f){
      var i=el.querySelector('[data-in="'+f+'"]'); var v=(i&&i.value||'').trim(); if(!v){ i&&i.focus(); return; }
      st.ocupado=f; st.err[f]=''; pintar();
      fetch(VM,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({c:o.slug,k:o.k,fuente:f,valor:v})})
        .then(function(r){ return r.json(); }).catch(function(){ return {error:'No pudimos conectar ahora. Probá de nuevo en un rato.'}; })
        .then(function(r){ st.ocupado=null;
          if(r&&r.ok){ st.cambiando=null; ev('conexion',{f:f}); cargar().then(function(){ if(o.alConectar) o.alConectar(f); }); }
          else { st.err[f]=(r&&r.error)||'No se pudo conectar.'; pintar(); var j=el.querySelector('[data-in="'+f+'"]'); if(j) j.value=v; } });
    }
    function desconectar(f){
      if(!confirm('¿Desconectar '+(f==='instagram'?'Instagram':f==='spotify'?'Spotify':'YouTube')+'? Dejamos de traer esos números.')) return;
      rpc('con_desconectar',{p_slug:o.slug,p_k:o.k,p_fuente:f}).then(function(){ ev('conexion_baja',{f:f}); cargar(); });
    }
    function youtube(){
      var cuenta=(st.tipo==='alumno'?'alu:':'')+o.slug;
      ev('conexion_yt',{});
      var volver=location.href; try{ if(window.top!==window) volver=window.top.location.href; }catch(e){}
      var u='https://semillaredes.com/oauth-youtube.html?c='+encodeURIComponent(cuenta)+'&k='+encodeURIComponent(o.k)+'&volver='+encodeURIComponent(volver);
      try{ if(window.top!==window){ window.top.location.href=u; return; } }catch(e){}
      location.href=u;
    }
    function meta(){
      var cuenta=(st.tipo==='alumno'?'alu:':'')+o.slug;
      ev('conexion_meta',{});
      var volver=location.href; try{ if(window.top!==window) volver=window.top.location.href; }catch(e){}
      var u='https://semillaredes.com/oauth-meta.html?c='+encodeURIComponent(cuenta)+'&k='+encodeURIComponent(o.k)+'&volver='+encodeURIComponent(volver);
      try{ if(window.top!==window){ window.top.location.href=u; return; } }catch(e){}
      location.href=u;
    }
    pintar(); cargar();
    return {recargar:cargar};
  }
  window.SRConexiones={montar:montar};
})();
