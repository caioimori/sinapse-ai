# Software Architecture Patterns

> **Agente(s):** @architect (Stratum), @developer (Pixel)
> **Fonte:** fullstack-engineering-animations.md (DEFINITIVE research)
> **Complementa:** `infrastructure-decision-framework.md` (infra) -- este documento foca em SOFTWARE architecture
> **Uso:** Consultar ao iniciar projetos novos, escolher patterns, ou avaliar arquitetura existente

---

## 1. Architecture Decision Tree

### By Project Type

| Tipo de Projeto | Arquitetura | State Mgmt | Rendering | DB Pattern |
|----------------|-------------|-----------|-----------|------------|
| Landing Page | JAMstack (SSG + Edge) | nuqs (URL) | SSG/ISR | N/A ou Supabase Free |
| Blog/Content | JAMstack (SSG + ISR) | TanStack Query | SSG + ISR | Supabase + MDX |
| SaaS B2B | Modular Monolith + Clean Architecture | TanStack Query + Zustand | SSR + Streaming | Multi-tenant shared table |
| E-commerce | Modular Monolith + CQRS | TanStack Query + Zustand | ISR + SSR | CQRS read models |
| Fintech | Modular Monolith + DDD + Event Sourcing | TanStack Query + Zustand | SSR | Append-only + audit log |
| Marketplace | Modular Monolith (evolving) | TanStack Query + Zustand | ISR + SSR | Schema-per-module |
| Real-time App | Event-Driven + WebSockets | Zustand + Supabase Realtime | SSR + Client | Realtime subscriptions |

### By Team Size

```
Projeto novo?
  |
  +-- Equipe <= 5 devs?
  |     +-- SIM --> Monolith (com boa estrutura de pastas)
  |     +-- NAO --> Modular Monolith
  |
  +-- Equipe > 10 devs?
  |     +-- Times independentes com dominios distintos?
  |           +-- SIM --> Microservices (seletivo)
  |           +-- NAO --> Modular Monolith
  |
  +-- Necessidade de scaling independente comprovada?
        +-- SIM --> Extrair modulo especifico para microservice
        +-- NAO --> Manter no Modular Monolith
```

**Default for SINAPSE projects:** Modular Monolith. Microservices only with proven need.

---

## 2. Architecture Patterns Decision Matrix

| Criterio | Clean Architecture | DDD | Hexagonal | Serverless | JAMstack |
|----------|-------------------|-----|-----------|------------|----------|
| **Complexidade de dominio** | Media-Alta | Alta | Media-Alta | Baixa | Baixa |
| **Team size minimo** | 2+ | 3+ | 2+ | 1+ | 1+ |
| **Learning curve** | Media | Alta | Media | Baixa | Baixa |
| **Testabilidade** | Excelente | Excelente | Excelente | Boa | Boa |
| **Melhor para** | SaaS, enterprise | Dominio complexo | Ports swappable | APIs, event-driven | Content, marketing |
| **Evitar quando** | CRUDs simples | Dominio trivial | Equipe junior | Long-running jobs | Apps interativas |
| **Custo de manter** | Medio | Alto | Medio | Baixo | Baixo |

### When to Use What

```
Dominio simples (CRUD)?
  +-- SIM --> Serverless/JAMstack (sem over-engineering)
  +-- NAO --> Regras de negocio complexas?
        +-- SIM --> Bounded Contexts claros?
        |     +-- SIM --> DDD + Clean Architecture
        |     +-- NAO --> Clean Architecture (sem tactical DDD)
        +-- NAO --> Hexagonal (swap adapters easily)
```

---

## 3. Modular Monolith Structure (Golden Standard)

```
src/
  modules/
    auth/
      domain/          # Entities, Value Objects
      application/     # Use Cases, Services
      infrastructure/  # Repos, APIs externas
      presentation/    # Controllers, Routes
      index.ts         # Public API (barrel export)
    billing/
      ...
    notifications/
      ...
  shared/
    kernel/            # Shared types, Events
    infrastructure/    # Database, Logging, Config
```

**5 Principles:**
1. Each module exposes ONLY a public API (barrel export)
2. Modules NEVER import directly from another module -- use the public API
3. Inter-module communication via Domain Events (decoupling)
4. Each module can have its own DB schema (schema-per-module)
5. A module can be extracted to microservice when needed

---

## 4. State Management Patterns

### The Modern Stack (2025-2026)

| State Type | Tool | When |
|-----------|------|------|
| Server State | **TanStack Query** | API data, cache, revalidation |
| Client State | **Zustand** | UI state, global without boilerplate |
| URL State | **nuqs** | Filters, pagination, tabs, search params |
| Form State | **React Hook Form + Zod** | Complex forms with validation |
| Local State | `useState/useReducer` | Simple component-scoped state |

### Decision Flow

```
Data comes from API?
  +-- YES --> TanStack Query (staleTime, cache, optimistic updates)
  +-- NO --> State needs to persist in URL?
        +-- YES --> nuqs (shareable, bookmarkable)
        +-- NO --> State shared across components?
              +-- YES --> Zustand (lightweight global store)
              +-- NO --> useState (local)
```

**Key insight:** TanStack Query reduces network requests by 40-60% vs Redux for same features. Redux is only for existing legacy projects.

---

## 5. Testing Pyramid

