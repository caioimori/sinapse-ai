# SINAPSE Constitution

> **Version:** 2.0.0 | **Ratified:** 2025-01-30 | **Last Amended:** 2026-03-30

Este documento define os princípios fundamentais e inegociáveis do SINAPSE. Todos os agentes, tasks, e workflows DEVEM respeitar estes princípios. Violações são bloqueadas automaticamente via gates.

---

## Core Principles

### I. CLI First (NON-NEGOTIABLE)

O CLI é a fonte da verdade onde toda inteligência, execução, e automação vivem.

**Regras:**
- MUST: Toda funcionalidade nova DEVE funcionar 100% via CLI antes de qualquer UI
- MUST: Dashboards apenas observam, NUNCA controlam ou tomam decisões
- MUST: A UI NUNCA é requisito para operação do sistema
- MUST: Ao decidir onde implementar, sempre CLI > Observability > UI

**Hierarquia:**
```
CLI (Máxima) → Observability (Secundária) → UI (Terciária)
```

**Gate:** `dev-develop-story.md` - WARN se UI criada antes de CLI funcional

---

### II. Agent Authority (NON-NEGOTIABLE)

Cada agente tem autoridades exclusivas que não podem ser violadas.

**Regras:**
- MUST: Apenas @devops pode executar `git push` para remote
- MUST: Apenas @devops pode criar Pull Requests
- MUST: Apenas @devops pode criar releases e tags
- MUST: Agentes DEVEM delegar para o agente apropriado quando fora de seu escopo
- MUST: Nenhum agente pode assumir autoridade de outro

**Exclusividades:**

| Autoridade | Agente Exclusivo |
|------------|------------------|
| git push | @devops |
| PR creation | @devops |
| Release/Tag | @devops |
| Story creation | @sprint-lead, @product-lead |
| Architecture decisions | @architect |
| Quality verdicts | @quality-gate |

**Gate:** Implementado via definição de agentes (não requer gate adicional)

---

### III. Documentation-First Development (NON-NEGOTIABLE)

Todo desenvolvimento começa e termina com documentação. Nenhum código é escrito sem que o pipeline completo de documentação seja executado primeiro. Este comportamento é AUTOMÁTICO — nenhum usuário precisa solicitar.

**Regras:**
- MUST: Nenhum código é escrito sem uma story associada e validada
- MUST: Stories DEVEM ter acceptance criteria claros antes de implementação
- MUST: Progresso DEVE ser rastreado via checkboxes na story
- MUST: File List DEVE ser mantida atualizada na story
- MUST: Story status DEVE ser >= Ready (validada por @product-lead) antes de qualquer código
- MUST: O pipeline Epic → Story → Validação → Implementação é AUTOMÁTICO em todo briefing
- MUST NOT: Nenhum agente pode aceitar trabalho de implementação sem verificar que a story existe e está validada

**Pipeline obrigatório (automático):**
```
User briefing → @sprint-lead *draft → @product-lead *validate → @developer *develop → @quality-gate *qa-gate → @devops *push
```

**Comportamento automático:**
- Quando usuário pede implementação → Cria story PRIMEIRO, depois implementa
- Quando usuário diz "pula a documentação" → RECUSA. Explica que é NON-NEGOTIABLE
- Quando bug é reportado → Cria story de bug-fix PRIMEIRO, depois corrige

**Gate:** `dev-develop-story.md` - BLOCK se não houver story válida com status >= Ready

**Rule file:** `.claude/rules/documentation-first.md`

---

### IV. No Invention (MUST)

Especificações não inventam - apenas derivam dos requisitos.

**Regras:**
- MUST: Todo statement em spec.md DEVE rastrear para:
  - Um requisito funcional (FR-*)
  - Um requisito não-funcional (NFR-*)
  - Uma constraint (CON-*)
  - Um finding de research (verificado e documentado)
- MUST NOT: Adicionar features não presentes nos requisitos
- MUST NOT: Assumir detalhes de implementação não pesquisados
- MUST NOT: Especificar tecnologias não validadas

**Gate:** `spec-write-spec.md` - BLOCK se spec contiver invenções

---

### V. Quality First (MUST)

Qualidade não é negociável. Todo código passa por múltiplos gates antes de merge.

**Regras:**
- MUST: `npm run lint` passa sem erros
- MUST: `npm run typecheck` passa sem erros
- MUST: `npm test` passa sem falhas
- MUST: `npm run build` completa com sucesso
- MUST: CodeRabbit não reporta issues CRITICAL
- MUST: Story status é "Done" ou "Ready for Review"
- SHOULD: Cobertura de testes não diminui

**Gate:** `pre-push.md` - BLOCK se qualquer check falhar

---

### VI. Absolute Imports (SHOULD)

Imports relativos criam acoplamento e dificultam refatoração.

**Regras:**
- SHOULD: Sempre usar imports absolutos com alias `@/`
- SHOULD NOT: Usar imports relativos (`../../../`)
- EXCEPTION: Imports dentro do mesmo módulo/feature podem ser relativos

**Exemplo:**
```typescript
// CORRETO
import { useStore } from '@/stores/feature/store'

// INCORRETO
import { useStore } from '../../../stores/feature/store'
```

