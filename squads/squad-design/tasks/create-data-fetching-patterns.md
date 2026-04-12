---
task: create-data-fetching-patterns
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

# Task: Create Data Fetching Patterns

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Definir padroes de data fetching consistentes — server-side, client-side, streaming e caching strategies.

## Entrada
- API architecture
- Performance requirements
- Data freshness requirements
- User experience goals

## Passos

### 1. Server-Side Fetching (Default)
```typescript
// Server Component — direct fetch
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetch(`${API}/products/${params.id}`, {
    next: { revalidate: 3600 }, // ISR: revalidate hourly
  }).then(r => r.json());

  return <ProductView product={product} />;
}
```

### 2. Streaming with Suspense
```typescript
async function DashboardPage() {
  return (
    <div>
      {/* Immediate */}
      <DashboardHeader />

      {/* Streams when ready */}
      <Suspense fallback={<MetricsSkeleton />}>
        <DashboardMetrics />
      </Suspense>

      {/* Streams independently */}
      <Suspense fallback={<ActivitySkeleton />}>
        <RecentActivity />
      </Suspense>
    </div>
  );
}
```

### 3. Client-Side Fetching (When Needed)
```typescript
'use client';
// Only for: real-time data, user interactions, infinite scroll

import useSWR from 'swr';

function LiveNotifications() {
  const { data, error, isLoading } = useSWR('/api/notifications', fetcher, {
    refreshInterval: 30000, // Poll every 30s
  });

  if (isLoading) return <NotificationSkeleton />;
  if (error) return <ErrorState />;
  return <NotificationList items={data} />;
}
```

### 4. Mutations (Server Actions)
```typescript
'use server';

export async function updateProfile(formData: FormData) {
  const data = ProfileSchema.parse(Object.fromEntries(formData));
  await db.users.update({ where: { id: userId }, data });
  revalidatePath('/profile');
  return { success: true };
}
```

### 5. Caching Strategy Matrix
| Data Type | Cache | Revalidation | Pattern |
|-----------|-------|-------------|---------|
| Static pages | force-cache | On deploy | SSG |
| Product catalog | revalidate: 3600 | Hourly | ISR |
| User profile | no-store | Always fresh | SSR |
| Search results | no-store | On query change | SSR |
| Notifications | Client SWR | 30s polling | CSR |
| Comments | Client SWR | On mutation | CSR |

### 6. Error & Loading States
```typescript
// Per-route loading
export default function Loading() {
  return <PageSkeleton />;
}

// Per-route error
export default function Error({ error, reset }) {
  return <ErrorState error={error} onRetry={reset} />;
}
```

## Saida
- Data fetching patterns documentation
- Server vs client decision matrix
- Caching strategy per data type
- Mutation patterns (server actions)
- Loading/error state patterns

## Validacao
- [ ] Server-side by default
- [ ] Client-side only quando necessario
- [ ] Caching configurado per endpoint
- [ ] Streaming com Suspense
- [ ] Loading states em todas as rotas
- [ ] Error handling em todas as rotas
