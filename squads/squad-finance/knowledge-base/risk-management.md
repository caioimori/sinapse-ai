# Risk Management — Gestao de Riscos Financeiros

> VaR, CVaR, estrategias de hedge, Basel III, categorias de risco corporativo, frameworks COSO ERM. Contexto brasileiro de derivativos e protecao cambial.

---

## 1. Framework de Gestao de Riscos

O framework mais adotado e o **COSO ERM** (Committee of Sponsoring Organizations — Enterprise Risk Management, atualizado 2017). Estrutura em 5 componentes:

1. **Governance & Culture** — tone at the top, estrutura de risco
2. **Strategy & Objective-Setting** — apetite a risco integrado a estrategia
3. **Performance** — identificacao e avaliacao de riscos
4. **Review & Revision** — monitoramento continuo
5. **Information & Communication** — transparencia e reporting

---

## 2. Categorias de Risco Financeiro

| Tipo | Descricao | Exemplo |
|------|-----------|---------|
| **Risco de Mercado** | Movimentos adversos de precos | Variacao de juros, cambio, acoes, commodities |
| **Risco de Credito** | Inadimplencia de contraparte | Cliente nao paga; banco de derivativo falha |
| **Risco de Liquidez** | Incapacidade de honrar obrigacoes sem perda | Empresa nao consegue rolar divida |
| **Risco Operacional** | Falha de processos, pessoas, sistemas | Fraude, erro de TI, desastre natural |
| **Risco de Modelo** | Uso de modelos incorretos | Credito score subestima inadimplencia |
| **Risco Regulatorio** | Mudancas em regulacao | Nova regra tributaria, politica monetaria |
| **Risco de Reputacao** | Dano a imagem | Escandalo, falha de compliance |
| **Risco de Concentracao** | Dependencia excessiva de poucos | 1 cliente = 40% da receita |

---

## 3. Value at Risk (VaR)

### Conceito

```
VaR(confianca, horizonte) = Perda maxima esperada em um horizonte de tempo,
                             com dado nivel de confianca

Exemplo: VaR(95%, 1 dia) = R$ 1 milhao
→ "Com 95% de confianca, a perda maxima em 1 dia nao excedera R$ 1 milhao"
→ Em 5% dos dias, a perda PODE exceder R$ 1 milhao
```

### Metodos de Calculo

| Metodo | Descricao | Vantagem | Desvantagem |
|--------|-----------|----------|-------------|
| **Parametrico (Delta-Normal)** | Assume distribuicao normal | Rapido, analitico | Subestima caudas gordas (fat tails) |
| **Simulacao Historica** | Usa retornos historicos reais | Nao assume distribuicao; captura eventos reais | Limitado ao historico observado; lento para detectar mudancas |
| **Monte Carlo** | Simula cenarios com distribuicoes calibradas | Flexivel; captura nao-linearidades | Computacionalmente intensivo |

### CVaR / Expected Shortfall

O VaR nao diz QUANTO se perde alem do VaR. O CVaR resolve isso:

```
CVaR(95%) = Media das perdas que excedem o VaR(95%)
→ "Nas piores 5% das situacoes, a perda media e R$ X"

CVaR e mais conservador e informativo que VaR.
Preferido por reguladores pos-Basileia III.
```

### Limitacoes do VaR (Nassim Taleb)

- Assume que o passado preve o futuro
- Nao captura Black Swans (eventos extremos imprevistos)
- Pode criar falsa sensacao de seguranca
- Modelos parametricos subestimam caudas gordas

---

## 4. Stress Testing

Complementa o VaR simulando cenarios extremos:

```
Cenarios tipicos de stress:
  - Crise de liquidez (2008-style): SELIC +5pp, USD/BRL +40%, Ibovespa -50%
  - Recessao severa: PIB -3%, inadimplencia +100%, margem -5pp
  - Hiperinflacao: IPCA 20%, custos +25%, receita real -10%
  - Escandalo corporativo: queda de 40% no valor da empresa
  - Cyber attack: interrupcao de 2 semanas das operacoes
```

---

## 5. Hedge — Instrumentos e Estrategias

### No Brasil (Derivativos B3 e OTC)

| Risco | Instrumento | Estrategia | Custo |
|-------|-------------|-----------|-------|
| **Cambial (empresa importa/tem divida em USD)** | NDF (Non-Deliverable Forward), Futuro USD/BRL B3, Opcoes, Swap Cambial BCB | Travar cotacao futura | NDF/Futuro: custo = diferencial de juros (BRL-USD) |
| **Taxa de juros (divida CDI, quer prefixar)** | Swap DI x Pre, Futuro de DI B3, Opcoes IDI | Trocar CDI por taxa fixa | Custo = diferencial de taxa |
| **Commodities (agronegocio, industria)** | Futuros B3 (boi, milho, cafe, etanol), CME | Travar preco de venda/compra | Custo de base e marking-to-market |
| **Credito (risco de inadimplencia)** | CDS (Credit Default Swap) — mercado limitado no BR | Seguro contra default | Premio do CDS |
| **Inflacao (IPCA)** | NTN-B, Swap IPCA x Pre | Proteger contra inflacao acima do esperado | Custo = diferencial NTN-B vs Pre |

### Principios de Hedge

```
1. DEFINIR objetivo: hedge de resultado (P&L) ou de fluxo de caixa?
2. QUANTIFICAR a exposicao: valor nocional, prazo, moeda
3. SELECIONAR instrumento: custo, liquidez, eficiencia do hedge
4. MONITORAR: marcar a mercado periodicamente
5. DOCUMENTAR: hedge accounting requer documentacao (IFRS 9)
```

