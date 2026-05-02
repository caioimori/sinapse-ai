# Audit 1 — Funcional (Pre-GA) — SUMMARY

> **Status:** Complete
> **Date:** 2026-05-02
> **Executor:** @architect (Aria, Visionary)
> **Question:** "Tudo que o framework diz que faz, faz mesmo?"

## Verdict per Sub-domain

| # | Sub-domain | Verdict | P0 | P1 | P2 | P3 |
|---|---|---|---|---|---|---|
| 1 | Install matrix | 🟢 PASS | 0 | 0 | 1 | 1 |
| 2 | Agent invocation | 🟡 CONCERNS | 0 | 3 | 1 | 1 |
| 3 | Squad orqx routing | 🟢 PASS | 0 | 0 | 2 | 1 |
| 4 | Workflows e2e | 🟢 PASS | 0 | 0 | 1 | 1 |
| 5 | Hooks runtime | 🟡 CONCERNS | 0 | 0 | 4 | 2 |
| 6 | MCP integrations | 🟢 PASS | 0 | 0 | 0 | 2 |
| 7 | Doctor matrix | 🟡 CONCERNS | 0 | 1 | 3 | 1 |
| 8 | Uninstall completeness | 🔴 **FAIL** | **2** | 1 | 2 | 1 |

**Total: 2 P0 · 5 P1 · 14 P2 · 10 P3 = 31 findings**

## GA Blockers (P0)

- **UN-1** — Uninstall deixa ~178 arquivos `.md` órfãos em `~/.claude/agents/` e `~/.codex/agents/`. Install copia TODOS os `*.md` (`bin/cli.js:586,596,1107,1117`), uninstall só remove `*-orqx.md` via regex `/-orqx\.md$/` (`bin/cli.js:1220`). Contrato `npx sinapse-ai uninstall --yes` violado.
- **UN-2 (P1, alta visibilidade)** — Install escreve `~/.claude/CLAUDE.md` (linha 812), uninstall nunca remove. Pode sobrescrever CLAUDE.md prévio do usuário e deixar conteúdo SINAPSE permanente.

## P1 (Bloco Fix)

- **AG-1** — Entity-registry só indexa 12 agents framework; 188 agents de squads não catalogados (94% invisíveis a tools)
- **AG-3** — 4 nomes de agents colidem cross-squad: **Forge** (×3), **Arc** (×4), Nexus (×2), Lens (×2)
- **AG-2** — Sem schema enforced para frontmatter de agent (3 formatos coexistem: YAML block, bullet list, table)
- **DOC-1** — Doctor `ide-sync: 12/12 ✓` é falso positivo — ignora 188 squad agents
- **Manifest drift** — `install-manifest.yaml` version=`10.0.0-rc.10`, `package.json` version=`10.0.0-rc.11` (não detectado pelo doctor)

## P2 (backlog não-bloqueante)

14 itens — observability gaps, idempotency hardening, hook fail-mode docs, install matrix expansion, etc. Detalhes em cada sub-report.

## P3 (cosmético)

10 itens — copy/grammar drift, comments outdated, etc.

## Recommendation

**🟡 PAUSE → fix P0+P1 críticos → re-smoke → Audit 2.**

Os 2 P0 (uninstall) são não-negociáveis. P1 que afetam confiança do usuário (entity-registry incompleto, doctor falso positivo, manifest drift) também devem entrar no Bloco Fix antes de Audit 2 começar. Audit 2 (qualidade) pode rodar em paralelo a fixes P2/P3 — não bloqueia.

## Stories propostas

1. **[P0]** `fix(uninstall): remove all SINAPSE-authored agent files from ~/.claude/agents and ~/.codex/agents`
2. **[P0]** `fix(uninstall): clean ~/.claude/CLAUDE.md (with backup-restore)`
3. **[P1]** `feat(registry): index 188 squad agents + frontmatter schema validator`
4. **[P1]** `chore(rename): resolve agent name collisions` (fold into APSE rename block)
5. **[P1]** `fix(doctor): correct ide-sync count + add manifest-version-parity check`
6. **[P1]** `fix(manifest): regenerate install-manifest.yaml to match rc.11`

## Links

- `01-install-matrix.md`
- `02-agent-invocation.md`
- `03-squad-orqx-routing.md`
- `04-workflows-e2e.md`
- `05-hooks-runtime.md`
- `06-mcp-integrations.md`
- `07-doctor-matrix.md`
- `08-uninstall-completeness.md`

## Audit limits

- Inspeção de arquivos, não execução em VM clean
- Hook idempotency/fail-mode não exercitada em runtime
- Sample de 16 agents pra frontmatter (não 200)
- Cross-platform validado por histórico CI (24/27 PASS) + doctor local Windows
