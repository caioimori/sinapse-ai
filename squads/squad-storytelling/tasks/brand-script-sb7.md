---
task: "brand-script-sb7"
responsavel: "park-howell"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Brand/business details"
  - "Customer profile and pain points"
Saida:
  - "Complete StoryBrand BrandScript with all 7 elements"
Checklist:
  - "[ ] All 7 SB7 elements completed (Character through Success)"
  - "[ ] Customer positioned as character, brand as guide"
  - "[ ] One-liner created from BrandScript"
---

# Task: Complete StoryBrand BrandScript

**Task ID:** NARR-038
**Version:** 1.0.0
**Command:** `*brand-script-sb7`
**Agent:** Park Howell (park-howell)
**Purpose:** Build a complete StoryBrand BrandScript using the SB7 framework, clarifying brand messaging so customers listen and engage.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `brand` | Company, product, or service | YES |
| `customer` | Who they serve — detailed profile | YES |
| `problem` | What the customer struggles with | YES |
| `solution` | What the brand offers | YES |
| `current_messaging` | Existing website copy, taglines | PREFERRED |
| `competitors` | Competitive landscape | NO |

## Execution Phases

### Phase 1: Define the Character (Customer as Hero)

1. Who is the character in your brand's story? (Always the customer, never the brand)
2. What does the character WANT as it relates to your brand?
3. Express the want in a single, clear sentence
4. Ensure the want is specific and measurable (not vague like "success")
5. Test: If a customer read this, would they immediately nod?

### Phase 2: Define the Problem (Three Levels)

1. **External Problem** — The tangible, surface-level problem (what they're googling)
2. **Internal Problem** — How the external problem makes them FEEL (frustrated, overwhelmed, embarrassed)
3. **Philosophical Problem** — Why this situation is just plain WRONG ("Customers shouldn't have to...")
4. Name the Villain — What is the root cause personified? (not a person, but a force: complexity, inefficiency, misinformation)
5. Test: Does the internal problem create an emotional response?

### Phase 3: Position the Guide (Brand as Mentor)

1. Express **Empathy** — "We understand what it's like to..."
2. Express **Authority** — Credentials, results, testimonials that prove competence
3. Balance empathy and authority — too much empathy = weak; too much authority = arrogant
4. Write the empathetic statement (1-2 sentences)
5. List 3 authority proof points (logos, numbers, testimonials)

### Phase 4: Give Them a Plan

1. Create the **Process Plan** — 3 simple steps that remove confusion:
   - Step 1: "{Easy first action}"
   - Step 2: "{What happens next}"
   - Step 3: "{The outcome they receive}"
2. Create the **Agreement Plan** — Promises that reduce fear of doing business with you
3. Name each step with action verbs (not nouns)
4. Test: Do the 3 steps make the purchase feel simple and risk-free?

### Phase 5: Define the Stakes

1. **Failure** — What happens if they DON'T take action? Paint the negative consequences:
   - What gets worse?
   - What do they continue to suffer?
   - What opportunity do they miss?
2. **Success** — What does life look like AFTER they engage your brand?
   - How do they feel?
   - What can they do?
   - How has their status changed?
3. Make failure visceral and success aspirational
4. Ensure success maps directly to the character's want from Phase 1

### Phase 6: Create the Call to Action

1. **Direct CTA** — The primary action (Buy Now, Schedule a Call, Start Free Trial)
2. **Transitional CTA** — The lower-commitment option (Download Guide, Watch Demo, Take Quiz)
3. Ensure the Direct CTA is bold, clear, and repeated throughout messaging
4. Transitional CTA should provide value and advance the relationship
5. Write button text for both CTAs

### Phase 7: Build the One-Liner and Messaging Guide

1. Create the BrandScript One-Liner:
   - Problem: "{The problem}"
   - Solution: "{Your unique solution}"
   - Result: "{The successful outcome}"
   - Format: "We help [character] who [problem] by [solution] so they can [result]"
2. Create the elevator pitch version (30 seconds)
3. Map BrandScript to website wireframe:
   - Header: Character want + CTA
   - Stakes: Problem + failure
   - Value prop: Guide + plan
   - Social proof: Authority
   - Bottom CTA: Success vision + CTA

## Output Format

```yaml
brandscript:
  character:
    who: "{customer}"
    want: "{specific desire}"
  problem:
    villain: "{root cause force}"
    external: "{tangible problem}"
    internal: "{how it feels}"
    philosophical: "{why it's wrong}"
  guide:
    empathy: "{empathetic statement}"
    authority: ["{proof points}"]
  plan:
    process:
      - step: 1
        action: "{what to do}"
      - step: 2
        action: "{what happens}"
      - step: 3
        action: "{outcome received}"
    agreement: ["{promises}"]
  call_to_action:
    direct: "{primary CTA}"
    transitional: "{secondary CTA}"
  failure: ["{negative consequences}"]
  success: ["{positive outcomes}"]
  one_liner: "{problem + solution + result}"
  elevator_pitch: "{30-second version}"
  website_wireframe:
    header: "{want + CTA}"
    stakes_section: "{problem + failure}"
    value_section: "{guide + plan}"
    proof_section: "{authority}"
    closing_section: "{success + CTA}"
```

## Veto Conditions

- **NEVER** make the brand the hero — the brand is ALWAYS the guide
- **NEVER** skip the internal problem — external problems alone don't create urgency
- **NEVER** create a plan with more than 4 steps — simplicity is the point
- **NEVER** write a CTA that is vague — "Learn More" is not a call to action

## Completion Criteria

- [ ] All 7 SB7 elements completed with specificity
- [ ] Three problem levels defined (external, internal, philosophical)
- [ ] Guide positioned with balanced empathy and authority
- [ ] Plan reduces complexity to 3 clear steps
- [ ] Failure and success stakes clearly articulated
- [ ] One-liner and elevator pitch created
- [ ] Website wireframe mapped from BrandScript
