# Knowledge Base: AI Visual Generation Canon

> **Status:** Canon — canonical source of truth for how `squad-brand` (Meridian) produces brand-consistent visual output at scale using AI image/video models.
> **Version:** 1.0 (shipped with squad-brand v2.0.0 framework-upgrade / fw-v2.3)
> **Depends on:** `ai-api-capabilities.md` (capability catalog), `prompt-engineering-visual.md` (prompt mechanics)
> **Supersedes:** ad-hoc generation workflows

## Why this doc exists

`ai-api-capabilities.md` is a **catalog** — "which API does what". `prompt-engineering-visual.md` is a **mechanics reference** — "how to write a prompt". Neither is a **canon** — "the rules that must hold for every brand asset we ship". In 2026, ~80% of brand visual production runs through AI models, and the gap between "I generated something that looks cool" and "I generated something that is on-brand and legally safe to ship" is the single biggest risk factor for brand drift.

This KB is the canonical playbook. Every agent in `squad-brand` that produces visual assets (brand-collateral-designer, brand-identity-designer, brand-motion-vfx, brand-creative-engineer) MUST comply with this canon for any asset that will leave the studio.

---

## 1. The 5 brand-consistency dimensions (lock these, always)

Every batch of AI-generated visual output is judged on 5 dimensions. Each dimension has a **lock protocol** — the concrete steps that enforce consistency across a batch, across sessions, across months.

### 1.1 Style lock

**What it means:** The "visual vocabulary" — illustration style, render style, graphic sensibility. A batch must NOT mix photorealistic shots with flat illustrations unless the brand canon explicitly allows both.

**Lock protocol:**
1. Declare the style in the brand canon (e.g. "editorial photography, natural light, medium grain").
2. For each generation session, prepend the exact canon style phrase to every prompt.
3. Pin 1-3 reference images in the model session (every modern model accepts reference input — Midjourney `--cref`, Stable Diffusion IP-Adapter, DALL-E upload, Flux img2img).
4. If the model drifts mid-batch, STOP and re-seed with the reference — never "work around" drift in post.

### 1.2 Lighting lock

**What it means:** Direction, hardness, color temperature, time-of-day. Lighting is the highest-signal brand marker after color and is often the first thing that drifts.

**Lock protocol:**
1. Codify lighting in the canon: direction (N-SW 45°), hardness (soft/medium/hard), color temp (K), intensity (flat/dimensional/dramatic).
2. Use precise vocabulary in prompts — "soft north-light 5500K, subtle rim" beats "nice lighting".
3. Reference-image lock handles lighting implicitly when the reference is on-brand.
4. For video: lock AFTER first frame — subsequent frames must inherit the anchor frame's lighting.

### 1.3 Palette lock

**What it means:** Every color in the output must either be in the brand palette OR be a naturalistic color that the brand palette allows in context (e.g. skin tones, sky).

**Lock protocol:**
1. Brand canon declares: primary palette (3-5 colors), secondary palette (5-10), neutrals (3-5), allowed environmental colors (context-dependent).
2. Prompts reference specific named colors ("cerulean #1E40AF, warm ivory #FAF8F1").
3. Post-generation palette extraction — run a script (or visual check) on the output against the declared palette. Any color > 5% area that is NOT in the allowed set is a FAIL.
4. For illustrations/vectors: use a color-palette LUT or Figma variable binding to hard-lock at the design-tool layer.

### 1.4 Subject lock

**What it means:** The specific entity (person, product, space) must be recognizably the same across all shots in a batch. This is the most technically demanding dimension and the one where naive prompting fails hardest.

**Lock protocol:**
1. For **real people/products** the brand owns: use a trained LoRA / DreamBooth / textual inversion model of the subject (or Midjourney `--cref` / Flux reference).
2. For **synthetic characters** that recur: lock via seed + prompt signature + reference image pinning. Treat the first accepted generation as the canonical reference and build the LoRA from the batch.
3. For **products**: the reference image is the source of truth — every shot is inpainting/compositing, not free generation. Never trust a pure text-to-image generation of a real product.
4. When the subject is **generic** (a crowd, a landscape): no subject lock required but the other 4 dimensions still apply.

### 1.5 Composition lock

**What it means:** Framing, aspect, focal points, negative space behavior. Composition is the dimension most often "drifted" by AI models because they default to centered hero compositions.

**Lock protocol:**
1. Specify aspect explicitly in every prompt (aspect params, `--ar`, output resolution).
2. Specify framing vocabulary: close-up / medium / wide / establishing, eye-level / low / high angle.
3. For batches that need composition variety: define the variety upfront (3 framings × 2 angles = 6-cell grid) and generate per cell, not free.
4. For templates (social media slots, email headers): use ControlNet/reference with the canonical layout wireframe.

---

## 2. Model selection matrix (when to use which)

