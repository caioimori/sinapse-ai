---
task: calculate-sample-size
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Calculate Sample Size

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Calcular sample size necessario para A/B test com parametros definidos.

## Steps

1. **Coletar parametros**
   - Baseline conversion rate (p1): taxa atual de conversao
   - MDE (Minimum Detectable Effect): menor diferenca que importa (ex: 15%)
   - Expected conversion rate (p2): p1 * (1 + MDE)
   - Alpha (α): 0.05 (95% confidence)
   - Beta (β): 0.20 (80% power)

2. **Calcular sample size por variacao**
   - Formula: n = ((Z_α/2 + Z_β)² × (p1(1-p1) + p2(1-p2))) / (p2-p1)²
   - Z_α/2 = 1.96 (para α = 0.05)
   - Z_β = 0.84 (para β = 0.20)
   - Sample total = n × 2 (control + variante)

3. **Estimar duracao do teste**
   - Duracao = sample total / daily traffic
   - Se duracao >30 dias: considerar aumentar MDE ou traffic
   - Min 7 dias (independente do sample size)
   - Max recomendado: 30 dias

4. **Exemplo pratico**
   - Baseline CVR: 3% (p1 = 0.03)
   - MDE: 20% (p2 = 0.036)
   - n per variation ≈ 21,000
   - Total sample ≈ 42,000
   - Se 1,000 visitors/dia → 42 dias → considerar MDE maior

## Output
Sample size calculation com parametros, formula, resultado e duracao estimada.

## Quality Gates
- [ ] Parametros documentados
- [ ] Calculo correto
- [ ] Duracao viavel (<30 dias idealmente)

## Quando Usar
- Antes de qualquer A/B test
- Para determinar se ha trafego suficiente para testar
