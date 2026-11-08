---
titulo: "LOOPS — Processo & Pessoas (Diagramas de Workflow)"
tipo: formalizacao-workflow
dominio: processo-pessoas
onda: onda-7-processo-pessoas
fase: 2
status: formalizado
prioridade: alta
created: 2026-06-20
fontes: ["13-agile-lean-processo-extracao.md", "14-times-org-conway-extracao.md"]
---

# LOOPS — Onda 7: Processo & Pessoas (Diagramas)

> Formalizacao dos processos canonicos dos dominios **Agile/Lean/Processo** e **Times/Org/Conway** em diagramas mermaid + passo a passo + pontos de gate. Pronto para a Fase 3 (visual) e para virar comportamento de agent de IA.
>
> Convencao: cada laco (loop) e o coracao do processo — entrada, decisao, gate, retorno. `[ ]` = estado/atividade, `{ }` = decisao, `(( ))` = inicio/fim, `>< ` = gate de qualidade.

---

## Indice

**Dominio A — Agile, Lean & Processo**
- A1. Story Mapping (Patton) — fatiar por outcome
- A2. Ciclo da Sprint Scrum (Guide 2020)
- A3. Kanban Pull com limites de WIP (Anderson)
- A4. Forecast probabilistico / Flow metrics (Vacanti)
- A5. Build-Measure-Learn (Ries)
- A6. WSJF — priorizacao economica (Reinertsen/SAFe)
- A7. Calibragem de cerimonia por risco (Boehm-Turner)

**Dominio B — Times, Org & Lei de Conway**
- B1. Inverse Conway Maneuver
- B2. Avaliacao e reducao de carga cognitiva
- B3. Ciclo de melhoria DORA
- B4. Three Ways do DevOps (Flow / Feedback / Learning)
- B5. Dynamic Reteaming (5 padroes)
- B6. Thinnest Viable Platform (TVP)

**Fecho**
- Loop mestre — o diagrama unico que um agent seguiria neste tema

---

# DOMINIO A — Agile, Lean & Processo

## A1 — Story Mapping (Patton): fatiar por outcome

```mermaid
flowchart TD
  start((Iniciativa / hipotese)) --> frame["Frame: problema + usuario-alvo + outcome (1 frase)"]
  frame --> backbone["Backbone: atividades de alto nivel na ordem da narrativa (esq -> dir)"]
  backbone --> detail["Detalhar: stories/tarefas verticais sob cada atividade"]
  detail --> skeleton["Walking skeleton: fatia vertical fina end-to-end"]
  skeleton --> gate1>"GATE 1: existe esqueleto end-to-end ANTES de feature horizontal?"]
  gate1 -->|nao| backbone
  gate1 -->|sim| slice["Slice releases: Release 1 (MVP) / Next / Later por OUTCOME"]
  slice --> invest{"Cada story passa INVEST + 3 Cs?"}
  invest -->|nao| detail
  invest -->|sim| mvp["Definir MVP = menor experimento que valida a hipotese central"]
  mvp --> gate2>"GATE 2: MVP e experimento de aprendizado (nao 'versao pequena')?"]
  gate2 -->|nao| mvp
  gate2 -->|sim| done((Backlog fatiado pronto))
  done -.loop de descoberta.-> frame
```

**Passo a passo**
1. **Frame** — entrada: briefing/hipotese. saida: 1 frase (problema + usuario + outcome).
2. **Backbone** — entrada: frame. saida: lista ordenada de atividades de alto nivel.
3. **Detalhar** — entrada: backbone. saida: cards de stories sob cada atividade.
4. **Walking skeleton** — entrada: cards. saida: fatia vertical fina percorrendo a narrativa toda.
5. **Slice releases** — entrada: skeleton + cards. saida: agrupamento horizontal por outcome (MVP/Next/Later), nunca por camada tecnica.
6. **Definir MVP** — entrada: Release 1. saida: menor experimento que valida a hipotese.

**Pontos de gate**
- **GATE 1 (esqueleto):** bloqueia features horizontais ate existir walking skeleton end-to-end.
- **GATE 2 (qualidade da story):** INVEST (Independent, Negotiable, Valuable, Estimable, Small, Testable) + 3 Cs (Card, Conversation, Confirmation). MVP = aprendizado, nao escopo reduzido.

---

## A2 — Ciclo da Sprint Scrum (Guide 2020)

