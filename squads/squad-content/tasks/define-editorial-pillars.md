---
task: define-editorial-pillars
responsavel: "@editorial-strategist"
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

# Task: Define Editorial Pillars

> Estruturar pilares editoriais que traduzem a Big Idea em categorias acionaveis de conteudo.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | editorial-strategist (North) |
| **Co-agents** | signal-intelligence (Radar) |
| **Trigger** | Apos definicao da Big Idea ou revisao estrategica |
| **Input** | Big Idea, territorios tematicos, dados de audiencia, pilares de marca (brand-system) |
| **Output** | 4-6 pilares editoriais documentados com sub-temas e proporcoes |
| **Handoff** | → create-editorial-calendar, configure-signal-sources |
| **Complexity** | complex |

---

## Fundamentacao

Pilares editoriais sao a ponte entre estrategia e execucao. Sem eles, a equipe produz conteudo ad hoc — reagindo a trends sem consistencia. Com pilares claros, cada peca de conteudo tem um "lugar" na estrategia. A proporcao entre pilares garante equilíbrio: nem todo conteudo e educativo, nem todo e vendas. Referencia: Joe Pulizzi — "content tilt" (Epic Content Marketing), Ann Handley — "pathologically empathetic content".

---

## Steps

### Step 1: Derivar Pilares dos Territorios
Transformar cada territorio tematico em um pilar editorial concreto. Cada pilar precisa: (1) Nome memoravel, (2) Descricao em 1 frase, (3) Que dor da audiencia resolve, (4) Como conecta com o objetivo de negocio.

### Step 2: Definir Sub-Temas por Pilar
Cada pilar tem 5-10 sub-temas recorrentes. Exemplo: Pilar "Produtividade" → sub-temas: rotinas matinais, ferramentas, gestao de tempo, foco profundo, delegacao. Sub-temas sao o "banco de ideias" permanente.

### Step 3: Estabelecer Proporcoes
Definir % de conteudo por pilar. Regra base: pilar principal (30-40%), pilares secundarios (15-25% cada), pilar de autoridade (10-15%), pilar de conversao (10-15%). Proporcoes devem refletir objetivos: awareness = mais educativo, conversao = mais produto.

### Step 4: Mapear Pilar x Funil
Para cada pilar: em que estagio do funil atua prioritariamente? TOPO (awareness/alcance), MEIO (consideracao/autoridade), FUNDO (decisao/conversao). Um pilar pode atuar em multiplos estagios, mas tem um foco primario.

### Step 5: Validar com Dados de Audiencia
Cruzar pilares com dados existentes: o que a audiencia ja engaja? Quais temas tem busca organica? Onde ha gap competitivo? Ajustar pilares baseado em evidencias, nao so intuicao.

### Step 6: Estabelecer Anti-Pilares
Definir explicitamente o que NAO e conteudo da marca. Anti-pilares previnem derivacao: "Nao falamos sobre X", "Nunca usamos tom Y". Anti-pilares sao tao importantes quanto pilares.

### Step 7: Handoff

```yaml
handoff:
  artifact: "editorial-pillars-{client}.md"
  context: "Pilares definidos: {N} pilares, {M} sub-temas totais, proporcoes configuradas, anti-pilares definidos"
  next: "create-editorial-calendar para construir calendario, configure-signal-sources para calibrar monitoramento por pilar"
```
