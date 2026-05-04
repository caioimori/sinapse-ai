---
task: govern-third-party-scripts
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

# Task: Govern Third-Party Scripts

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Governar scripts de terceiros — auditar, classificar, controlar carregamento e monitorar impacto de scripts externos para manter performance dentro do budget.

## Entrada
- Current third-party script inventory
- Performance budgets (third-party < 50KB)
- Business requirements per script
- Privacy/compliance requirements

## Passos

### 1. Script Audit e Classificacao
| Categoria | Prioridade | Exemplos | Loading Strategy |
|-----------|-----------|----------|-----------------|
| Essential | P0 - Required | Auth SDK, payment gateway | Sync (head) |
| Analytics | P1 - Important | GA4, Mixpanel | Async (after LCP) |
| Marketing | P2 - Nice-to-have | Pixel, tag manager | Defer (idle) |
| Social | P3 - Optional | Share widgets, embeds | Lazy (interaction) |
| Support | P2 - Important | Chat widget, help center | Lazy (timer/scroll) |
| A/B Testing | P1 - Important | Optimizely, LaunchDarkly | Async (early) |
| Monitoring | P1 - Important | Sentry, DataDog | Async (after LCP) |

### 2. Script Inventory Template
```yaml
third_party_inventory:
  - name: "Google Analytics 4"
    category: analytics
    priority: P1
    size_gzipped: "28KB"
    loading: async
    trigger: "after LCP"
    domains:
      - "www.googletagmanager.com"
      - "www.google-analytics.com"
    business_owner: "Marketing"
    privacy_impact: "high"
    consent_required: true
    alternative: null
    last_reviewed: "2024-01-15"
    verdict: "APPROVED"

  - name: "Intercom"
    category: support
    priority: P2
    size_gzipped: "85KB"
    loading: lazy
    trigger: "30s timer OR scroll 50%"
    domains:
      - "widget.intercom.io"
      - "js.intercomcdn.com"
    business_owner: "Customer Success"
    privacy_impact: "medium"
    consent_required: true
    alternative: "Crisp (12KB)"
    last_reviewed: "2024-01-15"
    verdict: "CONDITIONAL — exceeds budget, load lazy only"
```

### 3. Loading Strategies
```typescript
// 1. Essential — sync in head (minimize)
// Only for scripts that MUST block rendering
// Target: 0 scripts in this category

// 2. Async after LCP — analytics, monitoring
export function loadAfterLCP(src: string) {
  if (typeof window === 'undefined') return;

  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    if (entries.length > 0) {
      observer.disconnect();
      loadScript(src, { async: true });
    }
  });
  observer.observe({ type: 'largest-contentful-paint', buffered: true });

  // Fallback: load after 5s regardless
  setTimeout(() => {
    observer.disconnect();
    loadScript(src, { async: true });
  }, 5000);
}

// 3. Idle loading — marketing, non-critical
export function loadOnIdle(src: string) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => loadScript(src, { async: true }));
  } else {
    setTimeout(() => loadScript(src, { async: true }), 2000);
  }
}

// 4. Interaction-based — chat widgets, social
export function loadOnInteraction(
  src: string,
  triggers: ('scroll' | 'click' | 'mousemove' | 'timer')[]
) {
  let loaded = false;

  const load = () => {
    if (loaded) return;
    loaded = true;
    loadScript(src, { async: true });
    cleanup();
  };

  const cleanup = () => {
    triggers.forEach((trigger) => {
      if (trigger === 'timer') return;
      document.removeEventListener(trigger, load);
    });
  };

  triggers.forEach((trigger) => {
    if (trigger === 'timer') {
      setTimeout(load, 30000);
    } else {
      document.addEventListener(trigger, load, { once: true, passive: true });
    }
  });
}

// Base loader
function loadScript(
  src: string,
  opts: { async?: boolean; defer?: boolean }
) {
  const script = document.createElement('script');
  script.src = src;
  if (opts.async) script.async = true;
  if (opts.defer) script.defer = true;
  document.body.appendChild(script);
}
```

### 4. Next.js Script Component
```tsx
import Script from 'next/script';

// Analytics — after interactive
<Script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
  strategy="afterInteractive"
/>

// Chat widget — lazy on interaction
<Script
  src="https://widget.intercom.io/widget/xxxxx"
  strategy="lazyOnload"
/>

// Worker strategy — off main thread
<Script
  src="https://example.com/heavy-analytics.js"
  strategy="worker"
/>
```

### 5. Budget Enforcement
| Metrica | Budget | Enforcement |
|---------|--------|------------|
| Total third-party JS | < 50KB gzipped | CI gate blocking |
| Third-party requests (initial) | <= 5 | CI gate warning |
| Third-party domains | <= 3 | DNS lookup budget |
| Main thread impact | < 100ms TBT contribution | Performance audit |
| Third-party CLS | 0 | Lighthouse check |

### 6. Governance Process
| Situacao | Processo |
|----------|---------|
| New script request | Business justification → size audit → loading strategy → Apex approval |
| Script exceeds budget | Find alternative OR justify exception OR offset elsewhere |
| Quarterly review | Re-audit all scripts, remove unused, update loading strategies |
| Script causing issues | Immediate disable → investigate → fix or replace |
| Consent change | Update consent manager → test all script loading paths |

### 7. Monitoring Third-Party Impact
```yaml
monitoring:
  metrics:
    - third_party_total_size
    - third_party_request_count
    - third_party_main_thread_time
    - third_party_tbt_contribution
    - third_party_cls_contribution
    - third_party_error_rate

  tools:
    - name: "Lighthouse third-party audit"
      frequency: "every PR"
      report: "resource-summary:third-party:size"
    - name: "Chrome DevTools Network"
      frequency: "manual audit"
      filter: "third-party domain"
    - name: "WebPageTest"
      frequency: "weekly"
      view: "third-party breakdown"

  alerts:
    budget_exceeded:
      condition: "third_party_size > 50KB"
      action: "Block PR, require Apex review"
    performance_regression:
      condition: "third_party_tbt > 100ms"
      action: "Alert, review loading strategy"
```

## Saida
- Third-party script inventory
- Loading strategy per script category
- Next.js Script component patterns
- Budget enforcement configuration
- Governance process documentation
- Monitoring setup

## Validacao
- [ ] Inventario completo de scripts terceiros
- [ ] Classificacao por categoria e prioridade
- [ ] Loading strategy definida por script
- [ ] Total < 50KB gzipped enforced
- [ ] Requests iniciais <= 5
- [ ] Governance process documentado
- [ ] Consent integration verificada
- [ ] Monitoring e alerts configurados
- [ ] Quarterly review agendado
