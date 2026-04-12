---
task: manage-copy-versioning
responsavel: "@copy-editor"
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

# Task: Manage Copy Versioning

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor (Chisel)
- **Complexity:** STANDARD
- **Depends on:** copy production pipeline
- **Feeds:** todos os writers, copy-strategist (Quill)

## Objetivo
Gerenciar versionamento de copy — garantindo que todos trabalham na versao correta, historico de mudancas e preservado e aprovacoes sao rastreadas.

## Entrada
- Copy em producao (qualquer stage)
- Equipe envolvida (writers, reviewers, approvers)
- Canais/plataformas de distribuicao

## Passos

### 1. Naming Convention
**Formato:** `[tipo]-[nome]-v[X].[Y]-[status]`

**Componentes:**
- Tipo: LP, EMAIL, AD, SOCIAL, SALES, BLOG
- Nome: Identificador curto
- vX.Y: Major.Minor (X = reescrita, Y = edicao)
- Status: DRAFT, REVIEW, APPROVED, LIVE

**Exemplos:**
- `LP-homepage-v1.0-DRAFT`
- `LP-homepage-v1.3-REVIEW`
- `LP-homepage-v2.0-APPROVED`
- `EMAIL-welcome-seq-e1-v1.0-DRAFT`
- `AD-meta-conversion-v3.2-LIVE`

### 2. Version Control Rules
**Quando incrementar MAJOR (vX.0):**
- Reescrita significativa de estrutura
- Mudanca de message hierarchy
- Novo headline/abordagem
- Mudanca de audiencia ou objetivo

**Quando incrementar MINOR (v1.X):**
- Edicoes de palavras/frases
- Ajustes de tom
- Correcoes gramaticais
- Micro-otimizacoes

### 3. Status Lifecycle
```
DRAFT → IN REVIEW → REVISION → APPROVED → LIVE → ARCHIVED
  ↑         |           |
  └─────────┘           │
  (feedback)            │
  ↑                     │
  └─────────────────────┘
  (mudanca necessaria)
```

**Status definitions:**
| Status | Significado | Quem pode mudar |
|--------|-------------|-----------------|
| DRAFT | Em criacao/edicao | Writer |
| IN REVIEW | Aguardando review | Editor |
| REVISION | Feedback recebido, ajustando | Writer |
| APPROVED | Pronto para publicar | Editor/Strategist |
| LIVE | Publicado e ativo | Ops/Marketing |
| ARCHIVED | Substituido ou removido | Editor |

### 4. Change Log
**Para cada versao, documentar:**
```yaml
version_log:
  - version: "v1.3"
    date: "2026-03-13"
    author: "Chisel"
    changes:
      - "Headline reescrito (mais especifico)"
      - "CTA atualizado para primeira pessoa"
      - "3 paragrafos de fluff removidos"
    reason: "Pass 4 feedback — clareza e impacto"
    approved_by: "Quill"
```

### 5. A/B Test Version Management
**Para testes:**
- Original: `LP-pricing-v2.0-LIVE` (Control)
- Variante: `LP-pricing-v2.0-TEST-A` (Challenger)
- Winner: `LP-pricing-v2.0-TEST-A` → promovido a `v3.0-LIVE`

**Regra:** Nunca deletar variante perdedora — marcar como ARCHIVED com resultado.

### 6. Backup e Recovery
- Todas as versoes APPROVED sao preservadas
- Nenhuma versao LIVE e sobrescrita sem APPROVED da nova
- Rollback possivel para ultima versao APPROVED
- Historico de mudancas acessivel a todo o squad

## Saida
- Naming convention documentada
- Version control rules
- Status lifecycle definido
- Change log template
- A/B test version management
- Backup/recovery process

## Validacao
- [ ] Naming convention clara e adotada
- [ ] Version control rules definidas
- [ ] Status lifecycle documentado
- [ ] Change log mantido para cada versao
- [ ] A/B test versions gerenciadas
- [ ] Backup de versoes APPROVED garantido
- [ ] Toda a equipe treinada no processo

---

*Task operada por: copy-editor (Chisel)*
