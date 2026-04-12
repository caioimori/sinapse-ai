---
task: specific-knowledge-audit
responsavel: "@naval-ravikant"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_or_individual
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: specific_knowledge_map
    tipo: document
    destino: Console

Checklist:
  - "[ ] Conhecimento especifico identificado"
  - "[ ] Teste de treinabilidade aplicado"
  - "[ ] Vantagens unicas mapeadas"
  - "[ ] Estrategia de monetizacao definida"
---

# Task: Specific Knowledge Audit

## Metadata
- **Squad:** squad-council
- **Agent:** Naval Ravikant
- **Complexity:** Standard

## Objetivo
Identificar o specific knowledge de uma equipe ou individuo — aquele conhecimento que nao pode ser treinado, que vem da combinacao unica de experiencias, obsessoes e aptidoes naturais. "Specific knowledge is found by pursuing your genuine curiosity and passion rather than whatever is hot right now." — Naval

## Pre-Condicoes
- Individuo ou equipe para auditoria
- Historico profissional e pessoal disponivel
- Honestidade sobre interesses genuinos vs performativos

## Passos

### 1. Identificar Obsessoes Genuinas
- O que voce faria mesmo sem ser pago?
- Que topicos voce consome vorazmente sem esforço?
- Sobre o que as pessoas naturalmente pedem sua opiniao?
- O que parece trabalho para outros mas e diversao para voce?
- O que voce fazia na infancia que ainda ressoa?

### 2. Aplicar o Teste de Treinabilidade
Para cada habilidade/conhecimento identificado:
| Habilidade | Pode ser ensinada em sala de aula? | Pode ser automatizada? | Combinacao unica? | Specific Knowledge? |
|-----------|-----------------------------------|----------------------|-------------------|-------------------|
| | sim/nao | sim/nao | sim/nao | SIM se (nao, nao, sim) |

Filtros Naval:
- Se pode ser treinado em massa → generic knowledge (commoditizado)
- Se pode ser automatizado por AI/software → nao e duradouro
- Se e uma combinacao unica de experiencias → specific knowledge

### 3. Mapear a Intersecao Unica
Specific knowledge geralmente vive na intersecao de:
```
[Aptidao Natural] ∩ [Experiencia Vivida] ∩ [Curiosidade Obsessiva]
```
- Que aptidoes naturais voce tem (cognitivas, sociais, tecnicas)?
- Que experiencias unicas voce viveu que poucos viveram?
- Que curiosidades voce persegue sem esforço?
- Onde essas tres coisas se cruzam?

### 4. Avaliar Accountability Potential
- Specific knowledge sem accountability = potencial desperdicado
- Voce pode colocar seu nome/reputacao neste conhecimento?
- Existe demanda de mercado para este specific knowledge?
- Outros pagariam premium pelo que voce sabe de unico?

### 5. Comparar com o Mercado
| Dimensao | Voce | Mercado | Delta |
|----------|------|---------|-------|
| Quem mais tem este conhecimento? | | | |
| Quanto tempo levaria para replicar? | | | |
| Que resultados unicos voce pode gerar? | | | |
| Qual o preco premium justificavel? | | | |

### 6. Identificar Gaps de Leverage
Specific knowledge sem leverage = renda linear:
| Tipo de Leverage | Aplicavel? | Como? |
|-----------------|-----------|-------|
| Code/Software | | Automatizar o specific knowledge |
| Media/Content | | Escalar via audiencia |
| Capital | | Amplificar com investimento |
| Labor | | Treinar equipe (parcialmente) |

### 7. Formular Specific Knowledge Statement
Formato: "Eu/nos temos specific knowledge em [dominio] porque [combinacao unica de experiencias e aptidoes] que permite [resultado unico que outros nao conseguem replicar]."

### 8. Definir Estrategia de Aprofundamento
- Como aprofundar o specific knowledge existente?
- Que experiencias buscar para expandir a intersecao?
- Que curiosidades perseguir sem expectativa de retorno imediato?
- "Follow your intellectual curiosity over whatever is hot right now"

## Output
```yaml
specific_knowledge_map:
  entity: ""
  specific_knowledge_statement: ""
  core_elements:
    natural_aptitudes: []
    unique_experiences: []
    obsessive_curiosities: []
  intersection: ""
  trainability_test: "passed/failed"
  accountability_potential: "high/medium/low"
  leverage_gaps: []
  monetization_strategy: ""
  deepening_plan: []
```

## Validacao
- [ ] Obsessoes genuinas diferenciadas de interesses performativos
- [ ] Teste de treinabilidade aplicado rigorosamente
- [ ] Intersecao unica identificada com clareza
- [ ] Comparacao com mercado executada
- [ ] Leverage gaps identificados
- [ ] Specific Knowledge Statement articulado
