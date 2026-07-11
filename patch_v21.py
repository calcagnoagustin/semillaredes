"""Patch v2.1 — Dashboard: alertas + historiales completos con PnL + sin cerradas.
Correr EN LA VM: python3 /tmp/patch_v21.py  (idempotente; hace AST check antes de escribir)."""
import ast
import re
import sys
import urllib.request

sys.path.insert(0, '/home/opc/bot_semillas')

# ============ 1) dashboard.py ============
P = '/home/opc/bot_semillas/dashboard.py'
src = open(P).read()
orig = src

FN = '''def _alertas(state, free_usdt):
    out = []
    try:
        import os as _o
        buf = float(_o.getenv("LIQUIDITY_BUFFER_USDT", 15))
        if free_usdt is not None and free_usdt < buf:
            out.append({"nivel": "rojo", "texto": "Liquidez baja: $%.2f USDT libres (colchon $%.0f). Considerar depositar." % (free_usdt, buf)})
        gp = state.get("garden_plan") or {}
        done = set(gp.get("done", []))
        for v in gp.get("verdicts", []):
            s = v.get("symbol"); vd = (v.get("verdict") or "").lower()
            if not s or s in done:
                continue
            if vd == "reforzar":
                out.append({"nivel": "amarillo", "texto": "DCA del mes: reforzar %s con $%s USDT - %s (esperando timing Stage 2)" % (s, v.get("dca_usdt", "?"), str(v.get("razon", ""))[:90])})
            elif vd in ("liquidar", "dust"):
                pos = (state.get("positions") or {}).get(s) or {}
                if pos.get("qty", 0) > 0 and pos.get("status") not in ("stopped_moonbag", "frozen"):
                    out.append({"nivel": "amarillo", "texto": "El cerebro recomienda cerrar %s: %s (decision tuya)" % (s, str(v.get("razon", ""))[:90])})
        for s in gp.get("warned", []):
            out.append({"nivel": "rojo", "texto": "DCA de %s no ejecutado (presupuesto o timing). Revisar liquidez." % s})
    except Exception:
        pass
    return out[:10]

def _ops_history(state, n=1000):
    """Historial completo: ledger (toda ejecucion) enriquecido con PnL real de las ventas."""
    rows = _ops_from_ledger(n)
    closed = state.get("recent_closed", []) or []
    for r in rows:
        if str(r.get("action", "")).upper() not in ("STOP", "TAKE_PROFIT", "FREEZE", "GARDEN_LIQ", "RUNNER_TP", "RUNNER_TRAIL"):
            continue
        for c in closed:
            try:
                if c.get("symbol") == r.get("symbol") and abs(float(c.get("closed_ts") or 0) - float(r.get("closed_ts") or 0)) < 300:
                    r["pnl_net"] = c.get("pnl_net", 0)
                    r["entry"] = c.get("entry", r.get("entry"))
                    r["exit"] = c.get("exit", r.get("exit"))
                    break
            except Exception:
                pass
    seen = set()
    for r in rows:
        try:
            seen.add((int(float(r.get("closed_ts") or 0)), r.get("symbol")))
        except Exception:
            pass
    for c in closed:
        try:
            key = (int(float(c.get("closed_ts") or 0)), c.get("symbol"))
        except Exception:
            continue
        if key not in seen and c.get("action") == "manual":
            rows.append({"symbol": c.get("symbol"), "action": "MANUAL",
                         "entry": c.get("entry", 0), "exit": c.get("exit", 0),
                         "qty_total": c.get("qty_total", 0),
                         "pnl_net": c.get("pnl_net", 0),
                         "closed_ts": c.get("closed_ts", 0)})
    rows.sort(key=lambda r: r.get("closed_ts") or 0)
    return rows

def build_payload():'''

if '_alertas' not in src:
    assert 'def build_payload():' in src
    src = src.replace('def build_payload():', FN, 1)
if '"alertas":' not in src:
    k = '"loop_recs": _load_recs(),'
    assert k in src
    src = src.replace(k, k + '\n        "alertas": _alertas(state, _free_usdt),', 1)
if '_ops_history(state)' not in src:
    assert '_ops_from_ledger(),' in src
    src = src.replace('_ops_from_ledger(),', '_ops_history(state),', 1)
