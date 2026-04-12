# Capital Budgeting — Analise de Investimentos

> Avaliacao de projetos de investimento: NPV, IRR, Payback, PI, MIRR, Monte Carlo, analise de sensibilidade, opcoes reais. Framework completo para decisao de CAPEX.

---

## 1. Conceito

Capital budgeting e o processo de avaliar e selecionar investimentos de longo prazo (projetos, expansoes, aquisicoes, CAPEX). E a decisao financeira mais consequente: compromete recursos por longos periodos e determina a trajetoria estrategica da firma.

**Pergunta central:** Este investimento cria ou destroi valor?

---

## 2. Metricas de Avaliacao de Projetos

| Metrica | Formula | Regra de Decisao | Limitacao Principal |
|---------|---------|-----------------|---------------------|
| **NPV (VPL)** | Σ FCF_t/(1+WACC)^t - Investimento | NPV > 0 → Aceitar | Depende da taxa de desconto |
| **IRR (TIR)** | Taxa que faz NPV = 0 | IRR > WACC → Aceitar | Multiplas IRRs possiveis; problemas com mutuamente exclusivos |
| **Payback Period** | Tempo para recuperar investimento | Payback < limite → Aceitar | Ignora fluxos apos payback; ignora valor do tempo |
| **Discounted Payback** | Tempo para recuperar (fluxos descontados) | Similar ao payback | Ainda ignora fluxos apos payback |
| **Profitability Index (PI)** | PV dos FCFs / Investimento | PI > 1 → Aceitar | Pode conflitar com NPV em mutuamente exclusivos |
| **MIRR** | IRR com taxa de reinvestimento realista | MIRR > WACC → Aceitar | Premissas de reinvestimento subjetivas |
| **ROIC** | NOPAT / Capital Investido | ROIC > WACC → Cria valor | Metrica pontual, nao captura timing |

---

## 3. NPV — O Metodo Superior

A teoria financeira e clara: **NPV e o metodo superiror**. Razoes:

1. Mede criacao de valor em termos absolutos (R$)
2. Considera valor do dinheiro no tempo corretamente
3. Nao tem problemas de multiplas solucoes (como IRR)
4. Funciona para projetos mutuamente exclusivos
5. E aditivo: NPV(portfolio) = Soma dos NPVs individuais

**Na pratica, gestores usam multiplas metricas complementarmente:**
- **NPV** para decisao final
- **IRR** para comunicacao ("o projeto rende 25% ao ano")
- **Payback** para avaliacao de risco ("recuperamos em 3 anos")

### Conflito NPV vs IRR

```
Projeto A: Investimento R$ 1M, NPV = R$ 500K, IRR = 20%
Projeto B: Investimento R$ 100K, NPV = R$ 80K, IRR = 35%

NPV recomenda A (mais valor absoluto).
IRR recomenda B (maior retorno percentual).

Decisao correta: A (maior criacao de valor absoluto) — usar NPV.
```

---

## 4. Passos de Capital Budgeting

```
1. IDENTIFICAR o projeto e seu escopo (CAPEX, prazo, riscos)
2. PROJETAR FCFs incrementais (apenas fluxos que mudam por causa do projeto)
3. ESTIMAR taxa de desconto (WACC do projeto, ajustado pelo risco)
4. CALCULAR NPV, IRR, Payback
5. ANALISE DE SENSIBILIDADE (variaveis criticas)
6. ANALISE DE CENARIOS (Base/Bull/Bear)
7. MONTE CARLO (se alta incerteza)
8. DECIDIR (NPV > 0 e ROIC > WACC)
9. MONITORAR pos-investimento (actual vs. projetado)
```

**FCFs incrementais — o que incluir:**
- Inclui: receitas adicionais, custos economizados, CAPEX inicial, capital de giro adicional
- Exclui: sunk costs (ja gastos, irreversíveis), custos alocados (overhead que nao muda)
- Inclui: valor terminal do ativo (residual value)

---

## 5. Analise de Sensibilidade

### Tornado Diagram

Mostra quais variaveis mais impactam o NPV:

```
Variavel          NPV Pessimista     NPV Otimista
─────────────────────────────────────────────────
Preco de Venda    ─────────[    ]──────
Volume            ───────[      ]────
Taxa de Desconto  ─────[        ]──
Custo de COGS     ────[         ]──
CAPEX             ───[          ]──
```

Variaveis com maior amplitude = mais criticas = monitorar mais.

### Analise Univariada de Sensibilidade

```
Para cada variavel-chave:
  Variar ±10%, ±20%, ±30% do valor base
  Calcular NPV em cada cenario
  Identificar break-even (NPV = 0)

Exemplo:
  Preco base: R$ 50/unidade
  Break-even de preco: R$ 42/unidade (16% abaixo do base)
  → Margem de seguranca de preco: 16%
```

