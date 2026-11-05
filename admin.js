/* Administración · Semilla Redes
   Seguridad: Supabase Auth (Google / enlace por mail) + segundo factor TOTP.
   Toda autorización se verifica en la base (es_admin). Acá no hay secretos. */
'use strict';

const SB_URL = 'https://fdrxsjphlvvwwknnrjtx.supabase.co';
const SB_KEY = 'sb_publishable_kT7McM9Dt7xP44IlFotsLA_8-b8q_17';
const IDLE_MIN = 20;
const sb = window.supabase.createClient(SB_URL, SB_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' } });

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const ars = (n) => n == null ? '—' : '$' + Math.round(Number(n)).toLocaleString('es-AR');
const fecha = (d, conHora) => { if (!d) return '—'; const x = new Date(d); return x.toLocaleDateString('es-AR', { day: 'numeric', month: 'short', ...(conHora ? { hour: '2-digit', minute: '2-digit' } : {}) }); };
const dias = (d) => d ? Math.round((new Date(d) - Date.now()) / 864e5) : null;

let toastT; function toast(m, err) { const t = $('toast'); t.textContent = m; t.className = 'toast on' + (err ? ' err' : ''); clearTimeout(toastT); toastT = setTimeout(() => t.className = 'toast', 2600); }
function abrirLateral(html) { $('lateral-cont').innerHTML = html; $('lateral').classList.add('abierto'); $('lateral').setAttribute('aria-hidden', 'false'); $('velo').classList.add('on'); }
function cerrarLateral() { $('lateral').classList.remove('abierto'); $('lateral').setAttribute('aria-hidden', 'true'); $('velo').classList.remove('on'); }
$('lateral-cerrar').onclick = cerrarLateral; $('velo').onclick = cerrarLateral;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarLateral(); });

async function rpc(fn, args) {
  const { data, error } = await sb.rpc(fn, args || {});
  if (error) { console.error(fn, error); return { ok: false, error: error.message }; }
  return data ?? { ok: false, error: 'sin respuesta' };
}
async function mp(op, args) {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return { error: 'sin sesión' };
  const r = await fetch(SB_URL + '/functions/v1/mp-admin', { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: SB_KEY, Authorization: 'Bearer ' + session.access_token }, body: JSON.stringify({ op, ...(args || {}) }) });
  return r.json().catch(() => ({ error: 'respuesta inválida' }));
}

/* ---------- Login ---------- */
const vista = (id) => { ['paso-login', 'paso-mfa', 'paso-denegado'].forEach((x) => $(x).classList.toggle('oculto', x !== id)); };

$('btn-google').onclick = async () => {
  const ret = location.origin + location.pathname;
  const { error } = await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: ret, queryParams: { prompt: 'select_account' } } });
  if (error) $('msg-login').textContent = error.message;
};
$('form-mail').onsubmit = async (e) => {
  e.preventDefault();
  const email = $('mail').value.trim(); const m = $('msg-login');
  const { error } = await sb.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: location.origin + location.pathname } });
  m.className = 'msg ' + (error ? 'err' : 'ok'); m.textContent = error ? 'No se pudo enviar el enlace: ' + error.message : 'Listo. Revisá tu mail y abrí el enlace desde este dispositivo.';
};
$('den-volver').onclick = () => vista('paso-login');
$('mfa-salir').onclick = salir;
$('btn-salir').onclick = salir;
async function salir() { await sb.auth.signOut(); location.hash = ''; location.reload(); }

$('form-mfa').onsubmit = async (e) => {
  e.preventDefault();
  const m = $('msg-mfa'); m.textContent = '';
  const { data: f } = await sb.auth.mfa.listFactors();
  const totp = (f?.totp || []).find((x) => x.status === 'verified');
  if (!totp) { m.className = 'msg err'; m.textContent = 'No hay un factor configurado.'; return; }
  const { error } = await sb.auth.mfa.challengeAndVerify({ factorId: totp.id, code: $('mfa-codigo').value.trim() });
  if (error) { m.className = 'msg err'; m.textContent = 'Código incorrecto. Probá de nuevo.'; $('mfa-codigo').value = ''; $('mfa-codigo').focus(); return; }
  await arrancar();
};

