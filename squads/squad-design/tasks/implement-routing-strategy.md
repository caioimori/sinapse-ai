---
task: implement-routing-strategy
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

# Task: Implement Routing Strategy

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Implementar estrategia de routing — configurar rotas, layouts compartilhados, loading states, error boundaries e navegacao programatica.

## Entrada
- Information architecture (de Compass)
- URL structure definida
- SEO requirements
- Authentication requirements

## Passos

### 1. Definir Route Structure (Next.js App Router)
```
app/
├── (marketing)/              # Public pages
│   ├── page.tsx              # Home
│   ├── about/page.tsx
│   ├── pricing/page.tsx
│   └── layout.tsx            # Marketing layout
├── (auth)/                   # Auth pages
│   ├── login/page.tsx
│   ├── register/page.tsx
│   └── layout.tsx            # Auth layout
├── (dashboard)/              # Authenticated
│   ├── page.tsx              # Dashboard home
│   ├── settings/page.tsx
│   └── layout.tsx            # Dashboard layout
├── api/                      # API routes
├── layout.tsx                # Root layout
├── loading.tsx               # Global loading
├── error.tsx                 # Global error
└── not-found.tsx             # 404 page
```

### 2. Layouts Compartilhados
| Layout | Conteudo | Route Group |
|--------|---------|-------------|
| Root | HTML shell, fonts, theme | All |
| Marketing | Header + Footer | (marketing) |
| Auth | Centered card | (auth) |
| Dashboard | Sidebar + Topbar | (dashboard) |

### 3. Loading States
```typescript
// loading.tsx per route
export default function Loading() {
  return <Skeleton variant="page" />;
}
```

### 4. Error Boundaries
```typescript
// error.tsx per route
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorState error={error} onRetry={reset} />;
}
```

### 5. Middleware (Auth, i18n)
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  // Auth check
  // Locale detection
  // Redirects
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

### 6. SEO Configuration
```typescript
// Metadata per route
export const metadata: Metadata = {
  title: '',
  description: '',
  openGraph: {},
  robots: {},
};

// Dynamic metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  return { title: `...` };
}
```

## Saida
- Route structure implementada
- Layouts compartilhados
- Loading/Error states
- Middleware configuration
- SEO metadata setup

## Validacao
- [ ] Todas as rotas da IA implementadas
- [ ] Layouts compartilhados funcionais
- [ ] Loading states em todas as rotas
- [ ] Error boundaries em todas as rotas
- [ ] 404 page customizada
- [ ] SEO metadata configurado
