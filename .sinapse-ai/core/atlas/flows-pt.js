/**
 * Framework Operating Flows — PT-BR translations.
 *
 * Portuguese rendering of FRAMEWORK_FLOWS (flows.js), keyed by flow id. Used by
 * the research-card render target so the SINAPSE case-study card in the
 * engineering-software research reads in the same language as the rest of that
 * corpus. flows.js stays the single source of *which* flows exist and their
 * structure; this file is the translation layer.
 *
 * Drift guard: a test asserts every id in FRAMEWORK_FLOWS has an entry here, so
 * adding a flow without translating it fails CI.
 *
 * @module core/atlas/flows-pt
 */

'use strict';

/** @type {Record<string,{titulo:string,proposito:string,mermaid:string}>} */
const FRAMEWORK_FLOWS_PT = {
  lifecycle: {
    titulo: 'Ciclo de ponta a ponta',
    proposito:
      'A espinha completa que um pedido percorre: do briefing ao código entregue, com o pipeline doc-first e os gates no meio.',
    mermaid: `flowchart TD
    U[Briefing do usuário] --> C{Classifica intenção + tipo de projeto}
    C -->|projeto novo| GF[Workflow greenfield]
    C -->|projeto existente| BF[Descoberta brownfield]
    C -->|bug / ajuste| SDC[Ciclo de dev da story - YOLO]
    GF --> DOC[Pipeline doc-first]
    BF --> DOC
    DOC --> PRD[PRD] --> EPIC[Épico] --> STORY[Story - validada >= Ready] --> SPEC[Spec]
    SPEC --> GATE{{Gate doc-first}}
    SDC --> GATE
    GATE -->|faltam docs| BLOCK[Bloqueado - produza os docs antes]
    GATE -->|satisfeito| IMPL[Implementação - desenvolvedor]
    IMPL --> QA[Gate de QA + loop de QA]
    QA -->|passa| SHIP[Push / PR - só devops]
    QA -->|falha| IMPL`,
  },
  'agent-routing': {
    titulo: 'Roteamento de agente (delegação)',
    proposito:
      'Como um briefing chega no especialista certo. Orquestradores roteiam e coordenam; nunca executam o trabalho de domínio (Artigo VIII).',
    mermaid: `sequenceDiagram
    participant U as Usuário
    participant I as Imperator (master -orqx)
    participant S as Squad -orqx
    participant A as Agente especialista
    U->>I: briefing (linguagem natural)
    I->>I: diagnostica domínio + tipo de projeto
    alt trabalho de domínio
        I->>S: delega (anuncia o plano, espera o "pode ir")
        S->>A: roteia pro especialista
        A-->>S: artefato / resultado
        S-->>I: consolidado
    else dev do framework
        I->>A: roteia pro agente de framework (pm / architect / dev / qa)
    end
    I-->>U: resultado em linguagem de negócio (sem jargão interno)`,
  },
  'model-routing': {
    titulo: 'Roteamento de modelo (o mais barato que resolve)',
    proposito:
      'Como cada tarefa escolhe o tier de modelo. O raciocínio pesado vai pra spec; a execução depois quase só lê um doc pronto, então economia de token é consequência.',
    mermaid: `flowchart TD
    T[Tarefa] --> K{Tipo?}
    K -->|lint / rename / yaml / massa| H[haiku - esforço baixo]
    K -->|feature da spec / review / bug / testes| SO[sonnet - alto]
    K -->|arquivo único / factual| SM[sonnet - médio]
    K -->|arquitetura cross-system / debug complexo| OP[opus - xhigh]
    K -->|Spec Pipeline COMPLEX score >= 16| OM[opus - max]
    H --> SP{>= 8 tool calls ou fan-out real?}
    SO --> SP
    SM --> SP
    OP --> SP
    OM --> SP
    SP -->|sim| SUB[Spawna sub-agente]
    SP -->|não| INLINE[Roda inline]`,
  },
  'doc-first': {
    titulo: 'Enforcement doc-first',
    proposito:
      'O que torna impossível começar um projeto novo sem docs. O resolver responde o que falta; hooks bloqueiam escrita de código até existir PRD + épico + story.',
    mermaid: `flowchart TD
    W[Escreve/edita arquivo de código] --> EX{Path isento ou repo do framework?}
    EX -->|sim| ALLOW[Libera]
    EX -->|não| RES[doc-first-resolver: tipo, workflow, gate]
    RES --> GF{Greenfield + gate não satisfeito?}
    GF -->|não| STORY{Existe story Ready? - story-gate}
    GF -->|sim, sem PRD/épico/story| DENY[BLOQUEIA - rode o fluxo greenfield antes]
    STORY -->|sim| ALLOW
    STORY -->|não| DENY2[BLOQUEIA - crie uma story]
    DENY -.->|escape: SINAPSE_SKIP_DOCFIRST=1| ALLOW
    OBS["sinapse route dá a mesma resposta (observabilidade)"]:::note
    RES -. compartilha a lógica .- OBS
    classDef note fill:#1c1c1c,stroke:#555,color:#aaa`,
  },
  'constitution-gates': {
    titulo: 'Gates constitucionais por fase',
    proposito:
      'Onde cada artigo inegociável dispara ao longo do ciclo — a camada de enforcement que bloqueia violações automaticamente.',
    mermaid: `flowchart LR
    subgraph PLAN[Planejar]
      A3[III Documentação-Primeiro]
      A4[IV Sem Invenção]
    end
    subgraph BUILD[Construir]
      A6[VI Imports Absolutos]
      A8[VIII Delegação Obrigatória]
      A10[X Segurança & Dados]
    end
    subgraph SHIP[Entregar]
      A2[II Autoridade de Agente - só devops]
      A5[V Qualidade Primeiro]
      A9[IX Colaboração Segura]
    end
    subgraph ALWAYS[Transversais]
      A1[I CLI Primeiro]
      A7[VII Exatidão de Métricas]
      A11[XI Default Conservador]
    end
    PLAN --> BUILD --> SHIP`,
  },
  'project-classification': {
    titulo: 'Classificação de projeto para workflow',
    proposito:
      'Como a intenção mapeia pro workflow certo: site/lp/app vs plataforma/saas vs api/serviço, greenfield vs brownfield, ou um ajuste leve.',
    mermaid: `flowchart TD
    B[Briefing] --> N{Novo ou existente?}
    N -->|existente, desconhecido| BD[brownfield-discovery]
    N -->|existente, conhecido| FIX{Tamanho da mudança?}
    N -->|novo| TYPE{Tipo de projeto?}
    TYPE -->|site / lp / app| GUI[greenfield-ui]
    TYPE -->|plataforma / saas| GFS[greenfield-fullstack]
    TYPE -->|api / serviço| GSV[greenfield-service]
    BD --> BTYPE{Tipo?}
    BTYPE -->|ui| BUI[brownfield-ui]
    BTYPE -->|fullstack| BFS[brownfield-fullstack]
    BTYPE -->|serviço| BSV[brownfield-service]
    FIX -->|bug / ajuste| YOLO[SDC - YOLO]
    FIX -->|feature| SDCI[SDC - interativo]
    FIX -->|complexo score >= 16| SPEC[Spec Pipeline antes]`,
  },
  'prompt-lifecycle': {
    titulo: 'Cada prompt (o que dispara em toda mensagem)',
    proposito:
      'O que acontece em toda mensagem do usuário antes mesmo do modelo responder: hooks injetam grounding e a constituição, então cada turno já começa ciente da base de conhecimento do projeto, do design system, das leis de engenharia e das regras ativas.',
    mermaid: `flowchart TD
    P[Usuário envia um prompt] --> H[Hooks UserPromptSubmit disparam]
    H --> VG[Grounding de conhecimento - contexto do projeto por domínio]
    H --> DS[Grounding do design system - DS resolver por cwd]
    H --> EG[Grounding de engenharia - leis + KIT por tema]
    H --> SG[Grounding de squad - contexto curado da squad]
    H --> CR[Constituição + bracket de contexto injetados]
    VG --> M[Modelo recebe contexto enriquecido]
    DS --> M
    EG --> M
    SG --> M
    CR --> M
    M --> ACT[Age: responde ou roteia pro especialista]`,
  },
  'session-start': {
    titulo: 'Cada sessão (início seguro)',
    proposito:
      'A rede de segurança que roda antes de qualquer trabalho na sessão: sincroniza com o remoto, nunca toca na main, audita o que já existe para nunca sobrescrever trabalho parcial (Colaboração Segura + Inteligência de Projeto).',
    mermaid: `flowchart TD
    S[Sessão inicia] --> F[git fetch origin]
    F --> SY{Main local atrasada?}
    SY -->|sim, limpa| PULL[Pull fast-forward]
    SY -->|divergiu| STOP[Para - resolve com segurança]
    PULL --> BR[Cria feature branch automática - user/type/desc]
    STOP --> BR
    BR --> AUD[Auditoria de estado inicial - 8 dimensões]
    AUD --> MAT{Maturidade?}
    MAT -->|vazio| GREEN[Workflow greenfield]
    MAT -->|parcial| CONT[Continua - nunca sobrescreve]
    MAT -->|maduro| BROWN[Descoberta brownfield]
    MAT -->|gerido-pelo-sinapse| RESUME[Retoma story ativa - SDC]`,
  },
  'orchestration-handoff': {
    titulo: 'Cada orquestração (plano + handoff)',
    proposito:
      'Como o controle passa entre agentes sem inchar o contexto: o orquestrador planeja e então espera o "pode ir", e cada troca de agente compacta a persona anterior num artefato mínimo de handoff (~379 tokens) em vez de carregar tudo adiante.',
    mermaid: `sequenceDiagram
    participant U as Usuário
    participant O as Orquestrador
    participant A1 as Agente A (saindo)
    participant A2 as Agente B (entrando)
    O->>O: diagnostica + monta plano de orquestração
    O->>U: apresenta o plano
    U-->>O: pode ir
    O->>A1: atribui trabalho (contexto isolado e mínimo)
    A1->>A1: escreve artefato de handoff + scratchpad
    A1-->>A2: handoff (story id, decisões, arquivos, próxima ação)
    Note over A1,A2: persona completa descartada, ~379 tok mantidos
    A2->>A2: lê o scratchpad, continua
    A2-->>O: resultado destilado
    O-->>U: síntese`,
  },
  'execution-cycle': {
    titulo: 'Cada execução (ciclo de dev da story)',
    proposito:
      'O ciclo de vida da story depois que o gate doc-first é satisfeito: de rascunho a validada a implementada a revisada a entregue, com CodeRabbit se autocorrigindo no dev e o loop de QA antes do push (só @devops entrega).',
    mermaid: `flowchart TD
    D[Rascunho - sprint-lead] --> V{Valida - product-lead 10pt}
    V -->|NÃO-VAI| D
    V -->|VAI| R[Ready]
    R --> IMP[InProgress - desenvolvedor]
    IMP --> CRB[Autocorreção CodeRabbit - máx 2 iter]
    CRB --> REV[InReview - quality-gate]
    REV --> QL{Veredito do loop de QA}
    QL -->|FALHA| IMP
    QL -->|RESSALVAS| DOC[Documenta dívida]
    QL -->|PASSA| PUSH[Push / PR - só devops]
    DOC --> PUSH
    PUSH --> DONE[Done]`,
  },
  'security-enforcement': {
    titulo: 'Enforcement de segurança (transversal)',
    proposito:
      'Os guardrails sempre-ativos do commit à produção: segredos nunca são commitados, o acesso a dados é de menor privilégio e parametrizado, e nada chega na main sem PR (Artigos IX + X).',
    mermaid: `flowchart TD
    C[Pré-commit] --> SS{Varredura de segredos}
    SS -->|segredo encontrado| BLK[Bloqueia - remove do staging]
    SS -->|limpo| CM[Commit]
    CM --> MRG[Merge origin/main - resolve conflitos]
    MRG --> PR[PR obrigatório - branch protection]
    PR --> CHK{Status checks + review}
    CHK -->|falha| FIXS[Volta pra correção]
    CHK -->|passa| SHIP[Merge]
    DATA[Camada de dados] --> RLS[RLS em toda tabela de usuário]
    DATA --> PAR[Só queries parametrizadas]
    DATA --> ENV[Segredos no env, nunca no código]`,
  },
  'knowledge-memory': {
    titulo: 'Conhecimento & memória (como se mantém atual)',
    proposito:
      'Como o framework se mantém grounded e autodocumentado: fontes de grounding alimentam cada turno, fatos duráveis persistem como dicas de memória, e o Atlas se regenera do disco para o mapa nunca divergir da realidade.',
    mermaid: `flowchart TD
    SRC[Fontes de grounding] --> VLT[Base de conhecimento - fonte de verdade do projeto]
    SRC --> DSY[Design systems - DS do projeto]
    SRC --> ENG[Pesquisa de engenharia - 60 domínios]
    VLT --> TURN[Injetado a cada turno]
    DSY --> TURN
    ENG --> TURN
    MEM[Arquivos de memória - dicas, não verdade] --> VERIFY[Verifica contra o código antes de agir]
    ATL[sinapse atlas] --> SCAN[Varre o repo do disco - contagens exatas]
    SCAN --> OUT[Regenera o mapa - md + html + json]
    OUT --> NODRIFT[Fonte única, nunca diverge]`,
  },
};

module.exports = { FRAMEWORK_FLOWS_PT };
