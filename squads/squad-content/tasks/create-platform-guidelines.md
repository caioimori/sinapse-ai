---
task: create-platform-guidelines
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

# Task: Create Platform Guidelines

> Criar guias de plataforma que documentam specs, boas praticas e restricoes por canal.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Trigger** | Setup de novo projeto ou nova plataforma adicionada |
| **Input** | Plataformas ativas, brand guidelines, dados de performance |
| **Output** | Guia de plataforma com specs, formatos, tom, e restricoes |
| **Handoff** | → content-engineer (Arc) e content-governor (Index) como referencia |
| **Complexity** | medium |

---

## Fundamentacao

Cada plataforma e um ecossistema com regras proprias. Postar o mesmo conteudo em todas as plataformas e o erro mais comum em content marketing. O guia de plataforma documenta como a marca se comporta em cada canal, servindo como referencia para toda a equipe. Referencia: Sprout Social — platform-specific content strategy.

---

## Steps

### Step 1: Documentar Specs Tecnicas
Para cada plataforma: dimensoes de imagem/video, limites de caracteres, formatos suportados, limites de hashtags, duracao de video. Manter atualizado (plataformas mudam specs frequentemente).

### Step 2: Definir Tom por Plataforma
Instagram: visual, aspiracional. LinkedIn: profissional-humano. TikTok: casual, autenticidade. Twitter/X: direto, opiniativo. Blog: aprofundado, educativo. O tom base da marca adapta por plataforma.

### Step 3: Listar Formatos por Plataforma
Quais formatos a marca usa em cada plataforma? Instagram: feed, stories, reels, carrossel. LinkedIn: texto, carrossel, artigo, newsletter. Definir quais formatos sao prioritarios.

### Step 4: Documentar Restricoes
O que a marca NAO faz em cada plataforma: nao usa memes no LinkedIn, nao faz dancas no TikTok, nao posta sem imagem no Instagram. Restricoes previnem derrapagens.

### Step 5: Definir Metricas de Sucesso
Metricas prioritarias por plataforma: Instagram (saves, shares), LinkedIn (comments, dwell time), Blog (time on page, organic traffic), TikTok (completion rate, shares).

### Step 6: Handoff

```yaml
handoff:
  artifact: "platform-guidelines-{client}.md"
  context: "Guidelines criados: {N} plataformas, specs + tom + formatos + restricoes documentados"
  next: "Referencia permanente para Arc e Index"
```
