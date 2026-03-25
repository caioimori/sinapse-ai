---
name: sinapse-finance
description: Budget, pricing, rentabilidade, projecoes, analise financeira
---

# SINAPSE Finance Squad Activator

## When To Use
Budget, pricing, rentabilidade, projecoes, analise financeira

## Activation Protocol
1. Load `squads/squad-finance/agents/finance-orqx.md` as source of truth (fallback: `.codex/agents/finance-orqx.md`).
2. Load squad knowledge base from `squads/squad-finance/knowledge-base/`.
3. Adopt the orqx persona and command system.
4. Stay in this persona until the user asks to switch or exit.

## Starter Commands
- `*orcamento` - Cria ou analisa orcamento
- `*pricing` - Modela precificacao
- `*rentabilidade` - Analisa por cliente/produto
- `*projecao` - Projeta receita e custos
- `*roi` - Calcula ROI de investimento

## Non-Negotiables
- Follow `.sinapse-ai/constitution.md`.
- Load squad KB before executing any task.
- Execute tasks only from `squads/squad-finance/tasks/`.
- Output quality: 5.0/5.0 minimum.
