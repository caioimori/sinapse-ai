# Decisões de arquitetura — Onda 2 (mesa do dono do produto)

> Story onda2-p8 · fonte: audits/AF-20260702-fable5-upgrade.md itens 2.6, 2.7, 2.8,
> 2.15, 2.16 (todos Conservative Default — Art. XI). Nenhuma deleção foi executada:
> cada parecer traz evidência verificada por grep em 2026-07-02, opções com
> custo/risco e recomendação fundamentada. **A execução aguarda o OK do dono.**

## Índice

| Parecer | Tema | Item |
|---|---|---|
| [DEC-01](DEC-01-synapse-pos-install.md) | Motor de contexto synapse pós-install | 2.6 |
| [DEC-02](DEC-02-workflow-intelligence.md) | workflow-intelligence / WaveExecutor | 2.7 |
| [DEC-03](DEC-03-modulos-multi-story-orfaos.md) | 7 módulos multi-story órfãos (~4,2k ln) | 2.8 |
| [DEC-04](DEC-04-brackets-medicao.md) | Escada de brackets — medição armada | 2.15 |
| [DEC-05](DEC-05-handoff.md) | Protocolo de handoff — sinal vs compaction | 2.16 |

## MESA DE DECISÕES

| DEC | Recomendação (1 frase) | O que aguarda OK do dono | Reversibilidade | Status |
|---|---|---|---|---|
| **DEC-01** | Completar a ativação: installer cria `.synapse/` (constitution via gerador existente) + seção `models` no template — o hook já embarca e roda em toda instalação, hoje sempre no caminho morto. | Escolher A (ativar), B (descontinuar de vez, desregistrando o hook) ou C (opt-in); se A, autorizar story S no installer. | Total — A é 1 passo de geração fail-open; B/C revertem por config do installer. | ✅ EXECUTADA (PR #334) |
| **DEC-02** | Não cabear ao CLI (reabriria a aposta multi-story medida e perdida); split: wave-analyzer segue o destino do cluster DEC-03, suggestion/learning fica (tem consumidor real via `*next`/`*patterns`). | Aprovar o split + a linha nova em KNOWN-LIMITATIONS ("waves: sem caminho de produção"). | Total — decisão documental; código intocado até a execução do DEC-03. | ✅ Parte documental EXECUTADA (este PR) — split de código aguarda DEC-03 |
| **DEC-03** | 6 módulos como reserva-marcada (`@abandoned-path` aplicado) com remoção em lote condicionada ao OK; `parallel-executor` de `execution/` é o único REMOVER firme (referencia provider Gemini já removido — 45 menções; reserva ilusória). | Aprovar os 7 vereditos → 1 story de execução (remoções + manifest + registry fix + KNOWN-LIMITATIONS). | Total até a execução (marcador é comentário); após remoção, reversível por git revert. | ⏳ Aguardando OK do dono |
| **DEC-04** | Nada a decidir AGORA: medição armada com critério pré-registrado — ≥95% das sessões reais em FRESH até **2026-07-30** → aposentar DEPLETED/CRITICAL + `SYNAPSE_LEGACY_MODE` (baseline 2026-07-02: 9/9 FRESH, 100%). | Só na apuração de 2026-07-30, com `node scripts/bracket-report.js` anexado. | Total — leitor é read-only; cortes futuros virão em stories próprias. | ⏳ Aguardando apuração (2026-07-30) |
| **DEC-05** | Separar as 2 funções: manter o artifact/cadeia como sinal de workflow (consumo real em prosa + teste), aposentar a contabilidade de compaction 379tok/33% (0 artifacts em ~7 semanas; aritmética da era 200K). | Aprovar o diff proposto (no parecer, não aplicado) para `agent-handoff.md` + ajuste no `CLAUDE.md:89`. | Total — mudança é só de documentação/regra. | ✅ EXECUTADA (este PR) |

## Decisões-irmãs já na mesa por outras vias

- **Triagem do code scanning** (achado da Onda2-P6, executada na story Onda2-P10):
  concluída — [AF-20260703-code-scanning-triage.md](../../../../audits/AF-20260703-code-scanning-triage.md)
  mede **429 alertas reais** (não "500+" como estimado), **zero crítico-real** no
  modelo de ameaça de CLI local single-user (o único "high" citado nominalmente —
  polynomial-redos — foi refutado por benchmark empírico), e um punhado de
  MODERADOS baratos (TOCTOU no instalador, DOM-XSS no atlas interno, log-injection,
  permissão de workflow) — plano de correção em 3 ondas dentro do relatório.
  **Onda A ✅ EXECUTADA (PR #337, 2026-07-03, OK do dono):** os 4 fixes cirúrgicos
  de segurança — CodeQL volta a analisar `actions` (alerta #1 era obsoleto, fecha
  sozinho), escape de HTML na fonte geradora do atlas (`render-html.js`, fecha
  #524-#528), âncoras agrupadas na `TEST_FILE_PATTERN` (#511, equivalência validada
  com 20.030 casos), strip de caracteres de controle no `log()` do updater (#32).
  **Ondas B e C ✅ EXECUTADAS (plano "ajuste tudo" aprovado pelo dono, 2026-07-03):**
  Onda C (PR #339) — `paths-ignore` de tests no CodeQL (~366 alertas de teste fecham
  na análise da main) + 2 falso-positivos dismissados com evidência (#515, #2) + os
  únicos 5 alertas de qualidade FORA de tests corrigidos (a "limpeza de 168" colapsou:
  163 eram de teste). Onda B em 2 PRs — B1 (#340) TOCTOU da cadeia de confiança
  (manifest-signature/file-hasher/post-install-validator em fd único) + `execFileSync`
  no gate XI; B2 (#341) escrita atômica tmp+rename em ~30 sites/21 arquivos do caminho
  de instalação (reuso do util canônico; cópia autocontida só no pacote separado).
  Pós-execução: painel deve estabilizar em ~unidades de alertas reais; sobras
  aceitas-com-justificativa (#507 fechado pela B1; #511 fechado pela A).
- **Rollout da ativação enxuta** (pós-piloto Onda2-P7, PR #332): ✅ EXECUTADO
  (PR #342, 2026-07-03) — avaliação do piloto delegada pelo dono ("avalie você e
  siga se tiver ok") e registrada na story `lean-activation-rollout`: gates verdes
  na mesclagem + re-verificados, corte só de coerção, blocos funcionais intactos.
  Medição que corrigiu o escopo: 152/160 agentes de squad já nasciam enxutos — o
  rollout real foi 22 arquivos (9 núcleo + 8 mastery + 4 locais + template), não
  "~170". −717/+374 linhas; zero coerção restante fora da doc do template.

## Como executar depois do OK

Cada DEC aprovada vira story própria (Art. III) referenciando o parecer como
evidência — sem re-investigação. Ordem sugerida se tudo aprovado: DEC-04 (apuração)
→ DEC-03+DEC-02 (corte em lote) → DEC-05 (doc) → DEC-01 (ativação no installer,
por último: distribuir só depois de simplificar).
