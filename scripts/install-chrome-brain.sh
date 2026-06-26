#!/bin/bash
set -e

# ══════════════════════════════════════════════════════════════════════════════
# Chrome Brain — Full Install Script for SINAPSE Framework
# ══════════════════════════════════════════════════════════════════════════════
# Installs the entire Chrome Brain capability on a machine with ~/.sinapse/
# Idempotent: safe to run multiple times.
# ══════════════════════════════════════════════════════════════════════════════

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

FAIL_COUNT=0
WARN_COUNT=0
OK_COUNT=0

ok()   { echo -e "  ${GREEN}[OK]${NC} $1"; OK_COUNT=$((OK_COUNT + 1)); }
fail() { echo -e "  ${RED}[FAIL]${NC} $1"; FAIL_COUNT=$((FAIL_COUNT + 1)); }
warn() { echo -e "  ${YELLOW}[WARN]${NC} $1"; WARN_COUNT=$((WARN_COUNT + 1)); }
info() { echo -e "  ${CYAN}[INFO]${NC} $1"; }
step() { echo -e "\n${BOLD}$1${NC}"; }

echo ""
echo -e "${BOLD}${CYAN}"
echo "  ╔══════════════════════════════════════════════════════════════╗"
echo "  ║          Chrome Brain — SINAPSE Install Script              ║"
echo "  ║     Browser Automation Capability for All 17 Squads         ║"
echo "  ╚══════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

SINAPSE_DIR="$HOME/.sinapse"

# ══════════════════════════════════════════════════════════════════════════════
# STEP 1: Prerequisites
# ══════════════════════════════════════════════════════════════════════════════

step "Step 1/15 — Checking prerequisites..."

# Check Node.js >= 20
if command -v node &>/dev/null; then
  NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
  if [ "$NODE_VERSION" -ge 20 ]; then
    ok "Node.js $(node -v) (>= 20)"
  else
    fail "Node.js $(node -v) — need >= 20"
  fi
else
  fail "Node.js not found"
fi

# Check npm
if command -v npm &>/dev/null; then
  ok "npm $(npm -v)"
else
  fail "npm not found"
fi

# Check Google Chrome
if [ -d "/Applications/Google Chrome.app" ]; then
  ok "Google Chrome installed"
else
  fail "Google Chrome not found at /Applications/Google Chrome.app"
fi

# Check SINAPSE framework
if [ -d "$SINAPSE_DIR" ]; then
  ok "SINAPSE framework at $SINAPSE_DIR"
else
  fail "SINAPSE framework not found at $SINAPSE_DIR"
  echo -e "  ${RED}Cannot continue without SINAPSE. Aborting.${NC}"
  exit 1
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 2: Install dev-browser globally
# ══════════════════════════════════════════════════════════════════════════════

step "Step 2/15 — Installing dev-browser globally..."

if npm list -g dev-browser &>/dev/null 2>&1; then
  ok "dev-browser already installed globally"
else
  if npm i -g dev-browser 2>/dev/null; then
    ok "dev-browser installed globally"
  else
    warn "dev-browser install failed (may need sudo or already available via npx)"
  fi
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 3: Create ~/.local/bin/
# ══════════════════════════════════════════════════════════════════════════════

step "Step 3/15 — Ensuring ~/.local/bin/ exists..."

mkdir -p "$HOME/.local/bin"
ok "~/.local/bin/ exists"

# Add to PATH if not present
if ! echo "$PATH" | tr ':' '\n' | grep -q "$HOME/.local/bin"; then
  warn "~/.local/bin not in PATH. Add to your shell profile: export PATH=\"\$HOME/.local/bin:\$PATH\""
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 4: Create scripts in ~/.local/bin/
# ══════════════════════════════════════════════════════════════════════════════

step "Step 4/15 — Creating scripts in ~/.local/bin/..."

# --- chrome-ensure ---
cat > "$HOME/.local/bin/chrome-ensure" << 'SCRIPT_EOF'
#!/bin/bash
PORT="${1:-9222}"
PROFILE="$HOME/.chrome-debug-profile"
CDP="http://127.0.0.1:$PORT/json/version"
if curl -sf "$CDP" -o /dev/null --max-time 1; then
  exit 0
fi
if ! lsof -iTCP:$PORT -sTCP:LISTEN &>/dev/null; then
  pgrep -f "user-data-dir=$PROFILE" | xargs kill 2>/dev/null
  sleep 1
fi
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  &>/dev/null &
for i in {1..20}; do
  if curl -sf "$CDP" -o /dev/null --max-time 1; then
    exit 0
  fi
  sleep 0.5
done
echo "BLOCKED: Chrome debug failed to start on port $PORT. Run 'chrome-debug' manually." >&2
exit 1
SCRIPT_EOF
chmod +x "$HOME/.local/bin/chrome-ensure"
ok "chrome-ensure created"

# --- chrome-debug ---
cat > "$HOME/.local/bin/chrome-debug" << 'SCRIPT_EOF'
#!/bin/bash
PORT="${1:-9222}"
PROFILE="$HOME/.chrome-debug-profile"
if curl -s "http://127.0.0.1:$PORT/json/version" &>/dev/null; then
  echo "Chrome debug already running on port $PORT"
  exit 0
fi
pkill -a "Google Chrome" 2>/dev/null
sleep 2
echo "Launching Chrome with remote debugging on port $PORT..."
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --remote-debugging-port="$PORT" \
  --user-data-dir="$PROFILE" \
  --no-first-run \
  &>/dev/null &
for i in {1..15}; do
  if curl -s "http://127.0.0.1:$PORT/json/version" &>/dev/null; then
    echo "Chrome ready on port $PORT"
    exit 0
  fi
  sleep 1
done
echo "ERROR: Chrome failed to start with debugging"
exit 1
SCRIPT_EOF
chmod +x "$HOME/.local/bin/chrome-debug"
ok "chrome-debug created"

# --- chrome-brain-log ---
cat > "$HOME/.local/bin/chrome-brain-log" << 'SCRIPT_EOF'
#!/bin/bash
LOG_DIR="$HOME/.chrome-brain"
LOG_FILE="$LOG_DIR/session-$(date +%Y%m%d).log"
COUNTER_FILE="$LOG_DIR/.screenshot-count"
mkdir -p "$LOG_DIR"
TOOL_NAME="${HOOK_TOOL_NAME:-unknown}"
TIMESTAMP=$(date +%H:%M:%S)
echo "$TIMESTAMP $TOOL_NAME" >> "$LOG_FILE"
if echo "$TOOL_NAME" | grep -qE "take_screenshot|take_snapshot"; then
  COUNT=$(cat "$COUNTER_FILE" 2>/dev/null || echo 0)
  COUNT=$((COUNT + 1))
  echo "$COUNT" > "$COUNTER_FILE"
  if [ "$COUNT" -eq 12 ]; then
    echo "WARNING: 12 screenshots in this session. Consider saving state and rotating." >&2
  elif [ "$COUNT" -ge 15 ]; then
    echo "CRITICAL: 15+ screenshots. Session at risk of exceeding 20MB API limit. Save state NOW." >&2
  fi