### Hedge Ratio

```
Hedge Ratio = Variacao no Valor do Ativo / Variacao no Valor do Hedge

HR = 1.0: hedge perfeito (raro na pratica)
HR < 1.0: subhedge (exposicao parcial remanescente)
HR > 1.0: overhedge (posicao especulativa involuntaria)
```

---

## 6. Gestao de Risco de Credito

### Politica de Credito

```
ANALISE 5 Cs DE CREDITO:
  Character: historico de pagamentos, reputacao
  Capacity: fluxo de caixa para pagar
  Capital: patrimonio, alavancagem
  Collateral: garantias disponiveis
  Conditions: contexto economico, setor

MODELOS DE SCORING:
  - Statistical: regressao logistica, discriminante
  - Machine Learning: random forest, gradient boosting, redes neurais
  - Altman Z-Score (empresas abertas):
    Z = 1.2*X1 + 1.4*X2 + 3.3*X3 + 0.6*X4 + 1.0*X5
    X1=WC/Assets, X2=RE/Assets, X3=EBIT/Assets, X4=MktCap/Liabilities, X5=Sales/Assets
    Z > 2.99: baixo risco; Z < 1.81: alto risco de falencia
```

### Metricas de Risco de Credito

| Metrica | Formula | Saudavel |
|---------|---------|----------|
| **PD** (Probability of Default) | % de devedores que default | < 2% (investment grade) |
| **LGD** (Loss Given Default) | Perda em caso de default (%) | Depende de garantia |
| **EAD** (Exposure at Default) | Valor exposto no momento do default | Monitorar por contraparte |
| **Expected Loss** | PD × LGD × EAD | Deve ser coberto pelo spread |
| **DSO** | Contas a Receber / (Receita/365) | < 45 dias (agencias) |
| **Aging Bucket** | % da AR por vencimento | > 90 dias < 5% da AR |

---

## 7. Basileia III — Regulacao Bancaria Internacional

| Pilar | Foco | Exigencia |
|-------|------|-----------|
| **Pilar 1** | Capital minimo | Risco de credito + mercado + operacional |
| **Pilar 2** | Supervisao prudencial | ICAAP, stress testing, ORSA |
| **Pilar 3** | Disciplina de mercado | Divulgacao publica de riscos e capital |

**Ratios de Capital Basileia III:**

```
CET1 (Common Equity Tier 1) >= 4.5%
Tier 1 >= 6.0%
Capital Total >= 8.0%
+ Conservation Buffer: 2.5%
+ Countercyclical Buffer: 0-2.5%
+ Systemic Buffer (G-SIBs): 1-3.5%

Total maximo exigido (G-SIB): 19.5%
```

**No Brasil (BACEN):** implementou Basileia III apos 2013, com cronograma proprio. Bancos brasileiros tipicamente operam com CET1 de 11-14%, acima do minimo regulatorio.

---

## 8. Gestao de Risco para Empresas Nao-Financeiras

Para empresas fora do setor financeiro, o foco principal e:

### Risk Register Simplificado

```
| Risco | Probabilidade | Impacto | Score | Mitigacao | Owner |
|-------|--------------|---------|-------|-----------|-------|
| Perda maior cliente (>20% receita) | Media | Alto | 9 | Diversificacao, contratos plurianuais | CEO |
| Variacao cambial +20% (empresa importa) | Alta | Medio | 8 | Hedge NDF 6 meses | CFO |
| Aumento Selic +3pp (divida CDI) | Media | Alto | 9 | Swap CDI x Pre | CFO |
| Concentracao em 1 banco | Baixa | Alto | 6 | Relacionamento multiplo | Financeiro |
| Fraude interna | Baixa | Muito Alto | 8 | Controles, segregacao, auditoria | CFO |
```

### ERM para PMEs

```
Risco aceitavel: score <= 4
Risco que exige monitoramento: score 5-8
Risco que exige mitigacao: score > 8

Revisao semestral do risk register
Reporting ao board/acionistas anualmente
```

---

## 9. Risco Especifico do Brasil

| Risco | Descricao | Como Mitigar |
|-------|-----------|-------------|
| **Risco Selic** | Custo de capital variavel (CDI) | Swap ou prefixar parte da divida |
| **Risco Cambial** | BRL volatil | Hedge para exposicao > 30 dias |
| **Risco Tributario** | Mudancas regulatorias frequentes | Monitorar, planejamento tributario, compliance |
| **Risco Judicial** | Passivo trabalhista/fiscal elevado | Provisoes adequadas, gestao preventiva |
| **Risco Macroeconomico** | Ciclicidade economica acentuada | Estrutura de custo flexivel, caixa conservador |
| **Risco Politico** | Incerteza regulatoria e fiscal | Diversificacao geografica, monitoramento |

---

## 10. Referencias

- **"Risk Management and Financial Institutions"** — John Hull
- **"Value at Risk"** — Philippe Jorion (biblia do VaR)
- **"The Black Swan"** — Nassim Nicholas Taleb
- **"Against the Gods: The Remarkable Story of Risk"** — Peter Bernstein
- **COSO ERM 2017** — coso.org (framework de gestao de riscos)
- **BACEN** — bc.gov.br (circular 3.648, resolucao 4.557 — risco bancario BR)
