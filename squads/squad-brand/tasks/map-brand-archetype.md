---
task: map-brand-archetype
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

# Task: Map Brand Archetype

## Metadata
- **Agent:** Archetype (brand-archetype-strategist)
- **Squad:** squad-brand
- **Trigger:** `*map-archetype` ou novo projeto de marca
- **Inputs:** Discovery report, positioning, target audience, values
- **Outputs:** Primary archetype + shadow, personality traits, implications map

## Description
Mapear arquetipo primario e shadow (secundario) da marca usando os 12 arquetipos junguianos. Cada arquetipo determina personalidade, tom de voz, paleta semantica e comportamento de marca.

## Steps
1. Revisar posicionamento, valores e publico-alvo
2. Apresentar os 12 arquetipos:
   | Archetype | Motivation | Goal | Fear | Brand Example |
   |-----------|-----------|------|------|--------------|
   | Hero | Mastery | Prove worth | Weakness | Nike |
   | Outlaw | Liberation | Break rules | Powerlessness | Harley-Davidson |
   | Magician | Transformation | Make dreams real | Unintended consequences | Disney |
   | Innocent | Safety | Be happy | Punishment | Coca-Cola |
   | Explorer | Freedom | Find fulfillment | Being trapped | Jeep |
   | Sage | Understanding | Find truth | Ignorance | Google |
   | Creator | Innovation | Create value | Mediocrity | Apple |
   | Ruler | Control | Create order | Chaos | Mercedes-Benz |
   | Caregiver | Service | Help others | Selfishness | Johnson & Johnson |
   | Jester | Enjoyment | Have fun | Boredom | M&M's |
   | Lover | Intimacy | Create connection | Being alone | Chanel |
   | Everyman | Belonging | Connect with others | Standing out | IKEA |

3. Avaliar fit de cada arquetipo (score 1-5):
   | Archetype | Fit Score | Rationale |
   |-----------|----------|-----------|
   | (all 12) | /5 | |

4. Selecionar primario (highest score) e shadow (complementar)
5. Mapear implicacoes:
   ```
   PRIMARY: [Archetype]
   SHADOW: [Archetype]

   PERSONALITY TRAITS (5):
   1. [trait]
   2. [trait]
   3. [trait]
   4. [trait]
   5. [trait]

   SEMANTIC PALETTE:
   - Words that resonate: [list]
   - Words to avoid: [list]
   - Emotional territory: [description]

   VISUAL IMPLICATIONS:
   - Color direction: [warm/cool/bold/muted]
   - Typography direction: [serif/sans/display]
   - Imagery style: [photography/illustration/abstract]

   BEHAVIORAL IMPLICATIONS:
   - How the brand acts in public: [description]
   - How the brand handles crisis: [description]
   - How the brand celebrates: [description]
   ```

6. Validar com evidencias do discovery
7. Documentar archetype profile completo

## Validation Criteria
- Arquetipo primario justificado com evidencias (nao imposto)
- Shadow archetype complementa (nao conflita)
- 5 personality traits definidos e distintos
- Implicacoes visuais e verbais mapeadas
- Anti-patterns documentados (o que o arquetipo NUNCA faria)

## Output Format
```markdown
# Brand Archetype — {brand_name}

## Primary: [Archetype]
Justificativa: [evidencias do discovery]

## Shadow: [Archetype]
Justificativa: [como complementa o primario]

## Personality Traits
1-5 traits with descriptions

## Semantic Palette
Words that resonate / Words to avoid

## Implications
Visual / Verbal / Behavioral

## Anti-Patterns
What this archetype NEVER does
```
