---
task: cross-reference-findings
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

# Task: Cross-Reference Findings

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** STANDARD
- **Depends on:** conduct-deep-research ou multiplas pesquisas
- **Feeds:** synthesize-multi-source

## Objetivo
Cross-referenciar achados entre diferentes pesquisas, fontes ou periodos para validar, contradizer ou enriquecer conclusoes.

## Entrada
- 2+ conjuntos de findings a cross-referenciar
- Contexto: por que o cruzamento e necessario

## Passos

### 1. Inventariar Findings
- Listar todos os findings de cada fonte/pesquisa
- Normalizar linguagem (mesmos termos para mesmos conceitos)
- Agrupar por tema

### 2. Matriz de Cruzamento
- Criar matriz: Finding × Fonte/Pesquisa
- Marcar: CONFIRMADO | CONTRADITO | NAO MENCIONADO | PARCIAL
- Identificar patterns: o que aparece em multiplas fontes?

### 3. Analise de Confirmacao
- Findings confirmados por 3+ fontes → ROBUSTO
- Findings confirmados por 2 fontes → PROVAVEL
- Findings de fonte unica → NAO VERIFICADO
- Findings contraditos → INVESTIGAR

### 4. Analise de Contradicao
- Para cada contradicao:
  - Diferenca de definicao?
  - Diferenca de periodo/contexto?
  - Diferenca de metodologia?
  - Vies de fonte?
- Determinar: qual versao e mais confiavel e por que

### 5. Findings Enriquecidos
- Findings que ganham nuance pelo cruzamento
- Findings novos que emergem da intersecao
- Gaps que se tornam visiveis pelo cruzamento

## Saida
- Matriz de cruzamento preenchida
- Findings classificados por robustez
- Contradicoes analisadas com resolucao
- Findings enriquecidos pelo cruzamento

## Validacao
- [ ] Todos os findings cruzados
- [ ] Contradicoes investigadas e explicadas
- [ ] Robustez classificada para cada finding
- [ ] Novos insights do cruzamento documentados

---

*Task operada por: deep-researcher (Sage)*
