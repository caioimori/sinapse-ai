---
task: forensic-analysis-workflow
responsavel: "incident-responder"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: incident_context
    tipo: text
    origem: "incident-triage or user input"
    obrigatorio: true
  - campo: evidence_types
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: legal_hold
    tipo: boolean
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: forensic_workflow_document
    tipo: document
    destino: "IR team, legal, stakeholders"

Checklist:
  - "[ ] Establish chain of custody procedures"
  - "[ ] Define evidence collection methodology"
  - "[ ] Document analysis workflow per evidence type"
  - "[ ] Create timeline reconstruction process"
  - "[ ] Define reporting standards"
  - "[ ] Include legal admissibility requirements"
  - "[ ] Design evidence storage and retention"
  - "[ ] Validate with legal counsel"
---

# Task: Digital Forensics Workflow

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Rapid (incident-responder)
- **Complexity:** Complex

## Objective

Design a comprehensive digital forensics workflow that ensures evidence is collected, preserved, analyzed, and reported in a manner that maintains chain of custody and legal admissibility. The workflow covers disk, memory, network, cloud, and mobile evidence types.

> **LEGAL AND ETHICAL COMPLIANCE:** All forensic activities must comply with applicable laws, organizational policies, and evidence handling standards. Forensic analysis is performed only on systems and data the organization owns or has legal authority to examine. Legal counsel should review procedures before use in legal proceedings.

## Pre-Conditions

- Incident confirmed and requiring forensic investigation
- Legal counsel consulted on evidence requirements
- Forensic tools and infrastructure available
- Chain of custody forms and procedures ready
- Trained forensic analyst available

## Inputs

- Incident context (type, scope, affected systems)
- Evidence types to collect (disk, memory, network, cloud, mobile)
- Legal hold status (whether evidence may be needed for litigation)
- Timeline of known events
- Systems and accounts involved

## Steps

### 1. Establish Legal Framework
Before any evidence handling:
- Confirm legal authority to examine evidence
- Determine if legal hold is required
- Identify applicable laws and regulations
- Confirm whether evidence may be used in legal proceedings
- Document the authorization and scope of forensic investigation

### 2. Define Chain of Custody Procedures
```yaml
chain_of_custody:
  evidence_id: ""
  description: ""
  collected_by: ""
  date_time: ""
  location: ""
  hash_md5: ""
  hash_sha256: ""
  storage_location: ""
  transfers:
    - from: ""
      to: ""
      date: ""
      reason: ""
      signatures: ""
```

### 3. Evidence Collection — Volatile Data
Collect in order of volatility (most volatile first):
| Priority | Evidence Type | Collection Method | Tool |
|----------|-------------|-------------------|------|
| 1 | Running processes | Process dump | Volatility, pslist |
| 2 | Network connections | Netstat capture | netstat, ss |
| 3 | Memory | Full RAM dump | FTK Imager, LiME |
| 4 | Logged-in users | Session capture | who, query user |
| 5 | System time | Clock verification | w32tm, ntpq |
| 6 | Open files | Handle enumeration | lsof, handle |

### 4. Evidence Collection — Non-Volatile Data
Collect persistent evidence:
| Evidence Type | Collection Method | Verification |
|-------------|-------------------|-------------|
| Disk image | Bit-for-bit copy (dd, FTK) | Hash verification |
| Log files | Secure copy with timestamps | Hash verification |
| Registry hives | Export or image | Hash verification |
| Configuration files | Secure copy | Hash verification |
| Email data | PST/OST export or server copy | Hash verification |

### 5. Evidence Collection — Cloud and SaaS
Collect cloud-native evidence:
- Cloud audit logs (CloudTrail, Azure Activity Log, GCP Audit)
- Cloud storage snapshots
- Container images and logs
- SaaS application logs and user activity
- API access logs
- Identity provider logs

### 6. Evidence Analysis — Filesystem
Analyze disk evidence:
- Timeline analysis (MFT, file timestamps)
- Deleted file recovery
- Artifact analysis (prefetch, shellbags, recent docs)
- Malware identification and extraction
- User activity reconstruction
- Registry analysis (persistence, execution, USB)

### 7. Evidence Analysis — Memory
Analyze memory evidence:
- Process analysis (running, hidden, injected)
- Network connection reconstruction
- Code injection detection
- Credential extraction (for scope assessment)
- Malware unpacking and analysis
- Command history recovery

### 8. Evidence Analysis — Network
Analyze network evidence:
- PCAP analysis for data exfiltration
- DNS query reconstruction
- C2 communication identification
- Lateral movement detection
- Timeline of network activity
- Protocol analysis

### 9. Timeline Reconstruction
Build a unified timeline from all evidence sources:
```yaml
forensic_timeline:
  - timestamp: ""
    source: ""
    event: ""
    artifact: ""
    significance: ""
    confidence: "[high/medium/low]"
```

### 10. Report Production
Create a forensic report suitable for the intended audience:

**Executive Summary:** Non-technical overview of findings
**Detailed Findings:** Technical analysis with evidence references
**Timeline:** Chronological reconstruction of events
**Conclusions:** Analyst conclusions with confidence levels
**Appendices:** Evidence inventory, chain of custody, tool output

## Output

```yaml
forensic_workflow:
  incident_id: ""
  date: ""
  author: "Rapid (incident-responder)"

  legal_framework:
    authority: ""
    legal_hold: false
    counsel_consulted: false

  evidence_inventory:
    - id: ""
      type: ""
      source: ""
      hash: ""
      chain_of_custody: ""

  analysis_findings:
    - finding: ""
      evidence_reference: ""
      confidence: ""
      significance: ""

  timeline: []

  conclusions:
    root_cause: ""
    scope_of_compromise: ""
    data_affected: ""
    confidence_level: ""

  recommendations: []
```

## Quality Criteria

- [ ] Legal authority confirmed before evidence collection
- [ ] Chain of custody maintained for all evidence
- [ ] All evidence hashed at collection time (MD5 + SHA256)
- [ ] Volatile evidence collected before non-volatile
- [ ] Analysis findings reference specific evidence
- [ ] Timeline reconstructed from multiple sources
- [ ] Conclusions include confidence levels
- [ ] Report suitable for legal proceedings (if required)
