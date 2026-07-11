#!/usr/bin/env python3
"""Sistema Semillas 2.0 - Bot de ejecucion diaria.

Corre una vez por dia (cron). Flujo:
  0. Lock anti doble-corrida (P1) + reconciliacion state<->Binance (P5, solo alerta).
  1. Detecta depositos nuevos (loggea separado del P&L).
  2. Gestiona cada posicion abierta segun las reglas Semillas (strategy.decide).
  3. Ejecuta via wrapper unico (P3), actualizando estado SOLO con fill confirmado (P4).
  4. Evalua triggers; si dispara o toca el ciclo mensual, despierta al cerebro.
  5. Manda reporte diario por email (Resend) y persiste estado (no en --dry).

Uso:
  python main.py            # corrida diaria normal
  python main.py --brain    # fuerza correr el cerebro mensual ahora
  python main.py --dry      # no ejecuta ordenes ni persiste estado; solo simula y reporta
"""
import sys
from datetime import date

import config
import state as st
import dashboard
import strategy
import triggers
import notify
import brain_monthly
from exchange import Exchange
import seeds
import scanner
import runlock
import ledger
import execlayer
import p9_runner
import reconcile

DRY = "--dry" in sys.argv
FORCE_BRAIN = "--brain" in sys.argv


def detect_deposits(ex, state):
    """Loggea depositos nuevos para separarlos del P&L."""
    known = {(d["date"], d["amount"], d["asset"]) for d in state["deposits"]}
    new = []
    for d in ex.deposits():
        if d.get("status") not in ("ok", "completed", None):
            continue
        rec = {
            "date": (d.get("datetime") or "")[:10] or st.today_str(),
            "amount": float(d.get("amount") or 0),
            "asset": d.get("currency") or config.QUOTE_ASSET,
        }
        key = (rec["date"], rec["amount"], rec["asset"])
        if key not in known and rec["amount"] > 0:
            new.append(rec)
            state["deposits"].append(rec)
    return new


