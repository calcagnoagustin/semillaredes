import datetime
import config
import indicators as ind
import state as st
import execlayer


def plant_seeds(ex, state, DRY, run_id):
    """3 semillas FORZADAS por mes (las del brain). Sin regimen global, sin requisito de stage.
    Son $7 de seguimiento/aprendizaje. El stage por-moneda gobierna despues el DCA, no la entrada."""
    acts = []
    positions = state.setdefault("positions", {})
    mes = datetime.datetime.utcnow().strftime("%Y-%m")
    if state.get("last_seed_month") == mes:
        return acts  # ya se plantaron las de este mes
    theses = {c.get("symbol"): c.get("thesis", "") for c in state.get("shortlist_full", [])}
    plantadas = 0
    for sym in state.get("shortlist", []):
        if plantadas >= config.SEEDS_PER_MONTH:
            break
        p = positions.get(sym)
        if p and p.get("status") in ("seed", "confirmed", "moonbag"):
            continue
        try:
            ohlcv = ex.ohlcv(sym, "1d", limit=config.MA_PERIOD + config.SLOPE_LOOKBACK + 20)
            price = ind.closes(ohlcv)[-1]
        except Exception as e:
            acts.append({"symbol": sym, "type": "SEED_ERROR", "reason": str(e)[:120]})
            continue
        res = execlayer.execute_buy_quote(ex, sym, config.SEED_SIZE_USDT, "SEED", run_id, DRY, price=price)
        if not res["ok"]:
            acts.append({"symbol": sym, "type": "SEED_ERROR", "reason": res["reason"]})
            continue
        qty = res["filled"] if res["filled"] > 0 else (config.SEED_SIZE_USDT / price)
        avg_cost = res["avg"] or price
        positions[sym] = {"symbol": sym, "status": "seed", "qty": qty, "avg_cost": avg_cost,
                          "dca_adds": 0, "tp_hit": [], "planted_at": st.today_str(),
                          "thesis": theses.get(sym, "")}
        plantadas += 1
        acts.append({"symbol": sym, "type": "SEED", "price": price})
        print("[seed] plantada " + sym + f" (${config.SEED_SIZE_USDT})")
    if plantadas > 0:
        state["last_seed_month"] = mes
    return acts