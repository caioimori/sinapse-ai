---
task: social-engineering-assessment
responsavel: "penetration-tester"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_name
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: authorization
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: assessment_type
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["awareness-audit", "phishing-simulation", "pretexting-review", "full-assessment"]

Saida:
  - campo: se_assessment_report
    tipo: document
    destino: "stakeholders, HR, cyber-orqx"

Checklist:
  - "[ ] Verify authorization and legal review"
  - "[ ] Define assessment scope and boundaries"
  - "[ ] Evaluate current awareness program"
  - "[ ] Design assessment scenarios"
  - "[ ] Assess organizational exposure"
  - "[ ] Analyze results with empathy"
  - "[ ] Provide training recommendations"
  - "[ ] Produce blameless report"
---

# Task: Social Engineering Awareness Assessment

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Breach (penetration-tester)
- **Complexity:** Standard

## Objective

Assess the organization's resilience to social engineering attacks by evaluating security awareness programs, identifying human-factor vulnerabilities, and designing improvement recommendations. This is an awareness-focused assessment, not an adversarial attack.

> **ETHICAL AND AUTHORIZED USE ONLY:** This assessment is designed to IMPROVE organizational awareness, NOT to shame or punish individuals. All activities require explicit authorization from organizational leadership AND legal/HR review. Results must be reported in aggregate — never identify individual employees by name. The goal is to strengthen the human layer of defense.

## Pre-Conditions

- Executive authorization for assessment
- Legal and HR review of assessment plan
- Clear communication to management about assessment purpose
- Agreement on reporting format (aggregate, no individual naming)
- Employee privacy protections confirmed

## Inputs

- Organization name and size
- Written authorization (including legal/HR sign-off)
- Assessment type (awareness audit, phishing simulation, pretexting review, full)
- Current security awareness program documentation
- Previous assessment results (if available)
- Industry-specific social engineering threat intelligence

## Steps

### 1. Authorization and Ethical Framework
Document and confirm:
- Executive authorization received
- Legal review completed (employment law compliance)
- HR review completed (employee privacy protections)
- Assessment boundaries defined (what is explicitly NOT allowed)
- Blameless reporting agreement signed
- Escalation procedures for unexpected findings

### 2. Review Current Awareness Program
Evaluate the existing security awareness program:
| Component | Status | Quality |
|-----------|--------|---------|
| New hire security training | | |
| Annual refresher training | | |
| Phishing simulation program | | |
| Reporting mechanisms (phish button) | | |
| Security champions program | | |
| Incident reporting culture | | |
| Executive security briefings | | |

### 3. Assess Information Exposure
Review publicly available information that could be used in social engineering:
- Employee information on LinkedIn, social media
- Organization details on website (team pages, org charts)
- Technology stack exposure (job postings, GitHub)
- Physical location details
- Vendor and partner relationships visible publicly

### 4. Evaluate Technical Controls Against Social Engineering
Assess controls designed to mitigate social engineering:
- Email filtering and anti-phishing
- URL rewriting and sandboxing
- DMARC/DKIM/SPF configuration
- Browser isolation for risky URLs
- USB and removable media policies
- Phone system caller ID validation

### 5. Design Assessment Scenarios
Create realistic but ethical scenarios to evaluate awareness:
| Scenario | Vector | Difficulty | What It Tests |
|----------|--------|-----------|--------------|
| Phishing email | Email | Low | Link click, credential entry |
| Spear phishing | Email | Medium | Targeted info gathering |
| Pretexting call | Phone | Medium | Information disclosure |
| Tailgating awareness | Physical | Low | Physical security awareness |
| USB drop | Physical | Low | Device trust |

### 6. Analyze Organizational Culture Factors
Assess cultural factors that influence social engineering resilience:
- Authority compliance tendencies
- Urgency response patterns
- Helpfulness exploitation risk
- Fear-based compliance risk
- Reporting culture (fear of blame vs. encouraged)

### 7. Benchmark Against Industry Standards
Compare organizational awareness against:
- Industry phishing click-rate benchmarks
- NIST SP 800-50 (security awareness training)
- SANS Security Awareness Maturity Model
- Sector-specific requirements (HIPAA, PCI DSS)

### 8. Develop Improvement Recommendations
Provide actionable recommendations:
- Training program improvements (content, frequency, delivery)
- Technical control enhancements
- Policy updates
- Culture change initiatives
- Metrics and KPIs for measuring progress

### 9. Design Ongoing Measurement Program
Create a sustainable measurement framework:
- Quarterly phishing simulation cadence
- Annual awareness assessment
- Reporting rate tracking
- Time-to-report metrics
- Training completion metrics

### 10. Compile Assessment Report
Produce a blameless, aggregate report focused on organizational improvement — never individual blame.

## Output

```yaml
se_assessment:
  organization: ""
  date: ""
  type: ""
  authorization: "confirmed (exec + legal + HR)"

  awareness_maturity: "[1-5 SANS model]"

  current_program:
    training_coverage: ""
    simulation_frequency: ""
    reporting_mechanism: "[exists/missing]"
    culture_assessment: "[strong/adequate/weak]"

  exposure_assessment:
    public_info_risk: "[high/medium/low]"
    technical_controls: "[strong/adequate/weak]"

  recommendations:
    - area: ""
      current_state: ""
      recommendation: ""
      priority: "[high/medium/low]"
      effort: ""

  improvement_metrics:
    - metric: ""
      current_baseline: ""
      target: ""
      measurement_method: ""
```

## Quality Criteria

- [ ] Authorization confirmed including legal and HR
- [ ] Current awareness program thoroughly evaluated
- [ ] Public information exposure assessed
- [ ] Technical controls evaluated
- [ ] Recommendations are constructive and actionable
- [ ] Report is blameless — no individual identification
- [ ] Industry benchmarks referenced
- [ ] Ongoing measurement program designed
