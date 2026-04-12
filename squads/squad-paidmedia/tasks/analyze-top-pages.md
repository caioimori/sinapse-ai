---
task: analyze-top-pages
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze Top Pages Performance

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Analisar top pages por trafego, conversao e engajamento para otimizar investimento.

## Steps

1. **Rankear paginas por trafego** - Top 20 por sessions (GA4)
2. **Rankear por conversao** - Top 20 por conversion rate
3. **Identificar mismatches** - Alto trafego + baixa conversao: CRO opportunity. Baixo trafego + alta conversao: amplificar com paid
4. **Analisar engagement** - Bounce rate, engagement time, scroll depth por pagina
5. **Recomendacoes** - Paginas para amplificar, otimizar ou descontinuar

## Output
Top pages analysis com ranking, mismatches e recomendacoes.

## Quality Gates
- [ ] Ranking por trafego E conversao
- [ ] Mismatches identificados
- [ ] Recomendacoes acionaveis

## Quando Usar
- Report mensal
- Planejamento de landing pages para campanhas
