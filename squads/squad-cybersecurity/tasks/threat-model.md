---
task: "threat-model"
responsavel: "threat-analyst"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: system_description
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: architecture_diagram
    tipo: document
    origem: "user input"
    obrigatorio: false
  - campo: methodology
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["STRIDE", "PASTA", "attack-tree"]
Saida:
  - campo: threat_model
    tipo: document
    destino: "stakeholders, penetration-tester"
Checklist:
  - "[ ] Define system scope and trust boundaries"
  - "[ ] Identify assets and data flows"
  - "[ ] Enumerate threats using selected methodology"
  - "[ ] Map threats to MITRE ATT&CK techniques"
  - "[ ] Assess risk for each threat (likelihood x impact)"
  - "[ ] Provide prioritized mitigation recommendations"
---

# Threat Model

## Objective

Build a comprehensive threat model for a system, application, or architecture using STRIDE, PASTA, or attack tree methodology. Identify threats, map to MITRE ATT&CK, assess risk, and produce actionable mitigation recommendations.

## Inputs

- System description (architecture, components, data flows)
- Architecture diagrams (if available)
- Preferred methodology (default: STRIDE)
- Known security requirements or compliance constraints

## Steps

1. **Define scope and boundaries** — Identify what is being modeled: application, service, infrastructure, or entire system. Define trust boundaries between components.

2. **Identify assets** — Enumerate what needs protection: data (classified by sensitivity), services (classified by criticality), credentials, keys, configuration.

3. **Map data flows** — Document how data moves between components, across trust boundaries, and to/from external systems. Use Data Flow Diagrams (DFDs) with trust boundary annotations.

4. **Enumerate threats** — Apply the selected methodology:
   - **STRIDE:** For each component and data flow, analyze Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege
   - **PASTA:** Execute all 7 stages from business objectives through risk analysis
   - **Attack Trees:** Build hierarchical threat decomposition with AND/OR nodes

5. **Map to MITRE ATT&CK** — For each identified threat, map to specific ATT&CK techniques. This enables detection rule creation and adversary emulation.

6. **Assess risk** — Score each threat using the 5x5 likelihood x impact matrix. Consider existing controls as mitigating factors.

7. **Prioritize mitigations** — For each threat, recommend specific countermeasures ordered by risk reduction per effort invested. Reference specific security controls.

## Quality Gates

- All trust boundaries must be explicitly identified
- Every threat must have a MITRE ATT&CK mapping
- Risk scores must include justification
- Mitigations must be specific and implementable (not generic)
- Threat model must be reviewable by non-security stakeholders

## Output Format

```markdown
# Threat Model: [System Name]

## Scope
[System description and boundaries]

## Assets
| Asset | Classification | Location |
|-------|---------------|----------|

## Data Flow Diagram
[DFD with trust boundaries]

## Threat Catalog
| ID | Threat | STRIDE Category | ATT&CK Technique | Likelihood | Impact | Risk Score |
|----|--------|----------------|-------------------|------------|--------|------------|

## Risk Heat Map
[5x5 matrix visualization]

## Mitigation Recommendations
| Priority | Threat ID | Mitigation | Effort | Risk Reduction |
|----------|-----------|------------|--------|---------------|

## Residual Risk
[Risks accepted with justification]
```
