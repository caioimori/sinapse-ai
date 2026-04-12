---
task: inversion-thinking-session
responsavel: "@charlie-munger"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: goal_or_initiative
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: inversion_analysis
    tipo: document
    destino: Console

Checklist:
  - "[ ] Objetivo invertido corretamente"
  - "[ ] Modos de falha catalogados"
  - "[ ] Pre-mortem executado"
  - "[ ] Acoes preventivas definidas"
---

# Task: Inversion Thinking Session

## Metadata
- **Squad:** squad-council
- **Agent:** Charlie Munger
- **Complexity:** Standard

## Objetivo
Conduzir uma sessao profunda de pensamento por inversao — em vez de perguntar "como ter sucesso", perguntar "como garantir o fracasso" e sistematicamente evitar cada modo de falha. Inspirado na maxima de Jacobi que Munger cita constantemente: "Invert, always invert."

## Pre-Condicoes
- Objetivo, projeto ou iniciativa claramente definido
- Equipe ou individuo disposto a pensar no negativo
- Contexto suficiente sobre o que esta sendo planejado

## Passos

### 1. Definir o Objetivo Positivo
- Articular claramente: "Queremos alcançar X"
- Definir criterios de sucesso objetivos
- Estabelecer timeframe
- Identificar stakeholders afetados

### 2. Inverter o Objetivo
Transformar em: "Se quisessemos GARANTIR que X fracasse, o que fariamos?"
- Listar pelo menos 15 maneiras de garantir o fracasso
- Ser criativo e abrangente — quanto mais ridiculo, melhor
- Incluir falhas sutis alem das obvias
- Considerar falhas em diferentes dimensoes: tecnica, humana, financeira, timing

### 3. Categorizar Modos de Falha
| Modo de Falha | Categoria | Probabilidade | Impacto | Controlavel? |
|--------------|-----------|---------------|---------|-------------|
| | Pessoas | alta/media/baixa | | sim/parcial/nao |
| | Processo | | | |
| | Tecnologia | | | |
| | Mercado | | | |
| | Financeiro | | | |
| | Timing | | | |
| | Comunicacao | | | |

### 4. Executar Pre-Mortem
Imaginar que estamos 12 meses no futuro e o projeto FRACASSOU:
- O que deu errado? (narrativa detalhada)
- Quando os primeiros sinais apareceram?
- O que ignoramos que nao deveriamos?
- Quem alertou e nao foi ouvido?
- Que suposicao critica estava errada?

### 5. Priorizar por Risco
```
Risk Score = Probabilidade (1-5) x Impacto (1-5) x (1 - Controlabilidade)

Onde Controlabilidade:
  Controlavel = 0.7
  Parcialmente controlavel = 0.4
  Incontrolavel = 0.1
```
Ordenar modos de falha por Risk Score decrescente.

### 6. Projetar Prevencoes
Para os Top 10 riscos:
| Risco | Prevencao Primaria | Prevencao Secundaria | Early Warning Signal | Responsavel |
|-------|-------------------|---------------------|---------------------|------------|
| | O que fazer para evitar | Plano B se acontecer | Como detectar cedo | |

### 7. Identificar Anti-Checklist
Criar lista de "coisas que NUNCA devemos fazer":
- Se fizermos X, o projeto morre
- Se ignorarmos Y, o projeto morre
- Se assumirmos Z, o projeto morre
- Anti-checklist e mais poderosa que checklist (Munger)

### 8. Integrar com Plano Original
- Revisar plano original a luz dos modos de falha
- Adicionar checkpoints de validacao
- Incorporar early warning signals
- Definir kill criteria (quando abandonar vs pivotar)

## Output
```yaml
inversion_analysis:
  objective: ""
  total_failure_modes: 0
  top_risks:
    - failure_mode: ""
      category: ""
      risk_score: 0
      prevention: ""
      early_warning: ""
  pre_mortem_narrative: ""
  anti_checklist:
    - "NUNCA: {acao que garante fracasso}"
  kill_criteria: []
  plan_modifications: []
```

## Validacao
- [ ] Minimo 15 modos de falha identificados
- [ ] Categorizacao completa (pessoas, processo, tech, mercado)
- [ ] Pre-mortem narrativo executado
- [ ] Risk scores calculados e priorizados
- [ ] Prevencoes definidas para Top 10 riscos
- [ ] Anti-checklist criada
- [ ] Plano original revisado com integracoes
