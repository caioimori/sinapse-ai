---
task: write-release-notes
responsavel: "@ps-delivery-manager"
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

# Write Release Notes

## Metadata
- **Agent:** ps-delivery-manager (Tempo)
- **Complexity:** Low-Medium
- **Estimated Time:** 1-2 hours
- **Produces:** Release notes (internal + external), changelog entry, stakeholder communication

## Purpose
Documentar o que foi lancado, para quem, e como comunicar mudancas de forma clara. Release notes servem dois publicos distintos: time interno (tecnico) e stakeholders/usuarios (orientado a valor).

## Steps

### Step 1: Collect Release Content
**From Sprint/Release:**
| Item | Type | Description | Impact | User-Facing? |
|------|------|-----------|--------|-------------|
| [item 1] | Feature/Fix/Improvement | [what] | [who affected] | Yes/No |
| [item 2] | | | | |

**Categorize:**
- **New Features:** Wholly new capabilities
- **Improvements:** Enhancements to existing features
- **Bug Fixes:** Issues resolved
- **Performance:** Speed, reliability improvements
- **Breaking Changes:** Changes requiring user action
- **Deprecations:** Features being phased out

### Step 2: Write Internal Release Notes
**For: Engineering + Product + Support + QA**
```
RELEASE: v[X.Y.Z]
DATE: [date]
ENVIRONMENT: [production / staging]
DEPLOYED BY: [who]
─────────────────────────────

CHANGES:
[Feature] [TICKET-ID] Short description of change
  - Technical details
  - Configuration changes needed
  - Known limitations

[Fix] [TICKET-ID] Bug description
  - Root cause
  - Fix approach
  - Verification steps

DEPLOYMENT NOTES:
- Database migrations: [yes/no — details if yes]
- Environment variables: [new/changed vars]
- Feature flags: [flags changed]
- Rollback procedure: [how to rollback if needed]

MONITORING:
- Key metrics to watch: [list]
- Alert thresholds: [any new/changed alerts]
- Expected behavior changes: [what will look different in logs/metrics]
```

### Step 3: Write External Release Notes (User-Facing)
**For: Users, Clients, Public changelog**

**Writing Rules:**
- Lead with VALUE, not implementation details
- Use user language, not technical jargon
- Focus on what they CAN DO NOW that they could not before
- Include visual (screenshot/gif) for major features if applicable

**Template:**
```
# What is New — [Month Day, Year]

## New Features

### [Feature Name]
[1-2 sentences explaining the benefit in user terms]
[How to access/use it — brief instruction]

## Improvements

### [Improvement Name]
[What is better and why it matters to them]

## Bug Fixes
- Fixed an issue where [user-facing symptom, not technical cause]
- Resolved [user-impacting problem]

## Coming Soon
- [Teaser of upcoming features — optional, builds anticipation]
```

### Step 4: Stakeholder Communication
**Client-Facing Release Summary:**
```
Hi [Client Name],

We have shipped new updates to [product]:

What is New:
- [Feature 1]: [1-sentence value prop]
- [Feature 2]: [1-sentence value prop]

What We Fixed:
- [Issue they reported or knew about]: Resolved

What is Next:
- [Brief preview of upcoming sprint focus]

No action needed from your side — all changes are live.
[If action needed: "You will need to [specific action]"]

Let me know if you have questions!
[Name]
```

### Step 5: Changelog Entry
**For product changelog (structured):**
```yaml
version: "X.Y.Z"
date: "YYYY-MM-DD"
categories:
  added:
    - "[Feature description]"
  changed:
    - "[Improvement description]"
  fixed:
    - "[Bug fix description]"
  deprecated:
    - "[Deprecation notice]"
  removed:
    - "[Removed feature]"
  security:
    - "[Security fix]"
```

### Step 6: Distribution
| Audience | Channel | Content Version | Timing |
|----------|---------|----------------|--------|
| Engineering team | Slack #releases | Internal (full detail) | At deployment |
| Product team | Slack #product | Internal (summary) | At deployment |
| Support/CS | Email + KB update | External + FAQ | Before client notification |
| Client | Email / Slack | Client-facing summary | After deployment confirmed stable |
| Public | Changelog page | External release notes | 24h after deployment |

## Output Artifacts
- `release-notes-internal-v[X.Y.Z].md` | `release-notes-external-v[X.Y.Z].md` | `client-communication-[client].md` | `changelog-entry.yaml`

## Quality Criteria
- All shipped items documented | Internal notes include deployment details | External notes focus on value, not implementation | No technical jargon in user-facing notes | Client communication personalized | Distributed to all audiences on time
