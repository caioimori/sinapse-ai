# Multi-Agent Research Methodology

> Extraído e sintetizado de MS-009 Agentic Second Brain (2026) + práticas do squad-research SINAPSE.

## O Paradigma Multi-Agente em Pesquisa

Um Second Brain agêntico ou pipeline de pesquisa profunda não é operado por um único "super-agente" — é um sistema multi-agente onde cada agente tem especialização, ferramentas e autoridade definidas. Isso permite:

- **Qualidade:** Agentes especializados produzem resultados melhores que generalistas
- **Escalabilidade:** Subagentes trabalham em paralelo (wave-based approach)
- **Governança:** Cada agente tem permissões e limites claros
- **Evolução:** Novos skills adicionados sem refatorar o sistema

## Arquitetura de Agentes para Pesquisa

```
[Orquestrador Principal (research-orqx)]
  |
  |-- [deep-researcher (Sage)]     -- Pesquisa profunda, multi-fonte
  |-- [audience-intelligence (Pulse)] -- JTBD, personas, comportamento
  |-- [competitive-intelligence (Hawk)] -- Análise competitiva, monitoring
  |-- [market-analyst (Scope)]     -- TAM/SAM/SOM, industry analysis
  |-- [data-synthesizer (Loom)]    -- Síntese, consolidação, report final
  |-- [trend-forecaster (Horizon)] -- Weak signals, cenários futuros
```

## Wave-Based Research (Pesquisa em Ondas Paralelas)

Abordagem em ondas paralelas maximiza cobertura e minimiza tempo:

### Onda 1: Orientação (15-30 min)
**Objetivo:** Entender o território antes de aprofundar.
- Todos os agentes executam SCAN simultâneo em suas especialidades
- Output: Mapa inicial de lacunas e hipóteses
- Decisão: Priorizar quais dimensões aprofundar

### Onda 2: Investigação Especializada (paralela)
**Objetivo:** Cada agente aprofunda em sua especialidade simultaneamente.
```
[Sage: Deep literature review]  +  [Hawk: Competitive data]  +  [Pulse: Audience signals]
         ↓ simultâneo                        ↓                              ↓
                            [Dados coletados em paralelo]
```
- Agentes operam independentemente durante esta fase
- Ponto de sincronização ao final da onda

### Onda 3: Síntese e Validação
**Objetivo:** Cruzar achados, identificar contradições, cristalizar insights.
- Loom recebe outputs de todos os agentes
- Cross-validation: onde os dados concordam/divergem?
- Identificar lacunas que requerem pesquisa adicional

### Onda 4: Iteração (se necessário)
**Trigger:** Lacunas críticas identificadas na síntese
- Onda adicional focada nas lacunas específicas
- Máximo 2 ondas de iteração antes de declarar achados com confidence baixo

## Padrões de Raciocínio por Agente

| Padrão | Descrição | Uso Ideal |
|--------|-----------|-----------|
| **ReAct** | Reason + Act em loop: pensa → age → observa | Tarefas com ferramentas (busca, leitura) |
| **Tree of Thought** | Explora múltiplos caminhos em árvore | Problemas com múltiplas hipóteses |
| **Graph of Thought** | Raciocínio como grafo, merge de pensamentos | Síntese de múltiplas fontes |
| **Chain of Thought** | Raciocínio passo-a-passo linear | Análise sequencial, cálculos |
| **Reflection** | Agente avalia e critica seu próprio output | Quality check e auto-correção |

## Frameworks de Orquestração Multi-Agente (2026)

| Framework | Arquitetura | Controle | Ideal Para |
|-----------|-------------|----------|-----------|
| **LangGraph** | State machine com grafo dirigido | Máximo | Produção enterprise, fluxos complexos |
| **CrewAI** | Role-playing + task delegation | Médio | Prototipagem, equipes conceituais |
| **Claude Agent SDK** | Claude-native, tool use, file checkpointing | Médio | Ecossistema Claude nativo |
| **OpenAI Agents SDK** | Handoffs + guardrails | Médio | Ecossistema OpenAI |
| **Google ADK** | Agent Development Kit | Médio | Ecossistema Gemini |

## Protocolos de Handoff Entre Agentes de Pesquisa

### Handoff Artifact para Pesquisa
```yaml
research_handoff:
  from_agent: "{agent_id} ({persona})"
  to_agent: "{agent_id} ({persona})"
  query: "{pergunta original}"
  findings_summary:
    - "{achado 1 com fonte}"
    - "{achado 2 com fonte}"
  gaps_identified:
    - "{lacuna que este agente NÃO cobriu}"
  confidence_level: "HIGH | MEDIUM | LOW"
  sources_used:
    - "{fonte 1 com tier}"
  next_action: "{o que o próximo agente deve fazer}"
```

### Regras de Handoff
1. Nunca transferir sem confidence level declarado
2. Listar explicitamente o que NÃO foi pesquisado
3. Incluir fontes com tier classificado
4. Próximo agente DEVE ler artifact antes de começar

## Skill System: Capacidades Modulares

Skills são funções atômicas que agentes podem compor:

| Skill | Função | Input | Output |
|-------|--------|-------|--------|
| `/scan` | Orientação rápida sobre tópico | Query + depth=SCAN | Summary + gaps |
| `/deep-research` | Pesquisa profunda multi-fonte | Query + depth + sources | Findings estruturados |
| `/synthesize` | Combinar múltiplas pesquisas | Lista de findings | Insight consolidado |
| `/validate` | Verificar claim contra fontes | Claim + evidência | Confidence assessment |
| `/connect` | Encontrar links entre achados | N findings | Relações + padrões |
| `/gap-detect` | Identificar lacunas na pesquisa | Findings atuais + query | Lista de lacunas |

## Coordenação e Prevenção de Conflitos

### Authority Matrix
| Operação | Agent | Bloqueado Para |
|----------|-------|----------------|
| Atribuir profundidade de pesquisa | research-orqx | Todos os outros |
| Declarar finding como FINDING | Qualquer agente | N/A |
| Elevar confidence de LOW→HIGH | Apenas após triangulação | — |
| Marcar insight como RECOMMENDATION | data-synthesizer | — |
| Encerrar pesquisa sem coverage completa | Apenas research-orqx | — |

### Anti-Padrões
- **Agent proliferation:** Mais agentes não significa melhor pesquisa — cada agente deve ter escopo claro
- **Infinite loops:** Agentes se referenciando mutuamente sem condição de parada
- **Authority confusion:** Múltiplos agentes contradizendo claims sem protocolo de resolução
- **Premature synthesis:** Sintetizar antes de coverage suficiente nas ondas paralelas

## Integração com Research Depth Pyramid

| Pyramid Level | Ondas | Agentes Envolvidos | Paralelismo |
|:-------------:|:-----:|-------------------|:-----------:|
| SCAN | 1 | research-orqx | N/A |
| ANALYZE | 1-2 | + Sage ou Hawk ou Scope | Parcial |
| DEEP DIVE | 2-3 | + todos os especialistas | Total |
| DEFINITIVE | 3-4 | Todos + revisão externa | Total + iteração |

---

*Knowledge base da squad-research | Fonte: MS-009 Agentic Second Brain*
