---
titulo: "LOOPS — Design & Arquitetura: Diagramas, Passo a Passo e Gates"
tipo: formalizacao-workflows
dominio: arquitetura-ddd-requisitos
onda: 2-arquitetura-dominio
fase: 2
created: 2026-06-20
fontes:
  - 02-arquitetura-extracao.md
  - 04-ddd-extracao.md
  - 16-requisitos-produto-sistemas-extracao.md
  - 02-arquitetura.md (mapa-fonte, secao Workflows)
  - 04-ddd.md (mapa-fonte, secao Workflows)
  - 16-requisitos-produto-sistemas.md (mapa-fonte, secao Workflows)
---

# LOOPS — Design & Arquitetura: Diagramas Prontos

> Formaliza os workflows canonicos de **Arquitetura**, **DDD** e **Requisitos/Produto/Sistemas**
> em diagramas mermaid + passo a passo numerado (entrada/saida) + pontos de gate.
> Pronto para a Fase 3 (visual) e para virar comportamento de agent arquiteto.
>
> Convencao dos diagramas:
> - `([texto])` = entrada/inicio · `[texto]` = passo · `{texto}` = decisao/gate
> - aresta tracejada com label = **laco** (volta) · `:::gate` = ponto de gate critico
> - Todo `{gate}` no passo a passo esta marcado com **GATE** e o criterio de aprovacao.

---

## Indice dos loops

| # | Workflow canonico | Origem | Saida principal |
|---|---|---|---|
| L1 | Derivacao de arquitetura por atributos de qualidade (ADD-light) | Richards/Ford · Bass/SEI | Estilo + boundaries + ADRs + fitness functions |
| L2 | Avaliacao de trade-off (ATAM resumido) | Bass/Clements/Kazman (SEI) | Relatorio de riscos + sensitivity/tradeoff points |
| L3 | Ciclo de vida de ADR (ADR lifecycle) | Nygard · MADR 4.0.0 | ADR imutavel versionado |
| L4 | EventStorming -> bounded contexts | Brandolini · Evans | Lista de contexts + Context Map + UL |
| L5 | Decomposicao de monolito (The Hard Parts + Strangler Fig) | Ford et al. · Newman | Topologia distribuida incremental + contratos |
| L6 | Mudanca evolutiva guiada por fitness function | Ford/Parsons/Kua | Mudanca promovida sob governanca automatizada |
| L7 | Descoberta de requisito -> outcome -> story | Torres · Patton · Adzic · Cohn | Story INVEST com key examples testaveis |
| — | **Loop mestre do agent arquiteto** | sintese | Decisao arquitetural fundamentada ponta a ponta |

---

## L1 — Derivacao de arquitetura por atributos de qualidade (ADD-light + ATAM-light)

> Traduz requisitos em estrutura via trade-off explicito. Os atributos de qualidade (ASRs) dirigem
> a arquitetura — nao as features, nem a tecnologia da moda (P4).

```mermaid
flowchart TD
  IN([Requisitos funcionais + restricoes + ASRs]) --> S1[1. Elicitar ASRs<br/>quality attribute scenario de 6 partes]
  S1 --> S2[2. Priorizar top 3-7 -ilities<br/>utility tree: importancia x dificuldade H/M/L]
  S2 --> S3[3. Selecionar estilo candidato<br/>scorecard de estilos]
  S3 --> G1{GATE monolito x distribuido<br/>existe quantum que precisa<br/>deploy/escala independentes?}
  G1 -->|nao| MM[Monolito modular]
  G1 -->|sim| DIST[Estilo distribuido]
  MM --> S4[4. Definir boundaries<br/>bounded context + deep modules]
  DIST --> S4
  S4 --> S5[5. Aplicar taticas por atributo<br/>catalogo SEI]
  S5 --> S6[6. Registrar ADR por decisao<br/>ver L3]
  S6 --> S7{7. GATE ATAM-light<br/>sensitivity + tradeoff points<br/>risco aceitavel?}
  S7 -->|nao: risco inaceitavel| S3
  S7 -->|sim| S8[8. Instrumentar fitness functions<br/>ver L6]
  S8 --> OUT([Arquitetura derivada + governanca ativa])
  S8 -.laco continuo: toda mudanca re-valida.-> S8

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,S7 gate;
```

### Passo a passo (entrada -> saida)
1. **Elicitar ASRs** — entrada: requisitos + restricoes. Para cada um, escreva um *quality attribute scenario* de 6 partes (source -> stimulus -> artifact -> environment -> response -> response measure). Saida: lista de ASRs com cenarios.
2. **Priorizar top 3-7 "-ilities"** — entrada: ASRs. Monte uma *utility tree* (atributo -> refinamento -> cenario) marcando (importancia x dificuldade) = H/M/L. Saida: drivers (H,H).
3. **Selecionar estilo candidato** — entrada: drivers. Case atributos com scorecard (layered, modular monolith, event-driven, microservices, space-based, microkernel). Saida: estilo candidato.
4. **Definir boundaries** — entrada: estilo. Decompor por bounded context (L4) + information hiding (deep modules). Saida: componentes + quanta.
5. **Aplicar taticas** — entrada: boundaries + atributos. availability -> redundancia/failover; performance -> caching/concorrencia; modifiability -> encapsulation; security -> limit access/authenticate. Saida: decisoes taticas.
6. **Registrar ADR** — entrada: cada decisao estrutural. Saida: ADR versionado (L3).
7. **Avaliar (ATAM-light)** — entrada: arquitetura. Identifique sensitivity points e tradeoff points. Saida: relatorio de risco.
8. **Instrumentar fitness functions** — entrada: atributos criticos. Saida: governanca continua (L6).

### Pontos de gate
- **GATE G1 — Monolito x distribuido.** Aprova distribuir SOMENTE se existe um quantum com necessidade real de deploy/escala/time independentes E DevOps maduro. Default: **monolito modular primeiro** (consenso 2024-2026). Reprovado -> monolito modular.
- **GATE S7 — ATAM-light.** Aprova se nenhum tradeoff point gera risco inaceitavel. Reprovado -> **laco de volta ao passo 3** (re-selecionar estilo).

---

## L2 — Avaliacao de trade-off (ATAM resumido)

> Avalia uma arquitetura ja candidata contra cenarios priorizados, expondo onde decisoes afetam
> multiplos atributos em direcoes opostas (tradeoff points).

```mermaid
flowchart TD
  IN([Drivers de negocio + arquitetura candidata]) --> A1[1. Apresentar drivers de negocio + arquitetura]
  A1 --> A2[2. Catalogar abordagens arquiteturais usadas]
  A2 --> A3[3. Gerar utility tree<br/>priorizar cenarios: importancia x dificuldade]
  A3 --> A4[4. Analisar abordagens vs cenarios<br/>marcar riscos, non-risks,<br/>sensitivity points, tradeoff points]
  A4 --> A5[5. Brainstorm e priorizar cenarios<br/>com stakeholders]
  A5 --> A6{6. GATE reanalise<br/>riscos mitigaveis?}
  A6 -->|nao| REV[Revisao de arquitetura<br/>volta ao desenho - L1 passo 3]
  REV -.laco.-> A1
  A6 -->|sim| OUT([Relatorio de riscos aprovado])

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class A6 gate;
```

