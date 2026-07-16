# Instalacao no Linux

Requisitos: distribuicao x64 ou arm64 mantida, Node.js 18+, npm 9+, Git e pelo
menos uma CLI suportada. Node.js 22 LTS e recomendado.

Na raiz do projeto:

```bash
node --version
npm --version
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

O diretorio do projeto precisa ser gravavel pelo usuario atual. Nao execute o
instalador com `sudo`; corrija a propriedade ou a instalacao de Node/npm.
Consulte a [solucao de problemas](troubleshooting.md).
