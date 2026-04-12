---
task: configure-token-export-pipeline
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

# Task: Configure Token Export Pipeline

## Metadata
- **Squad:** squad-design
- **Agent:** Stratum (dx-design-system-architect)
- **Complexity:** Complex

## Objetivo
Configurar o pipeline de exportacao de design tokens — transformar tokens W3C DTCG em formatos consumiveis (CSS custom properties, JS/TS objects, SCSS, etc.) usando Style Dictionary ou equivalente.

## Entrada
- Token files (W3C DTCG format) - L1, L2, L3
- Target platforms (web, mobile, etc)
- Theme requirements (light/dark, multi-brand)
- Build tooling do projeto

## Passos

### 1. Definir Outputs Necessarios
| Formato | Uso | Arquivo |
|---------|-----|---------|
| CSS Custom Properties | Runtime theming | tokens.css |
| TypeScript Constants | Type-safe access | tokens.ts |
| SCSS Variables | Build-time usage | _tokens.scss |
| JSON | Tooling, Figma sync | tokens.json |
| Tailwind Config | Tailwind integration | tailwind.tokens.js |

### 2. Configurar Style Dictionary
```javascript
// style-dictionary.config.js
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'dist/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        options: {
          outputReferences: true  // Manter referencias
        }
      }]
    },
    js: {
      transformGroup: 'js',
      buildPath: 'dist/js/',
      files: [{
        destination: 'tokens.ts',
        format: 'javascript/es6'
      }]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'dist/scss/',
      files: [{
        destination: '_tokens.scss',
        format: 'scss/variables'
      }]
    }
  }
};
```

### 3. Custom Transforms
| Transform | Input | Output |
|-----------|-------|--------|
| name/kebab | color.blue.500 | --color-blue-500 |
| size/rem | 16px | 1rem |
| color/css | #3B82F6 | #3B82F6 |
| shadow/css | {object} | 0 4px 6px rgba(...) |
| typography/css | {object} | font shorthand |

### 4. Theme Generation
```
tokens/
├── primitive/
│   ├── colors.json
│   ├── spacing.json
│   └── typography.json
├── semantic/
│   ├── light.json
│   └── dark.json
└── component/
    └── *.json

→ Pipeline generates:
dist/
├── css/
│   ├── tokens-light.css
│   └── tokens-dark.css
├── js/
│   └── tokens.ts
└── tailwind/
    └── tailwind.tokens.js
```

### 5. Tailwind Integration
```javascript
// tailwind.config.js integration
const tokens = require('./dist/tailwind/tailwind.tokens');

module.exports = {
  theme: {
    colors: tokens.colors,
    spacing: tokens.spacing,
    fontSize: tokens.fontSize,
    fontFamily: tokens.fontFamily,
    borderRadius: tokens.borderRadius,
    boxShadow: tokens.boxShadow,
  }
};
```

### 6. CI/CD Integration
```yaml
token_pipeline:
  trigger: "tokens/**/*.json changed"
  steps:
    - validate: "Check W3C DTCG compliance"
    - build: "Run Style Dictionary"
    - test: "Visual regression on token changes"
    - publish: "npm publish @org/tokens"
  output:
    package: "@org/design-tokens"
    version: "semantic versioning"
```

## Saida
- Style Dictionary configuration
- Custom transforms
- Build pipeline scripts
- Tailwind integration config
- CI/CD pipeline definition
- Handoff para Scaffold (consumption) e squad-brand (Figma sync)

## Validacao
- [ ] Todos os formatos de output gerados
- [ ] Referencias mantidas no CSS output
- [ ] Theme files separados (light/dark)
- [ ] Tailwind config integrado
- [ ] CI/CD pipeline configurado
- [ ] Versioning strategy definida
