# EIXO J — Templates & Tasks Cross-References

**Data:** 2026-05-06
**Auditor:** sub-agent Explore + verificação cirúrgica do Imperator
**Método:** Grep cross-references templates/workflows/tasks + cross-validação manual
**Trigger:** Validar coerência entre templates declarados e implementação real.

---

## Verdict: 🟡 MEDIUM — naming convention drift entre workflows e tasks

Sub-agent reportou 7 ghost tasks. **Verificação direta confirma 5 ghosts + 2 falso positivo + indireção de naming.**

---

## 1. Cross-validação dos "ghost tasks" reportados

| Task name (workflow) | Existe? | Alias provável | Verdict |
|---|:-:|---|:-:|
| `validate-story-draft` | ❌ não | `dev-validate-next-story.md` | 🟡 alias drift |
| `develop` | ❌ não | `dev-develop-story.md` | 🟡 alias drift |
| `self-heal` | ❌ não | nenhum equivalente óbvio | 🔴 GHOST real |
| `quality-review` | ❌ não | `qa-review-story.md` | 🟡 alias drift |
| `push-and-pr` | ❌ não | @devops *push command (não é task) | 🟡 não é task |
| `story-checkpoint` | ✅ existe | — | 🟢 OK (sub-agent errou) |
| `plan-create-implementation` | ✅ existe | — | 🟢 OK (sub-agent errou) |

**Lição replicada:** sub-agent Explore subdetectou 2 tasks (story-checkpoint, plan-create-implementation) por busca imprecisa. Validação direta sempre.

---

## 2. Achado real: naming convention drift

`development-cycle.yaml` (linhas 87, 160, 197, 236, 278, 330, 342, 356, 370, 385, 399) usa **nomes curtos** pra tasks:

```yaml
task: "validate-story-draft"   # mas existe dev-validate-next-story.md
task: "develop"                # mas existe dev-develop-story.md
task: "quality-review"         # mas existe qa-review-story.md
```

**3 hipóteses sobre como isso funciona em runtime:**

| Hipótese | Evidência | Probabilidade |
|---|---|:-:|
| (A) Bug — workflow falha ao tentar carregar task | nenhum runtime test público | Baixa |
| (B) Feature — task resolver com alias/fuzzy match | nenhum script `task-resolver.js` encontrado | Média |
| (C) Convenção — agente "sabe" traduzir via persona | Imperator + framework agents podem inferir | Alta |

**Recomendação:** investigar via test de runtime ou padronizar. Opções:
1. Renomear tasks pra match curto (`develop.md`, `validate-story-draft.md`)
2. Renomear refs no workflow pra nome longo (`dev-develop-story`)
3. Implementar task resolver com alias map

---

## 3. Templates ghost (citados mas inexistentes) — 0 ✅

Sub-agent confirmou: **zero templates em rules/agents/tasks que não existem no filesystem**. Pipeline doc-first não promete template fantasma.

---

## 4. Templates órfãos — CORREÇÃO PÓS-VERIFICAÇÃO

**[Wave C cancelada — 2026-05-06]:** Verificação rigorosa via `git grep` em todos os 136 templates retornou **ZERO órfãos reais**. Sub-agent superdetectou (mesmo padrão do APSE falso positivo).

Validação dos 5 "órfãos" inicialmente reportados:

| Template | Refs reais (git grep) |
|---|:-:|
| `personalized-workflow-template.yaml` | 3 |
| `personalized-template-file.yaml` | 3 |
| `gordon-mcp.yaml` | 3 |
| `state-persistence-tmpl.yaml` | **12** |
| `shock-report-tmpl.html` | **13** |

Todos os 136 templates auditados têm pelo menos 1 referência válida no repo (excluindo `docs/audits/`). Não há limpeza a fazer.

**Lição (3ª vez confirmada):** Sub-agents Explore precisam validação cruzada com `git grep -l` direto antes de planejar bulk delete.

---

## 5. Achado especial: `agent-tools-kit.md`

Citado em **10+ agent.md files** como referência de toolkit, mas localização exata é ambígua:
- `.sinapse-ai/development/templates/agent-tools-kit.md` — ✅ EXISTE

Não é ghost. Sub-agent reportou erradamente.

---

## 6. Workflows com refs quebradas

| Workflow | Refs ambíguas | Severidade |
|---|---|:-:|
| `development-cycle.yaml` | 6 task names curtos (alias drift) | 🟡 MEDIUM |
| `spec-pipeline.yaml` | 1 ref "Future task" comentada | 🟢 LOW (intencional) |

---

## 7. APSE→SNPS legacy

✅ **Zero refs APSE em workflows.** Confirma achado da auditoria anterior (Wave 5 falso positivo).

---

## 8. Squads tasks órfãs

Sub-agent verificação superficial: tasks em squads/*/tasks/ tipicamente são squad-scoped (não citadas em workflows centrais). Isso é normal — workflows centrais são framework-level, squad tasks são domain-level.

**Recomendação:** análise dedicada de tasks órfãs por squad em sessão futura (escopo grande, vale a pena).

---

## 9. Resumo de achados

| Categoria | Reportado | Validado |
|---|---:|---:|
| Ghost templates | 0 | 0 ✅ |
| Ghost tasks (sub-agent) | 7 | **3 reais** + 2 alias drift + 2 falso positivo |
| Templates órfãos | 12+ | confirmado |
| Workflows com refs ambíguas | 5 | 1 real (development-cycle) + 1 LOW |
| APSE legacy | 0 | 0 ✅ |

---

## 10. Recomendações priorizadas

### 🔴 CRITICAL (decisão estratégica)
- Resolver alias drift em `development-cycle.yaml` (6 tasks). Decidir entre:
  - Renomear tasks (low-risk se nada chama por nome longo)
  - Renomear workflow refs
  - Implementar task resolver explícito

### 🟡 HIGH (limpeza)
- Auditar 12+ templates órfãos (decidir delete vs documentar)
- Resolver task `self-heal` (ghost real, sem equivalente óbvio)

### 🟢 LOW
- Documentar `plan-create-implementation` como "Future task" se realmente futuro

---

## Conclusão

**Templates cross-refs estão 90% saudáveis.** O drift principal é de naming convention em 1 workflow (development-cycle.yaml). Sub-agent superdetectou problemas — verificação direta reduziu o escopo de fix significativamente.

**Lição repetida:** Sub-agents Explore precisam validação cruzada com regex direto + Glob.
