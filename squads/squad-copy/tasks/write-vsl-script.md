---
task: write-vsl-script
responsavel: "@direct-response-writer"
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

# Task: Write VSL Script

## Metadata
- **Squad:** squad-copy
- **Agent:** direct-response-writer (Forge)
- **Complexity:** COMPLEX
- **Depends on:** copy brief, message hierarchy, proof stack, mecanismo unico
- **Feeds:** proof-architect (Evidence), copy-editor (Chisel)

## Objetivo
Escrever script de Video Sales Letter completo que prende atencao, constroi desejo e converte — otimizado para retencao em video. Um VSL e uma sales letter FALADA: mesmos principios de persuasao, mas adaptados para o ouvido e para retencao visual.

## Entrada
- Copy brief com audiencia e awareness level
- Mecanismo unico definido e nomeado
- Proof stack (testimonials, dados, credenciais)
- Oferta completa (produto, preco, bonus, garantia)
- Duracao-alvo (short 5-15min, medium 15-30min, long 30-60min)

## Passos

### 1. Definir Estrutura por Duracao
| Duracao | Tipo | Ticket | Estrutura |
|---------|------|--------|-----------|
| 5-15 min | Short VSL | Low-ticket (R$7-97) | Hook → Problema → Mecanismo → Oferta → CTA |
| 15-30 min | Medium VSL | Mid-ticket (R$97-997) | Hook → Story → Problema → Mecanismo → Provas → Oferta → CTA |
| 30-60 min | Long VSL | High-ticket (R$997+) | Hook → Story → Problema → Agitacao → Mecanismo → Provas → Objecoes → Oferta → Stack → CTA |

### 2. Escrever o Hook (Primeiros 30-60 segundos)
**O hook determina se o viewer fica ou sai. 3 elementos obrigatorios:**
1. **Pattern interrupt:** Algo inesperado que quebra o "trance"
2. **Big Promise:** O resultado que vao atingir
3. **Curiosity hook:** POR QUE devem continuar assistindo

**Formulas de hook para VSL:**
- "Nos proximos [X] minutos, vou revelar [mecanismo] que [resultado]"
- "Se voce [situacao], preste muita atencao — porque o que vou mostrar..."
- "[Resultado chocante]. E nao — nao e [solucao obvia]. E algo completamente diferente."

### 3. Construir o Body (Retencao-First)
**Blocos de retencao (a cada 2-3 minutos):**
- Inserir open loop ou cliffhanger
- Mudar ritmo (rapido → lento → impactante)
- Adicionar "pattern interrupt" verbal ou visual
- Prometer o que vem a seguir

**Sequencia persuasiva para body:**
1. **Story pessoal** (5-8 min): Jornada do apresentador ou cliente
2. **Problema amplificado** (3-5 min): Consequencias de nao resolver
3. **Mecanismo unico** (5-8 min): POR QUE funciona (o coracao do VSL)
4. **Prova social** (3-5 min): Testimonials, resultados, dados
5. **Objecoes** (3-5 min): Antecipar e dissolver cada uma
6. **Future pacing** (2-3 min): Fazer o viewer SENTIR o resultado

### 4. Escrever para o OUVIDO
**Regras de linguagem falada:**
- Frases curtas (max 15 palavras)
- Palavras simples (fale como conversa, nao como escreve)
- Repeticao estrategica (repita frases-chave 3x)
- Transicoes conversacionais: "Agora, aqui esta o mais importante..."
- Pausas marcadas: [PAUSA] para enfase
- Sem jargao tecnico (a menos que audiencia seja tecnica)

### 5. Construir Offer Stack e Close
**Elementos do close em VSL:**
1. Recapitular transformacao prometida
2. Apresentar offer stack visual
3. Anchor price (valor total) → reveal price (investimento real)
4. Garantia com risk reversal forte
5. Urgencia/escassez (se real)
6. CTA repetido 3x com instrucoes claras
7. "Imagine" close — future pacing final

### 6. Adicionar Notas de Producao
- [SLIDE: texto] para indicar o que aparece na tela
- [B-ROLL: descricao] para imagens/video de apoio
- [TESTIMONIAL VIDEO: nome] para depoimentos em video
- [PAUSA] para momentos de enfase
- [TOM: emocao] para direcionar o apresentador

## Cross-Squad Handoff
```yaml
handoffs:
  - to: proof-architect (Evidence)
    delivers: VSL script para verificacao de claims e provas
    format: Script com claims destacados
  - to: funnel-copywriter (Flow)
    delivers: VSL script para integracao na pagina de venda
    format: Script final com notas de producao
```

## Saida
- VSL script completo com timing estimado por secao
- Notas de producao (slides, b-roll, testimonials)
- Hook variations (3 versoes alternativas)
- Offer stack formatado para slides
- CTA script com instrucoes visuais

## Validacao
- [ ] Hook prende nos primeiros 30 segundos
- [ ] Pattern interrupts a cada 2-3 minutos
- [ ] Linguagem conversacional (falada, nao escrita)
- [ ] Mecanismo unico explicado com clareza
- [ ] Provas em 3+ camadas integradas
- [ ] Objecoes top 5 endereçadas
- [ ] Offer stack claro com anchor price
- [ ] Garantia com risk reversal
- [ ] CTA repetido 3x com instrucoes claras
- [ ] Notas de producao completas
- [ ] Duracao dentro do range-alvo

---

*Task operada por: direct-response-writer (Forge)*
