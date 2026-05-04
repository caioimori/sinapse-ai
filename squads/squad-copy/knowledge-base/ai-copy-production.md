# AI Copy Production

> Fonte primaria: MS-008 (secao 11) — AI Content Production.
> Frameworks e workflows para producao de copy com assistencia de IA.
> Principio central: IA acelera, humano aperfecoa.

---

## 1. Posicionamento Correto de IA em Copy

### O Que IA Faz Bem
| Tarefa | Qualidade | Necessidade de Revisao |
|--------|-----------|----------------------|
| Brainstorm de angulos e hooks | Excelente | Leve (curadoria) |
| Variacoes de headline (10-25 options) | Muito bom | Leve (selecao) |
| Rascunho de estrutura/outline | Excelente | Leve |
| Subject lines de email (variacoes) | Muito bom | Leve (A/B test) |
| Variacoes de CTA | Bom | Moderada |
| Social media copy | Bom | Moderada (tom, contexto) |
| Traducao e adaptacao PT-BR | Muito bom | Moderada (nuances culturais) |
| Edicao e reescrita | Excelente | Leve |
| SEO optimization (keywords, headings, meta) | Muito bom | Leve |
| Rascunho de body copy | Bom | Substancial (voz, fatos, originalidade) |
| Conteudo tecnico especializado | Variavel | Substancial |

### O Que IA NAO Faz (Onde Humano e Insubstituivel)
| Elemento | Por que IA Falha |
|----------|-----------------|
| Experiencia de primeira mao | IA nao viveu, nao testou, nao errou — copy de "eu fiz isso" e falso |
| Opiniao genuinamente controversa | IA tende ao consenso e meio-termo |
| Contexto cultural local (Brasil) | Nuances de gírias, regionalismos, referencias culturais escapam |
| Emocao autentica | IA simula emocao — leitores experientes percebem |
| Julgamento editorial (o que NAO incluir) | O que cortar e tao importante quanto o que escrever |
| Checagem de fatos | IA alucina — NUNCA confiar em dados sem verificacao |

---

## 2. Framework CRAFT — Prompt Engineering para Copy

Framework padrao para construir prompts de copy com LLMs.
Fonte: MS-008, secao 11.5.

```
C — Context: Quem voce e, para quem esta escrevendo, qual o canal
R — Role: Que papel a IA deve assumir (copywriter, editor, estrategista)
A — Action: O que exatamente precisa ser feito
F — Format: Formato desejado (email, headline list, social post, landing page section)
T — Tone: Tom de voz desejado com exemplos de referencia
```

### Template de Prompt CRAFT

```
[CONTEXT]
Sou [seu cargo] de [tipo de empresa].
Meu produto/servico: [descricao em 1-2 frases].
Meu publico: [persona especifica — cargo, situacao, dor].
Canal: [email / landing page / ad / social post].

[ROLE]
Voce e um copywriter senior especializado em [nicho/formato].
Seu estilo de referencia: [mencionar autor/marca como referencia de tom].

[ACTION]
Crie [o que precisa] para [objetivo especifico].

[FORMAT]
Formato desejado: [lista numerada / paragrafo / estrutura especifica].
Extensao: [N palavras / N opcoes / N variacoes].
Restricoes: [nao mencionar X / sempre incluir Y / evitar Z].

[TONE]
Tom: [profissional mas acessivel / urgente mas nao agressivo / etc].
Exemplos de referencia de tom: [inserir 1-2 exemplos que voce aprovou].
```

### Exemplo Real de Prompt CRAFT

```
CONTEXT: Sou head de marketing de um SaaS B2B de gestao financeira para PMEs.
Produto: plataforma que automatiza conciliacoes bancarias e fechamento contabil.
Publico: CFOs e controllers de empresas 50-500 funcionarios, sobrecarga de planilhas.
Canal: sequencia de 5 emails de nurturing para leads que baixaram nosso ebook.

ROLE: Voce e um copywriter de email marketing com 10 anos de experiencia em B2B SaaS.
Tom de referencia: similar ao blog da Conta Azul — profissional mas acessivel.

ACTION: Escreva as subject lines + primeiras 3 frases (opening) para cada um dos 5 emails.
Emails 1-3 sao educativos (sem venda). Email 4 introduz o produto. Email 5 e CTA direto.

FORMAT:
- 3 opcoes de subject line por email (max 50 chars cada)
- Preview text para cada subject (max 90 chars)
- Opening line: 2-3 frases

TONE: Profissional, direto, sem jargao excessivo.
Como um CFO experiente conversando com um colega — sem simplificar demais, mas sem enrolacao.
```

---

## 3. Workflows de Copy com IA

### Workflow 1: Headlines em Volume (para teste A/B)
```
1. [HUMANO] Define: produto, promessa principal, avatar, canal
2. [IA] Gera 25 headlines usando diferentes formulas (CRAFT prompt)
3. [HUMANO] Seleciona 5-8 melhores, descarta o resto
4. [IA] Expande e refina as selecionadas (mais especificidade, mais urgencia, etc)
5. [HUMANO] Escolhe top 3-5 para teste
6. [A/B TEST] Valida com dados reais
```

