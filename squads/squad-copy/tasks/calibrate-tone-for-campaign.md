---
task: calibrate-tone-for-campaign
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

# Task: Calibrate Tone for Campaign

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice, campanha brief, audiencia
- **Feeds:** todos os writers envolvidos na campanha

## Objetivo
Calibrar o tom especifico para uma campanha — ajustando dentro do tone spectrum para maximizar impacto com a audiencia e objetivo especificos, garantindo consistencia em todos os touchpoints da campanha.

## Entrada
- Campaign brief (objetivo, audiencia, canais)
- Brand voice guidelines
- Tone spectrum
- Campanhas anteriores (performance, se disponivel)

## Passos

### 1. Analisar o Contexto da Campanha
**Perguntas de calibracao:**
| Fator | Opcoes | Implicacao de Tom |
|-------|--------|-------------------|
| Objetivo | Awareness/Consideracao/Conversao | Inspiracional → Educativo → Urgente |
| Emocao desejada | Empolgar/Educar/Tranquilizar/Urgir | Energetico → Informativo → Calmo → Tenso |
| Audiencia | Cold/Warm/Hot | Mais proof → Mais relacional → Mais direto |
| Momento | Launch/Sustain/End | Entusiasmo → Consistencia → Urgencia |
| Concorrencia | Saturado/Normal/Livre | Mais ousado → Normal → Mais sofisticado |
| Sensibilidade | Alta/Media/Baixa | Mais cauteloso → Normal → Mais playful |

### 2. Definir Tone Brief da Campanha
**Template:**
```
CAMPANHA: [Nome]
PERIODO: [Datas]

TOM PRINCIPAL: [1-2 palavras]
  Ex: "Confiante e empolgante"

TOM SECUNDARIO: [1 palavra]
  Ex: "Acessivel"

ESPECTRO NESTA CAMPANHA:
  Formalidade: [Posicao no espectro]
  Energia: [Posicao no espectro]
  Emocao: [Posicao no espectro]
  Urgencia: [Posicao no espectro]

O QUE AMPLIFICAR:
  - [Atributo de voice a enfatizar]
  - [Emocao a evocar mais forte]

O QUE REDUZIR:
  - [Atributo a conter]
  - [Emocao a evitar]

REFERENCIAS DE TOM:
  - "[Frase exemplo do tom desejado]"
  - "[Frase exemplo do tom desejado]"
  - "[Frase que seria DEMAIS — limite]"
```

### 3. Criar Exemplos por Touchpoint da Campanha
**Para cada peca da campanha:**
```
PECA: [Email 1 / Ad Meta / LP / Social Post]
TOM ESPECIFICO: [Ajuste dentro do tom principal]

EXEMPLO ON-TONE:
  "[Copy exemplo perfeita para esta peca]"

EXEMPLO OFF-TONE (demais):
  "[Copy que exagera o tom]"

EXEMPLO OFF-TONE (de menos):
  "[Copy que nao chega no tom]"
```

### 4. Consistencia Cross-Channel
**Regra: O tom pode VARIAR em intensidade, nunca em DIRECAO.**

**Mapping de tom por canal na campanha:**
```
AD → Intensidade ALTA (pouco espaco, muito impacto)
LP → Intensidade ALTA no hero, MEDIA no body
EMAIL → Intensidade MEDIA (mais pessoal)
SOCIAL → Intensidade MEDIA-ALTA (engagement)
RETARGETING → Intensidade MEDIA (nao alienar)
```

**Teste de consistencia:**
- Se um usuario vir o ad, depois a LP, depois o email...
  o tom progride naturalmente?
- Se remover os logos, todas as pecas parecem da mesma campanha?
- A transicao entre touchpoints e suave?

### 5. Calibracao ao Longo da Campanha
**Ajustes por fase:**
| Fase | Tom | Justificativa |
|------|-----|---------------|
| Pre-launch | Curioso, teasing | Criar anticipacao |
| Launch | Energetico, confiante | Maximo impacto |
| Mid-campaign | Informativo, convincing | Sustain interest |
| Urgencia final | Direto, urgente | Conversao |
| Pos-campanha | Caloroso, grato | Relacionamento |

**Red flags para recalibrar:**
- Engagement caindo → Tom nao ressoando
- Feedback negativo → Tom exagerado ou inapropriado
- Unsubscribes altos → Tom irritante ou pressao demais
- Alta abertura mas baixa conversao → Tom nao converte

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os writers na campanha
    delivers: Tone brief com exemplos
    format: 1 pager de calibracao + exemplos por peca
  - to: copy-strategist (Quill)
    delivers: Tone calibration para aprovacao
    format: Tone brief + consistencia cross-channel
```

## Saida
- Tone brief da campanha
- Exemplos por touchpoint (on-tone e off-tone)
- Mapping de intensidade por canal
- Guia de calibracao por fase
- Red flags para recalibracao

## Validacao
- [ ] Tom principal e secundario definidos
- [ ] Espectro posicionado para campanha
- [ ] Exemplos por touchpoint criados
- [ ] Consistencia cross-channel verificada
- [ ] Calibracao por fase definida
- [ ] Red flags identificados
- [ ] Briefing claro para todos os writers
- [ ] Aprovado por copy strategist

---

*Task operada por: brand-voice-writer (Tone)*
