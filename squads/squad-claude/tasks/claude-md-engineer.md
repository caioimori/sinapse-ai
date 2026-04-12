---
task: claude-md-engineer
responsavel: "@config-engineer"
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

# CLAUDE.md Engineer

## Objective

Design and write CLAUDE.md files that effectively shape Claude Code behavior for a project. Craft instructions with high information density, proper structure, and optimal token budget that make Claude Code a productive team member.

## Inputs

- Project description and goals
- Technology stack and conventions
- Team coding standards
- Known pitfalls or anti-patterns to avoid
- Existing CLAUDE.md (if updating)
- Token budget target (small < 2K tokens, medium < 5K, large < 10K)

## Steps

1. **Audit Existing CLAUDE.md** — If updating, measure current token count, identify low-value sections, and flag contradictions with .claude/rules/.
2. **Structure Sections** — Organize into high-value sections: Project Overview (brief), Tech Stack, Code Standards, File Structure, Common Commands, Testing, Known Issues. Omit anything better suited for rules/.
3. **Write with Information Density** — Every sentence must earn its tokens. Use tables over paragraphs. Use bullet points over prose. Use code examples only when essential. Avoid restating what Claude Code already knows (e.g., don't explain how to use git).
4. **Define Behavioral Constraints** — Explicitly state what Claude Code should NOT do (anti-patterns, forbidden approaches). These are high-value instructions.
5. **Add Project-Specific Knowledge** — Include information Claude Code cannot infer: internal API conventions, non-obvious file relationships, deployment quirks, environment-specific gotchas.
6. **Set Persona (Optional)** — If the project benefits from a specific interaction style, define it briefly at the top of CLAUDE.md.
7. **Measure Token Budget** — Estimate token count of the final CLAUDE.md. Trim if over budget. Every section must justify its token cost.

## Quality Gates

- CLAUDE.md must be within token budget
- No section should duplicate information available in .claude/rules/
- Anti-patterns section must be present
- File must be valid Markdown
- Information density score >= 3/5 for every section

## Output Format

Complete CLAUDE.md file with section comments indicating token cost estimates.
