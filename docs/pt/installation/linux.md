# Instalação no Linux

Requisitos: distribuição x64 ou arm64 mantida, Node.js 18+, npm 9+, Git e pelo
menos uma CLI suportada. Node.js 22 LTS é recomendado.

Na raiz do projeto:

```bash
node --version
npm --version
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

O diretório do projeto precisa ser gravável pelo usuário atual. Não execute o
instalador com `sudo`; corrija a propriedade ou a instalação de Node/npm.
Consulte a [solução de problemas](troubleshooting.md).
