"""Publica ganesha_data.json (Ejecutor) al dashboard via GitHub Contents API."""
import json, os, time
import dashboard

BASE = os.path.dirname(os.path.abspath(__file__))
GDIR = os.path.join(BASE, "ejecutor")

def _events():
    out = []
    try:
        for ln in open(os.path.join(GDIR, "events.jsonl")):
            try:
                out.append(json.loads(ln))
            except Exception:
                pass
    except Exception:
        pass
    return out


def _real_equity(gs):
    """Balance real de la sub-cuenta si hay keys; None si no se puede."""
    import json as _j, os as _o
    try:
        k = _j.load(open(_o.path.join(GDIR, "keys.json")))
        import ccxt as _c
        ex = _c.binance({"apiKey": k["apiKey"], "secret": k["secret"], "enableRateLimit": True})
        bal = ex.fetch_balance()
        eq = float(bal["USDT"]["free"] or 0)
        for sym, p in (gs.get("positions") or {}).items():
            try:
                t = ex.fetch_ticker(sym)
                eq += p.get("qty", 0) * (t["last"] or 0)
            except Exception:
                pass
        return round(eq, 2)
    except Exception:
        return None


def build():
    try:
        gs = json.load(open(os.path.join(GDIR, "state.json")))
    except Exception:
        gs = {"positions": {}, "paper_pnl": 0.0}
    live = os.path.exists(os.path.join(GDIR, "LIVE"))
    entries, closed = {}, []
    for e in _events():
        t = e.get("type", "")
        if t.endswith("_ENTRY"):
            entries[e["symbol"]] = e
        elif t.endswith("_SCALE_OUT"):
            en = entries.get(e["symbol"], {})
            closed.append({"symbol": e["symbol"], "entry": en.get("px", 0),
                           "exit": e.get("px", 0), "qty_total": e.get("qty", 0),
                           "pnl_net": e.get("pnl", 0), "action": "tp",
                           "closed_ts": e.get("ts", 0)})
        elif t.endswith("_STOP_OUT"):
            en = entries.pop(e["symbol"], {})
            closed.append({"symbol": e["symbol"], "entry": en.get("px", 0),
                           "exit": e.get("px", 0), "qty_total": en.get("qty", 0),
                           "pnl_net": e.get("pnl", 0), "action": "stop",
                           "closed_ts": e.get("ts", 0)})
    pnl = gs.get("paper_pnl", 0.0)
    wins = [c for c in closed if c["pnl_net"] > 0]
    gw = sum(c["pnl_net"] for c in wins)
    gl = -sum(c["pnl_net"] for c in closed if c["pnl_net"] < 0)
    day0 = time.time() - (time.time() % 86400)
    today = [c for c in closed if c["closed_ts"] >= day0]
    return {"dry_run": not live, "equity_now": (_real_equity(gs) if live else None) or (gs.get("equity_base", 46.0) + (0 if live else pnl)),
            "deposits_total": 0,
            "pnl_today": round(sum(c["pnl_net"] for c in today), 2),
            "trades_today": len(today), "realized_pnl": round(pnl, 2),
            "trades_total": len(closed),
            "win_rate": round(100.0 * len(wins) / len(closed)) if closed else 0,
            "profit_factor": round(gw / gl, 2) if gl > 0 else round(gw, 2),
            "open_positions": [{"symbol": s, "entry": p.get("entry"),
                                "qty": p.get("qty"), "stop": p.get("stop"),
                                "tp1_done": p.get("so", False)}
                               for s, p in gs.get("positions", {}).items()],
            "recent_closed": closed[-40:]}

def publish():
    payload = build()
    dashboard.gh_put("docs/ganesha_data.json",
                     json.dumps(payload, indent=1).encode(),
                     "ganesha_data (ejecutor)")
    print("[ejecutor-dash] publicado.", len(payload["recent_closed"]), "cerradas.")

if __name__ == "__main__":
    publish()