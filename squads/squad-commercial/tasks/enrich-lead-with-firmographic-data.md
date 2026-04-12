---
task: enrich-lead-with-firmographic-data
responsavel: "@cs-sales-enablement"
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

# Task: Enrich Lead with Firmographic Data

## Metadata
- **Squad:** squad-commercial
- **Agent:** Edge (cs-sales-enablement)
- **Complexity:** Intermediate

## Objetivo
Enrich inbound leads with firmographic and technographic data for better qualification and prioritization. Raw leads are just names — enriched leads are qualified opportunities. The quality of your data determines the quality of your pipeline.

## Entrada
- Inbound lead data (name, email, company, source)
- Existing CRM records (if any)
- Ideal Customer Profile (ICP) definition
- Data enrichment tool access (Clearbit, ZoomInfo, Apollo, LinkedIn)

## Passos

### 1. Identify Data Sources
| Data Source | Data Type | Reliability | Cost |
|-------------|-----------|-------------|------|
| **Clearbit / ZoomInfo** | Firmographic + technographic | High | Paid |
| **LinkedIn Sales Navigator** | Org chart, headcount, recent changes | High | Paid |
| **Company Website** | Services, team size, positioning | Medium | Free |
| **Crunchbase** | Funding, investors, growth stage | High | Freemium |
| **BuiltWith / Wappalyzer** | Tech stack detection | Medium | Freemium |
| **News & PR** | Recent events, hiring, expansion | Variable | Free |

### 2. Match Company Profile
| Step | Action | Output |
|------|--------|--------|
| Domain extraction | Extract company domain from email | company.com |
| Company lookup | Query enrichment APIs with domain | Raw firmographic data |
| Deduplication | Match against existing CRM records | Merged or new record |
| Validation | Cross-reference across 2+ sources | Confidence score |

### 3. Append Firmographic and Technographic Data
| Category | Data Points |
|----------|------------|
| **Company Basics** | Legal name, domain, headquarters, year founded |
| **Industry** | Primary industry, NAICS/SIC code, sub-vertical |
| **Size** | Employee count, revenue range, growth rate |
| **Funding** | Total raised, last round, investors, stage |
| **Tech Stack** | CMS, CRM, analytics, marketing tools, infrastructure |
| **Digital Presence** | Website traffic estimate, social following, content activity |
| **Org Structure** | Decision makers, reporting lines, key departments |
| **Signals** | Recent hiring (roles), job postings, news, funding events |

### 4. Score Enrichment Quality
| Quality Level | Criteria | Action |
|--------------|---------|--------|
| **Complete** (90-100%) | All critical fields populated, 2+ source validation | Ready for scoring |
| **Adequate** (70-89%) | Most fields populated, some from single source | Proceed with caveats |
| **Partial** (50-69%) | Key gaps exist, limited source validation | Manual research needed |
| **Insufficient** (<50%) | Major gaps, unreliable data | Flag for manual enrichment or deprioritize |

## Saida
- Enriched lead record with all firmographic/technographic fields
- Enrichment quality score per lead
- ICP fit assessment (match percentage)
- Data source attribution (which source provided which data)
- Enrichment gap report (what couldn't be found)

## Validacao
- [ ] All critical firmographic fields populated (industry, size, revenue)
- [ ] Tech stack data appended where available
- [ ] Enrichment quality scored and documented
- [ ] Data validated against 2+ sources for key fields
- [ ] ICP fit calculated and recorded
- [ ] Enrichment process documented for repeatability
