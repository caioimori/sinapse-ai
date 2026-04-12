---
task: conduct-frontend-code-review
responsavel: "@dx-frontend-engineer"
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

# Task: Conduct Frontend Code Review

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Conduzir code review focado em frontend — verificar qualidade, performance, acessibilidade e aderencia aos padroes do design system.

## Entrada
- Pull request / codigo para review
- Coding conventions
- Design system standards
- Performance budgets
- A11y requirements

## Passos

### 1. Architecture Check
| Item | Verificar |
|------|----------|
| Server vs Client | Components sao server by default? |
| Data fetching | Fetch no server, nao em useEffect? |
| State management | Estado colocado, nao over-lifted? |
| Error handling | Error boundaries presentes? |
| Code splitting | Heavy components lazy loaded? |

### 2. Component Quality
| Item | Verificar |
|------|----------|
| TypeScript | Strict, sem `any`, types exported |
| Props | Interface, sensible defaults |
| Composition | Composable, nao monolithic |
| Naming | Consistente com conventions |
| Size | < 200 lines per component |
| Tests | Coverage >= 80% |
| Stories | Required stories present |

### 3. Design System Compliance
| Item | Verificar |
|------|----------|
| Tokens | Usando tokens, nao valores hardcoded |
| Components | Usando DS components, nao custom |
| Spacing | Multiplos de 4/8px |
| Typography | Usando type scale |
| Colors | Usando semantic tokens |
| Icons | Usando icon system |

### 4. Performance Check
| Item | Verificar |
|------|----------|
| Bundle size | Within budget per route |
| Images | next/image com sizes |
| Fonts | next/font com display:swap |
| Third-party | Lazy loaded, facades |
| Re-renders | No unnecessary renders |
| Memoization | useMemo/useCallback where needed |

### 5. Accessibility Check
| Item | Verificar |
|------|----------|
| Semantics | HTML semantico, nao div soup |
| Labels | Todos os inputs com label |
| ARIA | Roles e attributes corretos |
| Keyboard | Tab order, focus management |
| Color | Nao depende apenas de cor |
| Motion | prefers-reduced-motion respected |

### 6. Review Output
```yaml
code_review:
  reviewer: "Scaffold"
  verdict: "[APPROVED/CHANGES_REQUESTED/NEEDS_DISCUSSION]"

  findings:
    critical: []    # Must fix before merge
    major: []       # Should fix before merge
    minor: []       # Nice to have
    nitpick: []     # Suggestions

  performance_impact: "[positive/neutral/negative]"
  a11y_impact: "[positive/neutral/negative]"
  ds_compliance: "[compliant/partially/non-compliant]"
```

## Saida
- Code review report
- Finding list with severity
- Verdict (APPROVED/CHANGES_REQUESTED)
- Performance impact assessment
- A11y compliance assessment

## Validacao
- [ ] Todos os aspectos verificados
- [ ] Findings classificados por severidade
- [ ] Verdict claro com justificativa
- [ ] Code suggestions (nao apenas problemas)
- [ ] Balanced feedback (positivo + negativo)
