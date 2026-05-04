---
task: incident-response-plan
responsavel: "incident-responder"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_profile
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: ir_maturity
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["none", "basic", "intermediate", "advanced"]
  - campo: compliance_requirements
    tipo: list
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: incident_response_plan
    tipo: document
    destino: "stakeholders, all-agents"

Checklist:
  - "[ ] Define IR team structure and roles"
  - "[ ] Establish incident classification scheme"
  - "[ ] Document all IR phases"
  - "[ ] Create communication plan"
  - "[ ] Define escalation procedures"
  - "[ ] Include legal and regulatory requirements"
  - "[ ] Design testing and exercise schedule"
  - "[ ] Produce executive-approved document"
---

# Task: Incident Response Plan

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Rapid (incident-responder)
- **Complexity:** Complex

## Objective

Create a comprehensive incident response plan that defines the organization's approach to detecting, responding to, containing, eradicating, and recovering from security incidents. The plan establishes roles, procedures, communication protocols, and compliance obligations.

## Pre-Conditions

- Organizational structure and key stakeholders identified
- Understanding of regulatory and compliance requirements
- Current security tooling inventory
- Executive sponsorship for IR program
- Legal counsel available for regulatory requirements

## Inputs

- Organization profile (size, industry, geography, technology stack)
- Current IR maturity level (none, basic, intermediate, advanced)
- Compliance requirements (GDPR, HIPAA, PCI DSS, SOX, etc.)
- Existing IR documentation (if any)
- Insurance requirements (cyber insurance policy terms)

## Steps

### 1. Define IR Team Structure
Establish the Computer Security Incident Response Team (CSIRT):

| Role | Responsibility | Primary | Backup |
|------|---------------|---------|--------|
| IR Lead | Overall incident coordination | | |
| Technical Lead | Technical investigation and containment | | |
| Communications Lead | Internal/external communications | | |
| Legal Advisor | Legal and regulatory guidance | | |
| Executive Sponsor | Decision authority, resource allocation | | |
| Forensic Analyst | Evidence collection and analysis | | |
| System Admin | System recovery and restoration | | |

### 2. Establish Incident Classification
Define incident types and severity levels:

| Severity | Description | Examples | Response Time |
|----------|-----------|---------|--------------|
| SEV-1 Critical | Active breach, data exfiltration | Ransomware, confirmed data breach | Immediate (24/7) |
| SEV-2 High | Confirmed compromise, contained | Compromised account, malware | 1 hour |
| SEV-3 Medium | Suspicious activity, potential incident | Anomalous behavior, policy violation | 4 hours |
| SEV-4 Low | Minor event, informational | Failed scan, blocked attack | Next business day |

### 3. Document Preparation Phase
Define proactive measures:
- Asset inventory and classification
- Baseline documentation
- Tool readiness (forensic kits, jump bags)
- Contact lists (internal, external, law enforcement)
- Retainer agreements (forensic firms, legal counsel)
- Playbook library for common incident types

### 4. Document Detection and Analysis Phase
Define how incidents are identified and confirmed:
- Detection sources (SIEM, EDR, user reports, threat intel)
- Initial triage procedures
- Evidence preservation requirements
- Incident documentation standards
- Analysis techniques and tools

### 5. Document Containment Phase
Define containment strategies:
- Short-term containment (stop the bleeding)
- Evidence preservation before containment changes
- Long-term containment (sustainable measures)
- Containment verification procedures
- Business continuity during containment

### 6. Document Eradication and Recovery Phase
Define procedures for:
- Root cause identification
- Malware removal and system cleaning
- Vulnerability remediation
- System rebuild procedures
- Recovery verification and monitoring
- Phased return to production

### 7. Create Communication Plan
Define communication protocols for each severity:

| Audience | SEV-1 | SEV-2 | SEV-3 | SEV-4 |
|----------|-------|-------|-------|-------|
| IR Team | Immediate | 1 hour | 4 hours | Daily |
| Management | 30 min | 4 hours | Daily | Weekly |
| Executive | 1 hour | 8 hours | As needed | — |
| Legal | 1 hour | 4 hours | As needed | — |
| Customers | Per legal guidance | — | — | — |
| Regulators | Per compliance req | — | — | — |
| Media | Per communications plan | — | — | — |

### 8. Define Regulatory Obligations
Document notification requirements:
| Regulation | Notification Trigger | Timeline | Authority |
|-----------|---------------------|----------|-----------|
| GDPR | Personal data breach | 72 hours | DPA |
| HIPAA | PHI breach > 500 | 60 days | HHS |
| PCI DSS | Cardholder data | Immediate | Card brands |
| State laws | PII breach | Varies | State AG |

### 9. Design Post-Incident Review Process
Establish blameless post-incident review:
- Timeline reconstruction
- Effectiveness assessment for each IR phase
- Lessons learned documentation
- Action items with owners and deadlines
- IR plan updates based on findings

### 10. Create Testing and Exercise Schedule
Plan regular IR plan validation:
| Exercise Type | Frequency | Participants | Objective |
|--------------|-----------|-------------|----------|
| Tabletop | Quarterly | Full CSIRT | Decision-making practice |
| Walkthrough | Semi-annual | Technical team | Procedural validation |
| Simulation | Annual | All stakeholders | Full plan test |
| Red team | Annual | IR + Red team | Detection and response test |

## Output

```yaml
incident_response_plan:
  organization: ""
  version: ""
  date: ""
  approved_by: ""
  next_review: ""

  ir_team:
    - role: ""
      primary: ""
      backup: ""
      contact: ""

  classification_scheme: {}
  phases:
    preparation: {}
    detection_analysis: {}
    containment: {}
    eradication_recovery: {}
    post_incident: {}

  communication_plan: {}
  regulatory_obligations: {}
  exercise_schedule: {}

  appendices:
    - contact_list
    - tool_inventory
    - playbook_index
    - evidence_handling_procedures
```

## Quality Criteria

- [ ] IR team structure defined with primary and backup contacts
- [ ] Incident classification covers all severity levels
- [ ] All NIST SP 800-61 phases documented
- [ ] Communication plan addresses all stakeholder groups
- [ ] Regulatory notification requirements documented
- [ ] Post-incident review process is blameless
- [ ] Testing and exercise schedule established
- [ ] Plan approved by executive leadership
