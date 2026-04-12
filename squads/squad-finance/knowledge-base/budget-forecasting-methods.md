# Metodos de Budget e Forecasting

> Referencia de metodos de orcamento e projecao financeira: rolling forecast, zero-based budgeting, variance analysis e budget pacing.

---

## 1. Rolling Forecast (12 Meses)

### Estrutura

```
O rolling forecast SEMPRE olha 12 meses a frente, independente do ano fiscal.

| Jan | Fev | Mar | Abr | Mai | Jun | Jul | Ago | Set | Out | Nov | Dez | Jan+1 |
| R   | R   | R   | R+P | P   | P   | P   | P   | P   | P   | P   | P   | P     |

R = Real (valor confirmado)
P = Projetado
R+P = Mes corrente (mix de real ate a data + projecao restante)
```

### Regras de Atualizacao

```
1. MENSAL: atualizar apos fechamento do mes
   - Mes que acabou: substituir projecao por real
   - Adicionar novo mes 12 meses a frente
   - Revisar projecoes dos proximos 3 meses com base em novos dados

2. TRIGGERS de atualizacao extraordinaria:
   - Perda de cliente > 10% receita
   - Novo contrato > 10% receita
   - Mudanca de headcount significativa (+/- 3 pessoas)
   - Crise macroeconomica
```

### Componentes do Forecast

```
RECEITA:
  = Receita recorrente (retainers × prob_renovacao)
  + Pipeline ponderado (por estagio × probabilidade)
  + Sazonalidade (fator historico por mes)
  + Growth rate aplicado

DESPESAS FIXAS:
  = Folha (headcount planejado × custo loaded)
  + Aluguel e facilities
  + SaaS e ferramentas (contratos)
  + Contabilidade, juridico, seguros

DESPESAS VARIAVEIS:
  = Marketing (% da receita ou budget fixo)
  + Freelancers (proporcional a projetos)
  + Comissoes (% de novos negocios)
  + Viagens e eventos (por evento)
```

### Metricas de Qualidade do Forecast

```
Forecast Accuracy = 1 - |Forecast - Actual| / Actual
  Target: >= 90% (mensal), >= 95% (trimestral)

MAPE (Mean Absolute Percentage Error):
  MAPE = media(|Forecast_i - Actual_i| / Actual_i) × 100
  Target: <= 10%

Bias:
  Bias = media((Forecast - Actual) / Actual) × 100
  Positivo = otimista, Negativo = pessimista
  Target: Proximo de 0%
```

---

## 2. Zero-Based Budgeting (ZBB)

### Principio

```
Cada ciclo de budget comeca do ZERO.
Nenhum gasto e automaticamente renovado.
Cada rubrica precisa justificar sua existencia e valor.

Diferente de budget incremental:
  Incremental: "ano passado gastamos X, este ano X+5%"
  ZBB: "por que gastar X? Qual o ROI? Qual a alternativa?"
```

### Processo ZBB para Agencias

```
1. LISTAR todos os gastos do ano anterior
2. Para cada gasto, responder:
   a) Este gasto e necessario? (eliminar se NAO)
   b) O valor e adequado? (reduzir se excessivo)
   c) Existe alternativa mais barata? (substituir se SIM)
   d) Qual o ROI mensuravel? (documentar)
3. PRIORIZAR gastos por impacto:
   - Must-have: sem isso a operacao para
   - Should-have: melhora significativamente eficiencia
   - Nice-to-have: melhora marginalmente
4. CORTAR Nice-to-have se budget nao fecha
5. DOCUMENTAR justificativa para cada rubrica aprovada
```

### Quando Usar ZBB

```
- Anualmente para 100% do budget (ideal)
- Semestralmente para categorias de alto custo (minimo)
- Sempre que houver restricao de caixa
- Na revisao de ferramentas e vendors
```

---

## 3. Variance Analysis

### Thresholds

