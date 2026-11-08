---
titulo: "LOOPS — Onda 13: Operability, Performance & Economics"
tipo: loops-diagramas
onda: 13
dominios: "52 · 53 · 54 · 55"
created: 2026-06-22
total_workflows: 12
---

# LOOPS — Onda 13: Operability, Performance & Economics

> Os workflows operacionais dos domínios 52-55 destilados em diagramas de fluxo. Cada um é um loop canônico pronto pra virar comportamento de agent: como instrumentar e enxergar dentro do sistema (52), como sustentá-lo sob carga (53), como mantê-lo barato — incluindo o custo de IA (54) e como tratar a plataforma interna como produto (55). Cobrem a operação madura: ver, escalar, pagar e servir.

## W1 — Instrumentação OTel: do zero ao trace correlacionado

> Pipeline pra instrumentar um serviço novo com correlação trace-log-metric desde o primeiro deploy.

```mermaid
flowchart TD
    A["Serviço novo<br/>sem telemetria"] --> B["Instalar OTel SDK<br/>auto-instrumentação"]
    B --> C["Configurar OTLP exporter<br/>para Collector"]
    C --> D["Ativar propagação W3C TraceContext<br/>em headers de saída"]
    D --> E["Configurar SDK de Logs OTel<br/>injeta trace_id e span_id automaticamente"]
    E --> F["Adicionar middleware<br/>Canonical Log Line por request"]
    F --> G["Configurar tail-based sampling<br/>100% erros, amostrar sucessos"]
    G --> H["Validar correlação:<br/>trace -> log -> metric no backend"]
    H --> I{"Todos os 3 sinais<br/>correlacionados?"}
    I -- "Sim" --> J["Gate Nível 1 PASS<br/>Pronto para Nível 2"]
    I -- "Não" --> K["Diagnosticar gap:<br/>context propagation ou exporter"]
    K --> D
```

## W2 — Auditoria de alert fatigue

> Processo pra reduzir ruído de on-call e restaurar confiança nos alertas: cada page tem que ter ação humana e runbook.

```mermaid
flowchart TD
    A["On-call com fadiga<br/>muitos alertas ignorados"] --> B["Exportar histórico:<br/>alertas últimos 30 dias"]
    B --> C["Para cada alerta:<br/>teve ação humana tomada?"]
    C --> D{"Taxa de falso<br/>positivo > 10%?"}
    D -- "Sim" --> E["Candidato a remoção<br/>ou rebaixamento"]
    D -- "Não" --> F{"Alerta orienta<br/>a sintoma do usuário?"}
    F -- "Não, causa interna" --> G["Mover para dashboard<br/>de diagnóstico apenas"]
    F -- "Sim" --> H["Verificar runbook:<br/>documentado e atualizado?"]
    G --> I["Remover como page<br/>registrar como ticket ou visual"]
    H -- "Sem runbook" --> J["Criar runbook mínimo:<br/>impacto + 3 passos + escala"]
    H -- "Com runbook" --> K["Alerta APROVADO<br/>mantido na rotação"]
    E --> L["Reavaliação em 2 semanas<br/>após ajuste de threshold"]
    I --> M["Medir MTTD e MTTFP<br/>após auditoria completa"]
    J --> K
    L --> M
    K --> M
```

## W3 — Debugging de falha em agent loop com OTel

> Diagnóstico de comportamento anômalo de um agente instrumentado: do alerta de budget ao eval de regressão.

