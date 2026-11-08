---
titulo: "LOOPS Craftsmanship — Diagramas e Passo a Passo Formalizados"
tipo: formalizacao-workflows
dominio: craftsmanship
onda: 1-craftsmanship
fase: 2
created: 2026-06-20
entregavel: loops-craftsmanship-diagramas
fontes: ["01-clean-code-extracao", "03-design-patterns-extracao", "07-testes-tdd-extracao", "08-refactoring-legacy-extracao"]
status: pronto-para-fase-3
---

# LOOPS Craftsmanship — Diagramas e Passo a Passo Formalizados

> Fase 2, Onda 1 — formalizacao. Converte os loops e processos canonicos do Nucleo de Craftsmanship em **diagramas mermaid prontos** + **passo a passo numerado** (entrada/saida por etapa) + **pontos de gate** (onde um teste ou revisao decide seguir ou voltar).
> Pronto para a Fase 3 (visual) e para virar comportamento de agent.
>
> **Convencao de gate:** `◇` = decisao; um gate retorna ao passo anterior (LACO) ou avanca. Verde = suite de testes passando. A regra-mae transversal a quase todos os loops: **nunca avance com a barra vermelha — reverta e reduza o passo** (small steps + green bar).

## Indice dos loops formalizados

| # | Loop canonico | Autor | Pergunta que responde |
|---|---|---|---|
| L1 | TDD Red-Green-Refactor | Beck | Como deixar a feature emergir guiada por teste? |
| L2 | Refatoracao Disciplinada | Fowler | Como melhorar estrutura sem mudar comportamento? |
| L3 | Tidy First? | Beck | Arrumo antes, depois ou registro para depois? |
| L4 | Legacy Code Change Algorithm | Feathers | Como mudar codigo sem testes com seguranca? |
| L5 | Characterization Test / Golden Master | Feathers | Como travar o comportamento atual antes de tocar? |
| L6 | Smell -> Pattern | Kerievsky | Quando refatorar *em direcao a* / *para longe de* um padrao? |
| L7 | Selecao de padrao (forward) + gate anti-patternitis | GoF / Kerievsky | Aplico o padrao agora ou adio (YAGNI)? |
| L8 | Mikado Method | Brandolini/Ellnestam | Como fazer mudanca grande sem build quebrado? |
| L9 | PPP — Pseudocode Programming Process | McConnell | Como passar do design ao codigo sem buraco? |
| L10 | Design It Twice + comentar antes | Ousterhout | Como achar a interface mais profunda antes de codar? |
| L11 | Outside-In / Double Loop | GOOS | Como dirigir feature da aceitacao ate a unidade? |
| L12 | Mutation Testing Loop | DeMillo / PIT / Stryker | A suite verifica de verdade ou e teatro? |
| — | **Loop mestre do agent de codigo** | sintese | Ciclo unico que combina todos |

---

## L1 — TDD Red-Green-Refactor (Beck)

> O loop algoritmico central: o teste vem antes, dirige o design e e o oraculo que fecha o ciclo sem humano no meio. Tamanho do passo calibrado pela ansiedade (confiante = passo grande; inseguro = baby steps).

```mermaid
flowchart TD
    A[Entrada: test list<br/>comportamentos desejados] --> B{Lista vazia?}
    B -- Sim --> Z[Saida: feature implementada<br/>+ testes + design refatorado]
    B -- Nao --> C[Pick next test<br/>item que ensina e e alcancavel]
    C --> D[RED: escrever teste minimo<br/>assert primeiro]
    D --> E[Rodar o teste]
    E --> F{Falha pela<br/>razao certa?}
    F -- Nao: erro inesperado --> D
    F -- Sim: red valido --> G[GREEN: fake it /<br/>triangulate / obvious]
    G --> H[Rodar TODA a suite]
    H --> I{Toda verde?}
    I -- Nao --> G
    I -- Sim --> J[REFACTOR: remover duplicacao<br/>melhorar design]
    J --> K[Rodar TODA a suite]
    K --> L{Continua verde?}
    L -- Nao --> M[Reverter ultimo passo]
    M --> J
    L -- Sim --> N[Atualizar test list<br/>riscar feito / add descobertos]
    N --> B
```

**Passo a passo**
1. **Entrada — test list.** Entrada: lista de comportamentos desejados. Saida: fila de trabalho.
2. **Pick next test.** Escolhe o item que ensina algo e e alcancavel em um passo. Saida: alvo do ciclo. *(decisao: tamanho do passo)*
3. **Red.** Escreve o teste minimo (assert primeiro, trabalha pra tras ate os inputs). Saida: teste novo.
4. **Rodar o teste / ver falhar pela razao certa.** Saida: red valido (falha coerente, nao erro de compilacao acidental).
5. **Green.** Faz passar do jeito mais simples — *fake it* (retorna constante), *triangulation* (segundo exemplo forca generalizar) ou *obvious implementation*. Saida: teste verde.
6. **Rodar toda a suite.** Saida: confirmacao de que nada quebrou.
7. **Refactor.** Remove duplicacao e smells mantendo verde (chama L2 internamente). Saida: design melhorado.
8. **Atualizar test list** e voltar ao passo 2 ate esvaziar.

**Gates**
- **G1 (red valido)** — `◇ Falha pela razao certa?` Nao → reescreve o teste (red invalido nao conta).
- **G2 (green)** — `◇ Toda a suite verde?` Nao → volta a implementar; nunca refatora sobre vermelho.
- **G3 (refactor seguro)** — `◇ Continua verde apos refatorar?` Nao → reverte o passo de refatoracao.
- **G4 (criterio de saida)** — `◇ Lista vazia?` Sim → entrega.

---

## L2 — Loop de Refatoracao Disciplinada (Fowler)

> Melhora a estrutura interna sem alterar o comportamento observavel, em passos atomicos sempre verdes. Two Hats: refatorar e adicionar feature sao chapeus separados — nunca no mesmo passo/commit.

```mermaid
flowchart TD
    A[Entrada: codigo + suite] --> B{Testes existem<br/>e passam?}
    B -- Nao --> C[Ir para L4/L5<br/>caracterizar primeiro]
    C --> A
    B -- Sim: verde --> D[Identificar smell<br/>Long Method, Feature Envy...]
    D --> E[Mapear smell -> refactoring<br/>do catalogo Fowler]
    E --> F[Aplicar UM passo atomico<br/>via AST/IDE quando possivel]
    F --> G[Rodar testes]
    G --> H{Verde?}
    H -- Vermelho --> I[Reverter passo<br/>reduzir tamanho]
    I --> F
    H -- Verde --> J[Commit pequeno e atomico<br/>so refatoracao - Two Hats]
    J --> K{Smell sumiu?<br/>codigo cabe na cabeca?}
    K -- Nao --> D
    K -- Sim --> Z[Saida: comportamento igual,<br/>estrutura melhor]
```

