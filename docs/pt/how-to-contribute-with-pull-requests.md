# Como contribuir com pull requests

Todas as contribuições seguem GitHub Flow e têm `main` como branch de destino.
Não envie mudanças diretamente para `main` e não crie tags de release.

## Fluxo

1. Abra ou localize uma issue que descreva o problema.
2. Faça fork de [caioimori/sinapse-ai](https://github.com/caioimori/sinapse-ai).
3. Sincronize seu fork com `origin/main`.
4. Crie uma branch curta, por exemplo `dev/fix/provider-detection` ou
   `dev/docs/install-guide`.
5. Implemente uma mudança coerente e execute os gates aplicáveis.
6. Envie a branch ao seu fork e abra um PR contra `caioimori/sinapse-ai:main`.
7. Preencha o template, resolva as conversas e aguarde os checks obrigatórios.

## Antes do PR

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run validate:all
```

Mudanças no instalador ou nos providers também devem passar paridade e uma
instalação isolada. Nunca inclua secrets, dados de clientes ou detalhes de uma
vulnerabilidade ainda não divulgada em issues ou PRs públicos.

## Referências

- [Guia de contribuição](../../CONTRIBUTING.md)
- [GitHub Flow](../guides/gitflow.md)
- [Política de segurança](../../SECURITY.md)
- [Suporte](../../SUPPORT.md)
