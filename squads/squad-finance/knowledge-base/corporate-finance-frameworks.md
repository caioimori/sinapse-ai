# Corporate Finance Frameworks

> Frameworks fundamentais de financas corporativas: DuPont, EVA, ROIC, WACC, CAPM, estrutura de capital, Modigliani-Miller, Trade-Off, Pecking Order. Base teorica para analise e decisao financeira.

---

## 1. As Tres Decisoes Financeiras Fundamentais

Baseado em Brealey, Myers & Allen ("Principles of Corporate Finance") e Damodaran ("Applied Corporate Finance"):

```
OBJETIVO: Maximizar Valor da Firma / do Acionista
            │
  ┌─────────┴──────────┬──────────────┐
  ▼                    ▼              ▼
Investimento      Financiamento   Distribuicao
(CAPEX)           (Capital        (Dividendos/
                   Structure)      Buybacks)
│                    │              │
NPV, IRR, PI     WACC, D/E,    Payout Ratio,
Payback, ROIC    Modigliani-   Gordon Model,
Real Options     Miller,       Signaling Theory
                 Pecking Order
```

**Principios Damodaran:**
1. **Principio do Investimento** — investir em projetos com retorno > hurdle rate (WACC)
2. **Principio do Financiamento** — mix de divida/equity que minimize custo de capital
3. **Principio do Dividendo** — retornar caixa quando nao ha projetos com retorno > custo de capital

---

## 2. Metricas-Chave de Corporate Finance

| Metrica | Formula | O Que Mede |
|---------|---------|------------|
| **ROIC** | NOPAT / Capital Investido | Retorno sobre capital investido — eficiencia na alocacao |
| **WACC** | (E/V × Ke) + (D/V × Kd × (1-T)) | Custo medio ponderado de capital — hurdle rate |
| **EVA** | NOPAT - (Capital Investido × WACC) | Criacao de valor economico real |
| **EBITDA** | Lucro Operacional + D&A | Proxy de geracao de caixa operacional |
| **Free Cash Flow** | EBITDA - CAPEX - ΔWC - Impostos | Caixa livre para credores e acionistas |
| **ROE** | Lucro Liquido / PL | Retorno sobre patrimonio dos acionistas |
| **ROA** | Lucro Liquido / Ativos Totais | Eficiencia no uso de ativos |
| **Net Debt/EBITDA** | (Divida Bruta - Caixa) / EBITDA | Alavancagem — capacidade de pagamento |

---

## 3. Analise DuPont — Decomposicao do ROE

### DuPont de 3 Fatores

```
ROE = Margem Liquida × Giro do Ativo × Alavancagem Financeira
ROE = (Lucro/Receita) × (Receita/Ativos) × (Ativos/PL)
```

### DuPont de 5 Fatores (Estendida)

```
ROE = Tax Burden × Interest Burden × EBIT Margin × Asset Turnover × Equity Multiplier
ROE = (NI/EBT) × (EBT/EBIT) × (EBIT/Revenue) × (Revenue/Assets) × (Assets/Equity)
```

**Diagnostico DuPont — De onde vem o ROE?**

| Driver | Alta Margem | Alto Giro | Alta Alavancagem |
|--------|------------|-----------|------------------|
| Perfil | Luxo, software, farmaceutica | Varejo, distribuicao, logistica | Bancos, utilities, imobiliario |
| Risco | Baixo | Medio | Alto (fragil em crises) |
| Acao | Proteger margem | Aumentar eficiencia operacional | Monitorar covenants |

---

## 4. EVA — Economic Value Added

```
EVA = NOPAT - (Capital Investido × WACC)

NOPAT = EBIT × (1 - Tax Rate)
Capital Investido = Equity + Debt - Cash
              OU = Net Working Capital + Fixed Assets
```

| EVA | Interpretacao | Acao |
|-----|---------------|------|
| > 0 | Criando valor (retorno > custo de capital) | Continuar — realocar capital em mais projetos com retorno acima do WACC |
| = 0 | Retorno igual ao custo — nao cria nem destroi valor | Revisar estrategia |
| < 0 | Destruindo valor — retorno abaixo do custo de capital | Restructuring, desinvestimento ou reducao de custo de capital |

