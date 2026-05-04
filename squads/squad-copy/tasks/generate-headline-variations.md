---
task: generate-headline-variations
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

# Task: Generate Headline Variations

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** copy brief (Quill)
- **Feeds:** todos os writers

## Objetivo
Gerar 25+ variações de headline usando patterns comprovados, filtrar para top 10, e recomendar top 3 para teste.

## Entrada
- Copy brief com beneficio principal e audiencia
- Market awareness level
- Canal/formato destino

## Passos

### 1. Extrair Core Elements
- **Primary benefit:** O que o leitor GANHA
- **Primary pain:** O que o leitor EVITA
- **Key number:** Dado mais impactante
- **Curiosity angle:** O que e surpreendente/contra-intuitivo
- **News angle:** O que e novo/revelador

### 2. Gerar 25+ Variacoes por Pattern
Usar no minimo 8 patterns diferentes:
- **Benefit-driven:** "How to [achieve benefit]"
- **Curiosity:** "The surprising truth about [topic]"
- **Number:** "[X] ways to [benefit]"
- **Question:** "Are you [making mistake / missing opportunity]?"
- **Negative:** "Stop [bad thing]. Start [good thing]."
- **Testimonial:** "[Result] — how [person] did it"
- **Command:** "[Do this] to [get result]"
- **Comparison:** "[Our way] vs [old way]"
- **Secret/Insider:** "What [experts] don't tell you about [topic]"
- **Urgency:** "Why [topic] can't wait (and what to do now)"

### 3. Filtrar com Headline Scoring Matrix

| Criterio | Peso | Score 1-5 |
|----------|:----:|:---------:|
| Specificity | 25% | |
| Curiosity | 20% | |
| Self-interest | 20% | |
| Emotional charge | 15% | |
| Clarity | 10% | |
| Uniqueness | 10% | |

- Score ponderado: top 10 avançam
- Marcar top 3 para A/B test

### 4. Adaptar por Canal
- **Web:** Max 60-70 caracteres (SEO-friendly)
- **Email subject:** Max 50 caracteres (preview truncation)
- **Social:** Variavel, hook nos primeiros 100 char
- **Google Ads:** 30 char (headline 1-3), 90 char (descriptions)
- **Print:** Mais liberdade de tamanho

### 5. A/B Test Recommendations
- Recomendar 2-3 pairs para teste
- Variar 1 elemento por pair (headline pattern, emocao, especificidade)
- Definir success metric e min sample size
- Documentar hipotese por test

## Saida
- 25+ headline variations
- Top 10 scored
- Top 3 recomendados com justificativa
- A/B test recommendations

## Validacao
- [ ] 25+ variações geradas
- [ ] Min 8 patterns diferentes usados
- [ ] Scoring matrix aplicada
- [ ] Top 3 com justificativa
- [ ] Adaptacoes por canal

---

*Task operada por: headline-specialist (Hook)*
