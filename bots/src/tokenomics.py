import requests

CG = "https://api.coingecko.com/api/v3"
HDRS = {"User-Agent": "semillas-bot"}

def _base(sym):
    return (sym or "").split("/")[0].strip().lower()

def fetch_tokenomics(symbols):
    """Best-effort FDV/MCAP + float% via CoinGecko. base_lower -> dict. Nunca rompe."""
    out = {}
    bases = sorted({_base(s) for s in symbols if s})
    if not bases:
        return out
    try:
        url = CG + "/coins/markets"
        params = {"vs_currency": "usd", "symbols": ",".join(bases),
                  "order": "market_cap_desc", "per_page": 250, "page": 1}
        data = requests.get(url, params=params, headers=HDRS, timeout=15).json()
    except Exception as e:
        print("[tokenomics] coingecko fallo:", str(e)[:120])
        return out
    if not isinstance(data, list):
        print("[tokenomics] respuesta inesperada:", str(data)[:120])
        return out
    best = {}
    for c in data:
        s = (c.get("symbol") or "").lower()
        if s not in bases:
            continue
        mc = c.get("market_cap") or 0
        if s not in best or mc > (best[s].get("market_cap") or 0):
            best[s] = c
    for s, c in best.items():
        mc = c.get("market_cap") or 0
        fdv = c.get("fully_diluted_valuation")
        circ = c.get("circulating_supply") or 0
        maxs = c.get("max_supply") or c.get("total_supply") or 0
        ratio = round(fdv / mc, 2) if (fdv and mc) else None
        floatp = round(100.0 * circ / maxs, 1) if (circ and maxs) else None
        flags = []
        if ratio is not None and ratio >= 5:
            flags.append("FDV/MCAP %sx (dilucion alta)" % ratio)
        if floatp is not None and floatp < 25:
            flags.append("float %s%% (poco supply circulando)" % floatp)
        penalty = 2 if (ratio is not None and ratio >= 10) else (1 if flags else 0)
        out[s] = {"mcap": mc, "fdv": fdv, "fdv_mcap": ratio, "float_pct": floatp,
                  "cg_id": c.get("id"), "warning": "; ".join(flags), "penalty": penalty}
    return out

def annotate_shortlist(shortlist):
    """Enriquece cada item con 'tokenomics', suma warning a 'risk' y reordena por penalty (sin descartar). Nunca rompe ni vacia."""
    if not isinstance(shortlist, list) or not shortlist:
        return shortlist
    try:
        tk = fetch_tokenomics([it.get("symbol") for it in shortlist])
        for it in shortlist:
            info = tk.get(_base(it.get("symbol", "")))
            if not info:
                it["tokenomics"] = {"status": "sin_datos"}
                continue
            it["tokenomics"] = info
            if info.get("warning"):
                br = it.get("risk", "") or ""
                it["risk"] = (br + " | TOKENOMICS: " + info["warning"]).strip(" |")
        shortlist.sort(key=lambda it: (it.get("tokenomics") or {}).get("penalty", 0))
    except Exception as e:
        print("[tokenomics] annotate fallo:", str(e)[:140])
    return shortlist