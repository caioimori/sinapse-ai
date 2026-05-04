---
task: define-brand-activism-position
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

# Task: Define Brand Activism Position

> Definir posicionamento da marca no espectro de ativismo e responsabilidade social.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Trigger** | Quando marca quer se posicionar sobre causas sociais/ambientais |
| **Input** | Propósito, valores, público-alvo, contexto de mercado |
| **Output** | `brand-activism-position.md` |
| **Handoff** | → brand-strategist (Athena) para integração na estratégia |

---

## Steps

### Step 1: Avaliar Autenticidade
Para cada causa potencial:

| Causa | Relevante pro público? | Conectada aos valores? | Empresa pratica? | Risco | Score |
|-------|----------------------|----------------------|-----------------|-------|-------|
| {causa 1} | Sim/Não | Sim/Não | Sim/Parcial/Não | Alto/Med/Bai | /15 |

**Regra:** Só se posicionar sobre causas que a empresa PRATICA internamente. Purpose-washing é pior que silêncio.

### Step 2: Definir Nível no Espectro
| Nível | Descrição | Risco | Quando Escolher |
|-------|-----------|-------|-----------------|
| 1. Silêncio | Não se posiciona | Baixo | Risco alto, público conservador |
| 2. Valores internos | Define mas não comunica | Baixo | Começando a construir base |
| 3. Voz | Publica posicionamentos | Médio | Base de valores sólida |
| 4. Ação | Toma ações concretas (doações, políticas) | Médio-Alto | Walk the talk comprovado |
| 5. Ativismo | Defende causas publicamente | Alto | Causa é core da marca |

### Step 3: Definir Guidelines de Posicionamento
| Pergunta | Resposta |
|----------|---------|
| Quais causas a marca PODE falar sobre? | |
| Quais causas a marca DEVE falar sobre? | |
| Quais causas a marca NUNCA fala sobre? | |
| Quem aprova posicionamentos públicos? | |
| Qual o processo de resposta a crises? | |
| Qual o tom ao se posicionar? | |

### Step 4: Criar Playbook de Crise
| Cenário | Resposta Template | Tempo de Resposta | Aprovação |
|---------|------------------|-------------------|----------|
| Polêmica sobre a marca | | 24h | CEO + Brand Manager |
| Evento social relevante | | 48h | Brand Manager |
| Pressão para se posicionar | | 72h | CEO + Legal |
| Boicote/cancelamento | | 12h | CEO + Comms + Legal |

### Step 5: Definir Métricas de Impacto Social
| Métrica | Baseline | Target Anual | Como Medir |
|---------|----------|-------------|-----------|
| % receita para causas | | | Financeiro |
| Diversidade na equipe | | | HR data |
| Pegada de carbono | | | Relatório ambiental |
| Horas de voluntariado | | | Tracking interno |
| Satisfação social (NPS) | | | Survey |

### Step 6: Handoff
```yaml
handoff:
  to: brand-strategist (Athena)
  artifact: brand-activism-position.md
  context: "Posição de ativismo definida com guidelines, playbook e métricas"
  next: "Integrar no manifesto e tone of voice por canal"
```
