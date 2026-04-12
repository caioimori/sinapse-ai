---
task: design-headline-ab-tests
responsavel: "@headline-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Design Headline A/B Tests

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** headlines scored e rankados
- **Feeds:** growth-analytics, conversion-writer (Spark)

## Objetivo
Desenhar testes A/B de headlines com rigor estatistico — definindo hipotese, variantes, metricas e sample size para cada teste.

## Entrada
- Top headlines rankados
- Canal do teste (email, ad, LP, social)
- Volume de trafego/audiencia disponivel

## Passos

### 1. Definir Hipotese
- **Formato:** "Acreditamos que [variante A] tera [X]% mais [metrica] que [variante B] porque [razao]"
- A hipotese deve ser FALSIFICAVEL
- 1 variavel por teste (isolar o que muda)
- Exemplos de variaveis: emocao vs logica, pergunta vs afirmacao, curto vs longo

### 2. Selecionar Variantes
- **Variante A (Control):** Headline atual ou top 1 do ranking
- **Variante B (Challenger):** Headline com 1 elemento diferente
- **O que muda:** Apenas 1 fator (pattern, emocao, especificidade, CTA)
- **O que nao muda:** Todo o resto (body, design, audiencia, timing)

### 3. Definir Metricas

| Canal | Metrica Primaria | Metrica Secundaria |
|-------|:----------------:|:------------------:|
| Email | Open rate | Click rate |
| Ad | CTR | Conversion rate |
| Landing page | Bounce rate | Conversion rate |
| Social | Engagement rate | Click-through |
| Blog | Time on page | Scroll depth |

### 4. Calcular Sample Size
- **Confidence level:** 95% (padrao)
- **Statistical power:** 80% (padrao)
- **Minimum detectable effect:** 10-20% (depends on baseline)
- **Calculadora:** Use statistical significance calculator
- **Duracao minima:** Tempo para atingir sample size (nunca parar antes)

### 5. Documentar e Analisar
- Setup: variantes, metricas, sample, duracao
- Resultados: winner, lift%, p-value, confidence
- Learnings: O que aprendemos sobre esta audiencia?
- Next test: Baseado nos learnings, que testar agora?

## Cross-Squad Handoff
```yaml
handoffs:
  - to: growth-analytics
    delivers: A/B test designs e resultados
    format: test documentation com learnings
```

## Saida
- Hipotese documentada
- Variantes definidas (1 variavel)
- Metricas e sample size calculados
- Template de analise de resultados

## Validacao
- [ ] Hipotese falsificavel definida
- [ ] 1 variavel por teste (isolada)
- [ ] Sample size calculado
- [ ] Metricas primaria e secundaria definidas
- [ ] Template de documentacao preenchido

---

*Task operada por: headline-specialist (Hook)*
