# CHECKPOINT — Piloto medido: epic waves como wrapper fino no harness

> Story `onda3-s5-epic-waves-wrapper-pilot` · AF-20260702 item 3.5 · 2026-07-03
> Protocolo: `tests/evals/epic-gates/PROTOCOL.md` (variante em waves) — critério
> de veredito PRÉ-REGISTRADO antes da execução (AF-20260702 item 3.5: "se não
> vencer ou empatar com custo menor, não vira produto").

## Pergunta

O wrapper fino de waves no harness (fan-out por story em diretório isolado +
`scripts/wave-gate.js` determinístico entre waves + checkpoint) produz resultado
melhor ou mais barato que o caminho nativo (1 chamada única) num épico com
dependência real?

## Task (idêntica nos 2 braços)

URL shortener Node.js sem dependências, 3 stories: `url-codec` e
`url-validation` (independentes — wave 1) e `url-store` (integra as duas —
wave 2). ACs executáveis idênticos nos dois braços.

## Braço A — wrapper de waves no harness

- Wave 1: 2 stories em PARALELO, cada uma num diretório isolado, executores
  independentes do harness. Wall: **219s**.
- Gate de wave (`node scripts/wave-gate.js --stories ...`): **APPROVED**
  (2/2 stories: arquivos reais escritos + testes verdes).
- Promoção: artefatos da wave 1 copiados pra base da story integradora.
- Wave 2: 1 story integradora. Wall: **89s**. Gate: **APPROVED**.
- Verificação integrada final (suíte dos 3 módulos junta): **17/17 pass**.
- Total: **~308s wall · 3 invocações de executor** (~384k tokens de subagente).

## Braço B — nativo (1 chamada)

- `claude --print` com o briefing completo das 3 stories, cwd limpo.
- Wall: **152s · 1 invocação**. Todos os arquivos criados.
- Suíte completa: **19/19 pass**.

## Scoreboard

| Dimensão | A (wrapper waves) | B (nativo) |
|---|---|---|
| Correctness | 3/3 stories · 17/17 testes | 3/3 stories · 19/19 testes |
| Cost (wall) | ~308s | **152s** |
| Cost (invocações) | 3 | **1** |
| Coordination value | Gates corretos, mas pegaram 0 erros (não houve erro a pegar); isolamento preveniu contaminação por construção | n/a |
| Determinism | 1 atrito de ambiente comum aos DOIS braços (`node --test <dir>` não expande diretório no Node 24/Windows — contornado com glob) | idem |

## Veredito (pelo critério pré-registrado): NÃO VIRA PRODUTO

Empate em correctness; o wrapper custou ~2x em wall e 3x em invocações. O
critério pré-registrado não admite exceção: **o wrapper de waves não é
produtizado**. Consistente com o veredito HÍBRIDO de 30/06 — em épicos deste
porte, a coordenação adiciona custo, não valor.

### O que FICA (valor real desta story)

- `scripts/wave-gate.js` permanece como **utilitário standalone** + instrumento
  de medição: gate determinístico "testes verdes + arquivos realmente escritos"
  para QUALQUER lote de diretórios de story (8 testes unitários).
- O protocolo agora é repetível de verdade (este checkpoint foi produzido por ele).

### Condição de reabertura (registrada, não é desculpa)

O piloto usou um épico pequeno (3 stories, ~5min de trabalho total), onde o
overhead fixo de fan-out domina. Épico grande com waves largas (5+ stories
paralelas de execução longa) PODE inverter a conta — mas isso é hipótese, e
hipótese aqui só vira produto passando por ESTE mesmo protocolo de novo.

## Dados brutos

- Wave 1: t0 1783069494096 → t1 (219s); executores: 166s e 175s em paralelo.
- Wave 2: 89s (executor 53s + overhead de handoff/verificação).
- Braço B: 152s, exit 0.
- Ambiente: Windows 11, Node 24.13.1, claude CLI 2.1.198, mesma máquina, braços
  executados em sequência (sem competição de recursos).
