# Environment & Deployment Patterns

> **Agente(s):** @devops (Pipeline)
> **Fonte:** environment-secrets-management.md, gitflow-branching-at-scale.md
> **Uso:** Consultar ao configurar ambientes, secrets, CI/CD e branching strategy para projetos SINAPSE

---

## 1. Tiers de Ambientes Padrao

### Para Startups (1-10 devs) -- 3 ambientes

| Ambiente | Branch | Vercel | Supabase | Dados |
|----------|--------|--------|----------|-------|
| Local | qualquer | `vercel dev` | Supabase CLI (local) | Seed/mock |
| Preview | PR branches | Auto (por PR) | Projeto de staging | Sinteticos |
| Production | `main` | Production deploy | Projeto de producao | Reais |

### Para Scale-ups (10-50 devs) -- 4 ambientes

| Ambiente | Branch | Vercel | Supabase | Dados |
|----------|--------|--------|----------|-------|
| Local | qualquer | `vercel dev` | CLI local | Seed/mock |
| Preview | PR branches | Preview deploy | Staging project | Sinteticos |
| Staging | `staging` | Staging deploy | Staging project | Anonimizados |
| Production | `main` | Production deploy | Prod project | Reais |

### Regras de Paridade (12-Factor)

1. Mesma versao do PostgreSQL em TODOS os ambientes
2. Mesma versao do runtime (Node.js, Deno)
3. Mesmos backing services (Redis, S3)
4. Mesma estrutura de env vars (nomes identicos, valores diferentes)

---

## 2. Env Var Naming Convention

### Formato: `PREFIX_SERVICE_KEY` (SCREAMING_SNAKE_CASE)

```bash
# Database
DATABASE_URL=<connection-string>
DATABASE_POOL_SIZE=20
DATABASE_SSL_MODE=require

# APIs externas
STRIPE_SECRET_KEY=<sk_live_or_test>
STRIPE_WEBHOOK_SECRET=<whsec_...>
SENDGRID_API_KEY=<SG.xxx>

# Auth
AUTH_JWT_SECRET=<min-32-chars>
AUTH_JWT_EXPIRY=3600

# Feature toggles
FEATURE_NEW_CHECKOUT=true
FEATURE_DARK_MODE=false

# Infraestrutura
REDIS_URL=<redis-connection-string>
S3_BUCKET_NAME=my-app-uploads
```

### Regras de Nomenclatura

| Regra | Correto | Errado |
|-------|---------|--------|
| SCREAMING_SNAKE_CASE | `DATABASE_URL` | `databaseUrl` |
| Prefixo por servico | `STRIPE_SECRET_KEY` | `SECRET_KEY` |
| Sem abreviacoes | `DATABASE_POOL_SIZE` | `DB_PS` |
| Sem dados no nome | `STRIPE_SECRET_KEY` | `STRIPE_SK_LIVE_4242` |

### NEXT_PUBLIC_ -- Regras Criticas

**PODE ter NEXT_PUBLIC_:**
- `NEXT_PUBLIC_APP_URL`, `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (respeita RLS)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (publica por design)

**NUNCA pode ter NEXT_PUBLIC_:**
- `DATABASE_URL`, `STRIPE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE`
- `JWT_SECRET`, `AWS_SECRET_ACCESS_KEY`

---

## 3. Estrutura de Arquivos .env

```
project/
  .env.example       # Template com placeholders (COMMITADO)
  .env.local         # Overrides locais (GITIGNORED)
  .env.development   # Defaults dev (commitar se sem secrets)
  .env.test          # Valores para testes (commitar)
  .env.staging       # GITIGNORED (ou em secrets manager)
  .env.production    # NUNCA commitar
```

### .gitignore obrigatorio

```
.env
.env*.local
.env.staging
.env.production
```

### Validacao na Inicializacao (t3-env para Next.js)

```typescript
// src/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    AUTH_JWT_SECRET: z.string().min(32),
    STRIPE_SECRET_KEY: z.string().startsWith("sk_"),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  },
  runtimeEnv: { /* ... */ },
});
```

---

## 4. Secrets Management Decision Tree

```
100% na AWS?
|-- SIM --> Precisa de rotation automatica?
|   |-- SIM --> AWS Secrets Manager ($0.40/secret/mes)
|   +-- NAO --> AWS SSM Parameter Store (GRATIS)
+-- NAO --> Precisa de dynamic secrets / PKI?
    |-- SIM --> HashiCorp Vault (HCP ou self-hosted)
    +-- NAO --> Prioridade e DX e velocidade?
        |-- SIM --> Doppler (gratis ate 3 devs)
        +-- NAO --> Self-hosted?
            |-- SIM --> Infisical (MIT, gratis)
            +-- NAO --> Doppler
