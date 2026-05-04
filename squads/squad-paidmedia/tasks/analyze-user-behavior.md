---
task: analyze-user-behavior
responsavel: "@campaign-analyst"
responsavel_type: Agent
atomic_layer: Task
elicit: false
---

# Task: Analyze User Behavior

## Metadata
- **Agent:** campaign-analyst (Pulse)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Analisar comportamento de usuario (paths, engagement, retention) para otimizar experiencia e conversao.

## Steps

1. **Analisar user paths**
   - Top paths que levam a conversao
   - Pages mais visitadas antes da conversao
   - Exit pages (onde usuarios abandonam)
   - Average pages per session por segmento

2. **Analisar engagement**
   - Engagement rate por device e source
   - Avg engagement time por pagina
   - Scroll depth por landing page
   - Eventos de interacao (clicks, video plays, downloads)

3. **Analisar retention (se aplicavel)**
   - Cohort analysis: retorno por semana/mes
   - Frequencia de visita por segmento
   - Novo vs retornante: metricas comparativas

4. **Segmentacao comportamental**
   - Power users: alto engagement, multiplas sessions
   - Bouncers: single page, <10s
   - Window shoppers: varias pages, sem conversao
   - Converters: path otimo ate conversao

5. **Recomendacoes**
   - Para bouncers: melhorar relevancia LP-ad ou page speed
   - Para window shoppers: retargeting + incentivo
   - Para converters: replicar path otimo em outras LPs

## Output
User behavior analysis com paths, engagement patterns e recomendacoes.

## Quality Gates
- [ ] Paths de conversao mapeados
- [ ] Segmentacao comportamental definida
- [ ] Recomendacoes por segmento

## Quando Usar
- Analise mensal de comportamento
- Antes de CRO sprint
- Quando bounce rate alto em LPs pagas
