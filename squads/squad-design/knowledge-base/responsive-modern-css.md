# Knowledge Base: Responsive & Modern CSS

## Escopo
Referencia completa de CSS moderno e responsive design — media queries, container queries, fluid typography, grid, flexbox e CSS custom properties.

---

## 1. Responsive Design Foundations

### Mobile-First Approach
```css
/* Mobile first: base styles for smallest screens */
.card {
  padding: 16px;
  font-size: 14px;
}

/* Progressive enhancement for larger screens */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### Breakpoints (Tailwind v4)
| Nome | Min-width | Target |
|------|----------|--------|
| sm | 640px | Large phones (landscape) |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |
| 2xl | 1536px | Large desktops |

### Viewport Units
| Unit | Descricao | Uso |
|------|----------|-----|
| vw | 1% viewport width | Full-width elements |
| vh | 1% viewport height | Full-height sections |
| dvh | Dynamic viewport height | Mobile (accounts for toolbar) |
| svh | Small viewport height | Min height (toolbar visible) |
| lvh | Large viewport height | Max height (toolbar hidden) |
| vmin | Smaller of vw/vh | Responsive sizing |
| vmax | Larger of vw/vh | Background sizing |

---

## 2. Container Queries

### Definicao e Uso
```css
/* Define containment context */
.card-container {
  container-type: inline-size;
  container-name: card;
}

/* Query container size */
@container card (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 200px 1fr;
  }
}

@container card (min-width: 600px) {
  .card {
    grid-template-columns: 300px 1fr;
    gap: 24px;
  }
}
```

### Tailwind Container Queries
```html
<div class="@container">
  <div class="flex flex-col @md:flex-row @lg:grid @lg:grid-cols-3">
    <!-- Responsive to container, not viewport -->
  </div>
</div>
```

### Container vs Media Query
| Aspecto | Media Query | Container Query |
|---------|------------|----------------|
| Responde a | Viewport size | Container size |
| Scope | Global | Component-level |
| Reusability | Layout-dependent | Truly reusable |
| Nesting | N/A | Supported |
| Browser support | 100% | 93%+ |
| Uso ideal | Page layouts | Component patterns |

---

## 3. Fluid Typography

### clamp() Function
```css
/* clamp(minimum, preferred, maximum) */

/* Fluid heading */
h1 {
  font-size: clamp(2rem, 5vw + 1rem, 4rem);
  /* Min: 32px, Max: 64px, scales with viewport */
}

/* Fluid body text */
body {
  font-size: clamp(1rem, 0.5vw + 0.875rem, 1.125rem);
  /* Min: 16px, Max: 18px */
}
```

### Type Scale Fluid
| Step | Min (320px) | Max (1440px) | clamp() |
|------|------------|-------------|---------|
| xs | 12px | 12px | 0.75rem (fixed) |
| sm | 14px | 14px | 0.875rem (fixed) |
| base | 16px | 18px | clamp(1rem, 0.5vw + 0.875rem, 1.125rem) |
| lg | 18px | 20px | clamp(1.125rem, 0.5vw + 1rem, 1.25rem) |
| xl | 20px | 24px | clamp(1.25rem, 0.7vw + 1.05rem, 1.5rem) |
| 2xl | 24px | 30px | clamp(1.5rem, 1vw + 1.1rem, 1.875rem) |
| 3xl | 28px | 36px | clamp(1.75rem, 1.2vw + 1.35rem, 2.25rem) |
| 4xl | 32px | 48px | clamp(2rem, 2vw + 1.2rem, 3rem) |
| 5xl | 36px | 60px | clamp(2.25rem, 3vw + 1rem, 3.75rem) |

### Fluid Spacing
```css
:root {
  --space-sm: clamp(0.75rem, 0.5vw + 0.5rem, 1rem);
  --space-md: clamp(1rem, 1vw + 0.5rem, 1.5rem);
  --space-lg: clamp(1.5rem, 2vw + 0.5rem, 3rem);
  --space-xl: clamp(2rem, 4vw + 0.5rem, 5rem);
}
```

---

## 4. CSS Grid

### Grid Patterns
```css
/* Auto-fill responsive grid */
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

/* Fixed column grid */
.grid-12 {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 24px;
}

/* Content + sidebar */
.layout-sidebar {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
}

/* Holy grail layout */
.layout-page {
  display: grid;
  grid-template:
    "header header header" auto
    "sidebar main aside" 1fr
    "footer footer footer" auto
    / 200px 1fr 200px;
  min-height: 100dvh;
}
```

### Grid Utilities
```css
/* Responsive grid with auto-fit */
.responsive-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(min(100%, 300px), 1fr)
  );
  gap: var(--space-md);
}

