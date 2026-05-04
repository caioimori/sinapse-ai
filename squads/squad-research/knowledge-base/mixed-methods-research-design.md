# Mixed Methods Research Design

> Framework para combinar métodos qualitativos e quantitativos em pesquisas integradas. Maximiza validade e riqueza de insights.

## Por Que Mixed Methods

Nenhum método é superior — são complementares:

| Qualitativo | Quantitativo |
|-------------|--------------|
| Responde "por que?" e "como?" | Responde "quantos?" e "com que frequência?" |
| Profundidade de compreensão | Generalização para população |
| Hipóteses emergentes | Teste de hipóteses |
| Significado e contexto | Prevalência e magnitude |
| N pequeno, riqueza alta | N grande, profundidade limitada |

**Mixed Methods:** Usa ambos de forma integrada, com design que maximiza a contribuição de cada um.

## Os 4 Designs Principais

### Design 1: Exploratório Sequencial (QUAL → QUAN)

```
Pesquisa Qualitativa
    → Gerar hipóteses e dimensões
    → Construir survey/instrumento quantitativo
        → Validar em escala
            → Quantificar e generalizar
```

**Quando usar:** Campo pouco estudado, não há framework ou instrumento validado.

**Exemplo:** Entrevistas com 15 early adopters → identificar 5 dimensões de valor → survey com 500 usuários para medir importância de cada dimensão.

**Timing:** Qualitativo antes de decidir o que medir quantitativamente.

### Design 2: Explanatório Sequencial (QUAN → QUAL)

```
Pesquisa Quantitativa (survey, analytics)
    → Identificar padrões, segmentos ou outliers
        → Pesquisa Qualitativa com casos específicos
            → Explicar os mecanismos por trás dos números
```

**Quando usar:** Dados quantitativos geraram resultado surpreendente ou segmento interessante que precisa de explicação.

**Exemplo:** Análise de cohort identifica que usuários de segunda-feira retêm 40% mais → entrevistas com usuários de segunda-feira para entender por quê.

**Timing:** Quantitativo guia a amostragem qualitativa.

### Design 3: Convergente (Paralelo)

```
Pesquisa Qualitativa  +  Pesquisa Quantitativa
        (simultâneas, independentes)
                ↓               ↓
            Resultados      Resultados
                    ↓
               Triangulação
                    ↓
          Integração e Interpretação
```

**Quando usar:** Quer comparar perspectivas de profundidade com dados de escala.

**Exemplo:** Entrevistas com 20 clientes + survey com 400 clientes executados em paralelo → comparar temas emergentes vs. métricas de satisfação.

**Força:** Achados que convergem = maior confiança. Divergências = campo fértil para investigação.

### Design 4: Transformativo/Embedded

```
Pesquisa Principal (QUAN ou QUAL)
    Embutida: pesquisa secundária do outro tipo em fase específica
```

**Quando usar:** Uma abordagem é claramente dominante mas precisa de complementação em fase específica.

**Exemplo:** RCT (principal quantitativo) com entrevistas qualitativas embutidas na fase de análise de processo.

## Triangulação: Como Executar

Triangulação é o processo de convergir múltiplas fontes de evidência para validar achados.

### Tipos de Triangulação

| Tipo | O Que É | Exemplo |
|------|---------|---------|
| **Metodológica** | Mesmo fenômeno, métodos diferentes | Entrevista + survey + analytics |
| **Fontes** | Mesma metodologia, fontes diferentes | Clientes + não-clientes + churned |
| **Analista** | Mesmo material, analistas diferentes | 2 pessoas codificam as mesmas entrevistas |
| **Teórica** | Interpretar dados com frameworks diferentes | Grounded theory + JTBD + HMW |

### Protocolo de Triangulação

1. Completar análise de cada fonte/método **independentemente**
2. Documentar achados de cada fonte **antes** de comparar
3. Mapear: Onde convergem? Onde divergem?
4. Interpretação:
   - **Convergência:** Alta confiança — múltiplas janelas para mesma realidade
   - **Divergência:** Investigar — pode indicar facetas diferentes ou viés em uma fonte
   - **Complementaridade:** Fontes diferentes iluminam aspectos diferentes — integrar

## Integration Points: Onde Conectar Qual-Quan

| Momento | Decisão de Integração | Exemplo |
|---------|----------------------|---------|
| **Design** | Como o qualitativo informa o instrumento quantitativo? | Dimensões de entrevista → perguntas de survey |
| **Amostragem** | Como o quantitativo seleciona casos para qualitativo? | Segmentos extremos para deep-dive |
| **Análise** | Como dados são analisados em conjunto? | Joint Display tables |
| **Interpretação** | Como os achados são discutidos integradamente? | Quando convergem/divergem: o que isso significa? |

## Joint Display: Ferramenta de Integração Visual

Matriz que coloca achados qualitativos e quantitativos lado a lado para comparação:

| Tema/Segmento | Achado Qualitativo | Achado Quantitativo | Convergência? |
|--------------|-------------------|--------------------:|:-------------:|
| Friction no onboarding | "Não entendi o primeiro passo" (8/15 participantes) | Taxa de completion: 34% | Convergente |
| Valor percebido | "Economizo 3h por semana" (maioria) | NPS: 72 | Convergente |
| Feature X | "Nunca usei, não sei para quê serve" (6/15) | Usage: 8% dos usuários | Convergente |
| Suporte | "Atendimento excelente" (4/15) | CSAT suporte: 58 | Divergente → investigar |

## Research Design Matrix: Selecionando o Design

| Pergunta de Research | Design Recomendado | Razão |
|---------------------|-------------------|-------|
| "Por que churnam?" | Explanatório seq. (QUAN→QUAL) | Dados de churn guiam entrevistas |
| "O que valorizamos em produto novo?" | Exploratório seq. (QUAL→QUAN) | Não há dimensões pré-definidas |
| "Nossas personas refletem realidade?" | Convergente | Validar modelo existente |
| "Qual mensagem funciona melhor?" | QUAN principal (A/B) + QUAL embutido | A/B mede resultado, qual explica mecanismo |
| "Como usuários experienciam X?" | QUAL dominante | Questão de significado, não de frequência |
| "Qual o tamanho do problema Y?" | QUAN dominante | Questão de prevalência |

## Rigor em Mixed Methods

### Qualidade Específica do Design Misto

| Critério | Definição | Como Demonstrar |
|----------|-----------|-----------------|
| **Legitimação** | Os insights integrados são mais robustos que cada método isolado? | Mostrar convergência/complementaridade explícita |
| **Completude** | A integração aborda a questão de research melhor que um método único? | Documentar o que cada método contribuiu |
| **Fidelidade** | Cada método foi executado com rigor próprio? | Critérios de cada método respeitados |
| **Transformação** | A combinação gerou insights que nenhum método geraria sozinho? | Destacar insights que emergiram só da integração |

## Template de Report Mixed Methods

```
## Métodos
### Design: [Tipo de mixed methods design]
### Fase 1 ([Qual/Quan]): [Descrição breve, n, ferramentas]
### Fase 2 ([Qual/Quan]): [Descrição breve, n, ferramentas]
### Integração: [Como os resultados foram combinados]

## Resultados
### Achados [Qual/Quan]: [Resultados de cada fase separadamente]
### Integração: [Joint Display ou narrativa integrando os dois]

## Interpretação Integrada
### Convergências: [O que ambos os métodos confirmam]
### Divergências: [Onde diferem e o que isso indica]
### Insights emergentes da integração: [O que só foi possível ver ao combinar]
```

---

*Knowledge base da squad-research*
