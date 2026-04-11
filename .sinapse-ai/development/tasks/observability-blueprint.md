# observability-blueprint

**Task ID:** observability-blueprint
**Version:** 1.0.0
**Created:** 2026-04-11
**Updated:** 2026-04-11
**Agent:** @architect (Stratum)

---

## Purpose

Projetar e implementar o stack de observabilidade adequado para o projeto, usando um modelo de maturidade de 5 niveis (0-4). Avalia o nivel atual de monitoring, recomenda o nivel alvo com base no estagio do projeto, seleciona ferramentas, implementa instrumentacao, configura alertas e dashboards, e documenta SLIs/SLOs/SLAs.

**Esta task deve ser executada APOS o `infrastructure-assessment`**, garantindo que o tier de infraestrutura ja foi definido.

---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)

- Avalia nivel atual e implementa nivel recomendado automaticamente
- Assume Level 1 para MVPs, Level 2 para Growth
- **Best for:** Setup rapido, projetos simples

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**

- Checkpoints para validar nivel atual e escolher ferramentas
- Explicacoes sobre cada pilar de observabilidade
- **Best for:** Decisoes de tooling, equipes aprendendo

### 3. Pre-Flight Planning - Comprehensive Upfront Planning

- Analise completa do estado atual antes de qualquer implementacao
- Plano de migracoes documentado
- **Best for:** Projetos em producao, migracao de ferramentas

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (SINAPSE Task Format V1.0)

```yaml
task: observabilityBlueprint()
responsavel: Aria (Stratum)
responsavel_type: Agente
atomic_layer: Organism

**Entrada:**
- campo: project_path
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be valid project directory

- campo: infrastructure_tier
  tipo: string
  origem: infrastructure-assessment output or User Input
  obrigatorio: false
  validacao: MVP | Growth | Scale | Enterprise

- campo: current_tools
  tipo: array
  origem: Auto-detect or User Input
  obrigatorio: false
  validacao: List of currently used monitoring tools

**Saida:**
- campo: observability_blueprint
  tipo: object
  destino: File system (docs/architecture/observability-blueprint.md)
  persistido: true

- campo: config_files
  tipo: array
  destino: File system (various config files)
  persistido: true

- campo: current_level
  tipo: number
  destino: Return value
  persistido: false

- campo: target_level
  tipo: number
  destino: Return value
  persistido: false
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE task execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] Project has deployable application code
    tipo: pre-condition
    blocker: true
    validacao: |
      package.json or equivalent build config exists
    error_message: "No application code found. This task requires an existing project."

  - [ ] Infrastructure tier is defined (or can be assessed)
    tipo: pre-condition
    blocker: false
    validacao: |
      docs/architecture/infrastructure-assessment.md exists or tier provided
    error_message: "Infrastructure tier not defined. Will assess during execution."

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
  - [ ] Observability blueprint document generated
    tipo: post-condition
    blocker: true
    validacao: |
      docs/architecture/observability-blueprint.md exists
    error_message: "Observability blueprint document not generated"

  - [ ] Current maturity level assessed (0-4)
    tipo: post-condition
    blocker: true
    validacao: |
      Document contains current and target maturity levels
    error_message: "Maturity level assessment missing"

  - [ ] At least one monitoring tool configured
    tipo: post-condition
    blocker: false
    validacao: |
      Configuration file or SDK integration exists for at least one tool
    error_message: "No monitoring tools configured"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Three pillars covered (logs, metrics, traces) at target level
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Blueprint addresses logging, metrics, and tracing for target level
    error_message: "Not all three observability pillars addressed"

  - [ ] Alerting rules defined for critical paths
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      At least error rate and latency alerts are defined
    error_message: "Critical alerting rules not defined"

  - [ ] SLIs and SLOs documented
    tipo: acceptance-criterion
    blocker: false
    validacao: |
      Blueprint includes SLI definitions and SLO targets
    error_message: "SLIs/SLOs not documented"
```

---

## Elicitation

