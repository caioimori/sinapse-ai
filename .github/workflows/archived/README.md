# Archived GitHub Workflows

Workflows preservados aqui (com extensão `.disabled` pra GitHub Actions ignorar) ao invés de deletar — preserva history + permite reativação fácil se necessário.

## Por que arquivamos

Cada workflow aqui foi auditado e identificado como **zumbi** (zero runs num período relevante) OU **dead concept** (referente a feature deprecated).

## Como reativar

```bash
git mv .github/workflows/archived/{name}.yml.disabled .github/workflows/{name}.yml
```

## Lista atual

| Workflow | Razão | Auditoria |
|---|---|---|
| `issue-labeler.yml.disabled` | 0 runs em 60+ dias (Stowaway Audit 2026-05-06) | `docs/audits/2026-05-06-stowaway-audit.md` |
| `publish-pro.yml.disabled` | Feature PRO removida (2026-05-06 PR #166) | `docs/audits/2026-05-06-stowaway-audit.md` + master audit |

## Quando deletar definitivo

Após 6 meses sem reativação + sem references no repo, considerar `git rm`. Por enquanto, manter preserva trilha de decisão.
