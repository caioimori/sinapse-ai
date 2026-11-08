---
titulo: "LOOPS Onda 12 — Data, Analytics & ML Engineering (diagramas e passo a passo)"
tipo: loops-diagramas
onda: 12
created: 2026-06-22
total_workflows: 12
---

# LOOPS Onda 12 — Data, Analytics & ML Engineering

Os loops operacionais da camada de **dados, analytics e ML** — destilados dos domínios 48-51 em diagramas de fluxo prontos pra virar comportamento de agent. Do pipeline ELT idempotente ao star schema dimensional, do ciclo de vida de ML ao data contract de PII.

## Índice dos loops

- **W1-W3** — Data Engineering & Pipelines (ELT idempotente, batch vs streaming, gate de qualidade)
- **W4-W6** — Data Modeling & Analytics Engineering (star schema, SCD, pipeline dbt com testes)
- **W7-W9** — ML Engineering & MLOps (ciclo de vida ML, data drift, feature store sem skew)
- **W10-W12** — Data Governance, Lineage & Privacy (data contract, proteger PII, lineage de métrica)

---

## W1 — Pipeline ELT idempotente (ingestão → transformação → serving)

> Sequência completa com camada raw imutável, gate de data contract e transformações via UPSERT — reprocessável sem duplicar.

```mermaid
flowchart TD
    A["Source System<br/>(OLTP / API / Kafka)"] --> B["Extract + Load<br/>(Fivetran / Airbyte / Debezium)"]
    B --> C["Raw Layer — Bronze<br/>(Parquet / S3)"]
    C --> D["Data Contract Gate<br/>(Great Expectations Checkpoint)"]
    D -->|"FAIL — bloqueia"| E["Alerta + Quarentena"]
    D -->|"PASS"| F["Transform — Silver<br/>(dbt models + UPSERT)"]
    F --> G["Transform — Gold<br/>(dbt models + testes)"]
    G --> H["Serving<br/>(BI / ML / Produto)"]
    G --> I["Audit Log<br/>(pipeline_version, processed_at)"]
```

---

## W2 — Escolher batch vs streaming (Lambda/Kappa)

> Gate de decisão arquitetural pela latência exigida: streaming, micro-batch, batch ou as arquiteturas híbridas Kappa/Lambda.

```mermaid
flowchart TD
    A["Requisito de latência?"] --> B{"Menos de 1 minuto?"}
    B -->|"Sim"| C["Streaming<br/>(Kafka + Flink)"]
    B -->|"Não"| D{"1 a 60 min?"}
    D -->|"Sim"| E["Micro-batch<br/>(Spark Structured Streaming)"]
    D -->|"Não"| F{"Batch suficiente?"}
    F -->|"Sim"| G["Batch periódico<br/>(Spark / dbt)"]
    F -->|"Não, batch + streaming coexistem"| H{"Lógica expressável como stream?"}
    H -->|"Sim"| I["Kappa Architecture<br/>(Kafka + replay)"]
    H -->|"Não, joins full-scan / sort global"| J["Lambda Architecture<br/>(batch layer + speed layer)"]
```

---

## W3 — Gate de qualidade com data contract

> Antes de promover camada, valida o contrato (nullability, unicidade, range); falha bloqueia e manda o dado pra quarentena, não alerta passivamente.

```mermaid
flowchart LR
    A["Pipeline escreve<br/>Silver layer"] --> B["Checkpoint GX<br/>(Expectation Suite)"]
    B --> C{"Validation Result?"}
    C -->|"PASS — todas as Expectations OK"| D["Promove para Gold<br/>(OVERWRITE idempotente)"]
    C -->|"FAIL — violação de contrato"| E["Bloqueia promoção"]
    E --> F["Notifica owner<br/>(Slack / PagerDuty)"]
    E --> G["Dado vai para Quarentena<br/>(pasta /quarantine no S3)"]
    D --> H["Atualiza Data Docs"]
    H --> I["Serving layer (BI / ML)"]
```

