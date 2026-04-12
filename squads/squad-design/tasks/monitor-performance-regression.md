---
task: monitor-performance-regression
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

# Task: Monitor Performance Regression

## Metadata
- **Squad:** squad-design
- **Agent:** Apex (dx-performance-engineer)
- **Complexity:** Standard

## Objetivo
Monitorar regressoes de performance — configurar RUM, alertas automaticos e dashboards para detectar degradacoes antes que impactem usuarios.

## Entrada
- Performance budgets definidos
- Key pages to monitor
- User segments (device, geography, connection)
- Alerting channels (Slack, email)

## Passos

### 1. Monitoring Architecture
| Camada | Tipo | Frequencia | Cobertura |
|--------|------|-----------|----------|
| Lab | Lighthouse CI | Every PR | All key pages |
| Lab | WebPageTest | Daily scheduled | Homepage + top 5 pages |
| Synthetic | Scheduled checks | Every 5 min | Critical user flows |
| RUM | Real User Monitoring | Continuous | All page loads |
| Custom | Performance Observer | Continuous | Specific metrics |

### 2. Real User Monitoring (RUM)
```typescript
// lib/performance/rum.ts
export function initRUM() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  reportWebVitals({
    onLCP: (metric) => sendMetric('LCP', metric),
    onINP: (metric) => sendMetric('INP', metric),
    onCLS: (metric) => sendMetric('CLS', metric),
    onFCP: (metric) => sendMetric('FCP', metric),
    onTTFB: (metric) => sendMetric('TTFB', metric),
  });

  // Custom metrics
  observeLongTasks();
  observeResourceTiming();
  observeLayoutShifts();
}

function sendMetric(name: string, metric: Metric) {
  const payload = {
    name,
    value: metric.value,
    rating: metric.rating, // 'good' | 'needs-improvement' | 'poor'
    delta: metric.delta,
    id: metric.id,
    page: window.location.pathname,
    connection: getConnectionType(),
    device: getDeviceCategory(),
    timestamp: Date.now(),
  };

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/metrics', JSON.stringify(payload));
  }
}

function observeLongTasks() {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 50) {
        sendMetric('LongTask', {
          value: entry.duration,
          rating: entry.duration > 100 ? 'poor' : 'needs-improvement',
        });
      }
    }
  });
  observer.observe({ type: 'longtask', buffered: true });
}
```

### 3. Next.js Web Vitals Integration
```typescript
// app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
}

// Custom reportWebVitals
// pages/_app.tsx (pages router) or via web-vitals library
export function reportWebVitals(metric) {
  const { name, value, rating, id } = metric;

  // Send to analytics
  window.gtag?.('event', name, {
    event_category: 'Web Vitals',
    event_label: id,
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    non_interaction: true,
    metric_rating: rating,
  });
}
```

### 4. Alert Thresholds
| Metrica | Good | Warning | Critical | Action |
|---------|------|---------|----------|--------|
| LCP p75 | < 2.5s | 2.5-4.0s | > 4.0s | Investigate immediately |
| INP p75 | < 200ms | 200-500ms | > 500ms | Review interaction handlers |
| CLS p75 | < 0.1 | 0.1-0.25 | > 0.25 | Check layout stability |
| FCP p75 | < 1.8s | 1.8-3.0s | > 3.0s | Review critical path |
| TTFB p75 | < 0.8s | 0.8-1.8s | > 1.8s | Check server/CDN |
| Error rate | < 0.1% | 0.1-1% | > 1% | Check error logs |
| LongTask rate | < 5/page | 5-15/page | > 15/page | Profile main thread |

