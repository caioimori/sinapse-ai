---
task: create-storybook-documentation-standards
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

# Task: Create Storybook Documentation Standards

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Standard

## Objetivo
Definir padroes de documentacao em Storybook — garantir que cada componente tenha stories, docs e playground que permitem descoberta, compreensao e teste independente.

## Entrada
- Component API contracts
- Atomic hierarchy
- Usage patterns
- Accessibility specs

## Passos

### 1. Definir Story Structure
Para cada componente:
```
ComponentName/
├── ComponentName.stories.tsx    # Stories + playground
├── ComponentName.mdx            # Long-form docs (opcional)
└── index.ts
```

### 2. Story Categories (Required)
| Category | Proposito | Obrigatorio? |
|----------|----------|-------------|
| Default | Estado padrao com defaults | SIM |
| Variants | Todas as variants lado a lado | SIM |
| Sizes | Todas as sizes lado a lado | SIM (se tem sizes) |
| States | Todos os estados interativos | SIM |
| Composition | Uso com outros componentes | SIM |
| Responsive | Comportamento em breakpoints | Recomendado |
| Accessibility | A11y showcase | SIM |
| Playground | Controls interativos | SIM |

### 3. Story Template
```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger'],
      description: 'Visual variant',
      table: { defaultValue: { summary: 'primary' } }
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Button size',
      table: { defaultValue: { summary: 'md' } }
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' }
  },
  parameters: {
    design: { type: 'figma', url: '' },
    a11y: { config: { rules: [] } }
  }
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: { children: 'Button' }
};

export const AllVariants: Story = {
  render: () => (/* All variants side by side */)
};
```

### 4. Documentation Standards
Cada componente deve documentar:
| Secao | Conteudo |
|-------|---------|
| Overview | O que e, quando usar |
| Props Table | Auto-generated do TypeScript |
| Variants | Visual de cada variant |
| Usage | Do/Don't com codigo |
| Accessibility | ARIA, keyboard, screen reader |
| Tokens | Design tokens usados |
| Related | Componentes relacionados |

### 5. Addon Configuration
| Addon | Proposito |
|-------|----------|
| @storybook/addon-a11y | A11y checks em cada story |
| @storybook/addon-designs | Link para Figma |
| @storybook/addon-viewport | Responsive testing |
| @storybook/addon-interactions | Interaction testing |
| storybook-dark-mode | Dark mode toggle |
| @storybook/addon-measure | Spacing verification |

### 6. Naming Convention
```
{Level}/{ComponentName}
```
- Atoms/Button
- Atoms/Input
- Molecules/FormField
- Organisms/Header

## Saida
- Storybook documentation standards guide
- Story template files
- Addon configuration
- Naming convention guide
- Quality checklist per story
- Handoff para Scaffold (Storybook setup)

## Validacao
- [ ] Template padrao definido
- [ ] Categories obrigatorias listadas
- [ ] Addon list configurada
- [ ] Naming convention alinhada com Atomic Design
- [ ] A11y checks habilitados
- [ ] Dark mode toggle configurado