/* ---------- Arranque / control de acceso ---------- */
let estadoSeg = null;
async function arrancar() {
  const { data: { session } } = await sb.auth.getSession();
  if (!session) { $('login').classList.remove('oculto'); $('app').classList.add('oculto'); vista('paso-login'); return; }
  const { data: lvl } = await sb.auth.mfa.getAuthenticatorAssuranceLevel();
  if (lvl && lvl.nextLevel === 'aal2' && lvl.currentLevel !== 'aal2') { vista('paso-mfa'); $('login').classList.remove('oculto'); $('app').classList.add('oculto'); setTimeout(() => $('mfa-codigo').focus(), 50); return; }
  // refresco para que el JWT traiga aal2 si corresponde
  await sb.auth.refreshSession();
  estadoSeg = await rpc('adm_estado_seguridad');
  if (!estadoSeg.ok || !estadoSeg.es_admin_email) { await sb.auth.signOut(); vista('paso-denegado'); $('login').classList.remove('oculto'); return; }
  if (!estadoSeg.autorizado) {
    // es admin pero la MFA es obligatoria y no la tiene: solo puede entrar a Seguridad para enrolarse
    $('login').classList.add('oculto'); $('app').classList.remove('oculto');
    pintarYo(); location.hash = '#seguridad'; navegar(); toast('Activá tu segundo factor para operar el panel', true); return;
  }
  $('login').classList.add('oculto'); $('app').classList.remove('oculto');
  pintarYo(); navegar(); reiniciarIdle();
}
function pintarYo() {
  $('yo-mail').textContent = estadoSeg.email;
  const ok = estadoSeg.autorizado && estadoSeg.tiene_factor;
  $('yo-punto').className = 'punto' + (ok ? ' ok' : '');
  $('yo-estado').textContent = ok ? 'Sesión verificada con 2 factores' : (estadoSeg.autorizado ? 'Sin segundo factor' : 'Acceso limitado');
}
let arrancando = false;
sb.auth.onAuthStateChange((ev) => {
  if (ev === 'SIGNED_OUT') { $('app').classList.add('oculto'); $('login').classList.remove('oculto'); }
  if (ev === 'SIGNED_IN' && $('app').classList.contains('oculto') && !arrancando) { arrancando = true; arrancar().finally(() => arrancando = false); }
});

/* ---------- Cierre por inactividad ---------- */
let idleT; function reiniciarIdle() { clearTimeout(idleT); idleT = setTimeout(async () => { await sb.auth.signOut(); location.reload(); }, IDLE_MIN * 60e3); }
['click', 'keydown', 'mousemove', 'touchstart', 'scroll'].forEach((ev) => document.addEventListener(ev, () => { if (!$('app').classList.contains('oculto')) reiniciarIdle(); }, { passive: true }));

/* ---------- Navegación ---------- */
const SECCIONES = {
  inicio: { t: 'Inicio', b: 'Qué está pasando con el negocio hoy.', f: secInicio },
  suscripciones: { t: 'Suscripciones', b: 'Quién paga qué, cuándo se le cobra y qué le da acceso.', f: secSuscripciones },
  planes: { t: 'Planes y links de pago', b: 'Los tiers de Semilla y el link de cada uno para mandar por WhatsApp.', f: secPlanes },
  clientes: { t: 'Clientes', b: 'Proyectos con panel en la app.', f: secClientes },
  alumnos: { t: 'Alumnos', b: 'Personas en la Formación Semilla.', f: secAlumnos },
  leads: { t: 'Leads', b: 'Artistas que completaron la auditoría con IA.', f: secLeads },
  clases: { t: 'Clases', b: 'Subir y ordenar las clases de la Formación.', f: () => secPronto('Clases', ['Subir el video de cada clase a un servidor propio (sin logo ni descarga de YouTube).', 'Ordenar por módulo y pilar del Método: Modelo de negocio, Comunicación, Publicidad.', 'Elegir qué tier ve cada clase.', 'Reemplazar la clase anterior cuando la vuelta al sol avanza.']) },
  drops: { t: 'Drops', b: 'El newsletter semanal.', f: () => secPronto('Drops', ['Escribir y programar el drop de cada viernes.', 'Subir el audio para WhatsApp.', 'Ver quién lo abrió desde la app.']) },
  playbook: { t: 'Playbook', b: 'Las reglas del Método que usa la IA.', f: () => secPronto('Playbook', ['Revisar reglas candidatas que detecta la auditoría.', 'Promover, editar o descartar.', 'Por ahora sigue en el panel del playbook.']) },
  seguridad: { t: 'Seguridad', b: 'Quién puede entrar y cómo se verifica.', f: secSeguridad },
  auditoria: { t: 'Auditoría', b: 'Cada acción hecha desde este panel.', f: secAuditoria },
};
async function navegar() {
  const k = (location.hash || '#inicio').slice(1); const s = SECCIONES[k] || SECCIONES.inicio;
  document.querySelectorAll('nav a.item').forEach((a) => a.classList.toggle('on', a.dataset.sec === k));
  cerrarLateral(); $('titulo').textContent = s.t; $('bajada').textContent = s.b; $('acciones').innerHTML = ''; $('nav').classList.remove('abierta');
  $('contenido').innerHTML = '<div class="vacio">Cargando…</div>';
  try { await s.f(); } catch (e) { console.error(e); $('contenido').innerHTML = '<div class="vacio"><b>No se pudo cargar</b>' + esc(e.message || e) + '</div>'; }
}
window.addEventListener('hashchange', navegar);
$('menu-btn').onclick = () => $('nav').classList.toggle('abierta');
function noAut(r) { if (r && r.ok === false) { $('contenido').innerHTML = '<div class="vacio"><b>Sin permiso</b>' + esc(r.error || '') + '</div>'; return true; } return false; }