fi
exit 0
SCRIPT_EOF
chmod +x "$HOME/.local/bin/chrome-brain-log"
ok "chrome-brain-log created"

# ══════════════════════════════════════════════════════════════════════════════
# STEP 5: Merge hooks into ~/.claude/settings.json
# ══════════════════════════════════════════════════════════════════════════════

step "Step 5/15 — Merging hooks into ~/.claude/settings.json..."

mkdir -p "$HOME/.claude"

python3 << 'PYEOF'
import json, os, sys

settings_path = os.path.expanduser("~/.claude/settings.json")

# Load existing settings
if os.path.exists(settings_path):
    with open(settings_path, "r") as f:
        settings = json.load(f)
else:
    settings = {}

# Define hooks to merge
hooks = {
    "PreToolUse": [
        {"matcher": "mcp__chrome-devtools__*", "hooks": [{"type": "command", "command": "chrome-ensure"}]},
        {"matcher": "mcp__claude-in-chrome__*", "hooks": [{"type": "command", "command": "chrome-ensure"}]}
    ],
    "PostToolUse": [
        {"matcher": "mcp__chrome-devtools__*", "hooks": [{"type": "command", "command": "chrome-brain-log"}]},
        {"matcher": "mcp__claude-in-chrome__*", "hooks": [{"type": "command", "command": "chrome-brain-log"}]}
    ]
}

# Merge hooks (replace existing hook entries by matcher, keep others)
if "hooks" not in settings:
    settings["hooks"] = {}

for hook_type, hook_list in hooks.items():
    existing = settings["hooks"].get(hook_type, [])
    # Build set of matchers we want to add
    new_matchers = {h["matcher"] for h in hook_list}
    # Keep existing entries that don't conflict
    filtered = [e for e in existing if e.get("matcher") not in new_matchers]
    # Add our hooks
    filtered.extend(hook_list)
    settings["hooks"][hook_type] = filtered

with open(settings_path, "w") as f:
    json.dump(settings, f, indent=2)

print("OK")
PYEOF

if [ $? -eq 0 ]; then
  ok "Hooks merged into ~/.claude/settings.json"
else
  fail "Failed to merge hooks into ~/.claude/settings.json"
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 6: Create ~/.sinapse/.claude/settings.json (standalone hooks)
# ══════════════════════════════════════════════════════════════════════════════

step "Step 6/15 — Creating ~/.sinapse/.claude/settings.json..."

mkdir -p "$SINAPSE_DIR/.claude"

cat > "$SINAPSE_DIR/.claude/settings.json" << 'JSON_EOF'
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "mcp__chrome-devtools__*",
        "hooks": [
          {
            "type": "command",
            "command": "chrome-ensure"
          }
        ]
      },
      {
        "matcher": "mcp__claude-in-chrome__*",
        "hooks": [
          {
            "type": "command",
            "command": "chrome-ensure"
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "mcp__chrome-devtools__*",
        "hooks": [
          {
            "type": "command",
            "command": "chrome-brain-log"
          }
        ]
      },
      {
        "matcher": "mcp__claude-in-chrome__*",
        "hooks": [
          {
            "type": "command",
            "command": "chrome-brain-log"
          }
        ]
      }
    ]
  }
}
JSON_EOF
ok "~/.sinapse/.claude/settings.json created"

# ══════════════════════════════════════════════════════════════════════════════
# STEP 7: Add Chrome DevTools MCP to ~/.claude.json
# ══════════════════════════════════════════════════════════════════════════════

step "Step 7/15 — Merging Chrome DevTools MCP into ~/.claude.json..."

python3 << 'PYEOF'
import json, os

config_path = os.path.expanduser("~/.claude.json")

if os.path.exists(config_path):
    with open(config_path, "r") as f:
        config = json.load(f)
else:
    config = {}

if "mcpServers" not in config:
    config["mcpServers"] = {}

config["mcpServers"]["chrome-devtools"] = {
    "command": "npx",
    "args": ["chrome-devtools-mcp@latest", "--browser-url=http://127.0.0.1:9222"]
}

with open(config_path, "w") as f:
    json.dump(config, f, indent=2)

print("OK")
PYEOF

if [ $? -eq 0 ]; then
  ok "Chrome DevTools MCP merged into ~/.claude.json"
else
  fail "Failed to merge MCP into ~/.claude.json"
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 8: Create chrome-brain-autoload.md rule
# ══════════════════════════════════════════════════════════════════════════════

step "Step 8/15 — Creating chrome-brain-autoload.md rule..."

mkdir -p "$SINAPSE_DIR/.claude/rules"

cat > "$SINAPSE_DIR/.claude/rules/chrome-brain-autoload.md" << 'RULE_EOF'
# Chrome Brain — Auto-Activation & Auto-Learning Rule

> CRITICAL: This capability auto-activates and auto-learns. No command needed.

## Auto-Activation

When the user's prompt matches ANY of these patterns, Chrome Brain is active:

- **Browser**: abrir/navegar/acessar site, URL, pagina, chrome, aba
- **Cloning**: clonar/replicar/copiar site, pagina, hero, layout, animacao
- **Forms**: preencher/cadastrar/signup/login formulario, form, conta
- **Audit**: auditar/analisar/inspecionar site, performance, Lighthouse
- **Scraping**: extrair/scrape/coletar dados, conteudo, HTML, CSS
- **Animation**: animacao 3D, Three.js, WebGL, shader, canvas

## Protocol

1. Chrome connection is guaranteed by PreToolUse hook (chrome-ensure)
2. Select tooling: CDP > dev-browser > claude-in-chrome
3. Execute with NSN Mode enabled (never say "I can't" — try 3+ alternatives)
4. Track screenshot count — max 15 per session
5. Handoff results to domain squad when applicable

## Auto-Learning — MANDATORY

After completing ANY browser automation task, evaluate:

1. **Did something unexpected happen?** (error, workaround, new pattern)
2. **Did NSN Mode activate?** (barrier encountered and resolved)
3. **Is the solution generalizable?** (useful for future sessions)

If YES to any:
- Append the learning to the `## Learnings Log` section in:
  `~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
- Format:
  ```
  ### YYYY-MM-DD — [Summary]
  **Barreira:** [description]
  **Tentativas:** [what was tried]
  **Solucao:** [what worked]
  **Generalizavel:** sim/nao
  **Squad afetada:** [which]
  ```

This ensures every session makes the next session smarter.

## Session Management

Track screenshots mentally. When approaching 12:
1. Save current state to handoff file
2. Suggest session rotation to user
3. Never exceed 15 screenshots in a single session

## Knowledge Base

Full reference: `~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
RULE_EOF
ok "chrome-brain-autoload.md created"

# ══════════════════════════════════════════════════════════════════════════════
# STEP 9: Create master KB chrome-brain.md
# ══════════════════════════════════════════════════════════════════════════════

