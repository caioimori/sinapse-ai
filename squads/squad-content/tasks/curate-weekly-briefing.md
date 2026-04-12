---
task: curate-weekly-briefing
responsavel: "@signal-intelligence"
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

# Task: Curate Weekly Briefing

> Compilar briefing semanal priorizado de sinais com SPV scoring e recomendacoes.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | — |
| **Trigger** | Semanal (sexta-feira ou segunda-feira) |
| **Input** | Sinais WARM e HOT acumulados na semana, logs diarios |
| **Output** | Briefing semanal curado usando weekly-signal-briefing-template |
| **Handoff** | → editorial-strategist (North) para planejamento |
| **Complexity** | medium |

---

## Fundamentacao

O briefing semanal e o combustivel do planejamento editorial. Transforma uma semana de sinais dispersos em um documento acionavel com prioridades claras. Sem curadoria, North recebe ruido. Com curadoria, North recebe inteligencia. Referencia: BuzzSumo Content Characteristics — criterios de selecao baseados em dados.

---

## Steps

### Step 1: Compilar Sinais da Semana
Agregar todos os sinais WARM e HOT dos logs diarios. Excluir COLD (arquivados).

### Step 2: Rankear por SPV
Aplicar Score de Potencial Viral a cada sinal. Ordenar do maior para o menor.

### Step 3: Mapear para Pilares e Funil
Cada sinal: qual pilar editorial? Qual estagio de funil (TOPO/MEIO/FUNDO)? Se nao mapeia: descartar ou reavaliar.

### Step 4: Sugerir Formato e Template
Para cada sinal top: qual formato ideal (carrossel, reel, post, blog)? Qual template contract disponivel?

### Step 5: Compilar Briefing
Usar weekly-signal-briefing-template: resumo executivo (top 3), tabela de sinais, secao competitiva, secao cultural, secao UGC, recomendacoes.

### Step 6: Handoff

```yaml
handoff:
  artifact: "weekly-briefing-{date}.md"
  context: "Briefing semanal com {N} sinais curados, top 3: {s1}, {s2}, {s3}"
  next: "editorial-strategist (North) para plan-content-sprint"
```
