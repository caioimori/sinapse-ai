---
task: design-campaign-structure
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: objective
    tipo: string
    origem: "Apex"
    obrigatorio: true
  - campo: audience_architecture
    tipo: document
    origem: "build-audience-architecture"
    obrigatorio: true

Saida:
  - campo: campaign_structure
    tipo: document
    destino: "Signal (implementacao)"
---

# Task: Design Campaign Structure

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Estruturar campanhas Meta Ads seguindo principios de consolidacao para maximizar dados por ad set e otimizacao algoritmica.

## Inputs
- Objetivo de negocio e campaign objective
- Audience architecture (output de build-audience-architecture)
- Budget alocado para Meta
- Criativos disponiveis ou planejados

## Steps

1. **Definir campaign objectives**
   - Sales/Conversions: para e-commerce ou lead gen com dados de conversao
   - Leads: para lead gen sem dados de valor
   - Traffic: EVITAR exceto para awareness especifico
   - Engagement: EVITAR para performance
   - Mapear objetivo de negocio → campaign objective correto

2. **Estruturar por consolidacao**
   - **Modelo ideal (3-5 campanhas):**
     - Campaign 1: Cold — Prospecting (CBO, broad + LAL)
     - Campaign 2: Warm — Retargeting (CBO, engagers + visitors)
     - Campaign 3: Hot — Conversion (CBO, ATC + checkout initiation)
     - Campaign 4 (opcional): Testing (ABO, novos criativos/audiences)
     - Campaign 5 (opcional): Advantage+ Shopping (full funnel, algoritmico)

3. **Configurar ad sets**
   - Max 3-5 ad sets por campanha CBO (mais = diluicao de dados)
   - Cada ad set com audience distinta e exclusions
   - Budget minimo por ad set: 5x CPA target/dia
   - Placements: Advantage+ Placements (deixar Meta otimizar)
   - Optimization event: o mais proximo da conversao com dados suficientes

4. **Configurar ads**
   - 3-6 ads ativos por ad set (sweet spot)
   - Mix de formatos: image, video, carousel
   - Dynamic Creative (DCT) para testing fase inicial
   - Ads manuais para scaling de winners

5. **Definir naming conventions**
   ```
   Campaign: [Objective]_[Tier]_[Optimization]_[YYYY-MM]
   Ad Set: [Audience-Type]_[Window]_[Targeting-Detail]
   Ad: [Format]_[Hook-Type]_[Version]_[Date]
   ```
   Exemplo: `CONV_Cold_Purchase_2026-03 / LAL1-Purchasers_Broad / VID_Question_v2_0316`

## Output
Documento de campaign structure com campaigns, ad sets, ads, naming e configuracoes.

## Quality Gates
- [ ] Max 5 campanhas por objetivo
- [ ] Max 5 ad sets por campanha CBO
- [ ] 3-6 ads por ad set
- [ ] Naming convention documentada e aplicada
- [ ] Exclusions entre tiers configuradas

## Quando Usar
- Setup de conta nova
- Reestruturacao de conta existente
- Lancamento de novo objetivo de campanha
