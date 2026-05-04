---
task: create-competitive-equity-analysis
responsavel: "@brand-growth-strategist"
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

# Task: Create Competitive Equity Analysis

> Analisar brand equity dos concorrentes para posicionar a marca no BAV PowerGrid.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-growth-strategist (Catalyst) |
| **Trigger** | Após landscape competitivo definido (post-Athena) |
| **Input** | Competitive landscape, dados públicos dos concorrentes |
| **Output** | `competitive-equity-analysis.md` |
| **Handoff** | → brand-strategist (Athena) para ajuste de posicionamento |

---

## Steps

### Step 1: Selecionar Concorrentes
Identificar 5-10 concorrentes diretos e indiretos:

| # | Marca | Tipo | Setor | Tamanho | Relevância |
|---|-------|------|-------|---------|-----------|
| 1 | | Direto/Indireto | | | Alta/Média |

### Step 2: Avaliar Brand Equity Competitivo
Para cada concorrente, avaliar 4 dimensões (BAV):

| Marca | Differentiation (0-25) | Relevance (0-25) | Esteem (0-25) | Knowledge (0-25) | Total |
|-------|----------------------|------------------|---------------|------------------|-------|
| {nossa marca} | | | | | /100 |
| {concorrente 1} | | | | | /100 |
| {concorrente 2} | | | | | /100 |

**Dimensões BAV:**
- **Differentiation:** Quão diferente/única é percebida
- **Relevance:** Quão relevante é para o público
- **Esteem:** Quão bem-conceituada é
- **Knowledge:** Quão conhecida/familiar é

### Step 3: Mapear no PowerGrid
```
Brand Strength (Differentiation + Relevance)
vs
Brand Stature (Esteem + Knowledge)
```

Posicionar cada marca no quadrante:
- **Leadership** (alto strength + alto stature): marcas dominantes
- **New/Unfocused** (baixo strength + baixo stature): marcas novas ou perdidas
- **Niche** (alto strength + baixo stature): marcas emergentes com potencial
- **Eroded** (baixo strength + alto stature): marcas em declínio

### Step 4: Análise de Distinctive Assets Competitivos
| Asset Type | Nossa Marca | Conc 1 | Conc 2 | Conc 3 | Oportunidade |
|-----------|------------|--------|--------|--------|-------------|
| Cor proprietária | | | | | |
| Forma/símbolo | | | | | |
| Tipografia | | | | | |
| Audio | | | | | |
| Tagline | | | | | |
| Personagem | | | | | |

Identificar: onde podemos "own" um asset que nenhum concorrente tem?

### Step 5: Gap Analysis
| Dimensão | Nossa Posição | Líder | Gap | Prioridade |
|----------|--------------|-------|-----|-----------|
| Differentiation | /25 | {quem}: /25 | | |
| Relevance | /25 | {quem}: /25 | | |
| Esteem | /25 | {quem}: /25 | | |
| Knowledge | /25 | {quem}: /25 | | |

### Step 6: Recomendações Estratégicas
1. **Onde competir:** quais dimensões investir
2. **Onde evitar:** onde não vale brigar
3. **Blue ocean:** oportunidades não exploradas
4. **Distinctive assets:** quais assets desenvolver como proprietários

### Step 7: Handoff
```yaml
handoff:
  to: brand-strategist (Athena)
  artifact: competitive-equity-analysis.md
  context: "Análise de equity competitivo com PowerGrid, gaps e recomendações"
  next: "Ajustar posicionamento e message house baseado nos gaps identificados"
```
