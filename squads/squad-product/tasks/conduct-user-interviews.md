---
task: conduct-user-interviews
responsavel: "@ps-discovery-lead"
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

# Conduct User Interviews

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 1-2 hours per interview + 30min synthesis each
- **Produces:** Interview notes, quotes, behavior patterns, insight cards

## Purpose
Conduzir entrevistas de descoberta com usuarios seguindo Continuous Discovery Habits (Teresa Torres). O objetivo e entender comportamentos e necessidades, NAO validar solucoes pre-concebidas.

## Steps

### Step 1: Recruit Participants (5-8 per round)
**Screening Criteria:**
- Recent behavior (performed target action in last 2-4 weeks)
- Segment match (fits target persona)
- Diversity (mix of power users, new users, churned users)
- Accessibility (available within sprint timeline)

**Recruitment Channels:**
| Channel | Speed | Quality | Cost |
|---------|-------|---------|------|
| In-product intercept | Fast | High (active users) | Free |
| Customer success referral | Medium | High (known context) | Free |
| Email outreach | Slow | Medium | Free |
| Panel/service (UserTesting, etc.) | Fast | Variable | Paid |
| Social media | Fast | Low (self-selection bias) | Free |

**Anti-Pattern:** Never interview only happy customers. Include frustrated and churned users.

### Step 2: Prepare Interview Guide
**Structure (45-60 min):**

**Opening (5 min):**
- Introduce yourself and purpose
- "There are no right or wrong answers"
- "I am here to learn from you, not to sell anything"
- Ask permission to record

**Context Setting (10 min):**
- "Tell me about your role and what a typical day looks like"
- "How does [product/domain] fit into your work?"
- Listen for: pain points, workarounds, frequency of use

**Core Exploration (25-30 min):**
- "Walk me through the last time you [target behavior]"
- "What was happening that made you decide to do that?"
- "What did you try first? What happened next?"
- "What was the hardest part?"
- "If you could wave a magic wand, what would change?"

**Teresa Torres Specific Prompts:**
- **Timeline:** "Take me back to when this started. What was happening?"
- **Emotion:** "How did that make you feel?"
- **Comparison:** "Have you tried any other way to solve this?"
- **Frequency:** "How often does this happen?"
- **Impact:** "What happens when you cannot solve this?"

**Closing (5-10 min):**
- "Is there anything I should have asked but did not?"
- "Who else should I talk to about this?"
- Thank participant

### Step 3: Conduct Interview
**During Interview Rules:**
- [ ] Follow the 80/20 rule (participant talks 80%)
- [ ] Ask open-ended questions only
- [ ] Never pitch or explain your solution
- [ ] Follow interesting threads (deviate from guide when valuable)
- [ ] Note exact quotes (verbatim, not paraphrased)
- [ ] Observe body language and emotional reactions
- [ ] Ask "why" and "tell me more" frequently

**Red Flags (interviewer bias):**
- Leading questions ("Do you think X would be useful?")
- Hypothetical questions ("Would you use feature Y?")
- Showing solution before understanding problem
- Confirming your hypothesis instead of exploring

### Step 4: Post-Interview Synthesis (within 24h)
**Per Interview, Create Insight Card:**
```
Participant: [ID, not name]
Segment: [persona/segment]
Context: [situation that triggered behavior]
Behavior: [what they actually did]
Pain Point: [what was hard or frustrating]
Workaround: [how they solved it without us]
Quote: "[exact words]"
Opportunity: [what this suggests we could do]
Surprise: [what was unexpected]
```

### Step 5: Cross-Interview Pattern Analysis (after 5+ interviews)
**Pattern Detection:**
1. Group insight cards by theme
2. Count frequency of each theme
3. Identify strongest patterns (mentioned by 3+ participants)
4. Note contradictions between participants
5. Map patterns to Opportunity Solution Tree

**Saturation Check:** Stop interviewing when new interviews reveal no new patterns (typically 5-8 for a defined segment).

**Synthesis Output:**
| Pattern | Frequency | Confidence | Supporting Quotes | Opportunity |
|---------|-----------|-----------|-------------------|-------------|
| [theme] | [N/total] | High/Med/Low | "[quote1]", "[quote2]" | [what to explore] |

## Output Artifacts
- `interview-notes/[participant-id].md` | `insight-cards/[id].md` | `interview-synthesis.md` | `pattern-analysis.md`

## Quality Criteria
- Min 5 interviews per segment | No leading questions used | Synthesis within 24h of each | Pattern analysis after 5+ | Exact quotes captured | Opportunities mapped to OST
