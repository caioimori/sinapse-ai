---
id: cross-provider-closeout-20261002
type: enhancement
status: Done
owner: caio
executor: developer
quality_gate: quality-gate
quality_gate_tools: [node, jest, eslint]
created: 2026-10-02
epic: docs/framework/expert-evolution-2026-10/PLAN.md
---

# Fechamento operacional do framework para Codex e Claude Code

## Status

Done

## Story

Como mantenedor, quero concluir as pendências executáveis e usar o mesmo conhecimento aprovado nos dois ambientes, com autoridade de tarefas e limites verificáveis.

## Scope

Contratos/perfis e tarefas squad-local ausentes; resolvedor/validação de autoridade fora de protected paths; contexto determinístico com vínculo privado explícito; nova extensão pessoal opt-in de nome único para ambos os ambientes, CAS/backup/readback; QA atual dos pares e criativos próprios. Preservar original, adapters e extensões existentes. Sem publicação, remoção funcional, nova cobrança, recarga ou API Anthropic.

## Acceptance Criteria

- [x] AC1 — Given fontes canônicas, When os 172 perfis são auditados, Then todos têm contrato e tarefas próprias verificáveis ou gaps explícitos, e pool não concede execução indevida.
- [x] AC2 — Given vínculo explícito, When contexto é montado no Codex e Claude Code, Then raiz/hash autorizados e bytes equivalentes são verificados sem alegar execução nativa de modelo.
- [x] AC3 — Given acervo privado, When a extensão é instalada e descoberta, Then limites 12.000/6.000/3.000, rejeição de vínculo adulterado, CAS/rollback e isolamento por projeto são comprovados.
- [x] AC4 — Given interfaces e criativos próprios, When replay atual é realizado, Then 1440/390/320, estados e overflow são comprovados e lacunas AV/históricas ficam explícitas.
- [x] AC5 — Given trabalho concorrente e orçamento, When a onda é fechada, Then original/protected/pessoais preexistentes são preservados, ledger Jev não aumenta e checks aplicáveis passam.

## Tasks

- [x] Auditar e corrigir contratos/tarefas/autoridade.
- [x] Implementar e instalar extensão opt-in compartilhada.
- [x] Verificar interfaces, motion e mídia com limites explícitos.
- [x] Verificar preservação, gates e handoff.

## File List

