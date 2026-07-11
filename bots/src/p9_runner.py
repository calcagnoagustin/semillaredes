"""P9/P11 - Modo runner con moonbag legacy intocable y DCA dinamico.

Aprobado 29/jun por Agus + Grok + ChatGPT + Claude:
  - Trigger seed/confirmed -> runner: dca_adds >= 2  O  pnl >= +45% con Stage 2.
  - Al promover: se aparta moonbag legacy = 15% de max_qty, moonbag_locked=True.
    Ese bolsillo NO se vende NUNCA por logica de runner (solo stop duro Stage 4
    de strategy.py, que mata la tesis, puede tocarlo).
  - Recuperacion de capital: TPs parciales hasta que lo vendido acumulado >= costo
    invertido -> capital_recovered=True.
  - Trailing estructural sobre el resto: cierre diario < minimo de los ultimos
    RUNNER_TRAIL_LOOKBACK dias -> vender trading restante (sin tocar moonbag).
  - P11: DCA dinamico en runner con techo de exposicion (RUNNER_MAX_EXPOSURE_FRAC).
"""
import config
import indicators as ind

TRIG_DCA = int(getattr(config, "RUNNER_TRIGGER_DCA", 2))
TRIG_PNL = float(getattr(config, "RUNNER_TRIGGER_PNL", 45.0))
LEGACY_FRAC = float(getattr(config, "LEGACY_MOONBAG_FRAC", 0.15))
TRAIL_N = int(getattr(config, "RUNNER_TRAIL_LOOKBACK", 10))
DCA_USDT = float(getattr(config, "RUNNER_DCA_USDT", 6.0))
MAX_EXPO = float(getattr(config, "RUNNER_MAX_EXPOSURE_FRAC", 0.30))
RECOVER_FRAC = float(getattr(config, "RUNNER_RECOVER_SELL_FRAC", 0.25))


def ensure_fields(pos):
    """Migracion suave: campos P9 con defaults en posiciones preexistentes."""
    pos.setdefault("initial_qty", pos.get("qty", 0))
    pos.setdefault("max_qty", pos.get("qty", 0))
    pos.setdefault("moonbag_qty", 0.0)
    pos.setdefault("moonbag_type", "none")
    pos.setdefault("moonbag_locked", False)
    pos.setdefault("capital_recovered", False)
    pos.setdefault("recovered_usd", 0.0)
    if pos.get("qty", 0) > pos.get("max_qty", 0):
        pos["max_qty"] = pos["qty"]
    return pos


def tradable_qty(pos):
    """Cantidad vendible por logica runner: qty menos el bolsillo bloqueado."""
    q = pos.get("qty", 0) - (pos.get("moonbag_qty", 0) if pos.get("moonbag_locked") else 0)
    return max(q, 0.0)


def should_promote(pos, ohlcv):
    """Trigger seed/confirmed -> runner (dca_adds>=2 O +45% con Stage 2)."""
    if pos.get("status") != "confirmed":
        return False
    if pos.get("dca_adds", 0) >= TRIG_DCA:
        return True
    price = ohlcv[-1][4]
    avg = pos.get("avg_cost") or 0
    if avg > 0 and (price / avg - 1) * 100 >= TRIG_PNL and ind.stage(ohlcv) == 2:
        return True
    return False


def promote(pos):
    """Pasa a runner y aparta el moonbag legacy intocable (15% de max_qty)."""
    ensure_fields(pos)
    mb = pos["max_qty"] * LEGACY_FRAC
    mb = min(mb, pos.get("qty", 0))
    pos["moonbag_qty"] = mb
    pos["moonbag_type"] = "legacy"
    pos["moonbag_locked"] = True
    pos["status"] = "runner"
    return pos


def decide_runner(symbol, ohlcv, pos, equity_usdt=None):
    """Acciones para posicion runner. Mismo shape de accion que strategy.decide().
    Orden de prioridad: trailing (protege) > recuperar capital > P11 DCA."""
    ensure_fields(pos)
    price = ohlcv[-1][4]
    closes = [c[4] for c in ohlcv]
    lows = [c[3] for c in ohlcv[-(TRAIL_N + 1):-1]]
    trad = tradable_qty(pos)

    # 1) Trailing estructural: cierre < minimo de ultimos N dias -> salir del trading.
    if trad > 0 and lows and price < min(lows):
        return {"type": "RUNNER_TRAIL_EXIT", "symbol": symbol, "price": price,
                "reason": f"Runner: cierre {price} < min {TRAIL_N}d {min(lows):.6g}. "
                          f"Sale trading ({trad:.6g}), moonbag intacta."}

    # 2) Recuperacion de capital: vender fracciones hasta cubrir el costo.
    if not pos.get("capital_recovered") and trad > 0:
        cost_total = (pos.get("avg_cost") or 0) * pos.get("max_qty", 0)
        gain_pct = ((price / pos["avg_cost"]) - 1) * 100 if pos.get("avg_cost") else 0
        if gain_pct >= 30 and pos.get("recovered_usd", 0) < cost_total:
            return {"type": "RUNNER_TP", "symbol": symbol, "price": price,
                    "sell_frac": RECOVER_FRAC * 100,
                    "reason": f"Runner: +{gain_pct:.1f}%, recuperando capital "
                              f"({pos.get('recovered_usd', 0):.2f}/{cost_total:.2f} USDT)."}

    # 3) P11: DCA dinamico con techo de exposicion.
    if ind.stage(ohlcv) == 2 and price > pos.get("avg_cost", 0):
        expo = pos.get("qty", 0) * price
        cap = (equity_usdt or 0) * MAX_EXPO
        if equity_usdt and expo + DCA_USDT <= cap:
            return {"type": "RUNNER_DCA", "symbol": symbol, "price": price,
                    "usdt": DCA_USDT,
                    "reason": f"Runner P11: Stage 2, expo {expo:.2f} < techo {cap:.2f}."}

    return {"type": "HOLD", "symbol": symbol, "reason": "Runner: sin gatillo."}