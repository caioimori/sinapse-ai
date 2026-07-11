---
id: AF-20260711-g5-g6-fechamento
type: backlog-closure
date: 2026-07-11
framework_version: 1.24.0
source_backlog:
  - "AF-20260702-fable5-upgrade.md §6 (lacunas 5 e 6 do critic)"
  - "AF-20260704-rodada2-verificacao.md:78-79 (G5 e G6 ABERTOS)"
method: "G5: leitura integral dos LOOPS da onda 8 da base de pesquisa + cruzamento com a malha de evals do produto (agente leitor dedicado). G6: instalação real de teste (npm pack 1.24.0 → pasta isolada → wizard quiet selectedLLM=both) + 8 asserts de paridade + validate-parity oficial DENTRO da instalação."
verdict:
  g5: FECHADO (com correção de premissa)
  g6: FECHADO (medição feita; 1 achado real registrado)
counts:
  g6_asserts_pass: 7
  g6_asserts_fail: 1
  new_findings: 3
---

# AF-20260711 — Fechamento empírico de G5 e G6 (backlog da auditoria Fable 5)

## Placar

| Item | Pergunta do critic | Resultado |
|---|---|---|
| G5 | A pesquisa prescreve o eval de regressão comportamental que falta no produto (item 3.1)? | **FECHADO** — prescreve (W13, literal), e o produto JÁ institucionalizou o núcleo; premissa do intervalo estava errada |
| G6 | A paridade multi-IDE se sustenta numa instalação real? | **FECHADO** — 7/8 asserts PASS (pointers 172/172, colisão Nexus resolvida); 1 achado real: payload Codex referencia recursos não instalados |

---

## G5 — LOOPS × evals do produto

### Correção de premissa (achado central)

O backlog dizia "LOOPS W19-W27 (cauda do domínio 27, Evals/Guardrails) não lidos". A leitura integral do arquivo único da onda 8 (`fase-2-extracao/onda-8-engenharia-aumentada-ia/LOOPS-onda-8-engenharia-aumentada-ia-diagramas.md`) mostra que o índice (linha 19) ancora **Evals & Guardrails em W13-W15**, não em W19-W27. Os W19-W27 cobrem: Plan-and-Solve (W19), Tree of Thoughts (W20), self-healing 3 níveis (W21), tool search/progressive disclosure (W22), programmatic tool calling (W23), threat model de tool use (W24), anatomia do harness (W25), prompt chaining com gates (W26) e routing/parallelization (W27). Nenhum deles é eval de regressão.

### O que a pesquisa prescreve (W13, citação literal)

> "Cada falha de produção vira caso permanente no golden set; os evals rodam em CI e bloqueiam regressão futura. É o mutation score dos sistemas de IA."
> — W13 "Ciclo eval-driven (falha → eval → corrige → regressão)", LOOPS onda 8, ~linhas 277-290.

Fluxo prescrito: falha detectada → adiciona ao golden set → escreve eval → reproduz (vermelho) → corrige → passa (verde) → CI bloqueia regressão. Complementos: W14 (LLM-as-judge calibrado ≥85% + amostragem periódica) e W15 (guardrail de saída: schema/grounding/PII + auto-repair).

### O que o produto já pratica (evidência)

O núcleo do item 3.1 está **implementado** (story onda3-s4-behavioral-eval-regression):

- `tests/evals/README.md:8-19` — golden set comportamental (`epic-gates/cases.json`) + política NON-NEGOTIABLE citando o item 3.1: todo bug comportamental vira caso permanente.
- `tests/evals/epic-gates/cases.json` — 6 casos versionados (5 bugs reais do checkpoint 2026-06-30 + 1 controle).
- `scripts/eval-e2e.js:80-113` + `package.json:89` — replay determinístico via `npm run eval:e2e` contra o GateEvaluator real; mismatch = exit 1.
- `tests/evals/eval-harness.test.js:61-65` — plugado no `npm test` → regressão comportamental bloqueia merge.
- `tests/evals/epic-gates/PROTOCOL.md` — o protocolo do checkpoint promovido a documento executável.

### Veredito G5

A lacuna **não é da pesquisa** (W13-W15 cobrem o tema) e **não está mais aberta no produto** (núcleo do 3.1 entregue). O item de backlog fecha com a premissa corrigida. **Deltas residuais conscientes** (ampliação, não lacuna do 3.1 — decisão do dono se viram stories):

