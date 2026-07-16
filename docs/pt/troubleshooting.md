# Solução de problemas

O guia mantido está em
[Solução de problemas de instalação](installation/troubleshooting.md).

Comece pela raiz do projeto:

```bash
node --version
npm --version
npm config get registry
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Não use `sudo`, scripts remotos via pipe ou exclusão ampla como primeira
resposta. Preserve o projeto, revise `git status` e envie apenas diagnósticos
sem secrets ou dados privados ao pedir suporte.
