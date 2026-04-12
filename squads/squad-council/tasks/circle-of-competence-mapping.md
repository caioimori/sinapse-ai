---
task: circle-of-competence-mapping
responsavel: "@charlie-munger"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: entity_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: competence_map
    tipo: document
    destino: Console

Checklist:
  - "[ ] Dominios de competencia identificados"
  - "[ ] Limites do circulo definidos honestamente"
  - "[ ] Gaps criticos mapeados"
  - "[ ] Estrategia de expansao ou delegacao definida"
---

# Task: Circle of Competence Mapping

## Metadata
- **Squad:** squad-council
- **Agent:** Charlie Munger
- **Complexity:** Standard

## Objetivo
Mapear com honestidade brutal o circulo de competencia de uma equipe, empresa ou individuo. Identificar o que realmente sabemos vs o que achamos que sabemos vs o que nao sabemos. "Knowing what you don't know is more useful than being brilliant." — Munger

## Pre-Condicoes
- Individuo, equipe ou empresa definida
- Disposicao para honestidade radical sobre limitacoes
- Contexto sobre dominio de atuacao

## Passos

### 1. Listar Dominios de Atuacao
Mapear todos os dominios onde a entidade opera ou pretende operar:
| Dominio | Tempo de Experiencia | Resultados Comprovados | Auto-Avaliacao |
|---------|---------------------|----------------------|----------------|
| | | | expert/competent/learning/novice |

### 2. Classificar cada Dominio
Para cada dominio, aplicar o teste Munger:
```
INSIDE the circle (expert):
  - Pode explicar para uma crianca
  - Previu corretamente resultados passados
  - Sabe o que NAO sabe dentro do dominio
  - Outros experts reconhecem competencia

EDGE of the circle (competent):
  - Entende conceitos mas nao nuances
  - Acerta na maioria dos casos rotineiros
  - Pode ser surpreendido por edge cases
  - Precisa de consultoria em decisoes criticas

OUTSIDE the circle (novice/dangerous):
  - Sabe vocabulario mas nao a substancia
  - Não consegue distinguir bom conselho de mau
  - Dunning-Kruger pode estar operando
  - Decisoes aqui sao apostas, nao escolhas informadas
```

### 3. Mapear Visualmente
```
[INSIDE - Core]     → Onde competimos com vantagem
[EDGE - Adjacent]   → Onde operamos com cautela
[OUTSIDE - Danger]  → Onde delegamos ou nao entramos
```
Para cada zona, listar:
- Skills especificas
- Tipos de decisoes que podemos/nao podemos tomar
- Nivel de confianca justificada

### 4. Aplicar o "Newspaper Test"
Para cada dominio marcado como "inside":
- Se um jornalista perguntasse as 10 questoes mais dificeis do dominio, responderiamos bem?
- Se um expert do dominio avaliasse nossas decisoes, concordaria?
- Nossos resultados comprovam competencia ou tivemos sorte?

### 5. Identificar Gaps Criticos
| Gap | Impacto no Negocio | Urgencia | Estrategia |
|-----|-------------------|----------|-----------|
| | alto/medio/baixo | | expandir/delegar/evitar |

Estrategias para gaps:
- **Expandir:** Investir em aprendizado (tempo + experiencia real)
- **Delegar:** Contratar ou consultar quem tem competencia
- **Evitar:** Nao operar neste dominio
- **Partnering:** Encontrar partner complementar

### 6. Detectar Dunning-Kruger Zones
Onde a auto-avaliacao pode estar inflada:
- Dominios com pouca experiencia mas alta confianca
- Dominios onde nunca falhamos (falta de feedback)
- Dominios onde recebemos elogios de nao-experts
- Dominios adjacentes ao nosso core (spillover de confianca)

### 7. Definir Regras de Operacao
| Zona | Regra |
|------|-------|
| Inside | Decidir com confianca, aceitar risco calibrado |
| Edge | Decidir com cautela, buscar segunda opiniao |
| Outside | NUNCA decidir sozinho, sempre delegar ou consultar |

### 8. Planejar Expansao Estrategica
- Quais areas VALEM a pena expandir? (ROI de aprendizado)
- Quais areas e melhor delegar permanentemente?
- Qual e o plano de aprendizado para areas de expansao?
- Como medir progresso na expansao do circulo?

## Output
```yaml
competence_map:
  entity: ""
  date: ""
  domains:
    inside:
      - domain: ""
        evidence: ""
        decision_authority: "full"
    edge:
      - domain: ""
        gaps: ""
        decision_authority: "with-consultation"
    outside:
      - domain: ""
        strategy: "delegate/avoid/expand"
        decision_authority: "none"
  critical_gaps: []
  dunning_kruger_risks: []
  expansion_plan: []
  operating_rules: []
```

## Validacao
- [ ] Todos os dominios relevantes mapeados
- [ ] Classificacao inside/edge/outside com evidencias
- [ ] Newspaper test aplicado aos dominios "inside"
- [ ] Dunning-Kruger zones identificadas
- [ ] Gaps criticos com estrategia (expandir/delegar/evitar)
- [ ] Regras de operacao por zona definidas
