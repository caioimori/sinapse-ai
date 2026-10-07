# Verificação da especialização

Esta entrega é local. Fontes lidas, referências candidatas, perfis planejados,
modelos disponíveis e instalações em fixtures não representam a mesma evidência.

## Resultados observados

| Verificação | Resultado | Limite |
|---|---|---|
| Expertise | 172 perfis, 512 entregáveis, 17 squads + 12 core, 90 referências | Critérios concretos aprofundados em 28 funções; 88 referências candidatas, 2 READ seletivas no programa |
| Corpus | 67 fontes, 112 heurísticas, todos os 172 coverage=gap | Leitura de seções e observações, sem competência integral promovida |
| Prioridade | 32 fontes, 45 heurísticas, 13 consumidores canônicos | 27 fontes públicas primárias e 5 registros Mobbin |
| Mobbin | Autenticação e três buscas oficiais observadas; nove prévias inspecionadas | Quatro telas e cinco posições de 22 no fluxo Ahead; sem inferir comportamento |
| Jev | 119 oportunidades; piloto de 18 grupos, 224 perguntas, máximo US$ 0,048384 | Nenhuma chamada, nenhuma cobrança; chave de serviço não encontrada |
| Navegação | Baseline de 5.082 arquivos, 172 fontes, 516 adapters, 14 clusters/34 membros | Mapa congelado; refresh recalcula índice atual sem mover/apagar fontes |
| Runtime | 172 agentes consultados; perfil por tarefa até 3.000 chars | JSON inteiro até 12.000 chars, knowledge até 6.000; relevância lexical |
| Instalação | Fixtures de projeto e global com HOME contendo espaços; runtime instalado executado | HOME pessoal e outros projetos preservados; dependências npm interceptadas |
| Empacotamento | Sete arquivos adicionais necessários presentes | Mapas, biblioteca privada e capturas Mobbin não são distribuição de runtime |
| Modelos | Sol 6.1 nativo disponível; Opus 5.5/Jev somente publicados | Futuras versões e promoção global dependem de acesso e benchmark |
| Gates | Lint, typecheck, paridade, 17/17 YAML e upstream gate passaram | Build não existe neste package; CI remoto não executado |
| Preservação | 191 arquivos originais sem divergência; diff protegido vazio | Readback não controla outras sessões |
| QA final | 178/178 testes em 14 suites, 64,575s; lint/typecheck verdes; reviewer PASS local | Nenhum achado aberto no escopo revisado |

## Comparação reservada

Dez prompts foram reservados antes da extração das heurísticas. Dois agentes
nativos novos Sol 6.1 receberam contextos separados, sem decisões esperadas:
corpus anterior pinado em 45e979f e corpus enriquecido + perfil limitado.

Revisor independente recebeu apenas decisões A/B, com ordem sorteada por caso.
Depois do julgamento, o unblinding revelou 18/20 anterior e 20/20 enriquecido;
nove preferências para enriquecido e um empate, sem alegações de execução falsas.
A resposta anterior de modal omitiu Escape; a de carrossel omitiu texto equivalente.

Uma geração por caso e versão não produz estimativa estatística ou causal.
Especificidade pode revelar variante, apesar dos rótulos ocultos. São decisões
escritas, sem UI/vídeo renderizado, comparação Opus/Jev ou todas as competências.
Nenhum perfil foi promovido; a política registra benchmark parcial, sem promoção global.

Receipts: [protocolo](../../../research/expert-evolution/benchmark-protocol.json),
[resultados](../../../research/expert-evolution/benchmark-results.json) e
[revisão cega](../../../research/expert-evolution/benchmark-blind-review.json).
Inputs com contexto ficam fora do repositório; hashes e fontes pinadas estão no protocolo.

## Falhas e correções

A primeira coorte integrada teve 173/175 testes aprovados. Reinstalação acusou
uma mudança enquanto o snapshot de política foi atualizado por esta coordenação.
Dados congelados passaram no rerun; não foi alterado o critério de idempotência.

O outro teste esperava 67 regras fixas; a evolução trouxe 112. A verificação
continua comparando todos os IDs mapeados e agora confere unicidade contra o
corpus completo. O plano offline foi regenerado com a nova evidência.

QA independente reproduziu dois MEDIUM na política de modelos: relógio inválido
e junction ancestral para fora da raiz. Datas/ordem de revisão e ancestrais são
validados antes da leitura; o revisor reexecutou os probes e fechou ambos.

## Reprodução

Executar diretamente Jest evita pretest que regeneraria fontes protegidas:

```powershell
node node_modules/jest/bin/jest.js tests/unit/framework-evolution-upstream.test.js tests/unit/framework-evolution-runtime.test.js tests/unit/framework-evolution-knowledge.test.js tests/unit/framework-evolution-delivery.test.js tests/unit/global-provider-adapters.test.js tests/unit/sync-codex-native.test.js tests/unit/validate-codex-native.test.js tests/unit/codex-native-runtime.test.js tests/unit/sync-provider-adapters.test.js tests/installer/sinapse-ai-installer.test.js tests/unit/expert-evolution-expertise.test.js tests/unit/expert-evolution-catalog.test.js tests/unit/expert-evolution-model-policy.test.js tests/unit/expert-evolution-integration.test.js --runInBand --silent
npm run lint
npm run typecheck
npm run validate:parity
npm run validate:squad-schema:strict
node scripts/expert-evolution/expertise.cjs validate --json
node scripts/framework-evolution/knowledge.cjs validate --json
node scripts/expert-evolution/model-policy.cjs validate
node scripts/expert-evolution/catalog.cjs validate --refresh
```

A coorte affected de 37 testes passou antes da repetição principal. Contagens de
coortes se sobrepõem e não são somadas. Testes estruturais comprovam os controles
delimitados, sem substituir avaliação de qualidade do produto final.

## Limites restantes

Os gates staged de story/meta/ACs, arquitetura, manifest, segredos, proveniência,
dados pessoais e diff-check passaram. Proveniência e dados pessoais cobriram
5.120 arquivos rastreados; 111 links locais foram conferidos, sem ausências.
Nenhum segredo, token OAuth, base64 ou captura Mobbin foi retido no repositório.

Chave Jev ausente nos locais autorizados verificados; Opus 5.5 não foi executado
nesta tarefa. Mil horas, obras integrais e competência mundial não são entregas
comprovadas. A aquisição específica por agente e comparação de artefatos reais
continuam como etapas do plano, sem publicação ou instalação pessoal inferida.
