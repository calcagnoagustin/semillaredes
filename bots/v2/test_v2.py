"""Tests locales v2 (stubs, sin red). Correr: python3 test_v2.py"""
import sys, types, json, datetime

# ---------- stubs de modulos que v2 importa ----------
def _mod(name):
    m = types.ModuleType(name)
    sys.modules[name] = m
    return m

ind = _mod("indicators")
ind.STAGE = 2
ind.CONSEC = True
ind.stage = lambda ohlcv, ma=30, sl=5: ind.STAGE
ind.closes = lambda ohlcv: [c[4] for c in ohlcv]
ind.consecutive_stage2 = lambda ohlcv, ma, sl, days: ind.CONSEC

stmod = _mod("state")
stmod.today_str = lambda: "2026-07-11"

ex_calls = {"buys": [], "sells": []}
execl = _mod("execlayer")
def _buy(ex, sym, quote, intent, run_id, dry, price=None):
    ex_calls["buys"].append((sym, quote, intent))
    return {"ok": True, "filled": quote / (price or 1.0), "cost": quote,
            "avg": price or 1.0, "order_id": "t", "reason": "filled",
            "status": "filled", "dry": dry, "clamped": False}
def _sell(ex, sym, qty, intent, run_id, dry):
    ex_calls["sells"].append((sym, qty, intent))
    return {"ok": True, "filled": qty, "cost": qty * 1.0, "avg": 1.0,
            "order_id": "t", "reason": "filled", "status": "filled", "dry": dry}
execl.execute_buy_quote = _buy
execl.execute_sell_base = _sell

mails = []
noti = _mod("notify")
noti.send = lambda subj, html: mails.append(subj)
noti.daily_report = lambda *a: "<html/>"
noti.funding_alert = noti.reconcile_alert = noti.liquidity_alert = lambda *a: None
noti.exec_alert = lambda *a: None

for name in ("dashboard", "ledger", "runlock", "reconcile", "scanner",
             "triggers", "brain_monthly", "tokenomics", "learning_loop",
             "loop_analista"):
    _mod(name)
sys.modules["ledger"].new_run_id = lambda: "TEST"
sys.modules["dashboard"].update = lambda: None

exch = _mod("exchange")
class FakeEx:
    def __init__(self):
        self.px = 1.0
    def ohlcv(self, sym, tf, limit=100):
        # 100 velas planas con cierre = self.px (ultimo = maximo si px sube)
        return [[i, self.px, self.px * 1.01, self.px * 0.99, self.px, 100]
                for i in range(limit)]
    def price(self, sym):
        return self.px
    class client:
        @staticmethod
        def fetch_balance():
            return {"USDT": {"free": 100.0}}
exch.Exchange = FakeEx

sys.path.insert(0, ".")
import config          # v2 config real (usa dotenv)
import strategy
import seeds
import garden

OK, FAIL = 0, 0
def check(name, cond):
    global OK, FAIL
    print(("  ok  " if cond else "  FAIL") + " - " + name)
    OK, FAIL = OK + (1 if cond else 0), FAIL + (0 if cond else 1)

# ---------- strategy ----------
print("== strategy ==")
ohl = [[i, 1, 1.01, 0.99, 1.0, 100] for i in range(80)]
ind.STAGE, ind.CONSEC = 2, True
a = strategy.decide("A/USDT", ohl, {"status": "moonbag", "qty": 5, "avg_cost": 1})
check("revival moonbag->REVIVE", a["type"] == "REVIVE")
ind.CONSEC = False
a = strategy.decide("A/USDT", ohl, {"status": "stopped_moonbag", "qty": 5, "avg_cost": 1})
check("moonbag sin stage2 -> HOLD (nunca re-vende)", a["type"] == "HOLD")
ind.STAGE = 4
# estructura intacta: cierre 1.0 > min(lows 30d)=0.99 -> frac fuerte
a = strategy.decide("A/USDT", ohl, {"status": "confirmed", "qty": 50, "avg_cost": 1})
check("stop estructura intacta -> moonbag 25%", a["type"] == "STOP"
      and abs(a["moonbag_frac"] - config.MOONBAG_FRAC_STRONG) < 1e-9)
ohl2 = [r[:] for r in ohl]
ohl2[-1][4] = 0.90  # cierre rompe los suelos
a = strategy.decide("A/USDT", ohl2, {"status": "confirmed", "qty": 50, "avg_cost": 1})
check("stop estructura rota -> moonbag 10%", a["type"] == "STOP"
      and abs(a["moonbag_frac"] - config.MOONBAG_FRAC_WEAK) < 1e-9)
ind.STAGE = 2
a = strategy.decide("A/USDT", ohl, {"status": "confirmed", "qty": 50, "avg_cost": 0.5,
                                    "tp_hit": []})
check("TP +100% dispara el nivel pendiente mas bajo (30)",
      a["type"] == "TAKE_PROFIT" and a["level"] == 30)
a = strategy.decide("A/USDT", ohl, {"status": "seed", "qty": 10, "avg_cost": 1,
                                    "planted_at": "2026-04-01"})
check("semilla vieja -> FREEZE", a["type"] == "FREEZE")

# ---------- seeds (timing + origen + tope mensual) ----------
print("== seeds ==")
ind.STAGE, ind.CONSEC = 2, True
fake = FakeEx()
state = {"positions": {}, "last_brain_success": "2026-07-01",
         "shortlist_full": [{"symbol": f"C{i}/USDT", "thesis": f"tesis {i}"}
                            for i in range(6)],
         "scanner_raw": []}
