---
task: design-dynamic-identity-system
responsavel: "@brand-identity-designer"
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

# Task: Design Dynamic Identity System

> Projetar sistema de identidade visual dinâmica/generativa que se adapta a contextos mantendo reconhecibilidade.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-identity-designer (Iris) |
| **Co-agents** | brand-system-architect (Grid) tokens dinâmicos, brand-motion-vfx (Flux) animação generativa, brand-creative-engineer (Forge) implementação |
| **Trigger** | Quando marca necessita identidade que muda/reage a contextos (digital-first, tech, cultura, eventos) |
| **Input** | Logo system, paleta, tipografia, graphic vocabulary, motion language |
| **Output** | `dynamic-identity-system.md` |
| **Handoff** | → brand-system-architect (Grid) para tokens dinâmicos + brand-compiler (Atlas) |
| **Referências** | MIT Media Lab, Google Dynamic Logo, Spotify Duotone, Porto (City Branding), Nordkyn |

---

## Fundamentação

Identidades dinâmicas representam a evolução do branding estático. Em vez de um logo fixo, a marca possui um **sistema de regras** que gera infinitas variações reconhecíveis. Exemplos: MIT Media Lab (150K variações), Google Doodles, Spotify (duotone system), City of Melbourne, Porto (city identity).

```
IDENTIDADE ESTÁTICA          IDENTIDADE DINÂMICA
     ┌────┐                    ┌────┐ ┌────┐ ┌────┐
     │LOGO│                    │VAR1│ │VAR2│ │VAR3│
     └────┘                    └────┘ └────┘ └────┘
   1 versão fixa              ∞ variações com regras
   Reconhecimento             Reconhecimento
   por repetição              por sistema
```

---

## Steps

### Step 1: Avaliar Viabilidade e Tipo
Determinar se identidade dinâmica é adequada:

| Critério | Score (0-5) | Nota |
|----------|-----------|------|
| Marca é digital-first ou tem forte presença digital? | | |
| Público é tech-savvy e abraça novidade? | | |
| Marca valoriza inovação/criatividade como atributo core? | | |
| Há budget para implementação técnica? | | |
| Há equipe para manter o sistema? | | |
| **Total** | **/25** | |

≥18: Identidade dinâmica completa
12-17: Elementos dinâmicos pontuais (duotone, pattern, cor)
<12: Manter identidade estática com variações controladas

**Tipos de Identidade Dinâmica:**

| Tipo | Descrição | Complexidade | Exemplo |
|------|-----------|-------------|---------|
| **Container** | Forma fixa, conteúdo muda | Baixa | AOL, MTV (clássico) |
| **Generativa** | Algoritmo gera variações | Alta | MIT Media Lab, Nordkyn |
| **Responsiva** | Reage a dados/contexto | Alta | Spotify Wrapped, Google Weather |
| **Modular** | Elementos combinam-se | Média | City of Melbourne, Porto |
| **Temporal** | Muda com tempo/estação | Baixa | Google Doodles, Starbucks seasonal |
| **User-driven** | Usuário personaliza | Média | Slack custom emoji, Discord themes |

### Step 2: Definir Elementos Fixos vs Dinâmicos

| Elemento | Fixo (Invariável) | Dinâmico (Variável) | Regras de Variação |
|----------|-------------------|---------------------|-------------------|
| Logo | Forma base, proporções | Cor, textura, conteúdo interno | {regras} |
| Tipografia | Família, hierarquia | Peso, cor, efeitos | {regras} |
| Cor | Primária | Secundárias, gradientes | {palette generation rules} |
| Grid | Estrutura base | Densidade, proporções | {responsive rules} |
| Imagery | Estilo, tratamento | Conteúdo, composição | {generation rules} |
| Pattern | Elementos base | Composição, escala, cor | {algorithmic rules} |
| Motion | Timing, easing | Trajectória, intensidade | {physics rules} |
| Sound | Audio logo | Variações, adaptações | {harmonic rules} |

### Step 3: Projetar Sistema Generativo
Definir os parâmetros que controlam as variações:

**Parâmetros de Input (o que dispara a variação):**

| Input | Tipo | Exemplo |
|-------|------|---------|
| Tempo | Temporal | Hora do dia → paleta warm/cool |
| Localização | Geográfico | Cidade → cores/patterns locais |
| Conteúdo | Semântico | Categoria de produto → visual |
| Interação | Comportamental | Hover, scroll, click → reação |
| Dados | Data-driven | Clima, trending, performance |
| Contexto | Situacional | Evento, estação, campanha |
| Usuário | Personalizado | Preferências, histórico |

