# Instalacao no macOS

Requisitos: macOS suportado em Apple Silicon ou Intel, Node.js 18+, npm 9+, Git
e pelo menos uma CLI suportada. Node.js 22 LTS e recomendado.

Na raiz do projeto:

```bash
node --version
npm --version
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Nenhuma flag de arquitetura e necessaria. O padrao configura Claude Code e
Codex. Nao use `sudo` para contornar uma instalacao incorreta de Node/npm;
corrija a instalacao ou a propriedade do projeto. Consulte a
[solucao de problemas](troubleshooting.md).
