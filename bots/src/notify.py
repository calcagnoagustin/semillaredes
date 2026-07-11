"""Envío de reportes por email vía Resend (HTTP API)."""
import requests
import config


def send(subject, html):
    if not config.RESEND_API_KEY or not config.EMAIL_TO:
        print("[notify] Resend no configurado; salteando email.\n" + subject)
        return False
    try:
        r = requests.post(
            "https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {config.RESEND_API_KEY}"},
            json={
                "from": config.EMAIL_FROM,
                "to": [config.EMAIL_TO],
                "subject": subject,
                "html": html,
            },
            timeout=20,
        )
        ok = r.status_code in (200, 201)
        if not ok:
            print(f"[notify] Resend error {r.status_code}: {r.text[:200]}")
        return ok
    except Exception as e:
        print(f"[notify] excepción enviando email: {e}")
        return False


def daily_report(actions, triggers, portfolio, brain_summary, mode):
    """Construye el HTML del reporte diario."""
    badge = "TESTNET" if mode else "REAL"
    rows = ""
    for a in actions:
        rows += (
            f"<tr><td>{a.get('symbol','')}</td>"
            f"<td><b>{a.get('type','')}</b></td>"
            f"<td>{a.get('reason','')}</td></tr>"
        )
    if not rows:
        rows = "<tr><td colspan='3'>Sin acciones hoy. El sistema esperó.</td></tr>"

    trig = ""
    for t in triggers:
        trig += f"<li>{t['symbol']} — {t['signal']}: {t['detail']}</li>"
    if not trig:
        trig = "<li>Ningún trigger disparó.</li>"

    pf = ""
    for sym, p in portfolio.items():
        pf += (
            f"<tr><td>{sym}</td><td>{p['status']}</td>"
            f"<td>{p.get('qty',0):.4f}</td>"
            f"<td>{p.get('pnl_pct','—')}</td></tr>"
        )
    if not pf:
        pf = "<tr><td colspan='4'>Sin posiciones abiertas.</td></tr>"

    brain = f"<p><b>Cerebro mensual:</b> {brain_summary}</p>" if brain_summary else ""

    return f"""
    <div style="font-family:system-ui,Arial,sans-serif;max-width:640px">
      <h2>🌱 Sistema Semillas — Reporte diario <span style="font-size:12px;
          background:#eee;padding:2px 8px;border-radius:6px">{badge}</span></h2>

      <h3>Acciones ejecutadas</h3>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:14px"
             border="1">{rows}</table>

      <h3>Portfolio</h3>
      <table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:14px"
             border="1">
        <tr><th>Activo</th><th>Estado</th><th>Cantidad</th><th>P&amp;L</th></tr>
        {pf}
      </table>

      <h3>Triggers</h3>
      <ul style="font-size:14px">{trig}</ul>
      {brain}
      <p style="color:#888;font-size:12px">Revisión una vez al día. Pausar no es fallar.</p>
    </div>
    """


def funding_alert(sym, need, have):
    """Aviso por mail: falta USDT libre para reforzar (DCA) una posicion."""
    try:
        import requests, config
        subject = f"[Semillas] Fondear para reforzar {sym}"
        html = (f"<p>El bot quiere reforzar <b>{sym}</b> con <b>${need}</b> USDT "
                f"pero el balance libre es <b>${have:.2f}</b>.</p>"
                f"<p>Transferi USDT a la sub-cuenta para que el proximo DCA entre.</p>")
        requests.post("https://api.resend.com/emails",
            headers={"Authorization": f"Bearer {config.RESEND_API_KEY}"},
            json={"from": config.EMAIL_FROM, "to": [config.EMAIL_TO],
                  "subject": subject, "html": html}, timeout=20)
        print(f"[notify] funding_alert enviado: {sym} need ${need} have ${have:.2f}")
    except Exception as e:
        print("[notify] funding_alert fallo:", str(e)[:120])


def exec_alert(sym, intent, msg):
    """Aviso de ejecucion: orden salteada/clampeada/rechazada que merece atencion."""
    try:
        import requests, config
        subject = f"[Semillas] Ejecucion {intent} {sym}: atencion"
        html = f"<p><b>{intent} {sym}</b></p><p>{msg}</p>"
        if config.RESEND_API_KEY and config.EMAIL_TO:
            requests.post("https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {config.RESEND_API_KEY}"},
                json={"from": config.EMAIL_FROM, "to": [config.EMAIL_TO],
                      "subject": subject, "html": html}, timeout=20)
        print(f"[notify] exec_alert: {intent} {sym}: {msg}")
    except Exception as e:
        print("[notify] exec_alert fallo:", str(e)[:120])


def reconcile_alert(diffs):
    """Aviso de desincronizacion state<->Binance. diffs: lista de dicts."""
    if not diffs:
        return
    try:
        import requests, config
        rows = ""
        for d in diffs:
            rows += (f"<tr><td>{d.get('symbol')}</td><td>{d.get('kind')}</td>"
                     f"<td>{d.get('detail')}</td></tr>")
        html = ("<p><b>Desincronizacion state vs Binance detectada.</b> "
                "El bot no auto-corrige; revisar manualmente.</p>"
                "<table border='1' cellpadding='6' style='border-collapse:collapse;font-size:13px'>"
                "<tr><th>Symbol</th><th>Tipo</th><th>Detalle</th></tr>"
                f"{rows}</table>")
        subject = f"[Semillas] RECONCILIACION: {len(diffs)} diferencia(s)"
        if config.RESEND_API_KEY and config.EMAIL_TO:
            requests.post("https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {config.RESEND_API_KEY}"},
                json={"from": config.EMAIL_FROM, "to": [config.EMAIL_TO],
                      "subject": subject, "html": html}, timeout=20)
        for d in diffs:
            print(f"[reconcile] {d.get('kind')} {d.get('symbol')}: {d.get('detail')}")
    except Exception as e:
        print("[notify] reconcile_alert fallo:", str(e)[:120])


def liquidity_alert(free, buffer):
    """P6: aviso proactivo de colchon de USDT bajo."""
    try:
        import requests, config
        subject = f"[Semillas] Liquidez baja: ${free:.2f} USDT"
        html = (f"<p>El USDT libre cayo a <b>${free:.2f}</b>, por debajo del colchon de <b>${buffer:.0f}</b>.</p>"
                f"<p>Transferi USDT a la sub-cuenta para que los proximos DCA y seeds entren sin problema.</p>")
        if config.RESEND_API_KEY and config.EMAIL_TO:
            requests.post("https://api.resend.com/emails",
                headers={"Authorization": f"Bearer {config.RESEND_API_KEY}"},
                json={"from": config.EMAIL_FROM, "to": [config.EMAIL_TO],
                      "subject": subject, "html": html}, timeout=20)
        print(f"[notify] liquidity_alert: free ${free:.2f} < buffer ${buffer:.0f}")
    except Exception as e:
        print("[notify] liquidity_alert fallo:", str(e)[:120])