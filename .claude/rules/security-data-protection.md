# Security & Data Protection (NON-NEGOTIABLE)

> **Constitution Article X — NON-NEGOTIABLE**
> Applies to ALL agents, ALL projects handling user data.
> Sources: OWASP Top 10, NIST CSF 2.0, CIS Controls v8, Zero Trust (SP 800-207),
> LGPD/ANPD, Supabase Security, Claude API Security, CRIABR Guide #0023,
> Historical breach analysis (Change Healthcare 192.7M, Ticketmaster 560M, 23andMe 6.9M)

## Rule

Every project that handles user data MUST follow these security practices from the first commit. No shortcuts, no "we'll add security later." Security is NOT a feature — it is the foundation.

## Pre-Deploy Gate — 25 Deployment Blockers

NENHUM projeto pode ir para producao sem passar por TODOS estes checks.
Os agentes DEVEM verificar e BLOQUEAR deploy se qualquer item falhar.

### TIER 1: ABSOLUTE BLOCKERS (deploy = impossivel)

| # | Blocker | Source | Check |
|---|---------|--------|-------|
| 1 | Tabela sem RLS ativado | Supabase, OWASP A01 | `SELECT tablename FROM pg_tables WHERE NOT rowsecurity` |
| 2 | API keys hardcoded no codigo | Claude API, CIS C3 | Hook: secret-scanning.cjs |
| 3 | service_role no frontend | Supabase | Grep: `service_role` em `src/`, `app/`, `pages/` |
| 4 | Sem MFA em contas admin/cloud/prod | Breach lessons, CIS C5-6 | Manual: verificar dashboard |
| 5 | APIs sem autenticacao | OWASP A01 | Review: todo endpoint precisa de auth middleware |
| 6 | SQL com string concatenation | OWASP A05 | Hook: sql-governance.py |
| 7 | Vulnerabilidades critical/high em deps | OWASP A03, CIS C7 | `npm audit --audit-level=high` |
| 8 | Secrets detectados no codebase | CIS C3 | `npx gitleaks detect` ou hook |
| 9 | Credenciais default em producao | OWASP A02 | Review: nenhum admin/admin, test/test |
| 10 | Sem TLS (dados em transito nao encriptados) | NIST CSF, Zero Trust | Verificar HTTPS forced |

### TIER 2: COMPLIANCE BLOCKERS (deploy = ilegal no Brasil)

| # | Blocker | Source |
|---|---------|--------|
| 11 | Sem DPO/Encarregado designado | LGPD Art. 41 |
| 12 | Sem capacidade de notificacao de breach (<3 dias) | LGPD Resolucao 15 |
| 13 | Sem mecanismo de consentimento | LGPD Art. 7-8 |
| 14 | Sem portal de direitos do titular | LGPD Art. 18 |
| 15 | Transferencia internacional sem SCCs | LGPD Art. 33 |
| 16 | Dados de criancas sem consentimento dos pais | LGPD Art. 14 |
| 17 | Sem politica de privacidade publicada | LGPD Art. 9 |

### TIER 3: OPERATIONAL BLOCKERS (deploy = irresponsavel)

| # | Blocker | Source |
|---|---------|--------|
| 18 | Sem inventario de ativos | CIS C1-2, NIST IDENTIFY |
| 19 | Sem logging centralizado | CIS C8, OWASP A09 |
| 20 | Sem plano de resposta a incidentes | CIS C17, NIST RESPOND |
| 21 | Sem verificacao de backup nos ultimos 90 dias | CIS C11 |
| 22 | Sem processo de vulnerability scanning | CIS C7, OWASP A03 |
| 23 | Sem segmentacao de rede | Zero Trust, breach lessons |
| 24 | Sem avaliacao de seguranca de vendors | NIST GOVERN, CIS C15 |
| 25 | Sem SSL enforcement no database | Supabase, NIST CSF |

**Licao #1 dos maiores vazamentos historicos:** A AUSENCIA DE MFA foi a causa raiz das maiores breaches de 2023-2025. MFA obrigatorio e o controle de maior ROI.

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
