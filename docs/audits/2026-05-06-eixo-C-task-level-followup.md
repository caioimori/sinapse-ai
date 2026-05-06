# EIXO C — Auditoria Task-Level (Follow-up)

**Data:** 2026-05-06
**Auditor:** Imperator (sinapse-orqx)
**Trigger:** Caio observou em 2026-05-06 squad orqx executando tarefas em vez de delegar. Eixo C original (config-level) foi resolvido em PR-12 + PR-13. Este follow-up cobre o gap **task-level** (config diz "delega" mas as tasks executam?).

---

## Limitação herdada do Eixo C

O Eixo C original auditou apenas a camada de **configuração** (agent.md). Sub-agent reportou:
- 16/19 orqx delegam corretamente (config)
- 3 híbridos com riscos

PR-12 + PR-13 padronizaram os 6 orqx flagged com:
- `## NON-NEGOTIABLE: ORCHESTRATE, DON'T EXECUTE`
- `## Integration: Delegates To` YAML estruturado

**Mas isso garante que o agent.md DECLARA delegação. Não garante que as TASKS chamadas pelo orqx delegam de fato.**

---

## Framework de detecção (manual / lint futuro)

Pra cada squad, analisar tasks em `squads/{squad}/tasks/*.md` e classificar:

### Tipo A — Tasks de orquestração (esperadas no orqx)
Padrão: filename contém verbos de coordenação:
- `orchestrate-*`, `coordinate-*`, `route-*`, `classify-*`, `select-workflow`, `audit-*`, `diagnose-*`, `manage-handoffs`, `conduct-*-gate`, `plan-*`, `select-*`

**Exemplos legítimos encontrados:**
- `squads/claude-code-mastery/tasks/audit-integration.md`
- `squads/squad-animations/tasks/orchestrate-animation-project.md`
- `squads/squad-animations/tasks/coordinate-multi-agent-delivery.md`
- `squads/squad-artdir/tasks/audit-drift-multi-surface.md`
- `squads/squad-artdir/tasks/create-art-direction-brief.md` ⚠️ (verbo `create` mas é brief de orquestração)

**Verificar:** Essas tasks devem ter `delegate to {agent}` ou `route to {specialist}` como step explícito, não executar conteúdo direto.

### Tipo B — Tasks de execução (esperadas em specialists)
Padrão: filename contém verbos executoras:
- `write-*`, `create-*`, `build-*`, `generate-*`, `design-*`, `implement-*`, `code-*`, `draw-*`, `render-*`, `compose-*`

**Exemplos do filesystem (sample):**
- `squads/squad-design/tasks/create-a11y-remediation-plan.md`
- `squads/squad-animations/tasks/build-css-3d-transform.md`
- `squads/squad-product/tasks/build-opportunity-solution-tree.md`
- `squads/squad-copy/tasks/build-headline-swipe-file.md`

**Verificar:** Essas tasks NÃO devem aparecer em commands do orqx. Devem ser invocadas via delegação a specialist.

### Tipo C — Tasks ambíguas (precisam revisão case-by-case)
Tasks sem verbo claro no filename (ex: `claude-md-engineer.md`, `worktree-strategy.md`).

**Verificar:** Quem chama? Se chamada por orqx direto, é violação. Se via specialist, OK.

---

## Recomendações

### Curto prazo (PR-14, próxima sessão)
**Lint guard `validate:orqx-discipline`** que detecta:
1. Orqx com `commands:` listando verbos executoras (`*write-X`, `*create-X`, `*build-X`)
2. Tasks orqx referenciando outras tasks Tipo B sem step de delegação
3. Specialists sendo chamados ZERO vezes pelos orqx do mesmo squad (especialista órfão)

Allowlist (commands legítimos pra orqx):
- `*route-*`, `*delegate-*`, `*orchestrate-*`, `*coordinate-*`, `*synthesize-*`
- `*status`, `*help`, `*plan`, `*brief`, `*classify-*`, `*conduct-*`
- `*audit-*` (audit é orquestração — sumariza output dos especialistas)
- `*select-workflow`, `*manage-handoffs`

Patterns FORBIDDEN (verbos de execução):
- `*write-*`, `*create-*` (exceto brief/plan), `*build-*` (exceto experiment-knowledge-base?), `*design-*`, `*generate-*`, `*implement-*`

### Médio prazo
**Auditoria task-level cirúrgica** com sub-agent dedicado:
- Pra cada um dos 18 squads, listar todas as tasks (`squads/*/tasks/`)
- Cross-reference cada task com agent que a invoca
- Identificar:
  - Tasks órfãs (não invocadas por nenhum agent)
  - Tasks invocadas pelo orqx mas com escopo de specialist
  - Specialists com 0 tasks invocadas
- Output: tabela por squad com saúde da delegação

### Longo prazo
**Runtime telemetry** que rastreia:
- Quantas vezes cada agent é invocado (orqx vs specialists)
- Duração média de cada invocação
- Detectar drift entre config (delegates_to:) e comportamento real

---

## Como Caio pode validar manualmente

Pegar 1 squad por vez e rodar:

```bash
# 1. Ver commands do orqx
grep -A 2 "commands:" squads/{squad}/agents/{squad}-orqx.md

# 2. Ver tasks executoras (Tipo B) no squad
ls squads/{squad}/tasks/ | grep -E "^(write|create|build|generate|design)-"

# 3. Ver se as tasks Tipo B aparecem em commands do orqx (RED FLAG se sim)
```

Squad mais provável de ter problema: `squad-copy` (muitos verbos `build-*`, `write-*` em tasks).

---

## Status

✅ **Eixo C config-level resolvido** (PR-12 + PR-13)
🟡 **Eixo C task-level FRAMEWORK documentado** (este doc)
⏸️ **Lint automático** — PR-14 (próxima sessão)
⏸️ **Auditoria cirúrgica completa** — backlog (1 sessão dedicada)

---

## Output

Esta auditoria não toca em código. Próxima sessão:
1. PR-14: Implementar lint baseado nas regras acima
2. (Opcional) Auditoria cirúrgica via sub-agent dedicado pra mapear violações concretas
