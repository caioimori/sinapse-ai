# Multi-Client Roadmap Management

## Framework for 3-5 Concurrent Client Backlogs
- Unified backlog view: single source of truth with client-specific tags
- Client-specific swimlanes: visual separation by client in board view
- Shared resource pool: team members assigned across clients with capacity limits
- Priority stack ranking: global priority across all clients, not per-client silos

## Prioritization Across Clients

### ICE Scoring
| Factor | Scale | Description |
|--------|-------|-------------|
| Impact | 1-10 | Business value to client |
| Confidence | 1-10 | Certainty of impact estimate |
| Ease | 1-10 | Implementation simplicity |
Score = Impact x Confidence x Ease

### RICE Scoring
| Factor | Description |
|--------|-------------|
| Reach | Users/revenue affected per quarter |
| Impact | Per-user value (0.25, 0.5, 1, 2, 3) |
| Confidence | % certainty (100%, 80%, 50%) |
| Effort | Person-weeks required |
Score = (Reach x Impact x Confidence) / Effort

### Client Tier Multiplier
Apply multiplier to final score based on client tier:
- Tier 1 (strategic): 1.5x
- Tier 2 (growth): 1.2x
- Tier 3 (maintenance): 1.0x

## Resource Allocation
- Capacity-based: each person has 8 points/sprint, allocated across clients
- Skill-based matching: assign based on expertise fit, not just availability
- Buffer management: reserve 20% capacity for urgent requests and tech debt
- Rotation policy: rotate team members across clients quarterly to prevent knowledge silos

## Conflict Resolution
When clients compete for same team:
- P0 (Critical): Production down → immediate, any client
- P1 (High): Revenue-impacting → within 24h, Tier 1 first
- P2 (Medium): Feature delivery → sprint planning, score-based
- P3 (Low): Nice-to-have → backlog, score-based
- Escalation: unresolved conflicts go to account director within 48h

## Communication Cadence
| Activity | Frequency | Participants |
|----------|-----------|-------------|
| Client standup | 2-3x/week | Client PM + delivery team |
| Cross-client sync | Weekly | All PMs + product ops |
| Client stakeholder update | Bi-weekly | Client stakeholders + PM |
| Portfolio review | Monthly | All PMs + leadership |

## Roadmap Visualization
- **Now/Next/Later** format: avoids false precision of dates
- **Client-specific views**: filtered roadmap per client for stakeholder meetings
- **Dependency mapping**: cross-client dependencies flagged and tracked
- **Capacity heatmap**: visual overlay showing team utilization by client
