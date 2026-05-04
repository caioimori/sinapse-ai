---
task: authentication-security-review
responsavel: "penetration-tester"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: auth_system_description
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: authorization
    tipo: text
    origem: "user input"
    obrigatorio: true
  - campo: auth_type
    tipo: enum
    origem: "user input"
    obrigatorio: false
    valores: ["session-based", "JWT", "OAuth2", "SAML", "passwordless", "multi-provider"]

Saida:
  - campo: auth_security_report
    tipo: document
    destino: "stakeholders, dev team"

Checklist:
  - "[ ] Verify authorization"
  - "[ ] Map complete authentication flow"
  - "[ ] Test credential policies"
  - "[ ] Assess session management"
  - "[ ] Test MFA implementation"
  - "[ ] Evaluate token security"
  - "[ ] Test account recovery flows"
  - "[ ] Score findings with CVSS"
---

# Task: Authentication Security Review

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Breach (penetration-tester)
- **Complexity:** Standard

## Objective

Conduct a thorough security review of an application's authentication system — including login flows, session management, MFA, token handling, account recovery, and credential policies. Identify weaknesses that could lead to unauthorized access.

> **AUTHORIZED TESTING ONLY:** Testing must be performed only on systems with explicit written authorization. Use only test accounts provided for this purpose. Never attempt to access real user accounts.

## Pre-Conditions

- Written authorization from system owner
- Test account credentials for multiple roles
- Understanding of the authentication architecture
- Access to authentication flow documentation

## Inputs

- Authentication system description and architecture
- Written authorization
- Auth type (session-based, JWT, OAuth2, SAML, passwordless)
- Test credentials for multiple user roles
- Authentication provider documentation (if third-party)

## Steps

### 1. Map Authentication Flows
Document every authentication path:
- Primary login (username/password, SSO, social login)
- MFA enrollment and verification
- Password reset and account recovery
- Account registration and email verification
- API authentication (keys, tokens, certificates)
- Remember me / persistent sessions

### 2. Test Credential Policies
| Test | Expected | Finding |
|------|----------|---------|
| Minimum password length | >= 12 characters | |
| Password complexity | Mix of character types | |
| Common password blocking | Top 10K blocked | |
| Breach database checking | Compromised passwords blocked | |
| Rate limiting on login | Lockout after N attempts | |
| Username enumeration | Consistent error messages | |

### 3. Assess Session Management
- Session ID entropy and randomness
- Session fixation resistance
- Session timeout (idle and absolute)
- Concurrent session handling
- Session invalidation on logout
- Session invalidation on password change
- Cookie attributes (Secure, HttpOnly, SameSite)

### 4. Test MFA Implementation
- MFA bypass techniques (parameter manipulation, race conditions)
- Recovery code security
- MFA enrollment process security
- Fallback authentication when MFA unavailable
- MFA fatigue resistance (push notification limits)
- Time-based OTP (TOTP) window validation

### 5. Evaluate Token Security (JWT/OAuth)
For JWT-based authentication:
- Algorithm confusion attacks (none, HS256 vs RS256)
- Token expiration enforcement
- Token revocation capabilities
- Signature validation
- Claims validation (iss, aud, exp, nbf)
- Key rotation practices

For OAuth2:
- Authorization code flow security
- PKCE implementation
- Redirect URI validation
- State parameter usage
- Token storage security

### 6. Test Account Recovery
- Password reset token entropy and expiration
- Password reset link reuse prevention
- Account recovery question security
- Email/SMS verification bypass
- Account takeover via recovery flow
- Recovery flow rate limiting

### 7. Test Account Lockout and Brute Force Protection
- Lockout threshold and duration
- Lockout bypass techniques
- Distributed brute force resistance
- CAPTCHA implementation quality
- IP-based vs account-based lockout
- Lockout notification to account owner

### 8. Test Privilege Escalation via Authentication
- Role manipulation in tokens/cookies
- Authentication bypass via parameter tampering
- Forced browsing to authenticated pages
- Session hijacking resistance
- Cross-site request forgery (CSRF) on auth endpoints

### 9. Review Credential Storage
Assess (via documentation or code review):
- Password hashing algorithm (bcrypt, Argon2, scrypt)
- Salt implementation (unique per user)
- Key derivation function parameters
- Secrets management for API keys and tokens

### 10. Compile Authentication Security Report
Document all findings with severity ratings, evidence, and remediation specific to the authentication technology in use.

## Output

```yaml
auth_security_report:
  application: ""
  auth_type: ""
  date: ""
  authorization: "confirmed"

  findings_summary:
    critical: 0
    high: 0
    medium: 0
    low: 0

  auth_flow_coverage:
    login: "[tested/not-tested]"
    mfa: "[tested/not-tested/not-applicable]"
    password_reset: "[tested/not-tested]"
    session_management: "[tested/not-tested]"
    token_security: "[tested/not-tested]"
    account_lockout: "[tested/not-tested]"

  findings:
    - title: ""
      category: ""
      cvss: 0.0
      evidence: ""
      remediation: ""

  overall_auth_rating: "[strong/adequate/weak/critical]"
```

## Quality Criteria

- [ ] Written authorization verified
- [ ] All authentication flows mapped and tested
- [ ] Session management thoroughly assessed
- [ ] MFA implementation tested for bypass
- [ ] Token security evaluated (JWT/OAuth)
- [ ] Account recovery flow tested for takeover
- [ ] All findings include CVSS scores and evidence
- [ ] Remediation specific to the auth technology
