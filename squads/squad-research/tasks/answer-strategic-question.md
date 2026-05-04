---
task: answer-strategic-question
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

# Task: Answer Strategic Question

## Metadata
- **Squad:** squad-research
- **Agent:** deep-researcher (Sage)
- **Complexity:** STANDARD
- **Depends on:** research brief
- **Feeds:** Prism (para routing), Loom (para formatacao)

## Objetivo
Responder pergunta estrategica especifica com pesquisa estruturada, entregando resposta acionavel no formato mais util para o decisor.

## Entrada
- Pergunta estrategica clara (ex: "Devemos entrar no mercado X?")
- Contexto: quem pergunta, que decisao depende da resposta
- Timeline: quando a decisao sera tomada

## Passos

### 1. Decompor a Pergunta
- Identificar a decisao por tras da pergunta
- Decompor em sub-perguntas investigaveis
- Definir: que informacao mudaria a decisao?

### 2. Pesquisa Direcionada
- Focar APENAS no que responde a pergunta (nao ir em tangentes)
- Priorizar fontes com dados diretamente relevantes
- Timer: proporcional ao impacto da decisao

### 3. Construir Resposta
- **Lead:** Resposta direta em 1-2 frases
- **Suporte:** 3-5 evidencias que sustentam a resposta
- **Contra-argumento:** O que diria quem discorda? (steelmanning)
- **Risco:** O que pode dar errado se seguir esta recomendacao?
- **Alternativas:** Outras opcoes consideradas e por que foram descartadas

### 4. Calibrar Confianca
- HIGH: multiplas fontes Tier 1-3 concordam, dados robustos
- MEDIUM: fontes razoaveis mas com gaps
- LOW: fontes limitadas, alta incerteza
- Declarar: "Respondemos com confidence X porque..."

### 5. Formatar para o Decisor
- C-level: max 1 pagina, lead + 3 bullets + recomendacao
- Gerente: 2-3 paginas com dados de suporte
- Equipe tecnica: report completo com metodologia

## Saida
- Resposta estruturada com lead, suporte, contra-argumento, risco
- Confidence level declarado
- Formatada para o perfil do decisor

## Validacao
- [ ] Pergunta respondida diretamente (nao evasivamente)
- [ ] Evidencias sustentam a resposta
- [ ] Contra-argumento considerado
- [ ] Riscos declarados
- [ ] Confidence level atribuido

---

*Task operada por: deep-researcher (Sage)*
