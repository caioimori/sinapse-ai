# Finance Master Reference

> **Source:** MS-013 Finance Research (2026-04-07)
> **Scope:** Corporate Finance, Valuation, Cash Flow, Capital Budgeting, Capital Structure, Risk Management, FP&A, M&A, FinTech, Pricing, Financial Reporting, Tributacao, Startups & VC
> **Context:** Brazilian market + international best practices

---

## 1. Corporate Finance Fundamentals

### 1.1 Three Core Decisions

```
                    OBJECTIVE: Maximize Firm Value
                               |
              +----------------+----------------+
              v                v                v
        Investment       Financing        Distribution
         (CAPEX)         (Capital           (Dividends/
                         Structure)          Buybacks)

    NPV, IRR, PI      WACC, D/E,         Payout Ratio,
    Payback, ROIC      Modigliani-Miller  Gordon Model,
    Real Options       Pecking Order      Signaling Theory
```

### 1.2 Key Metrics

| Metric | Formula | Purpose |
|--------|---------|---------|
| ROIC | NOPAT / Capital Invested | Return on invested capital |
| WACC | (E/V x Ke) + (D/V x Kd x (1-T)) | Weighted average cost of capital |
| EVA | NOPAT - (Capital Invested x WACC) | Economic value creation |
| EBITDA | Operating Profit + D&A | Cash flow proxy |
| FCF | EBITDA - CAPEX - delta WC - Taxes | Free cash for stakeholders |
| ROE | Net Income / Equity | Return to shareholders |
| ROA | Net Income / Total Assets | Asset efficiency |
| Net Debt/EBITDA | (Gross Debt - Cash) / EBITDA | Leverage capacity |
| Current Ratio | Current Assets / Current Liabilities | Short-term liquidity |
| Margin (Net) | Net Income / Revenue | Final profitability |

### 1.3 DuPont Analysis

**3-factor:**
```
ROE = Net Margin x Asset Turnover x Financial Leverage
    = (NI/Revenue) x (Revenue/Assets) x (Assets/Equity)
```

**5-factor (extended):**
```
ROE = Tax Burden x Interest Burden x EBIT Margin x Asset Turnover x Equity Multiplier
    = (NI/EBT) x (EBT/EBIT) x (EBIT/Revenue) x (Revenue/Assets) x (Assets/Equity)
```

### 1.4 EVA (Economic Value Added)

```
EVA = NOPAT - (Capital Invested x WACC)

NOPAT = EBIT x (1 - Tax Rate)
Capital Invested = Equity + Debt - Cash

EVA > 0 -> creating value
EVA < 0 -> destroying value
```

### 1.5 Brazilian Context

- Selic: 14.75% a.a. (Mar/2026, first cut in ~2 years; projected 12.25-12.50% year-end 2026)
- Tax burden: ~33% of GDP, 90+ tributes
- B3: largest exchange in Latin America; R$517.3B in equities traded (2025)
- BRL: one of the most volatile emerging market currencies
- Tax Reform 2026-2033: CBS/IBS transition impacts all financial decisions

### 1.6 Regulators

| Entity | Role |
|--------|------|
| BACEN (BCB) | Monetary policy, banking regulation, PIX |
| CVM | Securities market regulation |
| B3 | Exchange, derivatives, clearing |
| CMN | Top normative body |
| SUSEP | Insurance, open pension funds |
| ANBIMA | Self-regulation, fund classification |
| Receita Federal | Federal tax administration, SPED |
| Tesouro Nacional | Government debt, LTN/NTN-B/NTN-F/LFT |

---

## 2. Valuation & Financial Modeling

### 2.1 Approaches

1. **DCF** -- Present value of future cash flows (most fundamentally correct)
2. **Relative Valuation (Multiples)** -- Value relative to comparable companies
3. **Contingent Claims (Real Options)** -- Value of flexibility
4. **Asset-Based** -- Net asset value (liquidation or replacement)

### 2.2 DCF Formula

```
Value = SUM(FCF_t / (1+WACC)^t) + Terminal Value / (1+WACC)^n

Terminal Value = FCF_(n+1) / (WACC - g)   [Gordon Growth]
```

**10-Step DCF:**
1. Project revenues (top-down or bottom-up)
2. Project costs and margins
3. Calculate EBIT and NOPAT
4. Calculate Free Cash Flow = NOPAT + D&A - CAPEX - delta WC
5. Estimate WACC
6. Calculate Terminal Value (Gordon Growth or Exit Multiple)
7. Discount to present value
8. Adjust: subtract net debt, add non-operating assets
9. Equity Value = Firm Value - Net Debt
10. Sensitivity analysis (WACC +/-1%, growth +/-1%)

### 2.3 WACC

```
WACC = (E/V) x Ke + (D/V) x Kd x (1 - T)

E = Market value of equity
D = Market value of debt
V = E + D
Ke = Cost of equity (via CAPM)
Kd = Effective cost of debt
T = Marginal tax rate
```

