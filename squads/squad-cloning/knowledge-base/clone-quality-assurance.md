# Clone Quality Assurance — Validacao de Fidelidade Cognitiva

> Metodologia para validar que um clone gerado realmente representa
> o pensamento do original — e nao uma versao genérica embelezada.
> Inclui: fidelity scoring, Turing-like validation, e failure detection.

---

## Por Que QA Especifico Para Clones

QA de software verifica se o codigo faz o que foi especificado.
QA de clone verifica algo mais sutil: se o agente **pensa** como a pessoa original,
nao apenas se ele **soa** como ela.

A diferenca critica:
- **Soa como:** Vocabulario correto, tom correto, frases familiares
- **Pensa como:** Mesmas decisoes, mesmas heuristics, mesmos valores em conflito

Um clone pode ter 100% de score em "soa como" e 40% em "pensa como" —
isso e um clone de superfície, nao um clone cognitivo.

---

## 4 Dimensoes de Fidelidade

| Dimensao | O que avalia | Peso no score geral |
|----------|-------------|-------------------|
| **Cognitiva** | Heuristics e decisoes corretas | 35% |
| **Comunicativa** | Tom, vocabulario, estilo | 25% |
| **Processual** | Workflows e metodologias | 25% |
| **Limitar** | Boundaries e failure modes | 15% |

**Formula:**
```
Fidelity Score = (cognitiva × 0.35) + (comunicativa × 0.25) + (processual × 0.25) + (limitar × 0.15)
```

---

## Validacao Cognitiva — Teste de Decisao

### Protocolo de Decisao Benchmark

1. **Selecionar 5-10 cenarios de decisao** que a pessoa original enfrentou (documentados em fontes)
2. **Registrar a decisao original** (o que a pessoa realmente fez/disse)
3. **Apresentar o cenario ao clone** sem mencionar qual foi a decisao
4. **Comparar resposta do clone** com decisao documentada do original
5. **Calcular alignment rate**

```
Cognitiva Score = (decisoes alinhadas / total de cenarios) × 100
```

### Criterios de Alinhamento

| Alinhamento | Criterio |
|------------|---------|
| **Total** | Clone chega a mesma decisao e usa raciocinio similar | 1.0 |
| **Parcial** | Clone chega a decisao similar mas raciocinio diferente | 0.6 |
| **Superficial** | Mesma conclusao, raciocinio errado | 0.3 |
| **Divergente** | Conclusao diferente da original documentada | 0.0 |

### Exemplos de Cenarios Benchmark

Para um clone de especialista em marketing:
- "Voce tem $50K para lancar um produto. Distribui como?"
- "Um cliente quer pausar os ads por 30 dias. Voce recomenda?"
- "Qual canal priorizaria para lancamento B2B vs B2C?"

Comparar cada resposta com o que o original disse em fontes documentadas.

---

## Validacao Comunicativa — Turing-Like Test

### Protocolo de Blind Comparison

1. Gerar 10 respostas do clone para perguntas abertas no dominio
2. Coletar 10 respostas reais da pessoa (de fontes documentadas, mesmas perguntas aproximadas)
3. Embaralhar as 20 respostas
4. Solicitar a 3 avaliadores que identifiquem quais sao do original vs clone
5. **Taxa de confusao alvo:** >= 40% (avaliadores devem confundir com frequencia)

**Interpretacao:**
- Confusao >= 60%: Clone de alta fidelidade comunicativa
- Confusao 40-59%: Clone aceitavel
- Confusao 20-39%: Clone de superficie — revisar L4
- Confusao < 20%: Clone falhou — reprocessar Layer 4

### Checklist de Validacao de Tom

- [ ] Nivel de formalidade correspondente (1-5)
- [ ] Uso de analogias no mesmo estilo
- [ ] Comprimento medio de resposta similar
- [ ] Vocabulario caracteristico presente (>=70% das palavras-chave)
- [ ] Abertura de resposta no mesmo padrao
- [ ] Fechamento/CTA no mesmo padrao
- [ ] Uso de dados vs historias na proporcao correta

---

## Validacao Processual — Workflow Compliance

### Protocolo de Workflow Trace

Para cada workflow documentado (L3):

1. **Dar uma tarefa** que deveria ativar o workflow
2. **Observar se o clone segue os steps** na ordem correta
3. **Verificar se os outputs intermediarios** correspondem ao documentado
4. **Verificar se o output final** match o esperado

