---
task: define-cultural-adaptation-guidelines
responsavel: "@brand-strategist"
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

# Task: Define Cultural Adaptation Guidelines

> Criar guidelines para adaptação cultural da marca em diferentes mercados e regiões.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-strategist (Athena) |
| **Co-agents** | brand-culture-architect (Ethos) validação cultural, brand-identity-designer (Iris) adaptação visual |
| **Trigger** | Quando marca opera ou planeja operar em múltiplos mercados/culturas |
| **Input** | Brand Identity Prism, posicionamento, paleta visual, tom de voz, mercados-alvo |
| **Output** | `cultural-adaptation-guidelines.md` |
| **Handoff** | → brand-compiler (Atlas) para inclusão no brandbook |
| **Referências** | Marieke de Mooij "Global Marketing & Advertising", Hofstede Cultural Dimensions, Erin Meyer "The Culture Map" |

---

## Fundamentação

Marcas globais de excelência (Apple, Nike, Coca-Cola, Unilever) mantêm um equilíbrio entre consistência global e relevância local. O framework "Glocal" — think globally, act locally — é o padrão de agências tier-1 (Interbrand, Landor, Wolff Olins).

```
     GLOBAL (Core Brand DNA)
         ┌─────────┐
         │ LOCKED   │  Nunca muda: logo, valores, propósito
         ├─────────┤
         │ FLEX     │  Adapta: tom, imagery, expressão
         ├─────────┤
         │ LOCAL    │  Cria: conteúdo, parcerias, rituais
         └─────────┘
     LOCAL (Market Relevance)
```

---

## Steps

### Step 1: Classificar Modelo de Adaptação
Definir o nível de flexibilidade da marca:

| Modelo | Descrição | Quando Usar | Exemplos |
|--------|-----------|-------------|----------|
| **Standardized** | 95% idêntico global | Luxury, tech premium | Apple, Rolex |
| **Adapted** | Core fixo + expressão local | FMCG, retail | Coca-Cola, McDonald's |
| **Federated** | Guidelines + liberdade local | Multi-brand, B2B | Unilever, P&G |
| **Localized** | Marcas separadas por mercado | Quando culturas divergem demais | Dettol/Lysol |

**Decisão para esta marca:** {modelo escolhido + justificativa}

### Step 2: Mapear Dimensões Culturais por Mercado
Para cada mercado-alvo, avaliar com Hofstede + Meyer:

| Dimensão | Mercado 1 | Mercado 2 | Mercado 3 | Implicação para Marca |
|----------|-----------|-----------|-----------|----------------------|
| Power Distance (alto/baixo) | | | | Tom: igualitário vs hierárquico |
| Individualism vs Collectivism | | | | Messaging: "eu" vs "nós" |
| Masculinity vs Femininity | | | | Valores: achievement vs care |
| Uncertainty Avoidance | | | | Confiança: dados vs emoção |
| Long-term Orientation | | | | Narrativa: tradição vs inovação |
| Indulgence vs Restraint | | | | Visual: exuberante vs contido |
| Communication Style (Meyer) | | | | Direto vs indireto, contexto |
| Trust Building (Meyer) | | | | Task-based vs relationship-based |

### Step 3: Definir Elementos LOCKED (Nunca Mudam)
Elementos que devem ser idênticos em qualquer mercado:

| Elemento | Spec Global | Tolerância |
|----------|-------------|-----------|
| Logo principal | {versão master} | Zero — nunca altera |
| Cores primárias | {hex exatos} | Zero — cores idênticas |
| Tipografia principal | {fonte} | Zero — mesma fonte |
| Logotipo spacing | {clear space rules} | Zero |
| Valores fundamentais | {lista} | Zero — mesmas palavras |
| Propósito | {statement} | Zero |
| Audio logo | {melodia} | Zero — mesma composição |

### Step 4: Definir Elementos FLEX (Adaptáveis)
Elementos que podem ser ajustados por mercado:

| Elemento | Range de Adaptação | Quem Aprova | Exemplos |
|----------|-------------------|-------------|----------|
| Tom de voz | Formal ↔ Casual (dentro do range) | Brand Manager local | Mais formal no Japão, mais casual no Brasil |
| Fotografia | Modelos/contextos locais | Brand Manager + Global | Diversidade étnica representativa |
| Cores secundárias | Podem variar por mercado | Brand Manager | Cores com conotação local negativa |
| Layout | Adaptação RTL, densidade | Design local | Árabe RTL, CJK vertical |
| Iconografia | Substituir ícones culturalmente sensíveis | Brand Manager | Mão: significados diferentes |
| Humor/referências | Localizar completamente | Copywriter local | Nunca traduzir humor literalmente |
| Campanhas | Conceito global + execução local | Brand Manager + Global | Mesma mensagem, contexto diferente |

