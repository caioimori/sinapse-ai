# Cash Flow Management

> Gestao de fluxo de caixa: free cash flow, capital de giro (CCC), 13-week forecast, instrumentos de captacao e aplicacao no contexto brasileiro.

---

## 1. O Fundamento

> "Revenue is vanity, profit is sanity, cash is reality."

Empresas nao quebram por falta de lucro contabil — quebram por falta de caixa. O P&L pode mostrar lucro enquanto o caixa e negativo (e vice-versa). Por isso as duas visoes sao obrigatorias:
- **P&L (competencia):** reconhecimento de receita e despesa quando ocorrem
- **Cash Flow (caixa):** quando o dinheiro efetivamente entra e sai

---

## 2. Tipos de Fluxo de Caixa

| Tipo | O Que Inclui | Sinal Esperado |
|------|-------------|----------------|
| **FCO** (Operacional) | Recebimentos de clientes, pagamentos a fornecedores, salarios, impostos | Positivo (core business saudavel) |
| **FCI** (Investimento) | CAPEX, aquisicoes, venda de ativos | Negativo em crescimento (investindo no futuro) |
| **FCF** (Financiamento) | Emprestimos, emissao de acoes, dividendos, amortizacoes | Varia conforme fase da empresa |

---

## 3. Free Cash Flow (FCF)

### FCFF — Free Cash Flow to Firm

```
FCFF = EBIT × (1-T) + D&A - CAPEX - Δ Working Capital

Tambem calculado como:
FCFF = EBITDA × (1-T) + T × D&A - CAPEX - Δ Working Capital
```

### FCFE — Free Cash Flow to Equity

```
FCFE = Net Income + D&A - CAPEX - Δ Working Capital - Amortizacao de Divida + Nova Divida
```

**FCFF vs FCFE:**
- FCFF: caixa disponivel para TODOS os provedores de capital (credores + acionistas) — descontado pelo WACC
- FCFE: caixa disponivel APENAS para acionistas — descontado pelo Ke (custo do equity)

---

## 4. Gestao de Capital de Giro

### Ciclo de Conversao de Caixa (CCC)

```
CCC = DSO + DIO - DPO

DSO (Days Sales Outstanding) = Contas a Receber / (Receita/365)
DIO (Days Inventory Outstanding) = Estoques / (COGS/365)
DPO (Days Payable Outstanding) = Contas a Pagar / (COGS/365)
```

**Objetivo:** Minimizar o CCC — receber rapido, girar estoque rapido, pagar o mais tarde possivel.

**CCC Negativo** = a empresa financia seus clientes com dinheiro dos fornecedores (Amazon, Mercado Livre, grandes varejistas). E o modelo ideal.

### Alavancas de Otimizacao do CCC

| Alavanca | Estrategia | Impacto |
|----------|-----------|---------|
| **Reduzir DSO** | Desconto por antecipacao (2/10 net 30), cobranca ativa, antecipacao de recebiveis, credito mais rigido | Libera caixa imediato |
| **Reduzir DIO** | Just-in-time, previsao de demanda, liquidacao de estoque obsoleto, consignacao | Libera capital de giro |
| **Aumentar DPO** | Negociar prazos maiores, supply chain finance, rebates por volume | Financia operacao com capital de fornecedores |

### Capital de Giro Liquido (CGL)

```
CGL = Ativo Circulante Operacional - Passivo Circulante Operacional
    = (Contas a Receber + Estoques) - (Contas a Pagar + Adiantamentos de Clientes)

Necessidade de Capital de Giro (NCG) = CGL
Se NCG > 0: empresa precisa financiar seu ciclo operacional
Se NCG < 0: empresa e "financiada" pelo ciclo operacional (modelo Asset-Light ideal)
```

---

## 5. Cash Flow Forecasting

### 13-Week Rolling Forecast (Metodo Direto)

O metodo mais preciso para gestao de liquidez de curto prazo. Projeta recebimentos e pagamentos semana a semana.

```
ESTRUTURA SEMANAL:

RECEBIMENTOS (+):
  + Clientes — por vencimento de duplicata/boleto
  + Antecipacoes de recebiveis previstas
  + Outros recebimentos (venda de ativo, dividendos)

PAGAMENTOS (-):
  - Folha de pagamento (data certa)
  - Fornecedores — por vencimento
  - Impostos (por competencia e vencimento)
  - Servicos recorrentes (SaaS, aluguel, etc.)
  - CAPEX planejado
  - Servico da divida (amortizacao + juros)

SALDO LIQUIDO DA SEMANA = Recebimentos - Pagamentos
SALDO ACUMULADO = Saldo anterior + Saldo da semana

INDICADORES DE ALERTA:
  Saldo negativo em qualquer semana = acao imediata
  Saldo < Saldo_minimo (reserva) = alerta amarelo
```

**Regras do 13-Week Forecast:**
1. Atualizar toda semana (rolling — sempre 13 semanas a frente)
2. Semana 1-4: alta confianca (baseado em vencimentos reais)
3. Semana 5-9: media confianca (baseado em contratos + historico)
4. Semana 10-13: baixa confianca (projecao estatistica)
5. Gatilhos de atualizacao extraordinaria: nova linha de credito, perda de cliente > 10%, evento macro

