"""
dashboard.py — Publica el estado del Sistema Semillas 2.0 a GitHub Pages.

- Lee state.json (fuente de verdad), arma un payload publico (sin secretos)
  y lo sube como docs/dashboard_data.json al repo via GitHub Contents API.
- `--deploy` ademas sube docs/index.html (la cascara estatica, una sola vez).
- update() se llama al final de main.py; cualquier error se traga para no
  afectar nunca la corrida del bot.

Requiere en .env:  GITHUB_TOKEN   (fine-grained PAT, Contents: R/W sobre el repo)
Opcionales:        GITHUB_REPO=calcagnoagustin/semillaredes
                   GITHUB_BRANCH=main
                   CAPITAL_INICIAL=100
"""
import os, json, base64, datetime, pathlib

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

import requests

HERE      = pathlib.Path(__file__).resolve().parent
STATE_PATH= HERE / "state.json"
### <redactado: posible secreto> ###
BRANCH    = os.getenv("GITHUB_BRANCH", "main")
TOKEN     = os.getenv("GITHUB_TOKEN", "")
CAPITAL   = float(os.getenv("CAPITAL_INICIAL", "100"))
API       = "https://api.github.com"

# Orden de prioridad para mostrar estados (abiertas primero, cerradas al final)
def _binance(sym): return sym.replace("/", "").upper()


def _rules():
    r = {"freeze_days": 60, "max_seeds": 3, "seed_size_usdt": 7}
    try:
        import config
        r["freeze_days"]    = getattr(config, "FREEZE_DAYS", r["freeze_days"])
        r["max_seeds"]      = getattr(config, "MAX_SEEDS", r["max_seeds"])
        r["seed_size_usdt"] = getattr(config, "SEED_SIZE_USDT", r["seed_size_usdt"])
    except Exception:
        pass
    return r


BRAIN_LOG = HERE / "learning" / "brain_log.jsonl"
def _brain_hist(state):
    try:
        hist=[json.loads(l) for l in BRAIN_LOG.read_text().splitlines() if l.strip()]
    except Exception:
        hist=[]
    lbr=state.get("last_brain_run")
    if lbr and (not hist or hist[-1].get("date")!=lbr):
        hist.append({"date": lbr, "narrativa": state.get("narrativa_active"),
                     "shortlist": state.get("shortlist", []),
                     "regimen": state.get("regimen")})
        try:
            BRAIN_LOG.parent.mkdir(exist_ok=True)
            BRAIN_LOG.write_text("\n".join(json.dumps(h) for h in hist)+"\n")
        except Exception:
            pass
    return hist[-12:]

def _load_recs():
    try:
        r=json.loads((HERE/"learning"/"recommendations.json").read_text())
        return {"generated": r.get("generated"), "ranking": r.get("ranking", [])}
    except Exception:
        return None


def _ops_from_ledger(n=40):
    """Historial completo de operaciones desde el ledger (P2, verdad de ejecucion)."""
    import json as _json, os as _os
    path = _os.path.join(_os.path.dirname(__file__), "orders.jsonl")
    rows = []
    try:
        with open(path) as f:
            lines = f.readlines()[-200:]
        for ln in lines:
            try:
                r = _json.loads(ln)
            except Exception:
                continue
            if r.get("status") not in ("filled", "partial"):
                continue
            px = r.get("avg") or 0
            rows.append({
                "symbol": r.get("symbol", "?"),
                "action": r.get("intent", "?"),
                "entry": px, "exit": px,
                "qty_total": r.get("filled", 0),
                "pnl_net": 0,
                "closed_ts": r.get("ts", 0),
            })
    except Exception:
        pass
    return rows[-n:]


def build_payload():
    state = json.loads(STATE_PATH.read_text())
    positions = []
    for sym, p in (state.get("positions") or {}).items():
        positions.append({
            "symbol":       sym,
            "binance":      _binance(sym),
            "status":       p.get("status"),
            "qty":          p.get("qty", 0),
            "avg_cost":     p.get("avg_cost", 0),
            "dca_adds":     p.get("dca_adds", 0),
            "tp_hit":       p.get("tp_hit", []),
            "confirmed_at": p.get("confirmed_at"),
            "note":         p.get("note", ""),
        })
    # abiertas primero
    positions.sort(key=lambda x: (0 if (x["qty"] or 0) > 0 else 1, x["symbol"]))

    _free_usdt = None
    try:
        import ccxt as _ccxt, os as _os
        _ex = _ccxt.binance({"apiKey": _os.environ.get("BINANCE_API_KEY", ""), "secret": _os.environ.get("BINANCE_API_SECRET", ""), "enableRateLimit": True})
        _free_usdt = float(_ex.fetch_balance()["free"].get("USDT", 0))
    except Exception:
        _free_usdt = None
    return {
        "generated_at":     datetime.datetime.now(datetime.timezone.utc)
                              .strftime("%Y-%m-%dT%H:%M:%SZ"),
        "cron":             "15 0 * * * (00:15 UTC / 21:15 ART)",
        "capital_inicial":  CAPITAL,
        "free_usdt": _free_usdt,
        "deposits":         state.get("deposits", []),
        "positions":        positions,
        "shortlist":        state.get("shortlist", []),
        "narrativa_active": state.get("narrativa_active"),
        "regimen": state.get("regimen", "neutral"),
        "last_brain_run":   state.get("last_brain_run"),
        "recent_closed": _ops_from_ledger(),
        "shortlist_full": state.get("shortlist_full", []),
        "brain_history":  _brain_hist(state),
        "loop_recs": _load_recs(),
        "rules":            _rules(),
    }


def _headers():
    return {
        "Authorization": f"Bearer {TOKEN}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def gh_put(repo_path, content_bytes, message):
    """Crea o actualiza un archivo en el repo via Contents API."""
    if not TOKEN:
        raise RuntimeError("GITHUB_TOKEN no esta seteado en .env")
    url = f"{API}/repos/{REPO}/contents/{repo_path}"
    # sha actual (si existe)
    sha = None
    g = requests.get(url, headers=_headers(), params={"ref": BRANCH}, timeout=20)
    if g.status_code == 200:
        sha = g.json().get("sha")
    body = {
        "message": message,
        "content": base64.b64encode(content_bytes).decode(),
        "branch":  BRANCH,
    }
    if sha:
        body["sha"] = sha
    r = requests.put(url, headers=_headers(), json=body, timeout=20)
    r.raise_for_status()
    return r.json()


def update():
    """Push del snapshot diario. Se llama desde main.py; nunca lanza."""
    try:
        payload = build_payload()
        gh_put("docs/dashboard_data.json",
               json.dumps(payload, ensure_ascii=False, indent=1).encode("utf-8"),
               f"dashboard: estado {payload['generated_at']}")
        print("[dashboard] data publicada OK")
        return True
    except Exception as e:
        print(f"[dashboard] update fallo (ignorado): {e}")
        return False


def deploy():
    """Sube la cascara index.html + el primer dashboard_data.json."""
    html = (HERE / "docs" / "index.html").read_text(encoding="utf-8")
    gh_put("docs/index.html", html.encode("utf-8"), "dashboard: shell index.html")
    payload = build_payload()
    gh_put("docs/dashboard_data.json",
           json.dumps(payload, ensure_ascii=False, indent=1).encode("utf-8"),
           "dashboard: snapshot inicial")
    print("[dashboard] deploy OK -> docs/index.html + docs/dashboard_data.json")


if __name__ == "__main__":
    import sys
    if "--deploy" in sys.argv:
        deploy()
    else:
        update()