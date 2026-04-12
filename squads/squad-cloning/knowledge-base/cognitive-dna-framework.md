# Cognitive DNA Framework — 5 Camadas de Extracao

> Framework central do pipeline de clonagem cognitiva. Define as 5 camadas
> que compoe o "DNA cognitivo" de uma mente e como extrair cada uma.
> Enriquecido com arquitetura de memoria agenticia (MS-009) e knowledge graph modeling.

---

## Visao Geral

Toda mente opera em 5 camadas interconectadas. A extracao completa dessas camadas
permite reproduzir como a pessoa pensa, decide, trabalha, comunica e conecta ideias.

| Layer | Nome | O que captura | Exemplo |
|-------|------|--------------|---------|
| 1 | Mental Models | Frameworks e analogias para entender o mundo | "Negocios sao como jogos infinitos" |
| 2 | Heuristics & Decision Rules | Regras if/then e criterios de decisao | "Se o CAC > 1/3 do LTV, pare de escalar" |
| 3 | Workflows & Processes | Processos step-by-step e metodologias | "Meu lancamento tem 7 fases..." |
| 4 | Communication Patterns | Vocabulario, tom, metaforas, estilo | Uso frequente de "leverage", tom direto |
| 5 | Meta-patterns | Padroes de padroes, conexoes cross-domain | Principio de "simplicidade" aparece em todas as layers |

### Mapeamento para Arquitetura de Memoria Agenticia

Cada layer mapeia para um tipo de memoria que o clone precisa ter operacional:

| Layer | Tipo de Memoria | Storage Tier | Referencia |
|-------|----------------|-------------|-----------|
| L1: Mental Models | Semantic Memory (conhecimento permanente) | WARM/COLD (graph) | Graphiti, A-Mem |
| L2: Heuristics | Semantic + Procedural (regras de decisao) | WARM (vector + graph) | Mem0, ContextForge |
| L3: Workflows | Procedural Memory (como fazer) | HOT durante tarefa, COLD senao | Letta Memory Blocks |
| L4: Communication | Semantic + Working Memory (estilo ativo) | HOT (sempre no contexto) | System prompt |
| L5: Meta-patterns | Episodic + Semantic (padrao de padroes) | COLD (recuperado sob demanda) | Knowledge Graph |

---

## Layer 1: Mental Models

### O que buscar
- Analogias recorrentes ("X e como Y")
- Frameworks nomeados ("Meu modelo de 4 pilares...")
- Worldview statements ("O mundo funciona assim...")
- Metaforas estruturais (guerra, jogo, construcao, jardim)

### Tecnicas de extracao
1. **Busca por analogias:** Grep por "como", "igual a", "e tipo", "penso em X como"
2. **Busca por frameworks nomeados:** Grep por "meu modelo", "meu framework", "minha metodologia"
3. **Busca por worldview:** Grep por "eu acredito", "a verdade e", "o segredo e"
4. **Analise de recorrencia:** Contar quantas vezes a mesma analogia aparece em fontes diferentes

### Criterios de qualidade
- Min 5 mental models (Tier 1), 10 (Tier 2), 15 (Tier 3)
- Cada model deve aparecer em 2+ fontes para ser [INFERIDO]
- Citacao direta da pessoa = [DIRETO]
- Model inferido de 1 fonte = [HIPOTESE]

---

## Layer 2: Heuristics & Decision Rules

### O que buscar
- Regras if/then explicitas ("Se X acontece, eu faco Y")
- Thresholds numericos ("Nunca gasto mais que 30% do budget em...")
- Criterios de decisao ("Antes de contratar, eu verifico 3 coisas...")
- Anti-patterns ("Eu NUNCA faco X porque...")
- Prioridades ("Se preciso escolher entre A e B, sempre escolho A")

### Tecnicas de extracao
1. **Busca por regras:** Grep por "minha regra", "eu sempre", "eu nunca", "se/entao"
2. **Busca por numeros:** Grep por percentuais, valores, thresholds
3. **Busca por decisoes passadas:** "Naquela situacao eu decidi..." → extrair regra implicita
4. **Busca por conselhos repetidos:** O que a pessoa SEMPRE recomenda?

