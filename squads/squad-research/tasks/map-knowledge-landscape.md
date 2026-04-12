---
task: map-knowledge-landscape
responsavel: "@deep-researcher"
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

# Task: Map Knowledge Landscape

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** STANDARD
- **Depends on:** research brief
- **Feeds:** conduct-deep-research, conduct-literature-review

## Objetivo
Criar mapa visual/estruturado de um dominio de conhecimento, identificando autores-chave, frameworks, tendencias, gaps e conexoes entre sub-areas.

## Entrada
- Dominio ou topico a mapear
- Nivel de profundidade desejado
- Contexto: por que mapear (decisao, learning, estrategia)

## Passos

### 1. Definir Fronteiras do Dominio
- O que ESTA DENTRO do escopo
- O que ESTA FORA (dominios adjacentes)
- Sub-areas principais (3-7)
- Intersecoes com outros dominios

### 2. Mapear Autores & Pensadores-Chave
- Para cada sub-area: quem sao as referencias principais?
- Autores fundacionais (quem criou o campo)
- Autores contemporaneos (quem esta avancando)
- Practitioners vs Academicos

### 3. Mapear Frameworks & Modelos
- Frameworks estabelecidos (ex: Porter's Five Forces, JTBD)
- Frameworks emergentes (novos, menos testados)
- Frameworks em declinio (superados mas ainda citados)
- Para cada: autor, ano, aplicabilidade

### 4. Identificar Tendencias
- O que esta crescendo em atencao/citacao?
- O que esta perdendo relevancia?
- Debates ativos no campo (controversias)
- Fronteiras do conhecimento (o que nao se sabe ainda)

### 5. Mapear Gaps
- Areas sub-pesquisadas
- Perguntas sem resposta robusta
- Intersecoes nao-exploradas entre sub-areas
- Oportunidades de contribuicao original

### 6. Visualizar
- Mapa mental ou diagrama de relacoes
- Clusters de temas relacionados
- Hierarquia: conceitos fundamentais → aplicados → emergentes
- Indicar densidade de pesquisa por area

## Saida
- Knowledge landscape map (visual + descritivo)
- Lista de autores-chave por sub-area
- Frameworks catalogados
- Gaps identificados
- Recomendacao de onde focar pesquisa

## Validacao
- [ ] Fronteiras do dominio definidas
- [ ] Autores-chave mapeados
- [ ] Frameworks catalogados com aplicabilidade
- [ ] Gaps identificados
- [ ] Visualizacao criada

---

*Task operada por: deep-researcher (Sage)*
