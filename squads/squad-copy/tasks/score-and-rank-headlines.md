---
task: score-and-rank-headlines
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

# Task: Score and Rank Headlines

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** headline variations geradas
- **Feeds:** writers que usarao o headline

## Objetivo
Aplicar scoring system objetivo para avaliar e ranquear headlines — eliminando subjetividade da selecao.

## Entrada
- Lista de headline variations (15-25+)
- Copy brief com audiencia e objetivo
- Benchmarks de performance (se disponiveis)

## Passos

### 1. Aplicar Headline Scoring Matrix

| Criterio | Peso | 1 (Fraco) | 3 (Bom) | 5 (Excelente) |
|----------|:----:|-----------|---------|---------------|
| Specificity (25%) | 25% | Vago, genérico | Algum detalhe | Numero, nome, resultado concreto |
| Curiosity (20%) | 20% | Previsivel | Interessante | Irresistivel — PRECISO saber mais |
| Self-interest (20%) | 20% | Sobre a marca | Beneficio implicito | Beneficio claro e desejavel |
| Emotional charge (15%) | 15% | Neutro | Alguma emocao | Emocao forte (fear, desire, surprise) |
| Clarity (10%) | 10% | Confuso | Entende com esforço | Claro em 3 segundos |
| Uniqueness (10%) | 10% | Genérico | Diferente | Nunca vi igual |

### 2. Calcular Weighted Score
- Score = (Specificity × 0.25) + (Curiosity × 0.20) + (Self-interest × 0.20) + (Emotional × 0.15) + (Clarity × 0.10) + (Uniqueness × 0.10)
- Max score: 5.0
- Threshold para aprovacao: >= 3.5

### 3. Gut Check (Complementary)
Alem do score quantitativo:
- **Read aloud:** Soa natural em voz alta?
- **Scroll test:** Pararia de scrollar para ler?
- **Share test:** Compartilharia com alguem?
- **"So what?" test:** Pessoa media se importaria?
- **Brand fit:** Soa como a marca?

### 4. Rank e Recomendar
- Ordenar por weighted score (descendente)
- Top 3 com nota de justificativa
- Identificar: melhor para A/B test (variacao maxima entre top 3)
- Flag: headlines que são bons mas off-brand

## Saida
- Ranking completo com scores
- Top 3 recomendados
- Justificativa por headline
- A/B test pairing recommendation

## Validacao
- [ ] Scoring matrix aplicada a todos os headlines
- [ ] Weighted score calculado
- [ ] Top 3 com score >= 3.5
- [ ] Gut check complementar realizado
- [ ] A/B test pairing definido

---

*Task operada por: headline-specialist (Hook)*
