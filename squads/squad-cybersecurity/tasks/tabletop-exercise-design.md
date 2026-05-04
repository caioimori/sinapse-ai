---
task: tabletop-exercise-design
responsavel: "incident-responder"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: scenario_type
    tipo: enum
    origem: "user input"
    obrigatorio: true
    valores: ["ransomware", "data-breach", "insider-threat", "supply-chain", "ddos", "custom"]
  - campo: participants
    tipo: list
    origem: "user input"
    obrigatorio: true
  - campo: duration
    tipo: text
    origem: "user input"
    obrigatorio: false

Saida:
  - campo: exercise_package
    tipo: document
    destino: "IR team, stakeholders"

Checklist:
  - "[ ] Define exercise objectives and scope"
  - "[ ] Design realistic scenario with injects"
  - "[ ] Create facilitator guide"
  - "[ ] Prepare participant materials"
  - "[ ] Plan observation and evaluation criteria"
  - "[ ] Design debrief structure"
  - "[ ] Create after-action report template"
  - "[ ] Schedule and communicate exercise"
---

# Task: Tabletop Exercise Design

## Metadata
- **Squad:** squad-cybersecurity
- **Agent:** Rapid (incident-responder)
- **Complexity:** Standard

## Objective

Design and produce a complete tabletop exercise package that tests the organization's incident response capabilities through a realistic, discussion-based scenario. The exercise validates decision-making, communication, and coordination without impacting production systems.

## Pre-Conditions

- Incident response plan exists (or is being developed)
- Participants identified and availability confirmed
- Executive support for exercise
- Facilitator identified
- Previous exercise results available (if any)

## Inputs

- Scenario type (ransomware, data breach, insider threat, supply chain, DDoS, custom)
- Participant list and roles
- Duration (typically 2-4 hours)
- Specific areas to test (communication, technical response, decision-making)
- Compliance drivers (if exercise is required by regulation)

## Steps

### 1. Define Exercise Objectives
Establish measurable objectives:
| Objective | What It Tests | Success Criteria |
|-----------|-------------|-----------------|
| Decision-making speed | Can leaders make timely decisions? | Key decisions within expected timeframes |
| Communication flow | Do the right people get notified? | All required notifications identified |
| Role clarity | Does everyone know their role? | No gaps or overlaps in responsibilities |
| Plan effectiveness | Does the IR plan work? | Plan covers the scenario adequately |
| Escalation procedures | Are escalation paths clear? | Correct escalation at each decision point |

### 2. Design the Scenario
Create a realistic, multi-phase scenario:

**Scenario Framework:**
```yaml
scenario:
  title: ""
  type: ""
  threat_actor: ""
  attack_vector: ""
  target: ""
  business_context: ""
  timeline:
    phase_1: "Initial detection"
    phase_2: "Escalation and assessment"
    phase_3: "Containment decisions"
    phase_4: "Communication challenges"
    phase_5: "Recovery and aftermath"
```

### 3. Create Scenario Injects
Design timed information releases that drive the exercise:

| Time | Inject | Information Revealed | Expected Response |
|------|--------|---------------------|-------------------|
| T+0 | Alert notification | Initial detection details | Triage and assessment |
| T+15 | Scope expands | Additional affected systems found | Containment decision |
| T+30 | Business impact | Customer data potentially affected | Executive notification |
| T+45 | Media inquiry | Reporter calls about the incident | Communications response |
| T+60 | Regulatory question | Regulator asks for status update | Legal/compliance response |
| T+75 | Recovery option | Clean backup available but 24h old | Recovery decision |

### 4. Prepare Facilitator Guide
Create detailed guidance for the exercise facilitator:
- Opening remarks and ground rules
- Inject delivery timing and method
- Discussion questions per inject
- Expected responses (to guide discussion if stuck)
- Time management guidelines
- How to handle derailed discussions
- Key teaching points to emphasize

### 5. Create Participant Materials
Prepare materials for each participant:
- Exercise overview and objectives
- Role card (their specific role during the exercise)
- Reference materials (IR plan excerpts, contact lists)
- Note-taking template
- Rules of engagement (no real-world actions, safe space)

### 6. Design Discussion Questions
For each inject, prepare probing questions:
- What is your first action upon receiving this information?
- Who needs to be notified and in what order?
- What information do you need to make a decision?
- What are the risks of each option?
- How does this change your communication plan?
- What resources do you need?

### 7. Plan Observation and Evaluation
Define what observers will track:
| Evaluation Area | Criteria | Rating Scale |
|----------------|---------|-------------|
| Timeliness | Decisions made within expected timeframes | 1-5 |
| Communication | Right people notified, clear messages | 1-5 |
| Coordination | Teams working together effectively | 1-5 |
| Plan adherence | IR plan followed appropriately | 1-5 |
| Decision quality | Decisions logical and well-reasoned | 1-5 |

### 8. Design Debrief Structure
Plan the post-exercise debrief (typically 30-60 minutes):
- Hot wash: Immediate reactions (what went well, what was challenging)
- Gap identification: Where did the plan fall short?
- Surprise findings: What was unexpected?
- Action items: What needs to change?
- Positive reinforcement: Recognize good decisions and teamwork

### 9. Create After-Action Report Template
```yaml
after_action_report:
  exercise_date: ""
  scenario: ""
  participants: []

  objectives_assessment:
    - objective: ""
      met: "[yes/partially/no]"
      evidence: ""

  strengths: []
  gaps: []
  action_items:
    - item: ""
      owner: ""
      due_date: ""
      priority: ""

  ir_plan_updates_needed: []
  next_exercise_recommendation: ""
```

### 10. Finalize and Package
Assemble the complete exercise package:
- Facilitator guide
- Participant handouts
- Inject cards (sealed or timed)
- Observation worksheets
- Debrief agenda
- After-action report template
- Calendar invitation with logistics

## Output

```yaml
tabletop_exercise:
  title: ""
  scenario_type: ""
  duration: ""
  date: ""
  author: "Rapid (incident-responder)"

  objectives: []
  scenario_summary: ""
  injects: []
  facilitator_guide: ""
  participant_materials: ""
  evaluation_criteria: []
  debrief_structure: ""
  aar_template: ""
```

## Quality Criteria

- [ ] Exercise objectives are measurable
- [ ] Scenario is realistic for the organization's industry
- [ ] Injects progressively increase complexity
- [ ] Facilitator guide comprehensive enough for any facilitator
- [ ] Participant materials include role-specific information
- [ ] Evaluation criteria aligned with objectives
- [ ] Debrief structure encourages constructive discussion
- [ ] After-action report template captures actionable findings
