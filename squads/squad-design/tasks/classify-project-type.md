---
task: classify-project-type
responsavel: "@design-orqx"
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

# Task: Classify Project Type

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Standard

## Objetivo
Classificar o projeto digital recebido para determinar o workflow correto, sequencia de agentes e estimativas de escopo.

## Entrada
- Brief do cliente ou descricao do projeto
- Assets existentes (se houver): site atual, brand guidelines, design system
- Objetivos de negocio
- Timeline e restricoes

## Passos

### 1. Identificar Tipo de Projeto
Classificar em uma das categorias:

| Tipo | Indicadores | Workflow |
|------|-----------|---------|
| **New Build** | Produto/site novo do zero | zero-to-digital-product-cycle |
| **Redesign** | Site/produto existente, redesign completo | zero-to-digital-product-cycle (com discovery fase extendida) |
| **Component Library** | Design system/component library | design-system-build-cycle |
| **Landing Page** | Pagina unica de campanha/conversao | landing-page-sprint |
| **Performance Fix** | Core Web Vitals ruins, site lento | performance-remediation-cycle |
| **A11y Compliance** | Precisa compliance WCAG | a11y-compliance-cycle |
| **UX Research** | Validacao de hipoteses, discovery | ux-research-sprint |
| **Feature Addition** | Adicionar feature a produto existente | customizado (subset de agents) |

### 2. Avaliar Complexidade
| Dimensao | 1 (Baixa) | 3 (Media) | 5 (Alta) |
|----------|-----------|-----------|----------|
| **Escopo** | 1-3 paginas | 4-10 paginas | 10+ paginas/app |
| **Design System** | Usa existente | Adapta existente | Cria novo |
| **Integracao** | Sem APIs | 1-3 APIs | 4+ APIs/real-time |
| **Responsivo** | Desktop only | Desktop + mobile | Multi-device + PWA |
| **A11y** | Basico | WCAG 2.2 AA | WCAG 2.2 AAA |

**Classificacao:**
- Score 5-10: SIMPLE → timeline curta, agentes reduzidos
- Score 11-18: STANDARD → workflow completo
- Score 19-25: COMPLEX → workflow extendido, mais iteracoes

### 3. Definir Equipe de Agentes
Com base no tipo e complexidade, determinar quais agentes sao ativados:

| Agente | SIMPLE | STANDARD | COMPLEX |
|--------|--------|----------|---------|
| Nexus | Sempre | Sempre | Sempre |
| Compass | Opcional | Sempre | Sempre |
| Canvas | Sempre | Sempre | Sempre |
| Stratum | Skip | Sempre | Sempre |
| Scaffold | Sempre | Sempre | Sempre |
| Beacon | Gate final | Gate final | Envolvido desde inicio |
| Kinetic | Skip | Opcional | Sempre |
| Apex | Gate final | Gate final | Envolvido desde inicio |

### 4. Gerar Classificacao

## Saida
```yaml
project_classification:
  type: [New Build | Redesign | Component Library | Landing Page | ...]
  complexity: [SIMPLE | STANDARD | COMPLEX]
  complexity_score: X/25
  workflow: [nome do workflow]
  active_agents: [lista]
  estimated_phases: X
  quality_gates:
    accessibility: [gate_final | desde_inicio]
    performance: [gate_final | desde_inicio]
  notes: "..."
```

## Validacao
- [ ] Tipo de projeto claramente identificado
- [ ] Complexidade pontuada em todas as 5 dimensoes
- [ ] Workflow correto selecionado
- [ ] Agentes ativos definidos
- [ ] Quality gates configurados
