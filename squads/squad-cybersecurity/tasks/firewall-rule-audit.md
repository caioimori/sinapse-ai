---
task: "firewall-rule-audit"
responsavel: "network-security-engineer"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: firewall_rules
    tipo: document
    origem: "firewall export"
    obrigatorio: true
  - campo: firewall_platform
    tipo: text
    origem: "user input"
    obrigatorio: false
Saida:
  - campo: firewall_audit_report
    tipo: document
    destino: "stakeholders"
Checklist:
  - "[ ] Parse and normalize firewall rules"
  - "[ ] Identify overly permissive rules (any/any)"
  - "[ ] Find shadowed rules"
  - "[ ] Detect expired or obsolete rules"
  - "[ ] Verify rule documentation"
  - "[ ] Cross-reference with actual traffic"
  - "[ ] Provide cleanup recommendations"
---

# Firewall Rule Audit

## Objective

Audit firewall rules for overpermission, shadowed rules, obsolete entries, and documentation gaps. Produce a cleanup plan that reduces risk without breaking legitimate traffic.

## Inputs

- Firewall rule export (any format)
- Firewall platform (for vendor-specific analysis)
- Traffic logs (for rule utilization analysis, if available)
- Change management records (if available)

## Steps

1. **Parse and normalize** — Convert firewall rules to a standard format for analysis. Normalize source, destination, port, protocol, and action fields.

2. **Identify overpermission** — Flag rules with: source=any, destination=any, port=any, or combinations thereof. These are the highest-risk rules.

3. **Find shadowed rules** — Identify rules that can never match because a preceding rule handles all their traffic. These are dead rules that add complexity.

4. **Detect obsolete rules** — Find rules for decommissioned systems, expired temporary rules, and rules with zero hit counts (if traffic data is available).

5. **Verify documentation** — Check that each rule has: business justification, requesting party, approval, creation date, and review date.

6. **Cross-reference traffic** — Compare rule allowances with actual traffic patterns. Identify rules that allow traffic no one uses.

7. **Generate cleanup plan** — Prioritize rule changes by risk. Group into: immediate removal (shadowed/obsolete), tighten scope (overpermissive), add documentation (undocumented).

## Quality Gates

- Every rule must be categorized (compliant, needs tightening, needs removal, needs documentation)
- Overpermissive rules must have specific tightening recommendations
- Cleanup plan must not break legitimate traffic (verified against logs if available)
- Changes must be prioritized by risk reduction
