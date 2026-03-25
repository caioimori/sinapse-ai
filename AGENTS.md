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

Atalhos aceitos por agente:
- `@sinapse-orqx`, `/sinapse-orqx`, `/sinapse-orqx.md` -> `.sinapse-ai/development/agents/sinapse-orqx.md`
- `@analyst`, `/analyst`, `/analyst.md` -> `.sinapse-ai/development/agents/analyst.md`
- `@architect`, `/architect`, `/architect.md` -> `.sinapse-ai/development/agents/architect.md`
- `@data-engineer`, `/data-engineer`, `/data-engineer.md` -> `.sinapse-ai/development/agents/data-engineer.md`
- `@dev`, `/dev`, `/dev.md` -> `.sinapse-ai/development/agents/developer.md`
- `@devops`, `/devops`, `/devops.md` -> `.sinapse-ai/development/agents/devops.md`
- `@pm`, `/pm`, `/pm.md` -> `.sinapse-ai/development/agents/project-lead.md`
- `@po`, `/po`, `/po.md` -> `.sinapse-ai/development/agents/product-lead.md`
- `@qa`, `/qa`, `/qa.md` -> `.sinapse-ai/development/agents/quality-gate.md`
- `@sm`, `/sm`, `/sm.md` -> `.sinapse-ai/development/agents/sprint-lead.md`
- `@squad-creator`, `/squad-creator`, `/squad-creator.md` -> `.sinapse-ai/development/agents/squad-creator.md`
- `@ux-design-expert`, `/ux-design-expert`, `/ux-design-expert.md` -> `.sinapse-ai/development/agents/ux-design-expert.md`

Resposta esperada ao ativar atalho:
1. Confirmar agente ativado
2. Mostrar 3-6 comandos principais (`*help`, etc.)
3. Seguir na persona do agente
