# Gemini Rules - SINAPSE

Este arquivo define as instrucoes do projeto para Gemini CLI neste repositorio.

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

<!-- SINAPSE-MANAGED-START: gemini-integration -->
## Gemini Integration

Fonte de verdade de agentes:
- Canonico: `.sinapse-ai/development/agents/*.md`
- Espelhado para Gemini: `.gemini/rules/SINAPSE/agents/*.md`

Hooks e settings:
- Hooks locais: `.gemini/hooks/`
- Settings locais: `.gemini/settings.json`

Sempre que houver drift, execute:
- `npm run sync:ide:gemini`
- `npm run validate:gemini-sync`
- `npm run validate:gemini-integration`
<!-- SINAPSE-MANAGED-END: gemini-integration -->

<!-- SINAPSE-MANAGED-START: parity -->
## Multi-IDE Parity

Para garantir paridade entre Claude Code, Codex e Gemini:
- `npm run validate:parity`
- `npm run validate:paths`
<!-- SINAPSE-MANAGED-END: parity -->

<!-- SINAPSE-MANAGED-START: activation -->
## Agent Activation

Preferencia de ativacao:
1. Use agentes em `.gemini/rules/SINAPSE/agents/`
2. Se necessario, use fonte canonica em `.sinapse-ai/development/agents/`

Ao ativar agente:
- carregar definicao completa do agente
- renderizar greeting via `node .sinapse-ai/development/scripts/generate-greeting.js <agent-id>`
- manter persona ativa ate `*exit`

Atalhos recomendados no Gemini:
- `/sinapse-menu` para listar agentes
- `/sinapse-<agent-id>` (ex.: `/sinapse-dev`, `/sinapse-architect`)
- `/sinapse-agent <agent-id>` para launcher generico
<!-- SINAPSE-MANAGED-END: activation -->

<!-- SINAPSE-MANAGED-START: commands -->
## Common Commands

- `npm run sync:ide`
- `npm run sync:ide:check`
- `npm run sync:ide:gemini`
- `npm run validate:gemini-sync`
- `npm run validate:gemini-integration`
- `npm run validate:parity`
- `npm run validate:structure`
- `npm run validate:agents`
<!-- SINAPSE-MANAGED-END: commands -->
