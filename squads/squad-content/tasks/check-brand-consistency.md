---
task: check-brand-consistency
responsavel: "@content-governor"
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

# Task: Check Brand Consistency

> Verificar se conteudo produzido esta consistente com brand voice, visual e posicionamento.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Trigger** | Pre-publicacao — gate obrigatorio |
| **Input** | Conteudo finalizado, brand voice guide (brand-system), visual guidelines |
| **Output** | Validacao pass/fail com feedback especifico |
| **Handoff** | → content-engineer (Arc) se fail, publicacao se pass |
| **Complexity** | simple |

---

## Fundamentacao

Consistencia de marca e cumulativa: 1 post off-brand passa despercebido, mas 10 corroem a percepcao. O check de consistencia e um gate automatico que previne derivacao gradual. Verifica: tom esta correto? Vocabulario de marca respeitado? Posicionamento coerente? Visual alinhado? Referencia: integracao com brand-system squad — brand voice e visual identity.

---

## Steps

### Step 1: Verificar Tom e Voz
O conteudo soa como a marca? Comparar com brand voice guide: adjetivos permitidos, nivel de formalidade, personalidade. Flag desvios especificos.

### Step 2: Verificar Vocabulario
A marca usa termos especificos (ou evita termos especificos). Verificar: jargao proibido? Termos proprietarios usados corretamente? Concorrentes mencionados inadequadamente?

### Step 3: Verificar Posicionamento
O conteudo posiciona a marca corretamente? Nao esta se comparando com concorrentes de forma inapropriada? Nao esta fazendo claims que a marca nao pode sustentar?

### Step 4: Verificar Visual (se aplicavel)
Cores, fontes, estilo de imagem — consistentes com brand guidelines? Template visual correto?

### Step 5: Emitir Veredicto
PASS: publicar. FAIL com feedback: devolver para Arc com lista de ajustes necessarios. Cada fail deve ter justificativa clara e sugestao de correcao.

### Step 6: Handoff

```yaml
handoff:
  artifact: "brand-check-{peca}.md"
  context: "Brand consistency: {PASS/FAIL}, {N} items verificados, {F} flags"
  next: "Publicacao se PASS, content-engineer (Arc) se FAIL"
```
