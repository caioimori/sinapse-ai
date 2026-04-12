---
task: create-social-templates
responsavel: "@brand-creative-engineer"
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

# Task: create-social-templates

## Metadata
- **Agent:** brand-creative-engineer (Forge)
- **Squad:** squad-brand
- **Trigger:** `*create-social-template`
- **Inputs:** Design system, visual guidelines, social voice guide
- **Outputs:** Templates HTML/CSS por plataforma e formato

## Description
Cria templates de social media em HTML/CSS reutilizaveis e parametrizaveis.

## Steps
1. Definir formatos por plataforma:
   - Instagram Feed: 1080x1080
   - Instagram Story: 1080x1920
   - LinkedIn Post: 1200x627
   - Twitter/X: 1200x675
   - YouTube Thumbnail: 1280x720
   - Facebook Cover: 820x312
   - OG Image: 1200x630
2. Para cada formato, criar templates:
   - Quote post (citacao + autor + logo)
   - Info post (titulo + bullets + icones)
   - Photo post (imagem + overlay + logo)
   - CTA post (headline + CTA button + logo)
   - Stats post (numero grande + contexto)
3. Aplicar grid do design system, tipografia e cores
4. Posicionar logo consistentemente (canto inferior direito padrao)
5. Garantir texto legivel em tamanho mobile (feed scroll)
6. Criar versao HTML/CSS editavel (parametros: texto, imagem, cor)
7. Incluir thumbnail templates (YouTube, blog, podcast)

## Validation Criteria
- Todos os formatos por plataforma criados
- Templates sao parametrizaveis (faceis de editar)
- Texto legivel em mobile
- Logo consistente em todos os templates
- Alinhados com design system

## Output Format
Pasta /assets/social-templates/ organizada por plataforma e tipo.
