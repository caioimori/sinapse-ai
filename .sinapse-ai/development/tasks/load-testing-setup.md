# load-testing-setup

**Task ID:** load-testing-setup
**Version:** 1.0.0
**Created:** 2026-04-11
**Updated:** 2026-04-11
**Agent:** @quality-gate (Quinn)

---

## Purpose

Configurar e executar testes de carga para o projeto usando k6. Identifica endpoints criticos e fluxos de usuario, cria scripts de teste, define thresholds de performance, executa testes baseline e de stress, analisa resultados, identifica gargalos e gera relatorio completo.

**Esta task deve ser executada APOS a implementacao estar funcional**, idealmente antes do primeiro deploy em producao.

---

## Execution Modes

**Choose your execution mode:**

### 1. YOLO Mode - Fast, Autonomous (0-1 prompts)

- Detecta endpoints automaticamente e cria scripts basicos
- Executa baseline test com thresholds padrao
- **Best for:** Validacao rapida antes de deploy

### 2. Interactive Mode - Balanced, Educational (5-10 prompts) **[DEFAULT]**

- Checkpoints para selecao de endpoints e thresholds
- Explicacoes sobre metricas de performance
- **Best for:** Primeiro load test, equipes aprendendo

### 3. Pre-Flight Planning - Comprehensive Upfront Planning

- Mapeamento completo de fluxos antes de executar
- Plano de teste documentado e aprovado
- **Best for:** Projetos criticos, compliance requirements

**Parameter:** `mode` (optional, default: `interactive`)

---

## Task Definition (SINAPSE Task Format V1.0)

```yaml
task: loadTestingSetup()
responsavel: Quinn (Quality Gate)
responsavel_type: Agente
atomic_layer: Organism

**Entrada:**
- campo: project_path
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: Must be valid project directory

- campo: base_url
  tipo: string
  origem: User Input
  obrigatorio: true
  validacao: URL do ambiente a ser testado (ex: http://localhost:3000)

- campo: target_rps
  tipo: number
  origem: User Input
  obrigatorio: false
  validacao: Target requests per second (default: 50)

- campo: test_duration
  tipo: string
  origem: User Input
  obrigatorio: false
  validacao: Duracao do teste (default: "30s")

**Saida:**
- campo: test_scripts
  tipo: array
  destino: File system (tests/load/*.js)
  persistido: true

- campo: test_report
  tipo: object
  destino: File system (docs/qa/load-test-report.md)
  persistido: true

- campo: bottlenecks
  tipo: array
  destino: Return value
  persistido: false
```

---

## Pre-Conditions

**Purpose:** Validate prerequisites BEFORE task execution (blocking)

**Checklist:**

```yaml
pre-conditions:
  - [ ] k6 is installed and accessible in PATH
    tipo: pre-condition
    blocker: true
    validacao: |
      k6 version returns valid version
    error_message: "k6 not installed. Install via: brew install k6 (macOS) / winget install k6 (Windows) / apt install k6 (Linux)"

  - [ ] Application is running and accessible
    tipo: pre-condition
    blocker: true
    validacao: |
      HTTP GET to base_url returns 2xx or 3xx status
    error_message: "Application not accessible at {base_url}. Start the application first."

  - [ ] API endpoints are documented or discoverable
    tipo: pre-condition
    blocker: false
    validacao: |
      OpenAPI spec exists or routes are scannable
    error_message: "No API documentation found. Endpoints will be identified manually."
```

---

## Post-Conditions

**Purpose:** Validate execution success AFTER task completes

**Checklist:**

```yaml
post-conditions:
  - [ ] k6 test scripts created in tests/load/
    tipo: post-condition
    blocker: true
    validacao: |
      At least one .js file exists in tests/load/
    error_message: "No test scripts created"

  - [ ] Baseline test executed successfully
    tipo: post-condition
    blocker: true
    validacao: |
      k6 exit code 0 for baseline test
    error_message: "Baseline test failed to execute"

  - [ ] Load test report generated
    tipo: post-condition
    blocker: true
    validacao: |
      docs/qa/load-test-report.md exists with results
    error_message: "Load test report not generated"
```

---

## Acceptance Criteria

**Purpose:** Definitive pass/fail criteria for task completion

**Checklist:**

```yaml
acceptance-criteria:
  - [ ] Critical endpoints have dedicated test scripts
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      Each critical endpoint has at least one k6 scenario
    error_message: "Not all critical endpoints covered by tests"

  - [ ] Performance thresholds defined and validated
    tipo: acceptance-criterion
    blocker: true
    validacao: |
      k6 thresholds are configured (p95, error rate, RPS)
    error_message: "Performance thresholds not defined"

  - [ ] Report includes bottleneck analysis
    tipo: acceptance-criterion
    blocker: false
    validacao: |
      Report document contains bottleneck identification section
    error_message: "Bottleneck analysis missing from report"
```

---

## Elicitation

