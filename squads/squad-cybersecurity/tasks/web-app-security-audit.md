---
task: web-app-security-audit
responsavel: "penetration-tester"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: target_application
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: authorization_document
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: owasp_focus
    tipo: list
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: security_audit_report
    tipo: document
    destino: "stakeholders, dev team"

Checklist:
  - "[ ] Verify written authorization"
  - "[ ] Map all OWASP Top 10 2021 categories"
  - "[ ] Test each category systematically"
  - "[ ] Validate security headers and TLS"
  - "[ ] Test input validation across all entry points"
  - "[ ] Score findings with CVSS v3.1"
  - "[ ] Provide remediation guidance per finding"
  - "[ ] Produce executive and technical reports"
---

# Task: Web Application Security Audit

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Breach (penetration-tester)
- **Complexity:** Complex

## Objective

Conduct a comprehensive security audit of a web application against the OWASP Top 10 2021 framework and supplementary best practices. This differs from a penetration test in its systematic, checklist-driven approach covering every OWASP category with documented evidence for each control.

> **AUTHORIZED USE ONLY:** This audit requires explicit written authorization from the application owner. All testing must remain within the defined scope. No destructive testing without explicit approval.

## Pre-Conditions

- Written authorization from application owner
- Defined scope (URLs, environments, credentials)
- Test environment available (production testing requires extra approval)
- Rules of engagement agreed upon

## Inputs

- Target application URL(s)
- Written authorization document
- OWASP categories to focus on (default: all Top 10)
- Test credentials (multiple roles if applicable)
- Application documentation (API docs, architecture diagrams)

## Steps

### 1. Authorization and Scope Verification
Confirm and document:
- Written authorization received and valid
- Scope boundaries (in-scope and out-of-scope URLs)
- Testing window and emergency contacts
- Rules of engagement (rate limits, destructive tests)

### 2. A01:2021 — Broken Access Control
Test for:
- Violation of least privilege
- CORS misconfiguration
- Force browsing to unauthenticated pages
- Path traversal
- IDOR (Insecure Direct Object References)
- Missing access control for API endpoints
- Metadata manipulation (JWT, cookies)

### 3. A02:2021 — Cryptographic Failures
Assess:
- Data transmitted in cleartext
- Weak or deprecated cryptographic algorithms
- Default or reused cryptographic keys
- Certificate validation issues
- Sensitive data in URLs
- Password storage mechanisms (hashing, salting)

### 4. A03:2021 — Injection
Test all input vectors for:
- SQL injection (error-based, blind, time-based)
- Cross-Site Scripting (reflected, stored, DOM-based)
- Command injection
- LDAP injection
- Server-Side Template Injection (SSTI)
- Header injection (Host, X-Forwarded-For)

### 5. A04:2021 — Insecure Design
Review:
- Business logic flaws
- Missing rate limiting on sensitive operations
- Race conditions
- Insufficient anti-automation
- Missing security requirements in design

### 6. A05:2021 — Security Misconfiguration
Check:
- Default credentials and configurations
- Unnecessary features enabled
- Error handling (information leakage)
- Security headers (CSP, HSTS, X-Frame-Options, etc.)
- Directory listing enabled
- Stack trace exposure

### 7. A06:2021 — Vulnerable and Outdated Components
Analyze:
- Client-side JavaScript libraries (Retire.js)
- Server-side framework versions
- Known CVEs in detected components
- End-of-life software

### 8. A07:2021 — Identification and Authentication Failures
Test:
- Brute force protection
- Credential stuffing resistance
- Password policy enforcement
- Session management (fixation, timeout, rotation)
- MFA implementation quality
- Password reset flow security

### 9. A08-A10:2021 — Integrity, Logging, SSRF
- **A08:** Software and data integrity — verify update mechanisms, CI/CD security, deserialization
- **A09:** Security logging and monitoring — verify audit trails, log injection, monitoring coverage
- **A10:** Server-Side Request Forgery — test internal resource access, cloud metadata endpoints

### 10. TLS and Transport Security Audit
Evaluate:
- TLS version and cipher suites
- Certificate chain validity
- HSTS configuration and preload
- Certificate pinning (mobile apps)
- Mixed content issues

### 11. Compile Findings and Report
For each finding:
| Field | Content |
|-------|---------|
| Title | Clear description |
| OWASP Category | A01-A10 reference |
| CVSS Score | v3.1 base score |
| Evidence | Screenshots, requests/responses |
| Impact | Business and technical |
| Remediation | Specific fix for this application |
| References | CWE, OWASP Testing Guide |

## Output

```yaml
web_app_security_audit:
  target: ""
  date: ""
  authorization: "confirmed"
  scope: ""

  findings_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0
    informational: 0

  owasp_coverage:
    A01_broken_access_control: "[pass/fail/partial]"
    A02_cryptographic_failures: "[pass/fail/partial]"
    A03_injection: "[pass/fail/partial]"
    A04_insecure_design: "[pass/fail/partial]"
    A05_security_misconfiguration: "[pass/fail/partial]"
    A06_vulnerable_components: "[pass/fail/partial]"
    A07_auth_failures: "[pass/fail/partial]"
    A08_integrity_failures: "[pass/fail/partial]"
    A09_logging_failures: "[pass/fail/partial]"
    A10_ssrf: "[pass/fail/partial]"

  findings:
    - title: ""
      owasp_category: ""
      cvss_score: 0.0
      severity: ""
      evidence: ""
      remediation: ""

  overall_risk_rating: "[critical/high/medium/low]"
```

## Quality Criteria

- [ ] Written authorization verified before testing
- [ ] All 10 OWASP categories systematically tested
- [ ] Every finding includes reproduction steps and evidence
- [ ] CVSS v3.1 scores applied to all findings
- [ ] Remediation guidance specific to application's technology stack
- [ ] TLS and security headers evaluated
- [ ] Executive summary suitable for non-technical stakeholders
- [ ] No out-of-scope testing performed
