# Como contribuir com pull requests

Todas as contribuicoes seguem GitHub Flow e tem `main` como branch de destino.
Nao envie mudancas diretamente para `main` e nao crie tags de release.

## Fluxo

1. Abra ou localize uma issue que descreva o problema.
2. Faca fork de [caioimori/sinapse-ai](https://github.com/caioimori/sinapse-ai).
3. Sincronize seu fork com `origin/main`.
4. Crie uma branch curta, por exemplo `fix/provider-detection` ou
   `docs/install-guide`.
5. Implemente uma mudanca coerente e execute os gates aplicaveis.
6. Envie a branch ao seu fork e abra um PR contra `caioimori/sinapse-ai:main`.
7. Preencha o template, resolva as conversas e aguarde os checks obrigatorios.

## Antes do PR

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run validate:all
```

Mudancas no instalador ou nos providers tambem devem passar paridade e uma
instalacao isolada. Nunca inclua secrets, dados de clientes ou detalhes de uma
vulnerabilidade ainda nao divulgada em issues ou PRs publicos.

## Referencias

- [Guia de contribuicao](../../CONTRIBUTING.md)
- [GitHub Flow](../guides/gitflow.md)
- [Politica de seguranca](../../SECURITY.md)
- [Suporte](../../SUPPORT.md)
