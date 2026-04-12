---
task: analyze-payment-patterns
responsavel: "@revenue-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: payment_history
    tipo: object
    origem: "financeiro, billing"
    obrigatorio: true

Saida:
  - campo: payment_patterns_report
    tipo: document
    destino: "finance-orqx"

Checklist:
  - "[ ] Analisar prazo medio de pagamento por cliente"
  - "[ ] Identificar maus pagadores"
  - "[ ] Identificar bons pagadores"
  - "[ ] Recomendar acoes"
---

# Task: Analyze Payment Patterns

## Metadata
- **Agent:** revenue-analyst (Flow)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Analisar padroes de pagamento por cliente para prever comportamento e otimizar cobranca.

## Steps

1. **Prazo medio por cliente:**
   ```
   Para cada cliente:
   Prazo_medio = media(data_pagamento - data_vencimento)
   Negativo = paga antes do vencimento
   Positivo = paga com atraso
   ```
2. **Classificar clientes:**
   ```
   Excelente: paga antes do vencimento
   Bom: paga ate 5 dias apos
   Regular: paga 5-15 dias apos
   Ruim: paga 15-30 dias apos
   Critico: paga 30+ dias apos OU nao paga
   ```
3. **Correlacionar com tamanho do cliente** (grandes pagam mais devagar?)
4. **Tendencia por cliente** (melhorando ou piorando?)
5. **Recomendar acoes:**
   - Excelente: oferecer desconto early payment
   - Critico: exigir pagamento antecipado ou milestone

## Output
- Classificacao de clientes por comportamento de pagamento
- Prazo medio por cliente
- Tendencias
- Recomendacoes de politica de cobranca por perfil

## Quality Gates
- [ ] Pelo menos 3 faturas por cliente para padrao confiavel
- [ ] Classificacao consistente
- [ ] Acoes diferenciadas por perfil

## Quando Usar
- Review semestral de clientes
- Antes de renovacao de contrato
- Problemas recorrentes de caixa
