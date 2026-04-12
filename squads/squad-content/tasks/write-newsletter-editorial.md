---
task: write-newsletter-editorial
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

# Task: Write Newsletter Editorial

> Escrever newsletter editorial que constroi relacionamento e autoridade com a base de assinantes.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Cadencia de newsletter (semanal/quinzenal) |
| **Input** | Tema da edicao, Espinha Dorsal, curadoria da semana, brand voice |
| **Output** | Newsletter completa com subject line, preview text, corpo e CTA |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | medium |

---

## Fundamentacao

Newsletter editorial nao e email marketing — e um produto de conteudo. A diferenca: email marketing vende, newsletter editorial ENTREGA valor. Newsletters com conteudo original tem open rate 2-3x maior que emails promocionais. A chave e consistencia de valor e personalidade de escrita. Referencia: Ann Handley — "newsletter as a tiny letter", Morning Brew — newsletter strategy, The Hustle — editorial newsletter framework.

---

## Steps

### Step 1: Escrever Subject Line
A subject line determina open rate. Regras: 40-50 caracteres, sem clickbait, com curiosity gap ou valor claro. Gerar 3 opcoes e selecionar a mais forte. Preview text complementa (nao repete).

### Step 2: Escrever Abertura
Primeiras 3-4 linhas: gancho pessoal/contextual. Newsletter editorial permite voz pessoal — a abertura e conversacional, como comecar um email para um amigo inteligente.

### Step 3: Escrever Conteudo Principal
Secao principal: insight, framework, analise ou opiniao original. Comprimento: 300-800 palavras para a secao principal. Profundidade suficiente para gerar valor, concisa o bastante para respeitar tempo.

### Step 4: Incluir Curadoria
Secao de curadoria: 3-5 links recomendados com micro-comentario (1-2 frases explicando por que vale ler). Curadoria demonstra que a marca consome bom conteudo e filtra para a audiencia.

### Step 5: Escrever CTA e Fechamento
CTA primario (acao desejada), CTA secundario (compartilhar newsletter). Fechamento com personalidade — assinatura pessoal, nao generica.

### Step 6: Handoff

```yaml
handoff:
  artifact: "newsletter-{edicao}.md"
  context: "Newsletter: subject '{subject}', {X} palavras, {N} links curados, CTA '{tipo}'"
  next: "content-governor (Index) para validacao de qualidade e brand consistency"
```
