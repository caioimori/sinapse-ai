---
task: "employee-advocacy-stories"
responsavel: "kindra-hall"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Organization context and culture"
  - "Advocacy goals (recruitment, engagement, brand)"
Saida:
  - "Employee storytelling program with frameworks and story collection system"
Checklist:
  - "[ ] Internal story types defined (Culture, Growth, Impact, Belonging)"
  - "[ ] Story collection process designed with interview guides"
  - "[ ] Employee stories structured for internal and external deployment"
---

# Task: Employee Advocacy Stories

**Task ID:** NARR-037
**Version:** 1.0.0
**Command:** `*employee-advocacy-stories`
**Agent:** Kindra Hall (kindra-hall)
**Purpose:** Build an employee storytelling program that strengthens culture internally and employer brand externally, using Hall's story structure methodology.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `organization` | Company, size, industry, culture | YES |
| `advocacy_goals` | Recruitment, engagement, employer brand, retention | YES |
| `culture_values` | Stated values and cultural norms | YES |
| `existing_programs` | Current employee engagement or advocacy initiatives | PREFERRED |
| `target_audience` | Prospective employees, current team, external market | NO |

## Execution Phases

### Phase 1: Define Internal Story Types

1. **Culture Stories** — "What it's really like to work here"
   - Moments that embody values in action (not posters on walls)
   - Stories of how things are done differently here
2. **Growth Stories** — "How I became who I am here"
   - Career development, skill acquisition, mentorship
   - The moment an employee realized they had grown
3. **Impact Stories** — "How my work matters"
   - Customer lives changed, projects that made a difference
   - The "why" behind the daily work
4. **Belonging Stories** — "How I found my place"
   - Inclusion moments, team bonding, feeling seen
   - When someone went from "working here" to "being part of this"

### Phase 2: Design the Story Collection Process

1. Create a story interview guide with 5 open-ended questions per story type:
   - Culture: "Tell me about a time when something happened here that wouldn't happen anywhere else"
   - Growth: "What can you do now that you couldn't do when you started?"
   - Impact: "When did you realize your work actually mattered to someone?"
   - Belonging: "When did you first feel like you truly belonged here?"
2. Design the "story harvest" event — a structured workshop where teams share stories
3. Create an anonymous story submission channel (for introverts and sensitive stories)
4. Train 5-10 "story champions" — employees who help others find and tell their stories
5. Plan quarterly collection cadence with rotating themes

### Phase 3: Structure Employee Stories

For each collected story:
1. Apply Normal → Explosion → New Normal:
   - Normal: What was the employee's world before this moment?
   - Explosion: What happened that created the change/realization?
   - New Normal: What is different now because of this experience?
2. Find the "universal moment" — the line that any employee (current or future) would relate to
3. Ensure the employee's voice is preserved — edit for clarity, not for corporate polish
4. Connect to a specific company value (naturally, not forced)
5. Add the "I stayed because..." bridge for retention-focused stories

### Phase 4: Create Deployment Strategy

1. **Internal deployment:**
   - All-hands meetings: Feature one story per meeting
   - Onboarding: New hires hear stories from each department
   - Internal newsletter: Story of the week/month
   - Slack/Teams: Story channel with regular contributions
2. **External deployment:**
   - Careers page: Stories by role, department, and experience level
   - Social media: Employee takeovers with guided storytelling
   - Glassdoor/LinkedIn: Structured employee narratives
   - Recruitment materials: Stories matched to open role types
3. For each channel, specify the format (video, written, audio, carousel)

### Phase 5: Build the Ongoing Program

1. Design recognition: employees who share stories are celebrated
2. Create the "story library" — searchable database of employee stories
3. Measure impact: track engagement, applicant quality, retention correlation
4. Plan annual "Story Summit" — an event celebrating the best stories of the year
5. Design the feedback loop: how stories inform culture initiatives
6. Create manager guide: how to spot, encourage, and share team stories

## Output Format

```yaml
employee_advocacy:
  organization: "{name}"
  goals: ["{recruitment, engagement, brand}"]
  story_types:
    culture:
      description: "{what it captures}"
      interview_questions: ["{5 questions}"]
      example_story: "{structured example}"
    growth:
      description: "{what it captures}"
      interview_questions: ["{5 questions}"]
      example_story: "{structured example}"
    impact:
      description: "{what it captures}"
      interview_questions: ["{5 questions}"]
      example_story: "{structured example}"
    belonging:
      description: "{what it captures}"
      interview_questions: ["{5 questions}"]
      example_story: "{structured example}"
  collection_process:
    interview_guide: "{complete guide}"
    story_harvest_event: "{workshop design}"
    submission_channel: "{anonymous option}"
    champions: "{training plan}"
    cadence: "{quarterly themes}"
  deployment:
    internal: ["{channels and formats}"]
    external: ["{channels and formats}"]
  program_design:
    recognition: "{how storytellers are celebrated}"
    story_library: "{database design}"
    metrics: ["{what to measure}"]
    annual_event: "{Story Summit design}"
    manager_guide: "{how leaders participate}"
```

## Veto Conditions

- **NEVER** force employees to tell stories — voluntarism is essential for authenticity
- **NEVER** edit out the employee's voice — clarity yes, corporate polish no
- **NEVER** use employee stories without their explicit consent
- **NEVER** only share "happy" stories — authentic culture includes challenge and growth

## Completion Criteria

- [ ] Four internal story types defined with interview guides
- [ ] Story collection process designed (interviews, harvests, submissions)
- [ ] Story champion training plan created
- [ ] Deployment strategy covers both internal and external channels
- [ ] Ongoing program designed with recognition, metrics, and cadence
- [ ] Manager guide created for leadership participation
