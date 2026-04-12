---
task: generate-roi-report
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

# Task: Generate Brand ROI Report

> Gerar relatório de ROI do projeto de branding com dados para dashboard.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-growth-strategist (Catalyst) |
| **Trigger** | Entrega final do projeto |
| **Input** | Todos os valuation reports por fase |
| **Output** | `brand-roi-report.md` + `roi-dashboard-data.json` |
| **Handoff** | → brand-compiler (Atlas) para inclusão no pacote final |

---

## Steps

### Step 1: Consolidar Dados de Todas as Fases
Compilar todos os `brand-valuation-report-phase-{N}.md`:

| Fase | Data | BSS | CBBE | Brand Value | Delta |
|------|------|-----|------|------------|-------|
| Baseline | | /100 | /100 | $X | — |
| Phase 1: Strategy | | | | | +$X |
| Phase 2: Visual | | | | | +$X |
| Phase 3: Assets | | | | | +$X |
| Phase 4: System | | | | | +$X |
| Phase 5: Final | | | | | +$X |
| **Total** | | | | **$X** | **+$X** |

### Step 2: Calcular ROI
```
Investment = Preço pago pelo cliente pelo serviço
Value Added = Final Brand Value - Baseline Brand Value
ROI = (Value Added / Investment) × 100

Value Multiplier = Final Brand Value / Investment
```

### Step 3: Gerar Comparativo de Mercado
| Benchmark | Valor |
|-----------|-------|
| ROI médio do setor para branding | X% |
| ROI deste projeto | X% |
| Posição relativa | Acima/Abaixo/Na média |
| Cost-per-point de BSS | $X/ponto |
| Cost-per-point de CBBE | $X/ponto |

### Step 4: Gerar JSON para Dashboard
```json
{
  "brand_name": "",
  "project_id": "",
  "investment": 0,
  "baseline": {
    "date": "",
    "bss": 0,
    "cbbe": 0,
    "value": 0
  },
  "final": {
    "date": "",
    "bss": 0,
    "cbbe": 0,
    "value": 0
  },
  "roi_percentage": 0,
  "value_multiplier": 0,
  "phases": [
    {
      "name": "Strategy",
      "date": "",
      "bss_delta": 0,
      "cbbe_delta": 0,
      "value_delta": 0,
      "cumulative_value": 0
    }
  ],
  "scores_timeline": [
    {
      "date": "",
      "visual": 0,
      "strategic": 0,
      "technical": 0,
      "cross_channel": 0,
      "documentation": 0
    }
  ],
  "benchmark": {
    "sector": "",
    "sector_avg_roi": 0,
    "position": "above|below|average"
  }
}
```

### Step 5: Criar Visualizações
Descrever/gerar:
1. **Line Chart** — Brand Value ao longo das fases (crescimento)
2. **Radar Chart** — Scores por dimensão (before vs after)
3. **Bar Chart** — Valor adicionado por fase
4. **Big Number** — ROI% em destaque
5. **Comparison Card** — Investimento vs Valor (side by side)

### Step 6: Relatório Executivo
Documento de 2-3 páginas com:
1. Headline: "Seu investimento de $X gerou $Y em brand equity (Z% ROI)"
2. Visual: gráfico de crescimento
3. Breakdown: contribuição de cada fase
4. Benchmark: comparação com mercado
5. Projeção: valor esperado em 12 meses mantendo consistência

### Step 7: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: brand-roi-report.md + roi-dashboard-data.json
  context: "ROI report completo com dados para dashboard no site de entrega"
  next: "Incluir no brandbook (seção de valor) e no pacote de entrega"
```
