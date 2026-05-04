# Data Storytelling

> Version: 1.0.0 | Agent: nancy-duarte | Domain: presentations, data-narrative

## Overview

Data storytelling is the practice of using narrative structure, visual design, and selective data presentation to communicate insights in ways that drive understanding and action. Raw data informs; data stories move people.

The paradox of data: the more data you have, the harder it is to communicate. Data storytelling resolves this by applying narrative logic to analytical content.

**Primary specialist:** Nancy Duarte (DataStory, Resonate)
**Supporting context:** Hans Rosling (Factfulness), Heath Brothers (Made to Stick)

---

## The Core Problem: Data Without Narrative

Most data presentations fail not because the data is wrong, but because:
- Too much data — the audience is overwhelmed and remembers nothing
- No tension — data is presented as information, not as story
- No protagonist — there's no "character" (person, organization, situation) whose fate the data measures
- No urgency — data without consequence doesn't motivate action
- Wrong audience — technical data delivered to decision-makers

**The fix:** Data storytelling imposes narrative structure on analytical content. The data becomes evidence for a story, not a replacement for it.

---

## Nancy Duarte — DataStory Framework

**Source:** "DataStory: Explain Data and Inspire Action Through Story" (2019)

### The DataStory Framework

1. **Form your data** — Explore and understand what the data actually shows before deciding what to say
2. **Focus your insight** — What is the one most important thing the data reveals?
3. **Configure a story** — Structure the insight as a narrative with tension and resolution
4. **Create data displays** — Design visuals that support the narrative
5. **Influence your audience** — Deliver the story to drive the specific action needed

### Step 1: Form — Four Types of Data Insight

Before storytelling, identify what TYPE of insight you have:

| Insight Type | What It Shows | Visual Type |
|-------------|--------------|-------------|
| **Comparison** | How items relate to each other | Bar chart, column chart, dot plot |
| **Trend** | How things change over time | Line chart, area chart |
| **Relationship** | How variables correlate | Scatter plot, bubble chart |
| **Part-to-whole** | How components make up a total | Pie chart (use sparingly), treemap, stacked bar |

**Common error:** Using the wrong chart type for the insight type. Using a pie chart to show trend. Using a line chart for categories. The wrong visual obscures the insight.

### Step 2: Focus — The One Insight

Data presentations fail when they try to show everything. DataStory forces a single, answerable question:

**The big idea sentence:** "[Person/group] should [take action] because [data insight + consequence]"

Example: "The marketing team should shift 30% of budget to email because email generates 4x more qualified leads per dollar than paid social."

Everything in the presentation either supports this sentence or should be cut.

### Step 3: Configure — Story Structure for Data

Apply the Sparkline to data:

```
WHAT IS (the current data state — the uncomfortable truth)
WHAT COULD BE (the data trend that's possible, the benchmark we could reach)
WHAT IS (the obstacles, the barriers, the data that shows the gap)
WHAT COULD BE (the vision if we act on the insight)
[THE STAR MOMENT: the single most surprising/important data point]
CALL TO ACTION (specific decision or behavior change)
```

### The Tension Pair in Data

The most effective data stories show a tension between two data points:
- Where we are vs. where we could be
- Our performance vs. the benchmark
- The trend if we act vs. the trend if we don't
- The cost of the problem vs. the cost of the solution

---

## Chart Selection Guide

The most common chart types and when to use each:

| Chart Type | Best For | Avoid When |
|-----------|---------|-----------|
| **Bar chart** | Comparing discrete categories | Too many categories (>12) |
| **Column chart** | Comparing over few time periods | Many time periods (use line instead) |
| **Line chart** | Trends over time | Few time periods (use column) |
| **Area chart** | Cumulative trends, part-to-whole over time | Comparing separate series |
| **Scatter plot** | Correlation between two variables | Audience unfamiliar with scatter plots |
| **Bubble chart** | Three-variable relationships | Small differences between bubbles |
| **Pie chart** | Part-to-whole (use only with 2-3 slices) | More than 4 slices; comparisons over time |
| **Treemap** | Hierarchical part-to-whole | Fine-grained comparison needed |
| **Heatmap** | Patterns in matrices | Small datasets |
| **Table** | Precise values matter | Finding trends or comparisons |

---

## Slide Design Principles for Data

### One Insight Per Slide
Each slide communicates exactly one idea. If a slide needs a title to explain itself, the visual isn't working. The title states the insight (declarative sentence), not the data type.

