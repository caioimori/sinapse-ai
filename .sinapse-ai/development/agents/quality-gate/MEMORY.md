# QA Agent Memory (Litmus)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Review Patterns
- ONLY update "QA Results" section in story files
- Gate decisions: PASS / CONCERNS / FAIL / WAIVED
- CodeRabbit self-healing: max 3 iterations, CRITICAL+HIGH auto-fix

### Test Infrastructure
- `npm test` — Jest 30.2.0
- `npm run lint` — ESLint
- Tests location: `tests/` directory, mirrors source structure
- Coverage: `npm run test:coverage`

### Quality Checks (7-point)
1. Code review (patterns, readability)
2. Unit tests (coverage, passing)
3. Acceptance criteria met
4. No regressions
5. Performance acceptable
6. Security (OWASP basics)
7. Documentation updated

### Common Issues
- Windows path separators in test assertions
- CodeRabbit WSL execution: `wsl bash -c 'cd /mnt/c/... && ~/.local/bin/coderabbit ...'`
- SYNAPSE metrics at `.synapse/metrics/`
- Pipeline benchmarks at `tests/synapse/benchmarks/`

### Git Rules
- Read-only: `git status`, `git log`, `git diff`
- NEVER commit or push

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Munição: Engenharia de Software (kit Fase 4)

Fonte: kit completo em `engenharia-software/fase-4-agents/KIT-quality-gate.md` (repo github caioimori/engenharia-de-software). Consolida testes/TDD + segurança/threat-model. Regra de ouro: todo princípio que pode virar gate, virou gate. Verdict sempre amarrado a evidência de ferramenta — nunca "parece bom".

### Princípios não-negociáveis
- Cobertura ≠ qualidade; o sinal honesto é mutation score incremental no diff (DeMillo/Lipton/Sayward; PIT/Stryker).
- Teste comportamento observável, nunca implementação — resistência à refatoração é binária (Khorikov, *Unit Testing* 2020).
- Só mocke dependência out-of-process compartilhada/mutável; nunca interna nem privada (Khorikov; Google/Thoughtworks).
- 4 pilares: fixe resistência+manutenibilidade, negocie proteção×velocidade (Khorikov 2020).
- Determinismo é lei: relógio/aleatório/I/O injetados; flakiness > 1% destrói a suíte (*SWE at Google*).
- Pirâmide por size de recurso (~80/15/5), não por nome de camada (Cohn; *SWE at Google*).
- Legacy = código sem teste → characterization test antes de tocar (Feathers, *WELC* 2004).
- Suíte verde é pré-condição de merge, não conquista (Beck, *TDD by Example*).
- Toda saída do LLM é input não confiável — valida contra schema/allow-list (OWASP LLM05/2025).
- Cada ameaça → mitigação → teste → gate; prompt injection se resolve por contenção, não filtro (Shostack/STRIDE; OWASP LLM01).

### Gates verificáveis (antes de Done)
- [ ] Suíte verde 100% (runner exit 0; zero skip sem justificativa)
- [ ] Mutation score incremental ≥ threshold do módulo (Stryker/PIT no diff)
- [ ] Flakiness < 1% (flaky → quarentena + owner + deadline)
- [ ] Zero lógica condicional no teste (sem if/for/while/try)
- [ ] Zero mock de dependência interna ou out-of-process privada
- [ ] Determinismo: sem Date.now()/Math.random()/I/O real não-injetado
- [ ] Nome do teste descreve comportamento; snapshot não é única asserção
- [ ] SCA bloqueia CVE crítico em dependência
- [ ] Secret scanning bloqueia merge com credencial em plaintext
- [ ] SAST com FP tunado; achado crítico bloqueia
- [ ] Threat model STRIDE rastreável a teste (feature que cruza trust boundary/toca dado sensível)
- [ ] Cripto: zero cripto caseira; AEAD + Argon2id + CSPRNG; secret em KMS
- [ ] Agent de IA: allow-list de tools, HITL em ação destrutiva, secret fora do prompt
- [ ] Agent de IA: isolamento multi-tenant + red-team de prompt injection como regressão

### Loop operacional
QA Gate/Loop determinístico: suíte verde → qualidade do teste → mutation incremental → flakiness → segurança → least agency → verdict (PASS/CONCERNS/FAIL/WAIVED); qualquer gate aplicável vermelho ⇒ não assina Done; máx 5 iterações então escala. Diagrama/passo-a-passo completo no kit (`KIT-quality-gate.md` §"Loop operacional").


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
