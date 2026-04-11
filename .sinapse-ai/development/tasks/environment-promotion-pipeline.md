# environment-promotion-pipeline

**Task ID:** environment-promotion-pipeline
**Version:** 1.0.0
**Created:** 2026-04-11
**Updated:** 2026-04-11
**Agent:** @devops (Pipeline)

---

## Purpose

Configurar pipeline de deployment multi-ambiente (development, staging, production) com promocao controlada entre ambientes. Detecta o stack atual, cria arquivos de configuracao por ambiente, configura GitHub Actions para o fluxo build > test > deploy staging > approve > deploy prod, e implementa gates de aprovacao para producao.

**Esta task deve ser executada APOS o `environment-bootstrap` e `ci-cd-configuration`**, garantindo que o repositorio ja possui CI/CD basico.

---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)

- Configura pipeline padrao com 3 ambientes
- Assume Vercel + Supabase como stack
- **Best for:** Projetos simples, setup rapido

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**

- Checkpoints para escolha de provider e configuracao
- Explicacoes sobre estrategias de deployment
- **Best for:** Primeiro setup multi-ambiente, equipes aprendendo

### 3. Pre-Flight Planning - Comprehensive Upfront Planning

- Analise completa do stack antes de configurar
- Plano de rollback documentado
- **Best for:** Ambientes enterprise, restricoes de compliance

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (SINAPSE Task Format V1.0)

```yaml
task: environmentPromotionPipeline()
responsavel: Gage (Operator)
responsavel_type: Agente
atomic_layer: Organism

**Entrada:**
- campo: repository_path
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be valid Git repository with CI/CD configured

- campo: environments
  tipo: array
  origem: User Input
  obrigatorio: false
  validacao: List of environments (default: [development, staging, production])

- campo: hosting_provider
  tipo: string
  origem: Auto-detect or User Input
  obrigatorio: false
  validacao: vercel | netlify | aws | cloudflare-pages

- campo: database_provider
  tipo: string
  origem: Auto-detect or User Input
  obrigatorio: false
  validacao: supabase | planetscale | neon | aws-rds

**Saida:**
- campo: workflow_file
  tipo: string
  destino: File system (.github/workflows/deploy-pipeline.yml)
  persistido: true

- campo: env_configs
  tipo: array
  destino: File system (.env.development, .env.staging, .env.production)
  persistido: true

- campo: pipeline_url
  tipo: string
  destino: Return value
  persistido: false
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE task execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] Repository is valid Git repository with remote origin
    tipo: pre-condition
    blocker: true
    validacao: |
      Check .git directory exists and remote origin is configured
    error_message: "Not a Git repository or no remote origin configured"

  - [ ] CI/CD pipeline already configured (ci-cd-configuration task completed)
    tipo: pre-condition
    blocker: true
    validacao: |
      Check .github/workflows/ directory contains at least one workflow file
    error_message: "CI/CD not configured. Run ci-cd-configuration task first."

  - [ ] GitHub CLI authenticated
    tipo: pre-condition
    blocker: true
    validacao: |
      gh auth status returns authenticated
    error_message: "GitHub CLI not authenticated. Run gh auth login."

  - [ ] .gitignore includes .env files
    tipo: pre-condition
    blocker: true
    validacao: |
      .gitignore contains .env entry (NOT .env.example)
    error_message: ".env files must be in .gitignore for security"
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] Deploy pipeline workflow file created
    tipo: post-condition
    blocker: true
    validacao: |
      .github/workflows/deploy-pipeline.yml exists and is valid YAML
    error_message: "Deploy pipeline workflow not created"

  - [ ] Environment config files created
    tipo: post-condition
    blocker: true
    validacao: |
      .env.example exists with placeholder values for all environments
    error_message: "Environment config template not created"

  - [ ] Production deployment requires manual approval
    tipo: post-condition
    blocker: true
    validacao: |
      Workflow includes environment protection rule for production
    error_message: "Production gate not configured — security risk"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Pipeline deploys to staging automatically on merge to main
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Workflow triggers on push to main with staging deployment step
    error_message: "Auto-deploy to staging not configured"

  - [ ] Production deployment requires explicit approval
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      GitHub environment protection rules active for production
    error_message: "Production approval gate missing"

  - [ ] Each environment has isolated configuration
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Environment variables are distinct per environment
    error_message: "Environment isolation not properly configured"
```

---

## Elicitation