### Passo a passo (entrada -> saida)
1. **Apresentar drivers** — entrada: contexto de negocio + arquitetura. Saida: alinhamento de stakeholders.
2. **Catalogar abordagens** — entrada: arquitetura. Liste estilos/padroes usados. Saida: inventario de abordagens.
3. **Gerar utility tree** — entrada: ASRs. Priorize cenarios (importancia x dificuldade). Saida: cenarios ranqueados.
4. **Analisar abordagens vs cenarios** — entrada: cenarios + abordagens. Saida: riscos, non-risks, **sensitivity points** (afeta muito 1 atributo), **tradeoff points** (afeta >=2 atributos em direcoes opostas).
5. **Brainstorm e priorizar cenarios** — entrada: analise. Stakeholders votam. Saida: cenarios criticos confirmados.
6. **Reanalisar** — entrada: riscos. Saida: relatorio de riscos.

### Pontos de gate
- **GATE A6 — Riscos mitigaveis?** Aprova se todo risco critico tem mitigacao viavel. Reprovado -> **laco para revisao de arquitetura** (reabre L1 a partir do passo 3).

---

## L3 — Ciclo de vida de ADR (ADR lifecycle, MADR/Nygard)

> Um ADR e imutavel apos aceito. Mudou a decisao? Cria-se um novo ADR com status `superseded by`
> referenciando o anterior — o historico permanece rastreavel.

```mermaid
stateDiagram-v2
  [*] --> Detectada: decisao significativa<br/>(dificil de reverter / trade-off relevante)
  Detectada --> Proposed: redigir ADR<br/>(Context, Options, Decision, Consequences)
  Proposed --> Revisao: circular para decision-makers/consulted
  Revisao --> Accepted: GATE aprovado
  Revisao --> Rejected: GATE reprovado
  Revisao --> Proposed: ajustar e recircular
  Accepted --> Versionado: commit em docs/architecture/decisions/NNNN-titulo.md
  Versionado --> [*]
  Accepted --> Superseded: nova decisao
  Superseded --> [*]: novo ADR referencia o antigo (status superseded by)
  Rejected --> [*]: registrado (evita reabrir debate)

  note right of Accepted
    Imutavel apos aceito.
    Context e a secao mais
    importante (o porque).
  end note
```

### Passo a passo (entrada -> saida)
1. **Detectar decisao significativa** — entrada: design em andamento. Gatilho: algo dificil/caro de reverter ou com trade-off relevante. Saida: candidato a ADR.
2. **Redigir ADR** — entrada: candidato. Secoes: Context and Problem Statement, Decision Drivers, Considered Options, Decision Outcome, Consequences (bom E ruim), Pros/Cons por opcao. Titulo como problema-solucao ("Use X para Y"). Saida: ADR em status `proposed`.
3. **Circular para revisao** — entrada: ADR proposed. Papeis RACI: decision-makers, consulted, informed. Saida: parecer.
4. **Status Accepted** — entrada: aprovacao. Versionar junto ao codigo. Saida: ADR imutavel.
5. **Supersede quando mudar** — entrada: nova decisao. Cria novo ADR `superseded by ADR-NNNN`; o antigo vira `superseded`. Saida: historico imutavel encadeado.

### Pontos de gate
- **GATE Revisao -> Accepted.** Aprova se a decisao tem Context factual, opcoes consideradas (incluindo rejeitadas) e consequencias negativas explicitadas. Reprovado -> `rejected` (registrado para nao reabrir) ou `proposed` (ajustar).
- **Regra de imutabilidade.** Nunca editar um ADR aceito — sempre supersede. Garante rastreabilidade.

---

## L4 — EventStorming -> bounded contexts

> Descobre as fronteiras REAIS do negocio (linguisticas), nao as inventa. Heuristica central de
> Brandolini: **mudanca de vocabulario = fronteira de contexto**; nao resolver duplicatas cedo.

```mermaid
flowchart TD
  IN([Problema de negocio + especialistas + construtores]) --> E1[1. Reunir<br/>superficie ilimitada + post-its]
  E1 --> E2[2. Big Picture: colar Domain Events laranja<br/>verbo no passado, ordem temporal]
  E2 --> E3[3. Enforce timeline + marcar Pivotal Events<br/>mudancas de fase do negocio]
  E3 --> E4[4. Process Modeling: commands azul,<br/>actors, policies lilas, sistemas externos]
  E4 --> E5[5. Marcar Hotspots vermelho<br/>conflitos, duvidas, desconhecidos]
  E5 -.laco: hotspot vira pergunta ao especialista<br/>revelou evento novo? volta a 2.-> E2
  E5 --> E6{Duplicata de evento?<br/>mesmo nome em 2 pontos}
  E6 -->|sim| DUP[Sinal de DOIS contexts<br/>com perspectivas diferentes<br/>NAO resolver agora]
  E6 -->|nao| E7
  DUP --> E7[6. Agrupar eventos por<br/>linguagem/modelo homogeneo]
  E7 --> E8[7. Desenhar Context Map<br/>shared kernel, customer-supplier,<br/>conformist, ACL, OHS, published language]
  E8 --> G2{GATE: dominio compreendido<br/>o suficiente?}
  G2 -->|nao| E5
  G2 -->|sim| OUT([Lista de bounded contexts + Context Map + Linguagem Ubiqua])

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class E6,G2 gate;
```

### Passo a passo (entrada -> saida)
1. **Reunir** — entrada: problema de negocio. Junte quem conhece o negocio E quem vai construir. Saida: grupo alinhado.
2. **Caos exploratorio (Big Picture)** — entrada: conhecimento tacito. Cole todos os *domain events* (laranja, passado). Saida: linha do tempo bruta.
3. **Enforce a timeline** — entrada: eventos. Ordene; marque *pivotal events*. Saida: esqueleto temporal ("Goldilocks state").
4. **Process Modeling** — entrada: eventos ordenados. Adicione commands (azul), actors, policies (lilas), sistemas externos (rosa), read models (verde). Saida: fluxo causal completo.
5. **Mapear hotspots** — entrada: fluxo. Marque (vermelho) conflitos/duvidas. Saida: perguntas ao especialista.
6. **Agrupar por linguagem homogenea** — entrada: eventos + hotspots resolvidos. Cada cluster coeso = candidato a **bounded context**. Saida: clusters.
7. **Desenhar Context Map** — entrada: contexts. Defina o padrao de relacao de cada par. Saida: mapa de relacoes = criterio de decomposicao em servicos/modulos/agentes.

### Pontos de gate
- **GATE E6 — Duplicata de evento.** O mesmo nome em dois pontos NAO e erro: e **pista de boundary** (dois contexts). Nao resolver cedo.
- **GATE G2 — Dominio compreendido?** Aprova se nao restam hotspots criticos e cada cluster tem linguagem consistente. Reprovado -> **laco para resolver hotspots** (passo 5).

---

## L5 — Decomposicao de monolito (The Hard Parts + Strangler Fig)

> So distribui o que prova precisar. Avalie disintegrators vs integrators por candidato; extraia
> um boundary por vez via Strangler Fig, com ACL entre o novo servico e o legado.

