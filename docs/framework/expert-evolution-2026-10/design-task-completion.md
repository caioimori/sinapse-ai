# T08 — seis tarefas executáveis de design

As seis rejeições históricas do T03 agora têm workflows próprios, owners verificados e pointers canônicos explícitos. A cobertura passou de **29 funções/43 comandos** para **35 funções/51 comandos**, sem promoção de expertise. Os workflows foram escritos e revisados semanticamente; seus entregáveis ainda não foram produzidos nem avaliados.

| Função | Task nova na squad-design | Alias preservado | Critérios críticos |
|---|---|---|---|
| design-system | build-component | build | Reuso/API/tokens, interação/estados, desktop/390px |
| ux-designer | ux-create-wireframe | wireframe | Tarefa/evidência, estados/recuperação, reflow/handoff |
| cro-persuasion | create-cro-patterns | próprio slug | Claims íntegros, escolha/usabilidade, medição sem ganho presumido |
| platform-aesthetic-director | consult-canon | próprio slug | Procedência/acesso, mecanismo/exceção, autoridade downstream |
| premium-packaging-strategist | premium-packaging-brief | próprio slug | Encaixe/custo, consistência real, agência/primeiro uso |
| product-surface-director | design-product-surface | próprio slug | Tarefa/densidade, estados seguros, reflow/teclado/modos |

Cada tarefa está em `squads/squad-design/tasks/<slug>.md`, com frontmatter de task/owner, entradas, pré-condições, passos, saídas, critérios observáveis, caso negativo, máximo de três ciclos/duas tentativas e rollback que preserva edição concorrente. Cada agente declara o comando e o target em YAML; não houve inferência por título, palavras semelhantes ou posição de listas.

## Correções semânticas

- O router de build apontava para `squads/design/tasks/`; wireframe apontava para uma tarefa indisponível de development. Agora as duas missões declaram a tarefa da squad permitida, mantendo seus aliases. Outros routers legados não foram reescritos como se tivessem sido revisados.
- CRO rejeita escassez, preços, prova social e garantias sem fonte; o mapa especifica hipóteses e medição, sem atribuir aumento de conversão ao brief.
- Curadoria verifica corpus/acesso real. KBs citadas por nome não foram encontradas sob squad-design; são pré-condições verificáveis, não arquivos ou leituras inventados. Fonte inacessível produz lacuna explícita.
- Packaging trata craft, fricção e preço 3x como hipóteses contextuais. Preserva skip/retorno pertinentes e rejeita fricção artificial, ganho econômico presumido e surfaces inexistentes.
- Product surface condiciona densidade, KPI hero e modos ao brief; desenhar acesso negado não implementa nem prova auth/RLS. Wireframe/brief estático não certifica runtime, AT ou dispositivos físicos.

## Evidência desta execução

**76 testes passaram em quatro suites**, cobrindo os oito comandos e aliases, todos os critérios em contexto compacto, owner/task/hash, rejeição de outro owner, ausência de fallback editorial para SQL e preservação dos bindings anteriores. ESLint e diff-check dos arquivos desta frente passaram.

Os schemas de expertise e bindings passaram; os **172 agentes** foram resolvidos contra suas fontes. As rotas **interface, motion, Reel, carrossel e anúncio** continuam resolvendo. Os seis contextos completos cabem em 3.000 caracteres; o maior observado foi 2.562.

O receipt e o Markdown T03 foram preservados por hash, assim como os 43 bindings e os 29 perfis anteriormente revisados. Os 90 registros de fonte continuam idênticos: **2 READ/88 CANDIDATE**. Os candidatos históricos dos seis agentes continuam candidatos; 137 perfis ainda não possuem contrato principal revisado.

## Pendências

A execução dos seis workflows, aquisição de fontes específicas, avaliação independente positiva/negativa e promoção de expertise permanecem pendentes. Outros comandos destas funções continuam fora da revisão. Regeneração de adapters/registry e segundo readback da instalação pessoal pertencem à integração da raiz.

O detalhamento de entradas, saídas, casos negativos, critérios, hashes anteriores/atuais e preservação está em [design-task-completion.json](design-task-completion.json). O T03 registra o estado histórico; este T08 documenta a conclusão posterior das seis lacunas, sem reescrever o receipt anterior.
