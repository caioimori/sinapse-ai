---
task: write-linkedin-post
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

# Task: Write LinkedIn Post

> Escrever post LinkedIn otimizado para autoridade, engajamento e algoritmo da plataforma.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de conteudo LinkedIn |
| **Input** | Espinha Dorsal, formato (texto, carrossel, artigo), brand voice, Template Contract |
| **Output** | Post LinkedIn completo com hook, corpo, CTA |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | medium |

---

## Fundamentacao

LinkedIn tem o maior alcance organico entre plataformas sociais para B2B. O algoritmo favorece: primeiras 2 linhas fortes (antes do "ver mais"), dwell time (tempo lendo), comentarios com mais de 15 palavras, posts sem links externos (ou link no primeiro comentario). Formato nativo (texto puro) performa melhor que links. Referencia: Richard van der Blom — LinkedIn algorithm research, Justin Welsh — LinkedIn content strategy.

---

## Steps

### Step 1: Escrever Hook (2 Primeiras Linhas)
LinkedIn corta apos ~210 caracteres. O hook deve criar urgencia para clicar "ver mais". Formatos eficazes: "Eu cometi um erro de [area]. Aqui esta o que aprendi.", "Unpopular opinion:", dado contraintuitivo, declaracao de expertise.

### Step 2: Escrever Corpo
Formato escaneavel: linhas curtas, espacamento generoso, listas com simbolos (→, •, ✓). Progressao: problema → insight → framework/dica → exemplo. Tamanho ideal: 800-1300 caracteres para posts de texto.

### Step 3: Personalizar Tom
LinkedIn exige tom profissional mas humano. Equilibrar expertise com vulnerabilidade. Evitar: jargao corporativo vazio, humildade falsa ("humbled to announce"), clickbait excessivo.

### Step 4: Incluir CTA
CTAs que geram comentarios performam melhor: "Qual e a sua experiencia com X?", "Concorda ou discorda?", "Adicionaria algo a essa lista?". Evitar CTAs de link (reduz alcance).

### Step 5: Definir Estrategia de Link
Se ha link: colocar no primeiro comentario (melhor alcance) ou no post com formato "Recurso no primeiro comentario ↓". Incluir indicacao na entrega.

### Step 6: Handoff

```yaml
handoff:
  artifact: "linkedin-post-{peca}.md"
  context: "Post LinkedIn: {X} chars, hook tipo '{tipo}', CTA '{cta}', link '{posicao}'"
  next: "content-governor (Index) para validacao final"
```
