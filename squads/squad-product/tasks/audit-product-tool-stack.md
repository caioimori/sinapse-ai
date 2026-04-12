---
task: audit-product-tool-stack
responsavel: "@ps-product-ops-specialist"
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

# Audit Product Tool Stack

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Medium
- **Estimated Time:** 3-4 hours
- **Produces:** Tool stack audit, redundancy analysis, cost assessment, optimization recommendations

## Purpose
Auditar stack de ferramentas de produto para eliminar redundancias, otimizar custos e garantir que o time tem as ferramentas certas para trabalhar de forma eficiente.

## Steps

### Step 1: Tool Inventory
**Complete Tool Catalog:**
| Tool | Category | Users | Monthly Cost | Contract End | Owner | Usage Level |
|------|----------|-------|-------------|-------------|-------|-----------|
| [tool] | [category] | [N] | [$] | [date] | [who manages] | High/Med/Low |

**Categories:**
| Category | Purpose | Examples |
|----------|---------|---------|
| Project Management | Sprint tracking, backlog | Jira, Linear, Shortcut |
| Product Analytics | Usage tracking, metrics | Amplitude, Mixpanel, PostHog |
| User Research | Interviews, testing | UserTesting, Maze, Hotjar |
| Design | UI/UX design | Figma, Sketch |
| Communication | Team + client comms | Slack, Teams, Email |
| Documentation | Knowledge, specs | Notion, Confluence, GitBook |
| Development | Code, deployment | GitHub, VS Code, Vercel |
| Monitoring | Uptime, errors | Datadog, Sentry, PagerDuty |
| Customer Feedback | NPS, surveys | Typeform, Delighted, Canny |
| Roadmapping | Roadmap visualization | Productboard, Aha!, Notion |

### Step 2: Usage Analysis
**Per Tool:**
| Metric | Value | Assessment |
|--------|-------|-----------|
| Licensed users | [N] | |
| Active users (last 30 days) | [N] | [% of licensed] |
| Core users (daily) | [N] | [% of active] |
| Features used | [N of total] | [% of available features] |
| Integration count | [N] | [connected to what] |
| Last admin activity | [date] | [is it maintained?] |

**Usage Classification:**
| Usage Level | Criteria | Action |
|------------|---------|--------|
| Essential | >80% team uses daily | Protect, optimize |
| Active | >50% team uses weekly | Maintain |
| Underused | <30% team uses | Train or replace |
| Zombie | <10% team uses | Candidate for removal |
| Redundant | Overlaps with another tool | Consolidate |

### Step 3: Redundancy Analysis
**Overlap Matrix:**
| Function | Tool A | Tool B | Overlap? | Recommended |
|----------|--------|--------|----------|------------|
| Task tracking | [tool] | [tool] | Yes/No | Keep [which] |
| Documentation | [tool] | [tool] | Yes/No | Keep [which] |
| Analytics | [tool] | [tool] | Yes/No | Keep [which] |
| Communication | [tool] | [tool] | Yes/No | Keep [which] |

### Step 4: Cost Analysis
**Annual Tool Stack Cost:**
| Tool | Annual Cost | Cost per User | Value Rating (1-5) | Cost Efficiency |
|------|-----------|-------------|-------------------|----------------|
| [tool] | [$] | [$] | [1-5] | High/Med/Low |
| **TOTAL** | **[$]** | | | |

**Savings Opportunities:**
| Opportunity | Current Cost | Proposed Cost | Annual Saving | Effort |
|------------|-------------|-------------|--------------|--------|
| Remove [zombie tool] | [$] | $0 | [$] | Low |
| Consolidate [A] into [B] | [$A + $B] | [$B] | [$A saved] | Medium |
| Downgrade [tool] plan | [$current] | [$lower plan] | [$delta] | Low |
| Negotiate renewal | [$current] | [$negotiated] | [$delta] | Medium |

### Step 5: Gap Analysis
**Missing Capabilities:**
| Need | Current Solution | Ideal Solution | Priority |
|------|-----------------|---------------|----------|
| [capability gap] | [workaround/manual] | [tool recommendation] | P1/P2/P3 |

### Step 6: Recommendations
**Tool Stack Optimization Plan:**
| Action | Tool | Type | Saving/Cost | Timeline | Owner |
|--------|------|------|-----------|----------|-------|
| REMOVE | [tool] | Zombie removal | +$[saved] | [when] | [who] |
| CONSOLIDATE | [tool A→B] | Redundancy fix | +$[saved] | [when] | [who] |
| ADD | [new tool] | Gap fill | -$[cost] | [when] | [who] |
| UPGRADE | [tool] | Missing features | -$[cost] | [when] | [who] |
| TRAIN | [tool] | Underused | $0 | [when] | [who] |

**Net Impact:** [total savings - new costs = net change]

## Output Artifacts
- `tool-stack-audit.md` | `tool-usage-analysis.md` | `redundancy-report.md` | `tool-optimization-plan.md`

## Quality Criteria
- All tools inventoried | Usage data collected (not estimated) | Redundancies identified | Cost per user calculated | Gaps identified | Recommendations prioritized | Net cost impact quantified
