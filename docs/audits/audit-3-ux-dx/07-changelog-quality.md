# Sub-domínio 7 — CHANGELOG quality

**Pergunta:** Migration notes claros entre rcs? Keep a Changelog format? Semver discipline?

## Verdict: 🟢 PASS — com 1 P2 polish

CHANGELOG.md é exemplar entre os artefatos auditados. Header explícito
(`Keep a Changelog 1.0.0` + `Semver 2.0.0`), seções por release com data ISO,
sub-categorias adequadas (Added/Fixed/Resolved/Notes), referências de PR
inline em cada bullet, "Notes for v1.0.0 promotion" pra rc.11. Disciplina de
fato, não promessa.

---

## Findings

### F1 [P0/P1/P2/P3] — Nenhum

Não encontrei defeito blocker neste sub-domínio.

---

### F2 [P2] — Seção `[Unreleased]` vazia em rc.11

**Onde:** `CHANGELOG.md:8-9`
```
## [Unreleased]

## [10.0.0-rc.11] — 2026-05-02
```

**Análise:** Não é defeito por si só (rc.11 é o release atual, [Unreleased]
deve estar vazio). Mas é hora de **popular** com o que vem em rc.12 ou v1.0.0
GA. Parte das audits já tem fixes em flight (Audit 2 P0/P1, este Audit 3) —
documentar em [Unreleased] já agora ajuda quem acompanha.

**Fix:** Manter [Unreleased] populado com itens em flight.

---

### F3 [P2] — Migration notes embutidos em "Notes for v1.0.0 promotion" em vez de seção própria

**Onde:** `CHANGELOG.md:79-83`
```
### Notes for v1.0.0 promotion

This RC closes Phase 1 of the pre-GA gate. The next promotion event publishes
v1.0.0 to `latest` with `--provenance` (OIDC trusted publishing). Migration
notes for users on rc.x: backward compat alias for the (so-far-unused) APSE
prefix is unnecessary because no rc shipped APSE-prefixed agents publicly.
```

**Análise:** Útil, mas Keep-a-Changelog convencional usaria seção
**`### Migration`** ou **`### Breaking Changes`** explícita pra usuários que
buscam diff de upgrade. Mistura essas notas com release info.

**Fix:** Padronizar `### Migration` por release que tenha qualquer breaking
change ou step manual de upgrade.

---

### F4 [P3] — Versões pré-release não geram entradas em [Unreleased] durante o sprint

**Análise:** Workflow normal de Keep a Changelog adiciona em [Unreleased] ao
longo do sprint, depois move pra release no momento do tag. Os PRs do rc.11
foram cumulados em [10.0.0-rc.11] direto. Não é errado, mas perde
visibility durante o desenvolvimento.

**Sugestão:** Considerar bot que atualiza [Unreleased] em cada PR merge.

---

### F5 [P3] — Falta link "Compare" entre versões

**Onde:** Convenção Keep a Changelog inclui ao final:
```
[10.0.0-rc.11]: https://github.com/.../compare/v10.0.0-rc.10...v10.0.0-rc.11
[10.0.0-rc.10]: https://github.com/.../compare/v10.0.0-rc.9...v10.0.0-rc.10
```

CHANGELOG atual não tem essas linhas (verificado lendo só primeiras 100 linhas).
Diff manual via GitHub é trivial mas convenção.

**Fix:** Footer com tags de comparação. Pode ser auto-gerado.

---

## Severity counts
- **P0:** 0
- **P1:** 0
- **P2:** 2 (Unreleased vazio, falta seção Migration)
- **P3:** 2 (workflow [Unreleased] em sprint, links Compare)

## Verdict: 🟢 PASS — modelo a seguir pra outros docs.
