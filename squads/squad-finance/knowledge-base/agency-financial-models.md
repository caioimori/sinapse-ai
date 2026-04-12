# Modelos Financeiros para Agencias Digitais

> Referencia completa de estruturas de P&L, formulas de custo, impacto de utilizacao na margem e metodos de alocacao de overhead para agencias e negocios de servicos digitais.

---

## 1. Estrutura de P&L para Agencias

### P&L Simplificado

```
RECEITA BRUTA
  (-) Impostos sobre receita (ISS 2-5%, PIS 0.65%, COFINS 3%)
= RECEITA LÍQUIDA

  (-) COGS / Custo dos Servicos Prestados
    - Folha de delivery (loaded)
    - Freelancers e terceirizados
    - Ferramentas diretas de projeto
    - Infra direta (hosting, APIs)
= LUCRO BRUTO (Gross Profit)
  Gross Margin % = Lucro Bruto / Receita Liquida
  TARGET: 50-70%

  (-) DESPESAS OPERACIONAIS (OpEx)
    - Folha admin e comercial (loaded)
    - Aluguel e facilities
    - Marketing e vendas
    - SaaS corporativo
    - Contabilidade e juridico
    - Viagens e eventos
= EBITDA
  EBITDA % = EBITDA / Receita Liquida
  TARGET: 15-25%

  (-) Depreciacao e amortizacao
  (-) Juros
  (-) Impostos sobre lucro (IR + CSLL)
= LUCRO LÍQUIDO
  Net Margin % = Lucro Liquido / Receita Liquida
  TARGET: 8-15%
```

### P&L por Projeto

```
RECEITA DO PROJETO
  (-) Horas equipe × custo hora loaded
  (-) Freelancers alocados ao projeto
  (-) Ferramentas especificas do projeto
  (-) Infra direta do projeto
= MARGEM BRUTA DO PROJETO
  Target: >= 50%

  (-) Overhead alocado (ver metodos abaixo)
= MARGEM LIQUIDA DO PROJETO
  Target: >= 15%
```

---

## 2. Formulas de Custo

### Custo-Hora Loaded

O custo-hora loaded e o custo REAL de uma hora de trabalho, incluindo TODOS os encargos.

```
CLT:
  Custo_mensal_loaded = Salario_bruto × Fator_encargos
  Fator_encargos = 1.70 a 2.00 (varia por regime tributario)

  Decomposicao tipica (Lucro Presumido):
  | Item | % sobre salario |
  |------|----------------|
  | INSS patronal | 20% |
  | FGTS | 8% |
  | 13o salario | 8.33% |
  | Ferias + 1/3 | 11.11% |
  | Provisao rescisao | 5-10% |
  | VR/VA | 5-8% |
  | Plano saude | 5-15% |
  | TOTAL | 62-80% |

  Custo_hora_loaded = Custo_mensal_loaded / Horas_uteis
  Horas_uteis = 21 dias × 8h = 168h

PJ:
  Custo_mensal_loaded = Valor_nota × 1.05 a 1.15
  (+5-15% para contabilidade PJ, ferias, etc.)
  Custo_hora_loaded = Custo_mensal / 168h

Freelancer:
  Custo_hora_loaded = Valor_hora_negociado × 1.05
  (+5% para gestao e overhead de coordenacao)
```

### Exemplos Praticos (Brasil, 2026)

```
| Funcao | Salario CLT | Loaded/mes | Loaded/hora |
|--------|------------|-----------|-------------|
| Dev Junior | R$ 4.000 | R$ 7.200 | R$ 43 |
| Dev Pleno | R$ 8.000 | R$ 14.400 | R$ 86 |
| Dev Senior | R$ 14.000 | R$ 25.200 | R$ 150 |
| Tech Lead | R$ 18.000 | R$ 32.400 | R$ 193 |
| Designer Jr | R$ 3.500 | R$ 6.300 | R$ 38 |
| Designer Sr | R$ 12.000 | R$ 21.600 | R$ 129 |
| PM | R$ 10.000 | R$ 18.000 | R$ 107 |
| UX Researcher | R$ 9.000 | R$ 16.200 | R$ 96 |
```