```mermaid
flowchart TD
  IN([Monolito + metricas]) --> M1{1. GATE prontidao<br/>vale o custo de distribuir?}
  M1 -->|nao| MOD[Manter monolito MODULAR<br/>fronteiras duras, sem distribuir]
  M1 -->|sim| M2[2. Component-based decomposition<br/>grafo de componentes + dependencias]
  M2 --> M3[3. Pesar disintegrators x integrators<br/>por componente]
  M3 --> G3{Granularidade final<br/>separar ou juntar?}
  G3 --> M4[4. Definir data boundaries<br/>database-per-context]
  M4 --> M5[5. Escolher saga pattern<br/>comunicacao x consistencia x coordenacao]
  M5 --> M6[6. Strangler Fig: extrair 1 boundary,<br/>rotear trafego, ACL com legado]
  M6 --> M7[7. Estabelecer contratos<br/>consumer-driven + fitness function de contrato]
  M7 --> G4{Monolito esvaziou?}
  G4 -->|nao| M2
  G4 -->|sim| OUT([Topologia distribuida + contratos versionados])
  M6 -.laco: 1 boundary por vez.-> M6

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class M1,G3,G4 gate;
```

### Passo a passo (entrada -> saida)
1. **Avaliar prontidao** — entrada: monolito + metricas. Saida: decisao distribuir/nao. Se nao -> monolito modular.
2. **Component-based decomposition** — entrada: monolito. Mapeie componentes logicos e dependencias. Saida: grafo de componentes.
3. **Disintegrators x integrators** — entrada: grafo. Disintegrators (escopo/SRP, codigo volatil, escala diferenciada, fault tolerance, seguranca, extensibilidade) vs integrators (transacao ACID, dados acoplados, latencia, workflow). Saida: granularidade por candidato.
4. **Data boundaries** — entrada: granularidade. Decida database-per-context. Saida: distribuicao de dados.
5. **Saga pattern** — entrada: transacoes cross-service. Saida: padrao de transacao distribuida (cada passo publica via outbox).
6. **Strangler Fig** — entrada: 1 boundary. Extraia, roteie trafego, use ACL com o legado. Saida: servico extraido.
7. **Contratos** — entrada: interfaces. consumer-driven contracts versionados. Saida: contratos + fitness function de contrato.

### Pontos de gate
- **GATE M1 — Prontidao.** Aprova distribuir so se o custo de distribuicao se paga (DevOps maduro, dor concreta). Reprovado -> monolito modular. (Evita o anti-padrao *distributed monolith*.)
- **GATE G3 — Granularidade.** Evita nano-services (fino demais) e mega-services (grosso demais).
- **GATE G4 — Esvaziou?** Reprovado -> **laco** repete passos 2-7 para o proximo componente.

---

## L6 — Mudanca evolutiva guiada por fitness function

> Arquitetura nao e diagrama estatico: e um conjunto de propriedades a proteger no tempo. Mudanca
> = incremental + guiada, validada por fitness functions no pipeline ("rules live in code").

```mermaid
flowchart TD
  IN([Dimensao a proteger:<br/>tecnica/dados/seguranca/operacional]) --> F1[1. Identificar dimensao]
  F1 --> F2[2. Escrever fitness function<br/>atomica/holistica - static/dynamic - CI/continuous]
  F2 --> F3[3. Integrar no pipeline de deployment<br/>gate de CI]
  F3 --> F4[4. Fazer mudanca incremental]
  F4 --> F5{5. GATE: fitness functions passam?}
  F5 -->|nao| FIX[Reverter / corrigir]
  FIX -.laco.-> F4
  F5 -->|sim| F6[6. Promover - deploy]
  F6 --> OUT([Mudanca promovida sob governanca])
  F6 -.laco continuo: toda mudanca futura<br/>repassa pelas fitness functions.-> F4

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class F5 gate;
```

### Passo a passo (entrada -> saida)
1. **Identificar dimensao a proteger** — entrada: atributo critico. Saida: alvo de governanca.
2. **Escrever fitness function** — entrada: dimensao. Escolha o tipo: **atomic** (1 aspecto) x **holistic**; **static** (ciclos, camadas) x **dynamic** (latencia); **triggered/CI** x **continuous**; **automated** x **manual**. Saida: teste executavel (ex.: ArchUnit `noClasses().that().resideInAPackage("..domain..").should().dependOnClassesThat().resideInAPackage("..infrastructure..")`).
3. **Integrar no pipeline** — entrada: fitness function. Saida: gate de CI ativo.
4. **Mudanca incremental** — entrada: alvo de evolucao. Saida: codigo alterado.
5. **Executar fitness functions** — entrada: build. Saida: pass/fail.
6. **Promover** — entrada: build aprovado. Saida: deploy.

### Pontos de gate
- **GATE F5 — Fitness functions passam?** Reprovado -> **laco reverter/corrigir** (passo 4). Aprovado -> promove.
- **Higiene.** Manter poucas e de alto sinal — fitness functions frageis/ruidosas viram debito.

---

## L7 — Descoberta de requisito -> outcome -> story

> O fio que antecede o codigo: do desejo difuso ao requisito verificavel amarrado a um outcome.
> Combina Continuous Discovery (OST), Story Mapping/Slicing (SPIDR+INVEST) e Specification by Example.

```mermaid
flowchart TD
  IN([Estrategia de produto]) --> R1[1. Definir outcome-alvo mensuravel<br/>raiz do OST]
  R1 --> R2[2. Entrevistar usuarios story-based<br/>cadencia semanal]
  R2 --> R3[3. Mapear oportunidades<br/>dores/necessidades sob o outcome]
  R3 --> R4{4. Priorizar 1 oportunidade<br/>qual mais move o outcome?}
  R4 --> R5[5. Gerar >=3 solucoes<br/>anti confirmation bias]
  R5 --> R6[6. Testar assumption mais arriscada primeiro<br/>value/usability/feasibility/viability]
  R6 --> G5{GATE evidencia<br/>sustenta a solucao?}
  G5 -->|nao| R5
  G5 -->|nao: oportunidade errada| R3
  G5 -->|sim| R7[7. Fatiar em story<br/>backbone + walking skeleton + SPIDR]
  R7 --> R8[8. Example Mapping<br/>rules + examples + questions]
  R8 --> G6{GATE qualidade da story<br/>so-that=outcome? fit criterion?<br/>INVEST? key examples?}
  G6 -->|nao: muitas perguntas/cartoes vermelhos| R8
  G6 -->|sim| OUT([Story Ready: testavel, rastreavel, com key examples])
  R2 -.laco semanal continuo.-> R2

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class R4,G5,G6 gate;
```

