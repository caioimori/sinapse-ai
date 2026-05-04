---
task: assess-blitzscaling-readiness
responsavel: "@reid-hoffman"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: company_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: blitzscaling_assessment
    tipo: document
    destino: Console

Checklist:
  - "[ ] Network effects avaliados"
  - "[ ] Winner-take-most dynamics verificadas"
  - "[ ] Stage atual diagnosticado"
  - "[ ] Recomendacao: blitzscale, scale, ou hold"
---

# Task: Assess Blitzscaling Readiness

## Metadata
- **Squad:** squad-council
- **Agent:** Reid Hoffman
- **Complexity:** High

## Objetivo
Avaliar se uma empresa deve blitzscale, scale normalmente, ou manter o tamanho atual. Analisar network effects, winner-take-most dynamics, e stage de crescimento.

## Passos

### 1. Network Effects Analysis
| Tipo | Presente? | Forca | Evidencia |
|------|-----------|-------|-----------|
| Direct (mais usuarios = mais valor) | | | |
| Indirect (two-sided marketplace) | | | |
| Data (mais dados = melhor produto) | | | |
| Platform (mais devs = mais valor) | | | |

### 2. Winner-Take-Most Assessment
- O mercado tem dynamics de winner-take-most?
- First-scaler advantage existe?
- O custo de mover devagar excede o custo de mover rapido?
- Capital esta disponivel para financiar crescimento?

### 3. Stage Diagnosis
| Stage | Employees | Foco | Este Negocio? |
|-------|-----------|------|--------------|
| Family (1-9) | Generalistas | Product-market fit | |
| Tribe (10s) | Cultura forma | Primeiros processos | |
| Village (100s) | Especialistas | Formalizar | |
| City (1,000s) | Infra-estrutura | Complexidade | |
| Nation (10,000+) | Ecossistema | Plataforma | |

### 4. Blitzscaling Decision
- **BLITZSCALE:** Network effects fortes, winner-take-most, capital disponivel, PMF validado
- **SCALE NORMALLY:** Mercado grande mas sem winner-take-most
- **HOLD:** Sem network effects, qualidade/confianca > velocidade
- **NOT YET:** Potencial, mas PMF nao validado ainda

### 5. Distribution Strategy
- Qual e a estrategia de distribuicao?
- "Build it and they will come" NAO e uma estrategia
- Que canais de distribuicao especificos serao usados?
