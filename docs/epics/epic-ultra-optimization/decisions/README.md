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

| DEC | Recomendação (1 frase) | O que aguarda OK do dono | Reversibilidade |
|---|---|---|---|
| **DEC-01** | Completar a ativação: installer cria `.synapse/` (constitution via gerador existente) + seção `models` no template — o hook já embarca e roda em toda instalação, hoje sempre no caminho morto. | Escolher A (ativar), B (descontinuar de vez, desregistrando o hook) ou C (opt-in); se A, autorizar story S no installer. | Total — A é 1 passo de geração fail-open; B/C revertem por config do installer. |
| **DEC-02** | Não cabear ao CLI (reabriria a aposta multi-story medida e perdida); split: wave-analyzer segue o destino do cluster DEC-03, suggestion/learning fica (tem consumidor real via `*next`/`*patterns`). | Aprovar o split + a linha nova em KNOWN-LIMITATIONS ("waves: sem caminho de produção"). | Total — decisão documental; código intocado até a execução do DEC-03. |
| **DEC-03** | 6 módulos como reserva-marcada (`@abandoned-path` aplicado) com remoção em lote condicionada ao OK; `parallel-executor` de `execution/` é o único REMOVER firme (referencia provider Gemini já removido — 45 menções; reserva ilusória). | Aprovar os 7 vereditos → 1 story de execução (remoções + manifest + registry fix + KNOWN-LIMITATIONS). | Total até a execução (marcador é comentário); após remoção, reversível por git revert. |
| **DEC-04** | Nada a decidir AGORA: medição armada com critério pré-registrado — ≥95% das sessões reais em FRESH até **2026-07-30** → aposentar DEPLETED/CRITICAL + `SYNAPSE_LEGACY_MODE` (baseline 2026-07-02: 9/9 FRESH, 100%). | Só na apuração de 2026-07-30, com `node scripts/bracket-report.js` anexado. | Total — leitor é read-only; cortes futuros virão em stories próprias. |
| **DEC-05** | Separar as 2 funções: manter o artifact/cadeia como sinal de workflow (consumo real em prosa + teste), aposentar a contabilidade de compaction 379tok/33% (0 artifacts em ~7 semanas; aritmética da era 200K). | Aprovar o diff proposto (no parecer, não aplicado) para `agent-handoff.md` + ajuste no `CLAUDE.md:89`. | Total — mudança é só de documentação/regra. |

## Decisões-irmãs já na mesa por outras vias

- **Triagem dos 500+ alertas do code scanning** (achado da Onda2-P6): segue em story
  própria com dono de segurança — fora do escopo destes pareceres.
- **Rollout da ativação enxuta pros ~170 agentes restantes** (pós-piloto Onda2-P7,
  PR #332): aguarda avaliação do piloto pelo dono — fora do escopo destes pareceres.

## Como executar depois do OK

Cada DEC aprovada vira story própria (Art. III) referenciando o parecer como
evidência — sem re-investigação. Ordem sugerida se tudo aprovado: DEC-04 (apuração)
→ DEC-03+DEC-02 (corte em lote) → DEC-05 (doc) → DEC-01 (ativação no installer,
por último: distribuir só depois de simplificar).
