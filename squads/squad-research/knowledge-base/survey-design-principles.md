# Survey Design Principles

## Tipos de Perguntas

### Likert Scale
- **Formato:** "Concordo totalmente" → "Discordo totalmente" (5 ou 7 pontos)
- **Quando usar:** Medir atitudes, satisfacao, concordancia
- **Best practice:** Usar labels em todos os pontos, nao apenas extremos

### NPS (Net Promoter Score)
- **Formato:** "De 0-10, qual a probabilidade de recomendar?"
- **Quando usar:** Benchmark de satisfacao/lealdade
- **Calculo:** %Promoters (9-10) - %Detractors (0-6)

### MaxDiff (Best-Worst Scaling)
- **Formato:** De uma lista, escolher MELHOR e PIOR
- **Quando usar:** Priorizar features, atributos, mensagens
- **Vantagem:** Forca trade-offs (evita "tudo e importante")

### Open-Ended
- **Formato:** Texto livre
- **Quando usar:** Explorar linguagem natural, descobrir o inesperado
- **Limitacao:** Dificil de analisar em escala, baixo response rate

## Prevencao de Bias

### Leading Questions (EVITAR)
- **Ruim:** "Voce concorda que nosso produto e excelente?"
- **Bom:** "Como voce avalia nosso produto?"
- **Regra:** Pergunta nao deve sugerir a resposta

### Double-Barreled Questions (EVITAR)
- **Ruim:** "O produto e rapido e facil de usar?"
- **Bom:** Separar em 2 perguntas
- **Regra:** 1 conceito por pergunta

### Order Effects
- Randomizar ordem de opcoes quando possivel
- Perguntas gerais ANTES de especificas (funnel approach)
- Nao colocar pergunta sensivel no inicio

### Social Desirability
- Usar linguagem neutra
- Oferecer opcao "prefiro nao responder"
- Considerar anonimato para topicos sensiveis

### Absolute Language (EVITAR)
- **Ruim:** "Voce SEMPRE usa nosso produto?"
- **Bom:** "Com que frequencia voce usa nosso produto?"

## Sample Size

### Calculo Basico
- **Exploratoria:** 50-100 respostas (insights qualitativos)
- **Quantitativa (95% confidence, 5% margin):** ~384 respostas
- **Por segmento:** Min 30-50 respostas por subgrupo analisado
- **Formula:** n = (Z² × p × (1-p)) / e²

### Response Rate Benchmarks
- Email survey: 5-15%
- In-app survey: 15-30%
- NPS post-interaction: 20-40%
- Painel pago: 30-60%

## Distribuicao

| Canal | Response Rate | Custo | Bias |
|-------|:------------:|:-----:|------|
| Email | 5-15% | Baixo | Non-response |
| In-app | 15-30% | Baixo | Active users only |
| Painel | 30-60% | Medio-Alto | Professional respondents |
| Social | 1-5% | Baixo | Self-selection forte |
| SMS | 10-20% | Medio | Mobile-centric |

## Anti-Patterns

| Anti-Pattern | Problema | Solucao |
|-------------|----------|---------|
| Survey muito longo (>15min) | Dropout alto, respostas apressadas | Max 5-7 min, 15-20 perguntas |
| Escala inconsistente | Confusao do respondente | Mesma escala em todo o survey |
| Sem pre-teste | Perguntas ambiguas nao detectadas | Pilot com 5-10 pessoas |
| Sem pre-analysis plan | P-hacking, cherry picking | Definir analises ANTES de coletar |
| Opcoes mutuamente nao-exclusivas | Respostas invalidas | Testar MECE das opcoes |

## Pilot Testing (OBRIGATORIO)
1. Testar com 5-10 pessoas do target
2. Cronometrar tempo real de resposta
3. Pedir feedback: algo confuso? Faltou opcao?
4. Verificar: distribuicao de respostas faz sentido?
5. Ajustar e re-testar se necessario

---

*Knowledge base da squad-research*
