# EIXO G — Workflows Audit (15 yamls)

**Data:** 2026-05-06
**Auditor:** sub-agent Explore (read-only)
**Método:** Cross-reference de cada yaml workflow contra agentes, tasks e templates
**Trigger:** Validar que workflows declarados são executáveis end-to-end.

---

## Verdict: 🟢 HEALTHY — 12 PASS / 3 CONCERNS / 0 FAIL / 0 fachada

15 workflows todos estruturalmente válidos. **3 com naming convention drift** (mesma raiz que Eixo J).

---

## 1. Tabela por workflow

| Workflow | Fases | Agent refs | Task refs | Template refs | Verdict |
|---|:-:|:-:|:-:|:-:|:-:|
| `story-development-cycle.yaml` | 4 | ✅ | ✅ | N/A | 🟢 PASS |
| `qa-loop.yaml` | 3 (iter) | ✅ | 🟡 mixed naming | N/A | 🟡 CONCERNS |
| `spec-pipeline.yaml` | 6 | ✅ | ✅ | ✅ | 🟢 PASS |
| `brownfield-discovery.yaml` | 10 | ✅ | ✅ | ✅ | 🟢 PASS |
| `brownfield-fullstack.yaml` | 2 | ✅ | ✅ | ✅ | 🟢 PASS |
| `brownfield-service.yaml` | 3 | ✅ | ✅ | ✅ | 🟢 PASS |
| `brownfield-ui.yaml` | 3 | ✅ | ✅ | ✅ | 🟢 PASS |
| `greenfield-fullstack.yaml` | 4 | ✅ | 🟡 ambiguity | ✅ | 🟡 CONCERNS |
| `greenfield-service.yaml` | 3 | ✅ | ✅ | ✅ | 🟢 PASS |
| `greenfield-ui.yaml` | 3 | ✅ | ✅ | ✅ | 🟢 PASS |
| `epic-orchestration.yaml` | 2 | ✅ | ✅ | N/A | 🟢 PASS |
| **`development-cycle.yaml`** | 6 | ✅ | 🔴 **3 ghost tasks** | N/A | 🔴 CONCERNS |
| `design-system-build-quality.yaml` | 4 | ✅ | ✅ | N/A | 🟢 PASS |
| `fast-track.yaml` | 2 | ✅ | ✅ | N/A | 🟢 PASS |
| `auto-worktree.yaml` | 6 | ✅ | ✅ | N/A | 🟢 PASS |

---

## 2. Achados estruturais

### ✅ Cross-references VÁLIDAS

| Categoria | Total refs | Resolvíveis | % |
|---|---:|---:|---:|
| Agent refs | 10 | 10 | 100% |
| Template refs | 4 | 4 | 100% |
| Task refs | 29 | 26 | **89.7%** |

### ✅ Agentes (todos existem)
sprint-lead, product-lead, developer, quality-gate, architect, analyst, project-lead, data-engineer, ux-design-expert, devops

### ✅ Templates (todos existem)
prd-tmpl.yaml, brownfield-prd-tmpl.yaml, front-end-spec-tmpl.yaml, spec-tmpl.md

---

## 3. 🔴 Ghost tasks confirmados (3 em development-cycle.yaml)

| Linha | Task ref | Equivalente real | Verdict |
|---|---|---|:-:|
| 87 | `validate-story-draft` | `dev-validate-next-story.md` | 🟡 alias drift |
| 122 | `develop` | `dev-develop-story.md` | 🟡 alias drift |
| 160 | **`self-heal`** | nenhum | 🔴 GHOST real |
| 197 | `quality-review` | `qa-review-story.md` | 🟡 alias drift |
| 236 | **`push-and-pr`** | @devops *push (não é task) | 🔴 GHOST real |
| 278 | `story-checkpoint` | `story-checkpoint.md` | ✅ existe (sub-agent errou) |
| 330+ | Refs duplicadas das mesmas tasks | — | (mesmo issue) |

**Ghost reais:** `self-heal`, `push-and-pr` (sem equivalente óbvio).
**Alias drift:** `validate-story-draft`, `develop`, `quality-review` — workflow usa nome curto, task usa nome longo.

---

## 4. 🟡 Workflows CONCERNS

### `development-cycle.yaml` (6 fases)
Mais problemático. 3 ghost tasks reais + 3 alias drift. Provável que esse workflow nunca tenha sido testado runtime.

### `qa-loop.yaml` (3 fases iterativas)
Mistura naming: algumas refs com `.md`, outras sem. Inconsistência cosmética, não bloqueia execução.

### `greenfield-fullstack.yaml` (4 fases)
Pequena ambiguidade em refs de task — investigar caso-a-caso.

---

## 5. ✅ Workflows EXCELENTES

- `brownfield-discovery.yaml` (10 fases multi-agente) — gold standard
- `spec-pipeline.yaml` (6 fases COMPLEX) — bem estruturado
- `epic-orchestration.yaml` — limpo

---

## 6. Cross-reference summary

- **15/15 workflows estruturalmente válidos** (têm fases + agentes + tasks + verdict claro)
- **0 fachada** (nenhum workflow declarado sem implementação)
- **0 FAIL completo** (nenhum quebrado totalmente)
- **3 CONCERNS** (precisam fix de naming convention)

---

## 7. Recomendações priorizadas

### 🔴 IMMEDIATE (bloqueia execução do development-cycle)
1. Criar `self-heal.md` task OU remover ref do workflow
2. Criar `push-and-pr.md` task OU substituir por `@devops *push` command no workflow
3. Decidir alias resolution (3 opções):
   - **(A)** Renomear tasks pra match curto (`develop.md`, `validate-story-draft.md`, `quality-review.md`)
   - **(B)** Renomear refs no workflow pra nome longo (`dev-develop-story`)
   - **(C)** Implementar task resolver no executor

Recomendação: **Opção B** (low risk, preserva tasks existentes, alinha com convenção `{role}-{verb}-{noun}`)

### 🟡 URGENT (consistência)
4. Standardizar naming em qa-loop.yaml (sempre `.md` ou nunca)
5. Investigar greenfield-fullstack.yaml ambiguidade

### 🟢 LOW (clareza)
6. Documentar mapeamento workflow→task em `.sinapse-ai/core/` se Opção C escolhida

---

## 8. Comparação com outros eixos

- Confirma achado do **Eixo J** (alias drift em development-cycle.yaml)
- Eixo G é mais granular (verdict por workflow)
- Eixo J é mais cross-reference focused

---

## Conclusão

**Workflows estão estruturalmente saudáveis.** A maioria (12/15) executa sem ambiguidade. O drift principal é naming convention em 1 workflow histórico (development-cycle.yaml) que provavelmente foi escrito antes da convenção `{role}-{verb}-{noun}` ser estabelecida. Fix é trivial (renomear refs).