/* ---------- Inicio ---------- */
async function secInicio() {
  const r = await rpc('adm_resumen'); if (noAut(r)) return;
  const cobros = r.proximos_cobros || [];
  $('contenido').innerHTML = `
    <div class="cifras">
      <div class="cifra"><b>${ars(r.mrr_ars)}</b><span>por mes en suscripciones activas</span></div>
      <div class="cifra"><b>${r.subs_activas}</b><span>suscripciones activas · ${r.subs_cortesia} de cortesía</span></div>
      <div class="cifra"><b>${r.clientes_activos}</b><span>clientes con panel</span></div>
      <div class="cifra"><b>${r.alumnos_activos}<small style="font-size:14px;color:var(--mute)">/${r.alumnos}</small></b><span>alumnos con acceso</span></div>
      <div class="cifra ${r.pagos_rechazados_30d ? 'alerta' : ''}"><b>${r.pagos_rechazados_30d}</b><span>pagos rechazados en 30 días</span></div>
      <div class="cifra"><b>${r.leads_30d}</b><span>auditorías en 30 días</span></div>
    </div>
    <div class="bloque">
      <h2>Próximos cobros</h2><p>${r.cobros_7d} en los próximos siete días.</p>
      ${cobros.length ? '<div class="cinta">' + cobros.map((c) => { const d = dias(c.fecha); return `<div class="dia ${d != null && d <= 3 ? 'pronto' : ''}"><div class="f">${fecha(c.fecha)} · ${d === 0 ? 'hoy' : d === 1 ? 'mañana' : 'en ' + d + ' días'}</div><div class="n" title="${esc(c.nombre)}">${esc(c.nombre)}</div><div class="m">${ars(c.monto)}</div><div class="p">${esc(c.plan)}</div></div>`; }).join('') + '</div>' : '<div class="vacio">No hay cobros programados.</div>'}
    </div>
    ${r.webhooks_error ? `<div class="aviso vino">Hubo ${r.webhooks_error} avisos de Mercado Pago con error en la última semana. Revisalos en <a href="#auditoria">Auditoría</a>.</div>` : ''}
    <div class="grid2">
      <div class="bloque"><h2>Atajos</h2><p>Lo que más se usa.</p>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><a href="#planes"><button class="sec">Links de pago</button></a><a href="#suscripciones"><button class="sec">Dar una cortesía</button></a><a href="panel-clientes.html" target="_blank" rel="noopener"><button class="sec">Panel de clientes (viejo)</button></a><a href="panel-alumnos.html" target="_blank" rel="noopener"><button class="sec">Panel de alumnos (viejo)</button></a></div>
      </div>
      <div class="bloque"><h2>Estado del sistema</h2><p>Pagos, avisos y seguridad.</p>
        <dl class="lista-k"><dt>Mercado Pago</dt><dd>App «Semilla Pagos», credenciales de producción activas</dd><dt>Avisos de pago</dt><dd>${r.webhooks_error ? '<span class="chip rejected">con errores</span>' : '<span class="chip activa">funcionando</span>'}</dd><dt>Tu sesión</dt><dd>${estadoSeg.tiene_factor ? '<span class="chip activa">2 factores</span>' : '<span class="chip pendiente">sin segundo factor</span> <a href="#seguridad">activar</a>'}</dd></dl>
      </div>
    </div>`;
}

