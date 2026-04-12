# OWASP Top 10 Reference — 2025 Edition

## Purpose

Complete OWASP Top 10 2025 reference with mitigations, code examples, and detection tools. Used by Breach (penetration-tester), Govern (compliance-officer), and any agent performing security review.

**Source authority:** OWASP Foundation — owasp.org/Top10/2025/
**Last updated in KB:** April 2026

---

## What Changed from 2021 to 2025

| # | 2025 | Change from 2021 |
|---|------|-----------------|
| A01 | Broken Access Control | Maintained — still #1 (94% of apps tested) |
| A02 | Security Misconfiguration | Rose from #5 to #2 |
| A03 | Software Supply Chain Failures | EXPANDED from "Vulnerable and Outdated Components" — npm attacks of 2025 drove this |
| A04 | Cryptographic Failures | Maintained |
| A05 | Injection | Maintained — SQL, NoSQL, OS Command, LDAP |
| A06 | Insecure Design | Maintained |
| A07 | Authentication Failures | Maintained |
| A08 | Software or Data Integrity Failures | Maintained — CI/CD pipelines, unsigned updates |
| A09 | Security Logging and Alerting Failures | Renamed (was "Insufficient Logging & Monitoring") |
| A10 | Mishandling of Exceptional Conditions | NEW — fail-open behaviors, stack traces exposed |

---

## A01 — Broken Access Control

**Prevalence:** 94% of applications tested had some form of broken access control.

**What it is:** A user can access resources, data, or functions they should not have permission to. Includes IDOR (Insecure Direct Object Reference), privilege escalation, forced browsing, JWT manipulation.

**Attack examples:**
- Changing `?user_id=123` to `?user_id=456` to access another user's data
- Accessing admin endpoints without admin role
- Manipulating JWT claims to elevate privileges

**Code — Wrong vs Right:**
```typescript
// WRONG: trusts parameter without authorization check
app.get('/api/users/:id', async (req, res) => {
  const user = await db.getUser(req.params.id)
  res.json(user) // Anyone can access any user
})

// RIGHT: verify caller owns the resource
app.get('/api/users/:id', async (req, res) => {
  if (req.params.id !== req.user.id && !req.user.isAdmin) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  const user = await db.getUser(req.params.id)
  res.json(user)
})
```

**Mitigations:**
- Deny access by default — allowlist, not denylist
- Implement access control at the server, not client
- Use Row Level Security (RLS) in databases (Supabase pattern)
- Log access control failures and alert on suspicious patterns
- Rate limit API endpoints to prevent automated enumeration

---

## A02 — Security Misconfiguration

**Prevalence:** Rose significantly in 2025. Encompasses cloud misconfigurations, default credentials, verbose error messages, unnecessary features enabled.

**Attack examples:**
- Default admin credentials unchanged (admin/admin)
- S3 bucket / Azure Blob with public access enabled
- Verbose stack traces returned in API responses
- Development debug endpoints left enabled in production
- CORS set to `*` (wildcard)

**Mitigations:**
- Implement a repeatable hardening process — infrastructure as code (IaC) enforces baseline
- Remove unused features, frameworks, components
- Review and update security configurations as part of patch management
- Use automated scanning (Scout Suite for AWS, Prowler for multi-cloud)
- Never expose stack traces to end users

**Security Headers (mandatory in production):**
```
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}'; frame-ancestors 'none';
```

---

## A03 — Software Supply Chain Failures

**CRITICAL 2025 CONTEXT:** Real-world attacks that drove this category's expansion:

| Date | Package | Weekly Downloads | Attack Vector |
|------|---------|-----------------|---------------|
| Sep 2025 | debug, chalk + 16 others | 2.6 billion total | Maintainer phishing |
| Mar 2026 | Axios | 100M+ | Credential theft (North Korean APT) |

**What it is:** Compromised dependencies, typosquatting packages, malicious maintainer takeovers, unsigned artifacts.

**Mandatory defenses:**
```bash
# Always use lockfile in CI — npm ci respects lockfile exactly
npm ci  # NOT npm install

# Audit regularly
npm audit --audit-level=high

# Pin exact versions in package.json — no caret operators
"dependencies": {
  "axios": "1.7.2"  # exact, not "^1.7.2"
}

# Configure Dependabot for weekly automated updates
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"

# Detect secrets in code
npx gitleaks detect

# 7-day cooldown: do not immediately adopt newly published versions
```

