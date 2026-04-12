---
task: create-cart-abandonment-sequence
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

# Task: Create Cart Abandonment Sequence

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** product catalog, checkout data, audience segments
- **Feeds:** persuasion-psychologist (Nudge), squad-growth

## Objetivo
Criar sequencia de recuperacao de carrinho abandonado que reconverte vendas perdidas — usando timing, personalizacao e persuasao progressiva para trazer o comprador de volta.

## Entrada
- Produto(s) no carrinho
- Stage de abandono (browse, add to cart, checkout)
- Dados do cliente (nome, historico)
- Taxa de abandono atual
- Benchmarks de recuperacao

## Passos

### 1. Sequencia por Timing
| Email | Timing | Objetivo | Tom |
|-------|--------|----------|-----|
| E1 | 1 hora | Lembrete suave | Helpful |
| E2 | 24 horas | Objecao handling | Empathetic |
| E3 | 48-72 horas | Incentivo | Generous |
| E4 | 5-7 dias | Ultimo recurso | Urgent |

### 2. Email 1 — O Lembrete (1 hora)
**Objetivo:** Recuperar quem esqueceu/foi interrompido

**Subject lines:**
- "Voce esqueceu algo 👋"
- "Seu carrinho esta esperando"
- "[Nome], ainda interessado?"

**Body:**
```
Oi [Nome],

Notamos que voce deixou [produto] no seu carrinho.

[IMAGEM DO PRODUTO]
[Nome do Produto]
[Preco]

Seu carrinho esta salvo e esperando por voce.

[CTA: Finalizar Minha Compra]

Se tiver alguma duvida, estamos aqui para ajudar.
[Link para suporte/FAQ]
```

**Tom:** Sem pressao. Helpful. Simples.

### 3. Email 2 — O Solucionador (24 horas)
**Objetivo:** Resolver a objecao que causou o abandono

**Subject lines:**
- "Alguma duvida sobre [produto]?"
- "Talvez isso ajude na sua decisao"
- "[Nome], posso ajudar?"

**Body:**
```
Oi [Nome],

[Produto] ainda esta reservado pra voce.

Muitas pessoas tem duvidas antes de finalizar.
Aqui estao as mais comuns:

❓ [Objecao 1]?
→ [Resposta tranquilizadora]

❓ [Objecao 2]?
→ [Resposta com prova]

❓ [Objecao 3]?
→ [Resposta + garantia]

💬 "[Testimonial curto de cliente que superou a mesma duvida]"
— [Nome], [Cargo]

[CTA: Finalizar Minha Compra]

PS: Nossa garantia de [X] dias significa que voce pode
experimentar sem risco.
```

**Tom:** Empatico. Antecipando e resolvendo objecoes.

### 4. Email 3 — O Incentivo (48-72 horas)
**Objetivo:** Adicionar valor/desconto para quebrar inercia

**Subject lines:**
- "Um presentinho para completar sua compra 🎁"
- "[X]% de desconto no seu carrinho"
- "Reservamos algo especial pra voce"

**Body:**
```
Oi [Nome],

[Produto] ainda esta no seu carrinho — e decidimos
facilitar sua decisao:

🎁 Use o codigo [CODIGO] para [X]% de desconto
⏰ Valido por [48h]

[IMAGEM DO PRODUTO]
[Preco original] → [Preco com desconto]
Economia: R$[valor]

[CTA: Usar Meu Desconto]

+ Frete gratis incluso
+ Garantia de [X] dias
+ [Bonus se aplicavel]

PS: Esse codigo expira em [data/hora].
```

**Tom:** Generoso. Sem desespero. Valor claro.

**NOTA:** Nem sempre oferecer desconto — pode criar habito.
Alternativas: frete gratis, bonus, extended trial, priority support.

### 5. Email 4 — Ultimo Recurso (5-7 dias)
**Objetivo:** Ultima tentativa + clean up

**Subject lines:**
- "Ultima chance: seu carrinho expira hoje"
- "Vamos remover [produto] do seu carrinho"
- "Fechando seu carrinho — ultimas horas"

**Body:**
```
Oi [Nome],

Queria avisar: seu carrinho com [produto] vai
expirar em [X] horas.

Entendemos que talvez nao seja o momento certo.
Mas se for, essa e sua ultima chance de garantir
[beneficio principal] + [desconto se oferecido no E3].

[CTA: Manter Meu Carrinho]

Ou se mudou de ideia, tudo bem.
Quando estiver pronto, estaremos aqui.

[Link para produtos similares — opcional]
```

**Tom:** Respeitoso. Sem pressao excessiva. Porta aberta.

### 6. Variantes por Segmento
| Segmento | Abordagem | Incentivo |
|----------|-----------|-----------|
| Cliente novo | Educacao + trust | Desconto primeiro pedido |
| Cliente recorrente | "Sentimos sua falta" | Loyalty points |
| Carrinho alto valor | White glove | Consultoria gratis |
| Carrinho baixo valor | Rapido e direto | Frete gratis |
| Abandoned checkout | Problema tecnico? | Suporte + simplificacao |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: squad-growth
    delivers: Sequencia para automacao e tracking
    format: Emails + triggers + metricas de recuperacao
  - to: squad-design
    delivers: Specs de personalizacao
    format: Variaveis dinamicas por email
```

## Saida
- 4 emails de recuperacao completos
- Subject lines com variantes (3 cada)
- Regras de timing e trigger
- Segmentacao definida
- Metricas-alvo (recovery rate, revenue recovered)

## Validacao
- [ ] 4 emails com progressao clara
- [ ] Timing otimizado (1h → 24h → 48h → 5d)
- [ ] Objecoes endereçadas no Email 2
- [ ] Incentivo nao destrutivo (nao cria habito de abandono)
- [ ] Imagem do produto em cada email
- [ ] CTA claro e especifico
- [ ] Segmentacao por tipo de cliente
- [ ] Tom respeitoso (nao desesperado)

---

*Task operada por: conversion-writer (Spark)*
