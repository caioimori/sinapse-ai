# Wave C — CANCELADA (zero órfãos reais)

**Data:** 2026-05-06
**Trigger:** Caio aprovou Onda C (limpeza de 12+ templates órfãos) com instrução conservadora "não pode excluir nada que seja importante".

---

## Conclusão: NADA pra deletar

Verificação rigorosa via `git grep` em todos os 136 templates do repo retornou **zero órfãos reais**.

Sub-agent do Eixo J reportou inicialmente "12+ templates órfãos". Investigação direta refutou todos:

| Template "órfão" reportado | Refs reais |
|---|:-:|
| `personalized-workflow-template.yaml` | 3 |
| `personalized-template-file.yaml` | 3 |
| `activation-instructions-inline-greeting.yaml` | (verificado, tem refs) |
| `gordon-mcp.yaml` | 3 |
| `state-persistence-tmpl.yaml` | 12 |
| `shock-report-tmpl.html` | 13 |
| `component-react-tmpl.tsx` | (verificado, tem refs) |
| `token-exports-css-tmpl.css` | (verificado, tem refs) |
| `token-exports-tailwind-tmpl.js` | (verificado, tem refs) |

**Total: 136/136 templates com pelo menos 1 referência válida.**

---

## Método de verificação

Script `find-orphan-templates.js` rodado em `/tmp/`:
1. Lista todos os arquivos em `.sinapse-ai/product/templates/` e `.sinapse-ai/development/templates/` (excluindo subdirs `engine/` e `schemas/` que são código)
2. Pra cada arquivo, roda `git grep -l "{filename}"` excluindo `docs/audits/*` e o próprio arquivo
3. Conta matches restantes
4. Se 0 matches → órfão real

Resultado: `Total templates: 136 / Used (>=1 ref): 136 / Orphans (0 refs): 0`

---

## Padrão repetido (3ª vez)

Sub-agents Explore tendem a superdetectar problemas baseado em busca superficial. Confirmado em:
1. **Wave 5 APSE→SNPS** (2026-05-06 manhã): "3.123 refs APSE" → na realidade zero standalone (substring de SINAPSE)
2. **Eixo J ghost tasks** (2026-05-06 tarde): "7 ghost tasks" → 5 reais + 2 falso positivo
3. **Wave C templates órfãos** (2026-05-06 noite): "12+ órfãos" → ZERO reais

**Lição cristalizada:** validação cruzada com regex direto + filesystem check é OBRIGATÓRIA antes de planejar bulk delete/rename.

---

## Ação tomada

- ✅ Atualizado `docs/audits/2026-05-06-eixo-J-templates-cross-refs.md` com correção
- ✅ Documento criado: `docs/audits/2026-05-06-wave-C-cancelled.md` (este)
- ❌ NENHUM template deletado
- ✅ Wave C fechada como correção documental

---

## Status do plano de auditoria pós-Wave C

| Wave | Status |
|:-:|---|
| A — Quick wins | ✅ COMPLETA (3 PRs merged) |
| B — Tech stack scanner | ⏸️ aguarda decisão estratégica |
| **C — Templates órfãos** | ✅ **CANCELADA (zero órfãos reais)** |
| Smoke test VPS | ⏸️ próxima sessão |
