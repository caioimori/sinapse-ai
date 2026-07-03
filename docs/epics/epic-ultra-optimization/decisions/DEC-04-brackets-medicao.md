# DEC-04 — Escada de brackets (FRESH/MODERATE/DEPLETED/CRITICAL): medição armada

> Parecer de arquitetura · Story onda2-p8 · Item 2.15 do AF-20260702 · 2026-07-02
> Status: **MEDIÇÃO ARMADA** — decisão de corte só na apuração de **2026-07-30**
> (Art. XI: cada remoção com evidência e story própria; nada de sweep).

## Contexto

A escada de brackets calibra a injeção de contexto por "quanto da janela resta".
Evidência de dormência (verificada em 2026-07-02):

| Fato | Evidência |
|---|---|
| L3-L7 desligadas — a escada só filtraria camadas que já não rodam | `.sinapse-ai/core/synapse/engine.js:188-192` ("L3-L7 produced 0 rules in NOG-17 audit — disabled"; `DEFAULT_ACTIVE_LAYERS = [0, 1, 2]`) |
| O próprio código declara a substituição | `engine.js:303-305` ("Bracket management replaced by native /compact") — mas o bracket AINDA é calculado para escolher o `tokenBudget` (`:307-309`) |
| Modo legado atrás de env var | `engine.js:193` (`SYNAPSE_LEGACY_MODE === 'true'`) |
| Thresholds e budgets | `context-tracker.js:50-55` — FRESH 60-100% (budget 2000), MODERATE 40-60 (800), DEPLETED 25-40 (1000), CRITICAL 0-25 (1200) |
| Com janela 1M, sair de FRESH exige **167 prompts** | fórmula reproduzível: `0.4 × contextWindow / (avgTokensPerPrompt × 1.2)` = 0.4 × 1.000.000 / 2.400 (multiplier: `context-tracker.js:75`; registry ativo: `core-config.yaml:400-406`) — bate com o ">166" do relatório |
| Baseline HOJE: 9/9 sessões reais em FRESH (100%) | `node scripts/bracket-report.js` em 2026-07-02: max 45 prompts → 89,2% de contexto restante; `derived == observed` em todas; única não-FRESH histórica é fixture sintética (`e2e-test-session.json`, 452 prompts) |

Ou seja: 3 dos 4 brackets são maquinaria que nenhuma sessão real alcança — mas o
relatório manda MEDIR 2-4 semanas antes de cortar. Este parecer arma a medição.

## Mecanismo de coleta (o que JÁ é automático — nada novo a instalar)

1. **Sessões persistem tudo que a apuração precisa**, a cada prompt:
   - `prompt_count` — gravado pelo hook em `.synapse/sessions/<uuid>.json`;
   - `context.last_bracket` — gravado pelo QW-1 (`.claude/hooks/synapse-engine.cjs:72-84`,
     `updateSession(... { context: { last_bracket } })`).
2. **`.synapse/metrics/hook-metrics.json`** tem o `metrics.budget` da S2 (bracket,
   tokenBudget, emittedTokens, overBudget) — mas é **snapshot do último prompt**, não
   série histórica. Serve pra checar overflow pontual; a apuração usa as sessions.
3. **Leitor de apuração (criado nesta story, read-only):** `scripts/bracket-report.js`
   — reusa `calculateBracket`/`estimateContextPercent`/`getModelConfig` do código de
   produção (zero lógica duplicada), exclui fixtures, e compara o bracket DERIVADO do
   prompt_count com o OBSERVADO pelo hook (detecta divergência de implementação de
   graça). Comando de apuração:

   ```bash
   node scripts/bracket-report.js          # tabela humana
   node scripts/bracket-report.js --json   # pra anexar no parecer de decisão
   ```

## Critério de decisão PRÉ-REGISTRADO (contra HARKing)

- **Janela:** 2026-07-02 → **2026-07-30** (4 semanas; a dieta S2 + QW-1 já estavam
  ativas antes da janela, então os dados são do regime atual).
- **População:** sessões reais desta máquina (dogfooding do repo-fonte — exatamente a
  população onde o motor roda hoje; ver DEC-01. Se DEC-01=A ativar o motor em
  instalações, isso ADICIONA população futura mas não bloqueia esta decisão).
- **Critério:** se **≥95% das sessões reais** (excluídas fixtures) terminarem a janela
  em FRESH → aprovar o corte, em stories separadas:
  1. aposentar os brackets DEPLETED e CRITICAL (+ `needsMemoryHints`/
     `needsHandoffWarning` que só eles acionam);
  2. aposentar `SYNAPSE_LEGACY_MODE` (`engine.js:193` — o caminho full-8-layer que
     ele reativa depende de L3-L7 que produzem 0 regras);
  3. aposentar a persistência de `last_bracket` (QW-1) se o bracket restante for
     constante — ou simplificar a escada pra FRESH/NÃO-FRESH com o dual-trigger do
     item 2.12 (percentual + teto absoluto) assumindo o papel de aviso de compactação.
- **Se <95%:** manter a escada e abrir investigação do que tirou sessões de FRESH
  (sessões longas reais? avg subestimado?) antes de qualquer corte.
- **Snapshot pré-registrado (baseline):** 9/9 em FRESH em 2026-07-02, `derived ==
  observed` em 9/9 — qualquer divergência futura entre as duas colunas é bug de
  implementação, não sinal de uso.

## O que a decisão destrava

- Apuração ATENDIDO em 2026-07-30 → 2-3 stories S de simplificação (budget único +
  remoção de dead-branches) fecham o item 2.15 e reduzem a superfície do motor
  ANTES de qualquer expansão pra instalações (DEC-01) — ordem certa: simplificar,
  depois distribuir.
- Apuração não-atendida → a escada ganhou justificativa empírica pela primeira vez e
  sai da lista de "maquinaria dormente".