def execute(ex, action, pos, state, run_id):
    """Aplica una accion al exchange (via wrapper unico) y actualiza el estado.

    P4: el estado SOLO se muta con fill confirmado. Si una venta falla, NO se
    descuenta qty. Si una compra falla/saltea, NO se crea ni agranda la posicion.
    """
    sym = action["symbol"]
    typ = action["type"]

    if typ == "ACTIVATE":
        # confirmacion: pasa a 'confirmed' (la compra semilla ya estaba hecha)
        pos["status"] = "confirmed"
        pos["confirmed_at"] = st.today_str()

    elif typ == "DCA":
        # regimen POR MONEDA: strategy.py ya exige Stage 2 propio; sin gate global.
        adds = pos.get("dca_adds", 0)
        usdt_amt = config.DCA_LADDER[adds] if adds < len(config.DCA_LADDER) else config.DCA_LADDER[-1]
        if not DRY:
            free = float((ex.client.fetch_balance().get("USDT") or {}).get("free", 0) or 0)
            if free < usdt_amt:
                notify.funding_alert(sym, usdt_amt, free)
                print("[dca] " + sym + ": faltan fondos; aviso enviado")
                return pos
        res = execlayer.execute_buy_quote(ex, sym, usdt_amt, "DCA", run_id, DRY, price=action["price"])
        if not res["ok"] or res["filled"] <= 0:
            print(f"[dca] {sym}: no ejecutado ({res['reason']}); estado sin tocar")
            return pos
        added_qty = res["filled"]
        added_cost = res["cost"] or usdt_amt
        old_qty = pos["qty"]
        pos["avg_cost"] = (pos["avg_cost"] * old_qty + added_cost) / (old_qty + added_qty)
        pos["qty"] = old_qty + added_qty
        pos["dca_adds"] = adds + 1

    elif typ == "TAKE_PROFIT":
        sell_qty = pos["qty"] * (action["sell_frac"] / 100.0)
        res = execlayer.execute_sell_base(ex, sym, sell_qty, "TAKE_PROFIT", run_id, DRY)
        if res["ok"] and res["filled"] > 0:
            pos["qty"] -= res["filled"]
            pos.setdefault("tp_hit", []).append(action["level"])
            if len(pos["tp_hit"]) >= len(config.TP_LEVELS):
                pos["status"] = "moonbag"
        else:
            print(f"[tp] {sym}: venta no ejecutada ({res['reason']}); estado sin tocar")

    elif typ == "STOP":
        # stop: preserva moonbag testigo. Vende (qty - keep); estado se ajusta por fill real.
        keep = pos["qty"] * config.MOONBAG_FRAC
        sell_qty = pos["qty"] - keep
        res = execlayer.execute_sell_base(ex, sym, sell_qty, "STOP", run_id, DRY)
        if res["ok"] and res["filled"] > 0:
            pos["qty"] -= res["filled"]
            pos["status"] = "stopped_moonbag"  # P9: terminal, decide() no re-dispara STOP
        else:
            print(f"[stop] {sym}: venta no ejecutada ({res['reason']}); estado sin tocar")

    elif typ == "RUNNER_TP":
        trad = p9_runner.tradable_qty(pos)
        sell_qty = min(trad, pos["qty"] * (action["sell_frac"] / 100.0))
        if sell_qty > 0:
            res = execlayer.execute_sell_base(ex, sym, sell_qty, "RUNNER_TP", run_id, DRY)
            if res["ok"] and res["filled"] > 0:
                pos["qty"] -= res["filled"]
                pos["recovered_usd"] = pos.get("recovered_usd", 0) + (res["cost"] or 0)
                cost_total = (pos.get("avg_cost") or 0) * pos.get("max_qty", 0)
                if pos["recovered_usd"] >= cost_total:
                    pos["capital_recovered"] = True
            else:
                print(f"[runner_tp] {sym}: venta no ejecutada ({res['reason']}); estado sin tocar")

    elif typ == "RUNNER_TRAIL_EXIT":
        sell_qty = p9_runner.tradable_qty(pos)
        if sell_qty > 0:
            res = execlayer.execute_sell_base(ex, sym, sell_qty, "RUNNER_TRAIL", run_id, DRY)
            if res["ok"] and res["filled"] > 0:
                pos["qty"] -= res["filled"]
                pos["recovered_usd"] = pos.get("recovered_usd", 0) + (res["cost"] or 0)
                pos["status"] = "stopped_moonbag"
            else:
                print(f"[runner_trail] {sym}: venta no ejecutada ({res['reason']}); estado sin tocar")

    elif typ == "RUNNER_DCA":
        usdt_amt = action["usdt"]
        if not DRY:
            free = float((ex.client.fetch_balance().get("USDT") or {}).get("free", 0) or 0)
            if free < usdt_amt:
                notify.funding_alert(sym, usdt_amt, free)
                return pos
        res = execlayer.execute_buy_quote(ex, sym, usdt_amt, "RUNNER_DCA", run_id, DRY, price=action["price"])
        if res["ok"] and res["filled"] > 0:
            old_qty = pos["qty"]
            pos["avg_cost"] = (pos["avg_cost"] * old_qty + (res["cost"] or usdt_amt)) / (old_qty + res["filled"])
            pos["qty"] = old_qty + res["filled"]
            if pos["qty"] > pos.get("max_qty", 0):
                pos["max_qty"] = pos["qty"]

    elif typ == "FREEZE":
        # liberar capital de semilla muerta
        if pos["qty"] > 0:
            res = execlayer.execute_sell_base(ex, sym, pos["qty"], "FREEZE", run_id, DRY)
            if res["ok"] and res["filled"] > 0:
                pos["qty"] -= res["filled"]
                if pos["qty"] <= 1e-9:
                    pos["qty"] = 0
                    pos["status"] = "frozen"
                else:
                    print(f"[freeze] {sym}: venta parcial; queda {pos['qty']:.8f}")
            else:
                print(f"[freeze] {sym}: venta no ejecutada ({res['reason']}); no congelo")
        else:
            pos["status"] = "frozen"

    return pos


