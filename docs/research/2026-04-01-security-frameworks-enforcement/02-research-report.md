# Security Frameworks & Enforcement -- Complete Research Report

---

## 1. OWASP Top 10:2025

**Source:** [OWASP Foundation](https://owasp.org/Top10/2025/) | [GitLab Analysis](https://about.gitlab.com/blog/2025-owasp-top-10-whats-changed-and-why-it-matters/)

The 2025 edition analyzed 589 CWEs across 175,000+ CVE records from 2.8 million tested applications.

### Complete List

| Rank | Code | Category | Change from 2021 |
|------|------|----------|-------------------|
| 1 | A01 | Broken Access Control | Stable at #1 (now includes SSRF) |
| 2 | A02 | Security Misconfiguration | Up from #5 |
| 3 | A03 | Software Supply Chain Failures | NEW (replaces Vulnerable Components) |
| 4 | A04 | Cryptographic Failures | Down from #2 |
| 5 | A05 | Injection | Down from #3 |
| 6 | A06 | Insecure Design | Down from #4 |
| 7 | A07 | Authentication Failures | Stable |
| 8 | A08 | Software or Data Integrity Failures | Stable |
| 9 | A09 | Security Logging & Alerting Failures | Stable |
| 10 | A10 | Mishandling of Exceptional Conditions | NEW |

### TOP 5 Most Critical Controls

1. **Enforce access control at every endpoint** -- RBAC/ABAC with deny-by-default. 3.73% of apps tested had broken access control (40 CWEs).
2. **Harden all configurations** -- Remove defaults, disable unnecessary services, enforce security headers. 3.00% of apps had misconfigurations (16 CWEs).
3. **Verify supply chain integrity** -- Generate SBOM, scan dependencies, verify package signatures. Highest average exploit + impact scores despite fewest occurrences.
4. **Use parameterized queries everywhere** -- Prevent SQL/NoSQL/LDAP/OS command injection. Input validation with allowlists.
5. **Implement comprehensive error handling** -- Never fail open. Never expose stack traces. Test exception scenarios.

### Implementation Guidance

```
CI/CD Pipeline Must Include:
- SAST (Static Application Security Testing)
- DAST (Dynamic Application Security Testing)
- Dependency scanning (SCA)
- Container image scanning
- Secret detection
- API security testing
```

### Deployment Blockers

- No access control on API endpoints -> BLOCK
- Default credentials in production -> BLOCK
- Unpatched dependencies with known CVEs (CRITICAL/HIGH) -> BLOCK
- SQL queries using string concatenation -> BLOCK
- Verbose error messages exposing internals -> BLOCK

---

## 2. NIST Cybersecurity Framework 2.0 (CSF)

**Source:** [NIST Official](https://www.nist.gov/cyberframework) | [CyberArk Overview](https://www.cyberark.com/what-is/nist-csf-20/)

Released February 26, 2024. Now targets ALL organizations, not just critical infrastructure.

### 6 Core Functions

| Function | Description | New in 2.0? |
|----------|-------------|-------------|
| **GOVERN** | Policy, strategy, risk management, supply chain governance | YES |
| **IDENTIFY** | Asset inventory, risk assessment, business environment | No |
| **PROTECT** | Access control, training, data security, maintenance | No |
| **DETECT** | Continuous monitoring, anomaly detection, event analysis | No |
| **RESPOND** | Incident response, communications, mitigation, improvements | No |
| **RECOVER** | Recovery planning, communications, improvements | No |

### TOP 5 Most Critical Controls

1. **Establish cybersecurity governance (GOVERN)** -- Define risk tolerance, assign accountability, integrate into business strategy. This is the new cornerstone function.
2. **Maintain complete asset inventory (IDENTIFY)** -- Know every asset, application, data flow, and supplier. You cannot protect what you do not know exists.
3. **Enforce identity and access management (PROTECT)** -- MFA, least privilege, zero trust principles for all access.
4. **Implement continuous monitoring (DETECT)** -- Real-time threat detection, SIEM integration, anomaly-based alerting.
5. **Manage supply chain risk (GOVERN)** -- Assess vendor security posture, contractual requirements, continuous monitoring of third parties.

### Implementation Guidance

- Use CSF Profiles to map current vs. target security posture
- Implement CSF Tiers (1-4) to measure maturity progression
- ~20 new subcategories focus on governance and supply chain
- Align with CIS Controls and OWASP for technical implementation

### Deployment Blockers

- No documented risk management strategy -> BLOCK
- No asset inventory -> BLOCK
- No incident response plan -> BLOCK
- No supply chain risk assessment -> BLOCK
- No monitoring/detection capability -> BLOCK

---

## 3. Zero Trust Architecture (NIST SP 800-207)

**Source:** [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final) | [NIST Implementation Guide](https://pages.nist.gov/zero-trust-architecture/) | [RiskRecon Analysis](https://blog.riskrecon.com/understanding-nist-800-207)

### 7 Core Tenets

1. **All data sources and computing services are considered resources** -- Not just servers; includes SaaS, user devices, IoT.
2. **All communication is secured regardless of network location** -- Internal traffic is treated the same as external. No trusted zones.
3. **Access to resources is granted on a per-session basis** -- No persistent access. Each request is independently evaluated.
4. **Access is determined by dynamic policy** -- Context-aware decisions based on identity, device health, behavior, location, time.
5. **Enterprise monitors and measures integrity of all assets** -- Continuous posture assessment, not point-in-time checks.
6. **All authentication and authorization are dynamic and strictly enforced** -- No implicit trust. Re-authenticate on context change.
7. **Enterprise collects information to improve security posture** -- Telemetry feeds back into policy decisions continuously.

### Logical Components

| Component | Role |
|-----------|------|
| **Policy Engine (PE)** | Makes access decisions using policy, risk scores, identity, telemetry |
| **Policy Administrator (PA)** | Translates PE decisions into action (allow/deny/route) |
| **Policy Enforcement Point (PEP)** | Enforces access decisions -- the "bouncer" between users and services |

### TOP 5 Most Critical Controls

1. **Verify every request** -- No implicit trust based on network location, IP, or previous authentication.
2. **Enforce least privilege per session** -- Grant minimum necessary access, revoke when session ends.
3. **Micro-segmentation** -- Isolate workloads and data at granular level. Lateral movement must be impossible.
4. **Continuous authentication** -- MFA + device posture + behavioral analytics for every access decision.
5. **Encrypt everything** -- All traffic encrypted (east-west and north-south). mTLS between services.

### Implementation Guidance

- Start with identity: strong authentication is the foundation
- Implement micro-segmentation incrementally (start with most sensitive assets)
- Deploy policy engine/administrator/enforcement point architecture
- Feed telemetry from all sources into policy decisions
- NIST NCCoE built 19 example implementations with 24 industry collaborators

### Deployment Blockers

- Any service accessible without authentication -> BLOCK
- Network-based trust (e.g., "internal network = trusted") -> BLOCK
- Persistent access tokens without expiration -> BLOCK
- No encryption on internal traffic -> BLOCK
- No device posture assessment -> BLOCK

---

## 4. CIS Critical Security Controls v8.1

**Source:** [CIS Official](https://www.cisecurity.org/controls/v8) | [CIS Controls List](https://www.cisecurity.org/controls/cis-controls-list)

18 controls, 153 safeguards, 3 Implementation Groups (IG1=56, IG2=130, IG3=153 safeguards).

### Complete List of 18 Controls

| # | Control Name | Category |
|---|-------------|----------|
| 1 | Inventory and Control of Enterprise Assets | Basic |
| 2 | Inventory and Control of Software Assets | Basic |
| 3 | Data Protection | Basic |
| 4 | Secure Configuration of Enterprise Assets and Software | Basic |
| 5 | Account Management | Basic |
| 6 | Access Control Management | Basic |
| 7 | Continuous Vulnerability Management | Foundational |
| 8 | Audit Log Management | Foundational |
| 9 | Email and Web Browser Protections | Foundational |
| 10 | Malware Defenses | Foundational |
| 11 | Data Recovery | Foundational |
| 12 | Network Infrastructure Management | Foundational |
| 13 | Network Monitoring and Defense | Foundational |
| 14 | Security Awareness and Skills Training | Foundational |
| 15 | Service Provider Management | Foundational |
| 16 | Application Software Security | Foundational |
| 17 | Incident Response Management | Organizational |
| 18 | Penetration Testing | Organizational |

### Implementation Groups

| Group | Safeguards | Target |
|-------|-----------|--------|
| **IG1** | 56 | Essential cyber hygiene. ALL organizations must implement this. |
| **IG2** | 130 | Multiple departments, complex risk profiles |
| **IG3** | 153 | Mature security teams, sensitive/confidential data |

### TOP 5 Most Critical Controls (IG1 Priority)

1. **Asset Inventory (Controls 1-2)** -- Know every hardware and software asset. Unauthorized assets are attack vectors.
2. **Secure Configuration (Control 4)** -- Harden all defaults. CIS Benchmarks provide specific configuration guides per technology.
3. **Access Control (Controls 5-6)** -- Manage accounts, enforce least privilege, disable inactive accounts, MFA on all admin access.
4. **Vulnerability Management (Control 7)** -- Continuous scanning, patch within SLA (critical=48h, high=7d, medium=30d).
5. **Audit Logging (Control 8)** -- Log all authentication, authorization, and data access events. Centralize and retain.

### Implementation Guidance

- Start with IG1 (56 safeguards) -- this blocks 77% of ATT&CK techniques
- Use CIS Benchmarks for specific configuration hardening (available for 100+ technologies)
- Automate asset discovery and software inventory
- Integrate vulnerability scanning into CI/CD
- Centralize logs in SIEM with 90-day minimum retention

### Deployment Blockers

- No asset inventory -> BLOCK
- Default configurations in production -> BLOCK
- No vulnerability scanning process -> BLOCK
- No centralized logging -> BLOCK
- No incident response plan -> BLOCK

---

## 5. LGPD (Brazil) -- Technical Requirements for Platforms

**Source:** [ICLG Brazil Data Protection](https://iclg.com/practice-areas/data-protection-laws-and-regulations/brazil) | [ComplyDog LGPD Guide](https://complydog.com/blog/brazil-lgpd-complete-data-protection-compliance-guide-saas)

### TOP 5 Most Critical Requirements

1. **Consent must be free, informed, unequivocal, and granular** -- No bundled consent. Users must be able to withdraw at any time via free, easily accessible procedures. Children under 12 require parental consent.

2. **3-business-day breach notification** -- Must notify ANPD AND affected data subjects within 3 business days of confirming an incident. Full details within 20 days. Half of GDPR's timeline.

3. **Data subject rights fulfillment within 15 days** -- Access, rectification, deletion, portability, objection, automated decision review. Complete statement must be provided within 15 days.

4. **Mandatory DPO (Data Protection Officer)** -- Must be publicly named with contact details on website. Must communicate in Portuguese. Can serve multiple controllers.

5. **Technical and organizational security measures** -- Encryption, access controls, data minimization, incident response procedures, cybersecurity governance framework.

### Legal Bases for Processing

| Type | Bases Available |
|------|----------------|
| Regular personal data | Consent, contract, legal obligation, vital interests, public interest, legitimate interest |
| Sensitive personal data | Consent OR specific exceptions (health, labor law, fraud prevention, racial equality) |

### Penalties

| Sanction | Details |
|----------|---------|
| Fine | Up to 2% of Brazil revenue, capped at R$50 million per violation |
| Daily fine | Same cap as above |
| Data blocking | Until regularization |
| Processing suspension | Up to 6 months, renewable |
| Processing prohibition | Partial or total |
| Public disclosure | Of the offense |

### Severity Classification

- **Minor** -- Standard violations
- **Medium** -- Significantly affects fundamental rights
- **Serious** -- Large-scale processing, economic benefit from violation, life risk, sensitive/children's data, systematic violations

### International Data Transfers

As of August 23, 2025, international data transfers MUST use one of:
- Standard Contractual Clauses (ANPD-approved templates)
- Binding Corporate Rules (ANPD approval required)
- Countries with adequate protection (ANPD-approved list)
- Specific consent from data subject

### Implementation Guidance

```
Platform Checklist:
- Consent management UI with granular opt-in/opt-out
- Data subject request portal (15-day SLA automated)
- Breach detection + notification pipeline (3-day SLA)
- DPO appointment + public disclosure
- Data processing records (ROPA equivalent)
- Privacy Impact Assessment for high-risk processing
- International transfer safeguards (SCCs in place)
- Data encryption at rest and in transit
- Access control with audit trail
- Data retention policy with automated deletion
```

### Deployment Blockers

- No consent management mechanism -> BLOCK
- No breach notification capability within 3 days -> BLOCK
- No DPO appointed -> BLOCK
- No data subject request handling process -> BLOCK
- International transfers without approved mechanism -> BLOCK

---

## 6. Major Data Breaches 2023-2025 -- Root Causes & Prevention

**Source:** [InventiveHQ Breach Analysis](https://inventivehq.com/blog/the-biggest-us-data-breaches-of-20232025) | [Varonis Statistics](https://www.varonis.com/blog/data-breach-statistics)

### The 12 Largest Breaches

| Breach | Year | Records | Root Cause |
|--------|------|---------|------------|
| National Public Data | 2024 | 2.9 billion | Cybercriminal access, poor monitoring |
| RockYou2024 + MOAB | 2024 | 10B + 26B | Aggregated credential leaks |
| Ticketmaster/Snowflake | 2024 | 560 million | Stolen credentials, no MFA on cloud |
| Change Healthcare | 2024 | 192.7 million | Ransomware via Citrix without MFA |
| AT&T | 2024 | 73 million + all call records | Third-party vendor breach |
| MOVEit Transfer | 2023 | 94 million | Zero-day vulnerability exploitation |
| Dell Partner Portal | 2024 | 49 million | Unauthorized API access |
| T-Mobile | 2023 | 37 million | Unauthenticated API endpoint |
| MGM Resorts | 2023 | 37 million | Social engineering + ransomware |
| HCA Healthcare | 2023 | 11.27 million | Misconfigured external storage |
| Evolve Bank | 2024 | 7.6 million | LockBit ransomware |
| 23andMe | 2023 | 6.9 million | Credential stuffing |

### TOP 5 Root Cause Patterns

1. **Missing MFA** -- Change Healthcare (192.7M), Ticketmaster/Snowflake (560M), 23andMe (6.9M). MFA alone would have prevented these.
2. **Unprotected APIs** -- T-Mobile (37M), Dell (49M). No authentication or rate limiting on API endpoints.
3. **Third-party/supply chain compromise** -- MOVEit (94M), AT&T (73M). 36% of breaches originated from third parties in 2024.
4. **Credential theft/stuffing** -- RockYou2024 (10B passwords). Infostealer malware + historical breach aggregation.
5. **Misconfiguration** -- HCA (11.27M). External storage with improper access controls.

### What Would Have Prevented Them

| Prevention Measure | Breaches It Would Have Blocked |
|-------------------|-------------------------------|
| **Mandatory MFA on all accounts** | Change Healthcare, Snowflake/Ticketmaster, 23andMe |
| **API authentication + rate limiting** | T-Mobile, Dell |
| **Vendor security assessment + monitoring** | MOVEit, AT&T |
| **Passkey/passwordless authentication** | All credential-based breaches |
| **Configuration hardening + scanning** | HCA Healthcare |
| **Network segmentation** | Change Healthcare, Evolve Bank |
| **Patch management (<48h for critical)** | MOVEit |

### Key Statistics

- Average cost of a data breach: $4.88M (2024)
- Phishing: $4.8M average per breach
- 36% of breaches from third-party compromise (up 6.5% YoY)
- Social engineering: 28% of confirmed breaches
- 85% of social engineering incidents resulted in data disclosure

### Deployment Blockers

- No MFA on ANY account (especially admin/cloud) -> BLOCK
- APIs without authentication -> BLOCK
- No vendor security assessment process -> BLOCK
- No patch management SLA for critical vulnerabilities -> BLOCK
- No network segmentation -> BLOCK

---

## 7. Anthropic/Claude API Security Best Practices

**Source:** [Claude API Key Best Practices](https://support.claude.com/en/articles/9767949-api-key-best-practices-keeping-your-keys-safe-and-secure) | [Claude Code Security](https://code.claude.com/docs/en/security)

### TOP 5 Most Critical Controls

1. **Never hardcode API keys** -- Use environment variables or secret management (AWS Secrets Manager, GCP Secret Manager, Azure Key Vault).

2. **Rotate keys every 90 days** -- Create new key, update references, deactivate old key. Automate this cycle.

3. **Separate keys by environment** -- Different keys for dev, staging, production. If one is compromised, only that environment is affected.

4. **Enable secret scanning in CI/CD** -- Use Gitleaks or equivalent SAST tools. GitHub automatically scans public repos and Anthropic auto-revokes exposed keys.

5. **Implement centralized KMS** -- Single encrypted storage location with fine-grained access controls, audit trails, and automated rotation.

### Implementation Guidance

```
DO:
- Store keys in .env files added to .gitignore
- Use cloud-native secret management in production
- Use environment variables to inject keys at runtime
- Implement usage monitoring and spend limits
- Set up alerts for anomalous usage patterns

DO NOT:
- Hardcode keys in source code
- Share keys in emails, Slack, or support tickets
- Use the same key across environments
- Include keys in public discussions
- Commit .env files to version control
```

### GitHub Auto-Protection

GitHub's secret scanning partnership with Anthropic:
1. Scans ALL public repositories for Claude API key patterns
2. Notifies Anthropic immediately upon detection
3. Anthropic auto-deactivates the exposed key
4. User receives email notification

### Incident Response

If a key is suspected compromised:
1. Immediately revoke via platform.claude.com/settings/keys
2. Generate new key
3. Update all references
4. Review usage logs for unauthorized activity
5. Audit how the compromise occurred

### Deployment Blockers

- API keys hardcoded in source code -> BLOCK
- No .gitignore for .env files -> BLOCK
- Same API key used in production and development -> BLOCK
- No secret scanning in CI/CD pipeline -> BLOCK
- No key rotation policy -> BLOCK

---

## 8. Supabase Security Best Practices

**Source:** [Supabase Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod) | [Supabase RLS Docs](https://supabase.com/docs/guides/database/postgres/row-level-security) | [Supabase API Security](https://supabase.com/docs/guides/api/securing-your-api)

### TOP 5 Most Critical Controls

1. **Enable RLS on ALL tables** -- No exceptions. Tables without RLS allow any client to read/modify data. Add policies for anon and authenticated roles.

2. **Never expose service_role key** -- It bypasses RLS entirely. Only use server-side. Treat as the most sensitive secret in your stack.

3. **Index RLS columns** -- For `auth.uid() = user_id` patterns, add btree index. Can improve performance 100x+ on large tables.

4. **Enable SSL enforcement** -- Database > Settings > SSL Configuration. All connections must use TLS.

5. **Enable network restrictions** -- Database > Settings > Network Restrictions. Limit which IPs can connect to your database.

### Complete Production Security Checklist

```
DATABASE:
[x] RLS enabled on ALL tables
[x] RLS policies reviewed for anon and authenticated roles
[x] SSL enforcement enabled
[x] Network restrictions configured
[x] Suitable indices for common queries (especially RLS columns)

AUTHENTICATION:
[x] Email confirmations enabled
[x] OTP expiry set to 3600s or lower
[x] Custom SMTP server configured (not default)
[x] CAPTCHA on signup, signin, password reset
[x] MFA enabled for end users (recommended)

KEY MANAGEMENT:
[x] anon key used client-side only (with RLS)
[x] service_role key NEVER in client code
[x] Keys stored in environment variables
[x] Different keys per environment
[x] Key rotation policy in place

ACCOUNT SECURITY:
[x] MFA on Supabase dashboard account
[x] GitHub 2FA enabled (if using GitHub auth)
[x] Multiple owners on organization
[x] MFA enforcement on organization (recommended)

EDGE FUNCTIONS:
[x] Functions are short and stateless (<1s)
[x] Auth validated via req.headers.authorization
[x] No service_role key in client-facing functions
[x] Complex jobs offloaded to queues

STORAGE:
[x] Storage access control policies configured
[x] No public buckets with sensitive data

MONITORING:
[x] Security Advisor reviewed
[x] Performance Advisor reviewed
[x] pg_stat_statements enabled for query analysis
```

### Common Mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Skipping RLS during prototyping | Full data exposure | Enable RLS from day 1 |
| service_role in frontend | Complete DB bypass | Move to server-side only |
| No index on RLS columns | 100x+ slower queries | Add btree index |
| Default SMTP for auth emails | Poor deliverability | Configure custom SMTP |
| No CAPTCHA on auth endpoints | Bot/abuse attacks | Enable hCaptcha/Turnstile |

### Deployment Blockers

- Any table without RLS enabled -> BLOCK
- service_role key in client-side code -> BLOCK
- SSL enforcement disabled -> BLOCK
- No network restrictions -> BLOCK
- No CAPTCHA on authentication endpoints -> BLOCK

---

## 9. Pre-Deploy Security Checklist (Enterprise Grade)

**Source:** [Production Readiness Checklist](https://goreplay.org/blog/production-readiness-checklist-20250808133113/) | [Vercel Production Checklist](https://vercel.com/docs/production-checklist) | [Cloud Security Checklist](https://www.secpod.com/blog/cloud-security-checklist-2025/)

### TOP 5 Most Critical Controls

1. **Authentication hardening** -- MFA via TOTP or WebAuthn/FIDO2. RBAC or ABAC for all access. No default credentials anywhere.

2. **Encryption everywhere** -- TLS 1.2+ for all data in transit. AES-256 for data at rest. mTLS between internal services.

3. **Secret management** -- Externalize all secrets to KMS (HashiCorp Vault, AWS Secrets Manager). Feature flags for gradual rollouts. Version-controlled config with audit logs.

4. **Security scanning in CI/CD** -- SAST, DAST, dependency scanning, container image scanning (Trivy/Clair), secret detection before every merge to main.

5. **Incident response readiness** -- Documented runbooks, quarterly tabletop exercises, defined RPO/RTO, 3-2-1 backup rule, chaos engineering testing.

### Complete Pre-Deploy Checklist

```
IDENTITY & ACCESS:
[ ] MFA enforced for all users (TOTP or WebAuthn/FIDO2)
[ ] RBAC/ABAC implemented with deny-by-default
[ ] No default credentials anywhere
[ ] Session management with proper expiration
[ ] Brute force protection (rate limiting + lockout)

ENCRYPTION:
[ ] TLS 1.2+ on all endpoints
[ ] AES-256 for data at rest
[ ] mTLS between internal services
[ ] Certificate auto-renewal (no expired certs)
[ ] Key rotation automated

APPLICATION SECURITY:
[ ] SAST scanning passed (0 critical/high)
[ ] DAST scanning passed
[ ] Dependency scanning (0 critical vulnerabilities)
[ ] Container image scanning passed
[ ] Secret detection passed (0 secrets in code)
[ ] Security headers configured (HSTS, CSP, X-Frame-Options, etc.)
[ ] Input validation on all user inputs
[ ] Parameterized queries only (no string interpolation)
[ ] CORS properly configured (not wildcard)

INFRASTRUCTURE:
[ ] Secrets in KMS (not in code or env files)
[ ] Network segmentation implemented
[ ] Firewall rules reviewed (deny-by-default)
[ ] Container security (non-root, minimal base images)
[ ] Kubernetes Pod Security Policies enforced

MONITORING & RESPONSE:
[ ] Centralized logging (SIEM)
[ ] Four Golden Signals monitored (latency, traffic, errors, saturation)
[ ] Real-time alerting configured
[ ] Incident response runbook documented
[ ] On-call rotation established

BACKUP & RECOVERY:
[ ] 3-2-1 backup rule (3 copies, 2 media, 1 offsite)
[ ] Automated backup verification
[ ] RPO and RTO defined and tested
[ ] Disaster recovery drill completed (last 90 days)

COMPLIANCE:
[ ] Data classification completed
[ ] Privacy policy published
[ ] Cookie/consent banner implemented
[ ] Data processing agreements with vendors
[ ] Breach notification procedure documented
```

### Stripe-Level Security Practices

- PCI DSS compliance (non-negotiable for payment processing)
- Tokenization of all sensitive data
- End-to-end encryption of payment data
- Webhook signature verification
- Idempotency keys on all mutating operations

### Cloudflare-Level Security Practices

- DDoS mitigation (blocked 7.3 Tbps in Q2 2025)
- WAF (Web Application Firewall) with managed rulesets
- Bot management and CAPTCHA challenges
- SSL/TLS encryption on all traffic (free SSL)
- Rate limiting on all endpoints

### Deployment Blockers

- Any critical/high vulnerability in SAST/DAST/SCA -> BLOCK
- Secrets detected in codebase -> BLOCK
- No MFA on admin/production accounts -> BLOCK
- No incident response plan -> BLOCK
- No backup verification in last 90 days -> BLOCK

---

## 10. ANPD (Brazil) Enforcement Actions & Requirements

**Source:** [IAPP Analysis](https://iapp.org/news/a/lessons-from-brazilian-dpa-sanctions-to-date) | [Baker McKenzie Overview](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/latin-america/brazil/topics/regulators-enforcement-priorities-and-penalties) | [Saud Law Overview](https://www.saudlaw.com/overview-of-the-anpds-activities-in-2024-new-resolutions-and-enforcement-actions/)

### TOP 5 Most Critical Requirements

1. **Breach notification within 3 business days** -- Resolution No. 15. Must include: affected data categories, risks, mitigation measures, DPO contact. Preliminary notification acceptable; full details within 20 days.

2. **RBR$50M fine cap per violation** -- 2% of Brazil revenue, capped at R$50 million. Daily fines with same cap. Can include processing suspension and public disclosure.

3. **AI and automated processing transparency** -- ANPD's 2025-2026 agenda prioritizes AI governance, facial recognition, and children's data. Expect new regulations on automated decision-making.

4. **International transfer compliance (SCCs mandatory since Aug 2025)** -- Grace period ended August 23, 2025. All international transfers must use ANPD-approved Standard Contractual Clauses or other approved mechanisms.

5. **Data Protection Impact Assessment (DPIA)** -- Required for high-risk processing activities. Not mandatory for all transfers but strongly recommended.

### Notable Enforcement Actions

| Entity | Year | Action | Reason |
|--------|------|--------|--------|
| **Meta** | 2024 | Processing suspended + R$50K/day fine | Using Brazilian data for AI training without legal basis |
| **SEEDF** (Dept of Education) | 2024 | 4 warnings | Multiple LGPD violations |
| **INSS** (Social Security) | 2024 | Sanction | Failed to notify data subjects of breach |
| **Ministry of Health** | 2024 | 2 warnings | 2022 security incident mishandling |
| **Telekall** | 2023 | First-ever fine (R$14.4K) | Selling WhatsApp voter data for campaigns |

### ANPD 2025-2026 Regulatory Agenda

Expected new regulations covering:
- Data subject rights (detailed procedures)
- Data Protection Impact Assessments
- Data sharing by government entities
- Minors' data processing in digital environments
- Artificial intelligence governance
- Biometric and facial recognition systems

### Enforcement Powers

| Power | Scope |
|-------|-------|
| Administrative investigations | With full defense opportunity |
| Precautionary measures | Immediate suspension of processing |
| Financial sanctions | Fines + daily fines |
| Operational sanctions | Data blocking, erasure, processing suspension |
| Advisory | Technical opinions, guidelines, regulations |
| Extraterritorial jurisdiction | Applies to any entity processing data of Brazilian residents |

### Implementation Guidance

```
ANPD Compliance Checklist:
[ ] DPO appointed and publicly named (with Portuguese capability)
[ ] Breach notification pipeline (<3 business days)
[ ] Consent management with granular controls
[ ] Data subject request portal (15-day SLA)
[ ] Data processing records maintained
[ ] Privacy Impact Assessment for high-risk processing
[ ] International transfer mechanism in place (SCCs)
[ ] Security measures documented and auditable
[ ] Employee training on data protection
[ ] Incident response plan tested
```

### Deployment Blockers

- No DPO appointed -> BLOCK (LGPD requirement)
- No breach notification capability -> BLOCK (3-day SLA is law)
- International transfers without SCCs -> BLOCK (grace period ended)
- Processing children's data without parental consent -> BLOCK
- No data subject rights mechanism -> BLOCK

---

## Cross-Reference Matrix: Which Framework Covers What

| Security Concern | OWASP | NIST CSF | Zero Trust | CIS | LGPD/ANPD | Breach Lessons |
|-----------------|-------|----------|------------|-----|-----------|----------------|
| Access Control | A01 | PROTECT | Core tenet | C5-6 | Art. 46 | #1 lesson |
| Configuration | A02 | PROTECT | - | C4 | - | HCA breach |
| Supply Chain | A03 | GOVERN | - | C15 | - | MOVEit, AT&T |
| Encryption | A04 | PROTECT | Tenet #2 | C3 | Art. 46 | - |
| Injection | A05 | - | - | C16 | - | - |
| Auth/MFA | A07 | PROTECT | Tenet #6 | C5-6 | Art. 46 | Top prevention |
| Logging | A09 | DETECT | Tenet #7 | C8 | Art. 50 | - |
| Incident Response | - | RESPOND | - | C17 | Res. 15 | - |
| Asset Inventory | - | IDENTIFY | Tenet #1 | C1-2 | - | - |
| Data Privacy | - | GOVERN | - | C3 | Core law | - |
| Vendor Security | A03 | GOVERN | - | C15 | Art. 39 | 36% of breaches |

---

## Sources

- [OWASP Top 10:2025](https://owasp.org/Top10/2025/)
- [GitLab OWASP Analysis](https://about.gitlab.com/blog/2025-owasp-top-10-whats-changed-and-why-it-matters/)
- [NIST CSF 2.0 Official](https://www.nist.gov/cyberframework)
- [CyberArk NIST CSF 2.0](https://www.cyberark.com/what-is/nist-csf-20/)
- [NIST SP 800-207](https://csrc.nist.gov/pubs/sp/800/207/final)
- [NIST ZTA Implementation Guide](https://pages.nist.gov/zero-trust-architecture/)
- [RiskRecon NIST 800-207](https://blog.riskrecon.com/understanding-nist-800-207)
- [CIS Controls v8](https://www.cisecurity.org/controls/v8)
- [CIS Controls List](https://www.cisecurity.org/controls/cis-controls-list)
- [ICLG Brazil Data Protection](https://iclg.com/practice-areas/data-protection-laws-and-regulations/brazil)
- [ComplyDog LGPD Guide](https://complydog.com/blog/brazil-lgpd-complete-data-protection-compliance-guide-saas)
- [InventiveHQ Breach Analysis](https://inventivehq.com/blog/the-biggest-us-data-breaches-of-20232025)
- [Varonis Breach Statistics](https://www.varonis.com/blog/data-breach-statistics)
- [Claude API Key Best Practices](https://support.claude.com/en/articles/9767949-api-key-best-practices-keeping-your-keys-safe-and-secure)
- [Claude Code Security](https://code.claude.com/docs/en/security)
- [Supabase Production Checklist](https://supabase.com/docs/guides/deployment/going-into-prod)
- [Supabase RLS Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [Supabase API Security](https://supabase.com/docs/guides/api/securing-your-api)
- [Production Readiness Checklist](https://goreplay.org/blog/production-readiness-checklist-20250808133113/)
- [IAPP ANPD Analysis](https://iapp.org/news/a/lessons-from-brazilian-dpa-sanctions-to-date)
- [Baker McKenzie Brazil DPA](https://resourcehub.bakermckenzie.com/en/resources/global-data-and-cyber-handbook/latin-america/brazil/topics/regulators-enforcement-priorities-and-penalties)
- [Saud Law ANPD 2024](https://www.saudlaw.com/overview-of-the-anpds-activities-in-2024-new-resolutions-and-enforcement-actions/)
