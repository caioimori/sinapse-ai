---
task: implement-server-components
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

# Task: Implement Server Components

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Complex

## Objetivo
Implementar estrategia de React Server Components — definir boundary entre server e client, otimizar bundle size e melhorar performance.

## Entrada
- Application architecture
- Component library
- Data requirements
- Performance budgets

## Passos

### 1. Server vs Client Decision Matrix
| Criterio | Server Component | Client Component |
|----------|-----------------|-----------------|
| Data fetching | SIM | Nao (use server actions) |
| Acesso a backend | SIM | Nao (expose API) |
| Interatividade | NAO | SIM (onClick, onChange) |
| Browser APIs | NAO | SIM (localStorage, etc) |
| useState/useEffect | NAO | SIM |
| Large dependencies | SIM (nao vai pro bundle) | NAO (aumenta bundle) |
| Sensitive data | SIM (seguro) | NAO (exposto) |
| Static content | SIM (ideal) | Desnecessario |

### 2. Component Boundary Pattern
```typescript
// Server Component (default) — NO 'use client'
async function ProductList() {
  const products = await getProducts(); // Direct DB/API access

  return (
    <section>
      <h2>Products</h2>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />  // Server component
      ))}
      <AddToCartButton />  {/* Client component island */}
    </section>
  );
}

// Client Component — 'use client'
'use client';
function AddToCartButton({ productId }: { productId: string }) {
  const [loading, setLoading] = useState(false);

  return (
    <Button
      loading={loading}
      onClick={() => addToCart(productId)}
    >
      Add to Cart
    </Button>
  );
}
```

### 3. Server Actions
```typescript
// actions.ts
'use server';

export async function createItem(formData: FormData) {
  const data = Object.fromEntries(formData);
  // Validate with Zod
  // Insert into DB
  // Revalidate cache
  revalidatePath('/items');
}
```

### 4. Composition Pattern
```
Page (Server) ─── Layout (Server) ─── Header (Server)
  │                                      └── SearchBar (Client)
  ├── Hero (Server)
  ├── ProductGrid (Server)
  │     └── ProductCard (Server)
  │           └── FavoriteButton (Client)
  └── Newsletter (Client)
```

### 5. Streaming & Suspense
```typescript
import { Suspense } from 'react';

export default async function Page() {
  return (
    <main>
      <Header />  {/* Renders immediately */}

      <Suspense fallback={<ProductsSkeleton />}>
        <ProductList />  {/* Streams when ready */}
      </Suspense>

      <Suspense fallback={<ReviewsSkeleton />}>
        <Reviews />  {/* Streams independently */}
      </Suspense>
    </main>
  );
}
```

### 6. Anti-Patterns to Avoid
| Anti-Pattern | Correto |
|-------------|---------|
| `'use client'` no topo de tudo | Usar server by default |
| Fetch em useEffect | Fetch em Server Component |
| Passar functions como props (server→client) | Usar server actions |
| Client wrapper desnecessario | Mover interatividade para leaf components |
| Re-export client em server | Import direto do client component |

## Saida
- RSC strategy document
- Server/client boundary map
- Server actions implementation
- Streaming/Suspense configuration
- Performance comparison (before/after)

## Validacao
- [ ] Server Components por default
- [ ] 'use client' apenas quando necessario
- [ ] Server Actions para mutations
- [ ] Suspense boundaries para streaming
- [ ] Bundle size reduzido vs full-client
- [ ] Performance targets atingidos
