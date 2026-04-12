---
task: security-policy-creation
responsavel: "compliance-officer"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: policy_type
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["information-security", "acceptable-use", "access-control", "incident-response", "data-protection", "remote-work", "vendor-management", "full-suite"]
  - campo: compliance_frameworks
    tipo: list
    origem: "user input"
    obrigatorio: false
  - campo: organization_size
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["startup", "smb", "enterprise"]

Saida:
  - campo: security_policies
    tipo: document
    destino: "stakeholders, all-agents"

Checklist:
  - "[ ] Assess organization's policy needs"
  - "[ ] Select appropriate policy framework"
  - "[ ] Draft policies with organization context"
  - "[ ] Align to compliance requirements"
  - "[ ] Include enforcement and exception procedures"
  - "[ ] Create supporting standards and procedures"
  - "[ ] Plan review and approval cycle"
  - "[ ] Design communication and training plan"
---

# Task: Security Policy Creation

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Govern (compliance-officer)
- **Complexity:** Complex

## Objective

Create comprehensive security policies from scratch, tailored to the organization's size, industry, and compliance requirements. Policies provide the governance foundation for the entire security program and must be practical, enforceable, and aligned with business objectives.

## Pre-Conditions

- Organization profile and industry understood
- Compliance requirements identified
- Executive sponsorship for security program
- Understanding of current security maturity
- Legal review available for policy approval

## Inputs

- Policy type(s) to create
- Applicable compliance frameworks (SOC 2, ISO 27001, HIPAA, PCI DSS, GDPR)
- Organization size (startup, SMB, enterprise)
- Industry-specific requirements
- Existing policies (if any, for gap analysis)

## Steps

### 1. Assess Policy Needs
Determine required policies based on compliance and business needs:
| Policy | SOC 2 | ISO 27001 | HIPAA | PCI DSS | Priority |
|--------|-------|-----------|-------|---------|----------|
| Information Security | Required | Required | Required | Required | P1 |
| Acceptable Use | Required | A.5.10 | Recommended | Required | P1 |
| Access Control | Required | A.5.15-18 | 164.312(a) | 7.1-7.3 | P1 |
| Incident Response | Required | A.5.24-28 | 164.308(a)(6) | 12.10 | P1 |
| Data Classification | Required | A.5.12-13 | Required | 9.6 | P2 |
| Remote Work | Recommended | A.6.7 | Recommended | — | P2 |
| Vendor Management | Required | A.5.19-22 | Required | 12.8 | P2 |
| Change Management | Required | A.8.32 | Required | 6.4 | P2 |
| Encryption | Required | A.8.24 | 164.312(a)(2) | 3.4, 4.1 | P2 |

### 2. Define Policy Framework Structure
Establish a consistent hierarchy:
```
Policy (what and why) → Approved by executive
  ↓
Standard (specific requirements) → Approved by CISO
  ↓
Procedure (how to do it) → Approved by team lead
  ↓
Guideline (recommendations) → Informational
```

### 3. Draft Information Security Policy
The master policy that governs all others:
- Purpose and scope
- Information security objectives
- Roles and responsibilities
- Risk management approach
- Compliance requirements
- Policy enforcement
- Exception process
- Review cycle

### 4. Draft Operational Policies
For each required policy, include:
| Section | Content |
|---------|---------|
| Purpose | Why this policy exists |
| Scope | Who and what it covers |
| Policy Statements | Clear, enforceable requirements |
| Roles & Responsibilities | Who does what |
| Compliance | How compliance is measured |
| Enforcement | Consequences of non-compliance |
| Exceptions | How to request exceptions |
| Definitions | Key terms |
| Related Policies | Cross-references |
| Revision History | Version tracking |

### 5. Align to Compliance Frameworks
Map each policy statement to compliance controls:
| Policy Statement | SOC 2 Ref | ISO 27001 Ref | Compliance Status |
|-----------------|-----------|--------------|-------------------|
| "All users must use MFA" | CC6.1 | A.8.5 | Compliant |
| "Data must be encrypted at rest" | CC6.1 | A.8.24 | Partial |

### 6. Define Enforcement and Exception Procedures
Create practical enforcement:
- Violation severity classification
- Progressive discipline approach
- Exception request process
- Exception approval authority
- Exception tracking and review
- Time-limited exceptions only

### 7. Create Supporting Standards and Procedures
For each policy, develop operational guidance:

**Example for Access Control Policy:**
- Standard: Password length >= 14 characters, MFA required
- Procedure: How to request access, approval workflow
- Guideline: Password manager recommendations

### 8. Plan Review and Approval Cycle
Define governance:
| Activity | Frequency | Responsible | Approver |
|----------|-----------|------------|---------|
| Policy review | Annual | Policy owner | CISO |
| Major updates | As needed | Policy owner | Executive |
| New policy creation | As needed | Security team | CISO + Legal |
| Exception review | Quarterly | CISO | Risk committee |

### 9. Design Communication and Training Plan
Ensure policies are known and understood:
| Audience | Communication | Training | Acknowledgment |
|----------|-------------|---------|---------------|
| All employees | Email + intranet | Annual security training | Digital signature |
| IT staff | Team meeting | Role-specific training | Signed acknowledgment |
| Executives | Board presentation | Executive briefing | Meeting minutes |
| New hires | Onboarding | Day-1 security training | HR onboarding checklist |

### 10. Finalize and Publish
Complete the policy package:
- Final legal review
- Executive approval signatures
- Version control setup
- Publication on policy portal
- Acknowledgment tracking system
- Calendar reminders for review dates

## Output

```yaml
security_policies:
  date: ""
  author: "Govern (compliance-officer)"
  organization: ""

  policies_created:
    - name: ""
      type: ""
      version: ""
      compliance_mapping: []
      approval_status: ""
      review_date: ""

  standards_created: []
  procedures_created: []

  governance:
    review_cycle: ""
    exception_process: ""
    enforcement_model: ""

  communication_plan: {}
  training_requirements: []
```

## Quality Criteria

- [ ] Policies cover all compliance-required areas
- [ ] Each policy mapped to compliance framework controls
- [ ] Policies are practical and enforceable (not just aspirational)
- [ ] Exception process defined and practical
- [ ] Supporting standards and procedures created
- [ ] Legal review included in approval process
- [ ] Communication and training plan defined
- [ ] Review cycle and versioning established
