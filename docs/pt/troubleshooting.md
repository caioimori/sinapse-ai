# Solucao de problemas

O guia mantido esta em
[Solucao de problemas de instalacao](installation/troubleshooting.md).

Comece pela raiz do projeto:

```bash
node --version
npm --version
npm config get registry
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Nao use `sudo`, scripts remotos via pipe ou exclusao ampla como primeira
resposta. Preserve o projeto, revise `git status` e envie apenas diagnosticos
sem secrets ou dados privados ao pedir suporte.
