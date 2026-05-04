---
task: analyze-reviews-strategy
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze Reviews Strategy

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Analisar estrategia de reviews e reputacao para otimizar social proof e local ranking.

## Steps

1. **Metricas de reviews** - Rating medio, volume total, reviews recentes (30d). Distribuicao por estrelas (1-5)
2. **Sentimento analysis** - Temas positivos mais frequentes. Temas negativos mais frequentes. Sentiment score
3. **Response analysis** - % respondido. Tempo medio de resposta. Qualidade das respostas
4. **Benchmarking** - Rating vs concorrentes locais. Volume vs concorrentes. Response rate vs benchmark (80%+)
5. **Recomendacoes** - Melhorar response time/quality. Solicitar reviews de clientes satisfeitos. Enderecar temas negativos recorrentes

## Output
Reviews analysis com metricas, sentimento, benchmark e recomendacoes.

## Quality Gates
- [ ] Sentimento categorizado
- [ ] Benchmark com concorrentes
- [ ] Recomendacoes acionaveis

## Quando Usar
- Auditoria de reputacao
- Quando rating cai
- Setup de estrategia de reviews