```
| Variancia | Status | Acao |
|-----------|--------|------|
| |var%| <= 5% | VERDE | On track, monitorar |
| 5% < |var%| <= 10% | AMARELO | Investigar causa |
| 10% < |var%| <= 15% | LARANJA | Acao corretiva necessaria |
| |var%| > 15% | VERMELHO | Acao imediata, escalar |
```

### Tipos de Variancia

```
VOLUME VARIANCE:
  Diferenca causada por mudanca na quantidade
  Ex: 15 projetos planejados, 12 realizados
  Calculo: (Volume_real - Volume_plan) × Custo_plan

PRICE VARIANCE:
  Diferenca causada por mudanca no preco/custo unitario
  Ex: custo hora subiu de R$ 80 para R$ 90
  Calculo: (Preco_real - Preco_plan) × Volume_real

MIX VARIANCE:
  Diferenca causada por mudanca na composicao
  Ex: mais projetos de alto custo que planejado
  Calculo: Diferenca entre mix real e planejado × volumes

TIMING VARIANCE:
  Diferenca causada por antecipacao ou atraso
  Ex: despesa de dezembro veio em novembro
  Tende a se normalizar no acumulado
```

### Root Cause Analysis Template

```
Para cada desvio significativo:

| Campo | Descricao |
|-------|-----------|
| Rubrica | Nome da rubrica |
| Budget | R$ X |
| Actual | R$ Y |
| Variancia | R$ Z (N%) |
| Tipo | Volume / Price / Mix / Timing |
| Causa raiz | Descricao detalhada |
| Classificacao | One-time / Recorrente / Estrutural |
| Impacto anual | Se recorrente, projecao para o ano |
| Acao corretiva | O que fazer |
| Responsavel | Quem |
| Prazo | Quando |
```

---

## 4. Budget Pacing

### Formula

```
% Ano decorrido = Mes_atual / 12 (ou dias_corridos / dias_ano)
% Budget usado = Actual_YTD / Budget_anual
Pacing Index = % Budget usado / % Ano decorrido

| Pacing | Interpretacao |
|--------|---------------|
| < 0.90 | Subgasto — investindo menos que planejado |
| 0.90 - 1.10 | On pace — dentro do esperado |
| > 1.10 | Overpace — gastando mais rapido que planejado |
```

### Pacing Ajustado por Sazonalidade

```
Se gastos nao sao lineares (ex: contratacoes em Q1, eventos em Q2):

Pacing_ajustado = Actual_YTD / Budget_YTD_proporcional

Budget_YTD_proporcional = Σ budget_mensal de janeiro ate mes atual
(considerando distribuicao nao-linear planejada)
```

### EAC — Estimate at Completion

```
EAC = Actual_YTD + Remaining_budget × Pacing_Index
Ou: Actual_YTD + (Budget_anual - Budget_YTD) × (Actual_YTD / Budget_YTD)

Se Pacing > 1.0:
  EAC > Budget → vai estourar o budget
  Acao: cortar gastos restantes ou solicitar budget adicional

Se Pacing < 1.0:
  EAC < Budget → vai sobrar budget
  Acao: avaliar se subinvestimento e intencional
```

---

## 5. Scenario Planning (3 Cenarios)

### Estrutura

```
PESSIMISTA (Worst Case):
  - Receita: -20% do base
  - Churn: +50% do historico
  - Custos: +10% (inflacao, contratacoes emergenciais)
  - Probabilidade: 20%

BASE (Most Likely):
  - Receita: conforme forecast
  - Churn: conforme historico
  - Custos: conforme budget
  - Probabilidade: 60%

OTIMISTA (Best Case):
  - Receita: +20% do base
  - Churn: -30% do historico
  - Custos: conforme budget
  - Probabilidade: 20%

EXPECTED VALUE = (Pessimista × 0.2) + (Base × 0.6) + (Otimista × 0.2)
```

### Regras

```
1. SEMPRE apresentar 3 cenarios em reports executivos
2. NUNCA planejar com base no otimista
3. Planejar despesas fixas com base no pessimista
4. Planejar investimentos variaveis com base no base
5. Reservar contingencia de 10% sobre o base
```
