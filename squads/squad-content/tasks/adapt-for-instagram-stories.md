---
task: adapt-for-instagram-stories
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

# Task: Adapt for Instagram Stories

> Adaptar conteudo para formato efemero e interativo do Instagram Stories.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Trigger** | Conteudo que precisa formato Stories |
| **Input** | Conteudo original, Template Contract Stories, elementos interativos disponiveis |
| **Output** | Sequencia de Stories com layout, texto, stickers e interacoes |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | simple |

---

## Fundamentacao

Stories sao efemeros (24h) e interativos — dois diferenciais que definem a estrategia. A efemeridade cria urgencia; a interatividade cria dados. Stories nao sao "posts verticais" — sao conversas. Stickers de enquete, quiz e perguntas tem 20-30% de taxa de interacao. Referencia: Instagram — Stories creative best practices.

---

## Steps

### Step 1: Definir Sequencia
Quantos stories na sequencia? Regra: 3-7 stories por sequencia. Cada story e 1 tela, 1 ideia. Progressao: hook → conteudo → interacao → CTA.

### Step 2: Adaptar para Formato Vertical
Full screen (9:16). Texto grande e legivel. Safe zones: evitar texto nas bordas superior (nome do perfil) e inferior (barra de reply). Maximo 3 linhas de texto por story.

### Step 3: Incluir Elementos Interativos
Pelo menos 1 sticker interativo por sequencia: enquete, quiz, pergunta, slider, countdown. Interacao aumenta alcance (algoritmo) e gera dados sobre audiencia.

### Step 4: Adaptar Linguagem
Tom mais casual que feed. Stories permitem bastidores, erros, humor, personalidade. Menos produzido, mais autentico.

### Step 5: Handoff

```yaml
handoff:
  artifact: "instagram-stories-{peca}.md"
  context: "Stories: {N} telas, {I} elementos interativos, formato {layout}"
  next: "content-governor (Index) para validacao"
```
