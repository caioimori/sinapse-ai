# Guia de Reconhecimento de Receita

> Principios de revenue recognition para negocios de servicos digitais. Modelos milestone-based, retainer, project-based e subscription.

---

## 1. Principio Fundamental

```
Receita deve ser reconhecida quando o servico e ENTREGUE, nao quando e FATURADO ou RECEBIDO.

Receita ≠ Faturamento ≠ Recebimento

Exemplo:
  Janeiro: contrato assinado, R$ 100K pago adiantado
  Fevereiro: 30% do projeto entregue
  Marco: 70% do projeto entregue

  Reconhecimento correto:
    Janeiro: R$ 0 (receita diferida: R$ 100K)
    Fevereiro: R$ 30K (receita diferida: R$ 70K)
    Marco: R$ 70K (receita diferida: R$ 0)
```

---

## 2. Modelos de Reconhecimento

### 2.1 Milestone-Based (Por Marco)

```
Aplicacao: Projetos com entregas definidas em marcos

Exemplo:
  Projeto: R$ 80.000, 4 milestones
  | Milestone | Peso | Valor | Reconhece Quando |
  |-----------|------|-------|------------------|
  | Discovery | 15% | R$ 12K | Entrega do brief |
  | Design | 30% | R$ 24K | Aprovacao do design |
  | Desenvolvimento | 40% | R$ 32K | Deploy em staging |
  | Launch | 15% | R$ 12K | Go-live |

Regra: reconhecer 100% do valor do milestone na data de entrega
Risco: se milestone atrasa, receita atrasa
```

### 2.2 Percentage of Completion (% Conclusao)

```
Aplicacao: Projetos longos com entrega continua

Formula:
  Receita_reconhecida = Valor_contrato × % Conclusao
  % Conclusao = Horas_gastas / Horas_estimadas
  OU: Story_points_entregues / Story_points_totais

Exemplo:
  Projeto R$ 120K, estimado em 400 horas
  Mes 1: 100 horas gastas → 25% → R$ 30K reconhecido
  Mes 2: 120 horas gastas → 55% → R$ 36K reconhecido (R$ 66K acumulado)
  Mes 3: 130 horas gastas → 87.5% → R$ 39K reconhecido
  Mes 4: 50 horas gastas → 100% → R$ 15K reconhecido

Risco: se estimativa de horas muda, % muda retroativamente
```

### 2.3 Time & Material (Horas)

```
Aplicacao: Alocacao de equipe, consultoria

Reconhecimento: mensal, com base nas horas efetivamente trabalhadas
  Receita_mes = Horas_trabalhadas × Rate_contratado

Mais simples de todos — receita = trabalho feito
```

### 2.4 Retainer (Mensal Fixo)

```
Aplicacao: Contratos mensais com valor fixo

Reconhecimento: linear, mes a mes
  Receita_mes = Valor_mensal_contrato

Questoes:
  - Horas nao usadas: reconhece mesmo assim (servico disponivel)
  - Horas excedentes: faturar separadamente como T&M
  - Reajuste: reconhecer novo valor a partir da data do reajuste
```

### 2.5 Subscription/SaaS

```
Aplicacao: Produtos digitais com assinatura

Reconhecimento: linear ao longo do periodo da assinatura
  Plano anual R$ 12.000 pago upfront:
  Reconhecimento: R$ 1.000/mes por 12 meses
  Receita diferida: R$ 12K no dia 1, reduz R$ 1K/mes

Setup fee: reconhecer quando setup e concluido (one-time)
```

---

## 3. Conceitos Chave

### Receita Diferida (Deferred Revenue)

```
Dinheiro RECEBIDO mas servico NAO entregue
Aparece como PASSIVO no balanco

Exemplo: cliente pagou R$ 50K adiantado, entregou R$ 20K
  Receita diferida = R$ 30K (devemos R$ 30K em servico)
```

### Receita Accrued (Accrued Revenue)

```
Servico ENTREGUE mas NAO faturado/recebido
Aparece como ATIVO no balanco

Exemplo: entregou R$ 40K em servicos, faturou R$ 25K
  Receita accrued = R$ 15K (nos devem R$ 15K)
```

### Reconciliacao Mensal

```
Para cada contrato, verificar:
  Valor_contratado (total)
  (-) Receita_reconhecida_acumulada
  = Receita_restante a reconhecer

  Receita_reconhecida_acumulada
  (-) Faturado_acumulado
  = Accrued (se positivo) ou Diferido (se negativo)

  Faturado_acumulado
  (-) Recebido_acumulado
  = Contas a Receber (AR)
```

---

## 4. Regras Praticas para Agencias

```
1. NUNCA reconhecer receita antes de entregar
2. SEMPRE alinhar reconhecimento com milestones do contrato
3. Faturar o mais rapido possivel apos entrega
4. Revisar reconhecimento mensalmente (reconciliar)
5. Separar receita de projeto (one-time) de receita recorrente
6. Documentar criterio de reconhecimento por tipo de contrato
7. Se houver duvida, ser conservador (reconhecer menos, nao mais)
```

---

## 5. Impacto no P&L

```
Receita reconhecida (NAO faturada) afeta:
  - P&L: receita do mes = reconhecida (nao faturada)
  - Cash flow: caixa = recebido (nao reconhecido)
  - P&L pode mostrar lucro enquanto caixa esta negativo (e vice-versa)

Por isso e CRITICO ter AMBAS as visoes:
  - P&L: baseado em competencia (reconhecimento)
  - Cash flow: baseado em caixa (recebimento)
```