acts = seeds.plant_seeds(fake, state, DRY=False, run_id="T")
p = state["positions"]
check("planta hasta 3 con brain fresco", len(p) == 3)
check("origen=brain y tesis del cerebro",
      all(v["origen"] == "brain" and v["thesis"].startswith("tesis") for v in p.values()))
check("registro mensual", len(state["seeds_planted"]["2026-07"]) == 3)
acts = seeds.plant_seeds(fake, state, DRY=False, run_id="T")
check("no planta mas de 3 en el mes", len(state["positions"]) == 3)
state2 = {"positions": {}, "last_brain_success": "2026-05-01",  # viejo
          "shortlist_full": [{"symbol": "X/USDT", "thesis": "brain viejo"}],
          "scanner_raw": [{"symbol": "S/USDT", "score": 5.0, "stage": 2,
                           "mom30": 10, "trending": False}]}
seeds.plant_seeds(fake, state2, DRY=False, run_id="T")
check("fallback scanner con brain viejo",
      "S/USDT" in state2["positions"]
      and state2["positions"]["S/USDT"]["origen"] == "scanner")

# ---------- garden ----------
print("== garden ==")
ind.STAGE = 2
fake.px = 1.0
gstate = {"positions": {"G/USDT": {"symbol": "G/USDT", "status": "confirmed",
                                   "qty": 10.0, "avg_cost": 1.0, "dca_adds": 0},
                        "M/USDT": {"symbol": "M/USDT", "status": "stopped_moonbag",
                                   "qty": 8.0, "avg_cost": 2.0},
                        "V/USDT": {"symbol": "V/USDT", "status": "moonbag",
                                   "qty": 20.0, "avg_cost": 1.0}},
          "garden_plan": {"month": datetime.datetime.utcnow().strftime("%Y-%m"),
                          "verdicts": [
                              {"symbol": "G/USDT", "verdict": "reforzar",
                               "dca_usdt": 20, "razon": "fuerte"},
                              {"symbol": "M/USDT", "verdict": "liquidar",
                               "razon": "tesis muerta"},
                              {"symbol": "V/USDT", "verdict": "liquidar",
                               "razon": "cansada"}],
                          "done": [], "warned": []}}
mails.clear(); ex_calls["buys"].clear(); ex_calls["sells"].clear()
acts = garden.run(fake, gstate, DRY=False, run_id="T")
g = gstate["positions"]["G/USDT"]
check("DCA reforzar ejecutado", any(b[2] == "GARDEN_DCA" for b in ex_calls["buys"])
      and g["qty"] > 10.0 and g["dca_adds"] == 1)
check("liquida tesis muerta (stopped)", gstate["positions"]["M/USDT"]["status"] == "closed")
check("moonbag viva NO se liquida sola", gstate["positions"]["V/USDT"]["qty"] == 20.0)
check("recomendacion por mail para moonbag viva",
      any("recomienda cerrar" in m for m in mails))
# tope por moneda: posicion ya al 20% del equity
fake.px = 1.0
big = {"positions": {"B/USDT": {"symbol": "B/USDT", "status": "confirmed",
                                "qty": 60.0, "avg_cost": 1.0, "dca_adds": 0}},
       "garden_plan": {"month": datetime.datetime.utcnow().strftime("%Y-%m"),
                       "verdicts": [{"symbol": "B/USDT", "verdict": "reforzar",
                                     "dca_usdt": 30, "razon": "x"}],
                       "done": [], "warned": []}}
ex_calls["buys"].clear()
garden.run(fake, big, DRY=False, run_id="T")  # equity=100+60=160; cap 20%=32<60 -> skip
check("tope 20% por moneda bloquea el refuerzo",
      not any(b[2] == "GARDEN_DCA" for b in ex_calls["buys"]))

# ---------- main.execute (STOP piso moonbag + REVIVE + historial) ----------
print("== main.execute ==")
import main as mainmod
mstate = {"positions": {}, "deposits": [], "recent_closed": []}
pos = {"symbol": "P/USDT", "status": "confirmed", "qty": 50.0, "avg_cost": 1.0,
       "thesis": "t"}
act = {"type": "STOP", "symbol": "P/USDT", "price": 1.0, "qty": 50.0,
       "moonbag_frac": 0.25}
ex_calls["sells"].clear()
newpos = mainmod.execute(fake, act, pos, mstate, "T")
check("stop conserva moonbag 25% (>= piso $10)",
      newpos["status"] == "stopped_moonbag" and abs(newpos["qty"] - 12.5) < 1e-6)
check("historial registra el stop", len(mstate["recent_closed"]) == 1
      and mstate["recent_closed"][0]["action"] == "stop")
pos2 = {"symbol": "D/USDT", "status": "seed", "qty": 6.0, "avg_cost": 1.0}
act2 = {"type": "STOP", "symbol": "D/USDT", "price": 1.0, "qty": 6.0,
        "moonbag_frac": 0.10}
mails.clear()
newpos2 = mainmod.execute(fake, act2, pos2, mstate, "T")
check("posicion < piso: sale 100% + aviso",
      newpos2["status"] == "closed" and newpos2["qty"] == 0
      and any("sin testigo" in m for m in mails))
pos3 = {"symbol": "R/USDT", "status": "moonbag", "qty": 12, "avg_cost": 1.0}
mainmod.execute(fake, {"type": "REVIVE", "symbol": "R/USDT", "price": 1.0},
                pos3, mstate, "T")
check("revive -> confirmed con fecha", pos3["status"] == "confirmed"
      and pos3["confirmed_at"] == "2026-07-11")

print("\nRESULTADO: %d ok, %d fail" % (OK, FAIL))
sys.exit(1 if FAIL else 0)
