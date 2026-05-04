# Quantitative Research Methods

> Métodos quantitativos avançados para pesquisa de mercado, validação de hipóteses e análise estatística. Complementa survey-design-principles.md com ferramentas analíticas.

## Fundamentos de Inferência Estatística

### Os Três Pilares

**1. Tamanho de Amostra (n)**
Determina o poder do teste — a capacidade de detectar um efeito real se ele existir.

```
Fórmula básica (proporções, 95% confiança, 5% margem de erro):
n = (Z² × p × (1-p)) / e²
n = (1.96² × 0.5 × 0.5) / 0.05²
n ≈ 384 respondentes
```

Para detectar efeito menor (ex: diferença de 3 pontos percentuais entre variantes):
- Margem de erro 3% → n ≈ 1,067
- Margem de erro 1% → n ≈ 9,604

**2. Nível de Confiança (α)**
- 95% confiança → p-value < 0.05 (padrão acadêmico e de negócios)
- 99% confiança → p-value < 0.01 (decisões críticas, saúde)
- 90% confiança → p-value < 0.10 (pesquisa exploratória, quando poder é limitado)

**3. Effect Size**
Magnitude do efeito, independente de significância estatística:
- Cohen's d (médias): 0.2 = pequeno, 0.5 = médio, 0.8 = grande
- r (correlação): 0.1 = pequeno, 0.3 = médio, 0.5 = grande

**Armadilha:** Um resultado pode ser estatisticamente significativo mas praticamente irrelevante (ex: diferença de 0.1% em conversão com n=1M).

## A/B Testing: Protocolo Rigoroso

### Design Pré-Teste (Obrigatório)

1. **Definir hipótese:** "Esperamos que [variante B] aumente [métrica] em X% porque [mecanismo]"
2. **Calcular n:** Usar power calculadora antes de iniciar (ex: Optimizely Stats Engine, statsig.com)
3. **Definir primary metric:** Uma métrica principal por experimento
4. **Definir guardrail metrics:** Métricas que NÃO devem degradar (ex: latência, NPS)
5. **Definir duration:** Mínimo 1-2 ciclos de negócio completos (geralmente 2 semanas)
6. **Definir critério de sucesso:** "Aprovar B se primary metric +X% com p<0.05 E guardrails intactos"

### Execução

| Fase | O Que Fazer | O Que NÃO Fazer |
|------|-------------|-----------------|
| **Início** | Verificar randomização, baseline estável | Começar em datas atípicas (Black Friday, feriados) |
| **Durante** | Monitorar guardrails e vieses de implementação | Parar cedo por "já parece positivo" (p-hacking) |
| **Análise** | Analisar conforme critério pré-definido | Analisar sub-grupos não planejados sem correção |
| **Decisão** | Documentar resultado completo, mesmo negativo | Fazer "test after test" até resultado positivo |

### Problemas Comuns e Correções

**Novelty Effect:** Usuários engajam mais com qualquer mudança por ser nova.
- Solução: Rodar teste por 2+ semanas, focar em cohort de usuários retornantes

**Interaction Effects:** Múltiplos experimentos rodando simultaneamente interferem.
- Solução: Segregar tráfego por experiment ID; limitar overlapping experiments

**Multiple Testing Problem:** Testar 20 métricas e encontrar 1 com p<0.05 é esperado por acaso.
- Solução: Bonferroni correction (dividir α pelo número de testes) ou familywise correction

**Simpson's Paradox:** Resultado agregado inverte direção quando segmentado.
- Solução: Sempre verificar resultados por segmentos-chave (mobile/desktop, new/returning)

## Análise de Regressão em Research

### Regressão Linear
Para entender QUAIS fatores explicam uma variável contínua:
```
Y = β₀ + β₁X₁ + β₂X₂ + ... + βₙXₙ + ε
```
- **Coeficiente β:** Quanto Y muda para cada unidade de X, mantendo outros fatores constantes
- **R²:** Percentual da variação de Y explicado pelo modelo (0-1)
- **p-value por variável:** Essa variável tem relação real com Y ou é ruído?

**Exemplo:** Qual combinação de variáveis explica o Churn rate?
Y = churn | X₁ = NPS | X₂ = uso_mensal | X₃ = tempo_de_contrato | X₄ = plano

### Regressão Logística
Para variáveis dependentes binárias (converteu / não converteu):
- Output: Probabilidade de converter dado os inputs
- Coefficients como odds ratios: OR > 1 = aumenta probabilidade, OR < 1 = diminui
- **Uso:** Modelagem de churn, propensão de compra, scoring de leads

### Correlação vs Causalidade

| Tipo | Interpretação | Limitação |
|------|--------------|-----------|
| Correlação (r) | Duas variáveis variam juntas | Não implica causa |
| Regressão | X prediz Y controlando outros fatores | Correlação sofisticada |
| Causalidade (RCT/IV/DiD) | X causa Y | Requer design experimental ou quasi-experimental |

