---
task: map-strategic-implications
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

# Task: Map Strategic Implications

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** pesquisas-chave completadas
- **Feeds:** product-systems, commercial-systems, @architect

## Objetivo
Mapear implicacoes estrategicas das descobertas de pesquisa — efeitos de primeira, segunda e terceira ordem para o negocio.

## Entrada
- Findings de pesquisa cristalizados
- Estrategia atual do negocio
- Contexto competitivo

## Passos

### 1. Catalogar Findings de Alto Impacto
- Listar todos os findings com impacto >= 3 (escala 1-5)
- Agrupar por dominio: mercado, audiencia, competitivo, tendencias
- Priorizar por urgencia: imediato (0-3m), curto (3-6m), medio (6-12m), longo (12m+)

### 2. Mapear Efeitos em Cascata
Para cada finding de alto impacto:
- **1a Ordem (direto):** O que muda IMEDIATAMENTE?
  - Impacto em produto, pricing, canal, messaging
- **2a Ordem (consequencia):** O que muda COMO RESULTADO?
  - Impacto em competitividade, market share, unit economics
- **3a Ordem (sistemico):** O que muda NO ECOSSISTEMA?
  - Impacto em industria, regulacao, comportamento de mercado

### 3. Cruzar com Estrategia Atual
- Finding CONFIRMA estrategia atual → reforcar
- Finding DESAFIA estrategia atual → avaliar pivot
- Finding REVELA oportunidade nao prevista → avaliar expansao
- Finding EXPOE risco nao mapeado → mitigar
- Para cada: nivel de urgencia e magnitude da mudanca

### 4. Implication Map Visual
- Mapa visual: finding → 1a ordem → 2a ordem → 3a ordem
- Color coding: verde (oportunidade), vermelho (ameaca), amarelo (neutro)
- Marcar intersecoes (onde multiplos findings convergem)
- Identificar pontos de alavancagem (onde uma acao impacta multiplas areas)

### 5. Recomendacoes Estrategicas
- **Defend:** Acoes para proteger posicao atual
- **Extend:** Acoes para expandir para novas areas
- **Create:** Acoes para criar algo novo
- **Exit:** Areas a abandonar ou despriorisar
- Cada recomendacao com: acao, owner, timeline, metricas de sucesso

## Cross-Squad Handoffs
```yaml
handoffs:
  - to: product-systems
    delivers: implicacoes para roadmap de produto
    format: lista de features/mudancas com evidencia
  - to: commercial-systems
    delivers: implicacoes para GTM e pricing
    format: recomendacoes com dados de mercado
  - to: brand-system
    delivers: implicacoes para posicionamento
    format: insights de percecao e diferenciacao
```

## Saida
- Mapa de implicacoes estrategicas (3 ordens)
- Cruzamento com estrategia atual
- Recomendacoes DECE (Defend/Extend/Create/Exit)
- Visual implication map

## Validacao
- [ ] Efeitos de 1a, 2a e 3a ordem mapeados
- [ ] Cruzamento com estrategia atual documentado
- [ ] Recomendacoes DECE com owners
- [ ] Intersecoes e pontos de alavancagem identificados

---

*Task operada por: data-synthesizer (Loom)*
