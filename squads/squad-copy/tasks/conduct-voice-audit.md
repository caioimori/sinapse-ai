---
task: conduct-voice-audit
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

# Task: Conduct Voice Audit

## Metadata
- **Squad:** squad-copy
- **Agent:** brand-voice-writer (Tone)
- **Complexity:** STANDARD
- **Depends on:** brand voice guidelines, copy existente
- **Feeds:** copy-editor (Chisel), copy-strategist (Quill)

## Objetivo
Conduzir auditoria de voz em toda a copy existente — identificando inconsistencias, gaps e oportunidades de alinhamento para garantir que cada touchpoint soa como a mesma marca.

## Entrada
- Brand voice guidelines
- Copy de todos os canais ativos
- Lista de touchpoints da marca
- Quem escreve (equipe, freelancers, AI)

## Passos

### 1. Inventariar Todos os Touchpoints
**Mapa de touchpoints:**
| Categoria | Touchpoints | Prioridade |
|-----------|-------------|:----------:|
| Website | Homepage, product, about, blog, pricing | Alta |
| Email | Welcome, nurture, promo, transacional | Alta |
| Social | Instagram, LinkedIn, Twitter, TikTok | Alta |
| Ads | Google, Meta, LinkedIn, Display | Alta |
| Product | Onboarding, UI copy, notifications | Media |
| Sales | Proposals, decks, scripts | Media |
| Support | Help center, chatbot, templates | Media |
| Legal | Termos, privacidade, contratos | Baixa |
| Internal | Cultura, recrutamento, training | Baixa |

### 2. Coletar Amostras
**Para cada touchpoint, coletar:**
- 3-5 amostras de copy atual
- Quem escreveu (se possivel)
- Quando foi escrito
- Performance data (se disponível)

### 3. Avaliar com Voice Scorecard
**Scorecard por amostra (1-5):**
| Criterio | Peso | 1 (Off) | 3 (Parcial) | 5 (On-brand) |
|----------|:----:|---------|-------------|--------------|
| Voice attributes | 30% | Nao reflete nenhum atributo | Reflete 1-2 de 3-5 | Reflete todos |
| Vocabulario | 20% | Usa never words | Mix de always/never | Usa always words |
| Tom apropriado | 20% | Tom errado para contexto | Tom ok mas inconsistente | Tom perfeito para contexto |
| Consistencia | 15% | Parece outra marca | Similar mas variavel | Inconfundivelmente a marca |
| Expressoes assinatura | 15% | Nenhuma usada | Ocasionalmente | Naturalmente integradas |

**Score = weighted average de todos os criterios**
- 4.0-5.0: On-brand (manter)
- 3.0-3.9: Parcial (ajustar)
- 1.0-2.9: Off-brand (reescrever)

### 4. Identificar Padroes
**Analise de padroes:**

**Inconsistencias mais comuns:**
- Canal X soa formal, canal Y soa casual (sem razao)
- Writers diferentes = voices diferentes
- Copy antiga ≠ voice atual
- AI-generated copy sem customizacao de voice
- Legal/transacional completamente desconectado

**Perguntas diagnosticas:**
- Qual canal esta mais on-brand? (benchmark)
- Qual canal esta mais off-brand? (prioridade)
- Existe padrao por writer/equipe?
- Copy mais recente e mais on-brand que antiga?
- Quais touchpoints clientes veem PRIMEIRO?

### 5. Recomendar Acoes
**Priorizacao por impacto:**
| Prioridade | Criterio | Acao |
|:----------:|----------|------|
| P0 | Alto trafego + off-brand | Reescrever imediatamente |
| P1 | Alto trafego + parcial | Ajustar nos proximos 30 dias |
| P2 | Medio trafego + off-brand | Reescrever em 60 dias |
| P3 | Baixo trafego + parcial | Proxima atualizacao natural |
| P4 | Baixo trafego + on-brand | Manter |

**Recomendacoes sistemicas:**
- Training para writers
- Templates pre-aprovados
- AI voice customization prompts
- Review process (voice checkpoint)
- Atualizacao de guidelines (se necessario)

### 6. Criar Audit Report
**Estrutura do report:**
```
1. EXECUTIVE SUMMARY
   - Score geral da marca
   - Top 3 gaps
   - Top 3 prioridades

2. SCORECARD POR CANAL
   - Score de cada canal
   - Exemplos bons e ruins

3. PADROES IDENTIFICADOS
   - Inconsistencias
   - Root causes

4. RECOMENDACOES
   - Quick wins (P0-P1)
   - Medium-term (P2-P3)
   - Sistemicas (training, process)

5. APPENDIX
   - Amostras coletadas
   - Scores detalhados
```

## Cross-Squad Handoff
```yaml
handoffs:
  - to: copy-editor (Chisel)
    delivers: Lista de copy para reescrita prioritaria
    format: Amostras off-brand + voice guidelines
  - to: copy-strategist (Quill)
    delivers: Audit report para planejamento
    format: Report completo + recomendacoes
```

## Saida
- Voice audit report completo
- Scorecard por canal
- Lista de reescrita prioritizada (P0-P4)
- Recomendacoes sistemicas
- Benchmark de voice score atual

## Validacao
- [ ] Min 8 touchpoints auditados
- [ ] 3-5 amostras por touchpoint
- [ ] Scorecard aplicado a todas as amostras
- [ ] Padroes de inconsistencia identificados
- [ ] Recomendacoes priorizadas (P0-P4)
- [ ] Report executivo criado
- [ ] Quick wins identificados
- [ ] Recomendacoes sistemicas incluidas

---

*Task operada por: brand-voice-writer (Tone)*
