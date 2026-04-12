---
task: craft-objection-handlers
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

# Task: Craft Objection Handlers

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** objecoes mapeadas, audiencia, produto
- **Feeds:** todos os writers do squad

## Objetivo
Criar copy especifica para cada objecao da audiencia — transformando resistencia em confianca usando o framework Acknowledge → Reframe → Evidence → Bridge.

## Entrada
- Objecoes mapeadas (de copy brief ou research)
- Audiencia e awareness level
- Proof points disponíveis
- Contexto (LP, email, FAQ, sales)

## Passos

### 1. Classificar Objecoes por Tipo
| Tipo | Exemplos | Abordagem |
|------|----------|-----------|
| Preco | "E muito caro" | Value reframe + ROI |
| Confianca | "Nao conheço a marca" | Social proof + garantia |
| Necessidade | "Nao preciso disso" | Pain amplification + consequencia |
| Timing | "Nao e o momento" | Cost of delay + facilidade |
| Complexidade | "Parece complicado" | Simplificacao + suporte |
| Risco | "E se nao funcionar?" | Garantia + risk reversal |
| Comparacao | "Concorrente e melhor" | Diferenciacao + unique mechanism |
| Autonomia | "Consigo fazer sozinho" | Time/quality comparison |

### 2. Aplicar Framework AREB por Objecao
**Acknowledge → Reframe → Evidence → Bridge**

**Exemplo completo — "E muito caro":**
```
ACKNOWLEDGE (Validar):
"Entendemos. [Produto] e um investimento, e e natural
avaliar com cuidado."

REFRAME (Mudar perspectiva):
"Mas considere: quanto voce gasta hoje em [alternativa ineficaz]?
E quanto custa NAO resolver [problema]?"

EVIDENCE (Provar):
"Nossos clientes recuperam o investimento em media em [X] dias.
[Nome], da [Empresa], viu retorno de [X]x nos primeiros [tempo]."

BRIDGE (Conectar a acao):
"E com nossa garantia de [X] dias, voce testa sem risco.
Se nao gostar, devolvemos 100%."
```

### 3. Criar Objection Handler por Objecao Top
**Para cada objecao, produzir:**

**Versao Long (para sales page/FAQ):**
- 100-200 palavras
- AREB completo
- Testimonial ou data point

**Versao Medium (para email/body copy):**
- 50-100 palavras
- AREB condensado
- 1 proof point

**Versao Short (para FAQ/tooltip):**
- 20-50 palavras
- Resposta direta
- Link para mais info

**Versao Micro (para CTA micro-copy):**
- 5-15 palavras
- Abaixo do botao
- Ex: "Sem cartao. Cancele quando quiser."

### 4. Posicionar Objection Handlers
**Onde colocar na copy:**
| Objecao | Melhor Posicao | Formato |
|---------|---------------|---------|
| Preco | Proximo ao pricing | Value stack + ROI |
| Confianca | Apos hero + antes do CTA | Social proof + garantia |
| Complexidade | How it works section | 3 steps simples |
| Risco | Proximo ao CTA | Garantia box |
| Timing | Urgencia section | Cost of delay |
| Necessidade | Problem section | Pain amplification |

**Formatos de objection handling:**
- **FAQ format:** Pergunta + resposta
- **Inline copy:** Woven na narrativa
- **Callout box:** Highlight visual
- **Testimonial:** Cliente que tinha mesma objecao
- **Micro-copy:** Abaixo do CTA

### 5. Criar FAQ Persuasiva
**FAQ nao e apenas informacao — e objection handling disfarçado:**

```
❓ "Preciso ter experiencia com [X]?"
→ "Nao! [Produto] foi criado para [nivel].
   [X]% dos nossos clientes comecaram do zero."

❓ "E se eu nao gostar?"
→ "Sem problema. Temos garantia de [X] dias.
   Se nao for pra voce, devolvemos sem perguntas.
   [Y]% dos clientes renovam — mas a decisao e sua."

❓ "Quanto tempo leva para ver resultados?"
→ "[Timeframe realista]. Clientes como [Nome]
   viram [resultado] em [tempo]. Varia conforme [fator],
   mas nosso suporte te guia em cada passo."
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os writers do squad
    delivers: Objection handler library
    format: Handlers por objecao em 4 versoes (long/med/short/micro)
  - to: conversion-writer (Spark)
    delivers: FAQ copy e CTA micro-copy
    format: FAQ completa + friction reducers
```

## Saida
- Objection handler por objecao top (min 6)
- 4 versoes por objecao (long, medium, short, micro)
- FAQ persuasiva (5-8 perguntas)
- Posicionamento recomendado por copy type
- CTA micro-copy library

## Validacao
- [ ] Min 6 objecoes endereçadas
- [ ] AREB framework aplicado a cada uma
- [ ] 4 versoes por objecao
- [ ] Proof points em cada handler
- [ ] FAQ persuasiva (nao apenas informativa)
- [ ] Posicionamento recomendado documentado
- [ ] Tom empatico (nao defensivo)
- [ ] Handlers testados com audiencia real (ideal)

---

*Task operada por: persuasion-psychologist (Nudge)*
