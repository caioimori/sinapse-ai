# Squad Cybersecurity

> Squad de 8 especialistas em seguranca cibernetica. Threat analysis, pentesting, SOC operations, incident response, cloud security, network security e compliance.

## Visao Geral

| Metrica | Quantidade |
|---------|-----------|
| Agentes | 9 |
| Tasks | 53 |
| Workflows | 2 |
| Knowledge Bases | 3 |

## Agentes

| Agente | Papel |
|--------|-------|
| cyber-orqx | Orquestrador — triage e roteamento de demandas de seguranca |
| threat-analyst | Threat Intelligence — threat modeling, attack surface, risk scoring |
| penetration-tester | Pentesting — vulnerability assessment, web/API/mobile security |
| soc-analyst | SOC Operations — SIEM, threat hunting, detection rules |
| incident-responder | Incident Response — triage, containment, forensics, post-mortem |
| cloud-security-engineer | Cloud Security — IAM, containers, serverless, compliance |
| network-security-engineer | Network Security — segmentation, firewall, zero trust, DNS |
| compliance-officer | Compliance — gap analysis, policies, vendor assessment, privacy |

## Ativacao

```bash
# Via orquestrador (recomendado)
@cyber-orqx

# Via agente especifico
@threat-analyst
@penetration-tester
@incident-responder
```

## Tasks Principais

**Threat Intelligence**
- threat-model, threat-intelligence-report, attack-surface-mapping
- risk-scoring-matrix, supply-chain-risk-assessment

**Pentesting e Security Audit**
- vulnerability-assessment, web-app-pentest, api-security-audit
- authentication-security-review, code-security-review

**SOC Operations**
- siem-alert-triage, siem-rule-creation, threat-hunting-campaign
- detection-rule-engineering, security-dashboard-design

**Incident Response**
- incident-triage, incident-containment, incident-response-plan
- forensic-analysis, post-incident-review

**Cloud Security**
- cloud-security-assessment, iam-audit, container-security-review
- serverless-security-review, cloud-compliance-mapping

**Network Security**
- network-segmentation-review, firewall-rule-audit, zero-trust-architecture-plan

**Compliance**
- compliance-gap-analysis, security-policy-draft, vendor-security-assessment
- data-classification-framework, privacy-impact-assessment

## Workflows

- **incident-response-cycle** — Deteccao a triage a containment a recovery a post-mortem
- **security-audit-workflow** — Auditoria completa de seguranca

## Knowledge Bases

- routing-catalog
- security-frameworks-catalog
- threat-intelligence-reference

## Integracao com Core Agents

Este squad trabalha com o framework SINAPSE core:
- @architect (Aria) para decisoes tecnicas
- @developer (Dex) para implementacao
- @quality-gate (Quinn) para validacao de qualidade

---

*Parte do ecossistema SINAPSE-AI — 18 squads, 186 agentes*
