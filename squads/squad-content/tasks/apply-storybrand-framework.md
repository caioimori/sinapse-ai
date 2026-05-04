---
task: apply-storybrand-framework
responsavel: "@content-engineer"
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

# Task: Apply StoryBrand Framework

> Aplicar o framework StoryBrand para estruturar narrativas onde o cliente e o guia e a audiencia e o heroi.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Pecas de conteudo que requerem narrativa de transformacao (cases, about, landing pages) |
| **Input** | Espinha Dorsal, dados do cliente, audiencia-alvo |
| **Output** | Narrativa StoryBrand completa com 7 elementos |
| **Handoff** | → write-{format}-content |
| **Complexity** | medium |

---

## Fundamentacao

O StoryBrand de Donald Miller e um dos frameworks narrativos mais eficazes para conteudo de marca. O erro fatal e a marca se posicionar como heroi — o heroi e SEMPRE a audiencia. A marca e o guia (Yoda, nao Luke). Os 7 elementos: Character → Problem → Guide → Plan → Call to Action → Failure → Success. Referencia: Donald Miller — Building a StoryBrand.

---

## Steps

### Step 1: Character (Heroi = Audiencia)
Quem e o heroi? Definir em termos concretos: cargo, desafio diario, aspiracao. O heroi QUER algo claro e tangivel.

### Step 2: Problem (3 Niveis)
Problema externo (o que precisa resolver), problema interno (como se sente), problema filosofico (por que esta errado). Os 3 niveis criam ressonancia emocional profunda.

### Step 3: Guide (Marca = Guia)
A marca se posiciona como guia: com EMPATIA (entende a dor) e AUTORIDADE (sabe resolver). Nunca como heroi. O guia ja passou pelo que o heroi esta passando.

### Step 4: Plan (Passos Claros)
O guia oferece um plano simples: 3-4 passos que removem confusao e reduzem risco percebido. O plano deve ser claro o suficiente para ser seguido sem duvidas.

### Step 5: Call to Action (Direto + Transitorio)
CTA direto (compre, agende, assine) + CTA transitorio (baixe o guia, leia o artigo). Sempre os dois, para diferentes niveis de prontidao.

### Step 6: Stakes (Failure + Success)
O que acontece se o heroi NAO agir (failure)? O que acontece se agir (success)? Pintar ambos os cenarios com vivacidade. O contraste cria urgencia.

### Step 7: Handoff

```yaml
handoff:
  artifact: "storybrand-{peca}.md"
  context: "StoryBrand aplicado: heroi '{persona}', guia '{marca}', plano {N} passos, CTAs definidos"
  next: "write-{formato}-content para escrita baseada na narrativa StoryBrand"
```
