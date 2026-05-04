---
task: optimize-vendor-costs
responsavel: "@budget-controller"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: vendor_list
    tipo: array
    origem: "financeiro, contratos"
    obrigatorio: true

Saida:
  - campo: vendor_optimization_plan
    tipo: document
    destino: "finance-orqx, operacoes"

Checklist:
  - "[ ] Listar todos os vendors com custo"
  - "[ ] Classificar na matriz impacto × custo"
  - "[ ] Identificar redundancias"
  - "[ ] Definir acoes de otimizacao"
  - "[ ] Projetar economia"
---

# Task: Optimize Vendor Costs

## Metadata
- **Agent:** budget-controller (Vault)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Otimizar custos de vendors e ferramentas usando a Vendor Cost Optimization Matrix.

## Steps

1. **Inventariar vendors:**
   ```
   | Vendor | Categoria | Custo/mes | Contrato | Usuarios | Custo/usuario |
   ```
2. **Classificar na matriz:**
   - Q1 (Alto impacto, Baixo custo): MANTER
   - Q2 (Alto impacto, Alto custo): NEGOCIAR
   - Q3 (Baixo impacto, Baixo custo): REVISAR
   - Q4 (Baixo impacto, Alto custo): ELIMINAR
3. **Identificar redundancias** (2+ tools que fazem a mesma coisa)
4. **Acoes por quadrante:**
   - MANTER: renovar com lock-in e desconto
   - NEGOCIAR: RFP competitivo, annual vs monthly, enterprise discount
   - REVISAR: avaliar free tier, consolidar com outro
   - ELIMINAR: cancelar, migrar funcionalidade
5. **Calcular economia projetada**

## Output
- Inventario de vendors com classificacao
- Acoes de otimizacao priorizadas
- Economia projetada (mensal e anual)
- Timeline de implementacao

## Quality Gates
- [ ] Todos os vendors com custo mapeado
- [ ] Classificacao na matriz justificada
- [ ] Economia projetada conservadora

## Quando Usar
- Review anual de custos
- Budget apertado que precisa de cortes
- Onboarding de nova ferramenta (avaliar overlap)
