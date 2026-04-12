---
task: few-shot-example-library
responsavel: "@skill-craftsman"
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
  - "[ ] Validar inputs"
  - "[ ] Executar steps"
  - "[ ] Verificar qualidade"
  - "[ ] Gerar output"
---

# Few-Shot Example Library

## Objective

Build a curated library of few-shot examples organized by task type, difficulty, and domain. Each example set must demonstrate ideal input-output pairs that consistently improve model performance when included in prompts.

## Pre-Conditions

- Target tasks and domains identified for few-shot coverage
- Access to high-quality input-output pairs (human-validated)
- Token budget constraints defined per prompt category
- Baseline performance metrics without few-shot examples available
- Output format standards established for each task type

## Steps

1. **Inventory Task Categories** — Catalog all task types that benefit from few-shot examples: code generation, data transformation, analysis, classification, summarization, creative writing, structured output generation. Group related tasks into categories.
2. **Define Example Quality Criteria** — Establish what makes a good few-shot example: representative of the task, diverse in complexity, demonstrates edge cases, follows exact output format, minimal but complete. Create a scoring rubric (1-5 scale).
3. **Collect Candidate Examples** — For each task category, gather 10-15 candidate input-output pairs from real interactions, documentation, or manual creation. Ensure diversity in input length, complexity, and edge case coverage.
4. **Curate and Score** — Apply the quality rubric to each candidate. Discard examples scoring below 3. For each task category, select the top 3-5 examples that provide maximum coverage with minimum redundancy.
5. **Order Examples Strategically** — Arrange examples from simple to complex within each set. The first example should be the clearest demonstration of the pattern. The last example should cover the most common edge case.
6. **Format for Token Efficiency** — Standardize example formatting: use consistent delimiters (---), clear input/output labels, minimal whitespace. Measure token count per example set. Create compact and full versions.
7. **Test Example Effectiveness** — For each example set, measure model performance with 0, 1, 3, and 5 examples. Identify the point of diminishing returns. Document the optimal number of examples per task type.
8. **Build the Library Index** — Create a searchable index with: task category, example count, token cost, effectiveness score, last validated date, and usage instructions. Organize by domain and difficulty.
9. **Create Retrieval Guidelines** — Document when to use each example set: trigger conditions, compatible prompt patterns, known conflicts with other prompt elements, and fallback options.
10. **Establish Maintenance Process** — Define how examples are updated: validation schedule (monthly), retirement criteria (accuracy drops below threshold), addition process (new examples must pass rubric), and version tracking.

## Output

```markdown
# Few-Shot Example Library

## Index
| Category | Examples | Token Cost | Effectiveness | Last Validated |
|----------|----------|-----------|---------------|----------------|

## Example Sets

### {Category Name}
**Usage:** {when to use this set}
**Token cost:** {compact/full}

#### Example 1 (Simple)
**Input:** {input}
**Output:** {output}

#### Example 2 (Standard)
**Input:** {input}
**Output:** {output}

#### Example 3 (Edge Case)
**Input:** {input}
**Output:** {output}

## Retrieval Guidelines
| Trigger | Example Set | Notes |
|---------|-------------|-------|

## Maintenance Schedule
- Next validation: {date}
- Retirement queue: {list}
```

## Quality Criteria

- Library must cover at least 5 distinct task categories
- Each example set must score 4+ on the quality rubric
- Token cost per example set must be documented and within budget
- Adding few-shot examples must improve task accuracy by at least 10% over zero-shot
- Each example set must include at least one edge case demonstration
- Library index must be searchable by category, domain, and token cost