```mermaid
stateDiagram-v2
  [*] --> ProductBacklog
  ProductBacklog --> SprintPlanning: Product Goal orienta
  SprintPlanning --> SprintBacklog: define Sprint Goal
  SprintBacklog --> DailyScrum: inicia o container Sprint (1-4 sem)
  DailyScrum --> DailyScrum: inspeciona progresso vs Sprint Goal (diario)
  DailyScrum --> SprintReview: fim do timebox
  SprintReview --> DoD_Gate: inspeciona Increment com stakeholders
  state DoD_Gate <<choice>>
  DoD_Gate --> Retrospective: Increment atende Definition of Done
  DoD_Gate --> SprintBacklog: nao atende -> volta ao Sprint Backlog
  Retrospective --> ProductBacklog: 1-3 kaizen incorporados
  Retrospective --> [*]: Product Goal atingido
```

**Passo a passo**
1. **Sprint Planning** — entrada: Product Backlog + Product Goal. saida: Sprint Goal + Sprint Backlog.
2. **Sprint (container, 1-4 sem)** — entrada: Sprint Backlog. saida: Increment incremental.
3. **Daily Scrum** — entrada: progresso do dia. saida: plano ajustado rumo ao Sprint Goal (inspecao diaria).
4. **Sprint Review** — entrada: Increment. saida: feedback de stakeholders + backlog atualizado.
5. **Retrospective** — entrada: o processo da sprint. saida: 1-3 melhorias (kaizen) aplicadas.

**Pontos de gate**
- **Definition of Done (commitment do Increment):** nenhum item conta como "pronto" sem passar pelo DoD. E o gate jidaka/stop-the-line do Scrum.
- **3 commitments (2020):** Product Goal (guia o backlog), Sprint Goal (guia a sprint), DoD (guia o increment). Compromisso com a META, nao com escopo fixo.

---

## A3 — Kanban Pull com limites de WIP (Anderson)

```mermaid
flowchart LR
  intake[(Backlog priorizado)] --> q1{"Vaga sob limite WIP da proxima coluna?"}
  q1 -->|nao - PULL bloqueado| gargalo["Expor gargalo: nao puxa, ataca o acumulo"]
  gargalo --> q1
  q1 -->|sim| pull["PULL: puxa item para a coluna"]
  pull --> work["Trabalhar respeitando politicas explicitas (DoD por coluna)"]
  work --> cfd>"GATE: ler CFD - bandas alargando = acumulo?"]
  cfd -->|sim| gargalo
  cfd -->|nao| next{"Ha proxima coluna?"}
  next -->|sim| q1
  next -->|nao| ship((Entregue))
  ship -.feedback PDCA sobre limites e politicas.-> intake
```

**Passo a passo**
1. **Visualizar** — entrada: fluxo de trabalho. saida: board com colunas = estados.
2. **Limitar WIP** — entrada: board. saida: teto por coluna/raia; limite atingido bloqueia o pull.
3. **Pull** — entrada: vaga sob o limite. saida: item puxado para a proxima etapa.
4. **Gerenciar fluxo** — entrada: CFD + lead/cycle time + throughput. saida: gargalos identificados.
5. **Politicas explicitas** — entrada: DoD por coluna + classes de servico. saida: regras de pull claras.
6. **Loops de feedback** — entrada: metricas. saida: PDCA sobre limites e politicas (melhoria evolutiva).

**Pontos de gate**
- **Limite de WIP (pull gate):** so puxa quando ha vaga; limite cheio = stop ate desafogar (alavanca direta da Lei de Little).
- **CFD gate:** bandas que se alargam sinalizam acumulo/gargalo antes de aceitar mais trabalho.
- **Classes de servico:** expedite > fixed-date > standard > intangible, sequenciadas por custo de atraso.

---

## A4 — Forecast probabilistico / Flow metrics (Vacanti)

```mermaid
flowchart TD
  start((Necessidade de previsao)) --> stable{"As 5 premissas da Lei de Little sao satisfeitas?"}
  stable -->|nao| fix["Estabilizar fluxo: conservacao, estabilidade, idade media, completude, unidades consistentes"]
  fix --> stable
  stable -->|sim| collect["Coletar 4 flow metrics: WIP, Cycle Time, Throughput, Work Item Age"]
  collect --> sle["Definir SLE: 'itens como este em <= X dias, 85% das vezes'"]
  sle --> mc["Monte Carlo: simular milhares de futuros a partir do throughput historico"]
  mc --> gate>"GATE: previsao em probabilidade (X% ate data Y), nao data pontual?"]
  gate -->|nao| mc
  gate -->|sim| forecast((Forecast probabilistico publicado))
  forecast -.re-medir a cada cadencia.-> collect
```

