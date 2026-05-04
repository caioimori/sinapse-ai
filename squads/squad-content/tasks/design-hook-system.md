---
task: design-hook-system
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

# Task: Design Hook System

> Projetar sistema de hooks que capturam atencao nos primeiros segundos/palavras de qualquer conteudo.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Para qualquer peca que compete por atencao (social media, video, email subject) |
| **Input** | Espinha Dorsal, formato, plataforma, audiencia |
| **Output** | 3-5 opcoes de hook rankeadas por potencial de retencao |
| **Handoff** | → write-{format}-content |
| **Complexity** | simple |

---

## Fundamentacao

Atencao e a moeda mais escassa. O hook determina se o conteudo sera consumido ou ignorado. Instagram: 1.5s para parar scroll. YouTube: 5s para manter. Blog: titulo + primeira frase. Email: subject line. Cada formato tem sua propria "janela de hook". Referencia: Brendan Kane — Hook Point (1 bilhao de impressoes em 30 dias), Neville Medhora — hook formulas.

---

## Steps

### Step 1: Identificar Janela de Hook
Qual e a janela de atencao do formato? Reel: 1-3s. Carrossel: slide 1 (2s). Blog: titulo + 1a frase. Newsletter: subject line. LinkedIn: 2 primeiras linhas antes do "ver mais".

### Step 2: Selecionar Tipo de Hook
Tipos de hook: (1) Dado surpreendente ("97% dos posts nao geram nenhuma venda"), (2) Contradicao ("Pare de postar todo dia"), (3) Pergunta provocativa ("Voce sabe por que seu conteudo nao converte?"), (4) Historia pessoal ("Eu perdi 500 followers em uma semana. Aqui esta o que aprendi."), (5) Promessa de valor ("5 frameworks que triplicaram meu engajamento"), (6) Curiosity gap ("A maioria ignora isso, mas...").

### Step 3: Gerar 3-5 Opcoes
Para cada peca, gerar pelo menos 3 hooks diferentes usando tipos diferentes. Variedade permite teste e evita repeticao de formula.

### Step 4: Rankear por Potencial
Criterios de ranking: (1) Forca do curiosity gap (0-5), (2) Clareza da promessa (0-5), (3) Especificidade (0-5), (4) Alinhamento com a tese (0-5). Media >= 4 = hook forte.

### Step 5: Handoff

```yaml
handoff:
  artifact: "hook-options-{peca}.md"
  context: "Hooks: {N} opcoes geradas, top hook tipo '{tipo}', score {score}"
  next: "write-{formato}-content com hook selecionado"
```
