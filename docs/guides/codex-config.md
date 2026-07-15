# AGENTS.md - SINAPSE

Este arquivo configura o comportamento esperado de agentes no Codex CLI neste repositório.

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

## Workflow Obrigatório

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
- Documentação: `docs/`

## IDE/Agent Sync

- Sincronizar regras/agentes: `npm run sync:ide`
- Validar drift: `npm run sync:ide:check`
- Rodar paridade Claude/Codex: `npm run validate:parity`
- Sync Claude Code: `npm run sync:ide:claude`
- Sincronizar Codex: `npm run sync:ide:codex`
- Validar Codex sync/integration: `npm run validate:codex-sync`; `npm run validate:codex-integration`
- Validar command/task registry do Codex: `npm run validate:codex-commands`
- Validar matriz de delegação do Codex: `npm run validate:codex-delegation`
- Gerar skills locais do Codex: `npm run sync:skills:codex`
- Este repositório usa **local-first**: `.agents/skills` é a única raiz de skills SINAPSE versionada no projeto
- Use `sync:skills:codex:global` apenas para testes fora deste repo

## Command Resolution (Codex)

Quando um agente no Codex receber um `*comando`, prefira resolver a execução por esta ordem:

1. Consultar `.codex/command-registry.json`
2. Opcionalmente usar `node .codex/scripts/resolve-codex-command.js <skill-ou-agent> <comando>`
3. Carregar a task/workflow/checklist/template mapeada

Isso evita "file hunting" manual e torna a execução de workflows/tasks mais determinística no Codex.

## Delegation Resolution (Codex)

Quando um orqx no Codex precisar decidir um handoff:

1. Consultar `.codex/delegation-matrix.json`
2. Opcionalmente usar `node .codex/scripts/resolve-codex-delegation.js <source-agent> <route>`
3. Distinguir entre:
   - `validator-backed`
   - `codex-shim`
   - `exploratory`

No Codex, não trate handoffs exploratórios como se fossem caminhos garantidos pelo validator.

## Ativação de agentes (Codex)

- Use `$snps` para roteamento pelo orquestrador principal.
- Use `$sinapse-agent <agent-id>` para ativação direta, por exemplo
  `$sinapse-agent developer` ou `$sinapse-agent architect`.
- O ativador paramétrico resolve a fonte canônica e apenas tasks existentes;
  não interprete `@agent`, slash commands ou aliases curtos como ativação Codex.

## Orquestradores (18 orqx: 17 squad + 1 master)

Cada orqx coordena um squad completo de agentes especializados. Use `$snps` para
roteamento ou `$sinapse-agent <orqx-id>` para ativação direta:

| Orqx | Squad | Foco |
|------|-------|------|
| `sinapse-orqx` | Core | Orquestrador principal de todos os squads |
| `brand-orqx` | Brand | Estratégia de marca, arquétipos, auditoria |
| `copy-orqx` | Copy | Copywriting persuasivo, headlines, conversão |
| `content-orqx` | Content | Governança editorial, estratégia de conteúdo |
| `storytelling-orqx` | Storytelling | Narrativa, roteiros, frameworks de história |
| `commercial-orqx` | Commercial | Vendas, funil, revenue, pipeline |
| `paidmedia-orqx` | Paid Media | Meta Ads, Google Ads, campanhas |
| `growth-orqx` | Growth | Analytics, CRO, SEO, growth hacking |
| `research-orqx` | Research | Market analysis, inteligência competitiva |
| `product-orqx` | Product | Product discovery, estratégia, operações |
| `design-orqx` | Design | Design systems, componentes, tokens |
| `animations-orqx` | Animations | Motion design, CSS, partículas, 3D |
| `cyber-orqx` | Cybersecurity | Segurança, threat intel, pentest |
| `finance-orqx` | Finance | Budget, pricing, profitability |
| `courses-orqx` | Courses | Currículos, assessments, launch |
| `cloning-orqx` | Cloning | Clonagem cognitiva, mind synthesis |
| `council-orqx` | Council | Advisors estratégicos (Munger, Dalio, Thiel) |
| `swarm-orqx` | Mastery | Claude Code, MCP, integração avançada |

Adapters de arquivo: `.claude/agents/sinapse-<orqx-id>.md` no Claude Code e
`.codex/agents/<orqx-id>.toml` (com companion `.md`) no Codex.

## Agentes Especializados (160)

Existem 172 agentes organizados em 17 squads (160 em squads + 12 framework agents, incluindo o master orchestrator). Eles são acessíveis via:
- `.claude/agents/sinapse-<agent-id>.md` - agent nativo do Claude Code
- `.codex/agents/<agent-id>.toml` e `.codex/agents/<agent-id>.md` - adapters Codex
- Chamada interna pelo orqx do squad

Exemplos: `brand-strategist`, `ad-copywriter`, `penetration-tester`, `content-writer`, `ga-analytics-engineer`, etc.

Use `*help` dentro de qualquer orqx para ver os especialistas disponíveis no squad.
