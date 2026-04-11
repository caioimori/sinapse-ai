# Security Pre-Deploy Checklist

> **Agente(s):** @quality-gate (Quinn), @cyber-orqx (Fortress)
> **Fonte:** security-hardening-enterprise.md
> **Uso:** Executar ANTES de cada deploy para producao. Checklist tiered por maturidade do projeto.

---

## 1. Checklist por Tier

### Tier MVP (10 items) -- Minimo absoluto para ir ao ar

- [ ] **RLS ativado** em TODAS as tabelas com dados de usuario
- [ ] **service_role** NAO exposto no frontend (grep: `service_role` em `src/`, `app/`, `pages/`)
- [ ] **API keys** nao hardcoded no codigo (scan: `npx gitleaks detect --source=.`)
- [ ] **HTTPS** forcado (HSTS header configurado)
- [ ] **Input validation** com Zod/Joi em todos os endpoints
- [ ] **Rate limiting** em endpoints de auth (max 5 req/15min)
- [ ] **CORS** restrito a origens conhecidas (nunca `origin: '*'`)
- [ ] **npm audit** sem vulnerabilidades critical/high (`npm audit --audit-level=high`)
- [ ] **.env** no .gitignore + `.env.example` commitado com placeholders
- [ ] **Senhas/tokens default** removidos (nenhum admin/admin, test/test)

### Tier Growth (+10 items = 20 total)

