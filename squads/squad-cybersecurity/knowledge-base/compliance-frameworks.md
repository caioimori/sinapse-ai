# Compliance Frameworks Reference

## Purpose

Deep reference for LGPD, ISO 27001, SOC 2, and PCI DSS — requirements, implementation guidance, and decision-making support. Used by Govern (compliance-officer) for gap assessments, policy work, and remediation planning.

---

## LGPD — Lei Geral de Proteção de Dados

### Overview

- **Law:** Lei 13.709/2018
- **Effective:** August 2020
- **Enforced by:** ANPD (Autoridade Nacional de Proteção de Dados)
- **Scope:** Applies to any processing of personal data of individuals in Brazil, regardless of where the processor is located
- **Model:** Based heavily on EU GDPR but with Brazilian context

**Critical 2025 Update:** The ANPD became an **independent regulatory agency** in 2025 via Medida Provisória 1.317/2025, giving it full autonomy. This significantly increases enforcement capacity and risk of penalties.

### LGPD vs. GDPR — Key Differences

| Aspect | LGPD | GDPR |
|--------|------|------|
| Data residency | Not explicitly required | Not explicitly required |
| International transfers | SCCs required (from Aug 2025) | SCCs or adequacy decision |
| DPO mandatory? | Yes (Encarregado) | Yes for certain controllers |
| Right to explanation (AI) | Article 20 | Article 22 |
| Penalties | Up to 2% of revenue in Brazil, max R$ 50M | Up to 4% of global revenue |
| Children's data | Article 14 — special protection | Article 8 GDPR |
| Legal age for consent | 18 (children need parental consent) | 16 (member state variation) |

### Key Articles — Technical Implementation

| Article | Requirement | Technical Implementation |
|---------|-------------|------------------------|
| **Art. 7-8** | Lawful basis for processing — consent must be explicit | Opt-in forms (never pre-checked), granular consent per purpose |
| **Art. 9** | Transparency — inform data subjects | Privacy policy, accessible and plain language |
| **Art. 11** | Sensitive data special protection | Extra security controls for health, biometric, political, religious data |
| **Art. 14** | Children's data | Parental consent mechanism, age verification |
| **Art. 18** | Data subject rights | Portal: access, correction, deletion, portability, revoke consent |
| **Art. 20** | Automated decision-making | Ability to request human review of algorithmic decisions |
| **Art. 33** | International data transfers | SCCs required (grace period ended Aug 23, 2025) |
| **Art. 38** | RIPD (DPIA) | Data Protection Impact Assessment for high-risk processing |
| **Art. 41** | DPO (Encarregado) | Designate and publish contact; ANPD registration if required |
| **Art. 46** | Security measures | Encryption, access control, RLS, incident procedures |
| **Art. 48** | Breach notification | 3 business days to ANPD + data subjects |

### LGPD Technical Checklist

```
Consent Management
[ ] Opt-in forms with explicit, specific consent (not pre-checked)
[ ] Separate consent per processing purpose
[ ] Consent withdrawal mechanism as easy as giving consent
[ ] Consent records stored with timestamp and mechanism

Data Subject Rights Portal
[ ] Data export endpoint (download my data)
[ ] Data correction form or interface
[ ] Account/data deletion mechanism
[ ] Consent revocation mechanism
[ ] Response within 15 days (LGPD Art. 19)

DPO (Encarregado)
[ ] Designated DPO with name and contact published on website
[ ] DPO contactable for data subject requests
[ ] ANPD registration if organization qualifies

Technical Security (Art. 46)
[ ] TLS 1.2+ on all data transmission
[ ] Encryption at rest for personal data
[ ] Access control with least privilege
[ ] Audit logging for personal data access
[ ] RLS policies in database

Breach Response (Art. 48)
[ ] Incident detection capability
[ ] Breach notification procedure documented
[ ] ANPD contact and form known
[ ] Data subjects notification template ready
[ ] 3 business day timeline enforced

International Transfers (Art. 33, since Aug 2025)
[ ] Standard Contractual Clauses (SCCs) executed with all vendors
[ ] Data processing agreements with international processors
[ ] Transfer impact assessments for high-risk destinations
```

