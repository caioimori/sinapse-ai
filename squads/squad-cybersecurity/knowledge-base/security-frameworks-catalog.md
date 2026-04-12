# Security Frameworks Catalog

## Purpose

Quick-reference catalog of security frameworks, standards, and methodologies used across the Cyber Defense Squad. Each entry provides context for when and how to apply the framework.

---

## Offensive Security Frameworks

### OWASP Top 10 (2021)
- **Owner:** OWASP Foundation
- **Scope:** Web application security risks
- **Used by:** Breach (penetration-tester)
- **Update cycle:** ~4 years
- **Categories:** A01-Broken Access Control, A02-Cryptographic Failures, A03-Injection, A04-Insecure Design, A05-Security Misconfiguration, A06-Vulnerable Components, A07-Auth Failures, A08-Software/Data Integrity, A09-Logging/Monitoring, A10-SSRF

### OWASP API Security Top 10 (2023)
- **Owner:** OWASP Foundation
- **Scope:** API-specific security risks
- **Used by:** Breach (penetration-tester)
- **Categories:** API1-BOLA, API2-Broken Auth, API3-Broken Property Auth, API4-Unrestricted Consumption, API5-Broken Function Auth, API6-Unrestricted Business Flows, API7-SSRF, API8-Misconfig, API9-Improper Inventory, API10-Unsafe Consumption

### OWASP Testing Guide (v4.2)
- **Owner:** OWASP Foundation
- **Scope:** Comprehensive web application security testing methodology
- **Used by:** Breach (penetration-tester)
- **Sections:** Information Gathering, Configuration, Identity, Authentication, Authorization, Session, Input Validation, Error Handling, Cryptography, Business Logic, Client-Side

### PTES (Penetration Testing Execution Standard)
- **Owner:** PTES community
- **Scope:** End-to-end penetration testing methodology
- **Used by:** Breach (penetration-tester)
- **Phases:** Pre-engagement, Intelligence Gathering, Threat Modeling, Vulnerability Analysis, Exploitation, Post-Exploitation, Reporting

### CVSS (Common Vulnerability Scoring System) v3.1
- **Owner:** FIRST.org
- **Scope:** Vulnerability severity scoring
- **Used by:** Breach, Shield (all vulnerability scoring)
- **Score ranges:** Critical (9.0-10.0), High (7.0-8.9), Medium (4.0-6.9), Low (0.1-3.9), None (0.0)

---

## Threat Intelligence Frameworks

### MITRE ATT&CK Enterprise
- **Owner:** MITRE Corporation
- **Scope:** Adversary tactics, techniques, and procedures (TTPs)
- **Used by:** Shield (threat-analyst), Sentinel (soc-analyst), all agents for TTP mapping
- **Structure:** 14 Tactics, 200+ Techniques, 400+ Sub-Techniques
- **Navigator:** ATT&CK Navigator for visualization and coverage mapping
- **URL:** https://attack.mitre.org/

### MITRE D3FEND
- **Owner:** MITRE Corporation
- **Scope:** Defensive countermeasures mapped to ATT&CK techniques
- **Used by:** Sentinel (detection engineering), all defensive agents
- **Purpose:** Bridge between offensive techniques and defensive capabilities

### Diamond Model of Intrusion Analysis
- **Owner:** Center for Cyber Intelligence Analysis and Threat Research
- **Scope:** Intrusion analysis methodology
- **Used by:** Shield (threat-analyst)
- **Elements:** Adversary, Infrastructure, Capability, Victim

### Cyber Kill Chain
- **Owner:** Lockheed Martin
- **Scope:** Attack lifecycle phases
- **Used by:** Shield, Rapid (incident response)
- **Phases:** Reconnaissance, Weaponization, Delivery, Exploitation, Installation, C2, Actions on Objectives

### STIX/TAXII
- **Owner:** OASIS
- **Scope:** Threat intelligence sharing standards
- **Used by:** Shield (threat intelligence exchange)
- **STIX:** Structured Threat Information eXpression (data format)
- **TAXII:** Trusted Automated eXchange of Intelligence Information (transport)

### TLP (Traffic Light Protocol)
- **Owner:** FIRST.org
- **Scope:** Information sharing classification
- **Used by:** All agents for report classification
- **Levels:** TLP:RED (named recipients only), TLP:AMBER (organization), TLP:GREEN (community), TLP:WHITE (unrestricted)

---

## Threat Modeling Frameworks

### STRIDE
- **Owner:** Microsoft
- **Scope:** Threat identification for systems and applications
- **Used by:** Shield (threat-analyst)
- **Categories:** Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege

### PASTA (Process for Attack Simulation and Threat Analysis)
- **Owner:** VerSprite
- **Scope:** Risk-centric threat modeling
- **Used by:** Shield (threat-analyst)
- **Stages:** 7 stages from business objectives through risk analysis

### DREAD
- **Owner:** Microsoft (legacy, still useful)
- **Scope:** Risk rating for individual threats
- **Used by:** Shield (threat-analyst)
- **Factors:** Damage, Reproducibility, Exploitability, Affected Users, Discoverability

