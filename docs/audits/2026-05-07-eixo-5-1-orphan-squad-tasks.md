# Audit 5.1 — Tasks Órfãs em Squads

**Data:** 2026-05-07
**Auditor:** Imperator (sinapse-orqx)
**Método:** Script `find-orphan-squad-tasks.js` rodado em todos os 18 squads
**Trigger:** Categoria 5 do plano mestre — auditar áreas sem audit dedicada

---

## Verdict: 🟢 SAUDÁVEL — 98.8% das tasks têm referências válidas

**1.198 / 1.213 squad tasks (98.8%) têm pelo menos 1 referência no repo.** Apenas 15 órfãs (1.2%), todas concentradas em **claude-code-mastery**.

---

## 1. Tabela por squad

| Squad | Total tasks | Órfãs | Status |
|---|---:|---:|:-:|
| **claude-code-mastery** | 51 | **15** | 🟡 |
| squad-animations | 75 | 0 | ✅ |
| squad-artdir | 13 | 0 | ✅ |
| squad-brand | 97 | 0 | ✅ |
| squad-cloning | 54 | 0 | ✅ |
| squad-commercial | 85 | 0 | ✅ |
| squad-content | 90 | 0 | ✅ |
| squad-copy | 81 | 0 | ✅ |
| squad-council | 56 | 0 | ✅ |
| squad-courses | 59 | 0 | ✅ |
| squad-cybersecurity | 53 | 0 | ✅ |
| squad-design | 101 | 0 | ✅ |
| squad-finance | 45 | 0 | ✅ |
| squad-growth | 77 | 0 | ✅ |
| squad-paidmedia | 82 | 0 | ✅ |
| squad-product | 75 | 0 | ✅ |
| squad-research | 72 | 0 | ✅ |
| squad-storytelling | 47 | 0 | ✅ |
| **TOTAL** | **1.213** | **15** | — |

**17 dos 18 squads sem órfã alguma.** Apenas claude-code-mastery concentra todas as 15 órfãs.

---

## 2. As 15 órfãs em claude-code-mastery

Todas são **tasks avançadas sobre Claude Code mastery** que não são invocadas por agents nem workflows atualmente:

| Task | Provável uso futuro |
|---|---|
| `ai-testing-automation.md` | Test automation com IA |
| `content-curation-pipeline.md` | Pipeline de curadoria de conteúdo |
| `context-window-audit.md` | Auditoria de uso de context window |
| `end-to-end-ai-workflow.md` | E2E AI workflow design |
| `few-shot-example-library.md` | Library de few-shot examples |
| `human-in-the-loop-design.md` | Design de HITL flows |
| `knowledge-retrieval-optimization.md` | Otimização de RAG |
| `mcp-integration-audit.md` | Audit de MCP integration |
| `mcp-server-design.md` | Design de MCP servers |
| `multi-agent-orchestration.md` | Orchestration patterns |
| `multi-turn-conversation-design.md` | Multi-turn UX |
| `prompt-testing-framework.md` | Framework de prompt testing |
| `slash-command-library-design.md` | Slash commands custom |
| `system-prompt-design.md` | System prompt engineering |
| `tool-orchestration-pattern.md` | Tool use patterns |

---

## 3. Origem provável

Essas 15 tasks foram **migradas do `squad-claude`** durante consolidação (PR #168, 2026-05-06):

```
git mv squads/squad-claude/tasks/{*}.md → squads/claude-code-mastery/tasks/{*}.md
```

A migração preservou os arquivos, mas **agents/workflows que invocavam não foram atualizados** porque o squad-claude original tinha apenas alguns agents (claude-orqx, db-sage, tools-orqx) que migraram, mas nenhum desses agents referencia explicitamente essas 15 tasks específicas.

---

## 4. Análise de valor

Inspeção rápida do conteúdo: **todas as 15 tasks têm valor de domínio real** (não são experimentos abandonados). São extensões avançadas pra:
- Quem está construindo features Claude Code-nativas (slash commands, MCP servers, hooks)
- Quem precisa otimizar custos de tokens (context audit, RAG optimization)
- Quem precisa testar prompts sistematicamente

---

## 5. Recomendação

### NÃO deletar (per instrução do Caio em 2026-05-07)
Todas têm valor potencial. Deletar removeria capability genuína do framework.

### Reativar (preferido)

**Opção A: Adicionar a `claude-mastery-chief.md` agent commands**

```yaml
# claude-mastery-chief.md
commands:
  - name: "*audit-context-window"
    task: "context-window-audit.md"
  - name: "*design-system-prompt"
    task: "system-prompt-design.md"
  - name: "*build-prompt-testing-framework"
    task: "prompt-testing-framework.md"
  # ... (+12 outras)
```

**Opção B: Criar workflow `claude-mastery-deep-dive.yaml`**
Workflow que sequencia essas 15 tasks em fluxo coerente (audit → design → test → deploy).

**Opção C: Mover pra subpasta `advanced/`**
`squads/claude-code-mastery/tasks/advanced/` — sinaliza que são opt-in.

### Manter como está (aceitar dívida)

Tasks ficam disponíveis pra invocação direta (`/claude:tasks:context-window-audit`) mas não são parte do workflow padrão.

---

## 6. Decisão recomendada

**Opção A** (adicionar a `claude-mastery-chief` commands) — restaura visibilidade sem refatoração grande.

Esforço: ~15min editando agent.md.
Risco: Baixo (additive).
Benefício: 15 tasks viram capability invocável; framework cumpre promessa.

---

## 7. Próximo passo (opcional)

Criar PR S2-PR-X (Sessão 2) com Opção A se Caio aprovar.

Por agora: **audit-only, ZERO mudanças**. As 15 tasks ficam onde estão.

---

## 8. Status do plano de auditoria pós-Audit 5.1

| Categoria | Item | Status |
|:-:|---|:-:|
| 1 | Stowaway fixes (3 PRs) | ✅ COMPLETA |
| 5.1 | Squads tasks órfãs audit | ✅ COMPLETA (este doc) |
| 5.2 | MCP integration audit | ⏸️ próxima sessão |
| 5.3 | Skills audit | ⏸️ próxima sessão |

---

## Conclusão

**Squads são overwhelmingly saudáveis (98.8%).** As 15 órfãs em claude-code-mastery são herança de migração e têm valor real — recomendação é REATIVAR (Opção A), não deletar.

Padrão "não excluir nada importante" respeitado: zero deletes nesta sessão. Audit informa decisão futura.
