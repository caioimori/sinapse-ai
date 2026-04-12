---
task: build-story-bank
responsavel: "@long-form-writer"
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

# Task: Build Story Bank

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** STANDARD
- **Depends on:** customer stories, founder story, market research
- **Feeds:** todos os writers do squad

## Objetivo
Construir e manter story bank — repositorio organizado de historias prontas para uso em qualquer peca de copy. Historias sao o ativo mais valioso de copywriting: transformam argumentos em experiencias.

## Entrada
- Customer stories coletadas
- Founder/team stories
- Industry anecdotes e case studies
- Analogias e metaforas testadas
- Cultural references relevantes

## Passos

### 1. Categorizar por Tipo de Historia
| Categoria | Descricao | Uso em Copy |
|-----------|-----------|-------------|
| Origin | Como a marca nasceu | About, manifesto, pitches |
| Transformation | Antes/depois de clientes | Sales letters, LPs, testimonials |
| Discovery | Momentos "aha" | Product narratives, thought leadership |
| Failure | Fracassos que ensinaram | Credibilidade, rapport |
| Underdog | Vencer contra probabilidades | Inspiracao, brand story |
| Teaching | Licoes e insights | Blog, email nurture, whitepapers |
| Analogy | Comparacoes que simplificam | Explicar conceitos complexos |
| Cultural | Referencia a cultura pop, historia | Conexao cultural, relatability |

### 2. Documentar Cada Historia
**Template de Story Card:**
```yaml
story_card:
  id: STORY-001
  title: "Nome descritivo da historia"
  category: [transformation|origin|discovery|failure|underdog|teaching|analogy|cultural]

  # A historia em si
  setup: "Contexto em 1-2 frases"
  conflict: "O problema/tensao em 1-2 frases"
  resolution: "O resultado/licao em 1-2 frases"

  # Versoes
  full_version: "300-500 palavras"
  short_version: "50-100 palavras"
  one_liner: "1 frase"

  # Metadata
  emotional_trigger: [empatia|curiosidade|medo|desejo|surpresa|orgulho]
  objection_addressed: "Qual objecao esta historia desfaz?"
  proof_type: [social|authority|demonstration|analogy]
  awareness_level: [unaware|problem|solution|product|most]

  # Uso
  channels: [email|LP|sales_letter|social|presentation|blog]
  times_used: 0
  performance_notes: ""

  # Source
  source: "De onde veio (entrevista, observacao, pesquisa)"
  verified: true|false
  date_collected: "YYYY-MM-DD"
```

### 3. Organizar por Funcao Persuasiva
**Cada historia serve a uma funcao especifica no copy:**

| Funcao | Quando Usar | Exemplo |
|--------|-------------|---------|
| Rapport | Opening — criar identificacao | "Eu tambem ja passei por isso..." |
| Pain amplification | Problema — intensificar a dor | "Um cliente nos contou que gastava..." |
| Possibility | Transicao — mostrar que existe outro caminho | "Foi quando descobrimos que..." |
| Proof | Solucao — provar que funciona | "Em 3 meses, Maria alcancou..." |
| Objection handling | Oferta — dissolver resistencia | "Joao tambem pensava que era caro, ate que..." |
| Urgency | Close — motivar acao imediata | "Pedro quase nao se inscreveu. Se tivesse esperado..." |
| Future pacing | CTA — visualizar resultado | "Imagine daqui 6 meses, olhando para tras..." |

### 4. Criar Índice de Acesso Rapido
**Por emocao:**
- Empatia: STORY-003, STORY-007, STORY-015
- Curiosidade: STORY-001, STORY-012, STORY-021
- Desejo: STORY-005, STORY-009, STORY-018
- Medo/urgencia: STORY-008, STORY-014, STORY-022

**Por objecao:**
- "E muito caro": STORY-006, STORY-011
- "Nao tenho tempo": STORY-004, STORY-019
- "Nao vai funcionar pra mim": STORY-002, STORY-013
- "Preciso pensar mais": STORY-010, STORY-020

**Por canal:**
- Email: STORY-001, STORY-003, STORY-005...
- Landing Page: STORY-002, STORY-007, STORY-009...
- Social Media: STORY-004, STORY-008, STORY-012...

### 5. Manutencao e Enriquecimento
**Rotina semanal:**
- Coletar 2-3 novas historias (customer success, feedback, interacoes)
- Documentar no formato story card
- Indexar por funcao, emocao, objecao, canal
- Revisar performance de historias usadas

**Rotina mensal:**
- Auditar story bank (historias desatualizadas, redundantes)
- Identificar gaps (objecoes sem historia, emocoes nao cobertas)
- Solicitar historias especificas para preencher gaps
- Compartilhar "story of the month" com todo o squad

**Metricas de uso:**
- Historias mais reutilizadas
- Historias com melhor performance por canal
- Gaps de cobertura (objecoes/emocoes sem historia)

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os writers do squad
    delivers: Story bank como recurso compartilhado
    format: Indice pesquisavel com story cards
  - to: squad-content
    delivers: Historias para content calendar
    format: Stories adaptadas para formatos de conteudo
  - to: squad-research
    delivers: Necessidade de novas customer stories
    format: Lista de gaps com brief de pesquisa
```

## Saida
- Story bank com min 30 historias documentadas
- Indice por categoria, emocao, objecao, canal
- Template de story card padrao
- Processo de manutencao definido

## Validacao
- [ ] Min 30 historias documentadas
- [ ] Min 5 categorias cobertas
- [ ] Cada historia com versao full, short e one-liner
- [ ] Indice por funcao persuasiva criado
- [ ] Indice por emocao criado
- [ ] Indice por objecao criado
- [ ] Template story card padronizado
- [ ] Processo de manutencao definido
- [ ] Gaps identificados com plano de preenchimento

---

*Task operada por: long-form-writer (Saga)*
