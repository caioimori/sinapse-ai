# Knowledge Base: AI Copy Human-in-the-Loop Canon

> **Status:** Canon — canonical source of truth for when AI drafts ship, when humans intervene, and how the handoff works inside `squad-copy` (Quill).
> **Version:** 1.0 (shipped with squad-copy v2.0.0 framework-upgrade / fw-v2.5)
> **Raises to canon:** `ai-copy-production.md` (capability note, still valid as reference)
> **Depends on:** `market-awareness-spectrum.md`, `persuasion-architecture-framework.md`, `voice-and-tone-system.md`

## Why this doc exists

`ai-copy-production.md` documents **capability** — what AI does well, where humans are insubstituible. It is correct and still useful, but it is not a canon — it does not tell an operator "on this specific copy job, should you ship the AI draft, light-edit it, rewrite it, or scrap it and start over?" That decision question is the single most common one in day-to-day copy work in 2026, and getting it wrong in either direction costs money — over-editing wastes hours on copy AI could have drafted well, under-editing ships commodity copy that underperforms.

This canon is the decision framework. Every copy agent in `squad-copy` that uses AI assistance MUST run the 4-gate decision tree before deciding the edit depth on a piece of copy.

---

## 1. The 4-gate decision tree

Given an AI draft, the operator asks FOUR questions in order. The first **NO** answer determines the action.

```
Gate 1: TRUST — Can the AI draft ship as-is with spot-check only?
   YES → Ship it (proofread + fact check only)
   NO  → Gate 2

Gate 2: LIGHT EDIT — Can a 10-20% touch-up make it ship-ready?
   YES → Apply light edit (voice, polish, hooks)
   NO  → Gate 3

Gate 3: HEAVY REWRITE — Is the structure usable as scaffolding?
   YES → Heavy rewrite on top of AI scaffolding
   NO  → Gate 4

Gate 4: SCRAP — Is there any salvageable angle or data?
   YES → Extract what's salvageable, start over from brief
   NO  → Scrap entirely, write from zero
```

Each gate has its own signal set. The signals are ordered from highest-leverage to lowest — any strong NO on a high-leverage signal drops the draft to the next gate immediately.

---

## 2. Gate 1 — Trust

**Ship the AI draft with only proofreading and fact-checking.**

### When Gate 1 passes

All of the following are true:
- **Stakes are low** — social media post, internal comms, minor UI microcopy, FAQ entry
- **Market awareness** is informed or aware (per `market-awareness-spectrum.md` Schwartz levels 3-5), i.e. the reader already knows the product/category and needs information, not persuasion
- **Brand voice is generic-professional** — the brand's voice is not a differentiator, functional clarity is the goal
- **No claims** — the draft makes no factual/statistical/outcome claims that need verification
- **Format is standardized** — headline/body/CTA or similar well-trodden pattern

### What Gate 1 copy looks like
- Product feature bullets, "you can also do X" microcopy, 404 pages, confirmation toasts
- Social media slot fillers (not hero posts)
- Internal comms drafts
- FAQ answers for operational questions

### Required steps before ship
1. Proofread (human eye, not AI spell-check)
2. Fact-check every claim
3. Compliance scan (no regulated claims — health, financial, legal)
4. Brand voice sanity check — single pass for "does this sound like us"

### Recommended AI driver
See §6 prompt library — use the `gate-1-draft` template.

---

## 3. Gate 2 — Light edit (10-20% touch-up)

**AI draft is the baseline, human adds voice + polish + conversion levers.**

### When Gate 2 passes (and Gate 1 fails)

- **Stakes are moderate** — email body, landing page section, ad copy variant, blog intro
- **Market awareness** is solution-aware (Schwartz level 3), reader knows the problem but not your solution
- **Brand voice is distinctive** but the AI can approximate it with strong prompting
- **Claims exist** but are verifiable and simple
- **The hook/CTA needs sharpening** but the body is fine

### What the light edit typically changes
- **Hook** — replace or sharpen the opening 1-2 sentences (AI defaults are generic)
- **Voice injection** — swap 5-15% of the vocabulary for brand-specific register (lexicon, metaphors, rhythm)
- **Conversion lever** — add 1-2 persuasion triggers from `persuasion-triggers-catalog.md` the AI missed
- **CTA** — rewrite from AI's generic "Learn more" / "Saiba mais" to the brand's canonical CTA pattern
- **Proof** — inject specific proof elements (numbers, testimonials, case studies) AI did not have
- **Cut** — remove 10-20% of filler the AI added

