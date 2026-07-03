# DEC-02 — workflow-intelligence: cabear, aposentar ou reserva marcada

> Parecer de arquitetura · Story onda2-p8 · Item 2.7 do AF-20260702 · 2026-07-02
> Status: **AGUARDA OK DO DONO** (Art. XI Conservative Default)

## Contexto

`.sinapse-ai/workflow-intelligence/` é o subsistema de "inteligência de workflow"
(análise de waves, sugestão de próximo passo, aprendizado de padrões). O item 2.7
apontou: nenhum consumidor de produção alcançável — o único `require` em código de
produção é o do `wave-executor`, que por sua vez não tem chamador nenhum.

## Evidência de consumidores (require-graph verificado por grep em 2026-07-02)

| Fato | Evidência |
|---|---|
| Único require de produção: wave-executor | `.sinapse-ai/core/execution/wave-executor.js:18` (`require('../../workflow-intelligence/engine/wave-analyzer')`, com try/fallback) |
| O próprio WaveExecutor tem 0 chamadores fora do teste | grep `require(.*wave-executor` → apenas `tests/core/wave-executor.test.js:26` |
| Registry confirma o órfão | `entity-registry.yaml:9984-9998` — `wave-executor: usedBy: []`, `lifecycle: experimental` |
| Não existe entidade `workflow-intelligence` no registry | grep `^    workflow-intelligence:` em `entity-registry.yaml` → 0 (só aparece como `plannedDeps` da task `waves`, `:6373`) |
| É shipped em TODA instalação | `packages/installer/src/installer/sinapse-ai-installer.js:44` (`'workflow-intelligence'` em FOLDERS_TO_COPY, comentário "(*next, *patterns)") |
| Suíte de 204 testes religada | `jest.config.js:48` (nota do re-enable) + `tests/{unit,integration}/workflow-intelligence/` |

**Nuance que o item 2.7 não separa** (encontrada nesta verificação): o subsistema tem
DUAS metades com situações diferentes:

1. **Metade `engine/wave-analyzer`** — consumida SÓ pelo `wave-executor` órfão.
   Inalcançável de fato. É a metade que o item 2.7 descreve.
2. **Metade `engine/suggestion-engine` + `learning/`** — TEM caminho alcançável em
   prosa: as tasks `*next` e `*patterns` instruem o agente a executá-la
   (`.sinapse-ai/development/tasks/next.md:84` —
   `require('.sinapse-ai/workflow-intelligence/engine/suggestion-engine')`;
   `patterns.md` idem). Mesma classe dos "carregados por handler com steps em prosa"
   do item 2.17: não é engine determinístico, mas é rota real que um usuário dispara
   com um comando.

## Opções

### 1 — Cabear o wave-executor a um caminho CLI real (`sinapse orchestrate`)
- **Custo:** M-L (integração + testes + medição).
- **Risco:** ALTO — reabre a aposta multi-story que foi **medida e abandonada** em
  2026-06-30 (KNOWN-LIMITATIONS do épico de consolidação: nativo 3/3 em 64s vs motor
  1/3 em ~13,5min; "a camada de coordenação degradou o resultado"). O caminho aprovado
  pra waves é o TOP-5 da Onda 3 (item 3.5): wrapper fino NO HARNESS com worktree por
  story — que por design **não usa** o motor caseiro, e ainda assim está condicionado
  a repetir o protocolo de medição. Cabear agora = investir no braço perdedor sem o
  gate de medição que o próprio relatório exige.
- **Benefício:** daria um consumidor ao módulo. Só que consumidor ≠ valor.

### 2 — Aposentar o subsistema inteiro (com KNOWN-LIMITATIONS)
- **Custo:** S (registro formal) + M na execução futura (remoção, manifest, installer).
- **Risco:** impreciso — mataria também `*next`/`*patterns`, que têm rota alcançável e
  204 testes verdes. Cortar valor vivo junto com o morto é o erro que o Art. XI existe
  pra impedir.
- **Benefício:** menos ~1 diretório shipped.

### 3 — Split: aposentar a metade morta, manter a metade com consumidor (RECOMENDADA)
- **O quê:** (a) `engine/wave-analyzer` segue o destino do cluster DEC-03 — hoje
  reserva marcada, remoção em lote SE o dono aprovar os vereditos do DEC-03; (b)
  `suggestion-engine` + `learning/` permanecem (consumidor prose-reachable + testes);
  (c) registrar em KNOWN-LIMITATIONS que **não existe** orquestração por waves em
  caminho de produção; (d) criar a entidade `workflow-intelligence` no registry com o
  `usedBy` verdadeiro (tasks next/patterns) na hora da execução.
- **Custo:** S agora (é só decisão + registro); a execução vai junto do DEC-03.
- **Risco:** baixo — nada muda de comportamento até o OK; o corte futuro é cirúrgico.
- **Benefício:** honestidade estrutural sem sacrificar a única parte com uso real.

## Recomendação

**Opção 3 (split).** Não cabear (reabriria a aposta medida e perdida, sem o gate de
medição que o TOP-5 pré-registrou); não aposentar por atacado (a metade
suggestion/learning tem rota real via `*next`/`*patterns`). O wave-analyzer é, na
prática, o 8º membro do cluster órfão do DEC-03 e deve ser julgado junto dele.

## O que a decisão destrava

- Veredito consistente entre DEC-02 e DEC-03 (o wave-analyzer não pode "sobrar" se o
  wave-executor cair).
- KNOWN-LIMITATIONS ganha a linha "waves: sem caminho de produção" — fecha a
  sobrevivência do achado da auditoria original (violação Art. IV) apontada no 2.7.
- Registry deixa de ter o buraco (entidade inexistente) e passa a refletir os
  consumidores reais.
