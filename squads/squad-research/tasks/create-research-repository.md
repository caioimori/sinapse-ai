---
task: create-research-repository
responsavel: "@data-synthesizer"
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

# Task: Create Research Repository

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** pesquisas em andamento
- **Feeds:** todos os agentes do squad

## Objetivo
Organizar e manter repositorio de conhecimento de pesquisa — taxonomia, tagging, busca — documento vivo atualizado a cada ciclo de pesquisa.

## Entrada
- Todos os outputs de pesquisa produzidos
- Metadados de cada pesquisa (data, autor, depth, confidence)
- Taxonomia do dominio

## Passos

### 1. Definir Taxonomia
- **Nivel 1 (Dominio):** Market, Audience, Competitive, Technology, Regulatory
- **Nivel 2 (Topico):** Sizing, Trends, Segments, Pricing, etc.
- **Nivel 3 (Subtopico):** Especificos por industria/projeto
- **Tags transversais:** industria, geografia, persona, competidor, tecnologia
- Taxonomia deve ser MECE (Mutually Exclusive, Collectively Exhaustive)

### 2. Catalogar Pesquisas Existentes
Para cada pesquisa:
- **ID unico:** RES-{YYYY}-{NNN}
- **Titulo:** Descritivo e buscavel
- **Dominio/Topico/Subtopico:** Classificacao taxonomica
- **Depth level:** SCAN / ANALYZE / DEEP DIVE / DEFINITIVE
- **Data de producao:** Quando foi feito
- **Data de validade:** Ate quando e confiavel
- **Confidence:** HIGH / MEDIUM / LOW
- **Key findings:** 3-5 bullets com os insights principais
- **Tags:** Palavras-chave para busca
- **Agente autor:** Quem produziu (Sage, Pulse, Hawk, Scope, Horizon)

### 3. Estrutura do Repositorio
```
research-repository/
├── index.md                    # Catalogo completo buscavel
├── market/
│   ├── sizing/
│   ├── trends/
│   ├── segments/
│   └── pricing/
├── audience/
│   ├── personas/
│   ├── journeys/
│   ├── jtbd/
│   └── psychographics/
├── competitive/
│   ├── landscape/
│   ├── profiles/
│   ├── battle-cards/
│   └── gaps/
├── technology/
│   ├── adoption/
│   ├── emerging/
│   └── hype-cycle/
└── cross-domain/
    ├── swot/
    ├── scenarios/
    └── strategic-reports/
```

### 4. Regras de Manutencao
- **Freshness check:** Pesquisas com >6 meses marcadas como "NEEDS REFRESH"
- **Deprecation:** Pesquisas com >12 meses movidas para "archive/"
- **Versioning:** Pesquisa atualizada cria nova versao (v1.0, v1.1, v2.0)
- **Conflitos:** Quando 2 pesquisas se contradizem, criar "RESOLUTION NOTE"
- **Review cadence:** Index revisado mensalmente

### 5. Busca e Acesso
- Index.md com tabela de todas as pesquisas (filtrable)
- Tags para busca rapida
- Cross-references entre pesquisas relacionadas
- "Related research" section em cada pesquisa
- "Most cited" tracking (pesquisas mais referenciadas)

## Saida
- Repositorio estruturado com taxonomia
- Index catalogo de todas as pesquisas
- Regras de manutencao documentadas
- Sistema de busca por tags

## Validacao
- [ ] Taxonomia MECE definida
- [ ] Todas as pesquisas catalogadas com metadados
- [ ] Estrutura de diretorios criada
- [ ] Regras de freshness e deprecation definidas
- [ ] Index buscavel produzido
- [ ] Cross-references mapeadas

---

*Task operada por: data-synthesizer (Loom)*