**Passo a passo**
1. **Garantir rede.** Entrada: codigo + suite. Saida: testes verdes. *(se nao ha cobertura → desvia para L4/L5)*
2. **Identificar smell.** Entrada: codigo. Saida: smell nomeado (Long Method, Feature Envy, Data Clumps, Shotgun Surgery...).
3. **Escolher refactoring.** Mapeia smell → tecnica de cura no catalogo. Saida: tecnica escolhida.
4. **Aplicar passo minusculo.** Uma transformacao atomica (Extract Function, Move Function...). Prefira AST/IDE. Saida: codigo alterado.
5. **Rodar testes.** Saida: verde/vermelho.
6. **Commit.** Commit pequeno e atomico, so de refatoracao. Saida: historico granular e reversivel.
7. **Repetir** ate o smell desaparecer.

**Gates**
- **G0 (rede de seguranca)** — `◇ Testes existem e passam?` Nao → vai para L4/L5 antes de tocar.
- **G1 (passo seguro)** — `◇ Verde?` Vermelho → reverte e reduz o passo (nunca empilha quebra).
- **G2 (Two Hats no commit)** — commit so de refatoracao; se ha teste de comportamento novo, e feature, nao refatoracao.
- **G3 (criterio de saida)** — `◇ Smell sumiu / cabe na cabeca?` Nao → novo ciclo.

---

## L3 — Ciclo "Tidy First?" (Beck)

> Decide *quando* arrumar: antes da mudanca (tidy first), depois (tidy after) ou registrar para depois (tidy later). Tidying = guard clause, explaining variable, dead code removal, normalizar simetrias — sempre com comportamento intacto e commit separado.

```mermaid
flowchart TD
    A[Entrada: vou mudar comportamento] --> B{O codigo resiste<br/>a mudanca?}
    B -- Nao --> G[Mudar comportamento direto]
    B -- Sim --> C{Tidy first /<br/>tidy after /<br/>tidy later?}
    C -- Tidy later --> D[Registrar tidy na lista<br/>seguir com a mudanca]
    D --> G
    C -- Tidy first --> E[Aplicar tidying<br/>guard clause, explaining var,<br/>dead code, simetrias]
    E --> F[Commit SEPARADO do tidying<br/>comportamento intacto]
    F --> G[Mudar comportamento<br/>sobre terreno limpo]
    G --> H[Commit de comportamento]
    H --> I{O tidying<br/>pagou?}
    I -- Calibra futuras decisoes --> J[Saida: mudanca feita<br/>+ aprendizado de custo]
    C -- Tidy after --> G
```

**Passo a passo**
1. **Detectar atrito.** Ao ir mudar comportamento, avalia se o codigo resiste. Entrada: intencao de mudanca.
2. **Decidir o momento do tidy.** *(decisao: tidy first / after / later)*
3. **Aplicar tidying** (se first/after). Saida: codigo mais legivel, comportamento inalterado.
4. **Commit separado** do tidying. Saida: revisao mais barata (diff de estrutura isolado do diff de comportamento).
5. **Mudar comportamento** sobre terreno limpo. Saida: feature/fix.
6. **Avaliar a economia.** O tidying compensou? Loop de aprendizado que calibra a decisao do passo 2 nas proximas vezes.

**Gates**
- **G1 (atrito)** — `◇ Codigo resiste?` Nao → muda direto, sem cerimonia.
- **G2 (momento)** — `◇ first/after/later?` decide a ordem; *later* nunca bloqueia a entrega.
- **G3 (commit limpo)** — tidying e comportamento NUNCA no mesmo commit (Two Hats aplicado a tidying).
- **G4 (feedback)** — `◇ O tidying pagou?` alimenta a heuristica futura (nao bloqueia).

---

## L4 — Legacy Code Change Algorithm (Feathers)

> Legacy = codigo sem testes. Para mudar com seguranca preciso de testes; para testar preciso quebrar dependencias. Este algoritmo resolve o no em 5 passos e, ao final, entra no loop de refatoracao (L2).

```mermaid
flowchart TD
    A[Entrada: requisito de mudanca<br/>+ codigo sem testes] --> B[1. Identify change points<br/>onde mudar]
    B --> C[2. Find test points / seams<br/>onde inserir observacao]
    C --> D{Ha seam natural?}
    D -- Nao --> E[Criar seam<br/>Sprout/Wrap Method/Class,<br/>Extract Interface]
    E --> F
    D -- Sim --> F[3. Break dependencies<br/>tecnica MENOS invasiva]
    F --> G{Unidade entra<br/>num test harness?}
    G -- Nao --> F
    G -- Sim --> H[4. Write characterization tests<br/>travam comportamento ATUAL]
    H --> I[5. Make changes<br/>sob a rede verde]
    I --> J[Refatorar -> entra em L2]
    J --> Z[Saida: mudanca feita<br/>com regressao protegida]
```

**Passo a passo**
1. **Identify change points.** Entrada: requisito + codigo. Saida: locais a alterar.
2. **Find test points / seams.** Onde alterar comportamento sem editar in-place (object/link/preprocessing seam). *(decisao: ha seam natural?)*
3. **Break dependencies.** Isola a unidade com a tecnica minima (Sprout/Wrap/Extract Interface/Parameterize/Extract-and-Override). Sub-laco ate a unidade rodar isolada. Saida: unidade testavel.
4. **Write characterization tests.** Captura o comportamento atual, mesmo "errado". Saida: rede de seguranca (ver L5).
5. **Make changes & refactor.** Muda protegido e entra em L2. Saida: mudanca com cobertura nova.

**Gates**
- **G1 (seam)** — `◇ Ha seam natural?` Nao → cria via Sprout/Wrap (nao mergulha no emaranhado).
- **G2 (isolamento)** — `◇ Unidade entra no harness?` Nao → continua quebrando dependencia (menos invasiva possivel).
- **G3 (rede antes de mudar)** — characterization tests verdes sao **pre-condicao** de qualquer mudanca de comportamento.

---

## L5 — Characterization Test / Golden Master (Feathers)

> Mecanica de criar a rede: o teste **revela** o comportamento real em vez de o especificar. Para outputs grandes, o Golden Master captura um baseline e compara diffs.

```mermaid
flowchart TD
    A[Entrada: codigo sem testes<br/>input plausivel] --> B[Escrever teste com assercao<br/>DELIBERADAMENTE errada<br/>ex: assertEquals 'PLACEHOLDER']
    B --> C[Rodar -> teste falha]
    C --> D[O erro REVELA<br/>o valor real produzido]
    D --> E[Ajustar assercao<br/>para o valor real observado]
    E --> F{Cobre ramos<br/>e edge cases<br/>suficientes?}
    F -- Nao --> G[Adicionar input<br/>de novo ramo/borda]
    G --> B
    F -- Sim --> H{Output grande/<br/>serializavel?}
    H -- Sim --> I[Golden Master:<br/>capturar saida de N inputs<br/>como baseline; comparar diffs]
    H -- Nao --> Z
    I --> Z[Saida: suite que falha<br/>se o comportamento mudar]
```

**Passo a passo**
1. **Teste com assercao errada de proposito.** Entrada: codigo + input plausivel. Saida: teste que falha.
2. **Rodar e ler o valor real** no output do erro.
3. **Ajustar a assercao** para o valor observado — documenta o que o codigo FAZ, nao o que deveria.
4. **Expandir** para ramos e edge cases ate sentir confianca.
5. **Golden Master** (outputs grandes): baseline de N inputs; diff vazio = comportamento preservado.