/* ---------- Suscripciones ---------- */
let SUBS = [], PLANES = [], CLIENTES = [], ALUMNOS = [];
async function cargarBase() {
  const [p, c, a] = await Promise.all([rpc('adm_planes'), rpc('adm_clientes'), rpc('adm_alumnos')]);
  PLANES = p.planes || []; CLIENTES = c.items || []; ALUMNOS = a.items || [];
}
async function secSuscripciones() {
  const r = await rpc('adm_suscripciones'); if (noAut(r)) return; await cargarBase();
  SUBS = r.items || [];
  $('acciones').innerHTML = '<button id="btn-nueva">Nueva suscripción</button><button class="sec" id="btn-mp">Ver suscripciones en Mercado Pago</button>';
  $('btn-nueva').onclick = formNuevaSub; $('btn-mp').onclick = verMP;
  $('contenido').innerHTML = `
    <div class="filtros"><input id="f-q" placeholder="Buscar por nombre o plan"><select id="f-e"><option value="">Todos los estados</option><option value="activa">Activas</option><option value="pendiente">Pendientes</option><option value="cancelada">Canceladas</option><option value="cortesia">Cortesías</option></select><span class="cnt" id="f-cnt"></span></div>
    <div class="bloque" style="padding:0;overflow:auto"><table><thead><tr><th>Quién</th><th>Plan</th><th class="num">Monto</th><th>Estado</th><th>Próximo cobro</th><th>Último pago</th></tr></thead><tbody id="t-subs"></tbody></table></div>`;
  const pintar = () => {
    const q = $('f-q').value.toLowerCase(), e = $('f-e').value;
    const L = SUBS.filter((s) => (!q || (s.quien.nombre + ' ' + s.plan.nombre + ' ' + (s.email_pagador || '')).toLowerCase().includes(q)) && (!e || (e === 'cortesia' ? s.cortesia : s.estado === e)));
    $('f-cnt').textContent = L.length + ' de ' + SUBS.length;
    $('t-subs').innerHTML = L.length ? L.map((s) => `<tr class="click" data-id="${s.id}"><td><b>${esc(s.quien.nombre)}</b><div style="font-size:12px;color:var(--mute)">${esc(s.quien.tipo)}${s.email_pagador ? ' · ' + esc(s.email_pagador) : ''}</div></td><td>${esc(s.plan.nombre)}${s.cortesia ? ' <span class="chip cortesia">cortesía</span>' : ''}</td><td class="num">${s.cortesia ? '—' : ars(s.monto)}</td><td><span class="chip ${esc(s.estado)}">${esc(s.estado)}</span></td><td>${s.cortesia ? '—' : fecha(s.proximo_cobro)}</td><td>${s.ultimo_pago_estado ? `<span class="chip ${esc(s.ultimo_pago_estado)}">${esc(s.ultimo_pago_estado)}</span> ${fecha(s.ultimo_pago_en)}` : '—'}</td></tr>`).join('') : '<tr><td colspan="6"><div class="vacio"><b>Nada por acá</b>Probá con otro filtro.</div></td></tr>';
    document.querySelectorAll('#t-subs tr.click').forEach((tr) => tr.onclick = () => detalleSub(tr.dataset.id));
  };
  $('f-q').oninput = pintar; $('f-e').onchange = pintar; pintar();
}
function opcionesPlanes(sel) { return PLANES.map((p) => `<option value="${esc(p.codigo)}" ${p.codigo === sel ? 'selected' : ''}>${esc(p.nombre)} · ${ars(p.monto)}</option>`).join(''); }
function detalleSub(id) {
  const s = SUBS.find((x) => x.id === id); if (!s) return;
  abrirLateral(`
    <h2>${esc(s.quien.nombre)}</h2><p style="color:var(--mute);margin:2px 0 14px">${esc(s.quien.tipo)} · <span class="chip ${esc(s.estado)}">${esc(s.estado)}</span> ${s.cortesia ? '<span class="chip cortesia">cortesía</span>' : ''}</p>
    <dl class="lista-k"><dt>Plan</dt><dd>${esc(s.plan.nombre)}</dd><dt>Monto</dt><dd>${s.cortesia ? 'sin cobro' : ars(s.monto) + ' por mes'}</dd><dt>Próximo cobro</dt><dd>${s.cortesia ? '—' : fecha(s.proximo_cobro)}</dd><dt>Desde</dt><dd>${fecha(s.inicio)}</dd><dt>Paga con</dt><dd>${s.mp_preapproval_id ? 'Mercado Pago <span class="copiar"><span>' + esc(s.mp_preapproval_id) + '</span></span>' : (s.cortesia ? 'nadie, es cortesía' : 'todavía no vinculado')}</dd>${s.notas ? '<dt>Notas</dt><dd>' + esc(s.notas) + '</dd>' : ''}</dl>
    <div class="sep"></div>
    <h3>Cambiar de plan</h3><p style="color:var(--mute);margin:4px 0 10px">Si paga por Mercado Pago, el monto se actualiza allá en el próximo cobro.</p>
    <div class="campo"><select id="d-plan">${opcionesPlanes(s.plan.codigo)}</select></div>
    <div class="campo"><input id="d-motivo" placeholder="Motivo (opcional): bajó de mentoría, upsell, etc."></div>
    <button id="d-cambiar">Cambiar plan</button>
    <div class="sep"></div>
    <h3>Cortesía</h3><p style="color:var(--mute);margin:4px 0 10px">Acceso sin cobro. Mercado Pago no se toca.</p>
    <label class="chk"><input type="checkbox" id="d-cort" ${s.cortesia ? 'checked' : ''}> Es cortesía</label>
    <div class="campo" style="margin-top:10px"><label>Hasta (vacío = sin vencimiento)</label><input type="date" id="d-cort-hasta" value="${s.cortesia_hasta || ''}"></div>
    <button class="ok" id="d-cort-guardar">Guardar cortesía</button>
    <div class="sep"></div>
    <h3>Pagos recientes</h3>
    ${s.pagos.length ? '<table>' + s.pagos.map((p) => `<tr><td>${fecha(p.fecha)}</td><td class="num">${ars(p.monto)}</td><td><span class="chip ${esc(p.estado)}">${esc(p.estado)}</span></td></tr>`).join('') + '</table>' : '<p style="color:var(--mute)">Todavía no llegó ningún pago por el sistema nuevo.</p>'}
    ${s.cambios.length ? '<div class="sep"></div><h3>Historial de plan</h3><table>' + s.cambios.map((c) => `<tr><td>${fecha(c.cuando)}</td><td>${esc(c.de || '—')} → ${esc(c.a)}</td><td style="color:var(--mute)">${esc(c.motivo || '')}</td></tr>`).join('') + '</table>' : ''}
    <div class="sep"></div>
    ${s.estado !== 'cancelada' ? '<button class="peligro" id="d-cancelar">Cancelar suscripción</button>' : ''}`);
  $('d-cambiar').onclick = async () => {
    const plan = $('d-plan').value; if (plan === s.plan.codigo) return toast('Ya tiene ese plan');
    if (!confirm('¿Cambiar a ' + plan + '?')) return;
    $('d-cambiar').disabled = true;
    const r = await mp('change_plan', { suscripcion_id: s.id, plan_codigo: plan, motivo: $('d-motivo').value.trim() || null });
    if (r.error) { toast(r.error, true); $('d-cambiar').disabled = false; return; }
    toast('Plan cambiado'); cerrarLateral(); navegar();
  };
  $('d-cort-guardar').onclick = async () => {
    const r = await rpc('adm_suscripcion_set', { p_id: s.id, p_cortesia: $('d-cort').checked, p_cortesia_hasta: $('d-cort-hasta').value || null, p_estado: $('d-cort').checked ? 'activa' : null });
    if (!r.ok) return toast(r.error, true); toast('Cortesía guardada'); cerrarLateral(); navegar();
  };
  if ($('d-cancelar')) $('d-cancelar').onclick = async () => {
    if (!confirm('Se cancela en Mercado Pago y pierde el acceso. ¿Seguro?')) return;
    const r = await mp('cancel', { suscripcion_id: s.id }); if (r.error) return toast(r.error, true); toast('Cancelada'); cerrarLateral(); navegar();
  };
}
function formNuevaSub() {
  abrirLateral(`
    <h2>Nueva suscripción</h2><p style="color:var(--mute);margin:2px 0 14px">Para dar acceso a mano. Si va a pagar, mandale el link del plan y se vincula sola cuando pague.</p>
    <div class="campo"><label>Plan</label><select id="n-plan">${opcionesPlanes('pro')}</select></div>
    <div class="campo"><label>Cliente</label><select id="n-cli"><option value="">—</option>${CLIENTES.map((c) => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}</select></div>
    <div class="campo"><label>o alumno</label><select id="n-alu"><option value="">—</option>${ALUMNOS.map((a) => `<option value="${a.id}">${esc(a.nombre)}</option>`).join('')}</select></div>
    <label class="chk"><input type="checkbox" id="n-cort" checked> Es cortesía (sin cobro)</label>
    <div class="campo" style="margin-top:10px"><label>Notas</label><input id="n-notas"></div>
    <button id="n-crear">Crear</button>`);
  $('n-crear').onclick = async () => {
    const cli = $('n-cli').value || null, alu = $('n-alu').value || null;
    if (!cli && !alu) return toast('Elegí un cliente o un alumno', true);
    const r = await rpc('adm_suscripcion_alta', { p_plan_codigo: $('n-plan').value, p_cliente_id: cli, p_alumno_id: alu, p_cortesia: $('n-cort').checked, p_notas: $('n-notas').value.trim() || null });
    if (!r.ok) return toast(r.error, true); toast('Creada'); cerrarLateral(); navegar();
  };
}
async function verMP() {
  abrirLateral('<h2>Suscripciones en Mercado Pago</h2><p style="color:var(--mute)">Cargando desde Mercado Pago…</p>');
  const r = await mp('list_preapprovals', { status: 'authorized', limit: 100 });
  if (r.error) return abrirLateral('<h2>Mercado Pago</h2><div class="aviso vino">' + esc(r.error) + '</div>');
  const vinculadas = new Set(SUBS.map((s) => s.mp_preapproval_id).filter(Boolean));
  abrirLateral(`<h2>Suscripciones en Mercado Pago</h2><p style="color:var(--mute);margin:2px 0 14px">${r.total} activas. Las que no están vinculadas se pueden asignar a un cliente o alumno.</p>
    <table>${(r.results || []).map((p) => `<tr><td><b>${esc(p.reason)}</b><div style="font-size:12px;color:var(--mute)">${esc(p.payer_email || p.id.slice(0, 8))} · próximo ${fecha(p.proximo_cobro)}</div></td><td class="num">${ars(p.monto)}</td><td>${vinculadas.has(p.id) ? '<span class="chip activa">vinculada</span>' : `<button class="lnk" data-link="${p.id}" data-monto="${p.monto}">Vincular</button>`}</td></tr>`).join('')}</table>`);
  document.querySelectorAll('[data-link]').forEach((b) => b.onclick = () => formVincular(b.dataset.link, Number(b.dataset.monto)));
}
function formVincular(preId, monto) {
  const sug = PLANES.filter((p) => Number(p.monto) === monto).map((p) => p.codigo)[0] || 'pro';
  abrirLateral(`<h2>Vincular suscripción</h2><p style="color:var(--mute);margin:2px 0 14px">Elegí a quién pertenece. Se crea la suscripción en la app y se conecta con Mercado Pago.</p>
    <div class="campo"><label>Plan</label><select id="v-plan">${opcionesPlanes(sug)}</select></div>
    <div class="campo"><label>Cliente</label><select id="v-cli"><option value="">—</option>${CLIENTES.map((c) => `<option value="${c.id}">${esc(c.nombre)}</option>`).join('')}</select></div>
    <div class="campo"><label>o alumno</label><select id="v-alu"><option value="">—</option>${ALUMNOS.map((a) => `<option value="${a.id}">${esc(a.nombre)}</option>`).join('')}</select></div>
    <button id="v-ok">Vincular</button>`);
  $('v-ok').onclick = async () => {
    const cli = $('v-cli').value || null, alu = $('v-alu').value || null; if (!cli && !alu) return toast('Elegí un cliente o un alumno', true);
    const a = await rpc('adm_suscripcion_alta', { p_plan_codigo: $('v-plan').value, p_cliente_id: cli, p_alumno_id: alu, p_cortesia: false, p_notas: 'Vinculada desde el panel' });
    if (!a.ok) return toast(a.error, true);
    const l = await mp('link', { suscripcion_id: a.id, preapproval_id: preId }); if (l.error) return toast(l.error, true);
    toast('Vinculada'); cerrarLateral(); navegar();
  };
}

