---
task: create-ux-principles
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

# Task: Create UX Principles

## Metadata
- **Squad:** squad-design
- **Agent:** Compass (dx-ux-strategist)
- **Complexity:** Standard

## Objetivo
Definir principios de UX do projeto — guidelines de alto nivel que orientam todas as decisoes de experiencia do usuario e criam coerencia entre agentes.

## Entrada
- User research insights
- Brand values e posicionamento
- Business goals
- Competitive analysis
- Personas

## Passos

### 1. Identificar Temas Centrais
A partir de research e brand, extrair 4-6 temas:
| Tema | Fonte | Importancia |
|------|-------|------------|
| | [Research / Brand / Business] | |

### 2. Formular Principios
Cada principio deve:
- Ser memoravel (1 frase)
- Ser acionavel (guia decisoes)
- Ser testavel (pode ser verificado)
- Ter tensao (algo que poderiamos NAO fazer)

```yaml
ux_principle:
  name: ""  # 2-3 palavras
  statement: ""  # 1 frase clara
  rationale: ""  # Por que este principio?
  implications:
    design: ""  # Como afeta design
    content: ""  # Como afeta conteudo
    interaction: ""  # Como afeta interacao
    development: ""  # Como afeta implementacao
  do:
    - ""  # Exemplos do que fazer
  dont:
    - ""  # Exemplos do que nao fazer
  metrics:
    - ""  # Como medir aderencia
```

### 3. Priorizar Principios
Quando principios conflitam, definir hierarquia:
1. Principio mais importante (safety/a11y)
2. Segundo mais importante
3. ...

### 4. Criar Decision Framework
Para decisoes de design, usar principios como filtro:
| Opcao | Principio 1 | Principio 2 | Principio 3 | Score |
|-------|------------|------------|------------|-------|
| A | [+/-/0] | [+/-/0] | [+/-/0] | |
| B | [+/-/0] | [+/-/0] | [+/-/0] | |

### 5. Socializar com Squad
- Apresentar principios a todos os agentes
- Coletar feedback e refinar
- Definir como principios serao usados no dia-a-dia

## Saida
- UX Principles document (4-6 principios)
- Decision framework baseado em principios
- Do/Don't examples por principio
- Metricas de aderencia

## Validacao
- [ ] 4-6 principios definidos
- [ ] Principios acionaveis e testaveis
- [ ] Hierarquia de prioridade definida
- [ ] Do/Don't com exemplos concretos
- [ ] Alinhados com brand values e research