```yaml
elicit: true
interaction_points:
  - base_url: 'Qual a URL base do ambiente de teste? (ex: http://localhost:3000)'
  - critical_endpoints: 'Quais os endpoints/fluxos mais criticos? (ex: login, checkout, dashboard)'
  - target_users: 'Quantos usuarios simultaneos sao esperados em producao?'
  - target_rps: 'Qual o target de requests por segundo? (default: 50 RPS)'
  - test_environment: 'Testar contra qual ambiente? (local / staging / production-like)'
```

---

## Process

### Step 1: Verificar/Instalar k6

**Action:** Garantir que k6 esta instalado e funcional

```bash
# Verificar k6
k6 version

# Se nao instalado, instalar por plataforma:
# macOS
brew install k6

# Windows
winget install k6 --source winget

# Linux (Debian/Ubuntu)
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
  --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D68
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | \
  sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6
```

**Output:** k6 instalado e versao confirmada

---

### Step 2: Identificar Endpoints e Fluxos Criticos

**Action:** Mapear os endpoints mais importantes para testar

```yaml
elicit: true
prompt: |
  Preciso identificar os fluxos criticos do projeto.
  Exemplos comuns:
  - Auth: POST /api/auth/login, POST /api/auth/register
  - CRUD: GET /api/items, POST /api/items, PUT /api/items/:id
  - Pages: GET /, GET /dashboard, GET /profile
  Quais sao os mais criticos para o seu projeto?
```

Estrategias de deteccao automatica:

```bash
# Detectar rotas Next.js (App Router)
find app/api -name "route.ts" -o -name "route.js" 2>/dev/null

# Detectar rotas Next.js (Pages Router)
find pages/api -name "*.ts" -o -name "*.js" 2>/dev/null

# Detectar OpenAPI spec
test -f openapi.json || test -f openapi.yaml || test -f swagger.json
```

**Output:** Lista de endpoints criticos priorizados

---

### Step 3: Criar Scripts k6 por Fluxo Critico

**Action:** Gerar scripts de teste para cada endpoint/fluxo

Criar `tests/load/` directory com scripts:

```javascript
// tests/load/baseline.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // ramp up
    { duration: '1m', target: 10 },    // steady state
    { duration: '10s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],   // 95% das requests < 500ms
    http_req_failed: ['rate<0.01'],     // < 1% error rate
    http_reqs: ['rate>10'],             // > 10 RPS
  },
};

export default function () {
  const res = http.get('${BASE_URL}/');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
```

```javascript
// tests/load/api-endpoints.js
import http from 'k6/http';
import { check, group, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<300'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  group('API Health', () => {
    const res = http.get('${BASE_URL}/api/health');
    check(res, { 'health ok': (r) => r.status === 200 });
  });

  // Add more groups per critical endpoint
  sleep(0.5);
}
```

**Output:** Scripts criados em `tests/load/`

---

### Step 4: Definir Thresholds de Performance

**Action:** Estabelecer limites aceitaveis por tipo de operacao

```yaml
elicit: true
prompt: |
  Thresholds recomendados por tipo de operacao:
  
  | Tipo | P95 Latency | Error Rate | Min RPS |
  |------|-------------|------------|---------|
  | Pages (SSR) | < 1000ms | < 1% | 10 |
  | API reads | < 300ms | < 1% | 50 |
  | API writes | < 500ms | < 2% | 20 |
  | Auth | < 800ms | < 0.5% | 10 |
  | File upload | < 3000ms | < 5% | 5 |
  
  Estes thresholds estao adequados para o seu projeto?
  Posso ajustar conforme necessario.
```

**Output:** Thresholds definidos e aplicados nos scripts

---

### Step 5: Executar Baseline Load Test

**Action:** Rodar teste de carga com volume normal esperado

```bash
# Executar baseline test
k6 run tests/load/baseline.js

# Com output em JSON para analise
k6 run --out json=tests/load/results/baseline.json tests/load/baseline.js

# Com output visual (web dashboard)
K6_WEB_DASHBOARD=true k6 run tests/load/baseline.js
```

Analisar metricas chave:

| Metrica | Significado | Threshold |
|---------|------------|-----------|
| `http_req_duration (p95)` | 95% das requests completam em X ms | < 500ms |
| `http_req_failed` | Taxa de erros | < 1% |
| `http_reqs` | Requests por segundo | > target RPS |
| `vus` | Virtual Users simultaneos | target users |
| `iterations` | Total de iteracoes completadas | > 0 |

**Output:** Resultados baseline documentados

---

### Step 6: Executar Stress Test

**Action:** Testar com 2x-5x da carga esperada para encontrar limites

```javascript
// tests/load/stress.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 20 },    // ramp to normal
    { duration: '2m', target: 20 },    // stay at normal
    { duration: '1m', target: 50 },    // ramp to 2.5x
    { duration: '2m', target: 50 },    // stay at 2.5x
    { duration: '1m', target: 100 },   // ramp to 5x
    { duration: '2m', target: 100 },   // stay at 5x
    { duration: '1m', target: 0 },     // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'],  // more lenient for stress
    http_req_failed: ['rate<0.10'],     // allow up to 10% errors
  },
};

export default function () {
  const res = http.get('${BASE_URL}/');
  check(res, {
    'status is 200': (r) => r.status === 200,
  });
  sleep(0.5);
}
```

