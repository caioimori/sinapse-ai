# Authentication Security Reference

## Purpose

Comprehensive reference for authentication and session security — OAuth 2.0/OIDC, MFA, passwordless, session management, JWT, and implementation patterns. Used by Breach (penetration-tester) for auth testing, and all agents for secure implementation guidance.

---

## Authentication Architecture Overview

Modern authentication has three layers:

```
Identity Provider (IdP)          Application Layer             Data Layer
[Entra ID / Okta / Supabase] → [JWT / Session Tokens] → [RLS / Authorization]
         ↑                              ↑                          ↑
    MFA/Passwordless            Secure storage                Per-row policies
```

---

## Password-Based Authentication

### Password Hashing — Required Algorithms

| Algorithm | Recommendation | Why |
|-----------|---------------|-----|
| **Argon2id** | Ideal (new projects) | Memory-hard, GPU/ASIC-resistant, OWASP recommended |
| **bcrypt** | Recommended (existing) | Battle-tested, widely supported in Node.js |
| **PBKDF2** | Acceptable | FIPS-compliant, use when bcrypt/Argon2 unavailable |
| **scrypt** | Acceptable | Memory-hard, good alternative to Argon2 |
| **MD5, SHA1, SHA256 (unsalted)** | PROHIBITED | Never use for passwords |

**bcrypt configuration:**
```javascript
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 12  // Minimum 10, 12 recommended for 2025+ hardware

// Hash
const hash = await bcrypt.hash(password, SALT_ROUNDS)

// Verify
const match = await bcrypt.compare(plaintext, hash)
```

**Argon2id configuration:**
```javascript
const argon2 = require('argon2')

// Hash
const hash = await argon2.hash(password, {
  type: argon2.argon2id,
  memoryCost: 65536,  // 64 MB
  timeCost: 3,        // 3 iterations
  parallelism: 4,     // 4 threads
})

// Verify
const valid = await argon2.verify(hash, plaintext)
```

### Password Policy (NIST SP 800-63B Aligned)

NIST 800-63B (2020+) significantly changed password policy recommendations:

| Recommendation | Detail |
|---------------|--------|
| Minimum length | 8 characters (15+ recommended for privileged accounts) |
| Maximum length | Allow up to 64+ characters |
| Complexity rules | Do NOT require special chars — use length instead |
| Password rotation | Do NOT force periodic rotation unless breach suspected |
| Check against breached list | YES — use HaveIBeenPwned API |
| Block common passwords | YES — top 100k passwords list |

```javascript
// Check against HaveIBeenPwned (k-anonymity model — password never leaves your system)
const crypto = require('crypto')

async function isPasswordPwned(password) {
  const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase()
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)
  
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`)
  const text = await response.text()
  
  return text.split('\n').some(line => line.startsWith(suffix))
}
```

---

## JWT (JSON Web Tokens)

### Security Configuration

| Property | Requirement | Detail |
|---------|-------------|--------|
| **Storage** | httpOnly cookie | NEVER localStorage — vulnerable to XSS |
| **Access token expiration** | 5–15 minutes | Short-lived — refreshable |
| **Refresh token expiration** | 7–30 days | Rotate on use |
| **Signing algorithm** | EdDSA or ES256 | Avoid RS256 for new projects; NEVER HS256 with weak secret |
| **Secret / Key size** | Min 64 characters or 2048-bit RSA | Cryptographically generated |
| **Transport** | HTTPS only | Never over HTTP |
| **Validation** | Signature + exp + iss + aud | Validate all claims server-side |

**Secure cookie configuration:**
```typescript
res.cookie('access_token', token, {
  httpOnly: true,      // Not accessible via JavaScript
  secure: true,        // HTTPS only
  sameSite: 'strict',  // Prevents CSRF
  maxAge: 15 * 60 * 1000, // 15 minutes
  path: '/',
})
```

**JWT validation (server-side):**
```typescript
import jwt from 'jsonwebtoken'

function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['ES256'],  // Explicit algorithm list
      issuer: 'https://myapp.com',
      audience: 'myapp-api',
    })
    return { valid: true, payload }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}
