---
task: generate-brand-names
responsavel: "@brand-naming-specialist"
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

# Task: Generate Brand Names

## Metadata
- **Agent:** Namer (brand-naming-specialist)
- **Squad:** squad-brand
- **Trigger:** `*generate-names` ou novo projeto de naming
- **Inputs:** Positioning, archetype, target audience, constraints
- **Outputs:** Shortlist of 5-10 names with rationale, availability check

## Description
Gerar nomes de marca usando naming spectrum completo — de descritivos a inventados. Cada candidato deve ser filtrado por pronunciabilidade, disponibilidade de dominio/handles e alinhamento estrategico.

## Steps
1. Definir naming strategy:
   | Type | Description | Example | Pros | Cons |
   |------|-----------|---------|------|------|
   | Descriptive | Describes what it does | PayPal | Immediately clear | Hard to own |
   | Invented | Made-up word | Kodak | Unique, ownable | Needs education |
   | Metaphorical | Symbolic meaning | Amazon | Evocative | May confuse |
   | Acronym | Initials | IBM | Short | Forgettable initially |
   | Founder | Person's name | Tesla | Personal authority | Succession risk |

2. Gerar 50-100 candidatos (brainstorm sem filtro)
3. Filtro 1 — Pronunciabilidade e memorabilidade:
   - Pode ser dito em voz alta sem soletrar?
   - E memoravel apos 1 exposicao?
   - Funciona em portugues E ingles?
4. Filtro 2 — Disponibilidade de dominio:
   - .com disponivel?
   - .com.br disponivel?
   - Variacoes acessiveis?
5. Filtro 3 — Handles sociais:
   - @nome disponivel no Instagram?
   - @nome disponivel no LinkedIn?
   - @nome disponivel no Twitter/X?
6. Filtro 4 — Preliminary trademark check:
   - Busca no INPI (Brasil)
   - Busca no USPTO (internacional)
   - Conflitos obvios?
7. Shortlist 5-10 com rationale
8. Apresentar Top 3 com:
   - Nome + significado/origem
   - Disponibilidade (dominio, handles)
   - Visual mockup (como ficaria em logo)
   - Pros e cons
   - Fit com posicionamento (score 1-5)

## Validation Criteria
- Minimo 50 candidatos gerados
- Top 3 com dominio .com ou .com.br disponivel
- Todos pronunciaveis em portugues e ingles
- Rationale estrategico por nome (nao apenas "soa bem")
- Preliminary trademark check sem conflitos obvios

## Output Format
```markdown
# Brand Naming — {project_name}

## Naming Strategy
Type: [Descriptive / Invented / Metaphorical / Mixed]

## Top 3 Recommendations
### 1. [Nome]
- Significado: [origem/significado]
- Dominio: [disponibilidade]
- Handles: [disponibilidade]
- Trademark: [status]
- Fit: [score]/5
- Pros: [lista]
- Cons: [lista]

## Shortlist Completa (5-10)
| # | Nome | Tipo | Dominio | Handles | Trademark | Fit |
```
