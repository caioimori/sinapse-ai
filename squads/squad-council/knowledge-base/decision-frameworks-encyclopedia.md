# Decision Frameworks Encyclopedia

## Purpose
Enciclopedia abrangente de frameworks de decisao de alto impacto. Referencia primaria para situacoes onde clareza, velocidade e qualidade decisoria sao criticas. Compilado dos modelos de Munger, Dalio, Thiel, Naval, e da ciencia cognitiva moderna.

---

## TIER 1: FRAMEWORKS FUNDAMENTAIS (sempre aplicar)

### 1. Inversion (Jacobi / Munger)
- **Originator**: Carl Gustav Jacobi, popularizado por Charlie Munger
- **When to Use**: Qualquer decisao de alto impacto; especialmente quando se busca um caminho para o sucesso
- **How to Apply**:
  1. Defina o objetivo desejado
  2. Pergunte: "O que garantiria o fracasso?"
  3. Liste todas as causas de fracasso possiveis
  4. Crie um plano para EVITAR cada uma delas
  5. O plano residual e o caminho para o sucesso
- **Example Application**: Lancamento de produto — em vez de perguntar "como ter sucesso?", pergunte "o que faria este produto falhar?" (preco errado, distribuicao fraca, problema nao real, timing ruim). Elimine cada um.
- **Key Metrics**: Numero de failure modes identificados; coverage de mitigacao
- **Cross-References**: Mental Model #13 (Inversion), Checklist Methodology, Pre-mortem Analysis

---

### 2. Second-Order Thinking
- **Originator**: Howard Marks (Oaktree Capital); sistematizado por Shane Parrish (Farnam Street)
- **When to Use**: Decisoes com consequencias a longo prazo; politicas e estrategias; intervencoes em sistemas complexos
- **How to Apply**:
  1. Identifique a consequencia imediata de 1a ordem: "E depois?"
  2. Para cada consequencia de 1a ordem, pergunte novamente: "E depois disso?"
  3. Continue por pelo menos 3 niveis
  4. Identifique onde 2a/3a ordem INVERTE a conclusao de 1a ordem
  5. Decida considerando o portfolio de consequencias
- **Example Application**: Cortar preco (1a ordem: mais clientes) → guerra de precos no mercado (2a ordem) → comoditizacao da categoria (3a ordem) → destruicao de margem para todos. Conclusao: nao cortar preco sem estrategia de saida.
- **Key Metrics**: Profundidade de analise (minimo 3 niveis); surpresas identificadas vs. surpresas ocorridas
- **Cross-References**: Systems Thinking, Feedback Loops, Pre-mortem

---

### 3. Pre-mortem Analysis (Gary Klein)
- **Originator**: Gary Klein (psicologia cognitiva)
- **When to Use**: Antes de qualquer projeto, lancamento, ou decisao estrategica importante
- **How to Apply**:
  1. Imagine que e 12 meses no futuro e o projeto FALHOU completamente
  2. Escreva a historia de como o fracasso ocorreu (sem filtros)
  3. Cada participante da equipe escreve sua versao independentemente
  4. Agregue os cenarios de fracasso
  5. Converta os cenarios em riscos e mitigacoes proativas
- **Example Application**: Pre-mortem de lancamento de SaaS: "Lancamos, mas em 6 meses nao temos clientes pagantes. Por que?" Respostas tipicas: onboarding confuso, preco errado, ICP errado, falta de distribuicao. Cada uma vira item de checklist pre-lancamento.
- **Key Metrics**: Numero de riscos identificados; percentual mitigados antes do lancamento; acuracia preditiva post-mortem
- **Cross-References**: Inversion, Checklist Methodology, Dalio's 5-Step Process

---

### 4. Bayesian Reasoning (Thomas Bayes)
- **Originator**: Thomas Bayes / Richard Price
- **When to Use**: Atualizacao de crencas com novas evidencias; estimativas sob incerteza; avaliacao de hipoteses
- **How to Apply**:
  1. Defina hipotese H e evidencia E
  2. Estime P(H) — probabilidade prior da hipotese
  3. Estime P(E|H) — probabilidade da evidencia SE a hipotese for verdadeira
  4. Estime P(E|~H) — probabilidade da evidencia SE a hipotese for falsa
  5. Calcule: P(H|E) = P(E|H) * P(H) / [P(E|H)*P(H) + P(E|~H)*P(~H)]
  6. Use P(H|E) como novo prior
