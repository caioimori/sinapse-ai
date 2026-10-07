# Animation Brief — F004-N

Status: contrato de interpretação produzido; implementação, experiência percebida e qualidade em dispositivos UNVERIFIED. Sem código de domínio, build, render ou efeitos externos.

## Contexto e pedido original [R1]
Interface de consulta de assinatura. Objetivo: revelar o preço sob ação explícita do usuário, com resposta breve e reversível. Indústria específica, audiência, identidade visual e conteúdo do preço não foram fornecidos.

Pedido fornecido, transcrito sem reinterpretar os fatos: “Referência descrita: cartãoexpande apósclique e revela preço; abertura180ms,fecho120ms. Interfaceconsultaassinatura; orçamento CSSsemWebGL; ícones próprios. Produzir brief com estados,trigger,executor e alternativa reduzida.”

Fonte factual: generation-cases/F004-N.json, case.facts e case.brief. Referência apenas DESCRITA; nenhum vídeo, URL ou produto foi observado. Não há medição independente dos 180/120 ms: são requisitos fornecidos.

Intent: interação de abertura/fechamento de cartão; elemento alvo: cartão de consulta de assinatura e painel de preço; trigger: ativação explícita; estado final aberto: preço legível; fechado: resumo e botão de consulta disponíveis. Feeling inferido: clareza e discrição. Não inferir luxo, câmera, bounce, partículas nem cenários de compra.

## Fato versus proposta [R1]
| Item | Origem/status |
|---|---|
| Clique expande cartão e revela preço | Fato fornecido; referência externa UNVERIFIED |
| Abertura 180 ms; fecho 120 ms | Fato fornecido, ciclos completos |
| CSS, sem WebGL, ícones próprios | Restrições fornecidas; uso sintético autorizado |
| Fechar pelo mesmo botão; Enter/Espaço | Proposta funcional reversível para simetria e teclado |
| Curvas, superfície escalada, reserva de espaço e estados intermediários | Hipóteses de execução; não parâmetros medidos da referência |
| Variante reduzida instantânea e mesma informação | Proposta de acessibilidade exigida pelo brief |

## Descrição visual e estados [R2]
Propõe-se reservar desde o início a área máxima do cartão, para expandir sua superfície visual sem animar o fluxo da página. Somente a superfície decorativa cresce verticalmente; texto, preço, ícone e botão não recebem escala. A reserva de espaço é um trade-off explícito: confirmar o desenho com o executor. Se for obrigatório recolher fisicamente o espaço e deslocar cartões vizinhos, interromper este contrato e revisar a técnica; não fingir equivalência.

Hc = altura da superfície fechada definida pelo conteúdo/resumo; He = altura aberta definida pelo conteúdo/resumo + preço. Hc e He não são valores inventados: dependem de layout e conteúdo reais. r = Hc/He, com 0 < r <= 1. Superfície decorativa ocupa He, origem de transformação no topo, scaleY(r) fechado e scaleY(1) aberto. O espaço final é reservado e o preço não deve sofrer recorte. Mudança de tamanho de tela deve recalcular medidas em estado estático, sem loop de layout por frame.

| Estado | Superfície | Painel de preço | Controle |
|---|---|---|---|
| Fechado | scaleY(r), opacity 1 | opacity 0; oculto semanticamente; sem alvos focáveis | Botão com nome claro, aria-expanded=false |
| Abrindo | scaleY atual → 1 | Tornar disponível e interpolar opacity atual → 1 | aria-expanded=true; foco permanece no botão |
| Aberto | scaleY(1), opacity 1 | opacity 1; preço integralmente legível e disponível | aria-expanded=true; ação de fechar |
| Fechando | scaleY atual → r | opacity atual → 0; ocultar semanticamente ao iniciar o fecho | aria-expanded=false; ação de abrir |

Abrindo, T=0: ativação por botão; disponibilizar painel e iniciar transform e opacity simultaneamente. T=0–180 ms: expansão visual e fade síncronos, sem atraso. T=180 ms: superfície e preço no estado aberto, sem movimento residual.

Fechando, T=0–120 ms: superfície retrai e preço perde opacidade, sem atraso; T=120 ms: garantir estado fechado e nenhuma informação invisível acessível ou focável. Se o foco estiver dentro do painel antes de fechá-lo, restaurar ao botão antes da ocultação. Não desabilitar o botão durante as transições.

## Parâmetros técnicos e interrupções [R2]
| Canal | From → to | Duração integral | Easing proposto | Delay |
|---|---|---|---|---|
| Abertura decorativa | scaleY(r) → scaleY(1) | 180 ms | cubic-bezier(0,0,0.2,1) | 0 ms |
| Preço na abertura | opacity 0 → 1 | 180 ms | cubic-bezier(0,0,0.2,1) | 0 ms |
| Fecho decorativo | scaleY(1) → scaleY(r) | 120 ms | cubic-bezier(0.4,0,1,1) | 0 ms |
| Preço no fecho | opacity 1 → 0 | 120 ms | cubic-bezier(0.4,0,1,1) | 0 ms |

Curvas são propostas, não fatos da referência. Propriedades animadas permitidas: somente transform e opacity. Proibido interpolar height, width, top, left, margin, filtro, blur ou cor. Sem spring, overshoot, loop, stagger ou autoplay.

