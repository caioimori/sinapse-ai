---
task: setup-storybook-integration
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

# Task: Setup Storybook Integration

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Configurar Storybook como plataforma de documentacao e desenvolvimento de componentes — setup, addons, theming e CI integration.

## Entrada
- Component library
- Design tokens
- Storybook documentation standards (de Stratum)
- CI/CD pipeline

## Passos

### 1. Setup Inicial
```bash
npx storybook@latest init --type react
```

### 2. Configurar Addons
```typescript
// .storybook/main.ts
const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-essentials',     // Controls, actions, viewport, docs
    '@storybook/addon-a11y',           // Accessibility checks
    '@storybook/addon-interactions',   // Interaction testing
    '@storybook/addon-designs',        // Figma integration
    'storybook-dark-mode',             // Theme toggle
    '@storybook/addon-measure',        // Spacing measurement
  ],
  framework: '@storybook/nextjs',
};
```

### 3. Theme Configuration
```typescript
// .storybook/preview.ts
const preview: Preview = {
  parameters: {
    darkMode: {
      dark: { ...themes.dark },
      light: { ...themes.light },
      darkClass: 'dark',
      lightClass: 'light',
      classTarget: 'html',
    },
    viewport: {
      viewports: {
        mobile: { name: 'Mobile', styles: { width: '375px', height: '812px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
        desktop: { name: 'Desktop', styles: { width: '1440px', height: '900px' } },
      },
    },
    a11y: {
      config: {
        rules: [
          { id: 'color-contrast', enabled: true },
        ],
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};
```

### 4. Token Integration
```typescript
// .storybook/preview-head.html
// Import token CSS files
<link rel="stylesheet" href="tokens.css" />
```

### 5. CI Integration
```yaml
# Chromatic (visual regression)
storybook_ci:
  steps:
    - build: "npm run build-storybook"
    - deploy: "npx chromatic --project-token=$CHROMATIC_TOKEN"
    - test: "npm run test-storybook"
```

### 6. Documentation Pages
```
Storybook Structure:
├── Getting Started/
│   ├── Introduction
│   ├── Installation
│   └── Contributing
├── Foundation/
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Icons
├── Atoms/
│   ├── Button
│   ├── Input
│   └── ...
├── Molecules/
├── Organisms/
└── Templates/
```

## Saida
- Storybook configuration complete
- Addon setup
- Theme configuration (dark/light)
- CI/CD integration (Chromatic)
- Documentation structure

## Validacao
- [ ] Storybook builds sem errors
- [ ] A11y addon configurado e funcional
- [ ] Dark mode toggle funcional
- [ ] Viewport presets configurados
- [ ] Tokens importados corretamente
- [ ] CI pipeline funcional
