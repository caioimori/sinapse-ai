---
task: radical-transparency-audit
responsavel: "@ray-dalio"
responsavel_type: Agent
atomic_layer: Task
elicit: true

Entrada:
  - campo: team_context
    tipo: string
    origem: User Input
    obrigatorio: true

Saida:
  - campo: transparency_audit
    tipo: document
    destino: Console

Checklist:
  - "[ ] Canais de comunicacao mapeados"
  - "[ ] Barreiras a transparencia identificadas"
  - "[ ] Score de transparencia calculado"
  - "[ ] Plano de implementacao definido"
---

# Task: Radical Transparency Audit

## Metadata
- **Squad:** squad-council
- **Agent:** Ray Dalio
- **Complexity:** Standard

## Objetivo
Auditar o nivel de transparencia radical na comunicacao de uma equipe ou organizacao. Identificar onde informacao e ocultada, filtrada ou distorcida, e projetar um sistema onde verdade e merito prevalecem sobre hierarquia e politica.

## Pre-Condicoes
- Equipe ou organizacao definida para auditoria
- Acesso a canais de comunicacao existentes
- Compromisso da lideranca com o processo

## Passos

### 1. Mapear Canais de Comunicacao
| Canal | Tipo | Direcao | Frequencia | Transparencia Atual |
|-------|------|---------|------------|---------------------|
| | formal/informal | top-down/bottom-up/lateral | | alta/media/baixa |

- Identificar canais formais (reunioes, emails, reports)
- Identificar canais informais (conversas de corredor, DMs)
- Mapear onde decisoes realmente sao tomadas vs onde parecem ser tomadas

### 2. Diagnosticar Barreiras a Transparencia
| Barreira | Tipo | Impacto | Frequencia |
|----------|------|---------|------------|
| Medo de retaliacao | Cultural | | |
| Hierarquia rigida | Estrutural | | |
| Falta de contexto | Informacional | | |
| Ego barrier | Psicologica | | |
| Blind spot barrier | Cognitiva | | |

### 3. Avaliar as 4 Dimensoes Dalio
1. **Honestidade Radical:** As pessoas dizem o que realmente pensam?
2. **Transparencia Radical:** A informacao flui livremente para quem precisa?
3. **Meritocracia de Ideias:** As melhores ideias vencem, independente da fonte?
4. **Feedback Direto:** Feedback e dado em tempo real, cara a cara?

Score cada dimensao de 1-10.

### 4. Identificar "Opacity Hotspots"
- Onde decisoes sao tomadas sem explicar o racional?
- Onde feedback negativo e evitado ou suavizado?
- Onde informacao e retida como fonte de poder?
- Onde reunioes pos-reuniao acontecem (shadow decisions)?
- Onde erros sao escondidos em vez de usados como aprendizado?

### 5. Benchmark contra Bridgewater Practices
| Pratica Bridgewater | Status Atual | Gap | Prioridade |
|--------------------|-------------|-----|------------|
| Reunioes gravadas | | | |
| Dot Collector (feedback real-time) | | | |
| Issue Log publico | | | |
| Pain Button (registrar dor) | | | |
| Baseball Cards (perfis de competencia) | | | |
| Radical transparency em salarios | | | |

### 6. Calcular Transparency Score
```
Transparency Score = media(honestidade + transparencia + meritocracia + feedback) / 10
- 8-10: Cultura de transparencia radical
- 6-7: Transparencia parcial com gaps significativos
- 4-5: Comunicacao superficial, verdade filtrada
- 1-3: Cultura de opacidade, politica prevalece
```

### 7. Projetar Plano de Implementacao
Para cada gap identificado:
- Acao concreta com responsavel
- Timeline realista (transparencia leva tempo)
- Quick wins (primeiras 2 semanas)
- Mecanismos de protecao (evitar retaliacao)
- Metricas de acompanhamento

### 8. Definir Guardrails
- Transparencia NAO significa: fofoca, crueldade, ausencia de tato
- Transparencia SIGNIFICA: honestidade, contexto, intencao construtiva
- Definir limites claros (informacao confidencial, dados pessoais)
- Estabelecer protocolo para feedback dificil

## Output
```yaml
transparency_audit:
  team: "{equipe ou organizacao}"
  date: ""
  scores:
    honestidade_radical: "/10"
    transparencia_radical: "/10"
    meritocracia_ideias: "/10"
    feedback_direto: "/10"
    overall: "/10"
  opacity_hotspots: []
  barriers: []
  implementation_plan:
    quick_wins: []
    medium_term: []
    long_term: []
  guardrails: []
```

## Validacao
- [ ] 4 dimensoes avaliadas com score
- [ ] Opacity hotspots identificados com evidencias
- [ ] Benchmark contra Bridgewater completo
- [ ] Plano de implementacao com timeline
- [ ] Guardrails definidos
- [ ] Score geral calculado e comunicado