**Gates**
- **G1 (confianca de cobertura)** — `◇ Ramos/bordas suficientes?` Nao → adiciona caso.
- **G2 (estrategia de output)** — `◇ Output grande?` Sim → Golden Master por diff; Nao → assercoes pontuais.
- **G3 (merge)** — Golden Master **diff vazio** e condicao de merge (rastreavel, anti-regressao).

---

## L6 — Smell -> Pattern / Refactoring to Patterns (Kerievsky)

> Padroes sao **alvos de refatoracao**, nao decisao antecipada. Refatora-se *toward*, *away from* ou *toward an alternative* sob pressao de smells — e so se a abstracao resultante for mais profunda (esconde mais do que expoe).

```mermaid
flowchart TD
    A[Entrada: diff/modulo em review] --> B[Detectar smell<br/>switch sobre tipo, duplicacao,<br/>classe inchada, primitive obsession]
    B --> C[Diagnosticar padrao-alvo<br/>via tabela smell->padrao]
    C --> D{Ha rede de testes<br/>verde cobrindo?}
    D -- Nao --> E[Escrever characterization L5]
    E --> D
    D -- Sim --> F{Escolher direcao}
    F -- toward: smell pede estrutura --> G[Aplicar receita em<br/>passos atomicos<br/>Extract->Move->Replace Cond w/ Poly]
    F -- away: padrao virou indirecao morta --> G
    F -- alternative: padrao errado --> G
    G --> H[Rodar testes entre cada passo]
    H --> I{Verde?}
    I -- Vermelho --> J[Reverter ultimo passo]
    J --> G
    I -- Verde --> K{Ficou mais simples<br/>OU so 'mais padrao'?}
    K -- So mais padrao --> J
    K -- Mais simples + smell removido --> Z[Saida: intencao mais clara,<br/>sem regressao]
```

**Passo a passo**
1. **Detectar smell.** Entrada: codigo. Gatilhos: Switch sobre tipo, Conditional Complexity, Divergent Change, Shotgun Surgery.
2. **Diagnosticar padrao-alvo.** Ex.: conditional sobre tipo → Strategy/State; construcao complexa → Factory/Creation Method.
3. **Garantir rede.** Pre-condicao: testes verdes (senao, L5 primeiro).
4. **Escolher direcao.** *toward* / *away from* / *toward alternative*.
5. **Aplicar receita** em passos atomicos (a ponte mais usada: *Replace Conditional with Polymorphism*), rodando testes entre cada passo.
6. **Validar simplificacao.** Saida: smell removido E intencao mais clara.

**Gates**
- **G1 (rede)** — `◇ Testes verdes cobrindo?` Nao → caracteriza (L5).
- **G2 (passo seguro)** — `◇ Verde?` Vermelho → reverte.
- **G3 (gate de valor)** — `◇ Mais simples ou so mais padrao?` So mais padrao → **reverte** (a abstracao precisa ser *deep*, nao *shallow*).

---

## L7 — Selecao de padrao forward + gate anti-patternitis (GoF / YAGNI)

> O caminho *forward*: do problema ao padrao, com freio YAGNI. So aplica se ha variacao concreta **hoje** e a abstracao e mais profunda que o codigo direto. Inclui o gate de defesa contra overengineering.

```mermaid
flowchart TD
    A[Entrada: requisito/feature] --> B[Nomear o que VARIA<br/>vs o que e ESTAVEL]
    B --> C[Mapear aspecto -> familia<br/>comportamento/criacao/<br/>estrutura/estado/fluxo]
    C --> D[Ler Intent de 2-3 candidatos<br/>descartar os que nao casam]
    D --> E[Ler Consequences<br/>custo de indireção/classes]
    E --> F{Existe >=1 variacao<br/>CONCRETA hoje?}
    F -- Nao --> G[ADIAR - YAGNI<br/>documentar a decisao]
    G --> Z2[Saida: decisao registrada<br/>de NAO aplicar]
    F -- Sim --> H{A abstracao e DEEP?<br/>esconde mais do que expoe}
    H -- Shallow --> G
    H -- Deep --> I{Ha idioma de linguagem<br/>mais barato? HOF/modulo}
    I -- Sim --> J[Usar funcao/modulo<br/>sem o padrao completo]
    I -- Nao --> K[Implementar o minimo<br/>+ teste]
    J --> Z[Saida: variacao resolvida<br/>com custo justificado]
    K --> Z
```

**Passo a passo**
1. **Nomear a forca de variacao.** O que muda vs. o que e estavel. Saida: aspecto que varia.
2. **Mapear aspecto → familia.** Comportamental / criacional / estrutural / estado / fluxo.
3. **Ler Intent** dos 2-3 candidatos; descartar os que nao casam o sintoma.
4. **Ler Consequences;** contabilizar custo (indireção, nº de classes, acoplamento).
5. **Gate YAGNI + deep.** *(decisoes abaixo)*
6. **Implementar o minimo** com o idioma mais barato (funcao > classe quando possivel) + teste.

**Gates**
- **G1 (YAGNI)** — `◇ >=1 variacao concreta hoje?` Nao → adia e documenta (anti Speculative Generality).
- **G2 (deep vs shallow)** — `◇ A abstracao e deep?` Shallow → nao vale; adia.
- **G3 (idioma barato)** — `◇ Ha HOF/modulo que resolve?` Sim → evita a cerimonia do padrao completo.
- **Gate anti-patternitis (em PR):** cada padrao presente suporta ≥1 variacao real em uso? Nenhuma interface com 1 implementacao especulativa? Nenhum Singleton mutavel global? A indireção **revela** a intencao? Falha → simplificar / refatorar *away*.

---

## L8 — Mikado Method (mudanca grande sem build quebrado)

> Para refatoracoes grandes: em vez de empilhar quebras, **reverte tudo** e ataca as folhas do grafo de dependencias, commitando cada folha verde na main. O codigo praticamente NUNCA fica quebrado.

```mermaid
flowchart TD
    A[Entrada: objetivo de mudanca grande] --> B[Set goal<br/>no topo do grafo Mikado]
    B --> C[Experiment:<br/>tentar a mudanca ingenuamente]
    C --> D{Quebrou algo?}
    D -- Sim --> E[Visualize: cada quebra vira<br/>pre-requisito = folha do grafo]
    E --> F[UNDO: reverter TUDO<br/>volta ao verde - chave do metodo]
    F --> G[Prune leaves:<br/>resolver folhas SEM dependencia]
    G --> H[Commit cada folha verde na main]
    H --> I{Raiz alcancavel<br/>sem quebras?}
    I -- Nao --> C
    I -- Sim --> J[Fazer a mudanca-objetivo]
    D -- Nao --> J
    J --> Z[Saida: refatoracao grande<br/>em passos sempre verdes]
```

**Passo a passo**
1. **Set goal.** Escreve o objetivo no topo do grafo. Entrada: meta de mudanca.
2. **Experiment.** Tenta a mudanca de forma ingenua. Saida: lista de quebras.
3. **Visualize.** Cada quebra vira um pre-requisito (folha/filho no grafo).
4. **Undo.** Reverte TUDO — volta ao estado verde. *(este e o coracao do metodo)*
5. **Prune leaves.** Resolve primeiro as folhas sem dependencias; commit cada uma verde na main (sem branch longo).
6. **Subir a arvore** das folhas a raiz ate a mudanca-objetivo ser alcancavel sem quebrar.

