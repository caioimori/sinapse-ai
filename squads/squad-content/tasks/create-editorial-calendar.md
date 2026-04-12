---
task: create-editorial-calendar
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

# Task: Create Editorial Calendar

> Construir calendario editorial que distribui conteudo ao longo do tempo respeitando pilares, funil e sazonalidade.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-orqx (Nexus), platform-specialist (Morph) |
| **Trigger** | Apos definicao de pilares ou inicio de novo ciclo (mensal/trimestral) |
| **Input** | Pilares editoriais, datas sazonais, frequencia por plataforma, capacidade de producao |
| **Output** | Calendario editorial estruturado com slots, temas e distribuicao |
| **Handoff** | → plan-content-sprint para execucao semanal |
| **Complexity** | complex |

---

## Fundamentacao

Calendario editorial nao e uma lista de posts — e um sistema de distribuicao estrategica. Ele garante: consistencia (publicacao regular), cobertura (todos os pilares representados), timing (conteudo certo no momento certo), e sustentabilidade (capacidade real da equipe). Referencia: CoSchedule — editorial calendar best practices, Buffer — social media scheduling research.

---

## Steps

### Step 1: Definir Cadencia por Plataforma
Para cada plataforma ativa: quantas publicacoes por semana? Instagram Feed (3-5), Stories (diario), Reels (2-3), LinkedIn (3-5), Blog (1-2), Newsletter (1), TikTok (3-5), Twitter/X (5-7). Cadencia deve respeitar capacidade real de producao.

### Step 2: Distribuir Pilares no Tempo
Aplicar proporcoes dos pilares na cadencia. Se pilar principal = 35% e cadencia Instagram = 5/semana, entao ~2 posts/semana desse pilar. Garantir que nenhum pilar fique mais de 5 dias sem publicacao.

### Step 3: Mapear Datas Sazonais
Integrar: feriados nacionais, datas do setor, eventos relevantes, lancamentos de produto, datas proprietarias da marca. Para cada data: qual pilar conecta? Qual formato? Qual antecedencia de producao necessaria?

### Step 4: Criar Slots Tematicos
Definir slots recorrentes que criam expectativa: "Segunda de Dicas", "Case da Semana", "Pergunta da Audiencia". Slots reduzem fadiga de decisao e criam rituais de conteudo. Maximo 3 slots fixos por plataforma.

### Step 5: Estabelecer Buffer de Flexibilidade
Reservar 20-30% dos slots como "flex" para: (1) Sinais HOT que surgem durante a semana, (2) UGC que merece amplificacao, (3) Testes de formato, (4) Reacao a eventos inesperados. Calendario rigido demais mata agilidade.

### Step 6: Definir Metricas de Tracking
Para o calendario: taxa de cumprimento (% dos slots preenchidos), distribuicao real vs planejada por pilar, lead time medio de producao, % de conteudo reativo vs planejado.

### Step 7: Handoff

```yaml
handoff:
  artifact: "editorial-calendar-{client}-{period}.md"
  context: "Calendario criado: {N} slots/semana, {P} plataformas, {D} datas sazonais, buffer {X}%"
  next: "plan-content-sprint para converter calendario em sprints executaveis"
```
