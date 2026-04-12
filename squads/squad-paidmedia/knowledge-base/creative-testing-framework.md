# Creative Testing Framework

## Hypothesis Formation

### Formato Obrigatorio: IF/THEN/BECAUSE
```
IF [mudamos variavel X]
THEN [metrica Y muda em Z%]
BECAUSE [racional baseado em dados/pesquisa/heuristica]
```

### Exemplos
- IF adicionamos um numero no headline do video (hook), THEN hook rate aumenta 20%, BECAUSE numeros chamam atencao e criam curiosidade especifica
- IF trocamos o CTA de "Saiba Mais" para "Ver Precos", THEN CTR aumenta 15%, BECAUSE "Ver Precos" indica intencao mais clara e atrai trafego mais qualificado
- IF usamos formato UGC ao inves de polished, THEN CVR aumenta 25%, BECAUSE UGC gera mais confianca em cold audiences

## Variable Isolation Principles

### Hierarquia de Variaveis (do maior ao menor impacto)

| Nivel | Variavel | Impacto Estimado | Exemplo de Teste |
|-------|----------|-----------------|------------------|
| 1 | Concept/Angle | 50-200%+ de diferenca | Beneficio A vs Beneficio B |
| 2 | Hook (primeiros 3s) | 30-100% | Question vs Statistic vs Demo |
| 3 | Format | 20-60% | Video vs Image vs Carousel |
| 4 | Body/Messaging | 10-30% | Social proof vs Urgencia |
| 5 | CTA | 5-15% | "Comprar Agora" vs "Ver Ofertas" |

### REGRA: Testar 1 variavel por teste
- Se mudar hook E CTA: nao sabe qual causou o resultado
- Se precisa testar 2 variaveis: fazer 2 testes sequenciais
- Excecao: Multivariate testing (precisa de MUITO volume)

### Ordem de Testes
Comecar pelo Nivel 1 (maior impacto). So descer para niveis inferiores quando os superiores estao otimizados.

## Sample Size Calculations

### Formula
```
n = ((Z_α/2 + Z_β)² × (p₁(1-p₁) + p₂(1-p₂))) / (p₁ - p₂)²

Onde:
- Z_α/2 = 1.96 (para 95% confidence)
- Z_β = 0.84 (para 80% power)
- p₁ = baseline conversion rate
- p₂ = expected conversion rate (p₁ × (1 + MDE))
```

### Tabela de Referencia Rapida

| Baseline CVR | MDE 10% | MDE 15% | MDE 20% | MDE 25% |
|-------------|---------|---------|---------|---------|
| 1% | 190,000 | 85,000 | 48,000 | 31,000 |
| 2% | 94,000 | 42,000 | 24,000 | 15,000 |
| 3% | 62,000 | 28,000 | 16,000 | 10,000 |
| 5% | 36,000 | 16,000 | 9,100 | 5,900 |
| 10% | 17,000 | 7,500 | 4,300 | 2,700 |

*Valores por variante. Total = valor × 2 (control + variant).*

### Implicacoes Praticas
- CVR 2%, MDE 20% → precisa 48,000 visitors total → a $2 CPC = $96K de test budget
- Se nao tem volume: usar MDE maior (25-30%) ou testar variacoes mais dramaticas
- **Min 7 dias** independente do sample size (para capturar day-of-week patterns)

## Test Duration Formulas

### Calculo
```
Duracao (dias) = Sample Size Total / Daily Traffic

Daily Traffic = Daily Impressions × CTR
```

### Limites
- **Minimo:** 7 dias (day-of-week variation)
- **Maximo recomendado:** 30 dias (apos isso, condições de mercado mudam)
- **Se duracao >30 dias:** aumentar MDE ou budget de teste

## Success Criteria Framework

### Para declarar Winner
1. **P-value < 0.05** (95% confidence)
2. **Sample size atingido** (conforme calculo)
3. **Min 7 dias de teste** (day-of-week coverage)
4. **Guardrail metrics OK** (CPA nao subiu >10%)
5. **Practical significance** (a diferença importa para o negocio)

### Para declarar Inconclusivo
- P-value >= 0.05 E sample size atingido → diferenca provavelmente pequena
- Opcoes: re-testar com MDE menor (mais volume) ou aceitar que nao ha diferenca

### Para parar um teste cedo
- APENAS se um lado tem 0 conversoes com 2x o sample size esperado → bug
- Tracking quebrou durante o teste → invalidar, re-iniciar
- NUNCA parar cedo porque "parece estar ganhando" → peeking problem

## Hook Formula Categories (6 Tipos)

### 1. Question Hook
"Voce sabia que [fato surpreendente]?"
- Melhor para: cold audiences, curiosity gap
- Exemplo: "Voce sabia que 73% dos e-commerces perdem venda por formulario longo?"

### 2. Statistic Hook
"[Numero impactante] [contexto]"
- Melhor para: credibilidade, B2B, data-driven audiences
- Exemplo: "R$ 2.3 milhoes economizados em 2025 pelos nossos clientes"

### 3. Bold Statement Hook
"[Afirmacao provocativa ou contra-intuitiva]"
- Melhor para: pattern interrupt, awareness
- Exemplo: "Seu marketing digital esta queimando 30% do budget"

### 4. Demonstration Hook
[Mostrar resultado/antes-depois nos primeiros 3 segundos]
- Melhor para: produtos visuais, resultados tangiveis
- Exemplo: screen recording mostrando o dashboard antes/depois

### 5. Testimonial Hook
"[Citacao impactante de cliente]"
- Melhor para: social proof, trust building
- Exemplo: "Triplicamos as vendas em 60 dias — CEO da XYZ"

### 6. Pattern Interrupt Hook
[Elemento visual ou sonoro inesperado que quebra o scroll]
- Melhor para: Meta Feed, TikTok, alta concorrencia visual
- Exemplo: pessoa olhando direto para camera e dizendo "PARA."