Ativação repetida durante movimento troca imediatamente o estado desejado. Cancelar a chegada antiga; continuar a partir dos valores visuais atuais, sem salto, sem fila e sem callback antigo reocultando painel já reaberto. Contrato temporal escolhido: cada retarget usa 180 ms rumo a aberto ou 120 ms rumo a fechado, contados a partir da nova ativação; ciclos completos mantêm os tempos fornecidos. Se o mecanismo CSS encurtar automaticamente uma reversão, documentar e conferir a política com o executor; a referência não forneceu tempos para interrupções.

Ao desmontar componente, cancelar trabalho pendente e limpar listeners. Na troca de preferência de movimento para reduce, aplicar imediatamente o estado final desejado e cancelar animação em curso. Sem atraso de rede artificial: o preço deve estar disponível antes da revelação. Se faltar, preservar a mensagem real de carregamento/erro; não mostrar preço fictício.

## Alternativa reduzida e acessibilidade [R2]
Com prefers-reduced-motion: reduce, duração e atraso 0 ms; sem expansão interpolada, fade ou deslocamento. Mesmo botão, mesmo resumo, mesmo preço e mesmos estados semânticos; a abertura e o fecho apenas trocam o estado final. Ausência de CSS/animação deve preservar a consulta via fluxo funcional padrão.

Usar botão nativo com aria-controls apontando o painel e aria-expanded coerente; Enter/Espaço equivalem ao clique. Ícones decorativos não substituem nome acessível. Foco visível em todos os estados. Evitar anúncios duplicados e aria-live sem necessidade. Exigir leitura legível e contraste de texto normal de pelo menos 4.5:1; contraste, leitura por AT e ausência de recorte permanecem UNVERIFIED até execução.

## Tecnologia, executor e autoridade [R3]
Tecnologia proposta: transições CSS com estado funcional do componente hospedeiro. Sem WebGL/Three.js, bibliotecas de animação novas, GSAP/Lenis ou engine paralela; nenhuma instalação realizada. Complexidade estimada LOW para motion, condicionada a conteúdo e layout disponíveis; não há estimativa de esforço validada.

Task executada aqui: build-animation-brief, owner animation-interpreter, execução autorizada em generation-cases/F004-N.json, case.taskSpecs[0], e contexts/animation-interpreter.json, operational.task.authority. Fonte integral: squads/squad-animations/tasks/build-animation-brief.md, SHA256 5ac04bc978e17b0e1caa3b41126ae71470a4f487d5e26bcedd387659be06a15f.

Encaminhamento proposto: animations-orqx recebe este brief; css-motion-artist executa CSS/SVG conforme squads/squad-animations/agents/animation-interpreter.md, seção Delegacao. Não foi delegado nem executado código neste ensaio. A exposição NÃO contém uma task de implementação de cartão atribuída a css-motion-artist; task de execução específica permanece UNRESOLVED e bloqueia implementação até resolução canônica pelo root. Não reutilizar build-text-animation para um cartão nem inventar comando. animation-performance-engineer é rota declarada para revisão de performance; nenhuma auditoria foi executada. audit-animation-performance é nome declarado na task, sem target/owner completo exposto.

## Dependências, assets e orçamento [R3]
Obrigatórios antes de implementar: task/autoridade específica do executor; componente hospedeiro e interação funcional; conteúdo de preço real autorizado; medidas e layout Hc/He; tokens/brand existentes, se disponíveis. A task recomenda create-animation-system para tokens, mas seu owner/target não está exposto: dependência de descoberta, sem execução. Não criar sistema global para uma interação isolada sem decisão própria.

Assets: somente ícones próprios fornecidos conceitualmente; todos os dados/fontes do fixture são sintéticos e de uso autorizado pelo caso. Arquivos concretos de ícones, formato e dimensões não foram expostos. Não importar mídia externa nem alegar inspeção/licença individual não observada. Modelo 3D, textura, ruído e fonte nova dispensados.

Orçamento declarado: CSS, zero WebGL, sem assets externos novos; até dois canais animados simultâneos (superfície e preço). Metas propostas: 60 fps desktop, 30+ fps mobile, nenhum trabalho de main thread >50 ms; evitar mudança de layout por frame e deslocamento de vizinhos mediante reserva de espaço. São metas, não medições. Draw calls e memória de textura WebGL: não aplicáveis. Bytes finais, CLS/LCP e fluidez não medidos.

## Evidência e provas pendentes [R1–R3]
Grounding: fatos rastreados ao fixture; parâmetros adicionais declarados hipóteses; papel e task rastreados às fontes congeladas. Contexto de expertise em contexts/animation-interpreter.json tem status planned, validatedExpertise=false e gaps explícitos: não equivale a especialização validada nem benchmark causal.

Execução observada: produção deste arquivo de brief e registro de exposição/output. Nenhum runtime de animação solicitado pelo artifactExecutionPlan (lista vazia); nenhuma implementação ou render produzido. Qualidade de domínio/percepção permanece UNVERIFIED.

Provas a executar pelo root após resolver implementação: walkthrough fechado/aberto e comparação dos canais; clique, Enter/Espaço; retarget em metade do ciclo e clique rápido repetido sem saltos/callback antigo; fechar com foco interno; preferência reduce inicial e alterada em movimento; desmontagem; preço longo e quebra de linha; screenshots 390/1440 px sem overflow; leitor de tela e contraste; captura temporal e perfil de frame/main thread em dispositivos reais. Registrar locator, dispositivo e resultado observado por requisito; sem prova ausente chamada PASS.

Locator deste contrato: examples/framework-quality/quality-proofs/F004-N/v1/animation-brief.md. Implementação permanece bloqueada nas dependências enumeradas, sem efeito em produção/envio/pagamento/publicação externa/remoção.