---

## W4 — Modelar um star schema dimensional

> Os 4 passos de Kimball: selecionar o processo, declarar o grão atômico, identificar dimensões e fatos (aditivos), com bus matrix de conformed dimensions.

```mermaid
flowchart TD
    A["1. Selecionar processo<br/>de negócio"] --> B["2. Declarar grain<br/>(o que é uma linha?)"]
    B --> C{"Grain atômico?"}
    C -- "Não" --> B
    C -- "Sim" --> D["3. Identificar dimensões<br/>(quem, o quê, onde, quando)"]
    D --> E["4. Identificar fatos<br/>(métricas numéricas)"]
    E --> F{"Fatos aditivos?"}
    F -- "Semi/Não-aditivo" --> G["Armazenar componentes<br/>calcular ratio na query"]
    F -- "Aditivo" --> H["Fact table com surrogate keys"]
    G --> H
    H --> I["Bus Matrix:<br/>mapear conformed dimensions"]
    I --> J["Star schema validado e documentado"]
```

---

## W5 — Tratar Slowly Changing Dimension (SCD)

> Decide a estratégia de SCD por atributo (Type 1/2/3/4) pelo valor histórico, e implementa Type 2 com snapshot dbt e surrogate key.

```mermaid
flowchart TD
    A["Atributo de dimensão<br/>vai mudar?"] --> B{"Histórico tem<br/>valor analítico?"}
    B -- "Não" --> C["SCD Type 1<br/>Overwrite direto"]
    B -- "Sim, ilimitado" --> D["SCD Type 2<br/>Nova linha por versão"]
    B -- "Sim, só 1 versão anterior" --> E["SCD Type 3<br/>Coluna previous_value"]
    B -- "Atributo muito volátil" --> F["SCD Type 4<br/>Mini-Dimension"]
    D --> G["Colunas: effective_start_dt,<br/>effective_end_dt, is_current, surrogate_key"]
    G --> H["Implementar no dbt:<br/>snapshot com strategy check"]
    H --> I["dbt_valid_from / dbt_valid_to automáticos"]
    I --> J["Teste: FK da fact aponta<br/>para surrogate_key, não natural key"]
```

---

## W6 — Pipeline dbt com testes e lineage

> Camadas staging → intermediate → marts com testes de qualidade (unique/not_null/relationships), freshness de sources, lineage e semantic layer com definição única de métrica.

```mermaid
flowchart LR
    A["Sources declarados<br/>em _sources.yml"] --> B["Staging models<br/>materialização: view"]
    B --> C["Intermediate models<br/>materialização: ephemeral"]
    C --> D["Mart models (fct_ / dim_)<br/>materialização: table"]
    D --> E["schema.yml: testes<br/>unique, not_null, relationships"]
    E --> F{"dbt build em CI"}
    F -- "Testes falham" --> G["PR bloqueado"]
    F -- "Testes passam" --> H["dbt docs generate<br/>lineage visível"]
    H --> I["Semantic layer:<br/>métricas em metrics.yml (definição única)"]
    I --> J["BI consome via API semântica"]
```

---

## W7 — Ciclo de vida ML (dados → treino → deploy → monitorar → retreino)

> O loop fechado de ML em produção: do dado bruto ao modelo vivo e autorregulado, com gate de aprovação e retreino disparado por violação de threshold.

```mermaid
flowchart TD
    A["Dados brutos<br/>coleta + validação"] --> B["Feature Engineering<br/>transformação + feature store"]
    B --> C["Treino do Modelo<br/>MLflow tracking"]
    C --> D["Avaliação Offline<br/>métricas vs baseline"]
    D --> E{"Aprovado?"}
    E -- "Não" --> C
    E -- "Sim" --> F["Deploy<br/>batch / online / streaming"]
    F --> G["Monitoramento<br/>drift + business metrics"]
    G --> H{"Threshold violado?"}
    H -- "Não" --> G
    H -- "Sim" --> I["Retreino disparado (CT pipeline)"]
    I --> D
```

