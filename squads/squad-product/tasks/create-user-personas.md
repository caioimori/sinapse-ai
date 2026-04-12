---
task: create-user-personas
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

# Create User Personas

## Metadata
- **Agent:** ps-discovery-lead (Quorum)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** User personas, segment profiles, jobs-to-be-done per persona

## Purpose
Criar personas baseadas em dados reais (nao ficcionais) que representem segmentos distintos de usuarios. Combina dados quantitativos (analytics) com qualitativos (entrevistas) para gerar perfis acionaveis.

## Steps

### Step 1: Data-Driven Segmentation
**Start with behavioral data, NOT demographics:**

**Behavioral Dimensions to Analyze:**
| Dimension | Data Source | Segments |
|-----------|-----------|----------|
| Usage frequency | Analytics | Daily / Weekly / Monthly / Churned |
| Feature adoption | Analytics | Power user / Standard / Minimal |
| Use case | Interviews + Analytics | Primary job they hire product for |
| Sophistication | Analytics + Support | Self-serve / Needs guidance / Expert |
| Value perception | Survey + NPS | Promoter / Passive / Detractor |

**Segmentation Method:**
1. Pull behavioral cohort data from analytics
2. Identify natural clusters (2-4 segments)
3. Validate clusters against interview data
4. Name segments by behavior, not demographics

### Step 2: Build Persona Profile (per segment)
```
PERSONA: [Name — a real archetype, not a fictional character]
─────────────────────────────────────────────────────────────

SEGMENT: [behavioral segment name]
SIZE: [% of user base] | [absolute count if known]
REVENUE CONTRIBUTION: [% of revenue or tier]

CONTEXT:
- Role/situation: [what they do]
- Environment: [where/when they use product]
- Experience level: [with product and domain]
- Tools ecosystem: [what else they use alongside]

JOBS TO BE DONE (Functional):
1. [Primary job: "When I [situation], I want to [motivation], so I can [outcome]"]
2. [Secondary job]
3. [Tertiary job]

JOBS TO BE DONE (Emotional):
- Wants to feel: [desired emotional state]
- Wants to avoid feeling: [undesired emotional state]

JOBS TO BE DONE (Social):
- Wants to be seen as: [desired perception]
- Wants to avoid being seen as: [undesired perception]

CURRENT BEHAVIOR:
- How they solve the job today: [current solution/workaround]
- Pain points with current approach: [specific frustrations]
- Switching triggers: [what would make them change]
- Switching barriers: [what holds them back]

KEY METRICS:
- Activation rate: [% who reach aha moment]
- Retention (30d): [% still active at 30 days]
- Feature usage: [top 3 features by frequency]
- Support ticket rate: [tickets per user per month]
- NPS: [score for this segment]

PRODUCT IMPLICATIONS:
- Features they value most: [list]
- Features they ignore: [list]
- Unmet needs: [list]
- Churn risk factors: [list]
```

### Step 3: Validate Personas Against Real Users
**Validation Methods:**
- [ ] Map 5+ real users to each persona (they should fit naturally)
- [ ] Review with customer-facing team (CS, Sales) — do they recognize these?
- [ ] Check that personas are distinct (a real user should not fit 2 personas equally)
- [ ] Verify with analytics that segment sizes match

**Red Flags:**
- Persona fits no real users → Too abstract, redo
- All users fit one persona → Not enough differentiation
- Persona based on demographics only → Redo with behavioral data
- More than 5 personas → Too many, consolidate

### Step 4: Define Persona Priority
**Prioritization Matrix:**
| Persona | Segment Size | Revenue Impact | Strategic Fit | Growth Potential | Priority |
|---------|-------------|---------------|--------------|-----------------|----------|
| [name] | [% of base] | [high/med/low] | [high/med/low] | [high/med/low] | P1/P2/P3 |

**Rules:**
- Max 2 primary personas (P1) — product decisions optimize for these
- P2 personas: served but not primary design target
- P3 personas: acknowledged but not designed for

### Step 5: Create Persona Usage Guidelines
**How teams should use personas:**
- Product decisions: "Does this serve our P1 personas?"
- Feature prioritization: "Which persona benefits? What is their priority?"
- Design reviews: "Can [Persona Name] complete this task?"
- Marketing: "How would we explain this to [Persona Name]?"
- Support: "Is this a [Persona Name] issue pattern?"

## Output Artifacts
- `personas/[persona-name].md` (per persona) | `persona-priority-matrix.md` | `persona-usage-guidelines.md` | `segment-data-summary.md`

## Quality Criteria
- Based on behavioral data, not demographics | Min 5 real users mapped per persona | Max 4-5 total personas | Each persona has JTBD (all 3 types) | Priority assigned | Validated with customer-facing teams
