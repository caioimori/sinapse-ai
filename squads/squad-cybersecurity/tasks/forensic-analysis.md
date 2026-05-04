---
task: "forensic-analysis"
responsavel: "incident-responder"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: evidence
    tipo: list
    origem: "incident containment"
    obrigatorio: true
  - campo: investigation_questions
    tipo: list
    origem: "IR team"
    obrigatorio: true
Saida:
  - campo: forensic_report
    tipo: document
    destino: "IR team, legal, management"
Checklist:
  - "[ ] Maintain chain of custody"
  - "[ ] Follow order of volatility for evidence collection"
  - "[ ] Analyze memory artifacts"
  - "[ ] Analyze disk artifacts"
  - "[ ] Analyze network artifacts"
  - "[ ] Build comprehensive timeline"
  - "[ ] Answer investigation questions"
  - "[ ] Document all findings with evidence hashes"
---

# Forensic Analysis

## Objective

Conduct digital forensic analysis on evidence collected during an incident to determine root cause, attack timeline, attacker actions, and scope of compromise. Maintain chain of custody and evidentiary integrity throughout.

## Inputs

- Collected evidence (memory dumps, disk images, log files, network captures)
- Investigation questions to answer
- Chain of custody documentation
- Incident timeline from SOC investigation

## Steps

1. **Verify evidence integrity** — Check hashes against collection records. Confirm chain of custody is intact. Work only on forensic copies, never originals.

2. **Memory analysis** — Analyze RAM captures for: running processes, network connections, loaded DLLs, injected code, command history, encryption keys, credentials.

3. **Disk analysis** — Analyze filesystem for: recently modified files, deleted files, alternate data streams, registry modifications, scheduled tasks, startup items, browser history.

4. **Network analysis** — Analyze captures for: C2 communications, data exfiltration, lateral movement, DNS tunneling, beaconing patterns.

5. **Log analysis** — Correlate system logs, application logs, and security logs to build a comprehensive timeline of attacker activity.

6. **Timeline reconstruction** — Build a unified timeline combining all evidence sources. Map attacker actions to MITRE ATT&CK techniques.

7. **Answer investigation questions** — Address each investigation question with evidence-backed answers and confidence levels.

## Quality Gates

- Chain of custody maintained for all evidence
- All evidence hashes verified before and after analysis
- Timeline must be corroborated by multiple evidence sources
- Findings must include confidence levels
- Report must be suitable for legal proceedings if required