**Passo a passo**
1. **Checar estabilidade** — entrada: dados de fluxo. saida: confirma as 5 premissas (senao, numeros sao sem sentido).
2. **Coletar flow metrics** — entrada: board/historico. saida: WIP, Cycle Time, Throughput, Work Item Age.
3. **SLE** — entrada: cycle time historico. saida: previsao probabilistica (periodo + probabilidade).
4. **Monte Carlo** — entrada: throughput historico. saida: distribuicao de datas de conclusao / escopo.

**Pontos de gate**
- **Gate de premissas:** nao confiar em metricas com fluxo instavel ("as premissas sao mais importantes que a matematica" — Vacanti).
- **Gate de expressao:** toda previsao sai como percentil/probabilidade, nunca como data unica de compromisso.

---

## A5 — Build-Measure-Learn (Ries)

```mermaid
flowchart TD
  ideas((Leap-of-faith assumption)) --> build["BUILD: menor MVP que testa a hipotese (concierge / wizard-of-oz / smoke test)"]
  build --> product[/Produto-experimento/]
  product --> measure["MEASURE: instrumentar actionable metrics + cohorts (nao vanity)"]
  measure --> data[/Dados/]
  data --> learn["LEARN: validar ou invalidar a hipotese"]
  learn --> gate{"Pivot ou Persevere?"}
  gate -->|persevere| ideas2["Refinar proxima hipotese"]
  gate -->|pivot| pivot["Mudar de estrategia preservando o aprendido"]
  ideas2 --> build
  pivot --> build
  learn --> stop>"GATE: minimizou o tempo TOTAL do loop? metrica e actionable, nao vanity?"]
```

**Passo a passo**
1. **Build** — entrada: hipotese (leap-of-faith). saida: MVP minimo (concierge, wizard-of-oz ou smoke test).
2. **Measure** — entrada: MVP em uso. saida: actionable metrics + analise por cohort.
3. **Learn** — entrada: dados. saida: decisao pivot-ou-persevere + innovation accounting.

**Pontos de gate**
- **Gate de metrica:** rejeitar vanity metrics; so actionable metrics validam/invalidam.
- **Gate de velocidade do loop:** o objetivo e minimizar o tempo TOTAL Build->Measure->Learn (lote pequeno aplicado a aprendizado).
- **Decisao pivot/persevere:** dado define o caminho, nao opiniao (anti-HiPPO).

---

## A6 — WSJF: priorizacao economica (Reinertsen/SAFe)

```mermaid
flowchart TD
  start((Backlog de epics/gaps)) --> cod["Estimar Cost of Delay = Business Value + Time Criticality + Risk Reduction/Opp. Enablement"]
  cod --> size["Estimar Job Size (mesma escala Fibonacci relativa)"]
  size --> calc["WSJF = CoD / Job Size"]
  calc --> rank["Sequenciar do maior WSJF para o menor"]
  rank --> override{"Ha classe de servico expedite?"}
  override -->|sim| jump["Override: expedite fura a fila"]
  override -->|nao| exec["Executar shortest weighted job first"]
  jump --> exec
  exec --> gate>"GATE: ordem rastreavel a economia (nao opiniao/HiPPO)?"]
  gate -->|nao| cod
  gate -->|sim| reprior((Re-priorizar a cada cadencia))
  reprior -.CoD muda no tempo.-> cod
```

**Passo a passo**
1. **Estimar CoD** — entrada: epic/gap. saida: Cost of Delay (3 componentes, Fibonacci relativo).
2. **Estimar Job Size** — entrada: esforco. saida: tamanho na mesma escala.
3. **Calcular WSJF** — entrada: CoD e Job Size. saida: score = CoD / Job Size.
4. **Sequenciar** — entrada: scores. saida: fila do maior para o menor.

**Pontos de gate**
- **Gate anti-HiPPO:** a ordem precisa rastrear ao calculo economico, nao a opiniao.
- **Cuidado de proxy:** scores Fibonacci dao falsa objetividade — usar como ferramenta de conversa, nao oraculo (CoD real em R$/semana e mais honesto).
- **Re-priorizacao por cadencia:** CoD muda no tempo; re-rodar a cada ciclo.

