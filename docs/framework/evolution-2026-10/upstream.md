# AIOX público — auditoria de compatibilidade

Observação em 2026-10-02. O snapshot público completo está preservado fora do
repositório, sem execução de código upstream. A importação automática do fork foi
rejeitada: namespaces, políticas de versão e customizações SINAPSE divergem.

| Superfície | Estado confirmado | Fonte primária |
|---|---|---|
| GitHub release | v5.4.1; 2026-08-15 18:02:15 UTC; tag 70456b3203ba03d8e0724f22c78d6311f7ad5b85 | [Release](https://github.com/SynkraAI/aiox-core/releases/tag/v5.4.1) |
| npm atual | @aiox-squads/core latest 5.4.1; integridade no recibo | [Registry](https://registry.npmjs.org/@aiox-squads%2fcore) |
| npm legado | aiox-core latest 5.4.1; publicado 2026-08-15 18:13:16.808 UTC; wrapper compat | [Registry](https://registry.npmjs.org/aiox-core) |
| main | 4ef6530ff03b83aea953e4a426f95e012b8b70c5; 2026-08-15 18:08:09 UTC | [Commit](https://github.com/SynkraAI/aiox-core/commit/4ef6530ff03b83aea953e4a426f95e012b8b70c5) |
| Licença | Core MIT, avisos BMad/Synkra preservados; Pro privado tem termos próprios | [LICENSE](https://github.com/SynkraAI/aiox-core/blob/4ef6530ff03b83aea953e4a426f95e012b8b70c5/LICENSE), [Limite Core/Pro](https://github.com/SynkraAI/aiox-core/blob/4ef6530ff03b83aea953e4a426f95e012b8b70c5/docs/legal/license-clarification.md) |

Release e main diferem por um commit de sincronização de versão, em cinco
arquivos. Não houve mudança de dependências nesse delta, conforme o [compare
oficial](https://github.com/SynkraAI/aiox-core/compare/70456b3203ba03d8e0724f22c78d6311f7ad5b85...4ef6530ff03b83aea953e4a426f95e012b8b70c5).

## Decisões por atualização relevante

| Atualização pública | Decisão SINAPSE | Evidência e motivo |
|---|---|---|
| 5.4.1: tar na raiz para pro-setup | Já coberta em dependências; não alterar | package.json SINAPSE declara tar ^7.5.22; execução Pro fora do escopo |
| 5.4.1: lockstep raiz/interno/wrapper | Adaptar diagnóstico, preservar versões | Auditoria adicionada detecta interno 4.31.1 vs raiz 1.27.0; política SINAPSE não deve receber número 5.4.1 |
| 5.4.0: Grok Build e installer | Adiar | Sem necessidade autorizada de provedor Grok; não executar installer |
| 5.4.0: guard visual de terminal | Preservar política Windows sem janela | pm.sh e runtime core exigem revisão em escopo próprio; caminhos protegidos intactos |
| 5.4.0: seat hygiene e diagnósticos Pro | Excluir integração | A existência de clientes públicos não licencia conteúdo Pro privado |
| 5.3.0: CORE-SUPER-UPDATE OSS harvest | Snapshot completo + revisão por arquivo | 771 arquivos mapeiam a paths protegidos; sem wholesale merge |
| 5.3.0: fingerprint Pro/npm via npx | Excluir Pro; adiar installer | Nenhuma instalação upstream autorizada |
| 5.2.7: namespace e versão interna | Adaptado como diagnóstico e gate opt-in | namespaceDiagnostics preserva interno legado; releaseGate exige lockstep somente para wrappers explicitamente selecionados |
| 5.2.7: IDS propósito/placeholders | Adiar implementação em core | Mudanças .aiox-core/core/ids mapeiam a core protegido SINAPSE |
| 5.2.7: SOP canônico de release | Stage de referência | SOP público e LICENSE copiados externamente, não instalados |
| Demais releases publicadas | Cobertas pelo snapshot atual; revisão individual | Lista de 50 releases e decisão em provenance.releases; inventário não equivale a semântica lida de cada linha |

Fontes efetivamente lidas: corpos oficiais das releases 5.4.1, 5.4.0 e 5.3.0;
CHANGELOG.md até 5.1.0; LICENSE; license-clarification.md; README seção Pro;
validate-aiox-core-namespace.js; metadata GitHub/npm; compare release/main.
Todos são fontes primárias do mantenedor (tier 1 para estado do próprio produto).
GitHub e npm corroboram versão, mas não são avaliações independentes de qualidade.

## Recibo e execução reproduzível

[upstream.json](upstream.json) registra hashes SHA-256 de 3.022 arquivos, SHA do
archive, datas, metadata npm, destinos SINAPSE, decisão por arquivo e comparação.
Todos os blobs também foram comparados por hash Git SHA-1 à árvore oficial completa
do SHA, sem truncamento e sem symlinks; inventário e árvore têm 3.022 arquivos.
Treze scripts Windows no ZIP usam CRLF conforme .gitattributes pinado; seus hashes
Git canônicos foram conferidos com LF, preservando também o SHA-256 dos bytes locais.
Resultado: 1.154 ausentes, 1.866 diferentes e dois idênticos, antes das extensões
locais desta story. Diferença de bytes não prova regressão ou atualização faltante.

Snapshot: `%LOCALAPPDATA%\SINAPSE\upstream\aiox\4ef6530ff03b83aea953e4a426f95e012b8b70c5`.
O ZIP inclui todos os arquivos públicos desse SHA; nenhuma história, módulo privado
ou versão removida é inferida. Ancestral comum do fork não foi estabelecido:
`ancestralDelta.status=not-established`, portanto não há claim de delta ancestral.

```powershell
$cache = Join-Path $env:LOCALAPPDATA 'SINAPSE\upstream\aiox\4ef6530ff03b83aea953e4a426f95e012b8b70c5'
node scripts/framework-evolution/upstream-audit.cjs `
  (Join-Path $cache 'aiox-core-4ef6530ff03b83aea953e4a426f95e012b8b70c5') `
  . (Join-Path $cache 'provenance-v3.json') (Join-Path $cache 'new-audit.json')
node scripts/framework-evolution/upstream-audit.cjs --gate .
```

Output exige arquivo novo. Stage opcional exige diretório existente e seleção
explícita; somente LICENSE e documentação pública permitida são copiados.
Paths que escapam, symlinks, hash divergente, código, Pro e overwrite são recusados.
A licença efetiva segue o LICENSE mais próximo: 3.007 arquivos MIT e 15 Apache-2.0
nas skills mcp-builder/skill-creator. Stage automático exige MIT; outro subtree
depende de revisão própria. O LICENSE do template de squad é registrado separadamente.
Uma falha de filesystem durante escrita pode deixar cópias parciais; cada criação
é exclusiva e nenhum original é substituído. Nenhum vendor script é executado.

Stage externo verificado: LICENSE, docs/legal/license-clarification.md e
docs/guides/release-procedure.md. Sua função é leitura e adaptação futura;
não altera instalação, publicação, runtime ou comportamento dos agentes.

O gate aditivo retorna exit 1 para drift raiz/lock, wrapper explicitamente selecionado,
tar direto ausente ou tar instalado divergente do lock. Estado atual: raiz/lock 1.27.0
e tar instalado/locked 7.5.22. O manifest interno 4.31.1 conserva linhagem upstream;
sua semântica não foi equiparada à versão comercial SINAPSE e não bloqueia o gate.

Verificação local: Jest específico com 20 casos e ESLint sem warnings. Gates globais
e avaliação comportamental pertencem à integração final desta story.
