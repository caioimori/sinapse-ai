---
task: manage-research-sprint
responsavel: "@research-orqx"
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

# Task: Manage Research Sprint

## Metadata
- **Squad:** squad-research
- **Agent:** research-orqx (Prism)
- **Complexity:** STANDARD
- **Depends on:** prioritize-research-requests
- **Feeds:** orchestrate-research-pipeline

## Objetivo
Gerenciar sprint de pesquisa (ciclo de 1-2 semanas) com backlog priorizado, atribuicoes claras e review ao final.

## Entrada
- Backlog priorizado de pesquisas
- Capacidade dos agentes para o sprint
- Deadlines e compromissos cross-squad

## Passos

### 1. Sprint Planning
- Selecionar pesquisas do backlog para o sprint
- Regra: max 2 DEEP DIVE + 3 ANALYZE + 5 SCAN por sprint
- Distribuir por agente respeitando expertise e capacidade
- Definir Sprint Goal (ex: "Completar analise competitiva para brand-system")

### 2. Sprint Board
- Organizar em colunas: BACKLOG → IN PROGRESS → REVIEW → DONE
- Max 2 pesquisas IN PROGRESS por agente
- Pesquisas cross-squad marcadas com flag

### 3. Daily Standup (Check Rapido)
- Para cada pesquisa IN PROGRESS:
  - Progresso vs timeline?
  - Bloqueios?
  - Necessidade de ajuda ou redirecionamento?
- Intervir se pesquisa estiver travada

### 4. Quality Review
- Antes de mover para DONE: aplicar research-quality-checklist
- Se nao passa: devolver com feedback especifico
- Se passa: mover para DONE e encaminhar delivery

### 5. Sprint Review
- Consolidar: quantas pesquisas planejadas vs entregues
- Velocity: tempo medio por nivel
- Qualidade: % que passou no quality gate na primeira vez
- Insights consolidados do sprint
- Lessons learned para calibrar proximo sprint

## Saida
- Sprint executado com pesquisas entregues
- Sprint review com metricas e lessons learned
- Input para proximo sprint planning

## Validacao
- [ ] Sprint goal definido
- [ ] Pesquisas distribuidas por agente
- [ ] Quality gate aplicado em todas as entregas
- [ ] Sprint review documentado
- [ ] Velocity calculada para calibracao

---

*Task operada por: research-orqx (Prism)*
