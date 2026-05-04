---
task: create-user-personas
responsavel: "@dx-ux-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: Create User Personas

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Criar personas baseadas em dados reais de pesquisa — representacoes arquetipicas dos usuarios que guiam decisoes de design em todo o pipeline.

## Entrada
- Research synthesis (de synthesize-user-research)
- Dados demograficos e comportamentais
- Segmentacao de usuarios existente
- Business goals do DX Brief

## Passos

### 1. Identificar Segmentos
Agrupar usuarios por padroes comportamentais (NAO por demograficos):
- Goals e motivacoes similares
- Pain points compartilhados
- Padroes de uso comparaveis
- Contextos de uso semelhantes

### 2. Definir Persona Template
Para cada persona (maximo 4-5 primarias):

```yaml
persona:
  name: ""  # Nome ficticio memoravel
  archetype: ""  # 1 frase que resume
  photo: "[placeholder description]"

  demographics:
    age_range: ""
    occupation: ""
    tech_savviness: "[low/medium/high]"
    relevant_context: ""

  goals:
    primary: ""
    secondary: []

  pain_points:
    - pain: ""
      severity: "[critical/major/minor]"
      current_workaround: ""

  behaviors:
    - pattern: ""
      frequency: ""
      context: ""

  motivations:
    - ""

  frustrations:
    - ""

  quote: ""  # Frase representativa (real ou composita)

  scenarios:
    - name: ""
      context: ""
      goal: ""
      steps: []
      success_criteria: ""

  design_implications:
    - ""

  accessibility_needs: []
  device_preferences: []
```

### 3. Validar Contra Dados
- Cada atributo deve ter base em dados reais
- Marcar atributos compositos vs diretos
- Evitar estereotipos — usar dados, nao suposicoes

### 4. Criar Persona Spectrum
Posicionar personas em espectros relevantes:
- Tech savviness: Low ←→ High
- Frequency of use: Occasional ←→ Daily
- Task complexity: Simple ←→ Complex
- Motivation: Task-driven ←→ Exploration

### 5. Definir Uso no Pipeline
| Fase | Como personas informam |
|------|----------------------|
| UX Strategy | Priorizacao de features |
| IA | Navegacao e mental models |
| UI Design | Visual tone, complexidade |
| Frontend | Device/browser priorities |
| A11y | Necessidades especificas |
| Content | Tom de voz, vocabulario |

## Saida
- Persona cards (1 por persona)
- Persona spectrum diagram
- Design implications summary
- Usage guide para demais agentes

## Validacao
- [ ] Personas baseadas em dados (nao ficcionais)
- [ ] Maximo 5 personas primarias
- [ ] Goals, pain points e behaviors documentados
- [ ] Design implications claras
- [ ] Accessibility needs consideradas
- [ ] Validadas contra segmentacao real
