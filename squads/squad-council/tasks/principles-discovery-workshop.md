---
task: principles-discovery-workshop
responsavel: "@ray-dalio"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: principles_document
    tipo: document
    destino: Console

Checklist:
  - "[ ] Experiencias-chave catalogadas"
  - "[ ] Principios extraidos com evidencias"
  - "[ ] Hierarquia de principios definida"
  - "[ ] Documento de principios formatado"
---

# Task: Principles Discovery Workshop

## Metadata
- **Squad:** squad-council
- **Agent:** Ray Dalio
- **Complexity:** High

## Objetivo
Facilitar uma sessao estruturada para descobrir, articular e documentar os principios fundamentais de uma pessoa ou organizacao. Transformar experiencias vividas e decisoes passadas em regras explicitas e acionaveis que conectam valores a comportamentos.

## Pre-Condicoes
- Contexto da organizacao ou individuo disponivel
- Disposicao para refletir honestamente sobre experiencias passadas
- Acesso a historico de decisoes importantes (se disponivel)

## Passos

### 1. Catalogar Experiencias Formativas
- Listar as 10-15 experiencias mais marcantes (profissionais e pessoais)
- Para cada uma: o que aconteceu, o que aprendeu, o que faria diferente
- Identificar padroes recorrentes entre as experiencias
- Marcar as experiencias que geraram as licoes mais duradouras

### 2. Extrair Principios Brutos
Para cada experiencia formativa:
| Experiencia | Licao Aprendida | Principio Bruto | Categoria |
|-------------|----------------|-----------------|-----------|
| | | | |

- Formular cada principio como uma regra clara: "Quando X, faca Y porque Z"
- Eliminar principios vagos ou nao-acionaveis
- Agrupar principios similares

### 3. Testar Principios via Inversao
- Para cada principio: o que acontece se fizer o OPOSTO?
- Se o oposto nao gera consequencia clara, o principio e fraco
- Refinar principios que falham no teste de inversao
- Eliminar truismos disfarados de principios

### 4. Classificar em Categorias Dalio
| Categoria | Exemplos |
|-----------|----------|
| Life Principles | Como lidar com realidade, aprendizado, decisoes |
| Work Principles | Como operar em equipe, cultura, gestao |
| Management Principles | Como contratar, treinar, avaliar |
| Economic Principles | Como pensar sobre dinheiro, investimentos, risco |

### 5. Estabelecer Hierarquia
- Quais principios sao **fundamentais** (nunca negociaveis)?
- Quais sao **operacionais** (guias do dia-a-dia)?
- Quais sao **situacionais** (aplicam-se em contextos especificos)?
- Definir como resolver conflitos entre principios

### 6. Stress-Test com Cenarios Reais
- Aplicar cada principio fundamental a 3 decisoes passadas
- O principio teria levado a decisao certa?
- Se nao, o principio precisa de ajuste ou a decisao foi um erro?
- Documentar excecoes e condicoes de contorno

### 7. Criar Documento de Principios
- Organizar em formato consultavel (nao apenas leitura)
- Incluir exemplos concretos para cada principio
- Adicionar anti-patterns (o que NAO fazer)
- Definir processo de revisao e atualizacao

### 8. Definir Cadencia de Revisao
- Frequencia de revisao: trimestral ou pos-experiencia significativa
- Gatilhos para adicionar novos principios
- Processo para aposentar principios obsoletos
- Mecanismo de compartilhamento com equipe

## Output
```yaml
principles_document:
  author: "{individuo ou organizacao}"
  date: ""
  total_principles: 0
  fundamental_principles:
    - principle: ""
      origin_experience: ""
      when_to_apply: ""
      anti_pattern: ""
  operational_principles:
    - principle: ""
      category: ""
      daily_application: ""
  situational_principles:
    - principle: ""
      context: ""
      conditions: ""
  review_cadence: "quarterly"
  next_review: ""
```

## Validacao
- [ ] Minimo 10 principios articulados
- [ ] Cada principio tem experiencia de origem documentada
- [ ] Hierarquia fundamental/operacional/situacional definida
- [ ] Teste de inversao aplicado a todos os principios
- [ ] Stress-test com cenarios reais executado
- [ ] Documento formatado e consultavel