```mermaid
flowchart LR
    A["Alerta disparado:<br/>agente ultrapassou budget de tokens"] --> B["Abrir trace do agente<br/>no backend OTel"]
    B --> C["Analisar árvore de spans:<br/>profundidade e repetição"]
    C --> D{"Span de tool invocation<br/>repetido mais de 3x?"}
    D -- "Sim" --> E["Loop detectado:<br/>identificar tool name e params"]
    D -- "Não" --> F{"Span com duração<br/>anormal no LLM call?"}
    F -- "Sim" --> G["Inspecionar atributos:<br/>gen_ai.usage.prompt_tokens"]
    F -- "Não" --> H["Inspecionar span de erro:<br/>exception.message e stack"]
    E --> I["Verificar log correlato:<br/>trace_id -> contexto do raciocínio"]
    G --> I
    H --> I
    I --> J{"Causa identificada?"}
    J -- "Sim" --> K["Criar eval de regressão<br/>a partir do trace de falha"]
    J -- "Não" --> L["Adicionar span attributes<br/>no passo suspeito e redeployar"]
    K --> M["Fix implementado<br/>Gate: eval verde antes de fechar"]
    L --> B
```

## W4 — Diagnóstico de bottleneck com USE Method

> Enumera recursos, coleta Utilization/Saturation/Errors de cada um, isola o gargalo e drilla até a causa raiz.

```mermaid
flowchart TD
    A("Alerta de degradação ou incidente") --> B("Enumerar recursos do sistema")
    B --> C("Para cada recurso: medir Utilization")
    C --> D("Para cada recurso: medir Saturation")
    D --> E("Para cada recurso: medir Errors")
    E --> F{"Utilization > 70%<br/>OU Saturation > 0<br/>OU Errors > 0?"}
    F -- "Não" --> G("Sistema saudável — monitorar")
    F -- "Sim" --> H("Recurso com sinal positivo = candidato a bottleneck")
    H --> I("Drill-down: coletar métricas finas do recurso")
    I --> J{"Bottleneck confirmado?"}
    J -- "Não" --> C
    J -- "Sim" --> K("Flame graph ou off-CPU analysis")
    K --> L("Identificar causa raiz")
    L --> M("Aplicar fix: escalar, otimizar ou rearquitetar")
    M --> N("Validar com load test — thresholds de p99")
```

## W5 — Capacity planning com Little's Law

> Parte do SLO de latência e do throughput de pico pra derivar o número de instâncias com headroom — validado pela Universal Scalability Law.

```mermaid
flowchart TD
    A("Definir SLO de latência alvo") --> B("Projetar throughput no pico")
    B --> C("Aplicar Little's Law:<br/>L = lambda x W")
    C --> D("L = requisições concorrentes necessárias")
    D --> E("Medir capacidade atual por instância")
    E --> F("Calcular instâncias = L / capacidade por instância")
    F --> G("Adicionar headroom de 30%<br/>para manter utilização menor que 70%")
    G --> H("Validar com USL:<br/>medir throughput em N=1,2,4,8 instâncias")
    H --> I{"beta > 0.1?"}
    I -- "Sim" --> J("Resolver coherency penalty<br/>antes de escalar")
    J --> H
    I -- "Não" --> K("Provisionar N instâncias calculadas")
    K --> L("Executar load test com throughput projetado")
    L --> M{"p99 dentro do SLO<br/>com 30% headroom?"}
    M -- "Não" --> N("Revisar arquitetura ou provisionar mais")
    N --> L
    M -- "Sim" --> O("Configurar autoscale e alertas de headroom")
```

## W6 — Load testing como gate de CI

> Integra smoke, load e validação de threshold em cada deploy pra barrar regressão de performance antes do merge.

```mermaid
flowchart LR
    A("Pull Request criado") --> B("Smoke test: 1 VU x 2min")
    B --> C{"Smoke passou?"}
    C -- "Não" --> D("Bloquear merge — falha funcional")
    C -- "Sim" --> E("Deploy em staging")
    E --> F("Load test: constant-arrival-rate<br/>throughput nominal x 5min")
    F --> G("Avaliar thresholds:<br/>p99 menor que SLO<br/>erro menor que 0.1%")
    G --> H{"Thresholds OK?"}
    H -- "Não" --> I("Bloquear merge — regressão de performance")
    H -- "Sim" --> J("Comparar vs baseline anterior")
    J --> K{"Degradação maior que 10%<br/>no throughput máximo?"}
    K -- "Sim" --> L("Bloquear merge — regressão de capacidade")
    K -- "Não" --> M("Gate passou — autorizar merge")
    M --> N("Atualizar baseline no artefato de CI")
```

