# Instalação com npx

Execute a partir da raiz do projeto:

```bash
npx sinapse-ai@latest install
```

O comando atende projetos novos e existentes. Em uma instalação nova, o padrão
configura Claude Code e Codex. Em novas execuções, a seleção salva e os arquivos
que pertencem ao projeto são preservados.

```bash
# Trocar deliberadamente a seleção de provider
npx sinapse-ai@latest install --reconfigure

# Reproduzir um problema com uma versão exata
npx sinapse-ai@1.27.0 install
```

Use versões exatas somente para diagnóstico ou CI controlado. Para uso normal,
retorne a `@latest`. Consulte [Instalação e atualizações](installation/README.md)
e [Suporte](../../SUPPORT.md).