```yaml
elicit: true
interaction_points:
  - infrastructure_tier: 'Qual o tier de infraestrutura? (MVP / Growth / Scale / Enterprise)'
  - current_monitoring: 'Quais ferramentas de monitoring ja estao em uso? (Sentry, Vercel Analytics, etc.)'
  - critical_paths: 'Quais os fluxos mais criticos que precisam de monitoring? (auth, payments, data processing)'
  - alert_channels: 'Onde devem chegar os alertas? (email, Slack, PagerDuty, Discord)'
  - budget_monitoring: 'Qual o budget mensal para ferramentas de observabilidade?'
```

---

## Process

### Step 1: Avaliar Nivel Atual de Maturidade (0-4)

**Action:** Determinar o nivel atual de observabilidade do projeto

| Level | Nome | Descricao | Indicadores |
|-------|------|-----------|-------------|
| **0** | None | Sem monitoring | Nenhuma ferramenta, descobre problemas por usuarios |
| **1** | Basic | Error tracking basico | Sentry ou similar, analytics basico |
| **2** | Structured | Logs e metricas estruturados | Logging estruturado, dashboards, alertas basicos |
| **3** | Distributed | Tracing distribuido | OpenTelemetry, correlacao entre servicos, SLOs |
| **4** | Advanced | Observabilidade completa | APM, chaos engineering, anomaly detection, SLAs |

Checklist de avaliacao:

```yaml
assessment:
  error_tracking:
    - Sentry ou equivalente instalado?
    - Source maps configurados?
    - Error boundaries no frontend?
  logging:
    - Logs estruturados (JSON)?
    - Log aggregation centralizado?
    - Log levels configurados?
  metrics:
    - Metricas de aplicacao coletadas?
    - Dashboards configurados?
    - Custom metrics definidas?
  tracing:
    - Distributed tracing ativo?
    - Trace context propagado entre servicos?
    - Trace sampling configurado?
  alerting:
    - Alertas configurados?
    - Runbooks para cada alerta?
    - Escalation policy definida?
```

```yaml
elicit: true
prompt: |
  Com base na avaliacao, o nivel atual de maturidade e: Level {N}
  Recomendo evoluir para Level {N+1}.
  Confirma esta avaliacao?
```

**Output:** Nivel atual documentado

---

### Step 2: Recomendar Nivel Alvo por Estagio do Projeto

**Action:** Definir o nivel alvo com base no tier de infraestrutura

| Tier | Nivel Recomendado | Justificativa |
|------|------------------|---------------|
| **MVP** | Level 1 | Error tracking e analytics basico sao suficientes |
| **Growth** | Level 2 | Precisa de logs estruturados e alertas para operar |
| **Scale** | Level 3 | Tracing distribuido essencial para debug em producao |
| **Enterprise** | Level 4 | SLAs exigem observabilidade completa |

**Output:** Nivel alvo definido e justificado

---

### Step 3: Selecionar Ferramentas por Nivel

**Action:** Escolher ferramentas adequadas para o nivel alvo

#### Level 1 — Basic (custo: $0-20/mes)

| Pilar | Ferramenta | Custo | Setup |
|-------|-----------|-------|-------|
| Errors | Sentry (free tier) | $0 | npm install @sentry/nextjs |
| Analytics | Vercel Analytics | $0 | Built-in com Vercel |
| Uptime | BetterStack (free) | $0 | Dashboard web |

#### Level 2 — Structured (custo: $20-100/mes)

| Pilar | Ferramenta | Custo | Setup |
|-------|-----------|-------|-------|
| Errors | Sentry (team) | $26/mes | Upgrade plan |
| Logging | Pino + Axiom | $0-25/mes | npm install pino + Axiom free tier |
| Metrics | Vercel Analytics + custom | $0 | Custom events |
| Alerting | BetterStack | $0-24/mes | Incident management |

#### Level 3 — Distributed (custo: $100-500/mes)

