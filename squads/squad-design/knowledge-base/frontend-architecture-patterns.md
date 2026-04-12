# Knowledge Base: Frontend Architecture Patterns

## Escopo
Referencia de padroes de arquitetura frontend — Next.js App Router, React Server Components, state management, data fetching e estrutura de projeto.

---

## 1. Next.js App Router Architecture

### Folder Structure
```
app/
├── (marketing)/          ← Route group (no URL segment)
│   ├── page.tsx          ← /
│   ├── about/page.tsx    ← /about
│   └── pricing/page.tsx  ← /pricing
├── (dashboard)/          ← Route group
│   ├── layout.tsx        ← Dashboard layout
│   ├── dashboard/page.tsx ← /dashboard
│   └── settings/page.tsx  ← /settings
├── (auth)/               ← Route group
│   ├── login/page.tsx    ← /login
│   └── register/page.tsx ← /register
├── api/                  ← API routes
│   └── [...]/route.ts
├── layout.tsx            ← Root layout
├── loading.tsx           ← Root loading
├── error.tsx             ← Root error
├── not-found.tsx         ← 404 page
└── global-error.tsx      ← Global error boundary
```

### File Conventions
| Arquivo | Papel |
|---------|-------|
| `layout.tsx` | Layout persistente (nao re-renderiza) |
| `page.tsx` | Pagina unica, renderizada na rota |
| `loading.tsx` | Suspense fallback automatico |
| `error.tsx` | Error boundary automatico |
| `not-found.tsx` | 404 handler |
| `route.ts` | API endpoint (GET/POST/etc.) |
| `template.tsx` | Layout que re-renderiza |
| `default.tsx` | Parallel route fallback |

---

## 2. React Server Components (RSC)

### Decision Matrix
| Criterio | Server Component | Client Component |
|----------|-----------------|-----------------|
| Fetch data | YES | Via hooks/effects |
| Access backend | YES | Via API |
| Use hooks (useState, useEffect) | NO | YES |
| Event handlers (onClick, onChange) | NO | YES |
| Browser APIs | NO | YES |
| Context providers | NO | YES |
| Third-party client libs | NO | YES |
| Static content | YES (preferred) | Possible |
| SEO-critical content | YES (preferred) | Possible |

### Composition Pattern
```typescript
// Server Component (default)
// app/dashboard/page.tsx
import { DashboardClient } from './dashboard-client';

export default async function DashboardPage() {
  const data = await fetchDashboardData(); // Server-side fetch

  return (
    <main>
      <h1>Dashboard</h1>
      {/* Server-rendered static parts */}
      <section>
        <StaticWidget data={data.summary} />
      </section>

      {/* Client component for interactivity */}
      <DashboardClient initialData={data.charts} />
    </main>
  );
}
```

```typescript
// Client Component
// app/dashboard/dashboard-client.tsx
'use client';

import { useState } from 'react';

export function DashboardClient({ initialData }) {
  const [filter, setFilter] = useState('all');
  // Interactive logic here
}
```

### Rules
| Regra | Descricao |
|-------|----------|
| Server by default | Nao adicionar 'use client' sem necessidade |
| Push client boundary down | Menor client component possivel |
| Pass server data as props | Server → Client via serializable props |
| No server imports in client | Client components nao importam server-only |
| Composition over conversion | Wrap client in server, nao o contrario |

---

## 3. State Management Strategy

### State Classification
| Tipo | Localizacao | Ferramenta |
|------|-----------|-----------|
| Server state | Server cache | React Server Components + fetch cache |
| URL state | URL params | `useSearchParams`, `usePathname` |
| Form state | Component local | React Hook Form + Zod |
| UI state (local) | Component | `useState`, `useReducer` |
| UI state (global) | App-wide | Zustand (minimal store) |
| Auth state | Provider | NextAuth / Supabase Auth |
| Theme state | Provider | next-themes |

### Colocation Rules
| Regra | Descricao |
|-------|----------|
| Start local | State comeca no componente que precisa |
| Lift only when shared | So sobe quando 2+ componentes precisam |
| URL for shareable state | Filtros, tabs, pagination → URL params |
| Server for server data | Nao duplicar server data no client |
| Minimal global store | Zustand so para UI state que 3+ componentes usam |

### Zustand Pattern
```typescript
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  activeModal: null,
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
```

---

## 4. Data Fetching Patterns

### Server-Side (Preferred)
```typescript
// Fetch in Server Component (recommended)
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}

// With caching
async function getProduct(id: string) {
  const res = await fetch(`${API}/products/${id}`, {
    next: { revalidate: 3600 } // ISR: revalidate every hour
  });
  return res.json();
}

// With tags for on-demand revalidation
async function getProducts() {
  const res = await fetch(`${API}/products`, {
    next: { tags: ['products'] }
  });
  return res.json();
}
```

