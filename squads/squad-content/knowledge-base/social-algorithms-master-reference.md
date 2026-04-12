# Social Algorithms Master Reference

> **Source:** MS-007 Research (Social Algorithms & Content Distribution)
> **Date:** 2026-04-07 | **Sources:** 42+ consulted
> **Scope:** Instagram, TikTok, YouTube, LinkedIn, Twitter/X, Facebook algorithms, recommendation systems theory, cross-platform strategy, engagement mechanics, creator economy, Brazilian context

---

## Table of Contents

1. [Panorama & Evolution](#1-panorama--evolution)
2. [Instagram Algorithm](#2-instagram-algorithm)
3. [TikTok Algorithm](#3-tiktok-algorithm)
4. [YouTube Algorithm](#4-youtube-algorithm)
5. [LinkedIn Algorithm](#5-linkedin-algorithm)
6. [Twitter/X Algorithm](#6-twitterx-algorithm)
7. [Facebook Algorithm](#7-facebook-algorithm)
8. [Emerging Platforms](#8-emerging-platforms)
9. [Recommendation Systems Theory](#9-recommendation-systems-theory)
10. [Cross-Platform Content Strategy](#10-cross-platform-content-strategy)
11. [Engagement Mechanics](#11-engagement-mechanics)
12. [Creator Economy & Monetization](#12-creator-economy--monetization)
13. [Social Commerce](#13-social-commerce)
14. [AI & Social Media](#14-ai--social-media)
15. [Brazilian Context](#15-brazilian-context)
16. [Key People & References](#16-key-people--references)
17. [Actionable Checklists](#17-actionable-checklists)

---

## 1. Panorama & Evolution

### 1.1 Three Eras of Social Feeds

| Era | Period | Model | Key Characteristic |
|-----|--------|-------|-------------------|
| **1. Chronological** | 2004-2012 | Posts in time order | Simple but inefficient at scale |
| **2. Algorithmic Social** | 2012-2020 | Content from followed accounts, ranked | Social graph as primary filter |
| **3. Interest-Based Recommendation** | 2020-present | Content based on interests, not follows | TikTok proved interest graph > social graph |

Facebook introduced EdgeRank in 2009 (affinity x weight x time decay). Instagram abandoned chronological in 2016. TikTok's FYP doesn't depend on who you follow -- it depends on what you watch.

Adam Mosseri (2023): "Recommendations are the future of Instagram."

### 1.2 The Attention Economy

Herbert Simon (1971): "A wealth of information creates a poverty of attention."

**Key numbers (2025):**
- Average global social media time: 2h24min/day
- Brazil average: **3h49min/day** -- highest in the world (DataReportal 2025)
- Average Instagram feed: 500+ new posts/day from followed accounts
- Only ~30% of available content is actually shown to users
- Algorithms optimize for: session time, return frequency (DAU/MAU), and ultimately ad revenue

### 1.3 Discovery Surfaces Taxonomy

| Surface | Function | Examples |
|---------|----------|----------|
| **Main Feed** | Followed + recommended content | Instagram Feed, Twitter For You |
| **Discover/Explore** | New content discovery | Instagram Explore, TikTok FYP |
| **Short-form Video** | Algorithmic short video | Reels, Shorts, TikTok |
| **Search** | Intentional search | YouTube Search, Instagram Search |
| **Stories** | Ephemeral ranked content | Instagram/Facebook Stories |
| **Messaging/DM** | Private sharing (strong signal) | WhatsApp forwards, Instagram DM shares |
| **Notifications** | Re-engagement | Push notifications, email digests |

All surfaces share fundamental signals: engagement signals, content signals, user signals, and context signals.

### 1.4 Platform vs Creator vs User Tension

- **Platforms** want to maximize: time on platform, ad impressions, DAU/MAU, revenue
- **Creators** want to maximize: reach, followers, engagement, monetization
- **Users** want: relevant content, social connection, entertainment, information

What users say they want and what their behavior reveals are often divergent -- YouTube calls this "nutritious content vs junk food content."

---

## 2. Instagram Algorithm

### 2.1 Multiple Algorithms

Instagram does NOT have one algorithm. Feed, Explore, Reels, and Stories each use different algorithms. Infrastructure: PyTorch-based ML at billions of predictions/second for 2B+ MAU.

### 2.2 Feed Ranking Signals (by weight)

1. **Interest:** Probability of user interacting, based on past behavior. Model predicts likelihood of 5 actions: like, comment, save, share, view time
2. **Relationship:** How close the user is to the author. Signals: mutual interactions, DMs, tags, profile searches
3. **Timeliness:** Temporal decay -- 30-min-old post > 3-day-old post. Viral content with high engagement can resurface
4. **Usage Frequency:** Users who open multiple times/day see more chronological feed; once/day users see "best of"
5. **Diversity:** Prevents too many consecutive posts from same author or same content type

**Feed composition (2024):** ~15-20% recommended content from non-followed accounts, growing.

### 2.3 Reels Algorithm (Key Differences from Feed)

Over 50% of Reels content comes from accounts the user does NOT follow. This is a discovery surface.

**Signal hierarchy:**

| Signal | Weight | Details |
|--------|--------|---------|
| **Watch Time / Completion Rate** | Highest | Reel watched to end or rewatched = massive boost. "Retention curve" -- early drop-off penalized |
| **Shares (DM)** | Very High | Mosseri: "Sends are the most important signal for Reels ranking" |
| **Saves** | High | Indicates lasting value (reference content) |
| **Engagement Velocity** | High | First 30-60 minutes determine algorithmic fate |
| **Trending Audio** | Medium | Reels using trending audio get boost |
| **Originality** | Medium | Penalizes TikTok watermarks, reposted content, aggregators |

**Known penalties:**
- TikTok watermark: significant distribution reduction
- Low resolution (<720p): penalized
- Text covering >20% of screen: may reduce reach
- Recycled content without added value: penalized
- Community guideline violations: shadow restriction

### 2.4 Stories Ranking

Primarily by relationship proximity:
- **View history:** Consistently watched accounts appear first
- **Story interactions:** DM replies, emoji reactions, poll votes are strong signals
- **Timeliness:** More recent Stories appear first
- **Content type:** Algorithm learns format preference (video vs photo)

**Strategic insight:** Stories with interactive elements (polls, quizzes, sliders, questions) generate 2-3x more engagement and train the algorithm to prioritize your profile.

### 2.5 Explore -- Discovery

Exclusively non-followed content. Process:

1. **Candidate Generation:** Find accounts similar to recently engaged accounts (co-engagement)
2. **Two-Tower Model:** User tower + content tower generate embeddings; proximity determines relevance
3. **Ranking:** By engagement probability (like > save > share > comment for Explore)
4. **Filtering:** Guideline violations, low quality filtered out
5. **Diversity Injection:** Topical diversity to avoid excessive bubbles

### 2.6 Shadowban Mechanics

Instagram denies "shadowban" but acknowledges "distribution reductions":
- **Community Guidelines violations:** Immediate reduction even without removal
- **Recommendation Guidelines:** "Borderline" content removed from Explore/Reels but not from Feed
- **Repeated violations:** Systemic reduction
- **Engagement bait:** Excessive "like, comment, share" requests may be penalized

**What does NOT cause reduction:** Account type (personal vs business/creator), posting frequency (within reason), links in bio, editing captions after posting.

### 2.7 Algorithm Changes 2025-2026

| Change | Impact |
|--------|--------|
| **"Your Algorithm" tool** (Dec 2025) | Users can see/control topics shaping Reels recommendations |
| **Carousels dominant** | 10% avg engagement rate (vs 7% images, 6% Reels). 1.4x more reach, 3.1x more engagement vs single photos |
| **Aggregator penalty** | Accounts with 10+ reposts in 30 days excluded from recommendations. Original creators saw 40-60% reach increase |
| **Watch time as #1 signal** (Jan 2025) | First 3 seconds critical for initial distribution. Likes per reach and DM shares = 2nd and 3rd signals |
| **DM/Comments/Stories weight** (Mar 2026) | Even greater weight to accounts with frequent DM, comment, and Story interactions |
| **AI categorization** (2026) | Visual elements, text in images, video clips analyzed beyond hashtags -- hashtags less relevant |
| **AI translation for Reels** (late 2025) | Auto-translation of text and audio (Hindi, Portuguese, English, Spanish) |

### 2.8 Engagement Velocity -- The Critical Window

1. Post shown to ~10% of followers
2. Algorithm measures: engagement rate, view time, saves, shares
3. If performance exceeds creator's baseline: shown to more followers
4. Exceptional performance: enters Explore and Reels (for Reels)
5. Each distribution round exponentially expands audience

**Practical implication:** Post when followers are online (check Instagram Insights) to maximize engagement velocity.

---

## 3. TikTok Algorithm

### 3.1 The For You Page Revolution

**Regulatory context (2025-2026):** TikTok USDS Joint Venture LLC established Jan 22, 2026. ByteDance retained minority stake <20%. Oracle, Silver Lake, MGX each hold ~15%. US algorithm trained exclusively on Oracle-hosted servers.

TikTok inverted the social media model: any video from any account can go viral regardless of follower count. FYP is based on **interest graph** (what you watch) not **social graph** (who you follow).

### 3.2 Algorithm Signals

**Tier 1 -- Content Signals (highest weight):**

| Signal | Details |
|--------|---------|
| **Completion Rate** | Most powerful signal. 100% completion = max boost. Rewatched = additional boost |
| **Watch Time Total** | Absolute time matters. 60s video watched 55s can beat 15s video at 100% |
| **Shares** | Via DM or copied link = extremely strong. Valued above likes |
| **Comments** | Long, detailed comments weigh more than emojis |
| **Profile Visits** | Visiting creator profile after watching = strong interest signal |

**Tier 2 -- User Signals:** Interaction history, created content types, followed accounts (less weight than Instagram), "Not Interested" marks (strong negative signal)

**Tier 3 -- Device/Account Signals:** Language preference, country/location, device type (used as purchasing power proxy per leaked ByteDance docs), usage timing patterns

### 3.3 Batch Testing (Pool System)

| Pool | Views | What Happens |
|------|-------|-------------|
| **Pool 1** | ~200-500 | Shown to small diverse group. Measures completion rate, engagement, shares. Needs ~50% completion + above-baseline engagement to advance |
| **Pool 2** | ~1,000-5,000 | Shown to users with similar interests. Metrics must maintain or improve |
| **Pool 3** | ~10,000-100,000 | Broad distribution, geographic diversity. "Viral potential" |
| **Pool 4+** | 100K-millions | Massive cross-geographic distribution. Algorithm saturates until engagement decays |

**Critical insight:** A video can "die" in Pool 1 and "resurrect" days or weeks later. TikTok periodically retests old content.

### 3.4 Interest Graph vs Social Graph

| Aspect | Social Graph (Instagram/Facebook) | Interest Graph (TikTok) |
|--------|-----------------------------------|------------------------|
| **Base** | Who you follow | What you watch |
| **New creator** | Must build followers | Can go viral on 1st video |
| **Diversity** | Limited to social graph | High -- diverse FYP |
| **Cold start** | Slow (depends on network) | Fast (5-10 watched videos create profile) |
| **Lock-in** | High (followers are "property") | Low (algorithm can defavor anytime) |

Eugene Wei, "TikTok and the Sorting Hat" (2020): TikTok functions like Harry Potter's Sorting Hat -- rapidly categorizes users by interest without requiring them to declare preferences.

### 3.5 Content Diversity & Optimization

**Diversity mechanisms:**
- Category cap: limits consecutive videos of same topic
- Creator diversity: avoids multiple videos from same creator in sequence
- New content injection: videos from new creators periodically injected
- Exploration allocation: ~10-20% of impressions for exploration outside user's interest profile

**Optimization tips:**
- **First 2-3 seconds:** Hook is everything. High skip rate = suppression
- **Duration:** No universal "ideal." What matters is completion rate vs total time
- **Trending audio:** One of most consistent boosts
- **On-screen text:** TikTok indexes overlay text for categorization (works as "implicit hashtags")
- **Hashtags:** Primarily for categorization, not discovery. #fyp/#foryou are irrelevant

### 3.6 Monolith Architecture (ByteDance, 2022)

Key innovations from the published paper:
- **Real-time training:** Model trained continuously (not in daily batches)
- **Collisionless embedding:** Improved feature representation accuracy
- **Feature eviction:** Old irrelevant features automatically discarded
- **Scale:** Billions of interactions processed daily in real-time

---

## 4. YouTube Algorithm

### 4.1 The Core Formula: CTR x AVD

**CTR (Click-Through Rate):** % of people who see thumbnail/title and click. Average: 2-10%. 8%+ is excellent.
**AVD (Average View Duration):** Average time watching. YouTube values absolute retention (minutes) AND relative (%).

- High CTR + low AVD = clickbait
- High AVD + low CTR = good content, weak packaging
- YouTube wants BOTH

### 4.2 Discovery Surfaces

| Surface | Traffic Share | Key Signals |
|---------|-------------|-------------|
| **Browse (Homepage)** | ~40-60% | Viewing history, subscriptions, trends. Highly personalized. Favors "novelty" |
| **Suggested (Watch Next)** | ~30-40% | Topic correlation ("who watched X also watched Y"). Strongest signal: topical match |
| **Search** | Varies | Title/description/tag relevance, watch time history, engagement, channel authority |
| **Shorts** | Separate ecosystem | Completion/loop rate dominant. Cross-pollination with long-form limited |

### 4.3 Satisfaction Surveys

Unique YouTube innovation: in-app surveys asking "How would you rate this video?" (1-5 stars) or "Was this video worth your time?"

This led to "responsible recommendation" -- balancing engagement with declared satisfaction. Junk food content (sensational, clickbait) may generate high watch time but low satisfaction.

### 4.4 Thumbnail A/B Testing (2024+)

- Creator uploads 2-3 thumbnails per video
- YouTube shows each to equal audience portions
- Winner determined by **watch time generated** (not just CTR, to avoid rewarding clickbait)
- Automatically selected after 24-48h

Mr. Beast: tests dozens of thumbnails before publishing. Thumbnails are the most controllable factor for CTR.

### 4.5 Session Time & Ecosystem

YouTube optimizes for the entire session, not just individual videos. A **session starter** (first video watched when opening YouTube) receives Browse boost. This favors regular, predictable publishing.

**Subscriber bell:** Only ~10-20% of subscribers activate "All" notifications. If subscribers don't watch, it's a negative signal.

### 4.6 YouTube Shorts Updates 2025-2026

| Update | Details |
|--------|---------|
| **Extended duration** (2025) | Shorts can now be up to 3 minutes (was 60 seconds) |
| **New view counting** (Mar 2025) | Any Short that starts playing or loops counts as view. Each loop = additional view |
| **Algorithm separation** (late 2025) | Shorts recommendation engine fully separated from long-form |
| **Search filter** (Jan 2026) | Dedicated "Shorts" filter in search type menu |
| **Browse Feed change** (Dec 2025) | Homepage reduced long-form recommendations (~12 to ~2), prioritizing Shorts |
| **Satisfaction > watch time** (2026) | Satisfaction surveys and post-viewing behavior now surpass raw watch time |

### 4.7 YouTube Recommendations Paper (Covington et al., 2016)

Two-stage architecture:
1. **Candidate Generation:** Millions of videos reduced to hundreds using collaborative filtering with deep learning
2. **Ranking:** Candidates ranked with complex model (watch time, engagement, freshness, upload frequency)

Objective function: watch time (not clicks). "Example Age" feature: video age as feature to learn natural relevance decay.

---

## 5. LinkedIn Algorithm

### 5.1 B2B Context

~1B members (2025), but only ~3-5% publish content actively. Favorable supply/demand for creators.

### 5.2 Signal Hierarchy

| Signal | Weight | Details |
|--------|--------|---------|
| **Dwell Time** | Highest | Time spent reading, even without interaction. "Qualified dwell time" (actually read) vs "passive" (tab inactive). 30+ seconds = high quality |
| **Meaningful Comments** | Very High | 50+ character comments: high weight. Short emoji comments: low weight. Thread replies: medium-high. 1st-degree connections' comments: extra weight |
| **Shares/Reposts** | High | Shares with substantive comment >> simple reposts |
| **Network Relevance** | Medium | 1st and 2nd degree connections prioritized. Strangers only if exceptional performance |

LinkedIn explicitly reduces distribution of "engagement bait" ("comment YES if you agree", "repost if you've lived this").

### 5.3 SSI (Social Selling Index)

Score 0-100 across 4 dimensions:
1. Establishing Your Professional Brand
2. Finding the Right People
3. Engaging with Insights
4. Building Relationships

Higher SSI correlates with greater organic reach (functions as implicit "creator score").

### 5.4 Content Performance by Format

| Format | Average Reach | Engagement | Best For |
|--------|-------------|------------|----------|
| **Document/Carousel** | High | High | Educational, frameworks, lists |
| **Long text** | Medium-High | Medium | Storytelling, opinion, experience |
| **Image + text** | Medium | Medium | News, celebrations |
| **Video** | Medium | Medium-Low | Interviews, behind-the-scenes |
| **External link** | Low | Low | LinkedIn penalizes external links |
| **Newsletter** | Very High (via email) | High | Long recurring content |
| **Poll** | High (declining) | High | Market research |

**Critical insight:** LinkedIn penalizes posts with external links. Best practice: create native content. Putting link in first comment is also being penalized (2024+).

### 5.5 LinkedIn Newsletters

Best organic performance feature:
- Subscribers get email AND push notification for each edition
- Open rates 20-50% (vs ~2-5% organic reach for posts)
- Each edition distributed as both post and email

### 5.6 Employee Advocacy

Employee posts have **561% more reach** than company page posts (MSLGroup). Personal profiles have 3-5x greater organic reach than company pages.

### 5.7 Changes 2025-2026

- **Saves and Sends** added to analytics (signals valued by algorithm)
- **Anti-automation filter:** Excessive comments or automation tools can limit visibility
- **Quality over quantity:** Limit to 1-3 highly relevant tags. Expert-led content prioritized
- Algorithm functions increasingly as "trust filter"

---

## 6. Twitter/X Algorithm

### 6.1 Open-Source Revealed Weights (March 2023)

| Signal | Approximate Weight |
|--------|-------------------|
| **Reply** | 1x (baseline) |
| **Like** | 0.5x |
| **Retweet/Repost** | 1x |
| **Quote Tweet** | 1x |
| **Bookmark** | Confirmed signal (weight undisclosed) |
| **Reading time** | Growing weight |
| **Profile click** | Strong signal |
| **Link click** | Medium signal |

**Boost factors:**
- Images: ~2x boost over plain text
- Video: ~2x boost
- External links: **penalized** (X wants users on platform)
- Long threads: boosted by accumulated engagement
- Premium subscribers: ~4x boost in For You ranking (pay-to-play)

### 6.2 For You vs Following

- **For You (default):** ~50% followed + ~50% recommended. "Heavy Ranker" ML model
- **Following:** Strictly chronological, no recommendations

### 6.3 Community Notes

Decentralized fact-checking. Posts with Community Notes may have reduced distribution. Uses "bridging" algorithm -- notes only published if evaluators from different political perspectives agree.

### 6.4 Grok AI Integration

Grok (xAI) integrated directly into platform. Can summarize threads, answer questions about trending topics, analyze images. Evolving constantly.

---

## 7. Facebook Algorithm

### 7.1 Evolution: EdgeRank to MSI

- **EdgeRank (2009-2011):** Affinity x Weight x Decay
- **ML Era (2011-2018):** Thousands of features, optimized for engagement (inadvertently favored sensational content)
- **MSI - Meaningful Social Interactions (2018+):** Posts from friends/family prioritized over Pages. Content generating "meaningful conversations" (long comments, replies) prioritized. Publishers saw 40-60% organic reach drop

### 7.2 Current State (2025)

- ~30-40% of feed is recommended content from non-followed accounts (response to TikTok)
- **Reels:** Maximum distribution priority on Facebook
- **Groups:** Prioritized, especially active communities
- **Link penalty:** Links receive lower distribution than native content (photos, videos, text)
- Company Pages organic reach: frequently <2% of followers (lowest among all platforms)

### 7.3 Facebook Reels vs Long-Form

- **Reels:** Largest organic distribution of any Facebook format. Algorithm similar to Instagram Reels
- **Long-form video:** Drastically deprioritized in timeline (2017 video pivot partially reversed)
- **Facebook Live:** Still boosted during broadcast, but less impactful than 2018-2020

---

## 8. Emerging Platforms

### 8.1 Threads (Meta)

- 100M users in 5 days (fastest app launch ever, July 2023)
- 400M MAU (Aug 2025), 450M MAU (early 2026)
- Surpassed X in mobile DAU (141.5M vs 125M) in January 2026
- Algorithm: Interest-based (similar to TikTok), not just follows
- Instagram data influences recommendations
- Replies and reposts are strongest signals
- External links NOT penalized as strongly as on X

### 8.2 Bluesky (AT Protocol)

**Key innovation: Custom Feeds (Algorithmic Choice)**
- Users choose between multiple algorithms or create their own
- Chronological feed (default) + "Discover" + community-created feeds
- **AT Protocol:** Data portability -- users can theoretically migrate account, followers, content to another provider
- **Composable Moderation:** Users choose "labelers" and filter preferences

### 8.3 WhatsApp Channels

- One-way broadcast updates. Content disappears after 30 days
- Ranking signals: recency, engagement (reactions), regional popularity
- In Brazil, especially relevant given 99% WhatsApp penetration
- Open rates significantly higher than email or traditional social media

### 8.4 Pinterest

- Visual search engine more than social network
- Algorithm based on **intent** (discovery: decor, recipes, fashion)
- Pins have extremely long lifespan (months to years of traffic)
- SEO is fundamental (keywords in descriptions, board names)
- Pinterest has highest purchase intent (83% use it to plan purchases)

### 8.5 Reddit

- Karma system (upvotes/downvotes determine visibility)
- Subreddit governance with unique micro-cultures
- "Hot" algorithm: karma + recency
- Google partnership (2024): Reddit extensively indexed. Powerful indirect SEO platform

---

## 9. Recommendation Systems Theory

### 9.1 Collaborative Filtering

| Method | How It Works | Scale |
|--------|-------------|-------|
| **User-based** | "Users similar to you liked X" | Scales poorly (O(n^2)) |
| **Item-based** | "Items frequently consumed together are similar" | More scalable (Amazon's "also bought") |
| **Matrix Factorization** | Decomposes user-item matrix into latent factors. Dot product predicts interaction | Won Netflix Prize ($1M, 2009) |

### 9.2 Content-Based Filtering

Analyzes content properties instead of user behavior:
- NLP for text (topics, sentiment, entities)
- Computer Vision for images/video (objects, scenes, faces)
- Audio analysis (genre, BPM, sentiment)
- Metadata (tags, categories, hashtags, duration)

Solves cold start for new items. Limitation: doesn't capture implicit/subtle preferences.

### 9.3 Two-Tower Models (Dominant Architecture)

```
User Tower:              Content Tower:
[history]                [content type]
[demographics]  -->      [visual features]     --> Similarity Score
[interactions]  Embedding [text features]       Embedding
[device]                 [engagement stats]
```

Used by Instagram Explore, YouTube, TikTok. Pre-computed embeddings enable efficient approximate nearest neighbor (ANN) search.

### 9.4 Exploration vs Exploitation (Multi-Armed Bandits)

- **Exploitation:** Show content the algorithm knows user likes (high engagement probability)
- **Exploration:** Show new/different content to discover new interests (lower immediate probability, higher discovery potential)

| Method | Approach |
|--------|---------|
| **Epsilon-Greedy** | With probability epsilon (~5-20%), show random content |
| **Thompson Sampling** | Bayesian -- maintains probability distribution per item |
| **Upper Confidence Bound** | Favors items with high uncertainty + high potential |

TikTok: ~15-20% of FYP is exploratory content.

### 9.5 Cold Start Problem

| Type | Solutions |
|------|----------|
| **New User** | Onboarding quiz (TikTok asks interests), popular/trending as default, demographics as proxy, cross-platform data transfer (Meta shares between Instagram/Facebook/Threads) |
| **New Content** | Content-based features, creator history, batch testing (TikTok's approach), NLP/CV topic matching |

### 9.6 Embedding Spaces

- Each user: vector of ~100-500 dimensions
- Each content piece: similar vector
- Distance (cosine similarity, dot product) = relevance
- Transformers (BERT, GPT) revolutionized embedding quality with semantic understanding
- Platforms use CLIP/ViT for image embeddings, SentenceTransformers for text

---

## 10. Cross-Platform Content Strategy

### 10.1 Format Optimization by Platform

| Platform | Favored Format | Penalized Format |
|----------|---------------|-----------------|
| **Instagram** | Reels, Carousels | External links, plain text |
| **TikTok** | Vertical video (9:16), trending audio | Content with watermarks |
| **YouTube** | Long-form (8-20 min), Shorts | Short videos (<4 min) in long-form |
| **LinkedIn** | Documents/Carousels, long text | External links, corporate posts |
| **X/Twitter** | Threads, images, short video | External links (penalized) |
| **Facebook** | Reels, Group posts | Links, Page posts |
| **Pinterest** | Vertical pins (2:3), infographics | Content without keywords |

### 10.2 Cross-Posting vs Native vs Repurposing

- **Cross-posting (same piece everywhere):** Efficient but 30-50% lower performance than native
- **Native per platform:** Ideal but impractical for solo creators
- **Repurposing (recommended):** Create "master" piece, extract clips, transform insights per platform

### 10.3 Hook Patterns (First 2-3 Seconds)

| Pattern | Example |
|---------|---------|
| **Curiosity Gap** | "Most people don't know that..." |
| **Contrarian** | "Stop doing X (everyone does it wrong)" |
| **Result-First** | "I made R$50K in 30 days. Here's how." |
| **Story Hook** | "3 months ago, I was broke..." |
| **Direct Challenge** | "If you're a [persona], you NEED to know this" |
| **Pattern Interrupt** | Unexpected visual, scene change, quick cut |
| **Social Proof** | "10 million views. Here's the secret." |

### 10.4 Storytelling Structures for Social

| Framework | Structure |
|-----------|----------|
| **PAS** | Problem > Agitate consequences > Solution |
| **AIDA** | Attention (hook) > Interest (facts) > Desire (benefits) > Action (CTA) |
| **BAB** | Before (pain) > After (pleasure) > Bridge (your solution) |
| **Hero's Journey** | Normal life > Challenge > Search for solution > Transformation > New reality |

### 10.5 Optimal Posting Times (Brazil, BRT)

| Platform | Best Times | Best Days |
|----------|-----------|-----------|
| **Instagram** | 11h-13h, 19h-21h | Tue, Wed, Thu |
| **TikTok** | 12h-14h, 19h-22h | Tue-Fri |
| **YouTube** | 14h-17h (upload) | Thu, Fri, Sat |
| **LinkedIn** | 7h-9h, 12h | Tue, Wed, Thu |
| **X/Twitter** | 9h-12h | Mon-Fri |
| **Facebook** | 9h-11h, 13h-15h | Wed, Thu |

**Caveat:** These are averages. Best time for any creator is determined by their own analytics.

---

## 11. Engagement Mechanics

### 11.1 Engagement Rate Formulas

**Instagram:**
```
ER (Post) = (Likes + Comments + Saves + Shares) / Followers x 100
ER (Reach-based) = (Likes + Comments + Saves + Shares) / Reach x 100  [more accurate]
```

**Benchmarks Instagram (2025):**
| Tier | Followers | ER |
|------|----------|-----|
| Nano | 1-10K | 3-5% |
| Micro | 10-100K | 1.5-3% |
| Mid | 100K-500K | 1-2% |
| Macro | 500K-1M | 0.8-1.5% |
| Mega | 1M+ | 0.5-1% |

**TikTok:** `ER = (Likes + Comments + Shares) / Views x 100` -- 3-9% normal, >10% excellent
**YouTube:** `ER = (Likes + Comments) / Views x 100` -- 3-7% good
**LinkedIn:** `ER = (Reactions + Comments + Reposts) / Impressions x 100` -- 2-5% good, >5% excellent

### 11.2 Vanity vs Actionable Metrics

| Vanity (look good, don't indicate value) | Actionable (indicate real value) |
|------------------------------------------|----------------------------------|
| Total followers (without quality) | **Saves** (reference content) |
| Total likes (easily inflated) | **Shares/DM sends** (genuine recommendation) |
| Impressions (don't indicate interest) | **Quality comments** (emotional/intellectual connection) |
| Reach without engagement context | **Profile visits** after content view |
| | **Follower-to-lead ratio** (B2B) |
| | **Revenue per follower** |

### 11.3 Saves & Shares as Quality Signals

Both Instagram and TikTok confirmed (2024-2025) that saves and shares outweigh likes.

- **Like:** Low effort, quasi-reflexive, casual
- **Comment:** Medium effort, can be superficial
- **Save:** User wants to access again = lasting practical/emotional value
- **Share (DM):** User recommending to someone specific = strongest genuine value signal

**Implication:** Create "saveable" (tutorials, lists, frameworks, infographics) and "shareable" (relatable, surprising, useful to others) content rather than just "likeable" (beautiful but substanceless).

### 11.4 Community Building Strategies

1. Respond to comments systematically (especially first hours)
2. Create participatory content (questions, challenges, polls)
3. Name the community (give identity to follower group)
4. Consistency creates expectation and habit
5. "Insider" content (inside jokes, recurring references)
6. DM engagement (respond genuinely -- strong algorithmic weight)

### 11.5 DM Strategies

DMs are the strongest relationship signal for most algorithms:
- Instagram: frequent DM exchanges = content prioritized in feed
- TikTok: DM shares = strongest signal for Reels
- LinkedIn: InMail/DM interactions influence content ranking

**Tactics:**
- Respond to every genuine DM
- Send exclusive content via DM (Instagram broadcast channels)
- Use Stories to encourage DM replies
- Create "close friends" lists with most engaged followers

---

## 12. Creator Economy & Monetization

### 12.1 Market Overview

Creator economy: ~$250B globally (2024, Goldman Sachs), projected $480B by 2027. Brazil influencer marketing: R$2.18B (2024).

**Income distribution (extremely unequal):**
- Top 1% earn ~80% of total revenue
- ~2M creators earn >$100K/year globally
- ~46M creators are "amateur" (<$1K/year)
- Median full-time creator income: ~$50K/year

### 12.2 Platform Monetization Programs

| Platform | Program | Requirements | Revenue Model |
|----------|---------|-------------|---------------|
| **YouTube** | YPP | 1K subs + 4K hours (or 10M Shorts views/90 days) | 55% revenue share (long-form), 45% Shorts. CPM $2-30 |
| **Instagram/Facebook** | Subscriptions, Badges, Reels Bonus | Varies | Subscriptions for exclusive content. Meta less generous in direct share |
| **TikTok** | Creativity Program Beta | Videos >1 min | Pays per qualified views. RPM historically low ($0.02-0.05/1K views old Creator Fund) |
| **LinkedIn** | None (direct) | N/A | Indirect: leads, clients, consulting |
| **X/Twitter** | Ads Revenue Sharing | Premium + 5M impressions/3 months | Subscriptions, Tips |

### 12.3 Brand Deals -- Brazilian Benchmarks (2025)

| Tier | Followers | Average Price per Post (Instagram) |
|------|----------|-----------------------------------|
| Nano | 1-10K | R$200-1,000 |
| Micro | 10-100K | R$1,000-5,000 |
| Mid | 100K-500K | R$5,000-20,000 |
| Macro | 500K-1M | R$20,000-80,000 |
| Mega | 1M+ | R$80,000-500,000+ |

### 12.4 Creator Tools Ecosystem

| Category | Tools |
|----------|-------|
| **Video editing** | CapCut (dominant), Premiere Pro, DaVinci Resolve |
| **Design** | Canva (dominant in Brazil), Figma |
| **Scheduling** | Later, Buffer, Hootsuite, Metricool |
| **Analytics** | Iconosquare, Sprout Social, Metricool |
| **Link in Bio** | Linktree, Stan Store, Beacons |
| **Monetization** | Hotmart, Eduzz, Patreon, Ko-fi |
| **AI Content** | ChatGPT, Claude, Opus Clip (repurposing) |
| **CRM/Influencer** | Squid (Brazil), Influency.me, CreatorIQ |

---

## 13. Social Commerce

### 13.1 Market Overview

Global social commerce: $1.2T (2024), projected $2.9T by 2026 (Accenture). China: >15% of total e-commerce. Brazil: regional leader in Latin America.

### 13.2 Platform Shopping Features

| Platform | Features | Notes |
|----------|----------|-------|
| **Instagram Shopping** | Product tags in posts/Stories/Reels, Shop tab, Collections | Algorithm prioritizes tagged content in shopping surfaces |
| **TikTok Shop** | Product integration in videos/lives, affiliate marketplace, native checkout | Launched in Brazil 2024. ByteDance invested billions |
| **Pinterest Shopping** | Product Pins with prices, visual search, Shopping ads | 83% of users plan purchases on Pinterest |
| **WhatsApp Business** | Product catalog + WhatsApp Pay (Pix) | Brazil "last mile" of conversion |

### 13.3 Live Commerce

Growing format. In China: $500B in sales (2023). In Brazil, accelerating:
- Shopee Live: largest Brazilian live commerce operation
- Instagram Lives with product tags
- TikTok Lives (growing rapidly)
- Mercado Livre Lives (launched 2024)

**Success factors:** Urgency (limited offers), interactivity (real-time Q&A), practical demonstration, trust in presenter, exclusive discounts.

---

## 14. AI & Social Media

### 14.1 AI Content Generation Tools

| Type | Tools |
|------|-------|
| **Text** | ChatGPT, Claude, Gemini, Jasper, Copy.ai, native platform AI (Instagram captions, LinkedIn assistant) |
| **Image** | Midjourney, DALL-E 3, Stable Diffusion, Canva Magic Design, Adobe Firefly |
| **Video** | Runway ML, Pika, Opus Clip/Vidyo.ai (repurposing), Synthesia/HeyGen (AI avatars) |
| **Audio** | ElevenLabs (voice cloning), Suno/Udio (music generation), Podcastle (AI editing) |

### 14.2 AI-Powered Analytics

- **Metricool AI:** Suggests optimal times based on history
- **Lately AI:** Analyzes long content and generates social posts
- **Sprout Social AI:** Sentiment analysis and trend detection
- **Exploding Topics:** Identifies exponentially growing topics

### 14.3 Deepfakes & Synthetic Media

- Platforms invest in detection models (Meta's Video Authenticity, Google's SynthID)
- Meta, YouTube, TikTok require AI-generated content labeling
- EU AI Act and Brazilian AI Bill regulating deepfakes
- Electoral deepfakes a growing risk, especially in Brazil

### 14.4 AI Moderation

- >95% of violating content removed by AI before human reports (Meta)
- Limitations: difficulty with sarcasm, cultural context, and Brazilian Portuguese regional slang nuances
- "Borderline" content can have reduced distribution without removal (shadowban)

---

## 15. Brazilian Context

### 15.1 Social Media Landscape (2025)

| Metric | Value |
|--------|-------|
| Population | ~216M |
| Internet users | ~183M (86.2%) |
| Social media identities | ~144M (67.8%) |
| Daily social media time | 3h49min (world's highest) |
| Gender split | 55.8% female, 44.2% male |

**Platform MAU in Brazil:**

| Platform | MAU (Brazil) | Notes |
|----------|-------------|-------|
| WhatsApp | ~169M | 99% of smartphones |
| YouTube | ~142M | |
| Instagram | ~141M | #1 content platform |
| TikTok | ~131M | From 83M (2023) to 131M (2025) |
| Facebook | ~109M | |
| LinkedIn | ~75M | |
| Telegram | ~75M | Grew post-X blocks (2024) |
| Pinterest | ~38M | |
| Threads | ~34M (est.) | |
| X/Twitter | ~22M | Dropped after judicial block (2024) |

### 15.2 WhatsApp Dominance

99% smartphone penetration. Used for: personal communication, business, customer service, sales, payments (Pix via WhatsApp), news. 5M+ small businesses use WhatsApp Business.

**Marketing implication:** In Brazil, WhatsApp is frequently the "last mile" of conversion. Journeys start on Instagram/TikTok and end with "chama no zap." Strategies ignoring WhatsApp are incomplete.

### 15.3 Creator Economy Brasileira

Brazil has the 3rd largest creator economy (after US and China):
- 500K+ professional content creators
- R$2.18B influencer marketing market (2024)
- Management platforms: Squid (acquired by Locaweb), Influency.me, Airfluencers
- Multi-platform presence is the norm (Instagram + TikTok + YouTube)
- Strong humor and Brazilian cultural references
- Creator events: VidCon Sao Paulo, Influencer Conference

### 15.4 CONAR & #publi Regulation

- CONAR requires clearly identified advertising (#publi, #ad, #patrocinado)
- Article 36 Consumer Defense Code prohibits hidden/misleading advertising
- Identification must be "immediate and conspicuous" (not buried in hashtags)
- Stories/Lives need identification per slide/verbal+visual
- Fines: CONAR up to R$250,000; Procon additional fines for misleading advertising
- LGPD applies to follower data collection

### 15.5 Brazilian Benchmarks

**CPM (Cost Per Thousand Impressions) -- Ads:**

| Platform | Average CPM (Brazil) |
|----------|---------------------|
| Instagram Feed | R$15-35 |
| Instagram Stories | R$10-25 |
| Instagram Reels | R$8-20 |
| TikTok In-Feed | R$5-15 |
| YouTube Pre-Roll | R$20-50 |
| Facebook Feed | R$8-20 |
| LinkedIn | R$40-100 |

**Organic Engagement Rate:**

| Platform | Brazil ER | Global ER |
|----------|----------|-----------|
| Instagram | 1.5-3% | 1-2% |
| TikTok | 5-9% | 4-8% |
| LinkedIn | 2-4% | 1.5-3% |
| YouTube | 3-5% | 2-4% |
| Facebook | 0.5-1% | 0.3-0.8% |

Brazil consistently shows above-global-average engagement rates, reflecting highly social and participative user behavior.

### 15.6 PT-BR Content Nuances

- **Regional slang:** Algorithm NLP may not capture regional nuances. Use colloquial but nationally accessible Portuguese
- **Emojis:** Brazilians use extensively. Posts without emojis may seem "cold"
- **Tone:** Formal on LinkedIn, casual/authentic on Instagram and TikTok
- **Hashtags:** PT-BR hashtags reach Brazilian audience; English reaches global. Hybrid strategy recommended
- **Brazilian humor:** Memes, self-deprecation, comic exaggeration culturally strong and high-engagement
- **Brazilian music:** Trending Brazilian songs on TikTok/Reels can generate local boost
- **Key dates:** Carnaval, Festa Junina, Black Friday (extremely strong in Brazil), Dia das Maes

---

## 16. Key People & References

### 16.1 Essential Thinkers

| Person | Contribution | Key Work |
|--------|-------------|----------|
| **Eli Pariser** | Coined "filter bubble" | "The Filter Bubble" (2011) |
| **Tristan Harris** | "Race to the bottom of the brainstem" | "The Social Dilemma" (Netflix, 2020) |
| **Eugene Wei** | "Status as a Service", "TikTok and the Sorting Hat" | Essays (2019, 2020) |
| **Nir Eyal** | Hook model (Trigger > Action > Variable Reward > Investment) | "Hooked" (2014) |
| **Jonah Berger** | STEPPS framework for virality | "Contagious" (2013) |
| **Gary Vaynerchuk** | "Jab Jab Jab Right Hook" framework | "Jab, Jab, Jab, Right Hook" (2013) |
| **Li Jin** | "100 True Fans" (update of Kevin Kelly's 1,000) | "The Passion Economy" (2020) |
| **Chris Dixon** | "Read Write Own" -- Web evolution framework | "Read Write Own" (2024) |
| **Jaron Lanier** | Critique of ad-based social media model | "Ten Arguments..." (2018) |
| **Casey Newton** | Leading journalist on platform decisions | Platformer newsletter |

### 16.2 Essential Books

| Book | Author | Year | Core Topic |
|------|--------|------|-----------|
| "The Filter Bubble" | Eli Pariser | 2011 | Algorithmic personalization critique |
| "Hooked" | Nir Eyal | 2014 | Habit-forming products / social engagement |
| "Contagious" | Jonah Berger | 2013 | Science behind virality (STEPPS) |
| "Jab Jab Jab Right Hook" | Vaynerchuk | 2013 | Platform-specific content strategy |
| "No Filter" | Sarah Frier | 2020 | Internal Instagram history |
| "The Age of Surveillance Capitalism" | Shoshana Zuboff | 2019 | Data economy and platform surveillance |
| "Read Write Own" | Chris Dixon | 2024 | Decentralized future of platforms |
| "Influence" | Robert Cialdini | 2006 | 6 persuasion principles applied to social |

### 16.3 Essential Academic Papers

| Paper | Authors | Year | Contribution |
|-------|---------|------|-------------|
| Deep Neural Networks for YouTube Recommendations | Covington et al. (Google) | 2016 | YouTube two-stage recommendation architecture |
| Monolith: Real Time Recommendation System | Liu et al. (ByteDance) | 2022 | TikTok recommendation architecture |
| Instagram Explore Recommender System | Medvedev et al. (Meta) | 2019 | Two-tower model for Explore |
| Attention Is All You Need | Vaswani et al. (Google) | 2017 | Transformer architecture -- base for modern recommendation |
| The Spread of True and False News Online | Vosoughi et al. (MIT) | 2018 | Fake news spreads 6x faster than truth on social media |
| Algorithmic Amplification of Politics on Twitter | Huszar et al. (Twitter) | 2021 | Internal study on political content amplification |

---

## 17. Actionable Checklists

### Platform-Specific Content Optimization

**Instagram:**
```
[ ] Reels: Hook in first 3 seconds (visual + text)
[ ] Reels: Optimize for watch-through (keep viewers to end)
[ ] Carousels: 5-10 slides with actionable content (save-worthy)
[ ] Stories: Use interactive elements (polls, quizzes, questions)
[ ] Post when followers are online (check Insights)
[ ] Respond to DMs to strengthen relationship signal
[ ] No TikTok watermarks on Reels
[ ] Create original content (avoid pure reposting)
```

**TikTok:**
```
[ ] Hook in first 2 seconds (high skip rate = suppression)
[ ] Optimize for completion rate + total watch time
[ ] Use trending audio when relevant
[ ] Add on-screen text (indexed for categorization)
[ ] Skip #fyp/#foryou hashtags (irrelevant)
[ ] Use niche hashtags for initial categorization
[ ] Create for shares (DM shares = strongest signal)
```

**YouTube:**
```
[ ] Thumbnail: High contrast, expressive face, short text
[ ] Title: Keyword at start, < 60 chars, curiosity element
[ ] Description: 200+ words, keyword in first 100 chars, timestamps
[ ] Optimize for both CTR AND watch time (avoid clickbait)
[ ] First 30 seconds must retain viewers
[ ] Cards and end screens to extend session time
[ ] Consider thumbnail A/B testing
```

**LinkedIn:**
```
[ ] Write long-form text that rewards reading time (dwell time is #1 signal)
[ ] Use document carousels for educational content
[ ] Avoid external links in post (native content only)
[ ] Engage meaningfully in comments (50+ characters)
[ ] Limit to 1-3 highly relevant hashtags
[ ] Leverage newsletter feature for maximum organic reach
[ ] Post during business hours (7-9h, 12h BRT)
```

### Engagement Quality Assessment

```
[ ] Are saves/shares growing (not just likes)?
[ ] Are comments substantive (not just emojis)?
[ ] Are profile visits increasing after content view?
[ ] Is follower-to-lead ratio improving (B2B)?
[ ] Are DM conversations increasing?
[ ] Is engagement velocity strong in first 30-60 minutes?
[ ] Is content being referenced/cited by others?
```

### Cross-Platform Repurposing Workflow

```
1. Create master content piece (long video, podcast, or article)
2. [ ] Extract 5-10 clips for Reels/TikTok/Shorts (add native captions)
3. [ ] Transform key insights into Instagram/LinkedIn carousels
4. [ ] Create text threads for X/Twitter
5. [ ] Write newsletter edition from key takeaways
6. [ ] Design 5-10 quote cards for Stories
7. [ ] Adapt tone/format for each platform culture
8. [ ] Schedule across platforms at optimal times per analytics
```

### Brazilian Market Checklist

```
[ ] Content in Brazilian Portuguese (not Portugal Portuguese)
[ ] WhatsApp strategy integrated (last mile of conversion)
[ ] #publi disclosure on ALL sponsored content
[ ] LGPD compliance for data capture
[ ] Cultural calendar planned (Carnaval, Black Friday, Dia das Maes)
[ ] Emojis used appropriately for Brazilian audience expectations
[ ] Brazilian trending audio/music considered for Reels/TikTok
[ ] Regional nuances tested (humor style, slang level)
[ ] PIX integration for micro-transactions if applicable
```

### Algorithm Health Monitoring

```
Monthly:
[ ] Review reach trends per content type
[ ] Compare engagement rate vs platform benchmarks
[ ] Check for distribution anomalies (possible restriction)
[ ] Audit content against known penalties (watermarks, engagement bait)
[ ] Review posting times vs follower activity patterns

Quarterly:
[ ] Check for algorithm updates from official platform sources
[ ] Review format performance shifts (carousels vs Reels vs static)
[ ] Assess signal weight changes (saves vs likes vs shares)
[ ] Update content strategy based on platform direction
```

---

> **Source research:** MS-007 Social Algorithms Master System | 42 sources | April 2026
> **Compiled for:** squad-content knowledge-base | SINAPSE AI
