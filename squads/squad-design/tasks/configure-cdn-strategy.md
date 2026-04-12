---
task: configure-cdn-strategy
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

# Task: Configure CDN Strategy

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Configurar estrategia de CDN — otimizar cache headers, edge locations, asset delivery e invalidation para minimizar latencia e maximizar cache hit ratio.

## Entrada
- Asset inventory (JS, CSS, fonts, images, media)
- Geographic distribution dos usuarios
- Performance budgets
- Infrastructure constraints
- Current TTFB metrics

## Passos

### 1. CDN Architecture
| Camada | O que cachear | TTL | Invalidation |
|--------|--------------|-----|-------------|
| Edge (CDN) | Static assets, images, fonts | Immutable (1yr) | Deploy-based |
| Edge (CDN) | HTML pages (SSG) | 60s + stale-while-revalidate | On-demand |
| Edge (CDN) | API responses | 0-60s | Tag-based |
| Origin | Dynamic HTML (SSR) | No cache | N/A |
| Browser | All cached assets | Per Cache-Control | Service Worker |

### 2. Cache-Control Headers
```yaml
cache_headers:
  # Hashed static assets (JS, CSS) — immutable
  immutable_assets:
    pattern: "/_next/static/**"
    header: "public, max-age=31536000, immutable"
    note: "Content-hash in filename = safe forever cache"

  # Images optimized by Next.js
  optimized_images:
    pattern: "/_next/image/**"
    header: "public, max-age=86400, stale-while-revalidate=604800"
    note: "1 day fresh, 7 days stale OK"

  # Web fonts (self-hosted)
  fonts:
    pattern: "/fonts/**"
    header: "public, max-age=31536000, immutable"
    note: "Fonts never change once deployed"

  # Static pages (SSG/ISR)
  static_pages:
    pattern: "/*.html"
    header: "public, max-age=60, stale-while-revalidate=86400"
    note: "1 min fresh, 1 day stale OK while revalidating"

  # API routes
  api_routes:
    pattern: "/api/**"
    header: "private, no-cache, no-store"
    note: "Never cache user-specific data at CDN"

  # Service Worker
  service_worker:
    pattern: "/sw.js"
    header: "public, max-age=0, must-revalidate"
    note: "Always check for updates"
```

### 3. Next.js Headers Configuration
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### 4. Edge Optimization Strategies
| Estrategia | Impacto | Implementacao |
|-----------|--------|--------------|
| Edge caching | Reduce TTFB 50-80% | CDN cache rules |
| Image optimization at edge | Reduce bandwidth 40% | CDN image transform |
| Compression (Brotli) | 15-20% smaller than gzip | CDN config |
| HTTP/3 | Faster connections | CDN feature flag |
| Early hints (103) | Preload critical resources | CDN/origin header |
| Edge functions | Dynamic at edge | Middleware/edge runtime |

### 5. Invalidation Strategy
| Trigger | Metodo | Scope | Latency |
|---------|--------|-------|---------|
| Deploy | Purge all + warm | Global | 30-60s |
| Content update | Purge by path | Specific URLs | 5-15s |
| ISR revalidation | On-demand revalidate | Single page | <1s (next request) |
| Emergency | Purge all | Global | 30-60s |
| Tag-based | Purge by tag | Related resources | 5-15s |

```typescript
// On-demand ISR revalidation
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: Request) {
  const { path, tag, secret } = await request.json();

  if (secret !== process.env.REVALIDATION_SECRET) {
    return Response.json({ error: 'Invalid secret' }, { status: 401 });
  }

  if (tag) {
    revalidateTag(tag);
    return Response.json({ revalidated: true, tag });
  }

  if (path) {
    revalidatePath(path);
    return Response.json({ revalidated: true, path });
  }
}
```

### 6. Performance Targets
| Metrica | Target | Medicao |
|---------|--------|---------|
| Cache Hit Ratio | >= 90% | CDN analytics |
| TTFB (cached) | < 100ms | RUM |
| TTFB (uncached) | < 800ms | RUM |
| Edge latency | < 50ms | CDN logs |
| Invalidation propagation | < 30s | Monitoring |
| Bandwidth savings | >= 60% | CDN vs origin |

### 7. CDN Monitoring
```yaml
monitoring:
  metrics:
    - cache_hit_ratio_by_content_type
    - origin_requests_per_minute
    - edge_response_time_p50_p95_p99
    - bandwidth_by_region
    - error_rate_by_status_code
    - ttfb_by_pop_location

  alerts:
    cache_hit_drop:
      condition: "cache_hit_ratio < 80%"
      severity: warning
      action: "Investigate cache config changes"

    origin_spike:
      condition: "origin_requests > 2x baseline"
      severity: critical
      action: "Check invalidation events, review cache headers"

    high_ttfb:
      condition: "ttfb_p95 > 1000ms"
      severity: warning
      action: "Check origin health, review SSR performance"
```

## Saida
- CDN configuration document
- Cache-Control headers specification
- Invalidation strategy
- Next.js headers configuration
- Performance targets and monitoring setup

## Validacao
- [ ] Cache-Control headers definidos por tipo de asset
- [ ] Static assets com immutable caching
- [ ] API routes sem cache publico
- [ ] Invalidation strategy documentada
- [ ] Cache hit ratio >= 90% target
- [ ] TTFB < 100ms para cached content
- [ ] Brotli compression habilitado
- [ ] Monitoring e alerts configurados
