---
task: multi-turn-conversation-design
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

# Multi-Turn Conversation Design

## Objective

Design multi-turn conversation flows for AI agents that maintain context coherence, handle branching dialogue paths, manage state across turns, and gracefully handle interruptions, topic switches, and clarification loops.

## Pre-Conditions

- Agent persona and domain scope defined
- Target conversation scenarios identified (onboarding, troubleshooting, data collection, etc.)
- Maximum expected conversation length established
- State management requirements documented
- Error recovery patterns needed identified

## Steps

1. **Map Conversation Goals** — Identify the primary goals a conversation must achieve: information gathering, task completion, decision support, or knowledge transfer. For each goal, define the minimum turns required and the success criteria.
2. **Design Conversation States** — Create a state machine for the conversation: initial state, intermediate states (gathering info, processing, confirming), terminal states (success, failure, escalation). Define transitions between states with trigger conditions.
3. **Build Turn Templates** — For each conversation state, design the agent's turn template: what information to request, how to acknowledge previous input, what context to reference, and what options to present. Include both the prompt text and the expected response format.
4. **Implement Context Tracking** — Design how the agent tracks information across turns: accumulated data (user preferences, collected inputs), conversation history summary, current state, and pending actions. Define what gets stored vs. what can be re-derived.
5. **Handle Branching Paths** — Map decision points where the conversation can diverge: user provides unexpected input, user asks a side question, user wants to go back. For each branch, define how to handle it and how to return to the main flow.
6. **Design Clarification Loops** — Create patterns for handling ambiguous or incomplete inputs: ask for clarification with specific options, provide examples of valid inputs, offer defaults, and set a maximum clarification attempts (3) before escalating.
7. **Implement Interruption Recovery** — Design how the agent handles mid-conversation interruptions: topic switches (park current topic, address new one, offer to resume), corrections (update stored state, acknowledge the correction), and abandonment (summarize progress, offer to save state).
8. **Add Progressive Disclosure** — Structure information delivery across turns: start with high-level overview, drill down based on user interest, avoid overwhelming with all details at once. Define depth levels and triggers for going deeper.
9. **Test Conversation Flows** — Walk through each conversation path manually: happy path (goal achieved in minimum turns), extended path (clarifications needed), interrupted path (topic switches), and failure path (goal cannot be achieved). Document friction points.
10. **Create Flow Diagrams** — Produce visual conversation flow diagrams showing states, transitions, decision points, and terminal states. Include turn counts and branching probabilities for common paths.
11. **Write Integration Specs** — Document how the conversation design integrates with the system prompt, tool calls, and external state storage. Specify handoff points for human escalation.

## Output

```markdown
# Multi-Turn Conversation Design: {Scenario}

## Conversation Goals
| Goal | Min Turns | Success Criteria |
|------|-----------|-----------------|

## State Machine
| State | Entry Condition | Agent Action | Next States |
|-------|----------------|-------------|-------------|

## Turn Templates
### State: {state_name}
**Agent says:** {template with placeholders}
**Expects:** {input format}
**Transitions:** {conditions -> next states}

## Context Tracking
| Field | Source Turn | Persists Until | Usage |
|-------|-----------|---------------|-------|

## Branching Handlers
| Branch Type | Detection | Handler | Return Path |
|-------------|-----------|---------|-------------|

## Flow Diagram
{mermaid or ASCII diagram}

## Test Paths
| Path | Turns | Outcome | Issues Found |
|------|-------|---------|-------------|
```

## Quality Criteria

- Conversation must reach its goal in under 10 turns for the happy path
- Every state must have at least one exit transition (no dead ends)
- Clarification loops must resolve within 3 attempts or escalate
- Interruption recovery must preserve all previously collected state
- Flow diagrams must be provided for at least 3 conversation paths
- Context tracking must not accumulate unbounded state (define cleanup rules)
