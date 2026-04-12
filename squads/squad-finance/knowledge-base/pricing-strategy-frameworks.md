# Frameworks de Estrategia de Precificacao

> Referencia completa de frameworks de pricing para servicos digitais. Inclui Hormozi Value Equation, Van Westendorp, Good/Better/Best, rate card construction e exemplos praticos.

---

## 1. Hormozi Value Equation

### Formula

```
Valor Percebido = (Dream Outcome × Perceived Likelihood of Achievement) /
                  (Time Delay × Effort & Sacrifice)
```

### Como Maximizar Cada Variavel

```
↑ DREAM OUTCOME (aumentar numerador)
  - Quantificar resultado em R$: "aumento de 30% em conversao = +R$ 500K/ano"
  - Projetar cenario futuro vivido: "imagine seu time entregando 2× mais rapido"
  - Conectar a meta do CEO, nao do gerente

↑ PERCEIVED LIKELIHOOD (aumentar numerador)
  - Cases com numeros: "Cliente X aumentou conversao em 45% em 90 dias"
  - Garantia de resultado: "se nao atingir X, Y meses gratis"
  - Metodologia documentada: processo de 6 fases comprovado
  - Credenciais e social proof

↓ TIME DELAY (reduzir denominador)
  - Quick wins na semana 1: "audit gratuito com 3 acoes imediatas"
  - Entregas faseadas: valor a cada 2 semanas, nao so no final
  - Onboarding acelerado: "comecamos amanha"

↓ EFFORT & SACRIFICE (reduzir denominador)
  - Done-for-you > Done-with-you > Do-it-yourself
  - Processo simplificado: "voce so aprova, nos fazemos tudo"
  - Comunicacao proativa: updates sem precisar perguntar
  - Single point of contact
```

### Exemplo Pratico: Redesign de E-commerce

```
SEM Value-Based:
  120 horas × R$ 250/h = R$ 30.000

COM Value-Based (Hormozi):
  Dream Outcome: +30% conversao = +R$ 600K/ano
  Perceived Likelihood: 80% (3 cases similares)
  Time Delay: 8 semanas (vs 16 de outros)
  Effort: Minimo (done-for-you)

  Valor percebido: MUITO ALTO
  Preco: R$ 80.000-120.000 (10-20% do valor gerado no 1o ano)
  Margem: 60-75% (vs 55% no modelo por hora)
```

---

## 2. Van Westendorp Price Sensitivity Meter

### As 4 Perguntas

```
Para [servico X] que oferece [beneficios Y]:

1. A que preco voce consideraria TÃO BARATO que duvidaria da qualidade?
2. A que preco voce consideraria BARATO — uma boa compra pelo valor?
3. A que preco voce consideraria CARO — mas ainda aceitavel?
4. A que preco voce consideraria CARO DEMAIS — e nao compraria?
```

### Interpretacao das Intersecoes

```
PMC (Point of Marginal Cheapness): Too Cheap ∩ Expensive
  → Abaixo deste preco, voce perde credibilidade

PME (Point of Marginal Expensiveness): Too Expensive ∩ Cheap
  → Acima deste preco, voce perde mercado

IDP (Indifference Price Point): Cheap ∩ Expensive
  → Preco que divide o mercado ao meio — preco "normal"

OPP (Optimal Price Point): Too Cheap ∩ Too Expensive
  → Menor resistencia de preco — ponto otimo teorico

Acceptable Price Range: PMC → PME
  → Faixa segura para precificar
```

### Quando Usar

- Lancamento de servico com pouca referencia de mercado
- Reposicionamento de preco (subir ou descer)
- Amostra minima: 30 respondentes (ideal: 100+)

---

## 3. Good/Better/Best Tier Architecture

### Estrutura

```
| | GOOD (Entry) | BETTER (Target) | BEST (Premium) |
|---|-------------|-----------------|----------------|
| Nome | Essentials | Professional | Enterprise |
| Margem | 40-50% | 55-65% | 70-80% |
| Conversao | 20-30% | 50-60% | 10-20% |
| Proposito | Ancora baixa | Melhor custo-beneficio | Ancora alta |
```

