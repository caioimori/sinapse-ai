---
task: synthesize-multi-source
responsavel: "@deep-researcher"
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

# Task: Synthesize Multi-Source

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** STANDARD
- **Depends on:** conduct-deep-research ou multiplas fontes coletadas
- **Feeds:** data-synthesizer (Loom)

## Objetivo
Triangular e sintetizar informacoes de multiplas fontes, identificando convergencias, divergencias e gaps para construir visao consolidada.

## Entrada
- 5+ fontes de dados sobre mesmo topico
- Classificacao de tier de cada fonte

## Passos

### 1. Organizar por Sub-tema
- Agrupar informacoes por sub-tema ou sub-pergunta
- Criar matriz: fontes × sub-temas

### 2. Triangulacao Sistematica
- Para cada sub-tema, cruzar fontes:
  - **Convergencia:** 3+ fontes concordam → HIGH confidence
  - **Maioria:** 2 concordam, 1 diverge → MEDIUM confidence, investigar
  - **Divergencia:** fontes contradizem → LOW confidence, analisar causa
  - **Gap:** nenhuma fonte cobre → sinalizar como blind spot

### 3. Analise de Divergencias
- Quando fontes divergem, investigar:
  - Definicoes diferentes? (ex: "mercado" definido diferente)
  - Periodos diferentes? (dados de 2020 vs 2025)
  - Metodologias diferentes? (survey vs analise de dados)
  - Vieses diferentes? (consultor vs academico vs jornalista)
- Documentar causa provavel da divergencia

### 4. Sintese Consolidada
- Construir narrativa que integra (nao apenas lista) as fontes
- Highlights de convergencia (o que e robusto)
- Highlights de divergencia (o que precisa cautela)
- Gaps identificados (o que falta)

### 5. Meta-Avaliacao
- Qualidade geral das fontes (media de tier)
- Recencia (dados antigos vs atuais)
- Diversidade de perspectivas (monofonte vs multivoz)
- Confidence level final

## Saida
- Sintese consolidada multi-fonte
- Mapa de convergencias/divergencias/gaps
- Confidence level por sub-tema
- Meta-avaliacao de qualidade das fontes

## Validacao
- [ ] Todas as fontes cruzadas sistematicamente
- [ ] Divergencias investigadas e explicadas
- [ ] Gaps sinalizados
- [ ] Confidence level atribuido por sub-tema

---

*Task operada por: deep-researcher (Sage)*
