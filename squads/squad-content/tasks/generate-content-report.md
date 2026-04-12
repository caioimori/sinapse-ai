---
task: generate-content-report
responsavel: "@content-analyst"
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

# Task: Generate Content Report

> Gerar relatorio consolidado de conteudo para stakeholders e tomada de decisao.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Co-agents** | content-orqx (Nexus) |
| **Trigger** | Mensal (report padrao) ou sob demanda |
| **Input** | Todas as metricas e analises do periodo |
| **Output** | Relatorio executivo com metricas, insights e recomendacoes |
| **Handoff** | → content-orqx (Nexus), stakeholders |
| **Complexity** | medium |

---

## Fundamentacao

O relatorio de conteudo e o artefato que comunica valor para stakeholders. Deve ser: conciso (executivos nao leem 30 paginas), visual (graficos > tabelas), focado em insights (nao descricao de metricas), e orientado a acao (cada insight com recomendacao). Referencia: Avinash Kaushik — reporting best practices, Google Analytics — dashboard design.

---

## Steps

### Step 1: Consolidar Metricas do Periodo
KPIs vs metas, metricas por plataforma, metricas por pilar, metricas por formato. Comparar com periodo anterior.

### Step 2: Destacar Destaques
Top 3 conquistas do periodo. Top 3 desafios. Maior surpresa (positiva ou negativa). Formato: narrativa, nao lista de numeros.

### Step 3: Incluir Analises Aprofundadas
1-2 analises deep-dive: por que um formato explodiu? Por que um pilar caiu? Correlacao entre evento externo e performance.

### Step 4: Apresentar Recomendacoes
3-5 recomendacoes acionaveis para o proximo periodo. Cada recomendacao com: contexto (por que), acao (o que fazer), impacto esperado (resultado projetado).

### Step 5: Formatar para Audiencia
Executivos: 1 pagina de executive summary. Equipe operacional: detalhamento completo. Formato visual: graficos, scorecards, comparativos visuais.

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-report-{period}.md"
  context: "Report: {periodo}, {N} metricas, {D} destaques, {R} recomendacoes"
  next: "content-orqx (Nexus) para distribuicao e stakeholders"
```
