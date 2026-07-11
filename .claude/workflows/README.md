# Workflows salvos — orquestração multi-agente como código

Roteiros determinísticos de auditoria multi-agente, invocáveis pelo nome (tool `Workflow` do Claude Code). O controle de fluxo (fases, gates, política de verificação) é código; o julgamento é dos agentes. Padrão consolidado a partir das auditorias reais do repo (AF-20260629, AF-20260702, AF-20260704) e do precedente `deep-dive-rationalization.js`.

> Workflows não têm acesso a `Date.now()` (quebraria resume) — todo roteiro que nomeia arquivo por data exige `args.date` (`YYYYMMDD`).

| Roteiro | Faz | Args obrigatórios | Args opcionais | Saída |
|---|---|---|---|---|
| `audit-clinical` | Fan-out de auditores por frente → verificação adversarial graduada por severidade (critical/high = 2 lentes, medium = 1, low = direto; voto dividido = não-verificado) → síntese com veredito | `date`, `slug` | `fronts` (array de `{key, prompt}` ou keys das 8 frentes default), `context` (lei do dono, fatos que não se re-litigam), `maxFindingsPerFront` | `audits/AF-<date>-<slug>.md` + `{docPath, verdict GO/NO_GO, counts, headline_findings}` |
| `re-baseline` | Verifica item a item os claims de documentos-lastro contra a main atual (`resolved` / `changed` / `open` / `unverifiable`) — o passo mais repetido de toda auditoria nova | `docs` (array de paths) | `write` (bool) + `date` (exigido se write), `context` | placar `{total, resolved, changed, open, unverifiable, open_items, perDoc}` e, com `write`, `audits/AF-<date>-rebaseline.md` |
| `verify-round` | Rodada cética pós-auditoria/pós-fix: re-verifica os achados confirmados de um AF anterior — o que continua, o que caiu, lacunas do critic, itens de mesa | `reportPath`, `date` | `round` (default 2), `context` | `audits/AF-<date>-rodada<N>-verificacao.md` + `{confirmados, cairam, divididos, gaps, mesa_items}` |
| `deep-dive-rationalization` | Deep-dive do core (mapa por módulo + frentes especiais + céticos + plano P0-P3) — precedente histórico, parâmetros fixos | — | — | `docs/audits/DEEP-DIVE-RATIONALIZATION-2026-06.md` |

## Exemplos de invocação

```js
// Auditoria pré-release completa (8 frentes default)
Workflow({ name: 'audit-clinical', args: { date: '20260711', slug: 'pre-release' } })

// Auditoria focada em 3 frentes, com lei do dono
Workflow({ name: 'audit-clinical', args: {
  date: '20260711', slug: 'seguranca-docs',
  fronts: ['seguranca', 'docs-honestidade', 'ci-release'],
  context: 'LEI: potencializar, não cortar. Não re-litigar: frameworkProtection false é modo contribuidor.',
} })

// Re-baseline dos claims de duas auditorias anteriores (só placar, sem relatório)
Workflow({ name: 're-baseline', args: { docs: ['audits/AF-20260702-fable5-upgrade.md', 'audits/AF-20260704-rodada2-verificacao.md'] } })

// Segunda rodada cética sobre um AF, com relatório
Workflow({ name: 'verify-round', args: { reportPath: 'audits/AF-20260711-pre-release.md', date: '20260718', round: 2 } })
```

## Lei destes roteiros

- **Análise, não implementação autônoma** — decisão medida do épico orchestration-consolidation: fan-out multi-agente serve leitura/verificação/síntese; implementação multi-story autônoma fica fora (o caminho assistido venceu a medição 3/3).
- **Achado sem evidência não existe** — todo claim carrega file:line ou comando+saída.
- **Refutado não entra no plano; voto dividido vira "não-verificado"** e sobe pra decisão do dono.
- **Read-only** — roteiros de auditoria não mudam o repo; a única escrita é o próprio relatório em `audits/`.
