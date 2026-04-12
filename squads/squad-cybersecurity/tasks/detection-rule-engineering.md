---
task: "detection-rule-engineering"
responsavel: "soc-analyst"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: threat_description
    tipo: text
    origem: "user input or threat intelligence"
    obrigatorio: true
  - campo: rule_format
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["sigma", "yara", "snort", "suricata", "kql", "spl"]
Saida:
  - campo: detection_rule
    tipo: document
    destino: "SIEM or IDS"
Checklist:
  - "[ ] Understand the threat behavior to detect"
  - "[ ] Identify relevant log sources"
  - "[ ] Write detection logic"
  - "[ ] Map to MITRE ATT&CK"
  - "[ ] Document known false positives"
  - "[ ] Test against benign and malicious samples"
  - "[ ] Assess performance impact"
---

# Detection Rule Engineering

## Objective

Create high-quality detection rules for specific threats. Rules must be precise (low false positives), mapped to MITRE ATT&CK, documented with known exceptions, and tested before deployment.

## Inputs

- Threat description or behavior to detect
- Preferred rule format (default: Sigma)
- Available log sources and fields
- Known false positive patterns

## Steps

1. **Analyze the threat** — Understand the specific behavior, technique, or IOC to detect. Map to MITRE ATT&CK technique and sub-technique.

2. **Identify log sources** — Determine which log source captures the relevant events. Verify field availability and format.

3. **Write detection logic** — Craft the rule with appropriate conditions. Balance sensitivity (catch all malicious) with specificity (avoid false positives).

4. **Add metadata** — MITRE ATT&CK tags, severity level, description, author, references, known false positives.

5. **Test the rule** — Validate against known malicious samples (should trigger) and known benign samples (should not trigger).

6. **Assess performance** — Evaluate query cost and execution frequency impact on SIEM performance.

7. **Document** — Include deployment notes, tuning guidance, and escalation procedure when the rule fires.

## Quality Gates

- Rule must detect the target behavior in testing
- False positive rate must be documented
- MITRE ATT&CK mapping must be included
- Sigma format must validate with sigmac
- Performance impact must be assessed
