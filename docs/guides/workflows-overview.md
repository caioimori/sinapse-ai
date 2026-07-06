# Visao Geral dos Workflows

> Os 4 workflows primarios do SINAPSE-AI com diagramas visuais.

---

## 1. Story Development Cycle (SDC)

**O workflow principal.** Todo desenvolvimento de software segue este ciclo.

```
  Phase 1         Phase 2          Phase 3          Phase 4         Phase 5
  CREATE          VALIDATE         IMPLEMENT        QA GATE         DEPLOY
+----------+   +----------+   +-------------+   +----------+   +----------+
|  @sprint |   | @product |   | @developer  |   | @quality |   | @devops  |
|  -lead   |-->|  -lead   |-->|   (Pixel)   |-->|  -gate   |-->|(Pipeline)|
|  (Sync)  |   |  (Axis)  |   |             |   | (Litmus) |   |          |
+----------+   +----------+   +-------------+   +----------+   +----------+
| *draft   |   | *validate|   | *develop    |   | *qa-gate |   | *push    |
| Story    |   | 10-point |   | YOLO/Inter/ |   | 7 checks |   | PR +     |
| criada   |   | checklist|   | Pre-Flight  |   | PASS/FAIL|   | Review   |
+----------+   +----------+   +-------------+   +----------+   +----------+
  Status:        Status:         Status:          Status:        Status:
  Draft          Ready           InProgress       InReview       Done
```

### Fases Detalhadas

**Phase 1: Create** (@sprint-lead / Sync)
- Cria story em `docs/stories/` com template padrao
- Define: titulo, descricao, acceptance criteria, escopo IN/OUT, dependencias
- Status inicial: **Draft**

**Phase 2: Validate** (@product-lead / Axis)
- Aplica checklist de 10 pontos:
  1. Titulo claro e objetivo
  2. Descricao completa
  3. Acceptance criteria testaveis (Given/When/Then)
  4. Escopo bem definido (IN e OUT)
  5. Dependencias mapeadas
  6. Estimativa de complexidade
  7. Valor de negocio claro
  8. Riscos documentados
  9. Criterios de Done definidos
  10. Alinhamento com PRD/Epic
- Decisao: GO (>=7/10) ou NO-GO (com fixes obrigatorios)
- Status apos GO: **Ready**

**Phase 3: Implement** (@developer / Pixel)
- Tres modos de execucao:
  - **YOLO:** autonomo, 0-1 prompts, decisoes logadas
  - **Interactive:** 5-10 prompts, checkpoints educacionais
  - **Pre-Flight:** perguntas upfront, plano antes de executar
- CodeRabbit self-healing: max 2 iteracoes para issues CRITICAL
- Status: **InProgress**

**Phase 4: QA Gate** (@quality-gate / Litmus)
- 7 verificacoes de qualidade:
  1. Code review (padroes, legibilidade)
  2. Testes unitarios (cobertura, todos passando)
  3. Acceptance criteria (todos atendidos)
  4. Sem regressoes
  5. Performance aceitavel
  6. Seguranca (OWASP basico)
  7. Documentacao atualizada
- Verdicts: PASS | CONCERNS | FAIL | WAIVED
- Status apos PASS: **InReview**

**Phase 5: Deploy** (@devops / Pipeline)
- `git push` para remote (autoridade EXCLUSIVA)
- Cria PR com reviewer assignment
- CI executa (lint, typecheck, testes)
- Apos aprovacao e merge: **Done**

---

## 2. QA Loop

**Ciclo iterativo de revisao-correcao.** Usado apos o QA Gate inicial quando issues sao encontradas.

```
                    +---> APPROVE ---> Done
                    |
+----------+   +---+----+   +----------+
| @quality |   |        |   |@developer|
|  -gate   |-->| Verdict|   | (Pixel)  |
| (Litmus) |   |        |   |          |
+----------+   +---+----+   +----------+
     ^              |              |
     |              +---> REJECT --+
     |                    (fixes)  |
     +-----------------------------+
          max 5 iteracoes
```

