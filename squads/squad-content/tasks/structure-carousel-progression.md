---
task: structure-carousel-progression
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

# Task: Structure Carousel Progression

> Projetar a progressao slide-a-slide de um carrossel garantindo retencao e swipe-through rate.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Quando formato = carrossel (Instagram, LinkedIn) |
| **Input** | Espinha Dorsal, arco narrativo, Template Contract do carrossel |
| **Output** | Estrutura de slides com conteudo, funcao e CTA por slide |
| **Handoff** | → write-carousel-content |
| **Complexity** | medium |

---

## Fundamentacao

Carrossel nao e um blog fatiado em slides. Cada slide e uma unidade autonoma que deve: (1) fazer sentido isoladamente, (2) criar curiosidade para o proximo, (3) agregar valor incremental. A progressao e a chave: se a audiencia para no slide 3 de 10, os slides 4-10 nao existem. Referencia: Justin Welsh — carousel framework, Chris Do — visual storytelling.

---

## Steps

### Step 1: Definir Numero de Slides
Baseado na complexidade do tema e no Template Contract: educativo denso (8-10 slides), dica rapida (5-7 slides), story-driven (7-9 slides). Consultar Template Contract para limites especificos.

### Step 2: Projetar Slide 1 (Hook)
O slide mais importante. Deve parar o scroll. Opcoes: pergunta provocativa, dado surpreendente, afirmacao contraintuitiva, promessa de valor. Maximo 10-15 palavras. SEM logotipo grande, SEM "arraste para o lado".

### Step 3: Mapear Progressao
Para cada slide intermediario: qual e a funcao? Slide de contexto (expande o problema), slide de mecanismo (explica o como), slide de prova (dados/exemplos), slide de acao (o que fazer). Cada slide deve ter UM ponto principal.

### Step 4: Criar Ganchos de Transicao
Entre slides: o que faz a pessoa deslizar? Tecnicas: frase incompleta ("E o resultado foi..."), numeracao ("3 de 5"), revelacao progressiva, contraste visual. O ultimo elemento de cada slide deve apontar para o proximo.

### Step 5: Projetar Slide Final (CTA)
O slide final combina: resumo do valor entregue + CTA claro. Opcoes de CTA: salvar (conteudo de referencia), compartilhar (conteudo provocativo), comentar (conteudo de opiniao), clicar (conteudo de conversao).

### Step 6: Validar Template Contract
Verificar contra o Template Contract: numero de caracteres por slide, numero de slides, formato de CTA. Ajustar se fora dos limites.

### Step 7: Handoff

```yaml
handoff:
  artifact: "carousel-structure-{peca}.md"
  context: "Carrossel: {N} slides, hook tipo '{tipo}', CTA tipo '{cta}', Template Contract validado"
  next: "write-carousel-content para escrita do texto final"
```