| Pilar | Ferramenta | Custo | Setup |
|-------|-----------|-------|-------|
| Tracing | OpenTelemetry + Grafana Tempo | $0-50/mes | OTEL SDK + Grafana Cloud |
| Logging | Grafana Loki | $0-50/mes | Grafana Cloud free tier |
| Metrics | Grafana + Prometheus | $0-50/mes | Grafana Cloud free tier |
| Alerting | Grafana Alerting + PagerDuty | $50-200/mes | Alert rules + escalation |
| Dashboards | Grafana | $0 | Custom dashboards |

#### Level 4 — Advanced (custo: $500+/mes)

| Pilar | Ferramenta | Custo | Setup |
|-------|-----------|-------|-------|
| APM | Datadog / New Relic | $200+/mes | Full APM suite |
| SLOs | Datadog SLO Tracking | Included | SLO definitions |
| Anomaly | ML-based anomaly detection | Included | Auto-detection |
| Chaos | Gremlin / Chaos Monkey | $100+/mes | Chaos experiments |

```yaml
elicit: true
prompt: |
  Para Level {N}, recomendo as seguintes ferramentas:
  {tool_table}
  Custo estimado: ${cost}/mes
  Deseja ajustar alguma ferramenta?
```

**Output:** Ferramentas selecionadas

---

### Step 4: Implementar Nivel Selecionado

**Action:** Instalar e configurar as ferramentas escolhidas

**Level 1 — Sentry Setup:**

```bash
# Instalar Sentry
npx @sentry/wizard@latest -i nextjs
```

```javascript
// sentry.client.config.js
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1, // 10% de traces em producao
  environment: process.env.NEXT_PUBLIC_APP_ENV,
  enabled: process.env.NODE_ENV === 'production',
});
```

**Level 2 — Pino Structured Logging:**

```bash
npm install pino pino-pretty
```

```typescript
// lib/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
  formatters: {
    level: (label) => ({ level: label }),
  },
  base: {
    env: process.env.NODE_ENV,
    service: 'my-app',
  },
});
```

**Output:** Ferramentas configuradas e testadas

---

### Step 5: Configurar Alertas e Runbooks

**Action:** Definir regras de alerta para caminhos criticos

```markdown
## Alertas Configurados

### Critical (notificar imediatamente)
| Alerta | Condicao | Canal | Runbook |
|--------|---------|-------|---------|
| Error Rate Spike | Error rate > 5% por 5 min | Slack + PagerDuty | runbooks/error-spike.md |
| Service Down | Health check falha 3x consecutivas | Slack + PagerDuty | runbooks/service-down.md |
| Database Connection Failed | Connection pool exhausted | Slack + PagerDuty | runbooks/db-connection.md |

### Warning (notificar em horario comercial)
| Alerta | Condicao | Canal | Runbook |
|--------|---------|-------|---------|
| High Latency | P95 > 2s por 10 min | Slack | runbooks/high-latency.md |
| Disk Usage | > 80% | Email | runbooks/disk-usage.md |
| Memory Usage | > 85% por 15 min | Slack | runbooks/memory-usage.md |

### Info (log only)
| Alerta | Condicao | Canal |
|--------|---------|-------|
| Deploy Completed | Deployment event | Slack |
| Scaling Event | Auto-scale triggered | Log |
```

```yaml
elicit: true
prompt: |
  Onde devem chegar os alertas criticos?
  Opcoes: Slack, Discord, Email, PagerDuty, OpsGenie
```

**Output:** Alertas configurados com canais definidos

---

### Step 6: Configurar Dashboards

**Action:** Criar dashboards para visibilidade operacional

Dashboards recomendados por nivel:

| Dashboard | Level | Metricas |
|-----------|-------|----------|
| **App Health** | 1+ | Error rate, uptime, response time |
| **API Performance** | 2+ | Latency (p50/p95/p99), RPS, error rate por endpoint |
| **Infrastructure** | 2+ | CPU, memory, disk, network |
| **Business Metrics** | 2+ | Active users, signups, conversions |
| **Service Map** | 3+ | Dependencies, health, latency between services |
| **SLO Dashboard** | 3+ | Error budget, SLO compliance, burn rate |