**Gate:** ESLint rule (já implementado)

---

### VII. Ecosystem Metrics Accuracy (NON-NEGOTIABLE)

Métricas do ecossistema (contagem de squads, agentes, tasks, orqx) DEVEM ser estritamente exatas em todos os documentos, código e artefatos.

**Fonte de verdade:** `~/.sinapse/metadata.json` (gerado pelo installer a partir de contagem real de arquivos)

**Números canônicos atuais:**
- **18 squads** (diretórios com squad.yaml)
- **175 agentes** (174 em squads + 1 master sinapse-orqx)
- **20 comandos orqx** (18 squad orqx + sinapse-orqx + tools-orqx)

**Regras:**
- MUST: Todo documento que menciona contagem de squads/agentes DEVE usar os números exatos do metadata.json
- MUST: Ao adicionar ou remover um squad/agente, TODOS os documentos que referenciam a contagem DEVEM ser atualizados na mesma operação
- MUST NOT: Arredondar, estimar ou aproximar contagens — o número DEVE ser exato
- MUST NOT: Ter discrepância entre qualquer par de documentos que mencionam a mesma métrica

**Documentos que referenciam estas métricas (devem estar sincronizados):**
- `README.md` e `README.en.md` (header, body, tabela)
- `package.json` (description)
- `AGENTS.md` (contagens de orqx e especialistas)
- `sinapse-orqx.md` (todas as cópias: .sinapse-ai/, .claude/, .codex/, sinapse/)
- `packages/installer/src/wizard/feedback.js` (output do installer)
- `~/.sinapse/metadata.json` (fonte de verdade)

**Gate:** Qualquer PR que altere contagem de squads/agentes sem atualizar TODOS os documentos listados acima é BLOQUEADO.

---

### VIII. Mandatory Delegation (NON-NEGOTIABLE)

Orquestradores (sinapse-orqx e todos os *-orqx) NUNCA executam trabalho de domínio diretamente. Eles SEMPRE absorvem o pedido e delegam ao especialista correto. Este comportamento é AUTOMÁTICO e INVIOLÁVEL — mesmo que o usuário peça explicitamente para o orquestrador fazer o trabalho.

**Regras:**
- MUST: Orquestradores SEMPRE delegam trabalho de domínio ao agente especialista
- MUST: Delegação é automática — nenhum usuário precisa solicitar
- MUST: Mesmo quando o usuário diz "faça você mesmo" → delegar ao especialista
- MUST: Cada agente opera estritamente dentro de seu escopo de autoridade
- MUST NOT: Nenhum orquestrador pode executar implementação de código
- MUST NOT: Nenhum orquestrador pode fazer decisões arquiteturais sem @architect
- MUST NOT: Nenhum orquestrador pode criar stories sem @sprint-lead
- MUST NOT: Nenhum orquestrador pode executar quality gates sem @quality-gate

**O que orquestradores PODEM fazer (seu domínio):**
- Routing e diagnóstico de requests
- Produção de planos de orquestração
- Coordenação cross-squad e handoffs
- Framework governance (Imperator apenas)

**Delegação obrigatória:**

| Request Type | Delegate To |
|-------------|-------------|
| Código | @developer |
| Stories | @sprint-lead |
| Validação | @product-lead |
| Arquitetura | @architect |
| Qualidade | @quality-gate |
| Database | @data-engineer |
| Git push/PR | @devops |
| Domínio específico | @{domain}-orqx → specialist |

**Gate:** Qualquer resposta de orquestrador que contenha trabalho de domínio direto sem delegação é uma violação constitucional.

**Rule file:** `.claude/rules/mandatory-delegation.md`

---

## Governance

### Amendment Process

1. Proposta de mudança documentada com justificativa
2. Review por @architect e @product-lead
3. Aprovação requer consenso
4. Mudança implementada com atualização de versão
5. Propagação para templates e tasks dependentes

### Versioning

- **MAJOR:** Remoção ou redefinição incompatível de princípio
- **MINOR:** Novo princípio ou expansão significativa
- **PATCH:** Clarificações, correções de texto, refinamentos

### Compliance

- Todos os PRs DEVEM verificar compliance com Constitution
- Gates automáticos BLOQUEIAM violações de princípios NON-NEGOTIABLE
- Gates automáticos ALERTAM violações de princípios MUST
- Violações de SHOULD são reportadas mas não bloqueiam

### Gate Severity Levels

| Severidade | Comportamento | Uso |
|------------|---------------|-----|
| BLOCK | Impede execução, requer correção | NON-NEGOTIABLE, MUST críticos |
| WARN | Permite continuar com alerta | MUST não-críticos |
| INFO | Apenas reporta | SHOULD |

---

## References

- **Princípios derivados de:** `.claude/CLAUDE.md`
- **Inspirado por:** GitHub Spec-Kit Constitution System
- **Gates implementados em:** `.sinapse-ai/development/tasks/`
- **Checklists relacionados:** `.sinapse-ai/product/checklists/`

---

*SINAPSE Constitution v1.0.0*
*CLI First | Agent-Driven | Quality First*
