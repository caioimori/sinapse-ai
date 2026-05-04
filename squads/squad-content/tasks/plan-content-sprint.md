---
task: plan-content-sprint
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

# Task: Plan Content Sprint

> Planejar sprint semanal de conteudo convertendo calendario editorial em tarefas executaveis.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-orqx (Nexus), content-engineer (Arc) |
| **Trigger** | Inicio de cada semana ou sprint |
| **Input** | Calendario editorial, sinais da semana (Radar), capacidade disponivel |
| **Output** | Sprint planejado com pecas atribuidas, prazos e prioridades |
| **Handoff** | → content-orqx (Nexus) para orquestracao da producao |
| **Complexity** | medium |

---

## Fundamentacao

O sprint de conteudo traduz estrategia em acao. Sem ele, o calendario vira wishful thinking. O sprint considera capacidade real, prioriza baseado em impacto, e inclui slots para sinais emergentes. Referencia: Agile Content Marketing (Andrea Fryrear), Scrum aplicado a content ops.

---

## Steps

### Step 1: Revisar Sinais da Semana
Consultar briefing semanal do Radar: quais sinais WARM merecem espaco no sprint? Algum sinal HOT ja em producao? Ajustar slots flex do calendario.

### Step 2: Selecionar Pecas do Calendario
Do calendario editorial, puxar as pecas planejadas para a semana. Para cada peca: pilar, formato, plataforma, sub-tema. Validar se ha material de referencia ou brief ja existente.

### Step 3: Priorizar por Impacto
Ordenar pecas por prioridade: (1) Deadlines fixas (datas sazonais), (2) Sinais HOT/WARM com janela, (3) Conteudo de funil FUNDO (revenue), (4) Conteudo de pilar principal, (5) Conteudo de teste/experimental.

### Step 4: Atribuir e Estimar
Para cada peca: complexidade (simples/medio/complexo), tempo estimado de producao, dependencias (precisa de design? foto? dados?). Distribuir na capacidade disponivel.

### Step 5: Montar Sprint Board
Compilar sprint com: coluna backlog, em producao, em revisao, aprovado, publicado. Cada peca com: titulo, pilar, formato, plataforma, prazo, status.

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-sprint-{week}.md"
  context: "Sprint planejado: {N} pecas, {P} plataformas, {H} sinais incorporados, capacidade {X}%"
  next: "content-orqx (Nexus) para iniciar producao e orquestrar pipeline"
```
