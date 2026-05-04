---
task: define-brand-positioning-strategy
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

# Task: Define Brand Positioning (Strategy)

## Metadata
- **Agent:** Position (brand-positioning-strategist)
- **Squad:** squad-brand
- **Trigger:** `*define-positioning` ou novo projeto de posicionamento
- **Inputs:** Market context, competitive landscape, target audience
- **Outputs:** Positioning statement, perceptual map, own-a-word strategy

## Description
Definir posicionamento estrategico da marca usando principios de Al Ries (22 Leis Imutaveis), identificar espaco mental nao ocupado pelos concorrentes e formular posicionamento defensavel.

## Steps
1. Mapear concorrentes (5-10) e suas posicoes na mente do consumidor
2. Identificar "palavras" que cada concorrente ja "possui"
3. Construir perceptual map 2x2 (eixos relevantes para o setor)
4. Identificar white space (posicoes nao ocupadas)
5. Avaliar cada posicao disponivel: relevante? defensavel? sustentavel?
6. Formular positioning statement:
   - "Para [publico], [marca] e a [categoria] que [diferencial] porque [razao]."
7. Definir "own a word" strategy: qual palavra a marca quer possuir
8. Validar contra 22 Leis Imutaveis de Ries & Trout
9. Criar differentiation matrix (marca vs top 3 concorrentes)
10. Documentar posicionamento completo

## Validation Criteria
- Positioning statement e unico (nenhum concorrente usa o mesmo)
- "Own a word" strategy e clara e executavel
- Perceptual map mostra espaco claro para a marca
- Validado contra pelo menos 5 das 22 Leis Imutaveis

## Output Format
```markdown
# Posicionamento — {brand_name}

## Positioning Statement
Para [publico], [marca] e...

## Own a Word
Palavra: [X] — justificativa

## Perceptual Map
[eixo X] vs [eixo Y] — posicao vs concorrentes

## 22 Laws Validation
- Law of Leadership: [pass/fail]
- Law of Category: [pass/fail]
- Law of the Mind: [pass/fail]
- Law of Focus: [pass/fail]
- Law of Exclusivity: [pass/fail]

## Differentiation Matrix
| Atributo | Marca | Conc.1 | Conc.2 | Conc.3 |
```
