---
titulo: "LOOPS — Onda 14: Delivery Surfaces & Practice"
tipo: loops-diagramas
onda: 14
dominios: "56 · 57 · 58 · 59 · 60"
created: 2026-06-22
total_workflows: 19
---

# LOOPS — Onda 14: Delivery Surfaces & Practice

> Os workflows operacionais dos domínios 56-60 — a última leva, onde o software encontra o usuário e a prática que o sustenta. Como entregar na superfície móvel (56), oferecer APIs como produto e eventos como contrato (57), crescer com experimentação rigorosa (58), documentar como engenharia pra humanos e agentes (59) e fazer tudo isso com eficiência energética (60). Fecham a base: a prática madura de levar software ao mundo.

## W1 — Decisão de stack cross-platform

> Escolhe nativo, KMP, Flutter ou React Native por fidelidade exigida, time e superfície de APIs nativas — tratando a decisão como produto, não como gosto técnico.

```mermaid
flowchart TD
    A("Novo projeto mobile") --> B{"Fidelidade nativa<br/>é requisito crítico?"}
    B -->|Sim| C{"Time forte<br/>em Kotlin?"}
    B -->|Não| D{"Animações complexas<br/>ou consistência visual total?"}
    C -->|Sim| E("KMP — lógica compartilhada,<br/>UI nativa por plataforma")
    C -->|Não| C2{"Time disposto a<br/>aprender KMP?"}
    C2 -->|Sim| E
    C2 -->|Não — dois times consciente| F("Nativo — Swift + Kotlin,<br/>dois times separados")
    D -->|Sim| G("Flutter + Impeller<br/>Dart, UI própria")
    D -->|Não| H{"Time tem expertise<br/>TypeScript/React?"}
    H -->|Sim| I("React Native New Architecture<br/>RN 0.76+, TurboModules")
    H -->|Não| G
    E --> J["Gate: commonMain cobre<br/>60%+ da lógica?"]
    F --> J
    G --> J
    I --> J
    J --> K("Aprovado — iniciar<br/>scaffolding + CI/CD")
```

## W2 — Offline-first: fila de mutações

> Toda ação afeta o estado local na hora (optimistic UI) e entra numa fila durável que sincroniza ao reconectar, com idempotência e merge de conflito.

```mermaid
flowchart TD
    A("Usuário executa ação") --> B("Aplicar ao estado local<br/>Optimistic UI, sem spinner")
    B --> C("Persistir operação atômica<br/>na fila de mutações em disco")
    C --> D{"App está online?"}
    D -->|Sim| E("Worker envia ao servidor<br/>com Idempotency-Key UUID")
    D -->|Não| F("Operação fica na fila<br/>Worker aguarda reconexão")
    F --> G("Conexão restaurada") --> E
    E --> H{"Servidor responde"}
    H -->|200 OK| I("Remove da fila<br/>Estado local confirmado")
    H -->|409 Conflito| J("Aplica estratégia de merge<br/>LWW, merge explícito ou CRDT")
    H -->|erro 4xx ou 5xx| K("Retry com backoff exponencial<br/>max 5 tentativas")
    J --> L("Reconcilia estado local<br/>Notifica usuário se necessário")
    K --> M{"Retries esgotados?"}
    M -->|Não| E
    M -->|Sim| N("Rollback do estado local<br/>Toast de erro ao usuário")
```

## W3 — Release mobile com OTA seguro

> Separa mudança nativa (passa pela loja) de mudança JS/assets (OTA), sempre com rollout gradual monitorado e rollback testado.

```mermaid
flowchart LR
    A("Código alterado<br/>PR aberto") --> B("CI: lint + unit tests<br/>build de validação")
    B --> C{"Tests passam?"}
    C -->|Não| Z("Bloqueia merge<br/>Notifica autor")
    C -->|Sim| D("Merge em main")
    D --> E{"Mudança envolve<br/>código nativo?"}
    E -->|Sim| F("Build com signing<br/>EAS Build ou Fastlane")
    F --> G("Deploy para TestFlight<br/>Play Internal Testing")
    G --> H("Smoke test em<br/>dispositivos reais")
    H --> I("Aguarda review Apple<br/>1-3 dias úteis")
    I --> J("Release com rollout<br/>gradual 10-25-50-100%")
    E -->|Só JS e assets| K("eas update staging<br/>Smoke test manual")
    K --> L{"QA aprovado?"}
    L -->|Não| Z
    L -->|Sim| M("eas update production<br/>rollout 10% dos usuários")
    M --> N("Monitora Sentry/Bugsnag<br/>por 2h")
    N --> O{"Métricas OK?"}
    O -->|Sim| P("Expande rollout<br/>25 → 50 → 100%")
    O -->|Não| Q("eas update republish<br/>rollback para versão anterior")
```

