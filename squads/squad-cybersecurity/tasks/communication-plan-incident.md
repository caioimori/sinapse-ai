---
task: communication-plan-incident
responsavel: "incident-responder"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: incident_severity
    tipo: enum
    origem: "incident-triage or user input"
    obrigatorio: true
    valores: ["SEV-1", "SEV-2", "SEV-3", "SEV-4"]
  - campo: stakeholders
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: regulatory_requirements
    tipo: list
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: communication_plan
    tipo: document
    destino: "IR team, communications, legal, stakeholders"

Checklist:
  - "[ ] Identify all communication audiences"
  - "[ ] Define communication channels per audience"
  - "[ ] Create message templates per severity"
  - "[ ] Establish approval workflows"
  - "[ ] Document regulatory notification requirements"
  - "[ ] Plan media response strategy"
  - "[ ] Design status update cadence"
  - "[ ] Validate with legal and communications"
---

# Task: Crisis Communication Plan for Security Incidents

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Rapid (incident-responder)
- **Complexity:** Standard

## Objective

Create a crisis communication plan for security incidents that defines who communicates what, to whom, when, and through which channels. The plan ensures consistent, timely, and legally appropriate communication during incidents while preserving investigation integrity.

> **CONFIDENTIALITY WARNING:** Incident communication plans contain sensitive procedures and contact information. Distribution should be limited to authorized personnel. Premature or inaccurate public disclosure can cause significant harm.

## Pre-Conditions

- Incident response plan exists
- Legal counsel available for review
- Communications/PR team identified
- Executive sponsor designated
- Regulatory notification requirements understood

## Inputs

- Incident severity level (SEV-1 through SEV-4)
- Stakeholder list (internal and external)
- Regulatory notification requirements
- Organization's brand/communications guidelines
- Previous incident communication experiences

## Steps

### 1. Map Communication Audiences
Identify all audiences who may need to be informed:

| Audience | When Notified | Who Communicates | Channel |
|----------|-------------|-----------------|---------|
| IR Team | Immediately | IR Lead | Secure chat + phone |
| IT Operations | Immediately | IR Lead | Secure chat |
| Executive Team | Within 1h (SEV-1) | IR Lead/CISO | Phone + email |
| Legal Counsel | Within 1h (SEV-1/2) | IR Lead | Phone |
| Board of Directors | Within 24h (SEV-1) | CISO/CEO | Secure brief |
| Employees | As needed | HR/Comms | Internal comms |
| Customers | Per legal guidance | Comms team | Email/portal |
| Regulators | Per compliance req | Legal | Official channels |
| Media | If contacted | PR/Comms | Prepared statement |
| Partners/Vendors | If affected | Account managers | Phone + email |
| Law Enforcement | If criminal activity | Legal | Official channels |

### 2. Create Internal Communication Templates
Draft templates for internal audiences:

**Initial Notification (SEV-1/2):**
```
SECURITY INCIDENT NOTIFICATION — [SEVERITY]
Time: [timestamp]
Status: [Active/Contained/Resolved]
Summary: [Brief factual description]
Impact: [Known impact]
Actions Taken: [Current response actions]
Your Role: [What the recipient should do]
Next Update: [When to expect the next update]
Contact: [IR Lead contact for questions]
CONFIDENTIAL — Do not share outside authorized personnel
```

**Status Update Template:**
```
INCIDENT UPDATE #[N] — [SEVERITY]
Time: [timestamp]
Status Change: [What changed since last update]
Current Status: [Overall status]
Impact Update: [Updated impact assessment]
Actions: [Actions taken since last update]
Next Steps: [Planned actions]
Next Update: [When]
```

### 3. Create External Communication Templates
Draft templates for external audiences (requires legal review):

**Customer Notification:**
- What happened (factual, no speculation)
- What data was affected (if known)
- What we are doing about it
- What customers should do
- Where to get more information
- Apology and commitment to improvement

**Regulatory Notification:**
- Organization identification
- Nature of the incident
- Data categories affected
- Number of individuals affected (if applicable)
- Measures taken and proposed
- Contact point for the authority

### 4. Define Approval Workflows
Establish who must approve communications before release:

| Communication Type | Draft By | Reviewed By | Approved By |
|-------------------|----------|-------------|-------------|
| Internal — IR team | IR Lead | — | IR Lead |
| Internal — executives | CISO | Legal | CEO |
| Internal — all employees | Comms | Legal, HR | CISO |
| External — customers | Comms | Legal, CISO | CEO |
| External — regulators | Legal | CISO | CEO |
| External — media | PR | Legal, CISO | CEO |

### 5. Establish Update Cadence
Define how frequently updates are provided:

| Severity | Internal Updates | Executive Updates | External Updates |
|----------|-----------------|-------------------|-----------------|
| SEV-1 | Every 2 hours | Every 4 hours | Per legal guidance |
| SEV-2 | Every 4 hours | Daily | If needed |
| SEV-3 | Daily | Weekly | Unlikely |
| SEV-4 | As needed | As needed | No |

### 6. Design Media Response Strategy
Prepare for media inquiries:
- Designated spokesperson (trained in crisis communications)
- Holding statement (ready before any incident)
- Q&A document with anticipated questions
- Social media monitoring and response plan
- "No comment" alternatives that maintain credibility

### 7. Define Information Security During Communication
Protect investigation integrity:
- What information can be shared at each stage
- What must NOT be disclosed (investigation details, attribution)
- Secure communication channels for incident discussions
- Information classification for incident documents
- Restrictions on social media by employees

### 8. Document Regulatory Notification Timelines
Create a compliance checklist:
| Regulation | Trigger | Deadline | Recipient | Required Info |
|-----------|---------|----------|-----------|--------------|
| GDPR | Personal data breach | 72 hours | DPA | Per Article 33 |
| HIPAA | PHI breach | 60 days | HHS/OCR | Per Breach Rule |
| PCI DSS | Card data compromise | Immediate | Acquirer, brands | Per PCI IR |
| SEC (if public) | Material cybersecurity incident | 4 business days | SEC | Form 8-K |

### 9. Create Communication Toolkit
Assemble ready-to-use resources:
- Contact list (internal and external, with backups)
- Template library (all message types)
- Approval workflow chart
- Regulatory notification checklist
- Media holding statement
- FAQ document (updateable)
- Secure communication channel setup guide

### 10. Test and Validate
Validate the communication plan:
- Include communication as a component of tabletop exercises
- Test notification chains (can you reach everyone in 1 hour?)
- Verify secure communication channels work
- Review with legal counsel annually
- Update after every significant incident

## Output

```yaml
communication_plan:
  date: ""
  author: "Rapid (incident-responder)"

  audiences: []
  templates:
    internal: []
    external: []
  approval_workflows: []
  update_cadence: {}
  regulatory_notifications: []
  media_strategy: {}
  toolkit_contents: []
```

## Quality Criteria

- [ ] All communication audiences identified with channels
- [ ] Templates created for each audience and severity
- [ ] Approval workflows defined and practical
- [ ] Regulatory notification requirements documented with deadlines
- [ ] Media response strategy includes trained spokesperson
- [ ] Information security controls during communication defined
- [ ] Communication plan tested in exercises
- [ ] Legal counsel has reviewed all external templates