### 2.4 CAPM

```
Ke = Rf + Beta x (Rm - Rf) + CRP

Rf  = Risk-free rate (US 10Y Treasury or NTN-B in Brazil)
Beta = Systematic risk sensitivity
Rm - Rf = Equity Risk Premium (~5% US, ~8-9% EM per Damodaran)
CRP = Country Risk Premium (EMBI+ spread for Brazil)
```

**Brazil specifics:**
- Commonly use US Risk-Free + Country Risk Premium
- Alternative: NTN-B as local risk-free
- Beta calculated against Ibovespa or adjusted for global exposure

### 2.5 Valuation Multiples

| Multiple | Formula | When to Use |
|----------|---------|-------------|
| P/E | Price / EPS | Profitable, comparable companies |
| EV/EBITDA | Enterprise Value / EBITDA | Most versatile, capital-structure neutral |
| EV/Revenue | Enterprise Value / Revenue | Pre-profit growth companies |
| P/B | Price / Book Value | Banks, insurers, asset-heavy |
| P/FCF | Price / Free Cash Flow | Mature cash generators |

**Enterprise Value:**
```
EV = Market Cap + Gross Debt - Cash + Minority Interest + Preferred Stock
```

### 2.6 Real Options

| Type | Financial Analog | Example |
|------|-----------------|---------|
| Defer | American call | Wait for clarity before building plant |
| Expand | Call on underlying | Expand capacity if demand exceeds |
| Contract | Put on underlying | Reduce operations if market deteriorates |
| Abandon | American put | Abandon project and sell assets |
| Switch | Portfolio of options | Alternate between inputs or products |
| Stage | Compound option | Invest in phases, deciding at each stage |

### 2.7 Financial Model Best Practices (FAST Standard)

1. **Assumptions Sheet** -- all inputs in one place (blue font)
2. **Income Statement** -- projected P&L
3. **Balance Sheet** -- projected
4. **Cash Flow Statement** -- projected
5. **DCF / Valuation** -- assessment
6. **Sensitivity / Scenarios** -- Base / Bull / Bear
7. **Output / Summary** -- executive dashboard

Rules: one formula per row, left-to-right flow (history -> projections), no hardcoded numbers in formulas, integrity checks (Assets = Liabilities + Equity).

---

## 3. Cash Flow Management

### 3.1 Cash Flow Types

| Type | Content | Healthy Sign |
|------|---------|-------------|
| FCO (Operating) | Client receipts, supplier payments, salaries, taxes | Must be positive |
| FCI (Investing) | CAPEX, acquisitions, asset sales | Typically negative in growth |
| FCF (Financing) | Loans, equity, dividends, amortization | Source or use |

### 3.2 Free Cash Flow

**FCFF (to Firm):**
```
FCFF = EBIT x (1-T) + D&A - CAPEX - delta Working Capital
```

**FCFE (to Equity):**
```
FCFE = Net Income + D&A - CAPEX - delta WC - Debt Amortization + New Debt
```

### 3.3 Working Capital & Cash Conversion Cycle

```
CCC = DSO + DIO - DPO

DSO = Accounts Receivable / (Revenue/365)
DIO = Inventory / (COGS/365)
DPO = Accounts Payable / (COGS/365)
```

**Optimization levers:**

| Lever | Strategy | Impact |
|-------|----------|--------|
| Reduce DSO | Tighter credit policy, early payment discounts | Reduces CCC |
| Reduce DIO | JIT, demand forecasting, liquidate slow stock | Reduces CCC |
| Increase DPO | Negotiate longer terms, supply chain finance | Reduces CCC |

### 3.4 Cash Forecasting Methods

- **Direct (13-week rolling):** project specific receipts/payments weekly. High precision, short-term.
- **Indirect (12-24 months):** start from projected profit, adjust non-cash items. Medium-term planning.

### 3.5 Brazilian Treasury Instruments

| Instrument | Use |
|------------|-----|
| CDB | Invest excess cash |
| Compromissadas | Daily liquidity for treasury |
| Fundos DI | Short-term cash |
| Receivables Anticipation | Advance operating cash |
| Factoring / FIDC | Alternative to bank anticipation |
| Supply Chain Finance | Extend DPO without harming suppliers |
| Conta Garantida | Cover cash gaps |

---

## 4. Capital Budgeting

### 4.1 Project Evaluation Metrics

| Metric | Formula | Decision Rule | Limitations |
|--------|---------|--------------|-------------|
| NPV | SUM(FCF_t/(1+r)^t) - Investment | NPV > 0 -> Accept | Depends on discount rate |
| IRR | Rate where NPV = 0 | IRR > WACC -> Accept | Multiple IRRs possible |
| Payback | Time to recover investment | Payback < threshold | Ignores post-payback flows |
| Discounted Payback | Time to recover (discounted) | Similar | Still ignores post-payback |
| PI | PV of FCFs / Investment | PI > 1 -> Accept | Can conflict with NPV |
| MIRR | Modified IRR with realistic reinvestment | MIRR > WACC | Complex assumptions |
| ROIC | NOPAT / Capital Invested | ROIC > WACC -> Creates value | Point-in-time metric |