**Wrong title:** "Q3 Revenue by Region" (just a label)
**Right title:** "Northeast Revenue Grew 40% While All Other Regions Declined" (the insight)

### Slide Titles as Story
A sequence of slide titles should tell the story on their own. Executive audiences often only read titles. If the titles tell the story, the slides are working.

**Test:** Print only the slide titles. Does the narrative make sense? Does the story build?

### Data Decoration vs. Data Communication

**Decoration** (avoid):
- 3D charts (distort proportions)
- Gradient fills (add noise)
- Unnecessary borders and gridlines
- Decorative images unrelated to data
- "Chart junk" (Tufte's term for unnecessary visual elements)

**Communication** (use):
- Clear labeling of axes
- Data labels on key points
- Annotation of significant moments
- Highlighting the specific data point the story is about
- White space (negative space directs attention)

---

## The Annotation Technique

One of the most powerful data storytelling tools: annotating the chart with the narrative context.

Instead of a bare chart, add:
- **Event annotations:** "Product launch," "Competitor enters market," "Policy changed"
- **Consequence annotations:** "This gap represents 2,000 customers lost monthly"
- **Comparison annotations:** "Industry average" line on your performance chart
- **Highlight annotations:** Circle or highlight the specific data point the story is about

The annotation bridges data and narrative. It says: "Here's what the number means in the world."

---

## Hans Rosling's Approach

Hans Rosling (1948-2017) was a statistician who became famous for making global development data accessible and compelling. His approach synthesizes data with storytelling in ways that changed how people perceive the world.

### Rosling's Core Techniques

**1. The Bubble Chart Animation**
Rosling used animated bubble charts (Gapminder) to show how global health and wealth changed over decades. The animation was narrative — it showed the story of progress over time.

**Key insight:** Static data is a snapshot. Animated data shows movement — and movement is story.

**2. Concrete Scale**
Rather than large numbers, Rosling always brought them to human scale.
- Not "1 billion people" — "Every person in China plus every person in India and half of Africa"
- Not "child mortality fell 50%" — "In 1950, 1 in 5 children died before age 5. Today, it's 1 in 25."

**Scale** creates emotional recognition. Abstract numbers create cognitive distance.

**3. Factfulness — Fighting Overdramatic Instincts**
Rosling identified 10 instincts that cause people to misread data:
- The Gap Instinct (seeing distinct groups when continuums exist)
- The Negativity Instinct (bad news registers more than good)
- The Straight Line Instinct (assuming trends continue linearly)
- The Fear Instinct (overweighting dramatic, scary data)
- The Size Instinct (big numbers seem more important without proportion)

**Storytelling application:** Great data stories actively counter these instincts by providing context, proportion, and counterintuitive framing.

---

## The Narrative Arc for Data Presentations

### Structure for Executive Audiences (< 15 minutes)

```
1. THE SITUATION (2 min)
   - What question are we answering?
   - Why does it matter now?
   - One chart that shows the key context

2. THE INSIGHT (5 min)
   - The specific finding — the "but" in the data
   - 2-3 supporting evidence slides
   - The star data moment (most surprising finding)

3. THE IMPLICATION (3 min)
   - What this means for the business
   - The cost of acting vs. not acting
   - One slide with the consequence

4. THE RECOMMENDATION (5 min)
   - Specific proposed action
   - What it requires
   - Expected outcome
   - The ask
```

### Structure for Technical Audiences (30-60 minutes)

Same structure but with expanded supporting data, methodology disclosure, and uncertainty quantification.

---

## Data Storytelling Anti-Patterns

| Anti-Pattern | Problem | Fix |
|-------------|---------|-----|
| "Data dump" deck | 40 slides of raw data, no narrative | Find the single most important insight first |
| Misleading axes | Y-axis doesn't start at zero on bar charts | Start bar charts at zero; label explicitly |
| 3D charts | Visual distortion makes comparison inaccurate | Use 2D only |
| Too many colors | No hierarchy, no emphasis | 3 colors maximum; highlight color for key data |
| Title as label | "Q3 Results" tells nothing | "Q3 Results Beat Target by 23%" tells a story |
| Missing context | Raw numbers without benchmarks | Always show context: target, trend, comparison |
| Precision theater | 6 decimal places imply false accuracy | Round appropriately; acknowledge uncertainty |

---

## Cross-Reference

- **Nancy Duarte's Sparkline** is the presentation framework that surrounds the data story
- **Park Howell's ABT** provides the "But" that makes data narratively interesting
- **Made to Stick (Heath Brothers)** provides the SUCCESs model for making data memorable
