# Community Platforms Engineering Reference

> **Source:** MS-010 Forum & Community Platform Engineering Research
> **Squad:** squad-research | **Agent:** @analyst (Sonar)
> **Last updated:** 2026-04-10
> **Coverage:** 8 core systems, 9 platforms, 80+ sources

---

## Table of Contents

1. [Social Graph Engine](#1-social-graph-engine)
2. [Information Architecture](#2-information-architecture)
3. [Thread Engine & Ranking Algorithms](#3-thread-engine--ranking-algorithms)
4. [Trust, Moderation & Governance](#4-trust-moderation--governance)
5. [Gamification & Identity](#5-gamification--identity)
6. [Growth Loops & Virality](#6-growth-loops--virality)
7. [Monetization Stack](#7-monetization-stack)
8. [SEO Engine & Frontend](#8-seo-engine--frontend)
9. [Platform Comparative Matrix](#9-platform-comparative-matrix)
10. [Implementation Checklists](#10-implementation-checklists)
11. [Key References](#11-key-references)

---

## 1. Social Graph Engine

### Barabasi-Albert Model (Scale-Free Networks)

Real social networks follow **power-law degree distributions** where a few hub nodes hold vastly more connections than most. Two mechanisms drive this:

1. **Growth** -- networks continuously add new nodes
2. **Preferential attachment** -- new nodes prefer connecting to well-connected nodes ("rich-get-richer")

Degree distribution: `P(k) ~ k^(-gamma)`, typically gamma between 2 and 3.

**Platform manifestation:** A few subreddits dominate Reddit traffic. A few Stack Overflow users answer most questions. A few Discord servers attract millions of members.

### Granovetter's Strength of Weak Ties (1973)

Weak ties (acquaintances) are more valuable than strong ties for **information diffusion**. Strong ties cluster in dense groups sharing the same information. Weak ties bridge clusters, enabling novel information flow.

| Mechanism | Platform Example |
|-----------|-----------------|
| Server-hopping | Discord weak ties across communities |
| Crossposting | Reddit bridges between subreddits |
| Tag overlap | Stack Overflow connects experts across domains |

### Network Effects Taxonomy

| Type | Definition | Example |
|------|-----------|---------|
| **Direct** | More users = more value for all | More Reddit users = more content |
| **Indirect** | More users attract complementary goods | More Discord users = more bots |
| **Cross-side** | Group A benefits Group B | More SO answerers = value for askers |
| **Same-side** | More of same group benefits that group | More Discord server members = richer chat |
| **Data** | More usage = better algorithms | Reddit ranking improves with more votes |
| **Local** | Effects within sub-clusters | Subreddit value depends on its own members |

### Mathematical Laws

| Law | Formula | Real-World Validation |
|-----|---------|----------------------|
| **Metcalfe's Law** | V = n^2 | Facebook revenue fit n-squared over a decade |
| **Reed's Law** | V = 2^n (theoretical upper bound) | Never fully observed; platforms enabling group formation capture more value |
| **Death Spiral** (Andrew Chen) | Network effects work both ways | Declining community loses value, accelerating decline |

### Graph Implementation Patterns

| Platform | Graph Model | Key Feature |
|----------|------------|-------------|
| Reddit | Bipartite (users <-> subreddits) | Subscription-based content routing |
| Discord | Hierarchical (servers -> categories -> channels -> threads) | Role-based access control per node |
| Stack Overflow | Tripartite (users <-> questions <-> tags) | Tag-based expertise clustering |
| Discourse | Flat with categories + trust levels | Trust-based permission expansion |
| Circle | Spaces with membership gates | Payment-gated subgraphs |

### Risks & Mitigations

| Risk | Mitigation |
|------|-----------|
| Hub dependency (power users leave -> fragmentation) | Distribute influence, nurture mid-tier contributors |
| Filter bubbles from preferential attachment | Cross-community bridging features |
| Cold start problem | Seed content, invite strategy, creator-led launch |
| Moderation concentration on hubs | Distributed moderation via reputation systems |

---

## 2. Information Architecture

### Taxonomy Models by Platform

| Platform | Model | Depth |
|----------|-------|-------|
| Reddit | Flat (subreddits as peers) | 1 level |
| Discord | Categories -> channels | Fixed 2 levels |
| Stack Overflow | Tag-based folksonomy + synonyms | Flat with tag wikis |
| Discourse | Categories -> subcategories + tags | 2 levels + tags |
| Circle | Space Groups -> Spaces | 2 levels |

### Tagging Approaches

| Approach | Description | Best For |
|----------|-------------|----------|
| Free folksonomy | Users create any tags | Early-stage communities |
| Controlled vocabulary | Moderators curate tag list | Knowledge bases (SO: 65,000+ tags) |
| Hierarchical tags | Parent-child relationships | Complex domains |
| Auto-tagging (AI) | AI suggests/applies tags | Scale + consistency |
| Required tags | Posts must include tags from set | Quality control |

### Search Architecture

Modern community search uses **hybrid retrieval**:

1. **BM25** (keyword matching) -- Elasticsearch, Typesense, Meilisearch
2. **Dense vector** (semantic) -- embeddings + RAG
3. **Re-ranking** by community signals: votes, author reputation, recency
4. **Faceted filtering** -- date, author, tags, vote count
5. **Duplicate detection** -- critical for Q&A platforms

### Knowledge Persistence Models

| Model | Description | Platform |
|-------|-------------|----------|
| Ephemeral | Content decays, timeline-driven | Discord chat, Reddit feed |
| Wiki-persistent | Community-edited canonical content | SO answers, Discourse wikis |
| Article-persistent | Long-form authored content | DEV.to, Indie Hackers |
| Hybrid | Discussions graduate to knowledge base | Discourse topic -> wiki conversion |

---

## 3. Thread Engine & Ranking Algorithms

### Threading Architectures

| Model | Platform | Tradeoffs |
|-------|----------|-----------|
| Flat/Chronological | Discord, Slack | Simple, real-time; loses depth |
| Nested/Tree | Reddit | Deep discussions; gets unwieldy at depth |
| Flat + Best Sort | Stack Overflow | Surfaces best answers; loses conversation flow |
| Threaded-in-channels | Discord threads, Slack threads | Preserves chat and depth |
| Topic-based sequential | Discourse | Good for deliberation; slower pace |

### Ranking Formulas

#### Reddit Hot Algorithm

```
hot_score = log10(max(|score|, 1)) * sign(score) + (timestamp / 45000)
```

- **score** = upvotes - downvotes
- **timestamp** = seconds since Reddit epoch (Dec 8, 2005)

| Property | Implication |
|----------|------------|
| Logarithmic vote scaling | 1->10 votes = same boost as 10->100 or 100->1000 |
| Time never decreases | Newer posts start with higher time baseline |
| 12.5-hour half-life | Every 12.5h of age costs equivalent of 10x vote increase |
| Sign handling | Negative-score posts get negative ranking |

#### Hacker News Gravity Algorithm

```
score = (P - 1) / (T + 2)^G
```

- **P** = points, **T** = hours since submission, **G** = gravity (default 1.8)

| Property | Implication |
|----------|------------|
| Active decay | Scores decrease over time (unlike Reddit) |
| Tunable gravity | Higher G = faster decay; adjustable per community |
| Penalty system | ~20% of front-page stories receive penalties |

#### Wilson Score Interval (Reddit Best / Stack Overflow)

```
lower_bound = (p + z^2/(2n) - z * sqrt((p*(1-p) + z^2/(4n)) / n)) / (1 + z^2/n)
```

- **p** = observed proportion of upvotes
- **n** = total votes
- **z** = 1.96 for 95% confidence

| Property | Implication |
|----------|------------|
| Small sample correction | 5 up / 0 down can outrank 100 up / 40 down |
| Confidence-based | Ranks by lower bound of true approval rate |
| Self-correcting | More votes -> narrower interval -> stable ranking |

Source: Evan Miller, "How Not To Sort By Average Rating" (2009)

#### Reddit Controversial

```
controversial = min(ups, downs) / max(ups, downs) * (ups + downs)
```

Surfaces posts with high engagement AND balanced up/down ratios.

### Quality Signals Beyond Votes

| Signal | Weight | Platform |
|--------|--------|----------|
| Vote score | Primary | Reddit, SO, Discourse |
| Author reputation | Secondary | Stack Overflow |
| Time on page / read depth | Growing | Discourse |
| Accepted answer | Binary boost | Stack Overflow |
| Edit history | Trust signal | Discourse |
| Report/flag ratio | Negative signal | All platforms |

---

## 4. Trust, Moderation & Governance

### Discourse Trust Levels (5-Tier)

| Level | Name | How Earned | Key Privileges |
|-------|------|-----------|----------------|
| TL0 | New | Default | Post in most categories; limited actions |
| TL1 | Basic | Read topics, spend time | Send PMs, flag posts, all core features |
| TL2 | Member | Active participation (weeks) | Invite users, group PMs, wiki posts |
| TL3 | Regular | Sustained quality (months) | Recategorize, rename, wiki-edit; flags auto-hide TL0 spam |
| TL4 | Leader | Manually granted by admins | Full moderation powers |

**Key design decisions:**
- TL3 is auto-granted AND auto-revoked (must maintain activity)
- Multiple TL3 flags can auto-silence spammers
- First 50 users in bootstrap mode get TL1 automatically
- Users receive congratulatory PMs on level-up
- 2023-2025: migrating 30+ settings from trust-level to group-based permissions

### Stack Overflow Privilege Ladder

| Reputation | Privilege | Rationale |
|------------|-----------|-----------|
| 1 | Create posts | Anyone can ask/answer |
| 15 | Upvote | Proven participant |
| 50 | Comment anywhere | Reduce noise from drive-by comments |
| 125 | Downvote (costs 1 rep) | Skin in the game |
| 500 | Review queues | Experienced curation |
| 2,000 | Edit any post | Trusted to improve content |
| 3,000 | Close/reopen votes | Shape acceptable questions |
| 10,000 | Moderation tools, delete votes | Analytics + cleanup |
| 15,000 | Protect questions | Shield popular posts |
| 20,000 | Delete negatively-scored answers | Final cleanup authority |

Philosophy (Jeff Atwood, 2009): "Moderators are human exception handlers -- the community handles 95%+ of moderation through distributed reputation-based actions."

### AI Content Moderation Stack (2025-2026)

| Layer | Technology | Latency | Accuracy |
|-------|-----------|---------|----------|
| Pre-publish filters | Keyword matching, regex | <10ms | High precision, low recall |
| Real-time AI classification | LLM toxicity detection | 50-500ms | 85-95% |
| Post-publish AI review | Batch flagged content | Minutes | Higher with context |
| Human review | Trained moderators | Hours | Highest, expensive |
| Community flags | User reporting + thresholds | Variable | Catches context-dependent issues |

Content moderation market: $11.63-12.48B (2025) -> projected $23.2-26.1B by 2030 (CAGR ~14.5%).

### Governance Models

| Model | Example |
|-------|---------|
| Benevolent dictatorship | Early-stage communities |
| Reputation-weighted democracy | Stack Overflow |
| Elected moderators | Reddit (some subreddits) |
| Automated governance | Discourse TL system |
| Constitution-based | Wikipedia, Discourse guidelines |

### Appeal Best Practices (UNESCO 2025)

- Transparent policies with clear examples
- Human-readable explanations for every moderation action
- Streamlined appeal processes with defined timelines
- Independent oversight for contested decisions
- Regular transparency reports

---

## 5. Gamification & Identity

### Nir Eyal's Hook Model (Applied to Communities)

| Phase | Mechanism | Examples |
|-------|-----------|---------|
| **1. Trigger** | External: notifications, digests. Internal: boredom, uncertainty, social need | "Someone replied to your post" email |
| **2. Action** | Behavior in anticipation of reward | Scroll feed, answer question, check messages |
| **3. Variable Reward** | Three types below | Unpredictable positive reinforcement |
| **4. Investment** | User puts something in that improves next use | Write answers, build reputation, customize profile |

**Variable reward types:**

| Type | Mechanism | Platform Example |
|------|-----------|-----------------|
| Rewards of the Tribe | Social validation | Upvotes, karma, being thanked |
| Rewards of the Hunt | Information seeking | Finding the answer, discovering content |
| Rewards of the Self | Mastery, completion | Badges, reputation milestones, streaks |

**Critical insight:** The investment phase creates stored value that makes leaving costly (switching cost).

### Amy Jo Kim's Core Loop

The repeatable, pleasurable activity driving long-term engagement:

| Platform | Core Loop |
|----------|-----------|
| Reddit | Browse -> React (vote/comment) -> Get validation -> Browse more |
| Stack Overflow | See question -> Answer -> Get upvotes/accepted -> Seek harder questions |
| Discord | Check server -> Participate -> Build relationships -> Return |
| Discourse | Read topic -> Reply thoughtfully -> Earn trust level -> Gain privileges -> Moderate |

> "The smartest MVP is built around your Core Learning Loop -- your Day 21 experience." -- Amy Jo Kim

### Stack Overflow Gamification Architecture

**Points (Reputation):**

| Action | Points |
|--------|--------|
| Answer upvote | +10 |
| Question upvote | +5 |
| Accepted answer | +15 |
| Approved edit | +2 |
| Downvoting an answer | -2 (costs the downvoter) |
| Daily cap from votes | 200 |

**Badges (95 total, 3 tiers):**

| Tier | Count | Design | Example |
|------|-------|--------|---------|
| Bronze | 30 | Easy, introduce features | "Autobiographer" (complete profile) |
| Silver | 35 | Sustained effort | "Civic Duty" (300 votes) |
| Gold | 30 | Exceptional contribution | "Legendary" (200 rep from 150+ days) |

**Design principle:** Every badge encourages behavior that helps the community. Custom badges launched Feb 2026.

### Reddit Karma System

- Post and comment karma tracked separately
- Karma has NO privileges (pure social signal, unlike SO)
- Awards relaunched Sep 2025 with gold as currency (coins removed Jul 2023, Golden Upvotes failed)
- Subreddit-specific karma requirements configurable per community

### Identity Signaling

| Signal | Platform | Function |
|--------|----------|----------|
| Reputation number | Stack Overflow | Competence |
| Karma score | Reddit | Participation |
| Trust level badge | Discourse | Trust |
| Custom roles/colors | Discord | Status/belonging |
| Flair | Reddit | Identity expression |
| Verified badges | Circle, Mighty Networks | Authenticity |

---

## 6. Growth Loops & Virality

### K-Factor (Viral Coefficient)

```
K = i * c
```

- **i** = invitations each user sends
- **c** = conversion rate per invitation
- **K > 1** = exponential growth
- **K < 1** = needs external acquisition

**Example:** 100 users, i=3, c=0.6 -> K=1.8 -> 100 -> 180 -> 324 -> 583 (exponential)

**Reality:** Pure viral growth (K > 1) is extremely rare and typically unsustainable. Combine viral loops with other channels.

### Growth Loop Types

#### 1. Content-SEO Loop (Most Powerful for Knowledge Communities)

```
User creates content -> Google indexes -> Search user finds content ->
New user joins -> Creates content -> [repeat]
```

- Reddit SEO visibility surged ~1,328% (Jul 2023 - Apr 2024), partially corrected early 2025
- Google-Reddit $60M/year data partnership for AI Overviews
- Stack Overflow dominates programming search via this loop
- Google prioritizes "first-hand perspective" from forums

#### 2. Invite/Referral Loop

```
User enjoys community -> Invites friends -> Friends join ->
Community more valuable -> [repeat]
```

Referral programs: 10-30% conversion (up to 50%)

#### 3. Creator-Audience Loop

```
Creator builds community -> Promotes to audience -> Audience joins ->
Members create content -> Attracts new members -> [repeat]
```

#### 4. Cross-Platform Distribution Loop

```
Content created -> Shared on Twitter/LinkedIn -> External users arrive ->
Convert to members -> Create content -> [repeat]
```

#### 5. Embed/Widget Loop

```
Platform provides widgets -> Sites embed community content ->
Users discover via embeds -> Join -> [repeat]
```

### SEO as Growth Engine

| Strategy | Description | Impact |
|----------|-------------|--------|
| Long-tail UGC | User content targets long-tail keywords | High volume, low competition |
| Canonical Q&A pages | SO-style question pages | High intent traffic |
| DiscussionForumPosting schema | Structured data markup | Rich results, +30-40% CTR |
| Internal linking | Related topics create crawl depth | Better indexation |
| Fresh content signals | Active discussions signal freshness | Ranking boost |
| Author authority (E-E-A-T) | Community expert signals | Quality signal |

**2025-2026 caveat:** "Forum content recalibration" underway. Generic forums losing visibility. Communities need structured, quality content. 73% of B2B websites saw significant organic traffic losses (avg 34% YoY decline).

### Retention Benchmarks

| Metric | Benchmark |
|--------|-----------|
| D1 retention | 40-60% |
| D7 retention | 20-35% |
| D30 retention | 10-20% |
| 90-day retention | 5-15% |

Andrew Chen: "The best way to drive viral growth is to increase retention and engagement."

---

## 7. Monetization Stack

### Creator Economy Scale

- Market size: $200-254B (2025), projected $314B (2026), $480B (2027, Goldman Sachs)
- 88% of creators utilize paid memberships
- 32.9% of communities charge $26-$50/month (sweet spot)

### Five Revenue Models (2026)

#### 1. Paid Communities / Memberships

| Platform | Pricing | Transaction Fee |
|----------|---------|----------------|
| Circle | From $89/mo (annual) | 0.5-2% |
| Mighty Networks | From $49/mo (annual) | 1-2% |
| Skool | $9/mo Hobby, $99/mo Pro | 10% (Hobby), 2.9% (Pro) |
| Discord (premium roles) | Free platform | None (Stripe) |

Average Mighty Networks member pays $48/month.

#### 2. Paid Challenges / Cohort Programs

- Typical pricing: $97-$497 per challenge
- 30-day format most common
- 15-30% conversion to ongoing membership

#### 3. AI Agent Monetization (Emerging)

- $9-$49/month for access
- Delivered via WhatsApp, Instagram, or platform-native
- Scalable: one creator's knowledge serves unlimited members

#### 4. Courses & Digital Products

| Platform | Course Features | Price Range |
|----------|----------------|-------------|
| Circle | Modular with video/audio/text | $49-$999 |
| Mighty Networks | Courses + community bundles | $39-$299 |
| Skool | Integrated with community | $29-$297 |

#### 5. Events & Live Experiences

- Free events for acquisition, paid for monetization
- Workshops, masterminds, AMAs

### Platform Revenue Models

| Platform | Primary Revenue | Scale |
|----------|----------------|-------|
| Reddit | Advertising + Premium | $2.2B FY2025 (+69% YoY) |
| Discord | Nitro subscriptions | Server boosts, app store |
| Stack Overflow | Teams (enterprise) + Ads | Job board discontinued Mar 2022 |
| Discourse | Hosting plans | Enterprise support |
| Circle | SaaS fees + transaction fees | 17,000+ creators |
| Mighty Networks | SaaS fees + transaction fees | Network-as-product model |

### Pricing Strategy

| Price Point | Positioning | Notes |
|-------------|-------------|-------|
| Free | Acquisition/lead gen | Highest entry, lowest engagement |
| $9-$25/mo | Accessible, impulse | Good for large audiences |
| $26-$50/mo | Sweet spot (32.9%) | Balanced value/commitment |
| $51-$100/mo | Premium | Requires clear premium value |
| $100+/mo | Professional/enterprise | B2B or high-value niche |

### Risks

- Paywalls reducing network effects
- Creator dependency (community collapses when creator leaves)
- Monthly subscription fatigue (avg churn: 5-10%/month)
- Platform lock-in (no data portability)

---

## 8. SEO Engine & Frontend

### Rendering Strategy Decision Matrix

| Strategy | SEO Impact | Use When | Example |
|----------|-----------|----------|---------|
| SSR | Excellent | Public pages, search-critical | Discourse, Reddit |
| CSR | Poor | Authenticated-only, app-like | Discord web app |
| ISR | Excellent | High-volume content, pre-built | DEV.to articles |
| Hybrid | Optimal | Mix of public and private | Stack Overflow, Circle |

**Rule:** Every public community page for search results MUST be server-rendered or pre-rendered.

### Core Web Vitals Targets

| Metric | Target | Community Challenge |
|--------|--------|-------------------|
| LCP | < 2.5s | Large thread pages with images/embeds |
| INP | < 200ms | Complex vote/reply interactions |
| CLS | < 0.1 | Dynamic content loading, lazy images, ads |

Common issues: infinite scroll CLS, late-loading avatars, rich embeds causing layout shifts, heavy JS degrading INP.

### Semantic HTML Structure

Key elements for forum pages:

| Element | Use | SEO Impact |
|---------|-----|-----------|
| `<article>` | Individual posts/threads | Content boundary signal |
| `<header>` | Thread metadata | Structured content signal |
| `<time datetime="">` | Timestamps | Freshness signal |
| `<nav>` | Breadcrumbs, pagination | Crawl path signal |
| `<section>` | Reply sections | Content grouping |

### JSON-LD Structured Data

Primary schema: **DiscussionForumPosting**

```json
{
  "@context": "https://schema.org",
  "@type": "DiscussionForumPosting",
  "headline": "Thread Title",
  "author": { "@type": "Person", "name": "username", "url": "..." },
  "datePublished": "2026-04-06T10:00:00+00:00",
  "url": "https://forum.example.com/t/topic/12345",
  "interactionStatistic": {
    "@type": "InteractionCounter",
    "interactionType": "https://schema.org/CommentAction",
    "userInteractionCount": 15
  },
  "comment": [
    {
      "@type": "Comment",
      "author": { "@type": "Person", "name": "replier" },
      "datePublished": "2026-04-06T11:30:00+00:00",
      "text": "Reply content..."
    }
  ]
}
```

**CTR impact:** Pages with Rich Snippets see +30-40% CTR vs. standard results.

### Additional Schema Types

| Schema | Use Case |
|--------|----------|
| DiscussionForumPosting | Forum threads |
| QAPage | Q&A pages (SO model) |
| Comment | Replies |
| ProfilePage | User profiles |
| BreadcrumbList | Category navigation |
| WebSite + SearchAction | Site search in SERPs |
| Course | Course-based communities |

### Accessibility (WCAG 2.1 AA)

| Feature | Implementation |
|---------|---------------|
| Keyboard navigation | Tab order for threads, replies, actions |
| Screen reader | ARIA labels for vote buttons, actions |
| Color contrast | 4.5:1 minimum for text |
| Focus indicators | Visible focus rings on all interactive elements |
| Alt text | Prompts for user-uploaded images |
| Live regions | aria-live for real-time updates |

---

## 9. Platform Comparative Matrix

| Feature | Reddit | Discord | Stack Overflow | Discourse | Circle | Mighty Networks | Skool |
|---------|--------|---------|----------------|-----------|--------|----------------|-------|
| Threading | Nested tree | Flat + threads | Flat best-sorted | Sequential | Flat | Flat | Flat |
| Ranking | Hot/Best/New | Chronological | Votes + accepted | Latest/votes | Chronological | Activity | Latest |
| Reputation | Karma (no perks) | Roles (manual) | Points -> privileges | Trust levels (auto) | Points | Points | Gamification |
| Moderation | Mods + AutoMod | Roles + bots | Rep-based + mods | Trust levels + mods | Admin | Admin | Admin |
| Open Source | No | No | No | Yes (GPL) | No | No | No |
| SEO | Excellent | Poor | Excellent | Excellent | Growing | Moderate | Moderate |
| Real-time | Limited | Excellent | No | Optional | Chat | Limited | No |
| Monetization | Ads ($2.2B) | Nitro | Teams (B2B) | Hosting | SaaS + fees | SaaS + fees | SaaS + fees |

### Best-Fit Guide

| Use Case | Best Platform |
|----------|--------------|
| Developer knowledge base | Stack Overflow / Discourse |
| Real-time community | Discord |
| Creator monetization | Circle / Mighty Networks / Skool |
| Open-source project | Discourse |
| News/content aggregation | Reddit model |
| Niche professional community | Circle / Discourse |
| Course-based community | Mighty Networks / Circle / Skool |

---

## 10. Implementation Checklists

### Social Graph Engine

- [ ] Define graph model (bipartite, tripartite, hierarchical)
- [ ] Implement user-to-community membership relationships
- [ ] Design sub-community / group creation mechanics
- [ ] Build recommendation engine for community discovery
- [ ] Implement cross-community bridging features
- [ ] Monitor network health (clustering coefficient, degree distribution)
- [ ] Design cold-start strategy

### Information Architecture

- [ ] Design taxonomy (categories, subcategories)
- [ ] Implement tagging system (controlled vocabulary vs. folksonomy)
- [ ] Build full-text search (Elasticsearch/Typesense/Meilisearch)
- [ ] Add semantic search (vector embeddings)
- [ ] Implement duplicate detection
- [ ] Design knowledge persistence model
- [ ] Create tag management interface

### Thread Engine

- [ ] Choose threading model (flat, nested, sequential)
- [ ] Implement Hot/Best/New/Controversial sorting
- [ ] Implement Wilson score for comment ranking
- [ ] Design vote system (upvote/downvote, reactions, or both)
- [ ] Build quality scoring (votes + author rep + read time)
- [ ] Implement configurable time-decay
- [ ] Add anti-manipulation measures

### Trust & Moderation

- [ ] Design trust level system (Discourse-style automated progression)
- [ ] Map reputation thresholds to moderation privileges
- [ ] Implement pre-publish content filters
- [ ] Integrate AI content moderation (toxicity, spam, NSFW)
- [ ] Build human moderation queue with priority triage
- [ ] Design appeal system with clear timelines
- [ ] Create transparent community guidelines
- [ ] Implement audit logging for moderation actions

### Gamification & Identity

- [ ] Design point/reputation system with clear earning rules
- [ ] Create badge system aligned with desired behaviors
- [ ] Implement time-scoped leaderboards
- [ ] Design identity signaling (flair, roles, badges)
- [ ] Build progressive privilege unlocking
- [ ] Add streak/consistency rewards
- [ ] Monitor for reputation gaming

### Growth Loops

- [ ] Implement Content-SEO loop (indexable UGC)
- [ ] Build invite/referral system with tracking
- [ ] Design onboarding for quick activation
- [ ] Implement email digest re-engagement
- [ ] Build social sharing with OG tags
- [ ] Monitor K-factor and retention cohorts
- [ ] Optimize for "aha moment" in first session

### Monetization

- [ ] Integrate payment processor (Stripe)
- [ ] Build subscription/membership gating
- [ ] Implement tiered access (free/paid/premium)
- [ ] Design course/content monetization
- [ ] Build creator payout system
- [ ] Implement trial/freemium conversion flow
- [ ] Add analytics for MRR, churn, LTV

### SEO & Frontend

- [ ] Implement SSR for all public pages
- [ ] Add DiscussionForumPosting JSON-LD
- [ ] Optimize Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- [ ] Implement semantic HTML (article, header, time, nav)
- [ ] Generate XML sitemaps for public content
- [ ] Set canonical URLs for paginated/duplicate content
- [ ] Configure robots.txt (block admin/search/login)
- [ ] Add BreadcrumbList schema
- [ ] Ensure WCAG 2.1 AA compliance
- [ ] Add OG tags and Twitter Cards
- [ ] Return 410 for deleted content
- [ ] Test with Rich Results Test and Lighthouse

---

## 11. Key References

### Foundational Books

| Book | Author | Year | Topic |
|------|--------|------|-------|
| *Linked* | Barabasi | 2002 | Scale-free networks |
| *Hooked* | Nir Eyal | 2014 | Hook Model, habit formation |
| *The Art of Community* | Jono Bacon | 2009 | Community management |
| *Community Building on the Web* | Amy Jo Kim | 2000 | Social architecture |
| *Game Thinking* | Amy Jo Kim | 2018 | Core loops, engagement |
| *The Cold Start Problem* | Andrew Chen | 2021 | Network effects, growth |
| *The Accidental Taxonomist* | Heather Hedden | 2010 | Taxonomy design |
| *Buzzing Communities* | Richard Millington | 2012 | Community strategy |
| *Actionable Gamification* | Yu-kai Chou | 2015 | Octalysis framework |

### Seminal Papers & Articles

| Paper | Author | Year | Contribution |
|-------|--------|------|-------------|
| "The Strength of Weak Ties" | Granovetter | 1973 | Bridging social capital |
| "Emergence of Scaling in Random Networks" | Barabasi & Albert | 1999 | Scale-free network model |
| "How Not To Sort By Average Rating" | Evan Miller | 2009 | Wilson score for ranking |
| "A Theory of Moderation" | Jeff Atwood | 2009 | Moderation philosophy |
| "Deriving the Reddit Formula" | Evan Miller | 2009 | Reddit Hot algorithm analysis |

### Key People

| Person | Contribution |
|--------|-------------|
| Albert-Laszlo Barabasi | Scale-free networks, preferential attachment |
| Mark Granovetter | Strength of weak ties |
| Jeff Atwood | Stack Overflow + Discourse creator |
| Nir Eyal | Hook Model, habit-forming products |
| Amy Jo Kim | Community design, game thinking |
| Andrew Chen | Growth loops, network death spirals |
| Evan Miller | Wilson score popularization |
| Paul Graham | Hacker News ranking algorithm |

### Notable 2025-2026 Events

| Event | Date | Impact |
|-------|------|--------|
| Reddit deprecated r/all | Apr 2026 | Full shift to algorithmic personalized feeds |
| Reddit algorithm overhaul | Sep 2025 | "Engagement quality over volume" |
| Reddit relaunched Awards | Sep 2025 | Gold as currency (coins removed Jul 2023) |
| MLH acquired Forem/DEV.to | Feb 2026 | Forem mission continues under MLH |
| Google-Reddit $60M/year deal | 2024+ | Reddit data in AI Overviews, preferential SERPs |
| Google E-E-A-T correction | Early 2025 | Reddit lost 350 SISTRIX points; UGC recalibrated |
| Stack Overflow custom badges | Feb 2026 | Community-created challenge badges |
| Skool Hobby Plan | 2025 | $9/mo entry point with 10% fee |

---

> **Reference complete.** 8 core systems of community platform engineering covering network science,
> ranking algorithms, trust frameworks, gamification, growth mechanics, monetization,
> and technical SEO -- with mathematical formulas, platform comparisons, and implementation checklists.
