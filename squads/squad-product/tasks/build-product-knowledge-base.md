---
task: build-product-knowledge-base
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

# Build Product Knowledge Base

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Medium-High
- **Estimated Time:** 6-8 hours (initial setup) + ongoing
- **Produces:** Organized knowledge base, information architecture, maintenance plan

## Purpose
Construir e organizar base de conhecimento do produto para que qualquer membro do time encontre informacao relevante em menos de 2 minutos. Conhecimento nao acessivel e conhecimento perdido.

## Steps

### Step 1: Knowledge Audit
**What Knowledge Exists?**
| Knowledge Type | Exists? | Location | Quality | Findable? |
|---------------|---------|----------|---------|-----------|
| Product vision/strategy | [Y/N] | [where] | [1-5] | [Y/N] |
| User personas | [Y/N] | [where] | [1-5] | [Y/N] |
| Feature documentation | [Y/N] | [where] | [1-5] | [Y/N] |
| API documentation | [Y/N] | [where] | [1-5] | [Y/N] |
| Decision log | [Y/N] | [where] | [1-5] | [Y/N] |
| Research findings | [Y/N] | [where] | [1-5] | [Y/N] |
| Process docs | [Y/N] | [where] | [1-5] | [Y/N] |
| Onboarding guide | [Y/N] | [where] | [1-5] | [Y/N] |
| Metrics definitions | [Y/N] | [where] | [1-5] | [Y/N] |
| Meeting notes | [Y/N] | [where] | [1-5] | [Y/N] |

### Step 2: Information Architecture
**KB Structure:**
```
Knowledge Base/
├── 📋 Product Overview
│   ├── Product Vision & Strategy
│   ├── Target Users & Personas
│   ├── Product Roadmap (current)
│   └── OKRs & Success Metrics
│
├── 🔍 Discovery & Research
│   ├── Research Library (all studies)
│   ├── User Personas (detailed)
│   ├── Journey Maps
│   └── Competitive Intelligence
│
├── 📐 Product Specs
│   ├── Feature Documentation (per feature)
│   ├── API Documentation
│   ├── Design System Reference
│   └── Data Dictionary
│
├── 📊 Analytics & Metrics
│   ├── Metric Definitions & Formulas
│   ├── Dashboard Directory
│   ├── Tracking Plan
│   └── Experiment Archive
│
├── 🔄 Processes
│   ├── Sprint Ceremonies
│   ├── Release Process
│   ├── Client Communication
│   └── Escalation Procedures
│
├── 📝 Decision Log
│   └── [Chronological decisions]
│
├── 🏢 Client Context
│   ├── Stakeholder Map
│   ├── Contract Summary
│   └── Communication History
│
└── 🎓 Onboarding
    ├── New Team Member Guide
    ├── Tool Setup
    └── Key Contacts
```

### Step 3: Content Creation Standards
**Document Quality Rules:**
| Rule | Standard |
|------|---------|
| Title | Descriptive, searchable (not "Notes from meeting") |
| Author | Named, with contact info |
| Date | Created and last updated |
| Status | Draft / Current / Archived |
| Summary | First paragraph answers "what is this about?" |
| Structure | Headers, bullets, tables (scannable) |
| Links | Cross-references to related docs |
| Tags | Categorized for search |

**Writing Style:**
- Use active voice
- Short paragraphs (max 3-4 sentences)
- Tables for comparisons and data
- Bullet lists for sequences and options
- Bold for key terms on first use
- No orphan acronyms (always define on first use)

### Step 4: Migration Plan (if moving from scattered docs)
**Migration Priority:**
| Priority | Content | Source | Target Location | Owner |
|----------|---------|--------|----------------|-------|
| P1 | Active product docs | [source] | [KB location] | [who] |
| P2 | Research findings | [source] | [KB location] | [who] |
| P3 | Process docs | [source] | [KB location] | [who] |
| P4 | Historical docs | [source] | [KB location] | [who] |

### Step 5: Access & Permissions
**Access Matrix:**
| KB Section | Internal Team | Client | Public |
|-----------|--------------|--------|--------|
| Product Overview | Full | Read | No |
| Discovery | Full | Summary only | No |
| Specs | Full | Relevant features | No |
| Analytics | Full | Dashboard links | No |
| Processes | Full | No | No |
| Decisions | Full | Relevant only | No |
| Client Context | Full | Their own | No |

### Step 6: Maintenance Plan
**Ongoing Governance:**
| Activity | Frequency | Owner |
|----------|-----------|-------|
| New content review | Within 48h of creation | Content owner |
| Stale content audit | Monthly | Product Ops |
| Broken link check | Monthly | Product Ops |
| Architecture review | Quarterly | Product Ops |
| Full content audit | Semi-annually | All contributors |
| Onboarding feedback | Per new member | Product Ops |

**Content Lifecycle:**
| Age | Status | Action |
|-----|--------|--------|
| < 3 months | Current | Active use |
| 3-6 months | Review needed | Verify accuracy, update if needed |
| 6-12 months | Aging | Flag for update or archive |
| > 12 months | Stale | Archive or delete |

**Success Metric:** Average time to find information < 2 minutes (survey team quarterly).

## Output Artifacts
- `knowledge-base/` (structured directory) | `kb-information-architecture.md` | `kb-content-standards.md` | `kb-maintenance-plan.md`

## Quality Criteria
- All critical knowledge areas covered | Information architecture logical and navigable | Content standards documented | Access permissions set | Migration plan executed | Maintenance schedule active | Team can find info in < 2 min