| Output type | First choice | Second choice | When to use which |
|-------------|-------------|---------------|-------------------|
| Hero editorial photography | Flux / Midjourney v6+ | Stable Diffusion + SDXL refiner | Flux for realism + control, MJ for aesthetic polish |
| Product shots on white | Stable Diffusion + ControlNet | DALL-E 3 edit | SD for compositing precision, DALL-E when product reference isn't available |
| Illustration series | Midjourney + style LoRA | Flux + reference image | MJ has the best style coherence for non-photo |
| Text-in-image (posters, quote cards) | Ideogram | DALL-E 3 | Ideogram is the only model with reliable text rendering in 2026 |
| Character consistency across batch | LoRA-trained Flux / SD | Midjourney `--cref` | Train once, reuse everywhere |
| Product in lifestyle scene | SD img2img with product reference | Photoroom API → AI background | SD if you need the product to exist; Photoroom if you have the product photo and need the context |
| Video (short, 2-5 sec) | Runway Gen-3 / Kling 2.0 | Pika Labs | Runway for cinematography, Kling for physical realism |
| Motion graphics | Figma → Rive → Lottie | After Effects + plugin generation | Stay vector whenever possible — AI video is still expensive per second and drift-prone |
| Brand animation (logo, intro) | Manual (After Effects / Rive) | — | Brand logo motion is canon — NEVER free-generate, always hand-authored |

**Rule:** If the output will carry the **wordmark**, the **logomark**, or a **recognizable brand character**, the AI model is assisting a human motion designer, not driving the work. Free-generation is banned for identity-critical assets.

---

## 3. Style-lock techniques (detailed reference)

### 3.1 Reference images
- Always the first line of defense. Modern models all support it.
- Pin 1-3 references — more than 3 causes the model to average and lose specificity.
- References should be EXACT matches for the dimensions you're locking (style reference for style, subject reference for subject, composition reference for composition).

### 3.2 LoRA / DreamBooth / textual inversion
- For recurring subjects or recurring style, train a LoRA (recommended: 15-50 images, 1500-3000 steps on SDXL or Flux).
- LoRA is the most reliable lock for subject + style. It's an hour of setup that saves weeks of re-prompting.
- Maintain a LoRA registry per brand: `brands/{brand}/loras/{subject}/v{n}.safetensors` with changelog.

### 3.3 Seed control
- Locking a seed pins one axis of randomness. Useful for A/B style tests (same seed, different prompts).
- NOT sufficient alone — same seed + different prompt still drifts.

### 3.4 ControlNet / Canny / depth / pose
- Pin composition and structure via a control map derived from a wireframe/sketch.
- Essential for templated outputs (social media slot layouts, email header banners).
- Control + LoRA + seed = maximum lock.

### 3.5 Negative prompts
- Every brand canon should include a banned vocabulary list. Hard-code the list into every prompt as negatives.
- Example bans: "watermark", "logo overlay", "low quality", "deformed", "stock photo look", plus brand-specific bans.

---

## 4. Batch consistency QA checklist (mandatory per batch)

Before any batch ships out of the studio, it MUST pass this checklist:

| # | Check | Threshold | Action if FAIL |
|---|-------|-----------|---------------|
| 1 | Style dimension matches canon reference | Visual inspection | Regenerate with style reference |
| 2 | Lighting dimension matches canon | Visual inspection | Regenerate with lighting reference |
| 3 | Palette extraction — all > 5% colors in allowed set | Script / visual | Color-correct or regenerate |
| 4 | Subject dimension — same entity across all shots where required | Visual + reference comparison | Regenerate with stronger LoRA/reference |
| 5 | Composition dimension — matches declared framing grid | Visual | Regenerate per cell |
| 6 | Text accuracy (if text-in-image) — spelling, hierarchy | Proofread | Regenerate with Ideogram or DALL-E |
| 7 | Face/hand anatomy sanity check | Visual | Inpaint fixes or regenerate |
| 8 | Watermark / model artifact absence | Visual | Remove via inpaint |
| 9 | Resolution meets delivery spec | Metadata check | Upscale via Topaz / Flux refiner |
| 10 | No unintended text/logos visible (hallucinated signage, off-brand logos) | Visual | Inpaint away |

**A batch that fails any check does not ship. Period.** The batch goes back to regeneration. Partial passes are not acceptable — AI generation is cheap enough that "re-run the batch" is always the right call.

---

## 5. Legal / IP guardrails (non-negotiable)

### 5.1 Training data provenance
- Prefer models with documented training data (Adobe Firefly, Getty Generative, Flux-with-license).
- For SD/MJ/DALL-E: check the brand's legal policy on generative use. Some brands forbid models trained on scraped web data.
- If the model is used for backgrounds or textures where likeness doesn't matter, provenance is lower-risk.
- If the model is used for faces, characters, or recognizable art styles, provenance is high-risk — prefer trained-LoRA approach with brand-owned training data.

### 5.2 Commercial-use flags
- Every delivered asset must have a logged "commercial use cleared" status.
- Required metadata per asset: model used, model license, prompt, seed, reference images used, LoRA(s) used, date.
- Store metadata in sidecar JSON or EXIF — never "in memory".

### 5.3 Right of publicity (people's likenesses)
- NEVER generate outputs depicting a recognizable real person without signed release.
- Synthetic people generated by AI are OK if the output does not resemble any real celebrity (run a reverse-image check against known-persons databases before ship).
- Stock-model LoRAs (models who have signed releases for AI training) are the safest source when you need real-looking faces.

