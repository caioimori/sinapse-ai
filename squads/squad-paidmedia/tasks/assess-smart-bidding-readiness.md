---
task: assess-smart-bidding-readiness
responsavel: "@google-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: account_data
    tipo: data
    origem: "Google Ads"
    obrigatorio: true

Saida:
  - campo: readiness_assessment
    tipo: document
    destino: "Query + Apex"
---

# Task: Assess Smart Bidding Readiness

## Metadata
- **Agent:** google-ads-specialist (Query)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Avaliar se a conta Google Ads tem requisitos atendidos para migrar para Smart Bidding com sucesso.

## Steps

1. **Verificar volume de conversoes**
   - Minimo recomendado: 30 conversoes nos ultimos 30 dias por campanha
   - Ideal: 50+ conversoes nos ultimos 30 dias por campanha
   - Se insuficiente: considerar micro-conversoes como proxy temporario

2. **Verificar conversion tracking**
   - Conversion actions configuradas corretamente
   - Conversion values atribuidos (se usando tROAS)
   - Attribution model: data-driven preferido
   - Enhanced conversions habilitado
   - Sem discrepancia significativa Google Ads vs GA4

3. **Verificar historico de dados**
   - Minimo 2 semanas de dados com conversoes consistentes
   - Ideal: 30 dias de dados estaveis
   - Sem mudancas significativas recentes (budget, targeting, LP)

4. **Selecionar estrategia adequada**
   | Cenario | Estrategia Recomendada |
   |---------|----------------------|
   | Objetivo: maximizar conversoes, sem CPA target | Maximize Conversions |
   | Objetivo: controlar CPA | Target CPA |
   | Objetivo: maximizar valor, sem ROAS target | Maximize Conversion Value |
   | Objetivo: controlar ROAS | Target ROAS |
   | Pouco historico (<30 conv/30d) | Maximize Clicks → migrate later |

5. **Planejar migracao**
   - Fase 1: habilitar Smart Bidding com target conservador (+20% do CPA atual)
   - Fase 2: learning phase (2-3 semanas, nao mexer)
   - Fase 3: ajustar targets gradualmente (max 10-15% por semana)
   - Monitorar: nao comparar performance da 1a semana (learning)

## Output
Assessment com readiness score, estrategia recomendada e plano de migracao.

## Quality Gates
- [ ] Volume de conversoes verificado por campanha
- [ ] Conversion tracking validado
- [ ] Estrategia selecionada com justificativa
- [ ] Plano de migracao com learning phase respeitada

## Quando Usar
- Conta ainda em manual bidding
- Apos atingir volume de conversoes suficiente
- Quando CPA manual esta instavel
