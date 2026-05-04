---
checklist: animation-quality-checklist
squad: squad-animations
description: "Checklist de qualidade para validar animacoes antes da entrega"
used_by:
  - review-animation-quality
  - animation-quality-review-cycle
---

# Animation Quality Checklist

## 1. Fidelidade ao Brief
- [ ] Animacao entrega o feeling solicitado no brief
- [ ] Tipo de animacao corresponde ao especificado
- [ ] Elemento alvo correto
- [ ] Tecnologia utilizada e a recomendada
- [ ] Complexidade dentro do estimado

## 2. Qualidade Visual
- [ ] Motion e fluido e natural (sem jank)
- [ ] Easing curves sao apropriadas para o feeling
- [ ] Duration esta no range correto
- [ ] Stagger timing cria ritmo agradavel
- [ ] Cores e opacidades consistentes com brand

## 3. Principios de Motion
- [ ] Ease in/ease out aplicado corretamente
- [ ] Anticipation presente onde necessario
- [ ] Follow-through em listas e sequencias
- [ ] Secondary action enriquece sem distrair
- [ ] Staging direciona atencao corretamente

## 4. Performance
- [ ] 60fps constante em desktop
- [ ] 30fps minimo em mobile
- [ ] Sem layout thrashing (transform/opacity only)
- [ ] Memory estavel (sem leaks)
- [ ] GPU usage aceitavel

## 5. Responsividade
- [ ] Funciona em desktop (1920+)
- [ ] Funciona em tablet (768-1024)
- [ ] Funciona em mobile (320-767)
- [ ] Touch interactions funcionam
- [ ] Orientacao landscape/portrait

## 6. Acessibilidade
- [ ] prefers-reduced-motion implementado
- [ ] Fallback graceful (opacity ou static)
- [ ] Sem flash rate > 3/segundo
- [ ] Pause/play disponivel para loops > 5s
- [ ] Screen reader nao e afetado

## 7. Codigo
- [ ] Codigo limpo e bem estruturado
- [ ] Cleanup de listeners e timelines no unmount
- [ ] Nenhum console.log residual
- [ ] Imports otimizados (tree-shaking friendly)
- [ ] Comentarios em trechos complexos

## Scoring
| Score | Verdict |
|-------|---------|
| 28-30 checks | APPROVED |
| 22-27 checks | APPROVED com notas |
| 15-21 checks | NEEDS_REVISION |
| < 15 checks | REJECTED |
