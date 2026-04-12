---
task: define-naming-system
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

# Task: define-naming-system

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*define-naming` ou brand architecture definida
- **Inputs:** Brand architecture, posicionamento, tom de voz
- **Outputs:** Naming system guide

## Description
Define o sistema de naming da marca — criterios, metodologia e regras para nomear produtos, features, eventos e extensoes futuras.

## Steps
1. Definir criterios de naming:
   - Memoravel (facil de lembrar e soletrar)
   - Pronunciavel (funciona em portugues e ingles)
   - Disponivel (dominio, trademark, social handles)
   - Escalavel (permite extensoes futuras)
   - Coerente (alinhado com personalidade da marca)
2. Criar naming matrix (tipos disponiveis):
   - **Descritivo:** diz o que faz (PayPal = pagamento entre amigos)
   - **Sugestivo:** sugere beneficio (Pinterest = pin + interest)
   - **Abstrato:** inventado (Kodak, Xerox)
   - **Fundador:** nome do fundador (Ford, Disney)
   - **Acronimo:** siglas (IBM, BMW)
   - **Metaforico:** analogia (Amazon = maior rio = maior loja)
3. Definir estilo de naming alinhado com arquetipo
4. Testar candidatos (para nome principal se projeto de naming):
   - Teste fonetico (falar em voz alta)
   - Teste de associacao (o que lembra?)
   - Teste de dominio (disponibilidade .com, .com.br)
   - Teste de trademark (INPI, USPTO)
   - Teste de social handles (@marca disponivel)
5. Definir regras para naming futuro (produtos, features, campanhas)
6. Documentar processo de naming para equipe

## Validation Criteria
- Criterios sao claros e aplicaveis
- Naming matrix cobre todos os tipos relevantes
- Regras para naming futuro sao praticas
- Testes documentados para cada candidato

## Output Format
```markdown
# Naming System — {brand_name}

## Criterios
1. Memoravel: ...

## Matrix de Tipos
| Tipo | Descricao | Quando usar | Exemplos |

## Estilo Recomendado
{tipo alinhado com arquetipo}

## Regras para Naming Futuro
1. Produtos: ...
2. Features: ...
3. Campanhas: ...
```
