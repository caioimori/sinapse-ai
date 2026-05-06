# Constitution Compliance — Status de Validação por Artigo

> Resolve gargalo MEDIUM #8 do deep-audit (2026-05-05). Documenta quais dos 10 artigos da Constitution têm validador automático e quais dependem de hooks runtime ou revisão manual.

## Resumo

| Validação | Quantidade |
|---|---|
| Script automatizado dedicado | 3/10 |
| Hook runtime (PreToolUse / UserPromptSubmit) | 4/10 |
| Manual / aspiracional | 3/10 |

## Por artigo

### Article I — CLI First
- **Validação**: manual
- **Como verificar**: toda feature precisa funcionar 100% via CLI antes de qualquer UI. Code review checa.
- **Gap**: sem script automatizado. Aspirational + revisão de PR.
- **Sugestão futura**: script que detecta novos arquivos em `app/` (UI) sem comando CLI equivalente em `bin/`.

### Article II — Agent Authority
- **Validação**: hook runtime (`enforce-git-push-authority.sh` + `enforce-delegation.cjs`)
- **Como verificar**: hook bloqueia push de qualquer agente que não seja `@devops`
- **Gap**: hook só pega tentativas dentro do Claude Code. Pushes via terminal direto fora do agente não são bloqueados.

### Article III — Documentation-First
- **Validação**: hook runtime (`enforce-story-gate.cjs` + `enforce-architecture-first.cjs`)
- **Como verificar**: hook bloqueia Write/Edit em paths protegidos sem story em `docs/stories/`
- **Gap**: hook não valida qualidade da story (apenas existência).

### Article IV — No Invention
- **Validação**: manual + parcial via `validate:no-external-refs`
- **Como verificar**: spec.md deve traçar todo statement pra FR/NFR/CON ou research finding
- **Gap**: sem script que valide rastreabilidade de spec → requirements.

### Article V — Quality First
- **Validação**: implícito em CI (Jest, ESLint, TypeCheck, CodeQL, manifest parity)
- **Como verificar**: CI gate `Validation Summary` agrega todos.
- **Gap**: nenhum (cobertura full via CI).

### Article VI — Absolute Imports
- **Validação**: ESLint (`eslint.config.js`)
- **Como verificar**: lint rule `no-relative-import-paths/no-relative-import-paths`
- **Gap**: nenhum.

### Article VII — Metrics Accuracy
- **Validação**: ✅ **script dedicado** (`npm run validate:article-vii`)
- **Como verificar**: cruza counts em README/AGENTS.md/package.json/wizard contra `.sinapse-ai/constitution.md` (fonte canônica via `sync:counts`)
- **Gap**: nenhum.

### Article VIII — Mandatory Delegation
- **Validação**: ✅ **script dedicado** (`npm run validate:article-viii`) + hook (`enforce-delegation.cjs`)
- **Como verificar**: script valida que orchestrators (`*-orqx`) não executam código diretamente. Hook bloqueia em runtime.
- **Gap**: nenhum.

### Article IX — Safe Collaboration
- **Validação**: hooks pre-push (`pre-commit-version-check.sh`) + branch protection settings
- **Como verificar**: GitHub branch protection bloqueia force push e delete em `main`. Hook bloqueia push direto sem PR.
- **Gap**: validação de "ambos co-maintainers ativos" sem script. Hoje 100% via config GitHub.

### Article X — Security & Data Protection
- **Validação**: parcial (hooks `secret-scanning.cjs`, `sql-governance.py`, `read-protection.py`)
- **Como verificar**: 25 deployment blockers em `~/.claude/rules/security-data-protection.md`. Hooks pegam alguns (secrets, SQL injection, sensitive file reads). Outros (RLS, MFA, LGPD compliance) são manuais.
- **Gap**: 22 dos 25 blockers dependem de revisão manual. Maior gap aspiracional.

### Article XI — Conservative Default
- **Validação**: ✅ **script dedicado** (`npm run validate:article-xi`)
- **Como verificar**: detecta deletions em paths protegidos sem `Article XI override:` em commit msg ou PR body
- **Gap**: nenhum.

## Roadmap pra fechar gaps

### Próximas stories sugeridas

1. **`validate-article-i.js`** — script que detecta features UI sem CLI equivalente
2. **`validate-article-iv.js`** — valida que cada item em spec.md tem trace pra FR/NFR/CON
3. **`security-checklist-cli.js`** — comando `npx sinapse-ai security-check` que roda os 25 deployment blockers em ordem

### Não-prioritário

- Article V tem cobertura suficiente via CI agregado
- Article VI tem ESLint
- Article IX é governado por GitHub settings (não cabe em script)

---

*Atualizar este doc sempre que novo validador for criado ou hook for adicionado.*
