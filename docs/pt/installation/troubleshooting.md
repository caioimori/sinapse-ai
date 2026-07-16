# Solução de Problemas de Instalação

Comece por:

```bash
node --version
npm --version
npm config get registry
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Execute a instalação a partir da raiz do projeto. Para trocar um provider salvo,
use `install --reconfigure`. Para uma instalação parcial, preserve o projeto,
revise `git status` e use `doctor --fix` antes de uma renovação com
`install --force`.

Não use `sudo`, scripts remotos via pipe ou exclusão manual ampla como primeira
resposta. Consulte o [guia canônico](../../installation/troubleshooting.md) e
[SUPPORT.md](../../../SUPPORT.md).