### Attack Trees
- **Owner:** Bruce Schneier (concept originator)
- **Scope:** Hierarchical threat decomposition
- **Used by:** Shield (threat-analyst)
- **Structure:** Root node (attacker goal), child nodes (methods), AND/OR logic

---

## Risk Management Frameworks

### NIST CSF 2.0 (Cybersecurity Framework)
- **Owner:** NIST
- **Scope:** Risk-based cybersecurity program structure
- **Used by:** Govern (compliance-officer)
- **Functions:** Govern, Identify, Protect, Detect, Respond, Recover

### NIST SP 800-53 Rev. 5
- **Owner:** NIST
- **Scope:** Security and privacy control catalog
- **Used by:** Govern (compliance-officer)
- **Control families:** 20 families, 1000+ controls

### FAIR (Factor Analysis of Information Risk)
- **Owner:** FAIR Institute
- **Scope:** Quantitative risk analysis
- **Used by:** Shield (risk assessment), Govern (risk management)
- **Components:** Loss Event Frequency, Loss Magnitude

### ISO 31000
- **Owner:** ISO
- **Scope:** Risk management principles and guidelines
- **Used by:** Govern (compliance-officer)
- **Process:** Establish context, Risk identification, Risk analysis, Risk evaluation, Risk treatment

---

## Compliance Frameworks

### SOC 2
- **Owner:** AICPA
- **Scope:** Service organization controls
- **Used by:** Govern (compliance-officer)
- **Trust Service Criteria:** Security (CC), Availability, Processing Integrity, Confidentiality, Privacy

### ISO/IEC 27001:2022
- **Owner:** ISO/IEC
- **Scope:** Information Security Management System (ISMS)
- **Used by:** Govern (compliance-officer)
- **Structure:** 10 clauses + Annex A (93 controls in 4 themes)

### GDPR (General Data Protection Regulation)
- **Owner:** European Union
- **Scope:** Data protection and privacy (EU residents)
- **Used by:** Govern (compliance-officer)
- **Key articles:** 5 (principles), 6 (legal bases), 15-22 (data subject rights), 33-34 (breach notification)

### LGPD (Lei Geral de Protecao de Dados)
- **Owner:** Brazil
- **Scope:** Data protection (Brazil)
- **Used by:** Govern (compliance-officer)
- **Key articles:** 7 (legal bases), 11 (sensitive data), 18 (data subject rights), 48 (breach notification)

### HIPAA
- **Owner:** US Department of Health and Human Services
- **Scope:** Protected Health Information (PHI) security
- **Used by:** Govern (compliance-officer)
- **Rules:** Privacy Rule, Security Rule (Administrative, Physical, Technical safeguards), Breach Notification Rule

### PCI DSS v4.0
- **Owner:** PCI Security Standards Council
- **Scope:** Payment card data security
- **Used by:** Govern (compliance-officer)
- **Requirements:** 12 requirements in 6 goals

---

## Incident Response Frameworks

### NIST SP 800-61 Rev. 2
- **Owner:** NIST
- **Scope:** Computer Security Incident Handling Guide
- **Used by:** Rapid (incident-responder)
- **Phases:** Preparation, Detection & Analysis, Containment/Eradication/Recovery, Post-Incident Activity

### SANS Incident Response Process
- **Owner:** SANS Institute
- **Scope:** 6-step IR methodology
- **Used by:** Rapid (incident-responder)
- **Steps:** Preparation, Identification, Containment, Eradication, Recovery, Lessons Learned

---

## Cloud Security Frameworks

### CIS Benchmarks
- **Owner:** Center for Internet Security
- **Scope:** Cloud configuration hardening guides
- **Used by:** Nimbus (cloud-security-engineer)
- **Providers:** AWS, Azure, GCP, Kubernetes, Docker

### CSA Cloud Controls Matrix (CCM)
- **Owner:** Cloud Security Alliance
- **Scope:** Cloud-specific security controls
- **Used by:** Nimbus, Govern
- **Domains:** 17 control domains

### NIST SP 800-207 (Zero Trust Architecture)
- **Owner:** NIST
- **Scope:** Zero trust architecture principles
- **Used by:** Wire (network-security-engineer), Nimbus
- **Tenets:** 7 core zero trust tenets

---

## Detection Frameworks

### Sigma
- **Owner:** SigmaHQ community
- **Scope:** Generic SIEM detection rule format
- **Used by:** Sentinel (soc-analyst)
- **Format:** YAML with logsource, detection, and metadata fields
- **Portability:** Translatable to Splunk SPL, Elastic KQL, Sentinel KQL, etc.

### YARA
- **Owner:** VirusTotal/Google
- **Scope:** Pattern matching for malware and file analysis
- **Used by:** Sentinel (soc-analyst)
- **Format:** Rules with strings and conditions

### Snort/Suricata Rules
- **Owner:** Snort (Cisco) / Suricata (OISF)
- **Scope:** Network-level detection
- **Used by:** Sentinel, Wire
- **Format:** Action, protocol, source, destination, and rule options
