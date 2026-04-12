---
task: convene-panel
responsavel: "@council-orqx"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: panel_type
    tipo: string
    origem: User Input
    obrigatorio: true
  - campo: question
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: panel_session
    tipo: document
    destino: Console

Checklist:
  - "[ ] Painel correto selecionado"
  - "[ ] Todos os membros do painel consultados"
  - "[ ] Tensoes especificas do painel exploradas"
  - "[ ] Recomendacao sintetizada"
---

# Task: Convene Specialized Panel

## Metadata
- **Squad:** squad-council
- **Agent:** Zenith (council-orqx)
- **Complexity:** Standard

## Objetivo
Convocar um dos paineis especializados pre-definidos para uma questao especifica.

## Paineis Disponiveis

| Painel | Membros | Uso |
|--------|---------|-----|
| Investment Committee | Ray Dalio, Charlie Munger, Naval Ravikant | Decisoes financeiras, alocacao de capital |
| Scaling Council | Reid Hoffman, Peter Thiel, Derek Sivers | Estrategia de crescimento, market entry |
| Culture Circle | Patrick Lencioni, Brene Brown, Simon Sinek | Problemas de equipe, confianca, saude organizacional |
| Founder Council | Naval Ravikant, Derek Sivers, Yvon Chouinard | Encruzilhadas do fundador, alinhamento vida-negocio |
| Contrarian Panel | Peter Thiel, Charlie Munger, Derek Sivers | Sabedoria convencional questionada |
| Leadership Circle | Simon Sinek, Brene Brown, Ray Dalio | Desenvolvimento de lideranca |
| Strategy War Room | Peter Thiel, Reid Hoffman, Ray Dalio, Charlie Munger | Decisoes estrategicas de alto risco |

## Passos
1. Identificar o painel mais adequado para a questao
2. Enquadrar a questao para cada membro do painel
3. Coletar perspectiva de cada membro usando seus frameworks
4. Explorar tensoes especificas do painel
5. Sintetizar em recomendacao unificada