### Workflow 2: Email de Alta Conversao
```
1. [HUMANO] Define: objetivo, audience awareness level, oferta, urgencia real
2. [IA] Brainstorm de angulos e abordagens (3-5 opcoes de approach)
3. [HUMANO] Escolhe o angulo mais alinhado
4. [IA] Gera rascunho completo (subject, preview, opening, body, CTA, PS)
5. [HUMANO] Reescreve com voz propria, adiciona detalhes pessoais/dados especificos
6. [IA] Versao editada passa por revisao de clareza e readability
7. [HUMANO] Aprovacao final e envio
```

### Workflow 3: Landing Page Section por Section
```
1. [HUMANO] Define wireframe da page + awareness level do trafego
2. Para cada secao:
   a. [IA] Gera 2-3 versoes de copy para a secao
   b. [HUMANO] Seleciona e reescreve com especificidades do produto real
3. [IA] Revisao de coerencia entre secoes
4. [HUMANO] Leitura completa — garante que e uma narrativa, nao secoes soltas
5. [IA] Versao final passa por checklist de copy (headlines, CTAs, prova, objecoes)
```

### Workflow 4: Repurposing de Conteudo
```
1. [HUMANO] Fornece o conteudo original (blog post, podcast transcript, etc)
2. [IA] Gera versoes para diferentes canais:
   - 3 posts de LinkedIn com diferentes angulos
   - 5 tweets/X posts extraindo insights
   - 1 thread completa
   - Subject line + email resumo
   - 3 hooks para short-form video
3. [HUMANO] Adapta ton por plataforma, adiciona contexto, aprova
```

---

## 4. Prompts Especializados por Formato

### Prompt para Variacoes de Headline (Ad Copy)
```
Produto: [X]
Beneficio principal: [Y]
Avatar: [Z]
Canal: Meta Ads (feed)

Gere 20 headlines seguindo estas formulas:
- 5 usando PAS (problema-agitacao-solucao)
- 5 usando curiosity gap
- 5 usando numeros/resultado especifico
- 5 usando before/after

Cada headline < 40 caracteres. Sem pontuacao excessiva.
```

### Prompt para Subject Lines de Email
```
Email sobre: [topico/oferta]
Lista: [subscribers que ja conhecem a marca / lista fria]
Objetivo do email: [nutricao / venda / anuncio / conteudo]
Tom da marca: [formal / conversacional / bold]

Gere 15 subject lines com mix de:
- Curiosidade (5 options)
- Urgencia/escassez real (3 options)
- Beneficio direto (4 options)
- Pergunta (3 options)

Cada subject < 50 chars. Evitar palavras spam-trigger.
```

### Prompt para CTA Variations
```
Landing page de: [produto/servico]
Acao desejada: [compra / trial / demo / download]
Nivel de comprometimento: [alto / medio / baixo]
Tom: [direto / suave / urgente]

Gere 10 variacoes de CTA copy para o botao principal.
Mix de: beneficio-focused, action-focused, fear-of-missing-out.
Cada CTA: 2-5 palavras.
```

---

## 5. Verificacao de Qualidade — Checklist Pos-IA

Antes de aprovar qualquer copy gerada por IA:

```
AUTENTICIDADE:
[ ] Tem voz humana especifica (nao soa como template generico)?
[ ] Inclui detalhes reais (numeros, nomes, casos especificos)?
[ ] Evita cliches corporativos ("sinergia", "solucao robusta", "world-class")?

PRECISAO:
[ ] Todos os dados e fatos foram verificados?
[ ] Nenhuma alegacao sem prova?
[ ] Links e referencias estao corretos?

ALINHAMENTO:
[ ] Condiz com o awareness level do publico?
[ ] Tom esta alinhado com brand voice?
[ ] Promessas sao reais e deliverable?

COPY QUALITY:
[ ] Headline passa no scoring matrix (3.5+)?
[ ] CTA e especifico e tem beneficio claro?
[ ] Uma unica ideia central? (nao 3 mensagens em uma)
[ ] Prova social presente se necessario?
[ ] Objecoes respondidas?

TECNICO:
[ ] Subject line < 50 chars?
[ ] CTA < 5 palavras?
[ ] Paragrafos < 4 linhas?
```

---

## 6. Etica e Disclosure de IA em Copy

### Posicionamentos (2025-2026)
- **Google:** Nao penaliza copy gerada por IA — penaliza baixa qualidade. E-E-A-T continua sendo o criterio.
- **Meta Ads:** Nao exige disclosure de IA em ads.
- **Emails:** Nenhuma lei brasileira exige disclosure de IA no conteudo de emails.
- **CONAR (Brasil):** Ainda sem regulamentacao especifica para IA em publicidade.

### Recomendacao Pratica
Use IA como ferramenta de aceleracao, sempre revise e adicione perspectiva humana real.
A melhor copy e indistinguivel — parece escrita por um humano que se importa.

### Quando Declarar Uso de IA
- Conteudo academico ou cientifico: sim, sempre
- Newsletters personais de criadores: transparencia e recomendada para audiencia engajada
- Copy de produto/marketing: nao ha obrigacao, mas "human-reviewed" pode ser diferencial

## Referencias
- MS-008 Content Research (secao 11)
- Claude AI Documentation — Anthropic
- "Everybody Writes" — Ann Handley (principios de escrita que IA nao substitui)
- Content Marketing Institute — AI in Content Reports (2025)
