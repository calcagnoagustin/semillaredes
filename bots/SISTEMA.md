# Sistema de Bots Cripto — Versión auditada contra el código (2026-07-11)

Fuente de verdad: código en `semillaredes/bots/src/` (volcado completo del deployado en la VM,
secretos redactados). Este documento se escribió LEYENDO ese código, no de memoria.
VM: Oracle `semillas-bot` (VM.Standard.E2.1.Micro, 1 OCPU / 1GB RAM), IP 163.176.185.60.
Exchange: Binance Spot, sub-cuentas separadas (Semillas / Ganesha). Dashboard: cripto.semillaredes.com
(GitHub Pages, repo `radar`, docs/). Email diario vía Resend.

## Flujo real de Semillas (cron diario 00:15 UTC — main.py)

0. Lock anti doble-corrida (runlock) + reconciliación state↔Binance (solo alerta) + chequeo
   de colchón de liquidez ($15 USDT libre mínimo) + detección de depósitos (fuera del P&L).
1. **Gestión de posiciones** (strategy.decide por cada una, con velas 1d):
   - STOP duro si Stage 4 (precio < MA30 y MA en baja): vende todo menos moonbag 10% → `stopped_moonbag` (terminal).
   - Semilla: FREEZE a los 60 días sin activar (liquida); ACTIVATE si Stage 2 sostenido 10 días.
   - Confirmada: TP escalonado +30/+60/+120% (vende 25% en cada nivel; al 3er TP → moonbag);
     DCA solo con Stage 2 + nuevo máximo de 10 días, escalera **[6, 6, 6] USDT**, máx 3 agregados.
   - **Modo RUNNER (P9/P11, activo)**: promoción si dca_adds≥2 o +45% con Stage 2. Aparta moonbag
     legacy 15% intocable; vende 25% por vez desde +30% hasta recuperar el capital invertido;
     trailing por mínimo de 10 días; DCA dinámico $6 con techo de exposición 30% del equity.
2. **Scanner diario** (sin LLM): top 300 de Binance por volumen → pre-rank (volumen×momentum)
   → análisis profundo de 40 (Weinstein stage, momentum 30d, tendencia, CoinGecko trending)
   → top 12 candidatos → **escribe state.shortlist (3) y shortlist_full con tesis técnica, TODOS los días**.
3. **Triggers**: movimiento semanal >25%, salto en ranking de volumen >3x, noticias RSS.
4. **Brain mensual** (claude-opus-4-8 + web_search, ~$1-2): corre si hay triggers, mes nuevo o --brain.
   Investiga 2 canastas (launches recientes de Binance + históricas en reaceleración), cruza señales
   (Trends/social/Binance/on-chain), anota tokenomics, y devuelve **exactamente 3 candidatos** con
   tesis/fundamentales/catalizador/riesgo/fuentes + régimen macro (risk_on/neutral/risk_off).
   Si tiene éxito, SU shortlist pisa la del scanner.
5. **Semillas**: 1 vez por mes planta $7 en cada símbolo de la shortlist vigente (hasta 3),
   sin gate de régimen ni stage (la exploración no se filtra; el DCA sí).
6. Reporte email + persistencia + dashboard + learning loop + loop analista.

### ⚠️ Hallazgo de auditoría (carrera scanner vs brain)
El diseño dice "el brain elige las 3 del mes", pero: el scanner pisa la shortlist a diario, y si el
día que toca plantar el brain falla (crédito/error), las semillas salen de los picks técnicos del
scanner. Evidencia: SYN y ATM (junio) tienen tesis "scanner score...", no tesis del brain. Las 3
que el brain investigó el 3/7 nunca se plantaron (las de julio ya estaban plantadas el 1/7).
**Pendiente de decisión: reservar la plantación mensual a la shortlist del brain o bendecir el fallback.**

### ⚠️ Bug conocido (historial)
`recent_closed` solo se llena cuando una posición pasa a "closed", pero STOP deja `stopped_moonbag`
y FREEZE deja `frozen` → el historial de Semillas del dashboard queda casi siempre en 0 aunque haya
stops reales (GLM, BIO). Fix pendiente.

## Capa de ejecución (execlayer.py — auditada, sólida)
Única puerta de órdenes. Clamp controlado a min_notional (sube hasta $10 máx; si no, saltea y alerta).
Estado se muta SOLO con fill confirmado. Todo queda en ledger (orders.jsonl) con run_id.
Ventas clampeadas al balance libre. Semillas NO deja órdenes resting en Binance (sin stops nativos):
su protección es la corrida diaria.

