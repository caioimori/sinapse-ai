---
task: migrate-legacy-design-system
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

# Task: Migrate Legacy Design System

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Complex

## Objetivo
Migrar design system legado para a arquitetura moderna — planejar e executar migração incremental de tokens, componentes e documentação.

## Entrada
- Design system legado (current state)
- Target architecture (new system)
- Codebase dependente
- Timeline constraints

## Passos

### 1. Auditar Sistema Legado
| Aspecto | Legado | Target | Gap |
|---------|--------|--------|-----|
| Token format | [CSS vars/SCSS/JS] | W3C DTCG | |
| Token tiers | [1/2/3] | 3 | |
| Naming convention | | kebab-case | |
| Component count | | | |
| Test coverage | | >= 80% | |
| Storybook | [yes/no] | yes | |
| TypeScript | [yes/no] | strict | |
| a11y compliance | | WCAG 2.2 AA | |

### 2. Planejar Migração
```yaml
migration_plan:
  approach: "incremental"  # big-bang (risky) vs incremental (safe)

  phases:
    - name: "Foundation"
      items: ["Token migration", "New build pipeline"]
      duration: ""
      risk: "low"

    - name: "Core Components"
      items: ["Button", "Input", "Card", "Modal"]
      duration: ""
      risk: "medium"

    - name: "Complex Components"
      items: ["Table", "Form", "Navigation"]
      duration: ""
      risk: "medium"

    - name: "Page Templates"
      items: ["Layout migration"]
      duration: ""
      risk: "high"

    - name: "Cleanup"
      items: ["Remove legacy", "Final QA"]
      duration: ""
      risk: "low"
```

### 3. Token Migration Strategy
| Passo | Acao | Risco |
|-------|------|-------|
| 1 | Criar novo token file (W3C DTCG) paralelo | Nenhum |
| 2 | Gerar CSS vars de ambos (legacy + new) | Nenhum |
| 3 | Atualizar componentes um por um para novos tokens | Baixo |
| 4 | Verificar visual regression | Medio |
| 5 | Remover tokens legados | Medio |

### 4. Component Migration Pattern
Para cada componente:
1. Criar versao nova (`ButtonV2`) lado a lado
2. Implementar API nova com backward-compat props
3. Migrar consumers incrementalmente
4. Deprecar versao antiga
5. Remover apos adoption completa

### 5. Codemods
Automatizar migracao com codemods:
```javascript
// Exemplo: renomear props
// Old: <Button color="primary" />
// New: <Button variant="primary" />
```

### 6. Rollback Plan
- Manter versao legada acessivel durante migracao
- Feature flags para toggle entre versoes
- Visual regression baseline do legado
- Rollback script preparado

## Saida
- Migration plan completo
- Phase timeline
- Token mapping (old → new)
- Codemod scripts
- Rollback plan
- Progress tracking dashboard

## Validacao
- [ ] Audit do legado completo
- [ ] Migration plan por fases
- [ ] Token mapping documentado
- [ ] Codemods testados
- [ ] Rollback plan pronto
- [ ] Visual regression baseline capturada
