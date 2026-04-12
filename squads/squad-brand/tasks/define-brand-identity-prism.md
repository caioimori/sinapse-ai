---
task: define-brand-identity-prism
responsavel: "@brand-strategist"
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

# Task: Define Brand Identity Prism (Kapferer)

> Mapear as 6 facetas do Brand Identity Prism para criar identidade tridimensional.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-strategist (Athena) |
| **Trigger** | Após posicionamento e arquétipo definidos, antes do visual |
| **Input** | Posicionamento, arquétipo, manifesto, personas |
| **Output** | `brand-identity-prism.md` |
| **Handoff** | → brand-identity-designer (Iris) para tradução visual |
| **Framework** | Jean-Noël Kapferer — "The New Strategic Brand Management" |

---

## Fundamentação

O Brand Identity Prism de Kapferer é um dos frameworks mais usados por agências tier-1 mundialmente (Landor, Interbrand, Wolff Olins). Define a marca em 6 facetas organizadas em 3 eixos:

```
         EMISSOR (construído pela marca)
    ┌──────────────┬──────────────┐
    │   PHYSIQUE   │ PERSONALITY  │
    │  (corpo)     │ (caráter)    │
    ├──────────────┼──────────────┤
    │   CULTURE    │ RELATIONSHIP │
    │  (valores)   │ (vínculo)    │
    ├──────────────┼──────────────┤
    │  REFLECTION  │  SELF-IMAGE  │
    │  (espelho)   │ (aspiração)  │
    └──────────────┴──────────────┘
         RECEPTOR (percebido pelo consumidor)

Eixo vertical: Externalização ↔ Internalização
Eixo horizontal: Emissor ↔ Receptor
Centro: Culture + Relationship (ponte entre marca e consumidor)
```

---

## Steps

### Step 1: Definir PHYSIQUE (Corpo da Marca)
O que a marca é fisicamente — seus elementos tangíveis e reconhecíveis.

```yaml
elicit: true
format: structured
```

| Pergunta | Resposta |
|----------|---------|
| Qual o elemento visual mais reconhecível? | |
| Qual produto/serviço "encarna" a marca? | |
| Se pudesse segurar a marca na mão, o que seria? | |
| Quais são os traços físicos que a identificam? (cor, forma, textura) | |
| O que o consumidor VÊ primeiro? | |

**Output:** Lista de 5-7 atributos físicos/tangíveis da marca.

**Exemplos de referência:**
- Coca-Cola: garrafa contour, vermelho, tipografia cursiva
- Apple: alumínio, minimalismo, ícone da maçã
- Chanel: N°5, tweed, preto e branco, double-C

### Step 2: Definir PERSONALITY (Caráter)
Se a marca fosse uma pessoa, como seria. É a dimensão que dá à marca um caráter humano.

| Pergunta | Resposta |
|----------|---------|
| Se a marca fosse uma pessoa, que idade teria? | |
| Como se vestiria? | |
| Como falaria? (tom, vocabulário, ritmo) | |
| 5 adjetivos que a descrevem como pessoa | |
| Que celebridade/personagem a representaria? | |
| O que essa pessoa faria num sábado à noite? | |

**Output:** Perfil de personalidade com 5 traits dominantes.

**Exemplos:**
- Innocent Drinks: jovem, otimista, ingênua, divertida, honesta
- Nike: determinada, competitiva, inspiradora, direta, ousada
- Aesop: intelectual, refinada, minimalista, curiosa, discreta

### Step 3: Definir CULTURE (Valores e Crenças)
O sistema de valores que inspira e alimenta a marca. É o DNA ideológico — de onde ela vem, no que acredita.

| Pergunta | Resposta |
|----------|---------|
| Qual país/cultura de origem influencia a marca? | |
| Qual ideologia ou filosofia a marca carrega? | |
| Qual movimento cultural a marca representa? | |
| Se fosse uma religião, em que acreditaria? | |
| Qual é a crença mais profunda da marca? | |

**Output:** 3-5 valores culturais + origem ideológica.

**Exemplos:**
- Mercedes-Benz: cultura = engenharia alemã, perfeição, Ordnung
- Apple: cultura = contracultura californiana, "think different", artesanato digital
- Muji: cultura = filosofia zen japonesa, essencialismo, anti-marca

### Step 4: Definir RELATIONSHIP (Tipo de Vínculo)
Que tipo de relação a marca estabelece com seu consumidor. Não é o que a marca DIZ, mas como ela SE RELACIONA.