## W4 — Lifecycle de API: do design ao gate de produção

> Contract-first com OpenAPI, lint automático, design review e detecção de breaking change antes de qualquer endpoint chegar à produção.

```mermaid
flowchart TD
  A("Briefing de nova API") --> B("Contract-first: escrever spec OpenAPI")
  B --> C{"Spectral lint passa?"}
  C -->|Não| D("Corrigir violações de style guide")
  D --> C
  C -->|Sim| E("Design review com owner e consumidores")
  E --> F{"Breaking changes identificados?"}
  F -->|Sim| G("Versionar endpoint: bump de major")
  F -->|Não| H("Publicar spec no API Registry")
  G --> H
  H --> I("Gerar mock server com Prism")
  I --> J("Consumidores validam contrato")
  J --> K{"Contrato aceito?"}
  K -->|Não| B
  K -->|Sim| L("Implementar e subir em produção")
  L --> M("Publicar no Developer Portal com changelog")
```

## W5 — Entrega event-driven com outbox e schema registry

> Publica eventos de domínio de forma atômica via outbox, com schema registrado como contrato e consumo idempotente.

```mermaid
flowchart TD
  A("Operação de negócio com transação de banco") --> B("Escrever dado no banco<br/>+ evento na tabela outbox")
  B --> C("Commit transacional")
  C --> D("CDC ou polling lê tabela outbox")
  D --> E{"Schema no Schema Registry?"}
  E -->|Não| F("Registrar schema Avro/Protobuf")
  F --> G("Serializar payload com schema ID")
  E -->|Sim| G
  G --> H("Publicar no Kafka topic com ACL verificada")
  H --> I("Marcar evento como publicado no outbox")
  I --> J("Consumidor lê evento com schema do registry")
  J --> K{"event-id já processado?"}
  K -->|Sim| L("Descartar: idempotência garantida")
  K -->|Não| M("Processar evento e atualizar view materializada")
  M --> N("Registrar ID como processado")
```

## W6 — Plataforma de webhooks com retry e replay

> Entrega confiável de webhooks a terceiros: assinatura HMAC, retry com backoff, dead letter queue e replay sob demanda.

```mermaid
flowchart TD
  A("Evento de negócio gerado") --> B("Assinar payload com HMAC-SHA256")
  B --> C("Headers: webhook-id, webhook-timestamp, webhook-signature")
  C --> D("Enfileirar entrega ao endpoint do consumidor")
  D --> E("POST HTTP ao endpoint com timeout de 30s")
  E --> F{"Resposta 2xx?"}
  F -->|Sim| G("Marcar como entregue no dashboard")
  F -->|Não| H{"Retries esgotados?"}
  H -->|Não| I("Backoff exponencial + jitter")
  I --> E
  H -->|Sim| J("Mover para Dead Letter Queue")
  J --> K("Notificar operador por e-mail")
  K --> L{"Operador solicita replay?"}
  L -->|Sim| D
  L -->|Não| M("Auto-disable do endpoint após threshold de falha")
```

## W7 — Ciclo de experimento confiável

> A/B com rigor: declara OEC e guardrails antes de ligar, checa SRM, evita peeking e só escala quem melhora o OEC sem degradar guardrail.

```mermaid
flowchart TD
    A["Hipótese de growth<br/>Objeto + Ação + Métrica esperada"] --> B["Power Analysis<br/>Define MDE, alpha, power, n alvo"]
    B --> C["Declarar OEC e guardrail metrics<br/>Antes de ativar o experimento"]
    C --> D["Ativar experimento via feature flag<br/>Rollout para n% definido"]
    D --> E["SRM Check automático<br/>p-value esperado vs observado"]
    E --> F{"SRM detectado?"}
    F -->|Sim| G["Bloquear análise<br/>Investigar atribuição, execução, logs, análise"]
    F -->|Não| H["Aguardar n amostral alvo<br/>Sem peeking fora de sequential testing"]
    H --> I["Análise com IC 95%<br/>Aplicar correção se múltiplas variantes"]
    I --> J{"Guardrail metric degradou?"}
    J -->|Sim| K["Rejeitar experimento<br/>Mesmo que OEC melhore"]
    J -->|Não| L{"OEC melhorou com IC positivo?"}
    L -->|Sim| M["Escalar via progressive delivery<br/>Aumentar rollout % com monitoramento"]
    L -->|Não| N["Arquivar hipótese<br/>Gerar aprendizado para próximo ciclo"]
    G --> N
```