### Criterios de qualidade
- Min 8 heuristics (Tier 1), 15 (Tier 2), 25 (Tier 3)
- Heuristics devem ser actionable (trigger + action)
- Rationale deve ser da propria pessoa, nao inventado

---

## Layer 3: Workflows & Processes

### O que buscar
- Processos step-by-step ("Primeiro eu faco X, depois Y, depois Z")
- Metodologias nomeadas ("Meu processo de lancamento em 7 etapas")
- Rotinas ("Toda manha eu...")
- Templates mentais ("Quando recebo um brief, eu sempre comeco por...")
- Sequencias de decisao ("Antes de investir, passo por este checklist...")

### Tecnicas de extracao
1. **Busca por sequencias:** Grep por "primeiro", "depois", "em seguida", "passo 1"
2. **Busca por processos nomeados:** Grep por "meu processo", "minha metodologia"
3. **Reconstrucao de workflow:** De exemplos concretos, extrair o processo abstrato
4. **Validacao cross-fonte:** O mesmo processo aparece em contextos diferentes?

### Criterios de qualidade
- Min 3 workflows (Tier 1), 5 (Tier 2), 8 (Tier 3)
- Cada workflow deve ter steps ordenados
- Workflows devem ser reproductiveis por outra pessoa

---

## Layer 4: Communication Patterns

### O que buscar
- **Vocabulario:** Palavras e expressoes favoritas, jargao proprio
- **Tom:** Formal/informal, direto/diplomatico, tecnico/popular
- **Metaforas recorrentes:** "Guerra", "jogo", "construcao", "viagem"
- **Storytelling style:** Conta historias pessoais? Usa dados? Faz perguntas retoricas?
- **Catchphrases:** Frases assinatura que repete frequentemente
- **Estrutura de argumento:** Como constroi argumentos (premissa → evidencia → conclusao?)

### Tecnicas de extracao
1. **Word frequency analysis:** Palavras mais usadas (excluindo stop words)
2. **Phrase mining:** Expressoes que aparecem 3+ vezes
3. **Tom analysis:** Classificar tom em escala (formal ←→ informal, direto ←→ diplomatico)
4. **Story pattern:** Como comeca, desenvolve e conclui narrativas

### Criterios de qualidade
- Vocabulario: min 20 palavras/expressoes caracteristicas
- Tom: descricao clara e exemplificada
- Catchphrases: pelo menos 5 (Tier 2+)
- Storytelling style: descricao com exemplos

---

## Layer 5: Meta-patterns

### O que buscar
- **Principios unificadores:** Um principio que explica multiplos mental models
- **Evolucao temporal:** Como o pensamento mudou ao longo do tempo
- **Conexoes cross-domain:** Mesma logica aplicada em contextos diferentes
- **Tensoes produtivas:** Duas crencas aparentemente opostas que coexistem
- **Core axioms:** O axioma fundamental de onde tudo deriva

### Tecnicas de extracao
1. **Cross-layer analysis:** Que principio aparece nas Layers 1, 2 E 3?
2. **Timeline analysis:** Comparar falas antigas vs recentes
3. **Contradiction resolution:** A contradicao revela um meta-pattern?
4. **Abstraction ladder:** Subir niveis de abstracao ate encontrar o principio raiz

### Criterios de qualidade
- Min 0 meta-patterns (Tier 1), 3 (Tier 2), 5 (Tier 3)
- Cada meta-pattern deve referenciar 2+ layers
- Core axiom identificado (Tier 3)

---

## Layer 6 (Extendida): Failure Modes & Boundaries

> Camada adicional para clones de alta fidelidade (Tier 3). Captura os limites
> operacionais genuinos da pessoa — onde ela nao sabe, erra, ou recusa ir.

