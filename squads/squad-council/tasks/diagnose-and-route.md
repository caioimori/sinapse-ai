---
task: diagnose-and-route
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: user_message
    tipo: string
    origem: User Input
    obrigatorio: true
  - campo: routing_catalog
    tipo: string
    origem: knowledge-base/routing-catalog.md
    obrigatorio: true

Saida:
  - campo: diagnosis
    tipo: document
    destino: Console

Checklist:
  - "[ ] User intent parsed and categorized"
  - "[ ] Advisory domain identified"
  - "[ ] Cross-cutting answer delivered"
  - "[ ] Routing suggestion provided"
---

# Task: Diagnose & Route Strategic Question

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx)
- **Complexity:** Standard

## Objetivo
Analisar a questao estrategica do usuario, fornecer uma resposta imediata cross-cutting, e determinar qual conselheiro especialista deve ser consultado.

## Entrada
- User message (questao estrategica)
- Routing catalog (knowledge-base/routing-catalog.md)
- Conversation history (se disponivel)

## Passos

### 1. Parse Request
1. Extrair a questao central ou intencao
2. Identificar keywords, dominios de advisory, e contexto estrategico
3. Determinar o dominio: financial, entrepreneurial, organizational, philosophical
4. Determinar o estilo de decisao necessario

### 2. Match Routing Catalog
1. Carregar routing-catalog.md
2. Match keywords contra listas de dominio
3. Score cada dominio por relevancia
4. Identificar primary_agent e secondary_agent

### 3. Cross-Cutting Answer (OBRIGATORIO)
1. Fornecer resposta imediata e util
2. Resposta deve ser acionavel e demonstrar competencia advisory
3. Incluir frameworks, principios ou modelos mentais aplicaveis
4. Referenciar a perspectiva advisory por nome

### 4. Routing Suggestion
| Confianca | Criterio | Acao |
|-----------|----------|------|
| HIGH | Match claro, dominio unico | Rotear para advisor primario |
| MEDIUM | Multiplos dominios | Sugerir primario + secundario |
| LOW | Sem match claro | Ficar com Zenith, perguntas clarificadoras |

## Output
```yaml
diagnosis:
  intent: "{parsed user intent}"
  advisory_domain: "financial | entrepreneurial | organizational | philosophical"
  confidence: "HIGH | MEDIUM | LOW"
  primary_agent: "{agent-id}"
  secondary_agent: "{agent-id}"
  cross_cutting_answer: "{resposta imediata}"
  routing_suggestion: "{por que este advisor}"
```