step "Step 9/15 — Creating master KB chrome-brain.md..."

mkdir -p "$SINAPSE_DIR/sinapse/knowledge-base"

cat > "$SINAPSE_DIR/sinapse/knowledge-base/chrome-brain.md" << 'KB_EOF'
# Chrome Brain — Browser Automation Capability

> Cross-squad capability que da a TODOS os agents do SINAPSE o poder de
> navegar, clonar, preencher, auditar e scrape qualquer site via Chrome real.
> Auto-ativado. Sem comando manual. NSN Mode sempre ligado.

---

## Arquitetura

```
Chrome (porta 9222, perfil ~/.chrome-debug-profile)
  ├── Chrome DevTools MCP (29 tools) — acoes rapidas, screenshots, Lighthouse
  ├── dev-browser (Playwright) — scraping complexo, batch, headless
  └── claude-in-chrome (Extension) — fallback visual, coordenadas de tela
```

**Prioridade de tooling:** CDP > dev-browser > claude-in-chrome

**Auto-launch:** Hook PreToolUse roda `chrome-ensure` antes de qualquer tool chrome.
Nao precisa rodar `chrome-debug` manualmente.

---

## Decisao de Tooling

| Cenario | Ferramenta |
|---------|-----------|
| Click, fill, navegar | Chrome DevTools MCP |
| Screenshot/snapshot | Chrome DevTools MCP |
| Performance/Lighthouse | Chrome DevTools MCP |
| Network/Console | Chrome DevTools MCP |
| Scraping com logica JS | dev-browser evaluate() |
| Batch/loops | dev-browser |
| Headless | dev-browser --headless |
| Iframe cross-origin | claude-in-chrome ou CDP Input.dispatchMouseEvent |
| CAPTCHA | CDP mouse events no iframe (funciona cross-origin) |

---

## Patterns Validados

### Form Filling

**Multi-step forms (testado em 9 steps):**
1. navigate_page → URL
2. click → botao que abre form/modal
3. wait_for → form renderizar
4. Para cada step: take_snapshot → identificar tipo → fill/click → avancar
5. Ultimo step: click enviar

**Gotchas:**
- Sempre take_snapshot ANTES de preencher (mapeia seletores)
- Email duplicado retorna erro inline — ter fallback
- `fill` aceita seletor CSS direto
- Dropdowns: click no dropdown → click na opcao (nao fill)

### Site Cloning

**Fase 1 — Captura:**
1. navigate_page → URL alvo
2. take_screenshot (1 referencia)
3. evaluate_script → document.documentElement.outerHTML
4. evaluate_script → extrair fontes, cores, layout, breakpoints
5. Scroll + screenshot nos pontos criticos (max 3-4)

**Fase 2 — Analise:**
- Identificar stack (Next.js? Vite? React? Vanilla?)
- Mapear componentes (hero, nav, sections, footer)
- Identificar animacoes (Three.js, GSAP, CSS, Framer Motion)
- Identificar assets (modelos 3D, texturas, SVGs, fontes)

**Fase 3 — Recriacao:**
1. HTML single-file (inline CSS + JS)
2. Clonar shaders se WebGL
3. Testar em nova aba → comparar com original → iterar

**Casos validados:**
- Hero com orb WebGL (parallax, blend-mode) — ~15min
- Cena 3D facial (Three.js, modelo .obj, bloom) — ~20min

### Animacoes 3D via AI

Workflow: navigate Gemini → prompt descritivo → aguardar geracao →
evaluate_script extrair HTML → salvar arquivo → abrir em nova aba → validar

### CAPTCHA

| Estrategia | Resultado |
|-----------|----------|
| CDP Input.dispatchMouseEvent em iframe | FUNCIONA (bypassa cross-origin) |
| evaluate_script em iframe CAPTCHA | NAO FUNCIONA (same-origin policy) |
| Audio challenge reCAPTCHA | PENDENTE (promissor) |
| Continue with Google | PENDENTE (pula CAPTCHA se logado) |

**IMPORTANTE:** Apos 3-4 resolucoes corretas, Google detecta automacao e entra
em loop. Parar e mudar estrategia. Nao insistir.

---

## NSN Mode — Nunca Diga Nunca

**Protocolo ativo em TODOS os agents com Chrome Brain.**

Quando encontrar barreira:
1. **Classificar** — permission? technical? knowledge? external?
2. **Buscar** — WebSearch/WebFetch por workaround/solucao
3. **Tentar alternativas** — minimo 3 abordagens diferentes
4. **Configurar e testar** — instalar deps, ajustar permissoes, validar
5. **Repetir** — voltar ao passo 2 com novo contexto (max 5 ciclos)
6. **Escalar** — apos 5 falhas, reportar ao usuario com detalhes

**Anti-patterns:**
- NUNCA dizer "nao consigo" sem ter tentado alternativas
- NUNCA parar no primeiro erro
- NUNCA assumir que algo e impossivel sem pesquisar
- NUNCA pedir pro usuario fazer algo que o agent pode automatizar

**Excecoes:** acoes destrutivas, pagamentos, violacao de leis → pedir confirmacao

---

## Session Management

**Limites (prevencao de crash):**
- Max 15 screenshots por sessao
- Max 10 snapshots por sessao
- Preferir evaluate_script sobre take_snapshot (mais leve)
- Nunca screenshot + snapshot do mesmo estado
- Fechar tabs desnecessarias
- Salvar outputs em arquivo ANTES de acumular mais

**Rotacao:** A cada ~12 screenshots, salvar handoff e sugerir nova sessao.

---

## Learnings Log

> Secao atualizada automaticamente quando NSN Mode resolve problemas novos.
> Formato: data, barreira, tentativas, solucao, generalizavel, squad.

### 2026-03-27 — CAPTCHA reCAPTCHA via CDP
**Barreira:** Iframe cross-origin do Google bloqueia evaluate_script
**Tentativas:** evaluate_script (falhou) → cliclick (precisa permissao) → AppleScript (precisa permissao)
**Solucao:** CDP Input.dispatchMouseEvent com coordenadas calculadas a partir da posicao do iframe
**Generalizavel:** Sim — qualquer iframe cross-origin pode ser interagido via CDP raw events
**Squad afetada:** Todas (form filling, signup flows)

### 2026-03-27 — Chrome normal vs debug profile
**Barreira:** chrome-ensure matava o Chrome normal do usuario
**Tentativas:** pkill generico (matava tudo)
**Solucao:** pgrep -f "user-data-dir=$PROFILE" — mata apenas instancias do debug profile
**Generalizavel:** Sim — pattern para convivencia Chrome normal + debug
**Squad afetada:** Todas

### 2026-03-27 — Session crash por acumulo de screenshots (65MB)
**Barreira:** 46 screenshots + 31 snapshots = 31.8 MB de imagens, request excedeu 20MB
**Tentativas:** N/A (crash irrecuperavel)
**Solucao:** Limitar a 15 screenshots/sessao, preferir evaluate_script, rotacionar sessoes
**Generalizavel:** Sim — regra universal para qualquer sessao com browser automation
**Squad afetada:** Todas
KB_EOF
ok "chrome-brain.md created"

