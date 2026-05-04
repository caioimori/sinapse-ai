---
task: organizational-clarity-check
responsavel: "@patrick-lencioni"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: clarity_check
    tipo: document
    destino: Console

Checklist:
  - "[ ] 6 perguntas respondidas pela lideranca"
  - "[ ] Alinhamento entre lideres medido"
  - "[ ] Gaps de clareza identificados"
  - "[ ] Over-communication plan projetado"
---

# Task: Organizational Clarity Check (6 Questions)

## Metadata
- **Squad:** squad-council
- **Agent:** Patrick Lencioni
- **Complexity:** Standard

## Objetivo
Avaliar clareza organizacional usando as 6 Perguntas Criticas de Lencioni (The Advantage). A maioria dos problemas organizacionais nao vem de falta de inteligencia, mas de falta de clareza e alinhamento entre a lideranca. "An organization has integrity when it is whole, consistent, and complete."

## Pre-Condicoes
- Equipe de lideranca disponivel para participar
- Cada lider responde independentemente (sem consulta)
- Compromisso de agir sobre os gaps

## Passos

### 1. Coletar Respostas Independentes
Cada lider responde as 6 perguntas SEPARADAMENTE:

**Pergunta 1: Why do we exist?**
(Proposito fundamental alem de ganhar dinheiro)

**Pergunta 2: How do we behave?**
(Valores core — 2-3 que realmente definem comportamento)

**Pergunta 3: What do we do?**
(Descricao simples do negocio que qualquer um entenderia)

**Pergunta 4: How will we succeed?**
(Estrategia diferenciadora — 3 ancoras estrategicas)

**Pergunta 5: What is most important right now?**
(Prioridade tematica unica para este periodo)

**Pergunta 6: Who must do what?**
(Papeis e responsabilidades claros na lideranca)

### 2. Comparar Respostas (Alignment Test)
Para cada pergunta, comparar respostas de todos os lideres:
| Pergunta | Alinhamento | Exemplo de Divergencia |
|----------|-----------|----------------------|
| Why we exist | ALIGNED / DIVERGENT | |
| How we behave | ALIGNED / DIVERGENT | |
| What we do | ALIGNED / DIVERGENT | |
| How we succeed | ALIGNED / DIVERGENT | |
| Most important now | ALIGNED / DIVERGENT | |
| Who does what | ALIGNED / DIVERGENT | |

Score: ___ de 6 perguntas alinhadas

### 3. Diagnosticar Gaps de Clareza
Para cada pergunta DIVERGENT:
| Pergunta | Versao Lider A | Versao Lider B | Divergencia Core |
|----------|-------------|-------------|-----------------|
| | | | |

Consequencias da falta de clareza:
- Equipes tomam decisoes conflitantes
- Prioridades competem entre si
- Contratacoes inconsistentes
- Cultura se fragmenta
- Politica preenche o vazio

### 4. Alinhar Respostas (Workshop)
Para cada pergunta divergente:
- Apresentar as diferentes versoes
- Debater (conflito produtivo obrigatorio)
- Chegar a UMA resposta clara e compartilhada
- Nao buscar perfeicao — buscar clareza e compromisso

### 5. Criar o Playbook de Clareza
Documento de uma pagina com as 6 respostas:
```yaml
organizational_clarity:
  why_we_exist: ""
  how_we_behave:
    - value: ""
      behavior: "Como se manifesta no dia-a-dia"
  what_we_do: ""
  how_we_succeed:
    - anchor: ""
      description: ""
  most_important_now:
    thematic_goal: ""
    defining_objectives: []
    standard_objectives: []
  who_does_what:
    - role: ""
      owner: ""
      primary_responsibility: ""
```

### 6. Testar Clareza com a Organizacao
Depois que lideranca alinha, testar se cascadeou:
- Perguntar a 10 pessoas aleatorias cada uma das 6 perguntas
- Comparar respostas com o playbook
- Onde ha divergencia = falha de comunicacao (nao de inteligencia)

### 7. Projetar Over-Communication Plan
Lencioni: "Employees will not believe a message until they've heard it 7 times"
| Mensagem | Canal 1 | Canal 2 | Canal 3 | Frequencia |
|----------|---------|---------|---------|-----------|
| Why we exist | All-hands | Onboarding | Parede do escritorio | Mensal |
| How we behave | Exemplos em reunioes | Recognition program | Hiring criteria | Semanal |
| What we do | Elevator pitch compartilhado | Website | Sales deck | Trimestral |
| How we succeed | Strategy review | Team meetings | Dashboards | Mensal |
| Most important now | Weekly tactical | All-hands | OKRs visiveis | Semanal |
| Who does what | Org chart + RACI | Team meetings | Onboarding | Trimestral |

### 8. Definir Cadencia de Revisao
| Pergunta | Frequencia de Revisao | Gatilho para Revisao Antecipada |
|----------|---------------------|-------------------------------|
| Why we exist | Anual (raramente muda) | Crise existencial |
| How we behave | Anual | Problemas culturais |
| What we do | Semestral | Mudança de portfolio |
| How we succeed | Semestral | Mudanca de mercado |
| Most important now | Trimestral | Prioridade alcancada ou obsoleta |
| Who does what | Trimestral | Mudanca de equipe |

## Output
```yaml
clarity_check:
  organization: ""
  date: ""
  alignment_score: "/6"
  answers:
    why_we_exist: ""
    how_we_behave: []
    what_we_do: ""
    how_we_succeed: []
    most_important_now: ""
    who_does_what: []
  gaps: []
  overcommunication_plan: []
  review_cadence: []
```

## Validacao
- [ ] 6 perguntas respondidas independentemente por cada lider
- [ ] Alignment test executado com score
- [ ] Gaps diagnosticados com divergencias especificas
- [ ] Workshop de alinhamento executado para gaps
- [ ] Playbook de clareza (1 pagina) criado
- [ ] Over-communication plan projetado
- [ ] Cadencia de revisao definida