**Framework para causalidade quando RCT não é possível:**
- **Difference-in-Differences (DiD):** Comparar grupos que foram/não foram afetados por uma mudança antes/depois
- **Instrumental Variables (IV):** Usar variável que afeta X mas não Y diretamente
- **Regression Discontinuity (RD):** Explorar corte arbitrário de elegibilidade para tratamento

## Análise de Cohort

### O Que É
Acompanhar grupos de usuários definidos por momento de aquisição ao longo do tempo.

### Tipos de Cohort

**Acquisition cohort:** Usuários que chegaram no mesmo período
- Pergunta: "Usuários que chegaram em Jan/25 são diferentes de usuários de Jun/25?"
- Output: Tabela onde cada linha = cohort, cada coluna = período (D1, D7, D30...)

**Behavioral cohort:** Usuários que fizeram mesma ação
- Pergunta: "Usuários que completaram onboarding retêm mais?"
- Output: Comparação de curvas de retenção

### Métricas de Cohort

| Métrica | Definição | Benchmark SaaS |
|---------|-----------|---------------|
| **D1 Retention** | % que retornou no dia 1 | 25-40% (B2C) |
| **D7 Retention** | % que retornou na semana 1 | 10-20% |
| **D30 Retention** | % que retornou no mês 1 | 5-10% |
| **Month 6 Retention** | % ativo após 6 meses | >30% = excelente |
| **CAC Payback** | Meses para recuperar custo de aquisição | <12 meses |
| **LTV/CAC** | Valor de vida / custo de aquisição | >3:1 |

### Curvas de Retenção

**Curva de "balde furado":** Declínio contínuo — produto sem valor diferencial
**Curva "flat tail":** Declina depois estabiliza — há um núcleo que acha valor
**Curva "smile":** Cai, depois aumenta — usuários voltam com maturidade
**Objetivo:** Elevar o "floor" — a % que estabiliza após queda inicial

## Análise Estatística para Market Research

### Segmentação Estatística

**Cluster Analysis:** Agrupar respondentes por similaridade sem grupos pré-definidos
- K-Means: Para variáveis contínuas, número de clusters definido
- Hierarchical: Dendrograma mostra hierarquia de similaridade
- **Output:** N segmentos distintos com perfis

**Factor Analysis / PCA:** Reduzir muitas variáveis em poucos fatores
- Útil quando há 20+ atributos em survey — reduz para 3-5 dimensões latentes
- **Uso:** Perceptual mapping, segmentação por valores

**Conjoint Analysis:** Medir trade-offs e prioridades implícitas
- Participantes escolhem entre alternativas com atributos variados
- **Output:** Utility values por atributo — quanto cada característica importa
- **Uso:** Pricing research, priorização de features, posicionamento

### NPS: Uso Correto e Armadilhas

**Cálculo:** %Promotores (9-10) - %Detratores (0-6)
**Benchmarks Brasil 2025 (variam por setor):**
- Tech/SaaS: 30-50 (excelente >60)
- E-commerce: 20-40
- Serviços financeiros: 20-35
- Telecom: Geralmente negativo a -10

**Armadilhas:**
- Não usar NPS como única métrica de saúde
- NPS varia muito por canal de coleta (in-app > email)
- Comparar NPS entre empresas só tem sentido com metodologia idêntica
- Transactional NPS (pós-interação) ≠ Relationship NPS (percepção geral)

**Complementar com:** Pontuação de esforço do cliente (CES), frequência de uso, health score comportamental

### Análise de Significância Estatística em Research de Mercado

**Quando duas proporções diferem significativamente?**
```
Z = (p₁ - p₂) / sqrt(p_pool × (1 - p_pool) × (1/n₁ + 1/n₂))
```
Se |Z| > 1.96 → diferença significativa a 95% de confiança.

**Ferramentas:** Calculadora online (surveymonkey.com/mp/margin-of-error-calculator), Python scipy.stats, R

## Análise de Dados Secundários

### Técnicas para Extrair Valor de Dados Públicos

**Index Construction:** Criar índice composto de múltiplas variáveis públicas
- Ex: Índice de Maturidade Digital = ponderação de penetração de internet + smartphone + e-commerce + FinTech por estado IBGE

**Proxy Variables:** Quando dado direto não existe, usar proxy correlacionado
- Ex: LinkedIn job postings de "Data Scientist" como proxy de adoção de analytics
- Domínios de email criados como proxy de criação de empresas tech

**Synthetic Data Analysis:** Combinar datasets de fontes diferentes para criar visão que nenhuma sozinha teria
- Requer: Mesma unidade de análise (empresa, estado, faixa etária)
- Atenção: Não assumir que correlação em datasets distintos implica relação real

### Análise de Séries Temporais

Para identificar tendências e sazonalidade em dados históricos:

| Componente | O Que É | Como Isoltar |
|-----------|---------|-------------|
| **Tendência** | Direção de longo prazo | Moving average, regressão sobre tempo |
| **Sazonalidade** | Padrão repetitivo (mensal/anual) | STL decomposition |
| **Ciclo** | Flutuações de médio prazo (economia) | Hodrick-Prescott filter |
| **Ruído** | Variação aleatória residual | Componente após decomposição |

---

*Knowledge base da squad-research*
