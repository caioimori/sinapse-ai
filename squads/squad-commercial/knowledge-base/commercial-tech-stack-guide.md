# Commercial Tech Stack Guide

## Stack Architecture Overview

### Four Pillars of Commercial Technology
```
PILLAR 1: CRM & PIPELINE (Foundation)
  Purpose: Single source of truth for deals, contacts, accounts
  Core: CRM platform
  Integrations: Everything connects here

PILLAR 2: PROSPECTING & OUTREACH
  Purpose: Find and reach potential clients
  Core: Sales engagement platform + data enrichment
  Flow: Data → Enrichment → Sequences → CRM

PILLAR 3: MARKETING & DEMAND GEN
  Purpose: Generate and nurture inbound pipeline
  Core: Marketing automation + content management
  Flow: Content → Capture → Nurture → MQL → CRM

PILLAR 4: ANALYTICS & INTELLIGENCE
  Purpose: Measure, analyze, optimize
  Core: BI/analytics + call intelligence + attribution
  Flow: All data → Analysis → Insights → Action
```

---

## Tool Categories & Recommendations

### CRM Platforms
| Tool | Best For | Tier | Key Strength |
|------|---------|------|-------------|
| **HubSpot CRM** | SMB to mid-market, marketing-first orgs | Free-Enterprise | Best free CRM, strong marketing integration |
| **Salesforce** | Enterprise, complex sales processes | Enterprise | Unmatched customization and ecosystem |
| **Pipedrive** | Small sales teams, simplicity | SMB | Best UX for pipeline management |
| **Close** | Inside sales, high-velocity | SMB-Mid | Built-in calling and email |

### Sales Engagement
| Tool | Best For | Key Feature |
|------|---------|------------|
| **Apollo.io** | All-in-one prospecting + sequences | Data + engagement in one platform |
| **Outreach** | Enterprise sales engagement | Advanced sequencing and analytics |
| **Salesloft** | Mid-market to enterprise | Cadence management + coaching |
| **Lemlist** | Email personalization at scale | Image/video personalization |

### Data & Enrichment
| Tool | Best For | Key Feature |
|------|---------|------------|
| **Apollo.io** | B2B contact data + intent | Large database, affordable |
| **ZoomInfo** | Enterprise-grade data | Most comprehensive B2B database |
| **LinkedIn Sales Navigator** | Prospecting and research | Best for B2B relationship building |
| **Clearbit** | Real-time enrichment | API-first, great integrations |

### Marketing Automation
| Tool | Best For | Key Feature |
|------|---------|------------|
| **HubSpot Marketing** | Inbound marketing, content | Best all-in-one marketing suite |
| **ActiveCampaign** | Email automation, SMB | Advanced automation at reasonable price |
| **Mailchimp** | Simple email marketing | Easiest to use, good free tier |
| **RD Station** | Brazilian market, Portuguese | Local market leader, LGPD compliant |

### Call Intelligence & Coaching
| Tool | Best For | Key Feature |
|------|---------|------------|
| **Gong** | Revenue intelligence | Best AI analysis, deal warnings |
| **Chorus (ZoomInfo)** | Call coaching | Integration with ZoomInfo data |
| **Fireflies.ai** | Meeting transcription | Affordable AI note-taking |
| **Otter.ai** | General transcription | Good for non-sales meetings too |

### Proposal & Document
| Tool | Best For | Key Feature |
|------|---------|------------|
| **PandaDoc** | Proposals + e-signatures | Templates, analytics, e-sign |
| **Proposify** | Beautiful proposals | Design-forward, brand control |
| **DocuSign** | Enterprise e-signatures | Industry standard for contracts |
| **Better Proposals** | Quick proposal creation | Simple, fast, good templates |

### Customer Success Platforms
| Tool | Best For | Key Feature |
|------|---------|------------|
| **Gainsight** | Enterprise CS operations | Most comprehensive CS platform |
| **ChurnZero** | Mid-market CS | Real-time alerts, playbooks |
| **Totango** | Product-led CS | Usage-based health scoring |
| **CustomerX** | Brazilian market | Local CS platform, Portuguese |