def manage_positions(ex, state, run_id):
    actions = []
    for sym, pos in list(state["positions"].items()):
        if pos.get("status") in ("closed", "frozen"):
            continue
        try:
            ohlcv = ex.ohlcv(sym, "1d", limit=config.MA_PERIOD + config.CONFIRM_DAYS + 20)
        except Exception as e:
            actions.append({"symbol": sym, "type": "ERROR", "reason": f"sin datos: {e}"})
            continue
        p9_runner.ensure_fields(pos)
        if p9_runner.should_promote(pos, ohlcv):
            p9_runner.promote(pos)
            print(f"[p9] {sym} promovida a RUNNER (moonbag legacy apartada)")
        if pos.get("status") == "runner":
            free_usdt = 0.0
            try:
                free_usdt = float((ex.client.fetch_balance().get("USDT") or {}).get("free", 0) or 0)
            except Exception:
                pass
            equity_est = free_usdt + pos.get("qty", 0) * ohlcv[-1][4]
            action = p9_runner.decide_runner(sym, ohlcv, pos, equity_usdt=equity_est)
        else:
            action = strategy.decide(sym, ohlcv, pos)
        if action and action["type"] not in ("HOLD",):
            _was_open = pos.get("qty", 0) > 0 and pos.get("status") not in ("closed", "frozen")
            _entry = pos.get("avg_cost", 0)
            _qty0 = pos.get("qty", 0)
            _thesis = pos.get("thesis", "")
            newpos = execute(ex, action, pos, state, run_id)
            state["positions"][sym] = newpos
            actions.append(action)
            if _was_open and newpos.get("status") == "closed":
                try:
                    _exit = float(ohlcv[-1][4])
                except Exception:
                    _exit = _entry
                if not _thesis:
                    for _c in state.get("shortlist_full", []):
                        if _c.get("symbol") == sym:
                            _thesis = _c.get("thesis", "")
                            break
                state.setdefault("recent_closed", []).append({
                    "symbol": sym, "entry": _entry, "exit": _exit,
                    "qty_total": round(_qty0, 8),
                    "action": (action.get("type", "") or "").lower(),
                    "pnl_net": round((_exit - _entry) * _qty0, 4),
                    "thesis": _thesis,
                    "opened_ts": pos.get("opened_ts"),
                    "closed_ts": __import__("time").time(),
                })
                state["recent_closed"] = state["recent_closed"][-1000:]
    return actions


def maybe_run_brain(ex, state, trig_hits):
    """Despierta el cerebro si: hay triggers, es nuevo mes, o se forzo."""
    if DRY:
        print("[brain] modo dry: no se consulta el cerebro (se ahorra credito).")
        return None
    today = date.today().isoformat()
    last_succ = state.get("last_brain_success") or state.get("last_brain_run")
    new_month = (last_succ is None) or (last_succ[:7] != today[:7])
    if not (trig_hits or new_month or FORCE_BRAIN):
        return None
    if not FORCE_BRAIN and state.get("last_brain_attempt") == today:
        print("[brain] cooldown: ya se intento hoy; salteo.")
        return None
    state["last_brain_attempt"] = today

    ctx_lines = [f"- {h['symbol']}: {h['signal']} ({h['detail']})" for h in trig_hits]
    ctx = "\n".join(ctx_lines) or "Sin triggers; corrida mensual de rutina."
    _sc = state.get("scanner_raw", [])
    if _sc:
        ctx = ctx + " || Scanner: " + "; ".join("%s sc %.1f st %s m30 %s%% tr %s" % (c["symbol"], c["score"], c["stage"], c["mom30"], c["trending"]) for c in _sc[:12])
    result = brain_monthly.run(ctx)
    if result.get("shortlist"):
        _mk = ex.markets()
        _full = [c for c in result["shortlist"] if c.get("symbol") in _mk]
        state["shortlist"] = [c["symbol"] for c in _full]
        state["shortlist_full"] = _full
        state["last_brain_success"] = today
    state["last_brain_run"] = today
    state["regimen"] = result.get("regimen") or "neutral"
    return result


