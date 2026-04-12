---
task: threat-intelligence-feed-setup
responsavel: "threat-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_profile
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: existing_tools
    tipo: list
    origem: "user input"
    obrigatorio: false
  - campo: budget_tier
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["free-only", "moderate", "enterprise"]

Saida:
  - campo: ti_feed_plan
    tipo: document
    destino: "soc-analyst, cyber-orqx"

Checklist:
  - "[ ] Assess intelligence requirements"
  - "[ ] Select appropriate feed sources"
  - "[ ] Define ingestion architecture"
  - "[ ] Configure feed normalization"
  - "[ ] Establish enrichment pipeline"
  - "[ ] Define retention and sharing policies"
---

# Task: Threat Intelligence Feed Setup

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Shield (threat-analyst)
- **Complexity:** Standard

## Objective

Design and configure a threat intelligence feed infrastructure that aggregates, normalizes, and enriches indicators of compromise (IOCs) and tactical intelligence from multiple sources. Enable automated correlation with internal security events.

> **DEFENSIVE USE ONLY:** Threat intelligence feeds are consumed exclusively for defensive detection, hunting, and situational awareness. All feeds must be sourced from legitimate, authorized providers.

## Pre-Conditions

- Organization's industry and threat profile defined
- SIEM or security platform available for feed ingestion
- Understanding of current detection capabilities
- Budget parameters for commercial feeds (if applicable)

## Inputs

- Organization profile (industry, size, technology stack)
- Existing security tooling (SIEM, SOAR, EDR)
- Budget tier (free-only, moderate, enterprise)
- Priority Intelligence Requirements (PIRs)
- Compliance requirements for data handling

## Steps

### 1. Define Intelligence Requirements
Map business objectives to intelligence needs:
| PIR | Threat Category | Required IOC Types | Timeliness |
|-----|----------------|-------------------|-----------|
| Detect ransomware campaigns | Cybercrime | IPs, domains, hashes, TTPs | Real-time |
| Monitor supply chain risks | APT/Supply chain | CVEs, vendor advisories | Daily |
| Track industry-specific threats | Sector-specific | Actor profiles, campaigns | Weekly |

### 2. Select Feed Sources
Curate feeds based on requirements and budget:

**Free/Open Sources:**
- MISP communities (sector-specific ISACs)
- AlienVault OTX
- Abuse.ch (URLhaus, MalwareBazaar, ThreatFox)
- CISA KEV catalog
- PhishTank

**Commercial Sources (if budget allows):**
- Recorded Future, Mandiant, CrowdStrike
- Industry-specific ISAC premium feeds
- Vendor-specific threat feeds (firewall, EDR)

### 3. Design Ingestion Architecture
Define how feeds flow into the security stack:
```
Sources → Collector → Normalizer → Enricher → SIEM/SOAR
                                      ↓
                                  TIP (Threat Intel Platform)
```

### 4. Configure Feed Normalization
Standardize all feeds to a common format:
- Adopt STIX 2.1 as the canonical format
- Map vendor-specific formats to STIX objects
- Normalize confidence scores to a unified scale (0-100)
- Deduplicate indicators across sources

### 5. Implement Enrichment Pipeline
Enrich raw IOCs with additional context:
- GeoIP data for IP indicators
- WHOIS data for domain indicators
- Malware family classification for hash indicators
- MITRE ATT&CK technique mapping
- Historical sighting data

### 6. Configure Automated Correlation
Set up automated matching of feed indicators against internal telemetry:
- SIEM correlation rules for IOC matches
- EDR watchlists for file hashes
- Firewall/proxy block lists for malicious IPs/domains
- Email gateway rules for phishing indicators

### 7. Define Scoring and Prioritization
Establish scoring criteria to avoid alert fatigue:
| Factor | Weight | Description |
|--------|--------|------------|
| Source reliability | 30% | Track record of the feed |
| Indicator freshness | 25% | Age of the indicator |
| Relevance | 25% | Match to organization's attack surface |
| Confidence | 20% | Source's stated confidence level |

### 8. Establish Retention and Sharing Policies
Define data lifecycle:
- IOC retention periods by type (IPs: 30 days, hashes: 90 days, TTPs: 1 year)
- Traffic Light Protocol (TLP) compliance for shared intelligence
- Data sharing agreements with ISACs and partners
- GDPR/privacy considerations for PII in feeds

### 9. Create Operational Procedures
Document procedures for the SOC team:
- Feed health monitoring and alerting
- False positive handling and feed quality tracking
- Escalation procedures for high-confidence matches
- Feed review cadence (monthly quality assessment)

### 10. Test and Validate
Validate the complete pipeline:
- Inject known-good test indicators
- Verify correlation with synthetic events
- Measure end-to-end latency
- Confirm alerting and escalation paths work

## Output

```yaml
ti_feed_setup:
  organization: ""
  date: ""

  feeds_configured:
    - name: ""
      type: "[osint/commercial/isac/vendor]"
      format: ""
      refresh_rate: ""
      ioc_types: []
      cost: ""

  architecture:
    collector: ""
    normalizer: ""
    enricher: ""
    tip: ""
    siem_integration: ""

  correlation_rules: []
  scoring_weights: {}
  retention_policy: {}

  validation_results:
    feeds_active: 0
    latency_p95: ""
    test_indicators_matched: true
```

## Quality Criteria

- [ ] Intelligence requirements mapped to business objectives
- [ ] Minimum 5 feed sources configured and validated
- [ ] Normalization pipeline producing STIX 2.1 output
- [ ] Enrichment pipeline operational
- [ ] Automated correlation with SIEM verified
- [ ] Scoring and prioritization criteria documented
- [ ] Retention and TLP policies defined
- [ ] SOC operational procedures documented