```

### JWT Anti-Patterns

| Anti-Pattern | Risk | Fix |
|-------------|------|-----|
| Storing in localStorage | XSS can steal token | Use httpOnly cookie |
| `alg: none` accepted | Authentication bypass | Explicitly require algorithm |
| No expiration | Stolen token valid forever | Always set `exp` |
| Sensitive data in payload | Payload is base64, not encrypted | Keep payload minimal |
| Long-lived access tokens | Large breach window | Keep to 5-15 minutes |

---

## Multi-Factor Authentication (MFA)

### MFA Types — Strength Hierarchy

| Type | Strength | Phishing Resistant | Use Case |
|------|---------|-------------------|---------|
| **FIDO2/Passkeys (WebAuthn)** | Highest | YES | Modern apps, high security |
| **TOTP (Google Auth, Authy)** | High | NO | Wide compatibility |
| **Push notifications** | High | NO (susceptible to fatigue) | Enterprise (with number matching) |
| **Hardware token (YubiKey)** | Very High | YES | Privileged access, admin accounts |
| **SMS OTP** | Low | NO | Last resort — SIM swap attacks |
| **Email OTP** | Low-Medium | NO | Better than SMS, acceptable fallback |

**MFA Implementation Pattern (Supabase):**
```typescript
// Enroll TOTP
const { data } = await supabase.auth.mfa.enroll({ factorType: 'totp' })
// data.totp.qr_code — display to user for scanning

// Challenge and verify
const { data: challenge } = await supabase.auth.mfa.challenge({ factorId })
const { data: verify } = await supabase.auth.mfa.verify({
  factorId,
  challengeId: challenge.id,
  code: userEnteredCode,
})
```

### MFA Enforcement Matrix

| Role | MFA Requirement | Enforcement |
|------|----------------|-------------|
| Admin accounts | FIDO2 or TOTP | Mandatory, enforce at login |
| Privileged operations | Step-up auth | Re-authenticate for sensitive actions |
| Regular users | TOTP encouraged | Offer enrollment, make it easy |
| API service accounts | None | Use API keys with rotation |
| CI/CD service accounts | None | OIDC federation to avoid static keys |

### MFA Bypass Attacks — Awareness

| Attack | Description | Defense |
|--------|-------------|---------|
| MFA fatigue (push bombing) | Flood user with push requests hoping they accept | Use number matching in push notifications |
| SIM swapping | Social-engineer mobile carrier to transfer phone number | Don't use SMS MFA for high-value accounts |
| OTP interception | Real-time phishing captures OTP | FIDO2/WebAuthn is phishing-resistant |
| SS7 attacks | Intercept SMS at network level | Avoid SMS for high security |

---

## Passwordless Authentication

### FIDO2 / WebAuthn / Passkeys

The strongest form of authentication — cryptographic proof with no shared secret.

**How it works:**
1. Device generates public/private key pair
2. Public key stored by application
3. Authentication: device signs a challenge with private key
4. Server verifies signature with public key
5. Private key never leaves the device

**Passkeys** are FIDO2 credentials that sync across devices via platform (iCloud Keychain, Google Password Manager). Provide phishing resistance with UX comparable to Touch ID / Face ID.

```javascript
// WebAuthn registration (simplified)
const credential = await navigator.credentials.create({
  publicKey: {
    challenge: serverChallenge,
    rp: { name: 'My App', id: 'myapp.com' },
    user: { id: userId, name: userEmail, displayName: userName },
    pubKeyCredParams: [
      { type: 'public-key', alg: -7 },   // ES256
      { type: 'public-key', alg: -257 }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: 'platform', // Use device authenticator
      requireResidentKey: true,
      userVerification: 'required',
    },
  }
})
```

### Magic Links

Email-based passwordless — user enters email, receives a one-time link.

**Security requirements:**
- Link must expire in 15-60 minutes
- Link must be single-use (invalidate after first click)
- Rate limit requests (1 per 60 seconds per email)
- Use secure random token (crypto.randomBytes(32))
- Transmit via HTTPS only

---

## OAuth 2.0 / OpenID Connect

### Flow Selection

| Flow | Use Case | Security Notes |
|------|---------|---------------|
| **Authorization Code + PKCE** | Web apps, SPAs, mobile | Current standard — always use PKCE |
| **Client Credentials** | Machine-to-machine | For services, not users |
| **Device Authorization** | TV/CLI/IoT | Limited input devices |
| **Implicit** | DEPRECATED | Never use — replaced by Auth Code + PKCE |
| **Resource Owner Password** | DEPRECATED | Never use unless legacy requirement |

**Authorization Code Flow with PKCE:**
```
1. App generates code_verifier (random 43-128 chars)
2. App computes code_challenge = base64url(sha256(code_verifier))
3. Redirect to IdP: ?response_type=code&code_challenge=X&code_challenge_method=S256
4. User authenticates at IdP
5. IdP redirects back with authorization code
6. App exchanges code for tokens, sending code_verifier
7. IdP verifies code_challenge matches code_verifier
```

### Token Handling

```typescript
// Store tokens securely — access token in memory, refresh token in httpOnly cookie
class TokenManager {
  private accessToken: string | null = null  // In memory only

