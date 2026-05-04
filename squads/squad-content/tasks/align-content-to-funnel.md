---
task: align-content-to-funnel
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

# Task: Align Content to Funnel

> Garantir que o mix de conteudo cobre todos os estagios do funil com proporcoes adequadas.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-analyst (Lens) |
| **Trigger** | Planejamento mensal ou analise de gap |
| **Input** | Conteudo produzido, metricas por estagio, objetivos de negocio |
| **Output** | Analise de cobertura de funil com recomendacoes de ajuste |
| **Handoff** | → create-editorial-calendar para ajustes |
| **Complexity** | medium |

---

## Fundamentacao

Marcas que so produzem conteudo TOPO (awareness) nunca convertem. Marcas que so produzem FUNDO (venda) nunca crescem audiencia. O equilibrio e critico: tipicamente 60% TOPO, 25% MEIO, 15% FUNDO para marcas em crescimento. Para marcas maduras: 40-30-30. O alinhamento ao funil previne vieses inconscientes de producao. Referencia: Marcus Sheridan — They Ask You Answer, Robert Rose — Content Marketing Strategy.

---

## Steps

### Step 1: Classificar Conteudo Existente por Funil
Auditar ultimas 4-8 semanas: cada peca e TOPO (awareness/alcance), MEIO (educacao/autoridade) ou FUNDO (conversao/CTA)? Calcular distribuicao real.

### Step 2: Comparar Real vs Ideal
Qual e a distribuicao ideal para o momento do cliente? Comparar com distribuicao real. Identificar gaps: "Estamos com 80% TOPO e 5% FUNDO — zero conteudo de conversao."

### Step 3: Mapear Formatos por Funil
Quais formatos servem melhor cada estagio? TOPO: Reels, trends, hooks. MEIO: Carrosseis educativos, blog posts, newsletters. FUNDO: Cases, depoimentos, comparativos, CTAs. Garantir que os formatos planejados cobrem o funil.

### Step 4: Recomendar Ajustes
Gerar recomendacoes concretas: "Aumentar conteudo FUNDO de 5% para 15% — adicionar 2 cases/mes e 1 comparativo/mes". Cada recomendacao com formato, pilar e frequencia sugerida.

### Step 5: Handoff

```yaml
handoff:
  artifact: "funnel-alignment-{client}-{date}.md"
  context: "Alinhamento de funil: Real {T/M/F}%, Ideal {T/M/F}%, {N} ajustes recomendados"
  next: "create-editorial-calendar para incorporar ajustes no proximo ciclo"
```
