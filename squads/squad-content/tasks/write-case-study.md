---
task: write-case-study
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

# Task: Write Case Study

> Escrever case study que demonstra resultado real com narrativa envolvente.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-engineer (Arc) |
| **Trigger** | Producao de conteudo FUNDO de funil, prova social |
| **Input** | Dados do case, resultados, depoimento do cliente, Espinha Dorsal |
| **Output** | Case study completo em formato narrativo com dados e CTA |
| **Handoff** | → content-governor (Index) para validacao |
| **Complexity** | complex |

---

## Fundamentacao

Case studies sao o conteudo mais eficaz para conversao — 73% dos compradores B2B consultam cases antes de decidir (DemandGen Report). Mas a maioria dos cases e tediosa: "Cliente X tinha problema Y, usou nosso produto, resolveu." A diferenca e transformar o case em HISTORIA com heroi (cliente), vilao (problema), guia (marca) e transformacao (resultado). Referencia: Donald Miller — StoryBrand applied to cases, Andy Crestodina — case study storytelling.

---

## Steps

### Step 1: Definir o Heroi (Cliente)
Contextualizar o cliente: setor, tamanho, desafio especifico. O leitor deve se identificar: "Isso sou eu!". Quanto mais especifico o heroi, mais universal a ressonancia.

### Step 2: Descrever o Problema (Antes)
Pintar o cenário ANTES: numeros negativos, frustracao, tentativas que falharam. O "antes" cria contraste com o "depois". Sem dor convincente, o resultado nao impressiona.

### Step 3: Narrar a Jornada (Processo)
O que aconteceu? Quais passos foram tomados? Quais obstaculos surgiram? A jornada humaniza o case — nao foi magica, foi trabalho estruturado.

### Step 4: Apresentar Resultados (Depois)
Numeros concretos: % de melhoria, receita gerada, tempo economizado, metricas antes/depois. Sempre comparativo. Resultados vagos ("melhorou muito") destroem credibilidade.

### Step 5: Incluir Depoimento
Citacao direta do cliente. Deve ser especifica, nao generica. Bom: "Triplicamos nosso engajamento em 60 dias e geramos 45 leads qualificados." Ruim: "Excelente trabalho, recomendo."

### Step 6: CTA Contextual
CTA ligado ao resultado: "Quer resultados parecidos? Vamos conversar." O CTA deve parecer consequencia natural da historia, nao interrupcao comercial.

### Step 7: Handoff

```yaml
handoff:
  artifact: "case-study-{cliente}.md"
  context: "Case study: '{cliente}', resultado principal '{resultado}', formato {formato}"
  next: "content-governor (Index) para validacao e platform-specialist (Morph) para adaptacao multi-formato"
```