**Parâmetros de Output (o que muda):**

| Output | Range | Constraints |
|--------|-------|------------|
| Hue rotation | {0-360°} ou {subset} | Sempre dentro da paleta |
| Scale | {min-max} | Manter legibilidade |
| Complexity | {1-10} | Manter reconhecibilidade |
| Density | {sparse-dense} | Manter hierarquia |
| Speed (motion) | {slow-fast} | Manter acessibilidade |
| Opacity | {30%-100%} | Manter contraste |

### Step 4: Definir Regras de Reconhecibilidade
O que NUNCA pode mudar para manter a marca reconhecível:

| Invariante | Justificativa | Teste |
|-----------|---------------|-------|
| Proporção do logo | Reconhecimento instantâneo | Squint test a 2m |
| Cor primária (ao menos 1) | Associação cromática | Presente em ≥60% das variações |
| Tipografia headline | Voz visual | Mesmo peso e família |
| Espaçamento/ritmo | DNA visual | Consistente em todos os layouts |
| "Assinatura" visual | Elemento de assinatura | Presente em 100% das aplicações |
| Contraste mínimo | Acessibilidade | WCAG AA em todas as variações |

**Teste de Reconhecibilidade:**
1. Mostrar 5 variações a alguém que não conhece o sistema
2. Perguntar: "São da mesma marca?"
3. Se <80% reconhece → sistema precisa mais invariantes
4. Se >95% reconhece → sistema pode ter mais variação

### Step 5: Prototipar Variações
Criar no mínimo 12 variações que demonstrem o range:

| Variação | Input | Output Visual | Onde Usar |
|----------|-------|---------------|-----------|
| 1 | {contexto 1} | {descrição} | {aplicação} |
| 2 | {contexto 2} | {descrição} | {aplicação} |
| ... | ... | ... | ... |
| 12 | {contexto 12} | {descrição} | {aplicação} |

**Variações devem cobrir:**
- [ ] Extremos do range (mais sutil e mais dramática)
- [ ] Diferentes plataformas (web, mobile, print, OOH)
- [ ] Diferentes contextos (dia/noite, estações, eventos)
- [ ] Diferentes formatos (1:1, 16:9, vertical)
- [ ] Modo claro e escuro

### Step 6: Definir Implementação Técnica

| Tecnologia | Uso | Complexidade |
|-----------|-----|-------------|
| **CSS Custom Properties** | Variações de cor, spacing | Baixa |
| **SVG + SMIL/CSS** | Logo animado/responsivo | Média |
| **Canvas/WebGL** | Generativo complexo | Alta |
| **Three.js/p5.js** | 3D generativo | Alta |
| **Lottie** | Motion predefinido com variantes | Média |
| **Figma Variables** | Design-time variations | Baixa |
| **Shader (GLSL)** | Efeitos visuais avançados | Muito alta |

**Entregáveis técnicos:**
- [ ] Código generativo documentado (repo ou CodePen)
- [ ] API de variação (se data-driven)
- [ ] Figma plugin ou template com variáveis
- [ ] Fallback estático para contextos sem suporte
- [ ] Performance budget: max {X}ms para gerar variação

### Step 7: Documentar Guidelines do Sistema Dinâmico

```markdown
## Dynamic Identity Guidelines

### O Sistema
{Explicação do conceito e filosofia}

### Invariantes (NUNCA muda)
{Lista com specs exatos}

### Variáveis (PODE mudar)
{Lista com ranges e regras}

### Inputs → Outputs
{Mapeamento de contextos para variações}

### 12 Variações de Referência
{Grid visual com as 12 variações}

### Implementação
{Código, APIs, ferramentas}

### DON'Ts
- Nunca usar variação fora do range definido
- Nunca remover invariantes para "experimentar"
- Nunca gerar variação sem testar acessibilidade
- Nunca usar versão generativa onde static fallback é necessário
```

### Step 8: Handoff
```yaml
handoff:
  to: brand-system-architect (Grid)
  artifact: dynamic-identity-system.md
  context: "Sistema de identidade dinâmica com invariantes, variáveis, ranges e implementação técnica"
  also_to:
    - brand-motion-vfx (Flux): "Integrar motion language com variações dinâmicas"
    - brand-creative-engineer (Forge): "Implementar código generativo"
    - brand-compiler (Atlas): "Incluir como capítulo no brandbook"
  next: "Grid cria tokens dinâmicos, Flux anima variações, Atlas documenta"
```
