# Editor de contrato · contrato de interface

Status: especificação local para implementação; nenhuma tela implementada ou verificada neste entregável. Story: `docs/stories/individual-expertise-upgrade-20261007.story.md`, Ready. Autoridade desta entrega: `dx-design-system-architect`, contrato de componentes. Implementação e QA: `dx-frontend-engineer`, roteado pelo coordenador. Máximo: três ciclos de correção.

## Resultado e fronteira

Construir uma demonstração original, estática, em PT-BR, exclusivamente nesta pasta, sem dependências novas, alterações em runtime/painel/root ou publicação. Objetivo: editar campos tipados e entender o contrato JSON gerado. Dados sintéticos; estado da sessão, sem promessa de salvar, persistir ou executar um agente.

Referências locais observadas: `../shared.css` e `../transfer-filter/index.html`. Seguir HTML/CSS/JavaScript nativos, fonte Segoe UI/sistema, espaçamento econômico, hierarquia discreta e marca textual SINAPSE. Sobrescrever tokens somente nesta pasta para tema monocromático: papel `#f5f5f0`, superfície `#fff`, texto `#141713`, secundário `#62665f`, linha `#d9ddd4`, ação/foco `#141713`, raio 6px. Validar contraste real; erro precisa texto e símbolo, além da aparência.

## Mecanismos DRAFT e limites da referência

Referência privada: `../output/expertise-20261007/mobbin/research-notes.json`, Browserbase, fluxo `348554f8-4ed0-4e8f-8625-b6ae66348e20`, posições 1–10. Status DRAFT_PENDING_INDEPENDENT_REVIEW; não reutilizar assets, screenshots, código capturado ou branding.

| Mecanismo candidato | Aplicação original | Contraexemplo vetado |
| --- | --- | --- |
| separate-identifier-from-description | Controles independentes “Chave” e “Descrição”; mostrar onde a chave aparece em `properties` | Digitar descrição “title” e renomear silenciosamente uma chave existente |
| scoped-recursive-contract-preview | Cada objeto tem campos próprios; lista possui um editor separado “Tipo dos itens”; preview único deriva da árvore | Campos de um item-object aparecerem no objeto raiz |
| explicit-required-semantics | Checkbox “Obrigatório” associado ao objeto que contém o campo, acompanhado do JSON efetivo | Aparência de um toggle provar `required` sem inspeção do JSON |

A referência não comprovou teclado, mobile, backend, persistência nem recuperação. As decisões abaixo são contratos originais a testar, não comportamento atribuído à aplicação referenciada.

## Modelo e API dos componentes

Uma árvore em memória é a autoridade. `ContractEditor` recebe a árvore inicial; ações retornam nova árvore e intenção de foco. `FieldEditor` recebe nó, escopo, profundidade e erros. `ObjectScope` recebe filhos; `ArrayItemsEditor` recebe um único nó de itens. `ContractPreview` recebe somente resultado derivado e validade; não mantém um editor paralelo mutável.

Nó de campo: ID interno estável, chave textual, descrição, tipo e flag obrigatório; nó de objeto contém filhos; nó de lista contém nó de itens sem chave/flag obrigatório próprios. Tipos: string, number, integer, boolean, object, array. IDs internos e histórico não são emitidos. Não restringir chaves a identificadores JavaScript: JSON admite chaves textuais.

Raiz sempre objeto. Emitir `$schema: https://json-schema.org/draft/2020-12/schema`, `type`, `properties`; `required` fica no objeto que contém cada campo, somente com chaves marcadas. Omitir lista vazia de required. Descrição não vazia vai no schema do próprio nó. Array emite `items` com o schema dos itens, inclusive objeto ou array. Não emitir `additionalProperties:false` automaticamente: a demonstração não oferece política de campos extras.

Exemplo sintético obrigatório: `participantes` array obrigatório no root; seus itens são objetos com `nome` string obrigatório. Esperado: root.required contém participantes; participantes.items.required contém nome; root.properties não contém nome. Array obrigatório não implica ter um item: não inventar `minItems`.

Serialização recursiva deve evitar poluição de protótipo: construir dicionários seguros e usar serializador JSON; chaves como `__proto__` precisam sobreviver como propriedades próprias. Inserir conteúdo em controles/texto, nunca como HTML interpretado.

## Validação, histórico e estados

Adicionar gera chave única no escopo, por exemplo campo_1. Descrição nunca altera chave. Chave vazia/branca é erro do produto; não normalizar/trimar silenciosamente chaves válidas. Duplicata é igualdade exata entre irmãos; chaves iguais em escopos distintos são permitidas. Preservar todos os rascunhos com erro, mostrar mensagem ligada ao controle, sem sobrescrever o irmão nem descartar entrada.