- .agents/skills/sinapse-project-expert/SKILL.md
- .claude/skill-manifest.json
- .claude/skills/sinapse-project-expert/SKILL.md
- .codex/scripts/resolve-codex-agent.js
- .codex/scripts/resolve-codex-command.js
- AGENTS.md
- README.md
- docs/framework/codex-runtime-reference.md
- docs/framework/expert-evolution-2026-10/CLOSEOUT-SPEC.md
- docs/framework/expert-evolution-2026-10/CLOSEOUT-VERIFICATION.md
- docs/framework/expert-evolution-2026-10/HANDOFF.md
- docs/framework/expert-evolution-2026-10/PLAN.md
- docs/framework/expert-evolution-2026-10/closeout-adr.md
- docs/framework/expert-evolution-2026-10/closeout-source-corrections.json
- docs/framework/expert-evolution-2026-10/closeout-workflow.json
- docs/stories/cross-provider-closeout-20261002.story.md
- examples/framework-quality/hub-data.json
- examples/framework-quality/hub.js
- examples/framework-quality/index.html
- examples/framework-quality/shared.css
- examples/framework-quality/ui/app.js
- examples/framework-quality/ui/verify-toast.cjs
- package.json
- research/expert-evolution/expert-profiles.json
- research/expert-evolution/operational-contracts.json
- research/expert-evolution/source-program.json
- scripts/expert-evolution/operational.cjs
- scripts/framework-evolution/project-expert-install.cjs
- scripts/framework-evolution/project-expert.cjs
- scripts/framework-evolution/runtime.cjs
- scripts/sync-provider-adapters.js
- scripts/validate-provider-adapters.js
- squads/claude-code-mastery/agents/roadmap-sentinel.md
- squads/claude-code-mastery/tasks/adoption-strategy.md
- squads/claude-code-mastery/tasks/check-updates.md
- squads/claude-code-mastery/tasks/ecosystem-map.md
- squads/claude-code-mastery/tasks/feature-radar.md
- squads/claude-code-mastery/tasks/migration-guide.md
- squads/claude-code-mastery/tasks/plan-first.md
- squads/claude-code-mastery/tasks/readiness-check.md
- squads/claude-code-mastery/tasks/sdk-guide.md
- squads/claude-code-mastery/tasks/update-knowledge.md
- squads/claude-code-mastery/tasks/velocity-audit.md
- squads/claude-code-mastery/tasks/what-changed.md
- squads/squad-cloning/agents/sop-extractor.md
- squads/squad-cloning/tasks/extract-grounded-sop.md
- squads/squad-copy/agents/copy-editor.md
- squads/squad-council/agents/yvon-chouinard.md
- squads/squad-finance/agents/forecast-strategist.md
- squads/squad-finance/tasks/alert-regulatory-changes.md
- squads/squad-finance/tasks/analyze-tax-regime.md
- squads/squad-finance/tasks/audit-cloud-spend.md
- squads/squad-finance/tasks/audit-saas-stack.md
- squads/squad-finance/tasks/audit-tax-obligations.md
- squads/squad-finance/tasks/build-cohort-analysis.md
- squads/squad-finance/tasks/build-cost-forecast.md
- squads/squad-finance/tasks/build-cost-optimization-plan.md
- squads/squad-finance/tasks/build-fiscal-calendar.md
- squads/squad-finance/tasks/build-revenue-forecast.md
- squads/squad-finance/tasks/build-tool-inventory.md
- squads/squad-finance/tasks/build-what-if-scenario.md
- squads/squad-finance/tasks/calculate-runway-breakeven.md
- squads/squad-finance/tasks/calculate-saving-roi.md
- squads/squad-finance/tasks/calculate-withholdings.md
- squads/squad-finance/tasks/consolidate-redundant-tools.md
- squads/squad-finance/tasks/define-competence-vs-cash.md
- squads/squad-finance/tasks/detect-zombie-licenses.md
- squads/squad-finance/tasks/forecast-vs-actual-review.md
- squads/squad-finance/tasks/map-iss-by-municipality.md
- squads/squad-finance/tasks/model-unit-economics.md
- squads/squad-finance/tasks/negotiate-vendor-renewal.md
- squads/squad-finance/tasks/review-contract-fiscal.md
- squads/squad-finance/tasks/review-service-invoice.md
- squads/squad-finance/tasks/right-size-infrastructure.md
- squads/squad-finance/tasks/run-scenario-analysis.md
- squads/squad-finance/tasks/run-sensitivity-analysis.md
- squads/squad-finance/tasks/simulate-tax-burden.md
- squads/squad-finance/tasks/track-cost-creep.md
- squads/squad-finance/tasks/update-rolling-forecast.md
- tests/unit/cross-provider-operational.test.js
- tests/unit/expert-evolution-bindings.test.js
- tests/unit/framework-evolution-runtime.test.js
- tests/unit/operational-contracts.test.js
- tests/unit/project-expert-context.test.js
- tests/unit/sync-provider-adapters.test.js

## Dev Agent Record

Autorização de continuidade YOLO; contratos e extensão auditados por quality-gate, instalação/readback por devops e replay por design. Story/workflow validados antes de implementar; nenhuma ampliação de expertise ou publicação remota.

AC1: 172/17/2.640 contratos e 42 tarefas, autoridade derivada do canônico; pool foreign exige delegação. AC2–AC3: instalação definitiva aditiva, 2.095 pins, 20/20 contextos de design e 12/12 de autoridade, paridade entre provedores, 18 rejeições e limites 12.000/6.000/3.000 respeitados. Nenhuma inferência nativa alegada.

AC4: pares 459/459, Lume 84/84, feedback/foco 411/411 e painel final 416/416 em 1440/390/320, sem overflow; decodificação de 18s/540 quadros, audição e reprodução contínua sem prova. AC5: 191 entradas originais e 262 payloads preservados; duas skills novas no original, quatro deltas pessoais fora do write set conservados; nenhuma nova chamada paga Jev.

Verificação agregada: 276/276 testes em 18 suites, usando somente o resultado mais recente por suite. Vermelhos, tentativa ampla interrompida e limites históricos preservados. Lint aplicável, typecheck, paridade, manifest e guards tiveram passagem observada. A [verificação final](../framework/expert-evolution-2026-10/CLOSEOUT-VERIFICATION.md) delimita fatos e lacunas.

Evidências privadas em examples/framework-quality/output/closeout-20261002: latest-scoped-tests.json, delivery/install-receipt-complete.json, delivery/installed-verification-final.json, delivery/installed-authority-verification.json, creative/final-review-report.json e frontend/panel-final-handoff.json. Inputs runtime/perfis/bindings/privados e QA abaixo ficaram congelados para o fechamento.

## QA Results

Pendente de verificação nesta execução.


### Auditoria prévia de contratos — 2026-10-02

CONCERNS antes de implementação: as 172 identidades existem, mas 30 tarefas financeiras e 11 comandos roadmap precisam destinos próprios; SOP precisa tarefa explícita. Revisão operacional deve ficar separada de expertise. Nenhum JSON público, fonte canônica ou saldo Jev foi alterado por esta auditoria.

