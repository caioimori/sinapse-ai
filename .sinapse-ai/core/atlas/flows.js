/**
 * Framework Operating Flows — the meta-workflows of how SINAPSE itself runs.
 *
 * These are NOT development workflows (those live in docs/sinapse-workflows/).
 * They are the framework's own mechanisms — agent routing, model routing, the
 * doc-first enforcement chain, constitutional gates, project classification —
 * authored as Mermaid diagrams. Both the markdown atlas and the HTML dashboard
 * render them, so "how the framework works" is shown visually in one place.
 *
 * Kept as data (id, title, purpose, mermaid) so renderers stay dumb and the set
 * is easy to extend. Mermaid is hand-written and kept simple (plain node labels,
 * no reserved chars) so it renders everywhere.
 *
 * @module core/atlas/flows
 */

'use strict';

/** @type {Array<{id:string,title:string,purpose:string,mermaid:string}>} */
const FRAMEWORK_FLOWS = [
  {
    id: 'lifecycle',
    title: 'End-to-end lifecycle',
    purpose:
      'The full spine a request travels: from briefing to shipped code, with the doc-first pipeline and gates in the middle.',
    mermaid: `flowchart TD
    U[User briefing] --> C{Classify intent + project type}
    C -->|new project| GF[Greenfield workflow]
    C -->|existing project| BF[Brownfield discovery]
    C -->|bug / tweak| SDC[Story dev cycle - YOLO]
    GF --> DOC[Doc-first pipeline]
    BF --> DOC
    DOC --> PRD[PRD] --> EPIC[Epic] --> STORY[Story - validated >= Ready] --> SPEC[Spec]
    SPEC --> GATE{{Doc-first gate}}
    SDC --> GATE
    GATE -->|missing docs| BLOCK[Blocked - produce docs first]
    GATE -->|satisfied| IMPL[Implementation - @developer]
    IMPL --> QA[QA gate + QA loop]
    QA -->|pass| SHIP[Push / PR - @devops only]
    QA -->|fail| IMPL`,
  },
  {
    id: 'agent-routing',
    title: 'Agent routing (delegation)',
    purpose:
      'How a briefing reaches the right specialist. Orchestrators route and coordinate; they never execute domain work themselves (Article VIII).',
    mermaid: `sequenceDiagram
    participant U as User
    participant I as Imperator (master -orqx)
    participant S as Squad -orqx
    participant A as Specialist agent
    U->>I: briefing (natural language)
    I->>I: diagnose domain + project type
    alt domain work
        I->>S: delegate (announce plan, await go)
        S->>A: route to specialist
        A-->>S: artifact / result
        S-->>I: consolidated
    else framework dev
        I->>A: route to framework agent (pm / architect / dev / qa)
    end
    I-->>U: business-language result (no internal jargon)`,
  },
  {
    id: 'model-routing',
    title: 'Model routing (cheapest that solves it)',
    purpose:
      'How each task picks a model tier. Heavy thinking goes into the spec; execution then mostly reads a finished doc, so token economy is a consequence.',
    mermaid: `flowchart TD
    T[Task] --> K{Kind?}
    K -->|lint / rename / yaml / bulk| H[haiku - low effort]
    K -->|feature from spec / review / bug / tests| SO[sonnet - high]
    K -->|single-file / factual| SM[sonnet - medium]
    K -->|cross-system arch / complex debug / multi-file| OP[opus - xhigh]
    K -->|Spec Pipeline COMPLEX score >= 16| OM[opus - max]
    H --> SP{>= 8 tool calls or real fan-out?}
    SO --> SP
    SM --> SP
    OP --> SP
    OM --> SP
    SP -->|yes| SUB[Spawn sub-agent]
    SP -->|no| INLINE[Run inline]`,
  },
  {
    id: 'doc-first',
    title: 'Doc-first enforcement',
    purpose:
      'What makes it impossible to start a new project without docs. The resolver answers what is missing; hooks block code writes until PRD + epic + story exist.',
    mermaid: `flowchart TD
    W[Write/Edit a code file] --> EX{Exempt path or framework repo?}
    EX -->|yes| ALLOW[Allow]
    EX -->|no| RES[doc-first-resolver: type, workflow, gate]
    RES --> GF{Greenfield + gate unsatisfied?}
    GF -->|no| STORY{Ready story exists? - story-gate}
    GF -->|yes, no PRD/epic/story| DENY[BLOCK - run greenfield flow first]
    STORY -->|yes| ALLOW
    STORY -->|no| DENY2[BLOCK - create a story]
    DENY -.->|escape: SINAPSE_SKIP_DOCFIRST=1| ALLOW
    OBS["sinapse route gives the same answer (observability)"]:::note
    RES -. shares logic .- OBS
    classDef note fill:#1c1c1c,stroke:#555,color:#aaa`,
  },
  {
    id: 'constitution-gates',
    title: 'Constitutional gates by phase',
    purpose:
      'Where each non-negotiable article fires across the lifecycle — the enforcement layer that blocks violations automatically.',
    mermaid: `flowchart LR
    subgraph PLAN[Plan]
      A3[III Documentation-First]
      A4[IV No Invention]
    end
    subgraph BUILD[Build]
      A6[VI Absolute Imports]
      A8[VIII Mandatory Delegation]
      A10[X Security & Data]
    end
    subgraph SHIP[Ship]
      A2[II Agent Authority - devops only]
      A5[V Quality First]
      A9[IX Safe Collaboration]
    end
    subgraph ALWAYS[Cross-cutting]
      A1[I CLI First]
      A7[VII Metrics Accuracy]
      A11[XI Conservative Default]
    end
    PLAN --> BUILD --> SHIP`,
  },
  {
    id: 'project-classification',
    title: 'Project classification to workflow',
    purpose:
      'How intent maps to the right workflow: site/lp/app vs platform/saas vs api/service, greenfield vs brownfield, or a light fix.',
    mermaid: `flowchart TD
    B[Briefing] --> N{New or existing?}
    N -->|existing, unknown| BD[brownfield-discovery]
    N -->|existing, known| FIX{Change size?}
    N -->|new| TYPE{Project type?}
    TYPE -->|site / lp / app| GUI[greenfield-ui]
    TYPE -->|platform / saas| GFS[greenfield-fullstack]
    TYPE -->|api / service| GSV[greenfield-service]
    BD --> BTYPE{Type?}
    BTYPE -->|ui| BUI[brownfield-ui]
    BTYPE -->|fullstack| BFS[brownfield-fullstack]
    BTYPE -->|service| BSV[brownfield-service]
    FIX -->|bug / tweak| YOLO[SDC - YOLO]
    FIX -->|feature| SDCI[SDC - interactive]
    FIX -->|complex score >= 16| SPEC[Spec Pipeline first]`,
  },
  {
    id: 'prompt-lifecycle',
    title: 'Every prompt (what fires on each message)',
    purpose:
      'What happens on every single user message before the model even answers: hooks inject grounding and the constitution, so each turn starts already aware of the project knowledge base, design system, engineering laws and the active rules.',
    mermaid: `flowchart TD
    P[User sends a prompt] --> H[UserPromptSubmit hooks fire]
    H --> VG[Knowledge grounding - project context by domain]
    H --> DS[Design system grounding - DS resolver by cwd]
    H --> EG[Engineering grounding - laws + KIT by topic]
    H --> SG[Squad grounding - curated squad context]
    H --> CR[Constitution + context bracket injected]
    VG --> M[Model receives enriched context]
    DS --> M
    EG --> M
    SG --> M
    CR --> M
    M --> ACT[Act: answer or route to specialist]`,
  },
  {
    id: 'session-start',
    title: 'Every session (safe start)',
    purpose:
      'The safety net that runs before any work in a session: sync with remote, never touch main, audit what already exists so partial work is never overwritten (Safe Collaboration + Project Intelligence).',
    mermaid: `flowchart TD
    S[Session starts] --> F[git fetch origin]
    F --> SY{Local main behind?}
    SY -->|yes, clean| PULL[Fast-forward pull]
    SY -->|diverged| STOP[Stop - resolve safely]
    PULL --> BR[Auto-create feature branch - user/type/desc]
    STOP --> BR
    BR --> AUD[Initial state audit - 8 dimensions]
    AUD --> MAT{Maturity?}
    MAT -->|empty| GREEN[Greenfield workflow]
    MAT -->|partial| CONT[Continue - never overwrite]
    MAT -->|mature| BROWN[Brownfield discovery]
    MAT -->|sinapse-managed| RESUME[Resume active story - SDC]`,
  },
  {
    id: 'orchestration-handoff',
    title: 'Every orchestration (plan + handoff)',
    purpose:
      'How control passes between agents without context bloat: the orchestrator plans then waits for go, and each agent switch compacts the previous persona into a tiny handoff artifact (~379 tokens) instead of carrying it all forward.',
    mermaid: `sequenceDiagram
    participant U as User
    participant O as Orchestrator
    participant A1 as Agent A (outgoing)
    participant A2 as Agent B (incoming)
    O->>O: diagnose + build orchestration plan
    O->>U: present plan
    U-->>O: go
    O->>A1: assign work (isolated, minimal context)
    A1->>A1: write handoff artifact + scratchpad
    A1-->>A2: handoff (story id, decisions, files, next action)
    Note over A1,A2: full persona discarded, ~379 tok kept
    A2->>A2: read scratchpad, continue
    A2-->>O: distilled result
    O-->>U: synthesis`,
  },
  {
    id: 'execution-cycle',
    title: 'Every execution (story dev cycle)',
    purpose:
      'The story lifecycle once the doc-first gate is satisfied: draft to validated to implemented to reviewed to shipped, with CodeRabbit self-healing in dev and the QA loop before push (only @devops ships).',
    mermaid: `flowchart TD
    D[Draft - sprint-lead] --> V{Validate - product-lead 10pt}
    V -->|NO-GO| D
    V -->|GO| R[Ready]
    R --> IMP[InProgress - developer]
    IMP --> CRB[CodeRabbit self-heal - max 2 iter]
    CRB --> REV[InReview - quality-gate]
    REV --> QL{QA loop verdict}
    QL -->|FAIL| IMP
    QL -->|CONCERNS| DOC[Document debt]
    QL -->|PASS| PUSH[Push / PR - devops only]
    DOC --> PUSH
    PUSH --> DONE[Done]`,
  },
  {
    id: 'security-enforcement',
    title: 'Security enforcement (cross-cutting)',
    purpose:
      'The always-on guardrails from commit to production: secrets never get committed, data access is least-privilege and parameterized, and nothing reaches main without a PR (Articles IX + X).',
    mermaid: `flowchart TD
    C[Pre-commit] --> SS{Secret scan}
    SS -->|secret found| BLK[Block - remove from staging]
    SS -->|clean| CM[Commit]
    CM --> MRG[Merge origin/main - resolve conflicts]
    MRG --> PR[PR required - branch protection]
    PR --> CHK{Status checks + review}
    CHK -->|fail| FIXS[Return for fixes]
    CHK -->|pass| SHIP[Merge]
    DATA[Data layer] --> RLS[RLS on every user table]
    DATA --> PAR[Parameterized queries only]
    DATA --> ENV[Secrets in env, never in code]`,
  },
  {
    id: 'knowledge-memory',
    title: 'Knowledge & memory (how it stays current)',
    purpose:
      'How the framework keeps itself grounded and self-documenting: grounding sources feed every turn, durable facts persist as memory hints, and the Atlas regenerates from disk so the map never drifts from reality.',
    mermaid: `flowchart TD
    SRC[Grounding sources] --> VLT[Knowledge base - project source of truth]
    SRC --> DSY[Design systems - project DS]
    SRC --> ENG[Engineering research - 60 domains]
    VLT --> TURN[Injected every turn]
    DSY --> TURN
    ENG --> TURN
    MEM[Memory files - hints, not truth] --> VERIFY[Verify vs codebase before acting]
    ATL[sinapse atlas] --> SCAN[Scan repo from disk - exact counts]
    SCAN --> OUT[Regenerate map - md + html + json]
    OUT --> NODRIFT[Single source, never drifts]`,
  },
];

module.exports = { FRAMEWORK_FLOWS };
