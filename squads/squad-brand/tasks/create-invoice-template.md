---
task: create-invoice-template
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

# Task: create-invoice-template

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-invoice`
- **Inputs:** Visual guidelines, logo, dados empresa
- **Outputs:** Invoice/receipt template brandado

## Description
Cria template de fatura/recibo profissional e brandado.

## Steps
1. Header: logo + razao social + CNPJ + endereco + contatos
2. Dados da fatura: numero, data emissao, data vencimento
3. Dados do cliente: nome/empresa, CNPJ/CPF, endereco
4. Tabela de itens: descricao, quantidade, valor unitario, total por item
5. Subtotal + impostos (se aplicavel) + total destacado (tamanho grande, cor acento)
6. Condicoes de pagamento: prazo, multa, juros
7. Footer: dados bancarios, chave PIX, QR code para pagamento
8. Design limpo e profissional (legibilidade > decoracao)
9. Formato A4 imprimivel + PDF geravel

## Validation Criteria
- Todas as informacoes legais presentes
- Total destacado visualmente
- Dados bancarios/PIX corretos
- Imprimivel em A4
- Profissional e legivel

## Output Format
Template editavel (DOCX/Sheets) + PDF example + specs.