**MVA (Market Value Added):** Valor presente de todos os EVAs futuros esperados. Se EVA futuro > 0, MVA > 0 (empresa vale mais que o capital investido).

---

## 5. WACC — Weighted Average Cost of Capital

```
WACC = (E/V) × Ke + (D/V) × Kd × (1 - T)

E = Valor de mercado do equity
D = Valor de mercado da divida
V = E + D
Ke = Custo do equity (via CAPM)
Kd = Custo da divida (taxa efetiva antes do beneficio fiscal)
T = Tax rate marginal
```

**WACC no Brasil (2026):**
- Selic em 14,75% a.a. — eleva o custo de capital de todas as empresas brasileiras
- Country Risk Premium (EMBI+ Brasil) adiciona ~2.5-3.5% ao custo de capital em USD
- Ke estimado tipicamente entre 18-28% para empresas brasileiras (em BRL)
- Tax rate efetivo: IRPJ 15% + adicional 10% + CSLL 9% = 34% (Lucro Real)

---

## 6. CAPM — Capital Asset Pricing Model

```
Ke = Rf + β × (Rm - Rf) + CRP

Rf = Risk-free rate (NTN-B 10 anos para analise em BRL; US Treasury para analise em USD)
β = Beta — sensibilidade ao mercado
Rm - Rf = Equity Risk Premium
CRP = Country Risk Premium (Damodaran: EMBI+ para Brasil)
```

**Particularidades no Brasil:**
- Rf em BRL: NTN-B (IPCA+) ou Selic como proxy
- ERP historico Brasil: ~8-9% vs ~5% para EUA (Damodaran)
- Beta unlevered por setor disponivel em Damodaran.com (atualizado anualmente)
- CRP Brasil (2026): ~2.5-3.5% (spreads EMBI+)

**Betas de Referencia por Setor (Brasil, estimativas):**

| Setor | Beta Unlevered | Caracteristica |
|-------|---------------|----------------|
| Tecnologia/Software | 1.2 - 1.6 | Alto risco sistematico |
| Varejo | 0.8 - 1.2 | Ciclico |
| Utilities/Energia | 0.4 - 0.7 | Defensivo, regulado |
| Agronegocio | 0.7 - 1.0 | Ciclico, exposto a commodities |
| Financeiro/Banco | 0.9 - 1.3 | Alavancado naturalmente |
| Healthcare | 0.6 - 1.0 | Semi-defensivo |

---

## 7. Estrutura de Capital — Teorias Fundamentais

### 7.1 Modigliani-Miller

**Proposicao I (sem impostos — mundo perfeito):**
```
V_levered = V_unlevered
O valor da firma independe da estrutura de capital em mercados perfeitos.
```

**Proposicao II (sem impostos):**
```
Ke = K0 + (K0 - Kd) × (D/E)
Custo do equity aumenta linearmente com alavancagem.
```

**Com impostos (mundo real):**
```
V_levered = V_unlevered + T × D  (Tax Shield da divida)
A divida gera beneficio fiscal porque juros sao dedutiveis do IR.
```

### 7.2 Trade-Off Theory

```
Valor Otimo = V_unlevered + PV(Tax Shield) - PV(Financial Distress Costs)

Ponto otimo: beneficio marginal do tax shield = custo marginal do distress
```

| D/E baixo | D/E alto |
|-----------|----------|
| Tax shield subutilizado | Distress costs crescem exponencialmente |
| Custo de capital subotimo | Rating deteriora, custo da divida sobe |
| Acao: aumentar alavancagem | Acao: reduzir alavancagem |

### 7.3 Pecking Order Theory (Myers & Majluf, 1984)

Ordem de preferencia de financiamento por assimetria de informacao:
```
1. Lucros retidos (financiamento interno)
2. Divida (custo de assimetria menor que equity)
3. Equity novo (sinal negativo ao mercado — "gestores emitem quando acoes estao caras")
```

**Implicacao:** Empresas saudaveis preferem auto-financiamento. Emissao de equity e sinal de fraqueza ou sobrevalorizacao.

### 7.4 Market Timing Theory (Baker & Wurgler, 2002)

