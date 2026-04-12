---
task: build-data-narrative
responsavel: "@data-synthesizer"
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

# Task: Build Data Narrative

## Metadata
- **Squad:** squad-research
- **Agent:** data-synthesizer (Loom)
- **Complexity:** STANDARD
- **Depends on:** dados de pesquisa disponiveis
- **Feeds:** content-intelligence, copywriting-persuasion

## Objetivo
Transformar dados brutos em narrativa compelling usando a estrutura de Duarte (what is → what could be) — storytelling orientado a dados.

## Entrada
- Dados quantitativos e qualitativos de pesquisa
- Contexto da narrativa (para que sera usada)
- Audiencia-alvo da narrativa

## Passos

### 1. Selecionar Story Arc (Duarte)
- **What Is:** Situacao atual (apoiada por dados)
- **What Could Be:** Visao do futuro possivel
- **Alternancia:** ir e voltar entre realidade e possibilidade
- **New Bliss:** Estado final desejado
- Identificar o GAP emocional entre "is" e "could be"

### 2. Data Points como Personagens
- Transformar cada dado em um "momento" da historia
- Dados que SURPREENDEM → abrir a narrativa (hook)
- Dados que CONFIRMAM → construir credibilidade (build)
- Dados que DESAFIAM → criar tensao (conflict)
- Dados que RESOLVEM → fechar com acao (resolution)

### 3. Construir Narrative Flow
- Hook: dado surpreendente ou contra-intuitivo
- Context: porque isso importa agora
- Evidence: dados de suporte (3-5 data points)
- Tension: o que acontece se nao agir
- Resolution: o que fazer e resultado esperado
- Call to action: proximo passo concreto

### 4. Eliminar Data Noise
- Aplicar principio de Tufte: maximizar data-ink ratio
- Cada dado deve avancar a narrativa
- Se remover o dado e a historia nao muda → remover
- Simplificar numeros (arredondar, usar comparacoes)

### 5. Validacao Narrativa
- A historia e factualmente correta?
- A narrativa e coerente do inicio ao fim?
- Os dados suportam (nao contradizem) a conclusao?
- A audiencia conseguira recontar a essencia?

## Saida
- Narrativa de dados estruturada (what is → what could be)
- Data points selecionados e contextualizados
- Flow narrativo completo
- Versao resumida (elevator pitch dos dados)

## Validacao
- [ ] Story arc definido (Duarte framework)
- [ ] Dados selecionados suportam narrativa
- [ ] Hook compelling identificado
- [ ] Tensao → resolucao construida
- [ ] Factualmente correto
- [ ] Audiencia-appropriate

---

*Task operada por: data-synthesizer (Loom)*
