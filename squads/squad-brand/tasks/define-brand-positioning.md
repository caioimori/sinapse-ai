---
task: define-brand-positioning
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

# Task: define-brand-positioning

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*define-positioning` ou discovery concluido
- **Inputs:** Discovery report, contexto competitivo
- **Outputs:** Positioning statement, competitive map, differentiation matrix

## Description
Define o posicionamento estrategico da marca — o espaco unico e defensavel que ela ocupa na mente do publico.

## Steps
1. Analisar discovery report: territory, atributos, tensoes
2. Mapear landscape competitivo (5-10 concorrentes diretos e indiretos)
3. Criar perceptual map 2x2 (eixos relevantes para o setor)
4. Identificar territorio nao-ocupado ou sub-explorado
5. Formular positioning statement:
   - "Para [publico-alvo], [marca] e a [categoria] que [diferencial unico] porque [razao de acreditar]."
6. Validar diferenciacao: e unico? e defensavel? e relevante? e sustentavel?
7. Definir arquetipo de marca (dos 12 arquetipos de Jung):
   - Inocente, Explorador, Sabio, Heroi, Fora-da-Lei, Mago, Cara Comum, Amante, Bobo da Corte, Cuidador, Criador, Governante
8. Justificar arquetipo com evidencias do discovery
9. Criar differentiation matrix (marca vs 3 top concorrentes em 5-7 atributos)
10. Documentar posicionamento completo

## Validation Criteria
- Positioning statement segue o formato padrao e e claro
- Diferencial e unico (nenhum concorrente usa o mesmo)
- Arquetipo e coerente com discovery (nao imposto)
- Competitive map mostra espaco claro para a marca

## Output Format
```markdown
# Posicionamento — {brand_name}

## Positioning Statement
Para [publico], [marca] e...

## Arquetipo
{arquetipo} — justificativa

## Perceptual Map
[eixo X] vs [eixo Y] — posicao da marca vs concorrentes

## Differentiation Matrix
| Atributo | Marca | Conc.1 | Conc.2 | Conc.3 |
```
