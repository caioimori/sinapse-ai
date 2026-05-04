---
task: craft-cta-variations
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

# Task: Craft CTA Variations

## Metadata
- **Squad:** squad-copy
- **Agent:** conversion-writer (Spark)
- **Complexity:** STANDARD
- **Depends on:** copy brief, oferta, awareness level
- **Feeds:** todos os writers, squad-design

## Objetivo
Criar CTAs que convertem — botoes, links e micro-copy que transformam interesse em acao. O CTA e o momento da verdade: toda a copy existe para levar ate ele.

## Entrada
- Acao desejada (compra, signup, download, contato)
- Awareness level da audiencia
- Contexto (LP, email, ad, in-app)
- Nivel de commitment pedido (alto, medio, baixo)

## Passos

### 1. Framework de CTA por Commitment Level
| Commitment | Exemplo | Friction | Copy Approach |
|-----------|---------|----------|---------------|
| Micro | "Ver demo", "Ler mais" | Baixo | Curiosidade, zero risco |
| Baixo | "Trial gratis", "Download PDF" | Baixo-Medio | Beneficio gratis |
| Medio | "Agendar call", "Comecar trial" | Medio | Valor + facilidade |
| Alto | "Comprar agora", "Assinar plano" | Alto | Valor total + garantia |

### 2. Formulas de CTA Comprovadas
**Formula 1: Acao + Beneficio**
- "Comecar a [resultado]" → "Comecar a Vender Mais"
- "Receber [beneficio]" → "Receber Meu Plano Personalizado"

**Formula 2: Primeira Pessoa**
- "Eu quero [beneficio]" → "Eu Quero Mais Clientes"
- "Sim, [beneficio]!" → "Sim, Quero Meu Desconto!"

**Formula 3: Acao + Eliminacao de Objecao**
- "[Acao] — sem [objecao]" → "Comecar — Sem Cartao de Credito"
- "[Acao] gratis" → "Testar Gratis por 14 Dias"

**Formula 4: Urgencia + Acao**
- "[Acao] antes de [deadline]" → "Garantir Antes de Acabar"
- "Ultimas vagas — [acao]" → "Ultimas Vagas — Inscrever"

**Formula 5: Social + Acao**
- "Juntar-se a [N]+ [audiencia]" → "Juntar-se a 10,000+ Marketers"
- "[Acao] como [referencia]" → "Crescer Como as Maiores Marcas"

### 3. Micro-Copy ao Redor do CTA
**Acima do CTA (pre-CTA):**
- Recapitulacao de valor: "Acesso completo ao [produto] + [bonus]"
- Social proof: "Join 10,000+ professionals"
- Urgencia: "Oferta valida ate [data]"

**Abaixo do CTA (friction reducers):**
- "Sem cartao de credito necessario"
- "Cancele a qualquer momento"
- "Setup em menos de 2 minutos"
- "Garantia de [X] dias"
- "Seus dados estao seguros 🔒"

**Ao lado do CTA (alternativa):**
- "Ainda tem duvidas? Fale com a gente"
- "Prefere ver uma demo primeiro?"
- "Compare nossos planos →"

### 4. CTA por Canal
| Canal | Formato | Exemplos |
|-------|---------|----------|
| Landing Page | Botao grande + micro-copy | "Comecar Meu Trial Gratis" + "Setup em 2 min" |
| Email | Botao + link texto | "Garantir Minha Vaga" + "Ou clique aqui se preferir" |
| Social Ad | Botao preset + copy | "Learn More", "Sign Up", "Shop Now" |
| Blog | Inline CTA ou banner | "Quer [resultado]? [Acao]" |
| Pop-up | CTA + anti-CTA | "Sim, quero!" / "Nao, prefiro continuar sem [beneficio]" |
| In-app | Contextual micro-CTA | "Upgrade para desbloquear [feature]" |

### 5. Anti-CTA (Confirmshaming Done Right)
**Anti-CTA etico:**
- Reformula a rejeicao como perda de oportunidade
- NAO humilha ou manipula
- Exemplos bons: "Nao, obrigado, prefiro o plano gratuito"
- Exemplos ruins: "Nao, eu odeio economizar dinheiro" ← NUNCA

### 6. CTA Testing Matrix
**Para cada ponto de conversao, gerar:**
- 3-5 variantes de copy
- 2 variantes de cor/design (briefar designer)
- 2 variantes de posicao na pagina
- 1 variante de micro-copy

**Documentar:**
```
CTA-001:
  Location: Hero section LP
  Copy: "Comecar Meu Trial Gratis"
  Micro-copy: "Setup em 2 minutos. Sem cartao."
  Variants:
    - A: "Comecar Meu Trial Gratis"
    - B: "Quero Testar Agora"
    - C: "Sim, Quero Comecar!"
  Winner: TBD
  Lift: TBD
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: squad-design
    delivers: CTAs com micro-copy para implementacao
    format: CTA por location + variantes A/B
  - to: squad-growth
    delivers: CTAs para tracking de conversao
    format: CTA IDs + variantes + metricas-alvo
```

## Saida
- CTA variations por ponto de conversao (3-5 cada)
- Micro-copy library (pre-CTA + friction reducers)
- CTA testing matrix
- Anti-CTA copy (quando aplicavel)

## Validacao
- [ ] CTAs especificos (nao "Clique Aqui")
- [ ] Beneficio claro no CTA text
- [ ] Friction reducers presentes
- [ ] Min 3 variantes por ponto de conversao
- [ ] Micro-copy acima e abaixo do CTA
- [ ] Consistencia de tom com brand voice
- [ ] Anti-CTA etico (sem confirmshaming abusivo)
- [ ] Testing matrix documentada

---

*Task operada por: conversion-writer (Spark)*
