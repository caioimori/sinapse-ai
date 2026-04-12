---
task: configure-monorepo-structure
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

# Task: Configure Monorepo Structure

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Configurar estrutura de monorepo quando o projeto requer packages separados (tokens, components, app) — setup de workspaces, builds e dependencies.

## Entrada
- Package requirements
- Build dependencies
- Deploy targets
- Team structure

## Passos

### 1. Definir Package Structure
```
packages/
├── tokens/             # @org/tokens — Design tokens
│   ├── src/
│   ├── dist/
│   └── package.json
├── components/         # @org/components — Component library
│   ├── src/
│   ├── dist/
│   └── package.json
├── icons/              # @org/icons — Icon library
│   ├── src/
│   └── package.json
└── config/             # @org/config — Shared configs
    ├── eslint/
    ├── tsconfig/
    └── tailwind/

apps/
├── web/                # Main application
├── storybook/          # Storybook documentation
└── docs/               # Documentation site
```

### 2. Workspace Configuration
```json
// package.json (root)
{
  "private": true,
  "workspaces": ["packages/*", "apps/*"],
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test"
  }
}
```

### 3. Turborepo Configuration
```json
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

### 4. Shared Configurations
```typescript
// packages/config/tsconfig/base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx"
  }
}
```

### 5. Internal Package Publishing
```json
// packages/components/package.json
{
  "name": "@org/components",
  "version": "0.0.0",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": { "import": "./dist/index.js", "types": "./dist/index.d.ts" },
    "./button": { "import": "./dist/button.js" }
  },
  "sideEffects": false
}
```

### 6. Dependency Rules
| Regra | Descricao |
|-------|-----------|
| tokens → (nenhum) | Standalone, no deps |
| components → tokens | Consume tokens |
| icons → (nenhum) | Standalone |
| app → components, tokens, icons | Consumer |
| config → (nenhum) | Shared configs |

## Saida
- Monorepo structure configurada
- Turborepo pipeline
- Shared configs
- Package exports
- Development workflow docs

## Validacao
- [ ] Workspaces resolvendo corretamente
- [ ] Build order respeita dependencies
- [ ] Hot reload funcional entre packages
- [ ] Shared configs herdados
- [ ] Tree-shaking funcional com exports
- [ ] CI/CD pipeline funcional
