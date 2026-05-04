# Knowledge Base: Web Performance Reference

## Escopo
Referencia completa de web performance — Core Web Vitals, otimizacao de recursos, metricas, ferramentas e estrategias para sites rapidos.

---

## 1. Core Web Vitals

### Metricas Primarias (p75)
| Metrica | Good | Needs Improvement | Poor | Mede |
|---------|------|-------------------|------|------|
| LCP | < 2.5s | 2.5-4.0s | > 4.0s | Loading performance |
| INP | < 200ms | 200-500ms | > 500ms | Interactivity |
| CLS | < 0.1 | 0.1-0.25 | > 0.25 | Visual stability |

### Metricas Complementares
| Metrica | Target | Mede |
|---------|--------|------|
| FCP | < 1.8s | First content painted |
| TTFB | < 0.8s | Server response time |
| TBT | < 200ms | Main thread blocking |
| TTI | < 3.8s | Fully interactive |
| Speed Index | < 3.4s | Visual progress speed |

---

## 2. LCP — Largest Contentful Paint

### Elementos LCP Comuns
| Elemento | Otimizacao |
|----------|-----------|
| `<img>` | priority, fetchpriority="high", preload |
| `<video>` poster | preload poster image |
| CSS background-image | Preload, use `<img>` instead |
| `<h1>` text block | Ensure font loads fast |
| `<svg>` inline | Optimize SVG size |

### Causas Comuns de LCP Lento
| Causa | Fix |
|-------|-----|
| Slow server response | CDN, edge caching, optimize TTFB |
| Render-blocking resources | Inline critical CSS, defer JS |
| Slow resource load | Preload, optimize images, CDN |
| Client-side rendering | SSR/SSG, streaming |
| Large images | AVIF/WebP, responsive images, compression |
| Web font blocking | font-display: swap, preload |
| Third-party scripts | Defer, lazy load |
| JavaScript execution | Code splitting, defer |

### LCP Optimization Checklist
```
- [ ] LCP element identified
- [ ] LCP image has priority/fetchpriority="high"
- [ ] LCP image preloaded in <head>
- [ ] No render-blocking CSS/JS before LCP
- [ ] TTFB < 800ms
- [ ] LCP image optimized (AVIF/WebP, proper size)
- [ ] Font loaded with font-display: swap
- [ ] No client-side rendering for LCP content
```

---

## 3. INP — Interaction to Next Paint

### Anatomy of Interaction
```
User Input → Input Delay → Processing → Presentation Delay → Next Paint
             (queued work)  (event handler) (rendering)
```

### Causas Comuns de INP Alto
| Causa | Fix |
|-------|-----|
| Long tasks (> 50ms) | Break into smaller tasks |
| Heavy event handlers | Debounce, throttle, yield |
| Layout thrashing | Batch DOM reads/writes |
| Large DOM | Virtualize long lists |
| Third-party scripts | Defer, web worker |
| Synchronous operations | Use async/requestIdleCallback |
| Hydration blocking | Progressive hydration, RSC |

### Optimization Techniques
```typescript
// Yield to main thread
function yieldToMain() {
  return new Promise(resolve => {
    setTimeout(resolve, 0);
  });
}

// Break long task into chunks
async function processItems(items: Item[]) {
  for (let i = 0; i < items.length; i++) {
    processItem(items[i]);

    // Yield every 5 items
    if (i % 5 === 0) {
      await yieldToMain();
    }
  }
}

// Use scheduler API (when available)
if ('scheduler' in window) {
  scheduler.postTask(() => {
    // Low-priority work
  }, { priority: 'background' });
}
```

---

## 4. CLS — Cumulative Layout Shift

### Causas Comuns
| Causa | Fix |
|-------|-----|
| Images sem dimensoes | width/height attributes |
| Ads/embeds sem espaco reservado | Aspect ratio container |
| Fonts causando reflow | font-display: swap + size-adjust |
| Dynamic content injection | Reserve space, skeleton |
| Animations changing layout | Use transform instead |
| Late-loading CSS | Inline critical CSS |

### Prevention Patterns
```html
<!-- Images: always set dimensions -->
<img src="photo.jpg" width="800" height="600" alt="..." />

<!-- Aspect ratio for dynamic content -->
<div style="aspect-ratio: 16/9;">
  <iframe src="..."></iframe>
</div>

<!-- Reserve space for ads -->
<div style="min-height: 250px;">
  <!-- Ad will load here -->
</div>
```

```css
/* Font fallback size matching */
@font-face {
  font-family: 'Custom Font Fallback';
  src: local('Arial');
  ascent-override: 90%;
  descent-override: 22%;
  line-gap-override: 0%;
  size-adjust: 108%;
}
```

---

## 5. Resource Budgets

