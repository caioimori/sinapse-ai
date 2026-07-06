# Épico: Rodada 2 — Mesa fase 2 (itens decision-gated + builds residuais)

**Status:** Done (4 executados + item 5 resolvido-provisório) — ADR-01/02, PRs #363/#364/#365, ADR-03
**Origem:** os 5 itens da Mesa (`audits/AF-20260704-rodada2-verificacao.md`) que ficaram
**fora** do épico `epic-rodada2-mesa` por dependerem de decisão do dono ou de build próprio.
**Autorização:** Caio, 2026-07-06 ("go na ordem sequencial ideal, qualidade/performance/token").
**Método:** doc-first — decisões viram ADR (governança, acima da camada de story); builds viram
story `Ready` + implementação + verificação adversarial + PR.

## Contexto

A fase 1 (`epic-rodada2-mesa`, 6/6, PRs #357-#362) atacou os 6 itens código/docs sem trava de
decisão. Restaram 5, ordenados aqui por custo × risco × valor (a ordem ideal pedida):

| Ordem | Item da Mesa | Natureza | Entrega |
|-------|--------------|----------|---------|
| 1 | Frota de auditoria como produto | decisão (parecer: NÃO) | ADR-01 |
| 2 | Aliases datados no LiteLLM (`.docker`) | infra legada | ADR-02 |
| 3 | ACs em formato executável (GWT) | guard advisory | story `mesa2-acs-gwt-guard` → PR #364 ✅ |
| 4 | Calibração do juiz LLM (golden set) | build | story `mesa2-llm-judge-calibration` → PR #365 ✅ |
| 5 | Escopo por path das rules NON-NEGOTIABLE situacionais | **decisão constitucional** | ADR-03 — resolvido-provisório (mantém sempre-on por Conservative Default; híbrido recomendado aguarda go do dono) |

## Critério de pronto do épico

- ADRs 01/02 registrados (decisões fechadas com rationale).
- Stories 3 e 4 em `Done`, cada uma com PR mergeado e CI verde.
- Item 5 (ADR-03) resolvido com decisão explícita do dono.
- Relatório `AF-20260704` atualizado com o desfecho de cada item.

## Fora de escopo

- Reabrir os 6 itens já fechados na fase 1.
- Publicação npm (gate explícito "publica" do dono).
