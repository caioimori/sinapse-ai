---
task: optimize-onboarding-activation
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Optimize Onboarding Activation

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Otimizar onboarding para maximizar ativacao pos-signup usando Activation Framework.

## Steps

1. **Definir activation event**
   - Qual acao indica que usuario "pegou valor"?
   - SaaS: completou primeiro workflow, importou dados, convidou team
   - Ecommerce: primeira compra, adicionou ao carrinho
   - Marketplace: primeiro listing ou primeiro contato

2. **Mapear funil signup → activation**
   - Signup → Email verification → First login → Onboarding steps → Activation
   - Medir conversion rate entre cada etapa
   - Identificar biggest drop-off

3. **Selecionar modelo de onboarding**
   - **PLG (Product-Led):** self-serve, checklist in-app, tooltips, empty states informativos
   - **Hybrid:** self-serve + email sequence + in-app messages
   - **High-Touch:** self-serve + CSM call + personalized setup

4. **Otimizar time-to-value**
   - Tempo medio entre signup e activation event
   - Target: reduzir em 50%
   - Eliminar steps desnecessarios entre signup e primeiro valor
   - "Wow moment" o mais rapido possivel

5. **Configurar nurture sequence**
   - Email 1 (D0): Welcome + quick-start guide
   - Email 2 (D1): First value action CTA
   - Email 3 (D3): Social proof + feature highlight
   - Email 4 (D7): Checklist reminder (se nao ativou)
   - Email 5 (D14): Re-engagement (se inativo)

6. **Medir e iterar**
   - Activation rate por cohort
   - Time-to-activation por cohort
   - Drop-off por step do onboarding
   - A/B test de onboarding flows

## Output
Onboarding optimization plan com modelo, funil, nurture sequence e metricas.

## Quality Gates
- [ ] Activation event definido claramente
- [ ] Funil mapeado com conversion rates
- [ ] Modelo de onboarding selecionado
- [ ] Nurture sequence planejada
- [ ] Time-to-value baseline e target definidos

## Quando Usar
- Activation rate abaixo de 30%
- Apos aumento de volume de signups (paid scaling)
- Setup de onboarding para produto novo
