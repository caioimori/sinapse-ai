# Financial Reporting & Analise de Demonstracoes

> Demonstracoes financeiras brasileiras, IFRS 18/CPC 51, analise vertical/horizontal, indicadores, qualidade dos lucros, Beneish M-Score.

---

## 1. Demonstracoes Financeiras Obrigatorias (Brasil — Lei 6.404/76)

| Demonstracao | Sigla | O Que Mostra | Analogia |
|-------------|-------|-------------|---------|
| **Balanco Patrimonial** | BP | Posicao patrimonial e financeira em uma data | Foto do patrimonio |
| **Demonstracao do Resultado** | DRE | Performance economica do periodo | Filme (fluxo de valor) |
| **Demonstracao de Fluxo de Caixa** | DFC | Movimentacao de caixa por atividade | Extrato bancario pro |
| **Demonstracao de Mutacao do PL** | DMPL | Variacoes no patrimonio liquido | Historico do PL |
| **Demonstracao de Valor Adicionado** | DVA | Riqueza gerada e sua distribuicao | Impacto economico |
| **Notas Explicativas** | NE | Politicas contabeis, detalhamento | Contexto e footnotes |

**DVA:** obrigatoria para companhias abertas (S/A) — mostra como a riqueza gerada foi distribuida entre trabalhadores, governo, credores e acionistas.

---

## 2. IFRS 18 / CPC 51 — Nova DRE (Vigencia: Jan/2027)

O IFRS 18 substitui o IAS 1 e traz mudancas significativas na apresentacao de demonstracoes:

### Novidades Principais

```
1. CATEGORIAS OBRIGATORIAS NA DRE:
   Operacional
   Investimento
   Financiamento
   Impostos de Renda
   Operacoes Descontinuadas

2. MANAGEMENT PERFORMANCE MEASURES (MPMs):
   Metricas nao-GAAP divulgadas pela empresa (ex: EBITDA ajustado)
   DEVEM ser conciliadas com GAAP equivalente na DRE
   Objetivo: mais transparencia sobre metricas alternativas

3. AGREGACAO E DESAGREGACAO:
   Baseada em utilidade para o usuario (nao em regras rigidas)
   Mais informacao granular quando material
```

**Impacto para empresas brasileiras:**
- Necessidade de revisar DRE para separar claramente categorias
- MPMs (EBITDA, Net Revenue ajustado) precisam de reconciliacao explicita
- Auditores vao exigir adequacao desde 2026 para implementacao em 2027

---

## 3. Estrutura da DRE (Formato Tipico Brasil)

```
RECEITA BRUTA
  (-) Deducoes: devoluções, abatimentos
  (-) Tributos sobre receita: ISS/PIS/COFINS (ou CBS/IBS a partir de 2027)
= RECEITA LIQUIDA (Receita Operacional Liquida)

  (-) COGS / CPV (Custo dos Produtos/Servicos Vendidos)
= LUCRO BRUTO
  Gross Margin = Lucro Bruto / Receita Liquida

  (-) DESPESAS OPERACIONAIS
    Despesas comerciais/vendas (S&M)
    Despesas gerais e administrativas (G&A)
    Pesquisa e desenvolvimento (R&D)
    (-/+) Outras receitas/despesas operacionais
= EBIT (Resultado Antes de Juros e Impostos)
  EBIT Margin = EBIT / Receita Liquida

  (+/-) Resultado Financeiro Liquido
    Receitas financeiras
    (-) Despesas financeiras (juros)
    (-/+) Variacao cambial
= EBT (Resultado Antes dos Impostos)

  (-) IRPJ e CSLL (34% no Lucro Real; ou IRRF em distribuicoes)
= LUCRO LIQUIDO
  Net Margin = Lucro Liquido / Receita Liquida

EBITDA = EBIT + D&A (nao e demonstracao oficial, mas metrica amplamente usada)
```

---

## 4. Estrutura do Balanco Patrimonial

```
ATIVO                              PASSIVO + PL
────────────────────────────────   ──────────────────────────────
ATIVO CIRCULANTE                   PASSIVO CIRCULANTE
  Caixa e equivalentes               Fornecedores (contas a pagar)
  Contas a receber (AR)              Salarios a pagar
  Estoques                           Impostos a recolher
  Outros ativos circulantes          Divida de curto prazo
                                     Adiantamentos de clientes
                                     Receita diferida (deferred revenue)

ATIVO NAO-CIRCULANTE               PASSIVO NAO-CIRCULANTE
  Realizavel a longo prazo           Divida de longo prazo
  Investimentos (participacoes)      Provisoes de longo prazo
  Imobilizado (PP&E)                 Imposto de renda diferido
  Intangivel (marcas, software)
  Goodwill                         PATRIMONIO LIQUIDO
                                     Capital social
                                     Reservas
                                     Lucros retidos
                                     Outros resultados abrangentes

TOTAL ATIVO = TOTAL PASSIVO + PL   (check de integridade — sempre)
```