### Regras Psicologicas

```
1. PRECO:
   Good: X
   Better: 1.8× a 2.2× de Good
   Best: 3.0× a 4.0× de Good
   → Better parece "o melhor negocio"

2. FEATURES:
   Good: 60% das features
   Better: 100% das features essenciais
   Best: 100% + extras exclusivos
   → Good deve ser funcional mas "sentir falta" de algo

3. NAMING:
   Evitar: Basic/Standard/Premium (generico)
   Preferir: Starter/Growth/Scale ou Essentials/Professional/Enterprise

4. DESTAQUE VISUAL:
   Better SEMPRE destacado (badge "Most Popular", cor diferente)

5. DECOY EFFECT:
   Best funciona como decoy que faz Better parecer razoavel
   Se Best = R$ 50K e Better = R$ 25K, Better parece "metade do preco"
```

### Exemplo: Servico de Landing Page

```
| | Essentials | Professional | Enterprise |
|---|-----------|-------------|-----------|
| Paginas | 1 | 3 | 5+ |
| Responsivo | Sim | Sim | Sim |
| SEO | Basico | Avancado | Avancado + Blog |
| Analytics | GA4 | GA4 + Hotjar | GA4 + Hotjar + Dashboard |
| Revisoes | 2 | 4 | Ilimitadas |
| Suporte | Email | Email + Chat | Dedicado |
| Prazo | 4 semanas | 3 semanas | 2 semanas |
| Preco | R$ 8.000 | R$ 15.000 | R$ 30.000 |
| Margem | 45% | 60% | 72% |
```

---

## 4. Rate Card Construction

### Principios

```
1. Base: Custo loaded × Markup
2. Ajuste: Benchmark de mercado
3. Validacao: Win rate > 30% (se menor, preco alto; se > 50%, preco baixo)
4. Floor: NUNCA abaixo de 2.0× custo loaded
```

### Markup por Senioridade

```
| Nivel | Markup | Justificativa |
|-------|--------|---------------|
| Junior | 2.0-2.5× | Alta supervisao necessaria |
| Pleno | 2.5-3.0× | Autonomo, backbone da equipe |
| Senior | 3.0-4.0× | Resolve problemas complexos |
| Lead | 3.5-5.0× | Multiplica produtividade da equipe |
| Director | 5.0-8.0× | Decisoes estrategicas, acesso C-level |
```

### Politica de Descontos

```
| Tipo | Desconto Max | Aprovacao |
|------|-------------|----------|
| Volume (> 500h/mes) | 10% | Comercial |
| Contrato anual | 8% | Comercial |
| Pre-pagamento | 5% | Financeiro |
| Acumulado maximo | 15% | Diretoria |
| Abaixo do floor | PROIBIDO | — |
```

---

## 5. Modelos de Pricing para Servicos

### Time & Material (T&M)

```
Preco = Horas × Rate
Vantagem: Simples, flexivel
Desvantagem: Cliente nao sabe custo total, incentiva ineficiencia
Quando: Escopo indefinido, discovery, suporte
```

### Fixed Price

```
Preco = Escopo estimado × Rate + Contingencia (15-20%)
Vantagem: Previsibilidade para o cliente
Desvantagem: Risco de escopo para a agencia
Quando: Escopo bem definido, cliente quer previsibilidade
```

### Retainer

```
Preco = Pacote de horas/mes × Rate com desconto (5-10%)
Vantagem: Receita recorrente, previsibilidade
Desvantagem: Horas nao usadas (credito ou perda?)
Quando: Relacionamento longo, demandas contínuas
```

### Value-Based

```
Preco = % do valor gerado ao cliente
Vantagem: Alinhamento de incentivos, alta margem
Desvantagem: Dificil quantificar, risco se resultado nao vem
Quando: Impacto mensuravel (conversao, receita, economia)
```

### Performance-Based (Hibrido)

```
Preco = Fee fixo (cobre custos) + Success fee (% do resultado)
Vantagem: Risco compartilhado
Desvantagem: Complexo de medir e cobrar
Quando: Cliente quer risco compartilhado, outcome mensuravel
```
