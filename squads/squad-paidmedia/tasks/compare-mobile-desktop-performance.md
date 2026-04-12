---
task: compare-mobile-desktop-performance
responsavel: "@performance-engineer"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Compare Mobile vs Desktop Performance

## Metadata
- **Agent:** performance-engineer (Lighthouse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Comparar performance mobile vs desktop e identificar gaps criticos para trafego pago.

## Steps

1. **Medir ambos ambientes** - Lighthouse mobile vs desktop scores. CWV mobile vs desktop. Page load time mobile vs desktop
2. **Calcular gap** - Delta por metrica (mobile vs desktop). Metricas onde mobile e >50% pior que desktop = critico
3. **Contextualizar com trafego** - % do trafego pago que e mobile. CVR mobile vs desktop (da conta de ads). CPA mobile vs desktop
4. **Priorizar mobile fixes** - Se 60%+ do trafego e mobile, priorizar mobile. Fixes que impactam mobile mais: image optimization, JS reduction, font loading

## Output
Mobile vs desktop comparison com gaps, impacto e prioridades.

## Quality Gates
- [ ] Ambos ambientes medidos
- [ ] Gaps quantificados
- [ ] Impacto no trafego pago contextualizado

## Quando Usar
- Auditoria de LP
- Quando CPA mobile >> CPA desktop
