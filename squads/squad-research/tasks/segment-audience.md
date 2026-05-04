---
task: segment-audience
responsavel: "@audience-intelligence"
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

# Task: Segment Audience

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** dados de audiencia, psychographics
- **Feeds:** build-audience-persona, content-intelligence/North

## Objetivo
Segmentar audiencia em grupos acionaveis baseados em comportamento, necessidades e valor, nao apenas demografia.

## Entrada
- Dados de audiencia (analytics, CRM, vendas, social)
- Psychographics (se disponiveis)

## Passos

### 1. Criterios de Segmentacao
- **Comportamental** (preferido): como se comportam, o que compram, frequencia
- **Necessidade/JTBD:** que 'job' tentam realizar
- **Valor:** quanto geram de receita, LTV, potencial
- **Demografico** (complementar): idade, localizacao, cargo
- **Psicografico** (complementar): valores, estilo de vida
- REGRA: comportamental + JTBD primeiro, demografia depois

### 2. Metodo de Segmentacao
- **RFM (Recency, Frequency, Monetary):** para base de clientes existente
- **Behavioral clustering:** por padroes de uso/consumo
- **JTBD-based:** por 'trabalho' que tentam realizar
- **Value-based:** por potencial de receita
- Escolher metodo baseado nos dados disponiveis

### 3. Identificar Segmentos
- Objetivo: 3-5 segmentos (menos e generico, mais e impraticavel)
- Para cada segmento:
  - Nome descritivo (ex: "Power Users", "Exploradores Cautelosos")
  - Tamanho estimado (% da base)
  - Comportamento tipico
  - JTBD dominante
  - Valor (receita real ou potencial)
  - Canal preferido

### 4. Priorizacao de Segmentos
- **Estrela:** alto valor + alto engajamento → investir
- **Potencial:** alto valor + baixo engajamento → ativar
- **Leal:** baixo valor + alto engajamento → monetizar
- **Dormante:** baixo valor + baixo engajamento → decidir (reativar ou soltar)

### 5. Implicacoes por Segmento
- Que conteudo? Que canal? Que oferta? Que tom?
- Personalizacao: o que muda por segmento?
- Metricas de sucesso por segmento

## Saida
- 3-5 segmentos documentados
- Priorizacao de segmentos
- Implicacoes praticas por segmento
- Recomendacao de abordagem diferenciada

## Validacao
- [ ] Segmentacao baseada em comportamento/JTBD (nao so demografia)
- [ ] 3-5 segmentos acionaveis
- [ ] Priorizacao por valor × engajamento
- [ ] Implicacoes praticas definidas

---

*Task operada por: audience-intelligence (Pulse)*
