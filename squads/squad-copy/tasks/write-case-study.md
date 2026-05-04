---
task: write-case-study
responsavel: "@long-form-writer"
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

# Task: Write Case Study

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** STANDARD
- **Depends on:** dados do cliente, resultados, aprovacao
- **Feeds:** conversion-writer (Spark), squad-content

## Objetivo
Escrever case study que transforma resultados de clientes em narrativa persuasiva — provando valor atraves de historia, nao apenas dados. O case study e a ponte entre "promessa" e "prova".

## Entrada
- Dados do cliente (empresa, segmento, tamanho)
- Problema/desafio original
- Solucao implementada
- Resultados quantitativos e qualitativos
- Quotes do cliente (idealmente)

## Passos

### 1. Escolher Framework Narrativo
**Framework SITUATION → COMPLICATION → RESOLUTION (SCR):**
- **Situation:** Contexto do cliente antes (relatable)
- **Complication:** O problema que surgiu/cresceu
- **Resolution:** Como a solucao resolveu + resultados

**Framework STAR:**
- **Situation:** Cenario inicial
- **Task:** O que precisava ser alcancado
- **Action:** O que foi feito (solucao)
- **Result:** Resultados mensuráveis

**Framework HERO'S JOURNEY (para cases mais longos):**
- O cliente e o heroi, a marca e o mentor
- Jornada: Mundo Ordinario → Desafio → Busca → Transformacao

### 2. Escrever Headline do Case Study
**Patterns eficazes:**
- **Resultado + Cliente:** "Como [Cliente] aumentou [metrica] em [X]% em [tempo]"
- **Antes/Depois:** "De [situacao ruim] para [situacao boa]: A historia de [Cliente]"
- **Numero bold:** "[X]% de aumento em [metrica]: Case [Cliente]"
- **Quote do cliente:** '"[Quote impactante]" — [Nome], [Cargo], [Empresa]'

### 3. Estruturar o Case Study
**Estrutura padrao (800-1500 palavras):**

```
1. SNAPSHOT (sidebar/box)
   - Cliente: [nome, segmento, tamanho]
   - Desafio: [1 frase]
   - Solucao: [1 frase]
   - Resultado-chave: [1 numero impactante]

2. O DESAFIO (200-300 palavras)
   - Contexto do cliente (relatable para prospect)
   - O problema especifico
   - Impacto do problema (custo, tempo, frustração)
   - O que ja tinham tentado

3. A SOLUCAO (200-400 palavras)
   - Como descobriram/escolheram a solucao
   - Implementacao (sem ser manual tecnico)
   - Momentos de virada ("aha moments")
   - Quote do cliente sobre a experiencia

4. OS RESULTADOS (200-300 palavras)
   - Metricas primarias (com numeros)
   - Metricas secundarias
   - Resultados inesperados/bonus
   - Timeline dos resultados

5. O FUTURO (100-150 palavras)
   - Proximos passos
   - Visao de longo prazo
   - Quote forward-looking

6. CTA
   - "Quer resultados similares?"
   - Link para demo/contato
```

### 4. Regras de Escrita
- **Mostre, nao conte:** "Revenue cresceu 47%" > "Revenue cresceu bastante"
- **Cliente como heroi:** A marca e o facilitador, nao o protagonista
- **Quotes reais:** Minimo 2-3 quotes diretas do cliente
- **Dados concretos:** Cada claim com numero ou evidencia
- **Jargao do segmento:** Use vocabulario do segmento do cliente
- **Antes/depois:** Sempre que possivel, mostre contraste
- **Timeline:** Quanto tempo levou para resultados aparecerem

### 5. Formatos Derivados
| Formato | Tamanho | Canal |
|---------|---------|-------|
| Full case study | 800-1500 palavras | Website, PDF |
| Mini case | 200-300 palavras | Email, proposta |
| Snapshot | 50-100 palavras | Ad, social |
| Video script | 2-3 min | YouTube, sales |
| Slide deck | 5-8 slides | Apresentacao |
| Quote card | 1 frase + metrica | Social media |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Case study para uso em LPs e emails
    format: Full case + mini case + quote cards
  - to: squad-content
    delivers: Case study para distribuicao
    format: Full case + formatos derivados
```

## Saida
- Case study completo (800-1500 palavras)
- Snapshot/sidebar
- Mini case (200-300 palavras)
- 2-3 quote cards para social
- Metricas-chave destacadas

## Validacao
- [ ] Framework narrativo aplicado (SCR ou STAR)
- [ ] Cliente como heroi (marca como mentor)
- [ ] Min 3 metricas quantitativas
- [ ] Min 2 quotes diretas do cliente
- [ ] Antes/depois claro
- [ ] CTA incluido
- [ ] Formatos derivados criados
- [ ] Aprovacao do cliente obtida

---

*Task operada por: long-form-writer (Saga)*
