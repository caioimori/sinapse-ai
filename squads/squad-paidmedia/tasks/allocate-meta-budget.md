---
task: allocate-meta-budget
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: meta_budget
    tipo: number
    origem: "Apex"
    obrigatorio: true
  - campo: performance_data
    tipo: data
    origem: "Meta Ads Manager"
    obrigatorio: true

Saida:
  - campo: budget_allocation
    tipo: document
    destino: "Signal (implementacao)"
---

# Task: Allocate Meta Budget

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Alocar budget Meta Ads por tier e campanha com base em analise de CPA marginal e performance por segmento.

## Inputs
- Budget total Meta Ads (mensal e diario)
- Performance data por campanha/ad set (ultimos 30 dias)
- CPA/ROAS targets

## Steps

1. **Calcular CPA marginal por campanha**
   - Exportar dados de spend e conversoes por dia por campanha
   - Calcular CPA rolling average de 7 dias
   - Identificar ponto de saturacao (CPA marginal >1.3x average)

2. **Classificar campanhas por eficiencia**
   - Tier S: CPA marginal <80% do target (investir mais)
   - Tier A: CPA marginal 80-100% do target (manter)
   - Tier B: CPA marginal 100-130% do target (otimizar)
   - Tier C: CPA marginal >130% do target (reduzir ou pausar)

3. **Alocar budget por tier de audience**
   - Cold: 60-70% (aquisicao de novos usuarios)
   - Warm: 20-30% (nurturing de engajados)
   - Hot: 10-15% (conversao de high-intent)
   - Ajustar com base em dados reais: se Hot tem CPA 50% menor, pode ir ate 20%

4. **Definir budget diario por campanha**
   - Minimum: 5x CPA target por ad set por dia (para sair de learning phase)
   - Optimal: 10x CPA target por ad set por dia
   - Maximum: ponto antes de saturacao marginal
   - CBO: setar budget no nivel de campanha, deixar Meta otimizar entre ad sets

5. **Configurar regras de otimizacao**
   - Se CPA >1.5x target por 3 dias consecutivos → reduzir budget 20%
   - Se CPA <0.7x target por 3 dias → aumentar budget 15% (max +20%/dia)
   - Se ad set em learning limited por >7 dias → consolidar ou aumentar budget

## Output
Tabela de alocacao por campanha com budget diario, tier e regras de ajuste.

## Quality Gates
- [ ] CPA marginal calculado com dados de 30+ dias
- [ ] Budget por ad set >= 5x CPA target
- [ ] Regras de ajuste automatico definidas
- [ ] Ponto de saturacao identificado

## Quando Usar
- Planejamento mensal de budget Meta
- Rebalanceamento apos mudanca de budget
- Apos auditoria de conta
