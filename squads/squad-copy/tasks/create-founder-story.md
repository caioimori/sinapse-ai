---
task: create-founder-story
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

# Task: Create Founder Story

## Metadata
- **Squad:** squad-copy
- **Agent:** long-form-writer (Saga)
- **Complexity:** STANDARD
- **Depends on:** entrevista com fundador, brand positioning
- **Feeds:** brand-voice-writer (Tone), squad-content

## Objetivo
Criar a founder story que humaniza a marca — transformando a jornada do fundador em narrativa que gera confianca, conexao e autoridade. A founder story responde: "Por que ESTA pessoa criou ESTE produto para ESTAS pessoas?"

## Entrada
- Entrevista/conversa com fundador(es)
- Background pessoal e profissional
- Momento de criacao (o "por que")
- Valores pessoais que viraram valores da marca
- Marcos da jornada

## Passos

### 1. Encontrar o Momento Genesis
**Todo negocio comeca com um momento. Identifique:**

**Tipos de Momento Genesis:**
| Tipo | Exemplo | Poder Narrativo |
|------|---------|-----------------|
| Frustracao pessoal | "Eu sofria com X e ninguem resolvia" | Empatia direta |
| Descoberta acidental | "Enquanto fazia Y, percebi que..." | Curiosidade |
| Tragedia/crise | "Depois de perder [X], jurei que..." | Emocao profunda |
| Observacao de mercado | "Vi milhares de pessoas lutando com..." | Proposito |
| Experiencia profissional | "Trabalhei 10 anos em [area] e vi que..." | Autoridade |
| Missao herdada | "Meu pai/mae sempre dizia que..." | Legado |

**O momento genesis e o CORACAO da historia — comece por ele.**

### 2. Mapear o Arco do Heroi (Fundador)
**Adaptacao do Hero's Journey para founders:**

```
1. MUNDO ORDINARIO
   Quem era antes? O que fazia? Que frustracao sentia?

2. CHAMADO A AVENTURA
   O momento genesis. O insight que mudou tudo.

3. RECUSA DO CHAMADO
   Duvidas, medos, "quem sou eu pra fazer isso?"
   (Isto cria vulnerabilidade e humanidade)

4. MENTORES E ALIADOS
   Quem ajudou? Que aprendizados foram cruciais?

5. PROVAS E OBSTACULOS
   Fracassos, quase-desistencias, pivots
   (ESSENCIAL — sem obstaculos, nao ha historia)

6. A REVELACAO
   O momento em que soube que estava no caminho certo
   (Primeiro cliente, primeiro resultado, validacao)

7. A TRANSFORMACAO
   Como o fundador mudou ao longo da jornada

8. O RETORNO (o presente)
   O que construiu. O impacto. A visao de futuro.
```

### 3. Escrever com Vulnerabilidade Estrategica
**Equilibrio:**
- **Vulnerabilidade demais:** Perde autoridade ("sera que essa pessoa sabe o que faz?")
- **Vulnerabilidade de menos:** Perde conexao ("essa pessoa e perfeita demais, nao confio")
- **Ponto ideal:** Vulnerabilidade que DEMONSTRA forca

**O que compartilhar:**
- Duvidas que superou (mostra resiliencia)
- Erros que ensinou licoes (mostra aprendizado)
- Momentos de quase-desistencia (mostra determinacao)
- Sacrificios que fez (mostra comprometimento)

**O que NAO compartilhar:**
- Detalhes que nao servem a narrativa
- Reclamacoes sem resolucao
- Drama pessoal irrelevante
- Exageros ou embelezamentos

### 4. Estrutura da Founder Story
**Formato completo (600-1200 palavras):**

```
HOOK (2-3 frases)
  → Momento mais dramatico ou revelador

"ANTES" (150-200 palavras)
  → Quem era, o que fazia, o que sentia

O MOMENTO (100-150 palavras)
  → Genesis — o que mudou tudo

A JORNADA (200-300 palavras)
  → Obstaculos, aprendizados, pivots
  → Momento de quase-desistencia
  → O que manteve de pe

A CONSTRUCAO (150-200 palavras)
  → Primeiros passos, primeiros clientes
  → O momento de validacao

A MISSAO (100-150 palavras)
  → O que acredita, o que luta para mudar
  → Conexao com o cliente (por que FAZ isso)

O CONVITE (50-100 palavras)
  → "E por isso que [marca] existe"
  → Conexao com o leitor
```

### 5. Extrair Derivados
| Formato | Palavras | Uso |
|---------|----------|-----|
| Full story | 600-1200 | About page, press kit |
| Bio narrativa | 200-300 | LinkedIn, palestras |
| Elevator pitch | 50-100 | Networking, intros |
| Social post | 150-250 | LinkedIn, Instagram |
| Video script | 2-3 min | YouTube, site |
| Podcast intro | 30-60 seg | Podcast own/guest |
| One-liner | 1 frase | Bios curtas |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: brand-voice-writer (Tone)
    delivers: Founder story como referencia de autenticidade
    format: Story completa + voz natural do fundador
  - to: squad-content
    delivers: Story para distribuicao multi-canal
    format: Full story + derivados por canal
```

## Saida
- Founder story completa (600-1200 palavras)
- Bio narrativa (200-300 palavras)
- Elevator pitch (50-100 palavras)
- One-liner
- 2-3 social posts derivados

## Validacao
- [ ] Momento genesis claro e emocional
- [ ] Arco do heroi completo (duvida→obstaculos→transformacao)
- [ ] Vulnerabilidade estrategica presente
- [ ] Conexao fundador↔missao↔cliente clara
- [ ] Autenticidade (soa como a pessoa, nao como marketing)
- [ ] Derivados por canal criados
- [ ] Aprovacao do fundador obtida

---

*Task operada por: long-form-writer (Saga)*
