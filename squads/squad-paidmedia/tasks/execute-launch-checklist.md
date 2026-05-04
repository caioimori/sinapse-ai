---
task: execute-launch-checklist
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: campaign_config
    tipo: document
    origem: "design-campaign-structure"
    obrigatorio: true

Saida:
  - campo: launch_status
    tipo: document
    destino: "Apex"
---

# Task: Execute Launch Checklist

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** LOW

## Objetivo
Validar todos os items pre-launch de campanha Meta Ads antes de ativar.

## Steps

1. **Tracking validation**
   - [ ] Pixel ativo e firing em todas as paginas de destino
   - [ ] CAPI configurado e events matching
   - [ ] Conversion events corretos selecionados na campanha
   - [ ] Attribution window configurado corretamente (7d click / 1d view padrao)
   - [ ] Test conversion: enviar evento de teste e verificar no Events Manager

2. **Campaign configuration**
   - [ ] Campaign objective correto
   - [ ] Budget type correto (CBO vs ABO)
   - [ ] Budget amount conforme planejado
   - [ ] Schedule start/end corretos
   - [ ] Bid strategy alinhada com objetivo

3. **Ad set configuration**
   - [ ] Audiences corretas selecionadas
   - [ ] Exclusions configuradas entre tiers
   - [ ] Placements: Advantage+ ou selecao manual justificada
   - [ ] Optimization event correto
   - [ ] Budget por ad set >= 5x CPA target (se ABO)

4. **Ad configuration**
   - [ ] Criativos carregados em resolucao correta
   - [ ] Copy e headlines sem erros
   - [ ] CTAs corretos selecionados
   - [ ] URLs de destino corretas e funcionando
   - [ ] UTM parameters presentes e corretos
   - [ ] Preview em todos os placements verificada

5. **Landing page validation**
   - [ ] LP carregando corretamente em mobile e desktop
   - [ ] Message match: headline do ad = headline da LP
   - [ ] CTA da LP funcionando
   - [ ] Form (se aplicavel) submetendo corretamente
   - [ ] Thank you page com tracking de conversao

## Output
Checklist preenchido com status de cada item. GO/NO-GO decision.

## Quality Gates
- [ ] 100% dos items checked para GO
- [ ] Qualquer item failing = NO-GO ate resolver

## Quando Usar
- Antes de ativar qualquer campanha nova no Meta