### O que buscar
- Temas que a pessoa **evita** deliberadamente
- Areas onde admite incerteza ou ignora ("nao e minha area")
- Erros documentados e como respondeu a eles
- Contradicoes que persistem sem resolucao
- Limites eticos ou de valores que nunca negocia

### Por que importa
Um clone sem failure modes e um oracle — gera respostas em areas que o original
nunca dominou. Isso viola o principio de honestidade cognitiva e produz um
"frankenstein" de conhecimento fabricado misturado com real.

### Tecnicas de extracao
1. **Busca por rejeicoes:** Grep por "nao e minha area", "prefiro nao opinar", "nao sei"
2. **Analise de gaps tematicos:** Que topicos a pessoa nao discute em 100h+ de conteudo?
3. **Analise de erros publicos:** Casos onde a pessoa errou — como reagiu?
4. **Declaracoes de limite:** "Eu me foco apenas em X, nao em Y"

### Aplicacao no agente
```yaml
failure_modes:
  - domain: "Tributacao/contabilidade"
    behavior: "Diz explicitamente que nao e contador, redireciona"
    source: "[DIRETO] Podcast EP 45: 'Isso vai pro meu CPA'"
  - domain: "Analise tecnica de acoes"
    behavior: "Admite nao usar AT, foca em fundamentos"
    source: "[INFERIDO] Nunca discute TA em 80h de conteudo"
```

---

## Tags de Confianca

| Tag | Significado | Criterio |
|-----|------------|---------|
| [DIRETO] | Citacao literal da pessoa | Transcricao propria, citacao entre aspas |
| [INFERIDO] | Padrao observado em 3+ fontes | Mesmo conceito em contextos diferentes |
| [HIPOTESE] | Extraido de 1 fonte ou inferido | Precisa validacao adicional |

**Regra de ouro:** Na duvida, use a tag MAIS conservadora.

---

## Tecnicas de Entrevista para Extracao Profunda

Quando o target esta disponivel para entrevista direta (raro, mas possivel):

### Framework de 5 Atos (entrevista cognitiva)

**Ato 1 — Calibracao (5-10 min)**
Perguntas simples sobre area de dominio para estabelecer baseline de linguagem e tom.
"Descreva sua semana de trabalho ideal em uma palavra."

**Ato 2 — Frameworks (15-20 min)**
"Quando voce enfrenta X tipo de problema, como voce estrutura sua abordagem?"
"Quais sao os criterios que voce usa para decidir Y?"
Objetivo: extrair L1 (Mental Models) e L2 (Heuristics)

**Ato 3 — Workflows (15-20 min)**
"Me explica como voce fez [projeto especifico] do zero."
"Se voce tivesse que ensinar alguem a fazer o que voce faz, quais seriam os primeiros 3 passos?"
Objetivo: extrair L3 (Workflows) com alta confianca [DIRETO]

**Ato 4 — Limites e Erros (10-15 min)**
"Qual foi seu maior erro em [dominio]? O que voce faria diferente?"
"Em que areas voce deliberadamente evita dar opiniao?"
Objetivo: extrair L6 (Failure Modes) e calibrar com honestidade

**Ato 5 — Arquetipos e Metaforas (10 min)**
"Se o seu trabalho fosse um esporte, qual seria?"
"Qual o livro que mais influenciou sua forma de pensar?"
Objetivo: revelar L5 (Meta-patterns) via projecao

### Tecnicas de Elicitacao Indireta (sem entrevista)

Para Classe C e D (pouco conteudo disponivel):

1. **Analise de terceiros que o estudam:** Podcasters que o entrevistam, academicos que o citam — o que eles dizem sobre como ele pensa?
2. **Pattern de perguntas que recebe:** Em Q&As, que tipo de pergunta ele recebe mais? Revela o que o publico percebe como sua expertise.
3. **Analise de decisoes documentadas:** Cases publicos onde ele tomou decisoes — reconstruir o processo de decisao retroativamente.
4. **Comparacao cross-temporal:** Como ele falava sobre X em 2018 vs 2024? A evolucao revela meta-patterns.
