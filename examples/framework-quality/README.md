# SINAPSE — painel de evolução e exemplos próprios

`index.html` é a entrada SINAPSE em PT-BR. Explica o estado real, as prioridades, as cinco trilhas de entregáveis, as oito pendências, as 17 squads e os limites da evidência. Os quatro exemplos Lume permanecem na seção **Exemplos de teste**, com seus links e fontes preservados.

## Painel de evolução

Iniciar o servidor local de leitura com `node examples/framework-quality/serve.cjs --port=4179` e abrir `http://127.0.0.1:4179/`. O painel é navegação informativa: selecionar uma trilha não executa agentes, instala extensões ou publica mudanças.

`hub-data.json` é um snapshot versionado do checkpoint auditado de 02.10.2026. Contagens e estados precisam de readback antes de atualização; disponibilidade de modelo ou login não equivale a execução comprovada. As evidências aparecem na própria página, com localização dos registros como texto, sem links que escapem do servidor local.

O painel usa a lei monocromática do Brandbook SINAPSE: Bone/Vanta, tipografia com dois pesos, grain, layout assimétrico, foco visível e preferência de movimento reduzido. Sora, Inter e JetBrains Mono são usados se presentes no sistema; há fallback nativo e nenhum download de fonte.

Busca por squad/agente com normalização de acentos, limpeza e estado vazio; trilhas com seleção anunciada; squads/evidências em disclosures nativos acessíveis. Falha de carregamento conserva a visão geral e os exemplos, com retry limitado por timeout de cinco segundos.

QA do painel usa Playwright/Chromium já disponíveis, headless, sem instalação nem acesso externo:

```powershell
node examples/framework-quality/verify-hub.cjs --cycle=1
```

O script limita ciclos a 1–3, preserva evidência anterior, testa 1440/390/320px, busca/vazio/limpeza, seleção das cinco trilhas, expansão por teclado, âncoras e links locais, reduced-motion e erro/retry. Capturas e receipt ficam em `output/hub-cycle-N/`, ignorados pelo Git. O servidor de QA fica em loopback e é encerrado ao terminar.

Ciclo 1 do painel: 27 checks passaram em 12,124 segundos, sem falhas. Capturas desktop/390/320 foram produzidas; desktop e 390 foram vistos e a junção de duas frases no estado mobile foi corrigida em seguida.

Ciclo 2 do painel: 27 checks passaram em 10,336 segundos, sem falhas, com overflow zero em 1440/390/320px. A captura desktop completa e o viewport 390 foram vistos, incluindo a correção do texto mobile. [Receipt](output/hub-cycle-2/receipt.json). Evidência pertence aos hashes do snapshot registrado.

Ciclo 3: 27 checks funcionais passaram em 13,524 segundos. Após finalizar o dataset e corrigir dois títulos de autoria, readback separado conferiu métricas 35/51, três estados de distribuição, oito itens e seis evidências em 1440/390/320 com overflow zero. HTML/CSS/JS/verificador permanecem idênticos aos hashes do ciclo 3; dataset e capturas finais estão no receipt do readback, sem inferir que o ciclo 3 viu dados posteriores.

Estado vigente: 324/324 testes do framework, extensão pessoal de 35 funções/51 comandos instalada com hashes e configurações preservados. Entrada opt-in pela skill `sinapse-expert-runtime` em contexto novo; ativação nativa e publicação são etapas distintas. [Verificação operacional](../../docs/framework/expert-evolution-2026-10/operational-verification.md).

## Lume — fixtures próprias

Brief congelado: [AUDITED-SPEC](../../docs/framework/expert-evolution-2026-10/AUDITED-SPEC.md). Marca fictícia, tipografia do sistema, assets próprios e projetos em memória. Fonte editável; sem dependência instalada, dados de cliente, persistência ou publicação.

O índice SINAPSE oferece acesso ao painel e storyboard Lume. A receita de QA dos exemplos inicia servidor temporário exclusivamente em loopback e encerra browser/servidor ao terminar; headless, sem janela. O índice não significa aprovação visual.

