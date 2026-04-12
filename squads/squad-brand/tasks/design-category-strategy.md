---
task: design-category-strategy
responsavel: "@brand-positioning-strategist"
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

# Task: Design Category Strategy

## Metadata
- **Agent:** Position (brand-positioning-strategist)
- **Squad:** squad-brand
- **Trigger:** `*create-category` ou oportunidade de categoria identificada
- **Inputs:** Market analysis, unmet needs, competitive landscape
- **Outputs:** Category definition, Category POV, Lightning Strike plan

## Description
Projetar estrategia de criacao de categoria usando framework Play Bigger e Blue Ocean Strategy. Definir uma nova categoria de mercado onde a marca e a referencia (category king).

## Steps
1. Identificar problema nao resolvido ou mal categorizado pelo mercado
2. Aplicar Blue Ocean Strategy Canvas:
   - Listar fatores de competicao do setor
   - Four Actions Framework: Eliminate, Reduce, Raise, Create
   - Desenhar strategy canvas (antes vs depois)
3. Definir a nova categoria:
   - Nome da categoria (memoravel, descritivo)
   - Problema que resolve (antes/depois)
   - Quem se beneficia (target audience)
   - Por que agora (timing)
4. Criar Category POV (Point of View):
   - Manifesto da categoria (200-400 palavras)
   - Visao de mundo da categoria
   - O que a categoria rejeita (anti-positioning)
5. Planejar Lightning Strike:
   - Momento de lancamento
   - Canais de amplificacao
   - Evangelistas e early adopters
   - Metricas de sucesso
6. Definir category ecosystem:
   - Quem mais vive nessa categoria (parceiros, nao concorrentes)
   - Como a categoria cresce (network effects, education)
7. Documentar estrategia completa

## Validation Criteria
- Categoria resolve um problema real que categorias existentes nao resolvem
- Nome e memoravel e descritivo
- POV e provocativo e diferenciado
- Lightning Strike tem timeline e metricas
- Blue Ocean Canvas mostra diferenciacao clara

## Output Format
```markdown
# Category Strategy — {category_name}

## Category Definition
Nome: [X]
Problema: [antes/depois]
Audience: [quem se beneficia]

## Blue Ocean Strategy Canvas
| Factor | Industry Avg | Our Category |
[Eliminate / Reduce / Raise / Create]

## Category POV
[200-400 word manifesto]

## Lightning Strike Plan
- When: [date/milestone]
- Channels: [list]
- Evangelists: [who]
- Success metrics: [KPIs]
```