---

## W8 — Detectar e responder a data drift

> Compara a janela atual com a de referência via teste estatístico (PSI/KS); conforme a severidade, estabiliza, alerta ou dispara retreino com shadow/canary.

```mermaid
flowchart LR
    A["Predições em produção<br/>log de features + scores"] --> D["Teste Estatístico<br/>PSI / KS / Jensen-Shannon"]
    B["Janela de referência<br/>dados de treino"] --> D
    C["Janela atual<br/>últimas N horas/dias"] --> D
    D --> E{"Drift detectado?"}
    E -- "PSI menor que 0.1" --> F["Estável, próxima janela"]
    E -- "PSI 0.1 a 0.2" --> G["Alerta: investigar por feature"]
    E -- "PSI maior que 0.2" --> H["Ação: retreinar (CT pipeline)"]
    H --> I["Validação offline do novo modelo"]
    I --> J["Shadow deploy: comparar vs incumbent"]
    J --> K["Promoção se aprovado (canary então full)"]
```

---

## W9 — Feature store (offline e online sem train-serve skew)

> Uma única definição de feature versionada, materializada em backend offline (treino) e online (serving), garantindo zero divergência entre treino e produção.

```mermaid
flowchart TD
    A["Feature View Definition<br/>código Python versionado"] --> B["Feast Apply<br/>sincroniza registry"]
    B --> C["Feature Registry<br/>fonte de verdade de schemas"]
    C --> D["Materialização Offline<br/>BigQuery / Snowflake"]
    C --> E["Materialização Online<br/>Redis / DynamoDB"]
    D --> F["get_historical_features<br/>point-in-time correct joins"]
    E --> G["get_online_features<br/>baixa latência"]
    F --> H["Dataset de Treino<br/>sem data leakage"]
    G --> I["Serving em Produção<br/>mesmo schema garantido"]
    H --> J["Modelo Treinado"]
    I --> J
    J --> K["Zero Train-Serve Skew<br/>uma implementação, dois backends"]
```

---

## W10 — Implementar um data contract (produtor → consumidor)

> Formaliza o schema + qualidade + SLA + owner num contrato versionado, classifica PII e breaking changes, e valida automaticamente no CI a cada mudança.

```mermaid
flowchart TD
    A["Identificar dado crítico<br/>com múltiplos consumidores"] --> B["Levantar schema atual e SLA implícito"]
    B --> C["Classificar campos:<br/>PII? breaking vs non-breaking?"]
    C --> D["Redigir contrato<br/>schema + quality + SLA + owner"]
    D --> E["Validar com consumidores existentes"]
    E --> F{"Aprovado?"}
    F -- "Ajustes" --> D
    F -- "Sim" --> G["Publicar no catálogo e versionar no git"]
    G --> H["CI: validação automática<br/>a cada schema change"]
    H --> I["Dado contratado em produção<br/>com breaking change policy ativa"]
```

---

## W11 — Classificar e proteger PII (minimização → anonimização)

> Inventaria e auto-detecta PII, e por campo decide remover (minimização), pseudonimizar (hash) ou anonimizar (agregar), documentando a base legal e monitorando acesso.

```mermaid
flowchart LR
    A["Inventariar tabelas<br/>com dados de cliente"] --> B["Auto-detect PII<br/>(DataHub / OpenMetadata)"]
    B --> C["Steward confirma/corrige<br/>classificação por campo"]
    C --> D{"Esta tabela precisa<br/>do dado real?"}
    D -- "Não precisa" --> E["Remover campo<br/>ou substituir por ID interno"]
    D -- "Precisa de consistência" --> F["Pseudonimizar:<br/>hash com chave secreta"]
    D -- "Precisa de análise agregada" --> G["Anonimizar: generalizar ou agregar"]
    E --> H["Atualizar catálogo<br/>com classificação final"]
    F --> H
    G --> H
    H --> I["Documentar base legal por campo"]
    I --> J["Monitorar acesso a PII<br/>(alerta sem justificativa)"]
```