## W7 — Model routing: decisão de tier de modelo

> Dada uma task, escolhe o tier de LLM por custo×qualidade e estima o custo de tokens antes de executar.

```mermaid
flowchart TD
    A["Task recebida"] --> B{"Requer raciocínio<br/>arquitetural profundo?"}
    B -- Sim --> C["Opus — effort xhigh"]
    B -- Não --> D{"Análise multi-file<br/>ou feature complexa?"}
    D -- Sim --> E["Sonnet — effort high"]
    D -- Não --> F{"Tarefa determinística<br/>ou lookup simples?"}
    F -- Sim --> G["Haiku — effort low"]
    F -- Não --> H["Sonnet — effort medium"]
    C --> I["Estima custo tokens<br/>antes de executar"]
    E --> I
    G --> I
    H --> I
    I --> J["Executa com<br/>prompt caching se<br/>system prompt > 1k tokens"]
```

## W8 — Prompt caching ROI: viabilidade de cache

> Decide se e como implementar prompt caching com base em tamanho do prompt e frequência de reuso, medindo o hit rate.

```mermaid
flowchart LR
    A["System prompt existente"] --> B{"Tamanho > 1.024<br/>tokens?"}
    B -- Não --> C["Cache não aplicável<br/>Mínimo Anthropic = 1.024"]
    B -- Sim --> D{"Reutilização > 2x<br/>por janela de 5min?"}
    D -- Não --> E{"Reutilização > 4x<br/>por janela de 1h?"}
    E -- Não --> F["Cache não rentável<br/>Custo write > savings"]
    E -- Sim --> G["Cache 1h TTL<br/>Break-even = 4 calls"]
    D -- Sim --> H["Cache 5min TTL<br/>Break-even = 2 calls"]
    G --> I["Calcula economia:<br/>tokens × 90% off × volume"]
    H --> I
    I --> J["Implementa e mede<br/>cache hit rate diário"]
```

## W9 — Monitoramento de custo por unidade

> Estabelece unit economics em produto com IA: do custo por unidade de valor à correção quando ele cresce mais que a receita.

```mermaid
flowchart TD
    A["Define métrica de unidade<br/>Ex: custo por usuário ativo"] --> B["Taga recursos cloud<br/>por produto e feature"]
    B --> C["Coleta custo total<br/>do período de billing"]
    C --> D["Coleta volume de<br/>unidades no período"]
    D --> E["Calcula unit cost:<br/>Custo Total / Unidades"]
    E --> F{"Unit cost crescendo<br/>mais que receita?"}
    F -- Não --> G["Estado saudável<br/>Revisa mensalmente"]
    F -- Sim --> H["Identifica componente<br/>com maior crescimento"]
    H --> I{"Custo LLM<br/>dominante?"}
    I -- Sim --> J["Aplica model routing<br/>e prompt caching"]
    I -- Não --> K["Aplica rightsizing<br/>ou reserved instances"]
    J --> L["Mede impacto em<br/>7 dias e itera"]
    K --> L
```

## W10 — Golden path self-service: do briefing à produção

> Do formulário no portal ao serviço catalogado em produção sem ticket — e o que acontece quando o time diverge do caminho pavimentado.

```mermaid
flowchart TD
    A("Briefing: novo serviço") --> B("Developer abre portal<br/>Backstage /create")
    B --> C("Escolhe template<br/>golden path")
    C --> D("Preenche formulário<br/>nome, owner, stack, banco")
    D --> E("Scaffolder executa template")
    E --> F("Cria repo + CI/CD<br/>pré-configurado")
    E --> G("Provisiona recurso<br/>banco, DNS, secrets")
    E --> H("Registra no catalog<br/>catalog-info.yaml")
    E --> I("Gera TechDocs inicial")
    F --> J("Serviço catalogado<br/>e em produção")
    G --> J
    H --> J
    I --> J
    J --> K{"Caiu no golden path?"}
    K -- "Sim" --> L("Suporte pleno da plataforma")
    K -- "Não, divergiu" --> M("Custo é do time<br/>sem suporte garantido")
    M --> N("Feedback: eleva pra golden path?")
    N --> C
```