/* ---------- Planes ---------- */
async function secPlanes() {
  const r = await rpc('adm_planes'); if (noAut(r)) return; PLANES = r.planes || [];
  $('acciones').innerHTML = '<button class="sec" id="btn-sync">Actualizar en Mercado Pago</button>';
  $('btn-sync').onclick = async () => { $('btn-sync').disabled = true; const x = await mp('sync_plans'); if (x.error) toast(x.error, true); else toast('Planes actualizados en Mercado Pago'); navegar(); };
  $('contenido').innerHTML = '<div class="aviso">Si cambiás un monto, tocá «Actualizar en Mercado Pago» para que el link cobre el nuevo valor. Las suscripciones ya activas no cambian solas.</div>' + PLANES.map((p) => `
    <div class="bloque" data-plan="${p.id}">
      <div style="display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;align-items:flex-start">
        <div style="flex:1;min-width:240px"><h2>${esc(p.nombre)} ${p.activo ? '' : '<span class="chip">inactivo</span>'}</h2><p>${esc(p.descripcion || '')} · ${p.suscriptos} suscripto${p.suscriptos === 1 ? '' : 's'}</p>
          ${p.link ? `<div class="copiar"><span>${esc(p.link)}</span><button class="lnk" data-copy="${esc(p.link)}">Copiar</button></div>` : '<span class="chip">gratis, sin link</span>'}</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;min-width:280px"><div><label>Nombre</label><input data-f="nombre" value="${esc(p.nombre)}"></div><div><label>Monto ARS</label><input data-f="monto" type="number" value="${p.monto}"></div><div style="grid-column:1/-1"><label>Descripción</label><input data-f="descripcion" value="${esc(p.descripcion || '')}"></div><label class="chk"><input type="checkbox" data-f="activo" ${p.activo ? 'checked' : ''}> Activo</label><button data-save="${p.id}" class="sec">Guardar</button></div>
      </div>
    </div>`).join('');
  document.querySelectorAll('[data-copy]').forEach((b) => b.onclick = () => navigator.clipboard.writeText(b.dataset.copy).then(() => toast('Link copiado')));
  document.querySelectorAll('[data-save]').forEach((b) => b.onclick = async () => {
    const w = b.closest('[data-plan]'); const g = (f) => w.querySelector(`[data-f="${f}"]`);
    const r = await rpc('adm_plan_set', { p_id: b.dataset.save, p_nombre: g('nombre').value.trim(), p_descripcion: g('descripcion').value.trim(), p_monto: Number(g('monto').value), p_activo: g('activo').checked });
    if (!r.ok) return toast(r.error, true); toast('Guardado'); navegar();
  });
}

