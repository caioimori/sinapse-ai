# infrastructure-assessment

**Task ID:** infrastructure-assessment
**Version:** 1.0.0
**Created:** 2026-04-11
**Updated:** 2026-04-11
**Agent:** @architect (Stratum)

---

## Purpose

Analisar os requisitos de um projeto e recomendar o tier de infraestrutura adequado. Avalia usuarios esperados, volume de dados, necessidades de real-time, budget e requisitos tecnicos para classificar o projeto em MVP / Growth / Scale / Enterprise, gerando um blueprint de infraestrutura completo com estimativas de custo e triggers de escalabilidade.

**Esta task deve ser executada ANTES de qualquer decisao de stack**, idealmente apos o PRD e antes da implementacao.

---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)

- Decisoes autonomas baseadas nos requisitos coletados
- Assume tier MVP se dados insuficientes
- **Best for:** Projetos simples, prototipacao rapida

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**

- Checkpoints explicitos para validar requisitos
- Explicacoes educativas sobre trade-offs de cada tier
- **Best for:** Decisoes criticas de arquitetura, equipes aprendendo

### 3. Pre-Flight Planning - Comprehensive Upfront Planning

- Analise completa de todos os requisitos antes de recomendar
- Zero ambiguidade na recomendacao
- **Best for:** Projetos enterprise, restricoes rigorosas

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (SINAPSE Task Format V1.0)

```yaml
task: infrastructureAssessment()
responsavel: Aria (Stratum)
responsavel_type: Agente
atomic_layer: Organism

**Entrada:**
- campo: project_name
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Valid project name

- campo: prd_path
  tipo: string
  origem: User Input
  obrigatorio: false
  validacao: Path to PRD file (if exists)

- campo: constraints
  tipo: object
  origem: User Input
  obrigatorio: false
  validacao: Budget limits, compliance requirements, vendor preferences

**Saida:**
- campo: infrastructure_assessment
  tipo: object
  destino: File system (docs/architecture/infrastructure-assessment.md)
  persistido: true

- campo: recommended_tier
  tipo: string
  destino: Return value
  persistido: false

- campo: monthly_cost_estimate
  tipo: object
  destino: Return value
  persistido: false
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE task execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] Project has defined requirements (PRD, briefing, or verbal description)
    tipo: pre-condition
    blocker: true
    validacao: |
      At least one source of requirements exists
    error_message: "No requirements available. Create a PRD or provide a project briefing first."

  - [ ] Architect agent is active
    tipo: pre-condition
    blocker: true
    validacao: |
      Agent @architect is loaded and operational
    error_message: "This task requires @architect (Stratum) agent."
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] Infrastructure assessment document generated
    tipo: post-condition
    blocker: true
    validacao: |
      Check docs/architecture/infrastructure-assessment.md exists
    error_message: "Infrastructure assessment document not generated"

  - [ ] Tier classification is one of: MVP, Growth, Scale, Enterprise
    tipo: post-condition
    blocker: true
    validacao: |
      Document contains valid tier classification
    error_message: "Invalid tier classification in assessment"

  - [ ] Cost estimates included for recommended tier
    tipo: post-condition
    blocker: false
    validacao: |
      Document contains monthly cost breakdown
    error_message: "Cost estimates missing from assessment"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] All 5 dimensions analyzed (users, data, real-time, budget, tech requirements)
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Assessment document covers all 5 analysis dimensions
    error_message: "Incomplete analysis — all 5 dimensions must be covered"

  - [ ] Stack recommendation matches tier classification
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Recommended stack is appropriate for the selected tier
    error_message: "Stack recommendation inconsistent with tier"

  - [ ] Scaling triggers defined for upgrade path
    tipo: acceptance-criterion
    blocker: false
    validacao: |
      Document includes clear metrics for when to upgrade tier
    error_message: "Scaling triggers not defined"
```

---

## Elicitation

