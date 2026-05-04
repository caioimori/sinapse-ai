---
task: prioritize-research-requests
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

# Task: Prioritize Research Requests

## Metadata
- **Squad:** squad-research
- **Agent:** research-orqx (Prism)
- **Complexity:** STANDARD
- **Depends on:** triage-research-request
- **Feeds:** orchestrate-research-pipeline

## Objetivo
Priorizar backlog de demandas de pesquisa usando framework de impacto × urgencia, garantindo que recursos limitados vao para as pesquisas de maior valor.

## Entrada
- Backlog de demandas de pesquisa pendentes
- Capacidade disponivel dos agentes
- Deadlines em andamento

## Passos

### 1. Inventariar Demandas
- Listar todas as demandas pendentes
- Para cada: origem, pergunta, nivel, deadline, stakeholder

### 2. Scoring de Priorizacao (ICE adaptado)
- **Impact (1-5):** Qual o impacto da resposta na decisao de negocio?
  - 5 = decisao critica (investimento, pivot, lancamento)
  - 3 = decisao tatica (campanha, feature, pricing)
  - 1 = curiosidade/nice-to-have
- **Confidence (1-5):** Quao provavel que a pesquisa entregue insight acionavel?
  - 5 = pergunta clara, fontes disponiveis
  - 3 = pergunta razoavel, fontes parciais
  - 1 = pergunta vaga, fontes incertas
- **Effort (1-5 invertido):** Quanto esforco? (5=pouco, 1=muito)
  - 5 = SCAN (15-30 min)
  - 3 = ANALYZE (1-3h)
  - 1 = DEFINITIVE (multi-dia)

**Score = (Impact × Confidence × Effort) / 25 × 100**

### 3. Considerar Dependencias
- Pesquisa A bloqueia pesquisa B? A sobe na fila
- Cross-squad com deadline externo? Prioridade automatica
- Pesquisa que alimenta multiplos squads > pesquisa para 1 squad

### 4. Alocar Capacidade
- Verificar disponibilidade de cada agente
- Atribuir pesquisas priorizadas respeitando expertise
- Se gargalo: Sage pode absorver tasks de Hawk/Scope em modo SCAN

### 5. Comunicar Prioridades
- Notificar agentes sobre suas atribuicoes
- Notificar stakeholders sobre timeline estimado
- Se demanda deprioritizada: explicar racional e alternativa

## Saida
- Backlog priorizado com scores
- Atribuicoes de agente definidas
- Stakeholders notificados

## Validacao
- [ ] Todas as demandas pontuadas
- [ ] Top 3 prioridades definidas
- [ ] Capacidade alocada sem overload
- [ ] Stakeholders de demandas deprioritizadas notificados

---

*Task operada por: research-orqx (Prism)*
