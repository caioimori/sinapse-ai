---
task: assemble-delivery-package
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

# Task: assemble-delivery-package

## Metadata
- **Agent:** brand-compiler (Atlas)
- **Squad:** squad-brand
- **Trigger:** `*assemble-delivery-package`
- **Inputs:** Brandbook, quick reference, todos os assets, tokens, audio, templates
- **Outputs:** Delivery package completo organizado

## Description
Monta o delivery package final — tudo organizado para entrega ao cliente.

## Steps
1. Criar estrutura de pastas:
   ```
   /{brand_name}-brand-system-v{version}/
   ├── 01-brandbook/          (PDF + web)
   ├── 02-quick-reference/    (PDF)
   ├── 03-assets/
   │   ├── logos/             (SVG + PNG @1x @2x @4x + favicon)
   │   ├── icons/             (SVG + sprite + PNG)
   │   ├── patterns/          (SVG 3 densidades)
   │   ├── mockups/           (por categoria)
   │   ├── apparel/           (por peca)
   │   ├── social-templates/  (por plataforma)
   │   └── video-templates/   (AE + Lottie + CSS)
   ├── 04-tokens/             (CSS + JSON + Tailwind + SCSS)
   ├── 05-fonts/              (webfonts + desktop)
   ├── 06-audio/              (logo + notifications + beds)
   ├── 07-templates/          (presentations + documents + email)
   ├── 08-guidelines/         (photography + illustration)
   ├── 09-onboarding/         (onboarding guide)
   ├── 10-governance/         (governance doc)
   ├── README.md              (indice + instrucoes de uso)
   └── CHANGELOG.md           (versao + historico)
   ```
2. Copiar todos os arquivos para estrutura
3. Verificar completude (zero pastas vazias)
4. Criar README.md com indice e instrucoes
5. Criar CHANGELOG.md com versao v1.0.0
6. Gerar ZIP para download

## Validation Criteria
- Todas as 10 pastas com conteudo
- Zero pastas vazias
- README com indice completo
- CHANGELOG com versao
- ZIP geravel

## Output Format
Delivery package organizado + ZIP.