- [ ] **MFA ativado** em contas admin/cloud/prod (licao #1 dos maiores breaches)
- [ ] **Security headers** configurados (helmet ou next.config.js)
- [ ] **NEXT_PUBLIC_** nao contem secrets (grep em `.env*`)
- [ ] **Parameterized queries** em todo SQL (nunca string concatenation)
- [ ] **Error handling** seguro (sem stack traces em producao)
- [ ] **JWT** com expiracao curta (access: 15-30min, refresh: 7-14 dias)
- [ ] **Cookie** de sessao: httpOnly, secure, sameSite strict
- [ ] **Dependabot/Renovate** configurado para PRs automaticos
- [ ] **Branch protection** ativa em main (require PR + review)
- [ ] **Secret scanning** habilitado no GitHub

### Tier Enterprise (+15 items = 35 total)

- [ ] **WAF** configurado (Cloudflare WAF ou AWS WAF com CRS)
- [ ] **SAST** no CI/CD (Semgrep ou CodeQL em PRs)
- [ ] **SCA** com behavioral analysis (Socket.dev)
- [ ] **DAST** contra staging (OWASP ZAP em CI)
- [ ] **SBOM** gerado e atualizado (`npm sbom --sbom-format cyclonedx`)
- [ ] **GitHub Actions** pinned por hash (nao por tag)
- [ ] **LGPD** compliance (consentimento, portal de direitos, DPO designado)
- [ ] **Logging** centralizado de falhas de autorizacao
- [ ] **Backup** verificado nos ultimos 90 dias
- [ ] **Incident response** plan documentado
- [ ] **KMS** com keys separadas por servico
- [ ] **VPC/Network** segmentado (public/private subnets)
- [ ] **GuardDuty** ou equivalente em todas as contas
- [ ] **Passkeys/WebAuthn** como opcao de autenticacao
- [ ] **SRI** (Subresource Integrity) em scripts externos

---

## 2. OWASP Top 10:2025 -- Quick-Fix Patterns

### A01: Broken Access Control (#1)

```javascript
// PROIBIDO: Confiar em parametros do client
app.get('/api/users/:id', (req, res) => {
  const profile = await db.getUserProfile(req.params.id); // IDOR!
});

// CORRETO: Validar ownership
app.get('/api/users/:id', authenticate, (req, res) => {
  if (req.params.id !== req.user.id && !req.user.roles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const profile = await db.getUserProfile(req.params.id);
});
```

```sql
-- RLS obrigatorio em Supabase
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own" ON user_profiles FOR SELECT
    USING ((SELECT auth.uid()) = user_id);
```

### A02: Security Misconfiguration (#2 -- subiu de #5)

```javascript
// PROIBIDO: Stack traces em producao
res.status(500).json({ error: err.stack });

// CORRETO: Mensagem generica + log interno
logger.error('Internal error', { error: err.message, requestId: req.id });
res.status(500).json({ error: 'Internal server error', requestId: req.id });
```

```javascript
// next.config.js -- desabilitar headers reveladores
module.exports = {
  poweredByHeader: false,
  headers: async () => [{
    source: '/:path*',
    headers: [
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
    ],
  }],
};
```

### A03: Supply Chain Failures (NOVA)

```bash
# CI: usar npm ci (NUNCA npm install)
npm ci

# Pinnar GitHub Actions por hash
- uses: actions/checkout@b4ffde65f46336ab88eb53be808477a3936bae11 # v4.1.1

# Verificar integridade de scripts externos (SRI)
```

```html
<script
  src="https://cdn.example.com/analytics.js"
  integrity="sha384-oqVuAfXRKap7fdgcCY5uykM6+..."
  crossorigin="anonymous"
></script>
```

### A05: Injection (#5)

```javascript
// PROIBIDO: SQL Injection
const query = `SELECT * FROM users WHERE email = '${userInput}'`;

// CORRETO: Parameterized
const query = 'SELECT * FROM users WHERE email = $1';
await db.query(query, [userInput]);

// Supabase: ja parametrizado
const { data } = await supabase.from('users').select('*').eq('email', userInput);
```

### A07: Authentication Failures

```javascript
// Rate limiting em login (anti brute-force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 5,
  keyGenerator: (req) => req.body.email || req.ip,
});
app.post('/api/auth/login', authLimiter, loginHandler);
```

---

## 3. Supply Chain Security Checks

### Ferramentas por Fase

| Fase | Ferramenta | Comando/Config |
|------|-----------|----------------|
| Pre-commit | gitleaks | `npx gitleaks detect --source=.` |
| PR | npm audit | `npm audit --audit-level=high` |
| PR | Socket.dev | GitHub App (automatico) |
| Merge | CodeQL | GitHub Advanced Security |
| Continuous | Dependabot/Renovate | `.github/dependabot.yml` |

### npm audit no CI

```bash
# OBRIGATORIO: falhar build se vulnerabilidades critical/high
npm audit --audit-level=high

# Gerar SBOM
npm sbom --sbom-format cyclonedx > sbom.json
```

### Dependabot Config Minimo

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "team/devs"
```

### Lockfile Integrity

```json
// package.json -- versoes exatas (nao ranges)
{
  "dependencies": {
    "express": "4.21.2",    // exato
    "lodash": "~4.17.21"   // patch only
  }
}
```

**Regra:** SEMPRE usar `npm ci` no CI. NUNCA `npm install` (pode atualizar lockfile).

---

## 4. LGPD Compliance Checklist (Lei Brasileira)

- [ ] **Consentimento** explicito antes de coletar dados pessoais (Art. 7-8)
- [ ] **Portal de direitos** do titular: acesso, correcao, exclusao (Art. 18)
- [ ] **DPO/Encarregado** designado (Art. 41)
- [ ] **Politica de privacidade** publicada e acessivel (Art. 9)
- [ ] **Notificacao de breach** em ate 3 dias uteis (Resolucao 15)
- [ ] **Data retention** com periodos definidos e documentados
- [ ] **Transferencia internacional** com SCCs se aplicavel (Art. 33)
- [ ] **Dados de criancas** com consentimento dos pais (Art. 14)
- [ ] **Audit logging** de todo acesso a dados pessoais
- [ ] **Anonimizacao** de dados em ambientes de staging/dev

---

## 5. Secret Scanning Commands

```bash
# Gitleaks -- detectar secrets no historico git
npx gitleaks detect --source=. --verbose

# Verificar secrets em arquivos staged
npx gitleaks protect --staged

# npm provenance -- verificar origem de pacotes
npm audit signatures

# Grep manual por patterns comuns
# (usar Grep tool, nao bash grep)
# Patterns: sk_live_, sk_test_, AKIA, ghp_, gho_
```

### Patterns de Secrets para Detectar

| Pattern | Tipo | Risco |
|---------|------|-------|
| `sk_live_` | Stripe Secret Key | Critico |
| `sk_test_` | Stripe Test Key | Alto |
| `AKIA` | AWS Access Key | Critico |
| `ghp_` / `gho_` | GitHub Personal/OAuth Token | Alto |
| `eyJ` (base64 JWT) | JWT hardcoded | Alto |
| `-----BEGIN RSA` | Private key | Critico |
| `service_role` | Supabase service key | Critico |
| `mongodb+srv://` com senha | MongoDB conn string | Critico |

---

## 6. RLS Validation Queries

```sql
-- Verificar tabelas SEM RLS (BLOCKER)
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename NOT IN ('_prisma_migrations', 'schema_migrations')
  AND NOT rowsecurity;

-- Verificar tabelas com RLS mas SEM policies (falso senso de seguranca)
SELECT t.tablename
FROM pg_tables t
LEFT JOIN pg_policies p ON t.tablename = p.tablename
WHERE t.schemaname = 'public'
  AND t.rowsecurity = true
GROUP BY t.tablename
HAVING COUNT(p.policyname) = 0;

-- Listar todas as policies ativas
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;
```

---

## 7. API Security Headers Checklist

### Headers Obrigatorios

| Header | Valor | Funcao |
|--------|-------|--------|
| `Content-Security-Policy` | Strict com nonces | Previne XSS |
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` | Forca HTTPS |
| `X-Frame-Options` | `DENY` | Previne clickjacking |
| `X-Content-Type-Options` | `nosniff` | Previne MIME sniffing |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Controla referer |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | Restringe browser APIs |

### Implementacao com helmet

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://cdn.myapp.com'],
      connectSrc: ["'self'", 'https://api.myapp.com', 'https://*.supabase.co'],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
  strictTransportSecurity: { maxAge: 63072000, includeSubDomains: true, preload: true },
  xFrameOptions: { action: 'deny' },
}));
```

---

## 8. Rate Limiting por Endpoint

| Endpoint | Limite | Janela | Justificativa |
|----------|--------|--------|---------------|
| Login/Register | 5 req | 15 min | Anti brute-force |
| Password reset | 3 req | 1 hora | Anti abuso |
| API geral (auth) | 100 req | 1 min | Uso normal |
| API geral (public) | 30 req | 1 min | Prevenir abuso |
| Upload | 10 req | 1 hora | Recursos custosos |
| Webhook | 1000 req | 1 min | Volume alto esperado |

---

## 9. Input Validation Pattern (Zod)

```typescript
import { z } from 'zod';

const CreateUserSchema = z.object({
  email: z.string().email().max(255).transform(v => v.toLowerCase().trim()),
  name: z.string().min(2).max(100),
  role: z.enum(['viewer', 'editor', 'admin']).default('viewer'),
});

app.post('/api/users', async (req, res) => {
  const result = CreateUserSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({ error: 'Validation failed', details: result.error.flatten() });
  }
  const user = await createUser(result.data);
  res.json(user);
});
```

---

## 10. CI/CD Security Pipeline (GitHub Actions)

```yaml
name: Security Scanning
on:
  pull_request:
    branches: [main]

jobs:
  sast:
    runs-on: ubuntu-latest
    container: { image: semgrep/semgrep }
    steps:
      - uses: actions/checkout@v4
      - run: semgrep scan --config auto --sarif --output semgrep.sarif

  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit --audit-level=high

  secrets:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { fetch-depth: 0 }
      - uses: gitleaks/gitleaks-action@v2
```

---

## 11. Auth Best Practices Quick-Reference

| Pratica | Recomendacao |
|---------|-------------|
| Algoritmo JWT | RS256 (assimetrico) |
| Access token TTL | 15-30 minutos |
| Refresh token TTL | 7-14 dias |
| Storage browser | httpOnly cookie (NUNCA localStorage) |
| MFA recomendado | Passkeys > TOTP > Push > SMS |
| OAuth flow | Authorization Code + PKCE (sempre) |
| Implicit flow | NUNCA usar (deprecated) |
| Key rotation | A cada 90 dias |

---

## 12. Cross-References

- Infrastructure security por tier: ver `infrastructure-decision-framework.md`
- Secrets management tools: ver `environment-deployment-patterns.md`
- RLS optimization patterns: ver `database-scaling-patterns.md`
- Constitution Article X (Security): ver `.claude/rules/security-data-protection.md`