/* ---------- Clientes / Alumnos / Leads ---------- */
async function secClientes() {
  const r = await rpc('adm_clientes'); if (noAut(r)) return; const L = r.items || [];
  $('acciones').innerHTML = '<a href="panel-clientes.html" target="_blank" rel="noopener"><button class="sec">Abrir panel de clientes</button></a>';
  $('contenido').innerHTML = `<div class="filtros"><input id="c-q" placeholder="Buscar"><span class="cnt">${L.filter((c) => c.activo && !c.interno).length} activos</span></div>
    <div class="bloque" style="padding:0;overflow:auto"><table><thead><tr><th>Proyecto</th><th>Tipo</th><th>Plan</th><th>Conexiones</th><th>Último reporte</th><th></th></tr></thead><tbody id="t-cli"></tbody></table></div>`;
  const pintar = () => { const q = $('c-q').value.toLowerCase(); $('t-cli').innerHTML = L.filter((c) => !q || c.nombre.toLowerCase().includes(q)).map((c) => `<tr><td><b>${esc(c.nombre)}</b>${c.interno ? ' <span class="chip">interno</span>' : ''}${!c.activo ? ' <span class="chip cancelada">inactivo</span>' : ''}<div style="font-size:12px;color:var(--mute)">${esc(c.instagram || '')}</div></td><td>${esc(c.tipo || '')}</td><td>${c.plan ? esc(c.plan) : '<span style="color:var(--mute)">—</span>'}</td><td>${c.conexiones}</td><td>${fecha(c.ultimo_reporte)}</td><td style="color:var(--mute);font-size:12px">${esc(c.slug)}</td></tr>`).join(''); };
  $('c-q').oninput = pintar; pintar();
}
async function secAlumnos() {
  const r = await rpc('adm_alumnos'); if (noAut(r)) return; const L = r.items || [];
  $('acciones').innerHTML = '<a href="panel-alumnos.html" target="_blank" rel="noopener"><button class="sec">Abrir panel de alumnos</button></a>';
  $('contenido').innerHTML = `<div class="aviso">Los alumnos todavía pagan por Tiendup. Cuando pasemos la Formación al sistema nuevo, acá se vinculan sus suscripciones de Mercado Pago.</div>
    <div class="bloque" style="padding:0;overflow:auto"><table><thead><tr><th>Alumno</th><th>Proyecto</th><th>Acceso</th><th>Vence</th><th>Plan nuevo</th></tr></thead><tbody>${L.map((a) => `<tr><td><b>${esc(a.nombre)}</b><div style="font-size:12px;color:var(--mute)">${esc(a.email || '')}</div></td><td>${esc(a.proyecto || '')}</td><td>${a.activa ? '<span class="chip activa">activo</span>' : '<span class="chip cancelada">sin acceso</span>'}</td><td>${fecha(a.vence_en)}</td><td>${a.plan ? esc(a.plan) : '—'}</td></tr>`).join('') || '<tr><td colspan="5"><div class="vacio">Sin alumnos cargados.</div></td></tr>'}</tbody></table></div>`;
}
async function secLeads() {
  const r = await rpc('adm_leads', { p_limit: 200 }); if (noAut(r)) return; const L = r.items || [];
  $('contenido').innerHTML = `<div class="bloque" style="padding:0;overflow:auto"><table><thead><tr><th>Fecha</th><th>Proyecto</th><th>Tipo</th><th>Instagram</th><th>Contacto</th><th>Prioridad</th></tr></thead><tbody>${L.map((l) => `<tr><td>${fecha(l.created_at)}</td><td><b>${esc(l.proyecto || '—')}</b></td><td>${esc(l.tipo || '')}</td><td>${l.instagram ? esc(l.instagram) + (l.ig_seguidores ? ' <span style="color:var(--mute)">' + Number(l.ig_seguidores).toLocaleString('es-AR') + '</span>' : '') : ''}</td><td style="font-size:12.5px">${esc(l.email || '')}${l.whatsapp ? '<br>' + esc(l.whatsapp) : ''}</td><td>${l.prioridad_contacto ? '<span class="chip">' + esc(l.prioridad_contacto) + '</span>' : ''}</td></tr>`).join('') || '<tr><td colspan="6"><div class="vacio">Todavía no hay auditorías.</div></td></tr>'}</tbody></table></div>`;
}
function secPronto(nombre, items) {
  $('contenido').innerHTML = `<div class="bloque pronto-bloque"><h2>${esc(nombre)} llega en la próxima etapa</h2><p>Lo que va a poder hacerse acá:</p><ul>${items.map((i) => '<li>' + esc(i) + '</li>').join('')}</ul></div>`;
}

