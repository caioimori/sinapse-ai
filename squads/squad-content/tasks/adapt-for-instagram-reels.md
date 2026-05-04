---
task: adapt-for-instagram-reels
responsavel: "@platform-specialist"
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

# Task: Adapt for Instagram Reels

> Adaptar conteudo de video para especificacoes e algoritmo do Instagram Reels.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Trigger** | Roteiro de video/reel produzido (Arc) |
| **Input** | Roteiro original, Template Contract Reels, trends de audio atuais |
| **Output** | Roteiro adaptado com specs Reels, audio, hashtags, caption |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | simple |

---

## Fundamentacao

Reels e o formato de maior distribuicao organica do Instagram. O algoritmo prioriza: retention rate (% assistido), replays, shares para DMs, e uso de audio trending. Um Reel de 15s com 90% retention performa melhor que um de 90s com 30% retention. Referencia: Adam Mosseri — Reels ranking signals, Later — Reels research 2024.

---

## Steps

### Step 1: Validar Specs Tecnicas
Formato 9:16, resolucao 1080x1920, duracao (15/30/60/90s), safe zones para texto. Verificar Template Contract.

### Step 2: Otimizar para Retencao
Hook nos primeiros 1.5s (visual + texto). Pattern interrupts a cada 5-8s. Nao dar tempo de scroll — cada segundo deve "segurar".

### Step 3: Selecionar Audio
Audio trending atual (aumenta distribuicao) ou audio original (construi brand). Se audio trending: sincronizar roteiro com beat/drops. Se original: garantir que funciona no mudo (texto overlay).

### Step 4: Adaptar Texto Overlay
Todo Reel deve funcionar sem audio. Texto overlay sintetizado: frases curtas, fonte legivel, contraste com fundo, timing sincronizado com fala.

### Step 5: Escrever Caption e Hashtags
Caption curta (50-150 chars) + hashtags estrategicas conforme TC. Caption complementa, nao repete o Reel.

### Step 6: Handoff

```yaml
handoff:
  artifact: "reels-adaptation-{peca}.md"
  context: "Reel adaptado: {duracao}s, audio '{tipo}', retention hooks {N}"
  next: "content-governor (Index) para validacao final"
```
