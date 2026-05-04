---
task: calculate-cost-per-delivery
responsavel: "@profitability-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: delivery_unit
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: period
    tipo: string
    origem: "usuario"
    obrigatorio: true

Saida:
  - campo: cost_per_delivery_report
    tipo: document
    destino: "pricing-strategist, finance-orqx"

Checklist:
  - "[ ] Definir unidade de delivery"
  - "[ ] Coletar custos totais do periodo"
  - "[ ] Contar unidades entregues"
  - "[ ] Calcular custo unitario"
  - "[ ] Comparar com benchmarks"
---

# Task: Calculate Cost-per-Delivery

## Metadata
- **Agent:** profitability-analyst (Margin)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Calcular custo por unidade de entrega para fundamentar decisoes de pricing e medir eficiencia operacional.

## Inputs
- Unidade de delivery: story point | feature | sprint | hora | projeto | pagina
- Periodo de analise
- Custo total da equipe no periodo (loaded)
- Quantidade de unidades entregues

## Steps

1. **Definir unidade de medida** (mais comum para a agencia)
2. **Calcular custo total:**
   ```
   Custo_total = Σ(salarios_loaded) + ferramentas + infra + overhead
   ```
3. **Contar deliveries:**
   ```
   Unidades = total de [story points | features | sprints | horas | projetos] entregues
   ```
4. **Calcular custo unitario:**
   ```
   Cost_per_delivery = Custo_total / Unidades_entregues

   Exemplos tipicos (agencia brasileira):
   - Cost per story point: R$ 800-2.000
   - Cost per sprint (2 semanas, 4 devs): R$ 40.000-80.000
   - Cost per hora efetiva: R$ 150-400
   - Cost per feature (media): R$ 5.000-20.000
   ```
5. **Comparar com benchmarks** e periodos anteriores
6. **Identificar oportunidades** de reducao

## Output
- Custo por unidade de delivery
- Tendencia (ultimos 3-6 periodos)
- Benchmark vs industria
- Top 3 oportunidades de reducao de custo

## Quality Gates
- [ ] Unidade de delivery e consistente e mensuravel
- [ ] Custos incluem tudo (nada off-books)
- [ ] Comparacao temporal presente
- [ ] Recomendacoes praticas de otimizacao

## Quando Usar
- Fundamentar pricing de novos servicos
- Medir eficiencia da equipe ao longo do tempo
- Comparar custos entre equipes/squads