Em erro, o único preview conserva o último contrato válido com aviso explícito “Último contrato válido; corrija os campos para atualizar”. Copiar fica indisponível com motivo visível. Ao corrigir, atualizar preview imediatamente. Estado vazio gera objeto com properties vazio; não exibir sucesso de salvamento.

Profundidade máxima do produto: 4, raiz em 0; cada aresta campo-de-objeto ou items-de-array incrementa 1. Um nó em 4 pode ser primitivo ou objeto vazio; não pode criar filho/itens em 5. Mostrar motivo no controle indisponível. Não permitir selecionar array onde seus itens obrigatórios excederiam o limite. Limite é convenção desta demo, não limite de JSON Schema.

Remover campo e limpar contrato devem ter Desfazer acessível, restaurando subtree, ordem, flags e descrições. Guardar pelo menos a última ação destrutiva; permanecer disponível até outra mutação estrutural, sem expiração temporal. Alteração de tipo que descarte filhos precisa igualmente ser reversível. Desfazer restaura também o destino lógico de foco. Não restaurar somente o JSON deixando editor divergente.

## Percurso, foco e layout

Desktop: título curto, ações contextuais, editor principal e preview lateral. Mobile: editor e preview empilhados, mesma informação e ações. Escopos usam legenda textual e caminho como participantes / itens; limitar indentação em telas estreitas. Elementos flex/grid com min-width zero; textos e JSON longos quebram linha. Não ocultar overflow para encobrir largura inadequada.

Inputs têm labels persistentes; tipos usam select nativo; obrigatório checkbox; ações buttons. Add foca nova chave. Remover foca próximo irmão, anterior ou Adicionar do mesmo escopo. Limpar foca Adicionar raiz; Desfazer restaura chave removida ou âncora lógica. Edição comum não rouba foco nem recria o controle ativo a cada caractere. Ordem DOM acompanha leitura visual.

Anunciar inclusão/remoção/desfazer em região polite, uma mensagem por ação. Erros usam aria-invalid e aria-describedby, sem anúncio repetitivo por tecla. Estado de cópia depende do resultado real da Clipboard API: sucesso observado ou mensagem recuperável de falha com seleção manual do preview. Não introduzir diálogo sem necessidade. Foco permanece visível, sem obstrução por feedback; controles de ação com alvo de 44px como decisão do produto. Sem animação obrigatória; reduced motion preserva todas as funções.

## Evidência exigida da implementação

| Caso focal real | Asserção |
| --- | --- |
| Alterar descrição de campo | Chave e caminho emitidos permanecem idênticos |
| Raiz + lista de objetos + campo obrigatório | Escopo de properties/items/required exato, JSON parseável |
| Dois irmãos duplicados, corrigir um | Entrada preservada; preview claramente anterior; cópia bloqueada; recuperação atualiza |
| Mesma chave em dois objetos; chave __proto__ | Sem falso conflito, perda ou poluição de protótipo |
| Limite em 4 e tentativa em 5 | Operação recusada com motivo; árvore/preview preservados |
| Remover subtree, Desfazer; limpar, Desfazer | Dados, ordem e obrigatório restaurados; foco observado |
| Percurso somente teclado | Add/edit/type/required/remove/undo/copy alcançáveis, sem perda de foco por digitação |
| Clipboard rejeita | Mensagem de erro real; nenhum feedback de sucesso falso |
| Screenshots headless 390 e 1440 | Editor, JSON e erro/undo legíveis; scrollWidth <= clientWidth no documento |

QA tooling existente pode ser copiado/adaptado somente nesta pasta. Registrar comando, resultado e screenshots locais; não controlar o browser CUA compartilhado. Build ou teste de modelo não substitui conferência visual. Não afirmar conformidade WCAG completa, melhor usabilidade ou operação no produto real a partir desta demo.

## Fontes oficiais delimitadas

Leituras observadas em 07/10/2026; paráfrases próprias, sem reprodução integral. [JSON Schema object](https://json-schema.org/understanding-json-schema/reference/object), Properties e Required Properties: properties não exige presença; required lista chaves únicas do objeto. [JSON Schema array](https://json-schema.org/understanding-json-schema/reference/array), Items: uma schema em items descreve cada item da lista. Evidência com locators e SHA: `../output/expertise-20261007/creative/ui-schema-reading.json`.

Foco/alvos: [WCAG 2.2](https://www.w3.org/TR/WCAG22/), 2.4.3/2.4.11/2.5.7/2.5.8, leitura privada em `creative/sources/wcag.json`; 44px é escolha deste produto, não declaração do limiar AA. Erros: [GOV.UK Error summary](https://design-system.service.gov.uk/components/error-summary/), ligação entre resumo e controles, em `creative/sources/errors.json`. Demais fonte/apresentação/estado são convenções originais a verificar no fixture local.
