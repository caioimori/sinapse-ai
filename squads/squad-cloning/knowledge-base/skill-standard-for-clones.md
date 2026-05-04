# SKILL.md Standard para Clones — Exportacao Universal

> Como exportar clones cognitivos no formato Agent Skills (SKILL.md),
> compativel com 33+ plataformas: Claude Code, Codex, Gemini CLI, Cursor,
> VS Code, GitHub Copilot e outros.
> Baseado em: research 07-skills-agents-swarm, spec agentskills.io.

---

## Por Que SKILL.md Para Clones

O formato Agent Skills (SKILL.md) e o padrao de facto universal em 2026:
- 33 plataformas suportam o formato
- 1.060+ skills catalogadas no ecossistema
- Compatibilidade cross-platform sem modificacao
- Especificacao publica em agentskills.io (Anthropic)

Exportar clones como SKILL.md permite que o conhecimento cognitivo seja
acessado em qualquer ferramenta de IA que o usuario ja usa — sem precisar
"ativar o squad" explicitamente.

---

## Estrutura de Pasta para Clone-Skill

```
clones/{source-mind-kebab}/
  SKILL.md              # OBRIGATORIO: metadata + instrucoes compactas
  scripts/              # Opcional: scripts de suporte
  references/
    heuristics.md       # Lista completa de heuristics (L2)
    workflows.md        # Workflows detalhados (L3)
    kb/                 # Knowledge bases completos
      {topic-1}.md
      {topic-2}.md
  assets/
    templates/          # Templates de output usados pelo clone
```

**Regra fundamental:** O nome da pasta DEVE coincidir com o campo `name` no frontmatter.

---

## Frontmatter Obrigatorio

```yaml
---
name: clone-{source-mind-kebab}
description: >
  Cognitive clone of {Nome}, expert in {dominios}. Responds as {nome} would,
  using their documented heuristics, mental models and communication style.
  Confidence: {X}% (Tier {1|2|3}). Use when you need {nome}'s perspective on
  {area 1}, {area 2}, {area 3}. Trigger: "como {nome} pensaria sobre",
  "o que {nome} faria", "analise como {nome}".
license: UNLICENSED
compatibility: Works standalone. Full features require SINAPSE squad-cloning context.
metadata:
  source_mind: "{Nome Completo}"
  clone_tier: "{1|2|3}"
  confidence_score: "{X}%"
  fidelity_score: "{X}%"
  squad: "squad-cloning"
  primary_domains: "{dominio1}, {dominio2}, {dominio3}"
  sinapse_version: "5.x"
  last_updated: "{YYYY-MM-DD}"
allowed-tools: Read
---
```

### Campo `description` — Regras Criticas

1. **Ser pushy:** A Anthropic recomenda descriptions "pushy" para combater under-triggering.
   Incluir keywords explicitas que o usuario pode mencionar.
2. **Mencionar confidence score:** Transparencia sobre a qualidade do clone.
3. **Listar triggers:** Frases especificas que devem ativar o clone.
4. **Listar dominios:** Areas de expertise documentadas.

**Exemplo real:**
```yaml
description: >
  Cognitive clone of Alex Hormozi, expert in offer creation, business acquisition,
  and scaling service businesses. Confidence: 88% (Tier 3). Use when you need
  Alex's perspective on pricing, offers, lead generation, or business growth.
  Trigger phrases: "como Hormozi pensaria", "o que o Hormozi faria aqui",
  "analise como Alex Hormozi", "perspectiva do Hormozi".
```

---

## Corpo do SKILL.md — Template

O corpo deve seguir Progressive Disclosure de 3 niveis:

```markdown
# Clone: {Nome} ({Tier})

> Confidence: {X}% | Tier {N} | Dominios: {lista}
> Baseado em: {N} fontes, {N}K palavras processadas

## Identity

{Core axiom em 1-2 frases. A essencia mais fundamental de como esta pessoa pensa.}

**Principios fundamentais:**
1. {Principio 1 — de L1, [DIRETO|INFERIDO]}
2. {Principio 2}
3. {Principio 3}
4. {Principio 4}
5. {Principio 5}

## Como Esta Pessoa Responde

**Tom:** {Descricao concisa do tom — direto/analitico/empático, formal/informal, etc.}

**Abertura tipica:** "{Exemplo de como começa uma resposta}"

**Vocabulario recorrente:** {lista de 8-10 palavras/expressoes caracteristicas}

## Heuristics Principais (Top 5)

1. **{Trigger 1}** → {Acao documentada} [DIRETO|INFERIDO]
2. **{Trigger 2}** → {Acao} [DIRETO|INFERIDO]
3. **{Trigger 3}** → {Acao} [DIRETO|INFERIDO]
4. **{Trigger 4}** → {Acao} [DIRETO|INFERIDO]
5. **{Trigger 5}** → {Acao} [DIRETO|INFERIDO]

Para lista completa de heuristics: `references/heuristics.md`

## Limites e Boundaries

**Nao opinar sobre:**
- {Area fora do dominio documentado}
- {Topico que o original evita}

**Sempre contextualizar:** "Baseado no que {nome} documentou/ensinou..."

**Recusar criar conteudo que:**
- Contradiz os valores documentados do original
- Exige conhecimento nao presente nas fontes ({N} fontes, ate {data})

## Como Usar Este Clone

**Ativar com:** "Responda como {nome}", "O que {nome} faria?", "Perspectiva do {nome}"

**Funciona melhor para:**
- {Caso de uso 1}
- {Caso de uso 2}
- {Caso de uso 3}

**Nao usar para:**
- {Caso fora do dominio}
- {Area de incerteza documentada}

## Referencias

- [Heuristics completas](references/heuristics.md) ({N} heuristics documentadas)
- [Workflows](references/workflows.md) ({N} workflows)
- [Knowledge Bases](references/kb/) ({N} KBs tematicos)
```

