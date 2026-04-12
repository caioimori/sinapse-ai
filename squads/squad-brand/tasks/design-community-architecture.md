---
task: design-community-architecture
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

# Task: Design Brand Community Architecture

> Projetar arquitetura de comunidade de marca com rituais e programas.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Trigger** | Quando marca tem potencial de community building |
| **Input** | Personas, cultura projetada, canais existentes |
| **Output** | `brand-community-architecture.md` |
| **Handoff** | → brand-orqx (Meridian) |

---

## Steps

### Step 1: Avaliar Potencial de Comunidade
| Critério | Score (0-5) | Nota |
|----------|-----------|------|
| Paixão pela categoria | | Pessoas se importam ativamente? |
| Identity value | | Usar a marca diz algo sobre quem eu sou? |
| Shared rituals potential | | Há rituais naturais na categoria? |
| Content creation potential | | Usuários geram conteúdo espontaneamente? |
| Network effects | | Mais membros = mais valor? |
| **Total** | **/25** | |

≥18: Alto potencial — investir em comunidade
12-17: Médio — comunidade como tática, não como estratégia
<12: Baixo — focar em audience, não community

### Step 2: Definir Tipo de Comunidade
| Tipo | Descrição | Melhor Para |
|------|-----------|-------------|
| Brand community | Em torno da marca | Marcas com fãs apaixonados |
| Interest community | Em torno do interesse | Marcas em categorias apaixonantes |
| Practice community | Em torno da atividade | Marcas de ferramentas/tools |
| Cause community | Em torno da causa | Marcas com propósito forte |

### Step 3: Mapear Stakeholders
| Camada | Descrição | % | Engajamento |
|--------|-----------|---|------------|
| Core fans | Evangelistas, co-criadores | 1-5% | Diário |
| Active members | Participam regularmente | 10-20% | Semanal |
| Casual members | Participam quando conveniente | 30-40% | Mensal |
| Lurkers | Observam, consumem conteúdo | 40-50% | Passivo |

### Step 4: Projetar Plataformas
| Plataforma | Propósito | Formato |
|-----------|----------|---------|
| Discord/Slack | Conversação em tempo real | Texto + voz |
| Forum proprietário | Discussões profundas | Threads |
| Instagram Close Friends | Conteúdo exclusivo | Visual |
| Newsletter comunidade | Updates + curadoria | Email |
| Eventos IRL | Conexão presencial | Meetups |

### Step 5: Projetar Rituais Comunitários
| Ritual | Frequência | Formato | Objetivo |
|--------|-----------|---------|---------|
| Weekly roundup | Semanal | Post/newsletter | Manter engajamento |
| Monthly meetup | Mensal | Virtual/IRL | Conexão |
| Quarterly challenge | Trimestral | Competição | Ativação |
| Annual summit | Anual | Evento | Celebração |

### Step 6: Criar Programa de Embaixadores
| Nível | Critério | Benefício | Responsabilidade |
|-------|----------|-----------|-----------------|
| Member | Cadastro | Acesso à comunidade | Seguir guidelines |
| Contributor | 3+ contribuições/mês | Reconhecimento | Criar conteúdo |
| Ambassador | Selecionado | Produtos + acesso antecipado | Representar a marca |
| Founding member | Convite | Co-criação + revenue share | Evangelismo ativo |

### Step 7: Definir Métricas
| Métrica | Target | Frequência de Medição |
|---------|--------|----------------------|
| Community size | | Mensal |
| Active members (%) | ≥30% | Mensal |
| Engagement rate | | Semanal |
| NPS comunitário | ≥60 | Trimestral |
| UGC volume | | Mensal |
| Community → conversion | | Mensal |
| Churn rate | <5% mensal | Mensal |

### Step 8: Handoff
```yaml
handoff:
  to: brand-orqx (Meridian)
  artifact: brand-community-architecture.md
  context: "Arquitetura de comunidade com plataformas, rituais e programa de embaixadores"
  next: "Integrar no plano geral de execução"
```
