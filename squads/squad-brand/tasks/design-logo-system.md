---
task: design-logo-system
responsavel: "@brand-identity-designer"
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

# Task: design-logo-system

## Metadata
- **Agent:** brand-identity-designer (Iris)
- **Squad:** squad-brand
- **Trigger:** `*design-logo-system` ou tipografia selecionada
- **Inputs:** Posicionamento, paleta, tipografia, gestalt-principles.md
- **Outputs:** Logo system spec completo (6+ variacoes + regras)

## Description
Especifica o sistema completo de logo — nao apenas o logo, mas todas as variacoes, regras de uso e usos proibidos.

## Steps
1. Definir conceito do logo baseado no posicionamento e personalidade
2. Especificar forma: geometrica? organica? tipografica? simbolica?
3. Definir 6+ variacoes obrigatorias:
   - **Horizontal (primario):** logo + nome lado a lado
   - **Vertical (stacked):** icone sobre nome
   - **Icone/simbolo:** so o simbolo (app icon, favicon, avatar)
   - **Monocromatica:** versao em uma cor (preta)
   - **Negativa:** versao para fundo escuro (branca ou clara)
   - **Fundo colorido:** versao sobre cor primaria da marca
4. Definir area de protecao (clear space): minimo 1x a altura do icone em todos os lados
5. Definir tamanho minimo: digital (min 24px icone, 80px com texto) e print (min 10mm)
6. Definir grid de construcao (geometria subjacente)
7. Documentar 8+ usos proibidos com exemplos visuais:
   - Distorcer proporcoes
   - Mudar cores fora da paleta
   - Adicionar sombras ou efeitos
   - Colocar sobre fundo conflitante (baixo contraste)
   - Rotacionar
   - Alterar tipografia
   - Adicionar elementos ao logo
   - Usar versao errada para o contexto
8. Definir regras de posicionamento em layouts

## Validation Criteria
- 6+ variacoes especificadas
- Area de protecao definida com medida
- Tamanho minimo definido para digital e print
- 8+ usos proibidos documentados
- Grid de construcao documentado
- Funciona de 16px (favicon) a outdoor

## Output Format
```markdown
# Logo System — {brand_name}

## Conceito
{descricao do conceito + justificativa}

## Variacoes
1. Horizontal (primario): {descricao}
2. Vertical: ...
...

## Regras
- Area de protecao: {medida}
- Tamanho minimo: {digital} / {print}

## Usos Proibidos
1. {proibicao} — {por que}
...
```
