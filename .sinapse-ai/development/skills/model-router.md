---
name: model-router
description: Decide which model to use for sub-agent tasks
trigger: When spawning sub-agents or deciding task complexity
agents: [developer, quality-gate, architect, analyst]
---

# Model Router Skill

## Usage

Invoke with `*model-router` or `/model-router` to determine the optimal model for a sub-agent task. Can also be used as internal guidance when orchestrating multi-agent workflows.

## Decision Tree

```
Task received
├── Can be done WITHOUT sub-agent? (file read, grep, simple command)
│   └── YES → Do it directly. No sub-agent needed.
│       Cost: $0 additional. Fastest path.
│
└── Needs sub-agent?
    ├── Routine / mechanical work?
    │   └── YES → model: "haiku"
    │
    ├── Standard implementation / analysis?
    │   └── YES → model: "sonnet"
    │
    └── Complex reasoning / architecture?
        └── YES → model: "opus" (default)
```

## Model Selection Matrix

### No Sub-Agent (direct execution)
| Task | Why |
|------|-----|
| Read a file | Native tool, instant |
| Grep for pattern | Native tool, instant |
| Run a test | Single bash command |
| Check git status | Single bash command |
| Simple file edit | Native tool, instant |

### Haiku (fast, cheap — routine work)
| Task | Why |
|------|-----|
| Lint check on file list | Mechanical, no judgment |
| Format code | Pattern-based, deterministic |
| Generate boilerplate | Template-driven |
| Parse and extract data | Structural, low ambiguity |
| Rename variables | Find-and-replace logic |
| Validate JSON/YAML syntax | Structural validation |
| Run checklist items | Binary pass/fail |

### Sonnet (balanced — standard work)
| Task | Why |
|------|-----|
| Implement a function from spec | Needs understanding but well-scoped |
| Write unit tests | Requires code comprehension |
| Code review (non-architectural) | Pattern recognition + judgment |
| Bug fix with known root cause | Targeted reasoning |
| Documentation from code | Comprehension + writing |
| Refactor within a file | Understanding + transformation |
| Story creation from brief | Structured writing |

### Opus (full power — complex reasoning)
| Task | Why |
|------|-----|
| Architecture decisions | Multi-dimensional tradeoffs |
| Complex debugging (unknown cause) | Deep reasoning required |
| Cross-system integration | Multiple context domains |
| Security audit | Nuanced threat modeling |
| Spec critique / validation | Judgment under uncertainty |
| Multi-file refactoring | System-wide understanding |
| Novel problem solving | No established pattern to follow |

## Rules
- Default to direct execution when possible (cost: $0, speed: instant)
- When in doubt between tiers, pick the LOWER one first — escalate if poor results
- Never use Opus for tasks Haiku can handle
- Log model selection rationale for cost tracking
- Sub-agent model is set via `model:` parameter in Task tool

## Output

```
## Model Router Decision
- Task: {description}
- Classification: {routine|standard|complex|direct}
- Model: {haiku|sonnet|opus|none}
- Rationale: {one-line reason}
```
