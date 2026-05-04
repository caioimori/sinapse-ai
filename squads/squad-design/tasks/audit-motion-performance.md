---
task: audit-motion-performance
responsavel: "@dx-interaction-designer"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Audit Motion Performance

## Metadata
- **Squad:** squad-design
- **Agent:** Kinetic (dx-interaction-designer)
- **Complexity:** Standard

## Objetivo
Auditar performance de animacoes — verificar que todas rodam em 60fps sem causar jank, layout thrashing ou impacto negativo nos Core Web Vitals.

## Entrada
- Implemented animations
- Performance budgets
- CWV baselines
- Device test matrix

## Passos

### 1. Performance Criteria
| Metrica | Target | Ferramenta |
|---------|--------|-----------|
| Frame rate | >= 60fps (16.7ms/frame) | Chrome DevTools Performance |
| Total Blocking Time | < 200ms | Lighthouse |
| Cumulative Layout Shift | < 0.1 | Lighthouse |
| Main thread blocking | < 50ms per task | DevTools |
| GPU memory | < 100MB | DevTools Layers |

### 2. Audit Checklist
**CSS Animations:**
- [ ] Apenas `transform` e `opacity` animados
- [ ] `will-change` usado apenas quando necessario
- [ ] `will-change` removido apos animacao
- [ ] Nenhuma propriedade de layout animada (width, height, top, left, margin, padding)
- [ ] Nenhum `box-shadow` animado (use pseudo-element com opacity)

**JavaScript Animations:**
- [ ] `requestAnimationFrame` para JS animations
- [ ] Nao bloqueia main thread
- [ ] Scroll handlers throttled
- [ ] IntersectionObserver para scroll triggers
- [ ] Cleanup de listeners/observers

**Framer Motion:**
- [ ] `layout` prop usado com cuidado (causa layout calc)
- [ ] `AnimatePresence` mode="wait" vs "sync"
- [ ] Large lists nao animadas individualmente
- [ ] `useReducedMotion()` hook ativo

### 3. Device Testing
| Device | Expectativa |
|--------|------------|
| Desktop (modern) | 60fps all animations |
| Desktop (older) | 60fps, simplified if needed |
| Tablet (mid-range) | 60fps, reduce complexity |
| Mobile (flagship) | 60fps |
| Mobile (budget) | 30fps acceptable, reduce effects |

### 4. Common Performance Issues
| Issue | Diagnostico | Fix |
|-------|-----------|-----|
| Janky scroll | Layout-triggering animation | Use transform only |
| High paint time | Complex shadows/gradients animated | Use opacity on pseudo |
| Layout thrashing | Read-write-read DOM pattern | Batch reads before writes |
| Compositor layer explosion | Too many will-change | Limit to animated elements |
| High GPU memory | Large animated areas | Reduce animated surface |
| CLS from animation | Elements changing size | Use transform scale |

### 5. Profiling Workflow
```
1. Open Chrome DevTools → Performance tab
2. Record during animation
3. Look for:
   - Red frames (jank)
   - Long tasks (> 50ms)
   - Layout events during animation
   - Excessive paint events
4. Fix issues
5. Re-profile
```

### 6. CI Performance Gate
```yaml
motion_performance:
  gate:
    fps: ">= 55"  # Allow some tolerance
    cls: "< 0.1"
    tbt: "< 200ms"
  monitoring:
    - "Lighthouse CI"
    - "Web Vitals library"
  alert_threshold: "10% regression"
```

## Saida
- Motion performance audit report
- Issue list with fixes
- Device performance matrix
- CI gate configuration
- Monitoring setup

## Validacao
- [ ] Todas as animacoes testadas para frame rate
- [ ] No layout-triggering properties
- [ ] CLS < 0.1
- [ ] Mobile devices tested
- [ ] Performance regressions monitored
- [ ] CI gate configurado