### Budget por Tipo
| Resource | Budget (gzipped) | Per |
|----------|-----------------|-----|
| Total JS (initial) | < 300KB | App |
| Per-route JS | < 100KB | Route |
| Total CSS | < 50KB | App |
| Critical CSS (inline) | < 14KB | Page |
| Web Fonts | < 100KB | App (all weights) |
| Single font file | < 25KB | File (WOFF2) |
| Images per page | < 500KB | Page |
| Single image (hero) | < 200KB | Image |
| Third-party total | < 50KB | App |

### Budget por Tipo de Pagina
| Tipo | JS | CSS | LCP | Total Weight |
|------|-----|-----|-----|-------------|
| Landing Page | < 150KB | < 30KB | < 2.0s | < 800KB |
| Content Page | < 200KB | < 40KB | < 2.5s | < 1MB |
| Dashboard | < 350KB | < 60KB | < 3.0s | < 1.5MB |
| Auth Page | < 100KB | < 20KB | < 1.5s | < 500KB |
| E-commerce PDP | < 250KB | < 50KB | < 2.5s | < 1.2MB |

---

## 6. Image Optimization

### Format Selection
| Formato | Compression | Transparency | Animation | Browser Support |
|---------|-----------|-------------|-----------|---------------|
| AVIF | Best (~50% vs JPEG) | Yes | Yes | 93%+ |
| WebP | Great (~30% vs JPEG) | Yes | Yes | 97%+ |
| JPEG | Baseline | No | No | 100% |
| PNG | Lossless | Yes | No | 100% |
| SVG | Vector | Yes | Yes | 100% |

### Next.js Image Best Practices
```typescript
// LCP candidate — priority
<Image src="/hero.jpg" alt="" width={1440} height={600}
  priority sizes="100vw" quality={80} />

// Content image — lazy
<Image src="/feature.jpg" alt="" width={600} height={400}
  sizes="(max-width: 768px) 100vw, 50vw" quality={75} />

// Decorative — aggressive compression
<Image src="/bg-pattern.jpg" alt="" fill
  quality={60} className="object-cover" />
```

---

## 7. JavaScript Optimization

### Code Splitting Strategies
| Estrategia | Como | Quando |
|-----------|------|--------|
| Route-based | Next.js App Router (automatic) | Default |
| Component-based | dynamic(() => import()) | Heavy components |
| Conditional | dynamic + ssr: false | Admin panels, charts |
| Library-based | Separate chunk for heavy libs | date-fns, chart.js |

### Tree Shaking
```typescript
// GOOD — treeshakeable
import { format } from 'date-fns';

// BAD — imports everything
import * as dateFns from 'date-fns';

// GOOD — named import from barrel
import { Button } from '@/components/ui';

// BAD — deep import when barrel re-exports all
import { Button } from '@/components/ui/button';
// (Only needed if barrel file has side effects)
```

### Heavy Libraries Alternatives
| Library | Size | Alternative | Alt Size | Savings |
|---------|------|------------|----------|---------|
| moment.js | 72KB | date-fns | 7KB (tree-shaken) | -65KB |
| lodash | 72KB | lodash-es (individual) | 2-5KB | -67KB |
| chart.js | 65KB | Lazy load | 0KB initial | -65KB |
| axios | 13KB | fetch (native) | 0KB | -13KB |

---

## 8. Caching Strategy

### Cache-Control Headers
| Asset Type | Header | TTL |
|-----------|--------|-----|
| Hashed JS/CSS | `immutable, max-age=31536000` | 1 year |
| Fonts | `immutable, max-age=31536000` | 1 year |
| Images (static) | `max-age=86400, stale-while-revalidate=604800` | 1d + 7d stale |
| HTML (SSG) | `max-age=60, stale-while-revalidate=86400` | 1m + 1d stale |
| HTML (SSR) | `no-cache` or `max-age=0, must-revalidate` | None |
| API (public) | `max-age=60` | 1 min |
| API (private) | `private, no-store` | None |

---

## 9. Performance Tools

### Lab Tools
| Ferramenta | Tipo | Uso |
|-----------|------|-----|
| Lighthouse | Audit | CI gate, dev audit |
| WebPageTest | Waterfall | Deep analysis |
| Chrome DevTools Performance | Profiling | JavaScript profiling |
| Chrome DevTools Network | Waterfall | Request analysis |
| Chrome DevTools Coverage | Usage | Dead code detection |
| Bundle Analyzer | Visualization | Bundle composition |

### Field Tools (RUM)
| Ferramenta | Tipo | Uso |
|-----------|------|-----|
| CrUX (Chrome UX Report) | Public dataset | Real user data (28-day) |
| Vercel Speed Insights | Built-in | Next.js projects |
| web-vitals library | Collection | Custom RUM |
| Google Search Console | CWV | SEO impact tracking |

### CI Integration
| Ferramenta | Gate | Automation |
|-----------|------|-----------|
| Lighthouse CI | Score >= 90 | GitHub Actions |
| size-limit | Bundle budget | PR check |
| Bundlesize | Per-file budget | PR check |
| Chromatic | Visual regression | PR check |