**Gates**
- **G1 (descoberta)** — `◇ Quebrou algo?` Sim → registra como folha e **reverte tudo** (nunca conserta empilhando).
- **G2 (ordem)** — so se resolve folha **sem dependencia** pendente.
- **G3 (raiz)** — `◇ Raiz alcancavel sem quebras?` Nao → novo experiment; Sim → executa o objetivo.
- **Invariante:** o build/main fica verde apos cada commit (revert > empilhar quebra).

---

## L9 — PPP / Pseudocode Programming Process (McConnell)

> A ponte do design ao codigo: escreve pseudocodigo de alto nivel ("o que"), refina ate ~1 linha de pseudo por ~1 linha de codigo, e o pseudocodigo vira a estrutura/comentarios da rotina.

```mermaid
flowchart TD
    A[Entrada: design + interface da rotina] --> B{Pre-requisitos claros?<br/>design e interface prontos}
    B -- Nao --> C[Voltar ao design]
    C --> A
    B -- Sim --> D[Escrever pseudocodigo<br/>de alto nivel - foco no 'o que']
    D --> E[Iterar o pseudocodigo<br/>refinar nivel de detalhe]
    E --> F{Cada linha de pseudo<br/>mapeia ~1 linha de codigo?}
    F -- Nao --> E
    F -- Sim --> G[Codar a partir do pseudo<br/>pseudo vira comentarios/estrutura]
    G --> H[Revisar + testar a rotina<br/>checklist de rotina]
    H --> I{Passa?}
    I -- Nao --> E
    I -- Sim --> J[Limpar: remover pseudo redundante<br/>Boy Scout Rule]
    J --> Z[Saida: rotina pronta,<br/>testada e limpa]
```

**Passo a passo**
1. **Pre-requisitos.** Confirma design e interface claros. *(decisao: pronto para codar?)*
2. **Pseudocodigo de alto nivel.** Linguagem natural, foco no "o que". Saida: esqueleto.
3. **Iterar.** Refina ate cada linha de pseudo mapear ~1 linha de codigo. Laço de refinamento.
4. **Codar a partir do pseudo.** O pseudocodigo vira comentarios/estrutura. Saida: rotina.
5. **Revisar e testar.** Checklist de rotina + testes. *(decisao: passa?)*
6. **Limpar.** Remove pseudo redundante, aplica Boy Scout Rule. Saida: rotina limpa.

**Gates**
- **G1 (design pronto)** — `◇ Pre-requisitos claros?` Nao → volta ao design (nao coda no escuro).
- **G2 (granularidade)** — `◇ ~1 pseudo : ~1 codigo?` Nao → continua refinando.
- **G3 (revisao/teste)** — `◇ Passa?` Nao → volta a iterar o pseudo/codigo.

---

## L10 — Design It Twice + comentar a interface antes de codar (Ousterhout)

> Antes de implementar, esboce **duas** abordagens radicalmente diferentes, compare profundidade/red flags, hibridize — e escreva o comentario de interface **antes** do corpo (se o comentario fica dificil/longo, a interface esta ruim: design check barato).

```mermaid
flowchart TD
    A[Entrada: problema de design<br/>de interface/modulo] --> B[Esbocar abordagem A<br/>interface + estrutura]
    B --> C[Esbocar abordagem B<br/>RADICALMENTE diferente - nao variante]
    C --> D[Comparar: interface mais simples?<br/>modulo mais profundo?<br/>menos red flags?]
    D --> E[Hibridizar o melhor dos dois]
    E --> F[Escrever o COMENTARIO de interface<br/>ANTES de implementar]
    F --> G{O comentario ficou<br/>dificil/longo?}
    G -- Sim: interface ruim --> B
    G -- Nao: interface limpa --> H[Implementar o corpo]
    H --> Z[Saida: modulo profundo<br/>com contrato documentado]
```

**Passo a passo**
1. **Abordagem A.** Esboca interface + estrutura. Entrada: problema de design.
2. **Abordagem B.** Esboca uma alternativa radicalmente diferente (nao uma variante).
3. **Comparar.** Qual tem interface mais simples / modulo mais profundo / menos red flags?
4. **Hibridizar** o melhor dos dois. Saida: design candidato.
5. **Comentar a interface ANTES de codar.** Saida: contrato escrito.
6. **Implementar** o corpo.

**Gates**
- **G1 (duas opcoes reais)** — B precisa ser **radicalmente** diferente; variante trivial nao conta.
- **G2 (comment-first check)** — `◇ Comentario dificil/longo?` Sim → a interface esta ruim, volta a desenhar (o comentario e o detector barato de interface rasa).

---

## L11 — Outside-In / Double Loop (GOOS)

> Dois loops aninhados: o externo dirige pela aceitacao (de fora pra dentro); o interno e o TDD unitario (L1). "Listen to the tests" — dor no teste e sinal de problema de design.

```mermaid
flowchart TD
    A[Walking Skeleton<br/>fatia fim-a-fim minima<br/>prova arquitetura + deploy] --> B[LOOP EXTERNO:<br/>escrever teste de aceitacao<br/>da proxima feature]
    B --> C[Ver aceitacao falhar<br/>vermelho de fora]
    C --> D[LOOP INTERNO = L1:<br/>dirigir cada colaborador<br/>com unit tests]
    D --> E{Unit test ficou<br/>dificil/feio?}
    E -- Sim: dor no teste --> F[Listen to the tests:<br/>refatorar o DESIGN]
    F --> D
    E -- Nao --> G{Teste de aceitacao<br/>ainda falha?}
    G -- Sim --> D
    G -- Nao: passou --> H{Ha mais cenarios?}
    H -- Sim --> B
    H -- Nao --> Z[Saida: feature coberta por<br/>aceitacao + unidade,<br/>design emergente limpo]
```

**Passo a passo**
1. **Walking Skeleton.** Fatia fim-a-fim minima que builda, roda e deploya. Saida: esqueleto que prova arquitetura + pipeline.
2. **Loop externo (aceitacao).** Escreve um teste de aceitacao da proxima feature; ve falhar.
3. **Loop interno (unidade = L1).** Dirige cada colaborador com unit tests, descobrindo interfaces.
4. **Listen to the tests.** Se um unit test ficou dificil/feio → refatora o design (nao forca o mock).
5. **Verificar aceitacao.** Ainda falha → mais ciclos internos; passou → proximo cenario.

**Gates**
- **G1 (sinal de design)** — `◇ Unit test dificil/feio?` Sim → refatora design (extrai Humble Object, inverte dependencia).
- **G2 (aceitacao)** — `◇ Aceitacao ainda falha?` Sim → continua loop interno; o teste externo e o criterio de "feito".
- **G3 (mais cenarios)** — `◇ Ha mais cenarios?` Sim → novo loop externo.

---

## L12 — Mutation Testing Loop (DeMillo / PIT / Stryker)

