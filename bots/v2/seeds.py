"""Plantacion v2: desde la shortlist del CEREBRO, con TIMING del JARDINERO.

Cambio central vs v1: ya no se plantan "las 3 primeras el dia 1 del mes".
El cerebro define la shortlist (10-12); el jardinero la vigila a diario y
planta una semilla ($10) cuando el timing tecnico dispara, hasta
SEEDS_PER_MONTH por mes. Fallback: si la shortlist del brain esta vieja
(> BRAIN_STALE_DAYS), se usan los picks del scanner, etiquetados como tales.

Cada semilla registra: origen ('brain'|'scanner'), tesis, y fecha.
"""
import datetime
import config
import indicators as ind
import state as st
import execlayer

def _month():
    return datetime.datetime.utcnow().strftime("%Y-%m")

def _timing_ok(ex, sym):
    """Gatillo de entrada: Stage 1/2 y cierre en maximo de GARDEN_TIMING_HIGH_D dias
    (comprar fuerza incipiente, no caida)."""
    ohlcv = ex.ohlcv(sym, "1d", limit=config.MA_PERIOD + config.SLOPE_LOOKBACK + 20)
    cl = ind.closes(ohlcv)
    stg = ind.stage(ohlcv, config.MA_PERIOD, config.SLOPE_LOOKBACK)
    n = config.GARDEN_TIMING_HIGH_D
    return (stg in (1, 2)) and len(cl) > n and cl[-1] >= max(cl[-n:]), cl[-1]

def _candidates(state):
    """Shortlist vigente + origen. Brain si esta fresca; si no, scanner."""
    brain_date = state.get("last_brain_success")
    fresh = False
    if brain_date:
        y, m, d = map(int, brain_date.split("-"))
        age = (datetime.date.today() - datetime.date(y, m, d)).days
        fresh = age <= config.BRAIN_STALE_DAYS
    if fresh and state.get("shortlist_full"):
        return state["shortlist_full"], "brain"
    picks = [c for c in state.get("scanner_raw", []) if c.get("stage") in (1, 2)]
    fallback = [{"symbol": c["symbol"],
                 "thesis": "scanner score %.1f stage %s mom30 %s%% trending %s" % (
                     c["score"], c["stage"], c["mom30"], c["trending"])}
                for c in picks[:config.SCAN_TOP]]
    return fallback, "scanner"

def plant_seeds(ex, state, DRY, run_id):
    acts = []
    positions = state.setdefault("positions", {})
    mes = _month()
    planted_log = state.setdefault("seeds_planted", {})
    ya = planted_log.get(mes, [])
    if len(ya) >= config.SEEDS_PER_MONTH:
        return acts

    cands, origen = _candidates(state)
    if origen == "scanner" and cands:
        acts.append({"symbol": "-", "type": "SEED_FALLBACK",
                     "reason": "shortlist del brain vieja/vacia; usando picks del scanner"})

    for c in cands:
        if len(planted_log.get(mes, [])) >= config.SEEDS_PER_MONTH:
            break
        sym = c.get("symbol")
        if not sym or sym in ya:
            continue
        p = positions.get(sym)
        if p and p.get("status") in ("seed", "confirmed", "moonbag", "stopped_moonbag"):
            continue
        try:
            ok, price = _timing_ok(ex, sym)
        except Exception as e:
            acts.append({"symbol": sym, "type": "SEED_ERROR", "reason": str(e)[:120]})
            continue
        if not ok:
            continue  # sin timing hoy; se re-evalua manana
        res = execlayer.execute_buy_quote(ex, sym, config.SEED_SIZE_USDT, "SEED",
                                          run_id, DRY, price=price)
        if not res["ok"]:
            acts.append({"symbol": sym, "type": "SEED_ERROR", "reason": res["reason"]})
            continue
        qty = res["filled"] if res["filled"] > 0 else (config.SEED_SIZE_USDT / price)
        positions[sym] = {"symbol": sym, "status": "seed", "qty": qty,
                          "avg_cost": res["avg"] or price, "dca_adds": 0, "tp_hit": [],
                          "planted_at": st.today_str(),
                          "origen": origen, "thesis": c.get("thesis", "")}
        planted_log.setdefault(mes, []).append(sym)
        acts.append({"symbol": sym, "type": "SEED", "price": price,
                     "reason": "origen=%s (timing ok)" % origen})
        print(f"[seed] plantada {sym} (${config.SEED_SIZE_USDT}, origen={origen})")
    return acts
