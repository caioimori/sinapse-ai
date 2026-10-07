# Fechamento das pendências — 07.10.2026

Outcome: reparar as falhas reais e substituir pendências por provas observadas, dentro da autoridade e do orçamento existentes. A autorização é o novo pedido direto de Caio; o estado inicial vem dos logs de `0415eac5`, não de memória histórica.

## Contextos e owners
1. Contratos/testes: developer executa reparos; Quality Gate revisa sem alterar código. Entrada: logs individuais, código atual e contratos. Saída: diff mínimo com negativos preservados e resultados por SHA.
2. Segurança: Cyber coordena revisão de origem e invariantes; developer implementa scripts/exemplos e Devops cuida de dependências/Git. Entrada: 12 alertas, advisory e 45 hashes com procedência. Saída: reparo e evidência, ou impedimento exato sem dismiss.
3. Comportamento: execução nativa e benchmark têm fixtures/protocolo próprios. Entradas só do acervo aprovado; dados candidatos permanecem separados. Saída: respostas reais, avaliações cegas e limites de generalização.
4. Distribuição: Devops controla fonte, CAS e PR. Entrada: fonte estável verificada. Saída: readbacks, preservação, snapshots e prévia.

## ASRs mensuráveis
- Inalteração byte a byte dos três históricos e dos 1.928 pins ativos até troca CAS.
- Cada falha remota tem ID/teste/causa/diff ou bloqueio; nenhum skip novo e nenhuma redução de autoridade, veto, orçamento ou cap de bytes.
- HTTP é limitado antes de parse; bytes validados são os bytes usados; escrita preserva exclusividade, locks e snapshots sem promessa contra um dono hostil da máquina.
- Zero chamadas Jev adicionais nesta etapa; limite existente continua US$0,05 e nenhum segredo entra em logs, código ou commit.
- Benchmark deve registrar hash do protocolo/casos antes da primeira resposta, conditions separadas e reviewer sem rótulos; qualifica somente a amostra avaliada.
- Final UI 1440/390 com overflow horizontal zero; produção e audição humana nunca inferidas de decode/HTTP200.

## Decisão e trade-offs
Preservar monólito modular e fontes instaladas. Corrigir fixtures que não representam mais o transporte/contrato, mantendo provas negativas; não tornar runtime inseguro para satisfazer um mock antigo. Testes pesados usam CI remoto existente enquanto C: estiver abaixo de 10 GB. Não ampliar infraestrutura ou trocar engines de UI/vídeo.

Para dependências vulneráveis sem versão oficial corrigida, avaliar substituição compatível ou patch mínimo licenciado e reproduzível. Um override que apenas mascara advisory não atende o outcome. Para hashes derivados detectados como segredos, preservar procedência e detecção de segredos reais; controle estreito precisa revisão antes de qualquer exceção.

## Freios e evidência
O envio inicial dos reparos e a validação remota são uma etapa própria (T05), após T02/T03 e independente do benchmark T04. O painel (T06) e a instalação final (T07) dependem dessas evidências; não esperar o benchmark para iniciar CI remoto nem instalar uma fonte em edição.

O Reel é um artefato demonstrativo de vídeo/motion. Audição humana é uma validação perceptiva opcional, sem bloquear o aprimoramento do framework; resposta direta de Caio em 07.10 esclareceu a finalidade da solicitação. Reprodução contínua e audição conservam resultados distintos.

Máximo três tentativas por subtask e duas rodadas de patch focal; uma preocupação nova justificará rodada adicional registrada. Esperas remotas são observadas com backoff, sem bloquear comunicação mais de 60 segundos. Infra local tem 20 minutos totais de reparo; não tocar CI/shared tools.

Stories e workflow validados precedem código. Quando uma etapa exigir ação humana (login, audição ou produção), preparar tudo que não depende dela e pedir somente a ação mínima com motivo. Não marcar Done global por cobertura, respostas escritas ou chegada ao teto.