Empresas emitem equity quando acoes estao sobrevalorizadas e recompram quando estao subvalorizadas. Estrutura de capital e resultado de decisoes oportunistas de timing.

---

## 8. Metricas de Alavancagem e Covenants Tipicos

| Metrica | Formula | Threshold (Investment Grade) | Covenant Tipico (Debt) |
|---------|---------|------------------------------|------------------------|
| Net Debt/EBITDA | (Divida Bruta - Caixa) / EBITDA | < 2.5x | < 3.0-4.0x |
| Interest Coverage | EBIT / Despesas Financeiras | > 3x | > 2.5-3.0x |
| DSCR | FCO / Servico da Divida | > 1.2x | > 1.2-1.5x |
| D/E Ratio | Divida Total / PL | Varia por setor | Varia |
| LTV | Divida / Valor do Ativo | < 70% (imobiliario) | < 60-75% |

---

## 9. Rating de Credito no Brasil (2026)

| Agencia | Nota Brasil | Status | Nota para Investment Grade |
|---------|------------|--------|---------------------------|
| S&P | BB | Especulativo (2 degraus abaixo do IG) | BBB- |
| Moody's | Ba1 | Especulativo (1 degrau abaixo do IG) | Baa3 |
| Fitch | BB | Especulativo (2 degraus abaixo do IG) | BBB- |

Recuperacao do investment grade reduziria custo de capital para empresas brasileiras em ~1-2% (estimativa). Fitch sinalizou upgrade improvavel antes de 2027.

---

## 10. Fontes de Financiamento no Brasil

### Equity

| Fonte | Descricao | Custo | Quando Usar |
|-------|-----------|-------|-------------|
| Lucros Retidos | Reinvestimento | Ke (custo de oportunidade) | Sempre — Pecking Order primeiro |
| Private Equity | Fundos PE | IRR alvo 20-30% | Empresas maduras nao-listadas |
| Venture Capital | Startups | IRR alvo 30-50% | Startups em crescimento |
| IPO (B3) | Abertura de capital | 15-25% underwriting + desconto | Empresa madura com track record |

### Debt

| Fonte | Descricao | Custo Tipico (2026) | Quando Usar |
|-------|-----------|---------------------|-------------|
| CDB/CCB | Captacao bancaria | CDI + 0.5-3% a.a. | Capital de giro, operacional |
| Debentures | Titulos corporativos | CDI + 1-5% a.a. | Grandes empresas com rating |
| CRI/CRA | Lastro imobiliario/agro, isento IR PF | CDI + 0.5-3% a.a. | Setores elegíveis |
| BNDES | Banco de desenvolvimento | TLP + spread | Projetos de investimento, infra |
| Bonds internacionais | Emissao exterior | UST + 2-6% | Grandes empresas, acesso externo |

### JCP — Juros sobre Capital Proprio

Instrumento exclusivamente brasileiro: remunera o capital proprio dos acionistas com taxa TJLP, dedutivel do IRPJ e CSLL. Reduz efetivamente a carga tributaria de empresas no Lucro Real com PL elevado.

```
JCP maxima dedutivel = PL × TJLP
Beneficio fiscal = JCP × 34% (IRPJ + CSLL)
```

---

## 11. Aplicacao pelo Squad Finance

Ao analisar qualquer empresa:
1. Calcular ROIC e comparar com WACC (ROIC > WACC = criacao de valor)
2. Decompor ROE via DuPont para identificar drivers
3. Calcular EVA para quantificar criacao ou destruicao de valor
4. Avaliar estrutura de capital contra Trade-Off e covenants
5. Considerar custo de oportunidade do capital no Brasil (Selic 14,75% + Premio de Risco)
6. Usar JCP como alavanca de planejamento tributario quando aplicavel

---

## 12. Referencias

- **"Principles of Corporate Finance"** — Brealey, Myers & Allen (biblia)
- **"Applied Corporate Finance"** — Aswath Damodaran
- **"Valuation: Measuring and Managing the Value of Companies"** — McKinsey (Koller, Goedhart, Wessels)
- **"Financas Corporativas e Valor"** — Alexandre Assaf Neto (referencia brasileira)
- **Damodaran Online** — damodaran.com (betas, ERP, CRP atualizados)
