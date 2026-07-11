"""P5 - Reconciliacion state <-> Binance.

Al inicio de cada corrida compara lo que el bot CREE tener (state.json) contra
lo que REALMENTE hay en Binance. SOLO ALERTA: no auto-corrige (al principio,
observar antes de automatizar). Detecta:
  - el state dice tener X pero Binance tiene bastante mas/menos (venta que fallo, etc.),
  - Binance tiene un activo que el state no trackea,
  - posiciones que el state da por vivas pero en Binance no estan.
"""
import config

# tolerancia relativa para considerar "coincide" (fees/dust/redondeo)
REL_TOL = 0.05      # 5%
DUST_USDT = 1.0     # diferencias por debajo de ~1 USD se ignoran


def _base(sym):
    return sym.split("/")[0]


def reconcile(ex, state):
    """Devuelve lista de discrepancias [{symbol, kind, state_qty, real_qty, detail}]."""
    diffs = []
    try:
        bal = ex.balance()
        totals = (bal or {}).get("total", {}) or {}
    except Exception as e:
        return [{"symbol": "-", "kind": "balance_error",
                 "state_qty": None, "real_qty": None, "detail": str(e)[:140]}]

    quote = config.QUOTE_ASSET
    tracked_assets = set()

    # 1) cada posicion viva del state vs Binance
    for sym, p in state.get("positions", {}).items():
        if p.get("status") in ("closed", "frozen"):
            continue
        base = _base(sym)
        tracked_assets.add(base)
        sqty = float(p.get("qty", 0) or 0)
        rqty = float(totals.get(base, 0) or 0)
        if sqty <= 0 and rqty <= 0:
            continue
        denom = max(sqty, rqty, 1e-12)
        rel = abs(sqty - rqty) / denom
        # estimo el valor en USD de la diferencia para no alertar por polvo
        try:
            px = ex.price(sym)
        except Exception:
            px = 0.0
        usd_diff = abs(sqty - rqty) * (px or 0)
        if rel > REL_TOL and usd_diff >= DUST_USDT:
            diffs.append({
                "symbol": sym, "kind": "qty_mismatch",
                "state_qty": round(sqty, 8), "real_qty": round(rqty, 8),
                "detail": f"state {sqty:.6f} vs binance {rqty:.6f} (~${usd_diff:.2f})",
            })

    # 2) activos en Binance que el state no trackea (posible holding fantasma)
    for asset, amt in totals.items():
        amt = float(amt or 0)
        if asset == quote or amt <= 0:
            continue
        if asset in tracked_assets:
            continue
        sym = f"{asset}/{quote}"
        try:
            px = ex.price(sym)
        except Exception:
            px = 0.0
        usd = amt * (px or 0)
        if usd >= DUST_USDT:
            diffs.append({
                "symbol": sym, "kind": "untracked_holding",
                "state_qty": 0.0, "real_qty": round(amt, 8),
                "detail": f"Binance tiene {amt:.6f} {asset} (~${usd:.2f}) que el bot no trackea",
            })

    return diffs