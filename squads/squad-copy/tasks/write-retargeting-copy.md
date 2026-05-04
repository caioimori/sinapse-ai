---
task: write-retargeting-copy
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

# Task: Write Retargeting Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** audience segments, ad platforms, original creative
- **Feeds:** squad-growth

## Objetivo
Escrever copy para campanhas de retargeting que reconverte visitantes que demonstraram interesse mas nao converteram — com mensagem personalizada por nivel de engajamento e motivo de abandono.

## Entrada
- Segmentos de retargeting (visitou LP, viu pricing, abandonou cart)
- Plataformas (Meta, Google Display, LinkedIn)
- Oferta original e variantes
- Tempo desde ultimo contato

## Passos

### 1. Segmentar por Nivel de Intencao
| Segmento | Intencao | Mensagem | Agressividade |
|----------|----------|----------|:-------------:|
| Visitou homepage | Baixa | Educacao + valor | Suave |
| Visitou produto | Media | Beneficios + social proof | Moderada |
| Visitou pricing | Alta | Oferta + objecao handler | Direta |
| Adicionou ao carrinho | Muito alta | Urgencia + incentivo | Alta |
| Iniciou checkout | Maxima | Recuperacao + suporte | Maxima |

### 2. Copy por Segmento

**Segmento: Visitou Homepage/Blog**
```
Ad Type: Awareness/Education
Copy: "[Insight valioso sobre topico que visitou]
       Descubra como [resultado] →"
CTA: "Saiba Mais"
Formato: Conteudo educativo, nao venda
```

**Segmento: Visitou Pagina de Produto**
```
Ad Type: Consideration
Copy: "[Nome do produto] ajuda [audiencia] a [resultado].
       [N]+ empresas ja usam. Veja por que →"
CTA: "Ver Demo"
Formato: Benefits + social proof
```

**Segmento: Visitou Pricing**
```
Ad Type: Decision
Copy: "Ainda avaliando [marca]?
       [Oferta especial ou comparativo]
       Clientes economizam [X]% em media →"
CTA: "Comecar Trial Gratis"
Formato: Oferta + comparacao + garantia
```

**Segmento: Abandonou Carrinho**
```
Ad Type: Recovery
Copy: "[Produto] esta esperando por voce 👋
       [Incentivo: X% off / frete gratis]
       ⏰ Oferta expira em [X] horas"
CTA: "Finalizar Compra"
Formato: Produto + incentivo + urgencia
```

**Segmento: Clientes Existentes (Upsell)**
```
Ad Type: Expansion
Copy: "Voce ama [produto A] — conheça [produto B]
       [X]% dos clientes usam os dois juntos.
       [Beneficio da combinacao] →"
CTA: "Descobrir"
Formato: Cross-sell natural
```

### 3. Frequencia e Fadiga
**Regras de frequencia:**
| Segmento | Freq. Max/Semana | Duracao Max | Rotacao |
|----------|:----------------:|:-----------:|:-------:|
| Homepage visitor | 3-4x | 14 dias | 3 criativos |
| Product page | 5-7x | 21 dias | 4 criativos |
| Pricing visitor | 7-10x | 30 dias | 5 criativos |
| Cart abandoner | 10-14x | 14 dias | 4 criativos |

**Rotacao de mensagem para evitar fadiga:**
```
Semana 1: Beneficio principal + social proof
Semana 2: Case study + resultado especifico
Semana 3: Oferta/incentivo + urgencia
Semana 4: Conteudo educativo (reset)
```

### 4. Sequencia de Messaging
**Progressao para cada segmento (criativos rotativos):**

**Criativo 1 — Reminder:**
"Lembra do [produto]? [Beneficio curto]"

**Criativo 2 — Social Proof:**
"[N]+ [audiencia] ja alcançaram [resultado] com [marca]"

**Criativo 3 — Objecao Handler:**
"Preocupado com [objecao]? [Resposta] + [Garantia]"

**Criativo 4 — Incentivo:**
"Oferta especial: [desconto/bonus] por tempo limitado"

**Criativo 5 — Testimonial:**
'"[Quote impactante]" — [Cliente, resultado]'

### 5. Exclusoes e Etica
**Excluir dos retargeting ads:**
- Quem ja converteu (criar audiencia de exclusao)
- Quem clicou "nao me mostre mais" (se possível)
- Menores de idade (compliance)
- Sensibilidade de produto (saude, financas — regras especificas)

**Praticas eticas:**
- Nao usar linguagem que revela tracking ("vimos que voce visitou...")
- Frequencia respeitosa (evitar sensacao de perseguicao)
- Conteudo relevante (nao generico)
- Opcao de opt-out respeitada

## Cross-Squad Handoff
```yaml
handoffs:
  - to: squad-growth
    delivers: Retargeting copy por segmento
    format: Copy + segmentos + frequencia + exclusoes
  - to: squad-design
    delivers: Pixel e evento specs
    format: Eventos de trigger por segmento
```

## Saida
- Copy por segmento de retargeting (5 segmentos)
- 3-5 criativos rotativos por segmento
- Regras de frequencia e duracao
- Sequencia de messaging (progressao)
- Lista de exclusoes

## Validacao
- [ ] Segmentacao por nivel de intencao
- [ ] Mensagem personalizada por segmento
- [ ] Frequencia respeitosa definida
- [ ] Rotacao de criativos para evitar fadiga
- [ ] Exclusoes configuradas (ja converteu, etc.)
- [ ] Praticas eticas seguidas
- [ ] Character limits respeitados por plataforma
- [ ] Progressao de messaging coerente

---

*Task operada por: conversion-writer (Spark)*
