---
task: run-ab-test
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Run A/B Test

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Configurar e executar A/B test de CRO com rigor estatistico.

## Steps

1. **Definir hipotese**
   - IF [mudamos X na pagina], THEN [metrica Y muda Z%], BECAUSE [racional baseado em dados/heuristica]

2. **Calcular sample size (use calculate-sample-size task)**
   - Baseline conversion rate
   - MDE (Minimum Detectable Effect): tipicamente 10-20%
   - Confidence level: 95% (alpha = 0.05)
   - Power: 80% (beta = 0.20)

3. **Configurar teste**
   - Tool: Google Optimize, VWO, Optimizely, ou custom
   - Traffic split: 50/50 (control vs variant)
   - Segmentation: all traffic ou segmento especifico
   - Duration: sample size / daily traffic = dias necessarios
   - Min duration: 7 dias (capturar day-of-week variation)

4. **Executar e monitorar**
   - NAO parar teste antes do sample size ou 7 dias (o que for maior)
   - NAO fazer "peeking" e declarar vencedor cedo
   - Verificar que split esta 50/50 (balanceado)
   - Monitorar guardrails (ex: bounce rate, page speed)

5. **Analisar resultados**
   - P-value < 0.05? → estatisticamente significativo
   - Confidence interval da diferenca
   - Segmentar resultado: mobile vs desktop, new vs returning
   - Practical significance: a diferenca importa para o negocio?

6. **Decidir e documentar**
   - Winner claro: implementar variante
   - Inconclusivo: teste maior ou variacao mais dramatica
   - Loser: documentar aprendizado, pivotar hipotese

## Output
A/B test report com hipotese, dados, analise estatistica, decisao e learnings.

## Quality Gates
- [ ] Hipotese documentada antes do teste
- [ ] Sample size calculado e atingido
- [ ] Min 7 dias de teste
- [ ] P-value calculado
- [ ] Learning documentado

## Quando Usar
- Otimizacao de landing page
- Otimizacao de form
- Otimizacao de signup flow
- Qualquer mudanca que pode ser testada
