---
task: identify-competitive-gaps
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

# Task: Identify Competitive Gaps

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** STANDARD
- **Depends on:** map-competitive-landscape, analyze-competitor-positioning
- **Feeds:** brand-system/Athena, commercial-systems

## Objetivo
Identificar gaps no landscape competitivo — necessidades nao atendidas, segmentos ignorados, white spaces — que representam oportunidades de diferenciacao.

## Entrada
- Landscape competitivo mapeado
- Dados de audiencia (pain points, JTBD)
- Posicionamento dos competidores

## Passos

### 1. Gap de Produto/Servico
- Features que clientes pedem mas ninguem oferece
- Problemas que ninguem resolve bem
- Integracoes que faltam no mercado
- Nivel de qualidade insatisfatorio em todos

### 2. Gap de Segmento
- Segmentos mal-atendidos (ninguem foca neles)
- Segmentos emergentes (novos, sem incumbent)
- Segmentos over-served (pagam por features que nao usam)
- Long tail de Anderson: nichos que players grandes ignoram

### 3. Gap de Modelo
- Modelo de pricing que ninguem usa mas faria sentido
- Canal de distribuicao inexplorado
- Formato de entrega inovador
- Service model diferente (ex: self-serve onde todos fazem high-touch)

### 4. Gap de Posicionamento
- Territorio de marca que ninguem reivindica
- Narrativa que ninguem conta
- Angulo de comunicacao unico
- Counter-positioning opportunity (Helmer)

### 5. Blue Ocean Analysis (Kim & Mauborgne)
- **Eliminar:** O que a industria oferece que pode ser eliminado?
- **Reduzir:** O que pode ser reduzido abaixo do padrao?
- **Aumentar:** O que pode ser elevado acima do padrao?
- **Criar:** O que ninguem oferece e pode ser criado?

### 6. Priorizacao de Oportunidades
- Para cada gap: atratividade (1-5) × viabilidade (1-5)
- Top 3 oportunidades priorizadas
- Risco: por que ninguem explorou este gap? (validar)

## Saida
- Lista de gaps por categoria (produto, segmento, modelo, posicionamento)
- Blue Ocean canvas
- Top 3 oportunidades priorizadas
- Risk assessment de cada oportunidade

## Validacao
- [ ] 4 categorias de gap analisadas
- [ ] Blue Ocean canvas preenchido
- [ ] Oportunidades priorizadas por atratividade × viabilidade
- [ ] Riscos avaliados (por que gap existe)

---

*Task operada por: competitive-intelligence (Hawk)*