---

## Progressive Disclosure por Nivel

| Nivel | O que carrega | Quando | Tamanho |
|-------|--------------|--------|---------|
| 1 | name + description (frontmatter) | Startup — listagem | ~100 tokens |
| 2 | Body do SKILL.md (Identity + Top heuristics) | Clone invocado | <3.000 tokens |
| 3 | references/ (KBs completos, heuristics all) | Tarefa especifica | Ilimitado |

**Regra critica:** SKILL.md deve ficar abaixo de 300 linhas.
Todo material de referencia detalhado vai para references/.

---

## Qualidade de Skill por Tier de Clone

### Tier 1 — SKILL.md Minimo
- Frontmatter completo com confidence score
- Identity block compacto (core axiom + 3 principios)
- Top 3 heuristics
- Boundaries claros
- Referencias para KBs (mesmo que simples)

### Tier 2 — SKILL.md Consultant
- Frontmatter completo
- Identity completo (core axiom + 5-6 principios)
- Top 5 heuristics com trigger/action/rationale
- Communication style detalhado
- Failure modes completos
- references/heuristics.md com lista completa
- references/kb/ com KBs tematicos

### Tier 3 — SKILL.md Full Clone
- Tudo do Tier 2
- Workflows ativos em references/workflows.md
- Templates de output em assets/templates/
- references/kb/ com 8+ KBs tematicos
- Decision trees para cenarios complexos
- Exemplos concretos de input/output esperado

---

## Anti-patterns de Clone-Skills

| Anti-pattern | Problema | Correcao |
|-------------|---------|---------|
| SKILL.md > 500 linhas | Polui o contexto, atrasa carga | Mover para references/ |
| Description vaga ("AI assistant for X") | Nao e ativada pelo LLM | Ser explicito e pushy |
| Sem confidence score no frontmatter | Usuario nao sabe qualidade | Sempre incluir |
| Sem failure modes | Clone responde fora do dominio | Adicionar secao de limites |
| Heuristics sem tag [DIRETO|INFERIDO|HIPOTESE] | Viola principio de honestidade | Taguear todas |
| Clone soa como pessoa mas nao decide como ela | Fidelidade cognitiva baixa | Validar com fidelity test |

---

## Deploy para Marketplace

### Via Claude Code Plugin
```bash
# No diretorio raiz do clone
# Criar marketplace.json
{
  "name": "sinapse-clones",
  "plugins": [
    {
      "name": "clone-{source-mind}",
      "description": "Cognitive clone: {Nome}",
      "source": "./",
      "skills": ["./clones/{source-mind-kebab}"]
    }
  ]
}

# Instalar
/plugin marketplace add sinapse-ai/clones
/plugin install clone-{source-mind}@sinapse-clones
```

### Via Instalacao Manual (cross-platform)
```bash
# Copiar para skills do projeto
cp -r clones/{source-mind-kebab} .claude/skills/

# Ou para skills globais
cp -r clones/{source-mind-kebab} ~/.claude/skills/
```

### Compatibilidade Cross-Platform

| Plataforma | Localizacao | Comando |
|-----------|------------|---------|
| Claude Code | `.claude/skills/` ou `~/.claude/skills/` | `/plugin install` |
| Gemini CLI | `.gemini/skills/` | Configuracao manual |
| Cursor | `.cursor/skills/` | Settings > Skills |
| VS Code Copilot | `.github/skills/` | Configuracao manual |

---

Ver tambem: `agent-generation-guide.md` — como gerar o agent.md base.
Ver tambem: `clone-quality-assurance.md` — validar antes de exportar como SKILL.md.
Ver tambem: `cross-squad-deployment.md` — deploy para squads vs skill export.
