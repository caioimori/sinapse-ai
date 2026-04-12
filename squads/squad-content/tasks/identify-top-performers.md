---
task: identify-top-performers
responsavel: "@content-analyst"
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

# Task: Identify Top Performers

> Identificar conteudo de alta performance e extrair padroes replicaveis.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Trigger** | Semanal (monitoramento) ou mensal (analise) |
| **Input** | Metricas de performance de todas as pecas do periodo |
| **Output** | Lista de top performers com analise de por que funcionaram |
| **Handoff** | → editorial-strategist (North), content-engineer (Arc) |
| **Complexity** | simple |

---

## Fundamentacao

Top performers sao a mina de ouro do content marketing. Cada top performer contem padroes replicaveis: um tipo de hook que funciona, um formato que a audiencia ama, um tema que ressoa. Extrair esses padroes e transforma-los em playbook e como compounding funciona em conteudo. Referencia: 80/20 principle applied to content — 20% das pecas geram 80% dos resultados.

---

## Steps

### Step 1: Definir Criterio de Top Performer
Top 10% por engagement rate? Top 5 por saves? Top 3 por conversao? Definir criterio baseado nos KPIs prioritarios do projeto.

### Step 2: Listar Top Performers do Periodo
Rankear todas as pecas pelo criterio definido. Selecionar top 5-10 para analise detalhada.

### Step 3: Analisar Cada Top Performer
Para cada: tema, formato, plataforma, horario, hook utilizado, CTA, comprimento, elementos visuais. O que tem em comum? O que e unico?

### Step 4: Extrair Padroes Replicaveis
Padroes que aparecem em 3+ top performers sao replicaveis: tipo de hook, formato, tema, timing. Documentar como "regras de top performance".

### Step 5: Recomendar Replicacao
Para cada padrao: como replicar no proximo sprint? Sugestoes concretas de pecas que aplicam os padroes descobertos.

### Step 6: Handoff

```yaml
handoff:
  artifact: "top-performers-{period}.md"
  context: "Top performers: {N} pecas analisadas, {P} padroes extraidos, {R} recomendacoes"
  next: "editorial-strategist (North) e content-engineer (Arc) para replicacao"
```
