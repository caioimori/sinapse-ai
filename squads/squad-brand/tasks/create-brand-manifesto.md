---
task: create-brand-manifesto
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

# Task: create-brand-manifesto

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*create-manifesto` ou posicionamento definido
- **Inputs:** Positioning statement, discovery report
- **Outputs:** Brand manifesto completo (proposito, visao, missao, valores, promessa, tagline)

## Description
Cria o manifesto da marca — o documento fundacional que declara por que a marca existe, o que acredita e para onde vai. Combina pragmatismo estrategico com linguagem inspiracional.

## Steps
1. Partir do posicionamento e arquetipo definidos
2. Definir Proposito (Why): por que existimos alem do lucro
3. Definir Visao (Future): o mundo que queremos criar
4. Definir Missao (How): como fazemos isso no dia-a-dia
5. Definir Valores (3-5): principios inegociaveis com descricao acionavel
   - Cada valor: nome + frase de definicao + exemplo pratico + anti-exemplo
6. Definir Promessa de Marca: o que o cliente pode esperar SEMPRE
7. Criar Tagline: frase curta, memoravel, que encapsula o posicionamento
   - Gerar 5-10 opcoes, filtrar por: memorabilidade, unicidade, relevancia, sonoridade
8. Escrever texto do manifesto (1-2 paginas, tom inspiracional mas autentico)
9. Validar coerencia: manifesto reflete discovery? posicionamento? arquetipo?

## Validation Criteria
- Proposito e genuino (nao generico tipo "transformar vidas")
- Valores tem exemplos praticos (nao sao apenas palavras bonitas)
- Tagline e memoravel e unica
- Manifesto emociona E faz sentido estrategicamente
- Tudo traceable ao discovery e posicionamento

## Output Format
```markdown
# Brand Manifesto — {brand_name}

## Proposito
{por que existimos}

## Visao
{o futuro que queremos}

## Missao
{como fazemos}

## Valores
1. {valor} — {definicao} | Exemplo: ... | Anti: ...

## Promessa de Marca
{o que o cliente pode esperar}

## Tagline
{frase escolhida}
Alternativas consideradas: ...

## Manifesto (texto completo)
{1-2 paginas inspiracionais}
```
