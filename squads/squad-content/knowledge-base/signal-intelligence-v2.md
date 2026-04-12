# Signal Intelligence v2 — 2026 Sources + Classification Canon

> **Status:** Canon (squad-content v2.0) — ADDITIVE companion to `signal-detection-methods.md` v1
> **Owner:** signal-intelligence (Radar) — primary; content-orqx (Nexus) — curator
> **Created:** 2026-04-12 for Story fw-v2.4
> **Explicit relationship:** Does NOT replace `signal-detection-methods.md`. v1 remains canonical for foundational definitions. v2 adds the 2026 source landscape, the signal classification taxonomy, routing rules and a quality-scoring model that did not exist in v1.

---

## 1. Why v2 Exists

The v1 KB (`signal-detection-methods.md`) was written assuming a pre-Grok / pre-Apify-ubiquity landscape. Since then:

- **X (Twitter) API v2** has become the dominant surface for public discourse, with tier changes that reshape what's scrapable.
- **TikTok Research API** became available for commercial signal detection and is now the #1 cultural-signal source for sub-25 audiences.
- **Apify actors** became the pragmatic alternative when APIs are closed — a rented actor marketplace for scraping any social surface.
- **Grok on X** became a first-order summarizer of live discourse, shifting the signal-detection workflow.
- **Substack** became a newsletter-first signal source for professional niches.
- **Reddit API** re-opened for commercial use under new pricing.
- **Google Trends + YouTube Data API v3** remain stable but are now cross-referenced against the above rather than primary.

v1 still defines what a signal IS and the 7 signal types. v2 defines where signals LIVE in 2026 and how to score them.

---

## 2. Current-State Signal Source Catalog

### 2.1 Tier A — First-party research APIs (highest trust)

| Source | Access | Rate | Best for | Cost |
|--------|--------|------|---------|------|
| X API v2 (Basic/Pro/Enterprise) | OAuth 2.0, Basic tier ~$100/mo | ~10k posts/mo Basic | Real-time discourse, influencer signals, thread analysis, Grok summaries | Paid |
| TikTok Research API | Academic/commercial app approval | Batch hashtag queries | Cultural signals, sub-25 behavior, meme velocity, trend lifecycle | Free with approval |
| YouTube Data API v3 | Google Cloud key | 10k units/day free | Long-form trend signals, creator signals, search intent behind video queries | Free tier + paid |
| Reddit API (official) | OAuth 2.0, commercial tier | Paid tiers for commercial | Niche community signals, question mining, "authentic voice" samples | Paid for commercial |
| Google Trends API (pytrends + official) | Public, rate-limited | Rolling | Search intent velocity, regional variation, seasonality | Free |

### 2.2 Tier B — Scraping / Actor-based sources

| Source | Access | Best for | Legal/ToS note |
|--------|--------|---------|----------------|
| Apify actors (Instagram, TikTok, LinkedIn, X, etc.) | Apify platform pay-per-run | Whatever is not open via official API | Respect robots.txt + ToS, document legal basis per actor |
| Substack RSS feeds | Public RSS | Professional niche signals, newsletter thesis drift | Public RSS is safe |
| Newsletter aggregators (Feedly, Inoreader) | API keys | Curated professional signals by editor | OK |
| Podcast RSS + transcription (Whisper) | Public RSS + local Whisper | Long-form thesis signals before they hit text | Respect IP/quotation rules |

### 2.3 Tier C — Curated human-intelligence

| Source | Why | Cadence |
|--------|-----|---------|
| Exploding Topics | Trend pre-emergence detection | Weekly digest |
| SparkToro | Audience intelligence + zero-click research | On demand |
| BuzzSumo | Evergreen scoring + viral performance | On demand |
| Semrush Trends | SEO-backed topic signals | Rolling |
| Parse.ly Currents | Publisher-side trend intelligence | Daily |
| Stacked Marketer / Morning Brew / The Hustle / Superpath | Human-curated daily scan | Daily |

### 2.4 Tier D — Proprietary client signals (highest leverage)

