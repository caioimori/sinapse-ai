# Instalação no macOS

Requisitos: macOS suportado em Apple Silicon ou Intel, Node.js 18+, npm 9+, Git
e pelo menos uma CLI suportada. Node.js 22 LTS é recomendado.

Na raiz do projeto:

```bash
node --version
npm --version
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Nenhuma flag de arquitetura é necessária. O padrão configura Claude Code e
Codex. Não use `sudo` para contornar uma instalação incorreta de Node/npm;
corrija a instalação ou a propriedade do projeto. Consulte a
[solução de problemas](troubleshooting.md).
