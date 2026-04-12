# Penetration Testing Methodology Reference

## Purpose

Complete methodology reference for authorized penetration testing — PTES phases, OWASP Testing Guide, tool selection, and reporting standards. Used exclusively by Breach (penetration-tester). All operations require verified written authorization.

**ETHICAL GATE:** Every engagement starts with written authorization, defined scope, and rules of engagement. No exceptions.

---

## PTES: Penetration Testing Execution Standard

The PTES defines 7 phases for a complete penetration test engagement.

### Phase 1: Pre-Engagement

Define the scope, rules, and legal authorization before any technical work begins.

**Required artifacts before proceeding:**
- Written authorization (signed scope of work or letter of authorization)
- Defined in-scope assets (IP ranges, domains, applications, APIs)
- Out-of-scope assets explicitly listed
- Rules of engagement (testing windows, contacts, escalation path)
- Emergency stop procedure (who to call if critical infrastructure affected)
- Data handling agreement (how findings are stored and transmitted)

**Authorization verification checklist:**
```
[ ] Written authorization received and on file
[ ] Scope document signed by authorized representative
[ ] Out-of-scope assets documented
[ ] Testing windows agreed upon
[ ] Emergency contact available
[ ] Findings handling agreed (encryption, retention)
[ ] Legal jurisdiction confirmed
```

### Phase 2: Intelligence Gathering (Reconnaissance)

Collect information about the target using only authorized, passive techniques unless active recon is explicitly permitted.

**Passive recon (always allowed within scope):**
```bash
# DNS enumeration
dig +short example.com any
dnsx -d example.com -a -aaaa -mx -ns -cname -txt

# Subdomain discovery (passive, no direct contact)
subfinder -d example.com -silent

# WHOIS and registration data
whois example.com

# Certificate transparency logs (public data)
curl "https://crt.sh/?q=%.example.com&output=json" | jq '.[].name_value'

# Google dorking — public info indexed by search engines
site:example.com filetype:pdf
site:example.com inurl:admin
```

**Active recon (requires explicit authorization):**
```bash
# Port scanning — only against authorized IPs
nmap -sV -sC -p 1-65535 --open -T4 target.example.com

# Service version detection
nmap -sV -p 80,443,8080,8443 target.example.com

# Web technology fingerprinting
whatweb target.example.com
```

### Phase 3: Threat Modeling

Map identified attack surface to threat scenarios:
- Document open ports and services
- Map application technologies (CMS, frameworks, libraries)
- Identify authentication mechanisms
- Note third-party integrations and external dependencies
- Cross-reference CVEs for identified versions

### Phase 4: Vulnerability Analysis

Systematically identify vulnerabilities using automated tools and manual techniques.

**Automated scanning:**
```bash
# Web application scanning (DAST)
# OWASP ZAP — automated scan
zap-cli --zap-url http://localhost:8080 quick-scan --self-contained --spider \
  --ajax-spider -r --output-format json http://target.example.com

# Nuclei — template-based vulnerability scanner
nuclei -u https://target.example.com -t /opt/nuclei-templates/ -severity critical,high,medium

# SSL/TLS configuration
sslyze --regular target.example.com:443

# Directory and path discovery
feroxbuster -u https://target.example.com -w /usr/share/wordlists/dirb/common.txt
```

**Manual techniques:**
- Review all input fields for injection opportunities
- Test authentication flows manually
- Examine session management (cookie attributes, token entropy)
- Check access control by testing role boundaries
- Review security headers in all responses

### Phase 5: Exploitation

Attempt to confirm vulnerabilities by safely exploiting them within scope.

**Exploitation principles:**
- Confirm vulnerability, do not cause harm
- Avoid denial of service or data destruction
- Document every action with timestamps
- Stop immediately if you exceed scope or find unexpected sensitive data
- Escalate to client immediately if you find evidence of a pre-existing breach

