---
task: define-brand-personas
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

# Task: define-brand-personas

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*define-personas` ou posicionamento definido
- **Inputs:** Discovery report, positioning, dados de mercado
- **Outputs:** 3-5 persona profiles completos

## Description
Define as personas da marca — representacoes semi-ficcionais dos publicos-alvo baseadas em dados reais e insights do discovery.

## Steps
1. Identificar segmentos de publico a partir do discovery
2. Para cada persona (minimo 3, maximo 5):
   - **Nome e foto representativa:** nome ficticio que humanize
   - **Demograficos:** idade, genero, localizacao, renda, educacao, profissao
   - **Psicograficos:** valores, interesses, estilo de vida, aspiracoes
   - **Comportamentos:** habitos de consumo, canais preferidos, frequencia de compra
   - **Dores (pain points):** 3-5 problemas que a marca resolve
   - **Necessidades:** o que busca (funcional, emocional, social)
   - **Jornada:** como descobre, avalia, compra, usa e recomenda
   - **Touchpoints preferidos:** onde encontra a marca (social, web, loja, indicacao)
   - **Tom ideal:** como prefere ser abordado pela marca
   - **Citacao representativa:** frase que resume sua visao
3. Priorizar personas (primaria, secundaria, terciaria)
4. Validar que personas sao distintas entre si (nao sobrepostas)
5. Documentar anti-personas (quem NAO e publico)

## Validation Criteria
- Minimo 3 personas com todos os campos preenchidos
- Personas sao baseadas em dados do discovery (nao inventadas)
- Personas sao distintas (sem sobreposicao significativa)
- Cada persona tem dores que a marca resolve
- Anti-personas documentadas

## Output Format
```markdown
# Personas — {brand_name}

## Persona Primaria: {nome}
- Demograficos: ...
- Dores: ...
- Necessidades: ...
- Citacao: "..."

## Persona Secundaria: {nome}
...

## Anti-Personas
- Quem NAO e publico: ...
```
