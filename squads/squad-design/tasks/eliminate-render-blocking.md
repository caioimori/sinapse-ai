---
task: eliminate-render-blocking
responsavel: "@dx-performance-engineer"
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

# Task: Eliminate Render-Blocking Resources

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Eliminar recursos render-blocking — identificar e otimizar CSS, JS e fonts que bloqueiam a renderizacao inicial, melhorando FCP e LCP.

## Entrada
- Lighthouse audit (render-blocking resources)
- Current resource loading waterfall
- Critical rendering path analysis
- Performance budgets

## Passos

### 1. Identificar Render-Blocking Resources
| Tipo | Blocking por default? | Solucao |
|------|--------------------|---------|
| `<link rel="stylesheet">` | SIM | Inline critical + async rest |
| `<script>` (head, sem async/defer) | SIM | Move to body / async / defer |
| `<script type="module">` | SIM (deferred) | Already deferred, OK |
| `@import` em CSS | SIM (serial) | Remover, usar `<link>` |
| Web fonts (CSS) | SIM (FOIT) | font-display: swap + preload |
| `<link rel="preload">` | NAO | Ja otimizado |

### 2. Critical Rendering Path Optimization
```yaml
critical_rendering_path:
  target: "FCP < 1.8s on 4G"

  phase_1_html:
    size: "< 14KB (first TCP roundtrip)"
    contains:
      - "Inline critical CSS"
      - "Preload hints for fonts and LCP image"
      - "Async/defer script tags"
      - "Meta tags and critical <head> content"

  phase_2_critical_resources:
    resources:
      - type: "Critical CSS"
        delivery: "Inline in <head>"
        budget: "< 14KB"
      - type: "Web fonts"
        delivery: "preload + font-display: swap"
        budget: "< 100KB total"
      - type: "LCP image"
        delivery: "preload with fetchpriority=high"
        budget: "< 200KB"

  phase_3_deferred:
    resources:
      - type: "Non-critical CSS"
        delivery: "media=print trick or rel=preload"
      - type: "JavaScript bundles"
        delivery: "defer or dynamic import"
      - type: "Below-fold images"
        delivery: "loading=lazy"
      - type: "Third-party scripts"
        delivery: "afterInteractive or lazyOnload"
```

### 3. CSS Optimization
```html
<!-- BEFORE: Render-blocking -->
<link rel="stylesheet" href="/styles.css" />

<!-- AFTER: Non-blocking with critical inline -->
<head>
  <!-- Critical CSS inline (~14KB max) -->
  <style>
    /* Above-fold styles extracted at build time */
    :root { --font-sans: 'Inter', system-ui, sans-serif; }
    body { margin: 0; font-family: var(--font-sans); }
    .header { /* critical header styles */ }
    .hero { /* critical hero styles */ }
  </style>

  <!-- Non-critical CSS loaded async -->
  <link
    rel="preload"
    href="/styles.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
  <noscript>
    <link rel="stylesheet" href="/styles.css" />
  </noscript>
</head>
```

### 4. JavaScript Optimization
```html
<!-- BEFORE: Render-blocking -->
<head>
  <script src="/analytics.js"></script>
  <script src="/app.js"></script>
</head>

<!-- AFTER: Non-blocking -->
<head>
  <!-- Critical inline JS (minimal, if any) -->
  <script>
    // Only truly critical JS (~1KB max)
    // e.g., theme detection to prevent flash
    document.documentElement.classList.add(
      localStorage.getItem('theme') || 'light'
    );
  </script>
</head>
<body>
  <!-- Content renders first -->

  <!-- Scripts load without blocking -->
  <script src="/app.js" defer></script>
  <script src="/analytics.js" async></script>
</body>
```

### 5. Font Loading Optimization
```html
<!-- Preload critical font files -->
<link
  rel="preload"
  href="/fonts/inter-var-latin.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>

<!-- Font-face with swap -->
<style>
  @font-face {
    font-family: 'Inter';
    src: url('/fonts/inter-var-latin.woff2') format('woff2');
    font-weight: 100 900;
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC;
  }
</style>
```

### 6. Resource Hints Strategy
```html
<head>
  <!-- DNS prefetch for third-party domains -->
  <link rel="dns-prefetch" href="//cdn.example.com" />
  <link rel="dns-prefetch" href="//fonts.googleapis.com" />

  <!-- Preconnect for critical third-party -->
  <link rel="preconnect" href="https://cdn.example.com" crossorigin />

  <!-- Preload critical resources -->
  <link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin />
  <link rel="preload" href="/hero.avif" as="image" type="image/avif" fetchpriority="high" />

  <!-- Prefetch next likely navigation -->
  <link rel="prefetch" href="/dashboard" />

  <!-- Module preload for critical JS -->
  <link rel="modulepreload" href="/_next/static/chunks/main.js" />
</head>
```

### 7. Priority Hints
| Resource | fetchpriority | Razao |
|----------|--------------|-------|
| LCP image | high | Fastest possible load |
| Above-fold images | high | Visible immediately |
| Below-fold images | low | Not immediately needed |
| Critical CSS | high | Render-blocking by nature |
| Async scripts | low | Non-critical |
| Preloaded fonts | high | Prevent FOUT |

```html
<!-- LCP image with priority hint -->
<img
  src="/hero.avif"
  alt="Hero"
  width="1440"
  height="600"
  fetchpriority="high"
  loading="eager"
/>

<!-- Below-fold image -->
<img
  src="/feature.avif"
  alt="Feature"
  width="600"
  height="400"
  fetchpriority="low"
  loading="lazy"
/>
```

### 8. Audit Checklist
| Check | Tool | Target |
|-------|------|--------|
| Zero render-blocking CSS | Lighthouse | 0 blocking stylesheets |
| Zero render-blocking JS | Lighthouse | 0 blocking scripts |
| Critical CSS inlined | Manual/build | < 14KB inline |
| Fonts preloaded | Lighthouse | All critical fonts |
| LCP image preloaded | Lighthouse | fetchpriority=high |
| No CSS @import | Manual | 0 @import rules |
| No sync scripts in head | Manual | 0 (except critical inline) |
| Resource hints configured | Manual | dns-prefetch, preconnect |

## Saida
- Render-blocking audit report
- Critical rendering path optimization
- CSS/JS/Font loading strategies
- Resource hints configuration
- Priority hints implementation

## Validacao
- [ ] Zero render-blocking stylesheets (Lighthouse)
- [ ] Zero render-blocking scripts (Lighthouse)
- [ ] Critical CSS inlined (< 14KB)
- [ ] Non-critical CSS loaded async
- [ ] Scripts com defer ou async
- [ ] Fonts com font-display: swap
- [ ] LCP image preloaded
- [ ] Resource hints configurados
- [ ] FCP < 1.8s verificado