**NPV is the superior method** -- measures absolute value creation, no multiple-solution problems, additive across portfolio.

### 4.2 Analysis Techniques

| Technique | Description | Use Case |
|-----------|-------------|----------|
| Sensitivity | Vary one assumption at a time | Identify critical variables |
| Scenarios | Vary multiple assumptions (Base/Bull/Bear) | Evaluate outcome ranges |
| Monte Carlo | Simulation with probability distributions | Complex projects, high uncertainty |
| Break-even | Find point where NPV = 0 | Define minimum thresholds |
| Tornado Diagram | Visual sensitivity ranking | Stakeholder communication |

### 4.3 Monte Carlo Steps

1. Identify key variables (revenue, costs, growth rate, WACC)
2. Define probability distributions (normal, triangular, uniform)
3. Generate N simulations (typically 10,000+)
4. Calculate NPV/IRR for each
5. Analyze distribution (mean, std dev, percentiles)
6. Calculate P(NPV < 0)

---

## 5. Capital Structure & Funding

### 5.1 Modigliani-Miller Theorem

**Proposition I (no taxes):** Firm value is independent of capital structure.
```
V_levered = V_unlevered (in perfect markets)
```

**With taxes (real world):**
```
V_levered = V_unlevered + T x D (tax shield of debt)
```

Optimal point: marginal benefit of tax shield = marginal cost of financial distress.

### 5.2 Theories

| Theory | Proposition |
|--------|------------|
| Trade-Off (1973) | Optimal D/E balances tax shield vs. distress costs |
| Pecking Order (Myers 1984) | Firms prefer internal funds, then debt, then equity |
| Market Timing (Baker & Wurgler 2002) | Firms issue equity when overvalued |

### 5.3 Funding Sources

**Equity:**

| Source | Cost | When |
|--------|------|------|
| Retained Earnings | Ke (opportunity) | Always first (Pecking Order) |
| IPO | 15-25% of proceeds | Mature companies |
| Follow-on | 3-7% | Listed needing additional capital |
| Private Equity | IRR target 20-30% | Mature unlisted, turnaround |
| Venture Capital | IRR target 30-50% | Growth startups |

**Debt (Brazil):**

| Source | Typical Cost | When |
|--------|-------------|------|
| Debentures | CDI + 1-5% p.a. | Large companies with rating |
| CRI/CRA | CDI + 0.5-3% (IR exempt PF) | Real estate/agro backing |
| BNDES | TLP + spread | Investment projects |
| Working Capital Lines | CDI + 2-8% | Short-term needs |
| International Bonds | UST + 2-6% | Large companies with external access |
| Nota Comercial | CDI + 0.5-3% | Short-term, rated companies |

### 5.4 Leverage Metrics

| Metric | Formula | Threshold |
|--------|---------|-----------|
| Net Debt/EBITDA | (Gross Debt - Cash) / EBITDA | < 2.5x (investment grade) |
| D/E | Total Debt / Equity | Sector-dependent |
| Interest Coverage | EBIT / Interest Expense | > 3x (healthy) |
| DSCR | Operating CF / Debt Service | > 1.2x (covenants) |

### 5.5 Brazil Credit Rating (2026)

| Agency | Rating | Notes |
|--------|--------|-------|
| S&P | BB (stable) | Speculative, 2 notches below IG |
| Moody's | Ba1 (stable) | 1 notch below IG; upgraded from Ba2 Oct/2024, outlook changed to stable May/2025 |
| Fitch | BB (stable) | Upgrade unlikely before end-2026 |

---

## 6. Financial Markets & Instruments

### 6.1 Brazilian Fixed Income

| Security | Issuer | Return | Risk |
|----------|--------|--------|------|
| LFT (Tesouro Selic) | Federal Gov | Selic | Sovereign |
| LTN (Tesouro Prefixado) | Federal Gov | Fixed rate | Sovereign (market risk) |
| NTN-B (Tesouro IPCA+) | Federal Gov | IPCA + fixed | Sovereign (market risk) |
| CDB | Banks | CDI%, fixed or IPCA+ | Bank credit (FGC up to R$250k) |
| LCI/LCA | Banks | Similar to CDB, IR exempt PF | Bank credit (FGC) |
| Debentures | Companies | CDI+, IPCA+, fixed | Corporate credit |
| CRI/CRA | Securitizers | Similar, IR exempt PF | Structured credit |

### 6.2 Variable Income

| Instrument | Description |
|------------|-------------|
| ON shares | Common stock (voting rights) |
| PN shares | Preferred (minimum dividend) |
| BDRs | Brazilian Depositary Receipts (foreign stocks in Brazil) |
| ETFs | Index funds (BOVA11, IVVB11) |
| FIIs | Real estate investment funds |

