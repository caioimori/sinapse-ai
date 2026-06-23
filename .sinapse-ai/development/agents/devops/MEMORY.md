# DevOps Agent Memory (Pipeline)

## Active Patterns
<!-- Current, verified patterns used by this agent -->

### Exclusive Authority
- ONLY agent authorized for `git push`, `gh pr create`, `gh pr merge`
- ONLY agent for MCP infrastructure management
- Pre-push quality gates are MANDATORY

### Quality Gates (Pre-Push)
1. `npm run lint` — ESLint must PASS
2. `npm test` — Jest must PASS
3. CodeRabbit review — 0 CRITICAL issues
4. Story status = "Done" or "Ready for Review"
5. No uncommitted changes, no merge conflicts

### Git Conventions
- Conventional Commits: `feat:`, `fix:`, `docs:`, `test:`, `chore:`
- Branch patterns: `feat/*`, `fix/*`, `docs/*`
- Semantic versioning: MAJOR.MINOR.PATCH

### MCP Infrastructure
- Docker MCP Gateway on port 8080
- Servers: context7, desktop-commander, playwright, exa
- Config: `~/.docker/mcp/catalogs/docker-mcp.yaml`
- Known bug: Docker MCP secrets don't interpolate (use hardcoded values)

### Repository Detection
- Uses `repository-detector.js` for dynamic context
- Framework-dev vs project-dev mode detection

## Promotion Candidates
<!-- Patterns seen across 3+ agents — candidates for CLAUDE.md or .claude/rules/ -->
<!-- Format: - **{pattern}** | Source: {agent} | Detected: {YYYY-MM-DD} -->

## Archived
<!-- Patterns no longer relevant — kept for history -->
<!-- Format: - ~~{pattern}~~ | Archived: {YYYY-MM-DD} | Reason: {reason} -->

## Municao: Engenharia de Software (kit Fase 4)

Kit completo em `engenharia-software/fase-4-agents/KIT-devops-sre.md` (repo github caioimori/engenharia-de-software). Padrao encarnado: DORA Elite + Google SRE — velocidade COM estabilidade. Loop unico: CODAR -> ENTREGAR -> MEDIR -> PROTEGER, realimentado por postmortem.

### Principios nao-negociaveis
- **Build once, promote everywhere** — um artefato versionado (hash identico) atravessa todos os ambientes; nunca rebuild por ambiente. (Humble & Farley, *Continuous Delivery*)
- **Batch pequeno + trunk-based** — branch < 1 dia, integracao >= diaria; lotes pequenos = falhas baratas de reverter (mais critico sob codigo de IA). (Accelerate / DORA)
- **Testes/scans sao gate, nao sugestao** — "pronto" = CI verde objetivo, nunca auto-avaliacao do LLM; suite vermelha bloqueia tudo. (*Continuous Delivery*)
- **Error budget governa o ritmo** — orcamento ok -> acelera; estourou -> feature freeze (so P0/security). (Google SRE Book)
- **SLO por Critical User Journey** — SLI = good_events/valid_events; latencia de sucesso separada da de erro. (SRE Workbook)
- **Todo integration point nasce resiliente** — timeout finito + bulkhead + backoff com jitter (so se idempotente) + cap/retry-budget + idempotency key + backpressure + graceful degradation. Projete contra o LOOP DE AMPLIFICACAO, nao so o gatilho (colapso metaestavel). (Nygard *Release It!* / Bronson-Huang)
- **A cauda manda** — em fan-out otimize p99/p999, nao a media; hedged request quando p95 estoura. (Dean & Barroso *Tail at Scale*)
- **Meca antes de otimizar** — USE + drill-down (top->iostat->/proc/meminfo->dmesg, flame graph), classifique memory-bound vs compute-bound; nunca chute "vamos paralelizar". (Brendan Gregg *Systems Performance*)
- **Durabilidade = fsync, nao write**; least privilege na execucao (seccomp+cgroups+drop caps, nunca root no host, io_uring bloqueado em sandbox hostil). (OSTEP / Saltzer-Schroeder)
- **Supply chain e gate de 1a classe** — SBOM + assinatura Sigstore + provenance SLSA>=L2, verificado na admissao. (SLSA v1.1 / NIST SSDF)
- **Postmortem blameless, causas multiplas** -> backlog + atualiza threat model; mitigar antes de diagnosticar. (Cook / SRE Book)
- **Human-in-the-loop para acao destrutiva** (push --force, delete, deploy prod). (espelha safe-collaboration.md)

### Gates verificaveis (antes de Done)
- [ ] Branch curto (< 24h, sem long-lived) — `git log`/`git branch -a`
- [ ] Codigo incompleto atras de feature flag com kill switch (grep confirma flag-guard)
- [ ] Build-once: hash SHA-256 do artefato identico entre estagios
- [ ] CI verde: exit 0 em build+unit+lint+type-check+secret scan+dep scan
- [ ] Suite de testes verde (runner retorna 0 falhas)
- [ ] Complexidade cognitiva <= 15 por funcao (linter)
- [ ] Mutation score >= threshold (mutmut/stryker/PIT)
- [ ] SCA: 0 CVE critico aberto (Trivy/Grype/Snyk)
- [ ] Secret scan limpo (gitleaks/trufflehog); `.env` real nunca staged
- [ ] Artefato assinado + SBOM + provenance: `cosign verify` ok, SLSA>=L2
- [ ] Migration breaking via expand->contract; rollback de schema testado
- [ ] Deploy progressivo (canary 1-5% + ACA) com rollback amarrado ao SLO; abort automatico fora do budget
- [ ] DORA 4 keys medidas (deploy freq, lead time, CFR, MTTR) com numero, nao estimativa
- [ ] Burn-rate multi-janela configurado (14,4x / 6x / 1x); golden signals instrumentados
- [ ] Triade de estabilidade + idempotency testada em todo integration point; RPO/RTO + restore real testado
- [ ] (Agents) Eval gate (LLM-as-judge) + canary 5% antes de 100%; cap de iteracoes/retry budget no orquestrador

### Loop operacional
CODAR (integrar pequeno, testavel, seguro, atras de flag) -> ENTREGAR (pipeline com gates + canary/rollback) -> MEDIR (DORA + SLO + wide events) -> PROTEGER (triade de estabilidade + blast radius); postmortem blameless realimenta o threat model e o error budget governa o ritmo. Detalhe + diagramas mermaid no kit (secao "Loop operacional") e em `PIPELINE-operacional...` / `PLAYBOOK-performance-execucao`.


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
