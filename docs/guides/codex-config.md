# AGENTS.md - SINAPSE

Este arquivo configura o comportamento esperado de agentes no Codex CLI neste repositorio.

## Constitution

Siga `.sinapse-ai/constitution.md` como fonte de verdade:
- CLI First (NON-NEGOTIABLE)
- Agent Authority (NON-NEGOTIABLE)
- Documentation-First Development (NON-NEGOTIABLE)
- No Invention (MUST)
- Quality First (MUST)
- Absolute Imports (SHOULD)
- Ecosystem Metrics Accuracy (NON-NEGOTIABLE)
- Mandatory Delegation (NON-NEGOTIABLE)

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
- Validar Codex sync/integration: `npm run validate:codex-sync`; `npm run validate:codex-integration`
- Validar command/task registry do Codex: `npm run validate:codex-commands`
- Validar matriz de delegacao do Codex: `npm run validate:codex-delegation`
- Gerar skills locais do Codex: `npm run sync:skills:codex`
- Este repositorio usa **local-first**: prefira `.codex/skills` versionado no projeto
- Use `sync:skills:codex:global` apenas para testes fora deste repo

## Command Resolution (Codex)

Quando um agente no Codex receber um `*comando`, prefira resolver a execucao por esta ordem:

1. Consultar `.codex/command-registry.json`
2. Opcionalmente usar `node .codex/scripts/resolve-codex-command.js <skill-ou-agent> <comando>`
3. Carregar a task/workflow/checklist/template mapeada

Isso evita "file hunting" manual e torna a execucao de workflows/tasks mais deterministica no Codex.

## Delegation Resolution (Codex)

Quando um orqx no Codex precisar decidir um handoff:

1. Consultar `.codex/delegation-matrix.json`
2. Opcionalmente usar `node .codex/scripts/resolve-codex-delegation.js <source-agent> <route>`
3. Distinguir entre:
   - `validator-backed`
   - `codex-shim`
   - `exploratory`

No Codex, nao trate handoffs exploratorios como se fossem caminhos garantidos pelo validator.

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

## Orquestradores (18 orqx: 17 squad + 1 master)

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
| `swarm-orqx` | Mastery | Claude Code, MCP, integracao avancada |

Agents de arquivo: `.codex/agents/<orqx>.md` ou `.claude/agents/<orqx>.md`

## Agentes Especializados (160)

Existem 172 agentes organizados em 17 squads (160 em squads + 12 framework agents, incluindo o master orchestrator). Eles sao acessiveis via:
- `.codex/agents/<agent-name>.md` - arquivo direto
- Chamada interna pelo orqx do squad

Exemplos: `brand-strategist`, `ad-copywriter`, `penetration-tester`, `content-writer`, `ga-analytics-engineer`, etc.

Use `*help` dentro de qualquer orqx para ver os especialistas disponiveis no squad.
