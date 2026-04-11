# SINAPSE Mega-Upgrade — Plano de Orquestracao Final

> **Data:** 2026-04-11
> **Objetivo:** Upgrade definitivo — zero brechas, zero pontas soltas
> **Modo:** YOLO + NSN
> **Baseline:** v9.4.0 (PR #28 + #30 merged, PR #31 open)

---

## Estado Atual vs Target

| Area | Atual | Target | Gap |
|------|-------|--------|-----|
| Rules | 19 (9 com paths) | 19 (todas com paths ou always-load justificado) | 0 |
| Agents | 12 (5 enriched) | 12 (todos enriched + anti-hallucination) | 1 falta (data-engineer hallucination) |
| Tasks | 207 | 211+ (4 novas infra) | DONE (PR #30) |
| Skills | 5 | 10+ | 5 novas necessarias |
| Checklists | 8 | 10+ | 2 novas |
| Workflows | 15 + 1 (fast-track) | 16 | DONE |
| KBs (framework) | 6 | 8+ | DONE |
| KBs (squads) | 11 master refs | 11 | DONE |
| Hooks | 19 + 1 (verify-packages) | 20 | DONE |
| Templates | 40 + 3 (legal) | 43 | DONE |
| AGENTS.md | 159 lines | 159 | DONE |
| Chrome Brain | v3.0 autoConnect | v3.0 + CAPTCHA | Em progresso |

## Waves de Execucao

### Wave A: Chrome Brain Definitivo (PRIORIDADE 1)
1. Testar autoConnect no Chrome do usuario
2. Criar skill `chrome-brain` para sessoes inteligentes
3. Implementar auto-learning (extrair dados estruturados de paginas)
4. Criar memory KB para padroes de navegacao

### Wave B: Skills System Expansion
1. Criar 5 novas skills:
   - `captcha-handler` — detectar e resolver CAPTCHAs
   - `deploy-readiness` — checklist dos 25 blockers automatizado
   - `story-fast-track` — auto-create+validate story para fixes triviais
   - `model-router` — decidir Opus/Sonnet/Haiku por complexidade
   - `sinapse-methodology` — meta-skill standalone (H9)

### Wave C: Seguranca End-to-End
1. Validar todos os 25 deployment blockers como hooks/checks
2. LGPD compliance automatizada (templates + checklist)
3. Supply chain security (npm audit + gitleaks + slopsquatting)
4. Secret rotation procedure

### Wave D: Token Economy Max
1. Compaction strategy (60% trigger)
2. Model routing automatico em sub-agents
3. Validar que rules com paths: nao carregam fora de contexto
4. Memory relevance scoring

### Wave E: Agent Ecosystem Polish
1. Todos os agents com anti-hallucination
2. Agent communication protocol (scratchpad enforcement)
3. Handoff protocol v2 (structured reports)
4. Auto-learning de erros no Gotchas KB

### Wave F: Squad Creator Turbinado
1. 4-layer persona model no template
2. Auto-generate KB skeleton com pesquisas relevantes
3. Auto-wire tasks/checklists/workflows
4. Validation checklist para squads criadas

### Wave G: CI/CD & Distribution
1. Changesets para versioning automatico
2. OIDC publishing (ja configurado)
3. Gitleaks no CI
4. PR size bot (warn > 400 lines)