### Fluxo

```
@quality-gate review
        |
        v
    Verdict?
   /    |    \
APPROVE REJECT BLOCKED
  |       |       |
  v       v       v
 Done   @dev    Escalate
        fixes   imediato
          |
          v
       Re-review
    (volta ao topo)
```

### Comandos

| Comando | Funcao |
|---------|--------|
| `*qa-loop {storyId}` | Inicia o loop |
| `*qa-loop-review` | Resume da fase de review |
| `*qa-loop-fix` | Resume da fase de fix |
| `*stop-qa-loop` | Pausa e salva estado |
| `*resume-qa-loop` | Resume do estado salvo |
| `*escalate-qa-loop` | Forca escalacao manual |

### Regras

- **Maximo 5 iteracoes** --- apos isso, escalacao automatica
- **3 verdicts possiveis:**
  - APPROVE: completo, marca Done
  - REJECT: @developer corrige, re-review
  - BLOCKED: escalacao imediata

### Triggers de Escalacao

- `max_iterations_reached` (atingiu 5 iteracoes)
- `verdict_blocked` (issue que @developer nao pode resolver)
- `fix_failure` (tentativa de fix falhou)
- `manual_escalate` (usuario forcou escalacao)

---

## 3. Spec Pipeline

**Transforma requisitos informais em especificacao executavel.** Usado antes do SDC para features complexas.

```
  Phase 1       Phase 2       Phase 3       Phase 4       Phase 5       Phase 6
  GATHER        ASSESS        RESEARCH      WRITE         CRITIQUE      PLAN
+----------+ +----------+ +----------+ +----------+ +----------+ +----------+
| @project | |@architect| | @analyst | | @project | | @quality | |@architect|
|  -lead   | | (Stratum)| |  (Scope) | |  -lead   | |  -gate   | | (Stratum)|
| (Beacon) | |          | |          | | (Beacon) | | (Litmus) | |          |
+----------+ +----------+ +----------+ +----------+ +----------+ +----------+
| require- | |complexity| | research | | spec.md  | | critique | | impl.    |
| ments    | |   .json  | |   .json  | | completo | |   .json  | |   .yaml  |
| .json    | |          | |          | |          | |          | |          |
+----------+ +----------+ +----------+ +----------+ +----------+ +----------+
                                                          |
                                                     >=4.0? APPROVED
                                                     3.0-3.9? NEEDS_REVISION
                                                     <3.0? BLOCKED
```

### Classes de Complexidade

A complexidade e avaliada em 5 dimensoes (1-5 cada):

| Dimensao | O que avalia |
|----------|-------------|
| Scope | Quantidade de arquivos afetados |
| Integration | APIs e servicos externos |
| Infrastructure | Mudancas de infraestrutura |
| Knowledge | Familiaridade da equipe |
| Risk | Criticidade e impacto |

| Score Total | Classe | Fases Executadas |
|-------------|--------|-----------------|
| <= 8 | SIMPLE | 1, 4, 5 (3 fases) |
| 9-15 | STANDARD | Todas as 6 fases |
| >= 16 | COMPLEX | 6 fases + ciclo de revisao |

### Gate Constitucional (Art. IV)

Todo statement em `spec.md` DEVE rastrear para:
- Requisito funcional (FR-*)
- Requisito nao-funcional (NFR-*)
- Constraint (CON-*)
- Finding de research documentado

**Nenhuma feature inventada e permitida.**

---

## 4. Brownfield Discovery

**Avaliacao de divida tecnica em 10 fases.** Usado ao entrar em um projeto existente.