---

## A7 — Calibragem de cerimonia por risco (Boehm-Turner)

```mermaid
flowchart TD
  start((Nova task / briefing)) --> assess["Avaliar 5 fatores: Size, Criticality, Dynamism, Personnel, Culture"]
  assess --> score{"Perfil de risco?"}
  score -->|baixo: bug/fix| yolo["Caminho YOLO: story so, pipeline leve"]
  score -->|medio: feature| sdc["SDC interativo: epic? -> story -> QA"]
  score -->|alto: epic multi-story / critico| full["Pipeline completo: brief -> PRD -> arquitetura -> spec -> stories"]
  yolo --> gate
  sdc --> gate
  full --> gate>"GATE: quantidade de processo proporcional ao risco (nao fixa)?"]
  gate -->|desproporcional| assess
  gate -->|proporcional| run((Executar workflow calibrado))
```

**Passo a passo**
1. **Avaliar 5 fatores** — entrada: task. saida: perfil Size/Criticality/Dynamism/Personnel/Culture.
2. **Classificar home ground** — entrada: perfil. saida: agil puro / plan-driven / mix.
3. **Selecionar workflow** — entrada: classificacao. saida: YOLO (baixo), SDC (medio) ou pipeline completo (alto).

**Pontos de gate**
- **Gate de proporcionalidade:** processo nunca fixo — sempre proporcional ao risco. Decisao de workflow rastreavel aos 5 fatores.

---

# DOMINIO B — Times, Org & Lei de Conway

## B1 — Inverse Conway Maneuver

```mermaid
flowchart TD
  start((Greenfield / grande reestrutura)) --> arch["1. Definir arquitetura-alvo: mapa de bounded contexts/servicos"]
  arch --> planes["2. Identificar fracture planes (linhas de fratura naturais)"]
  planes --> litmus{"Litmus: o plano aumenta autonomia E reduz carga cognitiva?"}
  litmus -->|nao| planes
  litmus -->|sim| teams["3. Mapear 1 stream-aligned team por contexto"]
  teams --> extract["4. Extrair platform + complicated-subsystem onde houver capacidade transversal"]
  extract --> mode["5. Declarar modo de interacao de cada par (Collaboration / XaaS / Facilitating)"]
  mode --> gate>"GATE: stream-aligned e default? nao-stream-aligned < ~15%? sem Collaboration permanente?"]
  gate -->|falha| teams
  gate -->|ok| sense["6. Implementar e observar: medir flow (DORA) + carga cognitiva (perceptual)"]
  sense --> friction{"Surgiu atrito?"}
  friction -->|sim| planes
  friction -->|nao| stable((Topologia estavel))
  stable -.loop continuo de adaptacao.-> sense
```

**Passo a passo**
1. **Arquitetura-alvo** — entrada: requisitos + atributos de qualidade. saida: mapa de bounded contexts.
2. **Fracture planes** — entrada: dominio. saida: candidatos a fronteira (business context, compliance, change cadence, location, risk, technology, persona).
3. **Stream-aligned teams** — entrada: contextos. saida: 1 time por contexto, respeitando carga cognitiva.
4. **Extrair plataforma/subsistema** — entrada: capacidades transversais. saida: platform team + complicated-subsystem team.
5. **Declarar modos** — entrada: pares de times. saida: modo explicito (default XaaS para plataforma).
6. **Sensing + adaptar** — entrada: metricas. saida: ajustes de topologia (loop continuo).

**Pontos de gate**
- **Litmus test:** so vira fronteira se aumenta autonomia E reduz carga cognitiva.
- **Gate de razao:** nao-stream-aligned < ~15% do total; nenhum par em Collaboration permanente (anti-padrao).

---

## B2 — Avaliacao e reducao de carga cognitiva

