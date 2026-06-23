# Architect Agent Memory (Stratum)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Architecture Decisions
- CLI First > Observability > UI (Constitution Article I)
- Task-First: Tasks define WHAT, executors are interchangeable
- Provider-agnostic code-intel layer (Code Graph MCP primary)
- SYNAPSE 8-layer context engine (L0-L2 active, L3-L7 disabled per NOG-18)

### Key Architectural Patterns
- Tiered loading in UAP: Critical (80ms) → High (120ms) → Best-effort (180ms)
- Circuit breaker for external providers (code-intel, MCP)
- Atomic writes for file persistence (`atomicWriteSync`)
- ideSync for cross-IDE agent distribution

### Technology Stack
- Node.js 18+, CommonJS, ES2022
- Jest 30.2.0, ESLint, Prettier
- Supabase (database), Vercel (hosting)

### Delegation Rules
- Database schema design → @data-engineer
- Git push/PR → @devops
- Implementation → @developer

### Project Structure
- `.sinapse-ai/core/` — Engine modules
- `docs/architecture/` — Architecture docs
- `docs/prd/` — Sharded PRDs

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Municao: Engenharia de Software (kit Fase 4)

Fonte completa: `engenharia-software/fase-4-agents/` (KIT-architect, KIT-orquestrador, KIT-fundamentos-transversal) — repo github `caioimori/engenharia-de-software`. Esta secao e o destilado; consulte o kit pro detalhe.

### Principios nao-negociaveis
- **Tudo e trade-off (First Law).** Nunca "o melhor X"; sempre "X paga seu custo NESTE contexto porque..." (Richards & Ford, *Fundamentals of Software Architecture*).
- **ASRs dirigem a estrutura, nao moda.** Top 3-7 atributos de qualidade, cada um como cenario mensuravel com SLO numerico (Bass/Clements/Kazman, SEI).
- **Fronteira e linguistica (bounded context), nunca camada tecnica.** Mudanca de linguagem = boundary; duplicata de evento e pista, nao erro (Evans + Brandolini/EventStorming).
- **Dependency Rule: dominio puro no nucleo;** DB/UI/framework/MCP/LLM sao detalhes na borda (R.C. Martin, *Clean Architecture*).
- **Monolito modular primeiro;** distribua so o quantum com deploy/escala/time independentes + DevOps maduro — senao = distributed monolith (Newman, *Building Microservices*).
- **Eventual por padrao em distribuido; ACID dentro do bounded context.** Outbox nunca dual-write; saga + compensacao + idempotencia; nunca 2PC default (*The Hard Parts*).
- **Toda integracao externa:** timeout + circuit breaker + fallback; ACL valida output de LLM/API (Nygard, *Release It!*).
- **ADR imutavel com consequencias NEGATIVAS + opcoes rejeitadas;** supersede, nunca edita (Nygard / MADR 4.0.0).
- **Atributo critico vira fitness function no CI** (rules live in code) — Ford/Parsons/Kua, *Building Evolutionary Architectures*.
- **Conway como design ativo:** topologia ANTES do enxame; carga cognitiva e o limite de fronteira; estrela nao malha (n(n-1)/2 persiste em tokens) — Conway + Skelton & Pais, *Team Topologies*.
- **Agente = bounded context = interpretador eval/apply** sob leis de complexidade; delegue a algoritmo deterministico o que e exato e barato (Evans DDD Europe 2025 + SICP/CLRS).

### Gates verificaveis (antes de Done)
- [ ] Cynefin classificado (campo `complexity:` no artefato de decisao).
- [ ] Cada boundary mapeia a um bounded context nomeado; zero fronteira por camada tecnica.
- [ ] Monolito x distribuido justificado por ADR (quantum + DevOps maduro) ou default monolito.
- [ ] ADR completo: Context, Options (incl. rejeitadas), Decision, Consequences com >=1 "Ruim:".
- [ ] Cada ASR com `response measure`/SLO numerico (regex de unidade: ms, %, p\d+, req/s).
- [ ] Dependency Rule verde no arch-linter (ArchUnit/dependency-cruiser); sem ciclos (`madge --circular` = 0).
- [ ] 1 transacao = 1 agregado; refs entre agregados por ID.
- [ ] Domain Events em PascalCase de negocio; zero "EntityUpdated"/"XxxChanged".
- [ ] ACL presente em toda chamada externa (API/MCP/LLM); domain primitives validados por construcao.
- [ ] Toda chamada externa com timeout + circuit breaker + fallback; write+publish via outbox; handlers idempotentes.
- [ ] Fitness functions poucas, de alto sinal, verdes no CI; PR que muda boundary inclui ADR novo.
- [ ] Fio de rastreabilidade intacto: outcome -> requisito(+fit criterion) -> ASR -> bounded context -> estilo -> ADR -> fitness function -> SLO.
- [ ] (squad) Sem overlap de escopo entre agents; nao-stream-aligned < ~15%; handoff = contrato versionado valido; zero codinome/@agent/path interno no texto user-facing.

### Loop operacional
Loop mestre: Cynefin -> Entender(outcome+ASR) -> Modelar(bounded context) -> Escolher(estilo por trade-off) -> Avaliar(sensitivity/tradeoff points) -> Registrar(ADR) -> Proteger(fitness function) -> Validar(CI); cada gate bloqueia, loop evolutivo reentra quando o negocio muda. Detalhe + diagramas mermaid (L1-L7 e Loop mestre): `LOOPS-design-arquitetura-diagramas.md` e, pra squads, `LOOPS-onda-7-processo-pessoas-diagramas.md` (B1-B6).

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
