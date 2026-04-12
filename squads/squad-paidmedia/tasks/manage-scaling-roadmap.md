---
task: manage-scaling-roadmap
responsavel: "@paidmedia-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: current_performance
    tipo: data
    origem: "Pulse"
    obrigatorio: true
  - campo: scaling_target
    tipo: number
    origem: "cliente"
    obrigatorio: true

Saida:
  - campo: scaling_roadmap
    tipo: document
    destino: "todos os agentes"

Checklist:
  - "[ ] Fase atual identificada"
  - "[ ] Readiness criteria validados"
  - "[ ] Creative velocity planejada"
  - "[ ] Risk triggers definidos"
---

# Task: Manage Scaling Roadmap

## Metadata
- **Agent:** paidmedia-orqx (Apex)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Gerenciar roadmap de scaling progressivo cross-channel, garantindo que cada fase tem readiness criteria atendidos antes de progredir.

## Inputs
- Performance data atual (CPA, ROAS, volume, trends)
- Scaling target (budget target ou volume target)
- Creative pipeline status
- Tracking health status

## Steps

1. **Identificar fase atual do scaling**
   - **Foundation ($0-$2K/day):** Validar product-market fit, tracking, baseline CPA
   - **Early Scale ($2K-$10K/day):** Expandir audiences, aumentar creative velocity
   - **Growth ($10K-$50K/day):** Diversificar canais, automacao, attribution avancada
   - **Optimization ($50K+/day):** Marginal gains, incrementality testing, advanced bidding

2. **Validar readiness criteria para proxima fase**
   - Foundation → Early: CPA estavel <target por 14d, tracking 100%, 3+ criativos vencedores
   - Early → Growth: CPA marginal <1.3x avg, 4+ criativos/semana, 2+ canais ativos
   - Growth → Optimization: Attribution model validado, creative velocity 8+/semana, ROAS estavel

3. **Planejar creative velocity**
   - Foundation: 2 criativos/semana
   - Early Scale: 4 criativos/semana
   - Growth: 8 criativos/semana
   - Optimization: 12+ criativos/semana
   - Delegar para Canvas com volume e cadencia

4. **Definir risk triggers (rollback)**
   - CPA marginal >1.5x average → pausar scaling, investigar
   - ROAS drop >30% week-over-week → reduzir budget 20%
   - Creative fatigue em >50% dos ads → pausar scaling, refresh criativos
   - Tracking issues → STOP imediato ate resolver

5. **Gerar roadmap document**
   - Fase atual e proxima
   - Budget progression timeline (semana a semana)
   - Creative velocity requirements
   - Risk triggers e rollback procedures
   - Review cadence (weekly for scaling accounts)

## Output
Documento usando scaling-roadmap-template.md com fases, criteria, timeline, creative velocity e risk triggers.

## Quality Gates
- [ ] Fase atual corretamente identificada com dados
- [ ] Readiness criteria para proxima fase documentados
- [ ] Creative velocity requirements planejados
- [ ] Risk triggers com acoes de rollback claras
- [ ] Budget progression e gradual (max +20%/semana)

## Quando Usar
- Planejamento de scaling para conta nova
- Revisao mensal de scaling roadmap
- Quando cliente quer aumentar budget significativamente
- Apos periodo de estabilizacao de CPA