```

### Recomendacao por Perfil

| Perfil | Ferramenta | Justificativa |
|--------|-----------|---------------|
| Startup ate 5 devs | Doppler Free ou Infisical | Setup em minutos |
| Time 5-20 devs, multi-cloud | Infisical Cloud ou Doppler | CI/CD integration |
| Enterprise, compliance | HashiCorp Vault | Dynamic secrets, PKI |
| 100% AWS | SSM + Secrets Manager | Zero overhead, nativo |

### Vercel + Supabase Secrets

**Vercel:** Variaveis com scoping Production/Preview/Development no dashboard. Marcar como Sensitive para ocultar valor.

**Supabase Edge Functions:**
```bash
supabase secrets set STRIPE_SECRET_KEY=<key>
supabase secrets set RESEND_API_KEY=<key>
# Acesso: Deno.env.get("STRIPE_SECRET_KEY")
```

---

## 5. Branching Strategy Decision Tree

```
Equipe faz continuous deployment (deploy a cada merge)?
|-- SIM --> Maturidade alta? Feature flags? CI rapido?
|   |-- SIM --> Trunk-Based Development
|   +-- NAO --> GitHub Flow
+-- NAO --> Software com releases versionados (mobile, SDK)?
    |-- SIM --> GitFlow
    +-- NAO --> Multiplos ambientes com aprovacao?
        |-- SIM --> GitLab Flow
        +-- NAO --> GitHub Flow
```

### Comparativo Rapido

| Criterio | GitHub Flow | GitLab Flow | GitFlow | TBD |
|----------|-------------|-------------|---------|-----|
| Complexidade | Baixa | Media | Alta | Baixa |
| Deploy frequency | Alta | Media-alta | Baixa | Muito alta |
| Feature flags | Opcional | Opcional | Opcional | Essencial |
| Team size | 1-50+ | 5-50 | 5-20 | 10-10K+ |
| Melhor para | SaaS, web apps | Multi-env | SDKs, mobile | High-perf |

### SINAPSE Default: GitHub Flow

Para projetos SINAPSE, o padrao e **GitHub Flow** com:
- Branch `main` sempre deployavel
- Feature branches curtas (`caio/feat/xxx`, `soier/fix/xxx`)
- PR obrigatorio com review
- Deploy automatico apos merge em main

---

## 6. Branch-to-Environment Mapping

| Branch | Ambiente | Deploy | Aprovacao |
|--------|----------|--------|-----------|
| Feature branches | Preview (Vercel) | Automatico (on push) | Nenhuma |
| `main` | Production (Vercel + Supabase) | Automatico (on merge) | PR approved |
| `staging` (se existir) | Staging | Automatico | Nenhuma |

### Branch Naming (SINAPSE Convention)

```
<user>/<type>/<short-desc>
```

| User | Prefixo | Exemplo |
|------|---------|---------|
| Caio | `caio/` | `caio/feat/new-checkout` |
| Matheus | `soier/` | `soier/fix/auth-bug` |
| Unknown | `dev/` | `dev/feat/feature-x` |

Types: `feat`, `fix`, `refactor`, `docs`, `chore`, `test`

---

## 7. CI/CD Pipeline Template (GitHub Actions)

```yaml
name: Production Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - run: npm run test -- --coverage
      - run: npm run lint
      - run: npm run typecheck

  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm audit --audit-level=high
      - name: Secret scanning
        run: npx gitleaks detect --source=.

  # Deploy automatico via Vercel Git Integration
  # (nao precisa de step manual -- Vercel detecta push)
```

---

## 8. Feature Flags Quick-Start

### Recomendacao por Perfil

| Perfil | Ferramenta | Custo |
|--------|-----------|-------|
| Startup / cost-conscious | GrowthBook (self-hosted) | Gratis |
| Product-led, A/B testing | GrowthBook Cloud ou Statsig | $0-50/mes |
| Enterprise, compliance | LaunchDarkly | $12+/seat/mes |

### Tipos de Flag

| Tipo | Duracao | Exemplo |
|------|---------|---------|
| Release Flag | Dias-semanas | `flag_new_checkout` |
| Experiment Flag | Semanas-meses | `exp_pricing_v2` |
| Ops Flag | Permanente | `ops_enable_cache` |
| Kill Switch | Permanente | `kill_external_payment` |

**Regra:** Release flags DEVEM ser removidas em 30 dias apos 100%.

---

## 9. Rollback Procedures

### Vercel

```bash
# Listar deployments
vercel ls

# Reverter para deployment anterior
vercel rollback [deployment-url]

# Ou via dashboard: Deployments > ... > Promote to Production
```

### Supabase (Database)

```bash
# Listar migrations
supabase migration list

# Reverter migration (criar migration reversa)
supabase migration new revert_last_change
# Escrever SQL de rollback manualmente

# Point-in-Time Recovery (Pro plan)
# Dashboard > Database > Backups > Restore to point in time
```

### Git

```bash
# Reverter ultimo commit em main (cria novo commit)
git revert HEAD
git push origin main

# NUNCA usar git reset --hard em branches compartilhadas
```

---

## 10. Commit Convention (Conventional Commits)

```
<type>(<scope>): <description>

feat(auth): add Google OAuth login
fix(cart): correct total calculation with discounts
docs(api): update authentication guide
chore(deps): update next.js to 15.2
refactor(db): extract query builder module
test(payment): add Stripe webhook integration tests
```

Types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `perf`, `ci`, `style`, `revert`

---

## 11. Cross-References

- Infrastructure tiers: ver `infrastructure-decision-framework.md`
- Database environments: ver `database-scaling-patterns.md`
- Security checklist pre-deploy: ver `security-pre-deploy-checklist.md`
