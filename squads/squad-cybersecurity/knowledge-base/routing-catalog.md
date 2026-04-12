# Cyber Defense Squad — Routing Catalog

## Purpose

This catalog guides Fortress (cyber-orqx) in routing incoming security requests to the correct specialist agent. It defines domain boundaries, overlap resolution, and escalation paths.

## Agent Roster

| Codename | Agent ID | Domain | Sub-Group |
|----------|----------|--------|-----------|
| **Fortress** | cyber-orqx | Orchestration, triage, cross-domain | Orchestration |
| **Shield** | threat-analyst | Threat intel, threat modeling, risk assessment | Threat Intelligence |
| **Breach** | penetration-tester | Pentesting, vuln assessment, AppSec | Offensive Security |
| **Sentinel** | soc-analyst | SIEM, alert triage, threat hunting, detection | Security Operations |
| **Rapid** | incident-responder | IR lifecycle, forensics, recovery | Incident Response |
| **Nimbus** | cloud-security-engineer | Cloud security, IAM, containers, CSPM | Cloud Security |
| **Wire** | network-security-engineer | Firewalls, segmentation, zero trust, IDS/IPS | Network Security |
| **Govern** | compliance-officer | Compliance, policies, risk management | GRC |

## Routing Decision Tree

### Level 1: Domain Classification

```
Is the request about an ACTIVE security incident?
  YES → Rapid (incident-responder)
  NO → Continue to Level 2

Is the request about TESTING or ASSESSING vulnerabilities?
  YES → Breach (penetration-tester) [verify authorization first]
  NO → Continue to Level 2

Is the request about MONITORING, ALERTS, or DETECTION?
  YES → Sentinel (soc-analyst)
  NO → Continue to Level 2

Is the request about THREAT INTELLIGENCE or THREAT MODELING?
  YES → Shield (threat-analyst)
  NO → Continue to Level 2

Is the request about CLOUD infrastructure security?
  YES → Nimbus (cloud-security-engineer)
  NO → Continue to Level 2

Is the request about NETWORK architecture or firewalls?
  YES → Wire (network-security-engineer)
  NO → Continue to Level 2

Is the request about COMPLIANCE, POLICIES, or REGULATIONS?
  YES → Govern (compliance-officer)
  NO → Continue to Level 2

Does the request span MULTIPLE domains?
  YES → Fortress coordinates multi-agent response
  NO → Fortress handles directly or asks clarifying questions
```

### Level 2: Overlap Resolution

Some requests touch multiple domains. Resolution rules:

| Request Pattern | Primary Agent | Supporting Agent | Rationale |
|----------------|--------------|-----------------|-----------|
| "Is this alert a real attack?" | Sentinel | Shield (for IOC context) | Alert triage is SOC domain |
| "Pentest our cloud environment" | Breach | Nimbus (for cloud context) | Pentest is offensive domain |
| "Harden our AWS IAM" | Nimbus | Govern (for compliance context) | IAM is cloud domain |
| "We've been breached, what to do?" | Rapid | Sentinel + Wire (for containment) | Active incident = IR domain |
| "Model threats for our API" | Shield | Breach (for vulnerability context) | Threat modeling is intel domain |
| "Are we SOC 2 compliant?" | Govern | All agents (for control evidence) | Compliance is GRC domain |
| "Set up detection for this attack" | Sentinel | Shield (for ATT&CK mapping) | Detection is SOC domain |
| "Review our firewall rules" | Wire | Govern (for compliance alignment) | Firewalls are network domain |
| "Secure our Kubernetes cluster" | Nimbus | Wire (for network policies) | K8s is cloud domain |

## Task-to-Agent Mapping

| Task | Primary Agent | Invocation |
|------|--------------|------------|
| triage-security-request | Fortress | `/cyber:tasks:triage-security-request` |
| threat-model | Shield | `/cyber:tasks:threat-model` |
| threat-intelligence-report | Shield | `/cyber:tasks:threat-intelligence-report` |
| vulnerability-assessment | Breach | `/cyber:tasks:vulnerability-assessment` |
| web-app-pentest | Breach | `/cyber:tasks:web-app-pentest` |
| api-security-audit | Breach | `/cyber:tasks:api-security-audit` |
| code-security-review | Breach | `/cyber:tasks:code-security-review` |
| siem-alert-triage | Sentinel | `/cyber:tasks:siem-alert-triage` |
| threat-hunting-campaign | Sentinel | `/cyber:tasks:threat-hunting-campaign` |
| detection-rule-engineering | Sentinel | `/cyber:tasks:detection-rule-engineering` |
| incident-triage | Rapid | `/cyber:tasks:incident-triage` |
| incident-containment | Rapid | `/cyber:tasks:incident-containment` |
| forensic-analysis | Rapid | `/cyber:tasks:forensic-analysis` |
| post-incident-review | Rapid | `/cyber:tasks:post-incident-review` |
| cloud-security-assessment | Nimbus | `/cyber:tasks:cloud-security-assessment` |
| iam-audit | Nimbus | `/cyber:tasks:iam-audit` |
| container-security-review | Nimbus | `/cyber:tasks:container-security-review` |
| network-segmentation-review | Wire | `/cyber:tasks:network-segmentation-review` |
| firewall-rule-audit | Wire | `/cyber:tasks:firewall-rule-audit` |
| compliance-gap-analysis | Govern | `/cyber:tasks:compliance-gap-analysis` |
| security-policy-draft | Govern | `/cyber:tasks:security-policy-draft` |
| risk-assessment | Govern | `/cyber:tasks:risk-assessment` |

## Escalation Paths

| Situation | Escalation Target |
|-----------|------------------|
| Specialist cannot resolve within domain | Fortress (coordinate cross-domain) |
| Active breach detected during assessment | Rapid (immediate IR activation) |
| Compliance violation with legal implications | Govern + Legal (external) |
| Cross-squad request (e.g., needs dev work) | Squad orchestrator (inter-squad coordination) |
| Ethical boundary violation detected | Fortress (BLOCK operation immediately) |

## Cross-Squad Handoffs

| Direction | Target Squad | Trigger |
|-----------|-------------|---------|
| **Outbound** | squad-design | When security findings require UX changes (CSP, auth flows) |
| **Outbound** | squad-product | When security requirements affect product decisions |
| **Outbound** | squad-claude | When securing Claude Code configurations and MCP servers |
| **Inbound** | Any squad | When security review is needed for any domain |

## Ethical Gate — Mandatory for All Agents

Before any operation that could be considered offensive:

1. **Is there written authorization?** If NO → BLOCK
2. **Is the scope clearly defined?** If NO → BLOCK until clarified
3. **Are rules of engagement established?** If NO → BLOCK until defined
4. **Is this for DEFENSIVE/EDUCATIONAL purposes?** If NO → BLOCK

No exceptions. No workarounds. Authorization is non-negotiable.
