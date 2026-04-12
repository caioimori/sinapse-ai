---
task: optimize-form-conversion
responsavel: "@cro-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Optimize Form Conversion

## Metadata
- **Agent:** cro-specialist (Convert)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Otimizar formulario de conversao para maximizar completion rate usando Field Friction Cost Model.

## Steps

1. **Audit do form atual**
   - Numero de campos
   - Tipos de campos (text, email, phone, select, textarea, checkbox)
   - Required vs optional (marcados claramente?)
   - Layout: single column vs multi-column
   - Mobile rendering (input types, spacing, tap targets)

2. **Aplicar Field Friction Cost Model**
   - Cada campo adicional = ~4-7% drop-off
   - Campos com alta friccao: telefone (~15%), endereco (~12%), empresa (~8%)
   - Campos com baixa friccao: nome (~3%), email (~3%)
   - Calcular: friccao total = soma dos custos de cada campo
   - Comparar com baseline completion rate

3. **Recomendar eliminacao/otimizacao de campos**
   - Remover campos nao essenciais para qualificacao
   - Postergar campos para progressive profiling (pedir depois)
   - Substituir text por select/radio (menos esforco)
   - Adicionar smart defaults e auto-complete
   - Considerar multi-step se >5 campos necessarios

4. **Otimizar UX do form**
   - Inline validation (feedback imediato)
   - Error messages claras e proximas do campo
   - Progress indicator (para multi-step)
   - Mobile: input types corretos (type="email", type="tel")
   - CTA: texto especifico ("Receber Proposta" > "Enviar")

5. **Configurar tracking**
   - Form start event (quando primeiro campo e focado)
   - Field-level tracking (quais campos causam abandono)
   - Form submit event
   - Error tracking (quais erros mais frequentes)

## Output
Plano de otimizacao do form com campo-a-campo analysis e mockup sugerido.

## Quality Gates
- [ ] Cada campo analisado com custo de friccao
- [ ] Campos desnecessarios identificados para remocao
- [ ] UX improvements especificados
- [ ] Tracking de form configurado

## Quando Usar
- Quando form completion rate esta baixo
- Auditoria de landing page
- Antes de A/B test de form
