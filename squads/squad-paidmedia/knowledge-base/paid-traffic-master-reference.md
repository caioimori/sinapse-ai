# Paid Traffic Master Reference

> **Source:** MS-005 Research (2026-04-07) | **Verified:** @research-orqx via WebSearch
> **Scope:** Meta, Google, TikTok, LinkedIn, Programmatic, Attribution, Creative, CRO, Budget, Brazil Context

---

## Table of Contents

1. [Ecosystem Fundamentals](#1-ecosystem-fundamentals)
2. [Meta Ads](#2-meta-ads)
3. [Google Ads](#3-google-ads)
4. [TikTok Ads](#4-tiktok-ads)
5. [LinkedIn Ads](#5-linkedin-ads)
6. [Programmatic and DSPs](#6-programmatic-and-dsps)
7. [Attribution and Measurement](#7-attribution-and-measurement)
8. [Creative Strategy](#8-creative-strategy)
9. [CRO and Landing Pages](#9-cro-and-landing-pages)
10. [Audiences and Segmentation](#10-audiences-and-segmentation)
11. [Budget and Bidding](#11-budget-and-bidding)
12. [Analytics and Reporting](#12-analytics-and-reporting)
13. [AI and Automation](#13-ai-and-automation)
14. [Brazilian Context](#14-brazilian-context)
15. [Checklists](#15-checklists)

---

## 1. Ecosystem Fundamentals

### 1.1 Market Size (2025)

| Metric | Value |
|--------|-------|
| Global digital ad spend | USD 680-800B (Dentsu: 678.7B; Statista: 798.7B) |
| Global total ad market | USD 1.14T (WPP GroupM) |
| Digital share of total | >60% (surpassed all traditional media combined) |

### 1.2 Evolution Eras

| Era | Period | Key Innovation |
|-----|--------|----------------|
| Banner & Direct Buy | 1994-2002 | CPM buying, DoubleClick ad server |
| Search & Performance | 2000-2010 | Google AdWords (2000), Quality Score, Facebook Ads (2007) |
| Programmatic & Data | 2010-2018 | RTB, DSPs, DMPs, Custom/Lookalike Audiences |
| AI, Privacy & Automation | 2018-present | Smart Bidding, Advantage+, PMax, iOS 14.5 ATT, LGPD |

### 1.3 Auction Mechanics

All modern digital advertising operates via auctions. Google migrated to first-price auction in 2019.

| Component | Description |
|-----------|-------------|
| Bid | Maximum amount advertiser will pay |
| Quality Score | Ad relevance to user (Google) |
| Estimated Action Rate | Probability user takes desired action (Meta) |
| Ad Rank | Final score = Bid x Quality (determines position and cost) |
| Reserve Price | Minimum to enter the auction |

**Key principle:** Money alone does not win. An irrelevant ad with a high bid loses to a relevant ad with a lower bid. Platforms optimize for user experience.

### 1.4 Core Metrics Reference

| Metric | Formula | Measures |
|--------|---------|----------|
| CPM | (Cost / Impressions) x 1000 | Cost per thousand impressions |
| CPC | Cost / Clicks | Cost per click |
| CTR | (Clicks / Impressions) x 100 | Click-through rate |
| CPA | Cost / Conversions | Cost per acquisition |
| ROAS | Revenue / Ad Cost | Return on ad spend |
| CVR | (Conversions / Clicks) x 100 | Conversion rate |
| CPL | Cost / Leads | Cost per lead |
| LTV | Avg revenue per customer x Avg lifetime | Customer lifetime value |
| CAC | Total acquisition cost / New customers | Customer acquisition cost |
| MER | Total revenue / Total marketing cost | Marketing efficiency ratio |
| Frequency | Impressions / Reach | Times each person saw the ad |

### 1.5 The Attention Economy

- Average attention on a digital ad: **1.7 seconds** (Microsoft/Dentsu, 2023)
- In social feeds: **0.4 seconds** before scroll
- Video ads: **3-second rule** -- if not captured, the ad failed
- Creative is the new targeting: with audience automation, creative quality is the primary differentiator

---

## 2. Meta Ads

### 2.1 Campaign Architecture

```
Campaign (Objective + Budget)
  --> Ad Set (Audience + Placement + Schedule + Bid)
       --> Ad (Creative + Copy + CTA + URL)
```

### 2.2 CBO vs ABO

| Aspect | CBO | ABO |
|--------|-----|-----|
| Budget control | Meta distributes across ad sets | You define budget per ad set |
| When to use | Audience testing, scale | Granular control, unequal budgets |
| Advantage | Algorithm optimizes allocation | Spend predictability |
| Disadvantage | May concentrate on 1 ad set | May waste on poor ad sets |
| Best practice | Default for most cases | When audiences have very different sizes |

Meta recommends CBO as default since 2019.

### 2.3 Campaign Objectives (ODAX)

| Objective | Optimizes For | Typical Use |
|-----------|--------------|-------------|
| Awareness | Impressions, reach, brand recall | Branding, launches |
| Traffic | Link clicks, landing page views | Drive users to site |
| Engagement | Likes, comments, shares, messages | Social proof, WhatsApp |
| Leads | Forms, instant forms, conversations | B2B/B2C lead gen |
| App Promotion | Installs, in-app events | Mobile apps |
| Sales | Purchase, add to cart, checkout | E-commerce, conversion |

**Golden rule:** The algorithm optimizes exactly for what you ask. If you use Traffic objective, Meta finds clickers -- people who click everything but never buy. Want sales? Use Sales objective with Purchase event.

### 2.4 Audiences

**Core Audiences:** Demographics, interests, behaviors. Many interests removed post-iOS 14.5.

**Custom Audiences:**

| Source | Window | Use |
|--------|--------|-----|
| Website visitors (Pixel) | 1-180 days | Retargeting |
| Customer list (email/phone) | N/A | Match rate ~60-70% |
| App activity | 1-180 days | Mobile retargeting |
| Video viewers | 3s, 25%, 50%, 75%, 95% | Video funnel |
| Instagram/Facebook engagers | 1-365 days | Warm audiences |
| Lead form openers | 1-90 days | Follow-up |

**Lookalike Audiences:**
- Based on Custom Audience seed. Sizes: 1% (most similar) to 10% (broadest)
- LAL 1% in Brazil = ~2.1 million people
- Post-iOS 14.5 decline: Meta recommends migrating to Advantage+ Audiences

### 2.5 Advantage+ Suite

**Advantage+ Sales Campaigns (renamed Feb 2025, formerly Advantage+ Shopping):**
- Now supports Sales, App Installs, and Lead Generation (not just e-commerce)
- Multiple ad sets allowed (previously limited to 1), each with up to 50 ads
- Added controls: custom audience exclusion, age/gender preferences
- Many advertisers report 15-30% superior ROAS vs manual campaigns
- When NOT to use: very niche products, long-cycle B2B, complex services

**Advantage+ Audience:**
- Replaces manual targeting with algorithmic suggestions
- Value Rules (2025): influence delivery without disabling Advantage+ -- assign more value to specific segments

**Andromeda (2025 infrastructure):**
- New ad retrieval engine replacing the previous system
- Processes greater creative variety simultaneously
- May cause temporary CPM volatility during adaptation

**Advantage+ Placements:** Default recommended -- let Meta distribute across all placements.

**Advantage+ Creative:** Auto-adjustments (crop, brightness, text overlay, music). Test on/off.

### 2.6 Pixel, CAPI, and Tracking Infrastructure

**Meta Pixel -- Standard Events:**

```javascript
fbq('track', 'PageView');
fbq('track', 'ViewContent', { content_ids: ['SKU123'], value: 99.90, currency: 'BRL' });
fbq('track', 'AddToCart', { content_ids: ['SKU123'], value: 99.90, currency: 'BRL' });
fbq('track', 'InitiateCheckout', { value: 99.90, currency: 'BRL' });
fbq('track', 'Purchase', { content_ids: ['SKU123'], value: 99.90, currency: 'BRL' });
fbq('track', 'Lead', { content_name: 'Contact form' });
```

**Conversions API (CAPI):**
- Server-side tracking, immune to ad blockers and iOS restrictions
- Deduplication: use identical `event_id` in Pixel and CAPI
- Implementation: Gateway (Shopify/WooCommerce plug-and-play), manual (API), or partner (Stape)
- Event Match Quality (EMQ): score 0-10. Target: EMQ > 6.0 for all events
- Critical parameters: `em` (email hash), `ph` (phone hash), `fn`/`ln` (name), `external_id`, `fbp`, `fbc`

**iOS 14.5+ Impact (ATT):**

| Area | Impact |
|------|--------|
| Attribution | Window reduced from 28d to 7d (click), 1d (view) |
| Reporting | Aggregated data, delayed up to 72h |
| Audiences | Smaller custom audiences, less precise LALs |
| Optimization | Fewer conversion signals for ML |
| Meta Revenue | ~USD 10B lost (2022 estimate) |

**2025 Attribution Changes:**
- Engaged-View: threshold reduced from 10s to 5s (or 97% of short videos)
- Incremental Attribution (April 2025): separates conversions truly caused by the ad from organic
- Recommendation: engaged-view for daily optimization, incremental for budget allocation decisions

### 2.7 Creative Testing Framework

**Phase 1: Concept Testing**
- 3-5 different creative concepts (angles, messages, formats)
- Budget: BRL 50-100/day per concept | Duration: 3-5 days or 500 impressions per ad
- Decision metric: CTR, hook rate (3s views / impressions), CPA

**Phase 2: Iteration Testing**
- Take winning concept(s), create 3-5 variations (different hooks, CTAs, colors)
- Budget: BRL 100-200/day per variation | Duration: 5-7 days
- Metric: CPA, ROAS

**Phase 3: Scaling**
- Validated creatives enter scale campaigns
- Monitor fatigue: when frequency > 3 and CTR drops > 20%, refresh
- Creative refresh cadence: new creatives every 2-4 weeks
- Keep "evergreen winners" running while they perform

### 2.8 Ad Formats

| Format | Specs | Best For |
|--------|-------|----------|
| Image (Feed) | 1080x1080 (1:1) or 1080x1350 (4:5) | E-commerce, awareness |
| Video (Feed) | 1080x1350 (4:5), 15-60s | Storytelling, demo |
| Reels | 1080x1920 (9:16), 15-90s | Reach, young engagement |
| Stories | 1080x1920 (9:16), 5-15s | Urgency, flash offers |
| Carousel | 1080x1080, 2-10 cards | Multi-product, sequential storytelling |
| Collection | Cover + catalog | Mobile e-commerce |
| Instant Experience | Full-screen mobile | Immersion, consideration |
| Dynamic Ads | Template + catalog | E-commerce retargeting |

---

## 3. Google Ads

### 3.1 Search Ads

Google Search is the only paid media channel based on **explicit intent**. The user types what they want.

**Keyword Match Types:**

| Type | Syntax | Triggers For |
|------|--------|-------------|
| Broad Match | tenis corrida | Related terms (sapatos esportivos, calcados running) |
| Phrase Match | "tenis corrida" | Phrases containing the meaning |
| Exact Match | [tenis corrida] | Terms with same exact meaning |

**2025 best practice:** Broad Match + Smart Bidding. The algorithm only shows the ad when it estimates high conversion probability, even for broad terms.

**Negative Keywords remain essential:**
- Create shared negative lists across campaigns
- Review Search Terms Report weekly
- Negative informational terms in conversion campaigns

### 3.2 Quality Score and Ad Rank

Quality Score (1-10) components:

| Factor | Weight | Measures |
|--------|--------|----------|
| Expected CTR | ~39% | Click probability based on history |
| Ad Relevance | ~22% | How relevant the ad is to the keyword |
| Landing Page Experience | ~39% | Quality, relevance, and speed of page |

**Ad Rank = Max CPC x Quality Score x Expected Impact of Extensions**

- QS 10 can pay 50% less per click than QS 5
- Slow landing page (>3s) destroys Quality Score
- Relevance triangle: keyword --> ad copy --> landing page

### 3.3 Responsive Search Ads (RSAs)

Since June 2022, only RSAs are available (Expanded Text Ads discontinued):
- Up to 15 headlines (30 chars each) + 4 descriptions (90 chars each)
- Google automatically combines the best combinations
- Include keyword in headline 1 and 2 (pin if necessary)
- Vary messages: benefit, urgency, social proof, CTA
- Target Ad Strength: "Excellent"

### 3.4 Display Network (GDN)

Reaches 90%+ of internet users via 2M+ sites, apps, and videos.

**Targeting types:** Contextual (keywords/topics), Audience (in-market, affinity, custom), Remarketing, Placement (specific sites), Demographics.

**Responsive Display Ads:** Provide images (1200x628 landscape, 1200x1200 square), logos, headlines, descriptions. Google adapts automatically.

### 3.5 YouTube Ads

| Format | Details | Best For |
|--------|---------|----------|
| Skippable In-Stream (TrueView) | Before/during/after videos, skippable after 5s | Awareness, consideration |
| Non-Skippable In-Stream | 15-20s, not skippable, CPM | Complete short messages |
| YouTube Shorts Ads | Vertical 9:16, up to 60s, between organic Shorts | Reach (200B daily views, 2025) |
| Video Reach Campaigns (VRC) | Auto-combines formats for max reach | Reach optimization |
| Video Action Campaigns (VAC) | Optimizes for conversions, CTA overlay | Website/app conversions |

**Hook in first 5 seconds is critical** -- if not captured, user skips.

### 3.6 Google Shopping

**Standard Shopping:** Manual bids per product/group. Use priority (High/Medium/Low) to control which campaign captures which search.

**Performance Max (PMax):**
- Automated campaign across ALL Google channels (Search, Display, YouTube, Shopping, Gmail, Discover, Maps)
- Provide: asset groups + feed + audience signals
- Negative keywords available since Jan 2025 (up to 10K per campaign since Mar 2025), applies only to Search/Shopping inventory
- Channel reporting available since Nov 2025
- When to use: e-commerce with broad catalog, sufficient conversion data
- When to avoid: long-cycle B2B, niche products, when granular control is essential

### 3.7 Smart Bidding

| Strategy | Optimizes For | When to Use |
|----------|--------------|-------------|
| Maximize Clicks | Click volume | Initial phase, data collection |
| Maximize Conversions | Conversion volume | Fixed budget, max conversions |
| Target CPA (tCPA) | Specific CPA | When you know acceptable CPA |
| Maximize Conversion Value | Total conversion value | E-commerce without ROAS target |
| Target ROAS (tROAS) | Specific ROAS | E-commerce with return target |

**Requirements:** Minimum 30 conversions in last 30 days (ideal: 50+). Learning period: 1-2 weeks. Start tCPA/tROAS ~10-20% above current, then tighten gradually.

### 3.8 Extensions (Assets)

| Extension | Shows | Avg CTR Impact |
|-----------|-------|---------------|
| Sitelink | Additional links to internal pages | +10-20% |
| Callout | Short benefit texts | +5-10% |
| Structured Snippet | Category/service lists | +5-10% |
| Call | Clickable phone number | +5-10% (mobile) |
| Price | Product/service prices | +10-15% |
| Promotion | Offers and discounts | +10-20% |
| Image | Image next to text | +5-15% |

**Best practice:** Add ALL relevant extensions. No downside -- Google only shows when estimated to improve performance.

---

## 4. TikTok Ads

### 4.1 Platform Overview

- ~1.9 billion MAUs (Q1 2026)
- 3rd largest ad platform (behind Google and Meta)
- Projected ad revenue: USD 34.8B (2026)
- Audience aging rapidly: 25-44 is fastest growing segment

**US ownership change (2025):** Banned Jan 19, signed joint venture with Oracle/Silver Lake/MGX on Jan 22. Additional compliance for targeting parameters and audience segments. All AI-generated content (AIGC) must be flagged via in-app toggle. Political ads remain prohibited.

### 4.2 Ad Formats

| Format | Details | Best For |
|--------|---------|----------|
| In-Feed Ads | For You Page, 9-60s vertical, CTA | Performance (must look native) |
| Spark Ads | Boost organic posts (own or creator's), keeps engagement | UGC, authenticity (CTR ~25% higher) |
| TopView | First ad on app open, up to 60s, premium CPM (USD 50-100+) | Launches, massive awareness |
| Branded Hashtag Challenge | Sponsored challenge on Discover, USD 150K+ | Virality |
| Catalog Ads (DSA) | Dynamic product ads from feed | E-commerce retargeting |

**TikTok's rule: "Don't make ads, make TikToks."**

### 4.3 TikTok Creative Center

Free tool at creative-center.tiktok.com:
- Top Ads Dashboard (by country, industry, objective)
- Trend Discovery (hashtags, music, creators)
- Audio Library (licensed music for ads)
- Creative Templates and AI Script Generator

### 4.4 Targeting

| Type | Details |
|------|---------|
| Demographics | Age, gender, location, language |
| Interests | Content categories consumed |
| Behaviors | Content interactions (likes, shares, follows) |
| Creator Interactions | Users who interacted with specific creator types |
| Custom Audiences | Website, customer list, app, engagement |
| Lookalike | Based on custom audiences, 1-10% |
| Smart Targeting | Broad targeting optimized by ML (equivalent to Advantage+) |

**Best practice:** Start broad and let the algorithm find the audience. The For You Page is already highly personalized.

---

## 5. LinkedIn Ads

### 5.1 The B2B Channel

- 1B+ members (2025)
- CPM 3-5x more expensive than Meta/TikTok
- CPC average: USD 5-15 (vs USD 0.50-2.00 on Meta)
- CPL average B2B: USD 50-200+
- **But:** Lead quality is incomparably superior for B2B

### 5.2 Unique B2B Targeting

| Criterion | Details |
|-----------|---------|
| Job Title | Exact title (CEO, CFO, Head of Marketing) |
| Job Function | Functional area (Marketing, Finance, Engineering) |
| Seniority | Level (Entry, Senior, Manager, Director, VP, C-suite) |
| Company Name | Specific company (Itau, Nubank, TOTVS) |
| Company Size | Employee count (1-10 to 10001+) |
| Industry | Sector (Technology, Finance, Healthcare) |
| Skills | Listed profile skills |
| Groups | Specific group members |
| Company Revenue | Company revenue (some markets) |

### 5.3 Account-Based Marketing (ABM)

**Matched Audiences:**
1. Company List Upload (up to 300K companies)
2. Contact Targeting (email upload, match rate ~30-50%)
3. Website Retargeting (Insight Tag)
4. Engagement Retargeting

**ABM 3-tier strategy:**

| Tier | Audience | Objective | Format |
|------|----------|-----------|--------|
| 1:1 | Top 10-50 accounts | Awareness + Meeting | Personalized InMail |
| 1:Few | Clusters of 50-200 | Education + Engagement | Sponsored Content + Thought Leadership |
| 1:Many | 200-1000+ accounts | Awareness + Demand Gen | Display + Video + Lead Gen Forms |

### 5.4 Ad Formats

| Format | Details |
|--------|---------|
| Sponsored Content | Feed posts (image, video, carousel, document, event) |
| Message Ads (InMail) | Direct inbox message, ~50% open rate, 1 per member per 45 days |
| Conversation Ads | Chatbot-style with multiple response options |
| Lead Gen Forms | Pre-filled with profile data, CVR 2-5x higher than external LP |
| Text Ads | Sidebar, very cheap (CPM USD 3-5), low CTR (<0.05%) |
| Dynamic Ads | Personalized with user photo/name |

### 5.5 Best Practices

1. Minimum audience: 50K+ members for proper optimization
2. Ideal frequency: 4-6 impressions per member per month
3. Creative refresh: every 4-6 weeks
4. Minimum budget: USD 50/day per campaign
5. Thought leadership ads: boost executive personal posts -- CTR 2-3x higher than company page
6. Document ads: interactive PDFs perform well for educational content

---

## 6. Programmatic and DSPs

### 6.1 RTB (Real-Time Bidding) Flow

```
1. User visits a web page
2. Publisher sends bid request to ad exchange/SSP
3. Ad exchange distributes to connected DSPs
4. Each DSP evaluates user (cookies, device ID, context) and decides bid
5. DSPs send bid responses with bid amount and creative
6. Ad exchange selects winner (highest bid)
7. Winner's ad is served to user
8. Impression, click, and conversion tracking
```

Total latency: 50-100ms.

### 6.2 Ecosystem Components

| Component | Function | Examples |
|-----------|----------|----------|
| DSP | Automated buying for advertisers | DV360, The Trade Desk, Amazon DSP, Xandr |
| SSP | Automated selling for publishers | Google Ad Manager, Magnite, PubMatic |
| Ad Exchange | Marketplace for DSP/SSP transactions | Google AdX, OpenX, Xandr |
| DMP | Data aggregation for targeting (declining) | Oracle BlueKai, Lotame |
| CDP | First-party data management | Segment, RudderStack, mParticle |
| Ad Server | Serve, track, optimize creatives | Google CM360, Sizmek |
| Verification | Viewability, brand safety, fraud | IAS, DoubleVerify, MOAT |

### 6.3 DV360 vs The Trade Desk

**DV360 (Google):**
- Access to Google inventory (YouTube, GDN) + open web
- Native integration with GA4, CM360, SA360
- Programmatic Guaranteed and Preferred Deals

**The Trade Desk (independent):**
- Unified ID 2.0 (post-cookie identity solution)
- Koa AI (proprietary ML optimization)
- Strong CTV/OTT presence (Netflix, Disney+, Peacock)
- No conflict of interest (not a publisher)

### 6.4 Transaction Types

| Type | Price | Inventory | Use |
|------|-------|-----------|-----|
| Open Auction | Variable (auction) | Remnant | Scale and performance |
| Private Auction | Floor price | Select | Premium with competition |
| Preferred Deal | Fixed negotiated | Reserved | Publisher relationship |
| Programmatic Guaranteed | Fixed negotiated | Guaranteed | Premium guaranteed |

### 6.5 Viewability and Brand Safety

**Viewability (MRC Standard):**
- Display: 50% of pixels visible for 1 second
- Video: 50% of pixels visible for 2 continuous seconds
- Benchmark: >70% is good

**Brand Safety:**
- Pre-bid filtering (block before bidding) vs post-bid monitoring
- Inclusion lists (safest) vs exclusion lists (more scale)
- Tools: IAS, DoubleVerify, Oracle Moat

---

## 7. Attribution and Measurement

### 7.1 The Fundamental Problem

1. Multi-touch journey: average customer interacts with 7-13 touchpoints before converting
2. Cross-device: same user sees ads on mobile, desktop, tablet
3. Walled gardens: each platform attributes conversions to itself
4. Privacy restrictions: iOS 14.5, cookie limitations, GDPR/LGPD
5. Offline-to-online: physical store visits influenced by online ads

### 7.2 Attribution Models

| Model | Credit Distribution | Best For |
|-------|--------------------|----------|
| Last Click | 100% to last click | Simple, but biased to bottom-funnel |
| First Click | 100% to first touch | Evaluating discovery |
| Linear | Equal across all touchpoints | Democratic but unrealistic |
| Time Decay | More to recent touchpoints | Short sales cycles |
| Position-Based (U-shaped) | 40% first, 40% last, 20% middle | B2B |
| Data-Driven (DDA) | ML determines real impact | Best available (requires volume) |

### 7.3 Media Mix Modeling (MMM)

Econometric (top-down) approach using statistical regression to determine each channel's impact.

**How it works:**
1. Collect 12-36 months of historical spend and results per channel
2. Include control variables: seasonality, price, competition, macro
3. Statistical regression to isolate each channel's effect
4. Output: response curves per channel

**Open-Source MMM tools:**
- **Meta Robyn** (R): github.com/facebookexperimental/Robyn
- **Google Meridian** (Python): github.com/google/meridian
- These democratized MMM -- previously restricted to expensive consultancies (USD 50-200K)

**Advantages:** Privacy-safe, captures offline/cross-channel effects, includes external factors.
**Disadvantages:** Requires 2-3 years of data, limited granularity (weekly/monthly).

### 7.4 Incrementality Testing

Measures real causal effect: "Would these conversions have happened without the ad?"

**Lift Studies:**
- Split audience into test (sees ads) and control (does not)
- Compare conversions between groups. Difference = incremental effect
- Meta, Google, TikTok offer native lift studies

**Geo-Tests:**
- Choose similar regions as test and control
- Run campaign only in test regions
- More robust than audience-based (no data leakage)

**Switchback Tests:**
- Alternate on/off periods across regions
- Controls for seasonality and temporal trends

### 7.5 Post-Cookie World (2025-2026 Update)

**Key reversal:** Google will NOT eliminate third-party cookies in Chrome. Instead, user-choice model (cookies remain enabled by default).

**Privacy Sandbox status:**
- Topics API: limited adoption (~32% of programmatic buyers, early 2025)
- Protected Audience API (ex-FLEDGE): minimal industry adoption
- October 2025: Google retired most Sandbox technologies, keeping only CHIPS, FedCM, and Private State Tokens

**Practical impact (even without formal deprecation):**
- First-party data remains the most valuable asset
- Server-side tracking (CAPI) is essential -- Safari/Firefox already block third-party cookies
- Walled gardens gain power (logged-in users)
- Contextual advertising resurges
- Industry prepared for cookieless world and is not going back

### 7.6 UTM Strategy

```
https://site.com/landing?
  utm_source=meta&
  utm_medium=paid-social&
  utm_campaign=prospecting-lal1-2025q1&
  utm_content=video-depoimento-30s&
  utm_term=lookalike-1pct-purchasers
```

| Parameter | Use | Example |
|-----------|-----|---------|
| utm_source | Platform | meta, google, tiktok, linkedin |
| utm_medium | Channel type | paid-social, paid-search, display |
| utm_campaign | Campaign name | prospecting-lal1-2025q1 |
| utm_content | Creative variation | video-depoimento-30s |
| utm_term | Keyword or audience | lookalike-1pct-purchasers |

**Rules:** Always lowercase, no spaces (use hyphens), consistent naming, include period/quarter, never use UTMs on internal links.

---

## 8. Creative Strategy

### 8.1 Creative is the New Targeting

With automation of audiences and bidding, creative is the most important performance variable. Meta and TikTok confirm high-quality creatives can reduce CPA by 50-70%.

- Audience algorithms (Advantage+, Smart Targeting) converge to similar results between advertisers
- Automated bidding equalizes bids
- The only differentiator is what the user sees: the creative
- Platforms prioritize ads that generate engagement

### 8.2 Ad Fatigue Indicators and Refresh Cadence

**Indicators:**
- Frequency > 3-4 (Meta), > 6-7 (LinkedIn)
- CTR dropping > 20% vs baseline
- CPA rising > 30% vs baseline

| Platform | Refresh Cadence | Reason |
|----------|----------------|--------|
| Meta (Prospecting) | 2-3 weeks | Highly dynamic feed |
| Meta (Retargeting) | 3-4 weeks | Smaller audience, faster fatigue |
| TikTok | 1-2 weeks | Trend platform, content ages fast |
| Google Search | 4-8 weeks | Intent-based, less visual |
| LinkedIn | 4-6 weeks | Less congested feed |

### 8.3 The 3-Second Rule for Video

65% of branding value is delivered in the first 3 seconds (Meta data).

**Effective hook types:**

| Type | Example | Mechanism |
|------|---------|-----------|
| Pattern Interrupt | Abrupt movement, quick cut, unexpected element | Breaks visual expectation |
| Bold Statement | "You're wasting 50% of your ad budget" | Shock/curiosity |
| Question | "Did you know 90% of e-commerces make this mistake?" | Cognitive engagement |
| Social Proof | "100,000 companies already use it" | Instant credibility |
| Before/After | Visual transformation result | Desire for result |
| Native/UGC | Person talking to camera like a friend | Authenticity |
| Controversy | "Google Ads doesn't work. Let me explain why." | Polarization drives clicks |

**Hook metrics:**
- **Hook Rate:** 3s video views / impressions. Benchmark: >30% good, >50% excellent
- **Hold Rate:** ThruPlays (15s or complete) / 3s views. Benchmark: >25%

### 8.4 UGC (User-Generated Content)

Highest performing format in paid social (Meta and TikTok):
- 92% of consumers trust "real people" recommendations over advertising (Nielsen, 2023)
- CPA typically 30-50% lower than polished creatives

**UGC types for ads:**
1. Testimonial: real customer sharing experience
2. Unboxing: reaction to receiving product
3. Tutorial/How-to: usage demonstration
4. Day-in-my-life: product integrated into routine
5. Comparison: before/after or vs competitor
6. Problem-Agitate-Solution: presents pain, amplifies, shows solution

**Where to source UGC:** Trend.io, Billo, JoinBrands, Social Cat, ambassador programs, micro-influencers (1K-10K followers).

### 8.5 Ad Copywriting Frameworks

**AIDA (Attention, Interest, Desire, Action):**
```
[A] Stop wasting money on ads that don't convert.
[I] 73% of Brazilian advertisers spend R$5K+/month without measuring real ROAS.
[D] With our method, clients reduce CPA by 40% in the first 30 days.
[A] Schedule your free audit --> link
```

**PAS (Problem, Agitate, Solution):**
```
[P] Your cost per lead rising every month?
[A] While you spend more, competitors pay half for the same lead.
[S] Our platform optimizes your campaigns automatically with AI. Free 14-day trial.
```

**BAB (Before, After, Bridge):**
```
[B] Before, company X spent R$30K/month on ads with 2x ROAS.
[A] Today, same budget, ROAS is 6x -- tripled revenue.
[B] The secret? Data-driven campaign structure + weekly creative testing.
```

### 8.6 Creative-Landing Page Congruence

**Congruence principle:**
- Ad headline = landing page headline (or very similar)
- Ad image = landing page hero image
- Ad offer = landing page offer (no bait and switch)
- Ad CTA = landing page CTA
- Ad tone/voice = landing page tone/voice

Higher Message Match Score = higher conversion rate + better Quality Score (Google).

---

## 9. CRO and Landing Pages

### 9.1 CRO Impact on Paid Media

```
CPA = CPC / CVR
If CPC = R$2.00 and CVR = 5%  --> CPA = R$40
If CPC = R$2.00 and CVR = 10% --> CPA = R$20
Doubling CVR = half the CPA
```

### 9.2 High-Converting Landing Page Anatomy

**Above the Fold:**

| Element | Function | Best Practice |
|---------|----------|---------------|
| Headline | Capture attention, communicate value | Main benefit in <10 words |
| Sub-headline | Expand headline | How the product delivers the benefit |
| Hero image/video | Visualize the result | Product in use or visible result |
| Primary CTA | Desired action | Contrasting button, action text ("Start free" not "Submit") |
| Social proof | Immediate credibility | Client logos, user count, rating |

**Below the Fold:**

| Section | Function |
|---------|----------|
| Benefits (3-5) | Expand value proposition with icons |
| How it works | 3 simple steps to demystify |
| Testimonials | Real cases with photo, name, title, numeric result |
| FAQ | Eliminate objections (price, guarantee, timeline, support) |
| Secondary CTA | Repeat CTA (same button and offer) |
| Trust badges | Security seals, guarantee, payment methods |

### 9.3 Page Speed Impact

| Load Time | Bounce Rate Increase |
|-----------|---------------------|
| 1-3 seconds | +32% |
| 1-5 seconds | +90% |
| 1-6 seconds | +106% |
| 1-10 seconds | +123% |

**Critical optimizations:**
- Compress images (WebP instead of PNG/JPEG)
- Lazy loading for below-fold elements
- Minimize JavaScript and CSS
- Use CDN (Cloudflare, Vercel Edge)
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1

### 9.4 A/B Testing Priority (by impact)

1. **Offer** -- what you are offering (highest impact)
2. **Headline** -- the main promise
3. **Hero image/video** -- dominant visual
4. **CTA** -- button text and color
5. **Social proof** -- type and position
6. **Layout** -- element organization
7. **Form length** -- number of fields (fewer = more conversions)
8. **Pricing** -- presentation of pricing

**Valid test requirements:**
- Calculate sample size before starting
- Minimum statistical significance: 95% (p-value < 0.05)
- Run for at least 1-2 weeks (capture weekly variation)
- Change ONE variable per test
- Do not end test prematurely based on "trend"

### 9.5 Form Optimization

- Fewer fields = more conversions. Each additional field reduces CVR by 5-10%
- Submit button with action text ("Receive proposal" vs "Submit")
- Multi-step forms: CVR typically 20-30% higher than single long form
  - Step 1: low friction (email, name)
  - Step 2+: qualification (title, company, budget)
- Real-time validation, autofill compatible

### 9.6 Landing Page Tools

| Tool | Focus | Price (monthly) | Highlight |
|------|-------|-----------------|-----------|
| Unbounce | LPs + popups | USD 99-625 | Smart Traffic (AI routing) |
| Instapage | Enterprise LPs | USD 199+ | Post-click optimization, AdMap |
| Leadpages | SMB LPs | USD 49-99 | Templates, ease of use |
| ClickFunnels | Complete funnels | USD 97-297 | Infoproducts focus |
| Webflow | Design + dev | USD 14-39 | Full customization, native SEO |
| Carrd | Single-page sites | USD 9-49/year | Ultra simple, fast |

---

## 10. Audiences and Segmentation

### 10.1 First-Party Data Strategy

| Source | Data Type | Paid Media Use |
|--------|-----------|----------------|
| Website | Pages visited, time, events | Custom Audiences, remarketing |
| App | In-app behavior, purchases | Custom Audiences, app retargeting |
| CRM | Email, phone, purchase history | Customer Match, LALs |
| Email | Opens, clicks, engagement | Engagement segmentation |
| POS/Checkout | Transactions, products, LTV | High-value LALs |
| Forms | Leads, declared interest | Nurturing audiences |
| Chat/Support | Conversations, tickets | Satisfaction segmentation |

### 10.2 CDP Options

| CDP | Focus | Price | Highlight |
|-----|-------|-------|-----------|
| Segment (Twilio) | Real-time data | USD 120+/mo | Developer-friendly, broad integrations |
| RudderStack | Open-source first | Free + USD 500+/mo | Self-hosted, warehouse-native |
| mParticle | Enterprise mobile | Enterprise | Mobile-first |
| Klaviyo | E-commerce + email | USD 20+/mo | Email + SMS + CDP integrated |

### 10.3 Retargeting by Funnel Stage

| Stage | Audience | Message | Format |
|-------|----------|---------|--------|
| Top (Awareness) | Video viewers (25%+) | Educational, storytelling | Video ads |
| Middle (Consideration) | Site visitors (no conversion) | Benefits, social proof, cases | Carousel, testimonials |
| Bottom (Decision) | Cart abandoners, form starters | Urgency, discount, guarantee | Dynamic product ads |
| Post-Purchase | Recent buyers | Upsell, cross-sell, review | Product recommendations |

**Retargeting windows:**

| Window | Use |
|--------|-----|
| 1-3 days | Cart abandoners (max urgency) |
| 7 days | Recent site visitors (high intent) |
| 14-30 days | Cooler engagers (awareness refresh) |
| 60-90 days | Re-engagement (special offer) |
| 180 days | Winback (reactivate inactive) |

### 10.4 Funnel-Based Audience Architecture

```
TOFU (Cold audiences)
  - LAL 1% of purchasers
  - LAL 1% of high-LTV customers
  - Interest-based audiences
  - Broad targeting (Advantage+)
  - Contextual/keyword targeting

MOFU (Warm audiences)
  - Video viewers (25%+)
  - Instagram/Facebook engagers
  - Website visitors (7-30 days, no conversion)
  - Blog readers / lead magnet downloaders

BOFU (Hot audiences)
  - Cart abandoners (1-7 days)
  - Product page viewers (1-14 days)
  - Form starters (not completed)
  - Free trial users (not converted)
  - Past purchasers (cross-sell)
```

### 10.5 Exclusion Lists

| Exclusion List | Why |
|----------------|-----|
| Current customers (in prospecting) | Don't spend on who already bought |
| Recent purchasers (last 7-14 days) | Avoid "buyer's remorse" feeling |
| Employees and internal team | Don't inflate metrics falsely |
| Leads already in pipeline (CRM) | Avoid confusion with sales |
| Users who clicked "hide ad" | Respect preference, protect brand |
| Bot/click fraud exclusions | Protect budget |

---

## 11. Budget and Bidding

### 11.1 Budget Allocation by Funnel

**Growth-stage company (acquisition):**

| Funnel | % Budget | Objective |
|--------|----------|-----------|
| TOFU | 60-70% | Prospecting, new audiences |
| MOFU | 15-20% | Nurturing, engagement |
| BOFU | 10-20% | Retargeting, conversion |

**Established company (profitability):**

| Funnel | % Budget | Objective |
|--------|----------|-----------|
| TOFU | 30-40% | Pipeline renewal |
| MOFU | 20-30% | Qualification |
| BOFU | 30-40% | Conversion and retention |

### 11.2 Diminishing Returns

```
Budget R$5K   --> CPA R$30   (first leads are cheap)
Budget R$10K  --> CPA R$35   (still efficient)
Budget R$20K  --> CPA R$45   (starting to saturate)
Budget R$50K  --> CPA R$70   (audience saturated)
Budget R$100K --> CPA R$120  (severe diminishing returns)
```

**How to find the optimal point:**
- Plot CPA vs Budget curve incrementally
- When marginal CPA > acceptable CPA, redirect to another channel or audience
- Diversify across platforms before scaling vertically
- Use MMM to model response curves per channel

### 11.3 Pacing and Dayparting

**Pacing:**
- Standard (distributed): budget spread evenly throughout the day. Recommended for most cases.
- Accelerated: spends as fast as possible. For flash sales and urgency.

**Dayparting:**
- Analyze conversion data by hour and day of week
- B2B: focus Mon-Fri 8am-6pm. E-commerce: 24/7 with budget concentrated on peaks
- Caution: reduces total data volume, may hurt algorithm learning

### 11.4 Geo-Targeting Strategies

- **National:** E-commerce with national delivery, SaaS
- **Regional:** Local services, franchises, physical stores
- **Radius:** Around specific addresses (store, event, competitor)
- **Metro/DMA:** Metropolitan areas (SP, RJ, BH, POA)
- **Bid adjustments by region:** Increase bids in higher-converting regions
- **Region exclusion:** Unserved areas or high-CPA regions

### 11.5 Portfolio Bidding (Google)

Apply a single bid strategy across multiple campaigns:
- Algorithm optimizes between campaigns (reallocates from high to low CPA)
- Shared conversion data improves learning
- Use when campaigns have similar objectives but insufficient individual conversion volume

---

## 12. Analytics and Reporting

### 12.1 Metrics That Matter

**Vanity metrics (avoid as primary KPI):** Impressions, Reach, CTR (alone), CPC (alone), Engagement.

**Result metrics (real KPIs):**

| Metric | Measures | Formula |
|--------|----------|---------|
| CPA | Cost per client/lead | Cost / Conversions |
| ROAS | Return on ad spend | Ad Revenue / Ad Cost |
| CAC | Total acquisition cost | (Ads + Time + Tools + Agency) / Clients |
| LTV:CAC | Acquisition sustainability | LTV / CAC. Ideal: >3:1 |
| MER | Total marketing efficiency | Total Revenue / Total Marketing Cost |
| Blended CPA | Average CPA across all channels | Total Cost / Total Conversions |
| Payback Period | Time to recover CAC | CAC / Monthly revenue per client |
| Contribution Margin | Profit after variable costs | Revenue - COGS - Ads - Shipping - Payment |

### 12.2 MER (Marketing Efficiency Ratio)

```
MER = Total Business Revenue / Total Marketing Cost

Example:
Monthly revenue: R$500,000
Total marketing cost: R$100,000
MER = 5.0x

If MER rises when you increase budget --> marketing is working
If MER falls --> diminishing returns or non-incremental marketing
```

Advantages: no channel attribution dependency, captures cross-effects, simple, less manipulable.

### 12.3 GA4 Attribution

- **Data-Driven Attribution (DDA):** Default. ML determines touchpoint weight. Requires minimum volume.
- Click-through window: 30 days (default), configurable up to 90 days
- Engaged view window: 3 days (for video ads)
- Always compare GA4 attribution with platform data (they always diverge)

### 12.4 Dashboard Tools

| Tool | Focus | Price | Highlight |
|------|-------|-------|-----------|
| Looker Studio | Free BI | Free | Native Google connectors |
| Supermetrics | Data pipeline | EUR 39-299/mo | 100+ source connectors |
| Funnel.io | Marketing data warehouse | EUR 300+/mo | Auto normalization/cleaning |
| Triple Whale | E-commerce analytics | USD 100-500/mo | Own pixel, attribution, benchmarks |
| Northbeam | Multi-touch attribution | USD 500+/mo | MMM-lite, incrementality |
| Hyros | Call tracking attribution | USD 199+/mo | Server-side, call attribution |

### 12.5 Weekly Report Template

```
1. Overview: Budget spent vs planned, blended ROAS, blended CPA, MER
2. By channel: Meta, Google, TikTok, LinkedIn -- spend, ROAS, CPA, CVR
3. Top performers: Top 5 creatives by CPA/ROAS
4. Losers: Bottom 5 creatives (pause or iterate)
5. Audiences: Performance by audience/funnel stage
6. Actions: What was done this week + what will be done next
7. Budget: Reallocation proposals based on performance
```

---

## 13. AI and Automation

### 13.1 AI in Paid Media (2025-2026)

**Content creation:**
- Copy: ChatGPT, Claude, Jasper for headlines, ad copy, video scripts
- Images: Midjourney, DALL-E 3, Adobe Firefly
- Video: Runway, Pika, HeyGen, Synthesia
- Audio: ElevenLabs for voiceovers, Suno for jingles

**Meta Generative Ad Model (GEM) -- 2026 horizon:**
- Advertiser provides product URL, budget, and basic prompt
- AI generates complete campaign (images, copy, headlines, animations)
- Expected end of 2026: AI generates ad, image, video, text with specific budget recommendations

**Google AI Max for Search (2025-2026):**
- New campaign type applying AI automation directly to Search campaigns
- Text guidelines beta expanded globally Feb 2026 for AI Max and PMax

**Limitations:** AI generates volume but not guaranteed quality. "AI slop" is saturating feeds. The differentiator is not using AI, but using AI with unique strategy and brand voice.

### 13.2 Automated Bidding Across Platforms

| Platform | Tool | Function |
|----------|------|----------|
| Google | Smart Bidding (tCPA, tROAS, Max Conversions) | Real-time bid adjustment per auction |
| Meta | Advantage Campaign Budget + Cost Cap/ROAS Cap | Budget distribution and bid adjustment |
| TikTok | Smart Performance Campaign | Fully automated campaign |
| LinkedIn | Maximum Delivery + Target Cost | Delivery optimization |

**Trend:** Human role shifts from "bid operator" to "input strategist" (creatives, data, audience signals).

### 13.3 DCO (Dynamic Creative Optimization)

1. Advertiser provides elements (images, headlines, CTAs, colors)
2. Platform/tool combines elements automatically
3. ML optimizes combinations per user/segment
4. Personalized creative at scale

**Tools:** Meta Dynamic Creative (native), Google Responsive Ads (native), Celtra, Flashtalking, Innovid, Marpipe.

### 13.4 AI Ad Copy Workflow

1. **Human brief:** Define angle, tone, audience, offer, constraints
2. **AI generation:** Request 10-20 headline and copy variations
3. **Human curation:** Select best, edit for brand voice
4. **Test:** Run variants as A/B test on platform
5. **Feedback loop:** Feed AI with results to improve future generations

**Effective prompt template:**
```
Create 10 headlines (max 30 characters each) for a Google Search ad.
Product: [product]
Audience: [persona]
Main benefit: [benefit]
Differentiator: [differentiator]
Tone: [professional/casual/urgent]
Include: [mandatory keyword]
Avoid: [cliches, unproven superlatives]
```

---

## 14. Brazilian Context

### 14.1 Market Overview

| Metric | Value |
|--------|-------|
| Digital ad investment (2025) | ~BRL 42B (IAB Brasil) / ~USD 17.3B |
| YoY growth | ~11-18% |
| Digital share of total ad spend | ~65% (surpassed TV in 2023) |
| Largest platform | Google (~40% share) |
| Second largest | Meta (~25% share) |
| Fastest growing | TikTok, CTV |
| Internet users | ~185M (~87% of population) |
| Mobile-first | ~80% of traffic is mobile |

### 14.2 CPM Benchmarks Brazil

| Platform | Avg CPM Brazil (BRL) | Avg CPM USA (USD) |
|----------|---------------------|-------------------|
| Meta (Feed) | R$15-40 | $10-25 |
| Meta (Reels) | R$10-25 | $8-18 |
| Google Search | R$5-30 (per click) | $2-15 (per click) |
| Google Display | R$3-10 | $2-8 |
| YouTube | R$15-35 | $10-30 |
| TikTok | R$8-25 | $6-20 |
| LinkedIn | R$40-120 | $30-80 |

### 14.3 PIX Checkout Impact

PIX launched November 2020 by the Central Bank, now the most popular payment method in Brazil.

**Impact on paid media:**
- Checkout with PIX has CVR ~15-25% higher than credit card
- Processing cost: 0% (vs 2-5% for cards)
- Instant confirmation (vs days for boleto/card approval)
- "PIX discount" strategy: offer 5-10% discount for PIX payment

**Best practices for ads with PIX:**
- Mention "PIX com desconto" in ad copy
- Highlight "pagamento instantaneo" on landing page
- A/B test landing pages with PIX vs card as primary option
- Retarget cart abandoners mentioning PIX as alternative

### 14.4 Tax on Ad Spend (Nota Fiscal)

**International platforms (Meta, Google, TikTok):**
- Charge in BRL via credit card or boleto
- Issue invoice, not Brazilian nota fiscal
- Advertiser needs fictional exchange operation for accounting
- IOF unified at 3.5% on all international credit/debit/prepaid transactions since 2025

**Brazilian agencies as intermediaries:**
- Resell platform inventory, issue Brazilian nota fiscal
- Typical markup: 10-20% on investment
- Advantage: fiscal simplification. Disadvantage: additional cost

### 14.5 WhatsApp Click-to-Message Ads

WhatsApp is the most used app in Brazil (99% of smartphones).

**Click-to-WhatsApp Ads:**
- Ad in Feed/Stories/Reels with CTA "Send message"
- Opens direct conversation on business WhatsApp
- Ideal for: local services, real estate, education, health, automotive
- CPA typically 40-60% lower than traditional forms in Brazil
- Integration with WhatsApp Business API for response automation

**Best practices:**
- Automated welcome message (don't leave user waiting)
- Chatbot qualification before passing to human
- Track via CAPI (conversation start event)
- Segment by business hours (team available to respond)

### 14.6 Seasonality Calendar

| Period | Event | Impact on Ads |
|--------|-------|---------------|
| January | Holidays, back to school | Low CPMs, low purchase intent |
| March | Consumer Day (03/15) | E-commerce peak, CPMs rise |
| May | Mother's Day | Largest sales date after Christmas |
| June | Valentine's Day BR (06/12), Festas Juninas | Gifts + celebrations |
| August | Father's Day | Moderate peak |
| September | Semana do Brasil | "Brazilian Black Friday" attempt |
| October | Children's Day (10/12) | Toys and children's peak |
| November | Black Friday (last Friday) | LARGEST CPM and volume peak |
| December | Christmas + New Year | Absolute sales peak |

**Budget implications:**
- Reserve 30-40% of annual budget for Q4 (October-December)
- CPMs can rise 50-200% during Black Friday vs annual average
- Plan Black Friday creatives 60+ days in advance
- Test audiences and creatives in September-October to scale in November

### 14.7 Regulation: CONAR and Legislation

**CONAR** (Conselho Nacional de Autorregulamentacao Publicitaria): self-regulatory body. Not legally binding but widely respected.

**Rules relevant to digital ads:**
- Advertising must be clearly identified (influencer disclosure required)
- Deceptive or abusive advertising prohibited
- Child-targeted advertising has severe restrictions (CDC + ECA)
- Alcoholic beverages: time and age-targeting restrictions
- Medications: prescription advertising prohibited, OTC restricted
- Financial services: mandatory risk disclaimers

**Legal framework:**
- **CDC** (Consumer Defense Code): basis for deceptive/abusive advertising
- **LGPD**: consent for collection and use of personal data in targeting
- **Marco Civil da Internet**: neutrality and privacy principles
- **CONAR Resolution on influencers**: mandatory disclosure (#publi, #ad)

### 14.8 Brazilian Agency Landscape

**Global holdings:** WPP (GroupM), Publicis Groupe, Dentsu, IPG.

**Notable Brazilian independent agencies:** Raccoon (S4 Capital), Cadastra, GhFly (Keyrus), V4 Company (franchise model).

**Compensation models:**

| Model | How It Works | When to Use |
|-------|-------------|-------------|
| Fixed fee | Monthly value regardless of results | Predictable scope |
| % of investment | 10-20% of media budget | Market standard |
| Performance fee | Bonus for results (CPA, ROAS) | Incentive alignment |
| Hybrid | Fixed fee + performance | Most balanced |

---

## 15. Checklists

### 15.1 Campaign Launch Checklist

- [ ] Objective aligned with business goal (not vanity metrics)
- [ ] Pixel/CAPI installed and firing correctly (EMQ > 6.0)
- [ ] Conversion events configured and tested
- [ ] Audiences defined (TOFU/MOFU/BOFU)
- [ ] Exclusion lists configured (customers, employees, recent buyers)
- [ ] Budget allocated by funnel stage
- [ ] Creatives meet platform specs (dimensions, duration, file size)
- [ ] Ad copy reviewed (no policy violations, clear CTA)
- [ ] Landing page live, fast (<3s load), mobile-optimized
- [ ] Landing page matches ad creative (message match)
- [ ] UTMs configured and tested
- [ ] GA4 goals/events tracking confirmed
- [ ] Negative keywords added (Google Search)
- [ ] Extensions/assets added (Google)
- [ ] A/B test plan documented
- [ ] Bid strategy selected with rationale
- [ ] Geo-targeting configured correctly
- [ ] Schedule/dayparting set (if applicable)

### 15.2 Weekly Optimization Checklist

- [ ] Review Search Terms Report (Google) -- add negatives
- [ ] Check frequency by ad/ad set -- pause fatigued creatives (frequency > 3-4)
- [ ] Compare CPA/ROAS by audience -- reallocate budget
- [ ] Review top and bottom performing creatives
- [ ] Check landing page performance (CVR, bounce rate, load time)
- [ ] Verify pixel/CAPI event firing and EMQ scores
- [ ] Review budget pacing vs plan
- [ ] Check for audience overlap between ad sets
- [ ] Update exclusion lists with new customers/leads
- [ ] Plan next creative batch if refresh is due
- [ ] Document insights in weekly report

### 15.3 Creative Brief Checklist

- [ ] Target audience/persona clearly defined
- [ ] Main benefit/value proposition stated
- [ ] Specific angle/message (not generic)
- [ ] Hook strategy defined (first 3 seconds for video)
- [ ] CTA specified (what action, what words)
- [ ] Platform and format specified (specs included)
- [ ] Brand guidelines referenced (logo, colors, fonts, tone)
- [ ] Competitor examples reviewed
- [ ] Success metrics defined (hook rate, CTR, CPA target)
- [ ] Variations planned (2-3 hooks, 2-3 CTAs minimum)

### 15.4 CAPI Implementation Checklist

- [ ] Server-side events sending correctly (test events tool)
- [ ] Event deduplication configured (matching event_id in Pixel + CAPI)
- [ ] User parameters included: em (email hash), ph (phone hash)
- [ ] Additional parameters: fn, ln, external_id, fbp, fbc
- [ ] Event Match Quality > 6.0 for all key events
- [ ] All standard events covered: PageView, ViewContent, AddToCart, Purchase, Lead
- [ ] Custom events configured if needed
- [ ] Gateway or API integration documented
- [ ] Monitoring/alerting set up for event drops

### 15.5 Attribution Readiness Checklist

- [ ] GA4 properly configured with all conversion events
- [ ] UTMs standardized across all campaigns and platforms
- [ ] Cross-platform reporting dashboard built (Looker Studio or equivalent)
- [ ] MER tracking in place (total revenue / total marketing cost)
- [ ] Blended CPA tracked alongside per-channel CPA
- [ ] Incrementality test plan documented (at least 1 per quarter)
- [ ] First-party data strategy defined (CDP or manual)
- [ ] Server-side tracking active (CAPI for Meta, enhanced conversions for Google)
- [ ] Attribution model selected with rationale documented

---

## Key References

### Books

| Book | Author | Key Takeaway |
|------|--------|-------------|
| Scientific Advertising | Claude Hopkins (1923) | Foundation of response-based advertising |
| Breakthrough Advertising | Eugene Schwartz (1966) | 5 levels of consumer awareness for ad copy |
| Influence | Robert Cialdini (1984) | 6 persuasion triggers for ads |
| Ultimate Guide to Google Ads | Perry Marshall (2020) | Comprehensive Google Ads reference |
| $100M Offers | Alex Hormozi (2021) | Creating irresistible offers |
| $100M Leads | Alex Hormozi (2023) | Complete lead generation framework |
| Cashvertising | Drew Eric Whitman (2008) | 21 psychological ad principles |

### Open-Source Tools

- **Meta Robyn** (R): github.com/facebookexperimental/Robyn -- MMM
- **Google Meridian** (Python): github.com/google/meridian -- MMM
- **TikTok Creative Center**: creative-center.tiktok.com -- trends and templates

### Learning Channels

| Resource | Format | Focus |
|----------|--------|-------|
| Google Skillshop | Free certifications | Google Ads official |
| Meta Blueprint | Free certifications | Meta Ads official |
| Solutions 8 (YouTube) | Video tutorials | Advanced Google Ads |
| Ben Heath (YouTube) | Video tutorials | Meta Ads |
| Jon Loomer | Blog | Advanced Facebook Ads |
| Foxwell Founders | Private community | Facebook/Instagram Ads practitioners |
| Search Engine Land | News + analysis | Search marketing |

---

*Source: MS-005 Paid Traffic Master System. Research by @analyst (Scope), verified by @research-orqx (Prism). Last updated: 2026-04-07.*