**Output:** Dashboards criados ou templates documentados

---

### Step 7: Documentar SLIs/SLOs/SLAs

**Action:** Definir indicadores e objetivos de servico

```markdown
## SLIs (Service Level Indicators)

| SLI | Definicao | Medicao |
|-----|-----------|---------|
| Availability | % de requests com status != 5xx | (total - 5xx) / total * 100 |
| Latency | % de requests completadas em < Xms | requests < threshold / total * 100 |
| Correctness | % de responses com dados corretos | validated responses / total * 100 |

## SLOs (Service Level Objectives)

| SLO | Target | Janela | Error Budget |
|-----|--------|--------|-------------|
| Availability | 99.9% | 30 dias | 43.2 min downtime/mes |
| Latency (p95) | < 500ms | 30 dias | 5% de requests > 500ms |
| Error Rate | < 0.1% | 30 dias | 0.1% das requests |

## SLAs (Service Level Agreements) — se aplicavel

| SLA | Commitment | Penalidade |
|-----|-----------|-----------|
| Uptime | 99.9% mensal | Credit de 10% por violacao |
```

**Output:** SLIs/SLOs documentados no blueprint

---

## Tools

**External/shared resources used by this task:**

- **Tool:** sentry-cli
  - **Purpose:** Configuracao do Sentry
  - **Source:** npm @sentry/wizard

- **Tool:** research-reference
  - **Purpose:** Consultar pesquisa de observabilidade
  - **Source:** `docs/research/observability-monitoring.md`

---

## Error Handling

**Strategy:** retry-with-alternatives

**Common Errors:**

1. **Error:** Sentry DSN Not Configured
   - **Cause:** Conta Sentry nao criada ou DSN nao fornecido
   - **Resolution:** Guiar usuario para criar conta em sentry.io
   - **Recovery:** Pular Sentry e usar console.error como fallback temporario

2. **Error:** Grafana Cloud Connection Failed
   - **Cause:** API key invalida ou plano nao suporta
   - **Resolution:** Verificar credenciais e plano
   - **Recovery:** Usar Grafana self-hosted ou BetterStack como alternativa

3. **Error:** OpenTelemetry SDK Conflicts
   - **Cause:** Versoes incompativeis de OTEL packages
   - **Resolution:** Alinhar versoes usando OTEL BOM
   - **Recovery:** Usar auto-instrumentation ao inves de manual

4. **Error:** Alert Channel Not Accessible
   - **Cause:** Slack webhook invalido ou permissoes insuficientes
   - **Resolution:** Reconfigurerar webhook ou ajustar permissoes
   - **Recovery:** Usar email como canal fallback

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 30-60 min (depending on level and tools)
cost_estimated: $0.005-0.015
token_usage: ~5,000-15,000 tokens
```

**Optimization Notes:**

- Reutilizar pesquisa existente em docs/research/observability-monitoring.md
- Instalar apenas ferramentas do nivel alvo (nao over-engineer)
- Configurar sampling rates para controlar custos em producao

---

## Metadata

```yaml
story: N/A (Framework task)
version: 1.0.0
dependencies:
  - infrastructure-assessment (recommended, defines tier)
  - docs/research/observability-monitoring.md
tags:
  - observability
  - monitoring
  - logging
  - tracing
  - alerting
  - sentry
  - grafana
  - architecture
updated_at: 2026-04-11
changelog:
  1.0.0:
    - Initial task creation
    - 5-level maturity model (0-4)
    - Tool selection per level
    - SLI/SLO/SLA templates
    - Alert and runbook framework
```

---

**Related Tasks:**

- `infrastructure-assessment` - Define o tier que determina o nivel de observabilidade
- `load-testing-setup` - Load tests geram metricas que alimentam dashboards
- `environment-promotion-pipeline` - Pipeline onde alertas de deploy sao configurados
- `security-audit` - Security monitoring integra com observabilidade