- **Example Application**: "Nossa solucao resolve o problema real do cliente?" Prior: 40%. Evidencia: 3 clientes pagaram sem desconto. P(E|H) = 80%. P(E|~H) = 10%. Posterior: P(H|E) = (0.8*0.4) / (0.8*0.4 + 0.1*0.6) = 0.32/0.38 = 84%. Confinca aumenta significativamente.
- **Key Metrics**: Calibracao de probabilidades (frequentista vs. bayesiano); Brier Score
- **Cross-References**: Expected Value, Dalio's Believability Weighting, Munger's Checklist

---

### 5. First Principles Thinking (Aristotle / Thiel / Musk)
- **Originator**: Aristoteles; modernizado por Elon Musk, Peter Thiel, Richard Feynman
- **When to Use**: Inovacao real; quando analogias limitam o pensamento; quando o custo convencional parece imutavel
- **How to Apply**:
  1. Identifique o problema ou objetivo
  2. Quebre em suas partes constituintes mais basicas
  3. Para cada parte, pergunte: "Isso e inevitavelmente verdade, ou e apenas convencao?"
  4. Reconstrua a solucao a partir dos principios fundamentais verificados
  5. Compare com a solucao convencional — onde divergem?
- **Example Application**: Musk e baterias de EVs: o custo convencional era $600/kWh. Decomposto: litio, niquel, aluminio, polimeros — todos commodities. Custo real dos materiais: $80/kWh. Logo: o problema e manufatura, nao fisica. SpaceX: foguetes custam $65M. Por analogia, impossivel de reduzir. Por primeiros principios: aco, aluminio, titanio + avionics. Custo real dos materiais: ~$2M. Margem de reducao enorme.
- **Key Metrics**: Reducao de custo vs. benchmark; grau de inovacao (0=incremental, 10=paradigma novo)
- **Cross-References**: Zero to One (Thiel), Specific Knowledge (Naval), Inversion

---

## TIER 2: FRAMEWORKS DE ESTRUTURACAO DE DECISAO

### 6. Decision Journal (Annie Duke / Shane Parrish)
- **Originator**: Annie Duke (ex-poker profissional, autora de "Thinking in Bets")
- **When to Use**: Qualquer decisao com consequencias significativas e incerteza relevante
- **How to Apply**:
  1. ANTES da decisao: escreva (a) qual e a decisao, (b) quais opcoes foram consideradas, (c) qual a logica da escolha, (d) qual resultado voce espera e com que probabilidade, (e) como saberemos se foi boa decisao
  2. DEPOIS (3-12 meses): registre o resultado real
  3. Compare resultado vs. previsao
  4. Distingua: boa decisao com resultado ruim (azar) vs. ma decisao com resultado bom (sorte)
- **Example Application**: Decisao de contratar CFO agora vs. em 6 meses. Registro: opcoes consideradas, probabilidade de necessidade em <6 meses (70%), probabilidade de candidato ideal disponivel (40%), custo de atraso ($50K em ineficiencias). Revisao 6 meses depois: CFO contratado, economias reais de $80K. Decisao validada.
- **Key Metrics**: Calibracao de probabilidades ao longo do tempo; frequencia de atualizacao de modelo mental
- **Cross-References**: Bayesian Reasoning, Dalio's Principles, Pain + Reflection = Progress

---

### 7. 10/10/10 Framework (Suzy Welch)
- **Originator**: Suzy Welch (jornalista, autora)
- **When to Use**: Decisoes emocionalmente carregadas; quando o curto prazo distorce o longo prazo
- **How to Apply**:
  1. Como me sentirei sobre esta decisao em 10 MINUTOS?
  2. Como me sentirei sobre esta decisao em 10 MESES?
  3. Como me sentirei sobre esta decisao em 10 ANOS?
  4. Decida com base na perspectiva temporal mais relevante para o contexto
