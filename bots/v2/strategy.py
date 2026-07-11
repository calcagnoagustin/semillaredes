"""Motor de reglas del Sistema Semillas v2.

Decide acciones a partir de velas + estado de la posicion. NO ejecuta ordenes
(eso lo hace main.py). Cada funcion devuelve una "accion" o None.

Reglas inviolables:
- Stop DURO ante invalidacion de tesis (Stage 4). El moonbag que se conserva es
  DINAMICO: 25% si los suelos del marco mensual estan intactos, 10% si la
  estructura esta rota. Piso $MOONBAG_FLOOR_USDT; abajo de eso no se fabrica
  testigo (se vende todo y se avisa).
- REVIVAL: un moonbag (o stopped_moonbag) puede volver a 'confirmed' si el
  mercado re-valida la tesis con Stage 2 sostenido CONFIRM_DAYS. Solo lado
  compra: un moonbag jamas re-vende solo (leccion P9a intacta).
- El refuerzo de capital (DCA) ya no vive aca: lo dictamina el CEREBRO
  mensualmente y lo ejecuta garden.py con veto Stage 2.
- Regla 60 dias: semilla sin activar -> congelar.
"""
from datetime import date
import config
import indicators as ind

def _days_since(iso):
    if not iso:
        return 0
    y, m, d = map(int, iso.split("-"))
    return (date.today() - date(y, m, d)).days

def structure_intact(ohlcv, lookback=None):
    """True si el precio respeta los suelos del marco mensual:
    el cierre actual esta por encima del minimo de los 'lookback' dias previos."""
    lb = lookback or config.STRUCT_LOOKBACK_D
    if len(ohlcv) < lb + 2:
        return False
    lows = [c[3] for c in ohlcv[-(lb + 1):-1]]
    return ohlcv[-1][4] > min(lows)

def decide(symbol, ohlcv, pos):
    """Devuelve un dict de accion o None.
    types: ACTIVATE, TAKE_PROFIT, STOP, FREEZE, REVIVE, HOLD
    """
    st = ind.stage(ohlcv, config.MA_PERIOD, config.SLOPE_LOOKBACK)
    price = ind.closes(ohlcv)[-1]
    status = pos.get("status", "seed")

    # REVIVAL: moonbag vuelve a la vida si Stage 2 sostenido (habilita DCA+Ganesha)
    if status in ("moonbag", "stopped_moonbag"):
        if ind.consecutive_stage2(ohlcv, config.MA_PERIOD, config.SLOPE_LOOKBACK,
                                  config.CONFIRM_DAYS):
            return {"type": "REVIVE", "symbol": symbol, "price": price,
                    "reason": f"Moonbag revivida: Stage 2 sostenido "
                              f"{config.CONFIRM_DAYS} dias. Re-confirma."}
        return {"type": "HOLD", "symbol": symbol,
                "reason": "Moonbag testigo (esperando revival o dictamen del cerebro)."}

    # STOP DURO — invalidacion de tesis (solo estados vivos con venta pendiente)
    if status in ("seed", "confirmed") and st == 4:
        frac = (config.MOONBAG_FRAC_STRONG if structure_intact(ohlcv)
                else config.MOONBAG_FRAC_WEAK)
        return {"type": "STOP", "symbol": symbol, "price": price,
                "qty": pos["qty"], "moonbag_frac": frac,
                "reason": f"Tesis invalidada (Stage 4). Moonbag dinamico "
                          f"{frac*100:.0f}% ({'suelos intactos' if frac == config.MOONBAG_FRAC_STRONG else 'estructura rota'})."}

    # Semilla sin confirmar
    if status == "seed":
        if _days_since(pos.get("planted_at")) >= config.FREEZE_DAYS:
            return {"type": "FREEZE", "symbol": symbol, "price": price,
                    "qty": pos["qty"],
                    "reason": f"Semilla sin activar en {config.FREEZE_DAYS} dias. Congelar."}
        if ind.consecutive_stage2(ohlcv, config.MA_PERIOD, config.SLOPE_LOOKBACK,
                                  config.CONFIRM_DAYS):
            return {"type": "ACTIVATE", "symbol": symbol, "price": price,
                    "reason": f"Stage 2 confirmado {config.CONFIRM_DAYS} dias. "
                              f"Activar -> habilita DCA mensual y Ganesha."}
        return {"type": "HOLD", "symbol": symbol, "reason": "Semilla esperando confirmacion."}

    # Confirmada: tomas de ganancia (el refuerzo lo maneja garden.py)
    if status == "confirmed":
        action = _check_take_profit(symbol, pos, price)
        if action:
            return action
        return {"type": "HOLD", "symbol": symbol, "reason": "Confirmada, sin gatillo."}

    return None

def _check_take_profit(symbol, pos, price):
    avg = pos.get("avg_cost", 0) or 0
    if avg <= 0:
        return None
    gain = (price / avg - 1) * 100
    already = set(pos.get("tp_hit", []))
    for level_pct, sell_frac in config.TP_LEVELS:
        if gain >= level_pct and level_pct not in already:
            return {"type": "TAKE_PROFIT", "symbol": symbol, "price": price,
                    "level": level_pct, "sell_frac": sell_frac,
                    "reason": f"+{gain:.0f}% (nivel {level_pct}%). "
                              f"Vender {sell_frac:.0f}%, preservar moonbag."}
    return None
