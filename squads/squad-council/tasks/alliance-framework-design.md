---
task: alliance-framework-design
responsavel: "@reid-hoffman"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: organization_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: alliance_framework
    tipo: document
    destino: Console

Checklist:
  - "[ ] Tour of Duty definido"
  - "[ ] Alignment entre empresa e colaborador mapeado"
  - "[ ] Network intelligence integrada"
  - "[ ] Framework de alumni projetado"
---

# Task: Alliance Framework Design

## Metadata
- **Squad:** squad-council
- **Agent:** Reid Hoffman
- **Complexity:** Standard

## Objetivo
Projetar um framework de relacao empregador-empregado baseado no modelo "Alliance" de Hoffman — substituindo a ilusao de emprego vitalicio por uma alianca honesta e mutuamente benefica com tours of duty, network intelligence e alumni networks.

## Pre-Condicoes
- Organizacao com equipe existente ou em crescimento
- Disposicao para repensar a relacao empregador-empregado
- Honestidade sobre expectativas mutuas

## Passos

### 1. Diagnosticar Modelo Atual
| Dimensao | Modelo Tradicional | Modelo Alliance | Onde Estamos? |
|----------|-------------------|----------------|--------------|
| Expectativa | "Emprego para a vida" | "Tour of duty mutuamente benefico" | |
| Lealdade | Unilateral | Reciproca e explicita | |
| Desenvolvimento | "Treinamos se precisarmos" | "Investimos no seu crescimento" | |
| Saida | Traicao | Transicao natural e positiva | |
| Rede | "Proibido falar com concorrentes" | "Sua rede e nosso ativo" | |

### 2. Projetar Tours of Duty
Tres tipos de tour:
| Tipo | Duracao | Objetivo | Para Quem |
|------|---------|----------|----------|
| Rotational | 2-4 anos | Aprendizado mutuo, explorar fit | Entry-level, novas contratacoes |
| Transformational | 2-5 anos | Missao especifica, transformar algo | Mid-senior, lideranca |
| Foundational | Indefinido | Align com missao de vida | Fundadores, lideranca senior |

Para cada colaborador, definir:
```yaml
tour_of_duty:
  employee: ""
  type: "rotational/transformational/foundational"
  mission: "O que voce vai transformar neste tour?"
  duration: ""
  skills_to_develop: []
  value_to_company: ""
  value_to_employee: ""
  success_criteria: ""
  next_tour_options: []
```

### 3. Alinhar Interesses (Alignment Conversation)
A conversa que ninguem tem mas deveria:
| Pergunta | Resposta da Empresa | Resposta do Colaborador |
|----------|-------------------|----------------------|
| O que precisamos nos proximos 2-3 anos? | | |
| O que voce quer para sua carreira? | | |
| Onde nossos interesses se alinham? | | |
| Onde nossos interesses divergem? | | |
| Como maximizar o overlap? | | |

### 4. Implementar Network Intelligence
"Your employees' networks are your company's greatest untapped asset" — Hoffman
| Pratica | Descricao | Implementacao |
|---------|-----------|--------------|
| Network Intelligence Fund | Budget para networking | $ X/pessoa/trimestre |
| Speaking opportunities | Colaboradores em eventos | Lista de conferencias |
| Social media presence | Encorajar presenca publica | Guidelines, nao restricoes |
| Industry meetups | Participacao em comunidades | Tempo autorizado |
| Informational interviews | Conversas exploratoriass | Processo estruturado |

### 5. Projetar Programa de Alumni
Valor de alumni network:
- Referral de talentos (alumni indica)
- Business development (alumni como clientes/parceiros)
- Knowledge sharing (alumni compartilha aprendizados)
- Boomerang hires (alumni retorna melhor)

```yaml
alumni_program:
  touchpoints:
    - "Exit interview construtiva"
    - "Alumni newsletter trimestral"
    - "Alumni events anuais"
    - "LinkedIn alumni group"
  benefits:
    - "Acesso a ferramentas/descontos"
    - "Referral bonus para indicacoes"
    - "Convite para eventos da empresa"
  metrics:
    - "Alumni referral rate"
    - "Boomerang hire rate"
    - "Alumni NPS"
```

### 6. Definir Cadencia de Conversas
| Conversa | Frequencia | Formato | Participantes |
|----------|-----------|---------|--------------|
| Tour of Duty Check-in | Trimestral | 1:1 | Gestor + colaborador |
| Alignment Review | Semestral | Formal | Gestor + colaborador + HR |
| Career Development | Anual | Workshop | Equipe toda |
| Next Tour Planning | 6 meses antes do fim | 1:1 + HR | Gestor + colaborador |

### 7. Criar Metricas de Sucesso
| Metrica | Target | Medida |
|---------|--------|--------|
| Tour completion rate | >80% | % de tours completados conforme planejado |
| Internal mobility | >30% | % de next tours internos |
| Alumni engagement | >40% | % de alumni ativos na rede |
| Referral from alumni | >15% | % de contratacoes via alumni |
| Employee alignment score | >8/10 | Survey de alinhamento |

### 8. Gerenciar Transicoes com Graciosidade
Quando tour termina:
- Celebrar contribuicao, nao lamentar saida
- Oferecer proximo tour (se apropriado)
- Transicao suave de conhecimento
- Onboarding no programa de alumni
- "The best thing about the Alliance is honesty from both sides"

## Output
```yaml
alliance_framework:
  organization: ""
  tour_types: ["rotational", "transformational", "foundational"]
  alignment_process: ""
  network_intelligence_budget: ""
  alumni_program: ""
  conversation_cadence: []
  success_metrics: []
  transition_protocol: ""
```

## Validacao
- [ ] 3 tipos de tour definidos com criterios
- [ ] Alignment conversation estruturada
- [ ] Network intelligence practices implementaveis
- [ ] Programa de alumni projetado com metricas
- [ ] Cadencia de conversas definida
- [ ] Metricas de sucesso com targets
