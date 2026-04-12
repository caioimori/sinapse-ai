---
task: integrate-brand-visual-assets
responsavel: "@platform-specialist"
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

# Task: Integrate Brand Visual Assets

> Integrar assets visuais da marca (cores, fontes, templates) na producao de conteudo.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-governor (Index) |
| **Trigger** | Producao de conteudo que requer elementos visuais de marca |
| **Input** | Brand guidelines visuais (do squad brand-system), conteudo textual |
| **Output** | Briefing visual integrado com specs de marca para design |
| **Handoff** | → content-governor (Index) para validacao de brand consistency |
| **Complexity** | simple |

---

## Fundamentacao

Conteudo textual sem consistencia visual e conteudo pela metade. A integracao de assets visuais garante que cada peca reflete a identidade visual da marca. Isso inclui: paleta de cores, tipografia, estilo fotografico, iconografia, e templates visuais. A integracao e a ponte entre brand-system (diretrizes) e content-intelligence (producao). Referencia: cross-squad integration com brand-system squad.

---

## Steps

### Step 1: Consultar Brand Guidelines Visuais
Acessar diretrizes visuais do brand-system: cores primarias/secundarias, tipografia aprovada, estilo de imagem, iconografia, espacamento, marca d'agua.

### Step 2: Definir Specs Visuais por Peca
Para cada peca: quais elementos visuais? Template de design, cores dominantes, fonte, estilo de imagem (fotografia, ilustracao, grafico). Criar briefing visual.

### Step 3: Verificar Consistencia com Portfolio
O visual da peca se encaixa no portfolio existente? Abrir feed/perfil e verificar se a nova peca mantem a coerencia visual com as anteriores.

### Step 4: Indicar Adaptacoes por Plataforma
Mesma identidade visual, ajustada por plataforma: Instagram mais visual/limpo, LinkedIn mais profissional/sóbrio, TikTok mais despojado/autêntico.

### Step 5: Handoff

```yaml
handoff:
  artifact: "visual-brief-{peca}.md"
  context: "Brief visual: cores {paleta}, fonte {tipografia}, estilo {estilo}, template {template}"
  next: "content-governor (Index) para validacao de brand consistency"
```
