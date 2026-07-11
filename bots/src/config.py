"""Carga y validacion de configuracion desde .env."""
import os
from dotenv import load_dotenv

load_dotenv()


def _f(key, default):
    return float(os.getenv(key, default))


def _i(key, default):
    return int(os.getenv(key, default))


def _parse_tp(raw):
    """ '30:25,60:25,120:25' -> [(30.0, 25.0), (60.0, 25.0), (120.0, 25.0)] """
    levels = []
    for chunk in raw.split(","):
        chunk = chunk.strip()
        if not chunk:
            continue
        gain, frac = chunk.split(":")
        levels.append((float(gain), float(frac)))
    return sorted(levels, key=lambda x: x[0])


# --- Binance ---
BINANCE_API_KEY = os.getenv("BINANCE_API_KEY", "")
BINANCE_API_SECRET = os.getenv("BINANCE_API_SECRET", "")
BINANCE_TESTNET = os.getenv("BINANCE_TESTNET", "true").lower() == "true"
QUOTE_ASSET = os.getenv("QUOTE_ASSET", "USDT")

# --- Email ---
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "")
EMAIL_TO = os.getenv("EMAIL_TO", "")

# --- Claude ---
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY", "")

# --- Estrategia ---
MA_PERIOD = _i("MA_PERIOD", 30)
CONFIRM_DAYS = _i("CONFIRM_DAYS", 10)
SLOPE_LOOKBACK = _i("SLOPE_LOOKBACK", 5)

SEED_SIZE_USDT = _f("SEED_SIZE_USDT", 7)
MAX_SEEDS = _i("MAX_SEEDS", 60)
MAX_DCA_ADDS = _i("MAX_DCA_ADDS", 3)
DCA_SIZE_USDT = _f("DCA_SIZE_USDT", 7)

TP_LEVELS = _parse_tp(os.getenv("TP_LEVELS", "30:25,60:25,120:25"))
MOONBAG_PCT = _f("MOONBAG_PCT", 25)

FREEZE_DAYS = _i("FREEZE_DAYS", 60)

# --- Triggers ---
TRIGGER_WEEKLY_MOVE = _f("TRIGGER_WEEKLY_MOVE", 25)
TRIGGER_VOLUME_MULT = _f("TRIGGER_VOLUME_MULT", 3)
RSS_FEEDS = [u.strip() for u in os.getenv("RSS_FEEDS", "").split(",") if u.strip()]
RSS_KEYWORDS = [k.strip().lower() for k in os.getenv("RSS_KEYWORDS", "").split(",") if k.strip()]


def validate(require_trading=False):
    """Chequea que lo minimo este seteado. Devuelve lista de errores."""
    errs = []
    if not BINANCE_API_KEY or not BINANCE_API_SECRET:
        errs.append("Falta BINANCE_API_KEY / BINANCE_API_SECRET")
    if not RESEND_API_KEY:
        errs.append("Falta RESEND_API_KEY (reportes por email desactivados)")
    if not EMAIL_TO:
        errs.append("Falta EMAIL_TO")
    if require_trading and BINANCE_TESTNET:
        errs.append("BINANCE_TESTNET=true pero pediste modo real")
    return errs

SCAN_FEED = os.getenv("SCAN_FEED", "brain")
SCAN_TOP = _i("SCAN_TOP", 12)
SCAN_SHORTLIST_N = _i("SCAN_SHORTLIST_N", 3)

DCA_LADDER = [6, 6, 6]  # refuerzos escalonados en USDT (add 1, 2, 3)
MAX_AUTO_CLAMP_USDT = _f("MAX_AUTO_CLAMP_USDT", 10)  # P3: tope para subir una orden al min_notional; si el min supera esto, se saltea
SEEDS_PER_MONTH = _i("SEEDS_PER_MONTH", 3)
MOONBAG_FRAC = _f("MOONBAG_FRAC", 0.10)

LIQUIDITY_BUFFER_USDT = _f("LIQUIDITY_BUFFER_USDT", 15)  # P6 colchon minimo USDT libre

# --- P9/P11 (aprobado 29/jun: Agus + Grok + ChatGPT + Claude) ---
RUNNER_TRIGGER_DCA = _i("RUNNER_TRIGGER_DCA", 2)
RUNNER_TRIGGER_PNL = _f("RUNNER_TRIGGER_PNL", 45.0)
LEGACY_MOONBAG_FRAC = _f("LEGACY_MOONBAG_FRAC", 0.15)
RUNNER_TRAIL_LOOKBACK = _i("RUNNER_TRAIL_LOOKBACK", 10)
RUNNER_DCA_USDT = _f("RUNNER_DCA_USDT", 6.0)
RUNNER_MAX_EXPOSURE_FRAC = _f("RUNNER_MAX_EXPOSURE_FRAC", 0.30)
RUNNER_RECOVER_SELL_FRAC = _f("RUNNER_RECOVER_SELL_FRAC", 0.25)