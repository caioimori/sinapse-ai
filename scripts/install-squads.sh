#!/bin/bash
# ══════════════════════════════════════════════════════════════════════════════
# Sinapse Installer
# ══════════════════════════════════════════════════════════════════════════════
# Uso: Rode este script na raiz de qualquer projeto que use Claude Code
#
# Funciona com:
#   - Projetos com framework existente
#   - Qualquer projeto com Claude Code (com .claude/)
#   - Projetos sem nenhum dos dois (cria .claude/ automaticamente)
#
# O que faz:
#   - Cria symlinks de ./squads/{squad-name} -> sinapse/{squad-name}
#   - Gera/regenera regra de squad awareness (.claude/rules/squad-awareness.md)
#   - Gera command files para invocar agentes (/{prefix}:agents:{agent-id})
#   - Nao duplica arquivos — single source of truth em sinapse/
#   - Seguro para rodar multiplas vezes (idempotente)
# ══════════════════════════════════════════════════════════════════════════════

set -e

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# ══════════════════════════════════════════════════════════════════════════════
# Resolver diretorio global de squads (compativel com Windows + Linux + macOS)
# ══════════════════════════════════════════════════════════════════════════════

# O script sabe que esta dentro do diretorio sinapse
# SCRIPT_DIR can be passed via env (from CLI) or detected via BASH_SOURCE
if [ -z "$SCRIPT_DIR" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi
GLOBAL_SQUADS_DIR="$SCRIPT_DIR"

LOCAL_SQUADS_DIR="./squads"

echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Sinapse Installer${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo ""

# Garantir que .claude/rules/ existe
if [ ! -d ".claude" ]; then
  echo -e "${YELLOW}Diretorio .claude/ nao encontrado — criando...${NC}"
  mkdir -p ".claude/rules"
  mkdir -p ".claude/commands"
  echo -e "  ${GREEN}OK${NC} .claude/ criado"
else
  mkdir -p ".claude/rules"
  mkdir -p ".claude/commands"
fi

# Verificar que o diretorio global existe e contem squads
if [ ! -d "$GLOBAL_SQUADS_DIR" ]; then
  echo -e "${RED}ERRO: Diretorio global de squads nao encontrado: $GLOBAL_SQUADS_DIR${NC}"
  exit 1
fi

# Criar diretorio local de squads se nao existir
mkdir -p "$LOCAL_SQUADS_DIR"

echo -e "${YELLOW}Fonte:${NC}  $GLOBAL_SQUADS_DIR"
echo -e "${YELLOW}Destino:${NC} $LOCAL_SQUADS_DIR"
echo ""

# ══════════════════════════════════════════════════════════════════════════════
# Fase 1: Criar symlinks para cada squad
# ══════════════════════════════════════════════════════════════════════════════

SQUAD_COUNT=0
LINKED_COUNT=0
SKIPPED_COUNT=0

for squad_dir in "$GLOBAL_SQUADS_DIR"/squad-*/; do
  [ ! -d "$squad_dir" ] && continue

  squad_name=$(basename "$squad_dir")
  [[ "$squad_name" == *".deprecated"* ]] && continue
  SQUAD_COUNT=$((SQUAD_COUNT + 1))
  target="$LOCAL_SQUADS_DIR/$squad_name"

  # Se ja existe como symlink, verificar se aponta pro lugar certo
  if [ -L "$target" ]; then
    existing_target=$(readlink "$target")
    if [ "$existing_target" = "$squad_dir" ] || [ "$existing_target" = "${squad_dir%/}" ]; then
      echo -e "  ${YELLOW}SKIP${NC} $squad_name (symlink ja existe)"
      SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
      continue
    else
      echo -e "  ${YELLOW}UPDATE${NC} $squad_name (atualizando symlink)"
      rm "$target"
    fi
  fi

  # Se existe como diretorio real, avisar e pular
  if [ -d "$target" ] && [ ! -L "$target" ]; then
    echo -e "  ${RED}WARN${NC} $squad_name (diretorio real ja existe, pulando)"
    SKIPPED_COUNT=$((SKIPPED_COUNT + 1))
    continue
  fi

  # Criar symlink
  # No Windows (Git Bash/MSYS), usar cmd mklink para symlinks de diretorio
  if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "mingw"* ]] || [[ "$OSTYPE" == "cygwin" ]]; then
    # Windows: converter paths para formato Windows
    win_target=$(cygpath -w "$squad_dir" 2>/dev/null || echo "$squad_dir")
    win_link=$(cygpath -w "$target" 2>/dev/null || echo "$target")
    cmd //c "mklink /D \"$win_link\" \"$win_target\"" > /dev/null 2>&1 || ln -s "$squad_dir" "$target"
  else
    ln -s "$squad_dir" "$target"
  fi

  echo -e "  ${GREEN}LINK${NC} $squad_name -> $squad_dir"
  LINKED_COUNT=$((LINKED_COUNT + 1))