```
           /\
          /  \
         / E2E \         ~10% -- Playwright
        /________\       Critical user flows only
       /          \
      / Integration \    ~30% -- Vitest + MSW
     /______________\    API + components with data
    /                \
   /     Unit Tests   \  ~60% -- Vitest
  /____________________\ Domain logic, utils, hooks
```

### Stack

| Layer | Tool | Target |
|-------|------|--------|
| Unit | **Vitest** | Pure functions, hooks, utils, domain logic |
| Component | **Vitest + Testing Library** | React components with interaction |
| Integration | **Vitest + MSW** | API integration with HTTP mocks |
| E2E | **Playwright** | Critical flows in real browser |
| Visual | **Storybook + Chromatic** | Component visual regression |

### What to Test at Each Layer

| Layer | DO Test | DO NOT Test |
|-------|---------|-------------|
| Unit | Domain logic, calculations, validations, transformations | UI rendering, API calls, database |
| Component | User interaction, conditional rendering, accessibility | API responses, business logic |
| Integration | API contract, data flow, error handling | Visual layout, pixel-perfect |
| E2E | Happy path flows, critical business paths | Edge cases (cover in unit/integration) |

### MSW Reuse Pattern

The same MSW handlers can be shared across Vitest, Playwright, Storybook, and React Native -- define once, reuse everywhere.

---

## 6. Next.js App Router Patterns

### Server-Client Boundary

**Rule:** Everything is a Server Component by default. Add `'use client'` only when needed.

```
Server Components (default)     Client Components ('use client')
- DB access, file system        - useState, useEffect, hooks
- Env vars, secrets             - Browser APIs (window, document)
- Zero JS to browser            - Event handlers (onClick, etc.)
- async/await in render         - Third-party client libs
```

### Recommended Folder Structure

```
app/
  (auth)/                      # Route group -- auth pages
    login/page.tsx
    register/page.tsx
    layout.tsx
  (dashboard)/                 # Route group -- app pages
    dashboard/page.tsx
    settings/page.tsx
    layout.tsx
  api/
    webhooks/stripe/route.ts   # Webhook handlers
  layout.tsx                   # Root layout
  error.tsx                    # Global error boundary
  loading.tsx                  # Global loading
  not-found.tsx

src/
  components/
    ui/                        # Design system (Button, Input, Card)
    features/                  # Feature-specific components
    layouts/                   # Layout components
  lib/
    actions/                   # Server Actions
    db/                        # Database client, queries
    auth/                      # Auth utilities
    validations/               # Zod schemas (shared client/server)
  hooks/                       # Custom hooks
  types/                       # TypeScript types
  utils/                       # Pure utility functions
```

### Rendering Strategy Decision

```
Data changes per user?
  +-- NO --> Data changes rarely?
  |     +-- YES --> SSG (build time)
  |     +-- NO --> ISR (revalidate: N seconds)
  +-- YES --> Data is time-sensitive?
        +-- YES --> SSR (force-dynamic)
        +-- NO --> ISR + client-side fetching
```

---

## 7. Performance Optimization Checklist

### Core Web Vitals Targets

| Metric | Target | What It Measures |
|--------|--------|-----------------|
| **LCP** | < 2.5s | Largest visible element load time |
| **INP** | < 200ms | Interaction responsiveness |
| **CLS** | < 0.1 | Visual stability (layout shifts) |

### Pre-Deploy Checklist

**Bundle:**
- [ ] Route-based code splitting (automatic in Next.js)
- [ ] `dynamic()` import for heavy components (charts, editors, maps)
- [ ] Tree-shaking: named imports only (`import { debounce } from 'lodash-es'`)
- [ ] No barrel file re-exports in large libraries

**Images:**
- [ ] `next/image` with `priority` on LCP image
- [ ] `sizes` attribute set for responsive images
- [ ] WebP/AVIF format (automatic with next/image)

**Fonts:**
- [ ] `next/font` for zero layout shift font loading
- [ ] `display: 'swap'` for text visibility during load

**Data:**
- [ ] TanStack Query with appropriate `staleTime` (avoid over-fetching)
- [ ] Server Components for initial data (zero client JS)
- [ ] Streaming/Suspense for progressive loading

**Rendering:**
- [ ] Static pages use SSG/ISR (not SSR)
- [ ] `loading.tsx` for instant navigation feedback
- [ ] Prefetching enabled on navigation links

**Accessibility:**
- [ ] Semantic HTML first, ARIA only when needed
- [ ] Keyboard navigation works for all interactive elements
- [ ] Touch targets minimum 44x44px (WCAG 2.2)
- [ ] `prefers-reduced-motion` media query respects user preference
- [ ] Color contrast ratio >= 4.5:1 for normal text

---

## 8. API Design Decision

```
Full-stack TypeScript monorepo?
  +-- YES --> tRPC (end-to-end type safety, zero codegen)
  +-- NO --> API is public / multi-language consumers?
        +-- YES --> REST + OpenAPI schema
        +-- NO --> Multiple clients with varied data needs?
              +-- YES --> GraphQL
              +-- NO --> REST (simplest)
```

**SINAPSE default:** tRPC for internal SaaS, REST for public APIs.

---

## 9. Cross-References

- Infrastructure scaling: see `infrastructure-decision-framework.md`
- Database patterns: see `database-scaling-patterns.md`
- Security pre-deploy: see `security-pre-deploy-checklist.md`
- Environment config: see `environment-deployment-patterns.md`
