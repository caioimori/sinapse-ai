---
task: resolve-culture-crisis
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: crisis_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: resolution_plan
    tipo: document
    destino: Console

Checklist:
  - "[ ] Crisis diagnosticada com root cause"
  - "[ ] Culture Circle consultado (Lencioni, Brown, Sinek)"
  - "[ ] Plano de intervencao criado"
  - "[ ] Metricas de recuperacao definidas"
---

# Task: Resolve Culture Crisis

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx) + Culture Circle
- **Complexity:** High

## Objetivo
Resolver uma crise de cultura organizacional convocando o Culture Circle (Lencioni, Brown, Sinek) para diagnosticar e criar plano de intervencao.

## Passos

### Phase 1: Crisis Diagnosis (Zenith)
1. O que aconteceu? (fatos observaveis)
2. Quando comecou? (timeline)
3. Quem esta afetado?
4. Qual e o impacto em resultados, retencao, moral?

### Phase 2: Team Health Assessment (Lencioni)
1. Qual das 5 disfuncoes e mais aguda?
2. Confianca esta quebrada? (vulnerability-based trust)
3. Existe conflito saudavel ou harmonia artificial?
4. Accountability existe ou foi abandonada?

### Phase 3: Courage & Trust Assessment (Brown)
1. BRAVING inventory: onde a confianca falhou?
2. Que armoring behaviors estao presentes?
3. A lideranca esta modelando vulnerabilidade?
4. E seguro ter conversas dificeis?

### Phase 4: Purpose Reconnection (Sinek)
1. O WHY organizacional esta claro?
2. As pessoas se sentem conectadas ao proposito?
3. Lideranca esta sacrificando numeros para salvar pessoas ou pessoas para salvar numeros?
4. Existe uma Just Cause que une a equipe?

### Phase 5: Intervention Plan
1. Acao imediata: stopping the bleeding
2. Trust repair: exercicios e praticas de confianca
3. Accountability reset: novos acordos e metricas
4. Purpose realignment: reconexao com o WHY
5. Monitoring: como medir recuperacao