```mermaid
flowchart TD
  start((Time/agent com dominios sob escopo)) --> inv["1. Inventariar dominios/sistemas sob o time"]
  inv --> classify["2. Classificar cada um: intrinseca / extranea / germane"]
  classify --> measure["3. Medir por percepcao (proxy): 'o time da conta sustentavelmente?'"]
  measure --> q{"Sustentavel?"}
  q -->|sim| preserve["6. Preservar germane (onde mora valor e aprendizado)"]
  q -->|nao| extranea["4. Reduzir EXTRANEA primeiro: automacao, plataforma (TVP), remover toil"]
  extranea --> recheck{"Ainda sobrecarregado?"}
  recheck -->|nao| preserve
  recheck -->|sim| split["5. Reduzir INTRINSECA via fronteira: repartir dominio (novo fracture plane)"]
  split --> measure
  preserve --> gate>"GATE: nao zerar germane (mata aprendizado)? proxy tratado como sinal, nao dado duro?"]
  gate --> done((Carga sustentavel))
  done -.reavaliar.-> measure
```

**Passo a passo**
1. **Inventariar** — entrada: escopo do time. saida: lista de dominios/sistemas.
2. **Classificar** — entrada: dominios. saida: rotulo intrinseca/extranea/germane por item.
3. **Medir por percepcao** — entrada: time. saida: sinal de sustentabilidade (sem instrumento validado; proxy tipo Teamperature).
4. **Reduzir extranea** — entrada: toil/ferramental. saida: automacao/plataforma.
5. **Reduzir intrinseca** — entrada: sobrecarga residual. saida: novo fracture plane / subsistema extraido.
6. **Preservar germane** — entrada: aprendizado de valor. saida: mantido.

**Pontos de gate**
- **Gate de proxy:** scores de carga cognitiva sao perceptuais — sinal, nao dado duro.
- **Gate de germane:** nunca zerar carga germane (so tarefas triviais mata motivacao e aprendizado).

---

## B3 — Ciclo de melhoria DORA

```mermaid
flowchart TD
  start((Pipeline de entrega)) --> instr["1. Instrumentar 4 metricas: deploy freq, lead time, change failure rate, MTTR"]
  instr --> baseline["2. Estabelecer baseline + tier (Elite/High/Medium/Low)"]
  baseline --> find["3. Achar a capacidade limitante (das 24): trunk-based, test automation, deploy auto..."]
  find --> intervene["4. Intervir em UMA capacidade"]
  intervene --> delta["5. Medir o delta + correlacionar com burnout/satisfacao"]
  delta --> gate>"GATE: melhorou entrega SEM sacrificar pessoas? throughput e estabilidade movem juntos?"]
  gate -->|piorou pessoas / divergiu| rollback["Reverter / re-investigar (lotes grandes?)"]
  rollback --> find
  gate -->|ok| iterate((6. Iterar))
  iterate -.proxima capacidade limitante.-> find
```

**Passo a passo**
1. **Instrumentar** — entrada: pipeline. saida: 4 metricas DORA (+5a de confiabilidade).
2. **Baseline + tier** — entrada: metricas. saida: posicao vs benchmarks (Elite: lead < 1d, deploy on-demand, CFR ~5%, recovery < 1h).
3. **Achar capacidade limitante** — entrada: dados. saida: 1 das 24 capacidades preditoras.
4. **Intervir** — entrada: capacidade. saida: mudanca aplicada.
5. **Medir delta** — entrada: pos-intervencao. saida: ganho + checagem de burnout.

**Pontos de gate**
- **Gate humano:** nunca otimizar entrega sacrificando pessoas (monitorar burnout/satisfacao junto).
- **Gate de coerencia:** throughput e estabilidade devem mover juntos; divergencia = investigar lotes grandes (alerta IA/DORA 2024).

---

## B4 — Three Ways do DevOps (Flow / Feedback / Continual Learning)

```mermaid
flowchart LR
  subgraph way1["1o Way: FLOW (esq -> dir)"]
    vsm["Value stream mapping"] --> wip["Limitar WIP visivel"] --> batch["Reduzir tamanho de lote"] --> bottleneck["Elevar o gargalo (ToC)"]
  end
  subgraph way2["2o Way: FEEDBACK (dir -> esq)"]
    tele["Telemetria abrangente"] --> stopline>"Testes param a linha no defeito"] --> visible["Tornar problemas visiveis"]
  end
  subgraph way3["3o Way: CONTINUAL LEARNING"]
    blameless["Blameless postmortem"] --> gameday["Game days / injecao de falha"] --> globalize["Local -> global (vira padrao da org)"]
  end
  bottleneck --> tele
  visible --> blameless
  globalize -.alimenta proximo ciclo.-> vsm
```

