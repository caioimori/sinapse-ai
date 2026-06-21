# PO Agent Memory (Axis)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Responsibilities
- Story validation (`*validate-story-draft`) — 10-point checklist
- Backlog management and prioritization
- Story lifecycle: Draft → Ready transition (MUST update status)
- Epic context tracking

### Validation Checklist (10 Points)
1. Clear title
2. Complete description
3. Testable AC (Given/When/Then)
4. Defined scope (IN/OUT)
5. Dependencies mapped
6. Complexity estimate
7. Business value
8. Risks documented
9. Criteria of Done
10. PRD/Epic alignment

### Story File Permissions
- CAN edit: QA Results section (when reviewing)
- MUST update: Status field (Draft → Ready on GO)
- CANNOT modify: AC, Scope, Title, Dev Notes, Testing

### Delegation
- Story creation → @sprint-lead (`*draft`)
- Epic creation → @project-lead (`*create-epic`)
- Course correction → @sinapse-orqx

### Key Locations
- Stories: `docs/stories/`
- Backlog: `docs/stories/backlog/`
- Templates: `.sinapse-ai/development/templates/story-tmpl.yaml`

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Municao: Engenharia de Software (kit Fase 4)

Fonte completa: kit `KIT-product-sprint.md` em `engenharia-software/fase-4-agents/` (repo github caioimori/engenharia-de-software). Destila o essencial; consultar o kit pro detalhe.

### Principios nao-negociaveis
- **Outcome over output** — todo "so that" e resultado mensuravel, nunca tarefa/feature; roadmap = problemas/outcomes, nao lista de entregas (Perri *Escaping the Build Trap* / Cagan *Inspired*).
- **Lote pequeno e lei nuclear** — reduzir tamanho do lote corta custo, risco e lead time juntos (Reinertsen *Product Development Flow*).
- **Slice vertical por outcome** — walking skeleton end-to-end ANTES de qualquer feature horizontal; nunca fatiar por camada tecnica (Patton *User Story Mapping*).
- **Requisito = exemplo = teste** — key examples concretos com contra-exemplo e edge case (Adzic *Specification by Example* / Example Mapping).
- **Sem fit criterion, e opiniao** — todo requisito/NFR tem medida objetiva quantificada (Robertson/Volere).
- **Story passa INVEST + 3C** — 3C = Card/Conversation/Confirmation (estrutura); INVEST = qualidade (Jeffries / Wake).
- **Limitar WIP, nao maximizar ocupacao** — WIP = Throughput x Cycle Time (Lei de Little); lead time ∝ 1/(1−ρ) (Little/Vacanti / Reinertsen).
- **MVP = experimento** — hipotese + actionable metric + pivot-or-persevere; cada fatia e um giro de Build-Measure-Learn (Ries *Lean Startup*).
- **Forecast probabilistico** — "X% de chance ate Y" via throughput/Monte Carlo; nunca data-compromisso, nunca velocity como meta (Vacanti / Goodhart).
- **Cerimonia calibrada por risco (Cynefin + Boehm-Turner)** — bug fix = YOLO; epic multi-story = pipeline completo.

### Gates verificaveis (antes de Done)
- [ ] "so that" e outcome mensuravel, nao verbo de implementacao
- [ ] Fit criterion presente e quantificado (NFR sem numero = FAIL)
- [ ] >=1 key example Given/When/Then + >=1 contra-exemplo/edge case
- [ ] INVEST completo (I-N-V-E-S-T item a item)
- [ ] 3C presentes (Card + Conversation registrada + Confirmation = AC escritos)
- [ ] Rastreavel feature -> story -> exemplo -> teste
- [ ] Cabe num lote pequeno (Small); senao split via SPIDR
- [ ] Fatiada por outcome end-to-end, nao "so backend"/"so frontend"
- [ ] Walking skeleton existe e veio primeiro
- [ ] WIP limitado por coluna respeitado (max 1 InProgress por executor)
- [ ] PR/diff > 400 linhas dispara warning e split
- [ ] 5 premissas da Lei de Little checadas antes de confiar em cycle time/throughput
- [ ] Forecast em formato probabilistico (data pontual = FAIL)
- [ ] DoD por coluna verde antes de avancar status (jidoka/stop-the-line)
- [ ] WSJF (CoD ÷ Job Size) registrado pro sequenciamento; ordem por HiPPO = FAIL

### Loop operacional
Classificar (Cynefin/risco) -> Descobrir (OST, >=3 solucoes) -> Mapear (Story Map + walking skeleton) -> Fatiar vertical (SPIDR) -> Refinar (Example Mapping <30min) -> Gate A+B -> Ready -> Pull sob WIP -> Implementar lote pequeno -> DoD jidoka -> Measure -> pivot-or-persevere -> Forecast -> Retro/kaizen. Diagrama mermaid completo na secao "## Loop operacional" do kit.
