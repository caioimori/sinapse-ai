---
task: create-opening-hooks
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

# Task: Create Opening Hooks

## Metadata
- **Squad:** squad-copy
- **Agent:** headline-specialist (Hook)
- **Complexity:** STANDARD
- **Depends on:** headline aprovado, copy brief
- **Feeds:** long-form-writer (Saga), conversion-writer (Spark)

## Objetivo
Criar opening hooks — as primeiras 2-3 linhas que determinam se o leitor continua ou abandona. O hook e a ponte entre o headline e o body copy.

## Entrada
- Headline aprovado
- Copy brief com audiencia e awareness level
- Formato da peca (sales letter, LP, email, article)

## Passos

### 1. Selecionar Tipo de Hook

| Hook Type | Quando Usar | Exemplo |
|-----------|-------------|---------|
| **Story** | Unaware/Problem Aware | "Em 2019, Maria quase desistiu do negocio..." |
| **Statistic** | Solution/Product Aware | "73% das empresas que usam X cresceram 2x" |
| **Question** | Problem Aware | "Ja se perguntou por que seus emails nao convertem?" |
| **Bold claim** | Product Aware | "Este metodo triplicou nosso revenue em 90 dias" |
| **Contrarian** | Solution Aware | "Tudo que voce aprendeu sobre SEO esta errado" |
| **Pain** | Problem Aware | "Voce gasta 3 horas por dia em tarefas que poderiam levar 15 minutos" |
| **Imagine** | Unaware | "Imagine acordar amanha com 1000 novos leads no inbox" |
| **Confession** | Qualquer | "Vou ser honesto: nos cometemos um erro grave" |

### 2. Escrever 10+ Variações
- Cada hook em max 2-3 linhas
- Cada um usando tipo diferente
- Conectar diretamente com headline (continuidade, nao repeticao)
- Abrir loop (curiosidade) que so fecha no body

### 3. Testar Continuidade
Para cada hook, verificar:
- Headline → Hook: transicao fluida? (leitor nao se perde?)
- Hook → Body: hook cria momentum para continuar?
- "Slippery slide" test: cada frase PUXA para a proxima?

### 4. Adaptar por Formato
- **Sales letter:** Hook mais longo (1 paragrafo), story-driven
- **Landing page:** Hook ultra-curto (1-2 linhas), benefit-focused
- **Email:** Hook personalizado, conversacional
- **Blog/Article:** Hook intrigante, educational
- **Ad:** Hook = headline (tudo em 1)

### 5. Selecionar Top 3
- Score por impacto emocional, continuidade e relevancia
- Recomendar 1 primary + 2 alternativas
- Incluir nota de adaptacao para o writer que vai usar

## Saida
- 10+ opening hooks
- Top 3 selecionados
- Adaptacoes por formato
- Notas de continuidade headline → hook → body

## Validacao
- [ ] 10+ variações com tipos diferentes
- [ ] Max 2-3 linhas cada
- [ ] Continuidade headline → hook testada
- [ ] Adaptacoes por formato
- [ ] Top 3 com justificativa

---

*Task operada por: headline-specialist (Hook)*