### ANPD Enforcement Priorities 2025-2026

Based on ANPD public statements:
1. **Children's data** — apps used by minors, parental consent, age verification
2. **AI and biometric data** — facial recognition, automated profiling
3. **Data scraping** — web scraping of personal data without consent
4. **Health data** — medical records, health apps

Organizations in these sectors should expect active inspections.

---

## ISO/IEC 27001:2022

### Overview

- **Standard:** ISO/IEC 27001:2022 (latest revision — 93 controls vs. 114 in 2013 version)
- **Result:** Certification (audited by accredited certification body)
- **Scope:** Information Security Management System (ISMS)
- **Approach:** Risk-based — implement controls proportional to identified risks
- **Timeline:** 6-18 months for initial certification
- **Cost:** $30,000–$200,000+ depending on organization size

### The 4 Control Themes (Annex A, 2022 revision)

| Theme | Controls | Coverage |
|-------|----------|---------|
| **Organizational** | 37 controls | Policies, risk management, supplier relationships, incident management |
| **People** | 8 controls | Screening, training, responsibilities, disciplinary process |
| **Physical** | 14 controls | Physical security, physical media, clean desk |
| **Technological** | 34 controls | Access control, cryptography, logging, vulnerability management |

### ISO 27001 Clauses (Mandatory)

| Clause | Requirement |
|--------|-------------|
| **4** | Understanding the organization — context, interested parties, ISMS scope |
| **5** | Leadership — top management commitment, policies |
| **6** | Planning — risk assessment, risk treatment, objectives |
| **7** | Support — resources, competence, awareness, communication, documentation |
| **8** | Operation — risk treatment implementation, supplier assessment |
| **9** | Performance evaluation — monitoring, internal audit, management review |
| **10** | Improvement — nonconformities, corrective action, continual improvement |

### New Controls in 2022 (not in 2013)

These 11 new controls reflect modern threats:
- Threat intelligence
- Information security for use of cloud services
- ICT readiness for business continuity
- Physical security monitoring
- Configuration management
- Information deletion
- Data masking
- Data leakage prevention
- Monitoring activities
- Web filtering
- Secure coding

---

## SOC 2 (Service Organization Controls 2)

### Overview

- **Standard:** AICPA Trust Services Criteria
- **Result:** Attestation report (not certification)
- **Scope:** Controls relevant to security, availability, processing integrity, confidentiality, privacy of service organizations
- **Timeline:** Type I: 2-3 months | Type II: 6-12 months (observation period)
- **Cost:** $20,000–$100,000+

### Type I vs. Type II

| Aspect | Type I | Type II |
|--------|--------|---------|
| What it says | Controls are suitably designed at a point in time | Controls operated effectively over a period (usually 6+ months) |
| Timeline | 2-3 months | 6-12 months (observation period required) |
| Value | Faster to achieve, good starting point | Higher assurance, preferred by enterprise buyers |
| When to get | Startup needing to close first enterprise deals | Established product with running controls |

### The 5 Trust Service Criteria

| Criterion | Abbreviation | Scope |
|-----------|-------------|-------|
| **Security** | CC (Common Criteria) | The baseline — every SOC 2 includes this |
| **Availability** | A | System available for operation as committed |
| **Processing Integrity** | PI | System processing is complete, accurate, timely |
| **Confidentiality** | C | Information designated as confidential is protected |
| **Privacy** | P | Personal information collected in accordance with privacy commitments |

Most SaaS startups pursue Security + Availability + Confidentiality initially.

### SOC 2 Common Criteria — Technical Controls

Key CC categories with technical implementation:

