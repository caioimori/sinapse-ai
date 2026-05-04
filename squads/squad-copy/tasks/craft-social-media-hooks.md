---
task: craft-social-media-hooks
responsavel: "@headline-specialist"
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

# Task: Craft Social Media Hooks

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** copy brief, brand voice
- **Feeds:** conversion-writer (Spark), content-intelligence

## Objetivo
Criar hooks para social media — a primeira linha que determina se alguem para o scroll. Platform-specific, attention-first.

## Entrada
- Objetivo do post (awareness, engagement, conversion, educacao)
- Plataforma (LinkedIn, Instagram, Twitter/X, TikTok, Facebook)
- Audiencia e tom da marca

## Passos

### 1. Hooks por Plataforma

**LinkedIn (Professional, B2B):**
- "I spent [X time] doing [Y]. Here's what I learned."
- "Unpopular opinion: [contrarian view]"
- "[Achievement]. But here's what nobody tells you."
- "Stop doing [common practice]. Start doing [better way]."

**Instagram (Visual, Lifestyle):**
- "[Resultado] em [tempo] — Salva pra depois"
- "POV: [situacao relatable]"
- "Antes vs Depois de [acao]"
- "[Numero] coisas que eu queria saber antes de [acao]"

**Twitter/X (Concise, Sharp):**
- "Hot take: [contrarian view in <280 chars]"
- "Thread 🧵: [topico + promise]"
- "[Resultado] using only [metodo]. Here's how:"
- "The difference between [A] and [B]:"

**TikTok/Reels (Pattern Interrupt, Authentic):**
- "Wait for it..." (visual-driven)
- "You're doing [X] wrong. Here's why."
- "I tested [X] for [time]. Results:"
- "The secret [authority] don't want you to know"

### 2. Pattern Interrupt Techniques
- Abrir com afirmacao BOLD (para gerar concordancia ou discordancia)
- Usar formato inesperado (pergunta onde esperam afirmacao)
- Criar tension loop (setup que so resolve no final)
- First-person confession (vulnerability = engagement)

### 3. Gerar 10+ Hooks por Plataforma
- Adaptar tom e formato para cada plataforma
- Respeitar character limits e formatos nativos
- Incluir engagement triggers (pergunta, poll, save, share)

### 4. CTA Integration
- Cada hook deve naturalmente levar a um CTA
- Soft CTAs para awareness: "Comenta se concorda"
- Hard CTAs para conversao: "Link na bio"
- Engagement CTAs: "Salva pra depois"

## Saida
- 10+ hooks por plataforma principal
- Pattern interrupt techniques documentadas
- CTA integration por formato
- Best practices por plataforma

## Validacao
- [ ] Hooks platform-specific (nao genéricos)
- [ ] Pattern interrupt presente
- [ ] Character limits respeitados
- [ ] CTA integrado naturalmente
- [ ] Alinhado com brand voice

---

*Task operada por: headline-specialist (Hook)*