O suplemento deve distinguir execução própria, dependência declarada, registro, delegação e comando administrativo. Testar aliases core e negativos de owner; pool não concede autoridade. Contagens e propostas abaixo são um snapshot prévio e devem ser recalculadas depois do patch.

```json
{
  "schemaVersion": 1,
  "kind": "operational-contract-audit",
  "scope": "Advisory preimplementation review; expertise promotion not assessed",
  "reviewer": "closeout-contracts-quality-gate",
  "observedAt": "2026-10-02T21:53:57.546Z",
  "coverage": {
    "identities": 172,
    "squads": 17,
    "semanticProfileBatches": 3,
    "expertiseReviewedProfiles": 35,
    "expertiseBindings": 51,
    "references": 90,
    "referenceRead": 2,
    "referenceCandidate": 88,
    "resolverExposures": 6420,
    "distinctResolvedTasks": 1354,
    "recognizedOwnedTaskProfilesBeforeFix": 160
  },
  "preservation": {
    "publicJsonModified": false,
    "canonicalModified": false,
    "paidJevCalls": 0,
    "privateOverlay": "Existing 12 entries must be preserved"
  },
  "operationalManifestProposal": {
    "identityKey": "canonical agentId, not registry ID",
    "evidence": [
      "canonical.path + current file SHA256 + exact identity/role locator",
      "pointer.path + SHA256 when registry resolves a pointer",
      "taskPath + current file SHA256 + exact owner/dependency/registry locator"
    ],
    "taskModes": [
      "own",
      "declared-dependency",
      "registry",
      "delegate",
      "administrative"
    ],
    "assertions": [
      "Pool visibility does not grant execution or expertise",
      "Foreign owner means delegate; reject direct execution for specialist",
      "Unknown command/agent/ambiguous alias rejected",
      "Task/registry aliases must preserve exact target and normalized owner",
      "Operational review never sets validatedExpertise or expands contractReviewed",
      "Minimum protected criteria stay complete or context reports deferred-budget"
    ],
    "contextLimits": {
      "totalChars": 12000,
      "knowledgeChars": 6000,
      "profileChars": 3000
    }
  },
  "missingTasks": [
    {
      "agentId": "cost-optimizer",
      "canonical": {
        "path": "squads/squad-finance/agents/cost-optimizer.md",
        "sha256": "ced366f7d824f5339c188ef6f036ac8bd079f9a118c95afc5b82d7ef0d4907e8",
        "scope": "Local agent definition; frameworks and capabilities declared, not externally validated"
      },
      "sourceLocator": "## Tasks",
      "proposedTasks": [
        {
          "command": "audit-saas-stack",
          "meaning": "Auditoria completa de SaaS subscriptions"
        },
        {
          "command": "audit-cloud-spend",
          "meaning": "Auditoria de gastos cloud (compute/storage/network)"
        },
        {
          "command": "detect-zombie-licenses",
          "meaning": "Detectar licencas inativas ou sub-utilizadas"
        },
        {
          "command": "negotiate-vendor-renewal",
          "meaning": "Preparar dossie de negociacao pre-renovacao"
        },
        {
          "command": "build-cost-optimization-plan",
          "meaning": "Plano trimestral de otimizacao com priorizacao"
        },
        {
          "command": "track-cost-creep",
          "meaning": "Monitorar crescimento de gasto por categoria"
        },
        {
          "command": "consolidate-redundant-tools",
          "meaning": "Identificar e propor consolidacao de tools"
        },
        {
          "command": "right-size-infrastructure",
          "meaning": "Right-sizing de recursos de infra/cloud"
        },
        {
          "command": "build-tool-inventory",
          "meaning": "Manter inventario vivo de tools e contratos"
        },
        {
          "command": "calculate-saving-roi",
          "meaning": "Calcular ROI e payback de cada otimizacao"
        }
      ]
    },
    {
      "agentId": "fiscal-compliance-br",
      "canonical": {
        "path": "squads/squad-finance/agents/fiscal-compliance-br.md",
        "sha256": "bd864595999e5465854054be696b9d05caf98368b713132e0d70659a19f1206e",
        "scope": "Local agent definition; frameworks and capabilities declared, not externally validated"
      },
      "sourceLocator": "## Tasks",
      "proposedTasks": [
        {
          "command": "analyze-tax-regime",
          "meaning": "Analisar regime tributario adequado (Simples/Presumido/Real)"
        },
        {
          "command": "simulate-tax-burden",
          "meaning": "Simular carga tributaria efetiva por regime"
        },
        {
          "command": "review-service-invoice",
          "meaning": "Revisar NFS-e antes da emissao"
        },
        {
          "command": "map-iss-by-municipality",
          "meaning": "Mapear ISS por municipio onde ha tomadores"
        },
        {
          "command": "define-competence-vs-cash",
          "meaning": "Definir regime de reconhecimento por contrato"
        },
        {
          "command": "audit-tax-obligations",
          "meaning": "Auditoria de obrigacoes acessorias e prazos"
        },
        {
          "command": "calculate-withholdings",
          "meaning": "Calcular retencoes na fonte em contratos"
        },
        {
          "command": "review-contract-fiscal",
          "meaning": "Revisao fiscal de contrato (gross-up, retencoes)"
        },
        {
          "command": "alert-regulatory-changes",
          "meaning": "Alertar sobre mudancas regulatorias relevantes"
        },
        {
          "command": "build-fiscal-calendar",
          "meaning": "Construir calendario fiscal anual da empresa"
        }
      ]
    },
    {
      "agentId": "forecast-strategist",
      "canonical": {
        "path": "squads/squad-finance/agents/forecast-strategist.md",
        "sha256": "2766e70d4ce73171745f3ec7d03289273d7a81c35aeccabda96ed31e8e677919",
        "scope": "Local agent definition; frameworks and capabilities declared, not externally validated"
      },
      "sourceLocator": "## Tasks",
      "proposedTasks": [
        {
          "command": "build-revenue-forecast",
          "meaning": "Modelo de receita 6-24 meses driver-based"
        },
        {
          "command": "build-cost-forecast",
          "meaning": "Modelo de custos fixos/variaveis projetados"
        },
        {
          "command": "run-scenario-analysis",
          "meaning": "Gerar P10/P50/P90 com premissas explicitas"
        },
        {
          "command": "run-sensitivity-analysis",
          "meaning": "Sensibilidade por driver com tornado"
        },
        {
          "command": "calculate-runway-breakeven",
          "meaning": "Runway e breakeven sob cada cenario"
        },
        {
          "command": "build-cohort-analysis",
          "meaning": "Cohort de retencao, expansion, churn"
        },
        {
          "command": "model-unit-economics",
          "meaning": "LTV, CAC, payback, contribution margin"
        },
        {
          "command": "forecast-vs-actual-review",
          "meaning": "Comparar projetado vs realizado mensal"
        },
        {
          "command": "update-rolling-forecast",
          "meaning": "Atualizar forecast 12m com realizado novo"
        },
        {
          "command": "build-what-if-scenario",
          "meaning": "Modelar what-if especifico solicitado"
        }
      ]
    }
  ],
  "roadmapTasks": {
    "agentId": "roadmap-sentinel",
    "canonical": {
      "path": "squads/claude-code-mastery/agents/roadmap-sentinel.md",
      "sha256": "34ced4e9deebaf7c78af216d230e094e886f445937f819274caedea7c96b3970",
      "scope": "Local agent definition; frameworks and capabilities declared, not externally validated"
    },
    "sourceLocator": "commands:",
    "taskNames": [
      "update-knowledge",
      "check-updates",
      "feature-radar",
      "what-changed",
      "plan-first",
      "adoption-strategy",
      "migration-guide",
      "readiness-check",
      "velocity-audit",
      "sdk-guide",
      "ecosystem-map"
    ],
    "reviewNotes": [
      "Outputs are grounded documents/plans, never automatic upgrade/install/API execution",
      "Pin installed evidence and reviewed latest official source separately",
      "Distinguish SDK/API guidance from actual transport or model execution",
      "Plan-first ceremony must follow task size; max3 review passes in this wave"
    ]
  },
  "sopTask": {
    "agentId": "sop-extractor",
    "canonical": {
      "path": "squads/squad-cloning/agents/sop-extractor.md",
      "sha256": "32382863302b01eb0d87a0a111ff0e7a54bfb01349c02832305c61077ac45872",
      "scope": "Local agent definition; frameworks and capabilities declared, not externally validated"
    },
    "sourceLocators": [
      "## SOP Format",
      "## Extraction Patterns"
    ],
    "newTaskProposal": "extract-standard-operating-procedure",
    "inputs": [
      "authorized source text and source locator/version",
      "target process and trigger",
      "declared rights"
    ],
    "outputs": [
      "trigger",
      "ordered steps with each source locator",
      "veto/exception",
      "expected output",
      "uncertainties/contradictions"
    ],
    "negative": "Repetition alone is not proof of mandatory step; absent trigger/veto stays unknown instead of fabricated.",
    "reviewNote": "New command must be explicitly declared in canonical squad agent; do not pretend old pool grants SOP ownership."
  },
  "foreignOwnerNegatives": [
    {
      "agentId": "copy-strategist",
      "command": "conduct-copy-audit",
      "owner": "copy-editor",
      "taskPath": "squads/squad-copy/tasks/conduct-copy-audit.md",
      "taskSha256": "c0cfdf63ce75bc1e5133d174795d8c518045fffa07ac243e9d43b3d7d227e518",
      "expected": "delegate, never self-owned; same target remains accessible to correct owner"
    },
    {
      "agentId": "direct-response-writer",
      "command": "write-sales-letter",
      "owner": "long-form-writer",
      "taskPath": "squads/squad-copy/tasks/write-sales-letter.md",
      "taskSha256": "c27590dbc24ec0c83284e0a4c21fe73a2a771bc66cd6c3b1e15c02e31d668939",
      "expected": "delegate, never self-owned; same target remains accessible to correct owner"
    }
  ],
  "corePositiveCases": [
    {
      "a": "pm",
      "b": "project-lead",
      "command": "create-prd"
    },
    {
      "a": "dev",
      "b": "developer",
      "command": "develop"
    },
    {
      "a": "qa",
      "b": "quality-gate",
      "command": "gate"
    },
    {
      "a": "sinapse-orqx",
      "b": "snps-orqx",
      "command": "route"
    }
  ],
  "coreNotes": [
    "Registry IDs such as sinapse-pm/sinapse-dev/sinapse-qa must normalize via canonical pointer to profile IDs",
    "Core generic/shared task ownership may be established by explicit registry/dependency even when old task lacks responsavel",
    "Codex core routing tasks exist in .codex/tasks and are absent from parametric-only inventory; include them through registry",
    "Do not rewrite protected core tasks to modernize old persona names"
  ],
  "sourceCatalogCorrections": [
    {
      "id": "squad-council-method",
      "title": "Maps of Bounded Rationality: A Perspective on Intuitive Judgment and Choice — Nobel Lecture (2002)",
      "kind": "documentation",
      "author": "Daniel Kahneman",
      "url": "https://www.nobelprize.org/prizes/economic-sciences/2002/kahneman/lecture/",
      "verifiedSource": "https://www.nobelprize.org/uploads/2018/06/kahnemann-lecture.pdf",
      "locator": "Title page / Prize Lecture December 8, 2002",
      "status": "CANDIDATE",
      "note": "Lecture page returned 403; officialPDF search verifies title. This is not Thinking Fast and Slow."
    },
    {
      "id": "squad-research-method",
      "title": "The Magenta Book — Central Government guidance on evaluation",
      "kind": "documentation",
      "author": "HM Treasury and Evaluation Task Force",
      "url": "https://www.gov.uk/government/publications/the-magenta-book",
      "locator": "Documents / Details",
      "status": "CANDIDATE",
      "note": "This is not the Campbell quasi-experimental textbook. Whole 160 page PDF was not read."
    },
    {
      "id": "claude-code-mastery-method",
      "title": "Claude Code documentation — Overview",
      "kind": "documentation",
      "author": "Anthropic",
      "url": "https://code.claude.com/docs/en/overview",
      "locator": "Overview",
      "status": "CANDIDATE",
      "note": "Official documentation, not a book."
    },
    {
      "id": "dx-frontend-engineer-specific",
      "title": "Thinking in React",
      "kind": "documentation",
      "author": "React documentation",
      "url": "https://react.dev/learn/thinking-in-react",
      "locator": "Thinking in React",
      "status": "CANDIDATE",
      "note": "Duplicate URL of existing read-react; do not copy READ status unless evidence scope/locators/hash transfer explicitly verified."
    }
  ],
  "availableButUnread": [
    {
      "id": "naval-ravikant-specific",
      "url": "https://www.navalmanack.com/",
      "verified": "Home text explicitly says complete book and PDF are free to read/download.",
      "status": "CANDIDATE",
      "note": "Access availability does not prove reading, lawful redistribution or specialist competence."
    }
  ],
  "factualCorrection": {
    "path": "squads/squad-council/agents/yvon-chouinard.md",
    "canonicalSha256": "d35787b429f2cccb3a4b654d9c065576c5d2daef34121373db1c48585e0bb026",
    "locator": "earth_as_shareholder.structure",
    "verifiedSource": "https://www.patagonia.com/ownership/",
    "verifiedLocator": "Who owns Patagonia? / How it works",
    "correct": "Holdfast Collective owns 98% and all nonvoting stock; Patagonia Purpose Trust owns 2% and all voting stock.",
    "status": "verified by primary source; Developer patch pending"
  },
  "domainCriteria": {
    "finops": [
      "Savings must show baseline, comparable window, currency, formula, oneoff migration costs and operational risk. Do not call estimated savings realized.",
      "Unused license/resource evidence must account for critical dormant/seasonal/service roles; produce proposal, never cancel/shutdown by merely crossing a heuristic threshold.",
      "Renewal dossiers quote dated verified contract/price and action owner; no contact/vendor message or payment without explicit scope."
    ],
    "forecast": [
      "Drivers and periods/units/denominator are explicit; zero/negative denominators handled.",
      "P10/P50/P90 only with a defensible distribution/quantile computation; scaled 70/100/130 percent scenarios are scenarios, not percentiles.",
      "Forecast vs actual uses same definitions and recorded vintage; avoid leakage from future actuals into original forecast; show uncertainty and sensitivity.",
      "Cohorts deduplicate customer/unit/time consistently; LTV/CAC/retention conventions are explicit and margin-aware."
    ],
    "fiscal": [
      "Jurisdiction, municipality, tax period, regime, service and authoritative dated rule are explicit; no generic rates treated as law.",
      "Review/simulation drafts only; cannot issue NF, file declarations, pay taxes or send documents merely because task names fiscal operation.",
      "NFS-e/withholding drafts show applicability and source; missing required legal inputs produces gap, not invented conclusion.",
      "Competence versus cash is bounded by contract/accounting basis; differentiate accounting recognition from collection and tax calculation."
    ]
  }
}
```


