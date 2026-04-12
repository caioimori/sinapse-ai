---
task: security-dashboard-design
responsavel: "soc-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: audience
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["soc-analysts", "management", "executive", "multi-tier"]
  - campo: data_sources
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: platform
    tipo: text
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: dashboard_specification
    tipo: document
    destino: "soc-analyst team, stakeholders"

Checklist:
  - "[ ] Define audience and key questions"
  - "[ ] Identify data sources and metrics"
  - "[ ] Design layout and visualizations"
  - "[ ] Define refresh rates and alerting"
  - "[ ] Create drill-down paths"
  - "[ ] Document KPIs and thresholds"
  - "[ ] Validate with target audience"
  - "[ ] Plan maintenance and updates"
---

# Task: Security Monitoring Dashboard Design

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Sentinel (soc-analyst)
- **Complexity:** Standard

## Objective

Design security monitoring dashboards tailored to specific audiences (SOC analysts, management, executives) that provide actionable visibility into security posture, threat activity, and operational metrics. Each dashboard answers key security questions at the appropriate abstraction level.

## Pre-Conditions

- Data sources available and ingested into analytics platform
- Understanding of audience information needs
- Visualization platform selected (Splunk, Grafana, Kibana, Power BI)
- Security metrics framework defined

## Inputs

- Target audience (SOC analysts, management, executive, multi-tier)
- Available data sources (SIEM, EDR, vulnerability scanner, cloud, identity)
- Visualization platform
- Key questions the dashboard must answer
- Refresh rate requirements

## Steps

### 1. Define Audience and Key Questions
Map each audience to their critical questions:

**SOC Analysts:**
- What alerts need immediate attention?
- What is the current threat activity level?
- Are there any active incidents?
- Which assets are most at risk right now?

**Management:**
- What is our security posture trend?
- Are we meeting SLA targets?
- Where are our biggest risk gaps?
- How efficient is our SOC operation?

**Executives:**
- Are we secure? (overall risk score)
- What has changed since last report?
- How do we compare to industry benchmarks?
- Where should we invest next?

### 2. Select Key Performance Indicators (KPIs)
Define metrics for each audience tier:

| KPI | Audience | Source | Threshold |
|-----|----------|--------|-----------|
| Open Critical Alerts | SOC | SIEM | Red if > 0 |
| Mean Time to Detect (MTTD) | Management | SIEM/SOAR | < 1 hour |
| Mean Time to Respond (MTTR) | Management | SOAR/tickets | < 4 hours |
| Vulnerability Coverage | Management | Scanner | > 95% |
| Overall Risk Score | Executive | Composite | Trending down |
| Compliance Posture | Executive | GRC tool | > 90% |
| Incidents This Month | Executive | Incident tracker | Trending down |

### 3. Design SOC Operational Dashboard
Real-time dashboard for daily operations:

**Panel Layout:**
| Position | Panel | Visualization | Refresh |
|----------|-------|--------------|---------|
| Top banner | Active incidents count | Counter | Real-time |
| Top left | Alert queue by severity | Stacked bar | 1 min |
| Top right | Alerts trend (24h) | Time series | 5 min |
| Middle left | Top triggered rules | Table | 5 min |
| Middle right | Geographic threat map | Map | 5 min |
| Bottom left | Asset risk heatmap | Heatmap | 15 min |
| Bottom right | Analyst workload | Bar chart | 5 min |

### 4. Design Management Dashboard
Weekly/monthly operational overview:

**Panel Layout:**
| Position | Panel | Visualization |
|----------|-------|--------------|
| Top | Security posture score | Gauge |
| Row 1 | MTTD/MTTR trends | Line chart |
| Row 2 | Alert volume and FP rate | Combo chart |
| Row 2 | SLA compliance | Progress bar |
| Row 3 | Vulnerability status | Donut chart |
| Row 3 | Top risk areas | Horizontal bar |
| Bottom | Key incidents summary | Table |

### 5. Design Executive Dashboard
High-level monthly/quarterly view:

**Panel Layout:**
| Position | Panel | Visualization |
|----------|-------|--------------|
| Top | Overall risk score with trend | Large gauge + sparkline |
| Row 1 | Incidents by category | Pie chart |
| Row 1 | Year-over-year comparison | Comparison chart |
| Row 2 | Compliance status by framework | Multi-gauge |
| Row 2 | Investment impact | Before/after |
| Bottom | Strategic recommendations | Text/Table |

### 6. Define Drill-Down Paths
Create interactive navigation between dashboard levels:
```
Executive Risk Score → Management Risk Breakdown → SOC Alert Details
Executive Incident Count → Management Incident List → SOC Investigation View
```

### 7. Configure Alerting and Thresholds
Set visual alerting thresholds:
| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| Open Critical Alerts | 0 | 1-2 | 3+ |
| MTTR | < 2h | 2-4h | > 4h |
| FP Rate | < 20% | 20-40% | > 40% |
| Patch Compliance | > 95% | 80-95% | < 80% |

### 8. Define Data Refresh Strategy
| Dashboard | Refresh Rate | Data Range | Caching |
|-----------|-------------|-----------|---------|
| SOC Operational | 1-5 minutes | 24-72 hours | Minimal |
| Management | 15-60 minutes | 30 days | Moderate |
| Executive | Daily | 90 days - 1 year | Heavy |

### 9. Create Dashboard Specification Document
Produce detailed specification for implementation:
- Panel definitions with exact queries
- Color schemes and visual standards
- Access control requirements per dashboard
- Mobile/responsive considerations
- Export and reporting capabilities

### 10. Validate and Iterate
Present mock-ups to target audiences:
- SOC team validates operational usefulness
- Management confirms strategic visibility
- Executives confirm clarity and actionability
- Incorporate feedback before implementation

## Output

```yaml
dashboard_specification:
  date: ""
  author: "Sentinel (soc-analyst)"

  dashboards:
    - name: ""
      audience: ""
      refresh_rate: ""
      panels:
        - title: ""
          visualization: ""
          data_source: ""
          query: ""
          thresholds: {}

  kpis: []
  drill_down_paths: []
  alerting_thresholds: {}
  access_control: {}
```

## Quality Criteria

- [ ] Dashboard designed for each target audience
- [ ] KPIs mapped to specific data sources
- [ ] Visual alerting thresholds defined
- [ ] Drill-down paths connect dashboard tiers
- [ ] Refresh rates appropriate for each audience
- [ ] Access control requirements specified
- [ ] Mock-ups validated with target audience
- [ ] Specification complete enough for implementation