---

## 10. Performance Checklist

### Pre-Launch
```
Critical Path:
- [ ] TTFB < 800ms
- [ ] FCP < 1.8s
- [ ] LCP < 2.5s
- [ ] INP < 200ms
- [ ] CLS < 0.1
- [ ] Lighthouse Performance >= 90

Resources:
- [ ] JS < 300KB gzipped (initial)
- [ ] CSS < 50KB gzipped
- [ ] Fonts < 100KB (WOFF2, subset)
- [ ] Images optimized (AVIF/WebP)
- [ ] Third-party < 50KB

Loading:
- [ ] Critical CSS inlined
- [ ] No render-blocking JS
- [ ] LCP image preloaded
- [ ] Fonts with font-display: swap
- [ ] Code splitting per route
- [ ] Lazy loading for below-fold

Caching:
- [ ] Static assets: immutable
- [ ] CDN configured
- [ ] Service worker (if applicable)

Monitoring:
- [ ] RUM collecting CWV
- [ ] Alerts on regression
- [ ] CI gates enforcing budgets
```

---

---

## 11. Design System Performance

Design systems impactam diretamente Core Web Vitals dos produtos que os consomem.

### Impacto por Metrica
| Metrica CWV | Como o DS afeta | Otimizacao |
|-------------|----------------|------------|
| **LCP** | Componentes pesados atrasam render do elemento principal | Lazy loading, code-splitting |
| **INP** | Event handlers lentos em componentes complexos | Otimizar renders, evitar re-renders |
| **CLS** | Componentes sem dimensoes explicitas (Skeleton vs sem nada) | Skeleton loaders, aspect-ratio, dimensoes fixas |

### Bundle Size por Componente (Targets)
| Tipo | Target gzipped | Ferramenta de verificacao |
|------|---------------|--------------------------|
| Atom (Button, Badge, Icon) | < 3KB | size-limit, bundlephobia |
| Molecule (Form Field, Card) | < 8KB | size-limit |
| Organism (Table, Modal, DatePicker) | < 20KB | size-limit |
| Bundle completo (index.js) | < 50KB | size-limit |

### Tree-Shaking (Obrigatorio para DS)

Para que tree-shaking funcione, o pacote deve:

**1. ESM exports:**
```json
// package.json
{
  "name": "@mylib/components",
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.cjs"
    },
    "./button": {
      "import": "./dist/button.mjs"
    },
    "./modal": {
      "import": "./dist/modal.mjs"
    }
  }
}
```

**2. sideEffects: false** — declara que modulos nao tem efeitos colaterais

**3. Per-component exports:**
```tsx
// Tree-shakeable — bundler inclui apenas Button
import { Button } from '@mylib/components';

// Ou explicitamente:
import { Button } from '@mylib/components/button';
```

### size-limit Configuration
```json
// package.json
{
  "size-limit": [
    { "path": "dist/index.mjs", "limit": "50 KB", "gzip": true },
    { "path": "dist/button.mjs", "limit": "3 KB", "gzip": true },
    { "path": "dist/modal.mjs", "limit": "8 KB", "gzip": true },
    { "path": "dist/data-table.mjs", "limit": "20 KB", "gzip": true }
  ]
}
```

```yaml
# .github/workflows/size-check.yml
- name: Check bundle size
  run: npx size-limit
```

### React DevTools Profiler
Para identificar re-renders desnecessarios em componentes:
```typescript
import { useCallback, useMemo } from 'react';

// Anti-pattern: nova funcao a cada render
<Button onClick={() => handleClick(id)} />

// Correto: funcao memoizada
const handleClickMemo = useCallback(() => handleClick(id), [id, handleClick]);
<Button onClick={handleClickMemo} />
```

**why-did-you-render** (biblioteca de debug):
```typescript
// index.tsx — dev only
if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  whyDidYouRender(React, { trackAllPureComponents: true });
}
```

### CLS em Design Systems — Skeleton Patterns
```tsx
// Anti-pattern: sem reservar espaco
{isLoading ? null : <UserCard user={user} />}

// Correto: skeleton com mesmas dimensoes
{isLoading ? <UserCardSkeleton /> : <UserCard user={user} />}

// Skeleton implementation
function UserCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 w-12 rounded-full bg-gray-200" />  {/* Avatar */}
      <div className="mt-2 h-4 w-32 rounded bg-gray-200" />  {/* Name */}
      <div className="mt-1 h-3 w-24 rounded bg-gray-200" />  {/* Role */}
    </div>
  );
}
```

---

## Referencias
- web.dev/performance (Google)
- Core Web Vitals documentation — web.dev/vitals
- Next.js Performance documentation — nextjs.org/docs/app/building-your-application/optimizing
- HTTP Archive — Web Almanac — httparchive.org/reports
- Calibre Performance Blog — calibreapp.com/blog
- bundlephobia.com — verifica custo de dependencias
- size-limit — github.com/ai/size-limit
