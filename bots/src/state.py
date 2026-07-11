"""Estado persistente del bot (JSON en disco, con deduplicación).

Estructura de state.json:
{
  "positions": {
     "WLD/USDT": {
        "status": "seed" | "confirmed" | "moonbag" | "frozen" | "closed",
        "planted_at": "2026-06-18",
        "confirmed_at": "2026-06-25" | null,
        "qty": 12.34,                # cantidad base en cartera (gestionada por el bot)
        "avg_cost": 1.83,           # costo promedio
        "dca_adds": 1,              # cuántos agregados se hicieron
        "tp_hit": [30],             # niveles de TP ya ejecutados
        "tag": "NARRATIVA" | null
     }
  },
  "shortlist": ["WLD/USDT", "PENDLE/USDT", ...],
  "prev_volume_rank": {"WLD/USDT": 84, ...},
  "seen_news": ["hash1", "hash2", ...],     # dedup de noticias ya reportadas
  "deposits": [{"date": "...", "amount": 50.0, "asset": "USDT"}],
  "last_brain_run": "2026-06-01",
  "narrativa_active": "XYZ/USDT" | null
}
"""
import json
import os
from datetime import date

STATE_PATH = os.getenv("SEMILLAS_STATE", os.path.join(os.path.dirname(__file__), "state.json"))

_DEFAULT = {
    "positions": {},
    "shortlist": [],
    "prev_volume_rank": {},
    "seen_news": [],
    "deposits": [],
    "last_brain_run": None,
    "narrativa_active": None,
}


def load():
    if not os.path.exists(STATE_PATH):
        return json.loads(json.dumps(_DEFAULT))
    with open(STATE_PATH, "r") as f:
        data = json.load(f)
    # rellenar claves nuevas si el archivo es viejo
    for k, v in _DEFAULT.items():
        data.setdefault(k, json.loads(json.dumps(v)))
    return data


def save(state):
    tmp = STATE_PATH + ".tmp"
    with open(tmp, "w") as f:
        json.dump(state, f, indent=2, ensure_ascii=False)
    os.replace(tmp, STATE_PATH)  # escritura atómica


def today_str():
    return date.today().isoformat()