### What Gate 2 does NOT do
- Does not rewrite the structure — if the structure is wrong, escalate to Gate 3
- Does not add a new angle — if the angle is off, escalate to Gate 3
- Does not fix factual errors by "softening" them — always correct or escalate

---

## 4. Gate 3 — Heavy rewrite

**AI draft is scaffolding, human authors 50-80% of the final text on top of it.**

### When Gate 3 passes (and Gate 2 fails)

- **Stakes are high** — sales page hero, launch email, ad campaign flagship, VSL script
- **Market awareness** is product-aware or most-aware (Schwartz levels 4-5), reader needs nuanced persuasion
- **Brand voice is highly distinctive** and AI approximations lose the specific rhythm, references, or controversy the brand owns
- **Opinion / point-of-view is required** — AI defaults to consensus, brand defaults to a sharp POV
- **Complex proof** — multiple studies, custom data, interlocked testimonials
- **Objection handling is layered** — 3+ objections handled in a specific order with specific reframes

### What the heavy rewrite typically does
- **Keeps the AI's structural outline** (sections, order, rough length)
- **Keeps some AI bullets/data points** that are useful (if any)
- **Replaces 50-80% of the prose** with human-authored voice
- **Rewrites every section opener** — AI openers are almost always generic
- **Reorders for conversion** — AI tends to information-order; humans convert-order
- **Adds the brand's signature moves** — specific metaphors, signature phrases, callbacks
- **Proof injection at full depth** — not just "we helped N customers" but the specific story

### AI role in Gate 3
Gate 3 is NOT "AI is useless". AI is still the scaffolding — the outline, the brainstorm, the objection enumeration, the headline variants (pick 1 from 25). The heavy lift is human because the brand signature and POV are non-negotiable on high-stakes copy.

---

## 5. Gate 4 — Scrap and start from zero

**AI draft is not usable. Start from the original brief.**

### When Gate 4 passes (and Gate 3 fails)

- **The angle is wrong** — AI picked a generic angle when the brief needed a contrarian one
- **The brand voice is so specific** that AI cannot approximate it without producing cringe (Seth Godin-style blogs, David Ogilvy direct-response longform, Brazilian direct-response with specific regional flavor)
- **Legal/compliance is delicate** — regulated industry, claim scrutiny, political/cultural sensitivity
- **The piece requires lived experience** — "I built X and here's what I learned" copy where authenticity IS the value prop
- **The AI draft shows hallucinations** — made-up statistics, fabricated testimonials, invented product features — at which point the draft is contaminated and cannot be "fixed"

### How to use AI when scrapping to start over
1. Generate 20-50 **hooks/angles** with AI (cheap brainstorming)
2. Human picks 1 angle
3. Human writes the piece from zero
4. AI does **editing passes** on the human draft (copy-editing, not re-drafting)
5. AI does **variant generation** (headline variants, CTA variants, subject line variants — 10-25 options per slot)
6. Human picks finalists, ships

The AI is a **research/brainstorm/variant tool** in Gate 4, not a drafter.

---

## 6. AI prompt library (agent-owned)

Every copy agent in `squad-copy` owns 1-2 AI prompt templates aligned to their specialty. The templates live in the agent file and are referenced here for the canonical set. Agent ownership prevents drift and ensures accountability.

| Prompt template | Purpose | Owner agent | Typical gate |
|----------------|---------|-------------|-------------|
| `gate-1-draft` | Generic AI draft for low-stakes copy | copy-editor | Gate 1 |
| `hook-brainstorm` | 25 hook/angle variations for an offer | headline-specialist | Gate 3-4 |
| `headline-variants` | 25 headline variations from a single angle | headline-specialist | Any |
| `objection-enumeration` | Enumerate objections for a given audience + offer | copy-strategist | Gate 2-4 |
| `objection-handler` | Reframe 1 objection in 3 angles | copy-strategist | Gate 2-3 |
| `proof-synthesis` | Assemble proof elements (testimonials, data, case studies) into persuasive summary | copy-strategist | Gate 2-3 |
| `cta-variation` | 10 CTA variations (action verb × reward × urgency) | ad-copywriter | Any |
| `subject-line-cascade` | Cold → warm → hot subject lines for an email sequence | email-copywriter | Gate 1-2 |
| `vsl-beat-sheet` | VSL structure beat-by-beat from a brief | vsl-scriptwriter | Gate 3 |
| `social-compression` | Compress long-form into platform-native short form | social-copywriter | Gate 1-2 |
| `market-awareness-diagnostic` | Diagnose reader's Schwartz awareness level from a brief | copy-strategist | Pre-draft |
| `voice-audit` | Audit a draft against brand voice canon, flag drift | copy-editor | Any gate's exit check |

