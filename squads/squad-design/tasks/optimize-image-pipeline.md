---
task: optimize-image-pipeline
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

# Task: Optimize Image Pipeline

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Otimizar pipeline de imagens — configurar formatos modernos, responsive images, lazy loading e CDN para minimizar impacto no LCP e bandwidth.

## Entrada
- Image inventory
- Performance budgets
- Device targets
- CDN infrastructure

## Passos

### 1. Format Selection
| Formato | Quando | Savings |
|---------|--------|---------|
| AVIF | Default para photos | ~50% vs JPEG |
| WebP | Fallback de AVIF | ~30% vs JPEG |
| SVG | Icons, logos, illustrations | Smallest for vectors |
| JPEG | Fallback final | Baseline |
| PNG | Transparency necessaria (nao photo) | Quando alpha channel |

### 2. Next.js Image Component
```typescript
import Image from 'next/image';

// Hero image (LCP candidate) — priority
<Image
  src="/hero.jpg"
  alt="Hero description"
  width={1440}
  height={600}
  priority  // Preloads, no lazy
  sizes="100vw"
  quality={80}
/>

// Content image — lazy loaded (default)
<Image
  src="/feature.jpg"
  alt="Feature description"
  width={600}
  height={400}
  sizes="(max-width: 768px) 100vw, 50vw"
  quality={75}
/>
```

### 3. Responsive Image Sizes
```html
<!-- Sizes attribute guide -->
sizes="
  (max-width: 640px) 100vw,    <!-- Mobile: full width -->
  (max-width: 1024px) 50vw,    <!-- Tablet: half width -->
  33vw                          <!-- Desktop: third width -->
"
```

### 4. Image Budget Per Page
| Tipo de pagina | Budget total | Max por imagem |
|---------------|-------------|---------------|
| Landing Page | 500KB | 200KB (hero) |
| Content Page | 400KB | 150KB |
| Dashboard | 200KB | 100KB |
| Product Page | 600KB | 200KB (hero), 50KB (thumbs) |

### 5. Optimization Pipeline
```yaml
image_pipeline:
  input: "original uploaded image"

  steps:
    - resize: "Generate srcset variants (640, 768, 1024, 1280, 1920)"
    - format: "Convert to AVIF + WebP + fallback"
    - quality: "80 for AVIF, 75 for WebP, 80 for JPEG"
    - metadata: "Strip EXIF data"
    - compress: "Further lossy/lossless optimization"

  output:
    - "/images/{name}-640.avif"
    - "/images/{name}-640.webp"
    - "/images/{name}-1024.avif"
    # ... etc

  cdn:
    cache: "immutable, max-age=31536000"
    edge_optimization: true
```

### 6. Special Cases
| Caso | Tratamento |
|------|-----------|
| LCP image | `priority`, `fetchpriority="high"`, preload |
| Above-fold | Eager loading, preload |
| Below-fold | Default lazy loading |
| Background images | CSS `image-set()` or `<picture>` |
| User-uploaded | Server-side optimization on upload |
| Decorative | `alt=""`, optimize aggressively |

## Saida
- Image optimization pipeline config
- Format selection guide
- Responsive image patterns
- Budget enforcement per page
- CDN configuration

## Validacao
- [ ] AVIF/WebP serving configurado
- [ ] LCP image preloaded
- [ ] Responsive sizes attribute em todas as images
- [ ] Lazy loading default para below-fold
- [ ] Budget per page respeitado
- [ ] CDN caching configurado
