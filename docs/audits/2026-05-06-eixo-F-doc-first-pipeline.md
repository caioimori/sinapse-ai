# EIXO F — Documentation-First Pipeline

**Data:** 2026-05-06
**Auditor:** Imperator (sinapse-orqx)
**Método:** Cross-reference de tasks/templates/workflows centrais contra filesystem
**Trigger:** Caio pediu validação do pipeline doc-first como parte da segunda auditoria.

---

## Verdict: 🟢 HEALTHY — pipeline funcional, 1 gap menor

Pipeline `Epic → Story → Validation → Implementation` tem **todos os artifacts essenciais existentes e cross-referenciados corretamente**.

---

## 1. Tasks centrais (13/13 OK)

| Task | Status | Função |
|---|:-:|---|
| `create-next-story.md` | ✅ | Cria story (alias) |
| `sm-create-next-story.md` | ✅ | Sprint Lead cria story do epic |
| `dev-validate-next-story.md` | ✅ | PO valida story (10-point checklist) |
| `dev-develop-story.md` | ✅ | Developer executa story |
| `qa-review-story.md` | ✅ | Quality Gate revisa |
| `execute-epic-plan.md` | ✅ | Project Lead orquestra epic |
| `spec-gather-requirements.md` | ✅ | Spec Pipeline Phase 1 |
| `spec-assess-complexity.md` | ✅ | Spec Pipeline Phase 2 |
| `spec-critique.md` | ✅ | Spec Pipeline Phase 5 |
| `analyze-brownfield.md` | ✅ | Brownfield discovery |
| `brownfield-create-epic.md` | ✅ | Brownfield epic creation |
| `brownfield-create-story.md` | ✅ | Brownfield story creation |
| `create-brownfield-story.md` | ✅ | Brownfield story (variante — possível duplicação, ver Eixo I) |

---

## 2. Templates centrais (4/4 OK, 1 nomenclatura diferente)

| Template | Esperado | Encontrado | Status |
|---|---|---|:-:|
| `story-tmpl.yaml` | `.sinapse-ai/product/templates/` | ✅ existe (schema v2) | ✅ |
| `epic-tmpl.yaml` | `.sinapse-ai/product/templates/` | ⚠️ não existe COMO `.yaml` |  🟡 |
| → `epic.hbs` | (alternativo) | ✅ existe (schema válido com template_id: epic) | ✅ |
| `prd-tmpl.yaml` | `.sinapse-ai/product/templates/` | ✅ existe | ✅ |
| `architecture-tmpl.yaml` | `.sinapse-ai/product/templates/` | ✅ existe | ✅ |

**Achado 🟡:** docs (`docs/framework/source-tree.md`, `docs/pt/guides/template-engine-v2.md`, etc. — 5 arquivos) referenciam `epic-tmpl.yaml`. Realidade: o template existe como `epic.hbs` (handlebars). Não é quebra, mas inconsistência de nomenclatura na documentação.

**Recomendação:** ou (a) renomear `epic.hbs` → `epic-tmpl.yaml` pra alinhar com convenção dos outros templates, ou (b) atualizar docs pra refletir `.hbs`. Decisão depende da preferência de template engine.

---

## 3. Workflows core (5/5 OK)

| Workflow | Função | Status |
|---|---|:-:|
| `story-development-cycle.yaml` | SDC — Phase 1-4 (Create→Validate→Implement→QA) | ✅ |
| `qa-loop.yaml` | QA Loop iterativo (max 5 iterações) | ✅ |
| `spec-pipeline.yaml` | Spec Pipeline (6 fases pra COMPLEX) | ✅ |
| `brownfield-discovery.yaml` | 10-phase brownfield assessment | ✅ |
| `epic-orchestration.yaml` | Beacon orchestra epic execution | ✅ |

---

## 4. Pipeline end-to-end

```
User briefing
    ↓
[se complex] → spec-gather-requirements (PM)
    ↓ → spec-assess-complexity (Architect)
    ↓ → spec-critique (QA)
    ↓
@project-lead *create-epic / *execute-epic-plan (gera EPIC-{ID}-EXECUTION.yaml)
    ↓
@sprint-lead *draft → create-next-story.md (gera {epicNum}.{storyNum}.story.md)
    ↓
@product-lead *validate → dev-validate-next-story.md (10-point checklist)
    ↓ [GO]
@developer *develop → dev-develop-story.md (CodeRabbit self-healing max 2 iter)
    ↓
@quality-gate *qa-gate → qa-review-story.md (7 quality checks)
    ↓ [PASS|CONCERNS|FAIL|WAIVED]
@devops *push → @sinapse-orqx routing back to user
```

✅ **Pipeline está mappable end-to-end.** Cada transição tem agente real + task real + template real (com nota do epic-tmpl).

---

## 5. Validações externas confirmadas

- ✅ Article III (Documentation-First) declarado em `.claude/CLAUDE.md` como NON-NEGOTIABLE
- ✅ Constitution mapeia `Documentation-First` em `.sinapse-ai/constitution.md`
- ✅ Rule `documentation-first.md` em `.claude/rules/` reforça
- ✅ `validate:article-vii` (Metrics Accuracy) — gate ativo

---

## 6. Gaps identificados

| # | Gap | Severidade | Esforço |
|---|---|:-:|:-:|
| F1 | `epic-tmpl.yaml` referenciado em 5 docs mas existe como `epic.hbs` | 🟡 LOW | Trivial (rename ou doc fix) |
| F2 | `create-brownfield-story.md` vs `brownfield-create-story.md` — possível duplicação | 🟡 LOW | Médio (analisar em Eixo I) |
| F3 | Templates citados em 282 arquivos diferentes — provável over-reference | 🟢 N/A | Auditoria Eixo J |

---

## 7. Recomendações

### Imediato (já no escopo de outros eixos)
- F1: deferir pra próximo PR de cleanup (decisão entre rename vs doc update)
- F2: investigar em Eixo I (brownfield audit)
- F3: investigar em Eixo J (templates cross-refs)

### Médio prazo
- Adicionar `validate:doc-first-pipeline` script que valida cross-refs do pipeline em CI
- Documentar visualmente o pipeline (diagrama) em `docs/`

---

## Conclusão

**Pipeline doc-first está FUNCIONAL.** Os 13 tasks + 4 templates + 5 workflows core estão todos no lugar e cross-referenciados corretamente. Único gap real é nomenclatura (epic.hbs vs epic-tmpl.yaml).

Próximos eixos (G, H, I, J) vão validar a EXECUÇÃO real dos workflows, não só a presença dos artifacts.
