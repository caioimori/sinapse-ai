# DEC-01 — A frota de auditoria permanece ferramenta interna (não produtizar)

**Status:** Aceito
**Data:** 2026-07-06
**Item da Mesa:** #1 (TOP 1) — "frota de auditoria como produto"
**Evidência:** `audits/AF-20260704-rodada2-verificacao.md` §Vereditos/Highs — PARECER: NÃO PRODUTIZAR.

## Contexto

A auditoria Fable 5 levantou, como TOP 1, a hipótese de transformar a **frota de auditoria**
(o enxame multi-agente de verificação adversarial usado internamente para auditar o próprio
framework) em um **produto** exposto ao usuário final.

## Decisão

**Não produtizar.** A frota permanece ferramenta interna de governança do framework.

## Rationale

- **Mesma classe dos 2 achados refutados** na frente: confunde ferramenta interna com lacuna de
  produto. A ferramenta interna já cumpre o papel para o qual existe (auditar o framework).
- **Sem demanda medida.** Produtizar cria uma promessa de manutenção (SLA, docs, suporte, versionamento
  de interface) sobre um público que ninguém mediu querer.
- **Conservative Default (Art. XI).** Adicionar superfície de produto sem demanda validada é o oposto
  de "em dúvida, manter o escopo". A frota já entrega valor onde está.
- **Foco.** O produto SINAPSE é o framework de desenvolvimento assistido; a frota é o mecanismo de
  qualidade DELE, não um SKU separado.

## Consequências

- A frota continua evoluindo como capacidade interna (workflows de verificação adversarial).
- Se surgir demanda **medida** por auditoria-como-serviço, esta decisão é reaberta com dados.
- O item sai da Mesa como **fechado**.