### Passo a passo (entrada -> saida)
1. **Definir outcome-alvo** — entrada: estrategia. Outcome mensuravel ligado a negocio. Saida: raiz do OST.
2. **Entrevistar usuarios** — entrada: usuarios. Historias reais de comportamento (nao opiniao), cadencia semanal. Saida: snapshots de experiencia.
3. **Mapear oportunidades** — entrada: historias. Extraia dores/necessidades sob o outcome. Saida: camada de opportunities.
4. **Priorizar 1 oportunidade** — entrada: opportunities. Saida: oportunidade-alvo.
5. **Gerar >=3 solucoes** — entrada: oportunidade. Saida: camada de solutions.
6. **Testar assumptions** — entrada: solucoes. Teste a hipotese mais arriscada e desconhecida primeiro (desejabilidade/usabilidade/factibilidade/viabilidade). Saida: evidencia.
7. **Fatiar em story** — entrada: solucao validada. backbone narrativo -> walking skeleton -> SPIDR (Spike/Path/Interface/Data/Rules). Saida: story vertical.
8. **Example Mapping** — entrada: story. Story (amarelo) + Rules (azul) + Examples (verde, incl. contra-exemplo) + Questions (rosa). Saida: criterios Given/When/Then = testes.

### Pontos de gate
- **GATE R4 — Priorizacao.** Escolhe a oportunidade que mais move o outcome.
- **GATE G5 — Evidencia.** Aprovado -> story slicing. Reprovado -> **laco para nova solucao (5)** ou **reavaliar oportunidade (3)** e atualizar o OST (OST e documento vivo, nao entregavel).
- **GATE G6 — Qualidade da story.** Aprova se: `so that` = outcome; tem **fit criterion** quantificado (Volere); passa **INVEST**; tem **key examples** concretos prontos para virar teste; e rastreavel (feature->story->exemplo->teste). Muitas perguntas/cartoes vermelhos -> **laco** (quebrar/refinar, passo 8).

---

## Loop mestre do agent arquiteto

> Diagrama unico que um agent de IA segue para tomar uma decisao arquitetural **fundamentada**,
> encadeando os sete loops: entender o requisito/outcome -> modelar o dominio -> escolher o estilo
> por trade-off -> registrar o ADR -> definir a fitness function -> validar. Cada `{GATE}` e um ponto
> onde o agent NAO avanca sem satisfazer o criterio; cada aresta tracejada e um laco de aprendizado.

```mermaid
flowchart TD
  START([Briefing / pedido de decisao arquitetural]) --> C1{GATE Cynefin<br/>classificar complexidade}
  C1 -->|clear/complicated| UP[Mais upfront:<br/>ASRs, use case fully dressed]
  C1 -->|complex| EM[Emergente:<br/>OST, experimento, key examples just-in-time]
  C1 -->|chaotic| STAB[Estabilizar primeiro]

  UP --> P1[1. ENTENDER requisito/outcome - L7<br/>outcome-alvo + ASRs + fit criterion]
  EM --> P1
  STAB --> P1

  P1 --> P2[2. MODELAR dominio - L4<br/>EventStorming -> bounded contexts + UL]
  P2 --> GD{GATE dominio<br/>fronteiras descobertas pela<br/>mudanca de linguagem, nao por camada?}
  GD -->|nao| P2
  GD -->|sim| P3[3. ESCOLHER estilo por trade-off - L1<br/>utility tree + scorecard]

  P3 --> GMM{GATE monolito x distribuido<br/>ha quantum que precisa<br/>deploy/escala independentes?}
  GMM -->|nao| MM2[Monolito modular default]
  GMM -->|sim| D2[Distribuir por bounded context - L5]
  MM2 --> P4
  D2 --> P4

  P4[4. AVALIAR trade-off - L2<br/>sensitivity + tradeoff points] --> GTO{GATE ATAM-light<br/>risco aceitavel?}
  GTO -->|nao| P3
  GTO -->|sim| P5[5. REGISTRAR ADR - L3<br/>Context/Options/Decision/Consequences]

  P5 --> GADR{GATE ADR<br/>consequencias negativas escritas?<br/>opcoes rejeitadas registradas?}
  GADR -->|nao| P5
  GADR -->|sim| P6[6. DEFINIR fitness function - L6<br/>codifica o atributo a proteger]

  P6 --> P7[7. VALIDAR mudanca incremental]
  P7 --> GFF{GATE fitness functions<br/>passam no CI?}
  GFF -->|nao| P7
  GFF -->|sim| DONE([Decisao arquitetural promovida<br/>+ ADR + governanca ativa])

  DONE -.laco evolutivo: negocio mudou ->.-> P1
  DONE -.upgrade por leverage point forte<br/>regra/meta/info antes de trocar tooling.-> P6

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  classDef phase fill:#def,stroke:#36b,stroke-width:1px;
  class C1,GD,GMM,GTO,GADR,GFF gate;
  class P1,P2,P3,P4,P5,P6,P7 phase;
```

### Os 6 gates inegociaveis do agent arquiteto

| Gate | Pergunta de aprovacao | Reprovado -> |
|---|---|---|
| **Cynefin** | A complexidade foi classificada (clear/complicated/complex/chaotic)? | Calibra cerimonia (upfront x emergente) |
| **Dominio** | As fronteiras vieram de mudanca de linguagem (bounded context), nao de camada tecnica? | Volta a modelar (L4) |
| **Monolito x distribuido** | Existe um quantum que REALMENTE precisa de deploy/escala/time independentes? | Monolito modular (default) |
| **ATAM-light** | Sensitivity/tradeoff points identificados e risco aceitavel? | Re-seleciona estilo (L1.3) |
| **ADR** | 1 decisao, Context factual, opcoes rejeitadas e consequencias negativas escritas? | Reescreve o ADR |
| **Fitness function** | O atributo critico esta codificado como teste e passa no CI? | Corrige a mudanca |

### Sequencia canonica (mnemonico)
**Entender -> Modelar -> Escolher -> Avaliar -> Registrar -> Proteger -> Validar.**
Cada etapa cita seu loop (L7 -> L4 -> L1 -> L2 -> L3 -> L6 -> L6), e nenhuma avanca sem cruzar o gate.

### Aplicacao direta a squads de agentes (verificavel)
- **Agente = bounded context** (L4): linguagem ubiqua propria; overlap de escopo entre agentes = boundary errado (sinal de duplicata do EventStorming).
- **Orquestrador = Process Manager**: roteia por verbos/capabilities, nao executa dominio.
- **Handoff = consumer-driven contract** (L3+L5): artefato versionado validado na entrada (Idempotent Receiver).
- **ACL interno -> user-facing**: traduzir codinomes/@agents/paths para linguagem de negocio = fitness function automatizavel (zero vazamento de estrutura interna).
- **ADR automatico** (L3): toda escolha estrutural do squad (novo agente, novo boundary, novo contrato) gera um ADR.
- **Evolucao fitness-function-driven** (L6): gate de qualidade (sem invencao de fontes, formato correto, sem vazamento) roda como teste antes de promover. **Eval-driven development**: key examples = golden dataset.
- **Upgrade por leverage point forte** (L7/Meadows): mude regra/meta/fluxo de informacao (prompt de sistema, criterios de gate, contexto injetado) ANTES de trocar modelo/temperatura.

---

## L8 — Impact Mapping (Goal -> Actors -> Impacts -> Deliverables)

> Conecta o que se constroi ao PORQUE de negocio, tratando deliverables como hipoteses testaveis
> de impacto — combate direto a feature factory. Fonte: Adzic (Impact Mapping, 2012).

