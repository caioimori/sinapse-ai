# Obsidian + Claude Code Integration

> Patterns for connecting Obsidian vaults with Claude Code agents. Based on MS-009 Sistema 12 + production patterns.

---

## The Stack: Obsidian + Claude Code

In 2026, this is the most powerful combination for Agentic Second Brains:

- **Obsidian:** Most mature local-first vault tool, 1,000+ plugins, graph view, markdown-native
- **Claude Code:** Agent runtime with filesystem access, hooks, skills, MCP support
- **MCP:** Protocol connecting the two (filesystem, search, vault operations)

**Architecture:**
```
+--------------------+     +-------------------+
|  OBSIDIAN          |     |  CLAUDE CODE      |
|  (UI + Plugins)    |     |  (Agent Runtime)  |
|                    |     |                   |
|  Graph View    <---+---->|  Vault Access     |
|  Editor        <---+---->|  File Read/Write  |
|  Search        <---+---->|  Grep/Glob        |
|  Templates     <---+---->|  Note Generation  |
|  Daily Notes   <---+---->|  Daily Pipeline   |
|                    |     |                   |
+--------+-----------+     +--------+----------+
         |                          |
         v                          v
+--------+-----------+     +--------+----------+
|  LOCAL FILESYSTEM  |     |  MCP LAYER        |
|  (Markdown Vault)  |     |  (Tool Protocol)  |
+--------+-----------+     +--------+----------+
         |                          |
         v                          v
+--------+-----------+     +--------+----------+
|  GIT               |     |  VECTOR STORE     |
|  (Version Control) |     |  (Embeddings)     |
+--------------------+     +-------------------+
```

---

## CLAUDE.md as Vault Constitution

Claude Code reads CLAUDE.md at session start as permanent agent instructions. In a vault, this becomes the **constitution of knowledge governance**.

### Template: Vault CLAUDE.md

```markdown
# Second Brain Constitution

## Vault Rules
- Every note MUST have frontmatter: date, tags, status
- Links use [[wikilink]] format
- One idea = one note (atomicity rule)
- Capture notes go to 00-inbox/
- Processed notes move to appropriate folder

## Agent Permissions
| Agent | Can Write | Read-Only |
|-------|-----------|-----------|
| Capture Agent | 00-inbox/ | — |
| Curation Agent | All folders (link, tag, move) | — |
| Research Agent | 00-inbox/ only | Everything |
| Maintenance Agent | Status fields only | Everything |

## Knowledge Standards
- Every factual claim needs a source
- Dates: created_date + updated_date on every note
- Review schedule by type:
  - Technical notes: quarterly
  - Decisions: semi-annually
  - Facts: continuous verification

## Compact instructions
- Preserve current note path being edited
- Preserve any pending vault operations
- Preserve connection suggestions not yet applied

## Naming Conventions
- Files: lowercase-with-hyphens.md
- Dates: YYYY-MM-DD format
- No special characters except hyphens and underscores
```

---

## Conversation-to-Knowledge Pipeline

### The Core Automation

```
[Claude Code session ends]
  ↓
  PreCompact hook captures session digest
  ↓
  Cron job (e.g., daily at 23:00) triggers review agent
  ↓
  For each session:
    Extract: decisions, insights, facts, patterns
    Classify by note type
    For each extracted item:
      Semantic search in vault for duplicates
      If new: create note from template
      If existing: enrich with new context
      Auto-link with related notes
  ↓
  Update knowledge graph indices
  ↓
  Generate daily summary in 01-daily/
  ↓
  Git commit + push (backup)
```

### PreCompact Hook for Session Capture