```yaml
elicit: true
interaction_points:
  - hosting_provider: 'Qual provider de hosting? (vercel / netlify / aws / cloudflare-pages)'
  - database_provider: 'Qual provider de database? (supabase / planetscale / neon / aws-rds)'
  - environments: 'Quais ambientes configurar? (default: development, staging, production)'
  - approval_team: 'Quem pode aprovar deploys em producao? (GitHub usernames)'
  - auto_deploy_staging: 'Deploy automatico em staging ao merge em main? (Y/n)'
```

---

## Process

### Step 1: Detectar Stack Atual

**Action:** Identificar providers de hosting e database em uso

```bash
# Detectar Vercel
test -f vercel.json && echo "Vercel detected"
test -f .vercel/project.json && echo "Vercel project linked"

# Detectar Supabase
test -f supabase/config.toml && echo "Supabase detected"

# Detectar package.json scripts
grep -q "vercel" package.json 2>/dev/null && echo "Vercel in dependencies"
grep -q "supabase" package.json 2>/dev/null && echo "Supabase in dependencies"

# Detectar AWS
test -f serverless.yml && echo "Serverless Framework detected"
test -d .aws && echo "AWS config detected"
```

```yaml
elicit: true
prompt: |
  Detectei o seguinte stack:
  - Hosting: {detected_hosting}
  - Database: {detected_database}
  Confirma? Posso ajustar se necessario.
```

**Output:** Stack confirmado

---

### Step 2: Criar Arquivos de Configuracao de Ambiente

**Action:** Gerar templates de configuracao por ambiente

Criar `.env.example` com variaveis por ambiente:

```bash
# ==============================================
# Environment Configuration Template
# ==============================================
# Copy this file and rename for each environment:
#   .env.development  (local dev)
#   .env.staging       (staging/preview)
#   .env.production    (production)
# ==============================================

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Auth
NEXT_PUBLIC_AUTH_REDIRECT_URL=http://localhost:3000/auth/callback

# External Services
# STRIPE_SECRET_KEY=sk_test_...
# RESEND_API_KEY=re_...
```

**SECURITY:** Nunca commitar `.env.*` files. Apenas `.env.example` com placeholders.

**Output:** `.env.example` criado e commitado

---

### Step 3: Configurar Variaveis no Provider

**Action:** Configurar environment variables no dashboard do provider

**Para Vercel:**

```bash
# Listar environments existentes
vercel env ls

# Adicionar variavel por ambiente
vercel env add NEXT_PUBLIC_APP_ENV development
vercel env add NEXT_PUBLIC_APP_ENV preview    # staging
vercel env add NEXT_PUBLIC_APP_ENV production
```

```yaml
elicit: true
prompt: |
  Para configurar as variaveis de ambiente no Vercel, voce pode:
  1. Usar o CLI (vercel env add)
  2. Configurar no dashboard (Settings > Environment Variables)
  Qual prefere?
```

**Output:** Variaveis configuradas no provider

---

### Step 4: Configurar Ambientes de Database

**Action:** Configurar database por ambiente

**Para Supabase:**

| Ambiente | Estrategia | Custo |
|----------|-----------|-------|
| Development | Projeto local (supabase start) | $0 |
| Staging | Supabase Branching ou projeto separado | $0-25 |
| Production | Projeto principal | $25+ |

```yaml
elicit: true
prompt: |
  Para o database em staging, recomendo:
  - Supabase Branching (se disponivel no plano Pro)
  - Projeto separado no Supabase (mais isolamento)
  Qual prefere?
```

**Output:** Database configurado por ambiente

---

### Step 5: Criar GitHub Actions Workflow

**Action:** Gerar workflow de deployment com promocao

Criar `.github/workflows/deploy-pipeline.yml`:

```yaml
name: Deploy Pipeline

on:
  push:
    branches: [main]
  workflow_dispatch:
    inputs:
      environment:
        description: 'Target environment'
        required: true
        default: 'staging'
        type: choice
        options:
          - staging
          - production

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run lint
      - run: npm test
      - run: npm run build

  deploy-staging:
    needs: build-and-test
    runs-on: ubuntu-latest
    environment: staging
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Staging
        run: echo "Deploy to staging environment"
        # Provider-specific deployment steps here

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment: production  # Requires manual approval
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Production
        run: echo "Deploy to production environment"
        # Provider-specific deployment steps here
```

**Output:** Workflow file criado

---

### Step 6: Configurar Branch-to-Environment Mapping