---

## W12 — Rastrear lineage de uma métrica até a origem

> Quando uma métrica diverge, navega o lineage de coluna upstream até achar onde a definição ou o dado de origem difere, e fecha com definição canônica + data contract.

```mermaid
flowchart TD
    A["Métrica suspeita<br/>(ex: receita do dashboard != financeiro)"] --> B["Localizar tabela no catálogo"]
    B --> C["Abrir lineage graph (nível tabela)"]
    C --> D["Navegar upstream:<br/>qual pipeline gerou a tabela?"]
    D --> E["Abrir column-level lineage<br/>da coluna receita_liquida"]
    E --> F["Rastrear cada campo de origem<br/>com transformações"]
    F --> G{"Encontrou divergência?"}
    G -- "Sim: lógica diferente" --> H["Identificar onde a definição difere"]
    G -- "Sim: dado de origem diferente" --> I["Verificar se as fontes são as mesmas"]
    G -- "Não: bug na transformação" --> L["Corrigir SQL/dbt model e registrar"]
    H --> J["Documentar definição canônica no glossário"]
    I --> J
    J --> K["Corrigir pipeline + criar data contract<br/>da métrica certificada"]
```

---

## W13 — Gate de Responsible ML antes do deploy

> Avalia fairness por subgrupo, obtém explicabilidade SHAP/LIME, audita viés nos dados de treino e documenta limitações em model card — o modelo só é promovido se todos os gates passarem.

```mermaid
flowchart TD
    A["Modelo candidato<br/>aprovado em métricas offline"] --> B["Avaliar fairness por subgrupo<br/>(Fairlearn / AI Fairness 360)"]
    B --> C{"Métricas por subgrupo<br/>dentro do threshold?"}
    C -->|"FAIL — viés detectado"| D["Investigar fonte do viés<br/>nos dados de treino"]
    D --> E["Aplicar mitigação<br/>(rebalancear, reponderar, pós-proc.)"]
    E --> B
    C -->|"PASS"| F["Gerar explicabilidade global<br/>(SHAP values por feature)"]
    F --> G["Gerar explicabilidade local<br/>(LIME para casos representativos)"]
    G --> H{"Comportamento explicável<br/>é consistente com domínio?"}
    H -->|"Não — feature espúria detectada"| I["Revisar feature engineering<br/>e retreinar"]
    I --> B
    H -->|"Sim"| J["Checar viés nos dados de treino<br/>(split temporal correto? leakage?)"]
    J --> K{"Dado de treino<br/>isento de leakage e skew?"}
    K -->|"Não"| L["Corrigir pipeline de dados<br/>e retreinar"]
    L --> B
    K -->|"Sim"| M["Documentar limitações<br/>e model card"]
    M --> N["Model card inclui:<br/>intended use, subgroup perf.,<br/>limitações conhecidas, base legal"]
    N --> O{"Gate final:<br/>todos os checks PASS?"}
    O -->|"Fail em qualquer dimensão"| P["BLOQUEADO — não promover<br/>registrar no MLflow com motivo"]
    O -->|"PASS em todos"| Q["Promover para deploy<br/>(shadow → canary → full)"]
```

---

## W14 — Escolher modo de serving do modelo

> Decide entre batch, online real-time e streaming com base na latência exigida, volume de entidades, freshness necessária e custo operacional — cada nó justifica o desvio ao padrão anterior.

