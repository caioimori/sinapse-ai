---
task: conduct-copy-audit
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

# Task: Conduct Copy Audit

## Metadata
- **Squad:** squad-copy
- **Agent:** copy-editor
- **Complexity:** STANDARD
- **Depends on:** live copy assets across channels
- **Feeds:** copy-strategist, all writers, brand-system

## Objetivo
Spot-check live copy quality across channels on a quarterly basis, scoring each asset and routing remediation to the appropriate owner.

## Entrada
- Access to all live copy assets (site, emails, ads, social, sales materials)
- Brand voice guidelines
- Performance data (if available)

## Passos

### 1. Random Sampling
- Select 10-20% of active assets per channel per quarter
- Channels: website, email, ads (Google + social), social organic, sales collateral, content (blog, whitepapers)
- Document sampling method and selection criteria for reproducibility

### 2. Scoring Rubric

| Criterio | Score 1-5 | Description |
|----------|:---------:|-------------|
| Clarity | | Mensagem clara em 3 segundos? Core message instantly understandable? |
| Persuasion | | Persuasion architecture present? Triggers mapped and effective? |
| Brand Voice | | Soa como a marca? Tone, vocabulary, personality consistent? |
| Accuracy | | All claims factually correct? Data current? Links working? |

**Aggregate Score:** Average of 4 criteria per asset.

### 3. Issue Classification
- **Critical:** Factual error, legal risk, broken functionality, misleading claims — fix within 24h
- **Major:** Off-brand voice, unclear messaging, missing CTA, outdated information — fix within 1 week
- **Minor:** Style inconsistency, suboptimal word choice, formatting issues — fix within 1 sprint

### 4. Remediation Workflow
For each issue found:
1. Log issue with asset ID, channel, severity, and description
2. Assign owner (writer or editor responsible for that channel)
3. Set deadline based on severity classification
4. Track fix status: Open → In Progress → Fixed → Verified

### 5. Audit Report
- **Summary:** Total assets sampled, average scores by channel, score distribution
- **Trends:** Comparison with previous quarter (if available), improving/declining channels
- **Top Issues:** Most frequent issue types across channels
- **Recommendations:** Process improvements to prevent recurring issues
- **Action Items:** Prioritized list with owners and deadlines

## Saida
- Audit report with scores, trends, and recommendations
- Issue log with remediation assignments
- Channel-by-channel quality heatmap

## Validacao
- [ ] 10-20% of assets per channel sampled
- [ ] All sampled assets scored on 4 criteria
- [ ] Issues classified by severity (critical/major/minor)
- [ ] Each issue assigned an owner and deadline
- [ ] Audit report generated with trends and recommendations

---

*Task operada por: copy-editor*
