#!/bin/bash
# ══════════════════════════════════════════════════════════════════════════════
# Sinapse Updater
# ══════════════════════════════════════════════════════════════════════════════
# Uso: Na raiz de qualquer projeto com squads ja instaladas
#
# Basta ter .claude/ e ./squads/
#
# O que faz:
#   - Adiciona symlinks APENAS para squads novas
#   - Remove symlinks de squads deletadas
#   - REGENERA squad-awareness.md e command files
# ══════════════════════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# SCRIPT_DIR can be passed via env (from CLI) or detected via BASH_SOURCE
if [ -z "$SCRIPT_DIR" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
fi
GLOBAL_SQUADS_DIR="$SCRIPT_DIR"
LOCAL_SQUADS_DIR="./squads"

echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Sinapse Updater${NC}"
echo -e "${BLUE}══════════════════════════════════════════════════════════════${NC}"
echo ""

# Garantir que .claude/ existe
if [ ! -d ".claude" ]; then
  echo -e "${YELLOW}.claude/ nao encontrado — criando...${NC}"
  mkdir -p ".claude/rules" ".claude/commands"
fi

# Verificar squads directory
if [ ! -d "$LOCAL_SQUADS_DIR" ]; then
  echo -e "${RED}ERRO: Diretorio ./squads/ nao encontrado. Rode install-squads primeiro.${NC}"
  exit 1
fi

# ══════════════════════════════════════════════════════════════════════════════
# Fase 1: Verificar novas squads e criar symlinks apenas para elas
# ══════════════════════════════════════════════════════════════════════════════

NEW_COUNT=0
EXISTING_COUNT=0
REMOVED_COUNT=0

echo -e "${YELLOW}Verificando squads...${NC}"

for squad_dir in "$GLOBAL_SQUADS_DIR"/squad-*/; do
  [ ! -d "$squad_dir" ] && continue
  squad_name=$(basename "$squad_dir")
  [[ "$squad_name" == *".deprecated"* ]] && continue
  target="$LOCAL_SQUADS_DIR/$squad_name"

  if [ -L "$target" ] || [ -d "$target" ]; then
    EXISTING_COUNT=$((EXISTING_COUNT + 1))
  else
    # Nova squad — criar symlink
    if [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "mingw"* ]] || [[ "$OSTYPE" == "cygwin" ]]; then
      win_target=$(cygpath -w "$squad_dir" 2>/dev/null || echo "$squad_dir")
      win_link=$(cygpath -w "$target" 2>/dev/null || echo "$target")
      cmd //c "mklink /D \"$win_link\" \"$win_target\"" > /dev/null 2>&1 || ln -s "$squad_dir" "$target"
    else
      ln -s "$squad_dir" "$target"
    fi
    echo -e "  ${GREEN}NEW${NC} $squad_name"
    NEW_COUNT=$((NEW_COUNT + 1))
  fi
done

# Verificar squads removidas (symlinks que apontam pra squads que nao existem mais)
for target in "$LOCAL_SQUADS_DIR"/squad-*/; do
  [ ! -e "$target" ] && continue
  squad_name=$(basename "$target")
  source_dir="$GLOBAL_SQUADS_DIR/$squad_name"

  if [ -L "$target" ] && [ ! -d "$source_dir" ]; then
    rm "$target"
    echo -e "  ${RED}REMOVED${NC} $squad_name (squad deletada da fonte)"
    REMOVED_COUNT=$((REMOVED_COUNT + 1))
  fi
done

echo ""
echo -e "${GREEN}Squads:${NC} $EXISTING_COUNT existentes | $NEW_COUNT novas | $REMOVED_COUNT removidas"

# ══════════════════════════════════════════════════════════════════════════════
# Fase 2: Regenerar squad-awareness.md
# ══════════════════════════════════════════════════════════════════════════════

RULES_DIR=".claude/rules"
SQUAD_RULE_FILE="$RULES_DIR/squad-awareness.md"
SQUAD_COUNT=0

if [ -d "$RULES_DIR" ]; then
  echo ""
  echo -e "${BLUE}Regenerando squad-awareness.md...${NC}"

  SQUAD_TABLE=""
  DELEGATION_TABLE=""

  for squad_dir in "$GLOBAL_SQUADS_DIR"/squad-*/; do
    [ ! -d "$squad_dir" ] && continue
    squad_name=$(basename "$squad_dir")
    [[ "$squad_name" == *".deprecated"* ]] && continue
    manifest="$squad_dir/squad.yaml"
    [ ! -f "$manifest" ] && continue

    SQUAD_COUNT=$((SQUAD_COUNT + 1))

    agent_count=$(ls "$squad_dir/agents/"*.md 2>/dev/null | wc -l | tr -d ' ')
    task_count=$(ls "$squad_dir/tasks/"*.md 2>/dev/null | wc -l | tr -d ' ')
    kb_count=$(ls "$squad_dir/knowledge-base/"*.md 2>/dev/null | wc -l | tr -d ' ')
    workflow_count=$(ls "$squad_dir/workflows/"*.yaml 2>/dev/null | wc -l | tr -d ' ')

    SQUAD_TABLE="${SQUAD_TABLE}| \`${squad_name}\` | ${agent_count} agents, ${task_count} tasks, ${kb_count} KBs, ${workflow_count} workflows |\n"
  done

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