## W8 — Progressive delivery com feature flags

> Libera por anéis (interno → beta → % progressivo) protegido por flag, com kill switch, monitoramento de guardrail e limpeza obrigatória da flag.

```mermaid
flowchart LR
    A["Feature completa em trunk<br/>Código protegido por Release Flag"] --> B["Ativar para time interno<br/>100% da equipe, 0% dos usuários"]
    B --> C["Ativar por segmento beta<br/>Targeting rule por atributo de usuário"]
    C --> D["Monitorar guardrail metrics<br/>Latência, erro rate, crash rate"]
    D --> E{"Guardrail OK?"}
    E -->|Não| F["Rollback imediato<br/>Desativar flag, investigar"]
    E -->|Sim| G["Rollout 5%<br/>Determinístico por user ID via hash"]
    G --> H["Monitorar métricas de negócio<br/>OEC + guardrails por 24-48h"]
    H --> I{"Métricas estáveis?"}
    I -->|Não| F
    I -->|Sim| J["Rollout progressivo<br/>20% → 50% → 100%"]
    J --> K["Remover feature flag do código<br/>Cleanup obrigatório, evitar flag debt"]
    F --> L["Post-mortem e taxonomia SRM<br/>Documentar causa para base de conhecimento"]
```

## W9 — Growth loop e priorização de hipóteses

> Mapeia o loop de crescimento do produto, gera e prioriza hipóteses por ICE/PXL, e alimenta o north-star com o que vence — medido contra holdout permanente.

```mermaid
flowchart TD
    A["Mapear growth loop do produto<br/>Tipo: viral, content, paid ou UGC"] --> B["Gerar backlog de hipóteses<br/>Por estágio: Aquisição, Ativação, Retenção, Receita"]
    B --> C["Pontuar com ICE ou PXL<br/>ICE: Impact + Confidence + Ease"]
    C --> D["Priorizar por score decrescente<br/>Top hipóteses entram no sprint de growth"]
    D --> E["Desenhar experimento mínimo<br/>Feature flag + tracking plan + OEC declarado"]
    E --> F["Rodar experimento com rigor<br/>Ver W7, ciclo de experimento confiável"]
    F --> G{"Resultado do experimento"}
    G -->|Positivo, escalar| H["Rollout via progressive delivery<br/>Atualizar input da north-star metric"]
    G -->|Negativo, aprender| I["Documentar aprendizado<br/>Gerar nova hipótese a partir da falha"]
    G -->|Inconclusivo, refinar| J["Revisar MDE e tamanho amostral<br/>O efeito era acionável?"]
    H --> K["Medir impacto no holdout permanente<br/>5% dos usuários nunca tratados"]
    K --> B
    I --> B
    J --> B
```

## W10 — Classificação Diátaxis antes de escrever

> Antes de escrever qualquer doc, identifica qual dos 4 modos (tutorial, how-to, reference, explanation) atende a necessidade — e nunca mistura modos no mesmo arquivo.

```mermaid
flowchart TD
    A("Recebeu request de doc") --> B{"Qual a necessidade do usuário?"}
    B --> C("Aprender fazendo")
    B --> D("Resolver problema concreto")
    B --> E("Consultar especificação")
    B --> F("Entender o raciocínio")
    C --> G("Tutorial")
    D --> H("How-to Guide")
    E --> I("Reference")
    F --> J("Explanation")
    G --> K{"Título com verbo de experiência?"}
    H --> L{"Título começa com Como fazer X?"}
    I --> M{"Cobre todos os casos, não só os comuns?"}
    J --> N{"Responde Por quê, não Como?"}
    K -->|Não| O("Refazer título e estrutura")
    L -->|Não| O
    M -->|Não| O
    N -->|Não| O
    K -->|Sim| P("Escrever para o modo correto")
    L -->|Sim| P
    M -->|Sim| P
    N -->|Sim| P
    O --> P
    P --> Q{"Mistura de modos?"}
    Q -->|Sim| R("Separar em arquivos distintos")
    Q -->|Não| S("Publicar")
    R --> S
```

