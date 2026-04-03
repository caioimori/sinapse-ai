# Security & Data Protection (NON-NEGOTIABLE)

> **Constitution Article X — NON-NEGOTIABLE**
> Applies to ALL agents, ALL projects handling user data.
> Source: SINAPSE Cyber Squad + CRIABR Security Guide #0023

## Rule

Every project that handles user data MUST follow these security practices from the first commit. No shortcuts, no "we'll add security later."

## Database Security

### RLS (Row Level Security) — MANDATORY
```sql
-- EVERY table with user data must have RLS enabled
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Policy: users only see their own data
CREATE POLICY "users_own_data"
ON {table_name}
FOR ALL
USING (auth.uid() = user_id);
```

### service_role — NEVER in frontend
| Key | Where | What |
|-----|-------|------|
| `anon` | Frontend/client | Respects RLS policies |
| `service_role` | Server ONLY | Bypasses RLS — full access |

### SQL Injection — ALWAYS parameterize
```javascript
// FORBIDDEN: string interpolation
db.query(`SELECT * FROM users WHERE name = '${input}'`);

// REQUIRED: parameterized queries
db.query('SELECT * FROM users WHERE name = $1', [input]);

// Supabase: already parameterized
supabase.from('users').select('*').eq('name', input);
```

### Least Privilege
- Each service uses a dedicated role with minimal permissions
- Read-only services get SELECT only
- Never connect with postgres superuser from application code

## API Security

### Rate Limiting — MANDATORY
```javascript
// Every public API must have rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
});

// Stricter for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // Only 5 login attempts per window
});
```

### Input Validation — MANDATORY
```javascript
// Use Zod or equivalent for ALL inputs
const schema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

const result = schema.safeParse(input);
if (!result.success) return res.status(400).json(result.error);
```

### CORS — RESTRICT origins
```javascript
// FORBIDDEN in production
app.use(cors({ origin: '*' }));

// REQUIRED: explicit origins
app.use(cors({
  origin: ['https://myapp.com', 'https://api.myapp.com'],
  credentials: true,
}));
```

### Security Headers — helmet
```javascript
app.use(helmet()); // Sets X-Frame-Options, CSP, HSTS, etc.
```

## Secrets Management

### .env rules
- `.env` files MUST be in `.gitignore` — NEVER committed
- `.env.example` MUST exist with placeholder values
- `NEXT_PUBLIC_*` variables are PUBLIC — never put secrets in them
- Rotate keys immediately on any suspected leak

### Platform secrets
| Platform | Where to store |
|----------|---------------|
| Vercel | Environment Variables in dashboard |
| Supabase | Vault or Edge Function secrets |
| AWS | Secrets Manager or Parameter Store |
| GitHub | Repository Secrets (Settings > Secrets) |

## LGPD Compliance

### Required for ALL projects with Brazilian user data
- Consent collection before processing personal data (Art. 7)
- User rights: access, correct, delete their data (Art. 18)
- DPO/Encarregado designation (Art. 37)
- Technical security measures (Art. 46)
- Breach notification to ANPD + data subjects (Art. 48)
- Data retention period defined and documented
- Audit logging for all personal data access

## Security Checklist (verify before EVERY deploy)

### Database
- [ ] RLS enabled on ALL tables with user data
- [ ] service_role NOT exposed in frontend code
- [ ] All queries parameterized (no string interpolation)
- [ ] Sensitive data encrypted at rest (pgcrypto or equivalent)
- [ ] Database roles follow least privilege principle

### APIs
- [ ] Rate limiting on all public endpoints
- [ ] Auth endpoints have stricter rate limits
- [ ] Input validation with schema (Zod/Joi)
- [ ] CORS restricted to known origins
- [ ] Security headers active (helmet)

### Secrets
- [ ] .env in .gitignore
- [ ] .env.example exists with placeholders
- [ ] No NEXT_PUBLIC_ with secrets
- [ ] No hardcoded keys in source code
- [ ] git-secrets or truffleHog scan ran

### GitHub
- [ ] Repository is private (for production code)
- [ ] Branch protection active on main
- [ ] GitHub Secret Scanning enabled
- [ ] Dependabot configured
- [ ] CODEOWNERS protects critical files
- [ ] CI/CD uses GitHub Secrets (not hardcoded)

### LGPD
- [ ] Consent form with explicit opt-in
- [ ] Data deletion endpoint/mechanism exists
- [ ] DPO/Encarregado designated
- [ ] Privacy policy published and accessible
- [ ] Breach notification procedure documented
- [ ] Data retention periods defined

## Delegation

Security work MUST be delegated to the appropriate specialist:

| Request | Delegate To |
|---------|-------------|
| Threat modeling | @cyber-orqx → Shield |
| Penetration testing | @cyber-orqx → Breach |
| Incident response | @cyber-orqx → Rapid |
| LGPD/compliance | @cyber-orqx → Govern |
| Cloud security | @cyber-orqx → Nimbus |
| Database security/RLS | @data-engineer (Dara) |
| Application security | @developer (Dex) |

## Anti-Patterns (FORBIDDEN)

- Using superuser credentials in application code
- Disabling RLS "temporarily" (it never gets re-enabled)
- Hardcoding API keys "just for testing"
- Using `origin: '*'` in CORS
- Skipping input validation on "internal" APIs
- Storing passwords in plain text
- Logging personal data (PII) without masking
- "We'll add security later" — security is from day one
