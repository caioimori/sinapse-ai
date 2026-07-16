# Instalação e Atualizações

No diretório do projeto, use:

```bash
npx sinapse-ai@latest install
```

Sem flags, uma instalação nova configura Claude Code e Codex. Uma nova execução
preserva o provider salvo e o conteúdo que pertence ao projeto.

```bash
# Restringir deliberadamente
npx sinapse-ai@latest install --llm=claude-code
npx sinapse-ai@latest install --llm=codex

# Trocar a seleção salva
npx sinapse-ai@latest install --reconfigure

# Instalar ou atualizar e validar
npx sinapse-ai@latest install
npx sinapse-ai@latest status
npx sinapse-ai@latest doctor
```

Requisitos: Node.js 18+, npm 9+ e pelo menos uma CLI suportada. O instalador é
idempotente e detecta a instalação existente. Revise o diff depois de executar.
A documentação técnica canônica está em
[Installation and Updates](../../installation/README.md).

Guias por plataforma: [Windows](windows.md), [macOS](macos.md),
[Linux](linux.md) e [solução de problemas](troubleshooting.md).
