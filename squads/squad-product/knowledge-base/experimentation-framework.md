# Experimentation Framework

## Purpose
Framework completo para design, execucao e analise de experimentos em produto — desde hipoteses ate decisoes baseadas em evidencia estatistica.

## Principios de uma Cultura de Experimentacao

1. **Velocidade importa** — Numero de experimentos/tempo correlaciona diretamente com growth
2. **Maioria falha e normal** — 70-80% dos experimentos nao tem resultado positivo; falha = aprendizado
3. **Hipotese antes do teste** — Todo experimento precisa de hipotese falsificavel escrita antes
4. **Dados vencem HiPPO** — HiPPO = Highest Paid Person's Opinion. Evidencia sempre supera opinio
5. **Guardrails sao obrigatorios** — Todo experimento tem metricas que nao podem degradar
6. **Aprender > Ganhar** — Experimento que ensina algo sem resultado positivo ainda tem valor

## Template de Hipotese (obrigatorio)

```
SE [mudanca especifica no produto/experiencia],
ENTAO [resultado esperado com base em insight],
PORQUE [logica/mecanismo subjacente].

Mediremos: [metrica primaria]
Esperamos: [X% de mudanca] em [periodo]
Guardrails: [metricas que NAO podem degradar — ex: NPS, revenue, error rate]
Segmentos a analisar: [new users / power users / mobile / etc.]
```

**Exemplo concreto:**
```
SE reduzirmos os campos do formulario de signup de 6 para 3,
ENTAO a taxa de ativacao aumentara 15%,
PORQUE menos friccao no ponto critico de entrada reduz abandono.

Mediremos: Activation Rate (% que completa onboarding em D7)
Esperamos: 15% de aumento relativo em 14 dias de experimento
Guardrails: Taxa de email valido nao pode cair abaixo de 90%, NPS D30 nao pode cair
Segmentos: new signups — todos os canais
```

## Ciclo Completo de Experimentacao

```
1. Ideacao → gerar hipoteses a partir de dados, entrevistas, analytics
2. Priorizacao → ICE ou RICE scoring (ver pm-frameworks-reference.md)
3. Design → definir variantes, metricas primarias, guardrails, sample size
4. Implementacao → feature flags, tracking events, QA
5. Execucao → rodar ate significancia estatistica (sem peeking!)
6. Analise → avaliar resultados + segmentar por cohort, device, plan
7. Decisao → Ship / Iterate / Kill
8. Documentacao → registrar hipotese, resultado, aprendizado no repositorio
```

## Estatistica para A/B Testing

### Frequentist vs. Bayesian

| Aspecto | Frequentist | Bayesian |
|---------|-------------|----------|
| Pergunta | "Qual a prob de ver esses dados se H0 e verdadeira?" | "Qual a prob de A ser melhor que B?" |
| Resultado | p-value + intervalo de confianca | Probabilidade posterior |
| Sample size | Fixo (calculado antes) | Pode parar cedo |
| Interpretacao | Tecnica (mal interpretada frequentemente) | Intuitiva ("90% chance de A ser melhor") |
| Peeking | Proibido — infla falsos positivos | Permitido com cuidado |
| Ferramentas | VWO, Growthbook | Optimizely STATS Engine, Statsig |

**Recomendacao:** Para times iniciantes, abordagem Bayesian e mais segura por ser mais intuitiva. Para times maduros com volume, frequentist rigoroso ou Bayesian sequencial.

### Parametros Fundamentais

```
Alpha (α) = 0.05 → 5% de chance de falso positivo (padrao da industria)
Power (1-β) = 0.80 → 80% de chance de detectar efeito real (minimo aceitavel)
MDE = Minimum Detectable Effect → menor efeito que vale detectar

Regra pratica: quanto menor o MDE, mais amostra voce precisa
```

### Formula de Sample Size

```
n = (Zα/2 + Zβ)² × 2 × p × (1-p) / d²

onde:
p = taxa de conversao baseline (controle)
d = MDE em termos absolutos (ex: 0.02 para 2pp de aumento)
Zα/2 = 1.96 (para α = 0.05, two-tailed)
Zβ = 0.84 (para power = 0.80)

Exemplo:
p = 0.05 (5% de conversao baseline)
MDE = 20% relativo → d = 0.01 (5% × 20% = 1pp)
n ≈ 7.680 usuarios por variante
```

**Calculadoras gratuitas:** Evan Miller A/B Test Calculator, Optimizely Sample Size Calculator

### Erros Comuns

