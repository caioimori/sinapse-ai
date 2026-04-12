---
task: audit-crm-data
responsavel: "@cs-crm-specialist"
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

# Task: Audit CRM Data

## Metadata
- **Squad:** squad-commercial
- **Agent:** Vault (cs-crm-specialist)
- **Complexity:** Standard

## Objetivo
Auditar qualidade dos dados no CRM — completude de campos, consistencia, deals orfaos, contatos duplicados e compliance com governanca de dados. CRM limpo = forecast confiavel.

## Entrada
- CRM database access
- Required field definitions
- Data governance standards
- Historical data quality metrics

## Passos

### 1. Data Completeness Score
| Entity | Required Fields | % Complete | Target | Status |
|--------|----------------|-----------|--------|--------|
| Contacts | Name, Email, Company, Role, Source | | 95% | |
| Companies | Name, Industry, Size, Website, Owner | | 95% | |
| Deals | Name, Value, Stage, Close Date, Owner | | 98% | |
| Activities | Type, Date, Contact, Notes, Outcome | | 90% | |

### 2. Data Quality Checks
| Check | Method | Red Flags |
|-------|--------|-----------|
| **Duplicates** | Match by email + company | Duplicate rate > 5% |
| **Orphan Deals** | Deals without contact/company | Any orphan deal |
| **Stale Contacts** | No activity > 180 days | > 30% database stale |
| **Invalid Data** | Email format, phone format | Any invalid required field |
| **Stage Integrity** | Deals in wrong stage per criteria | Stage criteria violations |
| **Owner Consistency** | Deals with inactive owners | Any unassigned deals |

### 3. Scoring Rubric
```
CRM Health Score = (Completeness × 0.4) + (Accuracy × 0.3) + (Freshness × 0.3)

Completeness: % of required fields populated
Accuracy: % of fields with valid, consistent data
Freshness: % of records updated within expected timeframe

Grading:
  A (90-100): Excellent — forecast-ready
  B (80-89): Good — minor gaps
  C (70-79): Needs work — reliability compromised
  D (<70): Critical — urgent remediation
```

### 4. Remediation Plan
| Issue | Records Affected | Fix Method | Priority | Deadline |
|-------|-----------------|-----------|----------|----------|
| | | Manual / Automated / Enrichment | P0/P1/P2 | |

## Saida
- CRM Health Score with breakdown
- Data quality report
- Remediation plan with priorities
- Automated monitoring alerts configured

## Validacao
- [ ] All entities audited
- [ ] Duplicate detection complete
- [ ] Health Score calculated
- [ ] Remediation plan has clear owners and deadlines
