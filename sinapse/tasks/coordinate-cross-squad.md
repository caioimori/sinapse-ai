---
task: coordinate-cross-squad
responsavel: "@sinapse-master"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: multi_squad_plan
    tipo: object
    origem: "compose-multi-squad-plan ou manual"
    obrigatorio: true

Saida:
  - campo: coordination_log
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Plano multi-squad definido"
  - "[ ] Sequencia de execucao clara"
  - "[ ] Handoffs estruturados entre squads"
  - "[ ] Progresso monitorado"
  - "[ ] Resultado final sintetizado"
---

# Task: Coordinate Cross-Squad Workflow

## Metadata
- **Squad:** squad-sinapse
- **Agent:** Imperator (sinapse-master)
- **Complexity:** Advanced

## Objetivo
Orquestrar workflows que envolvem 2 ou mais squads trabalhando juntas, garantindo handoffs estruturados, execucao sequencial/paralela correta, e sintese final coerente.

## Entrada
- Multi-squad execution plan (from `compose-multi-squad-plan`)
- User's business objective
- Timeline and constraints
- Current state of each squad's deliverables (if any)

## Passos

### 1. Execution Plan Review

Validar o plano antes de iniciar:

```
CROSS-SQUAD EXECUTION PLAN
===========================
Initiative: {nome}
Objective: {objetivo do usuario}
Squads Involved: {lista}
Lead Squad: {quem faz a sintese final}
Timeline: {estimado}

PHASES:
Phase 1: {nome}
  Lead: squad-{x} / {orchestrator}
  Parallel: [squad-{y}, squad-{z}]
  Dependencies: none
  Expected Output: {deliverable}

Phase 2: {nome}
  Lead: squad-{a} / {orchestrator}
  Dependencies: Phase 1 outputs
  Handoff Required: {what context passes}
  Expected Output: {deliverable}

Phase N: {nome} — SYNTHESIS
  Lead: {lead squad}
  Inputs: All previous phase outputs
  Expected Output: {final deliverable}
```

### 2. Phase Kickoff

Para cada fase:
- Ativar o(s) squad orchestrator(s) da fase com contexto completo
- Fornecer invocation commands ao usuario
- Especificar o que cada squad deve entregar
- Se paralelo: iniciar todos simultaneamente
- Se serial: aguardar fase anterior completar

### 3. Handoff Management

Quando uma fase termina e a proxima depende dela:

```
HANDOFF ARTIFACT
================
From: squad-{sender} / {agent}
To: squad-{receiver} / {agent}
Phase: {N} → {N+1}

Deliverables Passed:
- {deliverable 1}: {descricao + localizacao}
- {deliverable 2}: {descricao + localizacao}

Key Decisions Made:
- {decisao 1}
- {decisao 2}

Constraints for Next Phase:
- {restricao 1}
- {restricao 2}

Invocation: /{prefix}:agents:{orchestrator-id}
Context: {resumo do que a squad receptora precisa saber}
```

### 4. Progress Tracking

Manter status atualizado:

| Phase | Squad | Status | Deliverable | Notes |
|-------|-------|--------|-------------|-------|
| 1 | brand-system | Done | Brand guidelines | Approved |
| 2a | digital-experience | In Progress | Wireframes | 60% |
| 2b | copywriting-persuasion | In Progress | Web copy | Draft ready |
| 3 | creative-animations | Waiting | Page animations | Depends on 2a |

### 5. Blocker Resolution

Se uma squad reportar blocker:
- Identificar se e intra-squad ou inter-squad
- Se intra: delegar ao squad orchestrator resolver
- Se inter: mediar entre os squad orchestrators
- Se nao resolvivel: escalar ou adaptar o plano

### 6. Final Synthesis

Quando todas as fases completam:
- Coletar outputs de todas as squads
- Verificar coerencia entre deliverables
- Gerar resumo executivo para o usuario
- Destacar pontos de atencao ou gaps

## Saida
- Coordination log com status de cada fase
- Handoff artifacts entre fases
- Final synthesis document
- Lessons learned (para futuras coordenacoes similares)

## Validacao
- [ ] Todas as fases executadas na ordem correta
- [ ] Handoffs entre squads estruturados e completos
- [ ] Nenhum blocker inter-squad pendente
- [ ] Deliverables finais coerentes entre si
- [ ] Usuario recebeu resultado unificado
