---
task: "status-dynamics-negotiation"
responsavel: "keith-johnstone"
responsavel_type: "agent"
atomic_layer: true
elicit: true
Entrada:
  - "Negotiation context and parties involved"
  - "Desired outcome and relationship dynamics"
Saida:
  - "Negotiation strategy using status theory with status plays mapped to key moments"
Checklist:
  - "[ ] Status dynamics mapped for all parties"
  - "[ ] Status play sequence designed for each negotiation phase"
  - "[ ] Flexibility plan for adapting when status shifts unexpectedly"
---

# Task: Status Dynamics for Negotiation

**Task ID:** NARR-043
**Version:** 1.0.0
**Command:** `*status-dynamics-negotiation`
**Agent:** Keith Johnstone (keith-johnstone)
**Purpose:** Apply Johnstone's status theory to negotiation strategy, designing intentional status plays that build rapport, establish credibility, and drive desired outcomes.

---

## Inputs

| Input | Source | Required |
|-------|--------|----------|
| `negotiation_context` | What is being negotiated | YES |
| `parties` | Who is involved, their roles, and power dynamics | YES |
| `desired_outcome` | What you want to achieve | YES |
| `relationship_goal` | Short-term deal vs long-term partnership | YES |
| `known_dynamics` | Any existing relationship history | PREFERRED |
| `cultural_context` | Cultural norms that affect status | NO |

## Execution Phases

### Phase 1: Map Status Dynamics

1. Rate each party's "natural" status in this context (1-10):
   - Positional status: Title, role, organizational authority
   - Expertise status: Knowledge, experience, credentials
   - Resource status: Money, time, alternatives (BATNA)
   - Social status: Network, reputation, relationships
2. Identify status gaps — where is the asymmetry?
3. Map default status behaviors each party likely displays:
   - High-status signals: Still body, direct eye contact, slow speech, taking space
   - Low-status signals: Fidgeting, looking away, rapid speech, apologizing
4. Identify status traps — situations that could force you into unwanted low status

### Phase 2: Design Status Strategy

1. Determine optimal status position for each phase:
   - **Opening**: Slightly lower status than the other party (creates rapport through deference)
   - **Building**: Gradual status rise through demonstrated expertise
   - **Proposing**: Peer-level status (equal footing for fair deal)
   - **Closing**: Slightly higher status (confidence in the outcome)
2. Design status "see-saws" — intentional moments where you raise or lower your status
3. Plan "status gifts" — moments where you intentionally raise the OTHER party's status
   - Complimenting their expertise, acknowledging their position, asking for their opinion
4. Plan "status claims" — moments where you establish your own value
   - Sharing a relevant credential, making a confident statement, taking a firm position

### Phase 3: Design Status Plays for Key Moments

1. **The Opening:** Lower status slightly — "I'm grateful for your time" (builds goodwill)
2. **The Expertise Drop:** Raise status naturally — share an insight that reframes the discussion
3. **The Empathy Play:** Lower status intentionally — "I could be wrong, but..." (disarming)
4. **The Anchor:** High-status move — make the first offer with confidence and silence
5. **The Concession:** Status gift — "That's a fair point" (acknowledges their status without losing yours)
6. **The Close:** Peer status — "I think we've found something that works for both of us"
7. **The Walk-Away:** Highest-status move — willingness to leave maintains power

### Phase 4: Plan for Status Shifts

1. What to do when the other party raises their status unexpectedly:
   - Don't compete immediately — absorb, then redirect
   - Use humor to neutralize (laughter is the great status equalizer)
   - Ask a question that requires them to teach you something (flattering but recentering)
2. What to do when the other party lowers YOUR status:
   - Don't react defensively (confirms the status loss)
   - Make a calm, specific statement that re-establishes expertise
   - Change the subject to territory where your status is naturally higher
3. What to do in group negotiations with mixed status dynamics:
   - Identify the real decision-maker (not always the highest-title person)
   - Align your status plays to the actual power holder
   - Use "we" language to create group-level status alignment

### Phase 5: Build the Negotiation Playbook

1. Script the first 60 seconds (most important for status establishment)
2. Map 5 key moments where status will be most impactful
3. Create "if/then" responses for the top 3 status challenges
4. Design the body language plan (Johnstone's physical status markers)
5. Plan the environment: seating, timing, materials that support your status strategy
6. Practice sequence: rehearse status transitions from low → peer → high → peer

## Output Format

```yaml
negotiation_status_strategy:
  context: "{what's being negotiated}"
  parties:
    - party: "{name/role}"
      natural_status: "{1-10}"
      status_signals: ["{typical behaviors}"]
      status_leverage: "{their source of power}"
  status_strategy:
    opening: "{status position and technique}"
    building: "{how to gradually shift}"
    proposing: "{peer-level approach}"
    closing: "{confidence signals}"
  status_plays:
    - moment: "{key negotiation moment}"
      play: "{what to do}"
      status_direction: "{raise/lower/gift}"
      rationale: "{why this works here}"
  contingencies:
    - scenario: "{status shift event}"
      response: "{how to adapt}"
  environment_plan:
    seating: "{arrangement}"
    timing: "{when and how long}"
    materials: "{what supports status}"
  first_sixty_seconds: "{scripted opening}"
  body_language:
    high_status: ["{specific physical signals}"]
    low_status: ["{specific physical signals}"]
    transitions: ["{how to shift physically}"]
```

## Veto Conditions

- **NEVER** compete in status wars — intentional status play is strategic, not ego-driven
- **NEVER** stay in low status for too long — it becomes the permanent dynamic
- **NEVER** ignore cultural context — status signals vary dramatically across cultures
- **NEVER** script rigidly — status dynamics are improvisational and must adapt in real-time

## Completion Criteria

- [ ] Status dynamics mapped for all parties with numerical ratings
- [ ] Status strategy designed for each negotiation phase
- [ ] Key status plays scripted for critical moments
- [ ] Contingency plans for unexpected status shifts
- [ ] Body language plan aligned with status strategy
- [ ] First 60 seconds scripted for optimal status establishment
