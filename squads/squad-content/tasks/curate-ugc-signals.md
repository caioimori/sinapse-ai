---
task: curate-ugc-signals
responsavel: "@signal-intelligence"
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

# Task: Curate UGC Signals

> Monitorar e curar sinais de User-Generated Content para identificar oportunidades de amplificacao e co-criacao.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | content-governor (Index) |
| **Trigger** | Diario, integrado ao scan de sinais |
| **Input** | Hashtags da marca, mentions, reviews, tags, reposts |
| **Output** | UGC curado com classificacao de qualidade e potencial de amplificacao |
| **Handoff** | → content-orqx (Nexus) para decisao de amplificacao |
| **Complexity** | medium |

---

## Fundamentacao

UGC e a forma mais poderosa de prova social — conteudo criado por usuarios tem 4.5x mais taxa de conversao que conteudo de marca (Stackla). Mas UGC bruto precisa ser curado: nem todo conteudo gerado por usuario e amplificavel. A curacao separa sinal de ruido e identifica pecas que merecem destaque, repost ou co-criacao. Referencia: Jay Baer — Youtility, conteudo que serve primeiro.

---

## Steps

### Step 1: Varrer Canais de UGC
Monitorar: hashtags da marca, mentions diretas, tags em posts, reviews em plataformas, comentarios relevantes, reposts. Para cada canal: volume, sentimento, qualidade visual/textual.

### Step 2: Classificar Qualidade do UGC
Para cada peca de UGC: (1) Alinhamento com marca (on-brand?), (2) Qualidade visual/textual, (3) Autenticidade do criador, (4) Potencial de engajamento, (5) Adequacao legal (pode ser repostado?). Score 1-5 em cada criterio.

### Step 3: Categorizar por Tipo de Uso
- REPOST: UGC pronto para repostar (score >= 4, autorizacao implicita/explicita)
- CO-CREATE: UGC que inspira conteudo proprio (angulo interessante, precisa adaptacao)
- RESPOND: UGC que merece resposta/engajamento da marca (perguntas, reviews, feedback)
- ARCHIVE: UGC de referencia (bom, mas sem acao imediata)

### Step 4: Verificar Autorizacao
Para UGC classificado como REPOST: verificar se a plataforma/termos permitem repostagem. Flag se necessario solicitar autorizacao ao criador.

### Step 5: Compilar Briefing UGC
Resumo semanal: melhores UGCs por categoria, tendencias de criacao da audiencia, sentimento geral, oportunidades de co-criacao, creators que merecem relacionamento.

### Step 6: Handoff

```yaml
handoff:
  artifact: "ugc-curation-{date}.md"
  context: "UGC curado: {N} pecas, {R} para repost, {C} para co-criacao, sentimento {positivo/neutro/negativo}"
  next: "content-orqx (Nexus) para decisao de amplificacao e flag-content-for-amplification"
```
