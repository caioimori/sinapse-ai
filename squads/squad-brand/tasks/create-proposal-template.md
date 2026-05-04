---
task: create-proposal-template
responsavel: "@brand-collateral-designer"
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

# Task: create-proposal-template

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-proposal-template`
- **Inputs:** Visual guidelines, tipografia, paleta
- **Outputs:** Document templates (proposal, report, contract)

## Description
Cria templates de documentos corporativos brandados — proposals, reports e contracts.

## Steps
1. **Proposal comercial:** capa brandada, indice, sobre nos, problema/solucao, escopo, metodologia, timeline, pricing table, termos, assinatura
2. **Report/relatorio:** capa, executive summary, secoes de dados com charts, conclusao, anexos
3. **Contract/agreement:** header juridico com logo, footer com paginacao, tabela de clausulas, assinaturas
4. Para todos: definir estilos de paragrafo (normal, heading 1-3, lista, citacao, tabela, caption)
5. Aplicar tipografia do sistema
6. Aplicar cores nos headers, tabelas e acentos
7. Incluir header/footer com logo e paginacao
8. Garantir impressibilidade (A4, margens adequadas)
9. Exportar em formato editavel (DOCX, Google Docs)

## Validation Criteria
- 3 tipos de documento criados
- Estilos de paragrafo definidos e aplicados
- Brandados mas profissionais (nao over-designed)
- Impressiveis em A4
- Editaveis pelo usuario

## Output Format
Templates DOCX/Google Docs + guia de estilos.