## Receita nativa

Depois da liberação T02/T03 pelo orquestrador, usar Node e Playwright já disponíveis. Caso o pacote esteja no runtime compartilhado, definir `NODE_PATH` para o diretório `node_modules` desse runtime nesta sessão. Executar:

```powershell
node examples/framework-quality/verify.cjs --cycle=1
```

Até três ciclos, com 150 segundos por ciclo; nunca sobrescrever evidência anterior. Nenhuma chamada npm, instalação, download ou serviço externo está no script. Chromium deve estar previamente disponível.

Saídas ignoradas em `output/cycle-N/`: screenshots UI 1440/390/320, vazio/erro/diálogo, normal/reduced em WebM, snapshots finais, trace de ações e trace CPU. Receipt contém paths relativos e SHA-256; ambiente e exceções são declarados. WebM é captura browser, não master editorial.

## Execução observada

T02/T03 liberados pelo orquestrador. Ciclo 1 reproduziu perda temporária de foco do diálogo após Tab no último controle; a fonte agora mantém primeiro/último foco, Escape e retorno. Ciclo 2 passou comportamento, mas a coleta sem tarefas do renderer não comprovava performance. Ambos os outputs foram preservados.

Ciclo 3 final: 23 verificações locais passaram, com zero falhas registradas. UI e motion sem overflow a 1440/390/320; estados e teclado exercitados. Motion normal/reduced com interrupção, preferência alterada em runtime e dez ciclos por modo sem listener/animação/will-change residual. [Receipt final](output/cycle-3/receipt.json).

Chromium headless 151.0.7922.34, Windows, Node v24.19.0. Trace CPU: 2.625 tarefas do renderer, pico 6,105ms no normal; 1.627, pico 6,970ms no reduced; zero tarefas acima de 50ms nessa sequência. Não extrapolar para campo, hardware mobile ou FPS de display.

Capturas VP8 390×844 a 25fps de encoding: normal 6,8s e reduced 4,6s, sem áudio necessário para esta fixture de motion web. Contatos derivados a duas amostras por segundo facilitam revisão; não substituem observar o clip.

[Revisão independente de IA](../../docs/framework/expert-evolution-2026-10/audited-quality-review.md): UI e carrossel da tentativa 002 receberam 91/100. Motion recebeu 91 somente nas amostras/estados observados; áudio e reprodução contínua permanecem CONCERNS, e Reel não tem nota audiovisual total. Nenhuma aprovação humana ou expertise foi inferida.

## Estados exercitados

- UI: três projetos, busca, vazio, erro local determinístico (`ui/?scenario=error`), retry, detalhes, Escape, retorno de foco, tabulação no diálogo, alteração, desfazer e anúncio acessível.
- Motion: três passos por clique, pausa/continuação, próxima ação e reinício, estado final, mudança runtime de reduced-motion, dez ciclos de iniciar/interromper/desmontar sem animação ou listener ativo.
- Reflow: página 320/390/1440 sem rolagem lateral; título longo preservado. Reviewer independente observa composição e legibilidade nos pixels, com o brief e rubrica congelados.

Testes locais não comprovam métricas de campo, GPU mobile física ou certificação de acessibilidade. Reel e carrossel têm fontes editáveis e exportações reais em `output/media/attempt-002/`; os históricos da tentativa 001 foram preservados.

Preview dos quatro artefatos: `node examples/framework-quality/serve.cjs --port=4179`, em `http://127.0.0.1:4179/`. É um servidor local de leitura em loopback. Os exemplos editáveis estão no repositório; outputs, receipts e a biblioteca privada permanecem fora do pacote público.

Receipts de execução conservam os hashes de geração. Mudanças posteriores de documentação, comentários de globais de browser e vírgulas são registradas separadamente; quatro ASTs equivalentes e hashes atuais constam em `output/media/lint-amendment/receipt.json`. Fontes editáveis continuam sujeitas ao lint; somente outputs derivados estão excluídos.
