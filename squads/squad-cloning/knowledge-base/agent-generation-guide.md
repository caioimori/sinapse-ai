# Agent Generation Guide — De Perfil Cognitivo a Agent.md

> Como mapear um cognitive-profile.md para um agent.md de alta fidelidade
> seguindo SQUAD-CREATION-STANDARDS.

---

## Mapeamento Layer → Agent Section

| Cognitive Layer | Agent Section | Como mapear |
|----------------|--------------|------------|
| L1: Mental Models | `core_principles` | Top 5-6 models mais fortes viram principios |
| L2: Heuristics | `heuristics` | Cada heuristic vira trigger/action/rationale |
| L3: Workflows | `protocols` | Cada workflow vira protocol com steps |
| L4: Communication | `persona_profile` | Tom, greeting, signature, vocabulario |
| L5: Meta-patterns | `identity` | Core axiom define a identidade do agente |

---

## Passo a Passo

### 1. Persona Profile (de Layer 4)
```yaml
persona_profile:
  archetype: # Inferido da identidade (Strategist, Builder, Analyst, etc)
  real_person: true
  source_mind: "Nome da pessoa original"
  clone_tier: # 2 ou 3
  confidence_score: # Percentual
  communication:
    tone: # Extraido de Layer 4 (direto, informal, tecnico, etc)
    greeting_levels:
      minimal: "{icon} {agent-id} ready"
      named: "{icon} {Nome} ready — {catchphrase}"
      archetypal: "{icon} {Nome} — {tagline baseada em core axiom}"
    signature_closing: "— {Nome}, {action} {icon}"
```

### 2. Core Principles (de Layer 1)
Selecionar os 5-6 mental models mais fortes (recorrentes, alta confianca).
Cada um vira uma string concisa que captura a essencia do model.

**Criterio de selecao:**
- [DIRETO] ou [INFERIDO] apenas (nunca [HIPOTESE] como principio)
- Aparece em 3+ fontes
- E actionable (guia decisoes)

### 3. Heuristics (de Layer 2)
Converter cada heuristic extraida para o formato:
```yaml
- trigger: "Situacao que ativa a regra"
  action: >
    O que fazer (nas palavras/estilo da pessoa)
  rationale: "Por que (citacao ou inferencia da pessoa)"
```

**Regras:**
- Min 5 heuristics para Tier 2, 10 para Tier 3
- Rationale deve ser da pessoa, nao generico
- Se [HIPOTESE]: adicionar comentario `# [HIPOTESE]`

### 4. Protocols (de Layer 3)
Converter cada workflow extraido para:
```yaml
- name: "nome-do-processo"
  steps:
    - "Step 1: ..."
    - "Step 2: ..."
```

### 5. Commands
Derivar de capabilities do agente:
- Cada workflow principal vira um `*command`
- Adicionar `*help` e `*status` sempre
- Naming: verbos de acao (`*analyze`, `*create`, `*review`)

### 6. Identity (de Layer 5)
Core axiom + meta-patterns definem a `identity`:
```yaml
identity: >
  Descricao que captura a essencia de como essa pessoa pensa
  e opera. Baseado no core axiom e meta-patterns identificados.
```

---

## Quality Checklist

- [ ] `real_person: true` e `source_mind` preenchidos
- [ ] `clone_tier` e `confidence_score` corretos
- [ ] `core_principles` tem 5-6 itens de alta confianca
- [ ] `heuristics` tem min 5 (Tier 2) ou 10 (Tier 3)
- [ ] Cada heuristic tem trigger + action + rationale
- [ ] `protocols` refletem workflows reais da pessoa
- [ ] `communication.tone` reflete Layer 4
- [ ] Nenhum principio ou heuristic e generico/inventado
- [ ] Cross-squad handoffs definidos
- [ ] Formato segue SQUAD-CREATION-STANDARDS

---

## Exportacao para SKILL.md (Padrao Universal)

Clones gerados podem ser exportados para o formato Agent Skills (SKILL.md),
compativel com 33+ plataformas (Claude Code, Codex, Gemini CLI, Cursor, VS Code...).

### Mapeamento agent.md → SKILL.md

```yaml
---
name: clone-{source-mind-kebab}
description: >
  Cognitive clone of {Nome Completo}, expert in {dominios principals}.
  Use when you need {nome}'s perspective on {area 1}, {area 2}, {area 3}.
  Activate with phrases like: "O que {nome} diria sobre...", "analise como {nome}"
license: UNLICENSED
compatibility: Works standalone. Full features require SINAPSE squad-cloning context.
metadata:
  source_mind: "{Nome}"
  clone_tier: "{1|2|3}"
  confidence_score: "{X}%"
  squad: "squad-cloning"
  sinapse_version: "5.x"
---

# Clone: {Nome}

## Identity
{identity do agent.md, compactado}

## Core Principles
{core_principles como lista imperativa}

## Key Heuristics
{top 5 heuristics mais fortes}

## Communication Style
{persona_profile.communication compactado}

## When to Use
- Analise de [dominio principal]
- Decisoes sobre [area de expertise]
- Perspectiva sobre [topico recorrente]

## When NOT to Use
{failure_modes como lista}

## References
- [Full heuristics list](references/heuristics.md)
- [Workflows](references/workflows.md)
- [Knowledge bases](references/kb/)
```

### Progressive Disclosure para Clones

| Nivel | Conteudo | Quando carrega |
|-------|---------|----------------|
| 1 - Metadata | name + description (trigger) | Sempre (startup) |
| 2 - Identity | Principles + top heuristics + tone | Quando clone e invocado |
| 3 - Deep KB | Workflows completos + KBs detalhados | Sob demanda por tarefa |

---

## Failure Modes no Agent (L6)

O agent.md completo (Tier 3) deve incluir secao de failure modes:

```yaml
failure_modes:
  - domain: "Area que o original nao domina"
    behavior: "Como o agente deve responder"
    confidence: "[DIRETO|INFERIDO]"
  - domain: "Topico controverso que evita"
    behavior: "Redirecionamento ou recusa explicita"
    confidence: "[INFERIDO]"

boundaries:
  - "Nunca dar conselhos medicos/juridicos especificos"
  - "Sempre contextualizar respostas com 'baseado no que [nome] ensinou'"
  - "Declinar criar conteudo que contradiga os valores documentados"
```

**Por que e obrigatorio no Tier 3:** Um clone sem boundaries produz respostas
fora do dominio do original com confianca injustificada. Isso viola o principio
de honestidade cognitiva e pode criar representacoes falsas da pessoa.

---

## O Que NAO Fazer

- **Nao inventar heuristics** que soam boas mas nao foram extraidas
- **Nao generalizar** — manter especificidade do target
- **Nao embelezar** — se a pessoa e direta/crua, o agente tambem e
- **Nao misturar** conhecimento generico com extracoes do target
- **Nao ignorar gaps** — documentar o que falta em vez de preencher
- **Nao omitir failure modes** — gaps sao tao importantes quanto strengths
- **Nao exportar para SKILL.md sem confidence score** documentado no frontmatter
