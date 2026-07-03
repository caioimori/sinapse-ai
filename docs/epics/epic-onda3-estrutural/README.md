# Épico: Onda 3 Estrutural — do "otimizado" ao "robusto por design"

> Fonte: `audits/AF-20260702-fable5-upgrade.md` §Onda 3 (5 itens estruturais).
> Autorização: Caio, 2026-07-03 — "Segue com a Onda 3 no yolo mode até finalizar
> literalmente toda otimização 100%".
> Princípio regente: **nada de verde falso** — cada item fecha com gate determinístico,
> teste ou medição registrada; o item 3.5 fecha com o veredito da medição, seja ele qual for.

## Stories

| Story | Item da auditoria | Entrega |
|---|---|---|
| O3-S1 `onda3-s1-article-iv-traceability` | 3.2 No Invention sem dente | Check determinístico de rastreabilidade arquivo→AC (pre-push local onde as stories vivem + SKIP honesto no CI), modo warning na calibração |
| O3-S2 `onda3-s2-greenfield-artifact-gates` | 3.4 Greenfield gates decorativos | Gate "artefato existe e não-vazio" por estágio da Phase 1 + `confirmation_required` do YAML consumido de verdade |
| O3-S3 `onda3-s3-brownfield-progress-gate` | 3.3 Brownfield fan-out aspiracional | Progresso determinístico por fase (artefatos no disco) + Gate QA da Fase 7 avaliado em código (APPROVED/NEEDS_WORK, máx 2 voltas) |
| O3-S4 `onda3-s4-behavioral-eval-regression` | 3.1 Eval não é gate | Golden set comportamental versionado dos bugs de 30/06 (build vazio, plano stub, gate sem checks, sinal de falha upstream) + `npm run eval:e2e` no gate de merge |
| O3-S5 `onda3-s5-epic-waves-wrapper-pilot` | 3.5 Epic waves sem executor | Wrapper fino no harness (gate de wave executável: testes verdes + arquivos realmente escritos) + **piloto MEDIDO** repetindo o protocolo de 30/06 — gate pré-registrado: se não vencer/empatar com custo menor vs nativo, não vira produto |

## Restrições herdadas (não re-litigar)

- Veredito HÍBRIDO (30/06) é lei: nenhum item ressuscita o motor caseiro multi-story.
  O caminho de waves é harness-based com gates determinísticos.
- `_spawnAgent` continua handoff manual honesto — nenhuma fabricação de sucesso.
- Adoção de fan-out autônomo (3.3/3.5) exige gate de medição ANTES de virar produto.

## Critério de "100%" do épico

Cada story mergeada na main com testes/lint/typecheck verdes + este README atualizado
com o resultado real de cada item (inclusive um eventual "medido e reprovado" no 3.5,
que fecha o item por veredito, não por código shipped).