---

## 3. Impacto da Utilizacao na Margem

### Formula Base

```
Utilizacao = Horas_faturadas / Horas_disponiveis × 100

Impacto na margem:
  Custo_hora_efetivo = Custo_mensal_loaded / (Horas_disponiveis × Utilizacao)

  | Utilizacao | Custo_hora_efetivo (se loaded = R$ 86/h) |
  |-----------|------------------------------------------|
  | 100% | R$ 86 (teorico, impossivel) |
  | 85% | R$ 101 |
  | 75% | R$ 115 |
  | 65% | R$ 132 |
  | 50% | R$ 172 |

Conclusao: cada 10% de queda na utilizacao aumenta o custo efetivo em ~15%
```

### Targets por Funcao

```
| Funcao | Utilizacao Target | Justificativa |
|--------|------------------|---------------|
| Desenvolvedores | 80-85% | Alta alocacao em projetos |
| Designers | 75-80% | Tempo para exploracao criativa |
| PMs | 70-75% | Gestao, reunioes, planejamento |
| Tech Leads | 60-70% | Code review, mentoria, arquitetura |
| Diretores | 30-40% | Comercial, estrategia, gestao |
| Media da agencia | 70-75% | Weighted average |
```

### Simulacao de Impacto

```
Cenario: Agencia com 20 pessoas, custo medio loaded R$ 15.000/mes
Receita mensal: R$ 500.000

| Utilizacao | Custo efetivo | Gross Margin |
|-----------|--------------|-------------|
| 85% | R$ 255K | 49% |
| 75% | R$ 289K | 42% |
| 65% | R$ 334K | 33% |

Delta de 10% na utilizacao = ~7% na margem = ~R$ 35K/mes
```

---

## 4. Metodos de Alocacao de Overhead

### Metodo 1: Proporcional a Receita

```
Overhead_projeto = Overhead_total × (Receita_projeto / Receita_total)

Vantagem: Simples, projetos maiores absorvem mais overhead
Desvantagem: Projeto grande com boa margem pode parecer pior
```

### Metodo 2: Proporcional a Horas

```
Overhead_projeto = Overhead_total × (Horas_projeto / Horas_totais)

Vantagem: Reflete uso de recursos
Desvantagem: Projetos longos sao penalizados
```

### Metodo 3: Percentual Fixo sobre COGS

```
Overhead_projeto = COGS_projeto × Overhead_rate
Overhead_rate = Overhead_total / COGS_total (tipico: 25-40%)

Vantagem: Previsivel, facil de calcular em propostas
Desvantagem: Menos preciso para projetos atipicos
```

### Metodo 4: Activity-Based Costing (ABC)

```
Overhead alocado por atividade real:
- Reunioes comerciais → proporcional a horas de pre-venda
- Aluguel → proporcional ao headcount alocado
- Ferramentas → por uso real
- Admin → rateio igual

Vantagem: Mais justo e preciso
Desvantagem: Complexo de implementar e manter
```

### Recomendacao

Para agencias de ate 50 pessoas: **Metodo 3 (% fixo sobre COGS)** com rate de 30%.
Revisar rate anualmente. Usar ABC apenas se houver necessidade de maior precisao em projetos estrategicos.

---

## 5. Mix de Receita Saudavel

```
| Tipo de Receita | % Ideal | Caracteristica |
|----------------|---------|---------------|
| Retainer/recorrente | 40-60% | Previsivel, cashflow estavel |
| Projetos | 30-40% | Margem potencialmente maior |
| Consulting/advisory | 10-20% | Alta margem, baixo custo |

Regra: retainer > 40% garante estabilidade
Risco: projetos > 70% causa volatilidade de caixa
```

---

## 6. Break-even Analysis

```
Break-even Mensal = Custos_fixos / Gross_Margin_%

Exemplo:
  Custos fixos mensais: R$ 200.000
  Gross margin: 55%
  Break-even = R$ 200.000 / 0.55 = R$ 363.636/mes

Break-even por Projeto:
  Horas_breakeven = Custo_fixo_alocado / (Rate_cobrado - Custo_hora_loaded)
```
