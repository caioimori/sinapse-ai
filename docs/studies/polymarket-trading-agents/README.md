# Projeto de Estudo — Agentes de IA para Trading (Polymarket → Bitcoin/Bolsa)

> **Status:** Pesquisa / Discovery (pré-PRD, pré-código)
> **Objetivo de longo prazo:** Construir um sistema **multiagente** orquestrado por um
> **agente-master** capaz de analisar o passado, estimar probabilidades futuras e
> **comprar/vender** com mais acertos do que erros — começando por prediction markets
> (Polymarket) e avaliando, em fase posterior, mercado de Bitcoin e bolsa.

Esta pasta **constitui o projeto** e serve de ponto de retomada entre sessões.
Tudo aqui foi versionado no Git (branch `claude/twitter-article-analysis-27NIy`)
justamente porque o ambiente de execução é um container efêmero — só o que está
commitado persiste.

## Origem

Investigação iniciada a partir de um artigo no X (@LunarResearcher) que alegava um
bot de Polymarket "+$11.400 em 19 dias" construído com Claude Code sobre 4 repos.
A apuração concluiu que o post é **engagement-bait / funil de copy-trading**:
- 3 dos 4 repositórios são reais e bons; **1 é inventado** (404).
- O código "de destaque" **não roda** no dado real (usa coluna `profit` inexistente).
- Os resultados ($11.4k, 74% win, Sharpe 2.31) são **não-auditáveis**.

Apesar do marketing, os 3 repos reais formam uma base técnica sólida para estudo.

## Índice

| Arquivo | Conteúdo |
|---|---|
| `01-analise-repos.md` | Mergulho técnico nos 3 repos reais (dados, CLI, cérebro) |
| `02-arquitetura-multiagente.md` | Arquitetura proposta: agente-master + sub-agentes |
| `03-reality-check-mercado.md` | Diferenças críticas: prediction market vs Bitcoin/bolsa |
| `04-roadmap-fases.md` | Plano faseado (Fase 0 → 4) |
| `05-curso-transcricoes/` | Transcrições + análise do curso (PENDENTE — ver README interno) |

## Repositórios estudados (reais)

| Repo | Papel | Licença | Observação |
|---|---|---|---|
| `warproxxx/poly_data` | Dados históricos on-chain | GPL-3.0 | Sem PnL pronto (reconstruir via FIFO) |
| `Polymarket/polymarket-cli` | Sensores + execução (Rust) | — | Oficial, experimental |
| `Polymarket/agents` | Cérebro LLM (padrões) | MIT | **Arquivado**, demo, execução desabilitada |

## Próximos passos em aberto

1. **Curso (Bitcoin trading agents):** aguardando URL + definição de como obter as
   transcrições (ver `05-curso-transcricoes/README.md`). Restrição de rede do
   ambiente atual: só `github.com` é acessível.
2. **Fase 0:** motor de PnL/win-rate por carteira (FIFO) sobre `poly_data`.
3. **PRD + arquitetura formal** antes de qualquer implementação (exigência SINAPSE:
   Documentation-First).
