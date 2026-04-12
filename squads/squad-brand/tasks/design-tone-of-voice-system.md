---
task: design-tone-of-voice-system
responsavel: "@brand-archetype-strategist"
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

# Task: Design Tone of Voice System

## Metadata
- **Agent:** Archetype (brand-archetype-strategist)
- **Squad:** squad-brand
- **Trigger:** `*derive-tone` ou arquetipo definido
- **Inputs:** Brand archetype (primary + shadow), personality traits, positioning
- **Outputs:** Complete tone of voice guide with examples per channel

## Description
Projetar sistema completo de tom de voz derivado do arquetipo da marca. O sistema deve ser pratico o suficiente para que qualquer pessoa escreva "na voz da marca" sem supervisao.

## Steps
1. Extrair personalidade do arquetipo:
   - 5 tracos primarios (do arquetipo principal)
   - 2-3 moduladores (do shadow archetype)
2. Definir espectro de tom em 3 eixos:
   ```
   Formalidade:  [1] Muito Formal ←→ Muito Casual [5]
   Seriedade:    [1] Muito Serio  ←→ Muito Divertido [5]
   Autoridade:   [1] Autoritario  ←→ Empatico [5]

   Position: [X, Y, Z]
   ```
3. Criar DO / DON'T verbal:
   | DO (sempre) | DON'T (nunca) |
   |-------------|--------------|
   | | |
4. Definir vocabulario:
   - Palavras preferidas (10-15)
   - Palavras proibidas (10-15)
   - Expressoes assinatura (3-5)
5. Gerar 5 exemplos reais:
   | Context | Example Text |
   |---------|-------------|
   | Social media post | |
   | Email marketing | |
   | Headline/ad | |
   | Error message | |
   | Success message | |
6. Adaptar por canal:
   | Channel | Tone Adjustment | Example |
   |---------|----------------|---------|
   | LinkedIn | More formal, expertise-focused | |
   | Instagram | More visual, casual | |
   | Twitter/X | More direct, witty | |
   | Email | More personal, conversational | |
   | Website | Balanced, professional | |
7. Documentar guia completo

## Validation Criteria
- Espectro de tom definido em 3 eixos com posicao clara
- DO/DON'T sao especificos (nao genericos)
- 5 exemplos reais que qualquer pessoa pode seguir
- Adaptacoes por canal documentadas
- Vocabulario preferido e proibido listados
- Alguem que nao conhece a marca consegue escrever "na voz" seguindo o guia

## Output Format
```markdown
# Tone of Voice System — {brand_name}

## Personality Foundation
Primary Archetype: [X] | Shadow: [Y]
Traits: [5 traits]

## Tone Spectrum
Formalidade: [position]
Seriedade: [position]
Autoridade: [position]

## DO / DON'T
[table]

## Vocabulary
Preferred / Prohibited / Signature Expressions

## Real Examples (5)
[context + example for each]

## Channel Adaptations
[per channel adjustments]
```
