---
task: register-template-contract
responsavel: "@platform-specialist"
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

# Task: Register Template Contract

> Registrar novo Template Contract com especificacoes formais de formato, limites e regras.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | platform-specialist (Morph) |
| **Co-agents** | content-governor (Index) |
| **Trigger** | Novo formato ou plataforma adicionada ao projeto |
| **Input** | Formato do template, plataforma, specs tecnicas, regras de producao |
| **Output** | Template Contract registrado no sistema com todos os parametros |
| **Handoff** | → content-governor (Index) para validacao e enforcement |
| **Complexity** | medium |

---

## Fundamentacao

O Template Contract e o contrato formal entre quem produz e quem valida. Ele define EXATAMENTE: quantos caracteres por campo, quantos slides/telas, quais elementos sao obrigatorios, quais sao opcionais, e quais limites sao inegociaveis. Sem Template Contract, cada producao e interpretacao livre — gerando inconsistencia e retrabalho. O TC e a espinha dorsal da qualidade operacional. Referencia conceitual: Design Systems contracts (tokens, specs) aplicados a conteudo.

---

## Steps

### Step 1: Definir Identificador do Template
Nome unico: {plataforma}-{formato}-{variante}. Ex: "instagram-carousel-educativo", "linkedin-text-thought-leadership", "blog-article-pillar-page".

### Step 2: Especificar Campos e Limites
Para cada campo do template: nome, tipo (texto/visual/CTA), limite minimo, limite maximo, obrigatoriedade. Exemplo: slide_hook: texto, min 5 chars, max 80 chars, obrigatorio.

### Step 3: Definir Regras de Formato
Numero de slides/telas/secoes. Formato de imagem/video. Estrutura fixa: quais elementos em qual ordem. O que DEVE e o que NAO DEVE conter.

### Step 4: Especificar Regras de CTA
Tipo de CTA permitido por template. Posicao do CTA (ultimo slide, final do texto, primeiro comentario). Formato do CTA (pergunta, acao, link).

### Step 5: Definir Criterios de Validacao
Como o Index valida compliance: checklist automatica com cada campo vs. especificacao. O que acontece se um campo estiver fora do limite: rejeitar (hard fail) ou avisar (soft warn).

### Step 6: Registrar no Sistema
Salvar Template Contract no formato padrao em templates/. Vincular ao pipeline de validacao do Index.

### Step 7: Handoff

```yaml
handoff:
  artifact: "template-contract-{identificador}.yaml"
  context: "TC registrado: '{identificador}', {N} campos, {R} regras, enforcement ativo"
  next: "content-governor (Index) para configurar enforcement automatico"
```
