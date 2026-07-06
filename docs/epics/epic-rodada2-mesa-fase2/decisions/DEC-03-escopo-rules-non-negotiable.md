# DEC-03 — Escopo por path das rules NON-NEGOTIABLE situacionais

**Status:** Aceito (provisório — Conservative Default; híbrido recomendado aguarda go explícito do dono)
**Data:** 2026-07-06
**Item da Mesa:** #6 — "escopar por path as 4 rules situacionais (~625 linhas/prompt)"
**Evidência:** `audits/AF-20260704-rodada2-verificacao.md` §Mediums — "7 rules sempre-ativas com
conteúdo situacional; 4 escopáveis ~625 linhas, 3 genuinamente globais; tensão com NON-NEGOTIABLE".

## Contexto

Das 22 rules do framework em `.claude/rules/`, 15 já carregam só quando o trabalho casa (têm
`paths:` no frontmatter). **7 são sempre-ativas** (carregam em todo prompt):

| Rule | Linhas | Natureza |
|------|-------:|----------|
| safe-collaboration | 185 | git safety — situacional (só quando há commit/git) |
| project-intelligence | 168 | detecção de estado — situacional (início/greenfield) |
| token-economy | 155 | disciplina de contexto — **global** (todo prompt) |
| documentation-first | 152 | story-antes-de-código — situacional (só implementação) |
| mandatory-delegation | 120 | orquestrador delega — **global** (comportamental) |
| nsn-mode | 76 | resolver sem desistir — **global** (comportamental) |
| response-format | 4 | stub (aponta pra token-economy) |

Confirma o achado: **3 genuinamente globais** (token-economy + mandatory-delegation + nsn-mode =
351 linhas, comportamentais, valem em todo prompt) e **~4 situacionais** (~625 linhas com o detalhe).

## A tensão (por que é decisão do dono)

Colidem **dois princípios NON-NEGOTIABLE** do próprio dono:
- **Token Economy** — desperdício de contexto degrada qualidade E custa caro; cortar ~625 linhas/prompt
  é economia real, recorrente, em todo prompt.
- **Enforcement sempre-on** — o valor de uma regra NON-NEGOTIABLE é justamente aplicar-se SEMPRE;
  escopar por path significa que num prompt fora do path ela não carrega — e pode não ser enforçada
  onde deveria (ex.: doc-first pode não disparar quando o usuário só DIZ "implementa X" sem tocar arquivo).

Não é defeito de código — é um trade-off de política. Por isso não é executado autonomamente.

## Opções na mesa

- **A — Manter tudo sempre-ativo** (Conservative Default): enforcement máximo, ~856 linhas/prompt aceitas.
- **B — Escopar as 4 por path**: economia máxima (~625 linhas), maior risco de enforcement (regra
  NON-NEGOTIABLE não carrega fora do path). **Não recomendado.**
- **C — Híbrido (recomendado)**: cada rule situacional vira um **core curto sempre-ativo** (a lei + o
  gate, ~15-25 linhas) + um **companion** com o detalhe (exemplos, matrizes, how-to) escopado por
  `paths:`. Corta a maior parte das ~625 linhas SEM perder enforcement — o gate segue sempre carregado,
  só o detalhe carrega no trabalho correspondente. Honra os dois NON-NEGOTIABLE.

## Decisão (provisória)

**Manter as 7 sempre-ativas (opção A) por ora** — Conservative Default (Art. XI): com o dono ausente
e tratando-se de mudança em enforcement de regra NON-NEGOTIABLE, em dúvida se **mantém**. Nenhuma
mudança de comportamento neste PR.

**Recomendação registrada:** a opção **C (híbrido)** é o caminho preferido de resolução — é a única
que honra token-economy e enforcement ao mesmo tempo. Como refatora regras NON-NEGOTIABLE, exige
**go explícito do dono** (não é ação autônoma). Quando o Caio aprovar, o híbrido vira story própria
(doc-first, cada rule verificada), separando core (always-on) de detalhe (path-scoped).

## Consequências

- Zero regressão agora; a análise fica documentada para a decisão informada do dono.
- Item 6 da Mesa sai como **resolvido-provisório** (decisão conservadora + recomendação pendente de go),
  não como mudança executada.
