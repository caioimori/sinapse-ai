---
task: orchestrate-dx-pipeline
responsavel: "@design-orqx"
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

# Task: Orchestrate DX Pipeline

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Complex

## Objetivo
Orquestrar a execucao completa do pipeline digital — sequenciar agentes, gerenciar handoffs, monitorar progresso e resolver blockers.

## Entrada
- Workflow selecionado (de select-workflow)
- DX Brief completo
- Assets recebidos de outros squads

## Passos

### 1. Inicializar Pipeline
- Confirmar que todos os pre-requisitos estao satisfeitos
- Verificar assets inbound de outros squads
- Comunicar inicio aos agentes envolvidos

### 2. Executar Fases Sequencialmente
Para cada fase do workflow:

| Responsabilidade | Acao |
|-----------------|------|
| **Antes da fase** | Verificar que inputs estao prontos |
| **Durante** | Monitorar progresso, resolver blockers |
| **Gate** | Executar gate de qualidade da fase |
| **Apos** | Validar outputs, preparar handoff para proxima fase |

### 3. Gerenciar Execucao Paralela
Quando fases permitem paralelismo:
- Confirmar que dependencias estao satisfeitas
- Sincronizar outputs antes da proxima fase sequencial
- Resolver conflitos entre agentes paralelos

### 4. Resolver Blockers
| Tipo de Blocker | Acao |
|----------------|------|
| Falta de input | Escalar para squad source ou stakeholder |
| Gate falhou | Retornar a fase anterior com feedback especifico |
| Conflito de decisao | Mediar entre agentes, priorizar por impacto no usuario |
| Atraso | Re-planejar timeline, comunicar stakeholders |

### 5. Monitorar Quality Gates
Os dois gates INEGOCIAVEIS:
- **Accessibility Gate (Beacon):** WCAG 2.2 AA — PASS/CONDITIONAL/FAIL
- **Performance Gate (Apex):** CWV targets — CERTIFIED/EXCEEDS_BUDGET/FAIL

Ambos devem ser PASS/CERTIFIED para entrega.

## Saida
- Pipeline executado com sucesso
- Todos os gates passados
- Deliverables prontos para entrega
- Handoffs cross-squad completados

## Validacao
- [ ] Todas as fases executadas
- [ ] Accessibility Gate = PASS ou CONDITIONAL
- [ ] Performance Gate = CERTIFIED
- [ ] Deliverables completos
- [ ] Handoffs cross-squad realizados