> Mede a qualidade da **suite**, nao do codigo: injeta mutantes e conta quantos a suite mata. Mutante sobrevivente = asserção fraca (test theatre) ou mutante equivalente (ignorar). Roda incremental no diff do PR para nao estourar o CI.

```mermaid
flowchart TD
    A[Entrada: suite verde] --> B[Ferramenta gera mutantes<br/>negate conditionals, boundary,<br/>return values...]
    B --> C[Rodar suite contra cada mutante]
    C --> D{Mutante morto<br/>ou sobrevivente?}
    D -- Morto: suite pegou --> E[OK - conta no mutation score]
    D -- Sobrevivente --> F{Equivalente?<br/>semanticamente identico}
    F -- Sim --> G[Anotar/ignorar<br/>indecidivel]
    F -- Nao: asserção fraca --> H[Fortalecer a asserção<br/>ou adicionar teste]
    H --> A
    E --> I{Mutation score >=<br/>threshold do modulo?}
    G --> I
    I -- Nao --> H
    I -- Sim --> Z[Saida: suite que verifica<br/>de verdade - gate de qualidade]
```

**Passo a passo**
1. **Entrada:** suite verde (baseline calculado uma vez localmente).
2. **Gerar mutantes** (operadores: negate conditionals, boundary, return values...).
3. **Rodar a suite** contra cada mutante. *(decisao: morto vs sobrevivente)*
4. **Triagem do sobrevivente:** equivalente → anota/ignora; asserção fraca → fortalece.
5. **Gate de score** por modulo (ex.: 80% em dominio critico; sem gate em glue). Em CI: incremental sobre o diff.

**Gates**
- **G1 (sobrevivente)** — `◇ Morto ou sobrevivente?` Sobrevivente → investiga.
- **G2 (equivalente)** — `◇ Mutante equivalente?` Sim → ignora (indecidivel); Nao → fortalece asserção.
- **G3 (threshold)** — `◇ Score >= threshold?` Nao → reforca testes; Sim → passa o gate.

---

## Loop mestre do agent de codigo

> Ciclo operacional unico que um agent de IA segue ao implementar codigo, combinando os loops acima: **entender → testar antes → implementar minimo → refatorar com rede → gate de qualidade → entregar**. Cada decisao reaproveita um dos loops L1–L12. A regra inviolavel: **nunca declara "Done" com suite vermelha ou sem teste novo**, e **edicao de refatoracao estrutural passa por engine AST quando possivel** (mitiga os ~7-8% de refatoracoes inseguras de LLM cru).

```mermaid
flowchart TD
    START([Briefing de implementacao]) --> U[1. ENTENDER<br/>ler codigo + contexto/grafo de impacto]
    U --> U2{Codigo existente<br/>tem testes?}
    U2 -- Nao: legacy --> L4[L4/L5: characterization tests<br/>travar comportamento atual]
    L4 --> D2
    U2 -- Sim --> D2[2. DESIGN barato<br/>L10 Design It Twice +<br/>comentar interface antes]
    D2 --> D3{Comentario de interface<br/>ficou limpo?}
    D3 -- Nao --> D2
    D3 -- Sim --> T[3. TESTAR ANTES<br/>L1 Red: escrever teste que falha]
    T --> T2{Falha pela<br/>razao certa?}
    T2 -- Nao --> T
    T2 -- Sim --> IMPL[4. IMPLEMENTAR MINIMO<br/>L1 Green: codigo mais simples que passa]
    IMPL --> RUN1[Rodar TODA a suite]
    RUN1 --> G1{Verde?}
    G1 -- Nao --> IMPL
    G1 -- Sim --> REF[5. REFATORAR COM REDE<br/>L2 + L6 smell->refactoring->pattern<br/>passos atomicos via AST]
    REF --> RUN2[Rodar testes entre cada passo]
    RUN2 --> G2{Verde?}
    G2 -- Vermelho --> REVERT[Reverter passo<br/>reduzir tamanho - L8 Mikado]
    REVERT --> REF
    G2 -- Verde --> G3{Smell sumiu E<br/>abstracao e deep?<br/>anti-patternitis L7}
    G3 -- Nao --> REF
    G3 -- Sim --> QG[6. GATE DE QUALIDADE]
    QG --> Q1{Complexidade cognitiva<br/><= 15 por funcao?}
    Q1 -- Nao --> REF
    Q1 -- Sim --> Q2{Nomes revelam intencao?<br/>aninhamento <= 3?}
    Q2 -- Nao --> REF
    Q2 -- Sim --> Q3{Mutation score incremental<br/>>= threshold? L12}
    Q3 -- Nao --> ADDT[Fortalecer asserções /<br/>add teste]
    ADDT --> RUN2
    Q3 -- Sim --> Q4{Two Hats respeitado?<br/>flakiness < 1%?}
    Q4 -- Nao --> REF
    Q4 -- Sim --> SELF{Self-critique passou?<br/>max 2 iteracoes}
    SELF -- Falhou < 2x --> REF
    SELF -- Passou --> DONE([Done: feature + testes verdes<br/>+ design limpo + behavior diff vazio])
```

**Passo a passo do ciclo operacional**
1. **Entender.** Le codigo + contexto (grafo de impacto / RAG). *Achado de pesquisa: o agent se beneficia mais de contexto que de instrucao TDD seca.* Gate: codigo legado → L4/L5 antes.
2. **Design barato (L10).** Esboca, hibridiza, e escreve o comentario de interface ANTES. Gate: comentario limpo = interface boa.
3. **Testar antes (L1 Red).** Escreve o teste que falha pela razao certa.
4. **Implementar minimo (L1 Green).** Codigo mais simples que passa; suite toda verde.
5. **Refatorar com rede (L2 + L6).** Smell → refactoring → pattern em passos atomicos; vermelho → reverte (L8 Mikado). Gate: deep, nao shallow (anti-patternitis L7).
6. **Gate de qualidade.** Complexidade cognitiva ≤ 15; nomes-intencao; aninhamento ≤ 3; mutation score incremental ≥ threshold (L12); Two Hats; flakiness < 1%; self-critique adversarial (max 2 iteracoes).
7. **Done.** So com suite verde **e** teste novo **e** behavior diff vazio.

**Gates-mestre (resumo)**

| Etapa | Gate | Falha → |
|---|---|---|
| Entender | Codigo tem testes? | Nao → L4/L5 caracteriza |
| Design | Comentario de interface limpo? | Nao → redesenha (L10) |
| Testar antes | Red valido (falha pela razao certa)? | Nao → reescreve teste |
| Implementar | Suite toda verde? | Nao → ajusta implementacao |
| Refatorar | Verde apos cada passo? | Vermelho → reverte e reduz (L8) |
| Refatorar | Abstracao deep, smell removido? | Nao → continua / reverte padrao (L7) |
| Qualidade | Cognitiva ≤15, nomes, aninhamento ≤3 | Nao → refatora |
| Qualidade | Mutation score ≥ threshold | Nao → fortalece asserções (L12) |
| Qualidade | Two Hats + flakiness <1% + self-critique | Nao → corrige (max 2x) |
| Entrega | Suite verde + teste novo + diff vazio | Nao → **bloqueia "Done"** |