### 6.3 Derivatives

| Instrument | Use |
|------------|-----|
| DI Future | Interest rate hedge/speculation |
| Dollar Future | FX hedge |
| Ibovespa Future | Portfolio hedge |
| Stock Options | Protection, leverage, strategies |
| Swap DI x Pre | Interest rate risk management |
| NDF | FX hedge without physical delivery |

### 6.4 Black-Scholes Model

```
Call = S x N(d1) - K x e^(-rT) x N(d2)
Put  = K x e^(-rT) x N(-d2) - S x N(-d1)

d1 = [ln(S/K) + (r + sigma^2/2) x T] / (sigma x sqrt(T))
d2 = d1 - sigma x sqrt(T)
```

**Greeks:**

| Greek | Measures |
|-------|----------|
| Delta | Price sensitivity to underlying |
| Gamma | Rate of change of delta |
| Theta | Time decay |
| Vega | Volatility sensitivity |
| Rho | Interest rate sensitivity |

---

## 7. Risk Management

### 7.1 Risk Categories

| Type | Description |
|------|-------------|
| Market | Adverse price movements (rates, FX, equity, commodities) |
| Credit | Counterparty default |
| Liquidity | Inability to meet obligations or sell assets |
| Operational | Process, people, systems, or external event failures |
| Model | Incorrect or miscalibrated models |
| Regulatory | Changes in regulation |
| Reputational | Brand/image damage |

### 7.2 Value at Risk (VaR)

```
VaR = Maximum expected loss in a time horizon, at a given confidence level

Example: VaR(95%, 1 day) = R$1M
-> 95% confidence that 1-day loss won't exceed R$1M
```

| Method | Advantage | Disadvantage |
|--------|-----------|-------------|
| Parametric | Fast, simple | Underestimates fat tails |
| Historical Simulation | No distribution assumption | Limited to observed history |
| Monte Carlo | Flexible, captures non-linearities | Computationally intensive |

**Limitations:** Does not say HOW MUCH beyond VaR (use CVaR/Expected Shortfall). Does not capture Black Swans well.

### 7.3 Hedging Instruments

| Risk | Hedge Instrument | Strategy |
|------|-----------------|----------|
| FX | NDF, dollar future, FX swap | Lock future exchange rate |
| Interest Rate | Swap DI x Pre, DI future | Convert floating to fixed |
| Commodities | Futures on B3/CME | Lock buy/sell price |
| Credit | CDS | Insurance against default |
| Inflation | NTN-B, swap IPCA x Pre | Protect against above-expected inflation |

### 7.4 Basel Framework

| Pillar | Focus |
|--------|-------|
| Pillar 1 | Minimum capital: credit + market + operational risk |
| Pillar 2 | Supervisory review: ICAAP, stress testing |
| Pillar 3 | Market discipline: public disclosure |

**Basel III minimums:** CET1 >= 4.5%, Tier 1 >= 6%, Total >= 8% + buffers (conservation 2.5%, countercyclical 0-2.5%, systemic 1-3.5%).

---

## 8. FP&A (Financial Planning & Analysis)

### 8.1 Planning Framework

```
Strategic Plan (3-5 years)
    |
    v
Annual Operating Plan (AOP)
    |
    v
Rolling Forecast (12-18 months, monthly updates)
    |
    v
Variance Analysis (Budget vs. Actual)
    |
    v
Reforecast / Adjustments
```

### 8.2 Budget Types

| Type | Description | Best For |
|------|-------------|----------|
| Traditional | Historical base + incremental | Stable environments |
| ZBB (Zero-Based) | Every expense justified from zero | Restructurings, cost cuts |
| Beyond Budgeting | No fixed budget, relative targets | Agile, decentralized orgs |
| Rolling Forecast | Continuous 12-18 month projection | Volatile environments |
| Activity-Based | Based on activities and cost drivers | Complex operations |

### 8.3 ZBB (Zero-Based Budgeting)

Popularized by Peter Pyhrr (Texas Instruments, 1969). Adopted by 3G Capital (Lemann, Telles, Sicupira) at AmBev, Burger King, Kraft Heinz.

1. **Decision packages** -- each activity has cost, benefit, alternatives
2. **Prioritization** -- packages ranked by benefit/cost
3. **Cut-off line** -- above: approved; below: cut
4. **Zero-based thinking** -- "If we didn't have this expense, would we create it today?"

### 8.4 Beyond Budgeting (12 Principles)

**6 Leadership:** Purpose, Values, Transparency, Organization (autonomous teams), Autonomy, Customer connection.

**6 Management:** Rhythm (dynamic not annual), Relative targets, Continuous plans, On-demand resources, Holistic evaluation, Shared rewards.

### 8.5 KPIs by Area

