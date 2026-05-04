# Extraction Report — {TARGET_NAME}

> **Gerado por:** cognitive-extractor (Cortex)
> **Data:** {DATE}
> **Layer:** {ALL | Layer N}

---

## Resumo

| Metrica | Valor |
|---------|-------|
| Conteudo analisado | {N} palavras |
| Fontes processadas | {N} |
| Total extracoes | {N} |
| [DIRETO] | {N} ({X}%) |
| [INFERIDO] | {N} ({X}%) |
| [HIPOTESE] | {N} ({X}%) |

---

## Layer 1: Mental Models ({N} encontrados)

| # | Model | Descricao | Fontes | Tag |
|---|-------|-----------|--------|-----|
| 1 | {nome} | {descricao} | {fontes} | {[DIRETO]} |

**Min requisito:** {N} (Tier {X}) — **{PASS|FAIL}**

---

## Layer 2: Heuristics ({N} encontradas)

| # | Trigger | Rule | Fontes | Tag |
|---|---------|------|--------|-----|
| 1 | {trigger} | {rule} | {fontes} | {[DIRETO]} |

**Min requisito:** {N} (Tier {X}) — **{PASS|FAIL}**

---

## Layer 3: Workflows ({N} encontrados)

| # | Workflow | Steps | Fontes | Tag |
|---|---------|-------|--------|-----|
| 1 | {nome} | {N steps} | {fontes} | {[INFERIDO]} |

**Min requisito:** {N} (Tier {X}) — **{PASS|FAIL}**

---

## Layer 4: Communication Patterns

- Vocabulario: {N} expressoes identificadas
- Tom: {descricao}
- Catchphrases: {N} encontradas
- Storytelling style: {descricao}

---

## Layer 5: Meta-patterns ({N} encontrados)

| # | Pattern | Layers | Tag |
|---|---------|--------|-----|
| 1 | {descricao} | L{X}, L{Y} | {[INFERIDO]} |

---

## Contradicoes ({N} encontradas)

| # | Fonte A | Fonte B | Contradicao | Hipotese |
|---|---------|---------|------------|---------|

---

## Gaps Identificados

- {O que nao foi encontrado e seria esperado}
- {O que falta para atingir tier superior}

## Recomendacoes

- {Acao sugerida para melhorar qualidade/completude}
