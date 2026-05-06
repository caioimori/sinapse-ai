---
task: system-prompt-design
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

# System Prompt Design

## Objective

Design effective system prompts for AI agents that establish clear personas, behavioral boundaries, output formats, and domain expertise. Produce production-ready system prompts with structured sections, tested against edge cases and adversarial inputs.

## Pre-Conditions

- Clear definition of the agent's role and domain
- Target use cases and user interaction patterns documented
- Output format requirements specified
- Known constraints and safety boundaries identified
- Access to example interactions for validation

## Steps

1. **Define Agent Identity** — Establish the agent's persona: name, role, expertise domain, communication style (formal/casual, verbose/concise), and authority level. Document what the agent IS and IS NOT responsible for.
2. **Map Behavioral Boundaries** — Define explicit rules: what the agent must always do, must never do, and should do when uncertain. Use MUST/MUST NOT/SHOULD/SHOULD NOT language for clarity.
3. **Structure the Prompt Skeleton** — Organize the system prompt into sections: Identity, Core Instructions, Behavioral Rules, Output Format, Error Handling, Examples. Use markdown headers and tables for scannability.
4. **Write Core Instructions** — Draft the main behavioral instructions. Each instruction should be specific, actionable, and testable. Avoid vague directives like "be helpful" — instead specify "respond with code examples when the user asks how to implement something."
5. **Design Output Format Specifications** — Define exact output structures: JSON schemas, markdown templates, code block conventions, or free-form guidelines. Include examples of correct and incorrect outputs.
6. **Add Conditional Logic** — Write branching instructions for different scenarios: "If the user asks about X, respond with Y format. If the input contains Z, first validate before proceeding."
7. **Implement Safety Rails** — Add guardrails for edge cases: handling off-topic requests, refusing unsafe operations, escalating to humans, dealing with ambiguous inputs.
8. **Write Few-Shot Examples** — Include 2-3 input/output examples that demonstrate ideal behavior. Cover the happy path, an edge case, and a boundary case.
9. **Optimize Token Efficiency** — Review the prompt for redundancy and verbosity. Compress without losing clarity. Convert paragraphs to bullet points or tables where appropriate. Target minimum viable token count.
10. **Test Against Edge Cases** — Validate the prompt against adversarial inputs, ambiguous requests, out-of-scope questions, and multi-step interactions. Document failures and refine.
11. **Version and Document** — Assign a version number, document the design rationale, list known limitations, and create a changelog template for future iterations.

## Output

```markdown
# System Prompt: {Agent Name}

## Version
v{X.Y} — {date}

## Prompt Content
{complete system prompt text, ready to paste}

## Design Rationale
| Section | Rationale |
|---------|-----------|
| {section} | {why this design choice} |

## Test Results
| Scenario | Input | Expected Output | Actual | Pass? |
|----------|-------|-----------------|--------|-------|

## Token Count
- Total tokens: {count}
- Sections breakdown: {per-section counts}

## Known Limitations
- {limitation 1}
- {limitation 2}
```

## Quality Criteria

- System prompt must produce consistent behavior across 10+ test interactions
- Token count must be within budget (specified per project)
- All MUST/MUST NOT rules must be verifiable in testing
- Output format specifications must include at least one concrete example
- Safety rails must handle at least 5 common edge case categories
- Prompt must be self-contained (no external dependencies for core behavior)
