---
task: map-pain-gain-matrix
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

# Task: Map Pain-Gain Matrix

## Metadata
- **Squad:** squad-research
- **Agent:** audience-intelligence (Pulse)
- **Complexity:** STANDARD
- **Depends on:** dados de audiencia
- **Feeds:** build-audience-persona, conduct-jobs-to-be-done

## Objetivo
Mapear dores e ganhos da audiencia com dados reais, ranqueando por intensidade e frequencia para priorizar messaging e produto.

## Entrada
- Dados qualitativos (reviews, entrevistas, support, sales calls)
- Dados quantitativos (NPS, surveys, churn data)

## Passos

### 1. Coleta de Dores (Pains)
- **Funcionais:** O que nao funciona? O que demora? O que custa caro?
- **Emocionais:** O que frustra? O que causa ansiedade? O que envergonha?
- **Sociais:** O que prejudica a imagem? O que gera critica?
- Fonte: palavras EXATAS dos clientes (verbatims)

### 2. Coleta de Ganhos (Gains)
- **Funcionais:** O que quer que funcione melhor? Que economia busca?
- **Emocionais:** O que quer sentir? Que prazer/alivio busca?
- **Sociais:** Como quer ser visto? Que reconhecimento busca?
- **Inesperados:** O que encantaria alem da expectativa?

### 3. Ranqueamento
- Para cada dor/ganho: pontuar 1-5 em:
  - **Intensidade:** quao forte e a dor/desejo
  - **Frequencia:** quao frequente acontece
  - **Score = Intensidade × Frequencia**
- Top 5 dores e top 5 ganhos = foco

### 4. Conexao com Solucao
- Para cada dor top: nossa solucao alivia? Como? Quanto?
- Para cada ganho top: nossa solucao entrega? Como? Quanto?
- Gaps: dores que nao aliviamos, ganhos que nao entregamos

### 5. Matriz Visual (Osterwalder)
```
PAINS                          GAINS
[Intensidade alta]             [Intensidade alta]
├── Dor 1 (score)              ├── Ganho 1 (score)
├── Dor 2 (score)              ├── Ganho 2 (score)
├── Dor 3 (score)              ├── Ganho 3 (score)
[Intensidade baixa]            [Intensidade baixa]
```

## Saida
- Pain-Gain matrix preenchida com scores
- Top 5 dores e top 5 ganhos priorizados
- Conexao com solucao (aliviamos/nao aliviamos)
- Verbatims representativos

## Validacao
- [ ] Dores e ganhos baseados em dados (verbatims citados)
- [ ] 3 dimensoes cobertas (funcional, emocional, social)
- [ ] Ranqueamento por intensidade × frequencia
- [ ] Conexao com solucao mapeada

---

*Task operada por: audience-intelligence (Pulse)*