**Action:** Mapear branches para ambientes

| Branch | Ambiente | Deploy |
|--------|----------|--------|
| `main` | staging | Automatico |
| `main` (approved) | production | Manual approval |
| `feat/*`, `fix/*` | preview | Automatico (Vercel preview) |
| `release/*` | staging | Automatico |

**Para Vercel**, configurar no `vercel.json`:

```json
{
  "git": {
    "deploymentEnabled": {
      "main": true,
      "feat/*": true,
      "fix/*": true
    }
  }
}
```

**Output:** Mapping documentado e configurado

---

### Step 7: Configurar Deployment Gates

**Action:** Implementar gates de aprovacao para producao

```bash
# Criar environment protection rules no GitHub
gh api repos/{owner}/{repo}/environments/production -X PUT \
  -f wait_timer=0 \
  -f reviewers='[{"type":"User","id":USER_ID}]' \
  -f deployment_branch_policy='{"protected_branches":true}'
```

```yaml
elicit: true
prompt: |
  Quem deve aprovar deploys em producao?
  Informe os usernames do GitHub (separados por virgula).
```

**Output:** Protection rules configuradas

---

### Step 8: Testar Pipeline End-to-End

**Action:** Validar o pipeline completo

```bash
# 1. Criar branch de teste
git checkout -b test/deploy-pipeline

# 2. Fazer mudanca trivial
echo "# Deploy Pipeline Test" >> DEPLOY_TEST.md

# 3. Commit e push
git add DEPLOY_TEST.md
git commit -m "test: validate deploy pipeline"
git push origin test/deploy-pipeline

# 4. Criar PR para main
gh pr create --title "test: validate deploy pipeline" --body "Testing deploy pipeline"

# 5. Merge e verificar
# - Staging deploy automatico
# - Production aguardando aprovacao

# 6. Cleanup
git checkout main
git branch -d test/deploy-pipeline
rm DEPLOY_TEST.md
```

**Output:** Pipeline validado end-to-end

---

## Tools

**External/shared resources used by this task:**

- **Tool:** github-cli
  - **Purpose:** Configurar environments e protection rules
  - **Source:** GitHub CLI (gh)

- **Tool:** vercel-cli
  - **Purpose:** Configurar environment variables no Vercel
  - **Source:** Vercel CLI (vercel)

- **Tool:** supabase-cli
  - **Purpose:** Configurar database environments
  - **Source:** Supabase CLI (supabase)

---

## Error Handling

**Strategy:** retry-with-fallback

**Common Errors:**

1. **Error:** Provider CLI Not Installed
   - **Cause:** Vercel CLI, Supabase CLI, ou outro nao disponivel
   - **Resolution:** Instalar via npm ou guiar usuario ao dashboard
   - **Recovery:** Configurar via dashboard web como fallback

2. **Error:** Environment Protection Not Available
   - **Cause:** Repositorio em plano GitHub Free (publico funciona, privado nao)
   - **Resolution:** Verificar se repo e publico ou upgrade para GitHub Pro
   - **Recovery:** Usar workflow_dispatch com input manual como alternativa

3. **Error:** Supabase Branching Not Available
   - **Cause:** Projeto nao esta no plano Pro ou branching nao habilitado
   - **Resolution:** Criar projeto separado para staging
   - **Recovery:** Usar mesmo projeto com schema separado (menos ideal)

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 20-40 min (depending on provider setup)
cost_estimated: $0.00 (configuration only)
token_usage: ~3,000-8,000 tokens
```

**Optimization Notes:**

- Detectar stack automaticamente para reduzir perguntas
- Reutilizar workflows existentes quando possivel
- Templates pre-configurados por provider

---

## Metadata

```yaml
story: N/A (Framework task)
version: 1.0.0
dependencies:
  - environment-bootstrap (must be completed first)
  - ci-cd-configuration (must be completed first)
tags:
  - deployment
  - pipeline
  - environments
  - staging
  - production
  - devops
updated_at: 2026-04-11
changelog:
  1.0.0:
    - Initial task creation
    - Support for Vercel + Supabase stack
    - GitHub Actions promotion pipeline
    - Manual approval gates for production
```

---

**Related Tasks:**

- `environment-bootstrap` - Setup inicial do ambiente
- `ci-cd-configuration` - Configuracao de CI/CD basico
- `infrastructure-assessment` - Assessment do tier de infraestrutura
- `release-management` - Gestao de releases apos pipeline configurado
