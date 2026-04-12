# Financial Strategy Models

## Purpose
Frameworks financeiros de alto nivel para tomada de decisao estrategica. Nao substitui analise financeira detalhada — fornece os modelos mentais para interpretar e questionar numeros. Baseado em principios de Dalio (macro), Munger (value investing), Thiel (venture/power law), e Naval (unit economics).

---

## PART 1: VALUATION & BUSINESS HEALTH

### 1. DuPont Analysis (F. Donaldson Brown, DuPont Corp, 1920)
- **Originator**: F. Donaldson Brown, CFO da DuPont (1920)
- **When to Use**: Diagnosticar por que o ROE (retorno sobre patrimonio) melhorou ou piorou; benchmarking setorial; decisao de alavancagem
- **How to Apply**:
  ROE = Margem Liquida × Giro do Ativo × Multiplicador de Patrimonio
  ROE = (Lucro Liquido/Receita) × (Receita/Ativo Total) × (Ativo Total/PL)
  1. Calcule os 3 componentes separadamente
  2. Compare com periodo anterior e concorrentes
  3. Identifique qual componente impulsiona ou arrasta o ROE
  4. Decida intervencao especifica: margem (operacoes), giro (eficiencia de capital), alavancagem (estrutura de capital)
- **Example Application**: Empresa com ROE caindo de 18% para 12%. DuPont revela: margem estavel (8%), giro caindo (1.5x → 1.2x), alavancagem estavel. Diagnostico: empresa cresceu ativos (novos equipamentos) sem crescer proporcional a receita. Intervencao: utilizar capacidade instalada antes de novos investimentos.
- **Key Metrics**: ROE vs. peers; cada componente vs. historico proprio; comparacao setor
- **Cross-References**: EVA (Economic Value Added), WACC, Capital Structure

---

### 2. Economic Value Added — EVA (Stern Stewart, 1991)
- **Originator**: Joel Stern e Bennett Stewart (Stern Stewart & Co.)
- **When to Use**: Avaliar se a empresa realmente cria valor (vs. apenas lucro contabil); decisoes de CAPEX; avaliacao de divisoes
- **How to Apply**:
  EVA = NOPAT - (Capital Investido × WACC)
  Onde: NOPAT = Net Operating Profit After Tax; WACC = Weighted Average Cost of Capital
  1. Calcule NOPAT (lucro operacional ajustado apos impostos)
  2. Identifique todo capital investido (debt + equity)
  3. Calcule WACC (ver modelo abaixo)
  4. EVA positivo = empresa cria valor acima do custo do capital
  5. EVA negativo = empresa destroi valor mesmo com lucro contabil positivo
- **Example Application**: Empresa com lucro de R$2M, mas EVA = R$2M - (R$20M × 15%) = R$2M - R$3M = -R$1M. Apesar do lucro positivo, a empresa destroi valor porque o capital poderia render mais em outro investimento. Sinal para revisao de estrategia.
- **Key Metrics**: EVA absoluto; EVA/capital investido (EVA spread); tendencia YoY
- **Cross-References**: WACC, DuPont, DCF, Dalio's All Weather (custo de capital em diferentes ambientes)

---

### 3. WACC — Weighted Average Cost of Capital
- **Originator**: Conceito academico consolidado por Modigliani & Miller; pratica por Brealey & Myers
- **When to Use**: Taxa de desconto em DCF; hurdle rate para projetos; decisao de estrutura de capital
- **How to Apply**:
  WACC = (E/V) × Re + (D/V) × Rd × (1 - Tc)
  Onde: E = valor do equity; D = valor da divida; V = E+D; Re = custo do equity; Rd = custo da divida; Tc = taxa de imposto
  1. Re (custo do equity): use CAPM: Re = Rf + Beta × (Rm - Rf)
     - Rf = taxa livre de risco (Tesouro Selic ou IPCA+)
     - Beta = volatilidade relativa ao mercado
     - Rm = retorno esperado do mercado (historicamente ~11-14% no Brasil)
  2. Rd = taxa de juros efetiva da divida da empresa
  3. Calcule pesos baseados em valor de mercado (nao contabil)
- **Example Application Brasil**: Startup tech Series A: Rf = 14% (Selic), Beta = 1.4 (startup tech), premio = 5%. Re = 14% + 1.4×5% = 21%. WACC com 80% equity, 20% divida a 18%, IR 25%: WACC = 0.8×21% + 0.2×18%×0.75 = 16.8% + 2.7% = 19.5%. Qualquer projeto precisa retornar >19.5% para criar valor.
- **Key Metrics**: WACC atual; WACC otimo para a estrutura de capital; comparacao com ROIC (retorno deve superar WACC)
- **Cross-References**: EVA, DCF, Capital Structure, Dalio's risk parity

