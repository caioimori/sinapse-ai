# Knowledge Base: Data Visualization Guide

## Chart Selection Matrix

### By Data Relationship
| Relationship | Best Chart | Alternatives |
|-------------|-----------|-------------|
| Trend over time | Line chart | Area chart, sparkline |
| Comparison | Bar chart (horizontal) | Grouped bar, lollipop |
| Part of whole | Stacked bar, treemap | Donut (max 5 slices), waffle |
| Distribution | Histogram, box plot | Violin plot, density |
| Correlation | Scatter plot | Bubble chart, heatmap |
| Ranking | Horizontal bar (sorted) | Slope chart, bump chart |
| Flow/Process | Sankey, funnel | Waterfall chart |
| Geographic | Choropleth map | Bubble map, hex map |
| KPI status | Scorecard, gauge | Bullet chart, traffic light |

### By Business Context
| Context | Chart | Why |
|---------|-------|-----|
| Revenue trend | Line chart (dual axis: revenue + growth%) | Shows trajectory and acceleration |
| Channel comparison | Horizontal bar (sorted by value) | Easy ranking comparison |
| Funnel analysis | Funnel chart | Intuitive drop-off visualization |
| Budget allocation | Treemap | Shows proportions at a glance |
| Campaign ROAS | Scatter (X: spend, Y: ROAS, size: revenue) | Efficiency + scale in one view |
| Cohort retention | Heatmap (triangle) | Classic cohort visualization |
| KPI dashboard | Scorecards + sparklines | Executive overview |

## Design Principles

### 1. Data-Ink Ratio (Edward Tufte)
- Maximize data-ink, minimize non-data-ink
- Remove chartjunk: 3D effects, unnecessary gridlines, decorative elements
- Every pixel should convey information

### 2. Pre-Attentive Attributes
| Attribute | Use For | Example |
|-----------|--------|---------|
| Color hue | Categories | Channel = blue/red/green |
| Color intensity | Magnitude | Darker = higher value |
| Size | Quantity | Bigger bubble = more revenue |
| Position | Precise values | X/Y axis placement |
| Length | Comparison | Bar length = value |
| Orientation | Direction | Arrow up/down for trend |

### 3. Color Usage
| Rule | Guideline |
|------|----------|
| Sequential | One hue, varying intensity (for magnitude) |
| Diverging | Two hues from center (for above/below target) |
| Categorical | Distinct hues (max 7 categories) |
| Semantic | Green=good, Red=bad, Yellow=warning |
| Accessibility | Use colorblind-safe palettes (avoid red-green only) |
| Highlight | Use color to draw attention to key insight |

**Recommended palettes:**
- Sequential: Blues (`#EBF5FB` → `#1B4F72`)
- Diverging: Red-Blue (`#E74C3C` → `#3498DB`)
- Categorical: Tableau 10, ColorBrewer Set2

### 4. Typography in Charts
| Element | Size | Weight |
|---------|------|--------|
| Chart title | 16-18px | Bold |
| Subtitle/annotation | 12-14px | Regular |
| Axis labels | 11-12px | Regular |
| Data labels | 10-11px | Regular |
| Source/footnote | 9-10px | Light |

## Dashboard Design Patterns

### Layout Principles
1. **Z-pattern reading** — Most important KPI top-left
2. **Progressive disclosure** — Overview first, details on demand
3. **Consistent grid** — 12-column grid for alignment
4. **White space** — Don't overcrowd; breathing room improves comprehension
5. **Context always** — Every number needs comparison (target, prior period, trend)

### KPI Card Anatomy
```
┌─────────────────────────┐
│ Metric Name        [i]  │
│                         │
│    R$ 142.5K            │  ← Primary value (large)
│    ▲ 12.3% vs last mo  │  ← Comparison (colored)
│    Target: R$150K       │  ← Context
│    ▂▃▅▆▇▆▅▇ (sparkline) │  ← Trend
└─────────────────────────┘
```

### Dashboard Hierarchy
| Level | Content | Interaction |
|-------|---------|-------------|
| L1 Summary | 4-6 KPI cards + 1-2 charts | View only |
| L2 Analysis | Detailed charts by dimension | Filter, date range |
| L3 Exploration | Data tables, custom queries | Sort, search, export |

## Common Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| Pie chart with 10+ slices | Unreadable | Use horizontal bar |
| Dual y-axis (misleading) | Implies correlation | Two separate charts |
| Truncated y-axis | Exaggerates differences | Start at zero (bars) |
| 3D charts | Distorts perception | Always use 2D |
| Rainbow color scheme | No meaning, inaccessible | Semantic or sequential colors |
| Too many metrics | Decision paralysis | Max 6-8 per dashboard view |
| Numbers without context | Meaningless in isolation | Add target, trend, comparison |
| Animated transitions | Distraction | Use only for state changes |

## Annotation Best Practices
| When to Annotate | Example |
|-----------------|---------|
| Anomalies | "Black Friday spike — 3x normal traffic" |
| Launches | "New feature launched Nov 15" |
| External events | "Competitor shutdown — traffic surge" |
| Methodology changes | "Attribution model changed to data-driven" |
| Targets | Horizontal reference line at target value |

## Tools Reference
| Tool | Type | Best For |
|------|------|---------|
| Looker Studio | Cloud BI | GA4 dashboards (free) |
| Metabase | Self-hosted BI | SQL-based dashboards |
| Preset (Superset) | Cloud BI | Data team dashboards |
| Grafana | Monitoring | Real-time metrics |
| Figma | Design | Dashboard mockups |
| D3.js | Code | Custom visualizations |
| Chart.js | Code | Simple web charts |
| Observable | Notebooks | Exploratory analysis |

## Storytelling with Data (Cole Nussbaumer Knaflic)

### 6 Steps
1. **Understand the context** — Who, what, how
2. **Choose the right visual** — Chart selection matrix
3. **Eliminate clutter** — Remove non-data elements
4. **Focus attention** — Use pre-attentive attributes
5. **Think like a designer** — Form follows function
6. **Tell a story** — Setup → Conflict → Resolution