---

## 5. Analise Vertical e Horizontal

### Analise Vertical

Cada item como % de uma base de referencia:

```
DRE:
  Base = Receita Liquida
  Gross Margin = Lucro Bruto / Receita Liquida
  EBITDA Margin = EBITDA / Receita Liquida

BP:
  Base = Ativo Total (ou Passivo+PL Total)
  Caixa / Total = liquidez
  Divida / Total = alavancagem
```

### Analise Horizontal

Variacao percentual ao longo do tempo:
```
Variacao = (Valor Atual - Valor Base) / Valor Base × 100%

CAGR (Compound Annual Growth Rate):
  CAGR = (Valor Final / Valor Inicial)^(1/n) - 1

Uso: crescimento de receita, EBITDA, caixa ao longo de 3-5 anos
```

---

## 6. Indicadores Financeiros por Grupo

### Liquidez

| Indicador | Formula | Bom | Alerta | Critico |
|-----------|---------|-----|--------|---------|
| **Current Ratio** | Ativo Circ / Passivo Circ | > 1.5 | 1.0-1.5 | < 1.0 |
| **Quick Ratio** | (Caixa + AR) / Passivo Circ | > 1.0 | 0.7-1.0 | < 0.7 |
| **Cash Ratio** | Caixa / Passivo Circ | > 0.5 | 0.2-0.5 | < 0.2 |

### Rentabilidade

| Indicador | Formula | Benchmark (BR) |
|-----------|---------|----------------|
| **Gross Margin** | Lucro Bruto / Receita | Varia por setor (SaaS: >70%; industria: 20-40%) |
| **EBITDA Margin** | EBITDA / Receita | Agencia: 15-25%; SaaS: 20-30% |
| **Net Margin** | Lucro Liquido / Receita | Varies by sector |
| **ROE** | Lucro Liquido / PL | >15% (bom); >20% (excelente) |
| **ROA** | Lucro Liquido / Ativos | >10% (bom) |
| **ROIC** | NOPAT / Capital Investido | ROIC > WACC = cria valor |

### Atividade (Eficiencia)

| Indicador | Formula | Referencia |
|-----------|---------|------------|
| **Giro do Ativo** | Receita / Ativos Totais | Maior = melhor |
| **DSO** | AR / (Receita/365) | < 45 dias (servicos) |
| **DIO** | Estoques / (COGS/365) | Varia por setor |
| **DPO** | Payables / (COGS/365) | > 30 dias (ideal > 45) |
| **CCC** | DSO + DIO - DPO | Menor = melhor (negativo = ideal) |

### Endividamento

| Indicador | Formula | Investment Grade |
|-----------|---------|-----------------|
| **Net Debt/EBITDA** | (Divida - Caixa) / EBITDA | < 2.5x |
| **Divida/PL (D/E)** | Divida Total / PL | Varia por setor |
| **Interest Coverage** | EBIT / Despesas Financeiras | > 3x |
| **DSCR** | FCO / Servico da Divida | > 1.2x |

### Multiplos de Mercado (para S/As abertas)

| Multiplo | Formula | Referencia |
|----------|---------|------------|
| **P/E** | Preco / LPA | 10-20x (BR); 20-30x (EUA) |
| **EV/EBITDA** | EV / EBITDA | 5-12x (BR); 10-20x (EUA) |
| **P/B** | Preco / VPA | 1-3x (normal); >3x (premium) |
| **Dividend Yield** | Dividendo / Preco | 4-8% (BR, atrativo por Selic alta) |

---

## 7. Qualidade dos Lucros (Earnings Quality)

A analise de qualidade dos lucros busca distinguir lucros sustentaveis de manipulacoes contabeis.

### Sinais de Alerta

| Sinal | O Que Investigar |
|-------|-----------------|
| Receita crescendo >> FCO | Reconhecimento agressivo de receita |
| AR crescendo >> Receita | Channel stuffing, vendas duvidosas |
| Mudancas frequentes de politicas contabeis | Earnings management |
| "Itens nao-recorrentes" recorrentes | Extraordinarios que se repetem todo trimestre |
| Accruals elevados (Lucro >> FCO) | Diferenca grande entre lucro e caixa |
| Goodwill crescendo sem aquisicoes | Capitalizacao de custos indevida |
| Depreciacao decrescente sem justificativa | Extensao de vida util de ativos |

