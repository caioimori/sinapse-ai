---
task: conduct-culture-audit
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

# Task: Conduct Brand Culture Audit

> Auditar alinhamento entre cultura organizacional e marca prometida.

---

## Metadata

| Campo | Valor |
|-------|-------|
| **Agent** | brand-culture-architect (Ethos) |
| **Trigger** | Início do projeto OU diagnóstico de marca |
| **Input** | Briefing, valores declarados, dados culturais disponíveis |
| **Output** | `brand-culture-audit.md` |
| **Handoff** | → brand-strategist (Athena) para integração na estratégia |

---

## Steps

### Step 1: Mapear Cultura Declarada
```yaml
elicit: true
format: questionnaire
```

**Perguntas ao cliente:**
1. Quais são os valores oficiais da empresa?
2. Como esses valores aparecem no dia a dia? (exemplos concretos)
3. Que rituais a empresa tem? (reuniões, celebrações, onboarding)
4. Como é o ambiente de trabalho? (dress code, espaço, ferramentas)
5. Qual história de fundação é contada?
6. Quem são os "heróis" da empresa? (pessoas celebradas como exemplo)
7. Como a empresa lida com erros?
8. Como novos funcionários são recebidos?
9. Como a empresa se posiciona publicamente sobre temas sociais?
10. Os funcionários recomendariam a empresa como lugar para trabalhar?

### Step 2: Mapear Cultura Praticada
Identificar gaps entre declarado e praticado:

| Valor Declarado | Comportamento Esperado | Comportamento Real | Gap (0-5) |
|----------------|----------------------|-------------------|-----------|
| {valor 1} | {esperado} | {observado} | |
| {valor 2} | {esperado} | {observado} | |
| {valor 3} | {esperado} | {observado} | |

Gap Scale: 0 = perfeitamente alinhado, 5 = completamente desalinhado

### Step 3: Avaliar Employee Brand Alignment
| Nível | Descrição | % Estimado | Status |
|-------|-----------|-----------|--------|
| 4: Advocate | Promove a marca ativamente | | |
| 3: Embody | Vive os valores naturalmente | | |
| 2: Understand | Sabe o que a marca representa | | |
| 1: Aware | Conhece logo e tagline | | |
| 0: Disconnected | Não sabe/não se importa | | |

**Target:** ≥60% no nível 3+ para cultura saudável

### Step 4: Purpose Authenticity Test
| Critério | Score (0-5) | Evidência |
|----------|-----------|-----------|
| Original (nasceu da história real?) | | |
| Consistente (praticado em decisões?) | | |
| Mensurável (há métricas de impacto?) | | |
| Sacrificial (empresa abre mão de algo?) | | |
| Sustentável (verdade daqui a 10 anos?) | | |
| **Total** | **/25** | |

- ≥20: Propósito autêntico
- 15-19: Em construção
- 10-14: Superficial (risk de purpose-washing)
- <10: Inexistente ou falso

### Step 5: Mapear Rituais Existentes
| Ritual | Tipo | Frequência | Alinhado à Marca? | Impacto Cultural |
|--------|------|-----------|-------------------|-----------------|
| | Interno/Externo | | Sim/Não/Parcial | Alto/Médio/Baixo |

### Step 6: Identificar Gaps e Oportunidades
| Área | Gap Identificado | Impacto | Ação Recomendada | Prioridade |
|------|-----------------|---------|-------------------|-----------|
| Valores | | | | |
| Rituais | | | | |
| Comunicação interna | | | | |
| Onboarding | | | | |
| Experiência do cliente | | | | |

### Step 7: Handoff
```yaml
handoff:
  to: brand-strategist (Athena)
  artifact: brand-culture-audit.md
  context: "Auditoria cultural com gaps, scores e recomendações de alinhamento"
  next: "Integrar insights culturais na estratégia de marca"
```