| Source | Why it matters |
|--------|---------------|
| Client DMs, comments, reviews, support tickets | Authentic audience voice — highest-leverage signal, hardest to find |
| Client analytics (Parse.ly, GA4, native platform analytics) | Performance signals closing the loop back to retrofeed |
| Sales team transcripts (Gong, Fireflies) | What the market is saying with buying intent |
| Customer interview transcripts (Whisper) | Pain language, vocabulary, objections |

**Rule of thumb:** Tier D signals > Tier A > Tier B > Tier C for relevance. Tier C and A are broader-coverage; Tier D is narrower-but-hotter.

---

## 3. Signal Classification Taxonomy

Every detected signal MUST be classified into exactly one of these 5 categories. Classification determines routing to Phase 2 (AI Draft) and the editorial pillar mapping.

### 3.1 Opportunity Window

**Definition:** A short-lived condition where content on a specific topic will over-perform because attention is concentrated.
**Velocity:** Hours to 7 days.
**Example:** Apple releases a new dev tool at WWDC — window to publish "what this means for SaaS founders" is 48-72h before commodity hot-takes flood the channel.
**Routing:** Phase 1 → Phase 2 immediately, high urgency, human-edit fast-track.
**Failure mode:** Late-to-the-window = commodity content.

### 3.2 Trend Seed

**Definition:** Early sign of a topic gaining velocity before it becomes mainstream. Detected pre-inflection.
**Velocity:** Weeks to months.
**Example:** A term starts appearing in 3+ unrelated niche newsletters over 2 weeks. Not yet on Google Trends.
**Routing:** Phase 1 → editorial calendar insertion, build a pillar-aligned series.
**Failure mode:** Calling a trend too early or forcing a seed that won't grow.

### 3.3 Crisis Alert

**Definition:** A brand-relevant event that forces a response — competitor misstep, industry controversy, client-adjacent scandal, regulatory change.
**Velocity:** Immediate (hours).
**Example:** A major competitor gets caught in a data breach — opportunity for a thoughtful "here is how we think about data stewardship" piece.
**Routing:** Phase 1 → escalate to client immediately, Phase 2 requires human-heavy review (high reputational stakes).
**Failure mode:** Opportunistic copy that reads as vulture-like; miss the window of relevance.

### 3.4 Category Shift

**Definition:** A slow but durable change in how the category thinks, talks or operates. Signals arrive from multiple unrelated sources over time.
**Velocity:** Months to quarters.
**Example:** The shift from "content marketing" to "audience-first content" in 2018-2021. You can see it in retrospect; the leverage is seeing it 6 months before the category does.
**Routing:** Phase 1 → manifesto piece + editorial pillar reshape, high authority play.
**Failure mode:** Chasing every language shift as if it were a category shift.

### 3.5 Competitor Move

**Definition:** A direct, attributable action by a known competitor — launch, campaign, messaging shift, hiring pattern, product change.
**Velocity:** Days to weeks.
**Example:** Competitor launches a new tier; opportunity to reframe your own positioning.
**Routing:** Phase 1 → analyst pass (`benchmark-against-competitors`) → Phase 2 strategic response content.
**Failure mode:** Obsessively responding to competitors instead of leading the category.

---

## 4. Signal-to-Pillar Routing Rules

Every signal must be routed to an editorial pillar before it enters Phase 2. Unrouted signals are archived.

### 4.1 Routing Algorithm

```
1. Classify signal into one of 5 categories (§3)
2. Match signal to existing editorial pillars via semantic overlap
3. If match → route to pillar, schedule in Phase 2 queue
4. If no match → check if the signal is a Category Shift (rare but possible)
   - YES → escalate to editorial-strategist for pillar review
   - NO → archive with "no pillar fit" tag
5. If match spans multiple pillars → assign primary pillar + cross-reference secondary
```

### 4.2 Routing Priority Matrix

