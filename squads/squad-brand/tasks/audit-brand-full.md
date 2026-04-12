---
task: audit-brand-full
responsavel: "@brand-auditor"
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

# Task: audit-brand-full

## Metadata
- **Agent:** brand-auditor (Sentinel)
- **Squad:** squad-brand
- **Trigger:** `*audit-brand` ou phase-8 do workflow
- **Inputs:** Todos os outputs de todos os agentes do squad
- **Outputs:** Full audit report + brand consistency score + correction list

## Description
Auditoria completa de todos os outputs da marca contra guidelines definidas. Zero tolerancia para desvios.

## Steps
1. **Checklist Estrategico (7 itens, score 0-5 cada):**
   - Posicionamento claro e diferenciado
   - Arquetipo consistente em todas manifestacoes
   - Tom de voz com exemplos que funcionam
   - Manifesto alinhado com posicionamento
   - Brand architecture hierarquia clara
   - Personas realistas e uteis
   - Coerencia estrategia→visual
2. **Checklist Visual (6 itens):**
   - Paleta usada corretamente (hex exatos)
   - Tipografia correta (fontes, hierarquia, scale)
   - Logo uso correto (area protecao, tamanho minimo, sem proibidos)
   - Espacamento segue spacing scale
   - Contrast ratios WCAG AA
   - Consistencia visual entre todos os assets
3. **Checklist Design System (6 itens):**
   - Tokens 3 niveis sem hardcoded
   - Componentes com ARIA
   - Grid e breakpoints corretos
   - Dark mode com contrast OK
   - Responsive funcional
   - Codigo implementavel
4. **Checklist Producao (5 itens):**
   - Print: CMYK, 300DPI, bleed, safe zone
   - Digital: RGB, resolucoes, responsivo
   - Templates reutilizaveis
   - Mockups fotorrealistas e coerentes
   - Specs documentadas
5. **Checklist Motion+Audio (8 itens):**
   - Motion principles alinhados com personalidade
   - Easing curves consistentes
   - Duracoes no scale
   - 60fps performance
   - prefers-reduced-motion
   - Sonic identity coerente
   - Audio-visual sync
   - Formatos export completos
6. Calcular **Brand Consistency Score:**
   - Visual: 30% | Strategic: 25% | Technical: 20% | Cross-channel: 15% | Documentation: 10%
   - Score 0-100
7. Decisao: APPROVED (>=85) | NEEDS REVISION (70-84) | REJECTED (<70)

## Validation Criteria
- Todos os 32 itens avaliados com score 0-5
- Brand consistency score calculado
- Decisao formal documentada
- Se NEEDS REVISION: lista de correcoes por agente
- Evidencias para cada score

## Output Format
Audit report PDF com scores, evidencias, recomendacoes e decisao formal.
