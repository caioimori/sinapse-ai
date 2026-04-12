# Qualitative Research Deep Methods

> Metodologias qualitativas avançadas para pesquisa profunda. Complementa o audience-research-methods.md com abordagens de maior rigor analítico.

## Princípio Central

Pesquisa qualitativa não é "pesquisa sem números" — é pesquisa que prioriza compreensão de significado, contexto e mecanismos causais sobre quantificação de frequência. Responde "por que" e "como", não "quantos".

**Regra de ouro para seleção:**
- Fenômeno bem compreendido, quer medir frequência → Quantitativo
- Fenômeno pouco compreendido, quer entender mecanismo → Qualitativo primeiro
- Decisão de alto impacto → Misto (qualitativo para hipóteses, quantitativo para validação)

## Grounded Theory

### O Que É
Metodologia desenvolvida por Glaser e Strauss (1967) para construir teoria a partir dos dados, sem hipótese prévia. Usada quando o campo é novo e não existem frameworks suficientes.

### Processo
1. **Coleta inicial:** Entrevistas abertas ou observação sem framework pré-definido
2. **Open Coding:** Identificar conceitos nos dados (sem categorias predefinidas)
3. **Axial Coding:** Identificar relações entre os conceitos identificados
4. **Selective Coding:** Identificar categoria central que integra todos os outros conceitos
5. **Constant Comparison:** Comparar dados novos contra categorias emergentes continuamente
6. **Theoretical Saturation:** Parar quando novos dados não adicionam novas categorias (tipicamente 15-25 entrevistas)

### Quando Usar
- Explorar fenômenos novos (ex: comportamento de usuários em contexto novo)
- Gerar teoria onde não existe literatura suficiente
- Entender processos sociais complexos

### Output
Teoria substantiva: framework de relações entre conceitos que explica o fenômeno observado.

## Discourse Analysis

### O Que É
Análise de como linguagem constrói realidade social. Examina o que as pessoas dizem E o que isso revela sobre poder, identidade, normas culturais.

### Tipos

**Análise de Conteúdo (mais simples):**
- Codificar temas recorrentes em textos
- Contar frequências de conceitos
- Identificar padrões de framing

**Análise de Discurso Crítico (CDA):**
- Examinar como linguagem reflete e reproduce estruturas de poder
- Questionar "o que está implícito?" e "a quem beneficia esse framing?"
- Útil para análise de narrativas de marca, políticas e mídia

**Análise de Conversação:**
- Examinar a estrutura de interações (turnos de fala, interrupções, silêncios)
- Como acordo/desacordo são negociados
- Aplicação: UX de chatbots, customer service, comunidades online

### Aplicação em Research Comercial
- Análise de reviews: como clientes enquadram problemas e soluções
- Análise de mensagens de marketing de concorrentes: que narrativas constroem?
- Análise de discussões em comunidades: que termos usam para descrever necessidades não atendidas?

## Etnografia Digital

### O Que É
Observação participante de comunidades online para entender cultura, normas, comportamentos e significados. Adaptação da etnografia clássica para contextos digitais.

### Protocolo de Campo

**Fase 1 — Entrada (1-2 semanas):**
- Definir comunidade/plataforma de análise
- Entender estrutura, regras, hierarquia
- Identificar tipos de participantes (lurkers, contributors, power users, mods)
- Não intervir ainda

**Fase 2 — Observação Ativa (4-8 semanas):**
- Field notes: Data, hora, plataforma, quem disse, o que disse, contexto
- Mapear vocabulário específico da comunidade (jargões, memes, referências internas)
- Identificar momentos de tensão e resolução
- Capturar "rituais" da comunidade (como se cumprimentam, como tratam novatos)

**Fase 3 — Análise:**
- Temas emergentes da observação
- Comparar com declarações explícitas dos membros
- Identificar contradições entre discurso e prática

### Field Notes Template
```
Data: [YYYY-MM-DD]
Plataforma/Comunidade: [Nome]
Tópico/Thread observado: [URL ou descrição]
Contexto: [Por que este momento é relevante?]
Observação: [O que aconteceu, quem, como]
Minha interpretação: [O que isso significa?]
Questões emergentes: [O que quero entender melhor?]
Conexão com outros dados: [Links com observações anteriores]
```

## Análise Fenomenológica Interpretativa (IPA)

### O Que É
Método que explora como pessoas dão significado a experiências vividas. Desenvolvido por Jonathan Smith (1995). Muito usado em pesquisa de UX e experiência do consumidor.

### Quando Usar
- Entender a experiência subjetiva de usar um produto/serviço
- Explorar momentos críticos de decisão (por que adotou/cancelou?)
- Pesquisa de experiência do cliente em contextos emocionalmente carregados