### 5.4 Trademark avoidance
- Hallucinated logos, branded signage, branded products in scenes → inpaint away before ship.
- Crowd scenes and urban scenes are the #1 source of accidental trademark content.

### 5.5 Copyright on style
- "In the style of [living artist]" → legally risky in many jurisdictions.
- "In the style of [public-domain / historical movement]" → safe.
- When in doubt, describe the style by its attributes (palette, brushwork, composition) rather than by attribution.

---

## 6. Generation session hygiene (operational discipline)

Every session of AI generation MUST produce:

1. **Session log** — `brands/{brand}/generations/{yyyy-mm-dd}-{session-slug}/`
2. **Per-asset metadata sidecar** — prompt, seed, model, LoRA(s), references, negative prompts.
3. **The canonical brand references used** — copied into the session folder (no "floating" references).
4. **The pass/fail log** per QA check (the 10 items in §4).
5. **The final selects** — separated from rejects.
6. **Commercial-use status** — signed off by the brand owner before ship.

Rejects are kept for ≥ 30 days (often useful as training data for the next LoRA) then archived or deleted per the brand's retention policy.

---

## 7. Batch orchestration patterns

| Pattern | When to use | Squad agents involved |
|---------|------------|----------------------|
| **Editorial set** (single concept, 5-15 variants) | Campaign hero + secondary shots | brand-creative-engineer drives, brand-identity-designer reviews |
| **Template grid** (N slots × M variants) | Social media calendar, email series | brand-collateral-designer owns grid definition, brand-creative-engineer generates |
| **Character series** (same subject, multiple scenes) | Recurring mascot, executive portraits | LoRA-first workflow, brand-identity-designer trains, brand-creative-engineer generates |
| **Mockup set** (product on N surfaces) | Brand presentation, pitch deck | Photoroom API / SD compositing, brand-collateral-designer owns |
| **Motion sequence** (logo intro, 3-6 sec) | Brand identity handoff to motion | Hand-authored by brand-motion-vfx, AI used only for assist (upscaling, cleanup) |

---

## 8. Anti-patterns (forbidden)

- **Generating a product shot from pure text-to-image** when a product reference photo exists. Always img2img / compositing when the product is real.
- **Mixing styles mid-batch without a canon rule allowing it.** If the brand canon says "editorial photography", a single flat illustration mid-batch is a FAIL.
- **Generating faces resembling real celebrities "for inspiration".** This is a legal landmine, not a creative shortcut.
- **"Fixing" drift in post.** If a batch drifted, regenerate. Don't color-correct your way out of a style mismatch.
- **Shipping without session metadata.** If you can't reproduce the asset later, you don't own it.
- **Using "in the style of [living artist]" prompts for brand-owned deliverables.** Legally and ethically risky.
- **Treating AI generation as "done" after the first acceptable output.** Every brand asset benefits from N:1 generate-to-ship ratio ≥ 5. Cheap to generate means pick the best, not pick the first.
- **Free-generating brand identity elements (logomark, wordmark, brand character).** Brand identity is a human craft, AI assists but doesn't drive.

---

## 9. Owner matrix (which squad-brand agent owns what)

| Canon element | Owner agent | Rationale |
|--------------|------------|-----------|
| Style lock + reference curation | brand-identity-designer | Owns the visual vocabulary |
| Lighting + palette lock | brand-creative-engineer | Owns the generation craft |
| Subject lock + LoRA training | brand-creative-engineer + brand-identity-designer | Joint: one trains, one approves |
| Composition lock + batch templates | brand-collateral-designer | Owns templated output |
| Batch QA (§4 checklist) | brand-auditor | Independent review, not the generator |
| Legal / IP guardrails | brand-legal-ip reference KB + brand-strategist sign-off | Strategic, not creative |
| Session hygiene + metadata | brand-creative-engineer | Operational discipline |
| Motion / video canon | brand-motion-vfx | Owns motion craft |
| Sonic (if multimodal) | brand-sonic-designer | Owns sonic craft — see `sonic-branding-principles.md` |

---

## 10. Reference index

- `squads/squad-brand/knowledge-base/ai-api-capabilities.md` — capability catalog (this squad)
- `squads/squad-brand/knowledge-base/prompt-engineering-visual.md` — prompt mechanics (this squad)
- `squads/squad-brand/knowledge-base/brand-legal-ip.md` — legal reference (this squad)
- `squads/squad-brand/knowledge-base/color-psychology.md` — palette theory (this squad)
- `squads/squad-brand/knowledge-base/brandbook-structure.md` — where the generated assets land
- `squads/squad-design/knowledge-base/cross-surface-token-canon.md` — how brand tokens propagate to product surfaces (design squad canon)

## Change log

- **2026-04-12 (v1.0)** — Created as part of squad-brand v3.3 / fw-v2.3. Raises `ai-api-capabilities.md` and `prompt-engineering-visual.md` from "capability notes" to a canonical playbook covering the 5 brand-consistency dimensions with lock protocols, model selection matrix, batch QA checklist, legal/IP guardrails, and agent ownership matrix.
