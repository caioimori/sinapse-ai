---
task: audit-template-compliance
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

# Task: Audit Template Compliance

> Auditar conteudo produzido contra Template Contracts para garantir compliance.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | content-governor (Index) |
| **Trigger** | Pre-publicacao (automatico) ou auditoria periodica |
| **Input** | Conteudo finalizado, Template Contract correspondente |
| **Output** | Relatorio de compliance com pass/fail por campo |
| **Handoff** | → content-engineer (Arc) ou platform-specialist (Morph) se fail |
| **Complexity** | simple |

---

## Fundamentacao

Template Contracts sao inegociaveis. Se o TC define maximo 80 caracteres no hook do carrossel e o hook tem 95, e um fail — nao uma sugestao. A auditoria de compliance garante que o sistema de qualidade funciona. Sem enforcement, TCs viram documentos ignorados. Referencia: Template Contract System — conceito core do squad.

---

## Steps

### Step 1: Identificar TC Correspondente
Qual Template Contract se aplica a esta peca? Buscar por: plataforma + formato + variante.

### Step 2: Verificar Cada Campo
Para cada campo do TC: o conteudo esta dentro dos limites? Verificar: caracteres min/max, numero de elementos, formato de CTA, campos obrigatorios preenchidos.

### Step 3: Emitir Resultado por Campo
Para cada campo: PASS (dentro do limite), WARN (proximo do limite, mas aceitavel), FAIL (fora do limite).

### Step 4: Emitir Veredicto
Se todos PASS: aprovado. Se algum WARN: aprovado com nota. Se algum FAIL: rejeitado com lista de campos a corrigir.

### Step 5: Handoff

```yaml
handoff:
  artifact: "tc-audit-{peca}.md"
  context: "TC compliance: {PASS/FAIL}, {N} campos verificados, {F} fails"
  next: "Publicacao se PASS, Arc/Morph se FAIL para correcao"
```
