# 03 — Reality-check: prediction market ≠ Bitcoin ≠ bolsa

O objetivo final é operar **Bitcoin / bolsa**. A arquitetura multiagente transfere; o
**edge não transfere 1:1**. A parte difícil não é orquestrar agentes — é ter vantagem
estatística real e gestão de risco.

## Diferenças estruturais

| Dimensão | Polymarket | Bitcoin / Bolsa |
|---|---|---|
| Resultado | Binário, resolve em 0/1, com data | Preço contínuo, sem "resolução", horizonte infinito |
| Edge possível | Estimar probabilidade melhor que a multidão (mercado raso, ineficiente) | Competir com **HFT, fundos quant, dados institucionais** em mercado quase eficiente |
| Papel do LLM | Bom: julgar eventos, base rates, notícias | Fraco em prever série numérica; útil só em sinal qualitativo/evento |
| Execução | CLOB on-chain (a CLI faz) | Broker/exchange (Alpaca, Interactive Brokers; Binance/Coinbase p/ BTC), horário, regras (PDT) |
| "Acertar mais que errar" | Win-rate importa | **Acurácia direcional ≠ lucro** — payoff assimétrico + custos mandam mais que % de acerto |

## Os 3 assassinos silenciosos (que o tweet ignorou)

1. **Look-ahead / data leakage** no backtest → resultado lindo que não se repete ao vivo.
2. **Slippage + custos** → backtest ingênuo assume execução perfeita; no real, come o edge.
3. **Não-estacionariedade** → o que funcionou semana passada para de funcionar; exige
   re-treino e monitoramento contínuo.

## Específico de Bitcoin

- Mercado **24/7**, altíssima volatilidade, dominado por fluxo/derivativos e liquidações.
- LLM não prevê preço de BTC; no máximo digere narrativa/notícia/on-chain.
- Custódia e segurança de chave viram risco central (mesma exigência de vault/HSM).

## Conclusão honesta

- **MVP realista = Polymarket** (terreno onde estimar probabilidade dá edge).
- **Bitcoin/bolsa = fase posterior**, e é problema de *edge + risco*, não de arquitetura.
- Expectativa calibrada: lucro consistente em mercado líquido é **difícil**; tratar como
  P&D com capital de risco, paper-trading antes de dinheiro real, e métricas honestas.
