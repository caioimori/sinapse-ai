# Google Ads Optimization Playbook

## Search Term Hygiene

### Frequencia de Revisao
| Match Type Ativo | Frequencia | Razao |
|-----------------|-----------|-------|
| Broad match | 2x/semana | Broad trigga muitos termos inesperados |
| Phrase match | 1x/semana | Mais controlado mas still precisa monitorar |
| Exact only | 1x/mes | Minimo de surpresas |

### N-Gram Analysis Process
1. Exportar search terms report (30-90 dias)
2. Quebrar cada search term em unigrams (palavras individuais)
3. Contar frequencia de cada unigram em termos SEM conversao
4. Unigrams que aparecem 10+ vezes em termos irrelevantes = candidatos a negative
5. Exemplos comuns: "gratis", "emprego", "vaga", "como", "o que e", "tutorial"

### Waste Benchmark
- **<10%:** Excelente — negatives bem gerenciados
- **10-15%:** Bom — manutencao rotineira suficiente
- **15-25%:** Precisa atencao — revisao intensiva de negatives
- **>25%:** Critico — reestruturar match types e negatives

## Negative Keyword Strategy

### Layers de Negatives
1. **Account-level (shared lists):** termos universalmente irrelevantes
   - "gratis", "free", "emprego", "vagas", "salario", "como fazer"
2. **Campaign-level:** termos irrelevantes para aquele objetivo
   - Brand campaign: negativar termos nao-brand
   - Non-brand: negativar termos brand (evitar canibalismo)
3. **Ad group-level:** refinamento tematico
   - AG "sapato masculino": negativar "feminino", "infantil"

### Match Type para Negatives
| Situacao | Match Type | Exemplo |
|----------|-----------|---------|
| Termo exato irrelevante | Exact negative | [emprego marketing digital] |
| Qualquer busca com a frase | Phrase negative | "emprego" |
| Qualquer combinacao | Broad negative | gratis |

**CUIDADO com broad negative:** pode bloquear termos relevantes. Ex: negativar "curso" com broad pode bloquear "curso de marketing" que era relevante.

## Budget Pacing Analysis

### Pacing Formula
```
Pacing Ratio = (% budget gasto) / (% periodo decorrido)
```

| Pacing Ratio | Status | Acao |
|-------------|--------|------|
| >1.15 | Overspending | Reduzir daily budget 10-15% |
| 1.0-1.15 | Slightly over | Monitorar |
| 0.9-1.0 | On pace | Ideal |
| 0.75-0.9 | Slightly under | Investigar restricoes |
| <0.75 | Severely under | Diagnosticar: bid, audience, ads |

### Underspend Diagnostics
1. **"Limited by budget" flag?** → Nao, entao nao e falta de budget
2. **Impression Share Lost (rank)?** → Bids muito baixos
3. **Impression Share Lost (budget)?** → Budget muito baixo
4. **Ad Strength / disapprovals?** → Ads com problema
5. **Search volume?** → Keywords muito nichadas ou sazonais
6. **Day parting?** → Schedule muito restritivo

## Ad Copy Improvement Framework

### Headline Formulas (Google Search)
1. **Keyword + Benefit:** "Marketing Digital | Aumente suas Vendas 3x"
2. **Number + Noun:** "50.000+ Empresas Confiam"
3. **Question:** "Cansado de CPA Alto?"
4. **How-to:** "Como Reduzir seu CPA em 30 Dias"
5. **CTA Direct:** "Comece seu Trial Gratis Hoje"

### RSA Best Practices
- 15 headlines: incluir keyword em pelo menos 5
- 4 descriptions: 1 com beneficio, 1 com feature, 1 com social proof, 1 com CTA
- Pin headline 1 com keyword (para ad relevance)
- Nao pinnar demais (max 3 pins) — deixar Google otimizar
- Cada headline deve fazer sentido independentemente

### Ad Strength Target
| Strength | Score | Acao |
|----------|-------|------|
| Excellent | Best | Manter |
| Good | Target | Aceitavel |
| Average | Improve | Adicionar headlines/descriptions |
| Poor | Critical | Reescrever completamente |

## Performance Anomaly Detection (Z-Score)

### Calculo
```
Z-score = (valor_hoje - media_30d) / desvio_padrao_30d
```

### Thresholds de Acao
| Z-score | Significado | Acao |
|---------|------------|------|
| |z| < 1.5 | Variacao normal | Ignorar |
| 1.5 ≤ |z| < 2.0 | Notavel | Monitorar amanha |
| 2.0 ≤ |z| < 3.0 | Significativa | Investigar causa |
| |z| ≥ 3.0 | Critica | Acao imediata |

### Metricas para Monitorar
- CPA diario (mais importante)
- CTR diario
- Conversion rate diario
- CPC medio diario
- Impression share

### Causas Comuns por Direcao
**CPA subiu (z positivo):**
- Competicao aumentou (auction pressure)
- Creative fatigue
- Tracking break (falso positivo — verificar primeiro!)
- Sazonalidade / dia atipico
- Mudanca de LP

**CPA caiu (z negativo):**
- Competidor saiu do leilao
- Novo criativo winner
- Melhoria de LP
- Sazonalidade favoravel

## Conversion Tracking Diagnostics

### Checklist de Diagnostico
```
1. Google Ads reports X conversoes
2. GA4 reports Y conversoes
3. CRM reports Z conversoes (ground truth)

Se X >> Z: over-counting (double fire, wrong page, attribution window too long)
Se X << Z: under-counting (tag missing, consent blocking, cross-domain issue)
Se X ≈ Y mas ambos ≠ Z: attribution model difference
```

### Common Fixes
| Problema | Fix |
|----------|-----|
| Double-counting | Verificar tag na thank-you page (nao deve firing em reload) |
| Under-counting | Verificar consent mode, cross-domain, enhanced conversions |
| GA4 vs Google Ads diff | Normal ate 15% (modelos de atribuicao diferentes) |
| Sudden drop | Verificar tag com Tag Assistant, verificar LP mudou |
| Sudden spike | Verificar spam/bots, verificar tag em paginas erradas |
