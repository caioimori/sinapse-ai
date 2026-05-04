---
task: adapt-voice-for-market
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

# Task: Adapt Voice for Market

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice, mercados-alvo, pesquisa cultural
- **Feeds:** todos os writers do squad

## Objetivo
Adaptar a brand voice para diferentes mercados, culturas e idiomas — mantendo a essencia da marca enquanto respeita nuances culturais, regulatorias e linguisticas de cada mercado.

## Entrada
- Brand voice guidelines (original)
- Mercados-alvo (paises, regioes, culturas)
- Pesquisa cultural por mercado
- Regulamentacoes de comunicacao por mercado

## Passos

### 1. Mapear Dimensoes Culturais por Mercado
**Framework de Hofstede adaptado para copy:**
| Dimensao | Implicacao para Copy | Exemplo |
|----------|---------------------|---------|
| Individualismo vs Coletivismo | "Voce" vs "Nos/comunidade" | US: "Your success" / JP: "Together we grow" |
| Distancia do poder | Formal vs casual com autoridade | DE: Formal / BR: Casual |
| Aversao a incerteza | Garantias, dados vs. abertura | DE: "Comprovado por..." / US: "Try it!" |
| Masculinidade vs Feminilidade | Competicao vs. cooperacao | US: "Be #1" / Nordic: "Balance" |
| Orientacao temporal | Resultados rapidos vs. longo prazo | US: "Today!" / JP: "Lasting value" |
| Indulgencia vs Restricao | Emocao vs. moderacao | BR: Expressivo / DE: Contido |

### 2. Criar Voice Adaptation Guide por Mercado
**Template por mercado:**
```
MERCADO: [Pais/Regiao]
Idioma: [Idioma principal]

VOICE ESSENCE (mantida):
- [Atributos core que NAO mudam]

ADAPTACOES:
Formalidade: [Ajustar para mais/menos formal]
Humor: [Nivel aceitavel e tipo de humor]
Emojis: [Uso por mercado]
Expressoes: [Adaptacoes locais]
Sensibilidades: [Topicos a evitar]
Regulamentacao: [Restricoes legais de comunicacao]

EXEMPLOS ADAPTADOS:
Original: "[Copy original]"
Adaptado: "[Copy para este mercado]"
Por que: "[Justificativa da adaptacao]"
```

### 3. Regras de Localizacao (nao apenas traducao)
**Transcriacao vs. Traducao:**
- **Traducao literal:** Palavra por palavra (NUNCA para copy)
- **Traducao localizada:** Sentido mantido, expressoes adaptadas
- **Transcriacao:** Recriacao completa mantendo intencao e emocao (IDEAL para copy)

**Checklist de localizacao:**
- [ ] Expressoes idiomaticas adaptadas (nao traduzidas)
- [ ] Humor cultural adequado
- [ ] Referências culturais relevantes para o mercado
- [ ] Numeros e formatos locais (moeda, data, medidas)
- [ ] Nomes e exemplos culturalmente relevantes
- [ ] Tom ajustado para expectativa cultural
- [ ] Comprimento ajustado (linguas como DE/JP podem ser mais longas)

### 4. Mapear Sensibilidades por Mercado
**Topicos sensiveis por regiao:**
| Regiao | Cuidados | Regulamentacao |
|--------|----------|----------------|
| EU | GDPR, claims de saude | Restricoes em comparativos |
| US | FTC, health claims | Disclaimers obrigatorios |
| LATAM | Nuances entre paises | Varia por pais |
| APAC | Hierarquia, face-saving | Restricoes em tech/social |
| MENA | Religiao, genero | Regulamentacao rígida |

### 5. Criar Mercado-Specific Copy Blocks
**Para cada mercado, produzir:**
- Greeting/closing adaptados
- CTA copy adaptada
- Social proof localizado
- Error messages culturally appropriate
- Legal disclaimers necessarios

## Cross-Squad Handoff
```yaml
handoffs:
  - to: todos os writers do squad
    delivers: Voice adaptation guides por mercado
    format: Guia por mercado com exemplos
  - to: squad-research
    delivers: Requisicao de pesquisa cultural
    format: Brief de pesquisa por mercado
```

## Saida
- Voice adaptation guide por mercado
- Localizacao checklist
- Sensibilidades mapeadas
- Copy blocks localizados
- Transcriacao guidelines

## Validacao
- [ ] Essencia da voice mantida em todos os mercados
- [ ] Adaptacoes culturais apropriadas
- [ ] Sensibilidades mapeadas e respeitadas
- [ ] Nao e traducao literal (e transcriacao)
- [ ] Regulamentacoes por mercado consideradas
- [ ] Copy blocks localizados criados
- [ ] Revisado por native speaker (ideal)

---

*Task operada por: brand-voice-writer (Tone)*
