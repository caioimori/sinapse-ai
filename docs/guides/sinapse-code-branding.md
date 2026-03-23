# SINAPSE CODE — Branding Customizado para Claude Code

Transforma a identidade visual do Claude Code CLI na marca SINAPSE.

```
 ███████╗██╗███╗   ██╗ █████╗ ██████╗ ███████╗███████╗
 ██╔════╝██║████╗  ██║██╔══██╗██╔══██╗██╔════╝██╔════╝
 ███████╗██║██╔██╗ ██║███████║██████╔╝███████╗█████╗
 ╚════██║██║██║╚██╗██║██╔══██║██╔═══╝ ╚════██║██╔══╝
 ███████║██║██║ ╚████║██║  ██║██║     ███████║███████╗
 ╚══════╝╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝╚═╝     ╚══════╝╚══════╝
```

## O que muda

| Elemento          | Antes (Claude)           | Depois (SINAPSE)         |
|-------------------|--------------------------|--------------------------|
| Nome              | Claude Code              | SINAPSE CODE             |
| Cor principal     | Laranja `rgb(215,119,87)`| Branco `rgb(255,255,255)`|
| Icone             | ✻ (sparkle)              | ◆ (diamond)              |
| Animacao          | ·✢✳✶✻✽                   | ·◇◈◆◆◇                   |
| Mascot (welcome)  | Clawd (bonequinho)       | SINAPSE ASCII art        |
| System prompt     | "You are Claude Code..." | "You are SINAPSE CODE..."|
| 40+ textos de UI  | Claude Code              | SINAPSE CODE             |

---

## Pre-requisitos

1. **Node.js 18+** instalado
2. **Claude Code** instalado globalmente via npm

---

## Passo 1 — Instalar o Claude Code (se ainda nao tem)

```bash
npm install -g @anthropic-ai/claude-code
```

Se voce usa um diretorio global customizado para npm:

```bash
mkdir -p ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.zshrc
source ~/.zshrc
npm install -g @anthropic-ai/claude-code
```

Verifique que funciona:

```bash
claude --version
```

---

## Passo 2 — Aplicar o patch SINAPSE

Coloque o arquivo `sinapse-patch.js` em qualquer pasta e rode:

```bash
node sinapse-patch.js
```

Voce deve ver algo como:

```
CLI encontrado em: /Users/seu-user/.npm-global/lib/node_modules/@anthropic-ai/claude-code/cli.js
Backup criado: ...cli.js.bak

--- Aplicando patch SINAPSE CODE ---

[Cores]
  + dark
  + light
  + dark-daltonized
  + light-daltonized
[Icone]
  + sparkle principal
  + frames macOS
  ...
[Texto]
  + titulo principal
  + border title
  + system prompt
  ...
[Logo]
  + HV6 mascot -> SINAPSE logo
  + dKY fallback -> SINAPSE logo

=== Patch aplicado com sucesso: 48 alteracoes ===
```

---

## Passo 3 — Testar

Feche o terminal completamente e abra novamente. Depois rode:

```bash
claude
```

Voce deve ver:
- Borda do dashboard com " SINAPSE CODE vX.X.X"
- Logo SINAPSE em ASCII art no painel esquerdo
- Icone ◆ no lugar de ✻
- Tudo em branco (#FFF) no lugar do laranja

---

## Reaplicar apos update

Quando o Claude Code atualizar (`npm update -g @anthropic-ai/claude-code`), o patch sera sobrescrito. Basta rodar novamente:

```bash
node sinapse-patch.js
```

O script e idempotente — sempre parte do backup original limpo.

---

## Reverter para o original

Opcao 1 — Restaurar backup:

```bash
# O caminho exato aparece no output do script
cp ~/.npm-global/lib/node_modules/@anthropic-ai/claude-code/cli.js.bak \
   ~/.npm-global/lib/node_modules/@anthropic-ai/claude-code/cli.js
```

Opcao 2 — Reinstalar:

```bash
npm install -g @anthropic-ai/claude-code
```

---

## Automatizar com post-install hook (opcional)

Para reaplicar automaticamente apos cada update, adicione ao seu `~/.zshrc` ou `~/.bashrc`:

```bash
# Reaplicar patch SINAPSE apos update do Claude Code
claude-update() {
  npm update -g @anthropic-ai/claude-code
  node ~/sinapse-patch.js
}
```

Depois use `claude-update` no lugar de `npm update`.

---

## Compatibilidade

- macOS (testado)
- Linux (suportado)
- Windows via WSL ou Git Bash (suportado)
- Funciona com qualquer versao do Claude Code que use a mesma estrutura de cli.js

---

## Estrutura dos arquivos

```
sinapse-code-branding/
  sinapse-patch.js    ← Script principal (unico arquivo necessario)
  TUTORIAL.md         ← Este tutorial
```

---

## Notas tecnicas

- O script modifica o arquivo `cli.js` minificado do pacote npm
- Um backup `.bak` e criado automaticamente na primeira execucao
- O script detecta automaticamente o caminho do Claude Code (npm global, nvm, etc.)
- Nenhuma dependencia externa necessaria — usa apenas Node.js built-in
- Nao altera URLs, nomes de pacotes npm, ou referencias internas de API
