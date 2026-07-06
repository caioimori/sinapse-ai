# DEC-03 — Escopo por path das rules NON-NEGOTIABLE situacionais

**Status:** Aceito — **híbrido (opção C) EXECUTADO** com go explícito do dono
("Pode ir sempre na melhor decisão", 2026-07-06) · Story `mesa2-rules-hybrid`
**Data:** 2026-07-06 (provisório conservador → executado no mesmo dia após o go)
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

## Decisão

**Opção C (híbrido) — executada.** Registrada primeiro como provisória-conservadora (opção A,
Conservative Default, dono ausente); no mesmo dia o dono deu o go explícito ("Pode ir sempre na
melhor decisão visando qualidade, performance e economia de token") e o híbrido foi implementado
via story `mesa2-rules-hybrid`:

- Cada uma das 4 rules situacionais virou **core curto sempre-ativo** (a lei + gates + anti-patterns
  núcleo — enforcement 100% preservado) + **companion** `<rule>-reference.md` com o detalhe
  operacional, escopado por `paths:` (formato das 15 rules já escopadas).
- Zero conteúdo deletado — apenas movido; redação dos cores é destilação fiel (Art. IV).
- Resultado medido: always-on das 7 rules caiu de **~856 → 445 linhas/prompt (−48%)**; nos 4
  refatorados, 625 → 210 (−66%).
- Verificação adversarial por workflow: zero-perda normativa + enforcement no core + formato paths.

## Consequências

- Economia recorrente de contexto em todo prompt fora dos paths, sem nenhum MUST/gate sair do always-on.
- Companions são artefato distribuído (npm `files` inclui `.claude/rules/`) — instalam junto.
- Item 6 da Mesa sai como **FECHADO (executado)**.