---

## Notas de fidelidade (honestidade intelectual)

- **Tensao L2/L7 vs decomposicao:** os loops usam "deep module" (Ousterhout) como criterio de saida da refatoracao — nunca limite de linha cego. Extrai por intencao e profundidade, nao por contagem. (Debate Martin × Ousterhout, vencido pragmaticamente por Ousterhout no design.)
- **TDD nao e dogma:** L1 e default para logica algoritmica/dominio; opcional para glue/UI. O inegociavel transversal e a **rede de testes existir antes do merge**, nao a coreografia exata.
- **Mutation > cobertura:** o gate de qualidade usa mutation score (sinal honesto), nao cobertura de linha (gamificavel / test theatre).
- **LLM cru e inseguro:** refatoracao estrutural do agent deve passar por engine AST validado (padrao RefactoringMirror) — characterization tests + behavior diff vazio sao a rede que torna refatoracao por IA confiavel.

---

## L13 — BDD / Specification by Example (Adzic / Smart)

> Transforma exemplos concretos de negocio em especificacao executavel e living documentation: Three Amigos derivam regras, Gherkin formaliza, ATDD automatiza, e o relatorio verde e o contrato vivo entre requisito e teste.

```mermaid
flowchart TD
    A[Entrada: nova feature<br/>ou historia de usuario] --> B["Three Amigos:<br/>PO + Dev + QA<br/>workshop de descoberta"]
    B --> C["Derivar exemplos concretos<br/>de cada regra de negocio<br/>(Example Mapping)"]
    C --> D{"Exemplo ambiguo<br/>ou imperativo?"}
    D -- "Sim: especificacao ruim" --> E["Reformular: declarativo,<br/>sem detalhes de UI,<br/>em linguagem de negocio"]
    E --> C
    D -- "Nao: exemplo claro" --> F["Formalizar em Gherkin<br/>Given / When / Then"]
    F --> G["Automatizar: escrever<br/>step definitions que<br/>ligam Gherkin a aplicacao"]
    G --> H{"Step definitions<br/>passam a verde?"}
    H -- "Nao: cenario falhando" --> I["Implementar feature<br/>dirigida pelo cenario<br/>(Outside-In = L11 internamente)"]
    I --> H
    H -- "Sim: cenario verde" --> J{"Ha mais cenarios<br/>ou regras derivadas?"}
    J -- "Sim" --> C
    J -- "Nao" --> K["Publicar Living Documentation:<br/>relatorio de cenarios verdes<br/>= especificacao sempre atual"]
    K --> L{"Mudanca de requisito<br/>no futuro?"}
    L -- "Sim" --> B
    L -- "Nao" --> Z["Saida: suite ATDD verde<br/>+ living documentation<br/>+ rastreabilidade requisito<>teste"]
```

**Passo a passo**
1. **Three Amigos.** PO, Dev e QA reunidos antes de codar. Entrada: historia ou feature. Saida: regras de negocio + exemplos concretos + perguntas em aberto.
2. **Example Mapping.** Para cada regra, derivar pelo menos dois exemplos (happy path e borda). Gate: exemplo declarativo, em linguagem de negocio, sem referencia a UI ou a implementacao.
3. **Formalizar em Gherkin.** Converter cada exemplo em cenario Given/When/Then. Uma acao de negocio por cenario; sem conjuncoes (`E`) em demasia.
4. **Automatizar (step definitions).** Escrever o codigo que liga cada step ao sistema real. Saida: teste ATDD executavel.
5. **Implementar feature.** Cenario falhando dirige o loop Outside-In (L11) internamente. Laço ate o cenario ficar verde.
6. **Living Documentation.** Relatorio de cenarios verdes publicado automaticamente no CI. Cada mudanca re-executa e re-publica.

**Gates**
- **G1 (qualidade do exemplo)** — `◇ Exemplo ambiguo ou imperativo?` Sim → reformular antes de formalizar (imperative smell: menciona botao, URL, campo de tela).
- **G2 (cobertura de cenarios)** — `◇ Ha mais cenarios ou regras derivadas?` Nao → so entao implementar; cenario incompleto nao vai para o step 4.
- **G3 (verde ATDD)** — `◇ Step definitions passam?` Nao → implementar; cenario e o criterio de Done externo.
- **G4 (manutencao)** — `◇ Mudanca de requisito?` Sim → volta ao Three Amigos (nao edita Gherkin diretamente sem o workshop).

---

## L14 — Property-Based Testing (QuickCheck / Hypothesis / fast-check)

> Em vez de exemplos pontuais, especifica invariantes universais: o framework gera N casos aleatorios, encontra uma falha e aplica shrinking para reduzir ao menor contra-exemplo reproduzivel; o bug fixado vira seed permanente na suite.

```mermaid
flowchart TD
    A["Entrada: funcao ou sistema<br/>com comportamento algebrico<br/>ou invariante verificavel"] --> B["Identificar propriedade / invariante:<br/>round-trip, idempotencia,<br/>comutatividade, oraculo de modelo,<br/>metamorfica, conservacao"]
    B --> C{"Propriedade bem<br/>formulada?<br/>(universal, falsificavel)"}
    C -- "Nao: muito especifica" --> D["Generalizar: remover<br/>valores fixos, usar<br/>variaveis com geradores"]
    D --> C
    C -- "Sim" --> E["Definir geradores<br/>de entrada: tipo, range,<br/>restricoes, composicao"]
    E --> F["Rodar N casos aleatorios<br/>(ex: 100-10000 por default)"]
    F --> G{"Algum caso<br/>falsificou a propriedade?"}
    G -- "Nao: todos passaram" --> H["Registrar propriedade<br/>como teste persistente<br/>com seed fixada"]
    G -- "Sim: falha encontrada" --> I["Shrinking:<br/>minimizar contra-exemplo<br/>ate o menor reproduzivel"]
    I --> J["Inspecionar contra-exemplo<br/>minimo: bug no codigo<br/>ou propriedade mal formulada?"]
    J -- "Propriedade ruim" --> B
    J -- "Bug real no codigo" --> K["Corrigir o bug"]
    K --> L["Fixar seed do contra-exemplo<br/>como teste de regressao<br/>permanente na suite"]
    L --> F
    H --> M{"Ha mais propriedades<br/>relevantes?"}
    M -- "Sim" --> B
    M -- "Nao" --> Z["Saida: suite com propriedades<br/>cobrindo espaco de entrada<br/>+ sementes de regressao fixadas"]
```

