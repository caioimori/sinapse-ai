---
task: audit-design-system-health
responsavel: "@dx-design-system-architect"
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

# Task: Audit Design System Health

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Auditar a saude do design system — medir cobertura, consistencia, adocao e identificar areas de melhoria.

## Entrada
- Design system current state
- Component library
- Token files
- Codebase (para medir adocao)
- Consumer feedback

## Passos

### 1. Medir Component Coverage
| Metrica | Target | Atual |
|---------|--------|-------|
| Components documented | 100% | |
| Components with Storybook | 100% | |
| Components with tests | >= 80% | |
| Components with a11y audit | 100% | |
| Components stable (vs alpha/beta) | >= 80% | |

### 2. Medir Token Health
| Metrica | Target | Atual |
|---------|--------|-------|
| Token coverage (design decisions) | >= 95% | |
| Hardcoded values in components | 0 | |
| Token naming consistency | 100% | |
| Dark mode coverage | 100% | |
| W3C DTCG compliance | 100% | |

### 3. Medir Adoption
| Metrica | Como medir | Target |
|---------|-----------|--------|
| DS component usage vs custom | Grep/AST analysis | >= 90% DS |
| Token usage vs hardcoded values | CSS audit | >= 95% tokens |
| Storybook visits/week | Analytics | Growing |
| Issues/PRs on DS repo | GitHub metrics | Active |

### 4. Avaliar API Consistency
| Pattern | Consistent? | Issues |
|---------|------------|--------|
| Prop naming | [yes/no] | |
| Variant naming | [yes/no] | |
| Size scale | [yes/no] | |
| Event handling | [yes/no] | |
| Composition patterns | [yes/no] | |

### 5. Gerar Health Score
```yaml
health_score:
  date: ""
  overall: "/100"

  dimensions:
    coverage:
      score: "/100"
      weight: 0.25
    quality:
      score: "/100"
      weight: 0.25
    adoption:
      score: "/100"
      weight: 0.25
    consistency:
      score: "/100"
      weight: 0.25

  critical_issues: []
  improvement_areas: []
  strengths: []
```

### 6. Gerar Action Plan
| Area | Issue | Priority | Effort | Impact |
|------|-------|----------|--------|--------|
| | | [P0-P3] | [low/mid/high] | [low/mid/high] |

## Saida
- Design system health report
- Health score breakdown
- Coverage metrics
- Adoption metrics
- Action plan priorizado
- Trend comparison (if previous audit exists)

## Validacao
- [ ] Todas as dimensoes medidas
- [ ] Score calculado corretamente
- [ ] Issues criticos identificados
- [ ] Action plan com prioridades
- [ ] Metricas quantitativas (nao apenas qualitativas)
- [ ] Trend analysis (se dados historicos disponiveis)
