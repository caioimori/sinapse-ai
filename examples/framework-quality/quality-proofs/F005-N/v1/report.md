# F005-N — relatório de performance e acessibilidade

Escopo: fixture novo, sintético e autocontido; nenhuma aplicação de produção foi alterada. As tasks audit-animation-performance e ensure-animation-accessibility têm autoridade execute/exact-owner para Benchmark. Este artefato é input de avaliação, não implementação do projeto sem story validada. Nenhum Git, rede, instalação, build ou delegação foi utilizado.

## Entrega e fundamento

panel.html contém três movimentos finitos de 6.000 ms: escala do progresso, opacidade monotônica do indicador (0,75–1) e translação limitada a 48 px. Dados essenciais são texto estático: “100% concluído”, “Serviço disponível” e “Entrega concluída”. Seed fixo 5005, sem aleatoriedade ou imports. Não há shader, Three.js, partículas, WebGL ou assets externos; compilação/context loss/VRAM dessas tecnologias não são critérios executáveis deste renderer DOM.

R1: matchMedia acompanha a preferência em runtime. Reduced motion cancela o rAF, coloca progresso e opacidade no estado final e remove deslocamento ornamental. CSS oferece fallback sem JavaScript. A preferência restaurada mantém estado final até reinício explícito. Nenhuma ação depende de animationend. As mensagens de estado não são anunciadas a cada frame.

R2: o artefato registra ambiente do navegador, viewport, DPR, intervalos rAF, p50/p95/p99, picos >50 ms, aproximação de frames perdidos a 60 Hz e custo síncrono dos controles. Registros têm limites de 2.048 frames, 256 eventos e 256 interações por instância; a exportação representa essa janela. Isso não mede input latency completo, GPU ou render pipeline. O orçamento proposto, ainda não validado, é 60 Hz, p95 <=20 ms, p99 <=34 ms e investigação de qualquer pico >50 ms. Refresh físico deve ser declarado; recalibrar orçamento para outro refresh antes de medir. Nenhuma promessa universal de FPS.

R3: pausa por botão nativo, acessível por teclado, sem depender de hover. Retomar preserva tempo decorrido e zera a origem temporal para evitar saltos. Ao ocultar a página, pausa; retomada é explícita. Restart cancela o frame anterior. dispose é idempotente e cancela somente rAF/listeners da instância; o matchMedia e listeners emprestados continuam existindo. Não há timers, contextos ou timelines. pagehide desmonta o owner. O layout reserva áreas e o movimento usa transform/opacity; layout thrashing, CLS e GPU reais ainda não foram medidos.

R4: conteúdo e dados foram preservados. Nenhuma publicação externa, remoção, pagamento, credencial ou alteração de settings. Material autoral sintético, sem licença de mídia inferida. Primeiro record-exposure falhou por locator relativo duplicado; recuperação usou caminho absoluto e retornou recibo. Não houve fonte ausente ou truncamento na exposição.

## Execução observada

probe.cjs executou 20 ciclos (dez por viewport lógica 1440/390) em Node VM com DOM, clock e scheduler simulados. probe-receipt.json registra assertions completadas para pausa/retomada sem avanço durante pausa, conclusão finita, preferência alterada durante execução, restauração sem autoplay, pausa quando hidden, reinício e dispose duplicado. Inventário após cada ciclo: zero rAF e zero listeners próprios; listeners emprestados preservados. Valores 1440/390 no probe são parâmetros de simulação: não comprovam responsividade, GPU mobile, memória heap real, leitura visual ou performance de navegador.

## Prova que o root deve executar

Locator: examples/framework-quality/quality-proofs/F005-N/v1/panel.html. Abrir o arquivo sem build, no browser declarado pelo root, em 1440×900 e 390×844. Registrar SO, browser/versão, CPU/GPU, hardware real, DPR, refresh, energia e ferramentas; separadamente identificar emulação. Congelar orçamento conforme refresh antes de medir. Gravar playback integral e screenshots; conferir overflow via scrollWidth/clientWidth e leitura dos três textos em ambos os tamanhos.

Na mesma sequência e ambiente: idle 5 s; iniciar; após 2 s pausar por teclado; esperar 1 s; retomar até conclusão; reiniciar e alternar reduced-motion durante movimento; restaurar preferência (sem reinício automático); repetir. Capturar Performance trace com CPU/layout/paint/compositor/long tasks e exportar F005Panel.report() pelo botão “Mostrar medição”. Registrar first paint/LCP/CLS se ferramenta fornecer; ausência fica UNVERIFIED. Repetir dez setups/interrupts/disposes; comparar inventário, heap e listeners antes/depois, verificar callbacks tardios. Rodar também no dispositivo físico menos potente relevante; emulação não substitui prova da GPU.

Verificar pausa e estado final com teclado e leitor de tela; foco visível, ordem, nomes, anúncio único de fase, contraste durante a sequência e ausência de flashing. Observar ritmo completo e alternativa vestibular-safe. Vincular traces/exports/screenshots à SHA do panel.html, declarar gaps e divergências. Nenhum verdict de qualidade é atribuído neste relatório.

## Limites e prioridades

Alta: performance/trace em browser e dispositivo físico, reduced-motion renderizado e assistência por leitor de tela UNVERIFIED. Média: overflow/contraste/percepção/heap real UNVERIFIED. O probe confirma somente lógica delimitada, não certificação WCAG nem qualidade percebida.

Grounding: sources/eb758b1519555a2f6e32d1d7dd58974b6aa850c97a3a3ba88c4b4ad562a3e8b6.json (canônica); sources/9e8c63e458bf570024674bddd1a3ab10f1e6cd84246bbaefe2eb863f0a77c4e0.json e sources/2983d71d4ccda4781fffa163655b1c2d7014c8f991d97bd66f78afd2d0cb964d.json (tasks); generation-cases/F005-N.json (R1–R4). Targets universais das tasks e missão antiga do operational supplement são subordinados ao contrato canônico por ambiente. Contexto planned/READ/CANDIDATE, cobertura gap e validatedExpertise=false não estabelecem expertise validada; nenhum acesso a referências externas foi realizado.
