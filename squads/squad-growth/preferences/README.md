# Growth Analytics Preferences

This directory stores learned preferences and patterns from project executions.

## How It Works
Agents in this squad automatically learn and record:
- Client-specific KPI definitions and targets
- Preferred analytics tools and platforms
- Dashboard design preferences
- Reporting cadence and format preferences
- Statistical thresholds and confidence levels
- UTM naming conventions per client
- Event taxonomy customizations
- SEO keyword strategy preferences
- CRO testing velocity and priorities
- Channel mix and budget allocation patterns

## Structure
```
preferences/
├── README.md                    # This file
├── {client-name}/               # Per-client preferences
│   ├── analytics-config.yaml    # GA4/GTM preferences
│   ├── kpi-targets.yaml         # KPI definitions and targets
│   ├── reporting-prefs.yaml     # Report format and cadence
│   └── experiment-prefs.yaml    # Testing preferences
└── global/                      # Cross-client defaults
    ├── naming-conventions.yaml  # UTM, event naming defaults
    └── statistical-defaults.yaml # p-value, MDE, confidence
```

## Auto-Learning Triggers
| Agent | Learns From | Stores |
|-------|-----------|--------|
| Catalyst | Growth briefs, retrospectives | Maturity level, workflow preferences |
| Signal | Tracking implementations | Event taxonomy, data layer patterns |
| Convert | Experiment results | Winning patterns, MDE thresholds |
| Rank | SEO audits, keyword research | Target keywords, content strategy |
| Insight | Reports, dashboards | KPI definitions, visualization prefs |
| Lever | Growth experiments | Loop performance, activation benchmarks |
| Pulse | Campaign reports | UTM conventions, ROAS targets |

## Usage
Preferences are loaded automatically at the start of each task execution.
Agents check this directory for client-specific overrides before applying defaults.
