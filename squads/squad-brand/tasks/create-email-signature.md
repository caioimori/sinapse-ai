---
task: create-email-signature
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

# Task: create-email-signature

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-email-signature`
- **Inputs:** Visual guidelines, logo, paleta, contatos
- **Outputs:** Email signature HTML responsivo

## Description
Cria email signature HTML com inline styles compativel com Gmail, Outlook e Apple Mail.

## Steps
1. Layout compacto (max 600px width, ~100px height)
2. HTML com inline styles APENAS (sem CSS externo, sem <style> tag)
3. Logo pequeno (max 100px width, hosted externamente)
4. Informacoes: nome, cargo, telefone, email, site
5. Links sociais com icones inline (PNG pequenos, nao SVG)
6. Cores da marca via inline styles (hex)
7. Separator line com cor da marca
8. Testar renderizacao em: Gmail web, Gmail mobile, Outlook desktop, Outlook web, Apple Mail
9. Criar fallback plain text
10. Documentar instrucoes de instalacao por email client

## Validation Criteria
- HTML inline only (sem CSS externo)
- Renderiza corretamente em 5 email clients
- Logo carrega de URL externa
- Max 600px width
- Fallback plain text disponivel

## Output Format
HTML file + instrucoes de instalacao + fallback plain text.
