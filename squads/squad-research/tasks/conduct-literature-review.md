---
task: conduct-literature-review
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

# Task: Conduct Literature Review

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** COMPLEX
- **Depends on:** map-knowledge-landscape
- **Feeds:** generate-hypothesis, design-research-framework

## Objetivo
Conduzir literature review sistematica de fontes academicas e de industria sobre topico, identificando estado da arte, consensus, debates e gaps.

## Entrada
- Topico de pesquisa definido
- Escopo: academico, industria, ou ambos
- Knowledge landscape (se disponivel)

## Passos

### 1. Definir Criterios de Inclusao/Exclusao
- **Periodo:** ultimos X anos (default: 5 para industria, 10 para academico)
- **Fontes:** journals, conferencias, reports, livros
- **Idiomas:** ingles + portugues (ou conforme brief)
- **Qualidade minima:** Tier 1-3 (Source Credibility Matrix)
- **Exclusoes:** artigos de opiniao sem dados, press releases

### 2. Busca Sistematica
- Definir termos de busca (keywords + variantes)
- Bases: Google Scholar, ResearchGate, SSRN, PubMed (se saude)
- Industria: Gartner, McKinsey, HBR, MIT Sloan, Forrester
- Livros: Amazon Scholar, Goodreads (referencia de practitioners)
- Registrar: total encontrado, selecionados, excluidos (com razao)

### 3. Triagem
- Leitura de abstracts/resumos executivos
- Classificar relevancia: HIGH | MEDIUM | LOW
- HIGH: leitura completa
- MEDIUM: leitura seletiva (sections relevantes)
- LOW: registrar mas nao aprofundar

### 4. Extracao de Dados
- Para cada fonte HIGH:
  - Thesis/argumento principal
  - Metodologia
  - Key findings
  - Limitacoes declaradas
  - Como se relaciona com outras fontes
- Organizar em tabela de extracao

### 5. Sintese Tematica
- Agrupar findings por tema (nao por fonte)
- Identificar: consensus | debate | gap | emergente
- Construir narrativa do estado da arte
- Cronologia: como o pensamento evoluiu

### 6. Avaliacao Critica
- Qualidade geral das evidencias
- Vieses sistematicos identificados
- Robustez das conclusoes
- O que falta para conclusoes mais fortes

## Saida
- Literature review estruturada
- Tabela de extracao de dados
- Sintese tematica com estado da arte
- Gaps e oportunidades de pesquisa
- Bibliografia classificada

## Validacao
- [ ] Criterios de inclusao/exclusao definidos
- [ ] Busca sistematica documentada
- [ ] Fontes classificadas e triadas
- [ ] Sintese tematica (nao apenas lista)
- [ ] Gaps identificados
- [ ] Bibliografia completa

---

*Task operada por: deep-researcher (Sage)*
