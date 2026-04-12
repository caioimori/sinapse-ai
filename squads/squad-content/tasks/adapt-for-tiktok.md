---
task: adapt-for-tiktok
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

# Task: Adapt for TikTok

> Adaptar conteudo de video para cultura, algoritmo e formato do TikTok.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Trigger** | Conteudo de video que precisa ir para TikTok |
| **Input** | Roteiro original, Template Contract TikTok, trends atuais |
| **Output** | Roteiro adaptado com formato, audio, hashtags e caption TikTok |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | simple |

---

## Fundamentacao

TikTok tem cultura propria — conteudo que funciona no Instagram Reels pode falhar no TikTok e vice-versa. TikTok favorece: autenticidade (producao "crua"), participacao em trends (duets, stitches, sons), e discovery (100% do feed e algoritmico, nao social). O algoritmo e o mais democratico: follower count importa menos que qualidade do conteudo. Referencia: TikTok — creator learning center, Brendan Kane — TikTok content strategy.

---

## Steps

### Step 1: Validar Tom para TikTok
TikTok rejeita conteudo que "parece anuncio". Tom deve ser casual, direto, quase como conversa com amigo. Remover formalidades, adicionar personalidade.

### Step 2: Integrar Trends
Verificar trends atuais: sons trending, formatos populares, hashtag challenges. Integrar organicamente quando alinhado com a marca. Nao forcar trends desconectadas.

### Step 3: Adaptar para Discovery
TikTok e discovery-first. Otimizar para quem NAO segue a marca: contexto auto-contido, valor imediato, sem referencia a conteudo anterior. Cada video e a primeira impressao.

### Step 4: Otimizar Texto e Caption
Texto overlay grande e legivel. Caption curta + hashtags de nicho (nao genericas). Hashtags TikTok funcionam diferente: mix de trending + nicho + branded.

### Step 5: Indicar Formato Nativo
Stitches, duets, replies — formatos nativos que o algoritmo favorece. Quando possivel, usar formatos nativos em vez de upload simples.

### Step 6: Handoff

```yaml
handoff:
  artifact: "tiktok-adaptation-{peca}.md"
  context: "Adaptado para TikTok: trend '{trend}', audio '{audio}', formato '{formato_nativo}'"
  next: "content-governor (Index) para validacao"
```