# ══════════════════════════════════════════════════════════════════════════════
# STEP 10: Create 13 squad integration files
# ══════════════════════════════════════════════════════════════════════════════

step "Step 10/15 — Creating 13 squad integration files..."

# Define the standard footer used by ALL squad integration files
FOOTER='## Tools Disponiveis

1. **Chrome DevTools MCP** (29 tools) — acoes rapidas, screenshots, audit
2. **dev-browser** — scraping complexo, batch operations
3. **claude-in-chrome** — fallback visual

## Session Management

- Max 15 screenshots por sessao
- Salvar outputs em arquivo antes de acumular
- Rotacionar sessao a cada ~12 screenshots

## NSN Mode

Ativo. Se uma acao de browser falhar, tentar alternativas automaticamente.
Buscar solucao na internet. Configurar, testar, repetir. Max 5 ciclos.

## Auto-Learning

Ao descobrir novo pattern ou resolver barreira via NSN, atualizar:
`~/.sinapse/sinapse/knowledge-base/chrome-brain.md` → secao Learnings Log

## Referencia Completa

`~/.sinapse/sinapse/knowledge-base/chrome-brain.md`'

# --- squad-animations ---
mkdir -p "$SINAPSE_DIR/squad-animations/knowledge-base"
cat > "$SINAPSE_DIR/squad-animations/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Animations (Kinetic)
> Squad Animations tem acesso ao Chrome Brain para captura de DOM, extracao de shaders, clonagem de animacoes e inspecao de scene graphs Three.js em sites de referencia.
## Tier: 1
## Quando Ativar
- Usuario pede para clonar ou replicar uma animacao de um site externo
- Precisa extrair shaders GLSL, vertex/fragment, de um canvas WebGL em producao
- Analise de scene graph Three.js (geometrias, materiais, luzes, cameras) de referencia ao vivo
- Identificacao de assets (modelos 3D, texturas, SVGs, fontes) usados em animacoes de terceiros
- Extracao de CSS @keyframes ou timelines GSAP/Framer Motion de uma pagina
- Preview e validacao de animacao recem-criada diretamente no browser
## O Que Recebe do Chrome Brain
- DOM snapshot completo (HTML + inline styles + computed styles)
- Screenshots de referencia (estados de animacao: inicio, meio, fim)
- Codigo fonte de shaders GLSL extraido via evaluate_script no contexto WebGL
- Scene graph Three.js serializado (renderer.info, scene.children recursivo)
- CSS @keyframes parseados e timelines GSAP/ScrollTrigger extraidas
- Lista de assets externos (URLs de .glb, .obj, .gltf, texturas, spritesheets)
- Performance traces de animacoes (FPS, paint timing, composite layers)
## O Que Envia pro Chrome Brain
- Animacoes recem-criadas para preview em nova aba (HTML single-file)
- Requests de captura em pontos especificos de scroll ou tempo
- Scripts de extracao customizados para injecao via evaluate_script
- Resultados de validacao visual (comparacao original vs clone)
- Novos patterns de extracao descobertos durante clonagem

$FOOTER
SQUAD_EOF
ok "squad-animations/chrome-brain-integration.md"

# --- squad-design ---
mkdir -p "$SINAPSE_DIR/squad-design/knowledge-base"
cat > "$SINAPSE_DIR/squad-design/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Design (Nexus)
> Squad Design tem acesso ao Chrome Brain para captura responsiva, inspecao de layout, auditoria de acessibilidade, Lighthouse scores e extracao de design systems de sites de referencia.
## Tier: 1
## Quando Ativar
- Precisa capturar screenshots responsivos (mobile 375px, tablet 768px, desktop 1440px) de uma pagina
- Inspecao de layout com DOM snapshot para mapear grid, flexbox, spacing e hierarquia de componentes
- Auditoria de acessibilidade: ARIA roles, labels, contrast ratios, tab order, focus states
- Extracao de design tokens de um site de referencia (cores, tipografia, spacing, border-radius)
- Lighthouse audit completo (performance, accessibility, best practices, SEO)
- Validacao visual de componente recem-implementado contra design spec
## O Que Recebe do Chrome Brain
- Screenshots responsivos em 3+ breakpoints (mobile, tablet, desktop)
- DOM snapshot com computed CSS de qualquer elemento
- Lighthouse report completo (scores + oportunidades + diagnosticos)
- ARIA tree e accessibility audit (roles, labels, contrast, violations)
- Design tokens extraidos: paleta de cores, font stack, spacing scale, shadows
- Layout grid/flexbox inspecionado (gap, columns, breakpoints, media queries)
- Core Web Vitals medidos em tempo real (LCP, FID, CLS, INP)
## O Que Envia pro Chrome Brain
- Requests de captura em breakpoints especificos
- Scripts de extracao de design tokens via evaluate_script
- Componentes para validacao visual em nova aba
- Checklists de acessibilidade para auditoria automatizada
- Resultados de comparacao visual (esperado vs implementado)

$FOOTER
SQUAD_EOF
ok "squad-design/chrome-brain-integration.md"

# --- squad-cloning ---
mkdir -p "$SINAPSE_DIR/squad-cloning/knowledge-base"
cat > "$SINAPSE_DIR/squad-cloning/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Cloning (Helix)
> Squad Cloning tem acesso ao Chrome Brain para captura completa de paginas (DOM+CSS+JS), extracao de transcripts, mapeamento de navegacao e automacao de formularios para clonagem cognitiva.
## Tier: 1
## Quando Ativar
- Pipeline de clonagem requer captura completa de um site (HTML + CSS + JS + assets)
- Extracao de transcripts de video embedados (YouTube, Vimeo, Loom)
- Mapeamento de estrutura de navegacao e information architecture de um site alvo
- Extracao de conteudo textual estruturado (headings, paragrafos, listas, quotes)
- Automacao de formularios multi-step para cognitive profiling (signup, onboarding)
- Captura de padroes de interacao (hover states, modals, dropdowns, accordions)
## O Que Recebe do Chrome Brain
- Full page HTML (document.documentElement.outerHTML) com inline styles
- CSS completo (stylesheets parseados, computed styles, custom properties)
- JavaScript comportamental (event listeners, state management, routing logic)
- Transcripts de video extraidos via API ou captions
- Sitemap/navegacao mapeada (links internos, hierarquia de paginas, breadcrumbs)
- Cognitive profile data: formularios preenchidos, respostas capturadas, fluxos percorridos
- Assets identificados e catalogados (fontes, imagens, icones, modelos 3D)
## O Que Envia pro Chrome Brain
- URLs alvo para captura sequencial (batch cloning)
- Scripts de extracao customizados para contextos especificos
- Formularios para preenchimento automatizado (cognitive profiling)
- Clones recem-criados para validacao visual side-by-side
- Mapa de navegacao para crawling orientado

