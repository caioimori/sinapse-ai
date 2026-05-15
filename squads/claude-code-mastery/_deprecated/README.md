# Deprecated Agents — claude-code-mastery

Estes arquivos foram movidos para `_deprecated/` em 2026-05-15 durante auditoria de consistencia entre `squad.yaml` e arquivos reais em `agents/`.

## Por que foram depreciados

### `claude-orqx.md` (Orion — versao curta)

Duplicata do orquestrador canonico **`claude-mastery-chief.md`** (tambem Orion).

- `claude-mastery-chief.md` segue formato persona BMAD completo (555 linhas, activation-instructions, persona_profile, communication YAML)
- `claude-orqx.md` era versao curta (132 linhas, formato markdown plain) que existiu como rascunho
- `squad.yaml` declara apenas `claude-mastery-chief` como `entry_agent`

**Canonico:** `agents/claude-mastery-chief.md`

### `db-sage.md`

Nao pertence a este squad. E um clone autonomo (formato `.codex/agents/`) cujo lar original e:

- `.codex/agents/db-sage.md` — copia oficial
- `.sinapse-ai/development/agents/snps-orqx.md` — registro do agente real

O agente `db-sage` opera dentro da Story Development Cycle (database engineering), nao dentro do dominio Claude Code Mastery.

### `tools-orqx.md`

Mesmo caso de `db-sage.md`. Clone autonomo `.codex/`-style. Lar original:

- `.codex/agents/tools-orqx.md`

O agente `tools-orqx` orquestra revisao/criacao/extracao de frameworks — dominio cross-squad, nao especifico de Claude Code Mastery.

## O que fazer se voce caiu aqui via link quebrado

- Para orquestrar Claude Code Mastery, use `agents/claude-mastery-chief.md` (Orion)
- Para tarefas de banco de dados autonomas, use `.codex/agents/db-sage.md`
- Para orquestracao de tools/frameworks, use `.codex/agents/tools-orqx.md`

## Politica

Arquivos em `_deprecated/` permanecem no repo por compatibilidade (links externos, historico de auditoria) mas NAO sao ativados pelo installer nem aparecem em `squad.yaml`. Podem ser removidos definitivamente apos um ciclo de auditoria sem referencias.