### Analytics & BI
| Tool | Best For | Key Feature |
|------|---------|------------|
| **Looker Studio** | Quick dashboards, Google ecosystem | Free, Google integrations |
| **Metabase** | Self-service BI, open source | Easy setup, SQL-based |
| **Tableau** | Enterprise analytics | Most powerful visualization |
| **Power BI** | Microsoft ecosystem | Good value, Office integration |

---

## Stack Recommendations by Stage

### Stage 1: Founder-Led Sales (0-R$1M ARR)
```
MINIMUM VIABLE STACK:
  CRM: HubSpot Free or Pipedrive (R$50-200/user/month)
  Email: HubSpot or Mailchimp (free tier)
  Prospecting: Apollo.io free + LinkedIn
  Proposals: Google Docs/Slides + DocuSign
  Analytics: HubSpot built-in + Google Sheets

Total cost: R$0-500/month
Focus: Process over tools
```

### Stage 2: First Sales Hire (R$1-5M ARR)
```
GROWTH STACK:
  CRM: HubSpot Starter or Pipedrive Pro
  Sales engagement: Apollo.io or Lemlist
  Marketing: HubSpot Marketing Starter or RD Station
  Call recording: Fireflies.ai
  Proposals: PandaDoc or Better Proposals
  Analytics: HubSpot + Looker Studio

Total cost: R$1-3K/month
Focus: Automation + pipeline visibility
```

### Stage 3: Sales Team (R$5-20M ARR)
```
PROFESSIONAL STACK:
  CRM: HubSpot Professional or Salesforce
  Sales engagement: Outreach or Salesloft
  Data: Apollo.io paid or ZoomInfo
  Marketing: HubSpot Professional
  Call intelligence: Gong or Chorus
  CS: ChurnZero or Gainsight (if CS team exists)
  Proposals: PandaDoc
  Analytics: Looker Studio + Metabase

Total cost: R$5-15K/month
Focus: Analytics + coaching + scalability
```

---

## Integration Architecture

### Core Integration Map
```
                    ┌─────────────┐
                    │    CRM      │
                    │ (Hub/SFDC)  │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐
    │ Sales       │ │ Marketing   │ │ CS Platform │
    │ Engagement  │ │ Automation  │ │             │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
    ┌──────┴──────┐ ┌──────┴──────┐ ┌──────┴──────┐
    │ Data/       │ │ Website/    │ │ Support/    │
    │ Enrichment  │ │ CMS         │ │ Ticketing   │
    └─────────────┘ └─────────────┘ └─────────────┘

RULE: CRM is always the single source of truth.
All other tools SYNC to the CRM, not the other way around.
```

### Integration Priorities
| Priority | Integration | Why |
|----------|-----------|-----|
| P0 | CRM ↔ Email/Calendar | Foundation for tracking |
| P0 | CRM ↔ Sales Engagement | Pipeline automation |
| P1 | CRM ↔ Marketing Automation | Lead flow and attribution |
| P1 | CRM ↔ Proposal Tool | Deal progression tracking |
| P2 | CRM ↔ Call Intelligence | Coaching and deal insight |
| P2 | CRM ↔ CS Platform | Handoff and health scoring |
| P3 | CRM ↔ BI/Analytics | Reporting and dashboards |

---

## Tech Stack Audit Framework

### Health Check
| Dimension | Score (1-5) | Notes |
|-----------|-------------|-------|
| Data quality (CRM completeness) | | |
| Tool utilization (% features used) | | |
| Integration health (sync reliability) | | |
| User adoption (% of team using correctly) | | |
| Cost efficiency (cost per user vs value) | | |
| Reporting capability (can you answer key questions?) | | |
| Scalability (will it support 2x growth?) | | |

### Red Flags
```
⚠️ Multiple tools doing the same job (overlap)
⚠️ Manual data entry between systems (integration gap)
⚠️ Key metrics require spreadsheet exports to calculate
⚠️ Sales team using personal tools instead of official stack
⚠️ Tool costs > 5% of ARR for commercial operations
⚠️ New hire onboarding > 2 weeks for tools
⚠️ CRM data completeness < 70%
```

## References
- G2 — Software category reviews and comparisons
- TrustRadius — Enterprise software research
- SaaStr — Tech stack benchmarking
- RevOps Co-op — Revenue operations community
