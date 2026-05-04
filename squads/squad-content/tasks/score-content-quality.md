---
task: score-content-quality
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

# Task: Score Content Quality

> Atribuir score de qualidade pos-publicacao baseado em performance real (nao estimativa).

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Trigger** | 7 dias apos publicacao (dados suficientes) |
| **Input** | Metricas reais da peca, benchmarks do projeto |
| **Output** | Score de qualidade pos-publicacao com breakdown por criterio |
| **Handoff** | → content-governor (Index) para calibracao, generate-retrofeed-insights |
| **Complexity** | simple |

---

## Fundamentacao

O score pre-publicacao (Index) e baseado em criterios objetivos de producao. O score pos-publicacao (Lens) e baseado em resultados reais. Comparar os dois revela: estamos bons em prever qualidade? Conteudo que recebeu score alto pre-pub performou bem? Esse feedback loop calibra o sistema. Referencia: data-driven content quality assessment.

---

## Steps

### Step 1: Coletar Metricas Reais
7 dias apos publicacao: engagement rate, save rate, share rate, reach, click-through rate (se aplicavel). Comparar com media do projeto.

### Step 2: Calcular Score Pos-Publicacao
Score composto: (1) Performance vs media (peso 40%), (2) Engagement quality — saves+shares vs likes (peso 30%), (3) Reach efficiency — alcance vs follower count (peso 20%), (4) Conversion — se houve CTA com metrica (peso 10%).

### Step 3: Comparar com Score Pre-Publicacao
Pre-pub score (Index) vs pos-pub score (Lens): alinhados? Divergentes? Divergencias consistentes indicam que os criterios pre-pub precisam recalibracao.

### Step 4: Classificar
A+ (top 10%), A (top 25%), B (media), C (abaixo da media), D (significativamente abaixo). Classificacao alimenta o arquivo e analises futuras.

### Step 5: Handoff

```yaml
handoff:
  artifact: "quality-score-{peca}.md"
  context: "Score pos-pub: {score}, classificacao {classe}, pre vs pos delta {delta}"
  next: "content-governor (Index) para calibracao e generate-retrofeed-insights"
```
