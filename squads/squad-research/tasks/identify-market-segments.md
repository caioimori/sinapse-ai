---
task: identify-market-segments
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

# Task: Identify Market Segments

## Metadata
- **Squad:** squad-research
- **Agent:** market-analyst (Scope)
- **Complexity:** STANDARD
- **Depends on:** size-market-tam-sam-som
- **Feeds:** segment-audience (Pulse), commercial-systems

## Objetivo
Identificar e avaliar segmentos de mercado para determinar onde focar recursos e esforcos.

## Entrada
- Mercado dimensionado
- Dados de clientes existentes (se houver)
- Landscape competitivo

## Passos

### 1. Criterios de Segmentacao de Mercado
- **B2B:** industria, tamanho, maturidade digital, necessidade, budget
- **B2C:** demografia, geografia, comportamento, necessidade, willingness to pay
- **Transversal:** JTBD (que job o segmento precisa), tecnografia

### 2. Identificar Segmentos (3-7)
- Nomear cada segmento de forma descritiva
- Tamanho estimado (% do SAM)
- Perfil tipico
- Necessidade dominante
- Competitive intensity neste segmento

### 3. Avaliar Atratividade

| Segmento | Tamanho | Crescimento | Competicao | Fit | Score |
|----------|:-------:|:-----------:|:----------:|:---:|:-----:|
| Seg 1 | 1-5 | 1-5 | 1-5 (inv) | 1-5 | |
| Seg 2 | | | | | |

### 4. Priorizacao (STP — Kotler)
- **Primary:** segmento principal de foco (maior score)
- **Secondary:** proximo a expandir
- **Tertiary:** futuro (monitorar)
- **Avoid:** segmentos a NAO perseguir (e por que)

### 5. Recomendacao de Targeting
- Abordagem diferenciada por segmento?
- Que produto/messaging para cada?
- Que canal para cada?

## Saida
- Segmentos identificados e dimensionados
- Scoring de atratividade
- Priorizacao (primary/secondary/tertiary/avoid)
- Recomendacao de targeting

## Validacao
- [ ] 3-7 segmentos identificados
- [ ] Cada segmento dimensionado
- [ ] Scoring de atratividade calculado
- [ ] Priorizacao definida com justificativa

---

*Task operada por: market-analyst (Scope)*
