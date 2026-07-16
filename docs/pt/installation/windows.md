# Instalacao no Windows

Requisitos: Windows 10 ou 11, Node.js 18+, npm 9+, Git e pelo menos uma CLI
suportada. Node.js 22 LTS e recomendado.

Na raiz do projeto, pelo PowerShell:

```powershell
node --version
npm --version
npx sinapse-ai@latest install
```

O padrao configura Claude Code e Codex. Se uma politica bloquear `npx.ps1`, use
`npx.cmd sinapse-ai@latest install` sem enfraquecer a politica global de
execucao.

```powershell
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Caminhos com espacos sao suportados. Consulte a
[solucao de problemas](troubleshooting.md) antes de forcar ou remover arquivos.
