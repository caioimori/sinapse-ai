---
task: build-audience-architecture
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_context
    tipo: document
    origem: "usuario"
    obrigatorio: true
  - campo: pixel_data
    tipo: data
    origem: "Meta Pixel/CAPI"
    obrigatorio: false

Saida:
  - campo: audience_architecture
    tipo: document
    destino: "Signal (implementacao)"

Checklist:
  - "[ ] Three-tier architecture definida (Cold/Warm/Hot)"
  - "[ ] Exclusions mapeadas"
  - "[ ] Budget split por tier"
  - "[ ] Lookalike strategy definida"
---

# Task: Build Audience Architecture

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Desenhar arquitetura completa de audiences em tres tiers (Cold/Warm/Hot) com exclusions, budget allocation e lookalike strategy.

## Inputs
- Descricao do negocio, ICP e buyer personas
- Dados de pixel/CAPI (se disponiveis)
- Customer lists (se disponiveis)
- Budget mensal

## Steps

1. **Definir Hot Audiences (10-15% budget)**
   - Website visitors que iniciaram checkout (7d, 14d, 30d)
   - Add to cart sem purchase (7d, 14d)
   - Customer list (purchasers ultimos 180d)
   - Engaged with ads (video viewers 75%+, form openers)
   - Page visitors de pricing/produto (7d, 14d)

2. **Definir Warm Audiences (20-30% budget)**
   - Website visitors all pages (30d, 60d, 90d)
   - Instagram/Facebook engagers (30d, 90d, 180d)
   - Video viewers (25%+, 50%+) ultimos 90d
   - Page followers/likers
   - Lead form openers sem submit

3. **Definir Cold Audiences (60-70% budget)**
   - Broad targeting (sem interests — confiar no algoritmo)
   - Lookalike 1% de purchasers (melhor seed)
   - Lookalike 1% de leads qualificados
   - Lookalike 1-3% de website visitors
   - Interest-based targeting (se necessario, agrupar 3-5 interests)
   - Advantage+ Audience (expandido)

4. **Configurar exclusions**
   - Hot exclui: purchasers recentes (se objetivo e new customers)
   - Warm exclui: hot audiences (evitar canibalismo)
   - Cold exclui: warm + hot audiences
   - Global: excluir employees, existing customers (se aplicavel)

5. **Definir lookalike strategy**
   - Seed priority: Purchasers > Leads > Visitors > Engagers
   - Percentage: 1% (qualidade) → 1-3% (escala) → 3-5% (volume)
   - Seed minimum: 1000 records (ideal >5000)
   - Refresh frequency: mensal para seeds dinamicos

6. **Documentar naming conventions**
   - Formato: `[Tier]_[Type]_[Window]_[Date]`
   - Exemplo: `HOT_WV-ATC_14d_2026Q1`
   - Padronizar para toda a conta

## Output
Documento de audience architecture com tiers, audiences, exclusions, budget split e naming conventions.

## Quality Gates
- [ ] Tres tiers definidos com audiences especificas
- [ ] Exclusions cruzadas configuradas
- [ ] Budget allocation por tier justificada
- [ ] Lookalike seeds priorizados por qualidade
- [ ] Naming convention documentada

## Quando Usar
- Setup de conta nova
- Reestruturacao de audiences existentes
- Antes de scaling significativo
