---
task: calculate-rate-card
responsavel: "@pricing-strategist"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: roles
    tipo: array
    origem: "usuario"
    obrigatorio: true
  - campo: cost_data
    tipo: object
    origem: "profitability-analyst"
    obrigatorio: true

Saida:
  - campo: rate_card
    tipo: document
    destino: "squad-commercial"

Checklist:
  - "[ ] Listar roles/senioridades"
  - "[ ] Calcular custo loaded por role"
  - "[ ] Aplicar markup por role"
  - "[ ] Validar com benchmarks de mercado"
  - "[ ] Definir politica de descontos"
---

# Task: Calculate Rate Card

## Metadata
- **Agent:** pricing-strategist (Mint)
- **Squad:** squad-finance
- **Complexity:** MEDIUM

## Objetivo
Calcular rate card por servico e senioridade, fundamentado em custo real e posicionamento de mercado.

## Steps

1. **Custo base por role:**
   ```
   Custo_hora_loaded = Custo_mensal_loaded / Horas_uteis_mes
   Horas_uteis_mes: ~168h (21 dias × 8h)
   Horas_faturáveis_mes: ~130h (considerando 77% utilizacao)
   ```
2. **Markup por senioridade:**
   ```
   Junior: 2.0-2.5× custo loaded
   Pleno: 2.5-3.0× custo loaded
   Senior: 3.0-4.0× custo loaded
   Lead/Principal: 3.5-5.0× custo loaded
   Diretor/Partner: 5.0-8.0× custo loaded
   ```
3. **Rate card resultante (exemplo agencia BR):**
   ```
   | Role | Custo/h Loaded | Markup | Rate Card |
   |------|---------------|--------|-----------|
   | Junior Dev | R$ 45 | 2.5× | R$ 112 |
   | Pleno Dev | R$ 75 | 2.8× | R$ 210 |
   | Senior Dev | R$ 120 | 3.2× | R$ 384 |
   | Tech Lead | R$ 160 | 3.5× | R$ 560 |
   | Designer Jr | R$ 40 | 2.5× | R$ 100 |
   | Designer Sr | R$ 100 | 3.2× | R$ 320 |
   | PM | R$ 90 | 3.0× | R$ 270 |
   ```
4. **Politica de descontos:**
   ```
   Volume (> 500h/mes): ate 10%
   Contrato anual: ate 8%
   Maximo acumulado: 15%
   Floor: NUNCA abaixo de 2.0× custo loaded
   ```

## Output
- Rate card completo por role e senioridade
- Markup aplicado e margem implícita
- Politica de descontos
- Comparacao com benchmarks de mercado

## Quality Gates
- [ ] Custos loaded atualizados
- [ ] Markup gera margem acima de 50% gross
- [ ] Rate card competitivo vs mercado
- [ ] Politica de descontos com floor definido

## Quando Usar
- Revisao anual de rate card
- Onboarding de novo servico
- Proposta com alocacao de equipe
