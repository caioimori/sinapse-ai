# 01 — Análise técnica dos 3 repositórios reais

Verificação feita lendo o código-fonte clonado (não só README). Datas/estrelas
conferidas via GitHub em jun/2026.

---

## A. `warproxxx/poly_data` — a MEMÓRIA (dados históricos)

**O que é:** pipeline Python que reconstrói o histórico de trades da Polymarket.

**Arquitetura (3 estágios, `update.py`):**
1. **Markets (Gamma API):** paginação keyset, resumível, preserva todos os campos.
2. **Chain (JSON-RPC Polygon):** lê eventos `OrderFilled` do contrato CTF Exchange V2
   (`0xE111180000d2663C0091e4f400237545B87B996B`), decodifica via ABI, mapeia pro
   schema v1-compatível. Cursor persistido, `CONFIRMATIONS=20` contra reorg.
3. **Process (join):** junta ordens × mercados → `processed/trades.csv`.

**Schema real de `processed/trades.csv`:**
`timestamp, market_id, maker, taker, nonusdc_side, maker_direction, taker_direction,
price, usd_amount, token_amount, transactionHash`

**⚠️ Ponto crítico:** **NÃO existe coluna de profit / PnL / win-rate.** Para ranquear
"carteiras vencedoras" é preciso reconstruir posição por carteira via **matching FIFO
entrada×saída** (calcular realized PnL). Foi exatamente isso que o tweet escondeu — o
código dele referenciava `pl.col("profit")`, que não existe no dataset.

**Custos/limitações:** depende de RPC; free tier leva horas no backfill, RPC pago
(~$20-200/mês) é praticamente necessário. Volume v2 estimado ~5M trades, ~500MB raw.

**Utilidade:** base para (a) ranking de carteiras p/ copy-trade, (b) backtesting,
(c) feature engineering (momentum, volume, imbalance, concentração, volatilidade).

---

## B. `Polymarket/polymarket-cli` — SENSORES + MÃOS (Rust oficial)

**O que é:** CLI oficial em Rust, pensado também como **API JSON para agentes**
(`-o json` → subprocess).

**Read-only SEM wallet (sensores):**
- `markets list`, `events list` — universo de mercados
- `clob book TOKEN` — order book (bids/asks/depth)
- `clob midpoint TOKEN` — preço médio
- `clob price-history TOKEN --interval 1d` — série temporal
- `data positions ADDR` — posições de uma carteira

**Autenticado COM private key (execução):**
- `create-order`, `market-order` (FOK/FAK/GTC/GTD), `cancel-all`, `cancel-market`
- `approve set` — aprovações on-chain (ERC20 + ERC1155)
- Assinatura **ECDSA local** (`LocalSigner`); a chave nunca vai ao servidor.

**Segurança:** private key via flag > env > `~/.config/polymarket/config.json` (perms
`0o600`). Flag/env vazam em `ps`/`/proc`. Para produção: vault/HSM.

**Latência:** leitura ~50-200ms; ordem ~500-1000ms. Rate limits não documentados →
implementar backoff no agente.

**Papel no sistema:** é simultaneamente os **sentidos** (read-only) e as **mãos**
(execução) do bot.

---

## C. `Polymarket/agents` — o CÉREBRO (LLM) — **demo arquivada**

**O que é:** framework oficial (MIT) de agente de IA. **Arquivado desde nov/2024.**
Loop de decisão presente, mas **execução comentada** (`trade.py:60`) → é esqueleto/demo.

**Loop (`Trader.one_best_trade`):** fetch mercados (Gamma) → filtra eventos (RAG/Chroma)
→ mapeia eventos→mercados → filtra → **Superforecaster (LLM estima probabilidade)** →
decide preço/tamanho/lado → (execução desabilitada).

**Cérebro (prompts.py):**
- **Superforecaster** (`112-144`): decompõe pergunta → base rates → fatores →
  estimativa probabilística. **Bom padrão, reutilizável.**
- **Trade decision** (`146-188`): persona "top trader" — **motivacional e vago**, sem
  Kelly, sem liquidez/slippage, sem stop-loss.

**Fontes de sinal:** só **Gamma** está ativa. `news.py` (NewsAPI) e `search.py` (Tavily)
são **skeleton, não plugados**. RAG é filtragem semântica rasa (sem contexto real).

**Bugs/riscos reais no código:**
- `polymarket.py:354` — saldo USDC dividido por `10e5` em vez de `1e6` → **100x errado**.
- `executor.py:186` — parsing por regex `\d+\.\d+` → quebra com "30%" ou texto.
- `executor.py:160` — `ast.literal_eval` em saída de LLM → **risco de RCE**.
- `trade.py:63` — recursão infinita no except (sem backoff).
- Sem estado/persistência, sem logging estruturado, sem risk management.
- Dependências defasadas (langchain 0.2, openai 1.37, chromadb 0.5).

**Veredito:** **não replicar o código.** Aproveitar **padrões**: split Creator/Executor,
estrutura de prompt Superforecaster, Connector pattern para fontes de sinal.

---

## Resumo

| Repo | Papel | Reaproveitar |
|---|---|---|
| `poly_data` | Memória/histórico | Código (camada de dados) + escrever motor FIFO |
| `polymarket-cli` | Sensores + execução | Como I/O de mercado (subprocess JSON) |
| `Polymarket/agents` | Cérebro | Só padrões; reescrever com structured output + risco |
