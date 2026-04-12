---
task: create-api-integration-patterns
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

# Task: Create API Integration Patterns

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Definir padroes de integracao com APIs — fetch patterns, error handling, caching, retry logic e type safety.

## Entrada
- API specifications (REST/GraphQL)
- Authentication method
- Performance requirements
- Error handling requirements

## Passos

### 1. Definir API Client
```typescript
// lib/api-client.ts
const API_BASE = process.env.API_URL;

async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }

  return res.json();
}
```

### 2. Type-Safe API Layer
```typescript
// api/products.ts
import { z } from 'zod';

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

type Product = z.infer<typeof ProductSchema>;

export async function getProducts(): Promise<Product[]> {
  const data = await apiClient<unknown[]>('/products');
  return z.array(ProductSchema).parse(data);
}

export async function getProduct(id: string): Promise<Product> {
  const data = await apiClient<unknown>(`/products/${id}`);
  return ProductSchema.parse(data);
}
```

### 3. Caching Strategies
| Tipo de dado | Cache Strategy | TTL |
|-------------|---------------|-----|
| Static (config) | force-cache | Until redeploy |
| Semi-static (products) | revalidate | 3600s |
| User-specific | no-store | Never |
| Real-time (notifications) | no-store | Never |

### 4. Error Handling Pattern
```typescript
class ApiError extends Error {
  constructor(
    public status: number,
    public body: string
  ) {
    super(`API Error ${status}`);
  }

  get isNotFound() { return this.status === 404; }
  get isUnauthorized() { return this.status === 401; }
  get isRateLimited() { return this.status === 429; }
}
```

### 5. Optimistic Updates
```typescript
// For mutations with immediate UI feedback
async function toggleFavorite(id: string) {
  // 1. Update UI immediately
  optimisticUpdate(id, { favorited: true });

  try {
    // 2. Send to server
    await apiClient(`/favorites/${id}`, { method: 'POST' });
  } catch {
    // 3. Rollback on failure
    optimisticUpdate(id, { favorited: false });
    toast.error('Failed to update');
  }
}
```

### 6. Authentication Integration
| Method | Implementation |
|--------|---------------|
| JWT | Authorization header, refresh token flow |
| Session | HTTP-only cookies, server-side validation |
| API Key | Server-side only (env var) |

## Saida
- API client configuration
- Type-safe API layer
- Caching strategy per endpoint
- Error handling patterns
- Authentication integration

## Validacao
- [ ] Type-safe com Zod validation
- [ ] Error handling robusto
- [ ] Caching configurado por tipo
- [ ] Auth integrado
- [ ] No API keys no client bundle
- [ ] Optimistic updates onde aplicavel
