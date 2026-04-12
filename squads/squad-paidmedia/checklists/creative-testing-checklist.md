---
checklist: creative-testing-checklist
squad: squad-paidmedia
description: "Checklist para setup e analise de testes de criativos"
used_by:
  - run-creative-test
  - design-ab-test
  - creative-testing-cycle
---

# Creative Testing Checklist

## 1. Pre-Test Setup
- [ ] Hipotese documentada: IF [variavel] THEN [resultado] BECAUSE [racional]
- [ ] Apenas 1 variavel sendo testada
- [ ] Control definido (melhor performer atual)
- [ ] Variante criada com mudanca isolada
- [ ] Sample size calculado
- [ ] Duracao estimada (min 7 dias)
- [ ] Budget de teste alocado (10-15% do budget total)

## 2. Test Configuration
- [ ] Metodo de teste selecionado (A/B Test Meta, Campaign Experiments Google, ou manual)
- [ ] Traffic split configurado (50/50)
- [ ] Audience: mesma para control e variante
- [ ] Conversion event: mesmo para ambos
- [ ] Tracking validado em ambas variantes
- [ ] Preview verificada (formatos, resolucao)

## 3. During Execution
- [ ] Delivery balanceado verificado (ambos recebendo impressions)
- [ ] Nenhuma mudanca feita durante o teste
- [ ] Budget sendo gasto conforme esperado
- [ ] Nenhum ad com 0 impressions apos 48h
- [ ] Min 7 dias de runtime respeitado

## 4. Post-Test Analysis
- [ ] Sample size atingido (ou justificativa se nao)
- [ ] P-value calculado
- [ ] Se p<0.05: winner declarado
- [ ] Se p>=0.05: teste inconclusivo (nao declarar winner)
- [ ] Confidence interval da diferenca calculado
- [ ] Resultado segmentado (mobile vs desktop, por audience)
- [ ] Practical significance avaliada (diferenca importa para o negocio?)

## 5. Post-Test Actions
- [ ] Winner: escalado para campanhas ativas
- [ ] Loser: pausado, aprendizado documentado
- [ ] Inconclusivo: decisao sobre re-teste com mais budget/tempo
- [ ] Learning adicionado ao creative learnings database
- [ ] Brief para proxima iteracao baseado no resultado
- [ ] Stakeholders informados do resultado

## Test Documentation
| Campo | Valor |
|-------|-------|
| Hipotese | |
| Variavel testada | |
| Control | |
| Variante | |
| Metrica primaria | |
| Duracao | |
| Sample size (required) | |
| Sample size (actual) | |
| P-value | |
| Winner | |
| Learning | |
