---
task: "compliance-gap-analysis"
responsavel: "compliance-officer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: framework
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["soc2", "iso27001", "gdpr", "lgpd", "hipaa", "pci-dss", "nist-csf"]
  - campo: current_controls
    tipo: document
    origem: "user input"
    obrigatorio: false
Saida:
  - campo: gap_analysis_report
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Identify applicable framework requirements"
  - "[ ] Inventory current security controls"
  - "[ ] Map controls to framework requirements"
  - "[ ] Identify gaps (missing or partial controls)"
  - "[ ] Assess gap severity and risk"
  - "[ ] Produce remediation roadmap with priorities"
---

# Compliance Gap Analysis

## Objective

Perform a structured gap analysis against a specific regulatory or security framework. Map current controls to framework requirements, identify gaps, and produce a prioritized remediation roadmap.

## Inputs

- Target compliance framework
- Description of current security controls (or will be assessed)
- Organization context (industry, size, data types, geography)
- Previous audit findings (if any)

## Steps

1. **Scope the framework** — Identify which sections/requirements of the framework are applicable based on organization context. Document exclusions with justification.

2. **Inventory controls** — Document existing security controls: policies, procedures, technical controls, monitoring capabilities, training programs.

3. **Map controls to requirements** — For each framework requirement, identify which existing controls address it. Rate as: Fully Implemented, Partially Implemented, or Not Implemented.

4. **Identify gaps** — For Partially and Not Implemented requirements, document what is missing and what is needed.

5. **Risk-assess gaps** — Rate each gap by: regulatory risk (mandatory vs recommended), security risk (exploitability and impact), and remediation effort.

6. **Produce roadmap** — Create a phased remediation plan: Phase 1 (critical gaps, 0-3 months), Phase 2 (high gaps, 3-6 months), Phase 3 (medium gaps, 6-12 months).

7. **Evidence mapping** — For each implemented control, specify what evidence demonstrates compliance. This prepares for audit.

## Quality Gates

- Every applicable framework requirement must be assessed
- Gaps must be prioritized by risk, not just listed
- Remediation roadmap must include effort estimates
- Evidence requirements must be defined for implemented controls
