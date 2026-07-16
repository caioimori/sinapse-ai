# Instalacao com npx

Execute a partir da raiz do projeto:

```bash
npx sinapse-ai@latest install
```

O comando atende projetos novos e existentes. Em uma instalacao nova, o padrao
configura Claude Code e Codex. Em novas execucoes, a selecao salva e os arquivos
que pertencem ao projeto sao preservados.

```bash
# Trocar deliberadamente a selecao de provider
npx sinapse-ai@latest install --reconfigure

# Reproduzir um problema com uma versao exata
npx sinapse-ai@1.27.0 install
```

Use versoes exatas somente para diagnostico ou CI controlado. Para uso normal,
retorne a `@latest`. Consulte [Instalacao e atualizacoes](installation/README.md)
e [Suporte](../../SUPPORT.md).
