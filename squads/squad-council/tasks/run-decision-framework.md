---
task: run-decision-framework
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: decision
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: decision_analysis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Problema definido com precisao"
  - "[ ] Mental models aplicados (Munger)"
  - "[ ] Principles analysis completada (Dalio)"
  - "[ ] Contrarian check realizado (Thiel)"
  - "[ ] Leverage assessment feito (Naval)"
  - "[ ] Recomendacao final sintetizada"
---

# Task: Run Multi-Lens Decision Framework

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx) + 4 advisors
- **Complexity:** High

## Objetivo
Aplicar um framework de decisao multi-lente combinando modelos mentais (Munger), principios (Dalio), pensamento contrario (Thiel) e raciocinio por leverage (Naval).

## Passos

### Phase 1: Problem Definition (Zenith)
1. Definir o problema com precisao
2. Identificar tipo de decisao e restricoes
3. Mapear criterios de decisao

### Phase 2: Mental Models Analysis (Munger)
1. Aplicar 3+ modelos mentais de disciplinas diferentes
2. Inversao obrigatoria
3. Bias check
4. Circle of competence assessment

### Phase 3: Principles-Based Analysis (Dalio)
1. Quais principios se aplicam?
2. Expected value calculation
3. Stress test: e se premissas estiverem 50% erradas?
4. Believability: quem tem mais credibilidade neste topico?

### Phase 4: Contrarian Check (Thiel)
1. Qual e a visao de consenso sobre esta decisao?
2. Que premissa do consenso pode estar errada?
3. Se fizermos o oposto do convencional, o que acontece?
4. Somos optimistas definidos ou indefinidos?

### Phase 5: Leverage Overlay (Naval)
1. Qual opcao cria mais leverage?
2. Qual compoe melhor ao longo de decadas?
3. Qual alinha com specific knowledge?

### Phase 6: Final Recommendation (Zenith)
1. Sintetizar todas as lentes
2. Recomendacao clara com raciocinio
3. Dissenting views
4. Risk mitigation
5. Monitoring plan
