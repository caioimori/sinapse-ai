# Hooks: arquitetura de duas camadas

O SINAPSE-AI tem hooks em dois lugares distintos. Isso é proposital, não bug. Esta nota documenta a separação pra evitar confusão futura (auditoria 2026-05-25 BUG-013).

## Camada 1: hooks globais do user (`~/.claude/hooks/`)

**Escopo:** Toda sessão Claude Code do Caio, em qualquer projeto.

**18 hooks .cjs:**

| Hook | Evento | Função |
|---|---|---|
| `unified-grounding.cjs` | UserPromptSubmit | Único entry point. Funde 4 geradores: vault-grounding, ds-grounding, build-best-practices, squad-grounding |
| `vault-grounding.cjs` | gerador (chamado por unified) | Injeta notas do Second Brain por domínio |
| `ds-anti-pattern-guard.cjs` | PostToolUse | Bloqueia Write/Edit com violações DS (C1-C9) |
| `build-best-practices.cjs` | gerador | Injeta playbook de construção do Caio |
| `squad-grounding-router.cjs` | gerador | Detecta squad ativo, injeta DS relacionado |
| `workspace-routing.cjs` | PreToolUse Bash | Reescreve mkdir/git init fora do Workspace pra path canônico |
| `vault-project-register.cjs` | PostToolUse Bash | Registra projeto novo no vault |
| `session-capture.cjs` + `session-capture-worker.cjs` | SessionStart/End | Captura sessões pro cronjob 2:30 BRT enrichment |
| `auto-checkpoint.cjs` | UserPromptSubmit | Cria checkpoints periódicos |
| `precompact-session-digest.cjs` | PreCompact | Resume sessão antes de compactar |
| `code-intel-pretool.cjs` | PreToolUse | Code intelligence prep |
| `healthcheck.cjs` | manual | Diagnostico setup |
| `repair.cjs` | manual | Auto-fix problemas |
| `synapse-engine.cjs` | UserPromptSubmit (subset) | Motor synapse legacy |
| `terminal-bus.cjs` | UserPromptSubmit | Cross-terminal messaging |

**Registrados em `~/.claude/settings.json`:** unified-grounding, session-capture, auto-checkpoint, workspace-routing, vault-project-register, ds-anti-pattern-guard, build-best-practices, chrome-ensure, chrome-brain-log.

**Não-registrados (presentes mas sem entry em settings):** code-intel-pretool, healthcheck, repair, precompact-session-digest, synapse-engine. Estes são executados manualmente ou via fluxo específico.

## Camada 2: hooks do framework (`<repo>/.claude/hooks/`)

**Escopo:** Apenas quando Claude Code está rodando dentro de um repo SINAPSE-AI.

**Hooks principais:**

| Hook | Evento | Função |
|---|---|---|
| `enforce-architecture-first.cjs` | UserPromptSubmit | Bloqueia geração de código sem arquitetura validada |
| `enforce-delegation.cjs` | UserPromptSubmit | Força orchestrators a delegar pra specialists |
| `enforce-nsn-guard.cjs` | UserPromptSubmit | NSN mode: bloqueia "não dá pra fazer" sem 3 tentativas |
| `enforce-story-gate.cjs` | UserPromptSubmit | Bloqueia código sem story Ready |
| `secret-scanning.cjs` | PreToolUse | Detecta secrets em arquivos antes de commit |
| `ids-hook.cjs` | PreToolUse | Mantém install-manifest.yaml sincronizado |

**Por que separados:** rules do framework (documentation-first, mandatory-delegation, workflow-execution) só fazem sentido dentro de um repo SINAPSE-AI. Aplicar globalmente em todo projeto pequeno seria over-engineering.

## Como decidir onde colocar um hook novo

| Hook deve rodar em... | Lugar |
|---|---|
| Toda sessão do Caio, qualquer projeto | `~/.claude/hooks/` |
| Apenas dentro de repos SINAPSE-AI | `<repo>/.claude/hooks/` |
| Toda sessão MAS com config diferente por projeto | `~/.claude/hooks/` + lê config local (`.claude/config.json` do projeto) |

## Não duplicar

Se um hook precisa rodar em ambas as camadas, criar em uma e o outro lugar **carrega** o primeiro. Não copy-paste. Exemplo: workspace-routing vive em `~/.claude/hooks/` e qualquer projeto que precisar usa via reference.

## Refs

- `~/.claude/settings.json` — registro dos hooks globais
- `<repo>/.claude/settings.json` — registro dos hooks do framework
- Auditoria que gerou esta nota: `docs/audits/2026-05-25-framework-gargalos-audit.md` (BUG-013)
