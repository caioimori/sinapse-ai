---
name: component-check
description: Frontend component review guidelines — activates when touching React/JSX/TSX files
paths: ["*.tsx", "*.jsx", "components/**", "pages/**", "app/**/*.tsx", "app/**/*.jsx"]
allowed-tools: [Read, Grep, Glob]
user-invocable: false
---

# Frontend Component Review

When touching React components, follow these guidelines:

## Component Structure
- One component per file (exception: small internal sub-components)
- Props interface defined and exported: `export interface FeatureProps { ... }`
- Use functional components with hooks (never class components)
- Explicit return type on component: `function Feature(props: FeatureProps): JSX.Element`

## Naming
- Components: PascalCase (`UserProfile`)
- Files: kebab-case (`user-profile.tsx`)
- Hooks: `use` prefix (`useUserProfile`)
- Event handlers: `handle` prefix (`handleSubmit`)
- Boolean props: `is`/`has`/`should` prefix (`isLoading`, `hasError`)

## Imports
- Always use absolute imports: `import { Button } from '@/components/ui/button'`
- Never relative imports with `../../../`
- Order: React → external → UI → utils → stores → features → CSS

## Accessibility
- Interactive elements must be keyboard accessible
- Images need `alt` text
- Form inputs need associated labels
- Use semantic HTML (`nav`, `main`, `section`, `article`)

## Performance
- Memoize expensive computations: `useMemo`
- Memoize callbacks passed to children: `useCallback`
- Lazy load routes and heavy components: `React.lazy`
- Avoid inline object/array literals in JSX props (causes re-renders)

## State Management
- Local state for UI-only state (`useState`)
- Shared state via stores for cross-component state
- Server state via data fetching hooks (SWR, React Query, or similar)
- Never store derived state — compute it