---

### 4. DCF — Discounted Cash Flow (John Burr Williams, 1938)
- **Originator**: John Burr Williams ("The Theory of Investment Value", 1938)
- **When to Use**: Valuation de negocios; avaliacao de projetos de investimento; comparacao de alternativas estrategicas
- **How to Apply**:
  Valor = Σ [FCFt / (1+WACC)^t] + [Terminal Value / (1+WACC)^n]
  Terminal Value = FCFn × (1+g) / (WACC - g)
  1. Projete Free Cash Flow para 5-10 anos (receita, margens, capex, working capital)
  2. Defina terminal growth rate (g) — conservador: PIB nominal do setor
  3. Desconte cada periodo pelo WACC
  4. Some o terminal value descontado
  5. Faca analise de sensibilidade: o que muda se WACC +2%? se growth -1%?
- **Example Application**: SaaS com ARR R$5M crescendo 80% a.a., churn 5%, margens melhorando. FCF projetado: Anos 1-5: R$-1M, R$0.5M, R$2M, R$4M, R$7M. Terminal value (crescimento perpetuo 5%, WACC 20%): R$7M×1.05/(0.20-0.05) = R$49M. VPL total: ~R$28M pre-money valuation justificavel.
- **Key Metrics**: Sensibilidade do valor a WACC (+/- 2%) e ao crescimento terminal (+/- 1%); margem de segurança vs. preco pedido
- **Cross-References**: Margem de Segurança (Munger/Graham), WACC, EVA, Monte Carlo

---

### 5. Monte Carlo Simulation
- **Originator**: Stanislaw Ulam e John von Neumann (Projeto Manhattan, 1940s)
- **When to Use**: Qualquer projecao financeira com multiplas variaveis incertas; sizing de investimento; stress testing
- **How to Apply**:
  1. Identifique as variaveis mais incertas do seu modelo (ex: taxa de crescimento, churn, CAC)
  2. Para cada variavel, defina: valor base, minimo plausivel, maximo plausivel, distribuicao (normal, triangular, etc.)
  3. Rode 10.000+ simulacoes com valores aleatorios dentro das distribuicoes
  4. Analise a distribuicao de resultados: P10, P50, P90
  5. A decisao deve sobreviver ao P10 (cenario ruim)
- **Example Application**: Projecao de caixa em 24 meses: base case positivo, mas Monte Carlo revela P10 = -R$2M em caixa em 18 meses. Decisao: levantar capital agora mesmo sem urgencia aparente.
- **Key Metrics**: P10/P50/P90 dos KPIs criticos; probabilidade de ruin (caixa negativo)
- **Cross-References**: Scenario Planning, Expected Value (Dalio), Margem de Segurança

---

## PART 2: UNIT ECONOMICS & GROWTH MODELS

### 6. Unit Economics Framework (SaaS / Marketplace)
- **Originator**: Conceito consolidado pela comunidade de venture capital; formalizado por David Skok (Matrix Partners)
- **When to Use**: Avaliar viabilidade de modelo de negocio antes de escalar; decisao de quando acelerar crescimento
- **How to Apply**:
  **Metricas fundamentais**:
  - CAC (Customer Acquisition Cost) = Total Marketing+Sales / Novos Clientes
  - LTV (Lifetime Value) = ARPU × Margem Bruta / Churn Rate
  - Payback Period = CAC / (ARPU × Margem Bruta mensal)
  - LTV/CAC ratio = eficiencia do modelo
  
  **Benchmarks SaaS**:
  - LTV/CAC > 3x: modelo viavel para escalar
  - LTV/CAC > 5x: modelo excelente, escale agressivamente
  - LTV/CAC < 3x: corrija antes de escalar
  - Payback < 12 meses: saudavel
  - Payback < 6 meses: excelente
  
  **Benchmarks Marketplace**:
  - Take rate sustentavel: 10-30% dependendo da categoria
  - GTV/CAC relevante para assessment de moat
- **Example Application**: SaaS com ARPU R$500/mes, Margem Bruta 75%, Churn 2%/mes, CAC R$2.500. LTV = R$500×0.75/0.02 = R$18.750. LTV/CAC = 7.5x. Payback = R$2.500/(R$500×0.75) = 6.7 meses. Modelo excelente — hora de blitzscale.
- **Key Metrics**: LTV/CAC; Payback; Net Revenue Retention (NRR); Magic Number
- **Cross-References**: Growth Loops (growth-strategy-models.md), Blitzscaling (Hoffman), WACC