## W11 — TVP: evolução incremental validada de plataforma

> Evolui a plataforma interna do nível wiki ao self-service completo, validando adoção e impacto no DORA dos times consumidores a cada degrau.

```mermaid
flowchart TD
    A("Necessidade identificada<br/>via friction log") --> B("TVP Nível 0<br/>Página wiki com padrão")
    B --> C{"Adoção orgânica?"}
    C -- "Não" --> D("Invalidar hipótese<br/>voltar ao discovery")
    C -- "Sim" --> E("TVP Nível 1<br/>Script/CLI automatiza padrão")
    E --> F{"Adoção aumentou?"}
    F -- "Não" --> G("Refinar UX<br/>não adicionar features")
    F -- "Sim" --> H("TVP Nível 2<br/>CI/CD template + repo self-service")
    H --> I{"Feedback positivo?"}
    I -- "Não" --> G
    I -- "Sim" --> J("TVP Nível 3<br/>Portal com templates e catálogo")
    J --> K{"NPS interno aceitável?"}
    K -- "Não" --> L("Discovery: friction logs<br/>com times consumidores")
    L --> G
    K -- "Sim" --> M("TVP Nível 4<br/>Self-service completo")
    M --> N("Medir DORA dos times<br/>consumidores")
    N --> O{"Melhora em<br/>lead time / CFR?"}
    O -- "Não" --> L
    O -- "Sim" --> P("Plataforma validada<br/>expandir coverage")
```

## W12 — DX audit: diagnóstico SPACE + DevEx

> Cruza dados objetivos de sistema com percepção (survey SPACE) e friction logs pra achar a dimensão de maior atrito e priorizar o backlog da plataforma.

```mermaid
flowchart LR
    A("Trigger: DX audit<br/>de plataforma") --> B("Coletar dados objetivos<br/>CI duration, lead time, DORA")
    A --> C("Coletar dados perceptivos<br/>survey SPACE 3 dims min")
    A --> D("Friction logs<br/>4-6 devs em tarefas reais")
    B --> E("Mapear dimensão SPACE<br/>com mais atrito")
    C --> E
    D --> E
    E --> F{"Atrito em<br/>Feedback Loops?"}
    E --> G{"Atrito em<br/>Cognitive Load?"}
    E --> H{"Atrito em<br/>Flow State?"}
    F -- "Sim" --> I("Prioridade: builds, CI,<br/>preview envs, code review speed")
    G -- "Sim" --> J("Prioridade: docs, templates,<br/>catalog, toolchain unificado")
    H -- "Sim" --> K("Prioridade: autonomia, foco blocks,<br/>interrupções, reuniões")
    I --> L("Backlog plataforma<br/>priorizado por impacto")
    J --> L
    K --> L
    L --> M("Executar + medir<br/>mesmas métricas 30d depois")
    M --> N{"Delta positivo?"}
    N -- "Sim" --> O("Publicar win interno<br/>NPS tracking")
    N -- "Não" --> P("Reabrir friction log<br/>hipótese errada")
    P --> E
```

## W13 — Estratégia de cache: escolha de camada e proteção anti-stampede

> Decide qual camada de cache usar, qual política de escrita aplicar, define o TTL e protege chaves quentes contra stampede via mutex ou XFetch.

