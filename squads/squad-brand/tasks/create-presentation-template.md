---
task: create-presentation-template
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

# Task: create-presentation-template

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-presentation`
- **Inputs:** Visual guidelines, design system, tipografia
- **Outputs:** Presentation template (8 slide types) em 3 formatos

## Description
Cria template de apresentacao com 8 tipos de slide brandados.

## Steps
1. Definir grid 16:9 (1920x1080px)
2. Criar 8 slide types:
   - **Title:** logo + titulo + subtitulo + background brandado
   - **Section Divider:** numero + titulo de secao + accent color
   - **Content + Image:** texto esquerda + imagem direita (ou vice-versa)
   - **Two-Column:** para comparacoes lado a lado
   - **Stats/Numbers:** numeros grandes + contexto + icones
   - **Quote:** citacao destacada + autor + aspas graficas
   - **Team:** grid de fotos + nomes + cargos
   - **Thank You/CTA:** agradecimento + CTA + contatos + socials
3. Aplicar tipografia do sistema (display para titulos, body para conteudo)
4. Aplicar paleta de cores (background, texto, acentos)
5. Incluir elementos graficos do vocabulario visual
6. Garantir legibilidade a distancia (projecao)
7. Exportar em 3 formatos: Google Slides, PPTX, PDF
8. Documentar como customizar cada slide

## Validation Criteria
- 8 tipos de slide criados
- Grid 16:9 consistente
- Tipografia e cores do sistema
- Legivel em projecao
- 3 formatos exportados

## Output Format
Template em Google Slides + PPTX + PDF + guia de customizacao.
