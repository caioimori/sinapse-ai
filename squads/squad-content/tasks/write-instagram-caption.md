---
task: write-instagram-caption
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

# Task: Write Instagram Caption

> Escrever caption de Instagram otimizada para engajamento, salvamento e algoritmo.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de post Instagram (feed, carrossel, reel) |
| **Input** | Conteudo da peca, Espinha Dorsal, brand voice, Template Contract |
| **Output** | Caption completa com hook, corpo, CTA e hashtags |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | simple |

---

## Fundamentacao

A caption do Instagram e subestimada. Instagram mostra as 2 primeiras linhas antes do "mais..." — essas linhas determinam se o usuario expande. Caption longa (1000-2000 chars) gera mais saves e tempo na publicacao, sinalizando qualidade para o algoritmo. Referencia: Later — Instagram caption research, Hootsuite — caption best practices.

---

## Steps

### Step 1: Escrever Hook (Primeiras 2 Linhas)
As 2 primeiras linhas aparecem antes do corte. Devem ser irresistiveis. Tecnicas: pergunta, dado, afirmacao forte, "Voce sabia que...". Sem emojis excessivos no hook.

### Step 2: Escrever Corpo
Expandir o valor do post. Pode ser: contexto adicional, historia breve, lista de pontos, reflexao pessoal. Usar paragrafos curtos (2-3 linhas) e espacamento para legibilidade.

### Step 3: Incluir CTA
CTA claro no final: salvar, compartilhar, comentar, visitar link. Ser especifico: nao "comente abaixo" — mas "conta nos comentarios qual dessas dicas voce ja usa".

### Step 4: Adicionar Hashtags
Estrategia de hashtags conforme Template Contract: mix de alta (>1M posts), media (100K-1M) e nicho (<100K). Maximo definido no TC. Hashtags relevantes ao tema, nao genericas.

### Step 5: Validar Template Contract
Caracteres totais, numero de hashtags, formato de CTA — tudo dentro dos limites do Template Contract.

### Step 6: Handoff

```yaml
handoff:
  artifact: "instagram-caption-{peca}.md"
  context: "Caption escrita: {X} chars, CTA '{tipo}', {N} hashtags"
  next: "content-governor (Index) para validacao final"
```
