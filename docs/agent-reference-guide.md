# Agent Reference Guide — SINAPSE-AI

> Referência rápida dos **200 agentes** organizados em **19 squads** + **12 framework agents**. Total: 1.237 tasks executáveis.

## Como invocar

```
@<agent-name>
*<command>
```

Exemplos:
- `@developer` → ativa agente de implementação
- `@architect` → ativa agente de arquitetura
- `*help` → lista comandos do agente ativo

## Framework Agents (12) — Workflow de Desenvolvimento

Localização: `.sinapse-ai/development/agents/`

| Agente | Persona | Domínio |
|---|---|---|
| `@developer` | Pixel | Implementação de código |
| `@architect` | Stratum | Arquitetura de sistemas |
| `@product-lead` | Axis | Validação de stories (PO) |
| `@project-lead` | Beacon | Orquestração de epics (PM) |
| `@sprint-lead` | Sync | Criação de stories (SM) |
| `@quality-gate` | Litmus | Testes + quality gates (QA) |
| `@analyst` | Scope | Pesquisa + análise |
| `@data-engineer` | Tensor | Database + queries |
| `@ux-design-expert` | Mosaic | UX/UI + design system |
| `@devops` | Pipeline | CI/CD + push EXCLUSIVE |
| `@squad-creator` | — | Cria squads customizados |
| `@snps-orqx` | Imperator | Master orchestrator |

## Squad Orchestrators (19) — Especialistas por Domínio

| Squad | Orchestrator | Domínio principal |
|---|---|---|
| squad-brand | `@brand-orqx` | Branding, identidade visual, MVV |
| squad-copy | `@copy-orqx` | Copywriting, persuasão, ads |
| squad-content | `@content-orqx` | Conteúdo, editorial, SEO |
| squad-design | `@design-orqx` | Design system, UI, wireframes |
| squad-animations | `@animations-orqx` | Motion, GSAP, Three.js, shaders |
| squad-product | `@product-orqx` | Product discovery, roadmap |
| squad-commercial | `@commercial-orqx` | Vendas, CRM, funil |
| squad-finance | `@finance-orqx` | Pricing, P&L, projeções |
| squad-growth | `@growth-orqx` | SEO, analytics, CRO |
| squad-paidmedia | `@paidmedia-orqx` | Meta, Google, TikTok ads |
| squad-cybersecurity | `@cyber-orqx` | Pentest, LGPD, compliance |
| squad-research | `@research-orqx` | Pesquisa profunda, MS |
| squad-cloning | `@cloning-orqx` | Clonagem cognitiva (DNA) |
| squad-courses | `@courses-orqx` | Cursos, mentorias, lançamento |
| squad-storytelling | `@storytelling-orqx` | Pitch, narrativa |
| squad-council | `@council-orqx` | Conselho estratégico (mental models) |
| squad-claude | `@claude-orqx` | Claude Code mastery (hooks, MCP, skills) |
| squad-artdir | `@artdir-orqx` | Direção de arte |
| claude-code-mastery | `@claude-mastery-chief` | Setup avançado Claude Code |

## Como descobrir agentes de um squad

```
@<squad>-orqx
*help
```

Ou liste arquivos:

```bash
ls squads/squad-design/agents/    # 15 agentes do squad-design
ls squads/squad-brand/agents/     # 15 agentes do squad-brand
```

## Auto-routing

Você **não precisa** decorar agent names. Mande seu pedido em linguagem natural — o framework roteia automaticamente:

| Você diz | Sistema delega pra |
|---|---|
| "cria um headline pra LP" | `@copy-orqx` → headline-specialist |
| "audita a marca X" | `@brand-orqx` → brand-auditor |
| "implementa essa feature" | `@sprint-lead` (cria story) → `@developer` |
| "faz deploy" | `@devops` (exclusive) |

Detalhes em [`.claude/rules/squad-awareness.md`](../.claude/rules/squad-awareness.md).

## Estrutura interna de cada squad

```
squads/{squad-name}/
├── squad.yaml                  # metadata + dependencies
├── agents/                     # personas (.md)
├── tasks/                      # workflows executáveis
└── knowledge-base/             # KB própria do squad
```

## Mais informação

| Tema | Onde |
|---|---|
| Como criar agente novo | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |
| Como criar squad novo | `@squad-creator *help` |
| Workflow Story Development Cycle | [`docs/sinapse-workflows/story-development-cycle-workflow.md`](sinapse-workflows/story-development-cycle-workflow.md) |
| Constitution (10 artigos) | [`.sinapse-ai/constitution.md`](../.sinapse-ai/constitution.md) |

---

*200 agentes especializados. 1.237 tasks. 13 hooks ativos. 10 artigos constitucionais. Tudo direto no terminal.*
