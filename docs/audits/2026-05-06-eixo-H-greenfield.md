# EIXO H — Greenfield Flow

**Data:** 2026-05-06
**Auditor:** sub-agent Explore (read-only)
**Método:** Read direto dos 3 yamls greenfield + project-intelligence.md + bob-orchestrator + greenfield-handler
**Trigger:** Validar se usuário externo abre projeto vazio → SINAPSE detecta → scaffolda → primeira story funciona.

---

## Verdict: 🟡 ESTRUTURALMENTE COERENTE — gaps de implementação parcial

Workflow greenfield está bem documentado e arquitetado. Detecção dual (redundante) funciona. Mas **dependências runtime (TerminalSpawner) e tech stack scanner** têm gaps reais.

---

## 1. Path crítico do usuário externo

```
1. npx sinapse-ai install (bin/commands/install.js, Phase 8)
2. Wizard invocado (quiet: true)
3. detectProjectState() em bob-orchestrator.js (linhas 697-729)
4. Condição greenfield: !package.json && !.git && !docs/
5. GreenfieldHandler routing (greenfield-handler.js, 889 LOC)
6. Phase 0 Bootstrap (environment-bootstrap.md) — @devops scaffolds
7. Phase 1 Discovery (5-agent sequence): @analyst → @pm → @ux-expert → @architect → @po
8. Phase 2 Sharding (doc-sharding.md) — docs/prd/, docs/architecture/
9. Phase 3 Story Dev Cycle — @sprint-lead → @product-lead → @developer
```

---

## 2. Detecção greenfield (dual implementação ✅)

| Detection point | Implementação | Status |
|---|---|:-:|
| Auto-detect | `bob-orchestrator.detectProjectState()` L697-729 | ✅ implementado |
| Greenfield condition | `!package.json && !.git && !docs/` | ✅ coded |
| Fallback | `isGreenfield()` em greenfield-handler.js L186-193 | ✅ dual-check |
| State routing | `_routeByState()` L504 | ✅ conectado |

---

## 3. Workflows greenfield (3/3 coerentes)

| Workflow | Fases | Project types | Status |
|---|:-:|---|:-:|
| `greenfield-fullstack.yaml` (348 LOC) | 4 | web-app, saas, enterprise-app, prototype, mvp | 🟢 COHERENT |
| `greenfield-service.yaml` | 3 | REST, GraphQL, microservice (5 types) | 🟢 COHERENT |
| `greenfield-ui.yaml` | 3 | SPA, mobile, static (6 types) | 🟢 COHERENT (com risk externo: v0/Lovable refs) |

Todos com:
- Mermaid diagram completo
- Agent sequencing matching greenfield-handler.js
- Surface decisions (GO/PAUSE) mapped to SurfaceChecker

---

## 4. Tech stack support (claimed vs verified)

| Stack | Claimed in workflows | Verified in code | Gap |
|---|:-:|:-:|---|
| Next.js | ✅ | ✅ environment-bootstrap.md scaffolds | — |
| React | ✅ | parcial | scanner ausente |
| Tailwind | ✅ | refs em templates | scanner ausente |
| Supabase | ✅ | ✅ refs em arch templates | — |
| Node.js services | ✅ | ✅ default | — |
| Python services | ✅ | ❌ | scaffolding não verificado |
| Go services | ✅ | ❌ | scaffolding não verificado |
| Rust services | ✅ | ❌ | scaffolding não verificado |
| React Native | ✅ | ❌ | scaffolding não verificado |
| Flutter | ✅ | ❌ | scaffolding não verificado |
| PostgreSQL | ✅ | parcial | refs em arch |
| MongoDB | ✅ | ❌ | não verificado |
| Firebase | ✅ | ❌ | não verificado |

**Achado:** Workflows prometem suporte multi-stack, mas implementação verificável é primariamente Next.js + Node.js + Supabase. Outros stacks têm refs declarativas mas scaffolding não foi encontrado.

---

## 5. Gaps de implementação CRITICAL

### 🔴 Gap 1: TerminalSpawner pode degradar
- L494-542 em greenfield-handler.js spawn agents com 2-hour timeout
- Se TTY indisponível → fallback pra manual instructions → workflow trava
- **Sem fallback automation chain documentado**

### 🟡 Gap 2: Wizard integration não totalmente rastreável
- `bin/commands/install.js` L370-394 chama wizard com `quiet: true`
- Wizard location: `packages/installer/src/wizard/index.js` (não verificado)
- Se `.sinapse-ai/` existe → wizard handles. Mas:
- **Falta:** file existence check em install.js — unclear se wizard cria ou atualiza

### 🟡 Gap 3: Agent task implementations (Phase 1) assumidos
- PHASE_1_SEQUENCE hardcoded: `[analyst, pm, ux, architect, po]`
- Tasks como `environment-bootstrap.md` existem
- **Falta:** verificação de que cada @agent tem implementação real do que Phase 1 espera

### 🟡 Gap 4: Tech stack auto-detection prometido mas inexistente
- Workflows prometem suporte multi-stack
- `project-intelligence.md` lista detection rules (framework, language, database, tests, CI)
- **Falta:** scanner real em `bin/lib/detection.js` ou orchestrators

---

## 6. Documentation vs implementation matrix

| Promessa | Status |
|---|:-:|
| Fullstack scaffolding em Phase 0 | ✅ environment-bootstrap.md task definida |
| 5-agent Phase 1 sequence | ✅ PHASE_1_SEQUENCE hardcoded |
| Document sharding em Phase 2 | ✅ doc-sharding task referenciada |
| Story dev cycle em Phase 3 | ✅ Reusa story-lifecycle.md |
| Auto tech-stack detection | 🔴 Rules definidas, scanner ausente |
| Idempotency (resume) | ✅ checkIdempotency() L719-729 |
| Error recovery (Retry/Skip/Abort) | ✅ _handlePhaseFailure() L641-657 |

---

## 7. Recomendações priorizadas

### 🔴 CRITICAL
1. **Validar TerminalSpawner robustez** — adicionar fallback automation se TTY indisponível
2. **Verificar wizard atomicity** — confirmar que wizard.js cria `.sinapse-ai/` corretamente em diferentes states

### 🟡 HIGH
3. **Implementar tech-stack scanner real** em `bin/lib/detection.js` (ou marcar workflows como "Next.js-first" se outros stacks são aspirational)
4. **Verificar agent implementations** — testar Phase 1 sequence end-to-end com sub-agents reais
5. **Smoke test em VPS limpa** — única forma de validar tudo isso na prática

### 🟢 LOW
6. **Documentar limitações de stack** se Python/Go/Rust não são realmente suportados ainda

---

## 8. Cross-references validadas

- ✅ project-intelligence.md detection rules definidas
- ✅ greenfield-handler.js implementa routing
- ✅ environment-bootstrap.md task existe
- ✅ Workflows yaml estruturalmente válidos
- 🟡 Tech stack scanner não encontrado
- 🟡 Multi-stack scaffolding não verificado

---

## Conclusão

**Greenfield está bem ARQUITETADO mas com gaps de IMPLEMENTAÇÃO em áreas avançadas (multi-stack, runtime spawner robustness).** O caminho feliz (Next.js fullstack) provavelmente funciona; outros stacks são aspirational. Recomendação: smoke test real em VPS limpa pra validar end-to-end + decidir se generaliza ou foca em Next.js-first.