---

## 6. Monte Carlo — Simulacao Probabilistica

### Passos

```
1. IDENTIFICAR variaveis com incerteza (volume, preco, custo, crescimento)
2. DEFINIR distribuicao de probabilidade para cada:
   - Normal: variavel continua sem assimetria (ex: margem bruta)
   - Triangular: minimo, mais provavel, maximo (ex: volume de vendas)
   - Uniforme: qualquer valor igualmente possivel (ex: taxa de cambio em range)
3. DEFINIR correlacoes entre variaveis (preco e volume tendem a ser inversamente correlacionados)
4. SIMULAR 10.000+ cenarios (ferramentas: @RISK, Crystal Ball, Python scipy)
5. ANALISAR distribuicao de NPV:
   - Media (expected NPV)
   - Desvio padrao (risco)
   - Percentil 5% (worst case razoavel)
   - P(NPV < 0) (probabilidade de perda)
```

### Output Tipico

```
Simulacao de NPV (10.000 cenarios):
  Media: R$ 2.3M
  Desvio padrao: R$ 800K
  P10 (pior 10%): R$ 900K
  P90 (melhor 10%): R$ 3.8M
  P(NPV < 0): 3.2%

Decisao: Aceitar (NPV medio positivo, probabilidade de perda baixa)
```

---

## 7. Ajuste de Risco por Projeto

**Nem todo projeto usa o WACC corporativo.** O WACC corporativo e adequado para projetos com risco similar ao da empresa. Para projetos mais ou menos arriscados:

| Tipo de Projeto | Ajuste de Taxa |
|----------------|----------------|
| Expansao do core business (risco similar) | WACC corporativo |
| Novo produto no mesmo mercado | WACC + 1-3% |
| Entrada em novo mercado | WACC + 3-6% |
| Projeto altamente incerto / P&D | WACC + 5-10% |
| Projeto com risco menor (contrato garantido) | WACC - 1-3% |

**Alternativa:** usar beta do setor do projeto (desalavancado) para calcular um WACC especifico.

---

## 8. Payback vs NPV — Quando Usar Payback

Apesar de inferior ao NPV, o payback tem utilidade pratica em:
- **Projetos em mercados muito volateis** onde visibilidade de longo prazo e baixa
- **Restrição de caixa** — empresa precisa recuperar investimento rapido para sobreviver
- **Comunicacao para executivos nao-financeiros** — facil de entender
- **Screening inicial** — filtrar projetos viaveis antes da analise completa

**Regra pratica para CAPEX em negocios de servicos:**
- Payback < 2 anos: alta prioridade
- Payback 2-4 anos: analisar com NPV e Monte Carlo
- Payback > 4 anos: exige justificativa estrategica forte

---

## 9. Analise de Cenarios

### Template de 3 Cenarios

```
| Variavel | Pessimista (20%) | Base (60%) | Otimista (20%) |
|----------|-----------------|------------|----------------|
| Receita | -20% | Conforme forecast | +20% |
| Margem | -3pp | Conforme projecao | +2pp |
| CAPEX | +15% | Conforme orcamento | -5% |
| WACC | +2pp | Conforme calculo | -1pp |
| Crescimento | -2pp | Conforme plano | +3pp |

NPV Esperado = 0.20 × NPV_pess + 0.60 × NPV_base + 0.20 × NPV_otim
```

---

## 10. Post-Investment Review

Muitas empresas ignoram — mas e critico para aprendizado:

```
6 meses apos investimento:
  Receitas reais vs. projetadas
  Custos reais vs. projetados
  CAPEX real vs. orcado
  NPV atualizado com dados reais
  Licoes aprendidas para proximas decisoes
```

Empresas que fazem post-investment review tomam decisoes de CAPEX significativamente melhores ao longo do tempo.

---

## 11. Capital Budgeting no Contexto Brasileiro (2026)

**Fatores especificos:**
- Selic a 14,75%: WACC brasileiro tipicamente 18-28% — projetos precisam de retorno muito alto para criar valor
- Depreciacao acelerada: incentivo tributario para CAPEX (deduz mais rapido do IR)
- Cambio volatil: CAPEX importado em USD tem risco de overrun em BRL
- BNDES: alternativa de custo mais baixo para CAPEX de longo prazo (TLP < CDI tipicamente)
- Reforma Tributaria: investimentos em eficiencia fiscal podem ter NPV positivo

---

## 12. Referencias

- **"Principles of Corporate Finance"** — Brealey, Myers & Allen (caps. capital budgeting)
- **"Investment Science"** — David Luenberger
- **"Real Options"** — Lenos Trigeorgis
- **"Capital Budgeting"** — Pamela Peterson & Frank Fabozzi
