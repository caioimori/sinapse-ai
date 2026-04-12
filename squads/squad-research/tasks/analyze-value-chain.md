---
task: analyze-value-chain
responsavel: "@market-analyst"
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

# Task: Analyze Value Chain

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** industria definida
- **Feeds:** identify-competitive-gaps (Hawk), brand-system

## Objetivo
Analisar value chain da industria (Porter) para identificar onde valor e criado/capturado e onde ha oportunidades de posicionamento.

## Entrada
- Industria a analisar
- Nosso posicionamento atual (ou pretendido) na cadeia

## Passos

### 1. Mapear Elos da Cadeia
- Do fornecedor de insumos ate o consumidor final
- Para cada elo: quem sao os players, o que fazem, que valor agregam
- Exemplo: Materia-prima → Producao → Distribuicao → Varejo → Consumidor

### 2. Analise de Valor por Elo
- Margem tipica de cada elo (se disponivel)
- Onde esta a maior captura de valor?
- Onde esta a menor? Por que?
- Tendencia: valor esta migrando entre elos?

### 3. Analise de Poder por Elo
- Que elo tem mais poder de negociacao? (conectar com Five Forces)
- Que elo e mais substituivel?
- Que elo tem mais barreiras de entrada?

### 4. Disrupcoes na Cadeia
- Desintermediacao: alguem eliminando elos?
- Verticalizacao: alguem expandindo para mais elos?
- Plataformas: alguem conectando elos diretamente?
- Tecnologia: alguem automatizando elos?

### 5. Oportunidades de Posicionamento
- Em que elo devemos nos posicionar? Por que?
- Podemos criar novo elo (valor nao existente)?
- Podemos comprimir elos (desintermediar)?
- Podemos expandir para elos adjacentes?

## Saida
- Value chain visual com elos e players
- Analise de valor e poder por elo
- Disrupcoes identificadas
- Recomendacao de posicionamento na cadeia

## Validacao
- [ ] Cadeia completa mapeada
- [ ] Valor e poder analisados por elo
- [ ] Disrupcoes identificadas
- [ ] Posicionamento recomendado

---

*Task operada por: market-analyst (Scope)*
