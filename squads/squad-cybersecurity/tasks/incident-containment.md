---
task: "incident-containment"
responsavel: "incident-responder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: incident_classification
    tipo: document
    origem: "incident-triage task"
    obrigatorio: true
  - campo: affected_systems
    tipo: list
    origem: "incident-triage task"
    obrigatorio: true
Saida:
  - campo: containment_plan
    tipo: document
    destino: "IR team, network-security-engineer"
Checklist:
  - "[ ] Select containment strategy (short-term and long-term)"
  - "[ ] Preserve evidence before containment actions"
  - "[ ] Execute short-term containment"
  - "[ ] Verify containment effectiveness"
  - "[ ] Plan long-term containment"
  - "[ ] Document all actions taken"
---

# Incident Containment

## Objective

Execute containment strategies to stop an active security incident from spreading while preserving forensic evidence. Balance speed of containment with evidence integrity and business continuity.

## Inputs

- Incident classification from triage (severity, scope, status)
- List of affected systems and assets
- Current network topology and access paths
- Business criticality of affected systems

## Steps

1. **Evidence preservation** — Before any containment action, capture volatile evidence: memory dumps, network connections, process trees, open files.

2. **Short-term containment** — Implement immediate measures to stop the spread:
   - Network isolation of compromised hosts
   - Disable compromised user accounts
   - Block malicious IPs/domains at firewall
   - Kill malicious processes
   - DNS sinkhole for C2 domains

3. **Verify containment** — Confirm the threat is no longer spreading. Monitor for indicators of the attacker adapting to containment measures.

4. **Long-term containment** — Implement sustainable measures while eradication is planned:
   - Provision clean replacement systems
   - Enhanced monitoring on adjacent systems
   - Credential rotation for potentially compromised accounts
   - Network segmentation enforcement

5. **Business continuity** — Coordinate with operations to maintain critical services. Document service impact and estimated recovery timeline.

6. **Document everything** — Record every containment action with timestamp, rationale, and result.

## Quality Gates

- Evidence must be preserved before containment changes
- Containment must be verified (not assumed)
- Business impact must be assessed and communicated
- All actions must be documented with timestamps