| Erro | Consequencia | Como Evitar |
|------|-------------|-------------|
| Peeking (olhar antes do fim) | Infla falsos positivos | Definir duração antes de rodar |
| Parar cedo quando positivo | Falso positivo | Rodar ate sample size calculado |
| Testar multiplas metricas sem correcao | Aumenta chance de falso positivo | Bonferroni: α_adj = 0.05 / n_tests |
| Segmentos pos-hoc sem ajuste | Findings espurios | Pre-registrar segmentos de interesse |
| Novidade Effect (Hawthorne) | Resultado nao sustentavel | Rodar experimento 2+ semanas |
| Sample Ratio Mismatch (SRM) | Invalida experimento | Verificar distribuicao 50/50 apos inicio |

## Multi-Armed Bandit (MAB)

Alternativa ao A/B teste classico que otimiza durante o experimento. Aloca trafego progressivamente para a variante com melhor performance.

**Quando usar MAB:**
- Otimizacoes continuas (ex: qual subject line de email funciona melhor)
- Contextos onde o "regret" (perda durante teste) e caro
- Experimentos de curto prazo sem necessidade de inferencia causal rigorosa

**Quando NAO usar MAB:**
- Quando precisa de conclusao estatistica precisa sobre magnitude de efeito
- Quando o experimento tem implicacoes causais importantes
- Quando ha sazonalidade (MAB pode convergir em variante por razoes de timing)

**Algoritmos:**
- **Epsilon-greedy:** Explora X% do trafego, explota (1-X)%
- **UCB (Upper Confidence Bound):** Balanceia incerteza e performance historica
- **Thompson Sampling:** Amostra de distribuicao posterior (Bayesian — recomendado)

## Ferramentas de Experimentacao

| Ferramenta | Tipo | Diferencial | Quando usar |
|-----------|------|-------------|-------------|
| **Statsig** | Full-stack | Feature flags + experiments + analytics | Times de tech com infra propria |
| **Optimizely** | Enterprise | STATS Engine (Bayesian sequencial) | Enterprise com budget |
| **PostHog** | Open-source | Flags + experiments + session replay | Startups, self-hosted |
| **Growthbook** | Open-source | Bayesian, warehouse-native | Times que usam BigQuery/Snowflake |
| **LaunchDarkly** | Feature flags | Feature management primeiro | Times que precisam de flag mgmt robusto |
| **VWO** | CRO-focused | Visual editor, heatmaps | Times nao-tecnico, CRO de site |
| **AB Tasty** | Enterprise | Forte no Brasil e Europa | Times Brasil com budget medio |

## Experimentation Velocity — Metricas

| Metrica | Definicao | Benchmark |
|---------|-----------|-----------|
| Tests/month | Experimentos iniciados | >10 para times maduros |
| Time to launch | Ideia → lancamento do experimento | < 1 semana (ideal) |
| Win rate | % de testes com resultado positivo | 15-30% (normal) |
| Test coverage | % de features/pages com tests ativos | >50% para lideres |
| Cycle time | Duracao media de um experimento | 2-4 semanas |

## Repositorio de Experimentos — Template

Cada experimento deve ser documentado com:

```yaml
experiment_id: EXP-{numero}
name: "Nome descritivo"
hypothesis: "SE... ENTAO... PORQUE..."
primary_metric: ""
guardrail_metrics: []
start_date: ""
end_date: ""
sample_size_per_variant: 0
actual_sample: 0
result:
  control: ""
  variant: ""
  lift: ""
  p_value: ""
  confidence: ""
decision: "ship | iterate | kill"
learnings: |
  O que aprendemos independente do resultado
next_steps: ""
```

## Anti-Patterns de Experimentacao

| Anti-Pattern | Por que e problema |
|-------------|-------------------|
| "Sabemos que vai funcionar, e so confirmar" | Confirmation bias — experimentos devem poder falsificar hipoteses |
| Rodar experimento por 2 dias | Nao capta sazonalidade semanal, amostra insuficiente |
| 10 metricas primarias | Aumenta chance de falso positivo — 1 metrica primaria por experimento |
| Rodar em 5% do trafego "para ser seguro" | Demora muito para alcancar significancia — calcule sample size corretamente |
| Nao documentar hipotese antes | Permite racionalizacao post-hoc de qualquer resultado |
| Esconder resultados negativos | Cria cultura de fear of failure — compartilhe aprendizados de falhas |

## Integracao com Discovery

Experimentos fecham o loop do Continuous Discovery:
```
Interview → Identify Opportunity → OST Mapping
→ Assumption Mapping → Design Experiment
→ Run Experiment → Validate/Invalidate Assumption
→ Ship ou pivot → Next Interview Cycle
```

Ver `discovery-methodology-playbook.md` para a conexao com OST.
