# DEC-02 — Aliases datados do LiteLLM aceitos como infra legada (não renomear)

**Status:** Aceito
**Data:** 2026-07-06
**Item da Mesa:** #10 — "aliases datados no LiteLLM (`.docker`)"
**Evidência:** `audits/AF-20260704-rodada2-verificacao.md` §Highs — routing Claude 5 PARCIAL,
resíduo `.docker/llm-routing/config.yaml` com aliases `claude-3-5-*`.

## Contexto

`.docker/llm-routing/config.yaml` é um proxy LiteLLM standalone que **intercepta** nomes de modelo
Claude e os roteia para o DeepSeek (~99% de economia) num ambiente docker de otimização de custo.
Os `model_name` interceptados são datados: `claude-3-5-sonnet-20241022` e `claude-3-5-haiku-20241022`.

O `model_name` é a **chave que o consumidor chama** — é o contrato de entrada do proxy.

## Decisão

**Aceitar como infra legada.** Não renomear as chaves e não estender a interceptação aos modelos
atuais. Documentar a intenção no próprio arquivo (NOTE) e aqui.

## Rationale

- **Renomear quebra consumidores (Conservative Default, Art. XI).** Qualquer cliente que ainda chame
  `claude-3-5-sonnet-20241022` deixaria de ser interceptado — mudança que quebra contrato de entrada
  sem ganho equivalente.
- **Não estender aos modelos atuais.** Adicionar `claude-opus-4-8`/`claude-sonnet-5` como aliases
  redirecionaria silenciosamente chamadas de modelos de ponta para o DeepSeek — surpresa de comportamento
  num proxy de custo cujo público-alvo (aquele ambiente docker) ninguém reativou/mediu.
- **Sem drift de verdade.** As superfícies principais de routing (token-economy = tiers · core-config
  `models.registry` = janelas · CLAUDE.md = resumo) já estão consistentes e cruzadas; este arquivo é
  infra isolada, não a fonte de verdade do routing do framework.

## Consequências

- Comportamento inalterado; arquivo ganha um NOTE apontando para este ADR.
- Reabrir só se o ambiente docker de otimização de custo for reativado com demanda medida — aí sim
  vale modernizar os aliases (com janela de compatibilidade) em vez de aceitá-los como legado.
- O item sai da Mesa como **fechado**.
