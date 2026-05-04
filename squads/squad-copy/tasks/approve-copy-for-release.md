---
task: approve-copy-for-release
responsavel: "@copy-editor"
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

# Task: Approve Copy for Release

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor
- **Complexity:** STANDARD
- **Depends on:** final copy draft, persuasion-psychologist sign-off
- **Feeds:** release pipeline, brand-system

## Objetivo
Final copy approval gate before any copy asset goes live. Ensures brand, legal, factual, and quality standards are met.

## Entrada
- Final copy draft (post-editing, post-persuasion review)
- Brand voice guidelines
- Legal/compliance requirements (if applicable)
- SEO requirements (if applicable)
- Subject matter expert contact (if applicable)

## Passos

### 1. Stakeholder Sign-Off Checklist

| Stakeholder | Required? | Status | Notes |
|-------------|:---------:|--------|-------|
| Brand manager | Always | [ ] | Voice and visual alignment |
| Legal/compliance | If claims, health, finance | [ ] | Disclaimers, substantiation |
| Subject matter expert | If technical content | [ ] | Factual accuracy |
| Client approver | If client-facing | [ ] | Client preferences respected |

### 2. Brand Voice Compliance Check
- **Tone:** Does the copy match the required tone for this channel/context?
- **Vocabulary:** Are brand-approved terms used? Are banned terms absent?
- **Personality:** Does it feel like the brand speaking, not a generic writer?
- **Consistency:** Is voice consistent throughout the entire piece?

### 3. Legal/Compliance Flag
- **Disclaimers:** Required disclaimers present and properly placed?
- **Claims substantiation:** Every claim backed by verifiable data or source?
- **Regulatory compliance:** CONAR, FTC, ASA, or industry-specific rules met?
- **Privacy:** No unauthorized use of personal data, testimonials, or likenesses?
- **Competitor references:** Any comparative claims are fair and substantiated?

### 4. Factual Accuracy Verification
- All statistics and data points verified against original sources
- All dates, names, and proper nouns correct
- All links and references functional
- Product features/pricing match current reality
- No outdated information

### 5. SEO Compliance (if applicable)
- Target keywords present in title, H1, meta description
- Keyword density within acceptable range (1-3%)
- Internal linking structure correct
- Alt text present for images
- Meta description within character limits

### 6. Quality Gate Decision

| Check | Pass? | Notes |
|-------|:-----:|-------|
| Stakeholder sign-offs complete | [ ] | |
| Brand voice compliant | [ ] | |
| Legal/compliance clear | [ ] | |
| Factually accurate | [ ] | |
| SEO compliant (if applicable) | [ ] | |

**ALL checks must pass before release.** Any single failure blocks release until resolved.

## Saida
- Approval decision: APPROVED / BLOCKED (with reasons)
- Sign-off record with timestamps
- Any conditional notes (e.g., "approved pending legal disclaimer addition")

## Validacao
- [ ] All required stakeholders have signed off
- [ ] Brand voice compliance verified
- [ ] Legal/compliance review complete (or marked N/A)
- [ ] Factual accuracy verified
- [ ] SEO compliance checked (or marked N/A)
- [ ] ALL checks passed — copy cleared for release

---

*Task operada por: copy-editor*
