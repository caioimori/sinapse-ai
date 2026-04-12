---
task: create-brand-training-program
responsavel: "@brand-culture-architect"
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

# Task: Create Brand Training Program

> Criar programa de treinamento de marca para garantir adoção consistente por todos os stakeholders.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Co-agents** | brand-compiler (Atlas) materiais, brand-strategist (Athena) conteúdo estratégico |
| **Trigger** | Após brandbook compilado, antes do rollout |
| **Input** | Brandbook completo, onboarding guide, governance document |
| **Output** | `brand-training-program.md` |
| **Handoff** | → brand-compiler (Atlas) para inclusão no delivery package |

---

## Steps

### Step 1: Mapear Audiências do Treinamento
Cada público precisa de nível diferente de profundidade:

| Audiência | Nível | Duração | Formato | Frequência |
|----------|-------|---------|---------|-----------|
| **C-Level/Founders** | Estratégico | 1h | Workshop presencial | 1x (launch) |
| **Marketing/Brand team** | Expert | 4-8h | Workshop + hands-on | 1x + refreshers trimestrais |
| **Design team** | Expert (visual) | 4-8h | Workshop + Figma | 1x + updates |
| **Content/Copy team** | Profundo | 2-4h | Workshop + exercícios | 1x + refreshers |
| **Vendas/Comercial** | Prático | 1-2h | Apresentação + cards | 1x + updates |
| **Atendimento/CX** | Prático | 1-2h | Role-play + scripts | 1x + mensal |
| **Parceiros/Agências** | Compliance | 2h | Digital + toolkit | Onboarding + anual |
| **Novos colaboradores** | Overview | 30min | Onboarding digital | No ingresso |

### Step 2: Definir Currículo por Audiência

**Módulo 1: Brand Foundation (todos)**
| Tópico | Duração | Formato | Entregável |
|--------|---------|---------|-----------|
| Por que marca importa | 15min | Vídeo + discussão | — |
| Nossa história e propósito | 15min | Storytelling | — |
| Posicionamento e diferencial | 15min | Framework visual | Positioning card |
| Valores e cultura | 15min | Exercício interativo | Values card |

**Módulo 2: Visual Identity (design, marketing, agências)**
| Tópico | Duração | Formato | Entregável |
|--------|---------|---------|-----------|
| Logo: versões e uso correto | 30min | Visual + DO/DON'T | Logo cheat sheet |
| Cores: paleta e aplicação | 30min | Exercício de aplicação | Color card |
| Tipografia: hierarquia e pairing | 30min | Exercício tipográfico | Type specimen |
| Fotografia e ilustração | 30min | Curadoria + exercício | Moodboard |
| Templates: como usar | 30min | Hands-on (Figma/Canva) | Template access |

**Módulo 3: Verbal Identity (content, marketing, vendas)**
| Tópico | Duração | Formato | Entregável |
|--------|---------|---------|-----------|
| Tom de voz: como soamos | 30min | Exercício de escrita | Voice card |
| Message house | 20min | Framework + prática | Message card |
| DO/DON'T verbal | 20min | Quiz interativo | Cheat sheet |
| Copy para canais específicos | 30min | Exercícios por canal | Templates de copy |

**Módulo 4: Brand in Action (vendas, atendimento)**
| Tópico | Duração | Formato | Entregável |
|--------|---------|---------|-----------|
| Brand experience: como entregamos | 20min | Cases + role-play | Experience card |
| Pitch da marca (elevator pitch) | 20min | Prática individual | Pitch script |
| Handling: objeções sobre a marca | 20min | Role-play | FAQ card |
| Social: como representar a marca | 20min | Exemplos + guidelines | Social card |

**Módulo 5: Brand Governance (marketing, brand team)**
| Tópico | Duração | Formato | Entregável |
|--------|---------|---------|-----------|
| Processo de aprovação | 15min | Fluxograma | Process card |
| Como solicitar materiais | 15min | Tutorial | Formulário |
| Como reportar uso incorreto | 10min | Protocolo | Contact card |
| Brand calendar e rituais | 20min | Planejamento | Calendar template |

### Step 3: Criar Materiais de Treinamento

