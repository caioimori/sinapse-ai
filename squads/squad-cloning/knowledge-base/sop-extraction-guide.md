# SOP Extraction Guide — Extraindo Procedimentos Operacionais de Mentes

> Como identificar, reconstruir e documentar SOPs (Standard Operating Procedures)
> a partir do conteudo de uma pessoa — para replicar metodologias sistematicas,
> nao apenas principios abstratos.
> SOPs sao Layer 3 (Workflows) em seu nivel mais operacional.

---

## O Que e um SOP Para Fins de Clonagem

Um SOP cognitivo nao e apenas "como fazer X" — e o **procedimento EXATO**
que a pessoa segue, com os criterios de decisao que determinam quando seguir
cada variante e quando desviar.

| Nivel | O que captura | Exemplo |
|-------|--------------|---------|
| **Principio** (L1) | O "por que" abstrato | "Sistemas vencem talentos" |
| **Heuristic** (L2) | O "quando" da decisao | "Se a pessoa nao tem processo, nao contrato" |
| **SOP** (L3+) | O "como" operacional step-by-step | "Processo de contratacao em 7 etapas" |
| **Variante** | Quando adaptar o SOP | "Para candidatos remotos, adicionar step X" |
| **Exit Condition** | Quando parar o processo | "Se não passar no step 3, encerrar" |

---

## Anatomia de um SOP Cognitivo Bem Extraido

```yaml
sop:
  name: "{Nome descritivo do processo}"
  domain: "{Area de aplicacao}"
  trigger: "{O que ativa este SOP — situacao ou decisao}"
  
  preconditions:
    - "{O que precisa estar verdadeiro antes de comecar}"
    - "{Prerequisito 2}"
  
  steps:
    - step: 1
      action: "{O que fazer}"
      decision_point: "{Se X, entao Y; se Z, entao W}"  # Opcional
      output: "{O que deve resultar deste step}"
      source: "[DIRETO] {Fonte}"
    
    - step: 2
      action: "{O que fazer}"
      duration: "{Quanto tempo tipicamente}"
      output: "{O que deve resultar}"
      source: "[INFERIDO] {Fontes}"
  
  exit_conditions:
    success: "{Quando considerar o processo concluido com sucesso}"
    abort: "{Quando encerrar sem completar — e por que}"
  
  variants:
    - condition: "{Quando usar esta variante}"
      modification: "{Como o SOP muda}"
  
  anti_patterns:
    - "{O que a pessoa explicitamente diz para NAO fazer neste processo}"
  
  confidence: "{Confidence score para este SOP especifico}"
  sources: ["{lista de fontes}"]
```

---

## Tecnicas de Extracao de SOPs

### Tecnica 1: Extracao de Exemplo Concreto

A maioria dos SOPs nao e descrita de forma abstrata — emerge de exemplos.

**Processo:**
1. Encontrar 3+ exemplos onde a pessoa descreve como fez algo
2. Para cada exemplo, listar os steps que aparecem
3. Identificar steps comuns (aparecem em 2+ exemplos)
4. Ordenar cronologicamente
5. Marcar como [INFERIDO] (derivado de exemplos, nao declarado como processo)

**Exemplo:**
```
Fonte 1: "Quando lanco um produto, primeiro testo a oferta com 10 pessoas..."
Fonte 2: "No lancamento do curso, comecei validando com um grupo pequeno..."
Fonte 3: "Sempre valido antes de escalar..."

→ SOP extraido: "Validacao com grupo pequeno antes de lancamento completo"
→ Confianca: [INFERIDO] (aparece em 3 exemplos)
```

### Tecnica 2: Elicitacao de Decisoes

Quando a pessoa descreve uma decisao complexa, o SOP esta implicito
na sequencia de perguntas/criterios que ela menciona.

**Sinal linguistico:** "A primeira coisa que olho e... depois verifico... e so então..."

**Processo:**
1. Identificar qualquer descricao de "sequencia de analise" ou "processo de decisao"
2. Extrair os criterios em ordem de mencao
3. Estruturar como SOP de decisao (decision flowchart)

### Tecnica 3: Reconstructing from Teaching

Quando a pessoa ensina outras pessoas a fazer algo:
- Conteudo de curso = SOP detalhado com alta fidelidade
- Tutorial = SOP com rationale explicada
- Conselho a subordinado = SOP adaptado para o contexto do outro

**Prioridade:** Conteudo de ensino tem score de [DIRETO] mesmo que seja
descricao do SOP para outra pessoa, desde que a pessoa declare "eu faco assim".

### Tecnica 4: Reverse Engineering de Outputs

Para casos onde o SOP nunca foi descrito explicitamente:
1. Coletar 5+ outputs que a pessoa produziu do mesmo tipo
2. Identificar estrutura comum nos outputs
3. Inferir o SOP que produziu essa estrutura
4. Marcar sempre como [HIPOTESE] — e reconstrucao, nao extracao direta

---

## Tipos de SOPs por Dominio

### SOPs de Produto/Negocio