| Area | Key KPIs |
|------|----------|
| Revenue | Revenue Growth, MRR/ARR, ARPU, Churn, LTV |
| Profitability | Gross Margin, EBITDA Margin, Net Margin, ROE, ROIC |
| Liquidity | Current Ratio, Quick Ratio, Cash Burn Rate, Runway |
| Efficiency | CAC, LTV/CAC, Rule of 40, Revenue per Employee |
| Leverage | Net Debt/EBITDA, Interest Coverage, DSCR |
| Working Capital | DSO, DIO, DPO, CCC |

---

## 9. M&A (Mergers & Acquisitions)

### 9.1 Transaction Types

| Type | Description |
|------|-------------|
| Merger | Two companies combine into new entity |
| Acquisition | One company buys another |
| LBO | Acquisition primarily financed by debt |
| MBO | Management buys the company |
| Spin-off | Division separated as independent entity |
| Acqui-hire | Acquisition to capture talent |

### 9.2 M&A Process

```
1. Strategy     -> Define rationale (synergies, market, tech)
2. Screening    -> Identify and filter targets
3. Approach     -> Contact (NDA, teaser, CIM)
4. Due Diligence-> Deep analysis (financial, legal, tax, operational)
5. Valuation    -> Fair value (DCF, multiples, precedents)
6. Negotiation  -> Price, payment form, earn-outs, warranties
7. Structuring  -> Legal, tax, regulatory (CADE in Brazil)
8. Closing      -> Signing, conditions precedent, payment
9. PMI          -> Post-Merger Integration (most critical phase)
```

### 9.3 Synergies

| Type | Reliability |
|------|-------------|
| Cost Synergies | Most reliable -- eliminate redundancies, scale |
| Revenue Synergies | Less reliable -- cross-selling, new markets |
| Financial Synergies | Moderate -- lower cost of capital, tax benefits |

**Rule of thumb:** Sophisticated investors apply 30-50% haircut to projected synergies. 60-70% of acquisitions destroy value for the acquirer (McKinsey, BCG).

### 9.4 CADE (Brazilian Antitrust)

Mandatory notification if: one group revenue >= R$750M/year AND other >= R$75M/year.
Decisions: unconditional approval, approval with remedies, rejection.

### 9.5 Valuation Methods in M&A

| Method | Base |
|--------|------|
| DCF | Projected cash flow |
| Trading Multiples | EV/EBITDA, P/E of comparable listed companies |
| Transaction Multiples | Multiples paid in recent similar deals |
| LBO Analysis | IRR target for PE sponsor |
| Accretion/Dilution | EPS impact on acquirer |
| Sum of Parts | DCF or multiples per business unit |

---

## 10. FinTech & Financial Innovation

### 10.1 Brazilian FinTech Landscape

- 1,706 fintechs in operation (Distrito, 2025)
- Credit by fintechs: R$35.5B in 2024 (+68% YoY)
- 9 of 12 latam unicorn candidates are Brazilian (Omie, Tractian, Mottu, Flash, Celcoin)

### 10.2 PIX

- 890M+ registered keys (Nov/2025)
- ~6.7B transactions/month (2025); R$35.4T moved annually
- 24/7, settlement in seconds, free for individuals
- **PIX Automatico:** launched Jun/2025, mandatory since Oct/2025 for interbank debits
- **PIX NFC (Tap):** launched Feb/2025, Android via Google Pay (R$500/transaction limit)
- Record: 313M transactions in a single day (Dec/2025)

### 10.3 Open Finance Brazil

- 62M active consents (Jan/2025, +44% YoY)
- 2.3B+ successful API calls/week -- largest Open Finance ecosystem globally
- All 4 phases implemented (products, clients, payments, investments/insurance)
- **2026:** Credit portability via Open Finance (Feb/2026 personal; Aug/2026 federal payroll)

### 10.4 DREX (Digital Real)

- **Nov/2025 reformulation:** BCB ended original DLT pilot, removed payments capability
- **New focus:** liens/collateral (gravames) -- secure registration of assets used as guarantee
- **Next pilot (1H 2026):** BCB to define supporting technology
- **Status:** Uncertain future as payments CBDC; transformed into asset registration infrastructure

### 10.5 FinTech Segments

| Segment | Examples (Brazil) |
|---------|-------------------|
| Payments | Nubank, PagSeguro, Stone, Mercado Pago |
| Credit | Creditas, Nexoos |
| Investments | XP, Warren, Magnetis |
| Digital Banking | Nubank, C6 Bank, Inter |
| Insurtech | Pier, Justos, Clude |
| Regtech | idwall, Celcoin |
| Embedded Finance | Zoop, Dock, Matera |

### 10.6 AI in Finance

| Application | Maturity |
|-------------|----------|
| Credit Scoring (ML) | High |
| Fraud Detection (real-time) | High |
| Robo-Advisory | Medium-High |
| Algorithmic Trading | High (institutional) |
| NLP for Compliance | Medium |
| Risk Prediction Models | Medium-High |

---

## 11. Pricing Strategy & Revenue Management

### 11.1 Pricing Frameworks

