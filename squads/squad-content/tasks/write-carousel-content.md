---
task: write-carousel-content
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

# Task: Write Carousel Content

> Escrever conteudo completo de carrossel com copy por slide seguindo Template Contract.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Apos estruturacao do carrossel (structure-carousel-progression) |
| **Input** | Estrutura de slides, Espinha Dorsal, Template Contract, brand voice |
| **Output** | Copy final por slide com texto principal, texto de suporte e CTA |
| **Handoff** | → platform-specialist (Morph) para adaptacao ou content-governor (Index) para validacao |
| **Complexity** | medium |

---

## Fundamentacao

Carrossel e o formato com maior save rate e share rate no Instagram e LinkedIn. A escrita de carrossel e diferente de qualquer outro formato: cada slide e uma micro-peca autonoma que deve funcionar sozinha E em sequencia. Restricoes de espaco forcam clareza — cada palavra deve merecer estar ali. Referencia: Justin Welsh — carousel copywriting, Chris Do — visual content writing.

---

## Steps

### Step 1: Escrever Slide 1 (Hook)
Aplicar hook selecionado (de design-hook-system). Maximo de caracteres conforme Template Contract. Testar: a pessoa pararia de rolar? Se duvida, reescrever.

### Step 2: Escrever Slides de Conteudo
Para cada slide intermediario: texto principal (1 ideia, maximo X caracteres), texto de suporte (complemento visual), indicacao de elemento grafico. Manter linguagem do brand voice.

### Step 3: Escrever Slide de CTA
Slide final: resumo de valor + CTA claro. Variantes por objetivo: "Salve para consultar depois" (save), "Marque alguem que precisa ver isso" (share), "Comente sua experiencia" (engagement), "Link na bio" (conversao).

### Step 4: Escrever Caption
Caption complementa, nao repete. Estrutura: gancho de abertura + contexto adicional + CTA secundario + hashtags. Respeitar limite de caracteres do Template Contract.

### Step 5: Validar Template Contract
Checklist: caracteres por slide dentro do limite? Numero de slides conforme spec? CTA no formato correto? Caption dentro do limite? Hashtags dentro da quantidade definida?

### Step 6: Handoff

```yaml
handoff:
  artifact: "carousel-copy-{peca}.md"
  context: "Carrossel escrito: {N} slides, caption {X} chars, CTA tipo '{cta}', TC validado"
  next: "content-governor (Index) para validacao de qualidade ou platform-specialist (Morph) se multiplas plataformas"
```
