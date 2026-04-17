# Token Economy & Response Format — NON-NEGOTIABLE

> Consolidado: economia de contexto + formato de resposta em uma única regra.
> Princípio: desperdício de contexto degrada qualidade E custa caro. Mesmo inimigo.
> Detalhes: `.sinapse-ai/development/knowledge-base/token-economy-guide.md`.

---

## 1. Compactação

| Trigger | Threshold |
|---|---|
| Auto-compact | **60%** do contexto (não 83%) |
| Manual `/compact` | Troca de agente; pós-leitura de arquivo grande |
| Pre-agent-switch | Handoff artifact (~379 tok) via `agent-handoff.md` |

60%: acima disso perde coerência sobre instruções iniciais ("context amnesia").

---

## 2. Model Routing (MUST)

**Regra zero:** Execute direto sempre que der. Sub-agente custa ~20K mínimo.

**Opus 4.7:** Effort default `xhigh`. `thinking_budget` fixo NÃO suportado — adaptive.

| Task | Modelo | Effort |
|---|---|---|
| Arquitetura cross-system, debug complexo, refactor multi-file | **opus** | `xhigh` |
| Spec Pipeline COMPLEX (score >= 16) | **opus** | `max` |
| Feature do spec, code review, bug fix, testes, stories | **sonnet** | `high` |
| Análise single-file, pergunta factual | **sonnet** | `medium` |
| Lint, rename, YAML, lookup, bulk | **haiku** | `low` |

- Em dúvida: menor tier. Escala se falhar.
- Nunca opus pra task que haiku resolve. Nunca `max` fora de COMPLEX.
- Sub-agente anuncia modelo ao spawnar.

---

## 3. Subagent Threshold (Opus 4.7)

Spawn APENAS se: `>= 8 tool calls` previstos OU fan-out paralelo real. Abaixo → inline.

---

## 4. Anti-Patterns (FORBIDDEN)

| Anti-Pattern | Fix |
|---|---|
| Ler mesmo arquivo 2x | Uma vez, guarda line numbers |
| Re-ler após Edit/Write | Edit confirma sucesso, não releia |
| Persona completo em agent switch | Handoff protocol |
| Grep/Glob sem `head_limit` | Sempre setar |
| Sub-agente pra task <8 tool calls | Inline |
| Sequential reads independentes | Paralelo (uma mensagem, N calls) |
| Cole payload bruto no raciocínio | Extrai só relevante |
| `thinking_budget` fixo em 4.7 | Adaptive — não suportado |
| Preamble ("Claro!", "Vou te ajudar...") | Ação direta |
| Trailing summary ("Em resumo...") | Só próximo passo, 1 linha |
| Narração de plano | Executa em paralelo |
| Restating da pergunta | Responde direto |

---

## 5. Hierarquia de Tool (MANDATORY)

```
Caminho conhecido → Read   (não Bash cat)
Padrão conhecido  → Grep   (não Bash grep)
Lista de arquivos → Glob   (não Bash find)
Edição pontual    → Edit   (não Write)
```

Bash só pra operações que nenhuma tool dedicada cobre. Leitura cirúrgica: `offset`+`limit`.

---

## 6. Response Format

### Comprimento por complexidade

| Task | Máximo |
|---|---|
| Confirmação / Yes-No | 1 linha |
| Pergunta factual | 1-3 linhas |
| Task simples concluída | 5-10 linhas |
| Multi-step | Só o que mudou |
| Análise profunda | Estruturado, sem padding |

### Padrão requerido

```
[ação ou resposta direta]
[detalhe crítico se não-óbvio]
[próximo passo se aplicável, 1 linha]
```

### Formato por situação

| Situação | Use |
|---|---|
| Comparação, métrica | Tabela |
| Sequência de passos | Lista numerada |
| Itens sem ordem | Bullets |
| Código | Code block |
| Narrativa | Parágrafo curto (máx 3 frases) |

Default: tabela ou bullet.

---

## 7. Linguagem

- **Português** pra Caio e Matheus
- Sem jargão ("salvei" não "commitei no HEAD")
- Sem nomes de agentes em conversa (usuário vê "implementei", não "@developer")
- Sem comandos pro usuário rodar — agentes fazem tudo (Safe Collaboration)

**Exceção:** usuário pede explicitamente ("explica em detalhes", "modo educativo"). Mesmo assim, sem preamble nem trailing summary.

---

## 8. Budget de Contexto (200K)

| Alocação | Target | % |
|---|---:|---:|
| System + CLAUDE.md + Rules | ~10K | 5% |
| Agente + tools | ~5K | 3% |
| Working memory | **≤80K** | 40% |
| Histórico | ~58K | 29% |
| Safety buffer (compacta 60%) | ~40K | 20% |

Working memory >80K = sinal pra compactar.

---

## 9. Memory Anti-Patterns

- Não salvar estado efêmero (PR atual, task de hoje)
- Não salvar o que já tá em código/git
- Memory = fatos que surpreenderiam uma sessão futura

---

## Enforcement

NON-NEGOTIABLE. Violação = falha de qualidade (Constitution Art. V).