### Processo
1. Coleta: 6-8 entrevistas semi-estruturadas em profundidade (45-90 min)
2. Transcrição verbatim
3. Leitura inicial (várias vezes) de cada transcrição
4. Notas exploratórias: o que está sendo dito, como está sendo dito
5. Temas emergentes: padrões por entrevistado
6. Temas agrupados: padrões entre entrevistados
7. Tabela final: hierarquia de temas com exemplos de quotes

### Output
Relatório interpretativo com quotes representativos organizados por tema.

## Research de Usabilidade

### Think-Aloud Protocol
Participante verbaliza pensamentos em tempo real durante uso de produto:

1. **Moderado:** Pesquisador presente, pode fazer follow-up questions
2. **Não-moderado:** Participante sozinho, gravado por software (ex: Maze, UserTesting)
3. **Retrospectivo:** Participante descreve experiência após usar

**Métricas:** Task completion rate, tempo por task, pontos de confusão, erros

### Card Sorting
Para entender como usuários categorizam informação:

| Tipo | Descrição | Quando Usar |
|------|-----------|------------|
| **Open** | Participante cria suas próprias categorias | Descobrir modelo mental do usuário |
| **Closed** | Categorias pré-definidas, participante distribui cards | Validar arquitetura de informação existente |
| **Hybrid** | Categorias base + flexibilidade para criar novas | Combinar validação e descoberta |

**Ferramenta:** Optimal Workshop, Miro, até post-its físicos

### Jobs-to-be-Done Interviews (Aprofundado)

O JTBD vai além de perguntar o que o cliente quer — explora o "job" que está tentando "contratar" o produto para fazer.

**Protocolo de entrevista (baseado em Christensen + Claire Vo):**

1. **Situação de compra/adoção:** "Me conte sobre a última vez que você [adquiriu/começou a usar] este tipo de produto"
2. **Linha do tempo:** "O que estava acontecendo na sua vida naquela época?"
3. **Primeira consulta:** "Quando percebeu pela primeira vez que precisava de algo assim?"
4. **Consideração:** "O que você considerou como opções?"
5. **Decisão:** "O que fez você escolher [produto específico]?"
6. **Força negativa:** "O que quase te impediu de avançar?"
7. **Contexto emocional:** "Como se sentiu depois de começar a usar?"

**Output:** Job statement: "Quando [situação], quero [motivação], para que [resultado esperado]"

## Análise de Entrevistas: Codificação Sistemática

### Sistema de Codificação

**Passo 1 — Código descritivo:** O que está acontecendo aqui? (sem interpretação)
> Ex: "frustração-com-onboarding", "menciona-competidor"

**Passo 2 — Código interpretativo:** O que isso significa?
> Ex: "barreira-de-adoção", "consciência-competitiva-ativa"

**Passo 3 — Padrões:** Quais códigos co-ocorrem? Quais são mais frequentes?

### Ferramentas
- **Atlas.ti / NVivo:** Software profissional de análise qualitativa
- **Dovetail:** Específico para pesquisa de usuário
- **Notion / Airtable:** Para projetos menores
- **Planilha manual:** Para <50 entrevistas

### Saturação Temática
Parar coleta quando novas entrevistas não produzem novos temas — geralmente entre 12-20 entrevistas para pesquisa de usuário. Documentar explicitamente quando saturação foi atingida.

## Rigor em Pesquisa Qualitativa

Não se usa "validade e confiabilidade" (termos quantitativos) — usa-se:

| Critério | Significado | Como Demonstrar |
|----------|-------------|-----------------|
| **Credibilidade** | Os achados representam a realidade dos participantes? | Member checking (validar com participantes), triangulação de métodos |
| **Transferibilidade** | Os achados são aplicáveis a outros contextos? | Descrição densa do contexto, limites explícitos |
| **Dependabilidade** | O processo seria replicável? | Audit trail: documentar todas as decisões metodológicas |
| **Confirmabilidade** | Achados baseados nos dados, não nos bias do pesquisador? | Reflexividade: pesquisador declara suas perspectivas prévias |

## Anti-Padrões em Pesquisa Qualitativa

| Anti-Padrão | Problema | Correção |
|-------------|----------|----------|
| "N=5 entrevistas provam que..." | Qualitativo não prova, explora | "Sugere que...", "indica que..." |
| Confirmar hipótese com exemplos seletivos | Cherry picking qualitativo | Apresentar evidência dissonante também |
| Citar quote sem contexto | Distorce significado | Incluir contexto da citação sempre |
| "Todos disseram que..." | Raramente todos dizem | "A maioria", "vários", com n explícito |
| Misturar descoberta e interpretação | Obscurece o que é dado vs análise | Separar seções "O que observamos" e "O que interpretamos" |

---

*Knowledge base da squad-research*
