---
task: benchmark-profitability-metrics
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: company_metrics
    tipo: object
    origem: "financeiro"
    obrigatorio: true
  - campo: industry
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: benchmark_report
    tipo: document
    destino: "finance-orqx, diretoria"

Checklist:
  - "[ ] Coletar metricas da empresa"
  - "[ ] Obter benchmarks da industria"
  - "[ ] Comparar e classificar"
  - "[ ] Identificar gaps e oportunidades"
---

# Task: Benchmark Profitability Metrics

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** COMPLEX

## Objetivo
Comparar metricas de rentabilidade da empresa com benchmarks da industria para identificar gaps e oportunidades.

## Steps

1. **Coletar metricas da empresa:**
   - Gross margin, EBITDA, Net margin
   - Utilizacao, revenue per employee
   - CAC, LTV, NRR
   - DSO, collection rate
2. **Aplicar benchmarks por industria:**

   | Metrica | Agencia Digital | SaaS | E-commerce | Consultoria |
   |---------|----------------|------|------------|-------------|
   | Gross Margin | 50-70% | 70-85% | 25-45% | 60-80% |
   | EBITDA | 15-25% | 20-40% | 8-15% | 20-30% |
   | Utilizacao | 70-85% | N/A | N/A | 65-80% |
   | Rev/Employee | $150-250K | $200-400K | $300-500K | $200-350K |
   | DSO | 30-60 dias | 30-45 dias | 0-15 dias | 45-75 dias |

3. **Classificar:** Above Benchmark / On Par / Below Benchmark
4. **Priorizar gaps:** impacto financeiro × facilidade de melhoria

## Output
- Scorecard comparativo com benchmarks
- Gaps priorizados por impacto
- Plano de melhoria para top 3 gaps

## Quality Gates
- [ ] Benchmarks sao de fontes confiaveis e recentes
- [ ] Classificacao correta por industria
- [ ] Plano de melhoria e acionavel

## Quando Usar
- Review estrategico anual
- Preparacao para investimento/M&A
- Melhoria continua de performance