/* ---------- Seguridad ---------- */
async function secSeguridad() {
  estadoSeg = await rpc('adm_estado_seguridad'); const s = estadoSeg; pintarYo();
  const { data: f } = await sb.auth.mfa.listFactors(); const factores = (f?.totp || []).filter((x) => x.status === 'verified');
  $('contenido').innerHTML = `
    <div class="grid2">
      <div class="bloque">
        <h2>Segundo factor</h2><p>Un código de seis dígitos de tu app de autenticación (Google Authenticator, 1Password, Authy) cada vez que entrás.</p>
        ${factores.length ? `<div class="aviso ok">Activo en esta cuenta desde ${fecha(factores[0].created_at)}.</div><button class="peligro" id="s-quitar">Quitar segundo factor</button>` : `<div class="aviso">Tu cuenta entra solo con Google. Activá el segundo factor para que nadie pueda operar el panel aunque consiga tu sesión.</div><button id="s-enrolar">Activar segundo factor</button><div id="s-enrol"></div>`}
      </div>
      <div class="bloque">
        <h2>Exigir segundo factor a todos</h2><p>Cuando está encendido, ningún administrador puede operar sin segundo factor, aunque esté logueado.</p>
        <label class="chk"><input type="checkbox" id="s-oblig" ${s.mfa_obligatoria ? 'checked' : ''} ${!s.tiene_factor ? 'disabled' : ''}> Obligatorio</label>
        ${!s.tiene_factor ? '<p style="color:var(--mute);font-size:12.5px;margin:8px 0 0">Activá primero el tuyo.</p>' : ''}
      </div>
    </div>
    <div class="bloque"><h2>Administradores</h2><p>Solo estas cuentas pueden entrar. Para sumar o sacar una, pedíselo al equipo técnico.</p>
      ${(s.admins || []).map((a) => `<div style="padding:6px 0;border-bottom:1px solid var(--linea)">${esc(a)}${a === s.email ? ' <span class="chip activa">sos vos</span>' : ''}</div>`).join('')}</div>
    <div class="bloque"><h2>Cómo está protegido el panel</h2>
      <dl class="lista-k"><dt>Ingreso</dt><dd>Google o enlace al mail; sin contraseñas compartidas.</dd><dt>Permisos</dt><dd>Cada operación se verifica en la base de datos, no en el navegador.</dd><dt>Registro</dt><dd>Cada acción queda en <a href="#auditoria">Auditoría</a> con quién y cuándo.</dd><dt>Sesión</dt><dd>Se cierra sola a los ${IDLE_MIN} minutos sin actividad.</dd><dt>Claves</dt><dd>Las de Mercado Pago y la base viven en el servidor; esta página no las tiene.</dd></dl></div>`;
  if ($('s-oblig')) $('s-oblig').onchange = async () => { const r = await rpc('adm_set_mfa_obligatoria', { p_on: $('s-oblig').checked }); if (!r.ok) { toast(r.error, true); $('s-oblig').checked = !$('s-oblig').checked; } else toast(r.mfa_obligatoria ? 'Segundo factor obligatorio para todos' : 'Ya no es obligatorio'); };
  if ($('s-enrolar')) $('s-enrolar').onclick = enrolar;
  if ($('s-quitar')) $('s-quitar').onclick = async () => {
    if (!confirm('Vas a quitar el segundo factor. El panel queda protegido solo por tu Google. ¿Seguro?')) return;
    const { error } = await sb.auth.mfa.unenroll({ factorId: factores[0].id }); if (error) return toast(error.message, true);
    await rpc('adm_audit', { p_accion: 'mfa_quitar' }); toast('Segundo factor quitado'); await sb.auth.refreshSession(); navegar();
  };
}
async function enrolar() {
  $('s-enrolar').disabled = true;
  const { data, error } = await sb.auth.mfa.enroll({ factorType: 'totp', friendlyName: 'Panel Semilla' });
  if (error) { toast(error.message, true); $('s-enrolar').disabled = false; return; }
  $('s-enrol').innerHTML = `<div class="sep"></div><p>Escaneá este código con tu app de autenticación y escribí el código que te muestra.</p><img class="qr" src="${data.totp.qr_code}" alt="Código QR"><p class="secreto">Si no podés escanear, cargá esta clave a mano: ${esc(data.totp.secret)}</p>
    <div class="campo" style="max-width:220px"><input class="codigo" id="e-codigo" inputmode="numeric" maxlength="6" placeholder="······"></div><button class="ok" id="e-ok">Confirmar</button> <button class="lnk" id="e-cancel">Cancelar</button>`;
  $('e-codigo').focus();
  $('e-cancel').onclick = async () => { await sb.auth.mfa.unenroll({ factorId: data.id }); navegar(); };
  $('e-ok').onclick = async () => {
    const { error: e2 } = await sb.auth.mfa.challengeAndVerify({ factorId: data.id, code: $('e-codigo').value.trim() });
    if (e2) return toast('Código incorrecto, probá de nuevo', true);
    await sb.auth.refreshSession(); await rpc('adm_audit', { p_accion: 'mfa_activar' });
    toast('Segundo factor activo'); estadoSeg = await rpc('adm_estado_seguridad'); pintarYo(); navegar();
  };
}