```mermaid
flowchart TD
    A["Requisito de serving:<br/>qual SLA de latência?"] --> B{"Latência exigida<br/>menor que 200ms?"}
    B -->|"Sim"| C{"Features precisam<br/>refletir estado real-time?"}
    C -->|"Sim — estado muda entre requests"| D["Online serving<br/>(REST API + online store)"]
    C -->|"Não — features estáveis por horas"| E["Online serving<br/>com cache de features<br/>(TTL em Redis)"]
    B -->|"Não — latência de horas é aceitável"| F{"O conjunto de entidades<br/>é conhecido com antecedência?"}
    F -->|"Sim — lista fechada de usuários, SKUs etc."| G{"Volume de eventos<br/>contínuo e alto?"}
    G -->|"Não"| H["Batch serving agendado<br/>(Spark / dbt + pre-compute)"]
    G -->|"Sim — stream de eventos"| I["Streaming serving<br/>(Kafka + Flink + modelo como UDF)"]
    F -->|"Não — entidades chegam em stream"| I
    D --> J["Feature store online<br/>get_online_features < 10ms"]
    E --> J
    H --> K["Resultados pré-computados<br/>em tabela de serving"]
    I --> L["Predições como stream<br/>para sink Redis/banco"]
    J --> M["Validar SLA:<br/>p99 latência + throughput"]
    K --> N["Validar freshness:<br/>dados não ultrapassam janela aceitável"]
    L --> N
    M --> O["Modo de serving definido<br/>e documentado na spec"]
    N --> O
```

---

## W15 — Resposta a solicitação LGPD de titular e notificação ANPD de incidente

> Cobre dois fluxos Art. 18 LGPD: (A) resposta a direitos do titular — acesso, correção, exclusão, portabilidade — com verificação de identidade, execução via lineage e prazo legal; (B) notificação à ANPD em incidente com PII dentro do prazo regulatório.

```mermaid
flowchart TD
    A["Solicitação recebida<br/>(portal, email, canal oficial)"] --> B["Classificar tipo de solicitação<br/>(Art. 18 LGPD)"]
    B --> C{"Tipo?"}
    C -->|"Acesso ou portabilidade"| D["Verificar identidade do titular<br/>(documento + comparação cadastral)"]
    C -->|"Correção"| D
    C -->|"Exclusão / anonimização"| D
    C -->|"Incidente com PII detectado"| P["Iniciar fluxo de notificação ANPD"]
    D --> E{"Identidade<br/>confirmada?"}
    E -->|"Não confirmada"| F["Solicitar documentação adicional<br/>— prazo não corre até confirmação"]
    F --> E
    E -->|"Confirmada"| G["Acionar Data Steward responsável<br/>pelo domínio do dado"]
    G --> H["Usar column-level lineage<br/>para mapear todos os sistemas<br/>onde o dado do titular existe"]
    H --> I{"Tipo de solicitação?"}
    I -->|"Acesso"| J["Exportar dados em formato legível<br/>(CSV / JSON + descrição dos campos)"]
    I -->|"Portabilidade"| K["Exportar em formato interoperável<br/>(JSON estruturado LGPD)"]
    I -->|"Correção"| L["Atualizar em todos os sistemas<br/>identificados pelo lineage"]
    I -->|"Exclusão"| M["Excluir ou anonimizar<br/>em todos os sistemas via lineage<br/>— exceto obrigação legal de retenção"]
    J --> N["Responder ao titular<br/>em até 15 dias corridos"]
    K --> N
    L --> N
    M --> N
    N --> O["Registrar solicitação no catálogo<br/>(data, tipo, ação, prazo cumprido)"]
    P --> Q["Avaliar severidade:<br/>volume de titulares, tipo de PII,<br/>risco de dano"]
    Q --> R{"Risco de dano<br/>relevante aos titulares?"}
    R -->|"Sim ou incerto"| S["Notificar ANPD<br/>em até 72h (prazo regulatório)"]
    S --> T["Comunicar titulares afetados<br/>com linguagem acessível"]
    T --> U["Acionar plano de resposta a incidente<br/>(contiver, erradicar, recuperar)"]
    R -->|"Baixo risco confirmado"| U
    U --> V["Documentar incidente:<br/>causa, dados expostos, ações,<br/>medidas preventivas adotadas"]
    V --> O
```
