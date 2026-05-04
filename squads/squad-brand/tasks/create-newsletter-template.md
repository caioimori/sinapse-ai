---
task: create-newsletter-template
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

# Task: create-newsletter-template

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-newsletter`
- **Inputs:** Visual guidelines, paleta, tipografia, logo
- **Outputs:** Newsletter HTML template responsivo

## Description
Cria template de email newsletter HTML responsivo e brandado.

## Steps
1. Layout max 600px width (padrao email)
2. Header: logo centralizado + nav links (opcinal)
3. Hero section: imagem de destaque + titulo + CTA
4. Content blocks: 1-col (artigo) e 2-col (features lado a lado)
5. CTA buttons: cor acento, padding generoso, texto acionavel
6. Footer: unsubscribe link (obrigatorio), social icons, dados legais, endereco fisico
7. Aplicar cores da marca via inline styles
8. Testar em email clients: Gmail (web + mobile), Outlook (desktop + web), Apple Mail
9. Garantir fallback para imagens bloqueadas (alt text, background colors)
10. Criar versao plain text como fallback

## Validation Criteria
- Max 600px width
- Renderiza em 5+ email clients
- Unsubscribe link presente
- Fallback para imagens bloqueadas
- Responsivo em mobile

## Output Format
HTML file + preview screenshots + instrucoes de uso em ESP (Mailchimp, SendGrid).
