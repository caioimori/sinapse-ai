---
task: edit-copy-strategic-review
responsavel: "@copy-editor"
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

# Task: Edit Copy — Strategic Review (Pass 1)

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** copy completa de qualquer writer
- **Feeds:** writer original para revisao

## Objetivo
Primeira passada de edicao: avaliar se a copy esta estrategicamente alinhada — verificando se objetivo, audiencia, awareness level e message hierarchy estao corretos ANTES de editar palavras.

## Entrada
- Copy para review
- Copy brief original
- Message hierarchy aprovada
- Objetivos e KPIs

## Passos

### 1. Verificar Alinhamento Estrategico
**Checklist Pass 1:**

| Criterio | Pergunta | Status |
|----------|----------|:------:|
| Objetivo | A copy busca a acao correta? | ☐ |
| Audiencia | Esta falando com a pessoa certa? | ☐ |
| Awareness | O nivel de awareness esta correto? | ☐ |
| Message hierarchy | A mensagem mais importante vem primeiro? | ☐ |
| Single focus | A copy tem 1 objetivo principal? | ☐ |
| CTA alignment | O CTA alinha com o objetivo? | ☐ |
| Brief compliance | Atende ao copy brief? | ☐ |

### 2. Avaliar Estrutura
**Perguntas de estrutura:**
- A sequencia persuasiva faz sentido?
- Cada secao tem um proposito claro?
- A progressao e logica (problema → solucao → prova → acao)?
- Existe redundancia (secoes que dizem o mesmo)?
- Falta alguma secao essencial?
- A copy e longa demais ou curta demais para o awareness level?

### 3. Verificar One Big Idea
**A copy tem UMA grande ideia central?**
- Consegue resumir em 1 frase?
- Todas as secoes suportam essa ideia?
- O leitor sai sabendo EXATAMENTE o que fazer?
- Nao ha ideias concorrentes competindo?

### 4. Feedback Estruturado
**Formato de feedback:**
```
STRATEGIC REVIEW — PASS 1

Copy: [Nome]
Writer: [Agente]
Date: [Data]

ALINHAMENTO: ✅ ON / ⚠️ PARTIAL / ❌ OFF
  [Notas]

ESTRUTURA: ✅ SOLIDA / ⚠️ AJUSTES / ❌ REESTRUTURAR
  [Notas]

ONE BIG IDEA: ✅ CLARA / ⚠️ DIFUSA / ❌ AUSENTE
  [Notas]

DECISAO:
  ✅ APROVADO para Pass 2 (edicao de persuasao)
  🔄 REVISAR — [itens para ajustar antes de Pass 2]
  ❌ REESCREVER — [razoes fundamentais]

FEEDBACK PARA WRITER:
  1. [Feedback mais importante]
  2. [Segundo feedback]
  3. [Terceiro feedback]
```

## Saida
- Strategic review completo
- Decisao (aprovado/revisar/reescrever)
- Feedback estruturado para writer

## Validacao
- [ ] Alinhamento estrategico verificado (7 criterios)
- [ ] Estrutura avaliada
- [ ] One Big Idea clara
- [ ] Decisao clara para proximo passo
- [ ] Feedback acionavel para writer

---

*Task operada por: copy-editor (Chisel)*
