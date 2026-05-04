---
task: evaluate-investment-thesis
responsavel: "@charlie-munger"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: thesis
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: thesis_evaluation
    tipo: document
    destino: Console

Checklist:
  - "[ ] Moat avaliado com evidencias"
  - "[ ] Inversao aplicada (o que pode dar errado)"
  - "[ ] Checklist Munger completado"
  - "[ ] Margem de seguranca calculada"
---

# Task: Evaluate Investment Thesis

## Metadata
- **Squad:** squad-council
- **Agent:** Charlie Munger
- **Complexity:** High

## Objetivo
Avaliar uma tese de investimento (negocio, startup, ativo) usando a metodologia Munger: moat analysis, inversao, checklist de decisao, e margem de seguranca.

## Passos

### 1. Moat Analysis
| Tipo de Moat | Presente? | Evidencia | Durabilidade |
|-------------|-----------|-----------|--------------|
| Proprietary Technology | | | |
| Network Effects | | | |
| Switching Costs | | | |
| Cost Advantages | | | |
| Brand | | | |
| Intangible Assets | | | |

Pergunta-chave: "Um competidor bem-financiado consegue replicar esta vantagem em 3 anos?"

### 2. Inversion
- O que faria este investimento perder 100% do valor?
- Quais sao os cenarios catastroficos?
- O que precisaria ser FALSO para a tese falhar?

### 3. Munger's Decision Checklist
- [ ] Quais sao os incentivos de todos os envolvidos?
- [ ] Estou dentro do meu circulo de competencia?
- [ ] Quais vieses cognitivos podem estar me influenciando?
- [ ] Qual e o custo de oportunidade?
- [ ] Existe margem de seguranca?
- [ ] Consigo explicar para uma crianca inteligente?
- [ ] Estaria confortavel se esta decisao fosse publicada no jornal?

### 4. Margin of Safety
- Quais premissas podem estar erradas em 50%?
- Mesmo com premissas 50% erradas, o investimento faz sentido?
- Qual e o downside maximo?

### 5. Verdict
- INVEST (moat forte, margem de seguranca, dentro do circulo)
- PASS (moat fraco, sem margem, ou fora do circulo)
- STUDY MORE (potencial, mas informacao insuficiente)