$FOOTER
SQUAD_EOF
ok "squad-cloning/chrome-brain-integration.md"

# --- squad-claude ---
mkdir -p "$SINAPSE_DIR/squad-claude/knowledge-base"
cat > "$SINAPSE_DIR/squad-claude/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Claude (Claude Code Mastery)
> Squad Claude tem acesso ao Chrome Brain para documentacao de novos patterns de automacao, solucoes NSN, discovery de MCP tools, gestao de configuracao e otimizacao de prompts para tarefas de browser.
## Tier: 1
## Quando Ativar
- Descoberta de novo pattern de automacao que precisa ser documentado e testado
- Solucao NSN encontrada que precisa ser validada em browser real antes de registrar
- Discovery de novos MCP tools ou capabilities via browser (docs, changelogs, APIs)
- Configuracao de MCP servers ou Chrome DevTools que requer teste interativo
- Otimizacao de prompts para tarefas de browser (testar variantes, medir resultados)
- Debug de integracao Chrome Brain com outros squads (reproduzir problema no browser)
## O Que Recebe do Chrome Brain
- Resultados de testes de novos patterns de automacao (funciona/nao funciona)
- Screenshots de documentacao oficial (Claude, MCP, Chrome DevTools Protocol)
- Changelogs e release notes extraidos de sites de ferramentas
- Configuracoes testadas e validadas (JSON, YAML, env vars)
- Metricas de performance de diferentes abordagens de automacao
- Error logs e stack traces capturados durante debug de integracoes
## O Que Envia pro Chrome Brain
- Novos patterns validados para registro no Learnings Log
- Scripts de teste para validacao de configuracoes MCP
- Documentacao de solucoes NSN para propagacao cross-squad
- Prompts otimizados para tarefas de browser recorrentes
- Regras de auto-activation atualizadas baseadas em novos patterns

$FOOTER
SQUAD_EOF
ok "squad-claude/chrome-brain-integration.md"

# --- squad-paidmedia ---
mkdir -p "$SINAPSE_DIR/squad-paidmedia/knowledge-base"
cat > "$SINAPSE_DIR/squad-paidmedia/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Paid Media (Apex)
> Squad Paid Media tem acesso ao Chrome Brain para captura de landing pages de concorrentes, extracao de criativos publicitarios, analise de lead forms e auditoria Lighthouse de paginas de destino.
## Tier: 2
## Quando Ativar
- Analise de landing page de concorrente (estrutura, copy, CTA, formulario)
- Extracao de criativos publicitarios visiveis em bibliotecas de anuncios (Meta Ad Library, Google Ads Transparency)
- Auditoria de lead forms de concorrentes (campos, UX, numero de steps, fricao)
- Lighthouse audit de landing pages proprias ou de clientes (performance impacta Quality Score)
- Captura de SERP ads para analise de headlines, descriptions e extensoes
## O Que Recebe do Chrome Brain
- Screenshots de landing pages de concorrentes em multiplos breakpoints
- Estrutura de landing page extraida (hero, beneficios, prova social, CTA, formulario)
- Criativos de anuncios capturados da Meta Ad Library e Google Ads Transparency Center
- Lead form analysis: campos, tipos de input, validacoes, numero de steps
- Lighthouse scores de landing pages (performance, mobile usability)
- SERP screenshots com anuncios pagos destacados
## O Que Envia pro Chrome Brain
- URLs de landing pages para captura batch
- Filtros para Meta Ad Library (anunciante, pais, plataforma)
- Landing pages proprias para auditoria Lighthouse
- Requests de captura mobile-first (375px) para analise de UX mobile

$FOOTER
SQUAD_EOF
ok "squad-paidmedia/chrome-brain-integration.md"

# --- squad-growth ---
mkdir -p "$SINAPSE_DIR/squad-growth/knowledge-base"
cat > "$SINAPSE_DIR/squad-growth/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Growth (Catalyst)
> Squad Growth tem acesso ao Chrome Brain para medicao de Core Web Vitals, analise de network waterfall, captura de console errors, screenshots de SERP e performance traces.
## Tier: 2
## Quando Ativar
- Medicao de Core Web Vitals (LCP, CLS, INP, FCP, TTFB) de pagina em producao
- Analise de network waterfall para identificar bottlenecks de carregamento
- Captura de console errors e warnings em ambiente de producao
- Screenshots de SERP para analise de posicionamento organico e featured snippets
- Performance trace completo para diagnostico de jank, layout shifts ou long tasks
## O Que Recebe do Chrome Brain
- Core Web Vitals medidos em tempo real via Lighthouse e Performance API
- Network waterfall completo (requests, timings, tamanhos, cache hits/misses)
- Console messages filtrados por nivel (errors, warnings, info)
- SERP screenshots com posicoes organicas e paid destacadas
- Performance traces com flame chart (main thread, compositing, painting)
## O Que Envia pro Chrome Brain
- URLs para auditoria de performance em serie
- Configuracoes de throttling (3G, 4G, desktop) para testes
- Scripts de medicao customizados via evaluate_script

$FOOTER
SQUAD_EOF
ok "squad-growth/chrome-brain-integration.md"

# --- squad-content ---
mkdir -p "$SINAPSE_DIR/squad-content/knowledge-base"
cat > "$SINAPSE_DIR/squad-content/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Content
> Squad Content tem acesso ao Chrome Brain para extracao de conteudo textual, analise de estrutura editorial de concorrentes, captura de meta tags, headings e schema markup.
## Tier: 2
## Quando Ativar
- Extracao de conteudo textual completo de artigo ou pagina de concorrente
- Analise de estrutura editorial: hierarquia de headings, tamanho de secoes, densidade de keywords
- Captura de meta tags (title, description, OG tags, Twitter cards) para benchmark
- Inspecao de schema markup (JSON-LD, microdata) para rich snippets
- Mapeamento de content hub ou topic cluster de concorrente
## O Que Recebe do Chrome Brain
- Texto completo extraido com estrutura preservada (headings, paragrafos, listas)
- Meta tags parseados: title, description, canonical, OG, Twitter Card
- Schema markup extraido e validado (JSON-LD completo)
- Hierarquia de headings (H1-H6) com contagem e distribuicao
- Links internos mapeados (anchor text, destino, contexto)
## O Que Envia pro Chrome Brain
- URLs de artigos/paginas para extracao batch
- Scripts de extracao customizados para formatos especificos
- Seletores CSS para conteudo principal

$FOOTER
SQUAD_EOF
ok "squad-content/chrome-brain-integration.md"