```
Processual Score = (workflows seguidos corretamente / total testados) × 100
```

**Red flag:** Clone pula steps — pode indicar que o workflow foi extraido de forma incompleta
ou que a heuristic de quando usar o workflow nao foi corretamente mapeada.

---

## Validacao de Limites — Boundary Testing

### Protocolo de Limite

1. **Testar pedidos fora do dominio** do original (deve recusar ou redirecionar)
2. **Testar topicos que o original evita** (deve replicar o comportamento de evitar)
3. **Testar areas de incerteza** documentadas (deve admitir, nao inventar)

```
Limitar Score = (respostas dentro de boundaries / total de testes) × 100
```

### Casos de Teste de Boundary

| Cenario | Comportamento Esperado | Pass/Fail |
|---------|----------------------|-----------|
| Pergunta fora do dominio | Redirecionamento ou recusa explicita | |
| Topico controverso que evita | Neutralidade ou "nao e minha area" | |
| Pedido de conselho em area que admitiu ignorancia | Admite limitacao | |
| Pergunta que contradiz valores documentados | Recusa coerente | |

---

## Score de Fidelidade por Tier

| Score | Interpretacao | Acao |
|-------|--------------|------|
| >= 85% | Clone de alta fidelidade | Publicar e deployar |
| 70-84% | Clone aceitavel com gaps | Documentar gaps, publicar com ressalvas |
| 55-69% | Clone de superficie | Revisar extracoes, reprocessar L1 e L2 |
| < 55% | Clone falhou | Voltar ao pipeline, mais fontes necessarias |

### Fidelity Score vs Confidence Score

| Score | O que mede | Quando calcular |
|-------|-----------|----------------|
| **Confidence Score** | Qualidade das fontes usadas na extracao | Durante extracao (pre-geração) |
| **Fidelity Score** | Qualidade do clone gerado | Apos geracao (pos-geração) |

Um clone pode ter confidence score alto (boas fontes) e fidelity score baixo
(ma geracao). Ambos precisam ser verificados.

---

## Deteccao de Falsos Positivos

Problemas comuns que inflariam o score artificialmente:

### Problema 1: Resposta Genérica Passando por Clone
**Sintoma:** Clone responde correto mas resposta seria identica para qualquer especialista da area.
**Detecção:** Testar perguntas onde o original tem opiniao conhecidamente contraria ao mainstream.
**Exemplo:** Se o original defende "nunca use ads no inicio", o clone deve replicar isso, nao a visao mainstream.

### Problema 2: Estilo Mascarando Lacuna Cognitiva
**Sintoma:** Tom/vocabulario perfeito mas decisoes erradas.
**Deteccao:** Focar nos testes de decisao antes dos testes de estilo.
**Indicador:** Dimensao cognitiva < dimensao comunicativa por 20+ pontos.

### Problema 3: Fabricacao Confiante
**Sintoma:** Clone responde com confianca em areas sem fontes documentadas.
**Deteccao:** Testar em areas FORA do corpus de fontes.
**Regra:** Clone deve declinar ou qualificar fortemente em areas nao documentadas.

---

## Checklist Pre-Publicacao

### Gate 1 — Confidence Score
- [ ] Confidence >= 60% (Tier 1), 75% (Tier 2), 85% (Tier 3)
- [ ] L1 e L2 nao estao abaixo de 60% individualmente
- [ ] Proporcao de [DIRETO] adequada por tier

### Gate 2 — Fidelity Score
- [ ] Fidelity >= 70% (minimo aceitavel)
- [ ] Dimensao cognitiva >= 65%
- [ ] Dimensao limitar >= 70%

### Gate 3 — Integridade
- [ ] Failure modes documentados (L6)
- [ ] Nenhum principio ou heuristic marcado como [HIPOTESE] foi promovido a core principle
- [ ] Fonte de cada core principle identificada
- [ ] Gaps documentados explicitamente no agent.md

### Gate 4 — Etica
- [ ] Consent verification (ver `ethical-guidelines.md`)
- [ ] Declaracao de representacao no agent.md
- [ ] Limites de uso documentados

Ver tambem: `clone-tier-standards.md` para os criterios minimos por tier.
Ver tambem: `ethical-guidelines.md` para considerations de consentimento e uso.
