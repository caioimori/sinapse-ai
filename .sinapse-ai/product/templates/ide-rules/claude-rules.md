# SINAPSE Development Rules for Claude Code

SINAPSE orquestra agentes de IA em squads para fluxos de desenvolvimento complexos.

<!-- SINAPSE-MANAGED-START: core-framework -->
## Core Framework Understanding

SINAPSE is a meta-framework that orchestrates AI agents to handle complex development workflows. Always recognize and work within this architecture.
<!-- SINAPSE-MANAGED-END: core-framework -->

<!-- SINAPSE-MANAGED-START: constitution -->
## Constitution

O SINAPSE possui uma **Constitution formal** com principios inegociaveis (`.sinapse-ai/constitution.md`). Gates automaticos bloqueiam violacoes no caminho autonomo (pipeline/motor); no chat interativo a delegacao (Art. VIII) e instrucao de prompt, nao bloqueio de hook — ver Art. VIII na Constitution para a lista exata do que e deterministico.

| Artigo | Principio | Severidade |
|--------|-----------|------------|
| I | CLI First | NON-NEGOTIABLE |
| II | Agent Authority | NON-NEGOTIABLE |
| III | Documentation-First Development | NON-NEGOTIABLE |
| IV | No Invention | MUST |
| V | Quality First | MUST |
| VI | Absolute Imports | SHOULD |
| VII | Ecosystem Metrics Accuracy | NON-NEGOTIABLE |
| VIII | Mandatory Delegation | NON-NEGOTIABLE |
| IX | Safe Collaboration | NON-NEGOTIABLE |
| X | Security & Data Protection | NON-NEGOTIABLE |
| XI | Conservative Default | MUST |
<!-- SINAPSE-MANAGED-END: constitution -->

<!-- SINAPSE-MANAGED-START: sistema-de-agentes -->
## Sistema de Agentes

Ative com `@agent-name`; comandos usam prefixo `*`.

| Agente | Persona | Escopo |
|--------|---------|--------|
| `@developer` | Pixel | Codigo |
| `@quality-gate` | Litmus | Qualidade |
| `@architect` | Stratum | Arquitetura |
| `@project-lead` | Beacon | Product Management |
| `@product-lead` | Axis | Product Owner |
| `@sprint-lead` | Sync | Scrum Master |
| `@analyst` | Scope | Pesquisa |
| `@data-engineer` | Tensor | Database |
| `@ux-design-expert` | Mosaic | UX/UI |
| `@devops` | Pipeline | CI/CD, git push (EXCLUSIVO) |
<!-- SINAPSE-MANAGED-END: sistema-de-agentes -->

<!-- SINAPSE-MANAGED-START: agent-system -->
## Agent System

Master agent: `@sinapse-orqx`. Stay in persona until `*exit`.
<!-- SINAPSE-MANAGED-END: agent-system -->

## Development Methodology

Documentation-First (NON-NEGOTIABLE): Epic -> Story -> Validation -> Implementation, automatico. No code sem story em `docs/stories/` com status >= Ready.

<!-- SINAPSE-MANAGED-START: framework-structure -->
## SINAPSE Framework Structure

Framework core em `.sinapse-ai/`; trabalho do projeto em `docs/` (stories, prd, architecture).
<!-- SINAPSE-MANAGED-END: framework-structure -->

<!-- SINAPSE-MANAGED-START: framework-boundary -->
## Framework vs Project Boundary

Modelo de 4 camadas (L1-L4) separa framework e projeto (`.claude/settings.json` reforca via deny rules).

| Camada | Mutabilidade | Exemplo |
|--------|-------------|---------|
| **L1** Framework Core | NEVER modify | `.sinapse-ai/core/` |
| **L2** Framework Templates | NEVER modify | `.sinapse-ai/development/tasks/` |
| **L3** Project Config | Mutable (exceptions) | `core-config.yaml` |
| **L4** Project Runtime | ALWAYS modify | `docs/stories/`, `packages/` |

**Toggle:** `boundary.frameworkProtection` em `core-config.yaml` (default true para projetos, false para contribuidores do framework).
<!-- SINAPSE-MANAGED-END: framework-boundary -->

<!-- SINAPSE-MANAGED-START: rules-system -->
## Rules System

Carregadas de `.claude/rules/` automaticamente:

`agent-authority.md` · `agent-handoff.md` · `agent-memory-imports.md` · `coderabbit-integration.md` · `ids-principles.md` · `mcp-usage.md` · `story-lifecycle.md` · `workflow-execution.md`
<!-- SINAPSE-MANAGED-END: rules-system -->

<!-- SINAPSE-MANAGED-START: code-intelligence -->
## Code Intelligence

Opcional: **Configured** (ativo), **Fallback** (indisponivel, degrada), **Disabled** (sem provider). `isCodeIntelAvailable()` verifica antes de operar — nunca falha se ausente.
<!-- SINAPSE-MANAGED-END: code-intelligence -->

<!-- SINAPSE-MANAGED-START: graph-dashboard -->
## Graph Dashboard

```bash
sinapse graph --deps                        # Dependency tree
sinapse graph --deps --format=json          # JSON
sinapse graph --deps --format=html          # Interactive HTML
sinapse graph --deps --watch                # Auto-refresh
sinapse graph --stats                       # Entity stats
```
<!-- SINAPSE-MANAGED-END: graph-dashboard -->

## Workflow Execution

Leia a task completa, execute os passos em sequencia, trate erros com mensagens acionaveis.

## Best Practices

Verifique padroes existentes, reutilize componentes, rode `npm run lint` + `npm run typecheck` antes de concluir.

<!-- SINAPSE-MANAGED-START: sinapse-patterns -->
## SINAPSE-Specific Patterns

Templates via `loadTemplate()`/`renderTemplate()`; comandos `*` roteados por `executeAgentCommand()`.
<!-- SINAPSE-MANAGED-END: sinapse-patterns -->

## Debugging

Erros devem incluir contexto acionavel e sugestao de correcao. Rode `sinapse doctor` para diagnosticar o ambiente.

<!-- SINAPSE-MANAGED-START: common-commands -->
## Common Commands

- `*help` / `*create-story` / `*task {name}` / `*workflow {name}`
- `npm run dev` / `npm test` / `npm run lint` / `npm run build`
<!-- SINAPSE-MANAGED-END: common-commands -->

---
*SINAPSE Claude Code Configuration v5.0*