src = src.replace('f.readlines()[-200:]', 'f.readlines()[-2000:]', 1)
if 'not in ("closed", "frozen")' not in src:
    src2 = re.sub(r'"positions":(\s+)positions,',
                  r'"positions":\1[q for q in positions if q.get("status") not in ("closed", "frozen")],',
                  src, count=1)
    assert src2 != src, 'filtro positions no aplicado'
    src = src2
ast.parse(src)
if src != orig:
    open(P, 'w').write(src)
print('dashboard.py v2.1 OK')

# ============ 2) ejecutor_dash.py ============
P2 = '/home/opc/bot_semillas/ejecutor_dash.py'
s2 = open(P2).read()
if 'closed[-40:]' in s2:
    s2 = s2.replace('"recent_closed": closed[-40:]}', '"recent_closed": closed}', 1)
    ast.parse(s2)
    open(P2, 'w').write(s2)
print('ejecutor_dash.py v2.1 OK')

# ============ 3) index.html (repo radar via gh_put) ============
import dashboard  # carga .env -> REPO radar + gh_put
s = urllib.request.urlopen(
    'https://raw.githubusercontent.com/calcagnoagustin/radar/main/docs/index.html').read().decode()
if 'alertCard' not in s:
    s = s.replace('paginateHist("sHistory",8)', 'paginateHist("sHistory",4)', 1)
    s = s.replace('paginateHist("gHistory",8)', 'paginateHist("gHistory",4)', 1)
    s = s.replace('const ordered=[...open,...closed];', 'const ordered=[...open];', 1)
    s = s.replace('document.getElementById("posCount").textContent = (DATA.positions||[]).length+" total";',
                  'document.getElementById("posCount").textContent = open.length+" abiertas";', 1)
    card = ('<div class="card" id="alertCard" style="margin-bottom:18px">'
            '<div class="head"><span class="title">Alertas</span>'
            '<span class="eyebrow" id="alertCount"></span></div>'
            '<div class="body" id="alertas"><div class="row">'
            '<span class="lbl">Cargando…</span></div></div></div>\n\n')
    i = s.index('<div class="cols">')
    s = s[:i] + card + s[i:]
    js = '''
// alertas
const AL=(DATA.alertas||[]);const acEl=document.getElementById("alertas");const acC=document.getElementById("alertCount");
if(acEl){acEl.innerHTML="";if(acC)acC.textContent=AL.length?AL.length+" activa"+(AL.length>1?"s":""):"";
if(!AL.length)acEl.innerHTML='<div class="row"><span class="lbl">Sin alertas. Todo en orden.</span></div>';
AL.forEach(function(a){var colors={rojo:"var(--clay)",amarillo:"var(--grain)",info:"var(--sky)"};var el=document.createElement("div");el.className="row";el.innerHTML='<span style="color:'+(colors[a.nivel]||"var(--muted)")+';font-size:13.5px">'+(a.nivel==="rojo"?"\\u26a0 ":"")+a.texto+"</span>";acEl.appendChild(el);});}
'''
    a = '// bot diario'
    assert a in s
    s = s.replace(a, js + a, 1)
    dashboard.gh_put('docs/index.html', s.encode(), 'dashboard v2.1: alertas + historiales completos')
    print('index.html v2.1 publicado OK')
else:
    print('index.html ya estaba en v2.1')

# ============ 4) republicar datos con proceso fresco ============
import subprocess
VPY = '/home/opc/bot_semillas/venv/bin/python'
r1 = subprocess.run([VPY, '-c',
    'import sys;sys.path.insert(0,"/home/opc/bot_semillas");import os;os.chdir("/home/opc/bot_semillas");'
    'import dashboard;dashboard.update()'], capture_output=True, text=True)
print('update:', (r1.stdout + r1.stderr).strip()[-160:])
r2 = subprocess.run([VPY, '/home/opc/bot_semillas/ejecutor_dash.py'],
                    cwd='/home/opc/bot_semillas', capture_output=True, text=True)
print('ejecutor_dash:', (r2.stdout + r2.stderr).strip()[-160:])
print('PATCH v2.1 COMPLETO')