**SBOM (Software Bill of Materials):** Generate and maintain an SBOM so you can instantly answer "does our app use vulnerable-library-X?" when a CVE drops. Tools: Syft (Anchore), CycloneDX CLI, grype for scanning.

---

## A04 — Cryptographic Failures

**What it is:** Data transmitted or stored without encryption, weak algorithms, poor key management.

**Attack examples:**
- Passwords stored as plain text or MD5
- Sensitive data transmitted over HTTP
- Private keys committed to repositories
- Use of deprecated algorithms (DES, RC4, MD5 for integrity)

**Algorithm guidance:**

| Use Case | Recommended | Deprecated (Do Not Use) |
|----------|-------------|------------------------|
| Password hashing | Argon2id, bcrypt, PBKDF2 | MD5, SHA1, unsalted SHA2 |
| Symmetric encryption | AES-256-GCM, ChaCha20-Poly1305 | DES, 3DES, RC4 |
| Asymmetric | RSA-4096, ECDSA-P256, Ed25519 | RSA-1024, DSA |
| TLS | 1.2 (minimum), 1.3 (recommended) | SSLv3, TLS 1.0, TLS 1.1 |
| Hashing (non-password) | SHA-256, SHA-3 | MD5, SHA1 |
| Key exchange | ECDH, X25519 | DH < 2048-bit |

**Mitigations:**
- Classify data and apply protection levels (TLS in transit, AES at rest)
- Do not cache sensitive data unnecessarily
- Store passwords using a modern hashing algorithm with salting
- Disable deprecated TLS protocol versions at the load balancer/reverse proxy

---

## A05 — Injection

**What it is:** Untrusted data sent to an interpreter as part of a command or query. SQL, NoSQL, OS command, LDAP, XPath, XML injection.

**Code — SQL Injection:**
```javascript
// FORBIDDEN: string interpolation creates SQL injection vector
const query = `SELECT * FROM users WHERE name = '${userInput}'`

// REQUIRED: parameterized queries
const query = 'SELECT * FROM users WHERE name = $1'
const result = await db.query(query, [userInput])

// Supabase: already parameterized — safe
const { data } = await supabase.from('users').select('*').eq('name', userInput)
```

**Mitigations:**
- Use parameterized queries or ORMs — never string concatenation
- Validate and sanitize all user input with a schema (Zod, Joi)
- Apply least privilege on database accounts — app user should not have DROP or DDL rights
- Use WAF rules for SQL injection patterns as defense-in-depth

---

## A06 — Insecure Design

**What it is:** Design flaws, not implementation bugs. Missing threat modeling, no rate limits on sensitive flows, missing security requirements from the start.

**Examples:**
- A password reset flow that lacks rate limiting or account enumeration protection
- A multi-tenant application where tenant isolation is not a design requirement
- An API that leaks internal IDs enabling enumeration attacks

**Mitigations:**
- Threat model before coding — use STRIDE framework
- Define security requirements alongside functional requirements
- Implement rate limiting on all sensitive endpoints (auth, password reset, payment)
- Adopt secure design patterns: defense in depth, fail securely, least privilege

---

## A07 — Authentication Failures

**What it is:** Weaknesses in authentication and session management. Brute force, session hijacking, credential stuffing, weak tokens.

**JWT Security Best Practices:**

| Practice | Detail |
|---------|--------|
| Storage | httpOnly cookies — NEVER localStorage (XSS vulnerable) |
| Expiration | Access token: 5-15 min. Refresh token: 7-30 days |
| Algorithm | EdDSA (preferred) or ES256. Avoid RS256 for new projects |
| Secret | Minimum 64 characters, cryptographically generated |
| Transport | HTTPS only — never send tokens over HTTP |
| Validation | Always verify signature, exp, iss, aud server-side |

**Password hashing:**

| Algorithm | Recommendation | Notes |
|-----------|---------------|-------|
| Argon2id | Ideal | Most modern, GPU-resistant |
| bcrypt | Recommended | Most common in Node.js |
| PBKDF2 | Acceptable | When bcrypt/Argon2 unavailable |
| MD5/SHA1 | PROHIBITED | Never use for passwords |

**Session management requirements:**
- Generate session IDs with at least 64 bits of entropy
- Regenerate session ID after successful authentication (prevents session fixation)
- Invalidate sessions both client-side and server-side on logout
- Implement inactivity timeout

---