**Passo a passo**
1. **Identificar propriedade.** Entrada: funcao ou sistema. Padroes canonicos (QuickCheck / Hypothesis): round-trip (encode→decode = identidade), idempotencia (f(f(x)) = f(x)), comutatividade/associatividade, oraculo de modelo (implementacao simples vs. rapida), metamorfica (f(transform(x)) = transform(f(x))), conservacao (soma antes = soma depois). Saida: hipotese universal.
2. **Validar formulacao.** Gate: a propriedade e universal (vale para qualquer entrada valida) e falsificavel (ha contra-exemplos possiveis). Propriedade que sempre passa por construcao matematica nao testa nada.
3. **Definir geradores.** Tipo de dado, range, restricoes de dominio (ex.: inteiros positivos, strings nao vazias, listas de tamanho 1-100). Composicao de geradores para estruturas aninhadas.
4. **Rodar N casos.** O framework sorteia N entradas e verifica a propriedade em cada uma. Default: 100 casos; critico de seguranca: 1000+. Saida: PASS ou primeiro caso que falsifica.
5. **Shrinking.** Ao encontrar falha, o framework reduz o contra-exemplo ao minimo reproduzivel (remove elementos, diminui valores) ate nao conseguir reduzir mais. Saida: menor entrada que provoca o bug.
6. **Diagnosticar.** Propriedade mal formulada → reformular (passo 1). Bug real → corrigir e fixar a seed como teste de regressao permanente.
7. **Integrar.** Propriedades aprovadas entram na suite normal; seeds de contra-exemplos passados sao re-executadas em cada CI run (anti-regressao).

**Gates**
- **G1 (formulacao)** — `◇ Propriedade universal e falsificavel?` Nao → generalizar; propriedade trivial e teatro.
- **G2 (falha encontrada)** — `◇ Algum caso falsificou?` Sim → shrinking obrigatorio antes de diagnosticar (nunca debugar o caso grande).
- **G3 (diagnostico)** — `◇ Bug real ou propriedade ruim?` Propriedade ruim → reformular (nao tentar workaround na implementacao). Bug real → corrigir e fixar seed.
- **G4 (regressao)** — seed do contra-exemplo fixada na suite: um bug property-based encontrado **nunca** pode regredir silenciosamente.

---

## L15 — Branch by Abstraction em nivel de codigo (Fowler / Lemaire)

> Para substituir um componente grande sem big-bang: cria uma abstracao (interface/camada) sobre o que vai mudar, aponta todos os clientes para ela, implementa o substituto por tras de feature flag, compara em parallel run e migra gradualmente ate remover o componente antigo.

```mermaid
flowchart TD
    A["Entrada: componente a substituir<br/>ainda em producao"] --> B["1. Criar abstracao<br/>interface ou camada fina<br/>sobre o componente antigo"]
    B --> C["2. Apontar clientes<br/>para a abstracao<br/>comportamento inalterado"]
    C --> D["Rodar testes<br/>de regressao"]
    D --> E{"Suite verde?"}
    E -- "Nao" --> C
    E -- "Sim" --> F["3. Implementar componente novo<br/>por tras da abstracao<br/>atras de feature flag OFF"]
    F --> G["Rodar testes unitarios<br/>do novo componente"]
    G --> H{"Novo componente<br/>com testes verdes?"}
    H -- "Nao" --> F
    H -- "Sim" --> I["4. Parallel run:<br/>ligar flag para subconjunto<br/>comparar resultados do velho e do novo"]
    I --> J{"Resultados<br/>equivalentes?<br/>metricas ok?"}
    J -- "Nao: divergencia" --> K["Corrigir novo componente<br/>manter flag restrito"]
    K --> I
    J -- "Sim" --> L["5. Migrar trafego<br/>incrementalmente<br/>ate 100% no novo"]
    L --> M{"100% migrado<br/>sem incidente?"}
    M -- "Nao: rollback" --> N["Reverter flag<br/>diagnosticar"]
    N --> K
    M -- "Sim" --> O["6. Remover componente antigo<br/>e a abstracao<br/>se desnecessaria"]
    O --> Z["Saida: substituicao completa<br/>sem downtime nem big-bang"]
```

**Passo a passo**
1. **Criar abstracao.** Entrada: componente a substituir em producao. Escreve interface ou camada fina que o componente antigo implementa imediatamente. Saida: contrato estavel.
2. **Apontar clientes.** Todos os chamadores passam a depender da abstracao, nao do concreto antigo. Gate: suite verde antes de avancar.
3. **Implementar o novo por tras da flag.** O novo componente fica oculto atras de feature flag OFF. Saida: codigo dual — antigo operando, novo existindo mas silencioso.
4. **Parallel run.** Liga a flag para subconjunto de trafego; executa antigo e novo lado a lado; compara resultados. Gate: resultados equivalentes e metricas de negocio/performance ok.
5. **Migrar gradualmente.** Aumenta o peso da flag ate 100% no novo. Em cada incremento: observar alertas, manter rollback disponivel.
6. **Remover o antigo.** Com 100% migrado e estavel, apaga o componente antigo e, se nao mais necessaria, a propria abstracao. Saida: codigo mais simples.

**Gates**
- **G1 (rede antes de apontar)** — `Suite verde?` Nao → corrige o apontamento dos clientes (nao adianta seguir com regressao).
- **G2 (novo testado isolado)** — `Novo componente com testes verdes?` Nao → implementa mais antes de ligar a flag.
- **G3 (parallel run)** — `Resultados equivalentes?` Nao → corrige e mantém a flag restrita; jamais expande trafego com divergencia.
- **G4 (100% migrado)** — `Incidente no rollout?` Sim → reverte flag (rollback instantaneo sem deploy); diagnostica antes de retomar.
- **Invariante:** o componente antigo fica em producao e funcional em CADA etapa; nunca ha janela sem comportamento servido.

---

## L16 — Database refactoring com transition period (Ambler / Sadalage)

> Schema de banco e o legado mais dificil: consumidores externos dependem das colunas por nome. A tecnica mantem schema antigo e novo coexistindo, sincronizados por triggers ou views, durante uma janela de deprecacao; so entao remove o antigo.

```mermaid
flowchart TD
    A["Entrada: schema a refatorar<br/>ex: Rename Column, Split Table"] --> B["1. Escolher o database refactoring<br/>catalogar consumidores leitores e escritores"]
    B --> C["2. Schema novo + antigo coexistem<br/>adicionar coluna/tabela nova<br/>manter a antiga intacta"]
    C --> D["3. Scaffolding de sincronia<br/>trigger: escrita no antigo replica no novo<br/>trigger: escrita no novo replica no antigo<br/>view: leituras transparentes"]
    D --> E["Testar sincronia<br/>escrever nos dois sentidos<br/>verificar equivalencia"]
    E --> F{"Sincronia<br/>bidirecional ok?"}
    F -- "Nao" --> D
    F -- "Sim" --> G["4. Migrar consumidores<br/>um a um do antigo para o novo<br/>cada migracao com teste de regressao"]
    G --> H{"Todos os consumidores<br/>migrados para o novo?"}
    H -- "Nao" --> G
    H -- "Sim" --> I["5. Deprecation window<br/>marcar antigo como deprecated<br/>monitorar uso residual"]
    I --> J{"Uso residual<br/>zerado apos janela?"}
    J -- "Nao: consumidor esquecido" --> K["Identificar e migrar<br/>consumidor residual"]
    K --> I
    J -- "Sim" --> L["6. Remover scaffolding<br/>triggers e views de sincronia"]
    L --> M["7. Remover schema antigo<br/>migration versionada em todos os ambientes"]
    M --> Z["Saida: schema refatorado<br/>sem downtime nem dado perdido"]
```

