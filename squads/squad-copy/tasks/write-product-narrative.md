---
task: write-product-narrative
responsavel: "@long-form-writer"
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

# Task: Write Product Narrative

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** STANDARD
- **Depends on:** product info, copy brief, brand voice
- **Feeds:** conversion-writer (Spark), brand-voice-writer (Tone)

## Objetivo
Escrever narrativa de produto que transforma features em historia — fazendo o leitor SENTIR o valor antes de entende-lo racionalmente. O product narrative e a ponte entre "o que faz" e "por que importa".

## Entrada
- Product specs e features
- Audiencia e jobs-to-be-done
- Competitor positioning
- Brand voice guidelines

## Passos

### 1. Mapear Feature → Benefit → Outcome
**Transformacao em 3 niveis:**
| Nivel | Pergunta | Exemplo |
|-------|----------|---------|
| Feature | "O que e?" | "Dashboard em tempo real" |
| Benefit | "O que isso FAZ por mim?" | "Veja todas suas metricas num unico lugar" |
| Outcome | "Como isso MUDA minha vida?" | "Tome decisoes em minutos, nao dias" |

**Regra: Nunca escrever features sem traduzir em outcomes.**

**Framework "So that...":**
- [Feature] so that [benefit] so that [outcome]
- "Dashboard em tempo real" so that "voce ve tudo num lugar" so that "toma decisoes mais rapidas e acertadas"

### 2. Encontrar a Historia do Produto
**Todo produto tem uma historia. Encontre-a:**

**A. Historia de Origem:**
- Por que foi criado? Que frustracao levou a isso?
- "Estavamos cansados de [problema], entao construimos [produto]"

**B. Historia do Usuario:**
- O que muda na vida do usuario?
- "Antes de [produto], [persona] gastava [X] horas em [tarefa]. Agora..."

**C. Historia de Impacto:**
- Qual o efeito ripple no mundo?
- "[Produto] ja ajudou [N] pessoas a [resultado]"

**D. Historia de Diferenciacao:**
- O que faz diferente e POR QUE isso importa?
- "Enquanto outros [abordagem convencional], nos [abordagem unica] porque [razao]"

### 3. Escrever o Product Narrative
**Estrutura recomendada:**

```
1. THE WORLD BEFORE (150-200 palavras)
   - Como e a vida SEM o produto
   - Frustrações, workarounds, tempo perdido
   - "Você conhece aquela sensação de..."

2. THE INSIGHT (100-150 palavras)
   - O que descobrimos/percebemos
   - A ideia que muda o jogo
   - "E se existisse uma forma de..."

3. THE PRODUCT (200-300 palavras)
   - O que é e como funciona (high-level)
   - Mecanismo unico (por que e diferente)
   - Features traduzidas em outcomes

4. THE EXPERIENCE (150-200 palavras)
   - Como é USAR o produto
   - Detalhes sensoriais e emocionais
   - Momentos de "aha" e delight

5. THE WORLD AFTER (150-200 palavras)
   - Como e a vida COM o produto
   - Resultados concretos
   - Impacto emocional (confianca, alivio, orgulho)

6. THE INVITATION (50-100 palavras)
   - Convite para experimentar
   - CTA natural (nao agressivo)
```

### 4. Princípios de Escrita
**Tom:**
- Confiante sem ser arrogante
- Empatico sem ser condescendente
- Entusiasta sem ser hype
- Especifico sem ser tecnico

**Tecnicas:**
- **Future pacing:** Faz o leitor imaginar usando o produto
- **Sensory detail:** "Ao abrir o app, voce ve..."
- **Contrast:** Antes vs. Depois constantemente
- **Simplicity:** Uma crianca de 12 anos entenderia?
- **Rhythm:** Frases curtas para impacto, longas para imersao

### 5. Adaptar por Canal
| Canal | Foco | Comprimento |
|-------|------|-------------|
| Website (About/Product) | Historia completa | 500-1000 palavras |
| Pitch deck | Problema → Solucao → Resultado | 200-300 palavras |
| Product Hunt | Hook + mecanismo + CTA | 300-500 palavras |
| Social announcement | Tensao + revelacao | 100-200 palavras |
| Press release | Newsworthiness + specs | 400-600 palavras |
| Onboarding | Valor a cada passo | Micro-copy por tela |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Product narrative para uso em LPs
    format: Narrativa modular + feature→benefit→outcome map
  - to: brand-voice-writer (Tone)
    delivers: Narrativa para validacao de voz
    format: Narrativa completa + notas de tom
```

## Saida
- Product narrative completo (500-1000 palavras)
- Feature→Benefit→Outcome map
- Versoes adaptadas por canal (min 3)
- Key phrases e soundbites extraidos

## Validacao
- [ ] Zero features sem traducao em outcomes
- [ ] Historia encontrada (origem, usuario, impacto ou diferenciacao)
- [ ] Contraste antes/depois claro
- [ ] Tom consistente com brand voice
- [ ] Future pacing aplicado
- [ ] Leitor de 12 anos entenderia
- [ ] Versoes por canal criadas

---

*Task operada por: long-form-writer (Saga)*
