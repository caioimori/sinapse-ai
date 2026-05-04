---
task: create-thumbnail-templates
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

# Task: create-thumbnail-templates

## Metadata
- **Agent:** brand-collateral-designer (Vellum)
- **Squad:** squad-brand
- **Trigger:** `*create-thumbnails`
- **Inputs:** Visual guidelines, tipografia, paleta
- **Outputs:** Thumbnail templates por plataforma

## Description
Cria templates de thumbnail otimizados para cada plataforma — o visual que decide se alguem clica.

## Steps
1. YouTube (1280x720): titulo grande e legivel em miniatura, imagem forte/rosto, branding sutil (logo corner), max 3-4 palavras, contraste alto
2. Blog/Article OG (1200x630): titulo + imagem + logo, funciona como preview em social share
3. Podcast cover (3000x3000): titulo do podcast + artwork + logo, legivel em 100x100
4. LinkedIn article (1200x627): profissional, titulo + imagem + branding corporativo
5. Hierarquia visual que funciona em tamanho PEQUENO (mobile feed = ~150px)
6. Testar legibilidade em miniatura (50% do tamanho)
7. Criar 3 variacoes por plataforma (texto, foto, grafico)

## Validation Criteria
- Legivel em tamanho miniatura (mobile feed)
- Hierarquia visual clara (titulo > imagem > logo)
- Max 3-4 palavras no titulo
- Contraste alto para legibilidade

## Output Format
Templates por plataforma com 3 variacoes cada.