| CC Category | Examples of Evidence Needed |
|-------------|--------------------------|
| **CC6 — Logical and Physical Access** | MFA, access reviews, offboarding procedures, privileged access management |
| **CC7 — System Operations** | Monitoring, alert management, incident response, change management |
| **CC8 — Change Management** | Code review process, deployment approvals, environment separation |
| **CC9 — Risk Mitigation** | Vendor management, business continuity, encryption at rest and transit |

---

## PCI DSS v4.0

### Overview

- **Standard:** Payment Card Industry Data Security Standard v4.0
- **Effective:** March 2024 (v3.2.1 retired March 2024)
- **Scope:** Any organization that stores, processes, or transmits cardholder data
- **Managed by:** PCI Security Standards Council
- **Validation levels:** SAQ (Self-Assessment) for smaller merchants, QSA audit for larger

### 12 Requirements in 6 Goals

| Goal | Requirements |
|------|-------------|
| **Build and Maintain Secure Network** | R1: Firewalls; R2: No vendor defaults |
| **Protect Cardholder Data** | R3: Store data securely; R4: Encrypt transmission |
| **Vulnerability Management** | R5: Anti-malware; R6: Secure systems |
| **Access Control** | R7: Restrict access; R8: Identify and authenticate; R9: Physical access |
| **Monitor and Test** | R10: Log all access; R11: Test regularly |
| **Information Security Policy** | R12: Maintain policy |

### Scope Reduction Strategy

**Use a tokenization/hosted payment page to minimize scope:**
```
In scope (if you collect card data directly):
- All systems that process, store, or transmit card data
- All systems in the same network segment
- All administration systems for above

Minimal scope (using hosted payment fields / tokenization):
- Only your tokenization provider integration
- SAQ A is sufficient (lowest level — just questionnaire)
```

**Recommended approach for most web apps:** Use Stripe, Braintree, or Adyen hosted payment fields. Card data never touches your servers. Scope reduces to SAQ A.

---

## Compliance Comparison Matrix

| Aspect | LGPD | ISO 27001 | SOC 2 | PCI DSS |
|--------|------|-----------|-------|---------|
| **Focus** | Privacy | InfoSec management | Trust for service orgs | Payment card security |
| **Result** | Compliance (legal) | Certification | Attestation report | Certificate/Report |
| **Mandatory for** | Brazilian personal data | Voluntary (market-driven) | Enterprise B2B customers | Card processing |
| **Geographic focus** | Brazil | Global | North America primary | Global |
| **Timeline** | Ongoing | 6-18 months | 2-12 months | Variable |
| **Overlap with others** | ~40% with GDPR | ~70% with SOC 2 | ~70% with ISO 27001 | — |

### When to Pursue Which

| Situation | Recommendation |
|-----------|---------------|
| Any Brazilian personal data | LGPD is mandatory — not optional |
| Selling B2B SaaS to US companies | SOC 2 Type I first — reduces friction in deals |
| Selling globally or to European enterprises | ISO 27001 — globally recognized |
| Processing payments | PCI DSS scope reduction (tokenization), then SAQ A |
| Early-stage startup | Start with LGPD + SOC 2 Type I |
| Scaling to enterprise | Add ISO 27001, then SOC 2 Type II |

### Overlap Efficiency

ISO 27001 and SOC 2 have ~70% control overlap. Pursuing both simultaneously is ~30% more efficient than sequential implementation:
- Same policies serve both
- Same control evidence collected once
- Same training program covers both
- Auditors can often share work product

---

## Sources

- LGPD full text: http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm
- ANPD official: https://www.gov.br/anpd/pt-br
- ISO 27001:2022: https://www.iso.org/standard/27001
- AICPA SOC 2: https://www.aicpa-cima.com/resources/article/soc-2-engagements
- PCI DSS v4.0: https://www.pcisecuritystandards.org/
- ICLG Brazil Data Protection 2025-2026: https://iclg.com/practice-areas/data-protection-laws-and-regulations/brazil
