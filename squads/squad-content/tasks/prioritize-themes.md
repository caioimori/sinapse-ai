---
task: prioritize-themes
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

# Task: Prioritize Themes

> Priorizar temas e sub-temas para producao baseado em dados, timing e alinhamento estrategico.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | signal-intelligence (Radar), content-analyst (Lens) |
| **Trigger** | Planejamento semanal/mensal ou quando backlog de temas excede capacidade |
| **Input** | Banco de temas, sinais ativos, metricas de performance, prioridades de negocio |
| **Output** | Ranking de temas priorizado com justificativa |
| **Handoff** | → plan-content-sprint |
| **Complexity** | simple |

---

## Fundamentacao

Backlog de ideias infinito + capacidade finita = priorizacao obrigatoria. Sem criterios claros, a equipe produz o que "parece legal" em vez do que gera resultado. A priorizacao estruturada usa dados (Lens), timing (Radar) e estrategia (North) para decidir. Referencia: RICE framework adaptado para conteudo.

---

## Steps

### Step 1: Listar Temas Candidatos
Consolidar todas as fontes de temas: sub-temas dos pilares, sinais do Radar, sugestoes de performance (Lens), solicitacoes do negocio, ideias da equipe.

### Step 2: Aplicar Scoring RICE Adaptado
Para cada tema: (R) Reach — quantas pessoas impacta? (I) Impact — quao profundo o impacto? (C) Confidence — quao certos estamos do resultado? (E) Effort — quanto esforco de producao? Score = (R * I * C) / E.

### Step 3: Aplicar Filtros de Timing
Temas com janela temporal sobem na prioridade independente do RICE: sazonalidade, trend ativo, janela de oportunidade detectada pelo Radar.

### Step 4: Gerar Ranking Final
Top 10 temas priorizados com: score RICE, justificativa, pilar associado, formato sugerido, urgencia (tempo-limitado ou evergreen).

### Step 5: Handoff

```yaml
handoff:
  artifact: "theme-priorities-{period}.md"
  context: "Temas priorizados: top {N}, {M} tempo-limitados, {E} evergreen"
  next: "plan-content-sprint para incorporar temas priorizados"
```
