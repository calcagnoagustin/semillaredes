# Sistema de Bots Cripto — Versión final (2026-07-03)

Operador: Agus. Infraestructura: Oracle Cloud Always-Free VM (`opc@semillas-bot`, sa-saopaulo-1).
Exchange: Binance Spot (sin apalancamiento, sin futuros). Dashboard: `cripto.semillaredes.com`.

## Bots corriendo

### 1. Sistema Semillas (`~/bot_semillas/`, cron diario 00:15 UTC) — LIVE desde 2026-06-29
- Radar de tendencias: 3 semillas/mes (~$7), confirmación → escalera DCA `[2,3,5]` gateada por
  Weinstein Stage 2 por moneda. TP 30/60/120 (25% c/u), moonbag 10%.
- Capa de seguridad P1–P9a completa (runlock, ledger, reconcile, execlayer, buffer liquidez,
  brain cooldown, `stopped_moonbag` terminal).
- `brain_monthly.py` mensual vía API Anthropic (~$1–2/run); `scanner.py` diario costo cero.
- Notificaciones: Resend → calcagnoagustin@gmail.com.

### 2. Ganesha Freqtrade (`/opt/ganesha_bot/`, systemd `ganesha.service`) — LIVE
- DonchianTrend BTC/USDT 1h, stoploss -30% en exchange. Sub-cuenta ~$46.
- Publisher de dashboard cada 15 min (`freq_dashboard.py`).

### 3. Ganesha-Ejecutor (`~/bot_semillas/ganesha_ejecutor.py`, cron 6x/día: 00:07, 04:07, 08:07, 12:07, 16:07, 20:07 UTC) — deployado 2026-07-02/03
- Trend-bot corto plazo SOLO sobre semillas en estado `confirmed` del state de Semillas.
- Entrada: breakout en velas 15m (cierre > máx 24h) + volumen >1.5× SMA20.
- Stop inicial 2.5×ATR(14) en velas 4h, ejecutado al cierre de vela 4h.
- Scale-out 30% a +2R (stop a breakeven), trailing ATR-4h desde +2R.
- Sizing fixed-fractional: 2% riesgo sobre equity $46; mínimo notional $5.
- Modo PAPER por defecto. Modo LIVE: requiere que Agus cree `~/bot_semillas/ejecutor/LIVE`
  (touch) — keys se leen de `ejecutor/keys.json` o de `/opt/ganesha_bot/config.py`
  (BINANCE_API_KEY/SECRET, verificado accesible). En live coloca
  stop-loss-limit NATIVO en Binance en cada entrada (lección: stops de software no bastan).
- Log: `ejecutor/events.jsonl`, estado: `ejecutor/state.json`.

### 4. Learning loop (`~/bot_semillas/learning_loop.py`, corre al final del cron diario de Semillas)
- Captura OHLCV 1h de posiciones confirmed/moonbag (7 días pre-confirmación, cap 45 días).
- Registra cambios de estado en `learning/events.jsonl`; métricas en `learning/summary.json`
  (runup máx, drawdown, retorno, ATR14h).
- `sim_ejecutor.py`: simulador parametrizado del Ejecutor sobre datos capturados.
  Primer dato (SYN, conf 29/06): runup real +71%, sim placeholder 1.08R → trailing 2.5×ATR
  devuelve demasiado en alta volatilidad. Parámetros pendientes de calibración.

## Reglas inviolables
- Nunca salir 100% de una tesis activa (moonbag testigo). No promediar a la baja sin
  confirmación de tendencia. Congelamiento a 60 días sin activación. Nunca tradear para
  cubrir una obligación. Pausar no es fallar.
- El pase a plata real de cualquier bot es SIEMPRE acción manual de Agus. Claude prepara y
  verifica todo pero nunca togglea dry_run, ingresa keys ni coloca órdenes.

## Pendientes
- Calibrar parámetros del Ejecutor con datos del learning loop (3-4 confirmaciones más).
- Verificar OTOCO desde sub-cuenta (hoy el stop nativo es stop-loss-limit, suficiente v1).
- Decidir si el Ejecutor reemplaza a Ganesha Freqtrade o conviven.
- Encriptar dashboard cuando el portfolio supere $2,000.

## Próxima sesión (acordado 2026-07-03)
1. Etiqueta de narrativa: cada semilla nueva registra "alineada con narrativa del brain: sí/no"
   en el learning loop, para medir en 2-3 meses si el sesgo narrativo mejora los picks.
2. OCO parcial en Ganesha-Ejecutor: OCO nativa sobre el 30% (TP duro a +2R + stop) y el 70%
   restante con stop nativo + trailing del bot. Requiere refactor de manejo de posiciones
   (reconciliar si la OCO ya ejecutó). Idealmente antes de la primera entrada real.
3. Revisión del jardín (brain mensual): el brain evalúa moonbags/stoppeadas/semillas viejas
   con métricas del learning loop y dictamina: tesis viva (mantener) / muerta (liquidar
   automático) / dust <$5 (conversión a BNB). Moonbag con tesis activa solo se recomienda
   cortar — la decisión es de Agus (regla inviolable del testigo).
   Nota: puntos 1 y 2 ya están también en el SISTEMA.md de la VM; el 3 solo acá.
