---
task: setup-frontend-architecture
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

# Task: Setup Frontend Architecture

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Complex

## Objetivo
Configurar a arquitetura frontend do projeto — definir stack, estrutura de pastas, patterns de organizacao e conventions.

## Entrada
- DX Brief (requisitos tecnicos)
- Technology decisions
- Scale requirements
- Team conventions
- Performance budgets

## Passos

### 1. Selecionar Stack
| Camada | Opcao Recomendada | Alternativas |
|--------|-------------------|-------------|
| Framework | Next.js 14+ (App Router) | Astro, Nuxt, SvelteKit |
| Styling | Tailwind CSS 4+ | CSS Modules, Vanilla Extract |
| Components | React 19+ | — |
| State | React Context + Server Components | Zustand, Jotai |
| Data Fetching | Server Components + fetch | TanStack Query |
| Forms | React Hook Form + Zod | Formik |
| Testing | Vitest + Testing Library | Jest |
| E2E | Playwright | Cypress |
| Linting | ESLint + Prettier + oxlint | Biome |
| TypeScript | Strict mode | — |

### 2. Definir Estrutura de Pastas
```
src/
├── app/                    # Next.js App Router
│   ├── (marketing)/        # Route group
│   ├── (dashboard)/        # Route group
│   ├── api/                # API routes
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles + tokens
├── components/
│   ├── atoms/              # Atomic Design
│   ├── molecules/
│   ├── organisms/
│   └── templates/
├── lib/                    # Utilities
│   ├── utils.ts
│   ├── cn.ts               # Class merge utility
│   └── constants.ts
├── hooks/                  # Custom hooks
├── types/                  # Shared types
├── styles/                 # Token imports, global
└── config/                 # App configuration
```

### 3. Configurar Absolute Imports
```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@types/*": ["./src/types/*"]
    }
  }
}
```

### 4. Definir Coding Conventions
| Aspecto | Convencao |
|---------|----------|
| File naming | kebab-case (files), PascalCase (components) |
| Export | Named exports (no default) |
| Props | Interface (not type) |
| CSS | Tailwind utility-first, tokens via CSS vars |
| State | Colocate, lift only when needed |
| Server vs Client | Server by default, 'use client' only when needed |
| Error handling | Error boundaries per route |

### 5. Performance Foundation
| Config | Setup |
|--------|-------|
| Image optimization | next/image with AVIF/WebP |
| Font optimization | next/font with preload |
| Bundle analysis | @next/bundle-analyzer |
| Lighthouse CI | CI/CD integration |
| Core Web Vitals | Monitoring setup |

### 6. Developer Experience
| Ferramenta | Proposito |
|-----------|----------|
| ESLint | Code quality |
| Prettier | Formatting |
| Husky | Pre-commit hooks |
| lint-staged | Only lint changed files |
| TypeScript strict | Type safety |
| VS Code settings | Shared team config |

## Saida
- Project scaffold (boilerplate)
- Configuration files
- Coding conventions document
- Folder structure documentation
- CI/CD pipeline config

## Validacao
- [ ] Stack completa configurada
- [ ] TypeScript strict sem errors
- [ ] Absolute imports funcionando
- [ ] Linting + formatting configurados
- [ ] Performance baseline medida
- [ ] Developer experience validada
