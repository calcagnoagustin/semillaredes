"""Migracion de state.json v1 -> v2. Correr UNA vez en el deploy (con backup previo).
- Retira restos del modo runner (status 'runner' -> 'confirmed'; campos quedan inertes).
- Inicializa seeds_planted (mes actual con las ya plantadas este mes) y garden_plan vacio.
- Agrega 'origen' a posiciones existentes (heuristica: tesis 'scanner score' -> scanner).
"""
import datetime
import json
import shutil
import sys

PATH = "/home/opc/bot_semillas/state.json"

def migrate(path=PATH):
    shutil.copy(path, path + ".bak_prev2")
    d = json.load(open(path))
    mes = datetime.datetime.utcnow().strftime("%Y-%m")
    planted = []
    for sym, p in d.get("positions", {}).items():
        if p.get("status") == "runner":
            p["status"] = "confirmed"
        if "origen" not in p:
            p["origen"] = "scanner" if str(p.get("thesis", "")).startswith("scanner") else "desconocido"
        if str(p.get("planted_at", ""))[:7] == mes and p.get("status") in ("seed", "confirmed"):
            planted.append(sym)
    d.setdefault("seeds_planted", {})
    d["seeds_planted"].setdefault(mes, planted)
    d.setdefault("garden_plan", {})
    d.setdefault("recent_closed", [])
    json.dump(d, open(path, "w"), indent=1)
    print("migracion v2 OK — runner retirado, seeds_planted[%s]=%s" % (mes, planted))

if __name__ == "__main__":
    migrate(sys.argv[1] if len(sys.argv) > 1 else PATH)
