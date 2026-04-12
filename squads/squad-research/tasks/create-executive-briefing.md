---
task: create-executive-briefing
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

# Task: Create Executive Briefing

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** synthesize-research-report
- **Feeds:** @project-lead, commercial-systems

## Objetivo
Criar briefing executivo de 2-3 paginas com foco em "So what?" — formato decision-ready para lideranca.

## Entrada
- Relatorio de pesquisa sintetizado
- Contexto de decisao (que decisao sera tomada?)
- Audiencia do briefing (C-level, board, investidores)

## Passos

### 1. Definir Contexto de Decisao
- Qual decisao sera informada por este briefing?
- Quem decidira? (perfil, nivel de detalhe esperado)
- Que informacao e critica para a decisao?
- Que objecoes/preocupacoes a audiencia tera?

### 2. Construir One-Line Thesis
- Resumir TODA a pesquisa em 1 frase
- Formato: "[Dado X], recomendamos [Y] porque [Z]"
- Testar: se a pessoa so lesse esta frase, entenderia a recomendacao?

### 3. Selecionar Key Insights (3-5)
- Filtrar do relatorio completo os insights mais impactantes
- Cada insight com confidence level (HIGH/MEDIUM/LOW)
- Ordenar por relevancia para a decisao
- Incluir dado quantitativo de suporte para cada

### 4. Formatar Business Implications
- "So What?" para cada insight:
  - Impacto em revenue
  - Impacto em market share
  - Impacto em produto/servico
  - Impacto em timeline
- Risk factors se nao agir

### 5. Definir Recommended Actions
- Top 3 recomendacoes priorizadas
- Para cada: acao, owner, timeline, investimento estimado
- Quick wins vs strategic bets
- Dependencies e pre-requisitos

## Saida
- Executive briefing (2-3 paginas max)
- One-line thesis
- 3-5 key insights com confidence
- Business implications
- Recommended actions priorizadas

## Validacao
- [ ] Briefing em 2-3 paginas max
- [ ] One-line thesis clara
- [ ] Insights com confidence levels
- [ ] Cada insight tem "So what?"
- [ ] Recomendacoes com owner e timeline
- [ ] Decision-ready format

---

*Task operada por: data-synthesizer (Loom)*