**Burp Suite Professional workflow:**
```
1. Configure browser proxy → Burp Proxy (127.0.0.1:8080)
2. Spider/crawl target to map attack surface
3. Run active scanner against scope
4. Review scanner findings in Burp Dashboard
5. Manual exploitation via Burp Repeater
6. Track all requests in Burp Project
```

### Phase 6: Post-Exploitation

Assess the real-world impact of confirmed vulnerabilities:
- What data is accessible?
- Can the compromise spread to other systems (lateral movement risk)?
- What is the business impact of the vulnerability?
- Can the attacker persist (would they establish persistence in a real attack)?

**Document for report:**
- Screenshot of successful exploitation
- Data accessed (record existence, not full contents)
- Privilege level achieved
- Potential blast radius

### Phase 7: Reporting

Produce actionable, audience-appropriate findings.

---

## Reporting Standards

### Finding Severity Classification

Use CVSS v3.1 for consistent scoring:

| Severity | CVSS Score | Remediation SLA | Definition |
|----------|-----------|----------------|------------|
| **Critical** | 9.0–10.0 | 24–48 hours | Remote code execution, unauthenticated data breach |
| **High** | 7.0–8.9 | 7 days | Auth bypass, significant data exposure |
| **Medium** | 4.0–6.9 | 30 days | Requires auth, limited impact |
| **Low** | 0.1–3.9 | 90 days | Defense-in-depth issues, information disclosure |
| **Informational** | 0.0 | Next cycle | Best practice improvements |

### Finding Template

Every finding should contain:
```
Title: [Concise description]
Severity: [Critical/High/Medium/Low/Informational]
CVSS Score: [X.X]
CVE Reference: [If applicable]

Description:
[What the vulnerability is and why it matters]

Affected Systems:
[Specific URLs, endpoints, or components]

Evidence:
[Screenshots, request/response, proof of concept]

Impact:
[Business impact if exploited by a real attacker]

Remediation:
[Specific, actionable fix instructions]

References:
[OWASP, CVE, vendor docs]
```

---

## Tool Reference

### Core Toolchain

| Tool | Category | License | Primary Use |
|------|----------|---------|-------------|
| **Burp Suite Pro** | DAST | Commercial | Web app testing, manual exploitation |
| **OWASP ZAP** | DAST | Free/Open Source | CI/CD automation, budget-constrained tests |
| **Nmap** | Network | Free/Open Source | Port scanning, service discovery |
| **Metasploit** | Exploitation | Free/Commercial | Exploit framework, post-exploitation |
| **Nuclei** | Scanner | Free/Open Source | Template-based vulnerability scanning |
| **Semgrep** | SAST | Free/Commercial | Static code analysis |
| **Snyk** | SCA | Free/Commercial | Dependency vulnerability scanning |
| **SQLmap** | Injection | Free/Open Source | Automated SQL injection |
| **Hydra / Medusa** | Auth | Free/Open Source | Brute force (authorized tests only) |
| **Gobuster / Feroxbuster** | Recon | Free/Open Source | Directory and file discovery |
| **SSLyze** | TLS | Free/Open Source | SSL/TLS configuration testing |

### For Beginners — Progressive Stack

**Phase 1 (Learning):**
1. OWASP ZAP in automatic mode — spider + active scan
2. `npm audit` for dependency vulnerabilities
3. Semgrep for SAST basics

**Phase 2 (Intermediate):**
4. Burp Suite Community (learn the proxy)
5. Nmap for infrastructure assessment
6. Nuclei with community templates

**Phase 3 (Professional):**
7. Burp Suite Professional (license)
8. Custom Nuclei templates for client-specific checks
9. Manual exploitation techniques

---

## OWASP Testing Guide Categories (v4.2)

The OWASP Testing Guide (OTG) provides the most comprehensive methodology for web application testing:

