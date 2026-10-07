# Execução criativa delimitada

Fonte de verdade: [briefs congelados Lume](AUDITED-SPEC.md#briefs-congelados), story Ready `audited-evolution-20261002` e workflow validado. Aurora é exemplo anterior da auditoria, substituído pelo brief vigente. Nenhum padrão visual desta fixture é imposto aos clientes.

## T02 — contratos

CREATIVE-02 corrigido nas fontes dx-ui-designer, platform-aesthetic-director, animation-performance-engineer, content-engineer e dx-frontend-engineer. Paleta, preto puro, medida, grid, escala tipográfica, FPS, compositor, hook e duração recebem contexto, exceções, contraexemplos e medição; a11y/reflow/reduced-motion continuam requisitos. Consumo e SHA devem ser renovados pelo worker runtime.

## T07 — fontes anteriores ao render

[Lume editável](../../../examples/framework-quality/index.html), [receita](../../../examples/framework-quality/verify.cjs) e [contrato de receipt](../../../examples/framework-quality/receipt-template.json). UI e motion próprios com assets nativos; fontes preparadas sem render, conforme dependência T02/T03. Loop máximo de três ciclos e 150 segundos por ciclo.

UI cobre três projetos fictícios, busca/vazio, erro/retry em memória, diálogo, teclado, etapa/desfazer e anúncio. Motion define trigger/final, pause/interruption, preferência em runtime e cleanup; sua receita verifica dez ciclos.

## T04 — evidência local observada

T02/T03 liberados; três ciclos preservados. Primeiro: falha de Tab no diálogo reproduzida e corrigida. Segundo: comportamento passou, mas trace sem eventos de tarefas do renderer não media custo. Terceiro: coleta corrigida, 23 checks passaram sem falhas, em 14,098 segundos; [receipt](../../../examples/framework-quality/output/cycle-3/receipt.json).

UI: screenshot 1440/390/320 sem overflow, busca/vazio/error-retry, detalhes, Escape/foco/Tab, alteração/desfazer e anúncio. Motion: normal/reduced, pausa, next/reset durante transição, mudança de preferência em runtime e dez ciclos de lifecycle por modo com zero listeners/animações/will-change após desmontagem.

Trace renderer local: 2.625 tarefas/pico 6,105ms normal; 1.627/pico 6,970ms reduced; zero >50ms. Capturas WebM VP8 390×844 a 25fps de encoding (6,8s normal; 4,6s reduced), screenshots, trace CPU e trace browser com hashes. Autor observou screenshots e contato temporal; isso não é revisão independente nem nota 90.

Revisão independente do brief, composição, timing e acabamento permanece pendente. Ciclos 1/2 conservam suas falhas/limites e não são a evidência final. Outputs são locais e ignorados, não foram publicados.

## Critérios e limites

Reflow 1440/390/320; screenshot desktop/mobile e estados; normal/reduced com captura e trace delimitado. A rubrica congelada tem cinco dimensões de 20, alvo 90 e mínimo 15; autor não concede sua própria aprovação. Falhas críticas bloqueiam mesmo com estética alta.

Simulação local não comprova backend, RLS, persistência, conversão, CrUX ou GPU mobile real. Marca e mídia são próprias; nenhuma redistribuição de pixels Mobbin ou consumo de dados de cliente. Outputs ignorados e receipts relativos com hashes, sem PII ou paths pessoais.
