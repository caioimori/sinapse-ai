---
task: create-governance-document
responsavel: "@brand-compiler"
responsavel_type: Agent
atomic_layer: Task
elicit: false

Entrada:
  - campo: context
    tipo: object
    origem: "workflow ou manual"
    obrigatorio: true

Saida:
  - campo: resultado
    tipo: document
    destino: "stakeholders"

Checklist:
  - "[ ] Validar inputs e pre-condicoes"
  - "[ ] Executar steps conforme documentado"
  - "[ ] Verificar criterios de qualidade"
  - "[ ] Gerar output no formato especificado"
---

# Task: create-governance-document

## Metadata
- **Agent:** brand-compiler (Atlas)
- **Squad:** squad-brand
- **Trigger:** `*create-governance`
- **Inputs:** Guidelines completas, brand architecture, stakeholders
- **Outputs:** Brand governance document (5-10 paginas)

## Description
Cria documento de governanca — quem pode fazer o que com a marca e como.

## Steps
1. **Quem aprova uso da marca:** matrix de aprovacao por tipo (logo uso, co-branding, campanha)
2. **Processo de aprovacao:** fluxo com responsaveis e SLA por tipo de solicitacao
3. **Regras de licenciamento:**
   - Parceiros: como podem usar a marca (logo endorsado, co-branding rules)
   - Sponsorships: o que e permitido, templates de aplicacao
   - Third-party: restricoes de uso por terceiros
4. **Processo de atualizacao:** quem pode propor mudancas, comite de aprovacao, versionamento
5. **Monitoramento:** como detectar uso incorreto (Google Alerts, social monitoring, auditorias periodicas)
6. **Escalacao:** o que fazer quando uso incorreto e detectado (interno vs externo)
7. **Contatos:** responsaveis por brand management, email, telefone

## Validation Criteria
- Matrix de aprovacao clara
- Processo de aprovacao com SLA
- Regras de licenciamento praticas
- Processo de atualizacao definido
- Contatos atualizados

## Output Format
Governance document PDF + versao editavel.
