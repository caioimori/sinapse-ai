---
task: create-proposal-pricing
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: proposal_brief
    tipo: object
    origem: "squad-commercial, usuario"
    obrigatorio: true

Saida:
  - campo: proposal_pricing
    tipo: document
    destino: "squad-commercial"

Checklist:
  - "[ ] Estimar escopo em horas/esforco"
  - "[ ] Calcular custo do projeto"
  - "[ ] Aplicar value-based ou cost-plus"
  - "[ ] Montar opcoes (tiers se aplicavel)"
  - "[ ] Validar margem"
---

# Task: Create Proposal Pricing

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Criar pricing para proposta comercial especifica, com opcoes e fundamentacao.

## Steps

1. **Estimar esforco:**
   - Horas por role
   - Ferramentas e infra diretas
   - Margem de contingencia (10-20%)
2. **Calcular custo:**
   ```
   Custo = Σ(horas_role × custo_hora_loaded) + diretos + contingencia
   ```
3. **Definir preco:**
   - Se value-based possivel: usar design-value-based-pricing
   - Se cost-plus: Custo × (1 + Margem_target)
4. **Montar opcoes:**
   - Opcao 1 (scope reduzido): menor investimento
   - Opcao 2 (scope completo): investimento recomendado
   - Opcao 3 (scope premium): maximo valor
5. **Validar:** cada opcao tem margem >= 50% gross

## Output
- Pricing com 2-3 opcoes
- Escopo detalhado de cada opcao
- Margem implicita de cada opcao
- Condicoes de pagamento sugeridas

## Quality Gates
- [ ] Escopo estimado com precisao
- [ ] Margem minima respeitada
- [ ] Opcoes diferenciam valor, nao so preco

## Quando Usar
- Qualquer proposta comercial
- RFP/RFI que precisa de pricing
