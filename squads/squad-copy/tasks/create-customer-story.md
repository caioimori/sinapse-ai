---
task: create-customer-story
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

# Task: Create Customer Story

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** STANDARD
- **Depends on:** entrevista com cliente, dados de resultado
- **Feeds:** conversion-writer (Spark), headline-specialist (Hook)

## Objetivo
Criar customer story que emociona e convence — transformando a experiencia de um cliente em narrativa que prospects se identificam. Diferente de case study (data-driven), customer story e emotion-driven.

## Entrada
- Transcricao ou notas de entrevista com cliente
- Contexto do cliente (pessoal e profissional)
- Jornada emocional (frustracao → esperanca → transformacao)
- Fotos/videos do cliente (se disponiveis)

## Passos

### 1. Mapear a Jornada Emocional
**Arco narrativo do cliente:**
```
MUNDO ANTIGO (dor)
  → PONTO DE VIRADA (descoberta)
    → JORNADA (implementacao)
      → TRANSFORMACAO (resultado)
        → MUNDO NOVO (futuro)
```

**Emocoes a mapear em cada fase:**
| Fase | Emocao | Pergunta-chave |
|------|--------|----------------|
| Mundo Antigo | Frustracao, medo, vergonha | "Como voce se sentia antes?" |
| Ponto de Virada | Esperanca, ceticismo | "O que te fez tentar?" |
| Jornada | Surpresa, alivio, esforco | "Como foi o processo?" |
| Transformacao | Orgulho, alegria, confianca | "O que mudou na sua vida?" |
| Mundo Novo | Gratidao, empoderamento | "Como e sua vida agora?" |

### 2. Encontrar o Momento Definidor
Toda boa customer story tem UM momento que muda tudo:
- O "aha moment" — quando entenderam o valor
- O "turning point" — quando decidiram agir
- O "breakthrough" — quando viram o primeiro resultado
- O "emotional peak" — o momento mais intenso

**Esse momento se torna o CENTRO da narrativa.**

### 3. Escrever na Voz do Cliente
**Tecnicas:**
- **Primeira pessoa:** "Eu sempre achei que..." (mais poderoso)
- **Terceira pessoa narrativa:** "Maria nunca imaginou que..." (mais editorial)
- **Dialogo reconstruido:** "Meu marido olhou pra mim e disse..."
- **Detalhes sensoriais:** "Lembro do momento exato — estava no carro, voltando do trabalho..."

**O que preservar da voz original:**
- Expressoes naturais do cliente
- Gírias e regionalismos (se adequado)
- Padroes de fala (hesitacoes, enfase)
- Humor natural

### 4. Estrutura da Customer Story
**Formato longo (800-1500 palavras):**
1. **Hook:** Momento mais dramatico ou resultado surpreendente
2. **Flashback:** Volte ao inicio — como era antes
3. **A dor:** Detalhe especifico de como o problema afetava
4. **O ponto de virada:** O que levou a buscar solucao
5. **A descoberta:** Como encontrou a marca/produto
6. **O ceticismo:** Duvidas iniciais (cria credibilidade)
7. **A experiencia:** Primeiros passos, primeiras impressoes
8. **O resultado:** Transformacao concreta + emocional
9. **O novo normal:** Como a vida mudou
10. **Mensagem para outros:** Conselho para quem esta na mesma situacao

**Formato curto (150-300 palavras):**
1. Antes (2-3 frases)
2. Ponto de virada (1-2 frases)
3. Depois (2-3 frases)
4. Quote direta do cliente

### 5. Criar Variantes de Distribuicao
| Formato | Foco | Canal |
|---------|------|-------|
| Full story | Jornada completa | Blog, email |
| Testimonial | Quote + resultado | LP, ads |
| Before/After | Contraste visual | Social, LP |
| Video script | Momentos emocionais | YouTube, social |
| Audio snippet | Quote impactante | Podcast, stories |
| Social card | 1 frase + foto | Instagram, LinkedIn |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: conversion-writer (Spark)
    delivers: Customer stories para uso em conversao
    format: Full story + testimonials extraidos
  - to: squad-content
    delivers: Stories para calendario editorial
    format: Full story + social cards
```

## Saida
- Customer story completa (800-1500 palavras)
- Versao curta (150-300 palavras)
- 3-5 testimonial quotes extraidas
- 2-3 social cards
- Notas de momento definidor

## Validacao
- [ ] Arco emocional completo (dor → transformacao)
- [ ] Momento definidor identificado e centralizado
- [ ] Voz autentica do cliente preservada
- [ ] Detalhes sensoriais incluidos
- [ ] Ceticismo inicial presente (credibilidade)
- [ ] Resultado concreto + emocional
- [ ] Variantes de distribuicao criadas
- [ ] Aprovacao do cliente obtida

---

*Task operada por: long-form-writer (Saga)*
