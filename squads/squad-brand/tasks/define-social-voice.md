---
task: define-social-voice
responsavel: "@brand-strategist"
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

# Task: define-social-voice

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*define-social-voice` ou tone of voice definido
- **Inputs:** Tone of voice guide, personas, posicionamento
- **Outputs:** Social voice guide por plataforma

## Description
Adapta o tom de voz da marca para cada rede social, definindo content pillars, engagement rules e hashtag strategy.

## Steps
1. Adaptar tom por plataforma:
   - **Instagram:** visual-first, casual, storytelling, emojis permitidos, hashtags
   - **LinkedIn:** profissional, thought leadership, dados e insights, sem emojis excessivos
   - **Twitter/X:** conciso, opinativo, real-time, threads para profundidade
   - **TikTok:** informal, trends-aware, humor permitido, autenticidade
   - **YouTube:** educacional ou entretenimento, scripts com personalidade
2. Definir Content Pillars (3-5 temas recorrentes):
   - Pilar 1: {tema} — 30% do conteudo
   - Pilar 2: {tema} — 25% do conteudo
   - Pilar 3: {tema} — 25% do conteudo
   - Pilar 4: {tema} — 20% do conteudo
3. Definir Hashtag Strategy:
   - Branded hashtags (criados pela marca)
   - Community hashtags (do nicho)
   - Trending hashtags (quando e como usar)
4. Definir Engagement Rules:
   - Como responder comentarios positivos
   - Como responder criticas
   - Como lidar com trolls
   - Tempo maximo de resposta
   - Quando escalar para atendimento privado
5. Criar 3 exemplos de post por plataforma

## Validation Criteria
- Tom adaptado para cada plataforma (nao copy-paste)
- Content pillars cobrem os temas estrategicos da marca
- Engagement rules sao praticas e aplicaveis
- Exemplos sao reconheciveis como "a voz da marca"

## Output Format
```markdown
# Social Voice Guide — {brand_name}

## Por Plataforma
### Instagram
- Tom: ...
- Exemplos: ...

## Content Pillars
1. {tema} (30%): ...

## Hashtag Strategy
- Branded: #...
- Community: #...

## Engagement Rules
- Positivo: ...
- Critica: ...
```