```
  DATA COLLECTION (1-3)        DRAFT & VALIDATION (4-7)      FINALIZATION (8-10)
+------------------------+   +-------------------------+   +---------------------+
|                        |   |                         |   |                     |
| Phase 1: @architect    |   | Phase 4: @architect     |   | Phase 8: @architect |
|   system-architecture  |   |   tech-debt-DRAFT       |   |   tech-debt (final) |
|                        |   |                         |   |                     |
| Phase 2: @data-engineer|   | Phase 5: @data-engineer |   | Phase 9: @analyst   |
|   SCHEMA + DB-AUDIT    |   |   db-specialist-review  |   |   TECH-DEBT-REPORT  |
|                        |   |                         |   |                     |
| Phase 3: @ux-design    |   | Phase 6: @ux-design     |   | Phase 10: @project  |
|   frontend-spec        |   |   ux-specialist-review  |   |   -lead: Epic +     |
|                        |   |                         |   |   stories prontas   |
|                        |   | Phase 7: @quality-gate  |   |                     |
|                        |   |   QA review (APPROVED   |   |                     |
|                        |   |   ou NEEDS WORK)        |   |                     |
+------------------------+   +-------------------------+   +---------------------+
```

### Fases

| Fase | Agente | Output |
|------|--------|--------|
| 1 | @architect (Stratum) | `system-architecture.md` |
| 2 | @data-engineer (Tensor) | `SCHEMA.md` + `DB-AUDIT.md` |
| 3 | @ux-design-expert (Mosaic) | `frontend-spec.md` |
| 4 | @architect (Stratum) | `technical-debt-DRAFT.md` |
| 5 | @data-engineer (Tensor) | `db-specialist-review.md` |
| 6 | @ux-design-expert (Mosaic) | `ux-specialist-review.md` |
| 7 | @quality-gate (Litmus) | `qa-review.md` |
| 8 | @architect (Stratum) | `technical-debt-assessment.md` (final) |
| 9 | @analyst (Scope) | `TECHNICAL-DEBT-REPORT.md` (executivo) |
| 10 | @project-lead (Beacon) | Epic + stories prontas para SDC |

**QA Gate (Fase 7):**
- APPROVED: debitos validados, sem gaps criticos
- NEEDS WORK: gaps nao endereados, volta para Fase 4

---

## Guia de Selecao de Workflow

**Qual workflow usar em cada situacao?**

| Situacao | Workflow | Por que |
|----------|---------|---------|
| Nova story de um epic | SDC | Fluxo padrao completo |
| QA encontrou issues, precisa iterar | QA Loop | Ciclo automatico de fix-review |
| Feature complexa precisa de spec | Spec Pipeline → SDC | Especificacao antes de implementacao |
| Entrando em projeto existente | Brownfield Discovery | Mapear divida tecnica primeiro |
| Bug fix simples | SDC (modo YOLO) | Fluxo padrao, execucao rapida |
| Mudanca arquitetural | Spec Pipeline → SDC | Complexidade exige especificacao |

### Arvore de Decisao

```
O trabalho e em projeto novo ou existente?
  |
  +-- Existente (primeira vez) --> Brownfield Discovery
  |
  +-- Ja conhego o projeto
        |
        +-- E uma feature complexa? --> Spec Pipeline, depois SDC
        |
        +-- E uma feature/bug normal? --> SDC direto
              |
              +-- QA encontrou issues? --> QA Loop
```

---

## Modos de Execucao do @developer

O SDC Phase 3 suporta 3 modos. Escolha baseado na situacao:

| Modo | Prompts | Melhor Para |
|------|---------|-------------|
| **YOLO** | 0-1 | Tasks simples, deterministicas, baixo risco |
| **Interactive** | 5-10 | Aprendizado, decisoes complexas, primeiro contato |
| **Pre-Flight** | 10-15 upfront | Requisitos ambiguos, trabalho critico, alta complexidade |

---

_Veja tambem: [Agent Reference](agent-reference.md) | [Architecture Overview](../framework/architecture-overview.md) | [Story Lifecycle](../../CONTRIBUTING.md)_
