"""P2 - Ledger append-only de ordenes (orders.jsonl).

Verdad de ejecucion del sistema. Cada intento de orden (exitoso, parcial,
fallido o salteado) deja un registro. NUNCA se reescribe: solo se appendea.
El run_id agrupa todas las acciones de una misma corrida.
"""
import os
import json
import time
import datetime

LEDGER_PATH = os.getenv("SEMILLAS_LEDGER", os.path.join(os.path.dirname(__file__), "orders.jsonl"))


def new_run_id():
    """ID de corrida estable: UTC compacto, p.ej. 20260629T001500Z."""
    return datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")


def append(run_id, symbol, intent, side,
           requested_quote=None, requested_qty=None,
           order_id=None, status="unknown",
           filled=0.0, cost=0.0, avg=0.0, raw=None, extra=None):
    """Appendea un registro al ledger. Nunca lanza: si falla, loggea y sigue.

    status: filled | partial | failed | skipped | skipped_min_notional | dry
    """
    rec = {
        "ts": time.time(),
        "iso": datetime.datetime.utcnow().isoformat() + "Z",
        "run_id": run_id,
        "symbol": symbol,
        "intent": intent,            # SEED / DCA / TAKE_PROFIT / STOP / FREEZE
        "side": side,                # buy / sell
        "requested_quote": requested_quote,
        "requested_qty": requested_qty,
        "order_id": order_id,
        "status": status,
        "filled": round(float(filled or 0), 10),
        "cost": round(float(cost or 0), 10),
        "avg": round(float(avg or 0), 10),
    }
    if extra:
        rec.update(extra)
    if raw is not None:
        # recorto el raw para no inflar el archivo
        try:
            rec["raw"] = {k: raw.get(k) for k in ("id", "status", "filled", "cost", "average", "amount", "side", "symbol") if isinstance(raw, dict)}
        except Exception:
            rec["raw"] = None
    try:
        with open(LEDGER_PATH, "a") as f:
            f.write(json.dumps(rec, ensure_ascii=False) + "\n")
    except Exception as e:
        print("[ledger] no se pudo escribir:", str(e)[:120])
    return rec