### 5. Dashboard Specification
```yaml
dashboard:
  name: "DX Performance Dashboard"

  sections:
    - name: "Core Web Vitals Overview"
      widgets:
        - type: gauge
          metrics: [LCP, INP, CLS]
          thresholds: [good, needs-improvement, poor]
          timeframe: "last 28 days"
          percentile: p75

    - name: "Performance Trends"
      widgets:
        - type: timeseries
          metrics: [LCP, FCP, TTFB, CLS, INP]
          timeframe: "last 90 days"
          granularity: daily
          percentile: p75

    - name: "Page-Level Breakdown"
      widgets:
        - type: table
          dimensions: [page_path]
          metrics: [LCP, INP, CLS, page_views]
          sort: "page_views DESC"
          limit: 20

    - name: "Device & Connection"
      widgets:
        - type: bar_chart
          dimension: device_category
          metrics: [LCP, INP]
        - type: bar_chart
          dimension: connection_type
          metrics: [LCP, TTFB]

    - name: "Geographic Distribution"
      widgets:
        - type: map
          dimension: country
          metric: LCP
          color_scale: [green, yellow, red]

    - name: "Regression Detection"
      widgets:
        - type: anomaly_detection
          metrics: [LCP, INP, CLS]
          sensitivity: medium
          baseline: "rolling 14-day average"
```

### 6. Regression Detection Logic
```yaml
regression_detection:
  algorithm: "statistical change detection"

  rules:
    sudden_regression:
      condition: "metric_p75 > baseline_p75 * 1.2"
      window: "1 hour"
      action: "alert_critical"
      description: "20%+ degradation within 1 hour"

    gradual_regression:
      condition: "7d_avg > 14d_avg * 1.1"
      window: "7 days"
      action: "alert_warning"
      description: "10%+ increase over 7-day trend"

    threshold_breach:
      condition: "metric_p75 crosses CWV threshold"
      example: "LCP p75 goes from 2.3s to 2.7s (crosses 2.5s)"
      action: "alert_critical"

    deploy_correlation:
      condition: "regression detected within 2h of deploy"
      action: "alert_critical + tag deploy SHA"
      description: "Correlate regression with specific deployment"

  notifications:
    critical:
      channels: ["slack:#dx-alerts", "pagerduty"]
      include: "metric, page, deploy SHA, comparison chart"
    warning:
      channels: ["slack:#dx-performance"]
      include: "metric, trend chart, suggested investigation"
```

### 7. Performance Review Cadence
| Frequencia | Atividade | Responsavel |
|-----------|----------|------------|
| Continuous | RUM collection + anomaly detection | Automated |
| Daily | Dashboard review (5 min scan) | Apex |
| Weekly | Performance report (top issues) | Apex |
| Bi-weekly | Deep-dive into top regression | DX Team |
| Monthly | Performance budget review | Nexus + Apex |
| Quarterly | Third-party audit + budget adjustment | Apex + stakeholders |

### 8. Incident Response
```yaml
incident_response:
  severity_levels:
    P0_critical:
      criteria: "CWV threshold breached for > 50% users"
      response_time: "< 30 min"
      actions:
        - "Identify deploy that caused regression"
        - "Rollback if necessary"
        - "Root cause analysis"
        - "Post-mortem within 48h"

    P1_major:
      criteria: "CWV warning threshold for > 25% users"
      response_time: "< 2 hours"
      actions:
        - "Identify affected pages and user segments"
        - "Create fix ticket with priority"
        - "Implement fix within current sprint"

    P2_minor:
      criteria: "Gradual regression detected"
      response_time: "< 1 business day"
      actions:
        - "Log in performance backlog"
        - "Schedule investigation"
        - "Monitor for escalation"
```

## Saida
- RUM implementation
- Dashboard specification
- Alert configuration
- Regression detection rules
- Incident response playbook
- Review cadence documentation

## Validacao
- [ ] RUM coletando CWV de usuarios reais
- [ ] Dashboard com all key metrics
- [ ] Alerts configurados por threshold
- [ ] Regression detection automatizado
- [ ] Deploy correlation funcionando
- [ ] Incident response process documentado
- [ ] Review cadence estabelecido
- [ ] Historical data retido >= 90 dias
