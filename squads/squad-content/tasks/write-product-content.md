---
task: write-product-content
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

# Task: Write Product Content

> Escrever conteudo de produto/servico que converte sem parecer propaganda.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de conteudo FUNDO de funil, lancamentos, promocoes |
| **Input** | Dados do produto/servico, Espinha Dorsal, objecoes comuns, prova social |
| **Output** | Conteudo de produto com angulo editorial (nao promocional) |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | medium |

---

## Fundamentacao

Conteudo de produto e o mais dificil de fazer bem. A tentacao e listar features — mas features nao vendem, transformacoes vendem. O framework: Problema que o produto resolve → Como resolve (mecanismo unico) → Prova que funciona (case/dado) → Como comecar. O tom deve ser editorial, nao publicitario. Referencia: StoryBrand applied to product content, Marcus Sheridan — They Ask You Answer (responder objecoes publicamente).

---

## Steps

### Step 1: Identificar Problema Central
Qual e a DOR que o produto resolve? Nao a feature, a DOR. Feature: "CRM com automacao." Dor: "Perder vendas porque nao fez follow-up a tempo."

### Step 2: Apresentar Solucao como Mecanismo
Como o produto resolve? O mecanismo unico que diferencia. Nao "nossa ferramenta faz X" — mas "existe uma forma de Y que elimina o problema de Z".

### Step 3: Fornecer Prova Social
Dados, cases, depoimentos, numeros. Prova social reduz risco percebido. Quanto maior o investimento pedido, mais prova necessaria.

### Step 4: Abordar Objecoes
Quais sao as 3-5 objecoes mais comuns? Abordar cada uma proativamente: preco, complexidade, tempo de implementacao, "ja tentei algo parecido", "funciona no meu caso?".

### Step 5: CTA com Baixo Risco
Reduzir fricao: trial gratuito, consulta sem compromisso, demo personalizada, garantia. O CTA ideal tem alto valor + baixo risco percebido.

### Step 6: Handoff

```yaml
handoff:
  artifact: "product-content-{produto}.md"
  context: "Conteudo de produto: '{produto}', {O} objecoes abordadas, CTA '{tipo}'"
  next: "content-governor (Index) para validacao de compliance e brand consistency"
```
