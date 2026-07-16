# Instalação no Windows

Requisitos: Windows 10 ou 11, Node.js 18+, npm 9+, Git e pelo menos uma CLI
suportada. Node.js 22 LTS é recomendado.

Na raiz do projeto, pelo PowerShell:

```powershell
node --version
npm --version
npx sinapse-ai@latest install
```

O padrão configura Claude Code e Codex. Se uma política bloquear `npx.ps1`, use
`npx.cmd sinapse-ai@latest install` sem enfraquecer a política global de
execução.

```powershell
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Caminhos com espaços são suportados. Consulte a
[solução de problemas](troubleshooting.md) antes de forçar ou remover arquivos.
