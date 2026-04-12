---
task: detect-trending-topics
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

# Task: Detect Trending Topics

> Identificar topicos em ascensao no nicho do cliente antes da saturacao.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | signal-intelligence (Radar) |
| **Co-agents** | — |
| **Trigger** | Diario ou sob demanda |
| **Input** | Fontes de trending, setor do cliente, pilares editoriais |
| **Output** | Lista de trending topics com analise de potencial |
| **Handoff** | → classify-signal-temperature, map-signal-to-pillar |
| **Complexity** | medium |

---

## Fundamentacao

Detectar trending ANTES de saturar e a janela de ouro. Publicar sobre um topic quando ja esta saturado gera conteudo generico sem diferenciacao. Deteccao precoce permite angulo original e first-mover advantage. Referencia: Valona Intelligence — early warning signals 3-6 meses antes do mainstream.

---

## Steps

### Step 1: Monitorar Indicadores de Trending
Verificar: Google Trends (crescimento de busca), Twitter/X (trending topics), TikTok (sounds em ascensao), LinkedIn (topicos emergentes), Reddit (threads virais).

### Step 2: Validar Trending Real vs Bolha
Criterios: volume crescente (nao spike unico), diversidade de fontes (nao apenas 1 plataforma), relevancia para o setor, duração provavel (flash trend vs sustainable trend).

### Step 3: Avaliar Potencial de Conteudo
Para cada trending validado: qual angulo UNICO o cliente pode trazer? Se nao ha angulo diferenciado, descartar.

### Step 4: Calcular SPV Preliminar
Aplicar Score de Potencial Viral: Share trigger? Save trigger? Tensao cognitiva? Especificidade? Timing?

### Step 5: Handoff

```yaml
handoff:
  artifact: "trending-topics-{date}.md"
  context: "{N} trending topics identificados com SPV preliminar"
  next: "classify-signal-temperature → map-signal-to-pillar"
```
