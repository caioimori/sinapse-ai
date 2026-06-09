# 02 — Arquitetura multiagente proposta

Sistema com **agente-master** orquestrando sub-agentes especializados (alinha 1:1 com o
padrão SINAPSE de orquestrador + especialistas).

```
                    ┌─────────────────────────────┐
                    │   AGENTE-MASTER (orquestra)  │
                    │  • monta plano de orquestração│
                    │  • aloca capital / risco      │
                    │  • arbitra consenso entre subs│
                    │  • decide: executar / vetar   │
                    └──────────────┬──────────────┘
        ┌──────────────┬───────────┼───────────┬──────────────┐
        ▼              ▼           ▼           ▼              ▼
   ┌─────────┐   ┌──────────┐ ┌─────────┐ ┌─────────┐  ┌───────────┐
   │ ANALISTA │   │ NOTÍCIAS │ │ QUANT   │ │ RISCO   │  │ EXECUÇÃO  │
   │ (LLM     │   │ (eventos │ │ (sinais │ │ (Kelly, │  │ (ordens   │
   │  prob.)  │   │ +sentim.)│ │ técnicos│ │ stop,   │  │  via CLI/ │
   │          │   │          │ │ /ML)    │ │ exposição│ │  broker)  │
   └────┬─────┘   └────┬─────┘ └────┬────┘ └────┬────┘  └─────┬─────┘
        └──────────────┴──────┬─────┴───────────┘             │
                              ▼                                ▼
                    ┌──────────────────┐            ┌──────────────────┐
                    │  MEMÓRIA/DADOS    │            │  MERCADO (live)   │
                    │  poly_data +      │            │  polymarket-cli   │
                    │  backtest + FIFO  │            │  (read + execute) │
                    └──────────────────┘            └──────────────────┘
```

## Sub-agentes

| Agente | Função | Fonte |
|---|---|---|
| **Analista** | Estima probabilidade do evento (Superforecaster) | LLM + base rates |
| **Notícias** | Eventos recentes + sentimento | NewsAPI / Tavily / busca |
| **Quant** | Sinais técnicos / features / ML | `poly_data` |
| **Risco** | Sizing (Kelly fracionário ¼), stop, exposição | regras + portfólio |
| **Execução** | Assina e envia ordens; registra | `polymarket-cli` / broker |

## Loop de decisão (consenso, não agente único)

1. **Sensores** puxam mercado (book, midpoint, histórico) — read-only, sem wallet.
2. **Analista + Notícias + Quant** rodam em **paralelo**; cada um devolve
   `{lado, confiança, tese}` em **JSON estruturado validado** (Pydantic) — nunca regex.
3. **Master** aplica consenso: 2/3 concordam → posição cheia; 1 → meia; divergência → nada.
4. **Risco** dimensiona (¼ Kelly) e valida exposição/stop antes de liberar.
5. **Execução** assina e envia; loga tudo (observabilidade/tracing).
6. **Saída** por gatilhos: alvo atingido, spike de volume (smart money saindo), tese velha (>24h sem mover).

## Princípios de engenharia (correções vs. o repo "agents")

- **Structured output** (LLM → JSON tipado), nunca parsing por regex.
- **Retry + backoff exponencial**; nada de recursão infinita.
- **Estado persistente** (DB) de trades, teses e PnL; observabilidade desde o dia 1.
- **Risk management de verdade**: limites de exposição, stop-loss, circuit breaker.
- **Config externa** (endereços, chaves em vault) — nada hard-coded.
- **Read e execução separados**: sensores sem credenciais; execução isolada com a chave.

## Sizing — Kelly fracionário (referência)

```
f* = (p*b - q) / b      # p = prob estimada, b = payout (1/preço - 1), q = 1-p
size = bankroll * min(f*, 0.25)   # cap em ¼ Kelly; f* <= 0 → não opera
```
Sweet spot prático: f* entre 0.05 e 0.15.