```mermaid
flowchart TD
  IN([Objetivo de negocio mensuravel]) --> I1[1. Fixar a meta<br/>Goal mensuravel e com prazo<br/>PORQUE estamos construindo isso]
  I1 --> I2[2. Mapear atores<br/>quem pode ajudar ou atrapalhar a meta<br/>QUEM sao os Actors]
  I2 --> I3[3. Definir impactos por ator<br/>como o comportamento do ator<br/>precisa mudar para a meta ser atingida<br/>COMO cada Actor contribui]
  I3 --> I4[4. Listar deliverables<br/>o que podemos construir para<br/>causar cada impacto<br/>O QUE construimos]
  I4 --> G1{GATE priorizacao<br/>qual caminho Actor-Impact-Deliverable<br/>e o menor para mover a meta?}
  G1 --> I5[5. Tratar deliverable como hipotese<br/>nao como compromisso<br/>definir como medir o impacto]
  I5 --> I6[6. Conectar a specs<br/>deliverable selecionado vira escopo<br/>alimenta L9 Use Case ou Story Map]
  I6 --> I7[7. Medir impacto real apos entrega]
  I7 --> G2{GATE impacto<br/>o deliverable moveu<br/>o comportamento do ator?}
  G2 -->|sim| G3{Meta atingida?}
  G2 -->|nao| DESC[Descartar deliverable<br/>testar outro ramo do mapa]
  DESC -.laco.-> I3
  G3 -->|nao| I3
  G3 -->|sim| OUT([Meta atingida + mapa de hipoteses validadas])

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,G2,G3 gate;
```

### Passo a passo (entrada -> saida)
1. **Fixar a meta (Goal)** — entrada: objetivo de negocio. A meta deve ser mensuravel e ter prazo. Responde ao PORQUE. Saida: raiz do impact map.
2. **Mapear atores (Actors)** — entrada: contexto. Liste quem pode ajudar ou atrapalhar a meta (usuarios, clientes, times, sistemas). Saida: 1o nivel de ramos.
3. **Definir impactos (Impacts)** — entrada: ator. Para cada ator: "como seu comportamento precisa mudar para a meta ser atingida?" Saida: 2o nivel de ramos.
4. **Listar deliverables** — entrada: impacto. O que podemos construir para causar este impacto? Tratar como hipoteses, nao compromissos. Saida: folhas do mapa.
5. **Priorizar por impacto** — entrada: deliverables. Qual caminho Actor->Impact->Deliverable e o menor investimento para mover a meta? Saida: aposta priorizada.
6. **Tratar deliverable como hipotese** — entrada: deliverable selecionado. Definir como medir se o impacto aconteceu. Saida: criterio de validacao.
7. **Conectar a specs** — entrada: deliverable validado como escopo. Saida: entrada para use cases (L9) ou story map (L12).

### Pontos de gate
- **GATE G1 — Priorizacao.** Escolhe o caminho de menor investimento que mais move a meta. Evita features sem elo claro a impacto de ator.
- **GATE G2 — Impacto real.** Reprovado -> **laco descarta o deliverable** e testa outro ramo. O mapa e documento vivo; ramos sem impacto sao podados.
- **GATE G3 — Meta atingida.** Reprovado -> **laco de volta ao passo 3** (novos impactos/atores). Aprovado -> ciclo encerrado.

---

## L9 — Use Case Writing de Cockburn (Fully Dressed)

> Captura comportamento como contrato entre stakeholders e o sistema, ancorado no nivel
> sea-level — o mais util para definir fronteiras de aplicacao e gerar key examples.
> Fonte: Cockburn, Writing Effective Use Cases (2000).

```mermaid
flowchart TD
  IN([Objetivo de negocio + ator primario]) --> U1[1. Definir escopo e ator primario<br/>design scope: sistema ou empresa<br/>black-box vs white-box]
  U1 --> U2[2. Listar stakeholders e interests<br/>para cada stakeholder<br/>registrar o interesse a proteger]
  U2 --> G1{GATE nivel de objetivo<br/>o objetivo e sea-level?<br/>cloud alto / fish baixo demais}
  G1 -->|cloud ou fish| REP[Reposicionar o objetivo<br/>subir ou descer um nivel]
  REP --> G1
  G1 -->|sea-level| U3[3. Escrever preconditions<br/>e trigger do caso]
  U3 --> U4[4. Main success scenario<br/>passos numerados do trigger<br/>ate a success guarantee<br/>happy path sem ramificacoes]
  U4 --> U5[5. Derivar extensions<br/>para cada passo: o que pode falhar ou variar<br/>extensao referencia o numero do passo]
  U5 --> G2{GATE completude<br/>todo interesse de stakeholder<br/>esta protegido por uma garantia<br/>ou extensao?}
  G2 -->|nao| U5
  G2 -->|sim| U6[6. Definir guarantees<br/>minimal guarantee sempre verdade<br/>success guarantee no happy path]
  U6 --> G3{GATE formalidade<br/>risco alto = fully dressed<br/>risco baixo = casual}
  G3 -->|casual| COUT([Use case casual entregue])
  G3 -->|fully dressed| U7[7. Revisar com stakeholders<br/>ajustar linguagem ubiqua]
  U7 --> OUT([Use case fully dressed<br/>cada extension vira key example])

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,G2,G3 gate;
```

### Passo a passo (entrada -> saida)
1. **Definir escopo e ator primario** — entrada: objetivo de negocio. Estabeleca design scope (sistema ou empresa) e black-box vs white-box. Identifique o ator primario (quem inicia). Saida: cabecalho do caso.
2. **Listar stakeholders e interests** — entrada: contexto. Para cada stakeholder, registre o interesse que o sistema deve proteger. Esta lista e o motor de completude. Saida: inventario de interesses.
3. **Fixar nivel de objetivo (sea-level)** — entrada: objetivo candidato. Sea-level = objetivo do usuario em uma sessao. Cloud = muito estrategico; fish = subfuncao. Reposicione ate atingir sea-level. Saida: caso ancorado.
4. **Escrever main success scenario** — entrada: trigger e preconditions. Passos numerados do gatilho ate a garantia de sucesso. Apenas o happy path, sem ramificacoes. Saida: cenario principal.
5. **Derivar extensions** — entrada: cada passo do main scenario. Pergunte "o que pode falhar ou variar aqui?" Escreva extensao `3a.`, `3b.`, etc. referenciando o passo. Saida: variantes e falhas mapeadas.
6. **Definir guarantees** — entrada: interesses dos stakeholders. Minimal guarantees (sempre verdadeiro) e success guarantees (caminho feliz). Saida: contrato completo.
7. **Calibrar formalidade** — entrada: nivel de risco. Alto risco -> fully dressed; baixo -> casual. Revisar com stakeholders e ajustar termos. Saida: use case calibrado.

### Pontos de gate
- **GATE G1 — Nivel sea-level.** Reprovado -> reposicionar (subir ou descer). Cloud demais = caso de negocio; fish demais = passo interno.
- **GATE G2 — Completude.** Reprovado -> adicionar extension cobrindo o interesse em falta. Cada extension e um potencial key example para os testes (Adzic).
- **GATE G3 — Formalidade.** Calibra cerimonia sem perder cobertura. Risco alto -> fully dressed com todos os campos. Baixo -> casual (2-5 linhas).

---

## L10 — Systems Modeling de Meadows (Estoques, Fluxos, Loops, Leverage Points)