### Revisão independente operacional — passagem 1 (2026-10-02)

**Gate: CONCERNS antes da correção de cobertura e integridade.** Revisão de responsabilidade operacional; não promove expertise, fontes nem modelos.

- 42 tarefas novas (30 finanças, 11 roadmap, 1 SOP): leitura dos requisitos, saídas e vetos específicos; montagem real dos 42 contextos com proprietário correto, 4.104–4.593 caracteres, modelo nulo e nenhuma execução observada. Cenários financeiros agora exigem pessimista/base/otimista; P10/P50/P90 ficam vetados sem distribuição e cálculo verificável.
- Aliases snps/snps-orqx, pm/project-lead e qa/quality-gate funcionaram. copy-editor:conduct-copy-audit funcionou; copy-strategist:conduct-copy-audit e direct-response-writer:write-sales-letter exigiram delegação ao proprietário real. IDs/comandos desconhecidos e entradas de orçamento inválidas foram rejeitados.
- Fronteiras de arquivo ../, caminho absoluto, diretório e arquivo ausente foram rejeitadas. Orqx de animações e clonagem devolveram delegate com executionAuthorized:false para tarefas dos especialistas.
- Problema reproduzido em operational.cjs: validateContracts aceitou alterações de role, mission, squad e discoveryPool.authority, além de remoção de tarefa. getOperationalContract usava role do manifesto para isentar autoridade e aceitava tarefa fora da lista. Exigir identidade derivada do canônico e contrato selecionado correspondente antes de executar.
- Problema reproduzido de cobertura: 75 agentes tinham lista vazia; 74 deles possuíam tarefas com proprietário exato no pool. 526 exposições own foram excluídas do manifesto; agent-forger:generate-agent-commands e animation-interpreter:build-animation-brief ainda passaram como execute/exact-owner. Incluir own de pool e corrigir gaps falsos; manter alheias apenas para descoberta/delegação.
- claude-mastery-chief é Orchestrator & Triage Router no canônico (linhas 39/72), mas foi classificado specialist e diagnose foi bloqueado por proprietário não resolvido. Corrigir papel por evidência canônica explícita.
- Os quatro registros de fonte corrigidos possuem títulos/autores/kind de documentação compatíveis e continuam CANDIDATE. Corrigir acquisition.query que termina em undefined. Preservados 35 contractReviewed, 51 bindings e 2 READ/88 CANDIDATE. Disponibilidade de livro completo não prova leitura, direitos de redistribuição nem especialização.
- Sete negativos reais do runtime rejeitados: tarefa foreign, modelo em context-only, flag inválida, ID/comando desconhecido e limites de contexto/conhecimento inválidos. Nenhum fallback de execução foreign/unknown foi encontrado nas exposições examinadas.

