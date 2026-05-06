# EIXO I — Brownfield Flow

**Data:** 2026-05-06
**Auditor:** sub-agent Explore (read-only)
**Método:** Read direto dos 4 yamls brownfield + 4 tasks + 3 templates + project-intelligence.md
**Trigger:** Validar se brownfield discovery não destrói projeto do usuário externo.

---

## Verdict: 🟡 FUNCIONALMENTE COERENTE — 1 duplicação CRÍTICA

Brownfield flow está bem estruturado, mas tem duplicação de tasks que cria ambiguidade pra workflows.

---

## 1. Detecção brownfield (project-intelligence.md)

✅ **Funciona.** Detecta `package.json`/`.git` presente, diferencia greenfield vs brownfield em <5s com quick tech scan:
- Framework (Next.js, Express, Vue, etc.)
- Language (TypeScript via tsconfig)
- Database (Supabase, Prisma, Drizzle)
- Tests (Jest, Vitest)
- CI (GitHub Actions)

---

## 2. Discovery não-destrutivo (brownfield-discovery.yaml v2.0)

✅ **Excelente.** 10 fases multi-agente:

| Fase | Agente | Output |
|---|---|---|
| 1 | @architect | system-architecture.md |
| 2 | @data-engineer | SCHEMA.md + DB-AUDIT.md (se DB) |
| 3 | @ux-design-expert | frontend-spec.md |
| 4 | @architect | technical-debt-DRAFT.md |
| 5 | @data-engineer | db-specialist-review.md |
| 6 | @ux-design-expert | ux-specialist-review.md |
| 7 | @quality-gate | qa-review.md (Gate APPROVED \| NEEDS WORK) |
| 8 | @architect | technical-debt-assessment.md (final) |
| 9 | @analyst | TECHNICAL-DEBT-REPORT.md (executivo) |
| 10 | @project-lead | Epic + stories ready |

✅ Respeita CI existente
✅ Não sobrescreve configs (.github/, .gitignore)
✅ Multi-agente coordenado via gates

---

## 3. Workflows brownfield (4/4 coerentes)

| Workflow | Fases | Agentes | Status |
|---|:-:|---|:-:|
| `brownfield-discovery.yaml` | 10 | architect, data-engineer, ux-design-expert, qa, analyst, project-lead | ✅ |
| `brownfield-fullstack.yaml` | 4 | rota 3 caminhos (single-story / epic / full-workflow) | ✅ |
| `brownfield-service.yaml` | 3 | espelho de UI | ✅ |
| `brownfield-ui.yaml` | 3 | inclui ux-design-expert | ✅ |

Todos com agentes reais + templates referenciados existindo.

---

## 4. Templates brownfield (3/3 existem)

| Template | Função | Status |
|---|---|:-:|
| `brownfield-prd-tmpl.yaml` | PRD pra projeto existente | ✅ |
| `brownfield-architecture-tmpl.yaml` | Análise arquitetura | ✅ |
| `brownfield-risk-report-tmpl.yaml` | Risk report | ✅ |

---

## 5. 🔴 DUPLICAÇÃO CRÍTICA detectada

**Tasks similares com nomes confusos:**

| Task | LOC | Função | Quem usa |
|---|---:|---|---|
| `brownfield-create-story.md` | 150 | PM cria 1 story isolada (simples, <4h) | Workflows + agent commands |
| `create-brownfield-story.md` | 720 | SM/PM cria story de docs variados (complexa) | Workflows + agent commands |

**Problema:** Workflows referenciam **ambas as tasks** sem distinguir quando usar qual. Usuário externo abrindo repo Next.js → project-intelligence detecta brownfield → roteia pra `brownfield-discovery` → Phase 10 chama `brownfield-create-story` ✓ MAS workflows também citam `create-brownfield-story` ✓ — gerando ambiguidade.

**Impacto:**
- Confusão pra LLM ao escolher qual task executar
- Manutenção dobrada
- Risco de divergência entre as duas implementações ao longo do tempo

---

## 6. Recomendação de fix

### Consolidação (PR sugerido)

**Opção A (recomendada):** Manter `create-brownfield-story.md` (720 LOC, mais completa) como canônica + adicionar parameter `scope=simple` que ativa modo rápido (substituindo a versão de 150 LOC). Deletar `brownfield-create-story.md`. Atualizar refs em workflows.

**Opção B:** Manter ambas com nomes mais claros:
- `brownfield-create-story-simple.md` (150 LOC, scope <4h)
- `brownfield-create-story-detailed.md` (720 LOC, scope complexo)

**Opção C:** Deletar `brownfield-create-story.md` (150 LOC) e referenciar apenas a versão de 720 LOC pra todos os casos. Risco: overkill pra cases simples.

Recomendação: **Opção A** (consolida + simplifica).

---

## 7. Risco pra usuário externo

| Cenário | Risco | Severidade |
|---|---|:-:|
| Abre repo Next.js existente | Discovery roda corretamente, não destrói nada | 🟢 BAIXO |
| Workflow ambíguo escolhe task errada | LLM pode confundir as 2 tasks brownfield-create-story | 🟡 MÉDIO |
| Sobrescreve CI existente | Nenhum risco — workflows respeitam | 🟢 BAIXO |
| Quebra conventions de código | Discovery analisa antes de mudar | 🟢 BAIXO |

---

## 8. Cross-references validadas

✅ Todos workflows brownfield apontam pra agentes existentes
✅ Templates referenciados existem
✅ Tasks brownfield apontam pra templates existentes
🔴 Tasks brownfield-create-story / create-brownfield-story duplicadas

---

## Conclusão

**Brownfield está funcionalmente saudável.** Detection + discovery + 4 workflows + 3 templates funcionam. Único bloqueador real: **consolidar as 2 tasks duplicadas de brownfield story creation** (PR cirúrgico, baixo risco).