```bash
#!/bin/bash
# .claude/hooks/capture-session-digest.sh
# Runs before each compaction — captures session digest

SESSION_ID="${CLAUDE_SESSION_ID:-unknown}"
DATE=$(date +%Y-%m-%d)
VAULT_SESSIONS="$HOME/vault/01-daily/sessions"

mkdir -p "$VAULT_SESSIONS"

# Write digest to vault
cat > "$VAULT_SESSIONS/session-$SESSION_ID-$DATE.md" << EOF
---
date: $DATE
session_id: $SESSION_ID
type: session-digest
status: unprocessed
---

# Session Digest

## Summary
$HOOK_COMPACT_SUMMARY

## Key Decisions
$HOOK_KEY_DECISIONS

## Files Modified
$HOOK_FILES_MODIFIED
EOF

exit 0
```

---

## Obsidian-Specific Note Format

### Standard Note Frontmatter

```yaml
---
title: "Note Title"
date: 2026-04-10
updated: 2026-04-10
tags: [tag1, tag2, area/subtopic]
status: draft|active|evergreen|archived
type: concept|decision|insight|reference|project|person
source: "URL or source reference"
related: [[note-a]], [[note-b]]
review_by: 2026-07-01
---
```

### Wikilink Handling for Agents

Obsidian uses `[[wikilinks]]` not standard markdown links. Agents must use this format when creating/editing vault notes.

**Correct (Obsidian):**
```markdown
See [[context-engineering-guide]] for details.
Related to [[memory-systems-reference]].
```

**Wrong (standard markdown):**
```markdown
See [context engineering guide](context-engineering-guide.md) for details.
```

### Frontmatter for Bases Databases (Obsidian 1.12+)

Obsidian 1.12 introduced structured databases using frontmatter. Agents should write compatible frontmatter:

```yaml
---
# For project tracking database
project: "Sprint 23"
story_id: "2.3"
status: "InProgress"
priority: "High"
assignee: "Caio"
due_date: 2026-04-15
```

---

## Skills for Vault Operations

### /capturar — Capture Insight to Vault

```yaml
---
name: capturar
description: |
  Capture an insight, decision, or fact from the current conversation to the Obsidian vault.
  Use when: user says "capture this", "save this to my vault", "remember this insight",
  or when a significant decision or insight emerges that should be preserved.
---

## Process

1. Identify the core insight (1-3 sentences, distilled)
2. Determine note type: concept | decision | insight | reference
3. Search vault for existing related notes (use Grep + Glob)
4. If note exists: ENRICH (add new context, update date)
5. If new: CREATE from template (see below)
6. Add [[wikilinks]] to related existing notes
7. Move to appropriate folder based on type

## Template: New Insight Note

```frontmatter
---
title: "{Title}"
date: {today}
updated: {today}
tags: [{domain}, insight]
status: draft
type: insight
source: "Claude Code session {session_id}"
related: {related_notes}
---

# {Title}

{Distilled insight in 1-3 sentences}

## Context
{When/where/why this insight emerged}

## Implications
{What this means for the work}

## Open Questions
{What remains uncertain}
```
```

### /conectar — Find and Create Links

```yaml
---
name: conectar
description: |
  Find existing vault notes related to a given concept and create [[wikilinks]] between them.
  Use when: after creating a new note, when user says "connect this to vault",
  or when patterns of related notes are detected.
---

## Process

1. Extract key concepts from source note
2. For each concept:
   a. Grep vault for mentions
   b. Glob for notes with similar titles
   c. Semantic check: are these actually related?
3. For confirmed connections:
   a. Add [[link]] to source note
   b. Add [[link]] back in target note (bidirectional)
4. Report connections created
```

### /lembrar — Retrieve from Vault

```yaml
---
name: lembrar
description: |
  Search and retrieve relevant knowledge from the Obsidian vault.
  Use when: user asks "what do I know about X?", "what did we decide about Y?",
  "find my notes on Z", or when grounding a response in vault knowledge.
---

## Process

1. Extract query concepts
2. Hybrid search:
   a. Grep for exact keyword matches
   b. Search by tags (frontmatter)
   c. Search by title patterns
3. Rank results by:
   - Recency (updated_date)
   - Relevance (keyword density)
   - Quality (status: evergreen > active > draft)
4. Return: note paths + excerpts + quality scores
```

