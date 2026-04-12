---
task: "triage-security-request"
responsavel: "cyber-orqx"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - campo: security_request
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: urgency_level
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["critical", "high", "medium", "low", "unknown"]
Saida:
  - campo: triage_result
    tipo: document
    destino: "appropriate specialist agent"
Checklist:
  - "[ ] Classify the security domain (threat intel, pentest, SOC, IR, cloud, network, compliance)"
  - "[ ] Assess severity level (critical/high/medium/low)"
  - "[ ] Verify authorization scope if offensive testing is requested"
  - "[ ] Route to the correct specialist agent with context"
  - "[ ] Provide estimated response timeline"
---

# Triage Security Request

## Objective

Classify an incoming security request by domain and severity, verify ethical boundaries, and route to the appropriate specialist agent within the Cyber Defense Squad.

## Inputs

- User's security request or question (free text)
- Optional urgency level provided by the user
- Any attached context (system descriptions, logs, screenshots)

## Steps

1. **Parse the request** — Identify the core security question or concern. Determine if it is offensive (pentest, vulnerability assessment), defensive (monitoring, hardening), incident-related (active threat), or governance-related (compliance, policy).

2. **Classify the domain** — Map to one of: Threat Intelligence (Shield), Penetration Testing (Breach), SOC Operations (Sentinel), Incident Response (Rapid), Cloud Security (Nimbus), Network Security (Wire), Compliance (Govern), or Cross-Domain (Fortress coordinates).

3. **Assess severity** — Determine urgency based on: Is there an active threat? Is data at risk? Is this time-sensitive? Apply the severity classification framework (Critical/High/Medium/Low).

4. **Check ethical gates** — If the request involves offensive testing, verify: Is there written authorization? Is the scope defined? Are there systems that are off-limits? Block any request that violates ethical boundaries.

5. **Route with context** — Hand off to the specialist with: the original request, classified domain, severity level, any relevant context, and recommended initial approach.

6. **Provide timeline** — Set expectations for response based on severity classification SLAs.

## Quality Gates

- Domain classification must be explicit and justified
- Severity must be assigned with rationale
- Ethical gate check must be documented for any offensive request
- Routing must include sufficient context for the specialist to begin immediately

## Output Format

```markdown
## Security Request Triage

**Request:** [Summary of request]
**Domain:** [Threat Intel | Pentest | SOC | IR | Cloud | Network | Compliance | Cross-Domain]
**Severity:** [Critical | High | Medium | Low]
**Ethical Gate:** [PASS | N/A (defensive only) | BLOCKED (reason)]
**Route To:** [Agent codename and ID]
**Context for Specialist:** [Relevant details]
**Expected Timeline:** [Based on severity SLA]
```
