---
task: create-components
responsavel: "@brand-system-architect"
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

# Task: create-components

## Metadata
- **Agent:** brand-system-architect (Grid)
- **Squad:** squad-brand
- **Trigger:** `*create-component`
- **Inputs:** Token system, visual guidelines, accessibility requirements
- **Outputs:** Component library documentada com codigo

## Description
Cria componentes base do design system — cada um com anatomia, variacoes, tokens, ARIA e codigo.

## Steps
1. Para cada componente (Button, Input, Card, Modal, Nav, Badge, Alert, Table, Dropdown, Tabs, Tooltip, Avatar):
   - **Anatomia:** partes que compoem (container, label, icon, indicator)
   - **Sizes:** sm (32px), md (40px), lg (48px)
   - **States:** default, hover, active, focus, disabled, loading
   - **Variants:** primary, secondary, outline, ghost, danger
   - **Tokens:** quais tokens cada parte usa (bg, text, border, shadow)
   - **Responsive:** como muda em mobile vs desktop
   - **Accessibility:** ARIA role, keyboard navigation, focus management
   - **Code:** HTML + CSS referencia implementavel
2. Documentar Component API (props que aceita)
3. Criar exemplos de composicao (componentes juntos)
4. Definir spacing entre componentes (usando spacing scale)

## Validation Criteria
- 12+ componentes base criados
- Cada um com anatomia, 3 sizes, 5 states, 3+ variants
- ARIA roles definidos
- Codigo HTML+CSS para cada
- Tokens usados (nao hardcoded values)

## Output Format
Component library doc com anatomia, variacoes, tokens, ARIA e codigo por componente.
