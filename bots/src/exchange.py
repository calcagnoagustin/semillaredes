"""Capa de acceso a Binance Spot vía ccxt. Soporta testnet (sandbox)."""
import ccxt
import config


class Exchange:
    def __init__(self):
        self.client = ccxt.binance({
            "apiKey": config.BINANCE_API_KEY,
            "secret": config.BINANCE_API_SECRET,
            "enableRateLimit": True,
            "options": {"defaultType": "spot"},
        })
        if config.BINANCE_TESTNET:
            self.client.set_sandbox_mode(True)
        self._markets = None

    # ---------- lectura ----------
    def markets(self):
        if self._markets is None:
            self._markets = self.client.load_markets()
        return self._markets

    def ohlcv(self, symbol, timeframe="1d", limit=200):
        """Devuelve lista de [ts, open, high, low, close, volume]."""
        return self.client.fetch_ohlcv(symbol, timeframe=timeframe, limit=limit)

    def price(self, symbol):
        return self.client.fetch_ticker(symbol)["last"]

    def tickers(self):
        """Todos los tickers 24h. Para ranking por volumen."""
        return self.client.fetch_tickers()

    def balance(self, asset=None):
        bal = self.client.fetch_balance()
        if asset:
            return bal.get("total", {}).get(asset, 0.0)
        return bal

    def deposits(self, since_ms=None):
        try:
            return self.client.fetch_deposits(since=since_ms)
        except Exception:
            return []

    # ---------- ejecución ----------
    def market_buy_quote(self, symbol, quote_amount):
        """Compra a mercado gastando 'quote_amount' de la quote (USDT)."""
        return self.client.create_order(
            symbol, "market", "buy", None, None,
            {"quoteOrderQty": quote_amount},
        )

    def market_sell_base(self, symbol, base_qty):
        """Vende a mercado 'base_qty' del activo base, acotado al balance LIBRE real."""
        base = symbol.split("/")[0]
        free = float((self.client.fetch_balance().get(base) or {}).get("free", 0) or 0)
        base_qty = min(float(base_qty), free)
        base_qty = float(self.client.amount_to_precision(symbol, base_qty))
        if base_qty <= 0:
            print(f"[sell] {symbol}: balance libre {free} insuficiente, venta omitida")
            return None
        try:
            _t = self.client.fetch_ticker(symbol)
            _last = float((_t or {}).get("last") or 0)
            if _last and base_qty * _last < self.min_notional(symbol):
                print("[sell] " + symbol + ": dust < min_notional, venta omitida")
                return None
        except Exception as _e:
            print("[sell] " + symbol + ": min_notional check fallo: " + str(_e)[:80])
        try:
            return self.client.create_order(symbol, "market", "sell", base_qty)
        except Exception as _e:
            print("[sell] " + symbol + ": orden rechazada: " + str(_e)[:140] + " -- sigo sin cortar")
            return None

    def min_notional(self, symbol):
        m = self.markets().get(symbol, {})
        limits = m.get("limits", {})
        cost = (limits.get("cost") or {}).get("min")
        return cost or 5.0  # fallback típico de Binance