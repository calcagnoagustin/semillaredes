/* Tienda Agus Calcagno (Tiendup): header, menú, home y pie con la estética Semilla.
   Se carga desde Códigos personalizados de Tiendup (head). Estilos: tienda.css */
(function(){
  var BASE='https://semillaredes.com';
  var STORE_HOME='/';
  var NAV=[
    ['Inicio','/'],
    ['Cursos','/c/curso'],
    ['Auditoría','/s/auditoria-inicial-con-agus'],
    ['Recursos<span class="dd"> (Drops)</span>',BASE+'/drops/'],
    ['Sobre mí','/page/quien-soy'],
    ['Blog','/blog']
  ];
  var ARROW='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  var MARK='<svg viewBox="0 0 44 44" fill="none"><g stroke="#D8434F" stroke-width="1.6"><line x1="22" y1="22" x2="4" y2="22"/><line x1="22" y1="22" x2="40" y2="22"/><line x1="22" y1="22" x2="22" y2="4"/><line x1="22" y1="22" x2="22" y2="40"/><line x1="22" y1="22" x2="8" y2="8"/><line x1="22" y1="22" x2="36" y2="36"/><line x1="22" y1="22" x2="36" y2="8"/><line x1="22" y1="22" x2="8" y2="36"/></g><path d="M22,10 C26,14 28,18 28,22 C28,26 26,30 22,34 C18,30 16,26 16,22 C16,18 18,14 22,10Z" fill="#7B8A32"/><g fill="#D8434F"><circle cx="4" cy="22" r="2.6"/><circle cx="40" cy="22" r="2.6"/><circle cx="22" cy="4" r="2.6"/><circle cx="22" cy="40" r="2.6"/><circle cx="8" cy="8" r="2.6"/><circle cx="36" cy="36" r="2.6"/><circle cx="36" cy="8" r="2.6"/><circle cx="8" cy="36" r="2.6"/></g></svg>';
  function brand(){return '<a class="t-brand" href="/">'+MARK+'<span class="t-brand-txt"><span class="t-brand-name">AGUS CALCAGNO</span><span class="t-brand-sub">Música · Arte · Cultura · Negocios digitales</span></span></a>';}
  var path=location.pathname.replace(/\/$/,'')||'/';
  function activo(h){
    if(h.indexOf('http')===0)return false;
    if(h==='/')return path==='/';
    if(h==='/c/curso')return /^\/(c|curso|p)\//.test(path)&&path!=='/s/auditoria-inicial-con-agus';
    return path===h||path.indexOf(h+'/')===0;
  }
  function liHtml(it){return '<li class="'+(activo(it[1])?'uk-active':'')+'"><a href="'+it[1]+'">'+it[0]+'</a></li>';}

  function header(){
    var nav=document.querySelector('nav.main-navbar');if(!nav||nav.getAttribute('data-t'))return;nav.setAttribute('data-t','1');
    var left=nav.querySelector('.uk-navbar-left');
    if(left){
      var logo=left.querySelector('a.uk-margin-right');
      var ul=left.querySelector('ul.uk-navbar-nav');
      var search=null;
      if(ul){[].forEach.call(ul.querySelectorAll('li'),function(li){if(li.querySelector('a[href="#search-modal-full"]'))search=li;});}
      if(logo){logo.insertAdjacentHTML('beforebegin',brand());logo.style.display='none';}
      if(ul){ul.innerHTML=NAV.map(liHtml).join('');if(search)ul.appendChild(search);}
    }
    var mob=nav.querySelector('.uk-hidden\\@m');
    if(mob&&!mob.querySelector('.t-brand')){mob.insertAdjacentHTML('afterbegin',brand());}
    // menú lateral (celular)
    var off=document.querySelector('#offcanvas-menu');
    if(off){var ou=off.querySelector('ul.uk-nav');if(ou&&!ou.getAttribute('data-t')){ou.setAttribute('data-t','1');ou.innerHTML=NAV.map(liHtml).join('')+ou.innerHTML.split('</li>').filter(function(x){return /login|cart|search|Ingresar|Carrito|Buscar/i.test(x);}).map(function(x){return x+'</li>';}).join('');}}
  }

  function footer(){
    var f=document.querySelector('footer.site-footer');if(!f||f.querySelector('.t-foot'))return;
    [].forEach.call(f.querySelectorAll('a'),function(a){if(a.textContent.trim()==='Home'){var ul=a.closest('ul');if(ul&&!ul.getAttribute('data-t')){ul.setAttribute('data-t','1');ul.innerHTML=NAV.map(function(it){return '<li><a href="'+it[1]+'">'+it[0]+'</a></li>';}).join('');}}});
    f.insertAdjacentHTML('afterbegin','<div class="t-foot">'+brand()+'<p>Estrategia digital, publicidad y herramientas prácticas para que la música, el arte y la cultura lleguen más lejos.</p></div>');
  }

  function fechaLarga(s){try{var d=new Date(s+'T12:00:00');return d.toLocaleDateString('es-AR',{day:'numeric',month:'long',year:'numeric'});}catch(e){return s;}}
  var IMGS=['il-vinilo','il-embudo','il-ojo','il-megafono','il-boca','il-auris'];
  function drops(el){
    fetch(BASE+'/drops/ultimos.json').then(function(r){return r.json();}).then(function(j){
      var l=(j.drops||[]).slice(0,3);if(!l.length)return;
      el.innerHTML=l.map(function(d,i){
        return '<a class="t-drop" href="'+d.url+'"><span class="t-eyebrow">Drop #'+d.n+' · '+(d.categoria||'')+'</span><h4>'+d.titulo+'</h4><div class="im"><img loading="lazy" alt="" src="'+BASE+'/drops/img/'+IMGS[i%IMGS.length]+'.webp"></div><div class="ft"><span>'+fechaLarga(d.fecha)+'</span><b>›</b></div></a>';
      }).join('');
    }).catch(function(){el.innerHTML='';});
  }

  function home(){
    if(path!=='/')return;
    var w=document.querySelector('.home-page-wrapper');if(!w||w.classList.contains('t-home'))return;
    var A=BASE+'/assets/tienda/';
    var av=['abel-maldonado','alan-sutton','federico-andahazi','flor-del-valle','mavela'].map(function(n){return '<img alt="" src="'+BASE+'/assets/avatars/'+n+'.jpg">';}).join('');
    var card=function(tag,t,p,btn,href,img){return '<article class="t-card"><div class="t-card-b"><span class="t-eyebrow">'+tag+'</span><h3>'+t+'</h3><p>'+p+'</p><a class="t-btn sm" href="'+href+'">'+btn+' '+ARROW+'</a></div><div class="t-card-i"><img alt="" loading="lazy" src="'+A+img+'.webp"></div></article>';};
    w.innerHTML=
    '<section class="t-hero"><div class="t-wrap"><div class="t-hero-txt"><span class="t-eyebrow">Estrategia digital para proyectos creativos</span>'+
      '<h1>Música, arte y cultura que conectan<i>.</i></h1>'+
      '<p class="lead">Te ayudo a convertir tu talento en un proyecto sostenible, con estrategia digital, publicidad y herramientas prácticas para que tu arte llegue más lejos.</p>'+
      '<a class="t-btn" href="/c/curso">Conocé mis cursos '+ARROW+'</a>'+
      '<div class="t-proof"><span class="av">'+av+'</span><span>Más de 150 artistas, músicos y<br>proyectos culturales ya pasaron por el proceso</span></div></div>'+
      '<div class="t-art"><img alt="Agus Calcagno" src="'+A+'home-hero.webp"></div></div></section>'+
    '<section class="t-sec"><div class="t-wrap"><div class="t-sec-head"><h2>Mis propuestas<br>para impulsar tu proyecto</h2><p>Formación, acompañamiento y recursos prácticos para artistas, músicos y proyectos culturales que quieren crecer en el mundo digital.</p></div>'+
      '<div class="t-cards">'+
      card('Curso online','Formación<br>Semilla','Para artistas que quieren gestionar, crecer y profesionalizar su proyecto online.','Ver curso','/p/formacion-semilla-grupo','card-formacion')+
      card('Sesiones 1 a 1','Auditoría<br>con Agus','Una hora para ordenar tu proyecto, comunicación y estrategia digital.','Reservar sesión','/s/auditoria-inicial-con-agus','card-auditoria')+
      card('Curso online','Anuncios en<br>Meta Ads','Publicidad digital para músicos, artistas y proyectos culturales.','Ver curso','/curso/curso-de-anuncios-en-meta-ads-instagram-y-facebook-para-arte-y-cultura','card-metaads')+
      '</div></div></section>'+
    '<section class="t-sec alt"><div class="t-wrap"><div class="t-drops"><div class="t-drops-intro"><h2>Últimos drops</h2><p>Ideas, herramientas y reflexiones para artistas que quieren llevar su proyecto más lejos.</p><a class="more" href="'+BASE+'/drops/">Ver todos los drops →</a></div><div id="t-drops-list" style="display:contents"></div></div></div></section>';
    w.classList.add('t-home');
    drops(w.querySelector('#t-drops-list'));
  }

  function sobreMi(){
    if(path!=='/page/quien-soy')return;
    var pc=document.querySelector('#page-content');if(!pc||pc.querySelector('.t-about'))return;
    var blk=[].filter.call(pc.children,function(e){return /^\s*404/.test(e.textContent);})[0];if(!blk)return;
    blk.className='t-about t-home';
    blk.innerHTML='<section class="t-hero"><div class="t-wrap"><div class="t-hero-txt"><span class="t-eyebrow">Sobre mí</span><h1>Hola, soy Agus<i>.</i></h1>'+
      '<p class="lead">Trabajo con músicos, artistas y proyectos culturales para convertir su talento en negocios digitales que funcionan. Soy el creador de Semilla Redes, un método que parte de una pregunta simple: ¿qué vendés, a quién y por qué alguien pagaría?</p>'+
      '<p class="lead">Desde ahí construimos todo: marca, redes, publicidad y modelo de negocio. Me especializo en estrategia digital, Meta Ads, YouTube Ads y Spotify Ads para proyectos culturales.</p>'+
      '<p class="lead">Más de 150 artistas ya pasaron por el proceso. El árbol ya está en la semilla. Yo te ayudo a encontrarlo.</p>'+
      '<div class="t-actions"><a class="t-btn" href="/s/auditoria-inicial-con-agus">Agendá tu auditoría '+ARROW+'</a><a class="t-btn line" href="/c/curso">Conocé mis cursos</a></div></div>'+
      '<div class="t-art"><img alt="Agus Calcagno" src="'+BASE+'/assets/tienda/dash-hero.webp"></div></div></section>';
    document.title='Sobre mí — Agus Calcagno';
  }
  function categoria(){
    if(path!=='/c/curso')return;
    [].forEach.call(document.querySelectorAll('h1,h2,.uk-h1,.uk-h2'),function(h){if(h.textContent.trim().toLowerCase()==='curso')h.textContent='Cursos';});
  }

  function curso(){
    if(path.indexOf('/curso/')!==0)return;
    var ci=document.querySelector('.course-intro');if(!ci||ci.classList.contains('t-curso'))return;
    ci.classList.add('t-curso');
    var h=ci.querySelector('h1');
    if(h)h.insertAdjacentHTML('beforebegin','<span class="t-eyebrow">Curso online · Semilla Redes</span>');
    var grid=ci.querySelector('.uk-grid');var cols=grid?grid.children:[];var right=cols.length>1?cols[cols.length-1]:null;
    var A=BASE+'/assets/tienda/';
    var art=path==='/curso/formacion-semilla'?'formacion-curso':'meta-hero';
    if(right){
      var fr=right.querySelector('iframe');
      if(fr){
        var sec=document.createElement('section');sec.className='t-sec t-video';
        sec.innerHTML='<div class="t-wrap"><div class="t-sec-head"><h2>Mirá la presentación</h2></div><div class="t-vid"></div></div>';
        sec.querySelector('.t-vid').appendChild(fr);
        ci.parentElement.insertBefore(sec,ci.nextSibling);
      }
      right.className='uk-width-1-2@m uk-width-1-2@s t-curso-art';
      right.innerHTML='<img alt="" src="'+A+art+'.webp">';
    }
  }

  function clases(){
    var lis=[].filter.call(document.querySelectorAll('li'),function(li){return li.querySelector('.lesson-list-indicator')&&li.querySelector('a');});
    if(!lis.length||lis[0].classList.contains('t-clase'))return;
    var thumbs=path.indexOf('meta-ads')>0;
    lis.forEach(function(li,i){
      li.classList.add('t-clase');if(li.parentElement)li.parentElement.classList.add('t-clases');
      var a=li.querySelector('a');var n=i+1;
      a.insertAdjacentHTML('afterbegin','<span class="t-num">'+n+'</span>');
      if(thumbs&&n<=4&&a.lastElementChild)a.lastElementChild.insertAdjacentHTML('beforebegin','<img class="t-th" alt="" src="'+BASE+'/assets/tienda/clase-'+n+'.webp">');
    });
  }

  function init(){
    document.documentElement.classList.add('tienda');
    try{header();footer();home();sobreMi();categoria();curso();clases();}catch(e){console.warn('tienda',e);}
  }
  document.documentElement.classList.add('tienda');
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
  window.addEventListener('load',function(){try{header();footer();home();sobreMi();categoria();curso();clases();}catch(e){}});
})();