- **Example Application**: Recusar um cliente ruim mas lucrativo. 10 min: alívio misturado com medo. 10 meses: liberacao de energia para clientes melhores. 10 anos: decisao que definiu posicionamento premium da empresa.
- **Key Metrics**: Divergencia entre resposta de 10 minutos e 10 anos (maior divergencia = mais viés emocional)
- **Cross-References**: Hell Yeah or No (Sivers), Regret Minimization (Bezos), Long-term Games (Naval)

---

### 8. Regret Minimization Framework (Jeff Bezos)
- **Originator**: Jeff Bezos
- **When to Use**: Grandes decisoes de carreira e vida; escolhas irreversiveis; quando o medo paralisa
- **How to Apply**:
  1. Projete-se para os 80 anos de idade
  2. Olhe para tras, para esta decisao
  3. Pergunte: "Vou me arrepender de NAO ter feito isso?"
  4. Se a resposta for sim com alta confianca: faca
  5. Se a resposta for incerta ou nao: use outros frameworks
- **Example Application**: Bezos largou Wall Street para fundar Amazon (1994). "Vou me arrepender de nao ter tentado participar da Internet Revolution?" Sim, claramente. Logo: aceitar o risco.
- **Key Metrics**: Clareza da resposta (alta clareza = forte sinal); frequencia de uso (nao use para micro-decisoes)
- **Cross-References**: 10/10/10, Hell Yeah or No, Long-term Thinking (Naval)

---

### 9. Type 1 vs Type 2 Decisions (Jeff Bezos / Amazon)
- **Originator**: Jeff Bezos (Letters to Shareholders)
- **When to Use**: Antes de qualquer processo de decisao, para calibrar profundidade do processo
- **How to Apply**:
  1. Classifique: e Type 1 (irreversivel, alto impacto) ou Type 2 (reversivel, baixo risco)?
  2. Type 1: processo rigoroso, consulta ampla, tempo adequado, documentacao completa
  3. Type 2: processo rapido, one-way door tratado como two-way door = lentidao organizacional desnecessaria
  4. A maioria das decisoes e Type 2 — trate como tal
- **Example Application**: Escolha de stack tecnologica (Type 1 para muitos casos): processo rigoroso, arquiteto + tech lead + CEO alinhados. Escolha de fornecedor de catering para evento (Type 2): um responsavel, decide em 24h.
- **Key Metrics**: Tempo medio de decisao por tipo; frequencia de reversao de Type 2 (deve ser baixa se classificacao correta)
- **Cross-References**: Blitzscaling (aceitar mais Type 2), Dalio's 5-Step, Circle of Competence

---

### 10. OODA Loop (John Boyd)
- **Originator**: Col. John Boyd (USAF — fighter pilot strategy)
- **When to Use**: Ambientes de alta velocidade e incerteza; competicao acirrada; situacoes de crise
- **How to Apply**:
  1. **Observe**: Colete dados brutos do ambiente (sem filtros ainda)
  2. **Orient**: Processe atraves de modelos mentais, experiencias, cultura, analises
  3. **Decide**: Selecione hipotese de acao
  4. **Act**: Execute rapidamente
  5. Re-observe resultados e repita o loop
  6. Objetivo: ciclar mais rapido que o adversario
- **Example Application**: Startup em mercado competitivo. Observe: concorrente lancou feature similar. Orient: nossa implementacao e 10x mais rapida e intuitiva (dado de teste). Decide: acelerar lancamento, nao esperar perfeicao. Act: lancamento em 2 semanas vs. plano de 6. Observe: NPS 8.2, concorrente perde 3 contas nos proximos 30 dias.
- **Key Metrics**: Velocidade do ciclo (tempo Observe → Act); acuracia de Orient (hipoteses corretas / total)
- **Cross-References**: Blitzscaling (velocidade > eficiencia), Permanent Beta (Hoffman), YOLO Mode

---

