# AGENTS.md - SINAPSE (Codex CLI)

Este arquivo define as instrucoes do projeto para o Codex CLI.

<!-- SINAPSE-MANAGED-START: core -->
## Core Rules

1. Siga a Constitution em `.sinapse-ai/constitution.md`
2. Priorize `CLI First -> Observability Second -> UI Third`
3. Trabalhe por stories em `docs/stories/`
4. Nao invente requisitos fora dos artefatos existentes
<!-- SINAPSE-MANAGED-END: core -->

<!-- SINAPSE-MANAGED-START: quality -->
## Quality Gates

- Rode `npm run lint`
- Rode `npm run typecheck`
- Rode `npm test`
- Atualize checklist e file list da story antes de concluir
<!-- SINAPSE-MANAGED-END: quality -->

<!-- SINAPSE-MANAGED-START: codebase -->
## Project Map

- Core framework: `.sinapse-ai/`
- CLI entrypoints: `bin/`
- Shared packages: `packages/`
- Tests: `tests/`
- Docs: `docs/`
<!-- SINAPSE-MANAGED-END: codebase -->

<!-- SINAPSE-MANAGED-START: commands -->
## Common Commands

- `npm run sync:ide`
- `npm run sync:ide:check`
- `npm run sync:skills:codex`
- `npm run sync:skills:codex:global` (opcional; neste repo o padrao e local-first)
- `npm run validate:structure`
- `npm run validate:agents`
<!-- SINAPSE-MANAGED-END: commands -->

<!-- SINAPSE-MANAGED-START: shortcuts -->
## Agent Shortcuts

Preferencia de ativacao no Codex CLI:
1. Use `/skills` e selecione `sinapse-<agent-id>` vindo de `.codex/skills` (ex.: `sinapse-architect`)
2. Se preferir, use os atalhos abaixo (`@architect`, `/architect`, etc.)

Interprete os atalhos abaixo carregando o arquivo correspondente em `.sinapse-ai/development/agents/` (fallback: `.codex/agents/`), renderize o greeting via `generate-greeting.js` e assuma a persona ate `*exit`:

- `@architect`, `/architect`, `/architect.md` -> `.sinapse-ai/development/agents/architect.md`
- `@developer`, `/dev`, `/dev.md` -> `.sinapse-ai/development/agents/developer.md`
- `@quality-gate`, `/qa`, `/qa.md` -> `.sinapse-ai/development/agents/quality-gate.md`
- `@project-lead`, `/pm`, `/pm.md` -> `.sinapse-ai/development/agents/project-lead.md`
- `@product-lead`, `/po`, `/po.md` -> `.sinapse-ai/development/agents/product-lead.md`
- `@sprint-lead`, `/sm`, `/sm.md` -> `.sinapse-ai/development/agents/sprint-lead.md`
- `@analyst`, `/analyst`, `/analyst.md` -> `.sinapse-ai/development/agents/analyst.md`
- `@devops`, `/devops`, `/devops.md` -> `.sinapse-ai/development/agents/devops.md`
- `@data-engineer`, `/data-engineer`, `/data-engineer.md` -> `.sinapse-ai/development/agents/data-engineer.md`
- `@ux-design-expert`, `/ux-design-expert`, `/ux-design-expert.md` -> `.sinapse-ai/development/agents/ux-design-expert.md`
- `@squad-creator`, `/squad-creator`, `/squad-creator.md` -> `.sinapse-ai/development/agents/squad-creator.md`
- `@sinapse-orqx`, `/sinapse-orqx`, `/sinapse-orqx.md` -> `.sinapse-ai/development/agents/sinapse-orqx.md`
<!-- SINAPSE-MANAGED-END: shortcuts -->