**Passo a passo**
1. **Flow** — entrada: dev. saida: fluxo otimizado dev->prod (VSM, WIP limitado, lotes pequenos, gargalo elevado).
2. **Feedback** — entrada: producao. saida: loops rapidos dir->esq (telemetria, linha que para no defeito, problemas visiveis).
3. **Continual Learning** — entrada: incidentes/experimentos. saida: aprendizado local virando padrao global.

**Pontos de gate**
- **Stop-the-line (feedback gate):** defeito detectado para a linha — nada avanca com defeito na fonte.
- **Blameless postmortem (learning gate):** timeline factual sem culpa + acoes corretivas sistemicas antes de fechar o ciclo.

---

## B5 — Dynamic Reteaming (5 padroes, Helfand)

```mermaid
flowchart TD
  start((Sinal de mudanca de time)) --> trigger{"Qual gatilho?"}
  trigger -->|crescimento lento| one["One-by-one: +/- 1 pessoa por vez"]
  trigger -->|carga cognitiva estourando| split["Grow-and-split: cresce ate dividir em dois"]
  trigger -->|iniciativa critica/urgente| iso["Isolation: destaca subgrupo para foco"]
  trigger -->|dependencia forte / duplicacao| merge["Merging: funde dois times"]
  trigger -->|quebrar ilhas de conhecimento| switch["Switching: pessoas trocam de time"]
  one --> doc
  split --> doc
  iso --> doc
  merge --> doc
  switch --> doc["Documentar conhecimento + onboarding (minimizar perda de contexto)"]
  doc --> exec["Executar a transicao"]
  exec --> gate>"GATE: contexto preservado? carga cognitiva voltou a ser sustentavel?"]
  gate -->|nao| trigger
  gate -->|sim| stabilize((Estabilizar: observar e ajustar))
```

**Passo a passo**
1. **Detectar gatilho** — entrada: sinal organizacional. saida: classificacao do gatilho.
2. **Escolher padrao** — entrada: gatilho. saida: padrao que minimiza perda de contexto.
3. **Documentar** — entrada: conhecimento do time. saida: docs + plano de onboarding.
4. **Executar + estabilizar** — entrada: padrao escolhido. saida: nova composicao estavel.

**Pontos de gate**
- **Gate de contexto:** transicao so e valida se o conhecimento foi preservado (handoff/onboarding).
- **Gate de sustentabilidade:** carga cognitiva pos-reteaming volta a caber.

---

## B6 — Thinnest Viable Platform (TVP)

```mermaid
flowchart TD
  start((Times de fluxo)) --> pain{"Ha dor REAL de duplicacao?"}
  pain -->|nao| wait["Esperar: nao criar plataforma prematura (vira gargalo)"]
  wait --> pain
  pain -->|sim| tvp["Comecar minimo: wiki/documentacao primeiro"]
  tvp --> product["Tratar como PRODUTO: usuarios internos, roadmap"]
  product --> xaas["Consumir em XaaS (self-service), nao via tickets"]
  xaas --> gate>"GATE DORA 2024: throughput/estabilidade NAO pioraram? sem burnout por plataforma instavel?"]
  gate -->|piorou| fix["Re-desenhar: plataforma estavel ou recuar escopo"]
  fix --> product
  gate -->|ok| success["Sucesso: times de fluxo aceleram sem conhecer detalhes internos"]
  success --> grow{"Nova dor justifica mais servico?"}
  grow -->|sim| tvp
  grow -->|nao| stable((Plataforma estavel))
```

**Passo a passo**
1. **Validar dor** — entrada: times de fluxo. saida: confirmacao de duplicacao real (senao, nao construir).
2. **Comecar minimo** — entrada: dor confirmada. saida: TVP (wiki -> servico so quando a dor justifica).
3. **Tratar como produto** — entrada: TVP. saida: usuarios internos + roadmap.
4. **Consumir em XaaS** — entrada: produto. saida: self-service, nunca fila de tickets.

**Pontos de gate**
- **Gate de dor real:** sem duplicacao dolorosa, plataforma prematura = gargalo Conway-classico.
- **Gate de tradeoff (DORA 2024):** plataforma mal-gerida custa -8% throughput / -14% estabilidade + burnout — medir sempre.

---

# Loop mestre

