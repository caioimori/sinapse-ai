---
task: optimize-signup-flow
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Optimize Signup Flow

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Otimizar signup flow para minimizar friccao e maximizar completion rate.

## Steps

1. **Audit do signup flow atual**
   - Numero de steps
   - Campos por step
   - Metodos de signup disponiveis (email, Google, Apple, SSO)
   - Password requirements
   - Email verification: pre ou pos-acesso?

2. **Aplicar Minimal Viable Signup**
   - Baseline minimo: nome + email + password (3 campos)
   - Cada campo adicional: justificar com valor de negocio
   - Social login: reduz friccao em ~20-30%
   - Single Sign-On: ideal para B2B

3. **Comparar metodos de signup**
   | Metodo | Friccao | Dados capturados | Recomendacao |
   |--------|---------|-----------------|--------------|
   | Email + password | Media | Nome, email | Default |
   | Google OAuth | Baixa | Nome, email, foto | Oferecer |
   | Apple Sign-In | Baixa | Email (pode ser relay) | Oferecer em iOS |
   | Phone/SMS | Media-alta | Phone number | Para mobile-first |
   | Magic link | Baixa | Email | Para login sem password |

4. **Otimizar password UX**
   - Requirements claros e visiveis ANTES de digitar
   - Strength meter visual
   - Show/hide password toggle
   - Nao exigir especiais se nao necessario (reduz friction)

5. **Otimizar email verification timing**
   - Pre-access: mais seguro, mais friccao (~15% drop-off)
   - Post-access: menos friccao, risco de emails falsos
   - Recomendacao: post-access com restricao de features ate verificar

6. **Definir progressive profiling post-signup**
   - Quais dados pedir no onboarding (nao no signup)
   - Quais dados inferir de comportamento
   - Quais dados pedir via in-app prompts posteriores

## Output
Signup flow optimization plan com recomendacoes e mockup sugerido.

## Quality Gates
- [ ] Flow auditado com numero de steps e campos
- [ ] Minimal Viable Signup aplicado
- [ ] Progressive profiling planejado
- [ ] Social login considerado

## Quando Usar
- Quando signup completion rate esta baixo
- Setup de produto novo
- Antes de scaling de trafego pago
