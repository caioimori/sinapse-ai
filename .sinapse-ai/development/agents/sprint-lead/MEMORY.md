# Scrum Master Agent Memory (Sync)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Key Patterns
- CommonJS (`require`/`module.exports`), NOT ES Modules
- ES2022, Node.js 18+, 2-space indent, single quotes
- kebab-case for files, PascalCase for components

### Project Structure
- `docs/stories/epics/` — Epic directories with INDEX.md + stories
- `.sinapse-ai/development/templates/` — Story templates
- `.sinapse-ai/development/checklists/` — Draft checklists

### Git Rules
- NEVER push — delegate to @devops
- Conventional commits: `docs:` for story creation

### Story Conventions
- Story naming: `story-{PREFIX}-{N}-{slug}.md`
- Epic INDEX.md tracks all stories with status
- Stories flow: Draft → Ready → InProgress → InReview → Done
- Epic 10 stories use frontmatter YAML header + numbered flat filename (e.g., `10.17-slug.story.md`)
- 10.15 = InReview, 10.16 = Done (as of 2026-04-11); next available = 10.17

### Authorial Hygiene Rules
- ZERO external framework references in committed files — the exact forbidden-terms regex lives in `scripts/validate-no-external-refs.js` (case-insensitive `\b` word-boundary match)
- Allow-list of files that may legitimately contain such terms: `LICENSE` (legal MIT attribution) and `docs/research-synthesis-for-upgrade.md` (historical process document) — hardcoded in the same validator
- Story 10.17 created the CI guard (`external-refs-validation` job) that enforces this permanently on every PR
- Drafting rule for @sprint-lead: when writing story notes about this policy, NEVER repeat the forbidden terms as literal text — reference `scripts/validate-no-external-refs.js` instead

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Municao: Engenharia de Software (kit Fase 4)

Fonte completa: `engenharia-software/fase-4-agents/KIT-product-sprint.md` (repo github caioimori/engenharia-de-software). Principio-mestre: o artefato (story/board) e meio; o fim e entendimento compartilhado + comportamento medido. Lote pequeno e lei nuclear.

### Principios nao-negociaveis
- **Outcome over output.** Todo "so that" e resultado mensuravel, nunca tarefa/feature; roadmap = problemas/outcomes (Perri *Escaping the Build Trap* / Cagan *Inspired*).
- **Slice vertical por outcome, walking skeleton primeiro.** End-to-end fino ANTES de feature horizontal; quebra com SPIDR (Spike/Path/Interface/Data/Rules) (Patton *User Story Mapping* / Cohn).
- **Requisito = exemplo = teste.** Key examples concretos com contra-exemplo e edge case; sem fit criterion quantificado e opiniao (Adzic *Specification by Example* / Robertson-Volere).
- **Story passa INVEST + 3C.** 3C = Card/Conversation/Confirmation (estrutura); INVEST = qualidade (Wake / Jeffries).
- **Limitar WIP, nao maximizar ocupacao.** WIP = Throughput × Cycle Time (Lei de Little); lead time ∝ 1/(1−ρ); pull, nao push (Reinertsen / Anderson *Kanban*).
- **MVP e experimento, nao versao pequena.** Cada fatia = giro Build-Measure-Learn com hipotese + actionable metric + pivot-or-persevere (Ries *Lean Startup*).
- **Forecast probabilistico, nao promessa.** "X% ate Y" via throughput/Monte Carlo; velocity NUNCA como meta (Vacanti / Goodhart).
- **Cerimonia calibrada por risco (Cynefin + Boehm-Turner).** Bug fix = YOLO; epic multi-story = pipeline completo (Snowden / Boehm-Turner).
- **DoD como jidoka (stop-the-line).** Defeito para a linha; status nao avanca sem gate verde (Poppendieck / DevOps Handbook).
- **Discovery e habito, nao fase.** OST vivo: >=3 solucoes por oportunidade, testa a assumption mais arriscada primeiro (Torres *Continuous Discovery Habits*).

### Gates verificaveis (antes de Done)
- [ ] "so that" e outcome mensuravel, nao verbo de implementacao
- [ ] Fit criterion presente e quantificado (NFR sem numero = FAIL)
- [ ] >=1 key example Given/When/Then + >=1 contra-exemplo/edge case
- [ ] INVEST completo (item a item)
- [ ] 3C presentes (Card + Conversation + Confirmation)
- [ ] Rastreavel feature -> story -> exemplo -> teste
- [ ] Cabe num lote pequeno (Small); senao dispara split via SPIDR
- [ ] Fatiada por outcome end-to-end (rejeita slice so backend/so frontend)
- [ ] Walking skeleton existe e veio antes de feature horizontal
- [ ] MVP declarado como experimento (hipotese + metric + pivot)
- [ ] WIP respeitado: max 1 InProgress por executor; PR/diff > 400 linhas = quebrar
- [ ] Forecast em formato probabilistico ("X% ate Y"); data pontual = FAIL
- [ ] Velocity NAO usada como meta (nem individual)
- [ ] Complexidade classificada (Cynefin) e cerimonia calibrada (Boehm-Turner)
- [ ] WSJF registrado para sequenciamento (CoD ÷ Job Size); ordem por HiPPO = FAIL

### Loop operacional
Classificar (Cynefin) -> descobrir (OST) -> mapear (Story Map) -> fatiar vertical (SPIDR) -> refinar (Example Mapping <30min) -> Gate A+B -> puxar sob WIP -> implementar lote pequeno (DoD jidoka) -> medir -> aprender (pivot/persevere) -> forecast Monte Carlo -> retro (1-3 kaizen + atualiza OST/CFD). Diagrama completo na secao "Loop operacional" do kit.


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
