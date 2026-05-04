---
task: evaluate-scaling-decision
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: scaling_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: scaling_recommendation
    tipo: document
    destino: Console

Checklist:
  - "[ ] Scaling Council consultado (Hoffman, Thiel, Sivers)"
  - "[ ] Perspectivas pro-growth e anti-growth equilibradas"
  - "[ ] Network effects avaliados"
  - "[ ] Recomendacao com tradeoffs explicitos"
---

# Task: Evaluate Scaling Decision

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx) + Scaling Council
- **Complexity:** High

## Objetivo
Avaliar uma decisao de scaling convocando o Scaling Council (Hoffman, Thiel, Sivers) para obter perspectivas pro-growth E anti-growth.

## Passos

### Phase 1: Context (Zenith)
1. Estagio atual do negocio
2. Metricas de crescimento (revenue, users, retention)
3. Recursos disponiveis (capital, equipe, infraestrutura)
4. Pressao para crescer (investidores, mercado, competicao)

### Phase 2: Pro-Growth Analysis (Hoffman)
1. Network effects presentes?
2. Winner-take-most dynamics?
3. First-scaler advantage relevante?
4. Que stage de blitzscaling e adequado?
5. Distribuicao resolvida?

### Phase 3: Monopoly Assessment (Thiel)
1. O scaling cria monopoly ou intensifica competicao?
2. O mercado e 0-to-1 ou 1-to-n?
3. Existe um secret que justifica o scaling?
4. O scaling segue power law (potencial de 10x+)?

### Phase 4: Anti-Growth Check (Sivers)
1. O scaling e um "hell yeah" ou uma obrigacao?
2. O que acontece se ficar pequeno?
3. O crescimento serve a voce ou voce serve ao crescimento?
4. Ja definiu "enough"?
5. Pode sequenciar (fazer depois) ao inves de paralelizar?

### Phase 5: Synthesis (Zenith)
1. Pro-growth arguments com forca
2. Anti-growth arguments com forca
3. Tensao produtiva: o que emerge?
4. Recomendacao com tradeoffs explicitos
5. Condicoes que mudariam a recomendacao
