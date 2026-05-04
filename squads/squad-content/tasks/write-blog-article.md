---
task: write-blog-article
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

# Task: Write Blog Article

> Escrever artigo de blog completo otimizado para SEO, autoridade e conversao.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Co-agents** | platform-specialist (Morph) para SEO |
| **Trigger** | Producao de conteudo blog/site |
| **Input** | Espinha Dorsal, brief de conteudo, keyword target, Template Contract |
| **Output** | Artigo completo com titulo, meta description, headers, corpo, CTA |
| **Handoff** | → adapt-for-blog-seo (Morph), content-governor (Index) |
| **Complexity** | complex |

---

## Fundamentacao

Blog e o formato de maior longevidade — um artigo bem escrito gera trafico por anos. A escrita de blog combina narrativa (manter atencao), estrutura (escaneabilidade), SEO (encontrabilidade) e conversao (gerar acao). Referencia: Andy Crestodina — Content Chemistry, Brian Dean — skyscraper technique, Ahrefs — blog writing framework.

---

## Steps

### Step 1: Escrever Titulo (H1)
Titulo otimizado: keyword principal + beneficio claro. Maximo 60 caracteres para SEO. Formatos eficazes: "Como [resultado] em [prazo]", "X [coisas] que [beneficio]", "[Guia/Framework] para [problema]".

### Step 2: Escrever Meta Description
150-160 caracteres. Resumo do valor + keyword + CTA implicito. Deve responder: "por que eu deveria clicar nesse resultado?"

### Step 3: Estruturar Headers (H2, H3)
Headers formam o esqueleto do artigo. Cada H2 e uma secao principal, H3 sao sub-secoes. Headers devem ser escaneáveis — alguem que so le os headers deve entender o artigo.

### Step 4: Escrever Introducao
Primeiros 100 palavras: gancho + contexto do problema + preview da solucao + por que ler ate o final. A introducao determina se o leitor continua ou volta ao Google.

### Step 5: Escrever Corpo por Secao
Cada secao H2: ponto principal + explicacao + exemplo/dado + transicao. Paragrafos curtos (3-4 linhas). Listas quando possivel. Imagens/graficos a cada 300-400 palavras.

### Step 6: Escrever Conclusao + CTA
Conclusao: sintese (nao resumo), insight final, CTA claro. CTAs de blog: newsletter signup, download de recurso, contato, proximo artigo recomendado.

### Step 7: Otimizar para SEO
Keyword density natural (1-2%), links internos (3-5), link externo para fonte autoritativa (1-2), alt text de imagens, URL slug com keyword.

### Step 8: Handoff

```yaml
handoff:
  artifact: "blog-article-{peca}.md"
  context: "Artigo: {X} palavras, keyword '{kw}', {N} secoes, {L} links internos"
  next: "adapt-for-blog-seo (Morph) para otimizacao final e content-governor (Index) para QA"
```