---

### 7. Rule of 40 (Brad Feld / Techstars)
- **Originator**: Brad Feld (Techstars, 2015 blog post)
- **When to Use**: Avaliar saude de empresas SaaS; decidir entre crescimento vs. rentabilidade; benchmarking com peers
- **How to Apply**:
  Rule of 40 Score = % Crescimento de Receita + % Margem EBITDA
  - Score >= 40: empresa saudavel
  - Score >= 60: empresa excelente
  - Score < 40: avalie se e por crescimento (aceitavel) ou por ineficiencia (preocupante)
- **Example Application**: Empresa crescendo 50% a.a. com EBITDA -15% = Score 35. Abaixo de 40, mas crescimento alto com burn controlado — aceitavel se o modelo de unit economics e forte. Empresa crescendo 20% com EBITDA +10% = Score 30. Preocupante — nem cresce bem nem e rentavel.
- **Key Metrics**: Score atual; tendencia (melhorando ou piorando?); comparacao com benchmarks do setor
- **Cross-References**: Unit Economics, Blitzscaling (quando violar a regra conscientemente), EVA

---

### 8. Magic Number (Salesforce / SaaS Growth Efficiency)
- **Originator**: Utilizado extensivamente pela Salesforce; documentado por Josh James (Omniture/Domo)
- **When to Use**: Decidir nivel de investimento em Sales & Marketing; avaliar eficiencia de crescimento
- **How to Apply**:
  Magic Number = (Net New ARR Q × 4) / S&M Spend Q-1
  - Magic Number > 1.0: cada R$1 em S&M gera >R$1 em ARR anualizado — escale
  - Magic Number 0.75-1.0: modelo funciona, crescimento moderado
  - Magic Number < 0.5: pare de escalar S&M, corrija o modelo primeiro
- **Example Application**: Q2 S&M: R$500K. Q3 Net New ARR: R$200K. Magic Number = (R$200K×4)/R$500K = 1.6. Excelente — dobrar o investimento em S&M e justificavel.
- **Key Metrics**: Magic Number trimestral; tendencia ao longo dos quarters
- **Cross-References**: Unit Economics, Rule of 40, Growth Loops

---

## PART 3: CAPITAL STRUCTURE & MACRO

### 9. Capital Structure Optimization (Modigliani-Miller + Dalio)
- **Originator**: Franco Modigliani & Merton Miller (1958); aplicado pragmaticamente por Dalio
- **When to Use**: Decidir mix de divida vs. equity; estruturar rodadas de captacao; avaliar alavancagem ideal
- **How to Apply**:
  **Teorema de M&M** (com impostos): Divida cria valor via "tax shield" (juros dedutivos)
  **Ponto otimo**: Alavancagem onde o tax shield maximiza valor sem exceder o custo de financial distress
  
  **Framework pragmatico**:
  1. Calcule Interest Coverage Ratio: EBIT/Juros (saudavel: >3x)
  2. Debt/EBITDA (conservador: <2x para empresas em crescimento; <4x para empresas maduras)
  3. Avalie ciclo economico: em expansao, mais divida aceitavel; em contracyclical, reduza alavancagem
  4. Considere covenants e flexibilidade operacional
  
  **No contexto brasileiro**: Selic alta torna divida cara — equity mais atraente para startups. Em momentos de Selic baixa, divida para crescimento faz sentido.
- **Example Application**: Empresa com EBITDA R$10M, divida R$15M (1.5x), juros R$2.5M (coverage 4x). Estrutura saudavel com espaco para mais alavancagem se oportunidade de crescimento surgir. Opcao: CRI/CRA/Debentures a taxas mais baixas.
- **Key Metrics**: Debt/EBITDA; Interest Coverage; % divida prefixada vs. flutuante (protecao contra Selic)
- **Cross-References**: WACC, EVA, Dalio's Economic Machine, Dalio's All Weather

---

### 10. Dalio's Economic Machine Model (Ray Dalio, Bridgewater, 2013)
- **Originator**: Ray Dalio — sintetizado no video "How the Economic Machine Works"
- **When to Use**: Analisar ciclos macroeconomicos; timing de decisoes de investimento e crescimento; hedge de portfolio
- **How to Apply**:
  3 forcas fundamentais:
  1. **Aumento de Produtividade** (longo prazo, previsivel): base do crescimento sustentavel
  2. **Ciclo de Divida de Curto Prazo** (5-8 anos): boom → bust. Banco Central controla via taxa de juros
  3. **Ciclo de Divida de Longo Prazo** (50-75 anos): quando divida se torna impagavel. Resolve via deflacao de divida (depressao), inflacao, ou reestruturacao
  
  **Posicionamento pratico**:
  - Inicio de ciclo de expansao: comprar ativos de risco (acoes, real estate)
  - Fim de ciclo (high debt/GDP, inflacao): aumentar cash, bonds curtos, commodities
  - "Beautiful Deleveraging": quando banco central imprime dinheiro + governo gasta = bom para acoes nominalmente, ruim em termos reais