## W11 — Lifecycle de ADR: registrar e superseder decisão

> Registra decisão arquitetural como ADR imutável; quando muda, cria nova ADR que supersede a antiga — preservando o raciocínio auditável.

```mermaid
flowchart LR
    A("Decisão arquitetural<br/>identificada") --> B("Cria ADR-NNN.md<br/>Status: proposed")
    B --> C("Seções: Title,<br/>Context, Decision, Status, Consequences")
    C --> D("PR para revisão<br/>do time")
    D --> E{"Aprovado?"}
    E -->|Sim| F("Status: accepted<br/>Imutável a partir daqui")
    E -->|Não| G("Ajusta Context<br/>ou Decision")
    G --> D
    F --> H{"Decisão muda<br/>no futuro?"}
    H -->|Não| I("ADR permanece accepted")
    H -->|Sim| J("Cria ADR-MMM.md<br/>Status: proposed")
    J --> K("ADR-MMM referencia<br/>ADR-NNN como substituído")
    K --> L("ADR-NNN recebe<br/>Status: superseded, ref ADR-MMM")
    L --> M("Histórico preservado<br/>Raciocínio auditável")
    K --> D
```

## W12 — Docs-as-code: pipeline de CI para documentação

> Doc vive no repo e passa por CI como código — lint de estrutura e estilo, checagem de links, build do site e teste dos snippets — antes do merge.

```mermaid
flowchart TD
    A("Atualiza .md no repo") --> B("Abre Pull Request")
    B --> C("CI dispara automaticamente")
    C --> D("markdownlint:<br/>estrutura e formatação")
    C --> E("Vale: estilo de escrita<br/>voz ativa, clareza")
    C --> F("Link checker:<br/>links quebrados bloqueiam")
    C --> G("Build do site:<br/>MkDocs ou Docusaurus")
    C --> N("Snippets de código<br/>testados em ambiente real")
    D --> H{"Passou?"}
    E --> H
    F --> H
    G --> H
    N --> O{"Snippets rodaram?"}
    O -->|Não| P("Cria issue automaticamente<br/>para o owner da doc")
    P --> A
    O -->|Sim| H
    H -->|Falhou| I("Retorna erros específicos<br/>ao autor")
    I --> A
    H -->|Passou| J("Code review de doc<br/>igual a code review")
    J --> K{"Aprovado?"}
    K -->|Não| A
    K -->|Sim| L("Merge na branch principal")
    L --> M("Deploy automático<br/>para produção")
    M --> Q("Doc publicada e monitorada")
```

## W13 — Green SDLC loop

> Embute eficiência de carbono em cada fase do ciclo (não como bolt-on final): define a unidade funcional, mede o SCI baseline e só entrega o que reduz vs baseline.

```mermaid
flowchart TD
  REQ["Requirements<br/>define unidade funcional, o R da SCI"] --> ARCH["Architecture<br/>rightsizing, região limpa, serverless"]
  ARCH --> DEV["Development<br/>algoritmo eficiente, compressão, SSR"]
  DEV --> MEASURE["Mede SCI baseline<br/>Cloud Carbon Footprint + proxy"]
  MEASURE --> OPS["Operations<br/>scale-to-zero, carbon-aware batch"]
  OPS --> GATE{"SCI caiu vs baseline?"}
  GATE -->|sim| SHIP["Entrega + monitora"]
  GATE -->|não| DEV
```

## W14 — Carbon-aware batch scheduling

> Desloca workload não-urgente para a janela e a região de menor intensidade de carbono, usando sinal de rede elétrica em tempo real.

```mermaid
flowchart LR
  JOB["Workload chega"] --> CHECK{"Tolera atraso?<br/>batch, não interativo"}
  CHECK -->|não, interativo| NOW["Roda agora<br/>usuário espera"]
  CHECK -->|sim| SDK["Carbon Aware SDK<br/>consulta locais + janela"]
  SDK --> SIGNAL["Sinal de carbono<br/>WattTime marginal / Electricity Maps média"]
  SIGNAL --> PICK["Escolhe par local + horário<br/>de menor intensidade"]
  PICK --> SHIFT["Agenda na janela limpa<br/>temporal ~15%, espacial 50%+"]
```

