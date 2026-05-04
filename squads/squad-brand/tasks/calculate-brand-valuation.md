---
task: calculate-brand-valuation
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

# Task: Calculate Brand Valuation

> Calcular valuação de marca usando metodologia híbrida (Cost-Based + Brand Strength + CBBE).

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-growth-strategist (Catalyst) |
| **Trigger** | Início do projeto + após cada fase de entrega |
| **Input** | Briefing, dados financeiros (se disponível), assets existentes |
| **Output** | `brand-valuation-report-phase-{N}.md` + `valuation-data.json` |
| **Handoff** | → brand-auditor (Sentinel) para validação |

---

## Steps

### Step 1: Coleta de Dados
```yaml
elicit: true
format: checklist
```
Coletar dados disponíveis do cliente:

**Dados Financeiros (se disponível):**
- [ ] Receita anual / faturamento
- [ ] Número de clientes ativos
- [ ] CAC (Custo de Aquisição de Cliente)
- [ ] LTV (Lifetime Value)
- [ ] Ticket médio

**Dados de Marca:**
- [ ] Idade da marca (anos de existência)
- [ ] Investimento anterior em branding (total estimado)
- [ ] Assets de marca existentes (logo, guidelines, etc)
- [ ] Presença digital (seguidores, tráfego mensal)
- [ ] Setor de atuação

**Dados de Percepção:**
- [ ] NPS (se disponível)
- [ ] Brand recall (se pesquisado)
- [ ] Principal concorrente e diferencial percebido

> Nota: Se dados financeiros não estiverem disponíveis, usar Cost-Based como método primário.

### Step 2: Seleção de Método
Baseado nos dados disponíveis, selecionar método de valuação:

| Cenário | Método Primário | Método Secundário |
|---------|----------------|-------------------|
| Startup pre-revenue | Cost-Based | CBBE Score |
| Empresa com receita | Royalty Relief | Brand Strength |
| Marca estabelecida | Income-Based | Market Comparison |
| Rebranding | Delta (before/after) | Cost-Based |

### Step 3: Calcular Cost-Based Valuation
Avaliar custo de recriar cada componente do zero:

| Componente | Existe? | Qualidade (0-5) | Valor de Mercado |
|-----------|---------|-----------------|-----------------|
| Estratégia de marca | | | $X |
| Logo system | | | $X |
| Identidade visual completa | | | $X |
| Design system | | | $X |
| Motion + Audio | | | $X |
| Assets criativos | | | $X |
| Templates + Colaterais | | | $X |
| Brandbook + Documentação | | | $X |
| **Total Cost-Based** | | | **$X** |

Aplicar Quality Factor:
- Qualidade média 0-1: Factor 0.5 (amador)
- Qualidade média 2: Factor 0.8 (básico)
- Qualidade média 3: Factor 1.0 (profissional)
- Qualidade média 4: Factor 1.5 (premium)
- Qualidade média 5: Factor 2.0 (world-class)

```
Cost-Based Value = Total × Quality Factor
```

### Step 4: Calcular Brand Strength Score (BSS)
Pontuar 10 dimensões de 0-10:

| Dimensão | Peso | Score (0-10) | Weighted |
|----------|------|-------------|----------|
| Investimento em marca | 10% | | |
| Consistência visual | 15% | | |
| Clareza interna | 10% | | |
| Relevância para público | 15% | | |
| Autenticidade | 10% | | |
| Diferenciação | 15% | | |
| Presença/alcance | 10% | | |
| Engagement/conexão | 10% | | |
| Proteção legal | 5% | | |
| **BSS Total** | **100%** | | **/100** |

### Step 5: Avaliar CBBE Level (Keller)
| Nível | Critério | Score (0-25) |
|-------|----------|-------------|
| Saliência | Recall, reconhecimento, top-of-mind | |
| Significado | Associações, performance, imagética | |
| Resposta | Julgamento, sentimentos, preferência | |
| Ressonância | Lealdade, comunidade, advocacy | |
| **CBBE Total** | | **/100** |

### Step 6: Calcular Valor Combinado
```
Brand Value = Cost-Based Value × (1 + BSS/100) × (1 + CBBE/200)
```

Para empresas com receita, adicionar:
```
Revenue Premium = Annual Revenue × Royalty Rate × BSS/100
Brand Value += Revenue Premium × 5 (5-year projection)
```

### Step 7: Projetar Valor Pós-Projeto
Estimar incremento esperado por fase:

| Fase | Incremento BSS | Incremento CBBE | Valor Adicionado |
|------|----------------|-----------------|-----------------|
| Strategy | +5-15 pontos | +5-10 pontos | $X |
| Visual Identity | +10-20 pontos | +10-15 pontos | $X |
| Assets & Collateral | +5-10 pontos | +5-10 pontos | $X |
| System & Motion | +5-10 pontos | +5-10 pontos | $X |
| Final Package | +3-5 pontos | +3-5 pontos | $X |
| **Total Projetado** | | | **$X** |

### Step 8: Gerar Relatório
Produzir relatório completo com:

1. **Executive Summary** — Valor atual, valor projetado, ROI estimado
2. **Metodologia** — Métodos usados, fontes de dados
3. **Breakdown** — Valor por componente
4. **Benchmarks** — Comparação com setor
5. **Projeção** — Timeline de crescimento de valor
6. **Dashboard Data** — JSON para visualização

```json
{
  "brand_name": "{brand}",
  "valuation_date": "{date}",
  "phase": "{N}",
  "baseline_value": 0,
  "current_value": 0,
  "projected_value": 0,
  "roi_percentage": 0,
  "bss_score": 0,
  "cbbe_score": 0,
  "methodology": "hybrid",
  "breakdown": {},
  "phase_deltas": []
}
```

### Step 9: Handoff
```yaml
handoff:
  to: brand-auditor (Sentinel)
  artifact: brand-valuation-report-phase-{N}.md
  validation: "Verificar cálculos, benchmarks, e razoabilidade das projeções"
  next: "Após validação, integrar no dashboard de entrega"
```