| Dominio | Squad | Invocacao |
|---------|-------|-----------|
| Branding e identidade visual | squad-brand | `/brand:agents:brand-orchestrator` |
| Vendas e estrategia comercial | squad-commercial | `/commercial:agents:cs-orchestrator` |
| Conteudo e editorial | squad-content | `/content:agents:content-orchestrator` |
| Copywriting e persuasao | squad-copy | `/copywriting:agents:copy-strategist` |
| Animacoes web, Three.js, shaders, motion | squad-animations | `/ca:agents:ca-orchestrator` |
| UX/UI e experiencia digital | squad-design | `/digital-experience:agents:dx-orchestrator` |
| Inteligencia financeira e pricing | squad-finance | `/finance:agents:fi-orchestrator` |
| Growth organico, SEO e analytics | squad-growth | `/growth:agents:ga-orchestrator` |
| Midia paga (Meta Ads, Google Ads, CRO) | squad-paidmedia | `/pm:agents:pm-orchestrator` |
| Produto e discovery | squad-product | `/product:agents:ps-orchestrator` |
| Pesquisa e inteligencia competitiva | squad-research | `/research:agents:research-orchestrator` |
| Claude Code mastery e automacao | squad-claude | `/claude:agents:cm-orchestrator` |
| Conselho estrategico e modelos mentais | squad-council | `/council:agents:council-orchestrator` |
| Narrativa, storytelling e pitch | squad-storytelling | `/narrative:agents:narrative-orchestrator` |
| Seguranca cibernetica e compliance | squad-cybersecurity | `/cyber:agents:cyber-orchestrator` |

MID_EOF

  cat >> "$SQUAD_RULE_FILE" << 'FOOTER_EOF'

## Handoff Protocol

1. **Identificar** o dominio do pedido
2. **Informar** qual squad cobre e como invocar: `/{prefix}:agents:{agent-id}`
3. **Fornecer contexto** do handoff se necessario
4. Squads sao **autonomas** — o orchestrator coordena internamente
5. Squads possuem **knowledge bases**, **tasks** e **workflows** proprios em `./squads/{squad-name}/`
FOOTER_EOF

  echo -e "  ${GREEN}OK${NC} squad-awareness.md atualizado com $SQUAD_COUNT squads"
fi

# ══════════════════════════════════════════════════════════════════════════════
# Fase 3: Regenerar command files
# ══════════════════════════════════════════════════════════════════════════════

COMMANDS_DIR=".claude/commands"
CMD_COUNT=0

if [ -d ".claude" ]; then
  echo ""
  echo -e "${BLUE}Regenerando command files...${NC}"

  # Limpar commands antigos de squads
  for dir in "$COMMANDS_DIR"/*/; do
    [ ! -d "$dir" ] && continue
    rm -rf "$dir"
  done

  for squad_dir in "$GLOBAL_SQUADS_DIR"/squad-*/; do
    [ ! -d "$squad_dir" ] && continue
    squad_name=$(basename "$squad_dir")
    [[ "$squad_name" == *".deprecated"* ]] && continue
    manifest="$squad_dir/squad.yaml"
    [ ! -f "$manifest" ] && continue

    slash_prefix=$(grep "^slashPrefix:" "$manifest" | head -1 | sed 's/^slashPrefix: *//' | tr -d '"' | tr -d "'" | tr -d ' ')
    if [ -z "$slash_prefix" ]; then
      slash_prefix=$(echo "$squad_name" | sed 's/^squad-//' | sed 's/-\([a-z]\)/\U\1/g' | sed 's/\([A-Z]\)/\L\1/g' | cut -c1-2)
    fi

    squad_cmd_dir="$COMMANDS_DIR/$slash_prefix/agents"
    mkdir -p "$squad_cmd_dir"
    squad_local_path="./squads/$squad_name"

    for agent_file in "$squad_dir/agents/"*.md; do
      [ ! -f "$agent_file" ] && continue
      agent_filename=$(basename "$agent_file")
      agent_id="${agent_filename%.md}"
      agent_name=$(grep -m1 "Nome:\|name:" "$agent_file" | head -1 | sed 's/.*: *//' | sed 's/\*//g')
      agent_icon=$(grep -m1 "Icon:\|icon:" "$agent_file" | head -1 | sed 's/.*: *//' | sed 's/\*//g')

      cmd_file="$squad_cmd_dir/$agent_id.md"
      cat > "$cmd_file" << CMDEOF
# $agent_id

ACTIVATION-NOTICE: This command activates an agent from $squad_name.

CRITICAL: Read the agent definition file at \`$squad_local_path/agents/$agent_filename\` to understand your full operating parameters. Then:
1. Adopt the persona defined in that file (name: $agent_name, icon: $agent_icon)
2. Load the squad manifest at \`$squad_local_path/squad.yaml\`
3. Display greeting and available commands
4. HALT and await user input

## Agent Reference
- **Agent ID:** $agent_id
- **Squad:** $squad_name
- **Definition:** \`$squad_local_path/agents/$agent_filename\`
- **Squad Manifest:** \`$squad_local_path/squad.yaml\`
- **Tasks:** \`$squad_local_path/tasks/\`
- **Knowledge Bases:** \`$squad_local_path/knowledge-base/\`

## How to Execute Tasks
1. Find matching task in \`$squad_local_path/tasks/\`
2. Read task file completely
3. Execute step by step
4. Consult knowledge bases as needed
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
echo -e "${GREEN}  Atualizacao concluida!${NC}"
echo -e "${GREEN}══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}Squads ativas:${NC}"
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
