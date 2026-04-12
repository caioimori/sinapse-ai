---
task: define-content-kpis
responsavel: "@editorial-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Define Content KPIs

> Definir KPIs de conteudo alinhados aos objetivos de negocio do cliente.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-analyst (Lens), content-orqx (Nexus) |
| **Trigger** | Onboarding de novo cliente ou revisao trimestral |
| **Input** | Objetivos de negocio, capacidade de medicao, plataformas ativas |
| **Output** | Framework de KPIs com metricas, metas e frequencia de medicao |
| **Handoff** | → content-analyst (Lens) para configurar tracking |
| **Complexity** | medium |

---

## Fundamentacao

KPIs errados geram comportamento errado. Se o KPI e "numero de posts", a equipe produz quantidade sem qualidade. Se o KPI e so "followers", conteudo vira engajamento vazio. KPIs devem ser estratificados: (1) metricas de vaidade sao indicadores, nao metas, (2) metricas de engajamento medem ressonancia, (3) metricas de conversao medem impacto real. Referencia: Robert Rose — "content marketing metrics that matter", Joe Pulizzi — SMART goals for content.

---

## Steps

### Step 1: Mapear Objetivos de Negocio
Quais sao os 3-5 objetivos de negocio do cliente? Awareness? Leads? Vendas diretas? Autoridade no setor? Construcao de comunidade? Cada objetivo demanda KPIs diferentes.

### Step 2: Definir Metricas por Camada
Camada 1 (Consumo): impressoes, alcance, views, pageviews, tempo na pagina. Camada 2 (Engajamento): likes, comments, saves, shares, click-through rate. Camada 3 (Lead): newsletter signups, downloads, DMs qualificadas. Camada 4 (Revenue): vendas atribuidas, ROI de conteudo, CAC via conteudo.

### Step 3: Estabelecer Metas (Baselines + Targets)
Para cada KPI: qual e o baseline atual? Qual a meta para 30/60/90 dias? Metas devem ser SMART (especificas, mensuraveis, atingiveis, relevantes, temporais).

### Step 4: Definir Frequencia de Medicao
Diario: impressoes, alcance. Semanal: engajamento, CTR. Mensal: leads, conversoes, share of voice. Trimestral: ROI, brand lift, autoridade.

### Step 5: Criar Scorecard
Compilar KPIs em scorecard visual: metrica, baseline, meta, atual, status (verde/amarelo/vermelho). Scorecard e o artefato que Lens popula periodicamente.

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-kpis-{client}.md"
  context: "KPIs definidos: {N} metricas em {C} camadas, baselines estabelecidos, scorecard criado"
  next: "content-analyst (Lens) para configurar tracking e primeira medicao"
```