**Rule:** Before a prompt template is added to the library, the owner agent must have run the template on ≥ 3 real copy jobs and the quality must be documented in the agent's MEMORY.md. Unproven prompts do not enter the canon library.

---

## 7. Signals cheat sheet — which signals push which way

| Signal | Pushes toward |
|--------|--------------|
| Low stakes, generic voice, informed audience | Gate 1 |
| Moderate stakes, distinctive voice, solution-aware audience | Gate 2 |
| High stakes, sharp POV, most-aware audience | Gate 3 |
| Regulated industry / legal sensitivity | Gate 3 or 4 |
| Requires lived experience / authenticity | Gate 4 |
| AI hallucinated facts | Gate 4 (draft contaminated) |
| Complex interlocked proof | Gate 3 |
| Simple verifiable claims | Gate 1 or 2 |
| Brand has signature moves (metaphors, callbacks, controversy) | Gate 3 |
| Copy is template-fillable (FAQ, toast, microcopy) | Gate 1 |
| Multi-step objection handling required | Gate 3 |
| Single objection, standard reframe | Gate 2 |

---

## 8. Production hygiene (every AI-assisted piece)

Every AI-assisted copy deliverable MUST record:

1. **Gate used** — which of the 4 gates (Trust / Light / Heavy / Scrap)
2. **Prompt template(s) used** — from the library in §6
3. **Model used** — e.g. GPT-5, Claude (Opus/Fable family), Gemini 2.5 Pro
4. **Final edit depth** — rough % AI vs human in the shipped version
5. **Conversion outcome** (if tracked) — linked to the attribution system

This record belongs in the copy job's handoff artifact. The record is used to:
- Audit the gate decisions over time (are we systematically over/under-editing?)
- Train operators on gate selection
- Feed back into the prompt library (which prompts outperform, which drift)

---

## 9. Anti-patterns (forbidden)

- **Skipping gate selection** — shipping whatever AI produced without running the 4-gate decision
- **Systematic Gate 1** — defaulting to "AI is good enough" for high-stakes copy
- **Systematic Gate 4** — defaulting to "rewrite everything from zero" for low-stakes copy (wastes the AI leverage)
- **Editing hallucinated facts instead of flagging them** — a draft with hallucinations is contaminated, escalate to Gate 4 or rerun the prompt with facts in context
- **Using "in the voice of [living copywriter]"** — legally risky and produces pastiche; use attribute descriptions instead
- **Shipping without production hygiene (§8)** — if you can't reconstruct the gate + prompt + model used, the job is undocumented
- **Mixing AI prose and human prose without re-voice-pass** — AI sections stand out from human sections unless a final voice pass unifies them
- **Treating AI variants as consensus output** — always pick ONE finalist per variant generation, never ship "an average"
- **Re-generating endlessly to avoid human decision** — if you're on your 10th generation and still unhappy, escalate to Gate 3 or Gate 4 instead of regenerating

---

## 10. Integration with existing KBs

- `ai-copy-production.md` — capability reference (what AI does well / where humans are insubstituible). Still valid; this canon builds on it.
- `market-awareness-spectrum.md` — Gate 1-4 signals reference the Schwartz awareness levels directly.
- `persuasion-architecture-framework.md` — the "conversion levers" that Gate 2 light-edits inject.
- `persuasion-triggers-catalog.md` — individual triggers the Gate 2 edit inserts.
- `voice-and-tone-system.md` — the voice canon that the Gate 2 voice injection and Gate 3 rewrite enforce.
- `copywriting-formulas-encyclopedia.md` — structural scaffoldings that AI drafts rarely get right without explicit instruction.
- `legendary-copywriters-frameworks.md` — the POV/signature moves that Gate 3 rewrites restore.

## Change log

- **2026-04-12 (v1.0)** — Created as part of squad-copy v2.0.0 / fw-v2.5. Raises `ai-copy-production.md` from capability reference to a canonical 4-gate decision framework covering Trust / Light / Heavy / Scrap with signals, AI prompt library (12 templates mapped to owner agents), production hygiene, integration with existing KBs, and anti-patterns.
