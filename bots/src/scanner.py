import requests
import config
import indicators as ind
from exchange import Exchange

STABLES = {"USDT", "USDC", "FDUSD", "TUSD", "DAI", "BUSD", "USDP", "EUR", "TRY", "BRL", "ARS", "GBP", "AEUR", "RLUSD", "USD1", "USDE", "PYUSD", "USDD", "GUSD", "FRAX", "LUSD", "USDS", "USDF", "EURI", "XUSD"}

def _is_lev(base):
    return base.endswith("UP") or base.endswith("DOWN") or base.endswith("BULL") or base.endswith("BEAR") or "3L" in base or "3S" in base

def top_universe(ex, n=300):
    tk = ex.client.fetch_tickers()
    rows = []
    for sym, t in tk.items():
        if not sym.endswith("/USDT"):
            continue
        base = sym.split("/")[0]
        if base in STABLES or _is_lev(base):
            continue
        qv = t.get("quoteVolume") or 0
        rows.append((sym, qv, t.get("percentage") or 0, t.get("last") or 0))
    rows.sort(key=lambda r: r[1], reverse=True)
    return rows[:n]

def trending_cg():
    try:
        r = requests.get("https://api.coingecko.com/api/v3/search/trending", timeout=15)
        d = r.json()
        return {c["item"]["symbol"].upper() for c in d.get("coins", [])}
    except Exception:
        return set()

def score_candidates(ex, universe, deep=40):
    trend = trending_cg()
    pre = sorted(universe, key=lambda r: r[1] * (1 + max(r[2], 0) / 100.0), reverse=True)[:deep]
    out = []
    for sym, qv, pct, last in pre:
        try:
            oh = ex.ohlcv(sym, "1d", limit=config.MA_PERIOD + 40)
            stg = ind.stage(oh, config.MA_PERIOD, config.SLOPE_LOOKBACK)
            cl = ind.closes(oh)
            mom7 = (cl[-1] / cl[-8] - 1) * 100 if len(cl) > 8 else 0
            mom30 = (cl[-1] / cl[-31] - 1) * 100 if len(cl) > 31 else 0
        except Exception:
            continue
        base = sym.split("/")[0]
        tr = base in trend
        sc = 0.0
        sc += 2.0 if stg == 2 else (0.5 if stg == 1 else (-2.0 if stg == 4 else 0.0))
        sc += min(mom7, 50) * 0.05 + min(mom30, 100) * 0.02
        sc += 1.5 if tr else 0.0
        out.append({"symbol": sym, "score": round(sc, 2), "stage": stg, "mom7": round(mom7, 1), "mom30": round(mom30, 1), "vol_musd": round(qv / 1e6, 1), "trending": tr})
    out.sort(key=lambda c: c["score"], reverse=True)
    return out

def scan(ex, top=12):
    return score_candidates(ex, top_universe(ex))[:top]

if __name__ == "__main__":
    ex = Exchange()
    uni = top_universe(ex)
    print("universo /USDT:", len(uni))
    print("trending CG:", trending_cg())
    print("=== TOP CANDIDATOS ===")
    for c in scan(ex, 12):
        print(c)

def apply_to_shortlist(ex, state):
    mode = getattr(config, "SCAN_FEED", "direct")
    try:
        cands = scan(ex, top=getattr(config, "SCAN_TOP", 12))
    except Exception as e:
        print("[scanner] error:", e)
        return
    state["scanner_raw"] = cands
    print("[scanner] %d candidatos modo=%s" % (len(cands), mode))
    if mode == "direct":
        n = getattr(config, "SCAN_SHORTLIST_N", 3)
        picks = [c for c in cands if c["stage"] in (1, 2)][:n]
        state["shortlist"] = [c["symbol"] for c in picks]
        state["shortlist_full"] = [{"symbol": c["symbol"], "thesis": "scanner score %.1f stage %s mom30 %s%% trending %s" % (c["score"], c["stage"], c["mom30"], c["trending"])} for c in picks]