### Step 5: Definir Elementos LOCAL (Criados por Mercado)
Elementos que cada mercado cria autonomamente:

| Elemento | Guidelines | Aprovação | Frequência |
|----------|-----------|-----------|-----------|
| Conteúdo social | Seguir visual guidelines + tom local | Brand Manager local | Contínuo |
| Parcerias/collabs | Alinhadas com valores da marca | Brand Manager + Global | Por projeto |
| Eventos locais | Seguir event branding guidelines | Brand Manager local | Por evento |
| PR/influencers | Alinhados com brand persona | Brand Manager local | Contínuo |
| Promoções sazonais | Template global + conteúdo local | Brand Manager local | Sazonal |

### Step 6: Auditar Sensibilidades Culturais
Checklist por mercado — verificar TODOS antes de launch:

| Verificação | Status | Notas |
|-------------|--------|-------|
| Nome da marca funciona no idioma local? | | Fonética, significados |
| Cores têm conotação negativa neste mercado? | | Branco = luto em partes da Ásia |
| Imagens/ícones são culturalmente apropriados? | | Gestos, símbolos, animais |
| Números são problemáticos? | | 4 no Japão/China, 13 no Ocidente |
| Slogan traduzido mantém significado? | | "Come alive" da Pepsi na China |
| Direção de leitura funciona? | | RTL para árabe/hebraico |
| Formatos de data, moeda, medidas corretos? | | DD/MM vs MM/DD |
| Regulamentações locais de publicidade atendidas? | | CONAR (BR), ASA (UK), FTC (US) |
| Representatividade nas imagens? | | Etnias, idades, gêneros locais |
| Contexto religioso/político verificado? | | Feriados, símbolos, restrições |

### Step 7: Criar Matriz de Localização por Touchpoint
Para cada touchpoint principal:

| Touchpoint | LOCKED | FLEX | LOCAL | Responsável |
|-----------|--------|------|-------|------------|
| Website | Logo, cores, tipografia | Layout, imagens, CTAs | Conteúdo, SEO local | Dev + Brand local |
| App | UI system, navigation | Idioma, imagens | Funcionalidades locais | Product + Brand local |
| Social media | Templates visuais | Tom, frequência | Conteúdo, trends | Social + Brand local |
| Embalagem | Logo, cores, layout base | Idioma, regulatório | Variantes locais | Design + Regulatório |
| Publicidade | Conceito, visual system | Execução, modelos | Mídia, placement | Agência + Brand local |
| PDV/Retail | Signage system, materials | Layout, escala | Promoções, staff | Retail + Brand local |
| Email | Template, sender | Idioma, tom | Ofertas, timing | Marketing + Brand local |
| Atendimento | Scripts base, valores | Idioma, protocolos | Canais, horários | CX + Brand local |

### Step 8: Definir Processo de Aprovação
Governance para adaptações:

| Tipo de Mudança | Quem Solicita | Quem Aprova | SLA |
|----------------|--------------|-------------|-----|
| Tradução padrão | Equipe local | Brand Manager local | 48h |
| Adaptação visual | Design local | Brand Manager + Global | 1 semana |
| Nova campanha local | Agência local | Brand Manager + CMO | 2 semanas |
| Exceção de guideline | Qualquer | Global Brand Director | 1 semana |
| Novo mercado launch | Global | C-level + Brand | 1 mês |

**Escalonamento:**
1. Brand Manager local → tenta resolver
2. Regional Brand Director → se impacta guideline
3. Global Brand Director → se cria exceção
4. CMO → se impacta posicionamento

### Step 9: Criar Toolkit de Localização
Materiais de apoio para equipes locais:

| Material | Conteúdo | Formato |
|----------|---------|---------|
| Brand Localization Guide | Este documento resumido | PDF, 10-15 páginas |
| Translation Glossary | Termos-chave traduzidos para cada idioma | Spreadsheet |
| Image Library (Local) | Banco de imagens pré-aprovadas por mercado | DAM/Drive |
| Template Kit | Templates adaptáveis (Canva/Figma) | Figma/Canva |
| DO/DON'T Cards | Exemplos visuais de certo/errado por mercado | PDF cards |
| Cultural Quick Reference | 1-pager por mercado com sensibilidades | PDF, 1 página |

### Step 10: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: cultural-adaptation-guidelines.md
  context: "Guidelines completos de adaptação cultural com matriz LOCKED/FLEX/LOCAL"
  also_to:
    - brand-identity-designer (Iris): "Adaptações visuais por mercado"
    - brand-culture-architect (Ethos): "Validação de sensibilidades culturais"
    - brand-collateral-designer (Vellum): "Templates localizáveis"
  next: "Atlas inclui no brandbook como capítulo de Localização"
```