/* Subgrid for alignment */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  display: grid;
  grid-template-rows: subgrid;
  grid-row: span 3; /* Title, content, footer */
}
```

---

## 5. Flexbox Patterns

### Common Layouts
```css
/* Center everything */
.center {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Space between header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Stack with gap */
.stack {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Wrap grid alternative */
.wrap-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.wrap-grid > * {
  flex: 1 1 300px; /* Grow, shrink, min-width */
}

/* Sidebar layout */
.with-sidebar {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}
.with-sidebar > :first-child {
  flex: 1 1 200px; /* Sidebar */
}
.with-sidebar > :last-child {
  flex: 999 1 60%; /* Main content */
}
```

---

## 6. CSS Custom Properties

### Theme System
```css
:root {
  /* Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f9fafb;
  --color-fg-primary: #111827;
  --color-fg-secondary: #6b7280;
  --color-action-primary: #3b82f6;
  --color-border: #e5e7eb;

  /* Typography */
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px rgb(0 0 0 / 0.07);
  --shadow-lg: 0 10px 15px rgb(0 0 0 / 0.1);
}

/* Dark mode */
[data-theme="dark"] {
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-fg-primary: #f1f5f9;
  --color-fg-secondary: #94a3b8;
  --color-action-primary: #60a5fa;
  --color-border: #334155;
}
```

### Component-Scoped Variables
```css
.button {
  --button-bg: var(--color-action-primary);
  --button-fg: white;
  --button-radius: var(--radius-md);
  --button-padding: var(--space-2) var(--space-4);

  background: var(--button-bg);
  color: var(--button-fg);
  border-radius: var(--button-radius);
  padding: var(--button-padding);
}

.button--secondary {
  --button-bg: transparent;
  --button-fg: var(--color-fg-primary);
}
```

---

## 7. Modern CSS Features

### :has() Selector
```css
/* Parent selector */
.card:has(.card-image) {
  grid-template-rows: auto 1fr auto;
}

/* Form validation */
.form-group:has(:invalid) {
  --input-border: var(--color-error);
}

/* Conditional layout */
.layout:has(aside) {
  grid-template-columns: 1fr 300px;
}
```

### Nesting
```css
.card {
  padding: 16px;
  border-radius: 8px;

  & .card-title {
    font-size: 1.25rem;
    font-weight: 600;
  }

  &:hover {
    box-shadow: var(--shadow-md);
  }

  @media (min-width: 768px) {
    padding: 24px;
  }
}
```

### Color Functions
```css
:root {
  --brand: oklch(60% 0.15 250);
  --brand-light: oklch(from var(--brand) calc(l + 0.2) c h);
  --brand-dark: oklch(from var(--brand) calc(l - 0.2) c h);
  --brand-muted: oklch(from var(--brand) l calc(c * 0.5) h);
}
```

### Logical Properties
```css
/* Physical (avoid) → Logical (prefer) */
margin-left → margin-inline-start
margin-right → margin-inline-end
margin-top → margin-block-start
padding-left → padding-inline-start
width → inline-size
height → block-size
border-left → border-inline-start
```

### Scroll Snap
```css
.carousel {
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  gap: 16px;
  scrollbar-width: none;
}

.carousel-item {
  scroll-snap-align: center;
  flex: 0 0 80%;
}
```

---

## 8. Tailwind CSS Patterns

### Responsive Utilities
```html
<!-- Stack on mobile, row on desktop -->
<div class="flex flex-col md:flex-row gap-4 md:gap-8">

<!-- Hide on mobile, show on desktop -->
<div class="hidden lg:block">

<!-- Full width mobile, constrained desktop -->
<div class="w-full max-w-4xl mx-auto px-4 md:px-8">

<!-- Responsive grid -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

### Dark Mode
```html
<!-- Manual toggle -->
<div class="bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">

<!-- System preference (default) -->
<!-- tailwind.config: darkMode: 'media' -->
```

### Component Patterns
```html
<!-- Card -->
<div class="rounded-lg border bg-card p-6 shadow-sm">

<!-- Button -->
<button class="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">

<!-- Input -->
<input class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
```

---

## 9. Accessibility in CSS

### Focus Styles
```css
/* Remove default, add custom */
:focus {
  outline: none;
}

:focus-visible {
  outline: 2px solid var(--color-action-primary);
  outline-offset: 2px;
}

/* High contrast mode */
@media (forced-colors: active) {
  :focus-visible {
    outline: 2px solid Highlight;
  }
}
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Screen Reader Only
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Show on focus (skip links) */
.sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  padding: 1rem;
  margin: 0;
  overflow: visible;
  clip: auto;
  white-space: normal;
}
```

### Contrast Preferences
```css
@media (prefers-contrast: more) {
  :root {
    --color-border: #000000;
    --shadow-sm: none;
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Dark mode overrides */
  }
}
```

---

## 10. CSS Architecture

### Layer Order (Cascade Layers)
```css
@layer reset, base, tokens, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
}

@layer base {
  body { font-family: var(--font-sans); }
}

@layer tokens {
  :root { --color-primary: #3b82f6; }
}

@layer components {
  .button { /* component styles */ }
}

@layer utilities {
  .sr-only { /* utility */ }
}
```

### Naming Strategies
| Estrategia | Exemplo | Uso |
|-----------|---------|-----|
| BEM | `.card__title--large` | Traditional CSS |
| Utility-first | `text-lg font-bold` | Tailwind |
| CSS Modules | `.title` → `.Card_title_x7f2` | Scoped CSS |
| CSS-in-JS | `styled.h2` | Runtime styling |

---

---

## 11. Fluid Typography — Utopia.fyi

**Utopia.fyi** (criado por James Gilyead e Trys Mudford) popularizou fluid type scales que interpolam suavemente entre breakpoints usando `clamp()`. Elimina media queries para tipografia.

### Conceito
```css
/* Tipografia fluida: interpola entre min e max baseado no viewport */
--font-size-body: clamp(1rem, 0.9rem + 0.45vw, 1.25rem);
/*                       min   preferido        max       */
/*                      16px  escala com vw    20px       */
```

**Utopia scale completa (ex: 320px → 1440px):**
```css
:root {
  --step--1: clamp(0.75rem, 0.72rem + 0.14vw, 0.8125rem);  /* ~12-13px */
  --step-0:  clamp(1rem, 0.9rem + 0.45vw, 1.25rem);        /* 16-20px body */
  --step-1:  clamp(1.2rem, 1.02rem + 0.86vw, 1.6625rem);   /* 19-27px */
  --step-2:  clamp(1.44rem, 1.14rem + 1.48vw, 2.215rem);   /* 23-35px */
  --step-3:  clamp(1.728rem, 1.25rem + 2.39vw, 2.95rem);   /* 28-47px */
  --step-4:  clamp(2.074rem, 1.33rem + 3.72vw, 3.934rem);  /* 33-63px */
  --step-5:  clamp(2.488rem, 1.38rem + 5.54vw, 5.245rem);  /* 40-84px */
}
```

**Ferramenta:** utopia.fyi — gera escalas fluid customizadas com preview interativo.

### Fluid Spacing (Utopia approach)
```css
:root {
  --space-3xs:  clamp(0.25rem, 0.22rem + 0.14vw, 0.3125rem); /* 4-5px */
  --space-2xs:  clamp(0.5rem, 0.45rem + 0.23vw, 0.625rem);   /* 8-10px */
  --space-xs:   clamp(0.75rem, 0.68rem + 0.36vw, 0.9375rem); /* 12-15px */
  --space-sm:   clamp(1rem, 0.9rem + 0.45vw, 1.25rem);       /* 16-20px */
  --space-md:   clamp(1.5rem, 1.36rem + 0.68vw, 1.875rem);   /* 24-30px */
  --space-lg:   clamp(2rem, 1.8rem + 0.91vw, 2.5rem);        /* 32-40px */
  --space-xl:   clamp(3rem, 2.73rem + 1.36vw, 3.75rem);      /* 48-60px */
  --space-2xl:  clamp(4rem, 3.64rem + 1.82vw, 5rem);         /* 64-80px */
  --space-3xl:  clamp(6rem, 5.45rem + 2.73vw, 7.5rem);       /* 96-120px */
}
```

---

## 12. Variable Fonts

Fontes variaveis (OpenType variable fonts) interpolam entre multiplos eixos com **um unico arquivo**. Transformacional para design systems.

### Eixos Comuns
| Eixo | Tag | Range Tipico | Efeito |
|------|-----|-------------|--------|
| Weight | `wght` | 100-900 | Espessura do traço |
| Width | `wdth` | 75-125% | Largura dos glifos |
| Slant | `slnt` | -15 a 0 | Inclinacao |
| Optical size | `opsz` | 8-144 | Ajuste para tamanho |
| Italic | `ital` | 0 ou 1 | On/off italic |

### Uso em CSS
```css
@font-face {
  font-family: 'Inter Variable';
  src: url('Inter-Variable.woff2') format('woff2-variations');
  font-weight: 100 900;      /* Range completo */
  font-display: swap;
}

/* Uso granular — pesos nao-padrao possiveis */
.body    { font-weight: 400; }
.medium  { font-weight: 500; }
.semibold{ font-weight: 600; }
.fine    { font-weight: 350; } /* Impossivel com fontes estaticas */
```

### Fontes Variaveis Populares para Interfaces
| Fonte | Criador | Uso |
|-------|---------|-----|
| **Inter Variable** | Rasmus Andersson | UI principal — mais usado em 2024-2026 |
| **Roboto Flex** | Google | Material Design |
| **Source Sans Variable** | Adobe | Open source |
| **Geist Variable** | Vercel | Developer/minimal |
| **Nu Sans Variable** | Blackletra/Nubank | Proprietary (Nubank) |

### Performance
Um unico arquivo `.woff2` substitui 9+ arquivos estaticos. Reducao tipica: 150KB → 35KB para uma familia completa.

---

## Referencias
- MDN Web Docs — CSS Reference — developer.mozilla.org/CSS
- web.dev — Learn CSS / Responsive Design — web.dev/learn/css
- Every Layout (Heydon Pickering & Andy Bell) — every-layout.dev
- Utopia.fyi — utopia.fyi (fluid type + space scales)
- Tailwind CSS Documentation — tailwindcss.com
- Inter Variable Font — rsms.me/inter
- CSS Tricks / Smashing Magazine
- Lea Verou — CSS Secrets (O'Reilly, 2015)
