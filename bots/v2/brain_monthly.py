"""CEREBRO v2 (claude-opus-4-8 + web_search).

Dos salidas mensuales:
1) shortlist de 10-12 candidatos (balance AT + fundamentales + narrativa) que el
   JARDINERO vigila a diario para plantar con timing (tope 3 semillas/mes).
2) gestion de cartera: por cada posicion activa dictamina reforzar (con monto y
   razon) / mantener / liquidar / dust. garden.py lo ejecuta con vetos duros.

Devuelve dict: {"regimen", "summary", "shortlist": [...], "portfolio": [...], "raw"}
"""
import json
import requests
import config

MODEL = "claude-opus-4-8"

SYSTEM = """Sos el cerebro del Sistema Semillas v2: especulacion disciplinada en
Binance Spot (sin leverage, sin futuros). Tenes DOS trabajos este mes.

TRABAJO 1 — SHORTLIST (10 a 12 candidatos)
Deteccion temprana de monedas con potencial de EXPLOTAR: transicion Stage 1->2
(Weinstein) o acumulacion Wyckoff, ANTES del movimiento grande. Dos canastas:
launches recientes de Binance (type="launch") e historicas en reaceleracion
(type="historica"); momentum de mediana data: type="momentum".
BALANCE OBLIGATORIO: cada candidato debe tener sustento de AT (tendencia, medias,
volumen, RSI, rupturas — que el timing diario del jardinero PUEDA activarse) Y
de contexto (fundamentales, narrativa, noticias, redes, posicion en Binance).
Una shortlist puramente fundamental que no se mueve NO sirve: el jardinero
necesita rupturas para plantar. Cruza senales con web_search (Google Trends,
social, Binance trending, on-chain). Liquidez sana obligatoria. No persigas
Stage 3/4 ni cosas parabolicas. Se honesto: si hay poco bueno, lista corta.

TRABAJO 2 — GESTION DE CARTERA (portfolio)
Te paso las posiciones actuales con su estado y P&L. Por CADA una dictamina:
- "reforzar": tesis viva y fuerte -> proponer dca_usdt concreto (respetando el
  presupuesto disponible que te paso; el sistema ademas aplica tope 20% por
  moneda y veto Stage 2, asi que propone solo si la tendencia acompana).
- "mantener": sin cambios.
- "liquidar": tesis muerta; liberar capital. (Moonbags con tesis viva: el
  sistema solo se lo recomienda a Agus, no lo ejecuta solo.)
- "dust": posicion pulverizada sin valor operativo.
Cada dictamen con "razon" fundada (1-2 frases).

REGIMEN: lee el macro del mes -> "risk_on" | "neutral" | "risk_off".

SALIDA: no mas de ~8 busquedas; despues ESCRIBI el JSON. Tu ULTIMO mensaje debe
ser EXCLUSIVAMENTE un JSON valido, sin markdown, con forma:
{"regimen":"...","summary":"2-3 frases macro",
"shortlist":[{"symbol":"XXX/USDT","rank":1,"type":"launch|historica|momentum",
 "stage":"1|2","thesis":"1-2 frases accionables",
 "fundamentals":"que hace, sector, por que ahora","catalyst":"...",
 "signals":{"google_trends":"...","social":"...","binance":"...","onchain":"..."},
 "risk":"...","sources":["url"]}],
"portfolio":[{"symbol":"XXX/USDT","verdict":"reforzar|mantener|liquidar|dust",
 "dca_usdt":0,"razon":"..."}]}
Shortlist: entre 10 y 12, rankeados por asimetria/conviccion, operables en
Binance Spot."""

def _positions_context(state, budget):
    lines = []
    for sym, p in (state.get("positions") or {}).items():
        if p.get("status") in ("closed",):
            continue
        lines.append("- %s: status=%s qty=%.6g avg=%.6g dca_adds=%s tp_hit=%s origen=%s tesis=%s"
                     % (sym, p.get("status"), p.get("qty", 0), p.get("avg_cost", 0),
                        p.get("dca_adds", 0), p.get("tp_hit", []),
                        p.get("origen", "?"), str(p.get("thesis", ""))[:100]))
    txt = "\n".join(lines) or "(sin posiciones)"
    return ("POSICIONES ACTUALES:\n" + txt +
            f"\n\nPRESUPUESTO DISPONIBLE PARA REFUERZOS ESTE MES: ~${budget:.0f} USDT "
            f"(ya descontada la reserva intocable de semillas+colchon).")

def run(candidates_context, state=None, budget=0.0):
    if not config.ANTHROPIC_API_KEY:
        return {"shortlist": [], "portfolio": [],
                "summary": "ANTHROPIC_API_KEY no configurada.", "raw": ""}
    user = ("Disparadores y contexto tecnico detectados este ciclo:\n\n"
            + candidates_context + "\n\n"
            + (_positions_context(state, budget) if state is not None else "")
            + "\n\nResearchea con web_search, cruza senales, y devolve el JSON "
              "especificado con shortlist (10-12) y portfolio (dictamen por posicion).")
    headers = {"x-api-key": config.ANTHROPIC_API_KEY,
               "anthropic-version": "2023-06-01",
               "content-type": "application/json"}
    messages = [{"role": "user", "content": user}]
    text = ""
    try:
        for _ in range(6):
            r = requests.post("https://api.anthropic.com/v1/messages",
                              headers=headers,
                              json={"model": MODEL, "max_tokens": 12000,
                                    "system": SYSTEM, "messages": messages,
                                    "tools": [{"type": "web_search_20250305",
                                               "name": "web_search", "max_uses": 8}]},
                              timeout=300)
            data = r.json()
            content = data.get("content")
            if not content:
                return {"shortlist": [], "portfolio": [],
                        "summary": "Cerebro: respuesta sin content (%s)" % str(
                            data.get("error") or data.get("type")),
                        "raw": json.dumps(data)[:2000]}
            blocks = [b.get("text", "") for b in content if b.get("type") == "text"]
            if blocks:
                text = blocks[-1]
            if data.get("stop_reason") == "pause_turn":
                messages.append({"role": "assistant", "content": content})
                continue
            break
        text = (text or "").strip()
        clean = text.replace("```json", "").replace("```", "").strip()
        a = clean.find("{"); b = clean.rfind("}")
        if a != -1 and b > a:
            clean = clean[a:b + 1]
        parsed = json.loads(clean)
        try:
            import tokenomics
            if isinstance(parsed.get("shortlist"), list):
                parsed["shortlist"] = tokenomics.annotate_shortlist(parsed["shortlist"])
        except Exception as _te:
            print("[brain] tokenomics skip:", str(_te)[:120])
        parsed.setdefault("regimen", "neutral")
        parsed.setdefault("portfolio", [])
        parsed["raw"] = text
        return parsed
    except Exception as e:
        return {"shortlist": [], "portfolio": [],
                "summary": f"Error en cerebro: {e}", "raw": text[:2000]}