```yaml
elicit: true
interaction_points:
  - expected_users: 'Quantos usuarios simultaneos sao esperados? (ex: 100, 1K, 10K, 100K+)'
  - data_volume: 'Qual o volume de dados esperado? (ex: < 1GB, 1-10GB, 10-100GB, 100GB+)'
  - realtime_needs: 'O projeto precisa de funcionalidades real-time? (websockets, live updates, streaming)'
  - monthly_budget: 'Qual o budget mensal disponivel para infraestrutura? (ex: $0-50, $50-200, $200-1000, $1000+)'
  - tech_requirements: 'Quais requisitos tecnicos especificos? (auth, file storage, search, AI/ML, payments)'
  - compliance: 'Existem requisitos de compliance? (LGPD, SOC2, HIPAA, PCI-DSS)'
```

---

## Process

### Step 1: Coletar Requisitos do Projeto

**Action:** Identificar e documentar todos os requisitos de infraestrutura

```yaml
elicit: true
prompt: |
  Preciso entender os requisitos do projeto para recomendar a infraestrutura ideal.
  Vamos avaliar 5 dimensoes:
  1. Usuarios esperados (simultaneos e totais)
  2. Volume de dados (armazenamento e throughput)
  3. Necessidades de real-time
  4. Budget disponivel
  5. Requisitos tecnicos especificos
```

**Output:** Documento de requisitos coletados

---

### Step 2: Analisar Requisitos Tecnicos

**Action:** Mapear requisitos tecnicos especificos

Avaliar necessidade de:

| Capacidade | Opcoes por Tier |
|-----------|-----------------|
| Autenticacao | Supabase Auth → Auth0 → Cognito |
| File Storage | Supabase Storage → S3 → CloudFront + S3 |
| Search | pg_trgm → Algolia → Elasticsearch |
| AI/ML | API calls → Serverless inference → GPU instances |
| Payments | Stripe Checkout → Stripe Connect → Custom billing |
| Email | Resend → SendGrid → SES |
| Queue/Jobs | pg_cron → BullMQ → SQS/Lambda |

**Output:** Matriz de requisitos tecnicos com opcoes por tier

---

### Step 3: Classificar Tier do Projeto

**Action:** Determinar o tier com base nos requisitos coletados

| Tier | Usuarios Simult. | Dados | Budget Mensal | Complexidade |
|------|------------------|-------|---------------|-------------|
| **MVP** | < 500 | < 1GB | $0-50 | Baixa |
| **Growth** | 500 - 5K | 1-10GB | $50-200 | Media |
| **Scale** | 5K - 50K | 10-100GB | $200-1000 | Alta |
| **Enterprise** | 50K+ | 100GB+ | $1000+ | Muito Alta |

```yaml
elicit: true
prompt: |
  Com base nos requisitos coletados, o projeto se classifica como: {tier}
  Confirma esta classificacao? Posso ajustar se necessario.
```

**Output:** Tier classificado e confirmado

---

### Step 4: Recomendar Stack por Tier

**Action:** Definir o stack recomendado para o tier

| Tier | Frontend | Backend | Database | Infra |
|------|----------|---------|----------|-------|
| **MVP** | Vercel | Supabase Edge Functions | Supabase PostgreSQL | Vercel + Supabase |
| **Growth** | Vercel | Supabase + Cloudflare Workers | Supabase + Redis | + Cloudflare + Upstash |
| **Scale** | Vercel + CDN | AWS Lambda / ECS | RDS + ElastiCache | + AWS core services |
| **Enterprise** | Multi-region | ECS/EKS | Aurora + Redis Cluster | Full AWS / multi-cloud |

**Output:** Stack recomendado com justificativa

---

### Step 5: Gerar Blueprint de Infraestrutura

**Action:** Criar documento detalhado de infraestrutura

O blueprint deve conter:
1. Diagrama de arquitetura (texto/mermaid)
2. Lista de servicos com justificativa
3. Configuracoes recomendadas por servico
4. Requisitos de rede e seguranca
5. Estrategia de backup e disaster recovery

**Output:** Secao de blueprint no documento final

---

### Step 6: Estimar Custos Mensais por Tier

**Action:** Calcular estimativa de custos detalhada

