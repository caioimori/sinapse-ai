---
paths:
  - "squads/**"
  - ".sinapse-ai/development/agents/**"
---

# Sinapse — Orchestration Rules

> **CRITICAL:** This project has specialized AI agent squads installed. When a user request falls within a domain covered by a squad, you MUST delegate to the appropriate specialist agent instead of handling it yourself.

## Delegation Rule

When a user request matches a squad domain (see table below):
1. **Acknowledge** the domain is covered by a specialized squad
2. **Recommend** activating the squad's orchestrator or specialist agent
3. **Provide** the invocation command (e.g., `/ca:agents:ca-orchestrator`)
4. **Do NOT** handle the request yourself if a dedicated agent exists

**Exception:** If the user explicitly asks you to handle it anyway, proceed — but note the specialized squad exists.

## Squads Instaladas

| Squad | Capacidade |
|-------|-----------|


## Mapa de Delegacao por Dominio

| Dominio | Squad | Agente Lead | Invocacao |
|---------|-------|-------------|-----------|
| Branding e identidade visual | squad-brand | brand-orchestrator (Meridian) | `/brand:agents:brand-orchestrator` |
| Vendas e estrategia comercial | squad-commercial | cs-orchestrator (Pipeline) | `/commercial:agents:cs-orchestrator` |
| Conteudo e editorial | squad-content | content-orchestrator | `/content:agents:content-orchestrator` |
| Copywriting e persuasao | squad-copy | copy-strategist (Quill) | `/copywriting:agents:copy-strategist` |
| Animacoes web, Three.js, shaders, motion | squad-animations | ca-orchestrator (Kinetic) | `/ca:agents:ca-orchestrator` |
| UX/UI e experiencia digital | squad-design | dx-orchestrator (Nexus) | `/digital-experience:agents:dx-orchestrator` |
| Inteligencia financeira e pricing | squad-finance | fi-orchestrator (Ledger) | `/finance:agents:fi-orchestrator` |
| Growth organico, SEO e analytics | squad-growth | ga-orchestrator (Catalyst) | `/growth:agents:ga-orchestrator` |
| Midia paga (Meta Ads, Google Ads, CRO) | squad-paidmedia | pm-orchestrator (Apex) | `/pm:agents:pm-orchestrator` |
| Produto e discovery | squad-product | ps-orchestrator (Vector) | `/product:agents:ps-orchestrator` |
| Pesquisa e inteligencia competitiva | squad-research | research-orchestrator (Prism) | `/research:agents:research-orchestrator` |
| Claude Code mastery e automacao | squad-claude | cm-orchestrator (Orion) | `/claude:agents:cm-orchestrator` |
| Conselho estrategico e modelos mentais | squad-council | council-orchestrator (Zenith) | `/council:agents:council-orchestrator` |
| Narrativa, storytelling e pitch | squad-storytelling | narrative-orchestrator (Arc) | `/narrative:agents:narrative-orchestrator` |
| Seguranca cibernetica e compliance | squad-cybersecurity | cyber-orchestrator (Fortress) | `/cyber:agents:cyber-orchestrator` |

## Quando Delegar

| Situacao | Squad |
|----------|-------|
| Animacao/motion/Three.js/shader | squad-animations |
| Copy/headline/persuasao | squad-copy |
| Branding/identidade/logo | squad-brand |
| Pesquisa/benchmark/analise competitiva | squad-research |
| Conteudo/editorial/blog/social media | squad-content |
| UX/UI/design system/wireframe | squad-design |
| Growth/SEO/analytics/metricas organicas | squad-growth |
| Vendas/proposta/pitch/CRM | squad-commercial |
| Financeiro/pricing/P&L/budget | squad-finance |
| Midia paga/Meta Ads/Google Ads/CRO | squad-paidmedia |
| Produto/discovery/roadmap | squad-product |
| Claude Code/prompt engineering/MCP | squad-claude |
| Conselho estrategico/modelos mentais/decisao | squad-council |
| Storytelling/narrativa/pitch/apresentacao | squad-storytelling |
| Seguranca/pentest/compliance/incident response | squad-cybersecurity |

## Handoff Protocol

1. **Identificar** o dominio do pedido
2. **Informar** qual squad cobre e como invocar: `/{prefix}:agents:{agent-id}`
3. **Fornecer contexto** do handoff se necessario
4. Squads sao **autonomas** — o orchestrator coordena internamente
5. Squads possuem **knowledge bases**, **tasks** e **workflows** proprios em `./squads/{squad-name}/`
