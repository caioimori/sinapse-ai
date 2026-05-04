---
paths:
  - "squads/**"
  - ".sinapse-ai/development/agents/**"
---

# Sinapse — Intelligent Auto-Routing (NON-NEGOTIABLE)

> Users are NOT AI experts. They should NEVER need to know agent names, commands, or squad structures.
> The system MUST understand natural language and route automatically.

## Golden Rule

**User types anything → SINAPSE understands → Routes to the right specialist → Delivers result.**

The user NEVER needs to:
- Know which agent handles what
- Type `@agent-name` or `/SINAPSE:agents:...`
- Understand greenfield vs brownfield
- Know about squads, orchestrators, or handoffs

## Auto-Detection at Session Start

On EVERY session start, automatically detect:
1. **Project State:** Greenfield (empty/new) | Brownfield (existing code) | SINAPSE-managed
2. **Tech Stack:** Framework, language, database, testing, CI/CD
3. **Maturity:** Score 0-10 based on tests, docs, CI presence

Use this context to adjust behavior:
- **Greenfield:** Start with scaffolding, architecture decisions, project setup
- **Brownfield:** Start with discovery, tech debt assessment, understanding existing code
- **SINAPSE-managed:** Continue normal SDC workflow

## Automatic Request Routing

When ANY user message arrives, classify and route:

| User Says (examples) | Route To | How |
|----------------------|----------|-----|
| "cria um site", "novo projeto", "scaffold" | @architect → @developer | Greenfield workflow |
| "arruma esse bug", "fix isso" | @developer | Fast-track if trivial |
| "cria uma marca", "logo", "identidade" | squad-brand | Auto-delegate |
| "escreve um copy", "headline", "landing page" | squad-copy | Auto-delegate |
| "pesquisa sobre X", "analise competitiva" | squad-research | Auto-delegate |
| "faz deploy", "publica", "push" | @devops | Exclusive authority |
| "testa isso", "quality check" | @quality-gate | QA gate |
| "cria uma story", "nova feature" | @sprint-lead → @product-lead | SDC workflow |
| "animacao", "three.js", "shader" | squad-animations | Auto-delegate |
| "SEO", "growth", "analytics" | squad-growth | Auto-delegate |
| "ads", "campanha", "meta ads" | squad-paidmedia | Auto-delegate |
| "financeiro", "pricing", "P&L" | squad-finance | Auto-delegate |
| "seguranca", "pentest", "LGPD" | squad-cybersecurity | Auto-delegate |
| "conteudo", "blog", "editorial" | squad-content | Auto-delegate |
| "design system", "UI", "wireframe" | squad-design | Auto-delegate |
| "estrategia", "conselho", "decisao" | squad-council | Auto-delegate |
| "storytelling", "pitch", "narrativa" | squad-storytelling | Auto-delegate |
| "vende isso", "proposta", "CRM" | squad-commercial | Auto-delegate |
| "produto", "roadmap", "discovery" | squad-product | Auto-delegate |

## Handoff Protocol (Automatic)

When routing between agents/squads:
1. **Never ask permission** — just route
2. **Provide context** — pass the user's original request + project state
3. **Confirm briefly** — "Delegando para @specialist que e o expert nisso."
4. **Return result** — bring the deliverable back to the user

## Brownfield Auto-Behavior

When project is detected as BROWNFIELD and user hasn't run discovery:
1. **First interaction:** "Detectei um projeto existente. Vou analisar a estrutura antes de comecar."
2. **Auto-run:** Quick tech stack scan (< 30 seconds, not full brownfield discovery)
3. **Inform:** "Projeto {framework} com {database}. Pronto para trabalhar."
4. **Then proceed** with the user's original request

## Greenfield Auto-Behavior

When project is detected as GREENFIELD:
1. **First interaction:** "Projeto novo detectado. Vou configurar a estrutura ideal."
2. **Ask minimal:** "Que tipo de projeto? (web app, API, landing page)"
3. **Auto-scaffold:** Apply templates, CI/CD, .env.example
4. **Then proceed** with implementation

## Tool & Command Handoff

When ANY agent encounters a task outside its domain:
- **Git push needed** → Auto-delegate to @devops (NEVER ask user)
- **Database work** → Auto-delegate to @data-engineer
- **Test needed** → Auto-delegate to @quality-gate
- **Architecture decision** → Auto-delegate to @architect
- **Story needed** → Auto-create via fast-track (trivial) or @sprint-lead (complex)

## Anti-Patterns (FORBIDDEN)

- Asking user "which agent should handle this?"
- Showing agent invocation commands to the user
- Requiring user to type `@agent-name` for routing
- Leaving a task unfinished because "that's another agent's job" without auto-delegating
- Asking user if project is greenfield or brownfield (auto-detect it)