  async refreshTokens(): Promise<void> {
    // Refresh token is in httpOnly cookie — browser sends it automatically
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include',  // Send cookies
    })
    const { access_token } = await response.json()
    this.accessToken = access_token
  }
}
```

---

## Session Management

### Session Security Requirements

| Requirement | Implementation |
|-------------|---------------|
| Session ID entropy | Minimum 128 bits (16 bytes) from cryptographically secure source |
| Session ID regeneration | Regenerate after login (prevents session fixation) |
| Session invalidation | Server-side invalidation on logout (not just clearing client cookie) |
| Inactivity timeout | 15-30 minutes for sensitive applications |
| Absolute timeout | 8-24 hours regardless of activity |
| Concurrent session control | Optional — limit active sessions per user |

```typescript
// Session regeneration after login
async function loginUser(req, res, userId) {
  // Regenerate session ID after authentication
  req.session.regenerate(async (err) => {
    if (err) throw err
    req.session.userId = userId
    req.session.loginTime = Date.now()
    req.session.save((err) => {
      if (err) throw err
      res.redirect('/dashboard')
    })
  })
}

// Secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,  // Min 64 chars
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 60 * 1000, // 30 minutes
  },
  store: new RedisStore({ client: redisClient }), // Server-side session storage
}))
```

---

## Rate Limiting for Authentication

All authentication endpoints must have strict rate limiting:

```javascript
const rateLimit = require('express-rate-limit')

// Login endpoint — 5 attempts per 15 minutes
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again in 15 minutes.' },
  skipSuccessfulRequests: true,  // Only count failed attempts
})

// Password reset — 3 per hour
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: { error: 'Too many password reset requests.' },
})

// MFA verification — 10 per 5 minutes
const mfaLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
})
```

---

## Authentication Audit Checklist

```
[ ] Passwords hashed with Argon2id or bcrypt (not MD5/SHA1)
[ ] JWT tokens stored in httpOnly cookies (not localStorage)
[ ] JWT expiration set: access tokens 5-15 min, refresh 7-30 days
[ ] JWT algorithm explicitly required (not 'alg: none' accepted)
[ ] MFA available and enforced for admin accounts
[ ] Rate limiting on login, reset, and MFA endpoints
[ ] Account lockout or progressive delay on repeated failures
[ ] Session regenerated after login
[ ] Session invalidated server-side on logout
[ ] OAuth 2.0 uses Authorization Code + PKCE (not Implicit flow)
[ ] Passwords checked against HaveIBeenPwned
[ ] No credentials in logs or error messages
[ ] HTTPS enforced — no authentication over HTTP
```

---

## Sources

- OWASP Authentication Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- NIST SP 800-63B (Digital Identity Guidelines): https://pages.nist.gov/800-63-3/sp800-63b.html
- JWT Best Practices: https://jwt.app/blog/jwt-best-practices/
- WebAuthn Guide: https://webauthn.guide/
- OWASP Session Management: https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
