# Valuation Methods

> Metodos completos de avaliacao de empresas: DCF, multiplos, opcoes reais, Black-Scholes, valuation de startups. Framework Damodaran + contexto brasileiro.

---

## 1. As Quatro Abordagens de Valuation (Damodaran)

| Abordagem | Base | Melhor Para |
|-----------|------|-------------|
| **DCF** | Valor presente dos FCFs futuros | Empresas com fluxo de caixa previsivel |
| **Multiplos (Relative)** | Comparacao com empresas similares | Mercados com muitos comparaveis |
| **Opcoes Reais** | Valor da flexibilidade gerencial | Projetos com alta opcionalidade |
| **Asset-Based** | Valor dos ativos liquidos | Empresas em liquidacao, holding puro |

---

## 2. DCF — Discounted Cash Flow

### Formula Central

```
Valor da Firma = Σ (FCF_t / (1 + WACC)^t) + Valor Terminal / (1 + WACC)^n

Valor Terminal (Gordon Growth Model):
  TV = FCF_(n+1) / (WACC - g)
  g = taxa de crescimento na perpetuidade (tipicamente 2-4% para empresas maduras)

Equity Value = Valor da Firma - Divida Liquida + Ativos Nao-Operacionais
```

### Passos do DCF Completo

```
1. PROJETAR RECEITAS
   Top-down: TAM × Market Share
   Bottom-up: Unidades × Preco

2. PROJETAR MARGENS E CUSTOS
   COGS, SG&A, D&A — baseado em historico e benchmarks

3. CALCULAR EBIT E NOPAT
   NOPAT = EBIT × (1 - Tax Rate)

4. CALCULAR FREE CASH FLOW
   FCF = NOPAT + D&A - CAPEX - Δ Capital de Giro

5. ESTIMAR WACC (ver corporate-finance-frameworks.md)

6. CALCULAR VALOR TERMINAL
   Gordon Growth OU Exit Multiple (EV/EBITDA do setor)

7. DESCONTAR A VALOR PRESENTE

8. AJUSTAR PARA EQUITY VALUE
   Subtrair divida liquida, adicionar ativos nao-operacionais

9. ANALISE DE SENSIBILIDADE
   Variar WACC (±1%) e crescimento (±1%) — tornado diagram
```

### Armadilhas Comuns no DCF

| Erro | Consequencia | Correcao |
|------|-------------|----------|
| Taxa de crescimento na perpetuidade > PIB | Empresa "maior que a economia" no longo prazo | g <= crescimento nominal do PIB |
| Reinvestimento inconsistente com crescimento | ROIC implicito irreal | Verificar: g = ROIC × Reinvestment Rate |
| Usar WACC nominal com FCF real (ou vice-versa) | Erro de ~IPCA no valor | Consistencia: nominal/nominal ou real/real |
| Dupla contagem de ativos nao-operacionais | Superavaliacao | Caixa: nao incluir no FCF E no ajuste final |
| Circular reference no WACC (peso de equity depende do valor) | Modelo inconsistente | Usar pesos-alvo ou iterar |

---

## 3. Multiplos — Relative Valuation

### Multiplos Mais Usados

| Multiplo | Formula | Quando Usar | Contexto |
|----------|---------|-------------|---------|
| **EV/EBITDA** | Enterprise Value / EBITDA | O mais versatil — independe de estrutura de capital e D&A | Universal |
| **P/E** | Preco / Lucro por Acao | Empresas lucrativas e comparaveis | Bancos, varejo maduro |
| **EV/Revenue** | EV / Receita | Empresas pre-lucro em crescimento | SaaS, startups Series B+ |
| **P/B** | Preco / Valor Patrimonial | Bancos, seguradoras, asset-heavy | Financeiras |
| **EV/EBIT** | EV / EBIT | Considera D&A — bom para capital-intensive | Industria, logistica |
| **P/FCF** | Preco / Free Cash Flow | Empresas maduras geradoras de caixa | Utilities, consumo |

### Enterprise Value

```
EV = Market Cap + Divida Bruta - Caixa + Participacao Minoritaria + Preferred Stock

Interpretacao: quanto custaria comprar TODA a empresa (equity + credores) livre de caixa
```

### Multiplos de Referencia — Brasil (2026)

| Setor | EV/EBITDA Tipico | Observacao |
|-------|-----------------|------------|
| Tecnologia/SaaS | 8-20x | Varia muito com crescimento |
| Varejo | 5-10x | Comprimido por juros altos |
| Financeiro (banco) | P/B 1-2.5x | Multiplos proprios |
| Saude/Healthcare | 8-15x | Premium de setor defensivo |
| Energia/Utilities | 5-9x | Regulado, previsivel |
| Agronegocio | 5-8x | Ciclico, commodity-linked |
| M&A (transacoes) | Premio de 20-30% sobre trading | Controle + sinergias |

### Processo de Comparable Company Analysis (CCA)

```
1. Selecionar universo de comparaveis (setor, porte, geografia, modelo de negocio)
2. Coletar metricas financeiras (LTM = Last Twelve Months preferido)
3. Calcular EV para cada comparable
4. Calcular multiplos (EV/EBITDA, P/E, etc.)
5. Calcular mediana e quartis
6. Aplicar multiplo ao alvo (com premios/descontos por iliquidez, tamanho, crescimento)
```

---

## 4. Opcoes Reais

Aplica modelos de precificacao de opcoes financeiras a decisoes de investimento corporativo. Captura o VALOR DA FLEXIBILIDADE que o DCF ignora.

