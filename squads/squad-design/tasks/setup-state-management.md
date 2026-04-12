---
task: setup-state-management
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

# Task: Setup State Management

## Metadata
- **Squad:** squad-design
- **Agent:** Scaffold (dx-frontend-engineer)
- **Complexity:** Standard

## Objetivo
Configurar estrategia de state management — definir onde cada tipo de estado vive, como flui e como e gerenciado.

## Entrada
- Application architecture
- Data requirements
- Performance considerations
- Team experience

## Passos

### 1. Classificar Tipos de State
| Tipo | Onde vive | Ferramenta |
|------|----------|-----------|
| Server State | Cache do servidor | RSC + fetch cache |
| URL State | URL params/query | useSearchParams, nuqs |
| Form State | Formularios | React Hook Form |
| UI State (local) | Component | useState, useReducer |
| UI State (shared) | Context/Store | React Context, Zustand |
| Auth State | Session | NextAuth / Supabase Auth |
| Theme State | CSS/Media query | CSS custom properties |

### 2. Server State (Default)
Com React Server Components:
```typescript
// Server Component — dados diretos
async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id); // Server-side fetch
  return <ProductView product={product} />;
}
```

### 3. Client State (When Needed)
```typescript
// Zustand store (minimal)
import { create } from 'zustand';

interface UIStore {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
```

### 4. State Colocation Rules
| Regra | Descricao |
|-------|-----------|
| Start local | useState no componente que precisa |
| Lift when needed | Mover para parent quando sibling precisa |
| Context when deep | Context quando prop drilling > 3 niveis |
| Store when global | Zustand quando multiplos componentes desconectados |
| URL when sharable | URL params quando estado deve ser linkavel |

### 5. Data Fetching Pattern
```typescript
// Server Component pattern
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: { revalidate: 3600 }, // ISR: revalidate hourly
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

// Client-side mutation
'use client';
import { useTransition } from 'react';

function CreateButton() {
  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    startTransition(async () => {
      await createItem();
      // Revalidate
    });
  };
}
```

### 6. Caching Strategy
| Tipo | Cache | Revalidation |
|------|-------|-------------|
| Static data | Build time | On deploy |
| Semi-static | ISR | Time-based (1h, 24h) |
| Dynamic | On-demand | On mutation |
| Real-time | No cache | WebSocket/SSE |

## Saida
- State management strategy document
- Store configurations (if needed)
- Data fetching patterns
- Caching strategy
- Implementation examples

## Validacao
- [ ] Cada tipo de state tem lugar definido
- [ ] Server Components usados por default
- [ ] Client state minimal
- [ ] Caching strategy definida
- [ ] No unnecessary re-renders
- [ ] TypeScript strict em todos os stores