A classificação final depende de nova revisão do patch e de provas de integridade/cobertura. Montagem local não prova execução em Codex/Claude nem melhoria comportamental. Nenhum gasto, instalação global, upload ou push foi realizado nesta revisão.


### Revisão independente operacional — passagem 2 (2026-10-02)

**Gate: PASS estritamente operacional.** Aprovação para o marcador canonical-reviewed-operational-not-expertise. A revisão não amplia os 35 contractReviewed, não transforma os 51 bindings em desempenho comprovado, não promove referências CANDIDATE a READ e não comprova execução em provedor/modelo.

- A versão corrigida compara a totalidade derivada dos canônicos: 172 agentes, 17 squads e 2.640 contratos de tarefa. Nenhum agente possui lista operacional vazia. Own de pool possui owner/hashes reais; foreign pool de especialista permanece descoberta; pools de orqx são delegação. claude-mastery-chief usa o título canônico de Orchestrator e diagnose passou com executionAuthorized:false.
- Oito adulterações independentes em memória foram rejeitadas: role, tarefa removida, mission, squad, autoridade de discovery, estado de review inválido, hash canônico e owner da tarefa. Role forjada e membership removida também foram rejeitadas pela montagem real do runtime; nenhum arquivo foi adulterado em disco para essas provas.
- Presença parcial de operational.cjs/operational-contracts.json foi rejeitada nas duas direções antes de montar contexto. Ausência conjunta conserva apenas compatibilidade legada explícita, sem alegação de operacionalidade revisada.
- Dez contextos positivos reais passaram: chief:diagnose; snps-orqx/snps:route; pm:create-prd; qa:gate; copy-editor:conduct-copy-audit; agent-forger:generate-agent-commands; animation-interpreter:build-animation-brief; e delegações dos orqx de animações/clonagem aos proprietários corretos. Model:null e execution.observed:false/provider:null preservados.
- Os 42 contratos novos passaram novamente após a correção: 30 finanças, 11 roadmap e 1 SOP, com ownerId exato e 4.104–4.593 caracteres. charsUsed corresponde ao JSON serializado. A revisão semântica verificou baseline e economia líquida em FinOps, unidade/janela e ausência de quantis fictícios em previsão, fonte oficial e jurisdição na área fiscal, comparação de versões sem atualização automática em roadmap, e passos/provas sem preencher lacunas na extração de SOP.
- Auditoria independente das entradas encontrou 1.088 exact-owner, 1.321 contratos sem autorização de execução, 66 explicit-registry e 172 workflows declarados. Não foi encontrado workflow de especialista executável contra proprietário estrangeiro indicado na metadata. Dezenove dependências Claude têm YAML TBD e Agent próprio no corpo; permanecem conservadoramente workflow/ownerPending, sem afirmar ownership preenchido no campo de origem.
- Os quatro títulos/kind/autores e queries de aquisição correspondem à documentação primária identificada; os quatro seguem CANDIDATE. Preservados 2 READ/88 CANDIDATE, 35 perfis contractReviewed e 51 bindings. Acessibilidade de livro não equivale à leitura integral, licença de redistribuição ou especialização mundial.

