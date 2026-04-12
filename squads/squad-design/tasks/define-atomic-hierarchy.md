---
task: define-atomic-hierarchy
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

# Task: Define Atomic Hierarchy

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Definir a hierarquia atomica do design system usando Atomic Design (Brad Frost) — classificar cada componente em seu nivel correto e definir regras de composicao.

## Entrada
- Component inventory
- UI designs (de Canvas)
- Usage patterns
- Composition requirements

## Passos

### 1. Classificar Componentes
| Nivel | Definicao | Exemplos |
|-------|-----------|---------|
| **Atoms** | Elementos HTML basicos estilizados | Button, Input, Label, Icon, Badge, Avatar, Divider |
| **Molecules** | Grupo de atoms funcionando juntos | FormField (Label+Input+HelpText), SearchBar (Input+Button), NavItem (Icon+Text) |
| **Organisms** | Secoes complexas da UI | Header, Footer, Sidebar, Card, Modal, DataTable, Form |
| **Templates** | Page layouts sem conteudo real | DashboardTemplate, AuthTemplate, ContentTemplate |
| **Pages** | Templates com conteudo real | Homepage, LoginPage, ProductPage |

### 2. Regras de Composicao
```yaml
composition_rules:
  atoms:
    can_contain: ["native HTML elements"]
    cannot_contain: ["molecules", "organisms"]
    import_from: ["tokens only"]

  molecules:
    can_contain: ["atoms", "native HTML"]
    cannot_contain: ["organisms", "templates"]
    import_from: ["atoms", "tokens"]

  organisms:
    can_contain: ["atoms", "molecules", "other organisms (limited)"]
    cannot_contain: ["templates", "pages"]
    import_from: ["atoms", "molecules", "tokens"]

  templates:
    can_contain: ["organisms", "molecules", "atoms"]
    import_from: ["organisms", "molecules", "layout tokens"]
    defines: ["layout structure", "content slots"]

  pages:
    can_contain: ["everything"]
    import_from: ["templates", "organisms", "data"]
    defines: ["real content", "data connections"]
```

### 3. Component Inventory por Nivel
```yaml
inventory:
  atoms:
    - name: "Button"
      variants: 4
      status: "[stable/beta/deprecated]"
    - name: "Input"
      variants: 3
      status: ""

  molecules:
    - name: "FormField"
      composed_of: ["Label", "Input", "HelpText"]
      status: ""

  organisms:
    - name: "Header"
      composed_of: ["Logo", "NavItem[]", "SearchBar", "UserMenu"]
      status: ""

  templates:
    - name: "DashboardTemplate"
      regions: ["header", "sidebar", "main", "footer"]
      status: ""
```

### 4. Dependency Graph
Mapear dependencias entre componentes:
- Quais atoms sao usados por quais molecules?
- Quais molecules compoe quais organisms?
- Circular dependencies = erro de design

### 5. Naming Convention
```
{level}/{component-name}
```
- `atoms/Button`
- `molecules/FormField`
- `organisms/Header`
- `templates/DashboardTemplate`

### 6. File Structure
```
components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.stories.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   └── Input/
├── molecules/
│   ├── FormField/
│   └── SearchBar/
├── organisms/
│   ├── Header/
│   └── Modal/
└── templates/
    ├── DashboardTemplate/
    └── AuthTemplate/
```

## Saida
- Atomic hierarchy classification
- Composition rules documentation
- Component inventory by level
- Dependency graph
- File structure specification
- Handoff para Scaffold (implementation structure)

## Validacao
- [ ] Todos os componentes classificados
- [ ] Regras de composicao claras
- [ ] Sem circular dependencies
- [ ] Naming convention consistente
- [ ] File structure definida
- [ ] Cada nivel tem exemplos claros