## A08 — Software and Data Integrity Failures

**What it is:** Assumptions about software updates, critical data, and CI/CD pipelines without integrity verification. Includes insecure deserialization.

**Examples:**
- CI/CD pipeline that can be poisoned via unprotected secrets
- Application downloading unsigned/unverified plugins or updates
- Deserializing objects from untrusted sources (Java serialization, pickle)

**Mitigations:**
- Use digital signatures for code releases (Sigstore, GPG)
- Ensure packages come from trusted registries with integrity checking
- Protect CI/CD pipeline — secrets stored in vault, branch protections on main
- Do not deserialize objects from untrusted sources without validation

---

## A09 — Security Logging and Alerting Failures

**What it is:** Insufficient logging means breaches go undetected. Average breach dwell time without good logging: 287 days (IBM Cost of Data Breach 2025).

**What you must log:**
- Authentication events (login, logout, failures)
- Access control failures
- Input validation failures
- High-value transactions
- Admin operations

**What you must NOT log:**
- Passwords or password hashes
- Session tokens or API keys
- Credit card numbers or PII (mask if needed)
- Full request bodies containing sensitive data

**Alerting requirements:**
- Alert on brute force patterns (5+ failed logins from same IP in 10 minutes)
- Alert on access control failures from authenticated users
- Alert on spikes in 4xx/5xx error rates
- Alert on mass data exports or downloads

---

## A10 — Mishandling of Exceptional Conditions (NEW in 2025)

**What it is:** Applications that fail-open (grant access when error occurs) or expose internal details in error messages. Stack traces reveal file paths, database schema, framework versions.

**Code — Wrong vs Right:**
```typescript
// WRONG: exposes internal stack trace
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.stack }) // NEVER do this
  }
})

// RIGHT: fail-closed, detailed internal log, generic external message
app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData()
    res.json(data)
  } catch (error) {
    console.error('Internal error:', error) // detailed internal log
    res.status(500).json({ error: 'Internal server error' }) // generic external
  }
})
```

**Mitigations:**
- Implement global error handler that never leaks internal details
- Use structured logging for internal details, generic messages for clients
- Test error paths explicitly — ensure they fail-closed (deny access on error)
- Remove default error pages that expose framework/server versions

---

## Detection Tools Mapping

| OWASP Category | SAST | DAST | SCA |
|---------------|------|------|-----|
| A01 Broken Access Control | Semgrep, CodeQL | Burp Suite, ZAP | — |
| A02 Misconfiguration | Checkov, Prowler | Scout Suite, ZAP | — |
| A03 Supply Chain | — | — | Snyk, Dependabot, Grype |
| A04 Crypto Failures | Semgrep, SonarQube | SSLyze | — |
| A05 Injection | Semgrep, CodeQL | Burp Suite, SQLmap | — |
| A06 Insecure Design | Manual review | Threat modeling | — |
| A07 Auth Failures | Semgrep | Burp Suite, Hydra | — |
| A08 Integrity Failures | — | — | Cosign, Syft |
| A09 Logging Failures | Manual review | Log analysis | — |
| A10 Exception Handling | Semgrep | Manual testing | — |

---

## OWASP API Security Top 10 (2023 — still current)

For API-specific security testing, use the parallel API Security Top 10:

| # | Category | Key Risk |
|---|----------|---------|
| API1 | Broken Object Level Authorization (BOLA) | Accessing other users' objects by ID |
| API2 | Broken Authentication | Weak/missing auth on API endpoints |
| API3 | Broken Object Property Level Authorization | Over-exposure of object properties |
| API4 | Unrestricted Resource Consumption | No rate limiting on resource-intensive endpoints |
| API5 | Broken Function Level Authorization | Users accessing admin functions |
| API6 | Unrestricted Access to Sensitive Business Flows | Automated abuse of business logic |
| API7 | Server-Side Request Forgery | API calls forged to internal resources |
| API8 | Security Misconfiguration | Default configs, verbose errors |
| API9 | Improper Inventory Management | Shadow APIs, undocumented endpoints |
| API10 | Unsafe Consumption of APIs | Trusting third-party APIs without validation |

---

## Sources

- OWASP Top 10 2025: https://owasp.org/Top10/2025/
- OWASP API Security Top 10 2023: https://owasp.org/API-Security/
- OWASP Testing Guide v4.2: https://owasp.org/www-project-web-security-testing-guide/
- OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
