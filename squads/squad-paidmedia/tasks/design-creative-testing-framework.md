---
task: design-creative-testing-framework
responsavel: "@creative-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true
---

# Task: Design Creative Testing Framework

## Metadata
- **Agent:** creative-strategist (Canvas)
- **Squad:** squad-paidmedia
- **Complexity:** HIGH

## Objetivo
Desenhar framework de testes de criativo para a conta com hierarquia de variaveis, cadencia e processo.

## Steps

1. **Definir hierarquia de testes** (do mais impactante ao menos)
   - Nivel 1: Concept/Angle (maior impacto) — muda a abordagem toda
   - Nivel 2: Hook (segundo maior) — muda os primeiros 3 segundos
   - Nivel 3: Format (video vs image vs carousel)
   - Nivel 4: Body/messaging (beneficios, social proof, urgencia)
   - Nivel 5: CTA (acao, texto, cor)
   - REGRA: testar niveis superiores primeiro

2. **Definir processo de teste**
   - Hypothesis: IF [variavel] THEN [resultado] BECAUSE [racional]
   - Control: winner atual
   - Variante: 1 variavel mudada
   - Budget: 10-15% do budget total da conta para testes
   - Duracao: min 7 dias ou sample size atingido
   - Winner criteria: p<0.05 + CPA dentro do guardrail

3. **Definir cadencia**
   - Weekly: 1-2 novos testes iniciados
   - Bi-weekly: resultados analisados, winners escalados
   - Monthly: review de framework e ajuste

4. **Definir processo de documentacao**
   - Cada teste documentado: hipotese, variaveis, resultado, aprendizado
   - Learning database acumulativa
   - Patterns de winners e losers

5. **Integracao com pipeline de producao**
   - Canvas planeja testes → Canvas produz variantes → Signal/Query implementa → Pulse analisa → Canvas documenta learnings

## Output
Creative testing framework document com hierarquia, processo, cadencia e templates.

## Quality Gates
- [ ] Hierarquia de variaveis definida
- [ ] Processo de teste documentado
- [ ] Cadencia realista com budget disponivel
- [ ] Template de documentacao de testes criado

## Quando Usar
- Setup de conta nova
- Quando nao existe processo formal de creative testing
- Review anual de framework