```mermaid
flowchart TD
    A["Dado a cachear identificado"] --> B{"Dado é estático ou<br/>muda raramente?"}
    B -- "Sim" --> C["Camada L1/L2<br/>Browser ou CDN Edge<br/>Cache-Control + ETags"]
    B -- "Não" --> D{"Dado muda a cada<br/>escrita do usuário?"}
    D -- "Sim" --> E["Camada L3<br/>Redis App Cache<br/>cache-aside default"]
    D -- "Não" --> F["Camada L4<br/>DB query cache<br/>ORM / PostgreSQL"]
    C --> G["Política: write-around<br/>Invalida por versioning<br/>hash no filename"]
    E --> H{"Consistência<br/>forte exigida?"}
    H -- "Sim" --> I["Política: write-through<br/>Escreve cache E DB<br/>sincronamente"]
    H -- "Não" --> J["Política: cache-aside<br/>miss→consulta DB→popula<br/>manualmente"]
    I --> K["Define TTL<br/>curto para dados<br/>que mudam frequentemente"]
    J --> K
    F --> K
    G --> K
    K --> L{"Chave com alto<br/>volume concorrente?"}
    L -- "Não" --> M["TTL simples — sem<br/>proteção adicional"]
    L -- "Sim" --> N{"Complexidade<br/>aceitável?"}
    N -- "Baixa" --> O["Mutex via SETNX<br/>1 instância regenera<br/>demais aguardam"]
    N -- "Média" --> P["XFetch probabilistic<br/>early expiry<br/>renova antes de expirar"]
    O --> Q["Gate: medir cache hit rate<br/>diário e stale data<br/>no percentil 99"]
    P --> Q
    M --> Q
```

## W14 — Backpressure e proteção sob saturação

> Detecta saturação do serviço, aplica rate limiting com token ou leaky bucket, aciona load shedding, isola recursos com bulkhead e abre o circuit breaker quando o downstream degrada.

```mermaid
flowchart TD
    A["Requisição chega ao serviço"] --> B{"Utilização do recurso<br/>crítico maior que 70%<br/>OU fila crescendo?"}
    B -- "Não" --> C["Processar normalmente"]
    B -- "Sim" --> D["Saturação detectada —<br/>acionar proteções"]
    D --> E{"Origem é cliente<br/>externo ou API pública?"}
    E -- "Sim" --> F["Rate limiting<br/>token bucket:<br/>permite bursts controlados"]
    E -- "Não" --> G["Rate limiting<br/>leaky bucket:<br/>taxa de saída constante"]
    F --> H{"Requisição dentro<br/>do limite do bucket?"}
    G --> H
    H -- "Sim" --> I["Passa para<br/>bulkhead routing"]
    H -- "Não" --> J["Rejeitar 429<br/>Too Many Requests<br/>com Retry-After header"]
    I --> K{"Pool do bulkhead<br/>para esta operação<br/>disponível?"}
    K -- "Sim" --> L["Processar no pool<br/>isolado da operação"]
    K -- "Não" --> M{"Utilização maior<br/>que 90%?"}
    M -- "Sim" --> N["Load shedding:<br/>retornar 503 imediato<br/>não enfileirar"]
    M -- "Não" --> O["Enfileirar com<br/>timeout agressivo"]
    L --> P{"Downstream<br/>com falhas acima<br/>do threshold?"}
    P -- "Não" --> Q["Circuito CLOSED<br/>processamento normal"]
    P -- "Sim" --> R["Circuit breaker OPEN<br/>rejeitar rapidamente<br/>sem chamar downstream"]
    R --> S["Aguardar timeout<br/>HALF-OPEN:<br/>testar 1 requisição"]
    S --> T{"Requisição de<br/>teste bem-sucedida?"}
    T -- "Sim" --> Q
    T -- "Não" --> R
```

## W15 — Latência de cauda e fan-out

> Calcula o impacto real do p99 em sistemas com fan-out para N backends usando a fórmula de Dean e Barroso, decide quando usar hedged requests após o p95 e cancela o perdedor com tied requests.

