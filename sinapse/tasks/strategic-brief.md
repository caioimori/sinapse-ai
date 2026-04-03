---
task: strategic-brief
responsavel: "@sinapse-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: topic
    tipo: string
    origem: "user input"
    obrigatorio: true
  - campo: context
    tipo: object
    origem: "user or previous task"
    obrigatorio: false

Saida:
  - campo: strategic_brief
    tipo: document
    destino: "user, squad orchestrators"

Checklist:
  - "[ ] Entender o objetivo estrategico"
  - "[ ] Mapear quais squads contribuem"
  - "[ ] Sintetizar capabilities relevantes"
  - "[ ] Gerar plano de acao com invocacoes"
---

# Task: Strategic Brief

## Metadata
- **Squad:** squad-sinapse
- **Agent:** Imperator (sinapse-orqx)
- **Complexity:** Advanced

## Objetivo
Gerar um brief estrategico para qualquer iniciativa de negocio, mapeando como o ecossistema de squads pode ser ativado para alcançar o objetivo. O brief identifica quais squads sao relevantes, em que ordem ativar, e que deliverables esperar.

## Entrada
- Topic/initiative description
- Business context (mercado, empresa, fase, goals)
- Constraints (budget, timeline, team)
- Current assets (o que ja existe)

## Passos

### 1. Elicitation (if context is incomplete)

Perguntas essenciais:
1. Qual e o objetivo de negocio principal?
2. Qual e o publico-alvo?
3. Qual e o timeline?
4. O que ja existe (marca, produto, site, conteudo)?
5. Quais sao as restricoes?

### 2. Strategic Analysis

Mapear o objetivo contra as capabilities do ecossistema:

```
STRATEGIC BRIEF
===============
Initiative: {nome}
Objective: {objetivo}
Date: {data}
Author: Imperator (sinapse-orqx)

SITUATION ANALYSIS:
- Current State: {onde o usuario esta}
- Desired State: {onde quer chegar}
- Gap: {o que falta}
- Key Challenge: {principal obstaculo}

ECOSYSTEM ACTIVATION MAP:
| Priority | Squad | Contribution | Deliverable |
|----------|-------|-------------|-------------|
| P0 | squad-{x} | {papel} | {entrega} |
| P1 | squad-{y} | {papel} | {entrega} |
| P2 | squad-{z} | {papel} | {entrega} |
```

### 3. Execution Roadmap

```
RECOMMENDED EXECUTION:

Phase 1 — Foundation ({timeline})
  Lead: squad-{x} via /{prefix}:agents:{orchestrator}
  Deliverables: {lista}
  Dependencies: None

Phase 2 — Build ({timeline})
  Lead: squad-{y} via /{prefix}:agents:{orchestrator}
  Parallel: squad-{z} via /{prefix}:agents:{orchestrator}
  Deliverables: {lista}
  Dependencies: Phase 1 outputs

Phase 3 — Launch ({timeline})
  Lead: squad-{a} via /{prefix}:agents:{orchestrator}
  Deliverables: {lista}
  Dependencies: Phase 2 outputs

STRATEGIC COUNCIL INPUT:
  If strategic uncertainty exists, recommend: /council:agents:council-orqx
  Specific advisors: {relevant advisors from strategic-council}
```

### 4. Risk Assessment

```
RISKS & MITIGATIONS:
| Risk | Impact | Squad Owner | Mitigation |
|------|--------|-------------|-----------|
| {risk 1} | High/Med/Low | squad-{x} | {acao} |
| {risk 2} | High/Med/Low | squad-{y} | {acao} |
```

### 5. Success Metrics

```
SUCCESS METRICS:
| Metric | Target | Measured By | Squad |
|--------|--------|-------------|-------|
| {metrica 1} | {target} | {como} | squad-{x} |
| {metrica 2} | {target} | {como} | squad-{y} |
```

## Saida
- Strategic brief document completo
- Execution roadmap com fases e squads
- Risk assessment
- Success metrics
- Invocation commands para cada squad envolvida

## Validacao
- [ ] Objetivo de negocio claramente articulado
- [ ] Squads relevantes identificadas e priorizadas
- [ ] Execution roadmap com sequencia logica
- [ ] Riscos identificados com mitigacoes
- [ ] Metricas de sucesso definidas
- [ ] Invocation commands fornecidos para todas as squads

