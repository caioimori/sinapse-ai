# Pesquisa prioritária — evolução 2026-10

O pacote recomenda especialização por decisões observáveis, com marca autorizada do cliente, acessibilidade e desempenho como critérios anteriores ao acabamento. São 32 registros de fontes efetivamente lidas, 45 heurísticas inferidas e 10 casos reservados; não há promoção de agentes a `verified`.

| Frente | Evidência lida | Aplicação e limite |
|---|---|---|
| Sistema e layout | DTCG 2025.10, Brad Frost, Every Layout, Matthew Butterick | Tokens tipados e biblioteca testada em conteúdo real; marca do cliente governa escolhas. Relatório DTCG não é W3C Standard. |
| Interação | Don Norman, Jakob Nielsen, WAI APG/WCAG e Mobbin | Pistas, estados e progressão dependem do contexto; padrões não substituem testes por teclado e tecnologia assistiva. |
| Frontend | Documentação oficial React/Next.js, INP e Jake Archibald | Fronteiras e sincronização devem ter motivo; desempenho medido no ambiente real. Artigo de 2015 não comprova bugs atuais. |
| Motion | Josh Comeau, web.dev, MDN, Motion, GSAP e Three.js | Preferências, custo de renderização e ownership de recursos têm critérios separados; exemplos não fixam duração ou FPS universal. |
| Vídeo e conteúdo | Adobe com Hiroshi Hara/Mike Leonard, WAI, YouTube e TikTok Ads | Correspondência entre fala, plano e produto, legenda revisada e interpretação contextual de retenção; orientação publicitária não vira lei de Reels orgânicos. |

Índice completo com URL, locator, trecho mínimo, claims, licença e hashes: [priority-pack.json](../../../research/expert-evolution/priority-pack.json). Cada heurística inclui missão, condição, ação, justificativa, exceção, contraexemplo, competências, tags e consumidores reais. Os 13 consumidores foram confrontados com o corpus canônico; não representam cobertura das demais squads.

## Mobbin: acesso e escopo observado

A conexão oficial autenticada foi operada pelo orquestrador. Este pesquisador inspecionou nove imagens nativas; recibos saneados estão em `research/expert-evolution/mobbin-*-receipt.json`. Nenhuma prévia premium foi copiada para o repositório.

| Registro canônico | Leitura visual |
|---|---|
| [Browserbase](https://mobbin.com/screens/751c482f-9ff7-4fec-9a57-db1422cfd3a6) | Uma tela de tabela; critérios ativos e recuperação da consulta. |
| [DoorDash Merchant](https://mobbin.com/screens/5b7f8ac3-1059-401f-a3ee-88e553391166) | Uma tela de campanhas; estados e escopo de ações. |
| [Square](https://mobbin.com/screens/e89ef674-df07-4351-901a-7ca09689a46e) | Uma tela de pagamento; restrição associada a pré-requisito. |
| [GetYourGuide](https://mobbin.com/screens/344b84fb-4aa5-45c6-9d32-38fa6f94a1aa) | Uma tela de checkout; decisão e revisão do pedido. |
| [Ahead](https://mobbin.com/flows/3ae2e6e9-0ad0-4cf8-b496-e511d37d9939) | Somente posições 1, 6, 12, 17 e 22 de 22; propósito e escolhas de onboarding. |

Capturas estáticas não comprovam teclado, backend, privacidade, acessibilidade, scoring, eficácia ou comportamento móvel. A busca de checkout não revelou erros inline; não preenche essa lacuna. Temporizadores e percentuais observados exigem fundamento próprio antes de qualquer adoção. Ausência de aviso de uso de IA não concede licença ampla.

## Avaliação e lacunas

[priority-cases.json](../../../research/expert-evolution/priority-cases.json) foi reservado antes da extração. Horário exato não foi capturado; a data não inventa precisão. Decisões esperadas e contraexemplos permanecem congelados. O mapeamento `actualEvidenceSourceIds` corrige referências candidatas sem mudar o desafio.

Os dez casos foram executados depois da reserva por dois agentes nativos Sol 6.1 separados, com critérios ocultos dos executores. A revisão independente com rótulos aleatórios atribuiu 18/20 ao contexto anterior e 20/20 ao enriquecido; nove preferências e um empate. [Resultados](../../../research/expert-evolution/benchmark-results.json).

Essa comparação cobre decisões escritas, uma geração por caso e versão. Não mede interfaces renderizadas, vídeos, efeito causal ou todas as competências; a especificidade pode revelar a variante apesar dos rótulos ocultos. Nenhum agente foi promovido a especialista validado.

Val Head e Walter Murch permanecem candidatos; nenhuma obra inacessível foi atribuída como lida. Caminhos GOV.UK não retornaram conteúdo útil. A prioridade SINAPSE foi tratada como contexto de marca, sem aplicar identidade SINAPSE a clientes de outra marca; seu brandbook não era necessário a este recorte.

As regras Mobbin substituíram quatro critérios redundantes de confiança da pista, timings, retorno de live region e disclosure; os fundamentos sobrevivem nos critérios mais específicos e nas fontes. O alvo de 20–30 fontes foi excedido em dois registros para preservar proveniência distinta das cinco observações autenticadas.

A frente de pesquisa não executou instalação, gasto ou publicação. Iterações: quatro de cinco; até duas tentativas por fonte. Na integração posterior, o pacote foi incorporado ao corpus validado: 67 fontes e 112 regras, mantendo os 172 agentes como `coverage=gap`.
