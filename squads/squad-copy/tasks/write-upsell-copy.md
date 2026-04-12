---
task: write-upsell-copy
responsavel: "@conversion-writer"
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

# Task: Write Upsell/Cross-sell Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** product catalog, customer data, pricing strategy
- **Feeds:** persuasion-psychologist (Nudge), squad-growth

## Objetivo
Escrever copy de upsell e cross-sell que aumenta valor medio do pedido — posicionando produtos adicionais como complemento natural da compra, nao como venda agressiva.

## Entrada
- Produto principal ja comprado/no carrinho
- Produtos complementares/upgrades disponíveis
- Pricing e margem
- Momento do upsell (pre-purchase, checkout, post-purchase)

## Passos

### 1. Definir Tipo de Oferta
| Tipo | Descricao | Momento | Sucesso Tipico |
|------|-----------|---------|:-------------:|
| Upsell | Versao melhor do mesmo produto | Pre/durante checkout | 10-30% |
| Cross-sell | Produto complementar | Checkout/pos-compra | 5-20% |
| Order bump | Adicional de baixo valor | Checkout | 20-40% |
| Downsell | Versao mais barata (se recusou upsell) | Pos-recusa | 15-25% |
| Bundle | Pacote com desconto | Pre/durante checkout | 10-25% |

### 2. Copy para Order Bump (Checkout)
**Formato:** Checkbox + 1-2 linhas no checkout

**Framework:**
```
☐ Sim! Adicionar [produto] por apenas R$[valor]
   [1 frase de beneficio]. [Economia: R$X vs comprar separado]
```

**Exemplos:**
- "☐ Sim! Adicionar Garantia Estendida por +R$29 — Protecao total por 2 anos"
- "☐ Adicionar [Template Pack] por +R$19 — 50 templates prontos (valor: R$97)"
- "☐ Quero o curso bonus por +R$47 — Aprenda [skill] em 2 horas (normalmente R$197)"

**Regras:**
- Valor < 50% do produto principal
- Beneficio em 1 frase
- Mostrar economia vs. comprar separado
- Pre-marcado = mais conversao (mas teste etica)

### 3. Copy para Upsell Page (Pos-Purchase)
**Estrutura da pagina de upsell:**

```
HEADLINE: "Espere! Oferta exclusiva para novos [clientes/membros]"

CONTEXTO: "Voce acabou de [acao]. Parabens!
           Antes de acessar, uma oportunidade unica:"

OFERTA: "[Produto upsell] — Normalmente R$[preco]
         Hoje, APENAS para voce: R$[preco especial]"

BENEFICIO: 3-5 bullets de como complementa a compra

URGENCIA: "Esta oferta so aparece UMA vez"

CTA: "Sim, Quero por R$[preco]!"

ANTI-CTA: "Nao obrigado, seguir para meu [produto original]"
```

**Tom:** Celebratorio → Oportunidade → Decisao

### 4. Copy para Cross-sell Email (Pos-Purchase)
**Timing:** 3-7 dias apos compra

**Framework:**
```
Subject: "Voce tem [produto] — agora complete com [complemento]"

Oi [Nome],

Como esta sendo sua experiencia com [produto comprado]?

Clientes que usam [produto] costumam ter resultados
[X]% melhores quando combinam com [cross-sell].

Aqui esta o porquê:

• [Beneficio 1 da combinacao]
• [Beneficio 2 da combinacao]
• [Resultado da combinacao]

"[Testimonial de quem usa ambos]"

Como voce ja e cliente, preparamos algo especial:
[Oferta exclusiva de cross-sell]

[CTA: Adicionar ao Meu Kit]

PS: [X]% dos nossos melhores clientes usam essa combinacao.
```

### 5. Copy para Downsell (Pos-Recusa)
**Quando o upsell e recusado, oferecer alternativa menor:**

```
"Entendemos que [upsell original] pode nao ser pra agora.

Que tal [versao menor/mais barata]?

✅ [Beneficio mantido]
✅ [Preco menor]
✅ [Risco menor]

Por apenas R$[preco menor]:

[CTA: Quero a Versao [Nome]]

[Anti-CTA: Nao obrigado, apenas minha compra original]"
```

### 6. Principios de Upsell Etico
**FAZER:**
- Genuinamente complementar a compra
- Preco justo e transparente
- Facil de recusar (anti-CTA claro)
- Timing respeitoso
- Personalizacao baseada em compra real

**NAO FAZER:**
- Criar FOMO falso
- Dificultar recusa (dark patterns)
- Oferecer algo irrelevante
- Pressao excessiva
- Upsell durante problemas do cliente (suporte)

## Cross-Squad Handoff
```yaml
handoffs:
  - to: persuasion-psychologist (Nudge)
    delivers: Upsell copy para review etico
    format: Copy completa com notas de intencao
  - to: squad-design
    delivers: Copy para implementacao no fluxo
    format: Copy por touchpoint + specs de trigger
```

## Saida
- Order bump copy (checkout)
- Upsell page copy (pos-purchase)
- Cross-sell email copy
- Downsell copy (pos-recusa)
- Regras de trigger/timing

## Validacao
- [ ] Oferta genuinamente complementar
- [ ] Preco justo e transparente
- [ ] Anti-CTA claro e facil
- [ ] Tom celebratorio/oportunidade (nao pressao)
- [ ] Personalizacao baseada em compra
- [ ] Timing respeitoso
- [ ] Etica verificada (sem dark patterns)
- [ ] Metricas-alvo definidas

---

*Task operada por: conversion-writer (Spark)*