| SOP | Sinal de Presenca | Tier Minimo |
|-----|-----------------|------------|
| Processo de lancamento | "Quando lancei..." / "Meu processo de lancamento" | Tier 1 |
| Criacao de oferta | "Quando crio uma oferta..." | Tier 2 |
| Onboarding de cliente | "Como recebo um novo cliente..." | Tier 2 |
| Criacao de produto | "Como desenvolvo um produto..." | Tier 2 |
| Processo de contratacao | "Quando contratar..." | Tier 3 |

### SOPs de Marketing/Vendas

| SOP | Sinal de Presenca | Tier Minimo |
|-----|-----------------|------------|
| Processo de copywriting | "Quando escrevo copy..." | Tier 1 |
| Estrutura de funil | "Meu funil tem X etapas..." | Tier 1 |
| Qualificacao de leads | "Antes de falar com alguem..." | Tier 2 |
| Script de vendas | "Na ligacao, primeiro..." | Tier 2 |
| Processo de upsell | "Como oferecer mais..." | Tier 3 |

### SOPs de Estrategia/Decisao

| SOP | Sinal de Presenca | Tier Minimo |
|-----|-----------------|------------|
| Framework de priorizacao | "Quando tenho multiplas opcoes..." | Tier 2 |
| Processo de resolucao de problema | "Quando enfrento X problema..." | Tier 2 |
| Processo de analise de oportunidade | "Antes de entrar em..." | Tier 3 |
| Tomada de decisao em crise | "Quando algo da errado..." | Tier 3 |

---

## Decision Tree Mapping

SOPs complexos contem pontos de decisao — o clone precisa saber nao apenas
os steps, mas QUANDO escolher cada ramificacao.

### Formato de Arvore de Decisao

```
[TRIGGER: {situacao que ativa o SOP}]
    |
    v
[STEP 1: {acao}]
    |
    +-- Se {condicao A} --> [STEP 2A: {acao alternativa A}]
    |                           |
    |                           v
    |                       [EXIT: {resultado esperado}]
    |
    +-- Se {condicao B} --> [STEP 2B: {acao alternativa B}]
    |                           |
    |                           +-- Se {sub-condicao} --> [STEP 3]
    |                           |
    |                           +-- Senao --> [EXIT: abort - {razao}]
    |
    +-- Default --> [STEP 2C: {acao padrao}]
```

### Exemplo Real: Decision Tree de Oferta (hipotetico)

```
[TRIGGER: Precisa criar ou revisar uma oferta]
    |
    v
[STEP 1: Calcular valor percebido pelo cliente]
    |
    +-- Se valor > 10x preco --> [STEP 2A: Lancamento direto]
    |
    +-- Se valor 3-10x preco --> [STEP 2B: Adicionar bonus ate chegar em 10x]
    |
    +-- Se valor < 3x preco ---> [ABORT: Redesenhar a oferta do zero]
```

---

## SOPs vs Heuristics — Como Distinguir

| Caracteristica | Heuristic (L2) | SOP (L3) |
|---------------|---------------|---------|
| Comprimento | 1-3 linhas | 5-20+ steps |
| Frequencia | Aplicada muitas vezes | Aplicada em contextos especificos |
| Granularidade | Alta abstracao | Operacional e especifico |
| Variantes | Poucas | Multiplas (por contexto) |
| Exit conditions | Implicitas | Explicitas |

**Regra pratica:** Se voce pode descrever em < 3 linhas, e uma heuristic.
Se precisa de mais, e um SOP.

---

## Qualidade de SOPs por Tier

| Criterio | Tier 1 | Tier 2 | Tier 3 |
|---------|--------|--------|--------|
| SOPs documentados | 3 | 5 | 8+ |
| Steps por SOP | 3-5 | 5-8 | 8+ |
| Decision points incluidos | 0-1 | 1-3 | 3+ |
| Variants documentadas | 0 | 1-2 | 2+ |
| Exit conditions | Opcional | Recomendado | Obrigatorio |
| Anti-patterns | Opcional | Recomendado | Obrigatorio |

---

## Red Flags de SOPs Fracos

| Red Flag | Problema | Correcao |
|---------|---------|---------|
| Steps genéricos ("analisar X") | Nao e actionable | Especificar o que analisar e como |
| SOP com 1-2 steps | Provavelmente e heuristic | Re-classificar ou aprofundar |
| Sem trigger claro | Clone nao sabe quando usar | Definir situacao de ativacao |
| Sem exit conditions | Clone nao sabe quando parar | Adicionar success e abort conditions |
| Confianca [HIPOTESE] em SOP critico | Risco de fabricacao | Buscar mais fontes ou downgrade |
| SOP contradiz heuristic da pessoa | Inconsistencia no perfil | Investigar e resolver |

---

Ver tambem: `extraction-patterns.md` — patterns gerais para identificar SOPs.
Ver tambem: `cognitive-dna-framework.md` — SOPs sao Layer 3 (Workflows & Processes).
Ver tambem: `kb-generation-guide.md` — como empacotar SOPs como Methodology KBs.
