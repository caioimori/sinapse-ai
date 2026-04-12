---
task: write-reel-script
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

# Task: Write Reel Script

> Escrever roteiro de Reel/TikTok/Shorts otimizado para retencao e viralidade.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de video short-form (15-60s) |
| **Input** | Espinha Dorsal, hook selecionado, Template Contract, trend de audio (se aplicavel) |
| **Output** | Roteiro de Reel com fala, texto overlay, timing e indicacao de audio |
| **Handoff** | → adapt-for-instagram-reels (Morph), content-governor (Index) |
| **Complexity** | simple |

---

## Fundamentacao

Reels tem a maior distribuicao organica do Instagram. A chave e retencao: o algoritmo mede % de video assistido. Um Reel de 30s assistido ate o final (100% retention) performa 5x melhor que um de 60s assistido pela metade (50%). Mais curto ≠ pior; mais curto = mais provavel de ser assistido inteiro. Referencia: Brendan Kane — short-form content strategy, Later — Reels research.

---

## Steps

### Step 1: Definir Duracao Ideal
Baseado no conteudo: dica rapida (15s), tutorial simples (30s), explicacao (45s), mini-story (60s). Regra: a duracao mais curta que entrega o valor completo. Nunca esticar para "preencher tempo".

### Step 2: Escrever Hook Visual + Verbal
Primeiros 1.5 segundos. Visual: movimento, texto grande, expressao facial. Verbal: frase de impacto. O hook deve funcionar SEM audio (muitos assistem no mudo).

### Step 3: Escrever Roteiro por Segundo
Para cada bloco de 5s: fala (se houver), texto overlay (obrigatorio — audiencia no mudo), acao visual. Ritmo rapido: nao dar tempo de desistir.

### Step 4: Incluir Pattern Interrupt
A cada 8-10 segundos: mudanca visual, corte, zoom, novo angulo, transicao. Pattern interrupts resetam a atencao e aumentam retencao.

### Step 5: Escrever CTA de 3 Segundos
Ultimos 3 segundos: CTA micro. "Salva pra nao esquecer", "Segue pra mais", "Comenta qual e a sua". Nao desperdicar os ultimos segundos com logo ou tela preta.

### Step 6: Indicar Audio/Trend
Se usando audio trending: indicar qual audio, onde cortar, como sincronizar. Se audio original: indicar tom, ritmo, musica de fundo.

### Step 7: Handoff

```yaml
handoff:
  artifact: "reel-script-{peca}.md"
  context: "Reel: {duracao}s, hook '{tipo}', {N} pattern interrupts, audio '{tipo_audio}'"
  next: "adapt-for-instagram-reels (Morph) e content-governor (Index)"
```