> Diagnostica qualquer sistema dinamico — software, organizacao, ecossistema de agentes —
> pela estrutura, nao pelos eventos superficiais. Fonte: Meadows, Thinking in Systems (2008).

```mermaid
flowchart TD
  IN([Fenomeno ou problema a entender]) --> M1[1. Delimitar o sistema<br/>fronteiras e horizonte de tempo<br/>o que esta dentro e fora do escopo]
  M1 --> M2[2. Identificar estoques e fluxos<br/>stocks: o que acumula ou diminui<br/>flows: entradas e saidas de cada estoque]
  M2 --> M3[3. Mapear loops de feedback<br/>balanceadores: estabilizam<br/>reforcadores: amplificam ou colapsam<br/>marcar delays]
  M3 --> G1{GATE nivel de causa<br/>o problema e evento superficial<br/>padrao de comportamento<br/>estrutura ou modelo mental?}
  G1 -->|evento: superficie| SUB[Subir na hierarquia<br/>buscar padrao por tras do evento]
  SUB --> G1
  G1 -->|estrutura ou modelo mental| M4[4. Diagnosticar system traps<br/>policy resistance, tragedy of commons<br/>shifting the burden, drift to low performance<br/>escalation, success to the successful<br/>seeking the wrong goal, rule beating]
  M4 --> M5[5. Escolher leverage points<br/>ordem de poder crescente:<br/>parametros -> buffers -> estruturas<br/>-> delays -> loops balanceadores<br/>-> loops reforcadores -> info flows<br/>-> regras -> auto-organizacao<br/>-> metas -> paradigma]
  M5 --> G2{GATE alavanca<br/>e uma alavanca forte<br/>regras meta info paradigma<br/>ou fraca parametro?}
  G2 -->|fraca: so parametro| REL[Reconsiderar: buscar<br/>alavanca mais forte]
  REL --> M5
  G2 -->|forte| M6[6. Intervir e observar<br/>aplicar mudanca incremental<br/>monitorar consequencias de 2a e 3a ordem]
  M6 --> G3{GATE comportamento emergiu<br/>como esperado?}
  G3 -->|nao: surpresa ou delay| M3
  G3 -->|sim| OUT([Intervencao calibrada<br/>mapa de loops atualizado])
  M6 -.laco de aprendizado: todo sistema<br/>surpreende nos delays.-> M3

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,G2,G3 gate;
```

### Passo a passo (entrada -> saida)
1. **Delimitar o sistema** — entrada: fenomeno ou problema. Defina fronteiras (o que entra e sai do modelo) e horizonte de tempo relevante. Saida: escopo do sistema.
2. **Identificar estoques e fluxos** — entrada: sistema delimitado. Estoques = o que acumula (usuarios, divida tecnica, capacidade, confianca). Fluxos = entradas e saidas de cada estoque. Saida: estrutura basica.
3. **Mapear loops de feedback** — entrada: estoques e fluxos. Loops balanceadores (B) estabilizam; loops reforcadores (R) amplificam. Marque delays com seta dupla. Saida: diagrama causal.
4. **Diagnosticar system traps** — entrada: loops mapeados. Confronte com os 8 archetypes. Saida: armadilha identificada com sintoma e causa estrutural.
5. **Escolher leverage points** — entrada: traps e estrutura. Prefira alavancas fortes (regras, metas, fluxos de informacao, paradigma) sobre fracas (parametros). Saida: intervencao priorizada.
6. **Intervir e observar** — entrada: alavanca escolhida. Aplique de forma incremental; monitore consequencias de 2a e 3a ordem e delays. Saida: comportamento novo do sistema.

### Pontos de gate
- **GATE G1 — Nivel de causa.** Eventos sao sintomas; a causa real esta na estrutura ou no modelo mental. Subir na hierarquia ate atingir o nivel estrutural antes de intervir.
- **GATE G2 — Qualidade da alavanca.** Reprovado (so parametro) -> buscar alavanca mais forte. Mude regra/meta/fluxo de informacao antes de ajustar um numero (ex.: mudar o prompt de sistema antes de ajustar temperatura do LLM).
- **GATE G3 — Comportamento emergiu?** Reprovado -> **laco de volta ao passo 3** (o mapa de loops ainda estava incompleto). Sistemas complexos surpreendem — delays mascaram o efeito da intervencao.

---

## L11 — Product Kata de Perri (Melhoria Cientifica Orientada a Outcome)

> Loop de melhoria iterativa que evita a build trap: mede onde estamos, define onde queremos
> chegar, identifica obstaculos e experimenta sistematicamente. Fonte: Perri, Escaping the Build Trap (2018).

```mermaid
flowchart TD
  IN([Vision + Strategic Intent do produto]) --> P1[1. Entender a direcao<br/>vision -> strategic intent -> product initiatives<br/>qual e o outcome-alvo da meta da meta]
  P1 --> P2[2. Capturar o estado atual<br/>medir onde o produto ou metrica esta hoje<br/>baseline quantificado]
  P2 --> P3[3. Definir target condition<br/>qual outcome intermediario alcancar<br/>e ate quando condicao-alvo]
  P3 --> G1{GATE obstaculo<br/>o que impede chegar<br/>ao target condition agora?}
  G1 --> P4[4. Identificar o proximo obstaculo<br/>priorizar o mais bloqueante<br/>um obstaculo por vez]
  P4 --> P5[5. Planejar o proximo passo<br/>menor experimento que ataca o obstaculo<br/>hipotese: se fizermos X esperamos Y]
  P5 --> P6[6. Executar e medir<br/>rodar o experimento<br/>comparar resultado x esperado]
  P6 --> G2{GATE aprendizado<br/>o resultado correspondeu<br/>ao esperado?}
  G2 -->|sim: hipotese confirmada| G3{Target condition<br/>atingido?}
  G2 -->|nao: hipotese refutada| LEARN[Registrar aprendizado<br/>ajustar hipotese ou obstaculo]
  LEARN -.laco.-> G1
  G3 -->|nao| P2
  G3 -->|sim| G4{Vision atingida?}
  G4 -->|nao: novo ciclo| P3
  G4 -->|sim| OUT([Outcome entregue + historico de experimentos])
  P2 -.laco: novo estado atual a cada iteracao.-> P3

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,G2,G3,G4 gate;
```

### Passo a passo (entrada -> saida)
1. **Entender a direcao** — entrada: vision e strategic intent. Percorra o strategy stack (vision -> strategic intent -> product initiatives -> options). Saida: outcome-alvo da iteracao.
2. **Capturar o estado atual** — entrada: metricas do produto. Meca onde o produto esta hoje. Saida: baseline quantificado.
3. **Definir target condition** — entrada: baseline + direcao. Qual outcome intermediario alcancar e ate quando? Saida: condicao-alvo com prazo.
4. **Identificar o obstaculo** — entrada: gap entre atual e target. O que impede chegar la agora? Priorize o mais bloqueante. Saida: obstaculo principal.
5. **Planejar o proximo experimento** — entrada: obstaculo. Menor intervencao que ataca o obstaculo; formule como hipotese (se fizermos X, esperamos Y). Saida: experimento definido.
6. **Executar e medir** — entrada: experimento. Execute; compare resultado com esperado. Saida: evidencia de aprendizado.

