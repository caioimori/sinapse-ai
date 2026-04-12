---
task: design-research-framework
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

# Task: Design Research Framework

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** COMPLEX
- **Depends on:** map-knowledge-landscape, conduct-literature-review
- **Feeds:** conduct-deep-research (como ferramenta)

## Objetivo
Desenhar framework de pesquisa customizado para dominio ou problema especifico, criando modelo reutilizavel de investigacao.

## Entrada
- Dominio ou problema que precisa de framework
- Knowledge landscape mapeado (preferencial)
- Frameworks existentes relevantes (se houver)

## Passos

### 1. Diagnosticar Necessidade
- Por que frameworks existentes nao servem?
- O que falta: dimensoes? profundidade? especificidade setorial?
- O framework sera para uso unico ou recorrente?

### 2. Definir Dimensoes
- Identificar 3-7 dimensoes de analise
- Cada dimensao deve ser:
  - Mutuamente exclusiva (sem overlap)
  - Coletivamente exaustiva (cobre tudo relevante)
  - Mensuravel ou avaliavel
- Testar com MECE (McKinsey): as dimensoes cobrem 100% do escopo?

### 3. Definir Criterios por Dimensao
- Para cada dimensao:
  - O que avaliar/medir
  - Escala (1-5, LOW/MED/HIGH, qualitativo)
  - Fontes de dados adequadas
  - Benchmarks de referencia (se aplicavel)

### 4. Definir Processo
- Sequencia de aplicacao (que dimensao primeiro?)
- Dependencias entre dimensoes
- Tempo estimado de aplicacao
- Competencias necessarias

### 5. Criar Template de Aplicacao
- Formato visual (matriz, radar, tabela)
- Campos a preencher
- Exemplo preenchido (para calibracao)
- Instrucoes de interpretacao

### 6. Testar
- Aplicar em 1-2 casos reais ou hipoteticos
- O framework produz insights uteis?
- As dimensoes sao suficientes? Demais?
- Ajustar baseado no teste

### 7. Documentar
- Nome do framework (memoravel)
- Quando usar (e quando NAO usar)
- Dimensoes e criterios
- Template
- Exemplo aplicado
- Limitacoes

## Saida
- Framework documentado com nome, dimensoes, criterios
- Template de aplicacao
- Exemplo preenchido
- Instrucoes de uso

## Validacao
- [ ] Dimensoes MECE (mutuamente exclusivas, coletivamente exaustivas)
- [ ] Criterios mensuraveis/avaliaveis
- [ ] Template criado
- [ ] Testado em caso real/hipotetico
- [ ] Documentacao completa

---

*Task operada por: deep-researcher (Sage)*