| Signal Category | Priority | Route Directly To |
|----------------|----------|-------------------|
| Crisis Alert | P0 | content-orqx → editorial-strategist (escalation) |
| Opportunity Window | P1 | Phase 2 fast-track, content-engineer |
| Competitor Move | P2 | content-analyst benchmark, then content-engineer |
| Trend Seed | P3 | editorial-strategist for calendar insertion |
| Category Shift | P3 | editorial-strategist for pillar reshape consideration |

---

## 5. Signal Quality Scoring

Every signal, before entering Phase 2, is scored 1-5 on 5 dimensions. A signal must score ≥ 3.0 average to enter Phase 2.

| Dimension | 1 | 5 |
|-----------|---|---|
| **Relevance** to pillar/client | Unrelated | Perfect pillar fit |
| **Novelty** vs prior content | Covered recently | Fresh angle |
| **Evidence** backing the signal | 1 weak source | 3+ independent sources |
| **Actionability** for target audience | No clear reader action | Clear reader takeaway |
| **Window** still open | Closed/saturated | Open and ahead of curve |

Final score = average of 5 dimensions. Below 3.0 → archive. 3.0-4.0 → Phase 2 standard. 4.0-5.0 → Phase 2 priority + optional cross-platform batch.

---

## 6. Source Monitoring Cadence

| Tier | Source | Cadence |
|------|--------|---------|
| A | X API v2 | Continuous (webhooks/streams where possible) |
| A | TikTok Research API | Daily batch query per pillar |
| A | YouTube Data API | Daily batch |
| A | Reddit API | Twice daily |
| A | Google Trends | Twice daily |
| B | Apify actors | Daily (rotating by cost) |
| B | Substack RSS | Continuous |
| C | Exploding Topics / SparkToro / BuzzSumo | Weekly |
| C | Newsletters | Daily at fixed time |
| D | Client DMs / analytics | Continuous |
| D | Sales transcripts | Weekly batch |

---

## 7. Anti-Patterns (v2 additions over v1)

- **API-only monitoring** — missing Tier D (client-proprietary) signals is the most expensive blind spot.
- **Grok as sole summarizer** — powerful but opinionated; cross-reference with raw X posts.
- **Scraping without legal basis** — Tier B Apify usage must document basis per actor.
- **Treating Crisis Alerts as Opportunity Windows** — speed without care damages brand.
- **Category Shift false positives** — most language shifts are not category shifts; require multi-source, multi-month evidence.
- **Signals without routing** — unrouted signals clutter the pipeline and never become content.
- **Ignoring Tier D in favor of Tier A** — public-web signals are the same ones everyone else sees.

---

## 8. Handoff to Phase 2 (AI Draft)

When a signal passes quality scoring and routing, the hand-off package to Phase 2 contains:

```
signal:
  id: sig-{yyyymmdd}-{n}
  category: opportunity_window | trend_seed | crisis_alert | category_shift | competitor_move
  source_tier: A | B | C | D
  source_name: e.g., "X API v2"
  evidence:
    - url: ...
      excerpt: ...
    - url: ...
      excerpt: ...
  pillar_primary: ...
  pillar_secondary: [...]
  quality_score: 4.2
  window_open_until: 2026-04-15T18:00Z
  suggested_thesis: "..."
  suggested_format: ["carousel", "thread"]
```

This is the structured input that `content-engineer` (Arc) consumes at Phase 2 of `ai-native-content-loop.md`.

---

## 9. Relationship to v1 KB

| Topic | v1 (signal-detection-methods.md) | v2 (this KB) |
|-------|----------------------------------|--------------|
| What is a signal | DEFINITIVE | Referenced |
| 7 signal types | DEFINITIVE | Referenced |
| Source catalog | Stale (2026 update) | **DEFINITIVE** |
| Classification taxonomy | Not covered | **DEFINITIVE** |
| Routing rules | Not covered | **DEFINITIVE** |
| Quality scoring | Not covered | **DEFINITIVE** |
| Handoff format | Not covered | **DEFINITIVE** |

---

## Change Log

- 2026-04-12 — v1.0 authored as part of Story fw-v2.4 (squad-content v2.0 upgrade). Additive to v1 signal-detection-methods.md — v1 is NOT modified.
