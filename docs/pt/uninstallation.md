# Desinstalação

Antes de remover a integração, registre as alterações em um commit ou faça
backup do trabalho do projeto. O desinstalador remove artefatos
registrados como gerenciados pelo SINAPSE; ele não é um comando geral de limpeza
do repositório.

Desinstalação interativa:

```bash
npx sinapse-ai@latest uninstall
```

Desinstalação confirmada e não interativa:

```bash
npx sinapse-ai@latest uninstall --yes
```

Depois, revise `git status` e confirme que código da aplicação, stories,
packages, testes, squads customizadas e outros arquivos do projeto permanecem.
Restaure qualquer remoção inesperada pelo seu fluxo normal de versionamento ou
backup antes de fazer novas alterações.

Para instalar novamente:

```bash
npx sinapse-ai@latest install
```

A CLI pública atual não oferece `--complete`, `--keep-data`, remoção seletiva de
componentes nem subcomandos de backup do framework. Não use exemplos históricos
que dependam dessas flags.

Veja também o [guia canônico em inglês](../installation/uninstallation.md) e a
[política de suporte](../../SUPPORT.md).
