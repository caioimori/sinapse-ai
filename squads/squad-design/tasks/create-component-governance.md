---
task: create-component-governance
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

# Task: Create Component Governance

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Estabelecer governanca do design system — definir processos para propor, criar, modificar, deprecar e remover componentes.

## Entrada
- Component inventory
- Team structure
- Release process
- Consumer feedback

## Passos

### 1. Component Lifecycle
```
Proposal → Review → Alpha → Beta → Stable → Deprecated → Removed
```

| Status | Descricao | SLA |
|--------|-----------|-----|
| Proposal | RFC aberto | — |
| Review | Em avaliacao pelo DS team | 1 semana |
| Alpha | Em desenvolvimento, API instavel | — |
| Beta | Funcional, API pode mudar | — |
| Stable | Production-ready, API estavel | — |
| Deprecated | Migrar para alternativa | 3 meses min |
| Removed | Removido do sistema | — |

### 2. Proposal Process (RFC)
Para propor novo componente ou mudanca:

```yaml
component_rfc:
  title: ""
  proposer: ""
  date: ""
  status: "[draft/review/approved/rejected]"

  motivation: ""  # Por que precisamos disso?
  usage_evidence:
    - "[3+ instances of pattern in codebase]"
  api_proposal: ""
  alternatives_considered: []
  a11y_considerations: ""
  breaking_changes: ""
  migration_plan: ""
```

### 3. Review Criteria
| Criterio | Peso | Threshold |
|----------|------|-----------|
| Usage evidence (3+ instances) | Alto | Required |
| Accessibility compliance | Alto | Required |
| API consistency with existing | Medio | Reviewed |
| Performance impact | Medio | < 1KB gzipped |
| Token compliance | Alto | Required |
| Documentation completeness | Medio | Required |

### 4. Versioning Policy
| Mudanca | Version Bump | Exemplo |
|---------|-------------|---------|
| Bug fix (visual) | Patch | Fix border rendering |
| New optional prop | Patch | Add icon prop |
| New variant | Minor | Add ghost variant |
| Rename/remove prop | Major | color → variant |
| Remove component | Major | Remove LegacyButton |

### 5. Deprecation Process
1. Marcar como deprecated com `@deprecated` + motivo
2. Adicionar console.warn em dev mode
3. Documentar migration path
4. Manter por minimo 1 major version
5. Remover na proxima major release

### 6. Quality Gates per Component
| Gate | Criterio | Bloqueante? |
|------|----------|-------------|
| TypeScript | Strict mode, 0 errors | SIM |
| Tests | Coverage >= 80% | SIM |
| Storybook | All required stories | SIM |
| A11y | axe-core 0 violations | SIM |
| Visual Regression | No unintended changes | SIM |
| Performance | Bundle < 1KB gzipped | NAO |
| Docs | Props table + usage | SIM |

## Saida
- Component governance document
- RFC template
- Lifecycle definition
- Versioning policy
- Deprecation process
- Quality gate checklist

## Validacao
- [ ] Lifecycle stages definidos
- [ ] RFC template criado
- [ ] Review criteria claros
- [ ] Versioning policy documentada
- [ ] Deprecation process com SLA
- [ ] Quality gates definidos