### Streaming with Suspense
```typescript
import { Suspense } from 'react';

export default function Dashboard() {
  return (
    <main>
      {/* Fast: renders immediately */}
      <DashboardHeader />

      {/* Slow: streams when ready */}
      <Suspense fallback={<ChartSkeleton />}>
        <SlowChart />
      </Suspense>

      <Suspense fallback={<TableSkeleton />}>
        <SlowDataTable />
      </Suspense>
    </main>
  );
}
```

### Client-Side (When Needed)
```typescript
'use client';
import useSWR from 'swr';

function RealtimeNotifications() {
  const { data, error, isLoading } = useSWR(
    '/api/notifications',
    fetcher,
    { refreshInterval: 5000 } // Poll every 5s
  );

  if (isLoading) return <NotificationSkeleton />;
  if (error) return <ErrorState />;
  return <NotificationList items={data} />;
}
```

### Caching Matrix
| Estrategia | Cache | Uso |
|-----------|-------|-----|
| `force-cache` (default) | Permanent until revalidation | Static data |
| `revalidate: N` | ISR every N seconds | Semi-static data |
| `tags: ['x']` | On-demand by tag | CMS content |
| `no-store` | Never cache | User-specific data |
| SWR/React Query | Client-side cache | Real-time data |

---

## 5. Server Actions

### Pattern
```typescript
// lib/actions/product.ts
'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreateProductSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  description: z.string().optional(),
});

export async function createProduct(formData: FormData) {
  const parsed = CreateProductSchema.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
    description: formData.get('description'),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten() };
  }

  await db.product.create({ data: parsed.data });
  revalidatePath('/products');
  return { success: true };
}
```

---

## 6. Project Structure

### Feature-Based Organization
```
src/
├── app/                    ← Routes (Next.js App Router)
├── components/
│   ├── ui/                 ← Design system primitives
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   └── dialog.tsx
│   ├── composed/           ← Multi-component compositions
│   │   ├── data-table.tsx
│   │   └── form-field.tsx
│   └── features/           ← Feature-specific components
│       ├── auth/
│       ├── dashboard/
│       └── products/
├── lib/
│   ├── actions/            ← Server actions
│   ├── api/                ← API client
│   ├── hooks/              ← Custom hooks
│   ├── utils/              ← Utility functions
│   └── validations/        ← Zod schemas
├── styles/
│   └── globals.css         ← Tailwind + custom CSS
├── types/
│   └── index.ts            ← Shared TypeScript types
└── config/
    └── site.ts             ← Site configuration
```

### Import Rules
| Regra | Descricao |
|-------|----------|
| Absolute imports | `@/components/ui/button` |
| No circular | A → B → A proibido |
| Barrel exports | `index.ts` para public API |
| Layer boundaries | UI nao importa features |
| Direction | Features → Composed → UI (never reverse) |

---

## 7. Error Handling

### Error Boundary Hierarchy
```
Global Error (global-error.tsx)
└── Route Error (error.tsx)
    └── Component Error (ErrorBoundary)
        └── Suspense Fallback (loading.tsx)
```

### Error Types
| Tipo | Handling | UX |
|------|---------|-----|
| 404 | not-found.tsx | Helpful redirect links |
| Server error | error.tsx | Retry button |
| API error | try/catch + toast | Error message + action |
| Validation error | Zod + form errors | Inline field errors |
| Auth error | Middleware redirect | Login page |
| Network error | SWR retry | Offline banner |

---

## 8. Performance Patterns

### Dynamic Imports
```typescript
import dynamic from 'next/dynamic';

// Heavy component — lazy loaded
const Chart = dynamic(() => import('@/components/chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Client-only
});

// Conditional feature
const AdminPanel = dynamic(
  () => import('@/components/admin-panel'),
  { loading: () => null }
);
```

### Image Optimization
```typescript
import Image from 'next/image';

// LCP image
<Image src="/hero.jpg" alt="" width={1440} height={600} priority sizes="100vw" />

// Regular image
<Image src="/feature.jpg" alt="" width={600} height={400} sizes="(max-width: 768px) 100vw, 50vw" />
```

### Metadata
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: { default: 'Site Name', template: '%s | Site Name' },
  description: 'Site description',
  openGraph: { /* ... */ },
};

// app/products/[id]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.id);
  return { title: product.name, description: product.description };
}
```

---

## Referencias
- Next.js Documentation (App Router)
- React Documentation (Server Components)
- Vercel Architecture Guide
- Kent C. Dodds — Application State Management
