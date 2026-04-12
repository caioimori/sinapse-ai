---
task: coordinate-multi-channel-copy
responsavel: "@copy-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Coordinate Multi-Channel Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** STANDARD
- **Depends on:** approved copy brief, core message
- **Feeds:** all writers, copy-editor, brand-system

## Objetivo
Adapt a single core message into channel-specific copy versions while maintaining message consistency. Ensure format, tone, and length are calibrated per channel.

## Entrada
- Core message / copy brief
- Target channels list
- Brand voice guidelines
- Channel-specific constraints (character limits, format rules)

## Passos

### 1. Channel Adaptation Rules

| Channel | Length | Tone | Format Notes |
|---------|--------|------|-------------|
| Email | 50-125 words body | Personal, conversational | Subject line <60 chars, preview text <90 chars, single CTA |
| Social — Instagram | 125-150 words caption | Casual, visual-first | First line is hook, line breaks for readability, 3-5 hashtags |
| Social — LinkedIn | 150-300 words | Professional, authoritative | Hook in first 2 lines (before "see more"), no hashtag spam |
| Social — Twitter/X | <280 chars | Punchy, direct | One idea per tweet, thread for complex topics |
| Web — Landing page | Scannable, H2/H3 structure | Benefit-driven, action-oriented | Above fold: headline + subhead + CTA, progressive disclosure below |
| Web — Blog | 800-2000 words | Educational, authoritative | SEO-optimized, internal links, structured with H2/H3 |
| Ads — Google Search | 30+90 chars (headline+desc) | Direct, benefit-focused | Include keyword in headline, CTA in description |
| Ads — Meta (Facebook/IG) | Primary text <125 chars visible | Conversational, scroll-stopping | Hook in first line, social proof if possible |
| Ads — Display | Minimal text | Bold, single message | 1 headline + 1 CTA, no paragraphs |

### 2. Tone Calibration

| Context | Tone Setting | Examples |
|---------|-------------|----------|
| Formal | Email proposals, whitepapers, investor comms | "We are pleased to present...", data-driven |
| Conversational | Social media, chat, casual email | "Here's the thing...", contractions OK |
| Authoritative | Blog, case studies, thought leadership | "Research shows...", expert positioning |
| Urgent | Promotions, limited offers, re-engagement | "Last chance...", action-oriented |

### 3. Consistency Tracking
- **Core message unchanged:** The central idea/benefit must be identical across all channels
- **Only format adapts:** Length, tone register, and structure change — not the message
- **Proof points consistent:** Same data/testimonials referenced (adapted for format)
- **CTA aligned:** All channels drive toward the same desired action
- **Cross-check matrix:** Compare each version against the core brief to verify alignment

### 4. Version Control
- **Naming convention:** `{campaign}_{channel}_{version}_{date}`
  - Example: `spring-launch_email_v2_2026-03-15`
  - Example: `spring-launch_ig-caption_v1_2026-03-15`
- **Version log:** Track all versions with author, date, status (draft/review/approved/live)
- **Change tracking:** Document what changed between versions and why
- **Archive policy:** Keep all versions; mark superseded versions as archived

## Saida
- Channel-specific copy versions (one per target channel)
- Consistency cross-check matrix
- Version log with naming convention applied
- Tone calibration notes per channel

## Validacao
- [ ] All target channels have a dedicated copy version
- [ ] Core message consistent across all versions
- [ ] Channel-specific length and format constraints met
- [ ] Tone calibrated per channel context
- [ ] Version control naming convention applied
- [ ] Cross-check matrix completed showing consistency

---

*Task operada por: copy-strategist (Quill)*
