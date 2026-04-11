---
name: research-synthesis
description: Synthesize findings from multiple sources into actionable summary
trigger: After research phase or on demand
agents: [analyst, architect, project-lead]
---

# Research Synthesis Skill

## Usage

Invoke with `*research-synthesis` or `/research-synthesis` after gathering research data.

## Input

Accepts any combination of:
- Web search results (from EXA or manual search)
- Documentation excerpts
- Code analysis findings
- Competitor analysis data
- File paths containing raw research

## Protocol

### 1. Collect
- Gather all source materials (files, search results, notes)
- Tag each source with origin and confidence level

### 2. Deduplicate
- Remove redundant findings across sources
- Keep the most authoritative version of each fact

### 3. Categorize
| Category | Description |
|----------|-------------|
| Facts | Verified, multiple sources agree |
| Insights | Patterns or conclusions derived from facts |
| Risks | Potential problems or concerns identified |
| Opportunities | Actionable improvements or options |
| Unknowns | Questions that remain unanswered |

### 4. Synthesize
- Cross-reference findings for consistency
- Identify contradictions between sources
- Rank by relevance to the current objective

### 5. Output

```
## Research Synthesis — {topic}

### Key Findings
1. {finding with source reference}
2. {finding with source reference}

### Recommendations
- {actionable recommendation}

### Risks
- {risk with mitigation suggestion}

### Open Questions
- {question needing further investigation}

### Sources
| # | Source | Confidence |
|---|--------|------------|
| 1 | {url or file} | HIGH |
| 2 | {url or file} | MEDIUM |
```

## Rules
- Every finding must reference its source
- Confidence levels: HIGH (multiple sources), MEDIUM (single reliable), LOW (unverified)
- Contradictions must be explicitly called out, not silently resolved
- Keep synthesis under 500 words — link to raw data for details
- Save output to `docs/research/` if part of a formal research task
