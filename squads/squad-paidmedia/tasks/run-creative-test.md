---
task: run-creative-test
responsavel: "@meta-ads-specialist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: test_hypothesis
    tipo: document
    origem: "Canvas"
    obrigatorio: true
  - campo: creatives
    tipo: list
    origem: "Canvas"
    obrigatorio: true

Saida:
  - campo: test_results
    tipo: document
    destino: "Canvas + Apex"
---

# Task: Run Creative Test

## Metadata
- **Agent:** meta-ads-specialist (Signal)
- **Squad:** squad-paidmedia
- **Complexity:** MEDIUM

## Objetivo
Configurar e executar teste de criativo na Meta com rigor estatistico, isolando variaveis e garantindo resultados confiaveis.

## Inputs
- Hipotese de teste (formato IF/THEN/BECAUSE)
- Criativos a testar (control + variantes)
- Budget de teste
- Duracao minima estimada

## Steps

1. **Validar hipotese e variaveis**
   - Confirmar formato: IF [variavel], THEN [metrica esperada], BECAUSE [racional]
   - Verificar que apenas 1 variavel e testada (hook, body, CTA, formato, audience)
   - Se mais de 1 variavel, quebrar em testes sequenciais

2. **Calcular sample size e duracao**
   - Baseline CVR: usar dados dos ultimos 30 dias
   - MDE (Minimum Detectable Effect): 20% default (ajustar por contexto)
   - Confidence: 95% (p<0.05)
   - Power: 80%
   - Formula: n = (Z_alpha + Z_beta)^2 * (p1*(1-p1) + p2*(1-p2)) / (p1-p2)^2
   - Duracao minima: 7 dias (para capturar day-of-week variation)

3. **Configurar teste na plataforma**
   - Opcao A: A/B Test feature do Meta (preferido — split de trafego controlado)
   - Opcao B: Ad set separado com mesmo audience (menos preciso)
   - Opcao C: Ads dentro do mesmo ad set (Meta otimiza — menos controle)
   - Budget de teste: suficiente para atingir sample size em 7-14 dias

4. **Monitorar durante execucao**
   - NAO fazer mudancas durante o teste
   - Verificar delivery: todos os ads recebendo impressions?
   - Verificar pacing: budget sendo gasto conforme esperado?
   - Alerta se um ad tem 0 impressions apos 48h

5. **Analisar resultados**
   - Calcular significancia estatistica (p-value)
   - Calcular confidence interval para a diferenca
   - Se p<0.05: declarar vencedor
   - Se p>=0.05: teste inconclusivo — aumentar sample ou MDE
   - Documentar aprendizado independente do resultado

6. **Acao pos-teste**
   - Winner: escalar para campaigns ativas
   - Loser: documentar aprendizado, nunca repetir
   - Inconclusivo: re-testar com maior budget ou variavel mais dramatica

## Output
Test results document com hipotese, dados, significancia, conclusao e proximos passos.

## Quality Gates
- [ ] Apenas 1 variavel testada
- [ ] Sample size calculado antes do teste
- [ ] Duracao minima de 7 dias
- [ ] Significancia estatistica calculada (p-value)
- [ ] Aprendizado documentado

## Quando Usar
- Testar novo tipo de criativo (formato, hook, CTA)
- Validar hipotese de Canvas sobre creative performance
- Iteracao de creative testing cycle
