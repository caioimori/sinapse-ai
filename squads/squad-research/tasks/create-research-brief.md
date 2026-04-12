---
task: create-research-brief
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

# Task: Create Research Brief

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** SIMPLE
- **Depends on:** triage-research-request
- **Feeds:** conduct-deep-research, conduct-rapid-scan

## Objetivo
Criar brief de pesquisa completo antes de iniciar investigacao, garantindo clareza de escopo, fontes e expectativas.

## Entrada
- Demanda de pesquisa (triada por Prism)
- Contexto do stakeholder

## Passos

### 1. Definir Pergunta Central
- 1 pergunta clara, investigavel, nao-vaga
- Teste: se alguem lesse so a pergunta, saberia o que pesquisar?
- Se vaga: refinar com stakeholder ANTES de prosseguir

### 2. Decompor em Sub-Perguntas
- 3-7 sub-perguntas que juntas respondem a central
- Cada sub-pergunta deve ser investigavel independentemente
- Marcar: MUST-HAVE vs NICE-TO-HAVE

### 3. Parametros
- **Nivel (Pyramid):** SCAN | ANALYZE | DEEP DIVE | DEFINITIVE
- **Setor/Industria:** contexto especifico
- **Geografia:** global, Brasil, especifica
- **Periodo:** dados de que epoca? Projecoes ate quando?
- **Lingua:** fontes em que idiomas aceitas?

### 4. Fontes Sugeridas
- Listar fontes iniciais por tier
- Indicar se ha fontes primarias disponiveis (dados internos, acesso a entrevistas)
- Gaps previsiveis de fonte

### 5. Formato de Entrega
- Formato: resumo | report | dossie | deck | briefing executivo
- Tamanho esperado (paginas/palavras)
- Inclui visualizacoes? Tabelas comparativas?
- Publico-alvo do output

### 6. Timeline
- Deadline final
- Checkpoints intermediarios (se DEEP DIVE+)
- Buffer para revisao

## Saida
- Research brief preenchido (usar research-brief-template)
- Aprovado por Prism antes de iniciar pesquisa

## Validacao
- [ ] Pergunta central clara e investigavel
- [ ] Sub-perguntas decompostas
- [ ] Nivel do Pyramid definido
- [ ] Fontes mapeadas por tier
- [ ] Formato de entrega definido
- [ ] Timeline com deadline

---

*Task operada por: deep-researcher (Sage)*
