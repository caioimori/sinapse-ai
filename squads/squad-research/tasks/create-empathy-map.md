---
task: create-empathy-map
responsavel: "@audience-intelligence"
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

# Task: Create Empathy Map

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** SIMPLE
- **Depends on:** dados de audiencia, persona (se existente)
- **Feeds:** build-audience-persona

## Objetivo
Criar empathy map (Dave Gray/XPLANE) para visualizar o mundo interior da audiencia — o que pensa, sente, ve, ouve, diz e faz.

## Entrada
- Dados qualitativos (entrevistas, reviews, social listening)
- Persona existente (se disponivel)

## Passos

### 1. Definir Contexto
- Para quem? (persona ou segmento)
- Em que situacao? (usando produto, decidindo compra, buscando solucao)
- O objetivo e entender a experiencia NESTE contexto

### 2. Preencher 6 Quadrantes

**THINKS & FEELS (centro)**
- O que realmente importa? (que nao diz em voz alta)
- Preocupacoes e ansiedades
- Aspiracoes e sonhos
- Conflitos internos

**SEES**
- O que ve no mercado?
- O que o ambiente mostra?
- O que amigos/colegas fazem?
- Que ofertas ve?

**HEARS**
- O que ouve de amigos, familia, colegas?
- O que influenciadores dizem?
- O que a midia diz?
- O que chefes/clientes dizem?

**SAYS & DOES**
- O que diz publicamente?
- Como se comporta?
- Attitude vs comportamento real
- O que diz a outros sobre a situacao?

**PAINS**
- Maiores frustracoes
- Obstaculos
- Riscos que teme

**GAINS**
- O que quer alcançar
- Como mede sucesso
- O que o faria feliz

### 3. Validar com Dados
- Cada quadrante tem evidencia real?
- Fontes: verbatims, dados, observacoes
- Flag hipoteses sem evidencia

## Saida
- Empathy map preenchido (visual)
- Evidencias por quadrante
- Insights emergentes da visualizacao

## Validacao
- [ ] 6 quadrantes preenchidos
- [ ] Evidencias citadas (nao achismo)
- [ ] Insights extraidos do pattern entre quadrantes

---

*Task operada por: audience-intelligence (Pulse)*
