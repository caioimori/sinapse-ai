---
task: productize-yourself-strategy
responsavel: "@naval-ravikant"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: individual_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: productization_strategy
    tipo: document
    destino: Console

Checklist:
  - "[ ] Unique value proposition articulada"
  - "[ ] Accountability definida"
  - "[ ] Modelo de productizacao desenhado"
  - "[ ] Caminho de escala projetado"
---

# Task: Productize Yourself Strategy

## Metadata
- **Squad:** squad-council
- **Agent:** Naval Ravikant
- **Complexity:** Standard

## Objetivo
Criar estrategia para "productizar voce mesmo" — transformar specific knowledge + accountability em um produto ou servico que escala sem sua presenca constante. "Productize yourself. Figure out what you're uniquely good at and apply as much leverage as possible." — Naval

## Pre-Condicoes
- Specific knowledge identificado (idealmente via specific-knowledge-audit)
- Clareza sobre aptidoes e obsessoes genuinas
- Disposicao para accountability publica

## Passos

### 1. Definir sua Unique Value Proposition
Completar a formula Naval:
```
[Specific Knowledge] + [Accountability] + [Leverage] = Wealth
```
- Specific Knowledge: O que voce sabe que nao pode ser treinado?
- Accountability: Como voce coloca sua reputacao em jogo?
- Leverage: Como multiplicar sem mais horas?

### 2. Mapear a Cadeia de Valor Pessoal
| Etapa | O que voce faz | Valor gerado | Pode ser productizado? |
|-------|---------------|-------------|----------------------|
| Diagnostico | | | |
| Estrategia | | | |
| Execucao | | | |
| Validacao | | | |
| Ensino | | | |

### 3. Identificar o Nucleo Productizavel
Perguntas-filtro:
- Que parte do que voce faz gera 80% do valor?
- Que parte pode ser entregue sem voce estar presente?
- Que parte as pessoas pagariam premium por acesso?
- Que parte tem demanda recorrente (nao one-shot)?

### 4. Escolher Modelo de Productizacao
| Modelo | Marginal Cost | Escala | Complexidade | Fit |
|--------|-------------|-------|-------------|-----|
| Software/SaaS | Zero | Infinita | Alta | |
| Conteudo digital (cursos, livros) | Zero | Infinita | Media | |
| Templates/frameworks | Zero | Infinita | Baixa | |
| Servico productizado (escopo fixo) | Baixo | Media | Media | |
| Comunidade/membership | Baixo | Alta | Media | |
| Licenciamento de IP | Zero | Alta | Alta | |

### 5. Construir Accountability Layer
- Nome/marca pessoal associada ao produto
- Track record publico e verificavel
- Skin in the game — que risco voce carrega?
- "Embrace accountability and take business risks under your own name"

### 6. Projetar a Escala
Evolucao tipica:
```
1:1 (servico) → 1:few (grupo) → 1:many (produto) → 1:infinite (software/media)
```
| Fase | Formato | Preco | Receita/mes | Horas/semana |
|------|---------|-------|-------------|-------------|
| Atual | | | | |
| +6 meses | | | | |
| +12 meses | | | | |
| +24 meses | | | | |

### 7. Definir Moat Pessoal
O que impede copia:
- Specific knowledge que leva anos para acumular
- Track record que nao pode ser fabricado
- Network/relacionamentos construidos ao longo do tempo
- Combinacao unica que ninguem mais tem
- "Escape competition through authenticity"

### 8. Criar Plano de Execucao
- MVP: qual e a versao minima do produto?
- First 10 customers: quem sao e como alcanca-los?
- Feedback loop: como iterar baseado em uso real?
- Content strategy: como media amplifica o produto?
- Milestone de validacao: quando saber que funciona?

## Output
```yaml
productization_strategy:
  unique_value_proposition: ""
  specific_knowledge: ""
  accountability_model: ""
  productization_model: ""
  scaling_path:
    current: ""
    six_months: ""
    twelve_months: ""
    twentyfour_months: ""
  moat: []
  execution_plan:
    mvp: ""
    first_customers: ""
    validation_milestone: ""
  leverage_type: "code/media/capital/labor"
```

## Validacao
- [ ] Formula Naval completa (SK + Accountability + Leverage)
- [ ] Nucleo productizavel identificado via filtros
- [ ] Modelo de productizacao selecionado com justificativa
- [ ] Accountability layer construida
- [ ] Escala projetada com numeros
- [ ] Moat pessoal definido
- [ ] Plano de execucao com MVP concreto
