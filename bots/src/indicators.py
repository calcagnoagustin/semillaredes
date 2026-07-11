"""Indicadores técnicos puros. Entrada: lista de velas OHLCV de ccxt.
Sin red ni estado -> fáciles de testear.
"""


def closes(ohlcv):
    return [c[4] for c in ohlcv]


def volumes(ohlcv):
    return [c[5] for c in ohlcv]


def sma(values, period):
    """Media móvil simple. Devuelve lista alineada (None hasta tener 'period')."""
    out = []
    for i in range(len(values)):
        if i + 1 < period:
            out.append(None)
        else:
            window = values[i + 1 - period:i + 1]
            out.append(sum(window) / period)
    return out


def slope(series, lookback):
    """Pendiente simple: valor actual - valor hace 'lookback'. >0 sube, <0 baja."""
    vals = [v for v in series if v is not None]
    if len(vals) <= lookback:
        return 0.0
    return vals[-1] - vals[-1 - lookback]


def pct_return(values, periods):
    if len(values) <= periods or values[-1 - periods] == 0:
        return 0.0
    return (values[-1] / values[-1 - periods] - 1) * 100


def volume_spike(ohlcv, window=20):
    """Ratio del volumen actual vs promedio de las últimas 'window' velas."""
    vols = volumes(ohlcv)
    if len(vols) < window + 1:
        return 1.0
    avg = sum(vols[-window - 1:-1]) / window
    if avg == 0:
        return 1.0
    return vols[-1] / avg


def stage(ohlcv, ma_period, slope_lookback):
    """Proxy de Stan Weinstein Stage Analysis.
       Stage 2 = precio > MA y MA en alza (tendencia alcista confirmada).
       Stage 4 = precio < MA y MA en baja (tendencia bajista -> invalidación).
       Devuelve: 2 (alcista), 4 (bajista), o 1/3 (transición/lateral).
    """
    cl = closes(ohlcv)
    ma = sma(cl, ma_period)
    if ma[-1] is None:
        return None
    price = cl[-1]
    ma_now = ma[-1]
    ma_slope = slope(ma, slope_lookback)

    if price > ma_now and ma_slope > 0:
        return 2
    if price < ma_now and ma_slope < 0:
        return 4
    if price > ma_now:
        return 3  # sobre MA pero MA aún no gira -> transición alcista
    return 1      # bajo MA pero MA no cae -> base/lateral


def consecutive_stage2(ohlcv, ma_period, slope_lookback, n):
    """¿Hubo Stage 2 sostenido los últimos 'n' días? Confirmación de entrada."""
    cl = closes(ohlcv)
    ma = sma(cl, ma_period)
    if len(cl) < ma_period + n + slope_lookback:
        return False
    for i in range(n):
        idx = len(cl) - 1 - i
        if ma[idx] is None:
            return False
        if cl[idx] <= ma[idx]:
            return False
        # pendiente local de la MA en ese punto
        if ma[idx] - ma[idx - slope_lookback] <= 0:
            return False
    return True