| Category | Key Tests |
|----------|----------|
| **OTG-INFO** Information Gathering | Fingerprinting, search engine discovery, web server analysis |
| **OTG-CONFIG** Configuration | Network/infrastructure config, application platform, HTTP methods |
| **OTG-IDENT** Identity Management | User registration, account provisioning, username policy |
| **OTG-AUTHN** Authentication | Credentials over encrypted channel, default credentials, brute force |
| **OTG-AUTHZ** Authorization | Directory traversal, privilege escalation, IDOR, OAuth testing |
| **OTG-SESS** Session Management | Cookie attributes, session fixation, CSRF, logout |
| **OTG-INPVAL** Input Validation | XSS, SQL injection, HTTP injection, XML injection, code injection |
| **OTG-ERR** Error Handling | Error codes, stack traces |
| **OTG-CRYPST** Cryptography | Weak SSL, padding oracle, sensitive data in transit |
| **OTG-BUSLOGIC** Business Logic | Data validation, process flow, file upload |
| **OTG-CLIENT** Client-Side Testing | DOM-based XSS, PostMessage, clickjacking |

---

## API Security Testing

### REST API Test Checklist

```
Authentication
[ ] Endpoints accessible without auth tokens
[ ] Auth tokens transmitted securely (HTTPS, not URL params)
[ ] Token expiration enforced
[ ] Token revocation works (logout invalidates token)

Authorization
[ ] BOLA: can user A access user B's resources by changing IDs?
[ ] BFLA: can user access admin functions without admin role?
[ ] Mass assignment: does API accept undocumented parameters that affect auth?

Input Validation
[ ] Injection in all string parameters (SQL, NoSQL, command)
[ ] Path traversal in file-related endpoints
[ ] XML/JSON deserialization risks

Business Logic
[ ] Rate limiting on resource-intensive endpoints
[ ] Can users exceed intended limits (purchase 0-price items, negative quantities)?
[ ] Workflow enforcement (can user skip required steps?)

Infrastructure
[ ] Security headers present
[ ] API version disclosure (avoid version in response if possible)
[ ] Error messages don't expose internal details
```

### GraphQL-Specific Tests

```bash
# Introspection (should be disabled in production)
curl -X POST https://api.target.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{__schema{types{name}}}"}'

# Batch query attack (no rate limiting on batches)
# [{"query":"query1"},{"query":"query2"},...] x100

# Field suggestion (typos reveal valid field names)
# GraphQL returns "Did you mean X?" — information disclosure
```

---

## Cloud Environment Testing

### AWS Security Assessment

Key areas to test with explicit authorization:

```bash
# IAM privilege analysis (with legitimate credentials)
# Check for privilege escalation paths
python3 enumerate_iam.py

# S3 bucket exposure (requires authorization)
aws s3 ls s3://bucket-name --no-sign-request  # Check for public access

# EC2 metadata service exposure
# Test if SSRF can reach: http://169.254.169.254/latest/meta-data/

# Lambda function permissions
aws lambda get-policy --function-name my-function

# Check for IMDSv1 (should be disabled — SSRF risk)
aws ec2 describe-instances --query "Reservations[].Instances[].MetadataOptions"
```

### Kubernetes Security Assessment

```bash
# RBAC analysis
kubectl auth can-i --list --as=system:serviceaccount:default:myapp

# Check for privileged pods
kubectl get pods -A -o json | jq '.items[].spec.containers[].securityContext'

# Network policy coverage
kubectl get networkpolicies -A

# Check for secrets in env vars (common misconfiguration)
kubectl get pods -A -o json | jq '.items[].spec.containers[].env'
```

---

## Sources

- PTES: http://www.pentest-standard.org/
- OWASP Testing Guide v4.2: https://owasp.org/www-project-web-security-testing-guide/
- OWASP API Security Testing Guide: https://owasp.org/www-project-api-security/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- HackTricks: https://book.hacktricks.xyz/ (for methodology reference — authorized tests only)
