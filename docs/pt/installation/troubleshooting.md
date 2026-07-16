# Solucao de Problemas de Instalacao

Comece por:

```bash
node --version
npm --version
npm config get registry
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Execute a instalacao a partir da raiz do projeto. Para trocar um provider salvo,
use `install --reconfigure`. Para uma instalacao parcial, preserve o projeto,
revise `git status` e use `doctor --fix` antes de uma renovacao com
`install --force`.

Nao use `sudo`, scripts remotos via pipe ou exclusao manual ampla como primeira
resposta. Consulte o [guia canonico](../../installation/troubleshooting.md) e
[SUPPORT.md](../../../SUPPORT.md).
