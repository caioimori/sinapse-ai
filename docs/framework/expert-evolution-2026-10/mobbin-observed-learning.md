# Consolidação observada — escopo vigente

Oito mecanismos foram revisados e consolidados como inferências na biblioteca privada do projeto. Seis são curadoria visual das capturas; dois têm transferência experimental na interface própria. As rejeições iniciais das capturas foram preservadas. Nenhum agente foi promovido a especialista.

A interface própria passou em 66 verificações do autor e 54 independentes, em 1440/390/320px. Inclusão, exclusão, múltiplos valores, cancelamento, recuperação de vazio e foco foram exercitados. Backend, produto original e ganho causal permanecem sem prova.

Cinco comandos recebem regras pertinentes; máximo 10.082/12.000 caracteres. Use o helper deste worktree para essa biblioteca. A extensão pessoal recebeu a política documental; capturas e overlay privados não são copiados para HOME ou npm.

[Verificação desta onda](typesafe-mobbin-verification.md) · [Interface própria](http://127.0.0.1:4179/transfer-filter/).

---

## Notas de aquisição anteriores — fatos, hipóteses e limites preservados

# Aprendizado observado de UI, UX e navegação

**Estado: oito mecanismos candidatos; nenhuma competência promovida.** Foram inspecionadas as 22 imagens de dois fluxos no viewer autenticado. A evidência é a ordem editorial de imagens, com locators e hashes privados; não é execução de controles do produto original.

As notas próprias foram separadas dos pixels protegidos. Capturas e descrições detalhadas ficam ignoradas; este documento preserva regras generalizadas e links canônicos. A autorização de acesso não foi tratada como direito de redistribuir mídia.

| Mecanismo candidato | Ação proposta | Primeiro critério crítico, ainda não testado |
| --- | --- | --- |
| Filtro contextual com orientação preservada | Manter a lista e a posição de navegação identificáveis; abrir um painel de filtros com título, retorno entre dimensões e forma explícita de sair. Definir separadamente o comportamento de reflow e foco. | A saída do painel devolve foco ao controle que o abriu e conserva a rota definida. |
| Controle coerente com o predicado | Usar controles com cardinalidade explícita: checkboxes para conjunto, radio buttons para alternativa exclusiva e operador separado do valor para comparação. Especificar o significado de opção ampla, ausência de valor e combinação entre dimensões. | A consulta determinística reproduz a cardinalidade definida; nenhuma regra comercial é inferida da referência. |
| Aplicação explícita quando há escolhas pendentes | Separar estado em edição de estado aplicado, expor ação de aplicação e especificar saída, cancelamento e retorno. Só declarar aplicado quando o resultado realmente refletir o estado confirmado. | Teste próprio distingue estado draft e aplicado, inclusive cancelamento e fechamento. |
| Resumo rastreável do refinamento atual | Expor resumos legíveis das dimensões frequentes e um resumo detalhado para as demais. Se houver contagem compacta, definir se ela mede dimensões ou valores; preservar a condição completa ao expandir e oferecer recuperação. | Resumos e contagens são derivados do mesmo estado aplicado usado na consulta. |
| Seleção agregada com estado intermediário | Derivar o agregador das escolhas: nenhuma, parte ou todas. Definir o universo afetado, refletir estado intermediário e especificar o efeito de ativação por mouse e teclado. | O estado intermediário nunca é persistido como escolha adicional independente. |
| Negação preservada no resumo | Manter o operador de inclusão ou exclusão explícito no controle e no resumo aplicado. Gerar ambos a partir do mesmo predicado tipado; não resumir apenas pelo nome do valor. | A mesma seleção com operadores opostos produz resumos diferentes e consultas diferentes. |
| Resultado vazio com recuperação contextual | Apresentar vazio como resultado da consulta, manter filtros e navegação acessíveis e oferecer ação com escopo explícito para ajustar ou limpar restrições. Distinguir vazio de erro, espera e ausência de permissão. | Zero resultados, erro, carregamento e sem permissão são estados distintos. |
| Colunas configuráveis com identidade preservada | Oferecer configuração próxima ao cabeçalho, indicar campos exibidos e refletir a mudança visual com contrato explícito de atualização e persistência. Preservar identificação e os campos obrigatórios do trabalho. | Ocultar colunas não altera dados, permissões ou seleção de registros. |

Condições, exceções, contraexemplos e encaminhamentos exatos estão no [resumo estruturado](mobbin-observed-learning.json). Os cinco bindings existentes foram resolvidos; os mecanismos são hipóteses vinculadas às funções, sem certificação de especialidade.

Dois limites afetam a interpretação. A configuração de colunas mostra mudança visual antes de fechar o popover, portanto não fundamenta uma regra universal de aplicação explícita. Um resumo de filtro não conserva a negação apresentada no painel; o candidato de negação propõe corrigir essa lacuna.

O dry-run de ingestão aceitou oito unidades completas, com até 4260 caracteres, sem partir contexto. A raiz ainda precisa persistir as notas, validar as propostas e realizar revisão independente com casos positivo, negativo e de conflito antes de consolidar no overlay. Jev não foi chamado pelo curador.

Teclado, foco, mobile, duração de movimento, erro de serviço, backend e persistência não foram observados. Não há alegação de conversão, velocidade de uso ou superioridade geral; esses resultados exigem artefato próprio e avaliação de transferência.

Referências inspecionadas: [fluxo de filtros](https://mobbin.com/flows/79848379-dcae-4cd9-85d1-8e2e6891437b?tab=prototype), 17 posições; [configuração de colunas](https://mobbin.com/flows/cc39d360-1469-4001-81d9-441ea5f1a949?tab=prototype), cinco posições.
