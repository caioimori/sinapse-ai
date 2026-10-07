# F002-N — Heurísticas fundamentadas, rascunho sintético

## Escopo e proveniência
Entregável: generate-agent-heuristics. Responsável: agent-forger. A fonte declarada `squads/squad-cloning/tasks/generate-agent-heuristics.md` tem owner agent-forger e autoridade execute no caso. Não há execução de SOP nem criação de agent.md completo.

Fatos disponíveis (paráfrases do briefing; não são transcrições das fontes originais):
- A1: descreve conferir pedido.
- A2: descreve pausar quando falta código.
Locator de ambos: `generation-cases/F002-N.json`, `case.facts` e `case.brief`. As descrições são sintéticas, não provam comportamento de uma pessoa real.

## H1 — Conferir pedido
- Trigger: recebimento de um pedido a processar. [INFERÊNCIA: o momento não foi fornecido por A1.]
- Action: conferir o pedido. [FATO FORNECIDO: A1.]
- Rationale: uma conferência anterior ao processamento pode identificar informação insuficiente. [INFERÊNCIA DERIVADA, sem eficácia comprovada.]
- Confiança: ação sustentada pela descrição A1; trigger e rationale provisórios, sem percentual calibrado.
- Limite/contraexemplo proposto: A1 não especifica campos, critérios de aceite ou se a conferência ocorre antes ou depois. Não interpretar esta regra como autorização para aprovar pedido, alterar dados ou dispensar revisão.
- Validação futura: obter trecho integral de A1 e identificar contexto, momento e critério de conferência; retirar ou ajustar inferências que não se sustentem.

## H2 — Pausar se faltar código
- Trigger: código ausente. [FATO FORNECIDO: A2.]
- Action: pausar o processamento. [FATO FORNECIDO: A2.]
- Rationale: a ausência de código é uma condição de interrupção. [CONCLUSÃO DERIVADA de A2; não afirma motivo psicológico.]
- Confiança: associação condição→ação sustentada pela descrição A2; não há demonstração independente.
- Limite/contraexemplo proposto: código presente não comprova validade nem autoriza retomar automaticamente. A2 não define tipo de código, correção, comunicação, responsável ou condição de retomada.
- Validação futura: obter trecho integral de A2 e confirmar os limites de aplicação. Até lá, não inventar código nem regra de retomada.

## Camadas ausentes e tier gate
Camada emocional: AUSENTE / UNVERIFIED. Não atribuir sentimentos, motivação, personalidade, voz, biografia ou experiência. Os demais modelos mentais e workflows completos também não foram fornecidos. Estas regras representam fatos sintéticos e inferências, não personificação.
Não foi recebido cognitive-profile.md, tier ou método de confiança. Não declarar >=75%, Tier 2 ou fidelidade validada; geração de clone/agent.md completo permanece bloqueada pelo gate canônico. Entrega limitada às heurísticas da tarefa autorizada.

## Vínculo operacional solicitado
Destino indicado no briefing: `extract-grounded-sop`. Sua existência é um fato declarado pelo caso, mas nenhum caminho, conteúdo de task, owner ou resolução desse comando foi exposto. Status: DECLARADO / RESOLUÇÃO UNVERIFIED. Não criar comando executável, path ou autoridade por suposição, nem executar essa tarefa.
Contrato pendente para o root: localizar e expor a task real por mecanismo autorizado, confirmar owner e entradas; só então encaminhar estas heurísticas ao responsável. Aqui não ocorreu delegação nem execução desse domínio.

## Evidência e limites
R1: inferências marcadas em H1/H2. R2: camada emocional ausente preservada. R3: generate-agent-heuristics está declarada na fonte integral; vínculo extract-grounded-sop não resolvido. R4: nenhuma pessoa foi impersonada.
Grounding: limitado aos fatos sintéticos e às fontes expostas. Execução observada: criação deste documento pelo ledger, com hash e bytes. Qualidade de domínio, fidelidade comportamental e aceitação por squad-assembler: UNVERIFIED, requerem revisão independente. Contexto suplementar está planned, validatedExpertise=false; não constitui expertise comprovada. Dispositivo, percepção, build e AT: não executados; nenhum resultado positivo atribuído.