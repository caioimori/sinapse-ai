---
task: create-dx-brief
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

# Task: Create DX Brief

## Metadata
- **Squad:** squad-design
- **Agent:** Nexus (design-orqx)
- **Complexity:** Standard

## Objetivo
Criar o brief estruturado do projeto digital que serve como documento fundacional para todos os agentes do squad.

## Entrada
- Classificacao de projeto (de classify-project-type)
- Brief do cliente (informal ou formal)
- Brand guidelines (de squad-brand, se disponiveis)
- Copy aprovada (de squad-copy, se disponivel)
- Dados de pesquisa (de squad-research, se disponiveis)

## Passos

### 1. Consolidar Informacoes do Projeto
| Secao | Conteudo |
|-------|----------|
| Projeto | Nome, tipo, classificacao, timeline |
| Cliente | Empresa, setor, publico-alvo |
| Objetivos | O que o projeto deve alcançar (metricas) |
| Restricoes | Budget, timeline, tecnologia, compliance |
| Assets existentes | Brand, design system, conteudo, analytics |

### 2. Definir Requisitos por Disciplina

**UX Requirements:**
- Publico-alvo e necessidades
- User flows principais
- Dispositivos e contextos de uso
- Benchmarks de usabilidade

**UI Requirements:**
- Estilo visual (referências, moodboard)
- Brand guidelines a seguir
- Responsiveness requirements
- Dark mode necessario?

**Design System Requirements:**
- Existe design system? Qual?
- Precisa criar novo?
- Multi-brand necessario?
- Componentes principais necessarios

**Frontend Requirements:**
- Stack tecnologico (se definido)
- Integracoes com APIs
- SSR/SSG/ISR requirements
- i18n necessario?

**Accessibility Requirements:**
- Nivel WCAG target (AA minimo)
- Regulamentacao aplicavel (EU EAA, ADA, etc.)
- Tecnologias assistivas a suportar

**Performance Requirements:**
- Core Web Vitals targets
- Performance budgets especiais
- CDN/hosting constraints

### 3. Mapear Dependencias Cross-Squad
- O que JA recebemos de outros squads
- O que PRECISAMOS solicitar
- O que ENTREGAREMOS para outros squads

### 4. Criar Plano de Fases
Com base na classificacao, definir fases com entregáveis e gates.

## Saida
Documento DX Brief com:
- Visao geral do projeto
- Requisitos por disciplina
- Dependencias cross-squad
- Plano de fases
- Quality gates definidos
- Timeline por fase

## Validacao
- [ ] Todos os requisitos por disciplina preenchidos
- [ ] Dependencias cross-squad mapeadas
- [ ] Quality gates (a11y + performance) definidos
- [ ] Timeline realista por fase
- [ ] Stakeholders e aprovadores identificados