### Pontos de gate
- **GATE G1 — Obstaculo bloqueante.** O Kata exige clareza sobre o que impede o avanco. Sem obstaculo claro, o experimento e cego.
- **GATE G2 — Aprendizado.** Hipotese refutada e aprendizado valido (nao falha). Registre e ajuste — **laco de volta ao passo 4** com novo obstaculo ou hipotese.
- **GATE G3 — Target condition atingido.** Reprovado -> **laco de volta ao passo 2** (medir novo estado atual). Aprovado -> verificar se a vision foi atingida.
- **GATE G4 — Vision atingida.** Reprovado -> **laco de volta ao passo 3** com novo target. O Kata e continuo; a condicao-alvo sobe a cada ciclo.

---

## L12 — Story Mapping de Patton (Backbone, Walking Skeleton, Slices por Outcome)

> Substitui o backlog plano por um mapa narrativo: backbone horizontal da jornada,
> detalhe vertical, e slices por outcome que fatiam releases de forma que cada um
> entregue valor utilizavel. Fonte: Patton, User Story Mapping (2014).

```mermaid
flowchart TD
  IN([Outcome desejado + usuario-alvo]) --> S1[1. Enquadrar o problema e a meta<br/>qual outcome o mapa serve<br/>quem e o usuario da jornada]
  S1 --> S2[2. Montar o backbone<br/>atividades do usuario em ordem narrativa<br/>esquerda para direita = sequencia da jornada]
  S2 --> S3[3. Decompor em tarefas<br/>sob cada atividade: tarefas e historias<br/>eixo vertical = nivel de detalhe e prioridade]
  S3 --> S4[4. Desenhar o walking skeleton<br/>selecionar o caminho minimo end-to-end<br/>que entrega algo utilizavel]
  S4 --> G1{GATE walking skeleton<br/>o esqueleto entrega algo<br/>utilizavel de ponta a ponta?}
  G1 -->|nao| S4
  G1 -->|sim| S5[5. Fatiar releases por outcome<br/>agrupar historias em slices horizontais<br/>now next later]
  S5 --> G2{GATE slice<br/>cada fatia entrega<br/>valor sozinha sem o proximo slice?}
  G2 -->|nao: valor dependente| REFAT[Re-fatiar<br/>mover historias entre slices]
  REFAT --> G2
  G2 -->|sim| S6[6. Refinar cada historia<br/>conversa 3 Cs -> conditions of satisfaction<br/>-> key examples Given When Then]
  S6 --> S7[7. Iterar o mapa<br/>apos cada release: atualizar o mapa<br/>com aprendizado de discovery]
  S7 -.laco continuo: mapa e documento vivo.-> S1
  S6 --> OUT([Story map com slices validados<br/>alimenta Specification by Example])

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,G2 gate;
```

### Passo a passo (entrada -> saida)
1. **Enquadrar o problema e a meta** — entrada: outcome desejado + usuario-alvo. O mapa serve um outcome, nao um projeto generico. Saida: objetivo do mapa.
2. **Montar o backbone** — entrada: jornada do usuario. Liste atividades em ordem narrativa da esquerda para a direita (sequencia temporal). Saida: espinha dorsal do mapa.
3. **Decompor em tarefas** — entrada: cada atividade. Abaixo de cada atividade, liste as tarefas e historias (eixo vertical = mais detalhe e menor prioridade). Saida: corpo do mapa.
4. **Desenhar o walking skeleton** — entrada: corpo do mapa. Selecione o conjunto minimo de historias que cobrem o fluxo completo de ponta a ponta. Saida: esqueleto que anda.
5. **Fatiar releases por outcome** — entrada: mapa completo. Trace linhas horizontais agrupando historias em slices (now/next/later). Cada slice entrega um resultado utilizavel. Saida: plano de releases orientado a outcome.
6. **Refinar cada historia** — entrada: historia priorizada. 3 Cs (Card, Conversation, Confirmation) -> conditions of satisfaction -> key examples Given/When/Then. Saida: historia pronta para especificacao.
7. **Iterar o mapa** — entrada: aprendizado de cada release. Atualize o mapa. O mapa e documento vivo que reflete o entendimento atual. Saida: mapa evoluido.

### Pontos de gate
- **GATE G1 — Walking skeleton.** Reprovado -> adicionar ou remover historias ate o caminho ser end-to-end utilizavel. Evita entregar partes que nao funcionam sozinhas.
- **GATE G2 — Slice auto-suficiente.** Reprovado -> **re-fatiar** movendo historias. Slicing vertical (por outcome) e diferente de slicing horizontal (por camada tecnica, que nao entrega valor sozinho).

---

## L13 — Modelagem Tatica de Agregado (Vernon: Invariantes, Boundary, Aggregate Root)

> Design de agregado fiel as 4 regras de Vernon: modele invariantes verdadeiras, mantenha
> pequeno, referencie por identidade, consistencia eventual fora da fronteira.
> Fonte: Vernon, Implementing Domain-Driven Design (2013).

```mermaid
flowchart TD
  IN([Subdominio classificado + bounded context]) --> T1[1. Escolher padrao de implementacao<br/>Transaction Script: CRUD simples<br/>Active Record: validacao basica<br/>Domain Model: invariantes complexas<br/>Event-Sourced: auditavel]
  T1 --> G1{GATE complexidade<br/>ha invariantes de negocio<br/>que devem ser sempre consistentes?}
  G1 -->|nao: CRUD ou simples| SIMPLE[Transaction Script ou Active Record<br/>sem agregado complexo]
  G1 -->|sim: complexidade real| T2[2. Identificar invariantes verdadeiras<br/>quais regras devem ser consistentes<br/>imediatamente e sempre]
  T2 --> T3[3. Desenhar a fronteira do agregado<br/>agrupar apenas o que precisa<br/>de consistencia transacional conjunta<br/>regra: uma transacao um agregado]
  T3 --> G2{GATE tamanho<br/>o agregado e pequeno?<br/>maximo 3 a 5 objetos internos}
  G2 -->|nao: muito grande| SPLIT[Dividir em dois agregados<br/>usar consistencia eventual entre eles]
  SPLIT --> T3
  G2 -->|sim| T4[4. Definir o Aggregate Root<br/>unica porta de entrada<br/>protege invariantes<br/>expoe metodos com intencao clara]
  T4 --> T5[5. Referenciar outros agregados por ID<br/>nunca por objeto direto<br/>acoplamento minimo entre agregados]
  T5 --> T6[6. Modelar Value Objects<br/>conceitos sem identidade<br/>imutaveis validados por construcao<br/>Domain Primitives]
  T6 --> T7[7. Emitir Domain Events<br/>a raiz publica eventos de fato consumado<br/>integracao eventual fora da fronteira]
  T7 --> G3{GATE consistencia<br/>o cliente exige atomicidade<br/>entre dois agregados distintos?}
  G3 -->|sim: reconsiderar fronteira| T3
  G3 -->|nao: consistencia eventual OK| OUT([Agregado modelado<br/>+ Value Objects + Domain Events])

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,G2,G3 gate;
```

