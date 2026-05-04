# Template: Analytics Dashboard Specification

## Dashboard Metadata
| Field | Value |
|-------|-------|
| Name | |
| Owner | |
| Audience | C-level / VP / Manager / Analyst |
| Refresh Rate | Real-time / Hourly / Daily / Weekly |
| Tool | Looker Studio / Metabase / Custom |
| Date Created | YYYY-MM-DD |

## Purpose & Context
**Business question this dashboard answers:**
> [e.g., "How are our marketing campaigns performing relative to targets?"]

**Key decisions this dashboard supports:**
1. [Decision 1]
2. [Decision 2]
3. [Decision 3]

## Filters & Controls
| Filter | Type | Default | Options |
|--------|------|---------|---------|
| Date Range | Date picker | Last 30 days | 7/14/30/90/custom |
| Channel | Multi-select | All | List channels |
| Device | Dropdown | All | All/Mobile/Desktop |
| Comparison | Toggle | Off | vs Previous Period / vs Same Period LY |

## Layout Specification

### Row 1 — KPI Summary (4-6 scorecards)
| Position | KPI | Format | Comparison |
|----------|-----|--------|-----------|
| 1 | | Currency/Number/% | vs Target + vs Prior |
| 2 | | | |
| 3 | | | |
| 4 | | | |

### Row 2 — Primary Charts (1-2 charts)
| Position | Chart Type | Data | Dimensions |
|----------|-----------|------|-----------|
| Left (60%) | | | |
| Right (40%) | | | |

### Row 3 — Secondary Charts (2-3 charts)
| Position | Chart Type | Data | Dimensions |
|----------|-----------|------|-----------|
| Left (33%) | | | |
| Center (33%) | | | |
| Right (33%) | | | |

### Row 4 — Detail Table
| Column | Data | Format | Sortable |
|--------|------|--------|---------|
| | | | Yes/No |

## Data Sources
| Source | Connection | Table/View | Refresh |
|--------|-----------|-----------|---------|
| | | | |

## Alert Configuration
| Metric | Condition | Severity | Notify |
|--------|----------|---------|--------|
| | | Warning/Critical | Email/Slack |

## Access Control
| Role | Access Level |
|------|-------------|
| Admin | Edit + Share |
| Manager | View + Filter |
| Analyst | View + Export |

## Change Log
| Date | Change | Author |
|------|--------|--------|
| | Initial version | |