| Framework | Approach | When |
|-----------|----------|------|
| Cost-Plus | Cost + desired margin | Commodities, government contracts |
| Value-Based | Customer perceived value | Differentiated products, SaaS, luxury |
| Competitive | Alignment with competitors | Commoditized markets |
| Dynamic | Price varies by demand/context | Airlines, hotels, e-commerce |
| Freemium | Free + premium paid | SaaS, apps, platforms |
| Penetration | Low price for market share | Competitive market launch |
| Skimming | High initial, reduced over time | Innovation, cutting-edge tech |
| Subscription | Recurring monthly/annual | SaaS, streaming |
| Usage-Based | Pay per use | Cloud (AWS), APIs, telecom |

**Impact:** 1% improvement in average price increases operating profit by ~11% (McKinsey).

### 11.2 Price Elasticity

```
E = (delta Q / Q) / (delta P / P)

E < -1: Elastic demand (price increase reduces revenue)
E > -1: Inelastic demand (price increase raises revenue)
E = -1: Unitary (maximum revenue)
```

### 11.3 Revenue & Pricing Metrics

| Metric | Formula | Context |
|--------|---------|---------|
| ARPU | Revenue / Users | SaaS, telecom |
| MRR | Monthly Recurring Revenue | SaaS |
| ARR | MRR x 12 | SaaS |
| Net Revenue Retention | End MRR (same cohort) / Start MRR | > 100% = expansion |
| LTV | ARPU x Gross Margin x (1/Churn) | Customer lifetime value |
| CAC | Sales+Marketing / New Customers | Acquisition cost |
| LTV/CAC | LTV / CAC | > 3x healthy |
| CAC Payback | CAC / (ARPU x Gross Margin) | Months to recover |

---

## 12. Financial Reporting & Analysis

### 12.1 Mandatory Statements (Brazil)

| Statement | Shows |
|-----------|-------|
| Balance Sheet (BP) | Financial position (snapshot) |
| Income Statement (DRE) | Period performance (movie) |
| Cash Flow Statement (DFC) | Cash movements by activity |
| Statement of Changes in Equity (DMPL) | Equity variations |
| Value Added Statement (DVA) | Wealth generated and distributed (open S/As) |
| Notes | Accounting policies and supplementary info |

### 12.2 IFRS 18 / CPC 51 -- New Income Statement (2027)

- Mandatory categories: Operating, Investing, Financing (similar to DFC structure)
- Management Performance Measures (MPMs): non-GAAP metrics must be reconciled
- Mandatory subtotals: operating profit and profit before financing
- **Effective:** Jan 1, 2027 (CVM Res. 237/238, Dec/2025); retrospective application required

### 12.3 Analysis Ratios

| Group | Key Ratios |
|-------|-----------|
| Liquidity | Current, Quick, Cash Ratio |
| Profitability | ROE, ROA, ROIC, Net Margin, EBITDA Margin |
| Activity | Asset Turnover, DSO, DIO, DPO, CCC |
| Leverage | D/E, Net Debt/EBITDA, Interest Coverage |
| Market | P/E, EV/EBITDA, P/B, Dividend Yield |

### 12.4 Earnings Quality Signals

| Red Flag | What to Investigate |
|----------|-------------------|
| Revenue growing faster than cash flow | Aggressive revenue recognition |
| A/R growing faster than revenue | Questionable sales, channel stuffing |
| Frequent accounting policy changes | Earnings management |
| Recurring "non-recurring" items | Items that repeat every quarter |
| High accruals | Large gap between profit and cash generated |

**Beneish M-Score:** M-Score > -1.78 indicates high manipulation probability. Uses 8 variables (DSRI, GMI, AQI, SGI, DEPI, SGAI, TATA, LVGI).

---

## 13. Taxation & Tax Planning (Financial View)

### 13.1 Brazilian Tax Regimes

| Regime | Annual Revenue | Taxation | For Whom |
|--------|---------------|----------|----------|
| MEI | Up to R$81K | Fixed monthly (~R$70) | Micro-entrepreneurs |
| Simples Nacional | Up to R$4.8M | Progressive table (4-33%) | Micro/small |
| Lucro Presumido | Up to R$78M | Presumed margin x rate | Services, commerce |
| Lucro Real | No limit (mandatory >R$78M) | Actual profit x 34% (IRPJ+CSLL) | Large companies |

### 13.2 Key Taxes

| Tax | Base | Rate | Financial Impact |
|-----|------|------|-----------------|
| IRPJ | Profit | 15% + 10% surcharge | Direct on NI and FCF |
| CSLL | Profit | 9% (20% financials) | Direct on NI and FCF |
| PIS/COFINS | Revenue | 3.65% (cumul.) or 9.25% (non-cumul.) | Pricing and margin |
| ICMS | Goods | 7-25% (varies by state) | Logistics, location, pricing |
| ISS | Services | 2-5% (varies by city) | Service margin |
| IOF | Financial ops | Varies | Financing cost |

