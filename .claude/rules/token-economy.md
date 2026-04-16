# Token Economy — NON-NEGOTIABLE

> Source of truth: `.sinapse-ai/development/knowledge-base/token-economy-guide.md` (read when needed, not re-injected).
> Complementa: `~/.claude/rules/response-format.md`.

---

## 1. Compactação

| Trigger | Threshold |
|---|---|
| Auto-compact | **60%** do contexto (não 83%) |
| Manual `/compact` | Troca de agente; pós-leitura de arquivo grande |
| Pre-agent-switch | Handoff artifact (~379 tok) via `agent-handoff.md` |

Por que 60%? Acima disso já perde coerência sobre instruções iniciais ("context amnesia").

---

## 2. Model Routing (MUST)

**Regra zero:** Execute direto sempre que der. Sub-agente custa ~20K mínimo.

| Task | Modelo |
|---|---|
| Arquitetura cross-system, debug complexo, auditoria, refactor multi-file | **opus** |
| Feature do spec, code review, bug fix com causa, testes, stories | **sonnet** |
| Lint, rename, validação YAML, lookup, bulk processing | **haiku** |

- Em dúvida entre tiers: escolhe o menor. Escala se falhar.
- Nunca opus pra task que haiku resolve.
- Sub-agente anuncia modelo ao spawnar.

---

## 3. Anti-Patterns (FORBIDDEN)

| Anti-Pattern | Fix |
|---|---|
| Ler mesmo arquivo 2x | Uma vez, guarda line numbers |
| Persona completo em troca de agente | Handoff protocol |
| Grep/Glob sem `head_limit` | Sempre setar |
| **Re-ler arquivo após Edit/Write** | Edit confirma sucesso, não releia |
| Sub-agente pra task <5 tool calls | Faz inline |
| Não compactar antes de task longa | Compacta em 60% |
| Sequential reads quando independentes | Paralelo (uma mensagem, N tool calls) |
| Ler README/package.json sem necessidade | Só se task pedir |
| Cole payload bruto no raciocínio | Extrai só o relevante |

---

## 4. Hierarquia de Tool (MANDATORY)

```
Caminho conhecido → Read   (não Bash cat)
Padrão conhecido  → Grep   (não Bash grep)
Lista de arquivos → Glob   (não Bash find)
Edição pontual    → Edit   (não Write)
```

Bash só pra operações que nenhuma tool dedicada cobre.

Leitura cirúrgica: `offset`+`limit` pra ler seção, nunca 500 linhas pra usar 30.

---

## 5. Budget de Contexto (200K window)

| Alocação | Target | % |
|---|---:|---:|
| System + CLAUDE.md + Rules | ~17K | 8% |
| Agente + tools | ~5K | 3% |
| Working memory (arquivos, resultados) | **≤80K** | 40% |
| Histórico | ~58K | 29% |
| Safety buffer (compacta em 60%) | ~40K | 20% |

Working memory acima de 80K = sinal pra compactar.

---

## 6. Memory Anti-Patterns

- Não salvar estado efêmero (PR atual, task de hoje)
- Não salvar o que já tá em código/git
- Memory = fatos que surpreenderiam uma sessão futura, não log de sessão

---

## Enforcement

NON-NEGOTIABLE. Violação = falha de qualidade (Constitution Art. V).
Detalhes e tabelas de custo: `.sinapse-ai/development/knowledge-base/token-economy-guide.md`.
