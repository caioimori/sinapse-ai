# AGENTS.md - SINAPSE

Este arquivo configura o comportamento esperado de agentes no Codex CLI neste repositorio.

## Constitution

Siga `.sinapse-ai/constitution.md` como fonte de verdade:
- CLI First
- Agent Authority
- Story-Driven Development
- No Invention
- Quality First
- Absolute Imports

## Workflow Obrigatorio

1. Inicie por uma story em `docs/stories/`
2. Implemente apenas o que os acceptance criteria pedem
3. Atualize checklist (`[ ]` -> `[x]`) e file list
4. Execute quality gates antes de concluir

## Quality Gates

```bash
npm run lint
npm run typecheck
npm test
```

## Estrutura Principal

- Core framework: `.sinapse-ai/`
- CLI: `bin/`
- Pacotes: `packages/`
- Testes: `tests/`
- Documentacao: `docs/`

## IDE/Agent Sync

- Sincronizar regras/agentes: `npm run sync:ide`
- Validar drift: `npm run sync:ide:check`
- Rodar paridade multi-IDE (Claude/Codex/Gemini): `npm run validate:parity`
- Sync Claude Code: `npm run sync:ide:claude`
- Sincronizar Gemini CLI: `npm run sync:ide:gemini`
- Validar Codex sync/integration: `npm run validate:codex-sync && npm run validate:codex-integration`
- Gerar skills locais do Codex: `npm run sync:skills:codex`
- Este repositorio usa **local-first**: prefira `.codex/skills` versionado no projeto
- Use `sync:skills:codex:global` apenas para testes fora deste repo

## Agent Shortcuts (Codex)

Preferencia de ativacao no Codex CLI:
1. Use `/skills` e selecione `sinapse-<agent-id>` vindo de `.codex/skills` (ex.: `sinapse-architect`)
2. Se preferir, use os atalhos abaixo (`@architect`, `/architect`, etc.)

Quando a mensagem do usuario for um atalho de agente, carregue o arquivo correspondente em `.sinapse-ai/development/agents/` (fallback: `.codex/agents/`), renderize o greeting via `generate-greeting.js` e assuma a persona ate receber `*exit`.

Atalhos aceitos por agente (nome completo + alias):
- `@sinapse-orqx` -> `.sinapse-ai/development/agents/sinapse-orqx.md`
- `@developer` ou `@dev` -> `.sinapse-ai/development/agents/developer.md`
- `@quality-gate` ou `@qa` -> `.sinapse-ai/development/agents/quality-gate.md`
- `@project-lead` ou `@pm` -> `.sinapse-ai/development/agents/project-lead.md`
- `@product-lead` ou `@po` -> `.sinapse-ai/development/agents/product-lead.md`
- `@sprint-lead` ou `@sm` -> `.sinapse-ai/development/agents/sprint-lead.md`
- `@analyst` -> `.sinapse-ai/development/agents/analyst.md`
- `@architect` -> `.sinapse-ai/development/agents/architect.md`
- `@data-engineer` -> `.sinapse-ai/development/agents/data-engineer.md`
- `@devops` -> `.sinapse-ai/development/agents/devops.md`
- `@squad-creator` -> `.sinapse-ai/development/agents/squad-creator.md`
- `@ux-design-expert` -> `.sinapse-ai/development/agents/ux-design-expert.md`

Resposta esperada ao ativar atalho:
1. Confirmar agente ativado
2. Mostrar 3-6 comandos principais (`*help`, etc.)
3. Seguir na persona do agente

## Orquestradores (19 orqx: 18 squad + 1 master)

Cada orqx coordena um squad completo de agentes especializados. Ative via `/skills` > `sinapse-<orqx>` ou `@<orqx>`:

| Orqx | Squad | Foco |
|------|-------|------|
| `sinapse-orqx` | Core | Orquestrador principal de todos os squads |
| `brand-orqx` | Brand | Estrategia de marca, arquetipos, auditoria |
| `copy-orqx` | Copy | Copywriting persuasivo, headlines, conversao |
| `content-orqx` | Content | Governanca editorial, estrategia de conteudo |
| `storytelling-orqx` | Storytelling | Narrativa, roteiros, frameworks de historia |
| `commercial-orqx` | Commercial | Vendas, funil, revenue, pipeline |
| `paidmedia-orqx` | Paid Media | Meta Ads, Google Ads, campanhas |
| `growth-orqx` | Growth | Analytics, CRO, SEO, growth hacking |
| `research-orqx` | Research | Market analysis, inteligencia competitiva |
| `product-orqx` | Product | Product discovery, estrategia, operacoes |
| `design-orqx` | Design | Design systems, componentes, tokens |
| `animations-orqx` | Animations | Motion design, CSS, particulas, 3D |
| `cyber-orqx` | Cybersecurity | Seguranca, threat intel, pentest |
| `finance-orqx` | Finance | Budget, pricing, profitability |
| `courses-orqx` | Courses | Curriculos, assessments, launch |
| `cloning-orqx` | Cloning | Clonagem cognitiva, mind synthesis |
| `council-orqx` | Council | Advisors estrategicos (Munger, Dalio, Thiel) |
| `claude-orqx` | Claude | Claude Code, MCP, integracao avancada |
| `swarm-orqx` | Mastery | Dominio avancado do Claude Code |

Agents de arquivo: `.codex/agents/<orqx>.md` ou `.claude/agents/<orqx>.md`

## Agentes Especializados (175)

Existem 175 agentes especializados organizados por 18 squads (174 em squads + 1 master orchestrator). Eles sao acessiveis via:
- `.codex/agents/<agent-name>.md` — arquivo direto
- Chamada interna pelo orqx do squad

Exemplos: `brand-strategist`, `ad-copywriter`, `penetration-tester`, `content-writer`, `ga-analytics-engineer`, etc.

Use `*help` dentro de qualquer orqx para ver os especialistas disponiveis no squad.
