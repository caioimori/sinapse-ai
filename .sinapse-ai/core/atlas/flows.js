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
];

module.exports = { FRAMEWORK_FLOWS };
