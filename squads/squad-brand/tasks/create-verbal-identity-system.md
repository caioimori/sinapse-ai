---
task: create-verbal-identity-system
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

# Task: Create Verbal Identity System

## Metadata
- **Agent:** Namer (brand-naming-specialist)
- **Squad:** squad-brand
- **Trigger:** `*build-naming-system` ou marca precisa de sistema verbal completo
- **Inputs:** Brand name, positioning, archetype, brand architecture
- **Outputs:** Verbal identity guide (naming system, tagline, nomenclature, vocabulary)

## Description
Criar sistema completo de identidade verbal — naming conventions para sub-produtos, tagline, vocabulario proprietario, nomenclatura de campanhas. O sistema garante que qualquer novo asset verbal seja coerente e on-brand.

## Steps
1. Definir master brand name (se nao definido)
2. Criar tagline/slogan principal:
   | Type | Example | When |
   |------|---------|------|
   | Descriptive | "The Ultimate Driving Machine" | Clarity needed |
   | Imperative | "Just Do It" | Action-oriented |
   | Provocative | "Think Different" | Challenger brand |
   | Superlative | "The Best a Man Can Get" | Market leader |
   | Question | "Got Milk?" | Category awareness |
3. Definir naming convention para sub-produtos:
   - Regra: [Tematica / Sequencial / Descritiva / Alfanumerica]
   - Relacao com master brand: [Endorsed / Independent / Descriptive]
   - Exemplos: 3 nomes fictícios seguindo a regra
4. Definir nomenclatura de campanhas:
   - Formato: [Brand + Tema / Standalone / Seasonal]
   - Exemplos: 3 campanhas fictícias
5. Criar vocabulario proprietario:
   - 5-10 termos que SO essa marca usa
   - Significado de cada termo
   - Contexto de uso
6. Definir vocabulario proibido:
   - Palavras que a marca NUNCA usa
   - Razao para cada proibicao
7. Documentar verbal identity guide

## Validation Criteria
- Tagline funciona com E sem o nome da marca
- Naming convention escala para 10+ sub-produtos
- Vocabulario proprietario e unico (nenhum concorrente usa)
- Sistema e documentado o suficiente para uso autonomo pela equipe

## Output Format
```markdown
# Verbal Identity System — {brand_name}

## Tagline
[tagline] — tipo: [descritive/imperative/provocative]

## Sub-Product Naming Convention
Rule: [description]
Pattern: [Brand] + [type]
Examples: [3 examples]

## Campaign Nomenclature
Format: [pattern]
Examples: [3 examples]

## Proprietary Vocabulary
| Term | Meaning | Usage Context |

## Prohibited Vocabulary
| Word | Reason |
```