## W15 — Green AI model routing

> O menor modelo que resolve a tarefa é a maior alavanca de IA verde — e a inferência (não o treino) domina a energia operacional acumulada.

```mermaid
flowchart TD
  TASK["Task de IA"] --> SIZE{"Complexidade real?"}
  SIZE -->|lint, lookup, rename| HAIKU["Modelo menor<br/>menos energia por inferência"]
  SIZE -->|feature, review| MID["Modelo médio"]
  SIZE -->|arquitetura cross-system| BIG["Modelo grande<br/>só quando justificado"]
  HAIKU --> CTX["Economia de contexto<br/>compacta, cache, sem re-leitura"]
  MID --> CTX
  BIG --> CTX
  CTX --> INFER["Inferência domina o acumulado<br/>otimizar aqui supera o treino"]
```

## W16 — GraphQL Federation: publicar subgraph com segurança

> PR de schema passa por rover subgraph check no CI, composição do supergraph é validada, operações em uso são verificadas contra breaking changes e só então o subgraph é publicado — com DataLoader anti-N+1 como requisito de implementação.

```mermaid
flowchart TD
    A("PR altera schema do subgraph") --> B("CI: rover subgraph check<br/>verifica composição do supergraph")
    B --> C{"Supergraph compõe<br/>com todos os subgraphs?"}
    C -->|Não| D("Bloqueia merge<br/>Tipos incompatíveis ou campo duplicado")
    C -->|Sim| E("Checar operações em uso<br/>últimos N dias no Apollo GraphOS")
    E --> F{"Alguma operação ativa<br/>seria quebrada?"}
    F -->|Sim| G("Bloqueia merge<br/>Breaking change: versionar @deprecated ou novo campo")
    F -->|Não| H("Code review e aprovação do PR")
    H --> I("Merge em main")
    I --> J("rover subgraph publish<br/>envia schema ao Schema Registry")
    J --> K("Apollo Router recompõe supergraph<br/>Query planning atualizado")
    K --> L{"Resolvers do subgraph<br/>usam DataLoader?"}
    L -->|Não| M("Gate falha: N+1 detectado<br/>Implementar batching antes de ativar")
    L -->|Sim| N("Rollout gradual via canary<br/>Monitorar latência e error rate")
    N --> O("Subgraph em produção<br/>Supergraph transparente ao cliente")
    D --> P("Corrige schema e reabre PR")
    G --> P
    M --> P
    P --> B
```

## W17 — Deprecation e sunset de API

> Anuncia a deprecação com headers Deprecation e Sunset, comunica consumidores, mantém a versão antiga pelo período prometido, mede uso residual e só remove quando o tráfego chega a zero.

```mermaid
flowchart TD
    A("Decisão de deprecar versão da API") --> B("Cria nova versão major<br/>ex: /v2/ com funcionalidade equivalente")
    B --> C("Adiciona headers em todas as responses da versão antiga<br/>Deprecation: data-ISO e Sunset: data-ISO")
    C --> D("Publica no changelog e developer portal<br/>Aviso com mínimo 3-6 meses de antecedência")
    D --> E("Notifica consumidores conhecidos<br/>e-mail, changelog, status page, canal Slack")
    E --> F("Período de manutenção ativo<br/>Suporte apenas a bugs críticos na versão antiga")
    F --> G("Mede uso residual semanalmente<br/>Requests por consumer ID via API gateway logs")
    G --> H{"Tráfego residual<br/>acima de 1% do total?"}
    H -->|Sim| I("Contata consumidores ativos<br/>Oferece suporte à migração")
    I --> G
    H -->|Não| J{"Data de Sunset<br/>foi atingida?"}
    J -->|Não| G
    J -->|Sim| K("Remove endpoint da versão antiga<br/>Retorna 410 Gone com link para v2")
    K --> L("Atualiza API registry<br/>Status: retired, ref nova versão")
    L --> M("Remove dos dashboards de monitoramento<br/>Documenta no changelog final")
```

## W18 — Runbook lifecycle: do alerta à automação progressiva

