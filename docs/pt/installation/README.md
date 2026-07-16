# Instalacao e Atualizacoes

No diretorio do projeto, use:

```bash
npx sinapse-ai@latest install
```

Sem flags, uma instalacao nova configura Claude Code e Codex. Uma nova execucao
preserva o provider salvo e o conteudo que pertence ao projeto.

```bash
# Restringir deliberadamente
npx sinapse-ai@latest install --llm=claude-code
npx sinapse-ai@latest install --llm=codex

# Trocar a selecao salva
npx sinapse-ai@latest install --reconfigure

# Atualizar e validar
npx sinapse-ai@latest update
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Requisitos: Node.js 18+, npm 9+ e pelo menos uma CLI suportada. Revise o diff
depois de instalar ou atualizar. A documentacao tecnica canonica esta em
[Installation and Updates](../../installation/README.md).

Guias por plataforma: [Windows](windows.md), [macOS](macos.md),
[Linux](linux.md) e [solucao de problemas](troubleshooting.md).
