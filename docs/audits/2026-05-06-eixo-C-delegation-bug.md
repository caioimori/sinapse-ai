# EIXO C — Delegação vs Execução nos Squad Orchestrators

**Data:** 2026-05-06
**Auditor:** sub-agent Explore (read-only)
**Método:** Leitura completa dos squad orchestrator agents (`squads/*/agents/*-orqx.md` + variantes)
**Trigger:** Caio observou em 2026-05-06 que squad orqx estavam executando tarefas em vez de delegar.

---

## Verdict: ⚠️ MODERATE — diferença entre declaração (config) e execução (runtime)

Sub-agent reportou **16/19 orqx delegam corretamente em CONFIG** (yaml + texto), 3 são híbridos. **Conformidade declarada: 84%.**

### Atenção: gap potencial entre config e comportamento

A observação do Caio é sobre comportamento real (squad orqx EXECUTANDO tarefas). O sub-agent só verificou se a declaração diz "delega". Possível gap:

| Camada | O que o auditor checou | O que pode estar quebrado |
|---|---|---|
| **Config (declaration)** | yaml `delegates_to:`, persona, commands | 16/19 declaram delegação |
| **Tasks (execution)** | tasks com step "delegate to specialist X"? | NÃO checado profundamente |
| **Runtime (real behavior)** | orqx invoca o especialista quando ativado? | NÃO checável estaticamente |

**Recomendação:** validar com Caio QUAL squad orqx ele observou executando direto, depois fazer deep-dive cirúrgico nesse arquivo + tasks específicas.

---

## Achados do sub-agent

### ✅ Delegam corretamente (16/19)

brand, copy, paidmedia, animations, design, content, finance, growth, commercial, product, research, council, storytelling, cyber, courses, cloning

Padrão correto observado em todos:
1. Seção `delegates_to:` mapeando tipo_request → agente
2. Persona descreve ORQUESTRAÇÃO (diagnose/route/coordinate/synthesize), não execução
3. `context_passed:` documentado em cada delegação
4. Quality gates antes de avançar
5. Escalation pra `@sinapse-orqx` quando exceção

### ⚠️ Híbridos com riscos (3/19)

| Orqx | Problema | Severidade |
|---|---|---|
| **claude-orqx (Orion)** | Sem seção `delegates_to:` estruturada como tabela. Usa "Delegation Matrix" textual — funciona mas é menos padrão. Risco: ambiguidade em casos novos. | 🟡 HIGH |
| **artdir-orqx (Canvas)** | Tem `delegates_to` mas define escopo PARCIALMENTE em "O que NÃO faz" (anti-pattern: definição por negação). ~85% correto. | 🟡 MEDIUM |
| **Imperator (sinapse-orqx)** | Padrão ouro — `relationships.delegates_to` + `intelligent_routing` (direct vs via-orchestrator) explícito. **Referência canônica.** | ✅ BENCHMARK |

### Padrão estrutural canônico (do Imperator)

Todos squad orqx deveriam replicar:

```yaml
relationships:
  delegates_to:
    - agent: {specialist-id}
      context_passed: [campo1, campo2, campo3]
      when: "{trigger condition}"

intelligent_routing:
  direct_to_specialist:
    when: "Single, well-defined task"
    examples: [...]
  via_orchestrator:
    when: "Multi-agent workflow"
    examples: [...]

commands:
  - name: "*route"
    description: "Diagnose and route to correct specialist"
  # NÃO ter commands tipo "*write-X" ou "*create-X" no orqx
```

---

## Recomendações

### Fix imediato
1. Padronizar `claude-orqx` com `delegates_to:` table explícita (não textual)
2. Padronizar `artdir-orqx` removendo definição por negação
3. Validar com Caio qual squad ele observou em comportamento errado

### Prevenção de regressão
1. **Gate pré-merge:** linter exige `delegates_to:` table em todo `*-orqx.md` novo
2. **Lint rule:** detectar verbos `execute`/`write`/`create` direto em `commands` sem prefixo `*route-to-`
3. **Audit trimestral:** re-validar todos orqx contra template Imperator
4. **Task-level audit:** próxima rodada deve auditar TASKS dos orqx, não só agent.md (config pode dizer "delega" e task ter step de execução)

---

## Limites desta auditoria

- ✅ Config layer (agent.md) auditado profundamente
- ⚠️ Task layer (tasks de cada orqx) NÃO auditado em profundidade
- ❌ Runtime behavior NÃO checável (precisa observação real ou test harness)

**Achado de Caio precisa de follow-up cirúrgico:** qual squad orqx, qual sessão, qual comando. Sem isso, ficamos com config-only audit.