| Tipo | Analogia Financeira | Exemplo Corporativo |
|------|---------------------|---------------------|
| **Adiar** | Call americana | Adiar expansion de fabrica ate demanda confirmar |
| **Expandir** | Call sobre ativo | Direito de expandir se mercado exceder expectativa |
| **Contrair** | Put sobre ativo | Reduzir operacoes se mercado deteriorar |
| **Abandonar** | Put americana | Vender ativos e sair do negocio |
| **Trocar** | Portfolio de opcoes | Flexibilidade de alternar insumos ou outputs |
| **Staging** | Compound option | Investir em fases (P&D → Piloto → Escala) |

**Quando usar opcoes reais vs DCF:**
- DCF: projetos maduros com baixa incerteza e opcionalidade limitada
- Opcoes Reais: projetos com alta incerteza, reversibilidade, ou decisoes sequenciais (P&D, recursos naturais, startups)

---

## 5. Black-Scholes — Precificacao de Opcoes

```
Call = S × N(d1) - K × e^(-rT) × N(d2)
Put  = K × e^(-rT) × N(-d2) - S × N(-d1)

d1 = [ln(S/K) + (r + σ²/2) × T] / (σ × √T)
d2 = d1 - σ × √T

S = Preco spot do ativo
K = Strike price (preco de exercicio)
r = Taxa livre de risco (continua)
T = Tempo ate vencimento (em anos)
σ = Volatilidade do ativo (anualizada)
N() = Funcao de distribuicao normal cumulativa
```

### "Greeks" — Sensibilidades

| Greek | Simbolo | Mede | Pratica |
|-------|---------|------|---------|
| **Delta** | Δ | ∂V/∂S | Variacao do preco da opcao por R$1 no ativo |
| **Gamma** | Γ | ∂²V/∂S² | Variacao do delta — convexidade |
| **Theta** | Θ | ∂V/∂t | Decaimento temporal — valor perdido por dia |
| **Vega** | ν | ∂V/∂σ | Sensibilidade a volatilidade |
| **Rho** | ρ | ∂V/∂r | Sensibilidade a taxa de juros |

---

## 6. Modelagem Financeira — Best Practices

### Estrutura Padrao de um Modelo

```
1. Assumptions Sheet    → Todas premissas em um lugar (inputs em azul)
2. Income Statement     → DRE projetada
3. Balance Sheet        → Balanco projetado
4. Cash Flow Statement  → DFC projetada
5. DCF / Valuation      → Avaliacao
6. Sensitivity / Scenarios → Tornado diagram, Monte Carlo
7. Output / Summary     → Dashboard executivo
```

### Boas Praticas (FAST Standard)

```
- Separar inputs de calculos (inputs em azul, formulas em preto)
- Uma formula por linha — nao misturar logicas
- Fluxo esquerda → direita (historico → projecao)
- Nunca hardcoded numbers dentro de formulas
- Documentar premissas e fontes
- Checks de integridade: Ativo = Passivo + PL em todo periodo
- 3 cenarios obrigatorios: Base (60%), Bull (20%), Bear (20%)
- Sensibilidade: variar WACC ±1%, crescimento ±1%
```

---

## 7. Analise de Cenarios e Sensibilidade

| Tecnica | Descricao | Quando Usar |
|---------|-----------|-------------|
| **Sensibilidade** | Varia uma premissa de cada vez | Identificar variaveis criticas |
| **Cenarios** | Varia multiplas premissas simultaneamente | Avaliar faixas de resultado |
| **Monte Carlo** | Distribuicoes de probabilidade para cada variavel | Projetos complexos |
| **Break-even** | NPV = 0 — qual o minimo aceitavel | Definir limites de decisao |
| **Tornado Diagram** | Ranking visual de sensibilidade | Comunicacao para stakeholders |

### Monte Carlo — Passos

```
1. Identificar variaveis-chave (receita, WACC, margem, crescimento)
2. Definir distribuicao para cada variavel (normal, triangular, uniforme)
3. Gerar N simulacoes (minimo 10.000)
4. Calcular NPV/IRR para cada simulacao
5. Analisar distribuicao resultante (media, desvio padrao, percentis)
6. Calcular P(NPV < 0) — risco de perda
```

---

## 8. Valuation de Startups

Startups early-stage tem valuation mais arte que ciencia — especialmente pre-revenue:

| Metodo | Estagio | Base |
|--------|---------|------|
| **Berkus Method** | Pre-revenue | 5 fatores qualitativos, ate US$ 2M cada |
| **Scorecard Method** | Pre-revenue | Comparacao com peers, ajustada |
| **Comparable Transactions** | Seed/Series A | Multiplos de deals recentes similares |
| **Revenue Multiple** | Series A+ | ARR × multiplo do setor (SaaS: 5-30x) |
| **VC Method** | Qualquer | Post-money = Terminal Value / (1+IRR)^n |
| **DCF** | Growth/Late stage | FCF projetado (alta incerteza) |

### VC Method — Formula

```
Pre-money Valuation = Post-money Valuation - Investimento

Post-money Valuation = Terminal Value / (1 + IRR_alvo)^n

Terminal Value = Receita_n × Multiplo_saida
IRR alvo VC: 30-50% (pre-seed/seed) a 20-30% (Series B+)
```

---

## 9. Referencias

- **"Investment Valuation"** — Aswath Damodaran (biblia de valuation)
- **"Valuation"** — McKinsey (Koller, Goedhart, Wessels)
- **"Investment Banking"** — Rosenbaum & Pearl (multiplos e M&A)
- **"Financial Modeling"** — Simon Benninga
- **"The Dark Side of Valuation"** — Damodaran (empresas dificeis de avaliar)
- **"Options, Futures, and Other Derivatives"** — John Hull (Black-Scholes)
- **"Avaliacao de Empresas"** — Alexandre Assaf Neto (contexto brasileiro)
