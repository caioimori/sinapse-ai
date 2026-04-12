---
task: optimize-cognitive-fluency
responsavel: "@persuasion-psychologist"
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

# Task: Optimize Cognitive Fluency

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** copy draft
- **Feeds:** copy-editor (Chisel), writer original

## Objetivo
Otimizar cognitive fluency da copy — quanto mais facil de processar, mais persuasiva. Fluencia cognitiva afeta confianca, familiaridade e disposicao para agir. Copy dificil de ler = copy que nao converte.

## Entrada
- Copy draft para otimizar
- Audiencia e nivel de educacao
- Canal e formato
- Performance data (se disponivel)

## Passos

### 1. Principios de Fluencia Cognitiva
**Principio central:** O cerebro interpreta "facil de processar" como "verdadeiro e confiavel".

**Impacto na copy:**
| Fluencia | Percepcao | Resultado |
|----------|-----------|-----------|
| Alta (facil) | Familiar, confiavel | Mais conversao |
| Baixa (dificil) | Estranho, suspeito | Menos conversao |

**Fontes de (dis)fluencia:**
- Linguagem complexa vs. simples
- Frases longas vs. curtas
- Jargao vs. linguagem cotidiana
- Fontes ilegíveis vs. claras
- Layout confuso vs. limpo

### 2. Simplificar Linguagem
**Regras de simplificacao:**

**Palavras:**
| Complexo | Simples |
|----------|---------|
| Utilizar | Usar |
| Implementar | Fazer/Criar |
| Otimizar | Melhorar |
| Alavancagem | Vantagem |
| Robusto | Forte/Completo |
| Stakeholders | Envolvidos |
| Deliverables | Entregas |
| Sinergia | Trabalho conjunto |

**Frases:**
| Complexo | Simples |
|----------|---------|
| "Com o objetivo de" | "Para" |
| "No que diz respeito a" | "Sobre" |
| "Realizar uma analise de" | "Analisar" |
| "Em funcao do fato de que" | "Porque" |
| "De modo a garantir que" | "Para garantir" |

**Teste de simplificacao:**
- Uma crianca de 12 anos entenderia?
- Voce falaria assim com um amigo?
- Existe uma palavra mais simples?

### 3. Otimizar Estrutura de Frases
**Comprimento ideal:**
- Frases: 10-20 palavras (media)
- Paragrafos: 2-4 linhas max
- Variar: Curta. Media e explicativa. Curta de impacto.

**Ritmo persuasivo:**
```
Frase curta de impacto.
Depois uma frase media que expande a ideia com mais contexto.
Outra curta.
E uma mais longa que conecta os pontos e cria fluxo
natural de leitura, guiando o leitor ate o proximo bloco.
Entendeu?
```

**Voz ativa > Voz passiva:**
- ✅ "Nos criamos [produto]" (ativa)
- ❌ "[Produto] foi criado por nos" (passiva)

### 4. Otimizar Scanning
**60%+ das pessoas scanneiam antes de ler:**

**Tecnicas de scanning optimization:**
- **Subheadlines:** A cada 200-300 palavras
- **Bold:** Key phrases destacadas
- **Bullets:** Listas em vez de paragrafos longos
- **Numeros:** Digitos (47%) em vez de extenso (quarenta e sete por cento)
- **F-Pattern:** Conteudo importante no inicio de cada secao
- **Whitespace:** Espaco entre blocos de conteudo
- **Pull quotes:** Frases-chave em destaque visual

**Teste de scanning:**
"Se ler APENAS headlines, bold e bullets, a mensagem principal e clara?"

### 5. Eliminar Cognitive Load
**Reducao de carga cognitiva:**
- **Choices:** Limitar opcoes (paradox of choice — max 3-4)
- **Jargao:** Eliminar ou explicar imediatamente
- **Acronimos:** Definir na primeira mencao
- **Double negatives:** "Nao e impossível" → "E possivel"
- **Abstract → Concrete:** "Melhore processos" → "Reduza reunioes em 50%"
- **Technical → Experiential:** "API REST" → "Conecte em 2 cliques"

### 6. Fluency Score Card
**Avaliar copy (1-5):**
| Criterio | 1 (Baixa) | 3 (Media) | 5 (Alta) |
|----------|-----------|-----------|----------|
| Vocabulario | Jargao/tecnico | Alguns termos complexos | Simples e claro |
| Frases | Longas (30+ palavras) | Medias (15-25) | Variadas (10-20 media) |
| Estrutura | Blocos densos | Alguma formatacao | Scanning-optimized |
| Abstração | Conceitos vagos | Mix abstrato/concreto | Concreto e especifico |
| Fluxo | Saltos logicos | Razoavel | Smooth e natural |

**Target: Score >= 4.0 para copy de conversao**

## Saida
- Copy otimizada para fluencia cognitiva
- Before/after comparisons
- Fluency score card preenchido
- Lista de termos simplificados

## Validacao
- [ ] Vocabulario simplificado (zero jargao desnecessario)
- [ ] Frases com media < 20 palavras
- [ ] Paragrafos max 4 linhas
- [ ] Voz ativa predominante
- [ ] Scanning-optimized (subheadlines, bold, bullets)
- [ ] Cognitive load reduzido
- [ ] Fluency score >= 4.0
- [ ] Teste do amigo: "Falaria assim?"

---

*Task operada por: persuasion-psychologist (Nudge)*