### Passo a passo (entrada -> saida)
1. **Escolher padrao de implementacao** — entrada: subdominio classificado. Transaction Script para CRUD simples; Active Record para validacao basica; Domain Model para invariantes complexas; Event-Sourced para auditabilidade completa (Khononov). Saida: padrao escolhido.
2. **Identificar invariantes verdadeiras** — entrada: regras de negocio. Quais regras devem ser imediatamente e sempre consistentes? (ex.: saldo nunca negativo, estoque nao pode ficar abaixo de zero). Saida: lista de invariantes.
3. **Desenhar a fronteira do agregado** — entrada: invariantes. Agrupar apenas objetos que precisam ser consistentes juntos na mesma transacao. Regra de ouro: uma transacao modifica um e somente um agregado. Saida: boundary candidata.
4. **Definir o Aggregate Root** — entrada: boundary. Unica porta de entrada; todos os acessos externos passam por ela; ela protege invariantes e expoe metodos com intencao clara (intention-revealing). Saida: raiz com API rica.
5. **Referenciar outros agregados por ID** — entrada: necessidade de relacao com outro agregado. Nunca por objeto direto; apenas pelo identificador. Saida: acoplamento minimo e consistencia eventual entre agregados.
6. **Modelar Value Objects** — entrada: conceitos do dominio sem identidade propria. Imutaveis, validados por construcao na criacao (Domain Primitives de Secure by Design). Saida: tipos ricos que tornam estados ilegais irrepresentaveis.
7. **Emitir Domain Events** — entrada: fatos de negocio ocorridos dentro do agregado. A raiz publica eventos nomeados com vocabulario de negocio; consumidores externos reagem de forma eventual. Saida: eventos para integracao desacoplada.

### Pontos de gate
- **GATE G1 — Ha invariantes reais?** Reprovado (CRUD simples) -> Transaction Script ou Active Record. Nao use Domain Model onde CRUD resolve.
- **GATE G2 — Tamanho do agregado.** Reprovado (muito grande) -> **laco de divisao**: separar em dois agregados e aceitar consistencia eventual entre eles. Agregados grandes matam concorrencia e causam contencao.
- **GATE G3 — Atomicidade cruzada.** Se o cliente exige atomicidade entre dois agregados distintos -> **laco de revisao da fronteira** (passo 3): talvez sejam um unico agregado, ou a consistencia eventual via Saga e aceitavel para o negocio.

---

## L14 — Refactoring Toward Deeper Insight de Evans (Breakthrough)

> Ciclo continuo de refinamento do modelo: detectar desconforto, explorar com o especialista,
> tornar o implicito explicito, aplicar Supple Design e validar com a linguagem ubiqua.
> Fonte: Evans, Domain-Driven Design Blue Book (2003), parte IV.

```mermaid
flowchart TD
  IN([Modelo atual em producao]) --> R1[1. Detectar desconforto no modelo<br/>codigo que nao fala a linguagem do negocio<br/>conceitos implicitos: if-else que esconde uma regra<br/>especialista corrige o termo errado]
  R1 --> G1{GATE sinal de desconforto<br/>e um conceito implicito<br/>ou apenas codigo feio?}
  G1 -->|codigo feio: refactoring simples| REF[Refactoring tecnico<br/>sem mudar o modelo de dominio]
  G1 -->|conceito implicito: insight potencial| R2[2. Explorar com o especialista de dominio<br/>sessao de modelagem colaborativa<br/>brainstorm de nomes e conceitos]
  R2 --> R3[3. Tornar o implicito explicito<br/>extrair o conceito oculto em um tipo nomeado<br/>Value Object Policy Specification]
  R3 --> R4[4. Aplicar Supple Design<br/>intention-revealing interfaces<br/>side-effect-free functions<br/>assertions sobre invariantes<br/>conceptual contours]
  R4 --> G2{GATE linguagem ubiqua<br/>o especialista de dominio<br/>reconhece e usa o novo termo<br/>sem treinamento?}
  G2 -->|nao: termo estranho| R2
  G2 -->|sim: termo natural| R5[5. Refletir no codigo e no glossario<br/>novo termo entra simultaneamente<br/>no codigo e no vocabulario oficial]
  R5 --> G3{GATE breakthrough<br/>a mudanca revela um modelo<br/>radicalmente mais simples<br/>ou mais expressivo?}
  G3 -->|nao: refinamento incremental| OUT1([Modelo ligeiramente melhorado<br/>laco continuo volta ao passo 1])
  G3 -->|sim: salto qualitativo| BK[Breakthrough<br/>aceitar a mudanca maior<br/>refatorar amplamente com confianca]
  BK --> OUT2([Modelo profundamente melhorado<br/>nova linguagem ubiqua consolidada])
  OUT1 -.laco continuo.-> R1
  OUT2 -.laco continuo: novo baseline.-> R1

  classDef gate fill:#fde,stroke:#b36,stroke-width:2px;
  class G1,G2,G3 gate;
```

### Passo a passo (entrada -> saida)
1. **Detectar desconforto no modelo** — entrada: modelo atual. Sinais: codigo que nao fala a linguagem do negocio; conceito implicito escondido em if-else ou comentario; especialista corrigindo termos; analogias que o especialista usa mas que nao aparecem no codigo. Saida: candidato a refinamento.
2. **Explorar com o especialista** — entrada: candidato. Sessao de modelagem colaborativa; brainstorm de nomes; o especialista fala, o desenvolvedor modela em tempo real. Saida: hipotese de conceito faltante.
3. **Tornar o implicito explicito** — entrada: hipotese. Extraia o conceito oculto em um tipo nomeado (Value Object, Policy, Specification, Role Object). Saida: modelo mais rico com o conceito visivel.
4. **Aplicar Supple Design** — entrada: modelo com novo conceito. Intention-revealing interfaces (nomes que revelam intencao); side-effect-free functions (operacoes de consulta sem mutacao); assertions sobre invariantes; conceptual contours (fronteiras naturais do dominio). Saida: modelo flexivel.
5. **Validar com linguagem ubiqua** — entrada: novo termo. O especialista usa o termo naturalmente sem explicacao? Se sim, ele entra simultaneamente no codigo e no glossario oficial. Saida: vocabulario expandido.
6. **Avaliar breakthrough** — entrada: mudanca aplicada. E um refinamento incremental (melhora gradual) ou um breakthrough (salto que simplifica ou expressa radicalmente melhor)? Breakthrough -> aceitar a mudanca mais ampla com coragem. Saida: modelo evoluido.

### Pontos de gate
- **GATE G1 — Conceito implicito ou codigo feio.** Codigo feio sem conceito de dominio -> refactoring tecnico simples. Conceito implicito (regra que merece um tipo proprio) -> explorar com especialista.
- **GATE G2 — Linguagem ubiqua.** O especialista deve reconhecer e usar o novo termo naturalmente. Reprovado -> **laco de volta ao passo 2** com nova hipotese de nome/conceito. O teste e o especialista, nao o desenvolvedor.
- **GATE G3 — Breakthrough.** Refinamento incremental e o caso normal; breakthrough e raro e valioso. Quando ocorre, aceitar a mudanca mais ampla (Evans: nao ter medo do salto). Ambos retornam ao laco continuo — refatoracao de dominio nunca termina.
