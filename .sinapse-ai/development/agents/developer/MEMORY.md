# Dev Agent Memory (Pixel)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- Absolute imports always (never relative `../`)
- kebab-case for files, PascalCase for components
- Jest 30.2.0 for testing, `npm test` to run

### Project Structure
- `.sinapse-ai/core/` — Core modules (synapse, session, code-intel, orchestration)
- `.sinapse-ai/development/` — Agents, tasks, templates, scripts
- `.sinapse-ai/infrastructure/` — CI/CD, git detection, project-status
- `tests/` — Test suites (mirrors source structure)
- `docs/stories/` — Story files (active development)

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`, `refactor:`
- Reference story: `feat: implement feature [Story NOG-18]`

### Common Gotchas
- Windows paths: use forward slashes in code, bash shell not cmd
- `fs.existsSync` for sync checks, `fs.promises` for async
- atomicWriteSync from `.sinapse-ai/core/synapse/utils/atomic-write` for safe file writes
- CodeRabbit runs in WSL, not Windows directly

### Story Workflow
- Read task → Implement → Write tests → Validate → Mark checkbox [x]
- ONLY update: checkboxes, Debug Log, Completion Notes, Change Log, File List
- NEVER modify: Status, Story, AC, Dev Notes, Testing sections

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->
- **NEVER push — delegate to @devops** | Source: dev, analyst, sm, data-engineer, ux, qa (6 agents) | Detected: 2026-02-22 | Status: Already elevated to `.claude/rules/agent-authority.md`
- **CommonJS module system (require/module.exports)** | Source: dev, analyst, sm, data-engineer, ux, architect (6 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Padroes de Codigo)
- **Conventional commits format** | Source: dev, devops, analyst, sm, data-engineer, ux (6 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Convencoes Git)
- **kebab-case for files** | Source: dev, analyst, sm, data-engineer, ux (5 agents) | Detected: 2026-02-22 | Status: Already in CLAUDE.md (Padroes de Codigo)

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Municao: Engenharia de Software (kit Fase 4)

> Fonte: kits completos em `engenharia-software/fase-4-agents/` (KIT-developer + KIT-fundamentos-transversal), repo github `caioimori/engenharia-de-software`. Aqui so o essencial — consulte o kit pro detalhe.

### Principios nao-negociaveis
- **Codigo e AST, nao string.** Inspecao/edicao via tree-sitter/LSP/AST engine, nunca regex ou troca por linha (edicao crua de LLM muda comportamento em ~7-8% dos casos). (Nystrom *Crafting Interpreters* / CODESTRUCT)
- **Nenhuma mudanca sem rede verde.** Suite verde antes E depois de cada passo; area sem cobertura -> gera characterization/Golden Master ANTES de tocar. (Feathers *WELC* / Beck)
- **Smell nomeado antes de refatorar.** So refatora se o sintoma casa uma linha do CATALOGO smell->refactoring->pattern (cite a linha). Sem smell, nao mexe. (Fowler/Martin)
- **Two Hats.** Cada commit e SO refatoracao OU SO feature, jamais ambos. (Fowler *Refactoring* 2ª ed.)
- **Passo atomico + reversao.** Um passo por vez; vermelho -> reverte e reduz (nunca empilha quebra). Mudanca grande -> Mikado. (Beck / Mikado Method)
- **Complexidade cognitiva e o juiz, nao linhas.** Decompoe por intencao/profundidade; modulo profundo > muitos metodos rasos; nunca limite de linha cego. (Ousterhout *APoSD* / SonarSource)
- **Pattern so com variacao concreta HOJE e abstracao deep (YAGNI).** Prefira idioma mais barato (funcao > classe). (Kerievsky / GoF / Norvig)
- **Mock so de dependencia out-of-process compartilhada.** Dor no teste = sinal de design, nao desculpa pra mockar. Qualidade = mutation score, nao cobertura de linha. (Khorikov / PIT / Stryker)
- **Nunca reescreve do zero em codigo com usuarios** -> Strangler Fig / Branch by Abstraction. (Fowler)
- **Agente = interpretador eval/apply.** Loop com caso base OBRIGATORIO (teto de iteracoes); delega a algoritmo deterministico o que e exato e barato (ordenar/dedup/topo-sort); declara Big-O e estrutura pela operacao dominante; estado minimo, sem mutavel compartilhado no fan-out. (SICP / CLRS / Out of the Tar Pit)

### Gates verificaveis (antes de Done)
- [ ] Suite verde (pre E pos cada passo) — `npm test` exit 0
- [ ] Characterization/Golden Master existe em area legada tocada
- [ ] Behavior diff vazio (Golden Master byte-a-byte) apos refatoracao
- [ ] Edicao AST-safe — arquivo parseia valido apos Rename/Move/Extract
- [ ] Complexidade cognitiva <= 15 por funcao (sonarjs / ruff C901 / clippy)
- [ ] Aninhamento <= 3 niveis (eslint max-depth)
- [ ] Smell nomeado — refatoracao cita linha do CATALOGO
- [ ] Two Hats no commit — sem misturar refactor + teste de comportamento novo
- [ ] Mutation score incremental >= threshold no diff (Stryker / PIT / cargo-mutants)
- [ ] Anti-overengineering — nenhuma interface de 1 impl especulativa, nenhum Singleton mutavel global
- [ ] Output sintaticamente valido (codegen/DSL) — grammar-constrained + typecheck exit 0
- [ ] 100% das tool-calls validadas por schema/gramatica antes de executar
- [ ] Caso base alcancavel no loop (teto de iteracoes assertado)
- [ ] Flakiness < 1% (suite rodada N vezes)
- [ ] ADR registrado pra decisao de design nao-trivial

### Loop operacional
Entender (legado -> characterizar) -> design barato (comentario de interface antes) -> teste que falha pela razao certa -> implementacao minima que passa -> refatorar com rede (smell->refactoring->pattern, passos atomicos AST) -> gate de qualidade -> Done. Nunca avance com a barra vermelha. Diagramas L1-L12 + loop mestre em `LOOPS-craftsmanship-diagramas.md` (e `LOOPS-onda-6-fundamentos-linguagens-diagramas` pro eval/apply).

