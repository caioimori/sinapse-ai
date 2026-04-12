---
task: evaluate-zero-to-one
responsavel: "@peter-thiel"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: business_idea
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: zero_to_one_evaluation
    tipo: document
    destino: Console

Checklist:
  - "[ ] 7 Questions respondidas"
  - "[ ] 0-to-1 vs 1-to-n classificado"
  - "[ ] Monopoly potential avaliado"
  - "[ ] Secret identificado"
---

# Task: Evaluate Zero-to-One Potential

## Metadata
- **Squad:** squad-council
- **Agent:** Peter Thiel
- **Complexity:** High

## Objetivo
Avaliar uma ideia de negocio usando o framework Zero to One de Peter Thiel. Determinar se e genuinamente 0-to-1 ou meramente 1-to-n. Aplicar as Seven Questions e avaliar potencial de monopolio.

## Passos

### 1. The Contrarian Question
"Que verdade importante poucos concordam com voce?"
- Se nao tem resposta, provavelmente esta construindo algo convencional
- O secret por tras do negocio deve ser articulado claramente

### 2. Zero-to-One Test
| Criterio | 0-to-1 | 1-to-n | Este Negocio |
|----------|--------|--------|-------------|
| Cria categoria nova? | Sim | Nao | |
| Competidores diretos no lancamento? | Nao | Sim | |
| 10x melhor que alternativas? | Sim | Nao | |
| Modelo pode ser copiado facilmente? | Nao | Sim | |

### 3. Seven Questions Framework
1. **Engineering:** Tecnologia 10x melhor (nao apenas 2x)?
2. **Timing:** Por que AGORA e o momento certo?
3. **Monopoly:** Comeca com grande share de mercado pequeno?
4. **People:** Time certo com expertise profunda?
5. **Distribution:** Estrategia real de distribuicao?
6. **Durability:** Posicao defensavel em 10-20 anos?
7. **Secret:** Oportunidade unica que outros nao veem?

### 4. Monopoly Assessment
| Caracteristica | Presente? | Evidencia |
|---------------|-----------|-----------|
| Proprietary Technology (10x) | | |
| Network Effects | | |
| Economies of Scale | | |
| Branding | | |

### 5. Mimetic Check
- Este desejo de construir isso e genuino ou mimetico?
- Estamos competindo por status ou criando algo novo?
- A motivacao resistiria se ninguem estivesse assistindo?

### 6. Verdict
- **BUILD** — genuino 0-to-1, monopoly potential, secret identified
- **PIVOT** — potencial, mas precisa de ajustes fundamentais
- **PASS** — 1-to-n, sem monopoly potential, melhor nao investir energia
