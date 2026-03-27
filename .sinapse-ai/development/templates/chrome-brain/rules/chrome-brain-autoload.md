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