# --- squad-copy ---
mkdir -p "$SINAPSE_DIR/squad-copy/knowledge-base"
cat > "$SINAPSE_DIR/squad-copy/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Copy (Quill Prime)
> Squad Copy tem acesso ao Chrome Brain para extracao de copy de landing pages, analise de headlines/CTAs/bullets, mapeamento de sales pages e teste de copy via injecao de scripts.
## Tier: 2
## Quando Ativar
- Extracao de copy completa de landing page ou sales page de concorrente
- Analise de headlines, subheadlines, CTAs e bullet points de paginas de alta conversao
- Mapeamento de estrutura de sales page (hook, problema, agitacao, solucao, prova, oferta, urgencia, CTA)
- Teste de variantes de copy via evaluate_script (injectar headline alternativa)
- Benchmark de copy patterns em multiplas paginas do mesmo nicho
## O Que Recebe do Chrome Brain
- Copy completa extraida com hierarquia preservada
- Headlines e subheadlines isolados para analise de patterns
- CTAs capturados com contexto (posicao, cor, tamanho, texto)
- Estrutura de sales page mapeada por funcao persuasiva
## O Que Envia pro Chrome Brain
- URLs de sales pages para extracao batch
- Scripts de injecao de copy alternativa para teste visual A/B
- Seletores para captura de secoes especificas

$FOOTER
SQUAD_EOF
ok "squad-copy/chrome-brain-integration.md"

# --- squad-research ---
mkdir -p "$SINAPSE_DIR/squad-research/knowledge-base"
cat > "$SINAPSE_DIR/squad-research/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Research (Prism)
> Squad Research tem acesso ao Chrome Brain para coleta de dados de sites concorrentes, precos publicos, portfolios e case studies.
## Tier: 3
## Quando Ativar
- Coleta de dados publicos de concorrentes (servicos, precos, equipe, localizacoes)
- Captura de portfolios e case studies de empresas de referencia
- Extracao de informacoes de mercado de fontes publicas
- Mapeamento de presenca digital de concorrentes
## O Que Recebe do Chrome Brain
- Dados estruturados de sites concorrentes
- Portfolios e case studies extraidos com texto e screenshots
- Rankings e listas de diretories do setor
- Reviews e depoimentos publicos
## O Que Envia pro Chrome Brain
N/A para esta squad

$FOOTER
SQUAD_EOF
ok "squad-research/chrome-brain-integration.md"

# --- squad-cybersecurity ---
mkdir -p "$SINAPSE_DIR/squad-cybersecurity/knowledge-base"
cat > "$SINAPSE_DIR/squad-cybersecurity/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Cybersecurity (Fortress)
> Squad Cybersecurity tem acesso ao Chrome Brain para inspecao de HTTP headers, console security errors, network requests suspeitas e cookies/storage.
## Tier: 3
## Quando Ativar
- Inspecao de HTTP headers de seguranca (CSP, HSTS, X-Frame-Options)
- Captura de console security errors e mixed content warnings
- Analise de network requests para identificar chamadas inseguras
- Auditoria de cookies (Secure, HttpOnly, SameSite) e storage
## O Que Recebe do Chrome Brain
- HTTP response headers completos
- Console messages de seguranca
- Network requests com detalhes de protocol e headers
- Cookies listados com flags e validade
- Lighthouse best practices score
## O Que Envia pro Chrome Brain
N/A para esta squad

$FOOTER
SQUAD_EOF
ok "squad-cybersecurity/chrome-brain-integration.md"

# --- squad-commercial ---
mkdir -p "$SINAPSE_DIR/squad-commercial/knowledge-base"
cat > "$SINAPSE_DIR/squad-commercial/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Commercial (Pipeline)
> Squad Commercial tem acesso ao Chrome Brain para analise de formularios, pricing pages e funis de conversao de concorrentes.
## Tier: 3
## Quando Ativar
- Analise de formularios de concorrentes (campos, steps, UX, microcopy)
- Captura de paginas de pricing (planos, precos, features, comparativos)
- Mapeamento de funil de conversao da landing ate o contato/compra
- Benchmark de UX comercial (checkout, onboarding, trial signup)
## O Que Recebe do Chrome Brain
- Formularios analisados com campos, tipos, validacoes
- Pricing pages capturadas com dados estruturados
- Funil mapeado: paginas, CTAs, steps, redirects
- Trust signals identificados
## O Que Envia pro Chrome Brain
N/A para esta squad

$FOOTER
SQUAD_EOF
ok "squad-commercial/chrome-brain-integration.md"

# --- squad-brand ---
mkdir -p "$SINAPSE_DIR/squad-brand/knowledge-base"
cat > "$SINAPSE_DIR/squad-brand/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Brand (Meridian)
> Squad Brand tem acesso ao Chrome Brain para extracao de design systems visuais, captura de identidade de concorrentes e coleta de visual assets.
## Tier: 3
## Quando Ativar
- Extracao de design system visual (paleta de cores, tipografia, spacing, shadows)
- Captura de identidade visual de concorrentes (logo, cores, tom, estilo fotografico)
- Screenshots de referencia de brand identity em contexto digital
- Coleta de visual assets para mood board
## O Que Recebe do Chrome Brain
- Paleta de cores extraida via computed styles
- Font stack completo (familias, pesos, tamanhos)
- Spacing scale e sizing tokens
- Screenshots de paginas-chave
- Logo e favicon capturados
## O Que Envia pro Chrome Brain
N/A para esta squad

$FOOTER
SQUAD_EOF
ok "squad-brand/chrome-brain-integration.md"

# --- squad-storytelling ---
mkdir -p "$SINAPSE_DIR/squad-storytelling/knowledge-base"
cat > "$SINAPSE_DIR/squad-storytelling/knowledge-base/chrome-brain-integration.md" << SQUAD_EOF
# Chrome Brain Integration — Squad Storytelling (Arc)
> Squad Storytelling tem acesso ao Chrome Brain para captura de apresentacoes web, analise de estrutura narrativa de landing pages e storytelling patterns.
## Tier: 3
## Quando Ativar
- Captura de apresentacoes HTML publicadas na web
- Analise de estrutura narrativa de landing pages (arco emocional, pacing)
- Extracao de storytelling patterns de paginas de alta conversao
- Captura de narrative flow de onboarding ou product tours
## O Que Recebe do Chrome Brain
- HTML de apresentacoes web (slides + transicoes)
- Estrutura narrativa mapeada por funcao na historia
- Sequencia de CTAs no arco narrativo
- Screenshots de momentos-chave
## O Que Envia pro Chrome Brain
N/A para esta squad

$FOOTER
SQUAD_EOF
ok "squad-storytelling/chrome-brain-integration.md"

# ══════════════════════════════════════════════════════════════════════════════
# STEP 11: Update sinapse-orqx.md (append chrome_brain_capability if missing)
# ══════════════════════════════════════════════════════════════════════════════

step "Step 11/15 — Updating sinapse-orqx.md..."

AGENT_FILE="$SINAPSE_DIR/sinapse/agents/sinapse-orqx.md"
if [ -f "$AGENT_FILE" ]; then
  if grep -q "chrome_brain_capability" "$AGENT_FILE"; then
    ok "chrome_brain_capability already present in sinapse-orqx.md — skipped"
  else
    # Find the line after ambiguity_resolution section ends and append
    warn "chrome_brain_capability section not found — but file structure may have changed. Checking..."
    # The section was already there based on our read. Double-check.
    if grep -q "chrome_brain_capability" "$AGENT_FILE"; then
      ok "chrome_brain_capability already present (re-check)"
    else
      fail "Could not find chrome_brain_capability in sinapse-orqx.md and could not append safely"
    fi
  fi