```bash
k6 run tests/load/stress.js
```

**Output:** Ponto de ruptura identificado

---

### Step 7: Analisar Resultados e Identificar Gargalos

**Action:** Correlacionar resultados com componentes do sistema

Categorias de gargalos:

| Gargalo | Sintoma | Solucao Comum |
|---------|---------|--------------|
| Database | Latency cresce com carga, queries lentas | Indexacao, query optimization, connection pooling |
| API Server | CPU/memory saturados | Horizontal scaling, caching |
| Network | High TTFB, timeout errors | CDN, edge computing |
| Frontend | Slow initial load, large bundles | Code splitting, lazy loading |
| Auth | Login bottleneck | Token caching, session optimization |

**Output:** Lista de gargalos priorizados

---

### Step 8: Gerar Relatorio de Load Test

**Action:** Criar documento completo com resultados e recomendacoes

Gerar `docs/qa/load-test-report.md`:

```markdown
# Load Test Report

**Projeto:** {project_name}
**Data:** {date}
**Ambiente:** {environment}
**Ferramenta:** k6 v{version}

## Resumo Executivo

| Metrica | Baseline | Stress (2.5x) | Stress (5x) | Threshold |
|---------|----------|---------------|-------------|-----------|
| P95 Latency | Xms | Xms | Xms | < 500ms |
| Error Rate | X% | X% | X% | < 1% |
| Max RPS | X | X | X | > 50 |
| Max VUs | X | X | X | - |

## Resultado: PASS / FAIL / CONCERNS

## Gargalos Identificados
1. ...

## Recomendacoes
1. ...

## Proximos Passos
1. ...
```

**Output:** Relatorio completo gerado

---

### Step 9: Adicionar k6 ao CI/CD (Opcional)

**Action:** Integrar load tests na pipeline de CI/CD

```yaml
elicit: true
prompt: |
  Deseja adicionar load tests a pipeline de CI/CD?
  Opcoes:
  1. Rodar baseline test em cada deploy de staging
  2. Rodar antes de deploy em producao (gate)
  3. Apenas execucao manual (nao adicionar ao CI)
```

Se sim, adicionar step ao workflow:

```yaml
# Adicionar ao .github/workflows/deploy-pipeline.yml
load-test:
  needs: deploy-staging
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: grafana/k6-action@v0.3.1
      with:
        filename: tests/load/baseline.js
      env:
        BASE_URL: ${{ vars.STAGING_URL }}
```

**Output:** Load tests integrados ao CI/CD

---

## Tools

**External/shared resources used by this task:**

- **Tool:** k6
  - **Purpose:** Load testing engine
  - **Source:** https://k6.io

- **Tool:** research-reference
  - **Purpose:** Consultar pesquisa de load testing
  - **Source:** `docs/research/load-testing-capacity-planning.md`

---

## Error Handling

**Strategy:** retry-with-guidance

**Common Errors:**

1. **Error:** k6 Not Installed
   - **Cause:** k6 CLI nao esta no PATH
   - **Resolution:** Instalar conforme Step 1
   - **Recovery:** Fornecer instrucoes por plataforma

2. **Error:** Application Not Responding
   - **Cause:** App nao esta rodando ou URL incorreta
   - **Resolution:** Verificar se app esta acessivel, corrigir URL
   - **Recovery:** Pedir ao usuario para iniciar a aplicacao

3. **Error:** All Requests Failing
   - **Cause:** CORS, auth required, ou URL incorreta
   - **Resolution:** Verificar se endpoint aceita requests externas
   - **Recovery:** Adicionar headers de auth nos scripts, ajustar CORS

4. **Error:** Thresholds Exceeded
   - **Cause:** Performance abaixo do esperado
   - **Resolution:** Isto NAO e um erro da task — e o resultado esperado
   - **Recovery:** Documentar como gargalo no relatorio

---

## Performance

**Expected Metrics:**

```yaml
duration_expected: 30-60 min (including test execution)
cost_estimated: $0.00 (local execution)
token_usage: ~4,000-10,000 tokens
```

**Optimization Notes:**

- Executar testes contra ambiente local para evitar custos
- Reutilizar scripts entre runs, apenas ajustando thresholds
- k6 web dashboard para visualizacao em tempo real

---

## Metadata

```yaml
story: N/A (Framework task)
version: 1.0.0
dependencies:
  - docs/research/load-testing-capacity-planning.md
tags:
  - load-testing
  - performance
  - k6
  - quality
  - stress-testing
updated_at: 2026-04-11
changelog:
  1.0.0:
    - Initial task creation
    - k6 baseline and stress test templates
    - Threshold configuration framework
    - CI/CD integration optional step
```

---

**Related Tasks:**

- `qa-gate` - Quality gate que pode incluir resultados de load test
- `infrastructure-assessment` - Assessment que define thresholds esperados
- `observability-blueprint` - Monitoring para correlacionar com load tests
- `ci-cd-configuration` - Pipeline onde load tests podem ser integrados
