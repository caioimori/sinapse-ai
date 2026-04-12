---
task: slash-command-library-design
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

# Slash Command Library Design

## Objective

Design a comprehensive library of custom slash commands (Claude Code custom commands) for a project or organization. Create reusable command definitions that encode team workflows, enforce standards, and accelerate common development tasks through parameterized prompt templates.

## Pre-Conditions

- Common team workflows and repetitive tasks identified
- Claude Code custom commands feature understood (/.claude/commands/ structure)
- Team roles and their most frequent Claude Code interactions documented
- Naming convention for commands established
- Output format standards defined

## Steps

1. **Audit Common Workflows** — Interview team members or review conversation history to identify the 20 most common tasks: creating components, writing tests, reviewing code, updating documentation, debugging issues, creating migrations, refactoring patterns, and generating boilerplate.
2. **Categorize Commands** — Group commands by function: scaffolding (create new files/components), analysis (review, audit, assess), transformation (refactor, migrate, update), documentation (generate docs, update changelog), and workflow (run pipelines, coordinate tasks).
3. **Design Command Schema** — For each command, define: name (verb-noun, e.g., create-component), description (one-line purpose), parameters (with types and defaults), prompt template (the instruction Claude receives), and expected output format.
4. **Write Prompt Templates** — For each command, write the prompt template that will be injected when the command is invoked. Include: clear objective, step-by-step instructions, output format specification, quality criteria, and parameter substitution points (using $ARGUMENTS or named parameters).
5. **Implement Parameter Handling** — Design how commands accept and use parameters: positional arguments ($ARGUMENTS), named flags (--name value), defaults for optional parameters, and validation rules. Document parameter syntax for each command.
6. **Create Command Hierarchies** — Organize commands into namespaces: /project:create-component, /project:create-test, /review:code, /review:security, /docs:generate. This prevents naming collisions and makes discovery easier.
7. **Build Composition Patterns** — Design commands that can chain together: /scaffold:feature creates files, then /test:generate creates tests for them, then /docs:component documents them. Define the data flow between composed commands.
8. **Add Guard Rails** — Include safety checks in command templates: verify preconditions before executing (required files exist, correct directory), validate parameters, and include rollback instructions for destructive commands.
9. **Create Discovery System** — Build a command index with: command name, category, description, usage example, and parameter reference. Make it accessible via a meta-command like /help or /commands.
10. **Test All Commands** — Execute each command with: standard parameters (happy path), edge case parameters (empty, very long, special characters), missing required parameters, and incorrect parameter types. Verify output quality and format compliance.
11. **Write User Guide** — Document: how to use commands, how to add new commands, naming conventions, parameter syntax, and troubleshooting common issues.

## Output

```markdown
# Slash Command Library

## Command Index
| Command | Category | Description | Parameters |
|---------|----------|-------------|-----------|

## Command Definitions

### /{namespace}:{command-name}
**Description:** {what it does}
**Parameters:**
- `{param}` ({type}, {required/optional}): {description}

**Prompt Template:**
```
{complete prompt template with $ARGUMENTS placeholders}
```

**Usage Example:**
```
/{namespace}:{command-name} {example arguments}
```

**Expected Output:** {description of output format}

## Composition Patterns
| Workflow | Commands | Data Flow |
|----------|----------|-----------|

## File Structure
```
.claude/commands/
├── {namespace}/
│   ├── {command-name}.md
│   └── {command-name}.md
```

## User Guide
{usage instructions}
```

## Quality Criteria

- Library must include at least 15 commands covering all 5 categories
- Every command must produce consistent output across 3+ test runs
- Prompt templates must be under 500 tokens each (concise but complete)
- Command namespaces must have no naming collisions
- Parameter validation must catch invalid inputs before execution
- Discovery system must enable finding any command within 10 seconds