---

## Automation Patterns

### Daily Digest Pipeline

```
Trigger: cron 23:00 BRT daily
Agent: Haiku (cost-effective for batch processing)
Input: All session digests in 01-daily/sessions/ from today

For each session digest:
  1. Extract: decisions, insights, facts, patterns, actions
  2. For each item:
     a. Check vault for duplicates (semantic)
     b. Create or enrich note
     c. Connect to related notes
  3. Archive session digest (status: processed)

Output: 01-daily/{date}.md with:
  - Key insights captured
  - Connections created
  - Knowledge gaps identified
  - Stats: notes created, enriched, connected
```

### Connection Discovery (Background)

```
Trigger: When new note created in vault
Agent: Haiku (read-only access)

1. Extract entities and concepts from new note
2. Search vault for notes mentioning same entities
3. Generate connection suggestions
4. Write suggestions to note frontmatter: suggested_links: []
5. User or curation agent confirms/creates actual links
```

### Decay Detection (Weekly)

```
Trigger: cron Sunday 09:00 BRT weekly
Agent: Haiku (read-only access)

For each note in vault:
  If updated_date older than threshold for type:
    - Technical notes: 90 days
    - Decisions: 180 days
    - Facts: 45 days
  Add to decay_report.md with:
    - Note path
    - Last updated date
    - Suggested action (review/update/archive)
```

---

## Git Integration for Vault

### Auto-Commit Pattern

```bash
#!/bin/bash
# Runs after each vault modification session

cd "$VAULT_PATH"
git add -A
git commit -m "vault: daily update $(date +%Y-%m-%d)" --allow-empty-message
git push origin main --quiet
```

### 3-2-1 Backup Strategy

| Layer | Medium | Frequency | Retention |
|-------|--------|-----------|-----------|
| L1 | Git local (commits) | Every change | Unlimited |
| L2 | Cloud sync (OneDrive/iCloud) | Real-time | 30 days versions |
| L3 | Git remote (GitHub private) | Daily push | Unlimited |
| L4 | Encrypted external SSD | Weekly | Unlimited |

---

## Caio's Vault Architecture

### Current Configuration

**Path:** `C:\Users\Caio Imori\OneDrive\Caio Imori\3. B U S I S S N E S\ClaudeCode\#AI-Projects\Second-Brain`

**Routing:** `~/.claude/vault-routing.json` maps project domains to vault notes.

**Auto-grounding:** `vault-grounding.cjs` hook injects relevant vault context at session start based on project domain.

### Domain Mapping

| Domain | Vault Note | What It Covers |
|--------|-----------|----------------|
| SINAPSE | sinapse-ai-framework.md, sinapse.md | Framework, course, platform |
| Astro Brand Studio | astro-brand-studio.md | Agency, services, clients |
| @caioimori | marca-pessoal-caioimori.md | Personal brand, content |
| Colegio Modulo | colegio-modulo.md | Marketing, branding |

### Session Capture

Every Claude Code session generates a strategic summary in `ops/sessions/` via the daily cronjob (2:30 AM BRT).

---

## Troubleshooting

| Issue | Cause | Fix |
|-------|-------|-----|
| Wikilinks not resolving | Agent using markdown links | Ensure SKILL.md teaches [[wikilink]] format |
| Notes in wrong folder | Missing PARA classification in template | Add explicit folder rules to vault CLAUDE.md |
| Duplicate notes created | Missing semantic dedup step | Add Grep/Glob search before creating new notes |
| Frontmatter invalid | Special characters in YAML | Use quoted strings for values with colons |
| Obsidian not seeing new files | Sync delay | Trigger manual vault refresh or use Obsidian CLI |
| Agent modifying wrong notes | No scope constraints | Add explicit path restrictions to agent permissions |
