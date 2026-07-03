"""Learning loop: captura OHLCV 1h de entradas confirmadas para calibrar Ganesha-Ejecutor.
Solo lectura de mercado + escritura local en learning/. Nunca opera."""
import json, os, time
import ccxt

BASE = os.path.dirname(os.path.abspath(__file__))
LDIR = os.path.join(BASE, "learning")
ODIR = os.path.join(LDIR, "ohlcv")
EVENTS = os.path.join(LDIR, "events.jsonl")
LSTATE = os.path.join(LDIR, "loop_state.json")
SUMMARY = os.path.join(LDIR, "summary.json")
TRACK = ("confirmed", "moonbag")
PRE_H = 168
CAP_D = 45
H = 3600000

def _load(p, d):
    try:
        return json.load(open(p))
    except Exception:
        return d

def _iso2ms(s):
    return int(time.mktime(time.strptime(s[:10], "%Y-%m-%d")) * 1000)

def _fetch(ex, sym, since, until):
    out, ms = [], since
    while ms < until:
        try:
            b = ex.fetch_ohlcv(sym, "1h", since=ms, limit=1000)
        except Exception as e:
            print("[learn] fetch fallo", sym, str(e)[:80])
            break
        if not b:
            break
        out += b
        nxt = b[-1][0] + H
        if nxt <= ms:
            break
        ms = nxt
        if len(b) < 1000:
            break
    return [c for c in out if c[0] < until]

def _event(ev):
    ev["ts"] = time.time()
    ev["iso"] = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    with open(EVENTS, "a") as f:
        f.write(json.dumps(ev) + "\n")

def _summ(sym, candles, conf_ms, pos):
    post = [c for c in candles if c[0] >= conf_ms]
    if not post:
        return None
    p0 = post[0][4]
    hi = max(c[2] for c in post)
    lo = min(c[3] for c in post)
    trs = []
    for i in range(1, len(post)):
        h, l, pc = post[i][2], post[i][3], post[i - 1][4]
        trs.append(max(h - l, abs(h - pc), abs(l - pc)))
    atr = sum(trs[-14:]) / min(14, len(trs)) if trs else 0
    return {"symbol": sym, "status": pos.get("status"),
            "confirmed_at": pos.get("confirmed_at"), "ref_close": p0,
            "last": post[-1][4],
            "max_runup_pct": round((hi / p0 - 1) * 100, 2),
            "max_dd_pct": round((lo / p0 - 1) * 100, 2),
            "ret_pct": round((post[-1][4] / p0 - 1) * 100, 2),
            "hours": len(post),
            "atr14h_pct": round(atr / post[-1][4] * 100, 3)}

def run(state, ex=None):
    os.makedirs(ODIR, exist_ok=True)
    if ex is None:
        ex = ccxt.binance({"enableRateLimit": True})
    ls = _load(LSTATE, {"statuses": {}})
    summ = _load(SUMMARY, {})
    now = int(time.time() * 1000)
    for sym, pos in state.get("positions", {}).items():
        st_now = pos.get("status")
        if ls["statuses"].get(sym) != st_now:
            _event({"type": "status_change", "symbol": sym,
                    "from": ls["statuses"].get(sym), "to": st_now,
                    "avg_cost": pos.get("avg_cost"), "qty": pos.get("qty"),
                    "tp_hit": pos.get("tp_hit")})
            ls["statuses"][sym] = st_now
        conf = pos.get("confirmed_at")
        if st_now not in TRACK or not conf:
            continue
        conf_ms = _iso2ms(conf)
        until = min(now - H, conf_ms + CAP_D * 86400000)
        f = os.path.join(ODIR, sym.replace("/", "_") + "_1h.json")
        data = _load(f, [])
        since = data[-1][0] + H if data else conf_ms - PRE_H * H
        if since < until:
            new = _fetch(ex, sym, since, until)
            if new:
                data += new
                json.dump(data, open(f, "w"))
                print("[learn] %s: +%d velas 1h (total %d)" % (sym, len(new), len(data)))
        s = _summ(sym, data, conf_ms, pos)
        if s:
            summ[sym] = s
    json.dump(ls, open(LSTATE, "w"))
    json.dump(summ, open(SUMMARY, "w"), indent=1)
    print("[learn] ok. %d simbolos trackeados." % len(summ))

if __name__ == "__main__":
    import state as stmod
    run(stmod.load())
