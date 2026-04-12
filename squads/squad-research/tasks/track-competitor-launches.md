---
task: track-competitor-launches
responsavel: "@competitive-intelligence"
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

# Task: Track Competitor Launches

## Metadata
- **Squad:** squad-research
- **Agent:** competitive-intelligence (Hawk)
- **Complexity:** SIMPLE
- **Depends on:** monitor-competitor-movements
- **Feeds:** evaluate-competitive-threats

## Objetivo
Rastrear lancamentos de competidores (produtos, features, campanhas) e analisar impacto potencial rapidamente.

## Entrada
- Lancamento detectado (produto, feature, campanha, partnership)
- Competidor que lancou

## Passos

### 1. Documentar Lancamento
- O que foi lancado?
- Quando?
- Para quem? (target)
- Como comunicaram? (canais, messaging)
- Pricing (se produto)

### 2. Analise de Impacto Rapido
- Afeta nosso mercado/clientes diretamente? (SIM/NAO)
- Resolve dor que NOS resolvemos? (SIM/NAO)
- Muda o landscape competitivo? (SIM/NAO)
- E inovacao real ou catch-up? (INOVACAO/CATCH-UP/MARKETING)

### 3. Classificacao de Urgencia
- **CRITICO:** Impacta diretamente, resposta necessaria
- **RELEVANTE:** Pode impactar, monitorar reacao do mercado
- **INFORMATIVO:** Bom saber, sem acao imediata

### 4. Recomendacao
- Se CRITICO: que acao tomar? (counter-launch, messaging, feature rush)
- Se RELEVANTE: que monitorar? (adocao, reacao, reviews)
- Se INFORMATIVO: registrar e seguir

## Saida
- Lancamento documentado
- Impacto classificado
- Recomendacao de acao

## Validacao
- [ ] Lancamento documentado com detalhes
- [ ] Impacto avaliado (3 perguntas)
- [ ] Urgencia classificada
- [ ] Recomendacao definida

---

*Task operada por: competitive-intelligence (Hawk)*