### 11. Munger's 25 Cognitive Biases Checklist
- **Originator**: Charlie Munger (Harvard Law commencement speech, 1995; Poor Charlie's Almanack)
- **When to Use**: Antes de qualquer decisao importante; ao revisar o trabalho de outros
- **How to Apply**:
  Execute mentalmente cada bias relevante:
  1. Reward/Punishment Superresponse — quem se beneficia desta decisao?
  2. Liking/Loving Bias — estou decidindo pelo produto ou pela pessoa?
  3. Disliking/Hating Bias — estou rejeitando boas ideias de pessoas que nao gosto?
  4. Doubt-Avoidance Tendency — estou decidindo rapido demais para aliviar desconforto?
  5. Inconsistency-Avoidance — estou preso a uma decisao anterior que deveria ser revisada?
  6. Curiosity Tendency — tenho curiosidade suficiente sobre o que nao sei?
  7. Kantian Fairness Tendency — estou sendo justo de forma consistente?
  8. Envy/Jealousy Tendency — esta decisao e influenciada por inveja?
  9. Reciprocation Tendency — estou retribuindo um favor quando deveria ser neutro?
  10. Influence-from-Mere-Association — estou associando qualidade a um nome famoso?
  11. Simple Pain/Avoiding Denial — estou evitando uma verdade dolorosa?
  12. Excessive Self-Regard — estou superestimando minhas capacidades aqui?
  13. Overoptimism Tendency — estou sendo excessivamente otimista?
  14. Deprival/Superreaction — estou reagindo de forma desproporcional a uma perda?
  15. Social Proof Tendency — estou seguindo a massa sem razao propria?
  16. Contrast Misreaction — a ultima opcao parece melhor apenas por contraste?
  17. Stress-Influence Tendency — estou sob estresse que distorce meu julgamento?
  18. Availability-Misweighing — estou supervalorizando informacao facilmente acessivel?
  19. Use-It-or-Lose-It Tendency — estou usando habilidades que podem estar enferrujadas?
  20. Drug/Withdrawal Misinfluence — ha dependencias ou vinculos que distorcem?
  21. Senescence-Misinfluence — estou com pensamento rigido por habito?
  22. Authority-Misinfluence — estou seguindo autoridade sem questionar?
  23. Twaddle Tendency — estou sendo influenciado por conversa sem substancia?
  24. Reason-Respecting Tendency — estou aceitando razoes superficiais demais?
  25. Lollapalooza Tendency — multiplos biases se reforçam mutuamente nesta situacao?
- **Key Metrics**: Numero de biases identificados por decisao; biases recorrentes (lista pessoal de vulnerabilidades)
- **Cross-References**: Todos os modelos em Mental Models Catalog, especialmente #5 (Lollapalooza)

---

## TIER 3: FRAMEWORKS AVANCADOS

### 12. Scenario Planning (Shell / Schwartz)
- **Originator**: Herman Kahn (RAND), popularizado por Pierre Wack e Peter Schwartz (Shell)
- **When to Use**: Planejamento estrategico de 3-10 anos; decisoes sob profunda incerteza; industrias em transformacao
- **How to Apply**:
  1. Identifique as 2 forcas mais incertas e mais impactantes (eixos)
  2. Construa 4 cenarios (2x2 matrix dos eixos)
  3. Desenvolva narrativa detalhada de cada cenario (nao previsao — historia plausivel)
  4. Para cada cenario: o que seria verdade? quais sinais precursores? qual nossa estrategia?
  5. Identifique acoes robustas (funcionam em todos os 4 cenarios) vs. acoes apostas (funcionam em 1-2)
  6. Monitore indicadores lider para saber em qual cenario estamos entrando
- **Example Application**: Empresa de educacao: Eixo 1 (IA na educacao: transformadora vs. incremental), Eixo 2 (regulacao brasileira: restritiva vs. permissiva). 4 cenarios: Revolucao Regulada, Caos Criativo, Evolucao Controlada, Status Quo Digitalizado. Estrategia robusta: plataforma hibrida. Aposta: full IA-first.
- **Key Metrics**: Acuracia de cenarios (retroativamente); numero de sinais monitorados
- **Cross-References**: Dalio's Economic Machine, Blitzscaling (em qual cenario blitz faz sentido?), Blue Ocean

---

### 13. Deliberate Practice Decision Model (Anders Ericsson)
- **Originator**: Anders Ericsson (Florida State University)
- **When to Use**: Decidindo onde investir tempo de desenvolvimento; building specific knowledge; calibracao de expertise
- **How to Apply**:
  1. Identifique o dominio especifico (nao "ficar melhor em marketing" — "melhorar conversao de landing pages acima da dobra")
  2. Encontre o maior praticante no mundo ou proximo a voce
  3. Identifique o que eles fazem diferente (nao o que eles sabem — o que eles FAZEM)
  4. Desenhe exercicios com feedback imediato
  5. Opere na borda do desconforto (nao zona de conforto, nao zona de panico)
  6. Revise modelo mental cada 6 semanas
- **Key Metrics**: Horas de pratica deliberada vs. pratica naive; velocidade de melhora em metrica especifica
- **Cross-References**: Specific Knowledge (Naval), Circle of Competence (Munger), Compounding Life

---

### 14. Reversibility Matrix
- **Originator**: Sintetizado de Bezos (Type 1/2) + Munger (Circle of Competence) + Dalio (Principles)
- **When to Use**: Antes de qualquer decisao significativa para calibrar esforco decisorio
- **How to Apply**:
  1. Classifique em dois eixos: Reversibilidade (facil/dificil) x Impacto (baixo/alto)
  2. Quadrante I (facil reversao + baixo impacto): decida rapido, aprenda fazendo
  3. Quadrante II (dificil reversao + baixo impacto): crie defaults, nao decida caso a caso
  4. Quadrante III (facil reversao + alto impacto): experimento rapido, meca, itere
  5. Quadrante IV (dificil reversao + alto impacto): processo rigoroso, consulta ampla, margem de segurança
- **Key Metrics**: Distribuicao de decisoes por quadrante (empresas saudaveis: maioria em I e III)
- **Cross-References**: Type 1/2 Decisions, Munger's Checklist, Dalio's 5-Step

---

### 15. Steelman / Steel Man Technique
- **Originator**: Filosofia analitica; popularizado em contexto de negocios por Shane Parrish e Julia Galef
- **When to Use**: Antes de rejeitar uma proposta; ao avaliar posicoes opostas; em debates estrategicos
- **How to Apply**:
  1. Identifique a posicao que voce quer refutar
  2. Construa a MELHOR versao possivel do argumento oposto (nao o straw man — o argumento mais forte)
  3. Represente este argumento com toda sua forca, sem ironia ou diminuicao
  4. Agora decida: dado o steel man, ainda assim minha posicao resiste?
  5. Se sim: sua posicao e robusta. Se nao: atualize sua posicao.
- **Example Application**: Proposta de pivotar para B2C (voce e B2B). Steel man: "B2C tem TAM 100x maior, ciclo de feedback 10x mais rapido, e nosso produto tem viralidade natural entre consumidores." Avaliacao honesta: os dados de uso mostram 60% dos nossos B2B clientes usam como se fossem individuos. O steel man revela uma pivot parcial (PLG dentro do B2B) como melhor caminho.
- **Key Metrics**: Frequencia de mudanca de posicao apos steelman (muito raro = rigidez; muito frequente = falta de convicção)
- **Cross-References**: Contrarian Thesis (Thiel), Believability-Weighted Decisions (Dalio), Idea Meritocracy

---

## How to Use This Encyclopedia

1. **Para decisoes urgentes**: Aplique Inversion + Pre-mortem em 20 minutos
2. **Para decisoes estrategicas**: Use Scenario Planning + Second-Order Thinking + Reversbility Matrix
3. **Para calibrar julgamento**: Revise Munger's 25 Biases mensalmente
4. **Para inovacao**: First Principles + Zero to One (Thiel, no strategic-frameworks-reference.md)
5. **Para equipes**: Adicione Decision Journal como pratica coletiva

**Regra de Munger**: Nunca use menos de 3 frameworks em decisoes de alto impacto. A convergencia de multiplos frameworks e o sinal mais forte.
