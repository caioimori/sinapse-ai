---
task: rumble-conversation-guide
responsavel: "@brene-brown"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: conversation_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: rumble_guide
    tipo: document
    destino: Console

Checklist:
  - "[ ] Conversa preparada com estrutura"
  - "[ ] Story I'm telling myself identificada"
  - "[ ] Facilitacao planejada"
  - "[ ] Follow-up projetado"
---

# Task: Rumble Conversation Guide

## Metadata
- **Squad:** squad-council
- **Agent:** Brene Brown
- **Complexity:** Standard

## Objetivo
Guiar a preparacao e execucao de uma "rumble" — conversa dificil conduzida com coragem, empatia e respeito. Usando o framework de Brown para navegar conflitos, feedback dificil e decisoes tensas de forma que fortalece (nao destrói) relacionamentos.

## Pre-Condicoes
- Conversa dificil necessaria e identificada
- Disposicao para ser vulneravel E manter boundaries
- Entendimento de que o objetivo e clareza, nao vitoria

## Passos

### 1. Definir a Conversa Necessaria
| Dimensao | Descricao |
|----------|-----------|
| Com quem? | |
| Sobre o que? | |
| Por que e dificil? | |
| O que acontece se nao tiver essa conversa? | |
| Qual o melhor resultado possivel? | |
| Qual o pior resultado possivel? | |

### 2. Identificar "The Story I'm Telling Myself"
Antes da conversa, reconhecer sua narrativa interna:
- "A historia que estou contando para mim mesmo e..."
- Quais sao os FATOS vs minhas INTERPRETACOES?
- Que emocoes estao colorindo minha percepcao?
- Que experiencias passadas estao projetando nesta situacao?
- Que suposicoes estou fazendo sobre a outra pessoa?

```yaml
story_check:
  facts: "O que realmente aconteceu (observavel)"
  interpretation: "O que estou adicionando aos fatos"
  emotion: "O que estou sentindo"
  assumption: "O que estou assumindo sobre o outro"
  past_trigger: "Que experiencia passada isso ativa"
```

### 3. Preparar a Abertura
Brown's opening framework:
- "Estou nervoso(a) para ter essa conversa, E ela e importante"
- Nao: comece com acusacoes ou conclusoes
- Sim: comece com curiosidade e vulnerabilidade
- Frase de abertura: "A historia que estou contando para mim mesmo e [narrativa]. Quero entender sua perspectiva."

### 4. Planejar Perguntas de Curiosidade
Substituir julgamentos por curiosidade:
| Em vez de (julgamento) | Pergunte (curiosidade) |
|-----------------------|----------------------|
| "Por que voce fez isso?" | "Pode me ajudar a entender o que levou a essa decisao?" |
| "Voce nao se importa com..." | "O que e mais importante para voce nesta situacao?" |
| "Voce sempre faz isso" | "Estou percebendo um padrao — voce concorda?" |
| "Isso esta errado" | "Vejo de forma diferente — posso compartilhar?" |

### 5. Definir Boundaries da Conversa
| Boundary | Descricao |
|----------|-----------|
| Tempo | Maximo de X minutos, com opcao de retomar depois |
| Tom | Firme e respeitoso, nunca cruel |
| Escopo | Falar sobre ESTE topico, nao trazer outros |
| Safety | Se gritar/insultar, pausar e retomar depois |
| Confidencialidade | O que sai desta sala fica entre nos |

### 6. Preparar para Defensividade
Quando a outra pessoa se defender:
- Nao escalar — "Entendo que isso e dificil de ouvir"
- Voltar aos fatos — "O que observei foi [fato concreto]"
- Manter curiosidade — "Quero entender sua perspectiva"
- Oferecer pausa — "Podemos pausar e retomar quando estivermos prontos?"
- Reconhecer — "Agradeco voce estar aqui para essa conversa"

### 7. Aplicar "Clear is Kind, Unclear is Unkind"
O que ser claro significa nesta conversa:
| Area | Mensagem Clara (ser especifico) |
|------|-------------------------------|
| O que observei | Comportamento concreto, data, contexto |
| O impacto | Como me afetou / afetou a equipe |
| O que preciso | Pedido especifico e acionavel |
| O que ofereço | Minha parte na solucao |
| Proximo passo | Acao concreta com timeline |

### 8. Planejar Follow-Up
Depois da rumble:
- Quando reconectar? (24-48h para processar)
- Como medir se a conversa gerou mudanca?
- O que fazer se nada mudar?
- Como manter o relacionamento saudavel independente do resultado?
- Registrar aprendizados para futuras rumbles

## Output
```yaml
rumble_guide:
  conversation_with: ""
  topic: ""
  story_im_telling: ""
  facts_vs_interpretation: ""
  opening_statement: ""
  curiosity_questions: []
  boundaries: []
  clear_messages:
    observed: ""
    impact: ""
    need: ""
    offer: ""
    next_step: ""
  follow_up_plan: ""
```

## Validacao
- [ ] "Story I'm telling myself" identificada e separada de fatos
- [ ] Abertura preparada com vulnerabilidade + clareza
- [ ] Perguntas de curiosidade substituem julgamentos
- [ ] Boundaries definidas para a conversa
- [ ] Plano para defensividade preparado
- [ ] Mensagens claras articuladas (Clear is Kind)
- [ ] Follow-up planejado com timeline
