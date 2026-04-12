---
task: evaluate-eeat-compliance
responsavel: "@content-analyst"
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

# Task: Evaluate E-E-A-T Compliance

> Avaliar conteudo contra criterios E-E-A-T do Google (Experience, Expertise, Authoritativeness, Trustworthiness).

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-analyst (Lens) |
| **Trigger** | Auditoria de blog/site ou estrategia de SEO |
| **Input** | Conteudo publicado (especialmente blog), perfil de autores, backlink profile |
| **Output** | Score E-E-A-T com recomendacoes de melhoria |
| **Handoff** | → content-engineer (Arc), adapt-for-blog-seo (Morph) |
| **Complexity** | medium |

---

## Fundamentacao

E-E-A-T e o framework que o Google usa para avaliar qualidade de conteudo. Conteudo com alto E-E-A-T rankeia melhor e resiste a atualizacoes de algoritmo. A avaliacao sistematica previne penalizacoes e constroi autoridade duradoura. Referencia: Google Search Quality Rater Guidelines, Lily Ray — E-E-A-T analysis, Marie Haynes — E-E-A-T research.

---

## Steps

### Step 1: Avaliar Experience (Experiencia)
O autor tem experiencia real com o tema? Evidencias: exemplos pessoais, screenshots, dados proprios, depoimento de primeira mao. Score 1-5.

### Step 2: Avaliar Expertise (Especialização)
O autor e qualificado para falar sobre o tema? Evidencias: credenciais, publicacoes anteriores, reconhecimento no setor. Score 1-5.

### Step 3: Avaliar Authoritativeness (Autoridade)
O site/marca e reconhecido como autoridade no tema? Evidencias: backlinks de sites autoritativos, mentions em midia, citacoes por outros especialistas. Score 1-5.

### Step 4: Avaliar Trustworthiness (Confiabilidade)
O conteudo e confiavel? Evidencias: fontes citadas, dados verificaveis, transparencia sobre metodologia, politica de correcao, HTTPS, about page completa. Score 1-5.

### Step 5: Gerar Recomendacoes
Para cada dimensao abaixo de 4: acoes especificas. "Expertise baixa → adicionar bio detalhada do autor", "Trust baixo → citar fontes primarias em vez de secundarias".

### Step 6: Handoff

```yaml
handoff:
  artifact: "eeat-evaluation-{client}-{date}.md"
  context: "E-E-A-T: E:{e}/5 E:{ex}/5 A:{a}/5 T:{t}/5, media {media}, {N} recomendacoes"
  next: "content-engineer (Arc) para melhorar conteudo, adapt-for-blog-seo (Morph) para otimizacoes"
```