```mermaid
flowchart LR
    A["Requisição com fan-out<br/>para N backends paralelos"] --> B["Medir p99 individual<br/>de cada backend"]
    B --> C["Calcular probabilidade<br/>de cauda no fan-out:<br/>P = 1 - pow(1 - p99_slow, N)"]
    C --> D{"P maior que 5% das<br/>requisições experimenta<br/>latência de cauda?"}
    D -- "Não" --> E["SLA de cauda aceitável<br/>monitorar sem ação"]
    D -- "Sim" --> F["Cauda inaceitável —<br/>escolher estratégia"]
    F --> G{"Operação é<br/>idempotente e<br/>tem réplicas?"}
    G -- "Não" --> H["Timeout agressivo<br/>com exponential backoff<br/>e jitter aleatório"]
    G -- "Sim" --> I{"Custo de tráfego<br/>extra de 5%<br/>aceitável?"}
    I -- "Não" --> J["Good-enough results:<br/>retornar após quórum<br/>suficiente responder"]
    I -- "Sim" --> K["Hedged requests:<br/>aguardar p95 de<br/>latência esperada"]
    K --> L["Enviar cópia para<br/>réplica alternativa"]
    L --> M{"Réplicas podem<br/>coordenar com<br/>latência menor que 1ms?"}
    M -- "Sim" --> N["Tied requests:<br/>notificar réplicas para<br/>abortar quando uma começa"]
    M -- "Não" --> O["Hedged simples:<br/>usar primeira resposta<br/>cancelar demais"]
    N --> P["Gate: medir redução<br/>do p99.9 após deploy<br/>target: redução maior que 30%"]
    O --> P
    H --> P
    J --> P
```

## W16 — AKF Scale Cube: decidir o eixo de escala

> Dado o gargalo atual, aplica o AKF Scale Cube para escolher entre replicação horizontal no eixo X, decomposição funcional no eixo Y ou sharding de dados no eixo Z, na ordem correta de complexidade.

```mermaid
flowchart TD
    A["Gargalo de escala identificado<br/>USE Method confirmou bottleneck"] --> B{"Serviço tem estado<br/>armazenado em<br/>memória local?"}
    B -- "Sim" --> C["Pré-requisito bloqueante:<br/>externalizar estado para Redis<br/>ou banco antes de escalar"]
    C --> D["Serviço agora stateless<br/>retornar ao início"]
    D --> B
    B -- "Não stateless" --> E{"Eixo X — Replicação:<br/>adicionar instâncias idênticas<br/>atrás de load balancer resolve?"}
    E -- "Sim" --> F["Aplicar Eixo X<br/>Horizontal duplication:<br/>N clones mais LB"]
    F --> G["Validar com USL:<br/>medir throughput em<br/>N=1,2,4,8 instâncias"]
    G --> H{"beta maior que 0.1<br/>coherency penalty<br/>limitando ganho?"}
    H -- "Não" --> I["Eixo X suficiente<br/>autoscale configurado<br/>alertas de headroom"]
    H -- "Sim" --> J["Resolver coherency:<br/>remover locks globais<br/>e caches distribuídos"]
    J --> F
    E -- "Não domínios têm<br/>cargas independentes" --> K{"Eixo Y — Decomposição:<br/>separar por domínio<br/>funcional resolve?"}
    K -- "Sim" --> L["Aplicar Eixo Y<br/>Functional decomposition:<br/>cada serviço com datastore próprio"]
    L --> M["Gate: cada serviço<br/>agora escala e deploya<br/>independentemente"]
    K -- "Não dataset único<br/>é o bottleneck" --> N["Aplicar Eixo Z<br/>Data partitioning:<br/>sharding por tenant ou ID range"]
    N --> O["Definir chave de shard:<br/>cliente, geografia ou<br/>faixa de ID"]
    O --> P["Gate: pod isolado por shard<br/>falha de um não afeta<br/>os demais"]
    M --> Q["Monitorar via USE Method<br/>após cada eixo aplicado<br/>iterar se necessário"]
    P --> Q
    I --> Q
```
