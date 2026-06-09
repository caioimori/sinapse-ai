# 04 — Roadmap faseado

> Nenhum código antes de PRD + arquitetura validados (Documentation-First SINAPSE).

| Fase | Objetivo | Base | Entregável |
|---|---|---|---|
| **0** | Reconstruir **PnL / win-rate por carteira** (FIFO) | `poly_data` | Motor de contabilidade + ranking de carteiras |
| **1** | **Backtest honesto** (com slippage, sem leakage) de 1 estratégia | dados FIFO | Relatório de backtest + métricas reais |
| **2** | **MVP multiagente em paper-trading** (Polymarket, sem dinheiro) | cli read-only + master + analista | Bot que decide mas não gasta |
| **3** | **Capital mínimo real** em Polymarket + observabilidade total | cli auth + risco | Operação ao vivo monitorada |
| **4** | Avaliar ponte para **Bitcoin / bolsa** (broker API, novo edge, novo backtest) | nova camada | Decisão go/no-go fundamentada |

## Fase 0 — detalhe (próximo candidato a execução)

**Por que primeiro:** sem PnL por carteira, "carteira vencedora", backtest e copy-trade
não existem. É a fundação que o tweet fingiu ter.

**Escopo:**
- Ler `processed/trades.csv` do `poly_data`.
- Reconstruir posição por `(carteira, market_id)` via FIFO.
- Calcular realized PnL, win-rate, profit factor, nº de trades, recência.
- Exportar ranking (ex: top N por PnL com filtros de volume/idade).

**Fora de escopo (Fase 0):** execução, LLM, tempo real.

## Pré-requisitos antes de codar (gate SINAPSE)

1. Story/Epic em `docs/` com critérios de aceite (status ≥ Ready).
2. PRD + spec de arquitetura validados.
3. Decisão sobre o curso (ver `05-curso-transcricoes/`).