Snapshots revisados antes da alteração administrativa de status:

| Artefato | SHA-256 |
|---|---|
| scripts/expert-evolution/operational.cjs | 75f4fb13431a474ad33371cba9de1f7bd47ac7f456364033ac4c2c881a2a291b |
| research/expert-evolution/operational-contracts.json | 1db34f7b6c9ca35399bcd36d3c811da6191bb4dad5bd60fee424080edc74ec76 |
| scripts/framework-evolution/runtime.cjs | 657f0dcc2bc00a5685fdd6c5c558a999c03689b154d1c55316e87cfc50d89dd7 |
| .codex/scripts/resolve-codex-agent.js | b7c11daa9d1771b42d2157ba6e678a2473c594162bcd0146d19d886ab30fd264 |
| .codex/scripts/resolve-codex-command.js | f24717648f2a914ce56bf27cd10666c0a3ea17e68df00ecb3f5226df6a9bce15 |

Sem bloqueio adicional no escopo operacional revisto. A instalação opt-in, a biblioteca privada e os checks do projeto mantêm provas próprias. Esta revisão não fez gasto, upload, instalação global, execução de modelo, commit ou push. Alterações futuras nesses contratos exigem nova validação; esta aprovação não é permissão genérica de release/publicação.


### Revisão independente da extensão project-expert — fechamento (2026-10-02)

