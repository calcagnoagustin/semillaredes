"""Loop analista: unifica eventos (Semillas+Ejecutor+Brain) en learning/events.jsonl,
captura contexto 15m de cada senal del Ejecutor y recalcula sims con grilla de
parametros. SOLO informa (recommendations.json); nunca toca parametros vivos."""
import json, os, time
import ccxt

BASE = os.path.dirname(os.path.abspath(__file__))
LDIR = os.path.join(BASE, "learning")
UNI = os.path.join(LDIR, "events.jsonl")
ASTATE = os.path.join(LDIR, "analista_state.json")
RECS = os.path.join(LDIR, "recommendations.json")
SRC = [("ejecutor", os.path.join(BASE, "ejecutor", "events.jsonl")),
       ("brain", os.path.join(LDIR, "brain_log.jsonl"))]

def _load(p, d):
    try:
        return json.load(open(p))
    except Exception:
        return d

def ingest():
    st = _load(ASTATE, {"offsets": {}})
    new_entries = []
    for name, path in SRC:
        off = st["offsets"].get(name, 0)
        try:
            lines = open(path).read().splitlines()
        except Exception:
            lines = []
        rows = []
        for ln in lines[off:]:
            try:
                e = json.loads(ln)
                e["src"] = name
                rows.append(e)
            except Exception:
                pass
        if rows:
            with open(UNI, "a") as f:
                for r in rows:
                    f.write(json.dumps(r) + "\n")
            for e in rows:
                if str(e.get("type", "")).endswith("_ENTRY"):
                    new_entries.append(e)
        st["offsets"][name] = len(lines)
    json.dump(st, open(ASTATE, "w"))
    return new_entries

def capture15(events):
    if not events:
        return
    ex = ccxt.binance({"enableRateLimit": True})
    os.makedirs(os.path.join(LDIR, "ohlcv"), exist_ok=True)
    for e in events:
        sym = e.get("symbol")
        if not sym:
            continue
        ts = int(float(e.get("ts", time.time())) * 1000)
        f = os.path.join(LDIR, "ohlcv", sym.replace("/", "_") + "_15m.json")
        data = _load(f, [])
        seen = set(c[0] for c in data)
        try:
            batch = ex.fetch_ohlcv(sym, "15m", since=ts - 48 * 3600000, limit=1000)
        except Exception as err:
            print("[analista] 15m fallo", sym, str(err)[:60])
            continue
        data += [c for c in batch if c[0] not in seen]
        data.sort()
        json.dump(data, open(f, "w"))
        print("[analista] %s: contexto 15m %d velas" % (sym, len(data)))

def analyze():
    import sim_ejecutor as SE
    import state as stmod
    grid = [(a, v) for a in (2.0, 2.5, 3.0) for v in (1.3, 1.5, 2.0)]
    odir = os.path.join(LDIR, "ohlcv")
    try:
        files = [x for x in os.listdir(odir) if x.endswith("_1h.json")]
    except Exception:
        files = []
    positions = stmod.load().get("positions", {})
    res, agg = {}, {}
    for fn in files:
        sym = fn[:-8].replace("_", "/")
        conf = (positions.get(sym) or {}).get("confirmed_at")
        if not conf:
            continue
        conf_ms = int(time.mktime(time.strptime(conf[:10], "%Y-%m-%d")) * 1000)
        candles = _load(os.path.join(odir, fn), [])
        rows = []
        for a, v in grid:
            SE.P["atr_mult"] = a
            SE.P["vol_mult"] = v
            r = SE.sim(candles, conf_ms)
            rm = r.get("r_multiple")
            rows.append({"atr_mult": a, "vol_mult": v, "r_multiple": rm,
                         "error": r.get("error")})
            if rm is not None:
                agg.setdefault((a, v), []).append(rm)
        res[sym] = rows
    rank = sorted(((sum(v) / len(v), len(v), k) for k, v in agg.items()), reverse=True)
    out = {"generated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
           "nota": "solo informativo; nada se aplica automaticamente",
           "n_simbolos": len(res),
           "ranking": [{"atr_mult": k[0], "vol_mult": k[1],
                        "r_promedio": round(m, 2), "n": n} for m, n, k in rank[:5]],
           "detalle": res}
    json.dump(out, open(RECS, "w"), indent=1)
    print("[analista] top:", json.dumps(out["ranking"][:2]) if out["ranking"] else "sin datos")

def run():
    os.makedirs(LDIR, exist_ok=True)
    ev = ingest()
    capture15(ev)
    try:
        analyze()
    except Exception as e:
        print("[analista] analyze fallo:", str(e)[:120])
    print("[analista] ok.")

if __name__ == "__main__":
    run()