```markdown
## Estimativa de Custos Mensais

### Tier Recomendado: {tier}

| Servico | Free Tier | Custo Estimado | Notas |
|---------|-----------|---------------|-------|
| Vercel | Hobby: $0 | Pro: $20/dev | Bandwidth, builds |
| Supabase | Free: $0 | Pro: $25 | Database, auth, storage |
| Cloudflare | Free: $0 | Pro: $20 | CDN, workers |
| Upstash Redis | Free: $0 | Pay-as-you-go: ~$10 | Cache, rate limiting |
| **Total** | **$0** | **$75/mes** | |

### Tier Seguinte: {next_tier}
| ... | ... | ... | ... |
```

**Output:** Tabela de custos por tier

---

### Step 7: Definir Triggers de Scaling

**Action:** Estabelecer metricas para upgrade de tier

```markdown
## Triggers de Upgrade

### MVP → Growth (quando QUALQUER um ocorrer)
- [ ] P95 latency > 500ms consistentemente
- [ ] Usuarios simultaneos > 500
- [ ] Database > 500MB
- [ ] Revenue > $1K MRR

### Growth → Scale (quando 2+ ocorrerem)
- [ ] P95 latency > 200ms sob carga
- [ ] Usuarios simultaneos > 5K
- [ ] Database > 10GB
- [ ] Revenue > $10K MRR
- [ ] Necessidade de multi-region

### Scale → Enterprise (quando 2+ ocorrerem)
- [ ] SLA > 99.99% necessario
- [ ] Compliance regulatorio (SOC2, HIPAA)
- [ ] Usuarios simultaneos > 50K
- [ ] Database > 100GB
- [ ] Multi-tenant com isolamento
```

**Output:** Triggers documentados no assessment

---

## Tools

**External/shared resources used by this task:**

- **Tool:** research-files
  - **Purpose:** Consultar pesquisas de infraestrutura existentes
  - **Source:** `docs/research/enterprise-infrastructure-patterns.md`, `docs/research/supabase-at-scale.md`

- **Tool:** knowledge-base
  - **Purpose:** Referencia de decisoes de infraestrutura
  - **Source:** `knowledge-base/infrastructure-decision-framework.md` (se existir)

---

## Error Handling

**Strategy:** retry-with-alternatives

**Common Errors:**

1. **Error:** Requisitos Insuficientes
   - **Cause:** Usuario nao forneceu dados suficientes para classificar
   - **Resolution:** Fazer perguntas mais especificas, oferecer exemplos
   - **Recovery:** Usar valores conservadores (MVP) como default

2. **Error:** Tier Ambiguo
   - **Cause:** Requisitos apontam para tiers diferentes
   - **Resolution:** Priorizar o tier mais alto entre as dimensoes criticas
   - **Recovery:** Apresentar dois tiers com trade-offs para decisao do usuario

3. **Error:** Budget Incompativel com Requisitos
   - **Cause:** Requisitos tecnicos exigem tier superior ao budget
   - **Resolution:** Identificar alternativas mais economicas
   - **Recovery:** Documentar riscos de subdimensionamento

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 15-30 min (depending on complexity and elicitation)
cost_estimated: $0.005-0.015
token_usage: ~5,000-15,000 tokens
```

**Optimization Notes:**

- Reutilizar pesquisas existentes em docs/research/
- Consultar knowledge base para decisoes padronizadas
- Paralelizar analise de custos com blueprint

---

## Metadata

```yaml
story: N/A (Framework task)
version: 1.0.0
dependencies:
  - docs/research/enterprise-infrastructure-patterns.md
  - docs/research/supabase-at-scale.md
  - docs/research/database-selection-architecture.md
tags:
  - infrastructure
  - architecture
  - assessment
  - scaling
  - cost-estimation
updated_at: 2026-04-11
changelog:
  1.0.0:
    - Initial task creation
    - 4-tier classification model (MVP/Growth/Scale/Enterprise)
    - Cost estimation templates
    - Scaling triggers framework
```

---

**Related Tasks:**

- `environment-bootstrap` - Setup do ambiente apos assessment
- `ci-cd-configuration` - Configuracao de CI/CD para o tier escolhido
- `environment-promotion-pipeline` - Pipeline de deploy multi-ambiente
- `observability-blueprint` - Stack de observabilidade para o tier