| Pergunta | Resposta |
|----------|---------|
| A marca é um mentor, amigo, cúmplice, ou líder? | |
| Como a marca faz o consumidor SE SENTIR na interação? | |
| A relação é de igualdade ou admiração? | |
| A marca é acessível ou exclusiva na relação? | |
| Se fosse uma relação humana, qual seria? (professor-aluno, amigo-amigo, guru-discípulo) | |

**Output:** Definição do tipo de relação + 3 exemplos de como se manifesta.

**Exemplos:**
- Nike: coach que empurra você além do limite ("Just Do It")
- Apple: parceiro criativo que te empodera
- Louis Vuitton: curador exclusivo que seleciona o melhor para você

### Step 5: Definir REFLECTION (Espelho do Consumidor)
Como o consumidor IDEAL é percebido ao usar a marca. Não é o target real — é o target aspiracional. É o "tipo de pessoa" que a marca reflete externamente.

| Pergunta | Resposta |
|----------|---------|
| Que tipo de pessoa o mundo IMAGINA usando esta marca? | |
| Qual a imagem idealizada do usuário? | |
| Se filmasse um comercial, quem seria o protagonista? | |
| O que os outros pensam quando veem alguém usando esta marca? | |
| Qual o lifestyle associado? | |

**Output:** Perfil do consumidor refletido (aspiracional, não real).

**Exemplos:**
- Lacoste: esportista elegante, classe média-alta, refinado
- Red Bull: atleta extremo, aventureiro, sem limites
- Moleskine: intelectual criativo, viajante, pensador

### Step 6: Definir SELF-IMAGE (Autoimagem do Consumidor)
Como o consumidor se VÊ INTERNAMENTE ao usar a marca. É o espelho interior — a conversa que o consumidor tem consigo mesmo quando escolhe a marca.

| Pergunta | Resposta |
|----------|---------|
| Quando o consumidor usa a marca, o que ele diz para si mesmo? | |
| Como ele se sente sobre si mesmo? | |
| Qual aspiração pessoal a marca alimenta? | |
| A marca confirma ou transforma a identidade do consumidor? | |
| "Eu uso [marca] porque eu sou ___" | |

**Output:** Declaração de autoimagem + sentimento interno.

**Exemplos:**
- BMW: "Eu sou alguém que chegou lá, dinâmico e bem-sucedido"
- Patagonia: "Eu me importo com o planeta e faço algo a respeito"
- Apple: "Eu sou criativo, diferente, e faço coisas que importam"

### Step 7: Validar Coerência do Prism
Checar alinhamento entre as 6 facetas:

| Teste | Critério | Pass/Fail |
|-------|----------|-----------|
| Physique ↔ Personality | Os traços físicos expressam a personalidade? | |
| Culture ↔ Relationship | Os valores se manifestam no tipo de relação? | |
| Reflection ↔ Self-Image | O espelho externo é coerente com o interno? | |
| Emissor ↔ Receptor | O que a marca envia = o que o consumidor recebe? | |
| Prism ↔ Archetype | As 6 facetas são coerentes com o arquétipo? | |
| Prism ↔ Positioning | O Prism reforça o posicionamento? | |

**Regra:** Se qualquer teste falha, revisar a faceta incoerente antes de prosseguir.

### Step 8: Documentar o Prism Completo
Formato de entrega:

```markdown
# Brand Identity Prism — {brand_name}

## Visual do Prism
[Diagrama hexagonal com as 6 facetas preenchidas]

## Detalhamento por Faceta
### Physique: {resumo}
### Personality: {resumo}
### Culture: {resumo}
### Relationship: {resumo}
### Reflection: {resumo}
### Self-Image: {resumo}

## Implicações para Design
- Visual: {como Physique e Personality guiam o visual}
- Verbal: {como Culture e Relationship guiam o tom}
- Experiencial: {como Reflection e Self-Image guiam a experiência}

## Teste de Coerência: PASSED/FAILED
```

### Step 9: Handoff
```yaml
handoff:
  to: brand-identity-designer (Iris)
  artifact: brand-identity-prism.md
  context: "Prism completo com 6 facetas validadas e implicações para design"
  also_to: brand-culture-architect (Ethos)
  ethos_context: "Culture e Relationship facets para alinhamento cultural"
  next: "Iris traduz Physique + Personality em identidade visual"
```