def build_portfolio_view(ex, state):
    view = {}
    for sym, p in state["positions"].items():
        if p.get("status") in ("closed",):
            continue
        pnl = "-"
        try:
            if p.get("avg_cost"):
                price = ex.price(sym)
                pnl = f"{(price / p['avg_cost'] - 1) * 100:+.1f}%"
        except Exception:
            pass
        view[sym] = {"status": p["status"], "qty": p.get("qty", 0), "pnl_pct": pnl}
    return view


def main():
    run_id = ledger.new_run_id()
    errs = config.validate(require_trading=not config.BINANCE_TESTNET)
    for e in errs:
        print(f"[config] aviso: {e}")

    ex = Exchange()
    state = st.load()

    # P5 - reconciliacion state<->Binance (solo alerta, no auto-corrige)
    try:
        diffs = reconcile.reconcile(ex, state)
        if diffs:
            notify.reconcile_alert(diffs)
            print(f"[reconcile] {len(diffs)} diferencia(s) detectada(s) (ver alerta).")
        else:
            print("[reconcile] state y Binance coinciden.")
    except Exception as e:
        print("[reconcile] fallo:", str(e)[:160])

    # P6 - buffer de liquidez: avisar si el USDT libre cae bajo el colchon
    try:
        _bal = ex.client.fetch_balance()
        _freeq = float((_bal.get(config.QUOTE_ASSET) or {}).get("free", 0) or 0)
        if _freeq < config.LIQUIDITY_BUFFER_USDT:
            print(f"[liquidez] {config.QUOTE_ASSET} libre ${_freeq:.2f} < colchon ${config.LIQUIDITY_BUFFER_USDT}")
            if not DRY:
                notify.liquidity_alert(_freeq, config.LIQUIDITY_BUFFER_USDT)
        else:
            print(f"[liquidez] {config.QUOTE_ASSET} libre ${_freeq:.2f} OK")
    except Exception as e:
        print("[liquidez] check fallo:", str(e)[:120])

    deposits = detect_deposits(ex, state)
    for d in deposits:
        print(f"[deposit] +{d['amount']} {d['asset']} (loggeado, fuera del P&L)")

    try:
        actions = manage_positions(ex, state, run_id)
    except Exception as e:
        actions = []
        print('[main] manage_positions fallo:', str(e)[:160])
    try:
        scanner.apply_to_shortlist(ex, state)
    except Exception as e:
        print('[main] scanner fallo:', str(e)[:160])

    universe = list(set(state.get("shortlist", []) + list(state["positions"].keys())))
    trig_hits = []
    trig_hits += triggers.weekly_move_triggers(ex, universe)
    vol_hits, current_rank = triggers.volume_rank_triggers(ex, state)
    trig_hits += vol_hits
    state["prev_volume_rank"] = current_rank
    trig_hits += triggers.news_triggers(state, universe)

    brain = maybe_run_brain(ex, state, trig_hits)
    # P7: plantar semillas DESPUES del brain, para usar la shortlist fresca
    try:
        actions += seeds.plant_seeds(ex, state, DRY, run_id)
    except Exception as e:
        print('[main] plant_seeds fallo:', str(e)[:160])
    brain_summary = brain.get("summary") if brain else None
    if brain and not brain.get("shortlist"):
        brain_summary = "BRAIN VACIO (revisar credito Anthropic). " + (brain_summary or "")

    portfolio = build_portfolio_view(ex, state)
    html = notify.daily_report(actions, trig_hits, portfolio, brain_summary, config.BINANCE_TESTNET)
    mode = "TESTNET" if config.BINANCE_TESTNET else "REAL"
    dry = " [DRY]" if DRY else ""
    notify.send(f"Semillas - {st.today_str()} ({mode}){dry}", html)

    if DRY:
        print("[dry] estado NO persistido (corrida observadora).")
    else:
        st.save(state)
        dashboard.update()
    try:
        import learning_loop
        learning_loop.run(state)
        import loop_analista
        loop_analista.run()
    except Exception as e:
        print("[learn] fallo no critico:", str(e)[:160])

    print(f"[ok] corrida completa. run_id={run_id}. {len(actions)} acciones, {len(trig_hits)} triggers.")


if __name__ == "__main__":
    try:
        with runlock.run_lock():
            main()
    except runlock.LockBusy as e:
        print("[lock]", e)