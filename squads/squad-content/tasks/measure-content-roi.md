---
task: measure-content-roi
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

# Task: Measure Content ROI

> Medir retorno sobre investimento de conteudo conectando producao a resultados de negocio.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Co-agents** | content-orqx (Nexus) |
| **Trigger** | Mensal ou trimestral |
| **Input** | Custos de producao, metricas de conversao, dados de revenue |
| **Output** | Report de ROI com custo por lead, custo por conversao, valor gerado |
| **Handoff** | → content-orqx (Nexus), editorial-strategist (North) |
| **Complexity** | complex |

---

## Fundamentacao

ROI de conteudo e o santo graal do content marketing — e o mais dificil de medir. A cadeia causal e longa: conteudo → awareness → confianca → consideracao → conversao. Atribuicao direta e rara; atribuicao assistida e mais realista. O ROI deve considerar: custo total de producao, valor de leads gerados, lifetime value de clientes originados por conteudo. Referencia: Robert Rose — "content as a business case", CMI — content marketing ROI framework.

---

## Steps

### Step 1: Calcular Custo Total de Producao
Tempo de producao * custo/hora, ferramentas, plataformas pagas, design, fotografia, distribuicao paga. Custo por peca e custo por lote/sprint.

### Step 2: Medir Resultados Diretos
Leads gerados via conteudo (formularios, DMs qualificadas, newsletter signups). Vendas atribuidas diretamente (UTMs, codigos de desconto, links trackeaveis).

### Step 3: Medir Resultados Indiretos
Brand awareness (alcance, impressoes, crescimento de followers). Autoridade (backlinks, mentions, share of voice). Engagement de audiencia qualificada.

### Step 4: Calcular Metricas de ROI
Custo por lead (CPL via conteudo), custo por aquisicao (CPA via conteudo), ROI = (revenue atribuida - custo) / custo * 100. Comparar com outros canais.

### Step 5: Analisar por Formato/Pilar
ROI por formato (blog gera mais leads? Reels geram mais awareness?), ROI por pilar (qual pilar gera mais revenue?). Essa analise direciona investimento futuro.

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-roi-{period}.md"
  context: "ROI: {X}%, CPL {valor}, revenue atribuida {valor}, melhor formato {formato}"
  next: "content-orqx (Nexus) e editorial-strategist (North) para ajustar investimento"
```
