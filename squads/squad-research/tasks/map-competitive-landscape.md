---
task: map-competitive-landscape
responsavel: "@competitive-intelligence"
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

# Task: Map Competitive Landscape

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** COMPLEX
- **Depends on:** mercado definido
- **Feeds:** analyze-competitor-positioning, identify-competitive-gaps

## Objetivo
Mapear landscape competitivo completo incluindo competidores diretos, indiretos e substitutos, com posicionamento e white spaces.

## Entrada
- Mercado/industria a analisar
- Produto/servico de referencia (nosso)
- Dados existentes (se houver)

## Passos

### 1. Definir Mercado & Criterios
- Definicao exata do mercado (fronteiras)
- Criterios de inclusao: quem e competidor?
  - **Direto:** mesmo produto, mesmo mercado
  - **Indireto:** produto diferente, mesmo 'job' (JTBD)
  - **Substituto:** alternativa completamente diferente (incluindo "nao fazer nada")
- Geografia do escopo

### 2. Identificacao de Competidores
- Diretos: 5-10 principais
- Indiretos: 3-5 relevantes
- Substitutos: 2-3 alternativas
- Fontes: Google, social, reviews, Crunchbase, SimilarWeb, reports de industria

### 3. Perfil Rapido (para cada)
- Posicionamento (em 1 frase)
- Target principal
- Pricing (faixa)
- Diferencial declarado
- Tamanho estimado (receita, equipe, clientes)
- Presenca digital (trafego, social)

### 4. Matriz de Posicionamento
- Escolher 2 eixos relevantes (ex: preco × qualidade, nicho × massa, servico × self-service)
- Plotar todos os competidores na matriz 2x2
- Identificar clusters e white spaces
- Onde NOS estamos (ou queremos estar)?

### 5. Analise de Concentracao
- Mercado fragmentado (muitos players pequenos) ou concentrado (poucos dominam)?
- HHI (Herfindahl-Hirschman Index) se dados disponiveis
- Tendencia: consolidando ou fragmentando?

### 6. White Space Analysis
- Quadrantes vazios na matriz → oportunidade?
- Segmentos nao-atendidos
- Necessidades ignoradas por todos
- Blue Ocean potential (Kim & Mauborgne)

### 7. Ranqueamento de Ameaca
- Para cada competidor: nivel de ameaca (1-5)
- Criterios: market share, momentum, diferencial real, recursos
- Top 3 ameacas priorizadas para monitoring

## Saida
- Landscape map completo (visual + descritivo)
- Matriz de posicionamento 2x2
- White spaces identificados
- Ranking de ameaca
- Recomendacao de posicionamento

## Validacao
- [ ] Competidores diretos, indiretos e substitutos incluidos
- [ ] Perfil rapido para cada competidor
- [ ] Matriz de posicionamento visual
- [ ] White spaces identificados
- [ ] Top 3 ameacas priorizadas

## Handoffs
```yaml
handoff:
  cross_squad:
    - to: "brand-system/Athena"
      artifact: "landscape map, posicionamento competitivo"
      context: "Para definir diferenciacao de marca"
    - to: "commercial-systems/orchestrator"
      artifact: "ranking de ameaca, diferenciais competitivos"
      context: "Para battle cards e objection handling"
  cross_squad:
    - to: "digital-experience/design-orqx"
      when: "Competitive analysis revela necessidade de feature diferenciadora"
      context: "Diferenciais tecnicos dos competidores"
```

---

*Task operada por: competitive-intelligence (Hawk)*