## Ganesha-Ejecutor (cron 6x/día: 00:07, 04:07, 08:07, 12:07, 16:07, 20:07 UTC) — LIVE
- Universo: solo posiciones `confirmed` de Semillas. Entrada: cierre 15m > máx 24h + volumen >1.5×SMA20.
- Sizing: 2% de riesgo sobre equity real (lee balance de la sub-cuenta en cada pasada). Min notional $5.
- Stop inicial 2.5×ATR(14) 4h, colocado NATIVO en Binance (stop-loss-limit) — con clamp al balance
  libre post-comisiones (fix 11/07) y auto-reparación si falta (STOP_REPAIR).
- Salidas: cierre 4h < stop → market sell; +2R → scale-out 30% + stop a breakeven; trailing 2.5×ATR 4h.
- Flag LIVE = archivo `ejecutor/LIVE` (creado/borrado solo por Agus). Log: ejecutor/events.jsonl.
- Publica ganesha_data.json al dashboard en cada pasada.
- Primer trade real: ATM 10/07 — entrada 21.55 @2.484 (scan 08:07), TP1 30% @~2.82, stop nativo
  315072812 @2.5753 (ganancia asegurada). PnL día +$8.53.

## Learning loop + analista (dentro del cron diario)
learning_loop: captura OHLCV 1h de confirmadas/moonbags (7d pre-confirmación, cap 45d), eventos y
métricas (runup/drawdown/ATR) en learning/. loop_analista: unifica eventos de Semillas+Ejecutor+brain,
captura contexto 15m de cada señal, corre grilla de simulaciones (ATR 2.0/2.5/3.0 × vol 1.3/1.5/2.0)
y escribe learning/recommendations.json (solo informativo; nada se aplica solo). sim_ejecutor.py:
simulador CLI. Primer ranking (n=2): ATR 2.0 > 2.5.

## Retirados (11/07/2026)
- `/opt/ganesha_bot` (bot custom python, Donchian): servicio `ganesha.service` inactivo y disabled desde 03/07.
  Dejó posición AVAX (~$22) con stop nativo propio en Binance.
- **Freqtrade DonchianDaily** (`/home/opc/freqtrade`, servicio `ganesha-daily`): descubierto en auditoría
  11/07 — corría desde 28/06 con `dry_run:false` y stake "unlimited" pese a llamarse "FORWARD-TEST".
  Su DB probó 0 trades en toda su vida (jamás operó; ATM fue del Ejecutor). Causaba el colapso de la
  VM (load 40, swap). Retirado: stop + disable + unit borrada + carpeta archivada en
  `/home/opc/RETIRADO_freqtrade_20260710.tar.gz` (chmod 600). El borrado definitivo del tar es de Agus.

## Reglas inviolables
Moonbag testigo en TPs (nunca vender 100% con tesis viva; el stop duro Stage 4 sí cierra por muerte
de tesis, dejando 10%). No promediar a la baja. Freeze 60 días. Nunca tradear para cubrir obligaciones.
El pase a plata real de cualquier bot es SIEMPRE acción manual de Agus (flag LIVE, dry_run, keys).

## Pendientes (11/07)
1. OCO parcial en Ejecutor (TP duro 30% + stop en el exchange; 70% trailing bot).
2. Etiqueta "alineada con narrativa del brain: sí/no" por semilla (medir si el brain paga).
3. Revisión del jardín (brain mensual dictamina moonbags vivas/muertas/dust; liquidación auto solo
   de tesis cerradas; moonbag viva la decide Agus).
4. Fix bug recent_closed (historial Semillas vacío).
5. Decidir: plantación mensual solo-brain vs fallback scanner (hallazgo de auditoría).
6. Módulos aún no leídos línea por línea: indicators, exchange, triggers, ledger, reconcile, runlock,
   state, notify, tokenomics (disponibles en bots/src/ para auditar).
7. Si la VM vuelve a cargarse: migrar a A1 Flex (hasta 4 OCPU/24GB, gratis en Oracle).
8. Encriptar dashboard cuando el portfolio supere $2,000.

## Auditoría externa
Código completo (secretos redactados) para darle a cualquier IA:
https://raw.githubusercontent.com/calcagnoagustin/semillaredes/main/bots/src/ALL_SRC.txt
(+ p9_runner.py y archivos individuales en el mismo directorio bots/src/)
