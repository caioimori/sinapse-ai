---
task: threat-landscape-report
responsavel: "threat-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: industry
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: organization_profile
    tipo: text
    origem: "user input"
    obrigatorio: false
  - campo: time_period
    tipo: text
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: threat_landscape_report
    tipo: document
    destino: "stakeholders, cyber-orqx"

Checklist:
  - "[ ] Identify industry-specific threat actors"
  - "[ ] Map active campaigns and TTPs"
  - "[ ] Analyze emerging threat trends"
  - "[ ] Assess geopolitical threat factors"
  - "[ ] Produce prioritized risk summary"
  - "[ ] Include actionable defensive recommendations"
---

# Task: Threat Landscape Report

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Shield (threat-analyst)
- **Complexity:** Complex

## Objective

Produce a comprehensive threat landscape analysis for a specific industry or organization, identifying active threat actors, current campaigns, emerging trends, and prioritized defensive recommendations. This report enables proactive security posture adjustments based on real-world threat intelligence.

> **DEFENSIVE USE ONLY:** This analysis is conducted to strengthen defensive posture. All intelligence is sourced from public threat intelligence feeds, vendor reports, and open-source intelligence (OSINT) within legal and ethical boundaries.

## Pre-Conditions

- Industry or sector clearly defined
- Access to threat intelligence sources (OSINT, vendor reports, ISAC feeds)
- Understanding of the organization's technology stack and attack surface
- Authorization from stakeholders to conduct the analysis

## Inputs

- Target industry/sector (e.g., financial services, healthcare, SaaS)
- Organization profile (size, geography, technology stack)
- Time period for analysis (default: last 90 days)
- Previous threat landscape reports (if available)
- Known active incidents or concerns

## Steps

### 1. Define Scope and Intelligence Requirements
Establish the boundaries of the analysis — industry, geography, organization size, and specific intelligence requirements. Define Priority Intelligence Requirements (PIRs) that align with business objectives.

### 2. Identify Relevant Threat Actors
Research and catalog threat actors known to target the specified industry:
- **Nation-state APTs** — Identify state-sponsored groups with history of targeting this sector
- **Cybercrime groups** — Ransomware operators, initial access brokers, data theft rings
- **Hacktivists** — Ideologically motivated groups with sector interest
- **Insider threats** — Common insider threat patterns for the industry

### 3. Map Active Campaigns and TTPs
For each identified threat actor, document:
| Actor | Motivation | TTPs (MITRE ATT&CK) | Active Campaigns | Target Profile |
|-------|-----------|---------------------|-----------------|---------------|

### 4. Analyze Attack Vectors and Trends
Identify the most prevalent attack vectors for the sector:
- Initial access methods (phishing, exploitation, supply chain)
- Lateral movement techniques
- Data exfiltration patterns
- Emerging attack techniques (AI-assisted, novel exploits)

### 5. Assess Vulnerability Landscape
Review recently disclosed vulnerabilities relevant to common technology stacks in the industry. Cross-reference with known exploitation in the wild (KEV catalog, vendor advisories).

### 6. Evaluate Geopolitical and Regulatory Context
Consider geopolitical events that may influence threat activity — sanctions, conflicts, elections, regulatory changes that create new compliance-driven attack surfaces.

### 7. Conduct Trend Analysis
Compare current threat data with historical baselines:
- Attack volume trends
- Shifting TTPs
- New threat actor emergence
- Changes in targeting patterns

### 8. Develop Risk Prioritization Matrix
Score identified threats against organizational relevance:
| Threat | Likelihood | Impact | Organizational Relevance | Priority |
|--------|-----------|--------|------------------------|----------|

### 9. Formulate Defensive Recommendations
For each high-priority threat, provide specific, actionable defensive recommendations:
- Detection rules to implement
- Controls to strengthen
- Monitoring to enhance
- Policies to update

### 10. Compile and Deliver Report
Assemble the final threat landscape report with executive summary, detailed findings, and appendices. Include confidence levels for all assessments.

## Output

```yaml
threat_landscape_report:
  industry: ""
  period: ""
  date_produced: ""

  executive_summary: ""

  threat_actors:
    - name: ""
      type: "[apt/cybercrime/hacktivist/insider]"
      motivation: ""
      ttps: []
      relevance: "[high/medium/low]"

  active_campaigns:
    - campaign: ""
      actor: ""
      targets: ""
      status: "[active/emerging/declining]"

  top_risks:
    - risk: ""
      likelihood: ""
      impact: ""
      priority: "[critical/high/medium/low]"

  recommendations:
    - action: ""
      addresses: ""
      effort: "[low/medium/high]"
      urgency: "[immediate/short-term/long-term]"

  confidence_level: "[high/medium/low]"
```

## Quality Criteria

- [ ] Minimum 5 relevant threat actors identified and profiled
- [ ] All threat actors mapped to MITRE ATT&CK TTPs
- [ ] Active campaigns documented with evidence sources
- [ ] Risk prioritization includes organizational context
- [ ] Recommendations are specific and actionable (not generic)
- [ ] Confidence levels stated for all assessments
- [ ] Executive summary suitable for non-technical leadership
- [ ] Sources cited for all intelligence claims
