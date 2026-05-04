---
task: write-subheadlines-and-deck-copy
responsavel: "@headline-specialist"
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

# Task: Write Subheadlines and Deck Copy

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** headline principal aprovado
- **Feeds:** long-form-writer (Saga), conversion-writer (Spark)

## Objetivo
Criar subheadlines e deck copy que sustentam o headline principal — expandindo a promessa sem revelar tudo, mantendo momentum de leitura.

## Entrada
- Headline aprovado
- Copy brief com message hierarchy
- Key benefits e proof points

## Passos

### 1. Subheadline (Deck Copy)
- Expande o headline com mais contexto
- **Formato:** 1-2 linhas que adicionam ESPECIFICIDADE
- **Relacao com headline:**
  - Headline = curiosidade → Subheadline = beneficio
  - Headline = beneficio → Subheadline = prova
  - Headline = bold claim → Subheadline = qualificacao
- **Teste:** Headline + subheadline juntos comunicam a proposta core?

### 2. Section Subheadlines (Body Copy)
- Cada secao do body copy tem um subheadline
- Funcao: guide scanners (60% das pessoas scanneiam antes de ler)
- **Regra:** Se ler APENAS os subheadlines, a narrativa faz sentido?
- Cada subheadline deve ser um mini-headline (gerar interesse solo)

### 3. Escrever Para Scanners
- **F-Pattern:** Conteudo mais importante no inicio de cada secao
- **Subheadlines como signposts:** Indicam o que o leitor vai encontrar
- **Pull quotes / callout boxes:** Para dados impactantes
- **Bold key phrases:** Para scanning rapido

### 4. Subheadline Patterns
- **Benefit expansion:** "Como [resultado] em [prazo] sem [objecao]"
- **Proof point:** "Baseado em [N] clientes e [tempo] de testes"
- **Curiosity build:** "O que [discovery] revela sobre [topic]"
- **Transition:** "Mas primeiro, voce precisa entender [context]..."
- **Social proof:** "Usado por [N] [audiencia] em [N] paises"

### 5. Hierarchy Visual
```
HEADLINE (captura atencao)
  └── Subheadline/Deck (expande promessa)
      └── Section Subheadline 1 (problema)
      └── Section Subheadline 2 (solucao)
      └── Section Subheadline 3 (prova)
      └── Section Subheadline 4 (oferta)
      └── CTA headline (acao)
```

## Saida
- Subheadline/deck copy (1-2 linhas)
- Section subheadlines (5-8 para body copy)
- Scanning flow testado
- Hierarchy visual completa

## Validacao
- [ ] Subheadline expande headline (nao repete)
- [ ] Section subheadlines contam a historia sozinhos
- [ ] F-Pattern scanning optimizado
- [ ] Hierarchy visual coherente
- [ ] Cada subheadline funciona como mini-headline

---

*Task operada por: headline-specialist (Hook)*
