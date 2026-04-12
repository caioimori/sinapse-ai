---
task: create-evp
responsavel: "@brand-culture-architect"
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

# Task: Create Employee Value Proposition (EVP)

> Criar proposta de valor ao colaborador alinhada à marca.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Trigger** | Quando employer branding é parte do escopo |
| **Input** | Cultura projetada, valores, manifesto |
| **Output** | `employee-value-proposition.md` |
| **Handoff** | → brand-collateral-designer (Vellum) para materiais de RH |

---

## Steps

### Step 1: Pesquisar Contexto
- Setor e mercado de talentos
- Propostas de valor de concorrentes (como empregadores)
- Tendências de employer branding no setor
- Perfil de talento desejado

### Step 2: Definir Pilares do EVP
Framework de 5 pilares:

| Pilar | Descrição | Diferencial da Marca |
|-------|-----------|---------------------|
| **Compensation** | Salário, benefícios, bônus | |
| **Culture** | Ambiente, valores, people | |
| **Career** | Crescimento, aprendizado, desafios | |
| **Community** | Propósito, impacto, pertencimento | |
| **Content** | Trabalho em si, autonomia, significado | |

### Step 3: Craft EVP Statement
```
Na {brand_name}, você vai {promessa principal}
porque acreditamos que {valor core}.
Aqui, {diferencial 1}, {diferencial 2} e {diferencial 3}
não são slogans — são o nosso dia a dia.
```

### Step 4: Criar Messaging por Público
| Público | Mensagem | Canal |
|---------|----------|-------|
| Candidatos senior | | LinkedIn, headhunters |
| Candidatos junior | | LinkedIn, universidades |
| Colaboradores atuais | | Internal comms |
| Alumni | | Email, LinkedIn |

### Step 5: Definir Proof Points
Para cada pilar, 2-3 evidências:
| Pilar | Proof Point | Verificável? |
|-------|------------|-------------|
| Culture | {ex: 92% dos funcionários recomendam} | Sim/Não |
| Career | {ex: 40h/ano de treinamento garantido} | Sim/Não |
| Community | {ex: 2% do faturamento para causas} | Sim/Não |

### Step 6: Handoff
```yaml
handoff:
  to: brand-collateral-designer (Vellum)
  artifact: employee-value-proposition.md
  context: "EVP com pilares, messaging e proof points"
  next: "Criar materiais de employer branding (careers page, job posts template, onboarding kit)"
```
