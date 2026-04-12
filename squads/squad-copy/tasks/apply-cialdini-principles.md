---
task: apply-cialdini-principles
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

# Task: Apply Cialdini Principles

## Metadata
- **Squad:** squad-copy
- **Agent:** persuasion-psychologist (Nudge)
- **Complexity:** STANDARD
- **Depends on:** copy draft, audiencia definida
- **Feeds:** writer original, copy-editor (Chisel)

## Objetivo
Aplicar os 7 principios de Cialdini de forma estrategica na copy — intensificando persuasao etica em cada secao com triggers psicologicos comprovados.

## Entrada
- Copy draft para enriquecer
- Audiencia e contexto
- Canal e formato
- Proof points disponíveis

## Passos

### 1. Reciprocidade
**Principio:** Pessoas retribuem o que recebem.
**Aplicacao em copy:**
- Dar valor ANTES de pedir (conteudo gratuito, insight, ferramenta)
- "Receba [recurso valioso] gratis — sem compromisso"
- Sequencias que educam antes de vender
- Lead magnets que resolvem problema real

**Tecnicas:**
- Free trial generoso (nao limitado demais)
- Conteudo de valor no email antes do pitch
- Ferramenta gratis que demonstra expertise
- Consultoria gratis como primeiro passo

**Exemplo:**
```
FRACO: "Compre nosso curso por R$997"
FORTE: "Baixe os 3 primeiros modulos gratis.
        Se gostar, o curso completo esta aqui."
```

### 2. Compromisso e Consistencia
**Principio:** Pessoas agem de forma consistente com compromissos anteriores.
**Aplicacao em copy:**
- Micro-commitments antes do grande commitment
- "Voce concorda que [crenca]?" → "Entao voce vai adorar [solucao]"
- Quiz/assessment que faz pessoa se identificar
- Free trial → Paid (escalada natural)

**Tecnicas:**
- Quizzes que criam auto-identificacao
- "Sim" ladder (perguntas que geram concordancia)
- Foot-in-the-door (pedido pequeno → grande)
- Declaracoes de identidade ("Eu sou o tipo de pessoa que...")

**Exemplo:**
```
FRACO: "Assine nosso plano premium"
FORTE: "Voce acredita que [crenca]?
        Entao voce e como nossos melhores clientes.
        Eles comecaram com [acao pequena]. Voce tambem pode."
```

### 3. Prova Social
**Principio:** Pessoas seguem o comportamento de outros similares.
**Aplicacao em copy:**
- Numeros especificos: "12,847 empresas ja usam"
- Testimonials de pessoas SIMILARES ao prospect
- "Mais popular" / "Mais escolhido" labels
- Reviews e ratings visíveis

**Tecnicas:**
- Testimonials com nome, foto, cargo, empresa
- Numeros em tempo real ("432 pessoas olhando agora")
- Logos de clientes reconheciveis
- "Join" language ("Junte-se a 10,000+ profissionais")
- Segmentacao de social proof (mostrar review de pessoa similar)

**Exemplo:**
```
FRACO: "Muitos clientes confiam em nos"
FORTE: "[Nome], [Cargo] na [Empresa]:
        'Aumentamos vendas em 34% nos primeiros 60 dias.
        Melhor investimento que fiz este ano.'
        ⭐⭐⭐⭐⭐ (4.9/5 — 2,340 reviews)"
```

### 4. Autoridade
**Principio:** Pessoas confiam em especialistas e autoridades.
**Aplicacao em copy:**
- Credenciais do fundador/equipe
- Publicacoes em midia reconhecida
- Certificacoes e premios
- Dados de pesquisa propria
- Endorsements de figuras respeitadas

**Tecnicas:**
- "Como visto em [Forbes, TechCrunch, ...]"
- "Criado por [credencial/expertise]"
- "Certificado por [instituicao]"
- Dados proprios citados como pesquisa
- Associacao com universidades/institutos

### 5. Afinidade (Liking)
**Principio:** Pessoas dizem sim a quem gostam e se identificam.
**Aplicacao em copy:**
- Tom pessoal e empático
- Historias de identificacao ("Eu tambem ja passei por isso")
- Elogios genuinos ao leitor
- Similaridades destacadas
- Vulnerabilidade estrategica

**Tecnicas:**
- Linguagem do leitor (pesquisa de voz do cliente)
- Founder story que gera identificacao
- "Nos entendemos porque [experiencia similar]"
- Comunidade e belonging

### 6. Escassez
**Principio:** Pessoas valorizam mais o que e raro ou limitado.
**Aplicacao em copy:**
- Deadlines REAIS (nunca fabricados)
- Vagas limitadas (quando verdadeiro)
- Edicoes limitadas
- Preco sobe em [data]
- Bonus temporarios

**REGRA ETICA:** Escassez DEVE ser real e verificavel.

**Exemplo:**
```
ANTIÉTICO: "So restam 3 vagas!" (reseta todo dia)
ÉTICO: "Turma de janeiro: 30 vagas. 23 preenchidas.
        Proxima turma so em abril."
```

### 7. Unidade
**Principio:** Pessoas favorecem quem e do "mesmo grupo".
**Aplicacao em copy:**
- "Para [grupo especifico]"
- Linguagem de tribo ("nos", "a gente")
- Exclusividade de grupo ("apenas para membros")
- Identidade compartilhada
- Anti-posicionamento ("para quem NAO se conforma com...")

**Tecnicas:**
- "Feito POR [grupo] PARA [grupo]"
- Comunidade exclusiva pos-compra
- Ritual ou linguagem propria do grupo
- "Se voce e [identidade], isso e pra voce"

### 8. Dosagem por Contexto
| Canal | Principles Prioritarios | Intensidade |
|-------|------------------------|:-----------:|
| Landing Page | Social Proof + Scarcity + Authority | Alta |
| Email Nurture | Reciprocity + Liking + Commitment | Media |
| Ad | Social Proof + Scarcity | Alta |
| Blog | Authority + Reciprocity | Baixa |
| Sales Call | Liking + Unity + Commitment | Media |

## Saida
- Copy enriquecida com principios de Cialdini
- Mapa de quais principios aplicados por secao
- Justificativa de cada aplicacao
- Ethical check de escassez/urgencia

## Validacao
- [ ] Min 4 de 7 principios aplicados
- [ ] Principios adequados ao canal e audiencia
- [ ] Escassez real e verificavel
- [ ] Social proof especifico (nao generico)
- [ ] Reciprocidade antes de pedir
- [ ] Micro-commitments antes do grande pedido
- [ ] Ethical check completo (sem manipulacao)

---

*Task operada por: persuasion-psychologist (Nudge)*
