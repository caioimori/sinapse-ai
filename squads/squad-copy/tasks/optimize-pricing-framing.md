---
task: optimize-pricing-framing
responsavel: "@persuasion-psychologist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Optimize Pricing Framing

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** pricing strategy, oferta, audiencia
- **Feeds:** conversion-writer (Spark), copy-editor (Chisel)

## Objetivo
Otimizar como o preco e APRESENTADO (framing) — usando principios de pricing psychology para reduzir pain of paying e aumentar valor percebido sem alterar o preco real.

## Entrada
- Pricing atual (planos, precos, features)
- Audiencia e poder de compra
- Competitor pricing (para referencia)
- Formato de apresentacao atual

## Passos

### 1. Aplicar Anchoring (Ancoragem)
**Principio:** O primeiro numero que a pessoa ve influencia a percepcao de todos os seguintes.

**Tecnicas:**
- **Price anchor alto:** Mostrar valor total antes do preco real
  - "Valor: R$2.997 → Hoje: R$997"
- **Competitor anchor:** Comparar com custo de alternativa
  - "Contratar [profissional]: R$5.000/mes. [Produto]: R$197/mes"
- **Cost of inaction:** Quanto custa NAO resolver
  - "Voce perde R$X/mes sem [solucao]"
- **Per-unit breakdown:** Dividir por dia/uso
  - "Menos de R$3 por dia" (vs R$97/mes)

### 2. Reduzir Pain of Paying
**Principio (Kahneman):** Pagar dói. Reduzir a dor aumenta conversao.

**Tecnicas:**
- **Bundle:** Agrupar itens reduz percepção de multiplos pagamentos
- **Subscription framing:** "R$97/mes" dói menos que "R$1.164/ano"
- **Free trial:** Experimentar antes reduz risco percebido
- **Payment split:** "12x de R$83" vs "R$997"
- **Nao usar R$:** Remover simbolo de moeda em menus (restaurantes)
- **Charm pricing:** R$97 vs R$100 (mas testar — premium pode ser round numbers)

### 3. Aplicar Decoy Effect (Efeito Isca)
**Principio:** Uma opcao "isca" faz a opcao desejada parecer melhor.

**Estrutura classica de 3 planos:**
```
BASICO        | PROFISSIONAL (★)  | ENTERPRISE
R$47/mes      | R$97/mes          | R$297/mes
5 features    | 15 features       | Tudo + custom
              | MAIS POPULAR ←    |
```

**A isca:** O plano Basico existe para fazer o Profissional parecer melhor negocio.

**Regras:**
- O plano "isca" deve ser claramente inferior em valor
- O plano desejado deve ter melhor custo-beneficio
- Destacar o plano recomendado visualmente

### 4. Framing de Valor (nao de preco)
**Tecnicas de value framing:**

| Tecnica | Exemplo |
|---------|---------|
| ROI framing | "Gera R$X para cada R$1 investido" |
| Time saved | "Economize [X] horas/semana" |
| Cost comparison | "Custa menos que um cafe por dia" |
| Value stacking | "Voce recebe R$3.000+ em valor por R$297" |
| Opportunity cost | "Cada dia sem [produto] custa R$X" |
| Investment language | "Investimento" vs "custo" ou "gasto" |

### 5. Pricing Page Copy
**Elementos de uma pricing page persuasiva:**

```
1. HEADLINE DE VALOR (nao de preco)
   ❌ "Nossos Planos"
   ✅ "Encontre o plano ideal para [resultado]"

2. PLANOS LADO A LADO
   - Nomes que comunicam valor (nao "Plan 1, Plan 2")
   - Feature lists com ✅/❌
   - Plano recomendado destacado (badge + border)

3. SOCIAL PROOF POR PLANO
   "Escolha de [X]% dos clientes"

4. FAQ DE PRICING
   - "Posso trocar de plano?"
   - "Existe periodo de teste?"
   - "O que acontece se cancelar?"

5. GARANTIA
   - Visível proximo ao CTA
   - Especifica: "30 dias, sem perguntas"

6. CTA POR PLANO
   - Basico: "Comecar Gratis"
   - Pro: "Comecar Trial Gratis" (destaque)
   - Enterprise: "Falar com Vendas"
```

### 6. Ethical Pricing Guardrails
**PERMITIDO:**
- Anchoring com valores reais
- Decoy effect com planos genuinos
- Per-unit breakdown de precos reais
- Comparacao honesta com alternativas

**PROIBIDO:**
- Precos "de/por" com "de" inflado artificialmente
- Escassez falsa ("ultimas vagas" permanente)
- Fees escondidos revelados so no checkout
- Downsell agressivo que frustra o usuario

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Pricing copy otimizada
    format: Copy por plano + anchoring + value framing
  - to: squad-design
    delivers: Pricing page specs
    format: Layout recomendado + copy elements
```

## Saida
- Pricing framing strategy
- Anchoring copy (3 abordagens)
- Decoy structure definida
- Value framing copy
- Pricing page copy completa
- Ethical guardrails documentados

## Validacao
- [ ] Anchoring aplicado (valor antes do preco)
- [ ] Pain of paying reduzido
- [ ] Decoy effect estruturado (se 3+ planos)
- [ ] Value framing (nao price framing)
- [ ] Plano recomendado destacado
- [ ] Garantia visível
- [ ] FAQ de pricing inclusa
- [ ] Ethical guardrails respeitados

---

*Task operada por: persuasion-psychologist (Nudge)*
