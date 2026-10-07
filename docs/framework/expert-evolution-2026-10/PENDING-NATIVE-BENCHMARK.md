# Benchmark nativo reservado — 07/10/2026

O baseline passou **18/20** e o contexto enriquecido passou **19/20**, segundo as rubricas congeladas. Foram 20 cenários sintéticos novos: 17 representantes de squads e três perfis core. O recibo público sanitizado está em `PENDING-NATIVE-BENCHMARK.json`.

| Resultado pareado | Casos |
|---|---:|
| Ambos aprovados | 18 |
| Apenas enriquecido aprovado | 1 — P18, architect |
| Ambos reprovados pelo critério formal | 1 — P02, cs-funnel-architect |

Em P18, o reviewer identificou rollback observável no enriquecido e sua ausência no baseline. Em P02, ambos omitiram o ticket de R$ 3.000 exigido pela rubrica; o brief solicitava explicitamente conversões, CAC e contribuição, sem solicitar ticket.

Essa divergência de P02 limita a interpretação do resultado. Os escores originais foram preservados: nenhuma reavaliação posterior, alteração de rubrica ou terceira rodada ocorreu. O resultado continua sendo 18/20 versus 19/20 pelo protocolo formal.

## Exposição e revisão

O baseline conserva 172 entradas, com 35 perfis substantivos, 137 placeholders e 51 bindings, no SHA `8fe3b90b89932cf0cfd8f5ab02846a530dd0ad5f`. O enriquecido usa o snapshot congelado de 172 perfis substantivos e 188 bindings.

A rodada 1 teve leitura truncada e projeções incompletas; ficou **NOT_QUALIFIED**, preservada e sem pontuação primária. A rodada 2 reutilizou os mesmos briefs, rubricas e orçamento de saída, com dois geradores novos e isolados.

Cada gerador recebeu 20 cápsulas completas, uma por saída, com bytes, hashes, campos finais e marcadores conferidos. O reviewer independente recebeu 20 pares completos com rótulos A/B aleatórios, sem condições, protocolos ou respostas anteriores.

Foram conferidos 200 julgamentos, totais e critérios críticos. A revisão foi congelada antes de abrir o mapa de condições. Configuração dos três atores: `gpt-6.1-sol`, esforço `high`; o backend efetivo não foi verificado independentemente.

| Evidência | SHA-256 |
|---|---|
| Protocolo original | `148ebb6a51d4d5c1b09d3e72a2b0dbfb20490244703fccf88d56a3a250dbd70c` |
| Protocolo da rodada 2 | `692ffda4af8364f8fb170a6f8b38528845fc5eaf9babdd7e781b4a60bbab365c` |
| Exposição baseline | `c7e1f596f228054c0bbcb41dc101004a3513cc813acd7af459f0b621e49bbdeb` |
| Exposição enriquecido | `38380390a10cbaccbdd4dd5b7c2e92f1b16dee2c9be2b7aa1e1893263c6eb55a` |
| Exposição reviewer | `f08b409188338ca3ea64b19b8470f4e3d655a969647771cc411ee8362a8a3623` |
| Revisão independente | `0f032008226fd602cde68c9939474f2992a872a827f6caf92a82c5d0a8618dc2` |
| Resultados privados | `ecce043e74d2f005b922108de20959a67638d5397fe5df47153e3cbb5496267a` |

O JSON inclui os cinco hashes de entrada congelados e as demais evidências. Cápsulas, respostas, mapas e recibos completos permanecem em artefatos locais privados ignorados pelo Git; não integram este relatório público.

## Claude CLI e limites

Uma chamada pelo Claude CLI existente reportou `claude-sonnet-5-5`. Terminou com `error_max_budget_usd` e suprimiu a resposta; portanto, há observação de disponibilidade, mas falta comprovação de recepção e decisão da cápsula pelo Claude.

O teto solicitado foi US$ 0,05; o CLI reportou estimativa de preço de lista de US$ 0,213404. Essa estimativa não comprova faturamento. O teto foi verificado depois da chamada e não funcionou como limite prévio rígido.

O payload tinha 9.008 bytes, incluindo cápsula de 8.566 bytes/8.506 caracteres. O pedido agregado reportou 51.220 tokens de criação de cache. A atribuição exata às fontes de inicialização não está disponível; esse total também inclui o payload.

Hooks e descoberta normal permaneceram ativos; ferramentas e MCP estavam vazios. Não houve nova tentativa, nova chave, mudança de configuração ou chamada adicional ao Jev. Metadados de seis arquivos conhecidos foram consultados sem ler credenciais ou conteúdo das configurações.

A evidência demonstra decisões textuais delimitadas e revisão independente. Não estabelece expertise dos 172 agentes, comportamento de entregáveis renderizados, persistência, efeitos externos, substituição global de modelo ou ganho causal/estatístico. Nenhuma promoção foi aplicada.