/* ---------- Auditoría ---------- */
async function secAuditoria() {
  const [a, w] = await Promise.all([rpc('adm_auditoria', { p_limit: 200 }), rpc('adm_webhooks', { p_limit: 50 })]); if (noAut(a)) return;
  $('contenido').innerHTML = `<div class="grid2">
    <div class="bloque" style="padding:0;overflow:auto"><div style="padding:16px 18px 6px"><h2>Acciones</h2><p>Lo último que se hizo desde el panel.</p></div><table><thead><tr><th>Cuándo</th><th>Quién</th><th>Acción</th><th></th></tr></thead><tbody>${(a.items || []).map((i) => `<tr><td style="white-space:nowrap">${fecha(i.cuando, true)}</td><td style="font-size:12.5px">${esc((i.usuario || '').split('@')[0])}</td><td>${esc(i.accion)}<div style="font-size:11.5px;color:var(--mute);max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${esc(JSON.stringify(i.detalle || ''))}">${esc(JSON.stringify(i.detalle || ''))}</div></td><td>${i.ok ? '' : '<span class="chip rejected">error</span>'}</td></tr>`).join('') || '<tr><td colspan="4"><div class="vacio">Sin acciones todavía.</div></td></tr>'}</tbody></table></div>
    <div class="bloque" style="padding:0;overflow:auto"><div style="padding:16px 18px 6px"><h2>Avisos de Mercado Pago</h2><p>Cada notificación que llegó y si se procesó.</p></div><table><thead><tr><th>Cuándo</th><th>Tipo</th><th>Estado</th></tr></thead><tbody>${(w.items || []).map((i) => `<tr><td style="white-space:nowrap">${fecha(i.recibido_en, true)}</td><td>${esc(i.tipo || '')}${i.accion ? ' <span style="color:var(--mute)">' + esc(i.accion) + '</span>' : ''}</td><td>${i.error ? '<span class="chip rejected" title="' + esc(i.error) + '">error</span>' : i.procesado ? '<span class="chip activa">ok</span>' : '<span class="chip">ignorado</span>'}</td></tr>`).join('') || '<tr><td colspan="3"><div class="vacio">Todavía no llegó ningún aviso.</div></td></tr>'}</tbody></table></div>
  </div>`;
}

arrancar();
