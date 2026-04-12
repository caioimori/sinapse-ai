---
task: prepare-mvp-scope-agreement
responsavel: "@ps-client-product-manager"
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

# Prepare MVP Scope Agreement

## Metadata
- **Agent:** ps-client-product-manager (Proxy)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** MVP scope agreement, feature list with priorities, acceptance criteria, sign-off document

## Purpose
Formalizar acordo de escopo de MVP entre agencia e cliente para alinhar expectativas, evitar scope creep e criar base contratual clara. O acordo protege ambas as partes.

## Steps

### Step 1: MVP Definition Session (with Client)
**Alignment Questions:**
1. What is the primary problem this MVP must solve?
2. Who is the target user for the MVP?
3. What does "minimum" mean to you? (calibrate expectations)
4. What would make this MVP a success in 90 days?
5. What can wait for v1.1?

**MVP Philosophy Alignment:**
```
"An MVP is the SMALLEST thing we can build that:
 1. Solves the core problem
 2. Is usable (not just technically functional)
 3. Generates learning about what to build next

It is NOT: a prototype, a proof of concept, or a half-built product.
It IS: a real product with reduced scope."
```

### Step 2: Feature Agreement Matrix
**Scope Classification:**
| Feature | Priority | In MVP? | Acceptance Criteria | Effort | Notes |
|---------|----------|---------|--------------------|---------| ----|
| [feature 1] | MUST | YES | [what "done" looks like] | [T-shirt] | |
| [feature 2] | MUST | YES | [criteria] | [T-shirt] | |
| [feature 3] | SHOULD | YES (if time) | [criteria] | [T-shirt] | |
| [feature 4] | COULD | NO (v1.1) | [criteria for later] | [T-shirt] | |
| [feature 5] | WONT | NO | — | — | [explicitly excluded] |

**MoSCoW Agreement:**
- **MUST:** MVP cannot launch without these (failure if missing)
- **SHOULD:** Important but MVP can launch without them (degraded but functional)
- **COULD:** Nice to have, include only if time allows
- **WONT:** Explicitly excluded from this phase (may be in v1.1)

### Step 3: Scope Boundaries
**Explicitly In Scope:**
```
The MVP will include:
- [Feature/capability 1]
- [Feature/capability 2]
- [Feature/capability 3]
- Basic analytics tracking
- Responsive design (web)
- [Specific integration if any]
```

**Explicitly Out of Scope:**
```
The MVP will NOT include:
- [Feature X — planned for v1.1]
- [Platform Y — e.g., native mobile]
- [Integration Z — until MVP validated]
- Advanced reporting
- Multi-language support
- [Other exclusions]

These items are acknowledged for future phases but are NOT
part of this agreement.
```

**Gray Areas (resolved upfront):**
| Topic | Decision | Rationale |
|-------|----------|-----------|
| [ambiguous area 1] | In / Out | [why] |
| [ambiguous area 2] | In / Out | [why] |

### Step 4: Timeline & Milestones
**Agreed Timeline:**
| Milestone | Date | Deliverable | Client Action Needed |
|-----------|------|-----------|---------------------|
| Kickoff | [date] | Project start | Provide assets/access |
| Design Complete | [date] | Approved mockups | Design approval (within 3 days) |
| Alpha | [date] | Core features functional | Internal review |
| Beta | [date] | All MUST features complete | UAT testing |
| Launch | [date] | MVP live | Go-live approval |

**Client Responsibilities:**
- [ ] Provide content/assets by [date]
- [ ] Review and approve designs within [N business days]
- [ ] Complete UAT within [N business days]
- [ ] Provide production environment access by [date]
- [ ] Designate single point of contact for decisions

### Step 5: Change Management
**Scope Change Rules (agreed upfront):**
```
1. Any addition to MUST scope requires:
   - Written change request
   - Impact assessment (timeline + cost)
   - Trade-off: something else moves to SHOULD or out of MVP
   - Both parties sign off

2. Removal from MUST scope requires:
   - Agreement from both parties
   - Updated agreement signed

3. SHOULD items may be moved to v1.1 if:
   - All MUST items are at risk
   - Delivery manager flags capacity issue
   - Both parties notified

4. No verbal scope changes are binding
   (all changes must be documented)
```

### Step 6: Formal Agreement Document
**MVP Scope Agreement:**
```
MVP SCOPE AGREEMENT
────────────────────
Project: [project name]
Client: [client name]
Agency: [agency name]
Date: [date]
Version: [v1.0]

1. OBJECTIVE
[One paragraph describing what the MVP achieves]

2. SUCCESS CRITERIA
[Measurable criteria for MVP success]

3. FEATURES IN SCOPE
[List of MUST and SHOULD features with acceptance criteria]

4. FEATURES OUT OF SCOPE
[Explicit list of exclusions]

5. TIMELINE
[Milestones with dates]

6. CLIENT RESPONSIBILITIES
[What client must provide and when]

7. CHANGE MANAGEMENT
[Scope change process agreed above]

8. ASSUMPTIONS
[Key assumptions this agreement is based on]

9. RISKS
[Known risks and mitigation]

SIGNATURES:
Client: _____________ Date: _____
        [Name, Title]

Agency: _____________ Date: _____
        [Name, Title]
```

## Output Artifacts
- `mvp-scope-agreement-[project].md` | `feature-matrix.md` | `scope-boundaries.md` | `change-management-rules.md`

## Quality Criteria
- Feature list agreed with MoSCoW | Acceptance criteria per MUST feature | Explicit out-of-scope list | Timeline with milestones | Client responsibilities defined | Change process agreed | Both parties signed