**Gate: PASS para preparar o snapshot 3 e instalar a extensão opt-in já autorizada, nos bytes abaixo.** A auditoria é de entrega e contexto operacional. Instalação real, readback dos dois provedores e conclusão da story continuam sendo responsabilidades de DevOps e do responsável pela story.

- Cobertura estrutural sem gaps observados: 2.092 entradas congeladas consumidas pelo runtime, mais três fontes de entrega no plano (2.095 pins). União independente de 1.754 caminhos canônicos/pointers/targets não encontrou ausências. Incluídos claude-code-mastery, targets de registry YAML, 51 bindings, módulos locais e grafo privado; a cobertura final registra 172 canônicos, 172 pointers, 2.640 memberships e 89 arquivos de referência privada.
- Root/locator: o helper devolve sourceRoot e activeProjectRoot verificados, e aceita locators canônico/tarefa somente entre os pins da fonte. Fixture com duas raízes divergentes leu o canônico/tarefa aprovados, escreveu output somente na raiz ativa e preservou hashes e mtimes das entradas em ambas. Locators ../outside.md e /outside.md foram rejeitados.
- Inputs somente leitura: sourceInputsReadOnly refere-se às entradas congeladas. Quando sourceRoot e activeProjectRoot coincidem, output novo fora dessas entradas passou, com hashes/mtimes preservados e contexto posterior ainda válido. As duas skills instruem leitura relativa à fonte e produção na raiz ativa; isto é um contrato de contexto, não uma alegação de bloqueio de filesystem por ACL.
- Publicação completa: loadLink exige receipt final da mesma transação e hash do registry, conjunto exato de arquivos, manifests/pins e ambas as skills de provedor antes do import. Ausência do receipt ou da skill Claude foi rejeitada sem criar o marcador de import. Não existe fallback silencioso para corpus HOME ou outro projeto.
- Preservação e confiança: plano é reconstruído a partir das fontes congeladas; destinos preexistentes são preservados, escritas e rollback usam comparações de conteúdo e lock exclusivo. Rollback conserva arquivos modificados concorrentemente e registra bloqueio. Biblioteca/capturas privadas permanecem no projeto; HOME recebe apenas a extensão e metadados/pins autorizados.
- HEAD é proveniência do congelamento: commit dos mesmos bytes congelados conserva a ligação; alteração de input/roster a invalida. A ligação depende da existência da worktree-fonte aprovada e exige refresh explícito quando suas entradas mudarem. Não presume que HEAD atual seja igual ao SHA histórico nem autoriza ampliar raízes.
- Verificação desta passagem: cinco probes finais independentes passaram (5/5, 22 casos não repetidos); antes foram verificados os 21 casos base e o negativo de target YAML. A suíte final de DevOps observada em project-expert-tests-27-final.json passou 27/27, sem falhas. Um probe anterior acusou diferença entre alias curto e caminho real do Windows; a fixture foi corrigida para comparar safeRoot, e a repetição final passou.
- Limites completos nos dez contextos reais registrados: máximo 11.830 caracteres de JSON, 5.973 de knowledge e 2.834 de profile, todos dentro de 12.000/6.000/3.000. ContextOnly/model:null/executionObserved:false não provam execução nativa nem ganho de comportamento ou disponibilidade de modelo.
- Refresh de whitespace aprovado por reconstrução dos hashes anteriores: 12 tarefas mudaram exclusivamente um espaço final na linha 42; 35 memberships receberam os novos hashes. A reconstrução do manifesto anterior correspondeu exatamente ao SHA 90a62e31f9ecc891e8a65da6e4611b463234a3d5c68890c31d21bb284a940280. Os 172 estados de revisão e toda autoridade/semântica foram preservados; o PASS operacional anterior não foi refeito nem ampliado.

