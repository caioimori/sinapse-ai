# Insight Crystallization Engine

## Principio Central
**Dado sem interpretacao e ruido. Interpretacao sem acao e academia. Acao sem dado e aposta.**

Todo insight cristalizado DEVE ter 3 componentes. Sem os 3, nao e insight — e dado bruto.

## Os 3 Componentes

### FINDING (O Que Descobrimos)
- Observacao factual, baseada em dados
- Livre de interpretacao ou opiniao
- Verificavel e referenciavel
- **Formato:** "Descobrimos que [observacao] baseado em [fonte/dado]"
- **Exemplo:** "65% dos usuarios abandonam o checkout na etapa de pagamento (fonte: analytics Q4 2025)"

### IMPLICATION (E Dai?)
- O que este finding SIGNIFICA para o negocio
- Conexao entre dado e impacto
- Pode ser positiva (oportunidade) ou negativa (ameaca)
- **Formato:** "Isso significa que [impacto] porque [logica]"
- **Exemplo:** "Isso significa que perdemos ~$2.3M/ano em revenue potencial porque o flow de pagamento cria friccao"

### RECOMMENDATION (O Que Fazer)
- Acao especifica e executavel
- Com owner sugerido
- Com timeline realista
- **Formato:** "[Owner] deve [acao] ate [quando] para [resultado esperado]"
- **Exemplo:** "Product team deve redesenhar checkout flow ate Q2 2026 para reduzir abandono em 30%"

## Insight Quality Scoring

| Dimensao | 1 (Fraco) | 3 (Adequado) | 5 (Excelente) |
|----------|-----------|--------------|---------------|
| **Finding** | Vago, sem dado | Dado presente, fonte citada | Dado preciso, multiplas fontes |
| **Implication** | Generica | Conectada ao negocio | Quantificada com impacto |
| **Recommendation** | Vaga ("melhorar X") | Especifica com owner | SMART com metricas |
| **Confidence** | Sem indicacao | Nivel declarado | Justificativa detalhada |
| **Novelty** | Obvio/sabido | Confirma suspeita | Contra-intuitivo/novo |

**Score total: soma das 5 dimensoes (5-25)**
- 20-25: Insight de alto valor — priorizar acao
- 15-19: Insight solido — incluir no report
- 10-14: Insight adequado — incluir como suporte
- <10: Nao e insight — reclassificar como dado bruto

## Anti-Patterns

| Anti-Pattern | Exemplo | Problema |
|-------------|---------|----------|
| Dado sem "so what" | "O mercado cresce 15% ao ano" | Falta IMPLICATION e RECOMMENDATION |
| Opiniao sem dado | "Acreditamos que devemos pivotar" | Falta FINDING com evidencia |
| Recomendacao sem evidencia | "Devemos investir em AI" | Falta FINDING que justifique |
| Vago demais | "O mercado esta mudando" | Nenhum componente e preciso |
| Conclusao precipitada | "Um dado → devemos mudar tudo" | Falta triangulacao |

## Confidence Levels

| Level | Descricao | Quando Usar |
|:-----:|-----------|-------------|
| HIGH (>80%) | 3+ fontes Tier 1-2, dados <6 meses, triangulacao completa | Apostar neste insight |
| MEDIUM (50-80%) | 2+ fontes Tier 2-3, dados <12 meses, parcialmente triangulado | Considerar, monitorar |
| LOW (<50%) | Fontes limitadas/Tier 4-5, dados >12 meses, hipotese | Investigar mais antes de agir |

## Template de Insight Cristalizado

```
## Insight: [Titulo descritivo]

**FINDING:** [Observacao factual com dado e fonte]
**IMPLICATION:** [Significado para o negocio com impacto quantificado]
**RECOMMENDATION:** [Acao com owner, timeline, metrica de sucesso]

**Confidence:** HIGH/MEDIUM/LOW — [justificativa]
**Quality Score:** X/25
**Sources:** [Lista de fontes com tier]
```

---

*Knowledge base da squad-research*
