# Referencia de Unit Economics

> Formulas completas de CAC, LTV, Magic Number, NRR, GRR, Quick Ratio e Payback Period com benchmarks por industria (SaaS, agencia, e-commerce).

---

## 1. CAC — Customer Acquisition Cost

### Formula

```
CAC = (Gasto_marketing + Gasto_vendas) / Novos_clientes_periodo

Incluir no calculo:
  - Salarios de marketing e vendas (loaded)
  - Ferramentas de marketing (ads, automation, CRM)
  - Comissoes de vendas
  - Eventos e conferences
  - Conteudo e SEO (proporcional)
  NAO incluir: overhead geral, produto, delivery
```

### Benchmarks

```
| Industria | CAC Medio | CAC Bom |
|-----------|----------|---------|
| SaaS B2B (SMB) | US$ 200-800 | < US$ 500 |
| SaaS B2B (Enterprise) | US$ 5.000-20.000 | < US$ 10.000 |
| Agencia digital (BR) | R$ 3.000-15.000 | < R$ 8.000 |
| E-commerce (BR) | R$ 30-150 | < R$ 80 |
| Consultoria | R$ 5.000-25.000 | < R$ 15.000 |
```

### CAC Payback Period

```
Payback = CAC / (ARPA × Gross_Margin%)
Target: <= 12 meses
Alerta: > 18 meses
```

---

## 2. LTV — Lifetime Value

### Formulas

```
Simples:
  LTV = ARPA × Lifetime_medio_meses

Com margem:
  LTV = ARPA × Gross_Margin% × (1 / Churn_Rate_mensal)
  Ou: ARPA × Gross_Margin% × Lifetime_medio

Com desconto (DCF):
  LTV = Σ (ARPA × Gross_Margin% / (1 + discount_rate)^t)
  Para t = 1 ate Lifetime
```

### Benchmarks

```
| Industria | LTV Medio | LTV:CAC Target |
|-----------|----------|---------------|
| SaaS B2B (SMB) | US$ 5.000-30.000 | >= 3:1 |
| SaaS B2B (Enterprise) | US$ 50.000-500.000 | >= 3:1 |
| Agencia digital (BR) | R$ 30.000-200.000 | >= 3:1 |
| E-commerce (BR) | R$ 300-2.000 | >= 3:1 |
```

### LTV:CAC Ratio

```
< 1:1 → Destruindo valor (CRITICO — parar de investir em acquisition)
1:1 - 3:1 → Insustentavel (melhorar retencao ou reduzir CAC)
3:1 - 5:1 → Saudavel (manter e otimizar)
> 5:1 → Sub-investindo em growth (investir mais em acquisition)
```

---

## 3. Magic Number

### Formula

```
Magic Number = (Receita_Q_atual - Receita_Q_anterior) × 4 / Gasto_S&M_Q_anterior

Interpreta a eficiencia do investimento em vendas e marketing:
  Cada R$1 investido em S&M gera R$[Magic Number] de receita anualizada
```

### Interpretacao

```
< 0.5 → INEFICIENTE: S&M nao esta convertendo, investigar
0.5 - 0.75 → MODERADO: aceitavel, otimizar
> 0.75 → EFICIENTE: investir mais em S&M
> 1.0 → EXCELENTE: escalar agressivamente
```

### Exemplo

```
Q1 Receita: R$ 400K
Q2 Receita: R$ 450K
Gasto S&M Q1: R$ 80K

Magic Number = (450K - 400K) × 4 / 80K = 200K / 80K = 2.5
→ EXCELENTE: cada R$ 1 em S&M gera R$ 2.50 de receita anualizada
```

---

## 4. NRR — Net Revenue Retention

### Formula

```
NRR = (MRR_inicio + Expansion - Contraction - Churn) / MRR_inicio × 100

Mede: se voce nao adquirisse NENHUM novo cliente, sua receita cresceria ou encolheria?
```

