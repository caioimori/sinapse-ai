# Proteção focal de leitura Windows e respostas Jev

Status: Accepted
Owner: developer
Scope: novo worktree expertise-hardening; fonte instalada anterior permanece ativa até commit/freeze/CAS pelo devops.

## Acceptance criteria

1. Servidor QA publica somente cinco assets conhecidos, usando snapshots prévios ao listener; junctions e paths arbitrários não retornam conteúdo externo.
2. Extraction lê por handle estável, verifica identidade/ancestrais antes/depois, limita a leitura e calcula hash/parse sobre o mesmo Buffer; troca determinística de pai é rejeitada.
3. Jev limita o transporte a 65.536 bytes antes do parse e projeta somente model/answers/usage tipados; excesso não chega ao cache. Campos opcionais de metadata do provedor podem ser descartados.
4. Testes nativos focais e matriz instalada scratch 172/172 preservam 582 critérios críticos, autoridade e limites 12.000/6.000/3.000. Não há chamada paga, segredo, produção ou alteração da fonte instalada anterior.

## Tasks

- [x] T01: Accepted story, spec e workflow validados antes do código.
- [x] T02: três módulos e testes focais de negativos/compatibilidade.
- [x] T03: lint, testes, matriz instalada scratch e freeze para devops.

## Dev Agent Record

Preparação autorizada pelo root e conferida pelo devops em fee0eb5a511bcbdcafdec79697d48591d6ae6c85. Máximo duas tentativas de reparo; patch focal estimado em 15 minutos. Sem promessa de resistência a malware com controle integral do proprietário/ACL/filesystem.

Workflow validado antes do código: `WF-20261007-expertise-security-hardening`, resultado `ok:true`. Primeira rodada: 19 PASS/1 FAIL (ledger do teste novo sem método reserve); lint apontou indentação do wrapper CLI. Segunda rodada: 20/20 PASS e lint dos quatro arquivos sem avisos; nenhum fixture legado modificado.

Matriz instalada scratch observada: 172/172 PASS, 582 critérios críticos completos, authority exata e máximos 11.865/5.990/2.997. Fonte antiga e HOME real não foram alterados. O freeze privado fixa os oito arquivos do write set para o devops conferir antes/depois da troca de branch e preparar uma nova CAS.

## File List

- scripts/expert-evolution/extraction.cjs
- scripts/framework-evolution/jev.cjs
- examples/framework-quality/verify.cjs
- tests/unit/expertise-security-hardening.test.js
- docs/framework/expert-evolution-2026-10/SECURITY-HARDENING-SPEC.md
- docs/framework/expert-evolution-2026-10/security-hardening-workflow.json
- docs/framework/expert-evolution-2026-10/SECURITY-HARDENING-QA.md
- docs/stories/expertise-security-hardening-20261007.story.md
