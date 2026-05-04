---
task: map-content-gaps
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

# Task: Map Content Gaps

> Identificar lacunas na cobertura de conteudo por pilar, formato, plataforma e funil.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | content-analyst (Lens), signal-intelligence (Radar) |
| **Trigger** | Mensal ou apos analise de performance |
| **Input** | Inventario de conteudo, pilares, metricas de performance, dados competitivos |
| **Output** | Mapa de gaps com prioridades e recomendacoes |
| **Handoff** | → create-editorial-calendar, define-editorial-pillars (se gaps estruturais) |
| **Complexity** | medium |

---

## Fundamentacao

Gaps de conteudo sao oportunidades invisiveis. Pode ser um pilar inteiro sem conteudo MEIO de funil, uma plataforma com formato unico ignorado, ou um sub-tema que os concorrentes exploram e voce nao. A analise sistematica de gaps transforma intuicao em estrategia baseada em dados. Referencia: Joe Pulizzi — content gap analysis, Andy Crestodina — competitive content gaps.

---

## Steps

### Step 1: Auditar Cobertura por Pilar
Para cada pilar: quantas pecas produzidas? Quais sub-temas cobertos? Quais ignorados? Qual a frequencia? Identificar pilares "orfaos" (definidos mas sem producao).

### Step 2: Auditar Cobertura por Formato
Quais formatos estao sendo usados? Quais ignorados? Exemplo: se nunca fez carrossel educativo sendo que e o formato com maior save rate no setor, e um gap critico.

### Step 3: Auditar Cobertura por Plataforma
Distribuicao de conteudo por plataforma vs presenca da audiencia. Se 60% da audiencia esta no LinkedIn mas 80% do conteudo vai pro Instagram, ha um gap de distribuicao.

### Step 4: Cruzar com Dados Competitivos
O que os concorrentes cobrem que voce nao cobre? Quais formatos eles exploram? Onde ha oportunidade de first-mover?

### Step 5: Priorizar Gaps
Classificar gaps por impacto potencial: (1) Gap de receita (FUNDO de funil vazio), (2) Gap competitivo (concorrente domina), (3) Gap de formato (formato trending ignorado), (4) Gap de pilar (pilar relevante descoberto).

### Step 6: Handoff

```yaml
handoff:
  artifact: "content-gaps-{client}-{date}.md"
  context: "Gaps mapeados: {N} gaps identificados, {C} criticos, {M} por pilar, {F} por formato"
  next: "create-editorial-calendar para preencher gaps prioritarios"
```
