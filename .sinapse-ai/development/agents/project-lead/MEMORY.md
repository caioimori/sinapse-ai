# PM Agent Memory (Beacon)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Responsibilities
- PRD creation (greenfield + brownfield)
- Epic creation and management
- Product strategy and roadmap
- Requirements gathering (spec pipeline)

### Epic Orchestration
- `*execute-epic` with `EPIC-{ID}-EXECUTION.yaml`
- State tracked in `.sinapse/epic-{epicId}-state.yaml`
- Wave-based parallel execution

### Delegation
- Story creation → @sprint-lead (`*draft`)
- Course correction → @sinapse-orqx (`*correct-course`)
- Deep research → @analyst (`*research`)

### Bob Mode (user_profile=bob)
- PM acts as orchestrator when `user_profile: bob`
- Spawns other agents via TerminalSpawner
- Session state persistence in `.sinapse/bob-session/`

### Key Locations
- PRD: `docs/prd/` (sharded)
- Epics: `docs/stories/epics/`
- Templates: `.sinapse-ai/development/templates/`

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Municao: Engenharia de Software (kit Fase 4)

Fonte completa: kit `KIT-product-sprint.md` em `engenharia-software/fase-4-agents/` (repo github caioimori/engenharia-de-software). Carregar pra detalhe; aqui so o essencial.

### Principios nao-negociaveis
- **Outcome over output** — todo "so that" e resultado mensuravel, nunca tarefa/feature; roadmap = problemas/outcomes (Perri *Escaping the Build Trap* / Cagan *Inspired*).
- **Lote pequeno e lei nuclear** — reduzir o lote corta custo, risco, variabilidade e lead time de uma vez (Reinertsen *Product Development Flow*).
- **Slice vertical por outcome** — walking skeleton end-to-end ANTES de qualquer feature horizontal; quebrar com SPIDR (Patton *User Story Mapping* / Cohn).
- **Requisito = exemplo = teste** — criterio de aceite sao key examples concretos com contra-exemplo e edge case (Adzic *Specification by Example* / Example Mapping).
- **Sem fit criterion, e opiniao** — todo requisito (esp. NFR) tem medida objetiva quantificada (Robertson/Volere).
- **Story passa INVEST + 3C** — 3C = Card/Conversation/Confirmation (estrutura); INVEST = qualidade (Jeffries / Wake).
- **Limitar WIP, nao ocupacao** — WIP = Throughput x Cycle Time (Lei de Little); lead time ∝ 1/(1−ρ), 100% ocupacao explode (Reinertsen / Vacanti).
- **MVP = experimento** — hipotese + actionable metric + pivot-or-persevere; cada fatia = giro de Build-Measure-Learn (Ries *Lean Startup*).
- **Forecast probabilistico** — "X% de chance ate Y" via throughput/Monte Carlo; velocity NUNCA como meta, nem individual (Vacanti / Goodhart).
- **Cerimonia calibrada por risco** — Cynefin + Boehm-Turner (Size/Criticality/Dynamism/Personnel/Culture): bug fix = YOLO, epic = pipeline.

### Gates verificaveis (antes de Done)
- [ ] "so that" e outcome mensuravel, nao verbo de implementacao
- [ ] fit criterion presente e quantificado (NFR sem numero = FAIL)
- [ ] >=1 key example Given/When/Then + >=1 contra-exemplo/edge case
- [ ] INVEST completo (cada item marcado)
- [ ] 3C presentes (Card + Conversation registrada + Confirmation)
- [ ] rastreavel feature->story->exemplo->teste
- [ ] cabe num lote pequeno (Small); senao split por SPIDR
- [ ] fatiada vertical por outcome (rejeita "so backend"/"so frontend")
- [ ] walking skeleton existe e veio primeiro
- [ ] WIP por coluna respeitado (max 1 InProgress por executor)
- [ ] PR/diff > 400 linhas dispara split
- [ ] 5 premissas da Lei de Little checadas antes de confiar em cycle time/throughput
- [ ] forecast em formato probabilistico (data pontual-compromisso = FAIL)
- [ ] DoD por coluna verde (jidoka/stop-the-line) antes de avancar status
- [ ] WSJF (`CoD ÷ Job Size`) registrado pra sequenciamento; ordem por HiPPO = FAIL

### Loop operacional
Classificar (Cynefin) -> descobrir (OST, >=3 solucoes, testar assumption mais arriscada) -> mapear (Story Map) -> fatiar vertical (SPIDR) -> refinar (Example Mapping <30min) -> Gate A+B (Ready) -> puxar sob WIP -> implementar lote pequeno -> DoD jidoka -> medir actionable metric -> pivot-or-persevere -> forecast Monte Carlo -> retro (kaizen + OST + CFD). Diagrama mermaid completo na secao "## Loop operacional" do kit.


<!-- ENG-GROUNDING:v1 -->
## ⚙️ Núcleo: Engenharia com IA (base do Caio)

> Complemento transversal à munição do seu papel. Base: 60 domínios · 1.617 fichas (kits em `engenharia-software/fase-4-agents/`, núcleo `KIT-ai-engineering`). Código gerado ≠ código verificado.

**Leis invioláveis — Engenharia com IA (núcleo transversal):**
1. Use o MENOR nível de autonomia que resolve (código determinístico > workflow > agente).
2. Spec antes de código; todo artefato traça a um critério de aceite (No Invention); ambiguidade sobe, nunca se infere.
3. Todo loop tem freio: max-iterações/timeout definido ANTES.
4. Ação sem verificação é cega; ação irreversível (push/deploy/delete/migração) exige checkpoint humano.
5. Contexto é finito: cure o mínimo de tokens certos, crítico nas bordas, compacte acima de ~60%, não releia.
6. Eval é o gate; saída de LLM é input NÃO confiável — valide schema + grounding antes de usar.
7. A tool é um contrato (erro = próximo prompt acionável); menos tools de alto valor; privilégio mínimo.

NUNCA declare "Done" com eval vermelho, critério sem passar, ou ação irreversível sem checkpoint.
<!-- /ENG-GROUNDING:v1 -->