### Metodo Indireto (12-24 meses)

```
Lucro Liquido Projetado
(+) Adicionar de volta: D&A, amortizacao de goodwill
(-) CAPEX
(-) Aumento em Capital de Giro
(+) Aumento em Divida Liquida (se planejado)
= Free Cash Flow to Equity (projetado)
```

---

## 6. Instrumentos de Gestao de Caixa no Brasil

### Aplicacao de Caixa Excedente

| Instrumento | Retorno Tipico (2026) | Liquidez | Risco |
|-------------|----------------------|----------|-------|
| **LFT (Tesouro Selic)** | Selic (~14,75% a.a.) | Diaria (D+1) | Soberano |
| **Fundos DI** | CDI - 0.1 a 0.3% | D+0 a D+1 | Baixo (credito gestora) |
| **CDB** | CDI 95-105% | D+0 a D+90+ | FGC ate R$250k/CPF/banco |
| **Compromissadas** | CDI | Intraday | Baixo (lastro titulos publicos) |
| **LCI/LCA** | CDI 85-95% (equivalente bruto isentos) | D+90 minimo | FGC ate R$250k |

**Regra de ouro:** Caixa de giro → Fundos DI / Compromissadas (D+0). Reserva estrategica → CDB/LCI de maior prazo.

### Captacao de Caixa (Necessidade de Curto Prazo)

| Instrumento | Custo Tipico (2026) | Prazo | Quando Usar |
|-------------|---------------------|-------|-------------|
| **Antecipacao de Recebiveis (duplicatas)** | CDI + 1-3% a.m. | 30-120 dias | Gap temporario de caixa |
| **Antecipacao de Cartao** | CDI + 1.5-4% a.m. | 30-180 dias | E-commerce, varejo |
| **Conta Garantida** | CDI + 2-5% a.m. | Rotativo | Cobertura de picos |
| **FIDC** | CDI + 0.5-2% a.a. | 30-360 dias | Grandes empresas com volume |
| **Factoring** | 2-5% a.m. | 30-90 dias | Alternativa a bancos (custo maior) |
| **Supply Chain Finance** | CDI + 0.5-2% | 30-120 dias | Dar prazo a fornecedor sem custo operacional |

### PIX e Gestao de Caixa (2026)

- PIX Automatico (lancado jun/2025): substituiu debito automatico para recorrencias — reduz inadimplencia e melhora previsibilidade do fluxo
- Antecipacao via FIDC/SCF integrada ao PIX ja disponivel em bancos digitais
- Open Finance permite portabilidade de limites de credito entre instituicoes (fev/2026)

---

## 7. Indicadores de Saude de Caixa

| Indicador | Formula | Saudavel | Alerta | Critico |
|-----------|---------|----------|--------|---------|
| **Runway** | Caixa / Burn Rate Mensal | > 12 meses | 6-12 meses | < 6 meses |
| **Cash Ratio** | Caixa / Passivo Circulante | > 0.5 | 0.2-0.5 | < 0.2 |
| **Quick Ratio** | (Caixa + AR) / Passivo Circulante | > 1.0 | 0.7-1.0 | < 0.7 |
| **Current Ratio** | Ativo Circulante / Passivo Circulante | > 1.5 | 1.0-1.5 | < 1.0 |
| **FCO / Lucro Liquido** | FCO / NI | > 1.0 (caixa > lucro) | 0.5-1.0 | < 0.5 (alerta de accruals) |

---

## 8. Sinais de Alerta de Problema de Caixa

```
SINAIS DE ALERTA PRECOCE:
  DSO crescendo mais rapido que receita
  Estoque crescendo sem crescimento de receita proporcional
  Contas a pagar atrasadas (DPO aumentando involuntariamente)
  FCO negativo enquanto lucro e positivo (accruals elevados)
  Caixa menor que 2 meses de despesas fixas
  Linhas de credito proximas do limite

ACOES IMEDIATAS:
  1. Acionar 13-week forecast para visibilidade detalhada
  2. Priorizar cobr anca de maiores vencidos
  3. Negociar prazo com fornecedores estrategicos
  4. Avaliar antecipacao de recebiveis
  5. Comunicar proativamente credores (antes de atrasar)
  6. Revisar CAPEX — adiar nao-essenciais
```

---

## 9. Aplicacao pelo Squad Finance

1. Construir e manter 13-week forecast atualizado semanalmente
2. Calcular CCC mensalmente e identificar piores gargalos
3. Alertar quando runway < 6 meses ou saldo projetado negativo
4. Recomendar mix de instrumentos de aplicacao por perfil de risco e liquidez
5. Monitorar FCO/Lucro como indicador de qualidade de lucros
6. Simular impacto de grandes movimentacoes (novo cliente, CAPEX, dividendos)

---

## 10. Referencias

- **"Financial Intelligence"** — Karen Berman & Joe Knight
- **"Corporate Finance"** — Berk & DeMarzo (caps. working capital)
- **"Mercado Financeiro: Produtos e Servicos"** — Eduardo Fortuna (instrumentos BR)
- **BCB** — bc.gov.br (PIX, Open Finance, dados monetarios)
