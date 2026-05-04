---
task: orchestrate-content-pipeline
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

# Task: Orchestrate Content Pipeline

> Coordenar o pipeline completo de conteudo: deteccao de sinal → producao → publicacao → analise.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-orqx (Nexus) |
| **Co-agents** | Todos os agentes do squad |
| **Trigger** | Inicio de sprint ou novo projeto |
| **Input** | Plano editorial de North, sinais do Radar, status do pipeline |
| **Output** | Pipeline orquestrado com assignments, deadlines e status tracking |
| **Handoff** | → Todos os agentes com suas tasks atribuidas |
| **Complexity** | complex |

---

## Fundamentacao

Orquestracao e o que transforma agentes individuais em sistema coeso. Sem coordenacao explicita, o pipeline fragmenta: Radar detecta sinais que North nao prioriza, Arc produz conteudo que Morph nao consegue adaptar a tempo, Index valida sem contexto. Nexus garante que o pipeline opere como unidade sincronizada, nao como colecao de agentes independentes. Referencia: Halvorson Content Strategy Quad — Workflow como uma das 4 dimensoes criticas.

---

## Steps

### Step 1: Coletar Inputs do Pipeline

Agregar status de todos os agentes:
- Radar: sinais pendentes, briefing semanal pronto?
- North: plano editorial atualizado? Sprint planejado?
- Arc: backlog de producao, capacidade disponivel
- Morph: template contracts registrados, plataformas configuradas
- Index: filas de QA, pendencias de aprovacao
- Lens: dados de performance disponiveis, retrofeed pendente

### Step 2: Criar Backlog Priorizado

1. Listar todas as pecas de conteudo planejadas/pendentes
2. Priorizar por: impacto estimado (SPV) × urgencia × esforco
3. Classificar: HOT (fazer hoje), SPRINT (fazer esta semana), BACKLOG (proximo sprint)
4. Alocar por agente respeitando capacidade

### Step 3: Distribuir Assignments

Para cada peca de conteudo:
- Definir agente responsavel por cada fase
- Definir deadline por fase
- Confirmar que template contract esta disponivel
- Confirmar que brand guidelines estao acessiveis

### Step 4: Monitorar Execucao

- Checkpoint diario: o que foi concluido, o que esta atrasado, o que esta bloqueado
- Desbloquear gargalos proativamente (se Arc esta sobrecarregado, repriorizar)
- Escalar para North se necessario re-planejamento

### Step 5: Garantir Handoffs Limpos

Cada transicao entre agentes deve ter:
- Output claro do agente anterior
- Input esperado pelo proximo agente
- Contexto suficiente para continuidade sem perda de informacao

### Step 6: Handoff

```yaml
handoff:
  artifact: "pipeline-status-{date}.md"
  context: "Pipeline orquestrado com assignments e deadlines distribuidos"
  next: "Cada agente executa suas tasks atribuidas"
```