- **Example Application Brasil 2024-2025**: Selic alta (ciclo contracionista), inflacao residual, alto endividamento publico → ativo real (imoveis, commodities agro, exportadoras) vs. ativos de duracao longa (tech growth stocks). Empresas devem minimizar exposicao a custos flutuantes e maximizar receitas dolarizadas.
- **Key Metrics**: Posicao no ciclo (expansao/contracyclical); Debt/GDP; Real Interest Rate; Current Account
- **Cross-References**: All Weather Strategy, Scenario Planning, WACC (ambiente de Selic afeta diretamente)

---

## PART 4: PRICING STRATEGY

### 11. Value-Based Pricing Framework
- **Originator**: Articulado por McKinsey & Co.; praticado extensivamente por software e consulting
- **When to Use**: Definir ou revisar precificacao de produtos e servicos; justificar precos premium
- **How to Apply**:
  1. Identifique o Economic Value to Customer (EVC):
     - Qual e o valor da proxima melhor alternativa (referencia)?
     - Qual e o valor diferencial da sua solucao sobre a referencia?
     - EVC = Valor da referencia + Valor diferencial
  2. Defina o preco entre o custo variavel (floor) e o EVC (ceiling)
  3. Segmente clientes por WTP (willingness to pay) — diferencie precos se possivel
  4. Teste empiricamente: A/B de preco, price sensitivity surveys (Van Westendorp)
- **Example Application**: Software de automacao que substitui 1 FTE (R$80K/ano). EVC = R$80K. Preco de R$12K/ano = captura 15% do valor gerado. Justificavel mesmo sendo "caro" vs. concorrentes a R$3K — porque o diferencial de automacao e real.
- **Key Metrics**: Price/Value ratio; WTP por segmento; Price elasticity; Revenue por mudanca de 1% no preco
- **Cross-References**: Unit Economics (preco afeta LTV), Competitive Moats (pricing power = moat), Porter's 5 Forces

---

### 12. Pricing Psychology (Kahneman / Thaler)
- **Originator**: Daniel Kahneman, Richard Thaler, Dan Ariely
- **When to Use**: Estruturar planos e tiers de preco; otimizar paginas de pricing; aumentar AOV
- **How to Apply**:
  **Principios chave**:
  1. **Anchoring**: Mostre primeiro o plano mais caro (ancora o que e "normal")
  2. **Decoy Pricing**: Tres opcoes — a media parece "sensata" por contraste com extremos
  3. **Charm Pricing**: R$997 vs R$1.000 (efeito do digito esquerdo)
  4. **Bundling**: Reduce pain of paying por "dor unica" vs. multiplas cobranças
  5. **Loss Framing**: "Voce vai perder R$X por dia sem isso" > "Voce vai ganhar R$X"
  6. **Endowment Effect**: Free trial + premium experience ativa propriedade psicologica
- **Example Application**: SaaS com 3 planos: Starter R$97 (basic), Pro R$297 (most popular — decoy para Enterprise), Enterprise R$897 (ancora que faz Pro parecer razoavel). Pro tem 3x features do Starter mas e 3x o preco — percebido como valor. Conversao Pro > Starter por 40%.
- **Key Metrics**: Mix de planos (% cada tier); ARPU; upgrade rate; conversion rate por estrutura de preco
- **Cross-References**: Value-Based Pricing, Loss Aversion (Mental Models), Behavioral Economics

---

## Quick Reference: Financial Health Dashboard

| Metrica | Sinal Verde | Sinal Amarelo | Sinal Vermelho |
|---------|-------------|---------------|----------------|
| LTV/CAC | >5x | 3-5x | <3x |
| Payback Period | <6 meses | 6-18 meses | >18 meses |
| Rule of 40 | >60 | 40-60 | <40 |
| Magic Number | >1.0 | 0.5-1.0 | <0.5 |
| Interest Coverage | >5x | 3-5x | <3x |
| Debt/EBITDA | <2x | 2-4x | >4x |
| Gross Margin SaaS | >70% | 50-70% | <50% |
| NRR | >120% | 100-120% | <100% |

**Regra de Munger para financas**: "Nao confie em numeros que voce nao calculou voce mesmo ou nao entende como foram calculados."