| Artefato final | SHA-256 |
|---|---|
| scripts/framework-evolution/project-expert.cjs | ecc0333436782cfe447483e0cb352f77cb414e9e1a817c60eca0e43bb7cdc73e |
| scripts/framework-evolution/project-expert-install.cjs | 6152e1a18a757f32e72516a5c58dad9f689eae14269e228db6da9a3f2b6397f7 |
| .agents/skills e .claude/skills: sinapse-project-expert/SKILL.md (bytes iguais) | c1ceda227c67dbe6bc7afe539fc67fc11cbb83c493ddb5837f7a8acdf61a8cdd |
| tests/unit/project-expert-context.test.js | 3aab1f8636bb561184e1257e1cd29831cda09b966bd08d4581d0711b6402e0d7 |
| research/expert-evolution/operational-contracts.json após trim | f6267cde21566fc149a281b41e72d3fc3fe88d2b21d8487e685ff90af0bc53a4 |

Evidências: delivery/consumed-source-coverage-complete.json, delivery/complete-source-hashes.json, delivery/project-expert-tests-27-final.json, delivery/project-link-root-budget.json e whitespace-hash-refresh.json em examples/framework-quality/output/closeout-20261002. O readback da instalação definitiva precisa repetir os hashes atuais e os contextos/negativo de autoridade previstos.

Nenhum bloqueio material adicional no delta revisto. Não altera 35 contractReviewed, 51 bindings ou READ/CANDIDATE; não prova absorção integral de livros, execução de Claude/Codex ou qualidade criativa. Esta revisão não instalou, gastou créditos, enviou dados, fez commit/push nem autorizou publicação externa.
