# Funnel Architecture Reference

## Full-Funnel Model (TOFU / MOFU / BOFU)

### Stage Definitions
```
TOFU — Top of Funnel (Awareness)
  Goal: Attract the right audience
  Mindset: "I have a problem/opportunity"
  Content: Blog posts, social content, videos, podcasts, infographics
  Metric: Traffic, impressions, reach
  Conversion event: Content consumed → Lead captured (email, form)

MOFU — Middle of Funnel (Consideration)
  Goal: Nurture and educate
  Mindset: "I'm evaluating solutions"
  Content: Case studies, webinars, whitepapers, comparison guides
  Metric: MQLs, engagement rate, content depth
  Conversion event: Lead engaged → MQL qualified

BOFU — Bottom of Funnel (Decision)
  Goal: Convert to customer
  Mindset: "I'm ready to choose"
  Content: Proposals, demos, consultations, trials, ROI calculators
  Metric: SQLs, opportunities, close rate
  Conversion event: MQL → SQL → Opportunity → Customer
```

### Funnel Math (Working Backward)
```
FUNNEL MATH CALCULATOR

Start with target:
  Revenue Target: R$ __________
  Average Deal Size (ACV): R$ __________
  Deals Needed: Revenue ÷ ACV = __________

Work backward through conversion rates:
  Close Rate (SQL → Won): __% → SQLs needed: ____
  SQL Rate (MQL → SQL): __% → MQLs needed: ____
  MQL Rate (Lead → MQL): __% → Leads needed: ____
  Lead Rate (Visit → Lead): __% → Visits needed: ____

Example:
  Target: R$2.4M/year → R$200K/month
  ACV: R$60K
  Deals needed: 40/year → 3.3/month

  Close rate: 25% → SQLs: 13/month
  SQL rate: 30% → MQLs: 44/month
  MQL rate: 10% → Leads: 440/month
  Lead rate: 2% → Visits: 22,000/month
```

### Conversion Rate Benchmarks (B2B Services)
| Stage | Good | Great | World-Class |
|-------|------|-------|-------------|
| Visit → Lead | 1-3% | 3-5% | 5-8% |
| Lead → MQL | 5-15% | 15-25% | 25-40% |
| MQL → SQL | 15-30% | 30-50% | 50-70% |
| SQL → Opportunity | 40-60% | 60-75% | 75-90% |
| Opportunity → Won | 15-25% | 25-35% | 35-50% |
| End-to-end (visit → customer) | 0.01-0.1% | 0.1-0.5% | 0.5-1% |

---

## Bow Tie Funnel (Winning by Design)

### Complete Lifecycle
```
ACQUISITION SIDE          CENTER          EXPANSION SIDE
(Left Bow)                (Knot)          (Right Bow)

  Awareness ─┐                          ┌─ Onboarding
  Education ──┤                         ├── Impact
  Selection ──┤     ═══ LAND ═══       ├── Growth (Expand)
  Commitment ─┘                         └─ Advocacy

Key Insight: The right side of the bow tie represents
MORE revenue than the left side for recurring businesses.

Revenue Split (healthy recurring business):
  New Logo Revenue: 30-40%
  Expansion Revenue: 40-50%
  Retention Value: preserving the 100% base

If your business model relies on always finding new logos
to grow, you have a "leaky bucket" problem.
```

### Stage Metrics (Both Sides)
| Side | Stage | Key Metric | Health Indicator |
|------|-------|-----------|-----------------|
| Left | Awareness | Reach, impressions | Growing MoM |
| Left | Education | Engagement, time on content | Deepening engagement |
| Left | Selection | MQL volume, quality score | Improving quality |
| Left | Commitment | Close rate, ACV | Stable or growing |
| Center | Land | Time to close, contract value | Predictable |
| Right | Onboarding | Time to first value | Decreasing |
| Right | Impact | Adoption metrics, health score | Green trending |
| Right | Growth | NRR, expansion rate | > 110% |
| Right | Advocacy | NPS, referral rate | > 50 NPS |

---

## Lead Scoring Model

### Dual-Axis Scoring
```
EXPLICIT SCORE (Demographic Fit) — "Who they are"
  Company size: matches ICP? (+1 to +5)
  Industry: target industry? (+1 to +5)
  Title/Role: decision maker? (+1 to +5)
  Revenue: within target range? (+1 to +5)
  Geography: serviceable market? (+1 to +3)
  MAX EXPLICIT: 23 points

IMPLICIT SCORE (Behavioral Engagement) — "What they do"
  Website visits: pages viewed, frequency (+1 to +5)
  Content downloads: ebooks, whitepapers (+2 to +5)
  Email engagement: opens, clicks (+1 to +3)
  Event attendance: webinars, conferences (+3 to +5)
  Demo request: form submission (+10)
  Pricing page visit: (+5)
  Case study views: (+3)
  MAX IMPLICIT: ~40 points

NEGATIVE SCORING:
  Unsubscribed from email: -10
  Competitor domain: -20
  Student/intern title: -15
  No activity in 30 days: -5
  Bounced email: -10

TOTAL LEAD SCORE = Explicit + Implicit + Negative

MQL THRESHOLD: ≥ 40 points
  (Must have minimum 10 explicit + 30 implicit)
```

