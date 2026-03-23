---
task: squad-status-report
responsavel: "@sinapse-master"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: scope
    tipo: string
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: status_report
    tipo: document
    destino: "user"

Checklist:
  - "[ ] Listar todas as squads"
  - "[ ] Incluir capabilities de cada uma"
  - "[ ] Destacar cross-squad connections"
  - "[ ] Gerar recomendacoes se aplicavel"
---

# Task: Squad Status Report

## Metadata
- **Squad:** squad-sinapse
- **Agent:** Imperator (sinapse-master)
- **Complexity:** Standard

## Objetivo
Gerar relatorio completo sobre o estado do ecossistema Sinapse — quais squads existem, o que cada uma faz, quantos agentes e tasks tem, e como se conectam.

## Entrada
- Scope (opcional): "all" (default), nome de squad especifica, ou dominio
- Verbosity: normal ou verbose

## Passos

### 1. Ecosystem Overview

```
SINAPSE — ECOSYSTEM STATUS REPORT
=======================================
Date: {data}
Total Squads: 15
Total Agents: 127+
Total Tasks: 965+
Total Knowledge Bases: 127+
Total Workflows: 49+

SQUAD ROSTER:
| # | Squad | Agents | Tasks | KBs | WFs | Orchestrator |
|---|-------|--------|-------|-----|-----|-------------|
| 1 | brand-system | 15 | 97 | 19 | 4 | Meridian |
| 2 | commercial-systems | 10 | 85 | 12 | 6 | Pipeline |
| 3 | content-intelligence | 7 | 90 | 16 | 6 | content-orqx |
| 4 | copywriting-persuasion | 12 | 81 | 14 | 6 | Quill |
| 5 | creative-animations | 9 | 73 | 13 | 5 | Kinetic |
| 6 | digital-experience | 8 | 101 | 13 | 6 | Nexus |
| 7 | financial-intelligence | 5 | 45 | 8 | 4 | Ledger |
| 8 | growth-analytics | 7 | 77 | 12 | 6 | Catalyst |
| 9 | paid-media | 9 | 82 | 14 | 5 | Apex |
| 10 | product-systems | 7 | 75 | 11 | 6 | Vector |
| 11 | research-intelligence | 7 | 72 | 13 | 6 | Prism |
| 12 | claude-mastery | 8 | 26 | 5 | 2 | Orion |
| 13 | strategic-council | 11 | 23 | 3 | 2 | Zenith |
| 14 | narrative-masters | 10 | 17 | 3 | 2 | Arc |
| 15 | cyber-defense | 8 | 22 | 3 | 2 | Fortress |
```

### 2. Domain Coverage Map

```
DOMAIN COVERAGE:
Strategy & Advisory     ████████████████████ strategic-council, research-intelligence
Branding & Identity     ████████████████████ brand-system
Digital Experience      ████████████████████ digital-experience, creative-animations
Content & Copy          ████████████████████ content-intelligence, copywriting-persuasion
Commercial & Revenue    ████████████████████ commercial-systems, financial-intelligence
Growth & Marketing      ████████████████████ growth-analytics, paid-media
Product & Technology    ████████████████████ product-systems, claude-mastery
Narrative & Pitch       ████████████████████ narrative-masters
Security & Compliance   ████████████████████ cyber-defense
```

### 3. Per-Squad Detail (if verbose or specific squad requested)

Para cada squad solicitada:
- Nome completo e descricao
- Lista de agentes com roles
- Top 10 tasks mais relevantes
- Knowledge bases disponiveis
- Workflows disponiveis
- Cross-squad connections

### 4. Quick Access Guide

```
QUICK ACCESS — HOW TO INVOKE:
/brand:agents:brand-orqx         → Branding
/commercial:agents:commercial-orqx       → Vendas
/content:agents:content-orqx     → Conteudo
/copywriting:agents:copy-strategist      → Copy
/ca:agents:animations-orqx               → Animacoes
/digital-experience:agents:design-orqx → UX/UI
/finance:agents:finance-orqx          → Financeiro
/growth:agents:growth-orqx           → Growth
/pm:agents:paidmedia-orqx               → Midia Paga
/product:agents:product-orqx          → Produto
/research:agents:research-orqx   → Pesquisa
/claude:agents:claude-orqx           → Claude Mastery
/council:agents:council-orqx     → Conselho
/narrative:agents:storytelling-orqx  → Narrativa
/cyber:agents:cyber-orqx         → Seguranca
```

## Saida
- Status report completo (overview ou detalhado)
- Quick access guide com invocation commands
- Recomendacoes de squad para objetivos especificos (se contexto fornecido)

## Validacao
- [ ] Todas as 15 squads listadas
- [ ] Numeros de agents/tasks/KBs corretos
- [ ] Invocation commands validos
- [ ] Formato legivel e estruturado
