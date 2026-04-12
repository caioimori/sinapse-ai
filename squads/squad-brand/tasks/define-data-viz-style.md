---
task: define-data-viz-style
responsavel: "@brand-identity-designer"
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

# Task: define-data-viz-style

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*define-data-viz-style`
- **Inputs:** Paleta, tipografia, graphic vocabulary
- **Outputs:** Data visualization style guide

## Description
Define estilo de data visualization e infographics — cores, formas, tipografia e layouts para graficos e dados.

## Steps
1. Definir cores para graficos (subset da paleta + semanticas: verde=positivo, vermelho=negativo)
2. Definir ordem de cores para series de dados (primaria primeiro, sequencial)
3. Definir estilo de chart: rounded bars vs sharp, smooth lines vs angular, filled area vs outline
4. Definir tipografia em graficos (font, sizes para labels, axis, legend, title)
5. Definir grid e eixos (visibilidade: linhas sutis, cor neutra)
6. Definir legenda e tooltip style (posicao, formato, cores)
7. Definir infographic layout patterns: timeline, comparison, process, stats, hierarchy
8. Criar exemplos para cada tipo de chart (bar, line, pie, donut, scatter, area)
9. Definir acessibilidade (nao depender so de cor, patterns + labels)

## Validation Criteria
- Cores de dados sao distintas e acessiveis (color-blind safe)
- Estilo e coerente com identidade visual
- Tipografia legivel em tamanhos pequenos
- Exemplos para cada tipo de chart

## Output Format
Data viz style guide com paleta de dados, chart styles, tipografia, grid, infographic patterns.
