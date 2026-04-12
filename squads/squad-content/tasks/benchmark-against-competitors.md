---
task: benchmark-against-competitors
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

# Task: Benchmark Against Competitors

> Comparar performance de conteudo com concorrentes para contextualizar resultados.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Co-agents** | signal-intelligence (Radar) |
| **Trigger** | Mensal ou trimestral |
| **Input** | Dados proprios, dados publicos de concorrentes, relatorios do Radar |
| **Output** | Benchmark comparativo com posicao relativa e oportunidades |
| **Handoff** | → editorial-strategist (North), content-orqx (Nexus) |
| **Complexity** | medium |

---

## Fundamentacao

Performance absoluta sem contexto e cega. Crescer 10% e bom — a menos que concorrentes cresceram 50%. Benchmark contextualiza: estamos ganhando ou perdendo share of voice? Quais formatos os concorrentes estao usando com sucesso que nos nao estamos? Onde estamos na frente e devemos dobrar a aposta? Referencia: Andy Crestodina — competitive benchmarking, Sprout Social — competitive analysis.

---

## Steps

### Step 1: Coletar Dados Publicos
Para cada concorrente: followers, frequencia, engagement rate estimado (likes+comments/followers), formatos usados, temas cobertos. Dados publicos apenas.

### Step 2: Comparar Metricas-Chave
Engagement rate relativo, crescimento de audiencia, share of voice, frequencia de publicacao. Onde estamos acima, na media, ou abaixo?

### Step 3: Analisar Estrategia Competitiva
Quais temas os concorrentes priorizam? Quais formatos dominam? Que angulo adotam? Como se posicionam? Mapa de posicionamento de conteudo.

### Step 4: Identificar Oportunidades
Onde os concorrentes estao fracos? Quais formatos nao exploram? Quais temas ignoram? Essas sao oportunidades de diferenciacao.

### Step 5: Handoff

```yaml
handoff:
  artifact: "competitive-benchmark-{period}.md"
  context: "Benchmark: {N} concorrentes, posicao relativa {posicao}, {O} oportunidades"
  next: "editorial-strategist (North) para incorporar insights no planejamento"
```
