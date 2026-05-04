---
task: write-video-script
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

# Task: Write Video Script

> Escrever roteiro completo de video com falas, indicacoes visuais e timing.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de video longform (> 60s) |
| **Input** | Estrutura de roteiro (structure-video-script), brand voice, Template Contract |
| **Output** | Roteiro completo com colunas: tempo, fala, visual, texto overlay |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | complex |

---

## Fundamentacao

Roteiro de video nao e texto que sera lido — e texto que sera FALADO. A escrita conversacional e radicalmente diferente da escrita formal. Frases curtas, ritmo variado, pausas estrategicas, linguagem cotidiana. Referencia: Pat Flynn — video scripting, Ali Abdaal — YouTube script structure.

---

## Steps

### Step 1: Escrever Hook Falado
Primeiros 5 segundos. Deve soar natural quando falado em voz alta. Testar: ler em voz alta soa como uma pessoa real falando? Se soa como texto, reescrever.

### Step 2: Escrever Corpo em Blocos
Cada bloco: (1) Fala principal (o que dizer), (2) Indicacao visual (o que mostrar), (3) Texto overlay (o que escrever na tela), (4) Duracao estimada. Blocos de 15-30s para manter ritmo.

### Step 3: Incluir Loops de Retencao
A cada 30-45s: inserir um micro-hook que mantem atencao. "Mas antes de chegar la...", "E o mais importante vem agora...", "Espera, porque tem um detalhe...".

### Step 4: Escrever Transicoes
Transicoes suaves entre blocos. Evitar: "Proximo ponto..." ou "Agora vamos falar de...". Preferir: conexoes logicas naturais, perguntas retoricas, revelacoes progressivas.

### Step 5: Escrever CTA Final
Ultimos 10-15 segundos: CTA direto mas natural. Para YouTube: "Se inscrevam e ativem o sininho" e cliche — preferir CTA contextual ligado ao valor entregue.

### Step 6: Marcar Indicacoes de Edicao
B-roll, cortes, zoom, graficos, lower thirds. O roteiro deve comunicar nao so o que dizer, mas como o video final deve parecer.

### Step 7: Handoff

```yaml
handoff:
  artifact: "video-script-{peca}.md"
  context: "Roteiro: {duracao} estimada, {N} blocos, {L} loops, indicacoes visuais completas"
  next: "content-governor (Index) para validacao de qualidade"
```
