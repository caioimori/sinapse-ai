# Epic: fable5-potencializacao — capturar as capacidades da geração Fable 5 no framework

> **Data:** 2026-07-11 · **Origem:** briefing do dono ("usar todo o poder do Fable 5 pra potencializar o framework e destilar os princípios pra qualquer LLM") · **Método:** investigação prévia por 6 frentes paralelas read-only sobre a main (auditoria de julho como baseline — nada aqui refaz o que AF-20260702/AF-20260704 já entregaram).

## Contexto

O ciclo de compatibilidade Fable 5 (PRs #321-#355, releases 1.20.0→1.21.0) já des-pinou o routing de "Opus 4.7" para a família atual, registrou `claude-fable-5` como modelo ativo (janela 1M) e entregou o dual-trigger de compactação. Este épico NÃO é compatibilidade — é captura de capacidade: transformar em ativos permanentes (a) os padrões de orquestração multi-agente que as auditorias reais já provaram, (b) a fonte única executável de roteamento modelo+esforço que o próprio audit deixou recomendada e deferida, (c) o conhecimento de COMO um modelo frontier agêntico trabalha, destilado de forma portável, e (d) o fechamento empírico dos dois itens de backlog que a rodada 2 deixou abertos.

## Ondas

| Onda | Entrega | Rastreabilidade | Story |
|---|---|---|---|
| A | 3 workflows de auditoria salvos e parametrizáveis em `.claude/workflows/` (audit-clinical, re-baseline, verify-round) + este épico | Padrões de AF-20260629, AF-20260702 §2, AF-20260704; precedente deep-dive-rationalization.js | story-fable5-wave-a-workflows |
| B | Fonte única `.sinapse-ai/data/model-routing.yaml` consumida pelos 3 renderers do atlas + guia alinhado + template corrigido + teste anti-drift | AF-20260702 item 2.10 (recomendação deferida em render-markdown.js:76-83) | story-fable5-wave-b-effort-routing |
| C | `portable-agentic-principles.md` na knowledge-base — os 10 princípios agênticos portáveis (LLM-agnostic) | Briefing do dono 2026-07-11 | story-fable5-wave-c-portable-principles |
| D | Fechamento empírico de G5 (LOOPS W19-W27 × evals do produto) e G6 (instalação real + paridade multi-IDE medida) com registro em audits/ | AF-20260702 §6 lacunas 5-6; AF-20260704:78-79 | story-fable5-wave-d-g5-g6 |

## Fora de escopo (deliberado)

- Orquestração autônoma de implementação multi-story (decisão medida do épico orchestration-consolidation: fan-out é de análise; implementação é assistida).
- Enforcement de effort em runtime e frontmatter `effort:` nos agentes (mecanismo novo — onda futura; o suporte nativo está documentado na KB da squad claude-code-mastery).
- Publicação npm (decisão do dono, fora deste épico).

## Critério de pronto do épico

As 4 stories com AC verdes, PRs mergeados com CI verde e CodeRabbit sem CRITICAL, e os itens G5/G6 marcados fechados com evidência em audits/.