| Material | Formato | Para Quem | Spec |
|----------|---------|-----------|------|
| **Brand Deck** | Keynote/Google Slides | Facilitador | 40-60 slides, visual-heavy |
| **Participant Workbook** | PDF interativo | Participantes | Exercícios, espaço para notas |
| **Quick Reference Cards** | Card set (A6) | Todos | 8-10 cards, plastificado |
| **Video Capsules** | MP4, 3-5min cada | Onboarding digital | 5-8 vídeos |
| **Quiz/Assessment** | Google Forms / LMS | Pós-treinamento | 15-20 perguntas |
| **Certification Badge** | PNG/SVG | Quem passar no quiz | Badge digital |
| **Brand Toolkit Access** | Link + tutorial | Design/Marketing | Figma, DAM, templates |
| **FAQ Document** | PDF/Wiki | Todos | Top 20 perguntas |

### Step 4: Definir Formato de Delivery

| Formato | Quando | Pros | Cons |
|---------|--------|------|------|
| **Workshop presencial** | Launch, times key | Engajamento alto, Q&A | Logística, custo |
| **Workshop virtual (live)** | Times remotos | Alcance, gravação | Menor engajamento |
| **E-learning assíncrono** | Onboarding, escala | Escalável, on-demand | Sem interação |
| **Micro-learning (3-5min)** | Refreshers | Rápido, mobile | Sem profundidade |
| **Office hours** | Dúvidas ongoing | Prático, direto | Irregular |
| **Brand newsletter interna** | Updates | Mantém awareness | Passivo |

**Recomendação:** Launch = presencial/live. Escala = e-learning. Manutenção = micro-learning + newsletter.

### Step 5: Criar Assessment e Certificação

**Quiz de Brand Knowledge:**

| Seção | Nº Perguntas | Tipo | Peso |
|-------|-------------|------|------|
| Brand foundation | 5 | Múltipla escolha | 20% |
| Visual identity | 5 | Identificação visual (DO/DON'T) | 25% |
| Verbal identity | 3 | Exercício de escrita | 20% |
| Brand in action | 4 | Cenários/situações | 20% |
| Governance | 3 | Processo | 15% |

**Scoring:**
- ≥85%: Brand Ambassador (badge gold)
- 70-84%: Brand Proficient (badge silver)
- <70%: Refazer módulos específicos

### Step 6: Definir Programa de Manutenção
Treinamento não é one-shot — é programa contínuo:

| Ação | Frequência | Responsável | Audiência |
|------|-----------|-------------|----------|
| Brand newsletter interna | Mensal | Brand Manager | Todos |
| Micro-learning capsule | Trimestral | Brand + L&D | Todos |
| Brand office hours | Quinzenal | Brand team | Marketing + Design |
| Brand audit findings sharing | Trimestral | Sentinel | Brand + Marketing |
| Refresher workshop | Semestral | Brand team | Marketing + Design |
| Full re-certification | Anual | Brand + L&D | Todos |
| New employee onboarding | Contínuo | HR + Brand | Novos |
| Agency onboarding | Por projeto | Brand Manager | Agências |

### Step 7: Definir KPIs do Programa

| KPI | Target | Como Medir |
|-----|--------|-----------|
| % colaboradores treinados | 100% em 90 dias | LMS/tracking |
| Quiz pass rate | ≥85% | Quiz results |
| Brand consistency score (pós-treino) | Aumento ≥15% | Brand audit |
| Brand knowledge score médio | ≥80/100 | Quiz average |
| Tempo médio onboarding brand | ≤2h | LMS data |
| Satisfação com treinamento | ≥4.2/5 | Survey pós-treino |
| Incidentes de misuse (pós-treino) | Redução ≥50% | Audit tracking |

### Step 8: Handoff
```yaml
handoff:
  to: brand-compiler (Atlas)
  artifact: brand-training-program.md
  context: "Programa completo de treinamento com currículo, materiais, assessment e manutenção"
  also_to:
    - brand-culture-architect (Ethos): "Integrar com cultura e EVP"
    - brand-auditor (Sentinel): "Medir impacto pós-treinamento nos audits"
  next: "Atlas inclui no delivery package como capítulo de Brand Adoption"
```