> Diagrama unico que um **agent de IA** segue ao operar neste tema. Une os dois dominios: primeiro estrutura a organizacao (Conway/Topologias), depois roda o ciclo de fluxo (Agile/Lean/DORA) com WIP limitado, lotes pequenos e gate de qualidade como stop-the-line. Cada laco devolve aprendizado ao framework (empirismo real, anti-cargo-cult).

```mermaid
flowchart TD
  brief((Briefing / iniciativa)) --> calib["CALIBRAR cerimonia por risco (Boehm-Turner: Size/Criticality/Dynamism/Personnel/Culture)"]

  calib --> topo["DESENHAR topologia (Inverse Conway): 1 stream-aligned por contexto; platform/subsistema em XaaS; modo de interacao declarado"]
  topo --> cog>"GATE carga cognitiva: cada agent com 1 fronteira clara, escopo sustentavel? nao-stream-aligned < 15%?"]
  cog -->|estourou| topo

  cog -->|ok| map["FATIAR por outcome (Story Mapping): walking skeleton end-to-end -> MVP/Next/Later"]
  map --> invest>"GATE story: INVEST + 3 Cs? fatia vertical, nao camada tecnica?"]
  invest -->|reprova| map

  invest -->|aprova| prior["PRIORIZAR por economia (WSJF = CoD / Job Size), anti-HiPPO"]
  prior --> pull{"WIP limitado: ha vaga sob o teto? (max 1 InProgress por executor)"}
  pull -->|nao - fila e o inimigo| pull
  pull -->|sim| build["BUILD em lote pequeno (PR < 200-400 linhas; defesa contra achado DORA 2024)"]

  build --> qa>"GATE QA = jidoka/stop-the-line: Definition of Done, checks verdes. Defeito? PARA a linha"]
  qa -->|FAIL| build
  qa -->|PASS| measure["MEASURE: flow metrics + 4 metricas DORA + actionable metric (nao vanity)"]

  measure --> learn{"LEARN: pivot ou persevere? throughput e estabilidade moveram juntos?"}
  learn -->|divergiu / lote grande| build
  learn -->|saudavel| forecast["FORECAST probabilistico (Monte Carlo): 'X% ate data Y', nao data pontual"]

  forecast --> retro["RETRO / postmortem blameless: 1-3 kaizen incorporados ao framework (prompt/contrato)"]
  retro --> human>"GATE humano + cultura generativa: melhorou SEM burnout? informacao fluiu? mensageiro nao punido?"]
  human -->|nao| calib
  human -->|sim| ship((Entregue + aprendizado capturado))
  ship -.loop empirico: transparencia -> inspecao -> adaptacao.-> brief
```

**Sequencia mestra (passo a passo do agent)**
1. **Calibrar** — pesa o risco antes de escolher o quanto de processo aplicar (cerimonia proporcional, nao fixa).
2. **Desenhar topologia** — define fronteiras de agents ANTES de executar (Conway como design ativo); escopo unico por agent, comunicacao em estrela (nao malha — n(n-1)/2 explode em tokens).
3. **Fatiar por outcome** — walking skeleton end-to-end, MVP como experimento.
4. **Priorizar por economia** — WSJF ordena, nunca opiniao.
5. **Limitar WIP** — max 1 story InProgress por executor; fan-out paralelo com teto explicito.
6. **Build em lote pequeno** — diffs pequenos e compreensiveis (defesa direta contra o achado DORA 2024 de que IA piora entrega).
7. **QA gate stop-the-line** — DoD obrigatorio; defeito interrompe o fluxo na fonte.
8. **Measure + Learn** — actionable metrics, pivot/persevere, checar que throughput e estabilidade andam juntos.
9. **Forecast probabilistico** — previsao em percentil, nunca compromisso de data.
10. **Retro blameless** — kaizen vira ajuste real de prompt/contrato (empirismo, nao cerimonia vazia).

**Gates mestres (inegociaveis)**
- **Carga cognitiva:** cada agent com 1 fronteira clara e escopo sustentavel.
- **Story:** INVEST + 3 Cs + fatia vertical por outcome.
- **WIP:** teto explicito; fila e o inimigo, nao a utilizacao.
- **QA / DoD (jidoka):** nada avanca com defeito — stop-the-line na fonte.
- **Coerencia entrega:** throughput e estabilidade movem juntos (senao, lote grande demais).
- **Humano + cultura:** ganho sem burnout; informacao flui; mensageiro de ma noticia nao e punido (Westrum generativo).
- **Forecast:** probabilidade, nunca data pontual.
