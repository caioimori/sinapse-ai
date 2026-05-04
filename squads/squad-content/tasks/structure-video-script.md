---
task: structure-video-script
responsavel: "@content-engineer"
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

# Task: Structure Video Script

> Projetar a estrutura de roteiro para conteudo em video (Reels, TikTok, YouTube Shorts, longform).

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Quando formato = video (qualquer duracao) |
| **Input** | Espinha Dorsal, duracao-alvo, plataforma, Template Contract |
| **Output** | Estrutura de roteiro com blocos de tempo, falas e indicacoes visuais |
| **Handoff** | → write-video-script ou write-reel-script |
| **Complexity** | medium |

---

## Fundamentacao

Video sem roteiro = improviso que parece improviso. A estrutura garante que cada segundo conta. Para short-form (< 60s), a formula e: Hook (0-3s) + Contexto (3-8s) + Valor (8-40s) + CTA (40-60s). Para longform, a estrutura expande com loops de retencao. Referencia: Mr. Beast — video structure philosophy, Brendan Kane — Hook Point.

---

## Steps

### Step 1: Definir Formato e Duracao
Short-form (15s, 30s, 60s) ou longform (3-10min)? Cada duracao tem estrutura diferente. Consultar Template Contract da plataforma.

### Step 2: Projetar Hook (Primeiros 3 Segundos)
O hook de video e visual + verbal. Opcoes: movimento subito, texto grande, pergunta direta, afirmacao chocante, preview do resultado. O espectador decide em 1.5s se continua.

### Step 3: Mapear Blocos de Tempo
Dividir o video em blocos cronometrados: Hook (0-3s), Setup (3-8s), Desenvolvimento (8-X), Prova/Exemplo (X-Y), CTA (ultimos 3-5s). Cada bloco com: fala principal, indicacao visual, texto overlay.

### Step 4: Criar Loops de Retencao
Para videos > 30s: inserir "open loops" que mantem a audiencia. Tecnicas: "mas antes disso...", "e voce vai ver por que no final", preview rapido do climax. Cada loop adiciona ~10-15% de retencao.

### Step 5: Definir Indicacoes Visuais
Para cada bloco: o que aparece na tela? Cortes, transicoes, texto overlay, b-roll, graficos. Video e 50% audio + 50% visual. Roteiros que ignoram o visual sao roteiros de podcast.

### Step 6: Calibrar para Plataforma
Reels (vertical, autoplay, sem som inicialmente), TikTok (trends, sons, stitches), YouTube Shorts (SEO no titulo, thumbnails), YouTube longform (chapters, end screens).

### Step 7: Handoff

```yaml
handoff:
  artifact: "video-structure-{peca}.md"
  context: "Roteiro: {duracao}s, {N} blocos, {L} loops de retencao, plataforma {plataforma}"
  next: "write-video-script ou write-reel-script para escrita final do roteiro"
```
