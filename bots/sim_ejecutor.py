"""Simulador Ganesha-Ejecutor v1 sobre datos 1h capturados por learning_loop.
Uso: python3 sim_ejecutor.py SYN/USDT
Parametros = placeholders a calibrar con datos reales del loop."""
import json, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
ODIR = os.path.join(BASE, "learning", "ohlcv")

P = {"equity": 1000.0, "risk_pct": 1.0, "vol_mult": 1.5, "vol_sma": 20,
     "mom_lookback_h": 24, "atr_n": 14, "atr_mult": 2.5,
     "pyramid_max": 2, "pyramid_step_r": 1.0, "pyramid_frac": 0.5,
     "scaleout_r": 2.0, "scaleout_frac": 0.30, "trail_after_r": 2.0}

def atr(c, i, n):
    trs = []
    for j in range(max(1, i - n + 1), i + 1):
        h, l, pc = c[j][2], c[j][3], c[j - 1][4]
        trs.append(max(h - l, abs(h - pc), abs(l - pc)))
    return sum(trs) / len(trs) if trs else 0

def sim(candles, conf_ms):
    idx0 = next((i for i, c in enumerate(candles) if c[0] >= conf_ms), None)
    if idx0 is None or idx0 < P["vol_sma"] + 1:
        return {"error": "datos insuficientes pre-confirmacion"}
    ev, pos = [], None
    for i in range(max(idx0, P["mom_lookback_h"] + 1), len(candles)):
        t, o, h, l, cl, v = candles[i]
        if pos is None:
            hh = max(x[4] for x in candles[i - P["mom_lookback_h"]:i])
            vs = sum(x[5] for x in candles[i - P["vol_sma"]:i]) / P["vol_sma"]
            if cl > hh and v > P["vol_mult"] * vs:
                a = atr(candles, i, P["atr_n"])
                stop = cl - P["atr_mult"] * a
                if stop >= cl:
                    continue
                risk = P["equity"] * P["risk_pct"] / 100
                qty = risk / (cl - stop)
                pos = {"e": cl, "q": qty, "q0": qty, "stop": stop,
                       "r": cl - stop, "adds": 0, "so": False, "pnl": 0.0}
                ev.append(("ENTRY", t, cl, qty))
            continue
        rmult = (cl - pos["e"]) / pos["r"]
        if cl < pos["stop"]:
            pos["pnl"] += pos["q"] * (cl - pos["e"])
            ev.append(("STOP_OUT", t, cl, pos["q"]))
            return report(ev, pos, candles, idx0)
        if not pos["so"] and rmult >= P["scaleout_r"]:
            sq = pos["q"] * P["scaleout_frac"]
            pos["pnl"] += sq * (cl - pos["e"])
            pos["q"] -= sq
            pos["so"] = True
            ev.append(("SCALE_OUT", t, cl, sq))
        if pos["adds"] < P["pyramid_max"] and rmult >= (pos["adds"] + 1) * P["pyramid_step_r"]:
            aq = pos["q0"] * P["pyramid_frac"]
            pos["e"] = (pos["e"] * pos["q"] + cl * aq) / (pos["q"] + aq)
            pos["q"] += aq
            pos["adds"] += 1
            pos["stop"] = max(pos["stop"], pos["e"])
            ev.append(("PYRAMID", t, cl, aq))
        if rmult >= P["trail_after_r"]:
            a = atr(candles, i, P["atr_n"])
            pos["stop"] = max(pos["stop"], cl - P["atr_mult"] * a)
    if pos:
        cl = candles[-1][4]
        pos["pnl"] += pos["q"] * (cl - pos["e"])
        ev.append(("OPEN_EOD", candles[-1][0], cl, pos["q"]))
        return report(ev, pos, candles, idx0)
    return {"error": "sin gatillo de entrada (momentum+volumen no se dio)"}

def report(ev, pos, candles, idx0):
    p0 = candles[idx0][4]
    bh = (candles[-1][4] / p0 - 1) * 100
    risk = P["equity"] * P["risk_pct"] / 100
    return {"params": P,
            "events": [[a[0], a[1], round(a[2], 6), round(a[3], 4)] for a in ev],
            "pnl_usdt": round(pos["pnl"], 2),
            "r_multiple": round(pos["pnl"] / risk, 2),
            "buyhold_pct_desde_confirm": round(bh, 2)}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("uso: python3 sim_ejecutor.py SYMBOL [conf YYYY-MM-DD]")
        sys.exit(1)
    sym = sys.argv[1]
    f = os.path.join(ODIR, sym.replace("/", "_") + "_1h.json")
    candles = json.load(open(f))
    import time as _t
    if len(sys.argv) > 2:
        conf_ms = int(_t.mktime(_t.strptime(sys.argv[2], "%Y-%m-%d")) * 1000)
    else:
        import state as stmod
        conf = stmod.load()["positions"][sym]["confirmed_at"]
        conf_ms = int(_t.mktime(_t.strptime(conf[:10], "%Y-%m-%d")) * 1000)
    print(json.dumps(sim(candles, conf_ms), indent=1))
