---
task: chain-of-thought-optimization
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

# Chain-of-Thought Optimization

## Objective

Optimize chain-of-thought (CoT) prompting strategies for complex reasoning tasks. Analyze existing prompts, identify reasoning gaps, and restructure prompts to elicit step-by-step thinking that improves accuracy and reduces hallucination in multi-step problem solving.

## Pre-Conditions

- Target task or domain requiring multi-step reasoning identified
- Baseline prompts (without CoT) available for comparison
- Sample inputs covering easy, medium, and hard difficulty levels
- Success criteria defined (accuracy, completeness, consistency)
- Understanding of the reasoning chain expected for the task

## Steps

1. **Analyze the Reasoning Task** — Break down the target task into its logical reasoning steps. Identify where the model typically fails: missing steps, incorrect inferences, premature conclusions, or circular reasoning. Document the ideal reasoning chain.
2. **Audit Existing Prompts** — Review current prompts for reasoning quality. Score each on: step granularity (are steps explicit?), logical flow (does each step follow from the previous?), verification points (does the model check its work?), and conclusion validity.
3. **Select CoT Strategy** — Choose the appropriate CoT variant: zero-shot CoT ("Let's think step by step"), few-shot CoT (examples with reasoning), structured CoT (numbered steps with specific sub-tasks), or self-consistency CoT (multiple reasoning paths).
4. **Design Reasoning Scaffolds** — Create explicit reasoning templates that guide the model through the required steps. Include placeholders for intermediate results, verification checkpoints, and decision points.
5. **Add Verification Prompts** — Insert self-check instructions at critical points: "Before proceeding, verify that X is consistent with Y", "Check your calculation by working backwards", "List any assumptions you made in this step."
6. **Implement Step Decomposition** — Break complex steps into atomic sub-steps. Each sub-step should produce a verifiable intermediate result. Use numbered lists with clear input/output for each step.
7. **Test with Graduated Difficulty** — Run the optimized prompt against easy, medium, and hard test cases. Track accuracy at each difficulty level. Identify the point where reasoning breaks down.
8. **Compare Against Baseline** — Measure improvement over non-CoT baseline: accuracy delta, reasoning completeness, consistency across runs, and hallucination rate. Document with specific examples.
9. **Optimize Token Efficiency** — Balance reasoning quality with token cost. Identify which reasoning steps are essential vs. verbose. Test compressed versions that maintain accuracy while reducing token usage by 20-30%.
10. **Document Patterns** — Extract reusable CoT patterns that can be applied to similar tasks. Create a pattern library with trigger conditions (when to use each pattern) and expected outcomes.

## Output

```markdown
# Chain-of-Thought Optimization Report

## Task Analysis
- Task: {description}
- Reasoning steps required: {count}
- Key failure points: {list}

## Strategy Selected
- CoT variant: {variant}
- Rationale: {why this variant}

## Optimized Prompt
{complete prompt with CoT scaffolding}

## Results
| Difficulty | Baseline Accuracy | CoT Accuracy | Delta |
|-----------|------------------|-------------|-------|
| Easy      | {%}              | {%}         | {+%}  |
| Medium    | {%}              | {%}         | {+%}  |
| Hard      | {%}              | {%}         | {+%}  |

## Reusable Patterns
| Pattern | Trigger | Template |
|---------|---------|----------|

## Token Impact
- Baseline tokens: {count}
- CoT tokens: {count}
- Cost increase: {percentage}
```

## Quality Criteria

- CoT prompt must improve accuracy by at least 15% over baseline on hard tasks
- Every reasoning step must produce a verifiable intermediate output
- Self-check instructions must catch at least 50% of reasoning errors in testing
- Token overhead from CoT must not exceed 3x the baseline prompt length
- At least 3 reusable patterns must be extracted and documented
- Prompt must maintain accuracy across 5+ consecutive runs (consistency check)
