---
task: align-copy-strategy-with-brand
responsavel: "@copy-strategist"
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

# Task: Align Copy Strategy with Brand

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-strategist (Quill)
- **Complexity:** STANDARD
- **Depends on:** brand positioning (brand-system)
- **Feeds:** todos os writers, brand-voice-writer (Tone)

## Objetivo
Garantir alinhamento perfeito entre estrategia de copy e posicionamento de marca — traduzir brand strategy em copy guidelines acionaveis.

## Entrada
- Brand positioning statement
- Brand personality e archetype
- Brand voice guidelines
- Value proposition
- Competitive positioning

## Passos

### 1. Extrair Copy Implications do Brand
- **Positioning → One Big Idea:** Como a posicao da marca se traduz na mensagem central?
- **Archetype → Tone:** Que tom natural emerge do arquetipo?
- **Values → Proof Points:** Quais valores precisam ser demonstrados no copy?
- **Personality → Vocabulary:** Que palavras a marca usaria/nunca usaria?

### 2. Criar Brand-to-Copy Translation Guide

| Brand Element | Copy Implication | Exemplo |
|--------------|-----------------|---------|
| Positioning | Message priority | Se "innovation leader" → lead with what's new |
| Archetype | Narrative voice | Se "Sage" → educational, wise tone |
| Personality | Word choice | Se "bold" → active verbs, direct language |
| Values | Story themes | Se "transparency" → show behind the scenes |
| Differentiator | Key selling point | O que nos torna unicos |

### 3. Definir Copy Guardrails
- **Always:** [O que o copy deve SEMPRE fazer]
- **Never:** [O que o copy NUNCA deve fazer]
- **Prefer:** [Preferencias quando ha escolha]
- **Avoid:** [O que evitar quando possivel]

### 4. Validar com Brand System
- Compartilhar translation guide com brand-system squad
- Solicitar feedback de Meridian (brand orchestrator)
- Alinhar: voice guidelines do Tone com brand guidelines
- Resolver conflitos entre copy effectiveness e brand compliance

### 5. Documentar e Distribuir
- Criar "Copy × Brand Alignment Document"
- Distribuir para todos os writers
- Incluir exemplos do/don't para cada guideline
- Definir cadencia de revisao (trimestral)

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: brand-system
    delivers: copy translation of brand elements
    format: brand-to-copy alignment document
  - from: brand-system
    receives: updates de positioning, voice refinements
```

## Saida
- Brand-to-Copy translation guide
- Copy guardrails (always/never/prefer/avoid)
- Alinhamento validado com brand-system
- Documento distribuido para writers

## Validacao
- [ ] Cada brand element traduzido para copy implication
- [ ] Guardrails definidos (always/never)
- [ ] Validado com brand-system squad
- [ ] Distribuido para todos os writers

---

*Task operada por: copy-strategist (Quill)*
