---
task: define-message-house
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

# Task: define-message-house

## Metadata
- **Agent:** brand-strategist (Athena)
- **Squad:** squad-brand
- **Trigger:** `*define-message-house` ou tom de voz definido
- **Inputs:** Positioning statement, manifesto, tone of voice
- **Outputs:** Message house document

## Description
Define a arquitetura de mensagens da marca — master message, pilares, proof points e key messages por audiencia.

## Steps
1. Definir Master Message (1 frase que resume tudo que a marca comunica)
2. Definir 3-4 Pilares de Mensagem (temas estrategicos recorrentes):
   - Pilar 1: {tema} — o que comunicamos sobre isso
   - Pilar 2: {tema} — o que comunicamos sobre isso
   - Pilar 3: {tema} — o que comunicamos sobre isso
3. Para cada pilar, definir Proof Points (dados, fatos, evidencias):
   - Estatisticas, cases de sucesso, depoimentos, certificacoes, premios
4. Criar Key Messages por audiencia:
   - Clientes: o que dizemos para quem compra
   - Investidores: o que dizemos para quem financia
   - Imprensa: o que dizemos para midia
   - Talentos: o que dizemos para quem queremos contratar
   - Parceiros: o que dizemos para quem colabora
5. Definir Elevator Pitch (30 segundos)
6. Definir Boilerplate (paragrafo padrao "sobre a empresa")
7. Validar que todas as mensagens sao coerentes com posicionamento e tom

## Validation Criteria
- Master message e clara e memoravel
- Pilares cobrem os principais temas da marca
- Proof points sao verificaveis (nao inventados)
- Key messages sao diferenciadas por audiencia
- Elevator pitch funciona em 30 segundos

## Output Format
```markdown
# Message House — {brand_name}

## Master Message
{1 frase}

## Pilares
### Pilar 1: {tema}
- Mensagem: ...
- Proof Points: ...

## Key Messages por Audiencia
### Clientes
{mensagem + tom}
...

## Elevator Pitch
{30 segundos}

## Boilerplate
{paragrafo padrao}
```