> Alerta sem runbook dispara criação com a anatomia de 5 seções do Google SRE; runbook é vinculado ao alerta; progressivamente automatizado; cobertura e MTTR são métricas de maturidade operacional.

```mermaid
flowchart TD
    A("Alerta disparado sem runbook vinculado") --> B("Cria runbook com anatomia de 5 seções<br/>1-Summary 2-Triage 3-Mitigation 4-Validation 5-Remediation")
    B --> C("Seção 1: Summary<br/>1-2 frases do problema + links dashboards e SLOs")
    C --> D("Seção 2: Triage e Severidade<br/>Passos de investigação + árvore de decisão de severidade")
    D --> E("Seção 3: Mitigação imediata<br/>Passos sequenciais para restaurar saúde, modo how-to puro")
    E --> F("Seção 4: Validação de saúde<br/>Indicadores objetivos de que o impacto foi mitigado")
    F --> G("Seção 5: Remediation e cleanup<br/>Reversão de hotfixes, tratamento de dados corrompidos")
    G --> H("Vincula runbook ao alerta na plataforma de on-call<br/>Link bidirecional: alerta aponta ao runbook")
    H --> I("Mede MTTR no próximo incidente com runbook<br/>Referência: 3x melhora vs sem runbook, Google SRE")
    I --> J{"MTTR aceitável<br/>e passos estáveis?"}
    J -->|Não| K("Revisa runbook com post-mortem<br/>Adiciona gaps identificados no incidente")
    K --> I
    J -->|Sim| L("Identifica passos candidatos à automação<br/>Passos repetitivos, sem julgamento humano")
    L --> M{"Passo pode ser<br/>totalmente automatizado?"}
    M -->|Sim| N("Implementa fully-automated runbook<br/>Executa sem interação humana no alerta")
    M -->|Não| O("Semi-automatiza: prepara contexto e sugere ação<br/>Humano confirma antes de executar")
    N --> P("Atualiza métrica de cobertura<br/>% alertas com runbook vinculado")
    O --> P
    P --> Q("Runbook como how-to guide operacional puro<br/>Sem explicação teórica no momento de incidente")
```

## W19 — Knowledge base para agentes de IA: doc como substrato de grounding

> Engenheira documentação para consumo de máquina: modo Diátaxis declarado por arquivo, frontmatter rico para RAG, chunks auto-suficientes, CLAUDE.md e MEMORY.md como reference e how-to guide, documentação como gate anti-invenção.

```mermaid
flowchart LR
    A("Request de nova documentação<br/>para consumo de agente de IA") --> B("Classificar modo Diátaxis<br/>How-to Guide, Reference ou Explanation")
    B --> C{"Qual modo?"}
    C -->|"How-to Guide"| D("Regras operacionais: .claude/rules/*.md<br/>Passos diretos, sem explicação teórica no corpo")
    C -->|"Reference"| E("CLAUDE.md, schemas, vocabulário canônico<br/>Consulta, não leitura linear")
    C -->|"Explanation"| F("ADRs, contexto de decisão<br/>Por que a restrição existe, não como executar")
    D --> G("Frontmatter rico para RAG<br/>titulo, tipo, dominio, status, owner, created")
    E --> G
    F --> G
    G --> H("Garantir auto-suficiência de cada seção<br/>Chunk lido isoladamente sem perder significado")
    H --> I("Declarar modo Diátaxis no frontmatter<br/>tipo: how-to | reference | explanation | tutorial")
    I --> J("Verificar: agente pode anchorar decisão neste doc?<br/>Teste: ação coberta pela doc ou agente precisa inventar?")
    J --> K{"Doc cobre a ação<br/>sem ambiguidade?"}
    K -->|Não| L("Preencher lacuna antes de publicar<br/>Lacuna de doc = permissão implícita de invenção")
    L --> J
    K -->|Sim| M("Versionar no repositório como PR<br/>Doc muda por PR, rastreável e revertível")
    M --> N("Vincular ao CLAUDE.md do projeto<br/>Referência explícita para o agente encontrar")
    N --> O("Gate: lint automático do CLAUDE.md<br/>Links válidos, seções esperadas presentes")
    O --> P{"Lint passa?"}
    P -->|Não| Q("Corrige antes de merge")
    Q --> O
    P -->|Sim| R("Knowledge base como gate anti-invenção<br/>Agente ancorado, não alucinando")
```
