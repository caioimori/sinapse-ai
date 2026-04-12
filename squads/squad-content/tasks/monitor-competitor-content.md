---
task: monitor-competitor-content
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

# Task: Monitor Competitor Content

> Monitorar estrategia de conteudo de concorrentes para identificar oportunidades e lacunas.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | — |
| **Trigger** | Semanal ou sob demanda |
| **Input** | Lista de concorrentes configurada, plataformas monitoradas |
| **Output** | Competitive content report com insights e oportunidades |
| **Handoff** | → editorial-strategist (North), content-analyst (Lens) |
| **Complexity** | medium |

---

## Fundamentacao

Monitorar concorrentes nao e para copiar — e para encontrar angulos diferenciados. Quando um concorrente publica conteudo de alto engajamento, a pergunta nao e "como fazer igual?" mas "o que ele NAO esta dizendo que EU posso dizer?". Referencia: Andy Crestodina — competitive content gap analysis.

---

## Steps

### Step 1: Varrer Conteudo dos Concorrentes
Para cada concorrente: ultimas publicacoes em todas as plataformas monitoradas. Volume, frequencia, formatos.

### Step 2: Identificar Top Performers
Quais conteudos do concorrente tiveram maior engajamento? Por que? (formato, tema, timing, angulo?)

### Step 3: Identificar Gaps
O que os concorrentes NAO estao fazendo? Quais pilares/formatos/plataformas estao descobertos?

### Step 4: Gerar Oportunidades
Para cada gap ou top performer: qual angulo diferenciado o cliente pode trazer?

### Step 5: Handoff

```yaml
handoff:
  artifact: "competitive-content-report-{date}.md"
  context: "Monitoramento competitivo: {N} concorrentes, {M} oportunidades identificadas"
  next: "editorial-strategist (North) para incorporar no planejamento"
```
