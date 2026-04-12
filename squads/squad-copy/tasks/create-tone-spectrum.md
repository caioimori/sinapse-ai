---
task: create-tone-spectrum
responsavel: "@brand-voice-writer"
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

# Task: Create Tone Spectrum

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice definida
- **Feeds:** todos os writers do squad

## Objetivo
Criar tone spectrum que define como a voice da marca se ADAPTA a diferentes contextos — mantendo identidade enquanto ajusta intensidade, emocao e formalidade conforme a situacao.

## Entrada
- Brand voice guidelines
- Canais e touchpoints da marca
- Situacoes tipicas (positivas e negativas)
- Audiencias diferentes (se existirem)

## Passos

### 1. Entender Voice vs. Tone
**Voice = Quem voce e (constante)**
**Tone = Como voce expressa isso (variavel)**

**Analogia:** Voce tem a mesma personalidade com amigos e no trabalho. Mas o TOM muda — mais informal com amigos, mais profissional no trabalho. A ESSENCIA e a mesma.

### 2. Definir Eixos do Espectro
**Eixo 1 — Formalidade:**
```
Casual ←————————————————→ Formal
Social    Blog    Email    Legal    Contrato
```

**Eixo 2 — Emocao:**
```
Celebratorio ←———————————→ Empatico
Conquista   Neutro   Problema   Crise
```

**Eixo 3 — Urgencia:**
```
Relaxado ←————————————————→ Urgente
Educacao   Informação   Acao   Emergencia
```

**Eixo 4 — Proximidade:**
```
Institucional ←——————————→ Pessoal
Comunicado   Newsletter   Email 1:1   DM
```

### 3. Mapear Tone por Situacao
| Situacao | Formalidade | Emocao | Urgencia | Exemplo |
|----------|:-----------:|:------:|:--------:|---------|
| Nova feature | Casual-Med | Entusiasta | Media | "Algo incrivel acabou de pousar!" |
| Bug report | Medio | Empatico | Alta | "Sabemos do problema e estamos resolvendo" |
| Onboarding | Casual | Caloroso | Baixa | "Bem-vindo! Vamos fazer isso juntos" |
| Cobranca | Formal | Neutro | Alta | "Seu pagamento requer atencao" |
| Conquista do cliente | Casual | Celebratorio | Baixa | "Voce arrasou! Parabens pelo marco!" |
| Erro nosso | Med-Formal | Empatico | Alta | "Erramos. Veja como estamos corrigindo" |
| Upgrade/Upsell | Casual | Entusiasta | Media | "Quer ir alem? Temos algo pra voce" |
| Cancelamento | Medio | Empatico | Baixa | "Sentiremos sua falta. Pode voltar quando quiser" |
| Legal/Termos | Formal | Neutro | Baixa | Linguagem clara mas juridicamente precisa |
| Emergencia/Outage | Med-Formal | Serio | Maxima | "Servico indisponivel. Equipe trabalhando" |

### 4. Criar Tone Examples (Before/After)
**Para cada tom, mostrar como o MESMO conteudo muda:**

**Mensagem: "Lancamos nova feature"**

| Tom | Copy |
|-----|------|
| Celebratorio | "A funcionalidade que voce pediu chegou! 🎉" |
| Informativo | "Nova funcionalidade disponivel: [nome]. Saiba mais." |
| Professional | "Temos o prazer de anunciar a disponibilidade de [nome]." |
| Casual | "Ei! Olha o que a gente acabou de lancar 👀" |
| Urgente | "Nova feature critica liberada — atualize agora." |

**Mensagem: "Sistema fora do ar"**

| Tom | Copy |
|-----|------|
| Empatico | "Sabemos que isso impacta seu trabalho. Desculpe. Estamos priorizando a resolucao." |
| Informativo | "Nosso servico esta temporariamente indisponivel. Estimativa: 2h para resolucao." |
| Transparente | "As 14:30 nosso banco de dados apresentou falha. Equipe trabalhando. Updates a cada 30min." |

### 5. Documentar Tone Decision Matrix
**Para qualquer situacao, pergunte:**
```
1. O que aconteceu? (contexto)
2. Como o cliente se sente? (emocao)
3. O que precisa ser feito? (acao)
4. Qual canal? (formato)

→ Resultado: Tom [X] com nivel de formalidade [Y]
```

**Quick Reference Card:**
```
CELEBRAR? → Tom entusiasta, casual, emojis ok
INFORMAR? → Tom claro, neutro, direto
RESOLVER? → Tom empatico, profissional, transparente
VENDER? → Tom confiante, pessoal, beneficio-focused
APOLOGIZAR? → Tom humilde, serio, acao-focused
EDUCAR? → Tom acessivel, paciente, encouraging
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os writers do squad
    delivers: Tone spectrum como referencia
    format: Matrix completa + quick reference card
  - to: squad-design
    delivers: Tone por touchpoint para UX writing
    format: Tone mapping por tela/fluxo
```

## Saida
- Tone spectrum com 4 eixos definidos
- Mapping de tom por situacao (min 10 situacoes)
- Before/After examples por tom
- Tone decision matrix (flowchart)
- Quick reference card

## Validacao
- [ ] Voice constante (identidade mantida em todos os tons)
- [ ] Min 10 situacoes mapeadas
- [ ] Before/After examples para cada tom
- [ ] Decision matrix funcional
- [ ] Quick reference card prática
- [ ] Cobre situacoes positivas E negativas
- [ ] Cobre todos os canais principais

---

*Task operada por: brand-voice-writer (Tone)*
