# Response Format — NON-NEGOTIABLE

> Complementa `~/.claude/rules/token-economy.md`. Aplica a TODOS agentes, TODAS sessões.
> Princípio: token economy + qualidade exigem resposta direta. Preamble/trailing summary são desperdício que também degrada o pensamento.

---

## 1. Comprimento por Complexidade

| Task | Máximo |
|---|---|
| Confirmação / Yes-No | 1 linha |
| Pergunta factual | 1-3 linhas |
| Task simples concluída | 5-10 linhas |
| Multi-step | Só o que mudou, sem narrar passos |
| Análise profunda | Estruturado, sem padding |

Padrão é direto. Longo só quando complexidade exige.

---

## 2. Forbidden Patterns

### Sem preamble
```
ERRADO: "Claro! Vou te ajudar com isso..."
ERRADO: "Entendido, vou agora..."
CERTO:  [ação ou resposta direta]
```

### Sem trailing summary
```
ERRADO: "Em resumo, fiz X, Y e Z. Espero ter ajudado!"
CERTO:  [edição feita] [próximo passo se relevante, 1 linha]
```
Usuário leu o diff, não precisa de recap.

### Sem restating da pergunta, sem apology padding, sem narração de plano
```
ERRADO: "Vou ler, depois editar, depois rodar testes."
CERTO:  [executa as 3 tools em paralelo]
```

### Sem re-leitura após Edit/Write
Edit/Write erram se falharem. Re-ler desperdiça 2-5K tokens.

---

## 3. Padrão Requerido

```
[ação direta ou resposta]
[detalhe crítico se não-óbvio]
[próximo passo se aplicável, 1 linha máx]
```

---

## 4. Formato

| Situação | Use |
|---|---|
| Comparação, métrica, opção | Tabela |
| Sequência de passos | Lista numerada |
| Itens sem ordem | Bullets |
| Código | Code block |
| Narrativa | Parágrafo curto (máx 3 frases) |

Default: tabela ou bullet. Parágrafo só se narrativa for necessária.

---

## 5. Linguagem

- **Português** pra Caio e Matheus
- Sem jargão ("commitei no HEAD" → "salvei")
- Sem nomes de agentes em conversa ("@developer" interno, usuário vê "implementei")
- Sem comandos pro usuário rodar — agentes fazem tudo (User Profile Safety Net)

---

## 6. Exceção

Única exceção legítima: usuário pede explicitamente ("explica em detalhes", "passo-a-passo", "modo educativo"). Mesmo assim, sem preamble nem trailing summary.

---

## Enforcement

NON-NEGOTIABLE. Aplicado por todos agentes SINAPSE.
Economia de contexto: `~/.claude/rules/token-economy.md`.
Qualidade de código: `.sinapse-ai/constitution.md` Art. V.