**Passo a passo**
1. **Escolher o refactoring e mapear consumidores.** Entrada: schema atual. Cataloga todos os leitores e escritores (apps, jobs, scripts, relatorios) da entidade a mudar. Saida: mapa de impacto.
2. **Adicionar o schema novo sem remover o antigo.** Ex.: Rename Column → adiciona coluna nova com o nome correto; a coluna antiga permanece. Saida: schema dual.
3. **Scaffolding de sincronia.** Cria triggers (INSERT/UPDATE em ambos sentidos) e views que tornam leituras transparentes. Saida: os dois schemas em sincronia bidirecional.
4. **Migrar consumidores incrementalmente.** Cada app/job migrado para o schema novo e validado com teste de regressao antes do proximo. Saida: cada consumidor usando o novo.
5. **Deprecation window.** Marca o schema antigo como deprecated; monitora uso residual por metrica (query analyzer, logs). Janela tipica: 1 sprint a varias semanas conforme risco.
6. **Remover scaffolding.** Triggers e views de sincronia sao removidos quando ninguem mais usa o antigo.
7. **Remover o schema antigo.** Migration versionada (numerada) aplicada em dev → staging → producao. Saida: schema limpo.

**Gates**
- **G1 (sincronia bidirecional)** — `Sincronia ok?` Nao → corrige triggers antes de migrar qualquer consumidor (consumidor migrando com sincronia quebrada = dados inconsistentes).
- **G2 (cada consumidor)** — `Todos migrados?` Nao → continua migrando um a um; nunca remove o antigo com consumidor vivo.
- **G3 (uso residual)** — `Uso zerado?` Nao → identifica e migra o consumidor esquecido antes de fechar a janela.
- **G4 (migracao versionada)** — o script de remocao do antigo e numerado e idempotente; roda em todos os ambientes na mesma ordem.
- **Invariante:** dados nao sao perdidos em nenhuma etapa; rollback e possivel ate o passo 6 (reativar triggers, nao servir do antigo).

---

## L17 — Composicao de padroes POSA top-down (Buschmann / GoF / idiomas)

> Padroes existem em tres niveis de granularidade (arquitetural / design / idioma). O fluxo correto e top-down: escolhe o padrao arquitetural que realiza os requisitos de sistema, deriva os design patterns que realizam cada componente, desce aos idiomas da linguagem-alvo, e verifica consistencia vertical entre os tres niveis — com gate anti-patternitis em cada descida.

```mermaid
flowchart TD
    A["Entrada: requisitos de sistema<br/>forcas de qualidade identificadas"] --> B["1. Escolher padrao arquitetural<br/>POSA: Layers, Pipes-and-Filters,<br/>Broker, Microkernel, Blackboard, MVC, Reflection"]
    B --> C{"Padrao arquitetural<br/>atende as forcas<br/>de qualidade?"}
    C -- "Nao: forcas em conflito" --> B
    C -- "Sim" --> D["2. Decompor em componentes<br/>definir responsabilidade<br/>de cada camada ou parte"]
    D --> E["3. Para cada componente:<br/>identificar aspecto que varia<br/>escolher design pattern GoF"]
    E --> F{"Padrao GoF escolhido<br/>e deep?<br/>esconde mais do que expoe"}
    F -- "Shallow: overhead injustificado" --> G["Usar estrutura mais simples<br/>classe concreta ou funcao<br/>sem padrao"]
    G --> H
    F -- "Deep: justificado" --> H["4. Descer a idiomas<br/>da linguagem-alvo<br/>RAII, context manager,<br/>defer, traits, hooks, HOF"]
    H --> I{"Idioma de linguagem<br/>resolve mais barato<br/>que o padrao completo?"}
    I -- "Sim" --> J["Usar idioma<br/>sem a cerimonia do padrao"]
    I -- "Nao" --> K["Implementar padrao<br/>com idiomas como<br/>mecanismo de realizacao"]
    J --> L
    K --> L["5. Verificar consistencia<br/>entre os tres niveis:<br/>padrao arquitetural realizado<br/>pelos design patterns escolhidos?<br/>idiomas servem o padrao GoF?"]
    L --> M{"Inconsistencia<br/>entre niveis?"}
    M -- "Sim" --> N["Revisar nivel inconsistente<br/>subir ou descer conforme<br/>origem da inconsistencia"]
    N --> L
    M -- "Nao" --> O["6. Gate anti-patternitis:<br/>cada padrao suporta<br/>>=1 variacao concreta hoje?<br/>nenhuma interface com 1 impl especulativa?"]
    O --> P{"Algum padrao<br/>e especulativo?"}
    P -- "Sim" --> Q["Remover ou simplificar<br/>refatorar away from pattern"]
    Q --> O
    P -- "Nao" --> Z["Saida: arquitetura coesa<br/>com vocabulario de padroes<br/>em 3 escalas consistentes"]
```

**Passo a passo**
1. **Escolher padrao arquitetural.** Entrada: requisitos + forcas de qualidade (modificabilidade → Layers; processamento de fluxo → Pipes-and-Filters; extensibilidade → Microkernel; distribuicao → Broker; aprendizado emergente → Blackboard; interface interativa → MVC). Saida: padrao arquitetural + consequencias documentadas.
2. **Decompor em componentes.** Para cada parte do padrao arquitetural (ex.: camada de apresentacao, dominio, dados em Layers), define responsabilidade clara. Saida: mapa de componentes.
3. **Escolher design pattern GoF por componente.** Para cada componente, identifica o aspecto que varia (comportamento → Strategy/Observer; criacao → Factory; estrutura → Decorator/Adapter; estado → State). Gate deep: a abstracao esconde mais do que expoe? Se shallow, usa estrutura simples.
4. **Descer a idiomas.** Para cada design pattern, verifica se um idioma da linguagem-alvo resolve o problema de forma mais barata (ex.: HOF substitui Strategy em linguagem funcional; context manager realiza RAII em Python; decorator sintatico realiza Decorator GoF em Python/TypeScript).
5. **Verificar consistencia vertical.** Os idiomas realizam os design patterns? Os design patterns realizam o padrao arquitetural? Se ha inconsistencia em algum nivel, revisa o nivel de origem.
6. **Gate anti-patternitis.** Para cada padrao nos tres niveis: existe variacao concreta hoje que o justifica? Ha interface com uma unica implementacao especulativa? Se sim, remove ou simplifica (refatora away from pattern).

**Gates**
- **G1 (forcas atendidas)** — `Padrao arquitetural atende as forcas?` Nao → escolhe outro (ex.: Pipes-and-Filters tem processamento sequencial obrigatorio — se a ordem nao e deterministica, Blackboard e melhor).
- **G2 (deep vs shallow no GoF)** — `Padrao GoF e deep?` Shallow → usa estrutura simples; overhead de indireção nao justificado.
- **G3 (idioma mais barato)** — `Idioma resolve mais barato?` Sim → usa o idioma sem o padrao completo; menos cerimonia, mesmo resultado.
- **G4 (consistencia vertical)** — `Inconsistencia entre niveis?` Sim → revisa o nivel de origem da inconsistencia (nao forca o nivel inferior a compensar decisao ruim no superior).
- **G5 (anti-patternitis)** — `Algum padrao especulativo?` Sim → remove (YAGNI aplicado a todos os tres niveis).
