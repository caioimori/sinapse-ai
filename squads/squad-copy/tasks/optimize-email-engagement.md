---
task: optimize-email-engagement
responsavel: "@email-sequence-strategist"
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

# Task: Optimize Email Engagement

## Metadata
- **Squad:** squad-copy
- **Agent:** email-sequence-strategist (Drip)
- **Complexity:** STANDARD
- **Depends on:** sequencia existente, dados de performance
- **Feeds:** copy-strategist (Quill), growth-analytics squad

## Objetivo
Auditar e otimizar sequencias de email existentes para melhorar open rates, click rates, reply rates e conversao. Diagnosticar problemas especificos e aplicar fixes baseados em dados e best practices de email copywriting.

## Entrada
- Sequencia de emails existente (copy completa)
- Metricas atuais (open rate, click rate, unsubscribe rate, conversao)
- Segmento de audiencia
- Benchmarks do setor (se disponiveis)

## Passos

### 1. Diagnosticar Performance Atual
| Metrica | Benchmark | Status | Acao Prioritaria |
|---------|-----------|--------|-----------------|
| Open Rate | >25% | Abaixo → Subject line problem | Reescrever subjects |
| Click Rate | >3% | Abaixo → CTA/copy problem | Otimizar CTA e body |
| Unsubscribe | <0.5% | Acima → Relevancia problem | Revisar segmentacao |
| Reply Rate | >1% | Abaixo → Engagement problem | Adicionar conversation triggers |
| Bounce Rate | <2% | Acima → List hygiene problem | Limpar lista |

### 2. Otimizar Subject Lines
- Analisar subject lines com menor open rate
- Aplicar A/B testing: curiosidade vs beneficio vs urgencia
- Verificar comprimento (35-50 chars ideal para mobile)
- Remover spam triggers (GRATIS, $$$, !!!, CAPS excessivo)
- Adicionar personalizacao quando relevante
- Gerar 5 variacoes para cada subject line fraco

### 3. Otimizar Body Copy
- Verificar "above the fold" — primeiras 2-3 linhas prendem?
- Avaliar legibilidade (paragrafos curtos, frases simples)
- Checar se ha 1 ideia principal por email (nao sobrecarregar)
- Verificar formatacao mobile (linhas curtas, sem imagens pesadas)
- Avaliar tom — conversacional e pessoal vs corporativo e generico

### 4. Otimizar CTAs
- 1 CTA principal por email (maximo 2)
- CTA especifico ("Baixe o guia agora") vs generico ("Clique aqui")
- Posicao: mid-email E final
- Formato: texto com link > botao (para emails pessoais)
- Teste: CTA como pergunta vs comando vs beneficio

### 5. Otimizar Cadencia e Timing
- Testar dias da semana (Terca-Quinta geralmente melhor B2B)
- Testar horarios (9-11h e 14-16h para B2B, 19-21h para B2C)
- Avaliar frequencia (demais = unsubscribe, de menos = esquecimento)
- Implementar send-time optimization se plataforma suportar

### 6. Criar Plano de Testes A/B
| Teste | Variavel | Metrica | Duracao |
|-------|----------|---------|---------|
| Subject line | Curiosidade vs Beneficio | Open Rate | 1 semana |
| CTA format | Texto vs Botao | Click Rate | 1 semana |
| Email length | Curto (<200) vs Longo (>400) | Click Rate | 2 semanas |
| Send time | Manha vs Tarde | Open Rate | 2 semanas |
| PS inclusion | Com PS vs Sem PS | Click Rate | 1 semana |

## Cross-Squad Handoff
```yaml
handoffs:
  - to: growth-analytics squad
    delivers: Recomendacoes de otimizacao com metricas baseline
    format: Report com diagnostico + plano de acao
  - to: copy-strategist (Quill)
    delivers: Insights de performance para ajustar estrategia
    format: Analise com recomendacoes estrategicas
```

## Saida
- Diagnostico de performance por email da sequencia
- Subject lines otimizadas (5 variacoes por email fraco)
- CTAs reescritos com formato otimizado
- Plano de testes A/B priorizado
- Recomendacoes de cadencia e timing

## Validacao
- [ ] Diagnostico cobre todas as metricas-chave
- [ ] Subject lines com 5+ variacoes para emails com baixo open rate
- [ ] CTAs especificos e orientados a beneficio
- [ ] Plano de A/B testing com metricas e duracao definidos
- [ ] Recomendacoes de cadencia baseadas em dados
- [ ] Spam triggers removidos de subject lines
- [ ] Formatacao mobile verificada
- [ ] Tom conversacional e pessoal mantido

---

*Task operada por: email-sequence-strategist (Drip)*
