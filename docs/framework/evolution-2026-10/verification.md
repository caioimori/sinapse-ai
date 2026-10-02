# Verificação local — 2026-10-02

## Conclusão

QA aprovou o escopo local e fixtures de instalação, sem finding P1/P2 aberto
na revisão. Testes estruturais não comprovam melhoria comportamental, instalação
no perfil pessoal ou publicação. O resultado integral está em QA Results da
[story](../../stories/framework-evolution-20261002.story.md).

## Coorte principal

Executado diretamente por Node, sem pretest que regenerasse paths protegidos:

```powershell
node node_modules/jest/bin/jest.js tests/unit/framework-evolution-upstream.test.js tests/unit/framework-evolution-runtime.test.js tests/unit/framework-evolution-knowledge.test.js tests/unit/framework-evolution-delivery.test.js tests/unit/global-provider-adapters.test.js tests/unit/sync-codex-native.test.js tests/unit/validate-codex-native.test.js tests/unit/codex-native-runtime.test.js tests/unit/sync-provider-adapters.test.js tests/installer/sinapse-ai-installer.test.js --runInBand --silent
```

Resultado observado: 151 testes, dez suites, todos aprovados, 74,03 s.
Parcial de 82 testes/sete suites se sobrepõe e não deve ser somado.
Outras coortes documentadas em runtime, dependencies e knowledge também podem
se sobrepor; não existe soma consolidada de testes únicos do repositório.

## Verificações complementares

| Verificação | Evidência observada | Limite |
|---|---|---|
| Lint e typecheck | Ambos aprovados | Node 24.13.1; sem matriz completa |
| Parity e native | 172 agentes, 37 skills/provider, 11 comandos críticos | Geração não prova execução de toda task |
| Registry curado | Nove agentes, 66 comandos, todos targets existentes | Sem equivalência semântica presumida |
| Squad YAML strict | 17/17, sem warnings/failures | Schema não prova comportamento |
| Instalação | Instalador público de projeto e global em HOME temporário com espaços; runtime/hook executados | Dependências npm interceptadas; HOME real intacto |
| Empacotamento | Oito arquivos do bundle presentes no npm pack dry-run | Dry-run sozinho não prova instalação |
| Corpus | 35 fontes, 67 regras válidas, consumidores reais | Todas inferred; 172 coverage=gap |
| Consulta | Todos os 172 agentes consultados independentemente com task válida | Relevância lexical; sem avaliação generativa |
| Jev | 134 perguntas em 18 requests offline; called=false | Endpoint autenticado/modelo/cobrança não executados |
| Upstream | 3.022 blobs oficiais pinados, zero divergências | Ancestral comum não estabelecido |
| Preservação | 191 arquivos originais, zero divergências; zero paths protegidos alterados | Não controla outras sessões |
| Produção dependencies | Dois pacotes high corrigidos; audit --omit=dev posterior zero | Não é auditoria completa de dev dependencies |

Nos 3.022 arquivos upstream, 3.009 hashes Git conferiram diretamente;
13 scripts Windows conferiram após normalização CRLF definida no .gitattributes
pinado. Manifestos de integridade do corpus cobrem apenas excertos retidos.

## Revisão final delimitada

Depois da coorte principal, corrigiu-se apenas a contagem squads/core do plano
e a exceção de proveniência no guard. Os 22 testes de conhecimento passaram
novamente, incluindo 17 squads únicas + exatamente um core, 18 requisições,
67 regras, 134 perguntas e corpusSha256 preservado.

O guard passou 27 testes e ESLint. A exceção admite dez paths exatos;
produto, CLI, instaladores, agentes gerados, caminhos similares, aliases em
maiúsculas e personas herdadas continuam rejeitados. O scan rastreado observado
pelo especialista cobriu 5.080 arquivos, com zero violações, antes dos dois docs finais.

Stage final: lint, metadados da story (um pass, zero warnings/erros), ACs strict,
docs de instalação, contrato de arquitetura, corpus e releaseGate passaram.
Os guards de proveniência e dados pessoais examinaram 5.082 arquivos rastreados,
sem violações; o scanner local de segredos dos blobs staged passou.

Os 20 links locais de seis documentos conferiram sem destino ausente.
Nova leitura dos 191 arquivos originais confirmou zero diferenças; a branch
continha 213 arquivos alterados e zero alterações em paths protegidos.

O commit local foi aceito pelos hooks existentes de segredos, SQL, fronteiras
e arquivos protegidos. Seu post-commit atualizou o índice derivado para 819
entidades. QA conferiu por RegistryLoader a contagem, estrutura, diff restrito
e SHA-256 das duas bibliotecas alteradas; os demais 817 hashes não foram revalidados.

Uma suite adicional passou 14/14 testes: entity-registry-schema. Ela usa fixtures;
a leitura do índice atual foi uma verificação independente. Esse efeito derivado
foi preservado e incluído no checkpoint. O post-commit seguinte reconciliou somente
hash e tamanho do índice no install-manifest; validate-manifest passou, resolvendo
o alerta anterior. A entrega contém 215 arquivos alterados, incluindo os dois índices.

```powershell
node node_modules/jest/bin/jest.js tests/core/ids/entity-registry-schema.test.js --runInBand --silent
```

## Comandos dos gates

```powershell
npm run lint
npm run typecheck
npm run validate:parity
npm run validate:squad-schema:strict
node scripts/framework-evolution/upstream-audit.cjs --gate .
node scripts/framework-evolution/knowledge.cjs validate --json
node scripts/validate-story-meta.js --staged
node scripts/validate-story-acs.js
node scripts/validate-install-docs.js
node scripts/validate-manifest.js
node scripts/validate-no-personal-leaks.js
node scripts/validate-no-external-refs.js
node bin/utils/staged-secret-scan.js
git diff --cached --check
node "$env:USERPROFILE/.codex/scripts/validate-architecture-first.cjs" docs/framework/evolution-2026-10/workflow.json --json
```

O scanner local de segredos examina blobs staged com as exceções preexistentes
para fixtures de teste. Não equivale ao Gitleaks de histórico completo no CI remoto.
O package não define build: esse gate é inaplicável, não um build aprovado.

## Não comprovado

Não foram executados Jev pago, corpus integral de autores/livros, benchmark
cego antes/depois, testes de todas as tasks/workflows, instalação pessoal,
publicação ou CI remoto. A matriz Node >=18 permanece pendente.
