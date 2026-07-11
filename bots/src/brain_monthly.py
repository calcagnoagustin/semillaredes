"""Cerebro mensual de seleccion (llama a Claude API con web_search).

Filosofia: filtro barato (triggers) primero; el LLM corre SOLO sobre lo que pasa
el filtro. Scout multi-senal: busca asimetrias tempranas (monedas que explotan)
con disciplina. Produce shortlist rankeado con fundamentales, senales y tesis.

Devuelve dict: {"regimen": "...", "summary": "...", "shortlist": [...], "raw": "..."}
"""
import json
import requests
import config

MODEL = "claude-opus-4-8"

SYSTEM = """Sos el cerebro de seleccion del Sistema Semillas 2.0: especulacion
disciplinada en Binance Spot (sin leverage, sin futuros). Tu trabajo es encontrar
monedas con potencial de EXPLOTAR temprano (asimetria grande), sin perder la
disciplina del sistema.

OBJETIVO
Detectar criptos en transicion Stage 1->2 (Weinstein) o en acumulacion Wyckoff,
ANTES del movimiento grande, con confirmacion tecnica. Buscas "el proximo Kite":
proyectos que arrancan a moverse con narrativa + volumen + interes creciente.

DOS CANASTAS (cubri las dos en cada run)
1) LAUNCHES RECIENTES de Binance: listings nuevos, Launchpool, Launchpad, Megadrop,
   HODLer Airdrops. Tickers recien salidos con volumen real. Marca type="launch".
2) HISTORICAS EN REACELERACION: proyectos con +1 ano de historia y liquidez sana
   que vuelven a despertar (ej. tipo FET y otros nombres AI/L1/L2/DePIN
   establecidos saliendo de base larga). Marca type="historica".
   (momentum generico de mediana data: type="momentum".)

INVESTIGACION MULTI-SENAL (usa web_search, cruza varias fuentes)
Para cada candidato junta y cita evidencia de:
- Google Trends / interes de busqueda subiendo en el token o su narrativa.
- Social: X/Twitter, Reddit, Telegram - menciones y sentimiento creciente.
- Binance: trending, spikes de volumen, nuevos listings/programas.
- On-chain / mercado: volumen, liquidez, market cap, holders, TVL si aplica.
- Narrativa de sector que esta rotando capital este mes.
El cruce de senales es lo predictivo: una sola senal no alcanza.

FUNDAMENTALES (obligatorio por candidato)
Explica que hace el proyecto, sector/narrativa, utilidad del token, por que AHORA
(catalizador concreto), y contexto de liquidez/market cap. Esto fundamenta la
compra y queda registrado en el historial.

DISCIPLINA (no negociable)
- No persigas Stage 3/4 ni cosas ya extendidas/parabolicas: buscas temprano.
- La senal tecnica manda sobre la narrativa. Sin estructura, no entra.
- Liquidez sana obligatoria (nada iliquido/manipulable).
- Se honesto con el riesgo; si no hay nada bueno, devolve shortlist corto o vacio.

REGIMEN
Lee el macro del mes (BTC, dominancia, condiciones) y devolve regimen:
"risk_on" (ofensivo), "neutral", o "risk_off" (defensivo, priorizar caja).

SALIDA
No mas de ~8 busquedas; despues ESCRIBI el JSON. Tu ULTIMO mensaje debe ser
EXCLUSIVAMENTE un JSON valido, sin markdown ni texto extra, con forma:
{"regimen":"risk_on|neutral|risk_off",
 "summary":"2-3 frases con la lectura macro del mes",
 "shortlist":[{"symbol":"XXX/USDT","rank":1,"type":"launch|historica|momentum",
   "stage":"1|2","thesis":"1-2 frases accionables: por que entrar",
   "fundamentals":"que hace, sector, utilidad, por que ahora",
   "catalyst":"evento/catalizador concreto",
   "signals":{"google_trends":"...","social":"...","binance":"...","onchain":"..."},
   "risk":"riesgo principal","sources":["url"]}]}
Exactamente 3 candidatos (las 3 mejores a 30 dias), rankeados por asimetria/conviccion. Cada uno operable en
Binance Spot, con liquidez sana. Prioriza calidad sobre cantidad."""


def run(candidates_context):
    """candidates_context: texto con los disparadores y datos tecnicos detectados."""
    if not config.ANTHROPIC_API_KEY:
        return {"shortlist": [], "summary": "ANTHROPIC_API_KEY no configurada.", "raw": ""}
    user = (
        "Disparadores y contexto tecnico detectados este ciclo:\n\n"
        + candidates_context
        + "\n\nResearchea con web_search las dos canastas (launches recientes de "
          "Binance e historicas en reaceleracion tipo FET), cruza senales "
          "(Google Trends, social, Binance trending, on-chain), y devolve el "
          "shortlist rankeado con fundamentales y tesis en el JSON especificado."
    )
    headers = {
        "x-api-key": config.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }
    messages = [{"role": "user", "content": user}]
    text = ""
    try:
        for _ in range(6):  # continua si la API devuelve pause_turn
            r = requests.post(
                "https://api.anthropic.com/v1/messages",
                headers=headers,
                json={
                    "model": MODEL,
                    "max_tokens": 8000,
                    "system": SYSTEM,
                    "messages": messages,
                    "tools": [{"type": "web_search_20250305", "name": "web_search",
                               "max_uses": 8}],
                },
                timeout=240,
            )
            data = r.json()
            content = data.get("content")
            if not content:
                return {"shortlist": [], "summary": "Cerebro: respuesta sin content (%s)" % str(data.get("error") or data.get("type")), "raw": json.dumps(data)[:2000]}
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
        parsed["raw"] = text
        return parsed
    except Exception as e:
        return {"shortlist": [], "summary": f"Error en cerebro: {e}", "raw": text[:2000]}