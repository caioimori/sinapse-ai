---
task: analyze-creative-performance
responsavel: "@creative-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze Creative Performance

## Metadata
- **Agent:** creative-strategist (Canvas)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar performance de criativos e extrair aprendizados para informar proximas producoes.

## Steps

1. **Coletar metricas por criativo**
   - Impressions, reach, frequency
   - CTR, CPC, CPM
   - Conversions, CPA, ROAS
   - Video: VTR (view-through rate), avg watch time, hook rate (3s views / impressions)

2. **Segmentar analise**
   - Por formato: image vs video vs carousel
   - Por hook type: question vs statement vs demo vs UGC
   - Por messaging angle: beneficio vs feature vs social proof vs urgencia
   - Por audience tier: cold vs warm vs hot

3. **Identificar patterns de winners**
   - Que hooks tem melhor hook rate?
   - Que formatos tem melhor CTR?
   - Que messaging angles tem melhor CVR?
   - Que combinacoes (hook + format + audience) sao top performers?

4. **Identificar patterns de losers**
   - Que abordagens consistentemente falham?
   - Que formatos subperformam?
   - Red flags: o que NAO repetir

5. **Gerar learning database update**
   - Adicionar novos learnings ao historico
   - Atualizar rankings de hooks, formatos, messaging
   - Gerar brief para proxima rodada de producao com base nos learnings

## Output
Creative performance analysis com patterns, learnings e brief para proxima producao.

## Quality Gates
- [ ] Analise segmentada por formato, hook, messaging
- [ ] Patterns de winners E losers documentados
- [ ] Learnings database atualizada
- [ ] Brief para proxima producao baseado em dados

## Quando Usar
- Quinzenalmente como parte do creative testing cycle
- Apos cada rodada de testes
- Report mensal de creative