### 13.3 Tax Reform 2026-2033

| New Tax | Replaces | Estimated Rate |
|---------|----------|---------------|
| CBS | PIS + COFINS (federal) | ~9.3% |
| IBS | ICMS + ISS (state/municipal) | ~18.7% |
| IS (Seletivo) | IPI (partial, harmful goods) | Variable |

**Combined estimated rate: ~28%** (one of the highest IVA rates globally; EU avg ~21%, OECD avg ~19%).

**Transition timeline:**

| Year | Event |
|------|-------|
| 2026 | Test: CBS 0.9% + IBS 0.1% on invoices (informational only, no collection) |
| 2027 | CBS effective (~8.8%). IS effective. PIS/COFINS extinguished |
| 2029-2032 | IBS gradual transition (ICMS/ISS reduced by tenths) |
| 2033 | ICMS/ISS extinguished. IBS fully effective |

**Financial impacts:**
- Two systems coexisting for 7 years (operational complexity)
- Broad non-cumulative credits (IBS more generous than current system)
- Complete repricing of products/services required
- Significant ERP/tax system investments needed
- State tax incentives (ICMS) phased out

### 13.4 Legitimate Tax Planning Strategies

| Strategy | Application |
|----------|-------------|
| Regime choice | Simulate Simples/Presumido/Real annually |
| JCP (Interest on Equity) | IRPJ/CSLL deductible for companies with high equity on Lucro Real |
| Tax incentives | Lei de Informatica, SUDENE/SUDAM, Zona Franca de Manaus |
| Accelerated depreciation | Anticipate tax benefit on CAPEX |
| Transfer pricing | Law 14.596/2023 (arm's length, OECD-aligned) |
| Family holding | Estate and succession planning |

---

## 14. Startups & Venture Capital

### 14.1 Brazilian VC Market

| Year | VC Investment | Deals | Notes |
|------|--------------|-------|-------|
| 2021 | ~US$9.4B (peak) | 700+ | Post-pandemic boom |
| 2023 | ~US$1.8B (winter) | ~228 | Cycle bottom |
| 2024 | ~US$2.3B (+17% YoY) | ~123 | Recovery with selectivity, higher ticket |
| 2025-26 | US$3-4B (est.) | Growing | Focus on AI, fintech, agtech |

### 14.2 Funding Rounds

| Round | Typical Investment | Typical Valuation | Key Metrics |
|-------|-------------------|-------------------|-------------|
| Pre-Seed | R$200K-1M | R$1-5M | Team, problem, TAM |
| Seed | R$1-5M | R$5-20M | MVP, early traction, unit economics |
| Series A | R$10-40M | R$40-150M | PMF, revenue growth, CAC/LTV |
| Series B | R$40-150M | R$150-500M | Scale, efficiency, path to profit |
| Series C+ | R$150M+ | R$500M+ | Market dominance, proven unit economics |

### 14.3 SaaS Startup Metrics

| Metric | Formula | Benchmark |
|--------|---------|-----------|
| MRR | Sum monthly subscriptions | >15% MoM growth (early) |
| ARR | MRR x 12 | US$1M ARR = milestone |
| Churn | Lost customers / Total | <5% monthly (SMB), <1% (Enterprise) |
| NRR | End MRR (cohort) / Start MRR | >120% excellent, >100% good |
| Gross Margin | (Revenue - COGS) / Revenue | >70% (healthy SaaS) |
| CAC Payback | CAC / (ARPA x Gross Margin) | <18 months |
| Rule of 40 | Growth% + EBITDA Margin% | >40% excellent |
| Burn Multiple | Net Burn / Net New ARR | <2x efficient |
| Runway | Cash / Monthly Burn | >18 months safe |
| Magic Number | Net New ARR / S&M (prior Q) | >0.75 efficient |

### 14.4 Unit Economics

```
LTV = ARPA x Gross Margin x (1 / Monthly Churn)
CAC = (Sales + Marketing Cost) / New Customers
Payback = CAC / (ARPA x Gross Margin)
LTV/CAC Target: > 3x
```

### 14.5 Cap Table & Dilution Example

```
Foundation:  Founders 100%
Pre-Seed:    Founders 85% | Angels 15%
Seed:        Founders 68% | Angels 12% | Seed VC 20%
Series A:    Founders 51% | Angels 9%  | Seed 15% | A 25%
Series B:    Founders 38% | Angels 7%  | Seed 11% | A 19% | B 25%
```

**Common instruments:** SAFE, Convertible Note, Preferred Stock, ESOP (10-15% pool).

### 14.6 Startup Valuation Methods

| Method | Stage | Base |
|--------|-------|------|
| Berkus | Pre-revenue | 5 qualitative factors, up to US$2M |
| Scorecard | Pre-revenue | Comparison with similar startups |
| Comparable Transactions | Seed/A | Multiples from recent similar deals |
| Revenue Multiple | Series A+ | ARR x sector multiple (5-30x for SaaS) |
| VC Method | Any | Terminal value / (1+IRR)^n |
| DCF | Growth/Late | FCF projection (high uncertainty) |

### 14.7 Key VCs in Brazil

| VC | Focus | Notable Deals |
|----|-------|---------------|
| Kaszek | Latam early-to-growth | Nubank, Creditas, Kavak |
| Monashees | Latam early-to-growth | 99, Rappi, Nuvemshop |
| SoftBank Latam | Growth | Gympass, MadeiraMadeira |
| QED Investors | FinTech | Nubank, Loft, Creditas |
| Valor Capital | Cross-border | Gympass, CloudWalk |
| Canary | Early stage Brazil | Alice, Caju, Clara |
| Maya Capital | Early stage Brazil | Pipefy, Cora |

---

## 15. Historical Timeline

| Year | Milestone |
|------|-----------|
| 1202 | Fibonacci introduces present value calculation |
| 1602 | VOC -- first publicly traded company |
| 1952 | Markowitz -- Modern Portfolio Theory |
| 1958 | Modigliani-Miller -- Capital Structure Irrelevance |
| 1964 | Sharpe -- CAPM |
| 1973 | Black-Scholes -- Options pricing model |
| 1976 | Brazil Law 6.404 (Corporations Act) |
| 1994 | Plano Real -- Brazilian monetary stabilization |
| 2000 | Novo Mercado (B3) -- corporate governance |
| 2008 | Global Financial Crisis |
| 2020 | PIX launched |
| 2023 | Tax Reform approved (EC 132/2023) |
| 2025 | DREX reformulated; PIX Automatico launched; PIX NFC operational |
| 2026 | CBS/IBS test phase; Open Finance credit portability |

---

## 16. Reference Books (Bibles by Sub-Area)

| Sub-Area | Book | Author |
|----------|------|--------|
| Corporate Finance | Principles of Corporate Finance | Brealey, Myers & Allen |
| Valuation | Investment Valuation | Aswath Damodaran |
| Valuation (praxis) | Valuation | McKinsey (Koller, Goedhart, Wessels) |
| Investment Banking | Investment Banking | Rosenbaum & Pearl |
| Derivatives | Options, Futures, and Other Derivatives | John Hull |
| Risk Management | Value at Risk | Philippe Jorion |
| Brazilian Market | Mercado Financeiro: Produtos e Servicos | Eduardo Fortuna |
| Financial Analysis | Financial Statement Analysis & Security Valuation | Stephen Penman |
| Behavioral Finance | Thinking, Fast and Slow | Daniel Kahneman |
| Value Investing | The Intelligent Investor | Benjamin Graham |
| M&A | Mergers, Acquisitions & Restructuring | DePamphilis |
| Venture Capital | Venture Deals | Brad Feld & Jason Mendelson |
| Pricing | Strategy and Tactics of Pricing | Nagle & Muller |
| FinTech | Bank 4.0 | Brett King |
| Brazilian Finance | Financas Corporativas e Valor | Alexandre Assaf Neto |
| 3G Capital / ZBB | Sonho Grande | Cristiane Correa |
| Risk | The Black Swan | Nassim Nicholas Taleb |
| Startups | The Lean Startup | Eric Ries |

---

## 17. Key People

### Academics

| Name | Contribution |
|------|-------------|
| Harry Markowitz | Modern Portfolio Theory (Nobel 1990) |
| William Sharpe | CAPM, Sharpe Ratio (Nobel 1990) |
| Modigliani & Miller | M&M Theorem (Nobel 1985/1990) |
| Black, Scholes, Merton | Options pricing (Nobel 1997) |
| Eugene Fama | Efficient Market Hypothesis (Nobel 2013) |
| Daniel Kahneman | Prospect Theory (Nobel 2002) |
| Aswath Damodaran | "Dean of Valuation" (NYU Stern) |
| Stephen Ross | APT, Risk-Neutral Pricing |

### Practitioners

| Name | Contribution |
|------|-------------|
| Benjamin Graham | Value investing pioneer |
| Warren Buffett | Applied value investing (Berkshire) |
| George Soros | Reflexivity theory (Quantum Fund) |
| Ray Dalio | Risk parity (Bridgewater) |
| John Bogle | Index investing (Vanguard) |
| Jim Simons | Quantitative trading (Renaissance) |

### Brazilian

| Name | Contribution |
|------|-------------|
| Jorge Paulo Lemann | 3G Capital, ZBB culture |
| David Velez | Nubank |
| Guilherme Benchimol | XP -- democratized investing |
| Roberto Campos Neto | BCB modernization, PIX, Open Finance (2019-2024) |
| Gabriel Galipolo | BCB president (2025-present), first Selic cut cycle |
| Alexandre Assaf Neto | Academic finance reference (FEA/USP) |

---

*Finance Master Reference v1.0 -- SINAPSE squad-finance knowledge base*
*Source: MS-013 Finance Research (2026-04-07)*
