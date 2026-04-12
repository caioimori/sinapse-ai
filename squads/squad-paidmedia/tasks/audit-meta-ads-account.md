---
task: audit-meta-ads-account
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: account_id
    tipo: string
    origem: "usuario"
    obrigatorio: true
  - campo: account_data
    tipo: data
    origem: "Meta Ads Manager"
    obrigatorio: true

Saida:
  - campo: audit_report
    tipo: document
    destino: "Apex"

Checklist:
  - "[ ] Estrutura de conta avaliada"
  - "[ ] Pixel/CAPI health verificado"
  - "[ ] Audience architecture revisada"
  - "[ ] Creative performance analisada"
  - "[ ] Budget efficiency calculada"
  - "[ ] Recomendacoes priorizadas"
---

# Task: Audit Meta Ads Account

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Auditoria completa de conta Meta Ads cobrindo estrutura, tracking, audiences, criativos e performance para identificar oportunidades de otimizacao e problemas.

## Inputs
- Account ID e acesso ao Meta Ads Manager
- Performance data dos ultimos 90 dias
- Objetivos atuais (CPA target, ROAS target)
- Budget mensal atual

## Steps

1. **Audit de Estrutura de Conta**
   - Numero de campanhas ativas (ideal: 3-5 por objetivo)
   - CBO vs ABO usage (CBO preferred para consolidacao)
   - Naming conventions consistency
   - Campaign objectives alignment com business goals
   - Ad set count por campanha (alerta se >10)
   - Score: Consolidada (A), Razoavel (B), Fragmentada (C), Critica (D)

2. **Audit de Pixel & CAPI**
   - Pixel status: ativo, events firing corretamente
   - CAPI status: implementado, event match quality (target >6.0)
   - Event deduplication: configurado corretamente
   - Conversion events: standard events vs custom events
   - Attribution settings: 7d click / 1d view vs alternativas
   - Score: Excelente (>8 EMQ), Bom (6-8), Precisa Atencao (<6), Critico (sem CAPI)

3. **Audit de Audience Architecture**
   - Audience tiers: Cold / Warm / Hot identificados
   - Budget split por tier (ideal: 60-70% Cold / 20-30% Warm / 10-15% Hot)
   - Audience overlap between ad sets (Facebook Audience Overlap tool)
   - Exclusions configuradas (hot exclui warm, warm exclui cold)
   - Lookalike quality: seed size, source quality, percentage
   - Custom audience freshness (>90 dias = stale)

4. **Audit de Creative Performance**
   - Creative count: ativos vs total (ideal: 3-6 ativos por ad set)
   - Creative age: % com >30 dias (fatigue risk)
   - Creative diversity: formatos (image, video, carousel, collection)
   - Top performers: CTR, CVR, ROAS dos top 20%
   - Bottom performers: ads com spend >$50 e zero conversoes
   - Frequency analysis: avg frequency por ad (alerta se >3)

5. **Audit de Budget Efficiency**
   - CPA por tier (Cold vs Warm vs Hot)
   - CPA marginal por campanha (identificar diminishing returns)
   - ROAS por campanha
   - Spend distribution: % por campanha (alerta se 1 campanha >60%)
   - Learning phase analysis: ads stuck in learning?

6. **Gerar score card e recomendacoes**
   - Score por area (A-D)
   - Overall account health score (1-100)
   - Top 10 recomendacoes priorizadas por impacto
   - Quick wins (implementar em <1 hora)
   - Strategic changes (implementar em 1-4 semanas)

## Output
Audit report com score card, findings detalhados e recomendacoes priorizadas.

## Quality Gates
- [ ] Todas as 5 areas auditadas
- [ ] Score card com notas por area
- [ ] Recomendacoes priorizadas por impacto
- [ ] Quick wins identificados separadamente
- [ ] Dados dos ultimos 90 dias analisados

## Quando Usar
- Nova conta para onboarding
- Auditoria trimestral rotineira
- Queda significativa de performance
- Antes de scaling de budget
