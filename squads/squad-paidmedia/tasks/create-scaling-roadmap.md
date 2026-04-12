---
task: create-scaling-roadmap
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: current_performance
    tipo: data
    origem: "Meta Ads Manager"
    obrigatorio: true
  - campo: scaling_target
    tipo: number
    origem: "Apex"
    obrigatorio: true

Saida:
  - campo: scaling_roadmap
    tipo: document
    destino: "Apex + Canvas"
---

# Task: Create Scaling Roadmap (Meta Ads)

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Criar roadmap de scaling em 4 fases com triggers de progressao, creative velocity requirements e risk mitigation.

## Steps

1. **Avaliar fase atual**
   - Foundation ($0-$2K/day): CPA estavel? Tracking ok? 3+ winners?
   - Early Scale ($2K-$10K/day): Audiences diversificadas? 4+ criativos/semana?
   - Growth ($10K-$50K/day): Attribution avancada? 8+ criativos/semana?
   - Optimization ($50K+/day): Incrementality testing? 12+ criativos/semana?

2. **Definir readiness criteria para proxima fase**
   - CPA estavel por 14+ dias (variacao <15%)
   - CPA marginal <1.3x do CPA medio
   - Creative win rate >20% (1 em 5 criativos performa)
   - Tracking robusto (CAPI + Pixel, EMQ >6)

3. **Planejar budget progression**
   - Regra: max +20% de incremento por semana
   - Nunca dobrar budget de uma vez (reset de learning phase)
   - Planejar em steps semanais: W1 $X, W2 $X*1.15, W3 $X*1.30...
   - Budget buffer: 10% reserva para emergencias

4. **Planejar creative velocity**
   | Fase | Spend/day | Criativos/semana | Formatos |
   |------|-----------|-----------------|----------|
   | Foundation | <$2K | 2 | Image + Video |
   | Early | $2-10K | 4 | Image + Video + Carousel |
   | Growth | $10-50K | 8 | All formats + UGC |
   | Optimization | $50K+ | 12+ | All + Dynamic Creative |

5. **Definir risk triggers**
   - CPA >1.5x target por 3 dias → pausar scaling
   - Frequency >4 em audience principal → refresh criativos
   - CTR drop >30% WoW → investigar fatigue
   - Learning phase limitada em >50% ad sets → reestruturar

## Output
Documento usando scaling-roadmap-template.md.

## Quality Gates
- [ ] Fase atual identificada com dados
- [ ] Readiness criteria quantificados
- [ ] Budget progression em steps semanais
- [ ] Creative velocity planejada por fase
- [ ] Risk triggers com acoes claras

## Quando Usar
- Planejamento de scaling para conta Meta
- Quando cliente quer aumentar investimento Meta
- Apos periodo de Foundation estavel
