---
task: evaluate-competitive-threats
responsavel: "@competitive-intelligence"
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

# Task: Evaluate Competitive Threats

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** STANDARD
- **Depends on:** map-competitive-landscape
- **Feeds:** analyze-competitor-strategy

## Objetivo
Avaliar nivel real de ameaca competitiva de cada player, separando paranoia de risco real.

## Entrada
- Competidores mapeados no landscape
- Dados de posicionamento e performance

## Passos

### 1. Framework de Avaliacao (5 dimensoes)

| Dimensao | Peso | 1 (Baixo) | 3 (Medio) | 5 (Alto) |
|----------|:----:|-----------|-----------|----------|
| Market Share | 25% | <5% | 5-20% | >20% |
| Momentum | 25% | Estagnado/declinio | Crescimento estavel | Crescimento acelerado |
| Diferencial Real | 20% | Nenhum diferencial | Diferencial parcial | Diferencial forte e defensavel |
| Recursos | 15% | Bootstrapped/limitado | Bem capitalizado | Abundante (funding, equipe, tech) |
| Targeting Overlap | 15% | Target diferente | Overlap parcial | Mesmo target exato |

**Score = Soma(peso × nota)**

### 2. Classificacao de Ameaca
- **Score ≥4.0:** AMEACA CRITICA — monitorar semanalmente
- **Score 3.0-3.9:** AMEACA MODERADA — monitorar quinzenalmente
- **Score 2.0-2.9:** AMEACA BAIXA — monitorar mensalmente
- **Score <2.0:** NAO-AMEACA — check trimestral

### 3. Analise de Vulnerabilidade Propria
- Onde este competidor e MELHOR que nos?
- Se eles atacassem nosso ponto fraco, o que aconteceria?
- Quao dificil seria para nossos clientes migrarem para eles?

### 4. Cenarios de Ameaca
- Cenario 1: Competidor mantém trajeto atual → impacto?
- Cenario 2: Competidor accelera (funding, acquisition) → impacto?
- Cenario 3: Competidor pivota para nosso nicho → impacto?

### 5. Estrategia de Resposta
- Para CRITICA: plano de defesa ativo
- Para MODERADA: fortalecer diferenciais
- Para BAIXA: monitorar, sem acao
- Para NAO-AMEACA: ignorar (nao desperdicar recursos)

## Saida
- Score de ameaca por competidor
- Ranking de ameacas
- Cenarios por top ameacas
- Estrategia de resposta recomendada

## Validacao
- [ ] 5 dimensoes avaliadas para cada competidor
- [ ] Scores calculados e ranking definido
- [ ] Cenarios para top ameacas
- [ ] Estrategia de resposta recomendada

---

*Task operada por: competitive-intelligence (Hawk)*