### Benchmarks

```
| Nivel | NRR | Interpretacao |
|-------|-----|---------------|
| Critico | < 80% | Revenue shrinking fast |
| Preocupante | 80-90% | Churn significativo |
| Aceitavel | 90-100% | Estavel mas sem growth |
| Bom | 100-110% | Net positive — expansion > churn |
| Excelente | 110-130% | Strong expansion |
| Classe mundial | > 130% | Best-in-class (Snowflake, Twilio) |

Benchmark por industria:
  SaaS B2B: 100-130% (mediana ~110%)
  Agencia: 85-110% (mediana ~95%)
  E-commerce (subscription): 80-100%
```

---

## 5. GRR — Gross Revenue Retention

### Formula

```
GRR = (MRR_inicio - Contraction - Churn) / MRR_inicio × 100

Nota: GRR NUNCA pode ser > 100% (nao inclui expansion)
Mede: quanto da receita existente voce MANTEM
```

### Benchmarks

```
| Nivel | GRR |
|-------|-----|
| Critico | < 70% |
| Preocupante | 70-80% |
| Aceitavel | 80-90% |
| Bom | 90-95% |
| Excelente | > 95% |

Benchmark por industria:
  SaaS B2B: 85-95% (mediana ~90%)
  Agencia: 75-90% (mediana ~83%)
```

---

## 6. Quick Ratio (SaaS)

### Formula

```
Quick Ratio = (New MRR + Expansion MRR) / (Contraction MRR + Churn MRR)

Mede: para cada R$ 1 que sai, quantos R$ entram?
```

### Interpretacao

```
< 1.0 → Receita encolhendo (CRITICO)
1.0 - 2.0 → Crescendo devagar, alto esforco
2.0 - 4.0 → Crescimento saudavel
> 4.0 → Crescimento eficiente e acelerado

Ideal para agencias: >= 3.0
```

### Exemplo

```
New MRR: R$ 20K
Expansion MRR: R$ 10K
Contraction MRR: R$ 5K
Churn MRR: R$ 3K

Quick Ratio = (20K + 10K) / (5K + 3K) = 30K / 8K = 3.75 → Saudavel
```

---

## 7. Payback Period

### Formula

```
Payback = CAC / (ARPA_mensal × Gross_Margin%)

Tempo necessario para recuperar o investimento de aquisicao de um cliente
```

### Benchmarks

```
| Nivel | Meses |
|-------|-------|
| Excelente | < 6 |
| Bom | 6-12 |
| Aceitavel | 12-18 |
| Preocupante | 18-24 |
| Critico | > 24 |
```

### Exemplo

```
CAC: R$ 10.000
ARPA mensal: R$ 5.000
Gross Margin: 55%

Payback = 10.000 / (5.000 × 0.55) = 10.000 / 2.750 = 3.6 meses → Excelente
```

---

## 8. Dashboard Completo de Unit Economics

```
| Metrica | Formula | Valor | Benchmark | Status |
|---------|---------|-------|-----------|--------|
| CAC | S&M / Novos | R$ X | < R$ 8K | 🟢🟡🔴 |
| LTV | ARPA × GM% × Life | R$ Y | > 3×CAC | 🟢🟡🔴 |
| LTV:CAC | LTV / CAC | Z:1 | >= 3:1 | 🟢🟡🔴 |
| Payback | CAC / (ARPA×GM) | N meses | <= 12m | 🟢🟡🔴 |
| Magic # | ΔRev×4 / S&M | N | >= 0.75 | 🟢🟡🔴 |
| NRR | (MRR+Exp-Con-Ch)/MRR | N% | >= 100% | 🟢🟡🔴 |
| GRR | (MRR-Con-Ch)/MRR | N% | >= 85% | 🟢🟡🔴 |
| Quick Ratio | (New+Exp)/(Con+Ch) | N | >= 3.0 | 🟢🟡🔴 |
```
