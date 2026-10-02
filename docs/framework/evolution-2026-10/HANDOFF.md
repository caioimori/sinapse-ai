# Evolução SINAPSE — checkpoint de 2026-10-02

## Estado de verdade

Entrega local em `codex/feat/framework-evolution-20261002`, no worktree anexado
a esta conversa. Base: `origin/main`, SHA
`842eeabc4e9fe39d42f1119c9dc85a8a1e70cbc5`, versão 1.27.0.
Nenhum push, release, deploy ou alteração do HOME real foi executado.

O checkout original continua em `codex/feat/canonical-install-readme`, SHA
`693e9d0f9819cd700eae45734da41b055063fa5b`. Os 191 arquivos do recibo
[preservation.json](preservation.json) foram relidos sem divergência de existência
ou SHA-256. Outros worktrees foram preservados.

## Entregue e verificado

- AIOX público: release 5.4.1 e main pinado
  `4ef6530ff03b83aea953e4a426f95e012b8b70c5`; 3.022 blobs conferidos
  contra a árvore Git oficial. Snapshot completo fora do repositório, sob
  `%LOCALAPPDATA%/SINAPSE/upstream/aiox/<sha>`, com recibo em [upstream.json](upstream.json).
- Inventário: 17 squads, 172 agentes, 1.412 tarefas, 332 KBs, 99 arquivos
  de workflow e 37 skills por provider. Gaps conservados, sem aliases inventados.
- Recuperação por tarefa integrada aos 172 adapters e à skill genérica.
  JSON completo limitado a 12.000 unidades UTF-16, conhecimento a 6.000;
  contexto irrelevante é omitido. Não é retrieval semântico validado.
- Corpus inicial: 35 fontes consultadas e 67 heurísticas inferidas, incluindo
  24 técnicas para seis squads. Os 172 especialistas continuam com lacunas
  explícitas de fontes específicas e avaliação.
- Instaladores local/global entregam o bundle com receipts, hashes, backup
  e proteção contra alterações detectadas. Instalação e consultas reais foram
  comprovadas em fixtures; npm install foi interceptado, sem rede nesse teste.
- Dependências de produção: js-yaml 4.3.2 e fast-uri 3.1.8. Auditoria
  `--omit=dev` posterior reportou zero vulnerabilidades naquele escopo.
- Jev: executor controlado e lote offline de 18 grupos, 17 squads + core,
  com 134 perguntas sobre 67 regras. Nenhuma chamada, chave ou gasto usado.

Os 151 testes da coorte principal passaram. A revisão final também passou
27 testes da regra de proveniência e repetiu os 22 testes de conhecimento.
Não somar contagens sobrepostas. Comandos e limites: [verification.md](verification.md).

## Decisões preservadas

Fonte canônica e paths protegidos não foram alterados. A versão do fork não
foi renomeada para 5.4.1. Não existe ancestral comum confiável estabelecido
para afirmar um diff histórico completo com o AIOX.

O snapshot upstream é fonte de comparação, não código instalado. As 37
integrações Pro foram excluídas. Licença efetiva é registrada por arquivo;
referências restritas no corpus exigem revisão antes de distribuição comercial.

Permissão para referências upstream limita-se a dez arquivos exatos.
Produto, CLI, instaladores e agentes continuam protegidos; detecção de personas
herdadas continua ativa até nos arquivos autorizados para proveniência.

Jev julga apoio/relevância de regras; não extrai sozinho livros nem gera respostas.
Os resultados precisam de revisão antes de alterar rótulos. Fontes contraditórias,
exceções e resultado insuficiente não devem ser suprimidos.

A seleção de modelo da sessão é preservada. Não houve configuração global
de GPT-6.1 Sol, chamada generativa independente ou benchmark real de melhoria.

## Retomada

1. Conferir branch, estado Git e [story](../../stories/framework-evolution-20261002.story.md).
   Usar este worktree; não sobrescrever o checkout original ou instalar o bundle
   em perfis ativos sem auditoria de alterações existentes.
2. Obter credencial Jev local segura e teto autorizado. O lote revisável está em
   [plan-batch.json](../../../research/framework-evolution/plan-batch.json).
   Uma tentativa por grupo reserva até US$ 0,048384; três, até US$ 0,145152.
3. Regenerar o plano e conferir corpusSha256/modelo/preço antes da execução.
   Usar um ledger compartilhado no processo; vários processos exigem coordenação
   e ledger persistente. O CLI permanece offline.
4. Revisar resultados por ID de regra e fonte. Não promover confiança Jev
   a verdade. Executar [avaliação](evaluation.md) com casos reservados,
   modelo efetivamente registrado e variantes cegas antes/depois.
5. Aprofundar fontes por especialista e corrigir vínculos somente com contrato
   fiel. Tasks financeiras, 77 fallbacks e consumo de KB ainda requerem trabalho.
   Paths protegidos dependem de nova decisão explícita do mantenedor.

## Limites restantes

HOME real, publicação, uso pago Jev, qualidade em português, latência e cobrança
real não foram verificados. O teste ocorreu no Node 24.13.1; não executou toda
a matriz Node >=18, todas as suites do repositório ou o CI remoto.

CAS de arquivo contra writer não cooperativo após a última checagem não é
garantido por Node. Coordenar sessões antes de entregar sobre arquivos em uso.
Leitura de fontes selecionadas não equivale a absorção integral de livros/personas.