### Lead Grading Matrix
```
            HIGH ENGAGEMENT    LOW ENGAGEMENT
            (Implicit ≥ 30)    (Implicit < 30)
           ┌─────────────────┬─────────────────┐
HIGH FIT   │   A — Hot Lead  │  B — Nurture    │
(Expl ≥15) │   MQL → Sales   │  Target content │
           ├─────────────────┼─────────────────┤
LOW FIT    │   C — Engaged   │  D — Monitor    │
(Expl <15) │   Qualify fit   │  Auto-nurture   │
           └─────────────────┴─────────────────┘

Priority: A > B > C > D
A leads: Immediate sales outreach
B leads: Increase engagement with targeted content
C leads: Verify fit (may be great but from unexpected segment)
D leads: Automated nurture, revisit quarterly
```

---

## ABM (Account-Based Marketing) Tiers

### Three-Tier ABM Model
```
TIER 1: STRATEGIC ABM (1:1)
  Accounts: 5-15 named accounts
  Approach: Fully customized campaigns per account
  Content: Personalized to individual stakeholders
  Resources: Dedicated team per account
  Channels: Direct outreach, executive events, custom content
  Metrics: Pipeline from named accounts, engagement depth
  ROI Timeline: 6-12 months

TIER 2: ABM LITE (1:Few)
  Accounts: 50-200 accounts in clusters
  Approach: Cluster-specific campaigns (by industry, size, or use case)
  Content: Semi-customized to cluster attributes
  Resources: Shared team across clusters
  Channels: Targeted ads, industry events, vertical content
  Metrics: Pipeline from cluster, MQL volume
  ROI Timeline: 3-6 months

TIER 3: PROGRAMMATIC ABM (1:Many)
  Accounts: 200-1000+ accounts
  Approach: Technology-driven personalization at scale
  Content: Dynamic personalization (firmographic, behavioral)
  Resources: Marketing automation + minimal manual effort
  Channels: Programmatic ads, email sequences, retargeting
  Metrics: Account engagement score, pipeline influence
  ROI Timeline: 1-3 months
```

### ABM Selection Criteria
| Factor | Tier 1 | Tier 2 | Tier 3 |
|--------|--------|--------|--------|
| ACV | > R$200K | R$50-200K | R$10-50K |
| Sales cycle | > 6 months | 3-6 months | 1-3 months |
| Decision makers | 5+ | 3-5 | 1-3 |
| Personalization need | Very high | Medium | Low |
| Budget per account | R$5-20K | R$500-2K | R$50-200 |

---

## Value Ladder (Russell Brunson)

### Structure
```
Level 5: CONTINUITY (Ongoing relationship)
  Example: Monthly retainer, advisory, ongoing services
  Purpose: Recurring revenue, deepening relationship
  Price: R$5-50K/month

Level 4: PROFIT MAXIMIZER (Premium offering)
  Example: Enterprise strategy, transformation program
  Purpose: High-margin, high-value engagement
  Price: R$100K-500K+

Level 3: CORE OFFER (Main product/service)
  Example: Digital marketing program, brand strategy
  Purpose: Primary revenue driver
  Price: R$20-100K

Level 2: FRONTEND OFFER (Paid entry point)
  Example: Audit, workshop, sprint
  Purpose: Qualify serious buyers, deliver quick win
  Price: R$2-15K

Level 1: LEAD MAGNET (Free value)
  Example: Ebook, webinar, template, free consultation
  Purpose: Generate leads, demonstrate expertise
  Price: Free

ASCENSION PATH:
  Free content → Paid audit → Core program → Premium retainer → Advisory
  Each level builds trust and delivers increasing value
```

---

## Content-to-Funnel Mapping

### Content Types by Stage
| Funnel Stage | Content Type | Format | Distribution | CTA |
|-------------|-------------|--------|-------------|-----|
| TOFU | Industry trends | Blog, social, video | SEO, social, ads | Subscribe, follow |
| TOFU | Educational how-to | Blog, podcast, video | SEO, social | Download guide |
| MOFU | Case studies | PDF, video, blog | Email, retargeting | Book consultation |
| MOFU | Comparison guides | Blog, interactive | SEO, email | Request demo |
| MOFU | Webinars | Live/recorded | Email, social, ads | Attend event |
| BOFU | ROI calculators | Interactive tool | Direct link, email | Calculate ROI |
| BOFO | Proposals | PDF, deck | Direct delivery | Sign contract |
| BOFU | Free audit/consultation | Live session | Direct outreach | Schedule call |
| Post-Sale | Onboarding guides | Portal, email | Direct delivery | Complete setup |
| Post-Sale | QBR presentations | Deck, report | Meeting delivery | Expand scope |

## References
- Brunson, R. — *DotCom Secrets* (2015), Value Ladder concept
- Van der Kooij, J. — *Revenue Architecture*, Bow Tie Funnel
- Engagio/Demandbase — ABM Tier model
- HubSpot — Inbound marketing funnel methodology
- Forrester — B2B buyer journey research
