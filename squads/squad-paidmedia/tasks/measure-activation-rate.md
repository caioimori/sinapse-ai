---
task: measure-activation-rate
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Measure Activation Rate

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Medir e otimizar taxa de ativacao pos-signup.

## Steps

1. **Definir activation event** - Qual acao = "usuario ativou"? SaaS: completou primeiro workflow. Marketplace: publicou listing ou fez contato
2. **Calcular activation rate** - Formula: (Users que ativaram / Users que fizeram signup) * 100. Segmentar por: cohort (semana), source (paid vs organic), device
3. **Calcular time-to-activation** - Tempo medio entre signup e activation. Mediana (mais robusto que media). Distribuicao: quantos ativam em D0, D1, D3, D7, D14, D30
4. **Benchmarking** - SaaS average: 20-40% activation rate. Target: top quartile do vertical
5. **Identificar drop-offs** - Onde usuarios desistem entre signup e activation? Qual step do onboarding tem maior abandono?

## Output
Activation metrics report com rate, time-to-activation, segmentacao e oportunidades.

## Quality Gates
- [ ] Activation event definido
- [ ] Rate calculado por cohort e source
- [ ] Time-to-activation medido
- [ ] Drop-offs identificados

## Quando Usar
- Report mensal de product metrics
- Apos mudancas no onboarding
- Para justificar investimento em paid (qual a qualidade dos leads pagos?)