done

echo ""
echo -e "${GREEN}Resultado:${NC} $LINKED_COUNT linked | $SKIPPED_COUNT skipped | $SQUAD_COUNT total squads"

# ══════════════════════════════════════════════════════════════════════════════
# Fase 2: Gerar/regenerar squad-awareness.md (SEMPRE regenera para capturar novas squads)
# ══════════════════════════════════════════════════════════════════════════════

RULES_DIR=".claude/rules"
SQUAD_RULE_FILE="$RULES_DIR/squad-awareness.md"

if [ -d "$RULES_DIR" ]; then
  echo ""

  if [ -f "$SQUAD_RULE_FILE" ]; then
    echo -e "${BLUE}Regenerando squad-awareness.md (capturando novas squads)...${NC}"
  else
    echo -e "${BLUE}Criando squad-awareness.md...${NC}"
  fi

  # ── Construir tabela de squads dinamicamente ──
  SQUAD_TABLE=""

  for squad_dir in "$GLOBAL_SQUADS_DIR"/squad-*/; do
    [ ! -d "$squad_dir" ] && continue
    squad_name=$(basename "$squad_dir")
  [[ "$squad_name" == *".deprecated"* ]] && continue
    manifest="$squad_dir/squad.yaml"

    if [ -f "$manifest" ]; then
      # Contar agentes e tasks
      agent_count=$(ls "$squad_dir/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
      task_count=$(ls "$squad_dir/tasks/"*.md 2>/dev/null | wc -l | tr -d ' ')
      kb_count=$(ls "$squad_dir/knowledge-base/"*.md 2>/dev/null | wc -l | tr -d ' ')
      workflow_count=$(ls "$squad_dir/workflows/"*.yaml 2>/dev/null | wc -l | tr -d ' ')

      SQUAD_TABLE="${SQUAD_TABLE}| \`${squad_name}\` | ${agent_count} agents, ${task_count} tasks, ${kb_count} KBs, ${workflow_count} workflows |\n"
    fi
  done

  # ── Escrever o arquivo completo ──
  cat > "$SQUAD_RULE_FILE" << 'HEADER_EOF'
---
paths: **/*
---

# Sinapse — Orchestration Rules

> **CRITICAL:** This project has specialized AI agent squads installed. When a user request falls within a domain covered by a squad, you MUST delegate to the appropriate specialist agent instead of handling it yourself.

## Delegation Rule

When a user request matches a squad domain (see table below):
1. **Acknowledge** the domain is covered by a specialized squad
2. **Recommend** activating the squad's orchestrator or specialist agent
3. **Provide** the invocation command (e.g., `/ca:agents:ca-orchestrator`)
4. **Do NOT** handle the request yourself if a dedicated agent exists

**Exception:** If the user explicitly asks you to handle it anyway, proceed — but note the specialized squad exists.

## Squads Instaladas

| Squad | Capacidade |
|-------|-----------|
HEADER_EOF

  echo -e "$SQUAD_TABLE" >> "$SQUAD_RULE_FILE"

  cat >> "$SQUAD_RULE_FILE" << 'MID_EOF'

## Mapa de Delegacao por Dominio

| Dominio | Squad | Agente Lead | Invocacao |
|---------|-------|-------------|-----------|
| Branding e identidade visual | squad-brand | brand-orchestrator (Meridian) | `/brand:agents:brand-orchestrator` |
| Vendas e estrategia comercial | squad-commercial | cs-orchestrator (Pipeline) | `/commercial:agents:cs-orchestrator` |
| Conteudo e editorial | squad-content | content-orchestrator | `/content:agents:content-orchestrator` |
| Copywriting e persuasao | squad-copy | copy-strategist (Quill) | `/copywriting:agents:copy-strategist` |
| Animacoes web, Three.js, shaders, motion | squad-animations | ca-orchestrator (Kinetic) | `/ca:agents:ca-orchestrator` |
| UX/UI e experiencia digital | squad-design | dx-orchestrator (Nexus) | `/digital-experience:agents:dx-orchestrator` |
| Inteligencia financeira e pricing | squad-finance | fi-orchestrator (Ledger) | `/finance:agents:fi-orchestrator` |
| Growth organico, SEO e analytics | squad-growth | ga-orchestrator (Catalyst) | `/growth:agents:ga-orchestrator` |
| Midia paga (Meta Ads, Google Ads, CRO) | squad-paidmedia | pm-orchestrator (Apex) | `/pm:agents:pm-orchestrator` |
| Produto e discovery | squad-product | ps-orchestrator (Vector) | `/product:agents:ps-orchestrator` |
| Pesquisa e inteligencia competitiva | squad-research | research-orchestrator (Prism) | `/research:agents:research-orchestrator` |
| Claude Code mastery e automacao | squad-claude | cm-orchestrator (Orion) | `/claude:agents:cm-orchestrator` |
| Conselho estrategico e modelos mentais | squad-council | council-orchestrator (Zenith) | `/council:agents:council-orchestrator` |
| Narrativa, storytelling e pitch | squad-storytelling | narrative-orchestrator (Arc) | `/narrative:agents:narrative-orchestrator` |
| Seguranca cibernetica e compliance | squad-cybersecurity | cyber-orchestrator (Fortress) | `/cyber:agents:cyber-orchestrator` |
MID_EOF

  cat >> "$SQUAD_RULE_FILE" << 'FOOTER_EOF'

## Quando Delegar

| Situacao | Squad |
|----------|-------|
| Animacao/motion/Three.js/shader | squad-animations |
| Copy/headline/persuasao | squad-copy |
| Branding/identidade/logo | squad-brand |
| Pesquisa/benchmark/analise competitiva | squad-research |
| Conteudo/editorial/blog/social media | squad-content |
| UX/UI/design system/wireframe | squad-design |
| Growth/SEO/analytics/metricas organicas | squad-growth |
| Vendas/proposta/pitch/CRM | squad-commercial |
| Financeiro/pricing/P&L/budget | squad-finance |
| Midia paga/Meta Ads/Google Ads/CRO | squad-paidmedia |
| Produto/discovery/roadmap | squad-product |
| Claude Code/prompt engineering/MCP | squad-claude |
| Conselho estrategico/modelos mentais/decisao | squad-council |
| Storytelling/narrativa/pitch/apresentacao | squad-storytelling |
| Seguranca/pentest/compliance/incident response | squad-cybersecurity |

## Handoff Protocol

1. **Identificar** o dominio do pedido
2. **Informar** qual squad cobre e como invocar: `/{prefix}:agents:{agent-id}`
3. **Fornecer contexto** do handoff se necessario
4. Squads sao **autonomas** — o orchestrator coordena internamente
5. Squads possuem **knowledge bases**, **tasks** e **workflows** proprios em `./squads/{squad-name}/`
FOOTER_EOF

  echo -e "  ${GREEN}OK${NC} squad-awareness.md gerado com $SQUAD_COUNT squads"
fi

# ══════════════════════════════════════════════════════════════════════════════
# Fase 3: Gerar command files para cada agente de cada squad
# ══════════════════════════════════════════════════════════════════════════════
# Formato: .claude/commands/{slashPrefix}/agents/{agent-id}.md
# Invocacao: /{slashPrefix}:agents:{agent-id}  (ex: /ca:agents:ca-orchestrator)
# ══════════════════════════════════════════════════════════════════════════════

COMMANDS_DIR=".claude/commands"
CMD_COUNT=0

if [ -d ".claude" ]; then
  echo ""
  echo -e "${BLUE}Gerando command files para agentes das squads...${NC}"

  for squad_dir in "$GLOBAL_SQUADS_DIR"/squad-*/; do
    [ ! -d "$squad_dir" ] && continue
    squad_name=$(basename "$squad_dir")
  [[ "$squad_name" == *".deprecated"* ]] && continue
    manifest="$squad_dir/squad.yaml"

    [ ! -f "$manifest" ] && continue

    # Extrair slashPrefix do squad.yaml
    slash_prefix=$(grep "^slashPrefix:" "$manifest" | head -1 | sed 's/^slashPrefix: *//' | tr -d '"' | tr -d "'" | tr -d ' ')

    # Se nao tem slashPrefix, gerar um a partir do squad name (ex: squad-brand -> bs)
    if [ -z "$slash_prefix" ]; then
      # Pegar iniciais: squad-brand -> bs, squad-animations -> ca
      slash_prefix=$(echo "$squad_name" | sed 's/^squad-//' | sed 's/-\([a-z]\)/\U\1/g' | sed 's/\([A-Z]\)/\L\1/g' | cut -c1-2)
    fi

    # Criar diretorio de commands para esta squad
    squad_cmd_dir="$COMMANDS_DIR/$slash_prefix/agents"
    mkdir -p "$squad_cmd_dir"

    # Caminho relativo da squad no projeto
    squad_local_path="./squads/$squad_name"

    # Para cada agente da squad
    for agent_file in "$squad_dir/agents/"*.md; do
      [ ! -f "$agent_file" ] && continue

      agent_filename=$(basename "$agent_file")
      agent_id="${agent_filename%.md}"

      # Extrair info basica do agente
      agent_name=$(grep -m1 "Nome:\|name:" "$agent_file" | head -1 | sed 's/.*: *//' | sed 's/\*//g')
      agent_icon=$(grep -m1 "Icon:\|icon:" "$agent_file" | head -1 | sed 's/.*: *//' | sed 's/\*//g')
      agent_role=$(grep -m1 "Role\|role:" "$agent_file" | head -1 | sed 's/.*: *//' | sed 's/^## //' | sed 's/\*//g')

      # Caminho do agente relativo ao projeto
      agent_local_path="$squad_local_path/agents/$agent_filename"

      # Gerar command file
      cmd_file="$squad_cmd_dir/$agent_id.md"
      cat > "$cmd_file" << CMDEOF
# $agent_id

ACTIVATION-NOTICE: This command activates an agent from $squad_name. Read the full agent definition below to adopt the persona.

CRITICAL: Read the agent definition file at \`$agent_local_path\` to understand your full operating parameters. Then:
1. Adopt the persona defined in that file (name: $agent_name, icon: $agent_icon)
2. Load the squad manifest at \`$squad_local_path/squad.yaml\` for context about available agents, tasks, workflows and knowledge bases
3. Display a greeting showing your agent name, role, and available commands
4. HALT and await user input

## Agent Reference
- **Agent ID:** $agent_id
- **Agent Name:** $agent_name
- **Icon:** $agent_icon
- **Squad:** $squad_name
- **Definition:** \`$agent_local_path\`
- **Squad Manifest:** \`$squad_local_path/squad.yaml\`
- **Tasks:** \`$squad_local_path/tasks/\`
- **Knowledge Bases:** \`$squad_local_path/knowledge-base/\`
- **Workflows:** \`$squad_local_path/workflows/\`
- **Checklists:** \`$squad_local_path/checklists/\`
- **Templates:** \`$squad_local_path/templates/\`

## Activation Instructions
1. Read the full agent definition: \`$agent_local_path\`
2. Adopt the persona (name, icon, communication style, principles)
3. Show greeting: "{icon} {name} — {role} ativado"
4. Show: "Squad: $squad_name | Invoke: /$slash_prefix:agents:$agent_id"
5. List your key tasks from the agent definition
6. HALT and await user input

## How to Execute Tasks
When the user requests a task:
1. Find the matching task in \`$squad_local_path/tasks/\`
2. Read the task file completely (inputs, outputs, checklist)
3. Execute following the task checklist step by step
4. Consult knowledge bases in \`$squad_local_path/knowledge-base/\` as needed
5. Follow the workflow if the task is part of one in \`$squad_local_path/workflows/\`

## Cross-Squad Handoff
If the task requires expertise outside this squad:
1. Identify which squad covers the needed domain (check squad-awareness.md)
2. Recommend the user activate the appropriate squad agent
3. Provide handoff context: decisions made, files modified, next action needed
CMDEOF

      CMD_COUNT=$((CMD_COUNT + 1))
    done

    echo -e "  ${GREEN}OK${NC} /$slash_prefix:agents/ — $(ls "$squad_dir/agents/"*.md 2>/dev/null | wc -l | tr -d ' ') agents"
  done

  echo ""
  echo -e "${GREEN}Resultado:${NC} $CMD_COUNT command files gerados"
fi

echo ""
echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Instalacao concluida!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "Suas squads estao disponíveis em ${BLUE}./squads/${NC}"
echo -e "Claude Code conhece todas as squads via ${BLUE}.claude/rules/squad-awareness.md${NC}"
echo -e "Agentes invocaveis via ${BLUE}/${NC}{prefix}${BLUE}:agents:${NC}{agent-id}"
echo ""
echo -e "${YELLOW}Squads registradas:${NC}"
for squad_dir in "$GLOBAL_SQUADS_DIR"/squad-*/; do
  [ ! -d "$squad_dir" ] && continue
  squad_name=$(basename "$squad_dir")
  [[ "$squad_name" == *".deprecated"* ]] && continue
  manifest="$squad_dir/squad.yaml"
  [ ! -f "$manifest" ] && continue
  sp=$(grep "^slashPrefix:" "$manifest" | head -1 | sed 's/^slashPrefix: *//' | tr -d '"' | tr -d "'" | tr -d ' ')
  [ -z "$sp" ] && sp=$(echo "$squad_name" | sed 's/^squad-//' | cut -c1-2)
  agent_count=$(ls "$squad_dir/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
  echo -e "  /${BLUE}${sp}${NC}:agents:* — $squad_name ($agent_count agents)"
done
echo ""
echo -e "${YELLOW}Dica:${NC} Rode este script novamente quando adicionar novas squads ao sinapse"