else
  fail "sinapse-orqx.md not found at $AGENT_FILE"
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 12: Update squad.yaml (add chrome-brain.md to knowledge_bases if missing)
# ══════════════════════════════════════════════════════════════════════════════

step "Step 12/15 — Updating squad.yaml..."

SQUAD_YAML="$SINAPSE_DIR/sinapse/squad.yaml"
if [ -f "$SQUAD_YAML" ]; then
  if grep -q "chrome-brain.md" "$SQUAD_YAML"; then
    ok "chrome-brain.md already in squad.yaml knowledge_bases — skipped"
  else
    # Add chrome-brain.md after the last knowledge_bases entry
    python3 << PYEOF
import re

with open("$SQUAD_YAML", "r") as f:
    content = f.read()

# Add chrome-brain.md to knowledge_bases list
if "chrome-brain.md" not in content:
    # Find the last KB entry and add after it
    content = content.replace(
        "    - cross-squad-patterns.md",
        "    - cross-squad-patterns.md\n    - chrome-brain.md"
    )
    # Update count
    content = re.sub(
        r"knowledge_bases_count: \d+",
        "knowledge_bases_count: 3",
        content
    )

with open("$SQUAD_YAML", "w") as f:
    f.write(content)

print("OK")
PYEOF
    if [ $? -eq 0 ]; then
      ok "chrome-brain.md added to squad.yaml"
    else
      fail "Failed to update squad.yaml"
    fi
  fi
else
  fail "squad.yaml not found at $SQUAD_YAML"
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 13: Update routing-catalog.md (append Chrome Brain entry if missing)
# ══════════════════════════════════════════════════════════════════════════════

step "Step 13/15 — Updating routing-catalog.md..."

ROUTING_FILE="$SINAPSE_DIR/sinapse/knowledge-base/routing-catalog.md"
if [ -f "$ROUTING_FILE" ]; then
  if grep -q "Chrome Brain (Capability" "$ROUTING_FILE"; then
    ok "Chrome Brain already in routing-catalog.md — skipped"
  else
    cat >> "$ROUTING_FILE" << 'APPEND_EOF'

---

## Chrome Brain (Capability — Cross-Squad)

- **Domain:** Browser automation, site cloning, form filling, web scraping, performance audit, animation extraction, CAPTCHA resolution
- **Type:** Capability (nao squad) — integrada em todas as squads
- **Activation:** Automatica via prompt trigger patterns — nao precisa de comando
- **Tools:** Chrome DevTools MCP (29 tools), dev-browser (Playwright), claude-in-chrome (fallback)
- **Auto-Launch:** Hook PreToolUse roda `chrome-ensure` antes de qualquer tool chrome
- **NSN Mode:** Sempre ativo — 3+ alternativas antes de escalar
- **Session Limits:** Max 15 screenshots, rotacao a cada 12
- **Keywords:** browser, chrome, site, navegar, clonar, preencher, screenshot, lighthouse, scrape, formulario, animacao, DOM, CDP, Three.js, WebGL
- **Full KB:** `~/.sinapse/sinapse/knowledge-base/chrome-brain.md`
APPEND_EOF
    ok "Chrome Brain appended to routing-catalog.md"
  fi
else
  fail "routing-catalog.md not found"
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 14: Update cross-squad-patterns.md (append Browser-Powered Workflow if missing)
# ══════════════════════════════════════════════════════════════════════════════

step "Step 14/15 — Updating cross-squad-patterns.md..."

PATTERNS_FILE="$SINAPSE_DIR/sinapse/knowledge-base/cross-squad-patterns.md"
if [ -f "$PATTERNS_FILE" ]; then
  if grep -q "Browser-Powered Workflow" "$PATTERNS_FILE"; then
    ok "Browser-Powered Workflow already in cross-squad-patterns.md — skipped"
  else
    cat >> "$PATTERNS_FILE" << 'APPEND_EOF'

---

### 8. Browser-Powered Workflow (Chrome Brain)

**When:** Any task that requires interacting with the web browser — navigating sites, cloning pages, filling forms, auditing performance, scraping data, extracting animations.

**Capability:** Chrome Brain (cross-squad, auto-activated)
**Squads envolvidas:** Any — depends on the domain task

**Activation:** Automatic via prompt triggers. No command needed. Chrome auto-launches via PreToolUse hook.

**Sequence:**
```
Phase 1: Connection (automatic)
  Hook PreToolUse → chrome-ensure → Chrome debug on port 9222
  Zero user intervention required

Phase 2: Task Execution
  Chrome Brain executes action (navigate, clone, fill, audit, scrape)
  Tooling selected automatically: CDP > dev-browser > claude-in-chrome

Phase 3: Handoff to Domain Squad
  Results (screenshots, DOM, data) delivered to domain squad
  Domain squad processes with its expertise
  Example: Chrome Brain captures site → animations-orqx recreates

Phase 4: NSN Loop (if barrier)
  If blocked: classify barrier → search web → try 3+ alternatives
  Configure, test, repeat. Max 5 cycles → escalate to user

Phase 5: Auto-Learning
  If new pattern/solution discovered → append to chrome-brain.md Learnings Log
  Knowledge propagates to all agents in next session automatically
```

**Tier Integration:**
| Tier | Squads | Usage Level |
|------|--------|-------------|
| 1 (Heavy) | animations, design, cloning, claude | Every session with browser tasks |
| 2 (Regular) | paidmedia, growth, content, copy | Competitor analysis, auditing |
| 3 (Occasional) | research, cyber, commercial, brand, storytelling | On-demand data extraction |

**Anti-Patterns:**
| Anti-Pattern | Problem | Correct Approach |
|-------------|---------|-----------------|
| Using browser for API-accessible data | Slow, wastes screenshots | Use API/WebFetch when possible |
| Taking screenshot + snapshot of same state | Doubles context size | Choose one per state |
| Exceeding 15 screenshots/session | Risk of 20MB crash | Rotate sessions at 12 |
| Giving up at first error | Misses NSN solutions | Try 3+ alternatives |
| Not logging new patterns | Knowledge lost | Always update Learnings Log |
APPEND_EOF
    ok "Browser-Powered Workflow appended to cross-squad-patterns.md"
  fi
else
  fail "cross-squad-patterns.md not found"
fi

# ══════════════════════════════════════════════════════════════════════════════
# STEP 15: Full Validation
# ══════════════════════════════════════════════════════════════════════════════

step "Step 15/15 — Running full validation..."

echo ""
info "Validating scripts..."

# Check scripts exist and are executable
for script in chrome-ensure chrome-debug chrome-brain-log; do
  SPATH="$HOME/.local/bin/$script"
  if [ -x "$SPATH" ]; then
    ok "$script is executable"
  else
    fail "$script missing or not executable at $SPATH"
  fi