1. Braço LLM-as-judge (W13 "ou judge" + W14): hoje é preflight opt-in (`scripts/eval-e2e.js:115-135`, se auto-pula no Windows); sem juiz calibrado no CI.
2. Guardrail de saída (W15): schema/grounding/PII com auto-repair não existe como camada do harness.
3. Escopo do golden set: trava o GateEvaluator de épicos; a mesma política pode se estender a outros componentes comportamentais.

---

## G6 — Paridade multi-IDE numa instalação real

### Protocolo executado (reproduzível)

1. `npm pack` na main (1.24.0) → tgz — cobre exatamente o whitelist `files` do package.json (o que o usuário recebe).
2. Pasta isolada: `npm init -y && SINAPSE_SKIP_POSTINSTALL=1 npm i ./sinapse-ai-1.24.0.tgz`.
3. Instalação real non-interativa com os dois IDEs: `node -e "require('sinapse-ai/packages/installer/src/wizard/index.js').runWizard({quiet:true, selectedLLM:'both'})"` — wizard completou todas as fases.
4. Asserts de paridade (abaixo). 5. Teardown da pasta.

### Resultados

| # | Assert | Resultado | Evidência |
|---|---|---|---|
| a1 | `.claude/CLAUDE.md` existe | **PASS** | — |
| a2 | Espelho Claude populado | **PASS** | 30 arquivos em `.claude/commands/SINAPSE/agents` (12 core + 17 squad-orqx + 1 redirect — commandSync completo, acima do mínimo 12) |
| b1 | Pointers Codex | **PASS** | exatamente 172 em `.codex/agents` |
| b2-b4 | `instructions.md`, `delegation-matrix.json`, `AGENTS.md` raiz | **PASS** | — |
| c | **Todo pointer resolve** (modo de falha que o dogfood do repo não detecta) | **PASS** | 172/172 apontam pra arquivos existentes na instalação; 0 quebrados; 0 corpos sobrescritos (design pós-E8 íntegro) |
| e | Colisão de codinome "Nexus" | **PASS (resolvida)** | Só 2 arquivos citam Nexus no espelho: design-orqx (codinome próprio legítimo) e snps-orqx (citação na matriz). swarm-orqx e content-orqx chegam renomeados (Relay/Bulletin) — a colisão tripla do item 1.10 não existe mais nos mirrors reais |
| d | `validate-parity --fast` DENTRO da instalação | **FAIL (achado real)** | ver abaixo |

### Achado real (novo — só visível em instalação real)

`validate-parity --fast` dentro da instalação: `claude-sync ✅ · paths ✅ · codex-sync ❌` com 7 issues:

1. **5 recursos referenciados e não instalados**: os comandos `sinapse-orqx.onboard/.plan/.status/.resolve` e a delegação `multi-domain-launch` do payload Codex apontam pra `docs/framework/codex-parity/*.md` — pasta que NÃO é copiada pra instalação do usuário (docs/ fica no repo). No repo-dogfood o check passa porque os docs existem lá.
2. **Catálogo de skills defasado**: 31 skills instaladas vs 30 no catálogo configurado.
3. **Skill órfã**: `.codex/skills/sinapse-snps-orqx` sem entrada correspondente.

Severidade sugerida: **medium** (agentes e delegação principal funcionam — 172/172; degrada 4 comandos do master orqx e a integridade declarada do catálogo no lado Codex, cujo status de contrato já é "Limited"). **Recomendação**: story própria de fix — ou copiar os docs de codex-parity pro payload instalável, ou reapontar os comandos pra recursos que shipam; reconciliar catálogo (31/30) e remover/registrar a skill órfã. Bônus barato: promover este protocolo de instalação real a script versionado pra rodar antes de release.

## Limitações

- Caminho global (`npx sinapse-ai install` na HOME) não coberto nesta rodada — o per-project era o núcleo do G6; a extensão fakehome fica como passo opcional documentado.
- A instalação usou a main local (pós-1.24.0), não o tarball do npm publicado — equivalente por construção (`npm pack` usa o mesmo whitelist), mas não idêntico byte a byte ao publicado.

## Próximo passo

Decisão do dono sobre os 3 achados novos (fix codex-parity da instalação; extensões W14/W15; ampliação do golden set) — nenhum executado sem ok.
