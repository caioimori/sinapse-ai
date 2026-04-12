---
task: create-voice-training-materials
responsavel: "@brand-voice-writer"
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

# Task: Create Voice Training Materials

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice, tone spectrum, style guide, voice examples
- **Feeds:** todos os novos writers, equipe de marketing

## Objetivo
Criar materiais de treinamento que capacitem qualquer pessoa a escrever on-brand — de novos writers a equipes de produto, de freelancers a AI tools. O objetivo e escalar a voice sem depender de 1 pessoa.

## Entrada
- Brand voice guidelines completo
- Tone spectrum
- Voice examples by channel
- Style guide
- Erros comuns identificados (voice audit)

## Passos

### 1. Criar Training Deck
**Estrutura do deck (20-30 slides):**
```
PARTE 1: POR QUE VOICE IMPORTA (5 slides)
  - O que e brand voice (vs. tom, vs. estilo)
  - Exemplos de marcas com voice forte
  - Impacto de voice na percepcao da marca
  - O custo de voice inconsistente

PARTE 2: NOSSA VOICE (10-12 slides)
  - Voice attributes (com exemplos)
  - This/Not That (com exercicios)
  - Vocabulario (always/never)
  - Arquetipo de voz
  - Tone spectrum (quando adaptar)

PARTE 3: NA PRATICA (8-10 slides)
  - Exemplos por canal (bom/ruim/excelente)
  - Exercicios de reescrita
  - Checklist de self-review
  - Recursos e referencias

PARTE 4: EXERCICIOS (5 slides)
  - Exercicio 1: Identificar on-brand vs off-brand
  - Exercicio 2: Reescrever copy off-brand
  - Exercicio 3: Escrever copy original on-brand
```

### 2. Criar Exercicios Praticos
**Exercicio 1 — Identificacao:**
```
Leia as opcoes abaixo. Qual esta on-brand?
A. "[Copy on-brand]"
B. "[Copy off-brand]"
C. "[Copy parcialmente on-brand]"

Resposta: [A/B/C]
Por que: [Explicacao]
```

**Exercicio 2 — Reescrita:**
```
Copy original (off-brand):
"Prezado cliente, informamos que nosso sistema
esta temporariamente indisponivel."

Reescreva on-brand:
[Espaco para resposta]

Modelo de resposta:
"[Versao on-brand com explicacao]"
```

**Exercicio 3 — Criacao:**
```
Cenario: [Situacao especifica]
Canal: [Canal]
Audiencia: [Quem]
Tom: [Tom adequado]

Escreva copy on-brand (max [N] palavras):
[Espaco para resposta]

Modelo de resposta:
"[Copy modelo com explicacao]"
```

### 3. Criar Quick Reference Card
**1 pagina (imprimivel):**
```
[MARCA] VOICE CHEAT SHEET

SOMOS:                    NAO SOMOS:
✅ [Atributo 1]           ❌ [Anti-atributo 1]
✅ [Atributo 2]           ❌ [Anti-atributo 2]
✅ [Atributo 3]           ❌ [Anti-atributo 3]

ALWAYS WORDS: [lista]
NEVER WORDS: [lista]

TOM POR SITUACAO:
Celebrar → [Tom]
Informar → [Tom]
Resolver → [Tom]
Vender → [Tom]

ANTES DE PUBLICAR, PERGUNTE:
□ Soa como [marca]?
□ O tom e adequado para a situacao?
□ Usaria em conversa com um amigo?
□ Esta claro em 5 segundos?
```

### 4. Criar AI Voice Prompt Template
**Para AI-generated content (ChatGPT, Claude, etc.):**
```
SYSTEM PROMPT TEMPLATE:

Voce e um copywriter da [marca].

VOICE ATTRIBUTES:
- [Atributo 1]: [definicao curta]
- [Atributo 2]: [definicao curta]
- [Atributo 3]: [definicao curta]

TOM PARA ESTE CONTEXTO: [tom]

REGRAS:
- SEMPRE use: [always words]
- NUNCA use: [never words]
- SEMPRE escreva em [pessoa] pessoa
- MANTENHA [nivel de formalidade]
- [Regras adicionais]

EXEMPLOS DE COPY ON-BRAND:
"[Exemplo 1]"
"[Exemplo 2]"
"[Exemplo 3]"

TAREFA:
[Instrucao especifica]
```

### 5. Criar Onboarding de Novos Writers
**Programa de 5 dias:**
```
DIA 1: Imersao
  - Ler brand voice guidelines
  - Ler 20 exemplos on-brand
  - Quiz de identificacao (exercicio 1)

DIA 2: Pratica guiada
  - Reescrever 10 pecas off-brand (exercicio 2)
  - Feedback por writer senior

DIA 3: Criacao supervisionada
  - Escrever 5 pecas originais (exercicio 3)
  - Review e feedback

DIA 4: Aplicacao real
  - Escrever peca real com review
  - Ajustes com mentoria

DIA 5: Certificacao
  - Quiz final (15 questoes)
  - Score minimo: 80%
  - Feedback personalizado
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os novos writers
    delivers: Training materials completo
    format: Deck + exercicios + quick ref + AI prompt
  - to: equipe de marketing
    delivers: Voice training para nao-writers
    format: Versao simplificada do deck
```

## Saida
- Training deck (20-30 slides)
- 3 tipos de exercicios praticos (min 5 cada)
- Quick reference card (1 pagina)
- AI voice prompt template
- Programa de onboarding de 5 dias
- Quiz de certificacao

## Validacao
- [ ] Training deck com 4 partes (por que, nossa voice, pratica, exercicios)
- [ ] Min 5 exercicios de identificacao
- [ ] Min 5 exercicios de reescrita
- [ ] Min 5 exercicios de criacao
- [ ] Quick reference card imprimivel
- [ ] AI prompt template funcional
- [ ] Programa de onboarding de 5 dias
- [ ] Quiz com min 15 questoes
- [ ] Testado com 1+ pessoas antes de publicar

---

*Task operada por: brand-voice-writer (Tone)*