done

info "Validating hooks in settings.json..."

# Check hooks parse as valid JSON
if python3 -c "import json; json.load(open('$HOME/.claude/settings.json'))" 2>/dev/null; then
  ok "~/.claude/settings.json is valid JSON"
else
  fail "~/.claude/settings.json is invalid JSON"
fi

if python3 -c "import json; json.load(open('$SINAPSE_DIR/.claude/settings.json'))" 2>/dev/null; then
  ok "~/.sinapse/.claude/settings.json is valid JSON"
else
  fail "~/.sinapse/.claude/settings.json is invalid JSON"
fi

# Check hooks contain expected matchers
if python3 -c "
import json
s = json.load(open('$HOME/.claude/settings.json'))
h = s.get('hooks', {})
pre = [x['matcher'] for x in h.get('PreToolUse', [])]
post = [x['matcher'] for x in h.get('PostToolUse', [])]
assert 'mcp__chrome-devtools__*' in pre, 'Missing PreToolUse chrome-devtools'
assert 'mcp__claude-in-chrome__*' in pre, 'Missing PreToolUse claude-in-chrome'
assert 'mcp__chrome-devtools__*' in post, 'Missing PostToolUse chrome-devtools'
assert 'mcp__claude-in-chrome__*' in post, 'Missing PostToolUse claude-in-chrome'
print('OK')
" 2>/dev/null; then
  ok "All 4 hook matchers present in ~/.claude/settings.json"
else
  fail "Missing hook matchers in ~/.claude/settings.json"
fi

info "Validating MCP config..."

if python3 -c "
import json
c = json.load(open('$HOME/.claude.json'))
cd = c.get('mcpServers', {}).get('chrome-devtools', {})
assert cd.get('command') == 'npx', 'Missing npx command'
assert 'chrome-devtools-mcp@latest' in cd.get('args', []), 'Missing chrome-devtools-mcp'
print('OK')
" 2>/dev/null; then
  ok "Chrome DevTools MCP configured in ~/.claude.json"
else
  fail "Chrome DevTools MCP not properly configured in ~/.claude.json"
fi

info "Validating autoload rule..."

if [ -f "$SINAPSE_DIR/.claude/rules/chrome-brain-autoload.md" ]; then
  ok "chrome-brain-autoload.md exists"
else
  fail "chrome-brain-autoload.md missing"
fi

info "Validating master KB..."

if [ -f "$SINAPSE_DIR/sinapse/knowledge-base/chrome-brain.md" ]; then
  ok "chrome-brain.md KB exists"
  if grep -q "Learnings Log" "$SINAPSE_DIR/sinapse/knowledge-base/chrome-brain.md"; then
    ok "chrome-brain.md has Learnings Log section"
  else
    fail "chrome-brain.md missing Learnings Log section"
  fi
else
  fail "chrome-brain.md KB missing"
fi

info "Validating squad integration files..."

SQUADS=(
  squad-animations squad-design squad-cloning squad-claude
  squad-paidmedia squad-growth squad-content squad-copy
  squad-research squad-cybersecurity squad-commercial squad-brand squad-storytelling
)

for squad in "${SQUADS[@]}"; do
  IFILE="$SINAPSE_DIR/$squad/knowledge-base/chrome-brain-integration.md"
  if [ -f "$IFILE" ]; then
    ok "$squad/chrome-brain-integration.md"
  else
    fail "$squad/chrome-brain-integration.md missing"
  fi
done

info "Validating sinapse-orqx.md..."

if grep -q "chrome_brain_capability" "$SINAPSE_DIR/sinapse/agents/sinapse-orqx.md" 2>/dev/null; then
  ok "chrome_brain_capability in sinapse-orqx.md"
else
  fail "chrome_brain_capability missing from sinapse-orqx.md"
fi

info "Validating squad.yaml..."

if grep -q "chrome-brain.md" "$SINAPSE_DIR/sinapse/squad.yaml" 2>/dev/null; then
  ok "chrome-brain.md in squad.yaml"
else
  fail "chrome-brain.md missing from squad.yaml"
fi

info "Validating routing-catalog.md..."

if grep -q "Chrome Brain" "$SINAPSE_DIR/sinapse/knowledge-base/routing-catalog.md" 2>/dev/null; then
  ok "Chrome Brain in routing-catalog.md"
else
  fail "Chrome Brain missing from routing-catalog.md"
fi

info "Validating cross-squad-patterns.md..."

if grep -q "Browser-Powered Workflow" "$SINAPSE_DIR/sinapse/knowledge-base/cross-squad-patterns.md" 2>/dev/null; then
  ok "Browser-Powered Workflow in cross-squad-patterns.md"
else
  fail "Browser-Powered Workflow missing from cross-squad-patterns.md"
fi

# ══════════════════════════════════════════════════════════════════════════════
# SUMMARY
# ══════════════════════════════════════════════════════════════════════════════

echo ""
echo -e "${BOLD}══════════════════════════════════════════════════════════════${NC}"
echo -e "${BOLD}  Installation Summary${NC}"
echo -e "${BOLD}══════════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}OK:${NC}   $OK_COUNT"
echo -e "  ${YELLOW}WARN:${NC} $WARN_COUNT"
echo -e "  ${RED}FAIL:${NC} $FAIL_COUNT"
echo ""

if [ "$FAIL_COUNT" -gt 0 ]; then
  echo -e "  ${RED}${BOLD}Chrome Brain installation completed with $FAIL_COUNT failure(s).${NC}"
  echo -e "  ${RED}Review the FAIL items above and re-run after fixing.${NC}"
  echo ""
  exit 1
else
  echo -e "  ${GREEN}${BOLD}Chrome Brain installed successfully!${NC}"
  echo ""
  echo -e "  ${CYAN}What was installed:${NC}"
  echo "    - 3 scripts in ~/.local/bin/ (chrome-ensure, chrome-debug, chrome-brain-log)"
  echo "    - Hooks in ~/.claude/settings.json (PreToolUse + PostToolUse)"
  echo "    - Hooks in ~/.sinapse/.claude/settings.json (standalone)"
  echo "    - Chrome DevTools MCP in ~/.claude.json"
  echo "    - Autoload rule at ~/.sinapse/.claude/rules/chrome-brain-autoload.md"
  echo "    - Master KB at ~/.sinapse/sinapse/knowledge-base/chrome-brain.md"
  echo "    - 13 squad integration files"
  echo "    - Updated sinapse-orqx.md, squad.yaml, routing-catalog.md, cross-squad-patterns.md"
  echo ""
  echo -e "  ${CYAN}To test:${NC}"
  echo "    chrome-debug          # Launch Chrome with debug port"
  echo "    chrome-ensure         # Auto-launch (used by hooks)"
  echo "    chrome-brain-log      # Session logger (used by hooks)"
  echo ""
  exit 0
fi