### Analise de Accruals

```
Accruals totais = Lucro Liquido - FCO

Accruals > 0: lucro > caixa gerado (red flag)
Accruals < 0: caixa > lucro (sinal positivo)

Accruals altos podem indicar:
  - Reconhecimento antecipado de receita
  - Postergacao de despesas
  - Inventory build-up
```

---

## 8. Beneish M-Score — Deteccao de Manipulacao

Modelo estatistico desenvolvido por Messod Beneish (1999) para detectar manipulacao de resultados (earnings manipulation).

### Formula

```
M-Score = -4.84
  + 0.920 × DSRI
  + 0.528 × GMI
  + 0.404 × AQI
  + 0.892 × SGI
  + 0.115 × DEPI
  - 0.172 × SGAI
  + 4.679 × TATA
  - 0.327 × LVGI

Interpretacao:
  M-Score > -1.78: ALTA probabilidade de manipulacao (threshold original)
  M-Score > -2.22: POSSIVEL manipulacao (threshold mais conservador)
  M-Score < -2.22: Baixa probabilidade de manipulacao
```

### As 8 Variaveis

| Variavel | Formula | O Que Detecta |
|----------|---------|---------------|
| **DSRI** (Days Sales Receivables Index) | DSO_t / DSO_{t-1} | Crescimento de AR > receita |
| **GMI** (Gross Margin Index) | GM_{t-1} / GM_t | Deterioracao de margem bruta |
| **AQI** (Asset Quality Index) | (1 - (CA+PP&E)/TA)_t / (...)_{t-1} | Capitalizacao de custos em ativos |
| **SGI** (Sales Growth Index) | Receita_t / Receita_{t-1} | Pressao para crescer |
| **DEPI** (Depreciation Index) | Taxa Depreciacao_{t-1} / Taxa_t | Reducao de depreciacao para inflar lucro |
| **SGAI** (SGA Index) | SGA/Receita_t / (...)_{t-1} | Ineficiencia de despesas |
| **TATA** (Total Accruals to Total Assets) | (Net Income - FCO) / TA | Nível total de accruals |
| **LVGI** (Leverage Index) | Alavancagem_t / Alavancagem_{t-1} | Pressao da divida → incentivo a manipular |

**Casos historicos:** Enron, WorldCom, Americanas — todos com M-Score elevado antes dos escândalos.

---

## 9. Reconciliacao P&L vs. Caixa

Uma das analises mais importantes: entender POR QUE o lucro difere do caixa gerado:

```
Lucro Liquido
(+) D&A (nao-caixa)
(+/-) Variacao em Capital de Giro:
    (-) Aumento em AR (vendeu mas nao recebeu)
    (-) Aumento em Estoque (comprou mais)
    (+) Aumento em Contas a Pagar (deve mas nao pagou)
    (+/-) Outras variacoes de WC
(-) CAPEX (investimento)
(+) Aumento em Receita Diferida
(+/-) Outros ajustes
= Free Cash Flow (aprox.)

Se FCF << Lucro repetidamente: RED FLAG para qualidade dos lucros
```

---

## 10. SPED — Sistema Publico de Escrituracao Digital

No Brasil, grandes empresas entregam dados financeiros eletronicos ao fisco via SPED:

| Modulo | O Que E | Quem Entrega |
|--------|---------|-------------|
| **ECD** (Escrituracao Contabil Digital) | Balancete e balanco em formato digital | Lucro Real obrigatoriamente |
| **ECF** (Escrituracao Contabil Fiscal) | DIPJ digital — calculo IRPJ/CSLL | Lucro Real |
| **EFD ICMS/IPI** | Apuracao de ICMS e IPI | Contribuintes do ICMS/IPI |
| **EFD Contribuicoes** | Apuracao de PIS/COFINS | Lucro Real / Presumido |
| **NFe** | Nota Fiscal Eletronica | Todos os contribuintes |

---

## 11. Referencias

- **"Financial Statement Analysis and Security Valuation"** — Stephen Penman
- **"Financial Reporting and Analysis"** — Charles Gibson
- **"Quality of Earnings"** — Thornton O'Glove
- **"Analise das Demonstracoes Financeiras"** — Jose Carlos Marion (referencia brasileira)
- **CPC Online** — cpc.org.br (pronunciamentos contabeis brasileiros)
- **IFRS Foundation** — ifrs.org (IFRS 18, standards internacionais)
- **CVM** — cvm.gov.br (instrucoes para companhias abertas brasileiras)
