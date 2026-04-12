---
task: create-product-artifact-template
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

# Create Product Artifact Template

## Metadata
- **Agent:** ps-product-ops-specialist (Mosaic)
- **Complexity:** Low-Medium
- **Estimated Time:** 1-2 hours per template
- **Produces:** Standardized product artifact templates, template library, usage guidelines

## Purpose
Criar templates padronizados para artefatos de produto que garantam consistencia entre projetos e clientes. Templates reduzem tempo de setup e garantem que nada critico seja esquecido.

## Steps

### Step 1: Identify Template Need
**Template Inventory Check:**
| Artifact | Template Exists? | Quality | Last Updated | Needs Update? |
|---------|-----------------|---------|-------------|--------------|
| PRD | [Y/N] | [1-5] | [date] | [Y/N] |
| User Story | [Y/N] | [1-5] | [date] | [Y/N] |
| Sprint Plan | [Y/N] | [1-5] | [date] | [Y/N] |
| Release Notes | [Y/N] | [1-5] | [date] | [Y/N] |
| Research Brief | [Y/N] | [1-5] | [date] | [Y/N] |
| QBR Deck | [Y/N] | [1-5] | [date] | [Y/N] |
| Decision Record | [Y/N] | [1-5] | [date] | [Y/N] |
| Feature Spec | [Y/N] | [1-5] | [date] | [Y/N] |

### Step 2: Template Design Principles
**Every template must have:**
- [ ] Clear purpose statement (when to use)
- [ ] Required sections marked (vs optional)
- [ ] Placeholder text that guides (not just "[fill in]")
- [ ] Examples for complex sections
- [ ] Metadata block (author, date, version, status)
- [ ] Quality checklist at the end

**Template Quality Standards:**
- Usable by someone who has never seen it before
- Completable in reasonable time (not 20-page bureaucracy)
- Flexible enough for simple and complex use cases
- Consistent naming and structure across all templates

### Step 3: Build Template Structure
**Template Header (universal):**
```
# [Artifact Type]: [Title]

## Metadata
| Field | Value |
|-------|-------|
| Author | [name] |
| Date | [date] |
| Version | [v1.0] |
| Status | [Draft / Review / Approved / Archived] |
| Project | [project name] |
| Client | [client name] |
```

**Template Body:**
- Section headers with guidance text
- Required fields marked with (REQUIRED)
- Optional fields marked with (OPTIONAL)
- Inline examples in italics
- Tips in blockquotes

**Template Footer (universal):**
```
## Quality Checklist
- [ ] All required sections completed
- [ ] Reviewed by [role]
- [ ] No placeholder text remaining
- [ ] Consistent with project standards
```

### Step 4: Create Template Variants
**Per Template, Create:**
| Variant | Use Case | Complexity |
|---------|---------|-----------|
| Lite | Simple projects, quick turnaround | Minimal sections |
| Standard | Most projects | Full template |
| Enterprise | Large/complex projects | Extended sections |

### Step 5: Template Library Organization
**Library Structure:**
```
templates/
├── product/
│   ├── prd-template.md
│   ├── feature-spec-template.md
│   └── roadmap-template.md
├── discovery/
│   ├── research-brief-template.md
│   ├── interview-guide-template.md
│   └── discovery-report-template.md
├── delivery/
│   ├── sprint-plan-template.md
│   ├── release-notes-template.md
│   └── launch-checklist-template.md
├── client/
│   ├── qbr-template.md
│   ├── scope-agreement-template.md
│   └── status-update-template.md
└── README.md (template index + usage guide)
```

### Step 6: Template Governance
**Maintenance Rules:**
| Rule | Details |
|------|---------|
| Review frequency | Quarterly review of all templates |
| Update trigger | After 3+ users report issues |
| Deprecation | Archive old versions, redirect to new |
| Feedback | Template feedback channel established |
| Ownership | Each template has named owner |

## Output Artifacts
- `templates/[artifact-type]-template.md` | `template-index.md` | `template-usage-guide.md`

## Quality Criteria
- Template usable without explanation | Required vs optional sections clear | Examples included | Quality checklist embedded | Variants for different complexity levels | Library organized and indexed
