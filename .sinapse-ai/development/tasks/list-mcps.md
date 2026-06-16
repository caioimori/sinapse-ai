---
task: list-mcps
responsavel: '@developer'
entrada: 'Nenhuma — lê a configuração do Docker MCP Toolkit'
saida: 'Lista de servidores MCP habilitados, status e ferramentas disponíveis'
atomic_layer: Task
---

# list-mcps

List currently enabled MCP servers and their available tools.

## Purpose

Display all MCP servers configured in Docker MCP Toolkit with their status and tools.

## Usage

```bash
*list-mcps
```

## Output

Shows:

- Server name and status (enabled/disabled)
- Available tools per server
- Connection status

## Implementation

Uses Docker MCP Toolkit CLI:

```bash
docker mcp tools ls
```

## Related

- `*add-mcp` - Add new MCP server
- `*remove-mcp` - Remove MCP server
- `*search-mcp` - Search MCP catalog

## Steps

1. Consultar o toolkit: `docker mcp tools ls`
2. Agrupar ferramentas por servidor
3. Exibir nome, status (enabled/disabled) e conexão de cada servidor
