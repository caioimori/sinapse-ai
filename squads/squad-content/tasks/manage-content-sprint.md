---
task: manage-content-sprint
responsavel: "@content-orqx"
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

# Task: Manage Content Sprint

> Gerenciar sprint editorial semanal ou quinzenal: do planejamento ao fechamento.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-orqx (Nexus) |
| **Co-agents** | editorial-strategist (North), content-engineer (Arc) |
| **Trigger** | Inicio de sprint editorial |
| **Input** | Sprint plan de North, backlog priorizado |
| **Output** | Sprint executado com todas as pecas produzidas e publicadas |
| **Handoff** | → content-analyst (Lens) para analise de performance |
| **Complexity** | medium |

---

## Fundamentacao

Sprint editorial e a unidade operacional do sistema de conteudo. Sem gestao explicita, sprint vira lista de desejos sem accountability. A cadencia semanal/quinzenal garante ritmo previsivel de entrega, permitindo medicao e melhoria continua. Referencia: metodologia agile adaptada para content ops.

---

## Steps

### Step 1: Sprint Planning

Receber plano de North e transformar em backlog executavel:
- Cada peca com: tema, formato, plataforma, template contract, deadline, responsavel
- Definir capacity: quantas pecas o squad pode produzir no periodo

### Step 2: Daily Tracking

Acompanhar progresso diario:
- Pecas em producao (Arc)
- Pecas em adaptacao (Morph)
- Pecas em QA (Index)
- Pecas publicadas
- Bloqueios identificados

### Step 3: Mid-Sprint Checkpoint

No ponto medio do sprint:
- Avaliar progresso vs planejado
- Repriorizar se necessario
- Resolver bloqueios acumulados

### Step 4: Sprint Closure

- Confirmar todas as pecas publicadas ou justificadas
- Coletar metricas iniciais
- Documentar impedimentos para retrospectiva

### Step 5: Handoff

```yaml
handoff:
  artifact: "sprint-report-{period}.md"
  context: "Sprint fechado com {N} pecas publicadas de {M} planejadas"
  next: "content-analyst (Lens) para analise de performance do sprint"
```
