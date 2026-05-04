---
task: validate-problem-hypothesis
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

# Validate Problem Hypothesis

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 1-2 weeks
- **Produces:** Problem validation report, evidence log, go/no-go recommendation

## Purpose
Validar se o problema que acreditamos existir e real, frequente e doloroso o suficiente para justificar investimento. Foco em validar o PROBLEMA antes de pensar em solucao. Baseado em The Mom Test (Rob Fitzpatrick) e Continuous Discovery (Teresa Torres).

## Steps

### Step 1: Formulate Problem Hypothesis
**Template:**
```
We believe that [target user segment]
struggles with [specific problem]
when trying to [goal/job-to-be-done]
because [hypothesized root cause].

This matters because [frequency] of [segment] experience this,
and it costs them [time/money/frustration/risk].
```

**Quality Checks:**
- [ ] Problem is specific (not "users are unhappy")
- [ ] Segment is defined (not "everyone")
- [ ] Root cause is hypothesized (can be tested)
- [ ] Impact is estimable (frequency + severity)

### Step 2: Identify What Would Prove/Disprove
**Evidence That Validates:**
- [ ] Users describe this problem unprompted in interviews
- [ ] Problem frequency >= [threshold] per week/month
- [ ] Users have active workarounds (behavioral evidence of pain)
- [ ] Users willing to invest time/money to solve it
- [ ] Problem appears in support data / reviews / NPS verbatims

**Evidence That Invalidates:**
- [ ] Users do not mention this problem even when prompted
- [ ] Problem frequency too low to matter
- [ ] Existing solutions are "good enough" (no switching motivation)
- [ ] Only affects very small segment
- [ ] Users rank other problems significantly higher

### Step 3: Design Validation Approach
**The Mom Test Rules (Rob Fitzpatrick):**
1. Talk about their life, not your idea
2. Ask about specifics in the past, not generics about the future
3. Talk less, listen more
4. Do not pitch — learn

**Interview Questions (Problem-Focused):**
- "Tell me about the last time you tried to [goal/JTBD]" (specific past)
- "What was the hardest part?" (unprompted pain identification)
- "How do you handle that today?" (workaround = evidence of pain)
- "How often does this happen?" (frequency)
- "What happens when you cannot solve it?" (severity/impact)
- "Have you tried anything to fix this? What happened?" (motivation level)
- "What do you spend the most time on?" (priority indicator)

**DO NOT ASK:**
- "Would you use a product that does X?" (hypothetical, meaningless)
- "Do you think this is a problem?" (leading, gets polite yes)
- "How much would you pay for..." (hypothetical before validation)

### Step 4: Collect Evidence (Multi-Source)
**Source 1: Problem Interviews (5-8)**
| Question | P1 | P2 | P3 | P4 | P5 | Pattern |
|----------|-----|-----|-----|-----|-----|---------|
| Mentions problem? | Y/N | Y/N | Y/N | Y/N | Y/N | [N/5] |
| Has workaround? | Y/N | Y/N | Y/N | Y/N | Y/N | [N/5] |
| Frequency | [how often] | | | | | [median] |
| Severity (1-5) | [score] | | | | | [avg] |

**Source 2: Quantitative Signals**
| Signal | Data Point | Supports? |
|--------|-----------|-----------|
| Support tickets about this | [count/period] | Y/N |
| Feature requests related | [count] | Y/N |
| Drop-off at relevant funnel step | [%] | Y/N |
| NPS verbatims mentioning this | [count] | Y/N |
| Competitor reviews mentioning this | [count] | Y/N |

**Source 3: Behavioral Evidence**
- Active workarounds observed: [list]
- Time/money users spend on workarounds: [estimate]
- Competitor solutions users adopt: [list]

### Step 5: Analyze & Score
**Problem Validation Scorecard:**
| Dimension | Score (1-5) | Evidence |
|-----------|------------|---------|
| Problem exists (users confirm) | | [summary] |
| Problem is frequent (happens often) | | [frequency data] |
| Problem is severe (high impact) | | [severity evidence] |
| Problem is widespread (large segment) | | [segment size] |
| Users motivated to solve (active workarounds) | | [workaround evidence] |
| **TOTAL** | **/25** | |

**Decision Thresholds:**
| Score | Verdict | Action |
|-------|---------|--------|
| 20-25 | STRONG VALIDATION | Proceed to solution exploration |
| 15-19 | MODERATE VALIDATION | Validate further with more data |
| 10-14 | WEAK VALIDATION | Pivot scope or segment |
| Below 10 | NOT VALIDATED | Kill hypothesis, explore different problem |

### Step 6: Document Decision
**Problem Validation Report:**
```
HYPOTHESIS: [original problem hypothesis]
VERDICT: VALIDATED / PARTIALLY VALIDATED / NOT VALIDATED
CONFIDENCE: HIGH / MEDIUM / LOW
EVIDENCE SUMMARY: [2-3 sentences]
DECISION: [proceed / pivot / kill]
NEXT STEPS: [specific actions]
```

## Output Artifacts
- `problem-validation-[id].md` | `interview-evidence-log.md` | `validation-scorecard.md` | `problem-decision.md`

## Quality Criteria
- Problem hypothesis specific and falsifiable | The Mom Test rules followed (no pitching) | Min 5 interviews conducted | Quantitative data checked | Scorecard completed with evidence | Decision documented with rationale
