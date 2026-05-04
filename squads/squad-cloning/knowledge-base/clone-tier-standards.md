# Clone Tier Standards — Padroes de Qualidade por Tier

> Define os minimos obrigatorios para cada tier de clone cognitivo.
> Um clone que nao atinge os minimos do seu tier NAO e publicado.

---

## Tier 1 — KB Clone (minimo para ser util)

| Criterio | Minimo obrigatorio |
|----------|-------------------|
| Palavras processadas | 5K |
| Mental models identificados | 5 |
| Heurísticas extraidas | 8 |
| Workflows documentados | 3 |
| Content patterns | 5 |
| KBs gerados | 3 |
| Fontes consultadas | 3+ |
| Confidence score | ≥60% |

**Output:** Apenas KBs (knowledge-base/*.md). Sem agente, sem tasks.
**Sessoes:** 1 sessao de Claude Code (1M contexto).
**Gate:** Se nao atinge esses minimos, NAO gera clone. Documenta como "insuficiente".

---

## Tier 2 — Consultant Clone

| Criterio | Minimo obrigatorio |
|----------|-------------------|
| Palavras processadas | 30K |
| Mental models identificados | 10 |
| Heurísticas extraidas | 15 |
| Workflows documentados | 5 |
| Content patterns | 8 |
| Contradicoes resolvidas | 3+ |
| KBs gerados | 5 |
| Agent.md gerado | Sim |
| Fontes consultadas | 5+ |
| Confidence score | ≥75% |

**Output:** KBs + agent.md (agente consultor). Sem tasks.
**Sessoes:** 1-2 sessoes.
**Gate:** Confidence < 75% = downgrade para Tier 1 (KB-only).

---

## Tier 3 — Full Clone

| Criterio | Minimo obrigatorio |
|----------|-------------------|
| Palavras processadas | 80K |
| Mental models identificados | 15 |
| Heurísticas extraidas | 25 |
| Workflows documentados | 8 |
| Content patterns | 12 |
| Decision rules | 10 |
| Contradicoes resolvidas | 5+ |
| Vocabulario/tom extraido | Sim |
| Meta-patterns identificados | 5 |
| KBs gerados | 8 |
| Tasks gerados | 6 |
| Agent.md completo | Sim |
| Fontes consultadas | 8+ |
| Confidence score | ≥85% |

**Output:** Squad completa (agent + KBs + tasks + workflows + squad.yaml).
**Sessoes:** 2-3 sessoes.
**Gate:** Confidence < 85% = downgrade para Tier 2.

---

## Upgrade Path

| De | Para | Requisitos |
|----|------|-----------|
| Insuficiente | Tier 1 | Encontrar mais fontes (min +3K palavras) |
| Tier 1 | Tier 2 | +25K palavras, confidence ≥75%, resolver contradicoes |
| Tier 2 | Tier 3 | +50K palavras, confidence ≥85%, vocabulario extraido, meta-patterns |

Upgrades sao incrementais — nao precisa re-extrair tudo, apenas complementar.

---

## Confidence Score — Calculo

```
Confidence = (direct × 1.0 + inferred × 0.7 + hypothesis × 0.3) / total × 100
```

| Score | Significado | Tier elegivel |
|-------|------------|--------------|
| ≥85% | Alta confianca | Tier 3 |
| 75-84% | Boa confianca | Tier 2 |
| 60-74% | Confianca moderada | Tier 1 only |
| <60% | Insuficiente | NAO gerar clone |

---

## Quality Gates (Bloqueantes)

1. **Honestidade:** NUNCA inventar o que nao foi extraido
2. **Tags:** TODA extracao deve ter [DIRETO], [INFERIDO] ou [HIPOTESE]
3. **Minimos:** Se nao atinge minimos do tier, downgrade ou abort
4. **Contradicoes:** Devem ser documentadas (resolvidas ou nao)
5. **SQUAD-CREATION-STANDARDS:** Agent.md deve seguir formato obrigatorio
