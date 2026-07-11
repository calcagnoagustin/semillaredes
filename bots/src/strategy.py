"""Motor de reglas del Sistema Semillas 2.0.

Decide acciones a partir de velas + estado de la posición. NO ejecuta órdenes
(eso lo hace main.py). Cada función devuelve una "acción" o None.

Reglas inviolables implementadas:
  - Stop DURO ante invalidación de tesis (Stage 4) -> salida 100%, incluida moonbag.
    (La tesis murió; ya no hay nada que preservar.)
  - Moonbag universal en TOMAS DE GANANCIA: nunca se vende el 100% mientras la
    tesis sigue viva. Siempre queda MOONBAG_PCT.
  - DCA SOLO con confirmación de tendencia (Stage 2). Nunca promediar a la baja.
  - Regla 60 días: semilla sin activar -> congelar.
"""
from datetime import date
import config
import indicators as ind


def _days_since(iso):
    if not iso:
        return 0
    y, m, d = map(int, iso.split("-"))
    return (date.today() - date(y, m, d)).days


def decide(symbol, ohlcv, pos):
    """Devuelve un dict de acción o None.

    Acción: {"type": ..., "symbol": ..., "reason": ..., ...}
      types: ACTIVATE, DCA, TAKE_PROFIT, STOP, FREEZE, HOLD
    """
    st = ind.stage(ohlcv, config.MA_PERIOD, config.SLOPE_LOOKBACK)
    price = ind.closes(ohlcv)[-1]
    status = pos.get("status", "seed")

    # P9: moonbag terminal tras STOP - no re-vender nunca mas
    if status == "stopped_moonbag":
        return {"type": "HOLD", "symbol": symbol, "reason": "Moonbag terminal (stop ya ejecutado)."}

    # 1) STOP DURO — invalidación de tesis. Aplica a cualquier estado vivo.
    if status in ("seed", "confirmed", "moonbag") and st == 4:
        return {
            "type": "STOP", "symbol": symbol, "price": price,
            "qty": pos["qty"],
            "reason": "Tesis invalidada (Stage 4: precio < MA y MA en baja). Salida total, incluida moonbag.",
        }

    # 2) Semilla aún sin confirmar
    if status == "seed":
        # Regla 60 días: sin activación -> congelar
        if _days_since(pos.get("planted_at")) >= config.FREEZE_DAYS:
            return {
                "type": "FREEZE", "symbol": symbol, "price": price,
                "qty": pos["qty"],
                "reason": f"Semilla sin activar en {config.FREEZE_DAYS} días. Congelar.",
            }
        # ¿Confirmó Stage 2 sostenido?
        if ind.consecutive_stage2(ohlcv, config.MA_PERIOD, config.SLOPE_LOOKBACK, config.CONFIRM_DAYS):
            return {
                "type": "ACTIVATE", "symbol": symbol, "price": price,
                "reason": f"Stage 2 confirmado {config.CONFIRM_DAYS} días. Activar -> habilita DCA.",
            }
        return {"type": "HOLD", "symbol": symbol, "reason": "Semilla esperando confirmación."}

    # 3) Posición confirmada -> DCA con tendencia + tomas de ganancia
    if status == "confirmed":
        action = _check_take_profit(symbol, pos, price)
        if action:
            return action
        # DCA SOLO con tendencia intacta (Stage 2) y sin pasarse del máximo de agregados
        if st == 2 and pos.get("dca_adds", 0) < config.MAX_DCA_ADDS:
            # confirmación de continuación: nuevo máximo de los últimos CONFIRM_DAYS
            recent_high = max(ind.closes(ohlcv)[-config.CONFIRM_DAYS:])
            if price >= recent_high:
                return {
                    "type": "DCA", "symbol": symbol, "price": price,
                    "reason": "Tendencia confirmada + nuevo máximo. Agregar con tendencia (nunca a la baja).",
                }
        return {"type": "HOLD", "symbol": symbol, "reason": "Confirmada, sin gatillo."}

    # 4) Moonbag — solo se cierra por stop duro (ya cubierto arriba)
    if status == "moonbag":
        return {"type": "HOLD", "symbol": symbol, "reason": "Moonbag testigo, tesis viva."}

    return None


def _check_take_profit(symbol, pos, price):
    """Tomas escalonadas preservando moonbag. Devuelve acción TAKE_PROFIT o None."""
    avg = pos.get("avg_cost", 0) or 0
    if avg <= 0:
        return None
    gain = (price / avg - 1) * 100
    already = set(pos.get("tp_hit", []))

    for level_pct, sell_frac in config.TP_LEVELS:
        if gain >= level_pct and level_pct not in already:
            return {
                "type": "TAKE_PROFIT", "symbol": symbol, "price": price,
                "level": level_pct, "sell_frac": sell_frac,
                "reason": f"+{gain:.0f}% (nivel {level_pct}%). Vender {sell_frac:.0f}%, preservar moonbag.",
            }
    return None