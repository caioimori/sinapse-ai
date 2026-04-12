---
task: "risk-assessment"
responsavel: "compliance-officer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: scope
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: methodology
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["qualitative", "quantitative-fair", "hybrid"]
Saida:
  - campo: risk_register
    tipo: document
    destino: "stakeholders, management"
Checklist:
  - "[ ] Identify assets and their value"
  - "[ ] Identify threats to each asset"
  - "[ ] Identify vulnerabilities"
  - "[ ] Assess likelihood and impact"
  - "[ ] Calculate risk scores"
  - "[ ] Determine risk treatment (mitigate, accept, transfer, avoid)"
  - "[ ] Produce risk register"
  - "[ ] Define risk monitoring plan"
---

# Risk Assessment

## Objective

Conduct a structured risk assessment to identify, analyze, and prioritize information security risks. Produce a risk register with treatment recommendations that align with organizational risk appetite.

## Inputs

- Assessment scope (organization-wide, specific system, specific process)
- Preferred methodology (qualitative 5x5, quantitative FAIR, or hybrid)
- Asset inventory (or will be developed)
- Known threats and vulnerabilities

## Steps

1. **Asset identification** — Enumerate information assets: data, systems, applications, processes, people. Classify by value and criticality.

2. **Threat identification** — For each asset, identify applicable threats: adversarial (hackers, insiders), accidental (human error, failures), environmental (natural disasters, power loss).

3. **Vulnerability assessment** — Identify weaknesses that threats could exploit. Consider technical, process, and people vulnerabilities.

4. **Risk analysis** — Calculate risk using the selected methodology:
   - **Qualitative:** 5x5 likelihood x impact matrix
   - **FAIR:** Loss Event Frequency x Loss Magnitude with probabilistic ranges
   - **Hybrid:** Qualitative screening with quantitative deep-dive for top risks

5. **Risk evaluation** — Compare calculated risk against organizational risk appetite. Categorize as: Critical (immediate action), High (near-term action), Medium (planned action), Low (monitor).

6. **Risk treatment** — For each risk above appetite: Mitigate (implement controls), Accept (document business justification), Transfer (insurance, contracts), or Avoid (eliminate the activity).

7. **Risk register** — Compile all identified risks with scores, treatment decisions, owners, and timelines.

8. **Monitoring plan** — Define how risks will be monitored over time. Set review frequency and trigger conditions for reassessment.

## Quality Gates

- All critical assets must be included
- Threat identification must consider adversarial, accidental, and environmental threats
- Risk scores must be justified with rationale
- Every risk above appetite must have a treatment decision
- Risk register must have assigned owners for all items
