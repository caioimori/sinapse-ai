---
task: adapt-for-instagram-feed
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

# Task: Adapt for Instagram Feed

> Adaptar conteudo para formato e especificacoes do Instagram Feed.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Trigger** | Conteudo produzido que precisa ir para Instagram Feed |
| **Input** | Conteudo original (Arc), Template Contract do Instagram Feed |
| **Output** | Conteudo adaptado com todas as especificacoes da plataforma |
| **Handoff** | → content-governor (Index) para validacao final |
| **Complexity** | simple |

---

## Fundamentacao

Instagram Feed tem regras proprias: formato quadrado (1:1) ou vertical (4:5), caption com limite visual de 2 linhas antes do corte, hashtags estrategicas, e um algoritmo que prioriza saves e shares sobre likes. Adaptar nao e redimensionar — e repensar como o conteudo funciona nessa plataforma. Referencia: Later — Instagram Feed best practices, Adam Mosseri — Instagram algorithm insights.

---

## Steps

### Step 1: Verificar Template Contract
Consultar TC do Instagram Feed: dimensoes, caracteres de caption, limite de hashtags, formato de CTA. Todos os parametros sao inegociaveis.

### Step 2: Adaptar Formato Visual
Conteudo deve ser otimizado para 1:1 ou 4:5. Texto em imagem: fonte legivel em mobile, contraste adequado, maximo 20% de texto na imagem.

### Step 3: Adaptar Caption
Cortar/expandir caption para formato Instagram: hook nas 2 primeiras linhas, corpo com paragrafos curtos, CTA especifico para a plataforma, hashtags conforme TC.

### Step 4: Otimizar para Algoritmo
Save triggers (conteudo de referencia), Share triggers (conteudo que gera identificacao), Comment triggers (perguntas abertas). Incluir pelo menos 1 trigger por post.

### Step 5: Handoff

```yaml
handoff:
  artifact: "instagram-feed-{peca}.md"
  context: "Adaptado para IG Feed: caption {X} chars, {N} hashtags, TC validado"
  next: "content-governor (Index) para validacao final"
```
